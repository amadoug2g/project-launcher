# Coder Summary

_Written by the coder agent after each session._

Objective: Create src/index.html as a dedicated marketing landing page and move the wizard to src/app.html (already existed from a prior commit).
Changes: src/index.html replaced with a full landing page (hero, how it works x3, features x4, prerequisites, footer) using shared main.css CSS variables and inline landing-specific styles. src/js/main.js updated: removed 'landing' from STEPS array, changed initial currentStep to 'onboarding', guarded initOnboarding() call so it only runs when step-onboarding exists in the DOM (i.e. in app.html, not index.html).
Tests: N/A — no automated tests. Manual check confirmed no broken step IDs: step-onboarding, step-github, step-recap, step-generating, step-routines, step-done all match STEPS array in main.js.
Blockers: git push returned 403 on all attempts (git protocol and GitHub Contents API via MCP). The CCR session proxy does not allow git-receive-pack (push). Commits are local on branch feature/20260429-landing-page. The reviewer or operator will need to push manually or via a session with write access.
Branch: feature/20260429-landing-page
