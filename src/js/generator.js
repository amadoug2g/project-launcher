// ---- Project Generator ----
// Builds the scaffolding from templates and pushes to GitHub.
// Never generates agent files from scratch — always copies templates and injects context.

// ---- Recap ----

function populateRecap() {
  const d = state.projectData;
  const container = document.getElementById('recap-content');

  container.innerHTML = `
    <div class="recap-block">
      <strong>Project</strong>
      <p>${escapeHtml(d.name)}</p>
    </div>
    <div class="recap-block">
      <strong>Problem</strong>
      <p>${escapeHtml(d.problem)}</p>
    </div>
    <div class="recap-block">
      <strong>Description</strong>
      <p>${escapeHtml(d.description)}</p>
    </div>
    <div class="recap-block">
      <strong>Audience</strong>
      <p>${escapeHtml(d.audience)}</p>
    </div>
    <div class="recap-block">
      <strong>v1 Features</strong>
      <p>${d.features.map(f => escapeHtml(f)).join('<br>')}</p>
    </div>
    <div class="recap-block">
      <strong>Stack</strong>
      <p>${escapeHtml(d.stack)}</p>
    </div>
    <div class="recap-block">
      <strong>Deadline</strong>
      <p>${formatDate(d.deadline)}</p>
    </div>
  `;

  // Pre-fill repo name
  const repoInput = document.getElementById('repo-name');
  if (repoInput && !repoInput.value) {
    repoInput.value = d.repoName;
  }
}

// ---- Generation ----

async function generateProject() {
  // Read final values
  state.projectData.repoName = document.getElementById('repo-name').value.trim() || state.projectData.repoName;
  state.projectData.models.manager = document.getElementById('model-manager').value;
  state.projectData.models.coder = document.getElementById('model-coder').value;
  state.projectData.models.reviewer = document.getElementById('model-reviewer').value;

  if (!state.projectData.repoName) {
    alert('Please enter a repo name.');
    return;
  }

  goToStep('generating');

  try {
    await runGenerationSteps();
    setupRoutinesView();
    goToStep('routines');
  } catch (err) {
    const errorEl = document.getElementById('generation-error');
    errorEl.textContent = `Error: ${err.message}`;
    errorEl.style.display = 'block';
    setGenStep(getActiveGenStep(), 'error');
  }
}

let activeGenStep = 1;

function getActiveGenStep() { return activeGenStep; }

function setGenStep(n, status) {
  const el = document.getElementById(`gen-${n}`);
  if (!el) return;
  const icon = el.querySelector('.gen-icon');
  el.classList.remove('active', 'done');

  if (status === 'active') {
    el.classList.add('active');
    icon.textContent = '●';
  } else if (status === 'done') {
    el.classList.add('done');
    icon.textContent = '✓';
  } else if (status === 'error') {
    icon.textContent = '✗';
    el.style.color = 'var(--error)';
  }
  activeGenStep = n;
}

async function runGenerationSteps() {
  const { token, username } = state.github;
  const d = state.projectData;
  const repoName = d.repoName;
  const fullName = `${username}/${repoName}`;
  state.projectData.repoFullName = fullName;

  // Step 1 — Create repo
  setGenStep(1, 'active');
  await githubRequest('POST', '/user/repos', token, {
    name: repoName,
    description: d.description,
    private: false,
    auto_init: false,
  });
  setGenStep(1, 'done');

  // Step 2 — Agent files
  setGenStep(2, 'active');
  await pushFile(fullName, '.claude/agents/manager.md', renderAgentTemplate('manager', d));
  await pushFile(fullName, '.claude/agents/coder.md', renderAgentTemplate('coder', d));
  await pushFile(fullName, '.claude/agents/reviewer.md', renderAgentTemplate('reviewer', d));
  await pushFile(fullName, '.claude/agents/retro-bot.md', renderAgentTemplate('retro-bot', d));
  setGenStep(2, 'done');

  // Step 3 — Memory files
  setGenStep(3, 'active');
  await pushFile(fullName, 'memory/DAILY_GOAL.md', renderMemoryTemplate('DAILY_GOAL', d));
  await pushFile(fullName, 'memory/CODER_SUMMARY.md', renderMemoryTemplate('CODER_SUMMARY', d));
  await pushFile(fullName, 'memory/REVIEWER_FEEDBACK.md', renderMemoryTemplate('REVIEWER_FEEDBACK', d));
  await pushFile(fullName, 'memory/SESSION_LOG.md', renderMemoryTemplate('SESSION_LOG', d));
  await pushFile(fullName, 'memory/LESSONS_LEARNED.md', renderMemoryTemplate('LESSONS_LEARNED', d));
  await pushFile(fullName, 'memory/SPRINT_CURRENT.md', renderMemoryTemplate('SPRINT_CURRENT', d));
  setGenStep(3, 'done');

  // Step 4 — Roadmap + Architecture
  setGenStep(4, 'active');
  await pushFile(fullName, 'memory/ROADMAP.md', renderRoadmap(d));
  await pushFile(fullName, 'memory/ARCHITECTURE.md', renderArchitecture(d));
  await pushFile(fullName, 'CLAUDE.md', renderProjectClaude(d));
  setGenStep(4, 'done');

  // Step 5 — GitHub Actions
  setGenStep(5, 'active');
  await pushFile(fullName, '.github/workflows/release.yml', getReleaseCITemplate());
  setGenStep(5, 'done');
}

async function pushFile(repoFullName, path, content) {
  const encoded = btoa(unescape(encodeURIComponent(content)));
  await githubRequest('PUT', `/repos/${repoFullName}/contents/${path}`, state.github.token, {
    message: `chore: scaffold ${path}`,
    content: encoded,
  });
}

// ---- Template renderers ----
// Inject project-specific data into base templates (never generate from scratch)

function injectVars(template, d) {
  const today = new Date().toISOString().split('T')[0];
  const repoOwner = state.github.username;

  return template
    .replace(/\{\{PROJECT_NAME\}\}/g, d.name)
    .replace(/\{\{PROJECT_DEADLINE\}\}/g, d.deadline)
    .replace(/\{\{PROJECT_DESCRIPTION\}\}/g, d.description)
    .replace(/\{\{PROJECT_STACK\}\}/g, d.stack)
    .replace(/\{\{REPO_OWNER\}\}/g, repoOwner)
    .replace(/\{\{REPO_NAME\}\}/g, d.repoName)
    .replace(/\{\{MANAGER_MODEL\}\}/g, d.models.manager)
    .replace(/\{\{CODER_MODEL\}\}/g, d.models.coder)
    .replace(/\{\{REVIEWER_MODEL\}\}/g, d.models.reviewer)
    .replace(/\{\{RETRO_MODEL\}\}/g, d.models.reviewer)
    .replace(/\{\{PROJECT_START_DATE\}\}/g, today);
}

function renderAgentTemplate(name, d) {
  // Templates are loaded from the /templates/agents/ directory in the project-launcher repo itself.
  // For the generated project, we inject context into the base templates.
  // (In production, these would be fetched from the templates/ directory via GitHub API)
  return injectVars(AGENT_TEMPLATES[name] || '', d);
}

function renderMemoryTemplate(name, d) {
  return injectVars(MEMORY_TEMPLATES[name] || '', d);
}

function renderRoadmap(d) {
  const features = d.features.map(f => `- [ ] ${f}`).join('\n');
  const deadlineDate = new Date(d.deadline);
  const mid = new Date((new Date().getTime() + deadlineDate.getTime()) / 2);
  const midStr = mid.toISOString().split('T')[0];

  return `# Roadmap — ${d.name}

**Deadline:** ${d.deadline}
**Goal:** ${d.description}

---

## v1.0 — Must ship by deadline

${features}

## Out of scope for v1.0

- Advanced features (to be defined after v1 feedback)

---

## Milestones

| Date | Milestone |
|------|-----------|
| ${midStr} | Core features functional (internal) |
| ${d.deadline} | v1.0 published |
`;
}

function renderArchitecture(d) {
  return `# Architecture — ${d.name}

**Stack:** ${d.stack}
**Platform:** (to be detailed by manager on first run)

## Overview

${d.description}

## Audience

${d.audience}

## Build & Test Commands

(To be filled in by the manager agent on first run based on project stack)

\`\`\`bash
# Run tests
# TODO

# Build for production
# TODO

# Run locally
# TODO
\`\`\`

## Conventions

- Branch naming: \`feature/YYYYMMDD-<slug>\`
- Commit prefix: feat: / fix: / ci: / docs: / refactor: / test:
- Max 1 objective per coder session
- Never commit directly to main
`;
}

function renderProjectClaude(d) {
  const features = d.features.map(f => `- ${f}`).join('\n');
  return `# ${d.name} — Claude Code Context

**Deadline:** ${d.deadline}

## What this is

${d.description}

## Problem

${d.problem}

## Audience

${d.audience}

## Stack

${d.stack}

## v1.0 Features

${features}

## Development Workflow

Two routines manage this project autonomously:
- **Weekly Manager** (every Monday): reviews progress, sets DAILY_GOAL.md, manages sprints, cleans branches
- **Daily Dev Loop** (weekdays): coder implements DAILY_GOAL, reviewer validates, PR merged

## Branch Rules

- Never commit to main directly
- Branch format: \`feature/YYYYMMDD-<slug>\`
- Reviewer deletes branch after merge
- Manager cleans stale branches every Monday
- Max 2 open branches at any time

## Agent Models

- Manager: ${d.models.manager}
- Coder: ${d.models.coder}
- Reviewer: ${d.models.reviewer}
`;
}

function getReleaseCITemplate() {
  return `name: Release

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      version:
        description: 'Version number (e.g. 1.0.0)'
        required: true

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: \${{ github.ref_name || format('v{0}', github.event.inputs.version) }}
          name: v\${{ github.event.inputs.version || github.ref_name }}
          body: |
            ## What's new
            See CHANGELOG.md for details.
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
}

// ---- Routine setup view ----

function setupRoutinesView() {
  const d = state.projectData;
  const repo = state.projectData.repoFullName;

  document.getElementById('routine-1-name').textContent = `${d.name} | Weekly Manager`;
  document.getElementById('routine-1-repo').textContent = repo;
  document.getElementById('routine-1-instructions').textContent =
    `Launch the "manager" subagent.\n\nIt reads memory/SESSION_LOG.md from the past week, evaluates progress against the roadmap, cleans up merged branches, and writes memory/DAILY_GOAL.md with the next priority.`;

  document.getElementById('routine-2-name').textContent = `${d.name} | Daily Dev Loop`;
  document.getElementById('routine-2-repo').textContent = repo;
  document.getElementById('routine-2-instructions').textContent =
    `Launch the "coder" subagent.\n\nIt reads memory/DAILY_GOAL.md and implements the day's objective. Then launch the "reviewer" subagent.\nIt reads memory/CODER_SUMMARY.md and validates the code (max 3 iterations). If approved, it opens a PR, merges it, and deletes the branch.`;

  // Done screen
  const nextMonday = getNextMonday();
  document.getElementById('done-next-run').textContent =
    `Next run: Monday ${nextMonday} at 11:00 AM (manager). Then daily from Tuesday.`;
  document.getElementById('done-repo-link').href = `https://github.com/${repo}`;
}

// ---- Helpers ----

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getNextMonday() {
  const d = new Date();
  const day = d.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---- Agent & memory templates (inlined for static hosting) ----
// These mirror the files in /templates/ of this repo.

const AGENT_TEMPLATES = {
  'manager': `---
name: manager
description: Weekly project strategist. Runs every Monday. Reviews last week, updates DAILY_GOAL.md, manages sprints, cleans stale branches. Does NOT touch source code.
---

# Weekly Manager — {{PROJECT_NAME}}

**Deadline:** {{PROJECT_DEADLINE}}
**Repo:** {{REPO_OWNER}}/{{REPO_NAME}}
**Model:** {{MANAGER_MODEL}}

## Role

You are the weekly strategist. You run every Monday. Keep the project on track toward the deadline by reviewing last week and setting one clear goal for the coming week. Never write or modify source code.

## Step 1 — Review last week

Read: \`memory/SESSION_LOG.md\`, \`memory/SPRINT_CURRENT.md\`, \`memory/LESSONS_LEARNED.md\`, \`memory/REVIEWER_FEEDBACK.md\`

## Step 2 — Branch cleanup

1. List all branches via git or GitHub API
2. Delete any merged feature branches
3. Flag any branch open >7 days without a PR
4. Log cleanup in SESSION_LOG.md

Rule: Never leave more than 2 open branches (main + at most 1 feature branch).

## Step 3 — Sprint decision

Check \`memory/SPRINT_CURRENT.md\`:
- All items checked → close sprint, run retro-bot subagent, start new sprint
- Otherwise → continue, update priorities

Archive to \`memory/sprints/sprint-YYYY-MM-DD.md\` when closing.

## Step 4 — Write DAILY_GOAL.md

Write ONE goal:

\`\`\`
# Daily Goal — [DATE]

## Context
[Where we are, sprint status, deadline countdown]

## Objective
[One clear, actionable task]

## Success Criteria
[How the coder knows it's done]

## Priority Justification
[Why this, why now]

## Branch
feature/[DATE_SLUG]-[OBJECTIVE_SLUG]
\`\`\`

Hard rule: one objective per entry.

## Step 5 — Commit

\`\`\`bash
git add memory/
git commit -m "chore(memory): weekly planning — [DATE]"
git push origin main
\`\`\`

## Constraints

- Read-only on source code
- If deadline within 7 days: focus on distribution (release, landing page, polish)
- Log every action in SESSION_LOG.md
`,

  'coder': `---
name: coder
description: Daily implementer. Reads DAILY_GOAL.md, creates a feature branch, implements the objective, writes CODER_SUMMARY.md. Never commits directly to main.
---

# Coder — {{PROJECT_NAME}}

**Repo:** {{REPO_OWNER}}/{{REPO_NAME}}
**Stack:** {{PROJECT_STACK}}
**Model:** {{CODER_MODEL}}

## Step 1 — Load context

1. \`memory/DAILY_GOAL.md\` (primary)
2. \`memory/SPRINT_CURRENT.md\`
3. \`memory/ARCHITECTURE.md\`
4. \`memory/REVIEWER_FEEDBACK.md\` (takes priority if non-empty)

## Step 2 — Branch

\`\`\`bash
git checkout main && git pull origin main
\`\`\`
Use branch name from DAILY_GOAL.md. Never commit to main.

## Step 3 — Implement

Read files before modifying. Stay focused on the single objective. Run tests, fix failures before committing.

## Step 4 — Commit

\`\`\`bash
git add <specific files>
git commit -m "feat: [what was done]"
git push origin <branch>
\`\`\`

## Step 5 — Write CODER_SUMMARY.md (exactly 5 lines)

\`\`\`
Objective: [goal]
Changes: [files modified and why]
Tests: [pass/fail or N/A]
Blockers: [issues or None]
Branch: [branch name]
\`\`\`

## Constraints

- Never commit to main directly
- Never commit secrets or .env files
- If objective already complete: advance to next backlog item
`,

  'reviewer': `---
name: reviewer
description: Validates coder's work. Reads CODER_SUMMARY.md, runs tests, reviews code. Approves and merges PR or sends feedback back (max 3 iterations). Always deletes branch after merge.
---

# Reviewer — {{PROJECT_NAME}}

**Repo:** {{REPO_OWNER}}/{{REPO_NAME}}
**Model:** {{REVIEWER_MODEL}}

## Step 1 — Load context

Read: \`memory/CODER_SUMMARY.md\`, \`memory/SPRINT_CURRENT.md\`, recent commits on feature branch.

## Step 2 — Run tests independently

Run test command from ARCHITECTURE.md. Record pass/fail counts. Never approve with failing tests.

## Step 3 — Review

Evaluate: functional correctness, sprint alignment, test coverage, code quality, security.

## Decision

**Approve (LGTM)**:
1. Update SESSION_LOG.md and SPRINT_CURRENT.md
2. Commit memory files to feature branch
3. Create PR and merge (squash):
   \`\`\`bash
   gh pr create --title "[objective]" --base main
   gh pr merge --squash --delete-branch
   \`\`\`
4. Delete the feature branch — always:
   \`\`\`bash
   git push origin --delete <branch>
   git branch -d <branch>
   \`\`\`

**Block**: Write specific feedback (file + line) to REVIEWER_FEEDBACK.md. Max 3 iterations.

## Constraints

- Never modify source code
- Always delete branch after merge
- Log every decision in SESSION_LOG.md
`,

  'retro-bot': `---
name: retro-bot
description: Sprint retrospective. Called by manager at end of sprint. Writes retro doc, updates LESSONS_LEARNED. Does not plan next sprint.
---

# Retro Bot — {{PROJECT_NAME}}

**Repo:** {{REPO_OWNER}}/{{REPO_NAME}}
**Model:** {{RETRO_MODEL}}

## Step 1 — Read sprint data

\`memory/SPRINT_CURRENT.md\`, \`memory/SESSION_LOG.md\`, \`memory/LESSONS_LEARNED.md\`

## Step 2 — Write retrospective

Save to \`memory/sprints/retro-[SPRINT_ID].md\`:

\`\`\`
# Sprint Retrospective — [SPRINT_ID]
Date: [DATE]

## What we shipped
## What we planned but didn't ship
## Velocity
## What went well
## What slowed us down
## One change for next sprint
\`\`\`

## Step 3 — Update LESSONS_LEARNED.md

Add non-obvious patterns. No duplicates.

## Step 4 — Commit

\`\`\`bash
git add memory/sprints/retro-[SPRINT_ID].md memory/LESSONS_LEARNED.md
git commit -m "chore(retro): sprint [SPRINT_ID]"
git push origin main
\`\`\`

## Constraints

- Read-only on source code
- Do not write DAILY_GOAL.md or SPRINT_CURRENT.md
`
};

const MEMORY_TEMPLATES = {
  'DAILY_GOAL': `# Daily Goal

_Initialized by project-launcher. The manager agent will write the first goal on the first Monday after setup._
`,
  'CODER_SUMMARY': `# Coder Summary

_Written by the coder agent after each session._

Objective: —
Changes: —
Tests: —
Blockers: —
Branch: —
`,
  'REVIEWER_FEEDBACK': `# Reviewer Feedback

_Written by the reviewer agent when blocking issues are found. Empty = no issues._
`,
  'SESSION_LOG': `# Session Log

## Project start

- Date: {{PROJECT_START_DATE}}
- Repo: {{REPO_OWNER}}/{{REPO_NAME}}
- Deadline: {{PROJECT_DEADLINE}}
- Setup: scaffolding generated by project-launcher
`,
  'LESSONS_LEARNED': `# Lessons Learned

_Accumulated by coder, reviewer, and retro-bot._

---

_No lessons yet. First entry after sprint 1._
`,
  'SPRINT_CURRENT': `# Current Sprint

_Created by manager agent._

## Sprint 1

**Start:** {{PROJECT_START_DATE}}
**End:** (set by manager on first run)

## Objectives

_The manager will populate this on the first Monday run._

## Definition of Done

- All objectives checked
- Tests passing
- PR merged to main
- Branch deleted
`,
};
