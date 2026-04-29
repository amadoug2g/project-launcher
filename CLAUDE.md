# Project Launcher — Claude Code Context

## What this is

A web application hosted on GitHub Pages that lets anyone launch an AI-driven development project without technical knowledge.

The user describes their project, sets a deadline and target features. The app generates a complete GitHub repo with pre-configured Claude Code agents and routines that run autonomously until the product ships.

## Target User

Non-technical or semi-technical users who want to build a software product. They have a GitHub account and a Claude account, but may not know how to set up AI agents.

## Stack

- Pure HTML/CSS/JavaScript (no build step, no framework)
- GitHub API (browser-side, using Personal Access Token or device flow OAuth)
- OpenAI Whisper API (voice input during onboarding)
- GitHub Pages for hosting

## User Journey (7 steps)

1. Landing — value prop + prerequisites + what will happen
2. Guided onboarding — conversational questionnaire (voice or text) to extract project description, features, deadline
3. GitHub connection — PAT input or device flow OAuth
4. Recap + customization — review generated config, adjust agent models, repo name
5. Generation — scaffolding pushed to GitHub (copy templates, inject context)
6. Routine setup — step-by-step guide to activate 2 routines in Claude Code
7. Done — confirmation, next run preview, optional email notifications

## Generated Project Structure

Every project created by this tool gets:

```
.claude/
  agents/
    manager.md     ← weekly strategist (Opus model)
    coder.md       ← daily implementer (Sonnet model)
    reviewer.md    ← validator + PR opener (Sonnet model)
    retro-bot.md   ← sprint retrospective (called by manager)

memory/
  DAILY_GOAL.md
  CODER_SUMMARY.md
  REVIEWER_FEEDBACK.md
  SESSION_LOG.md
  LESSONS_LEARNED.md
  ROADMAP.md
  SPRINT_CURRENT.md
  ARCHITECTURE.md
  sprints/

.github/
  workflows/
    release.yml

CLAUDE.md
Makefile (if applicable)
```

## Branch Management Rules (critical — baked into all agents)

- Reviewer always deletes the feature branch after merge
- Manager checks for stale branches every Monday and cleans up merged ones
- Max 2 open branches at any time (feature + main)
- Branch naming: `feature/YYYYMMDD-<slug>`

## Agent Model Defaults (user can override at step 4)

| Agent | Default Model |
|-------|--------------|
| manager | claude-opus-4-6 |
| coder | claude-sonnet-4-6 |
| reviewer | claude-sonnet-4-6 |
| retro-bot | claude-sonnet-4-6 |

## Development Workflow

Routine 1 — Weekly Manager: every Monday
Routine 2 — Daily Dev Loop: every weekday

The manager writes DAILY_GOAL.md. The coder reads it, implements, writes CODER_SUMMARY.md. The reviewer reads it, validates, merges or sends back to coder (max 3 iterations).

## Key Constraints

- Never generate agent files from scratch — copy from templates/ and inject context
- Never store GitHub tokens — keep in memory only
- Keep the UI simple: one question at a time, voice input supported
- Design matters: clean, calm, confidence-inspiring
