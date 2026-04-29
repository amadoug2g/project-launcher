# Lessons Learned

_Accumulated by coder, reviewer, and retro-bot. Each entry should be non-obvious and actionable._

---

## 2026-04-29 — CCR coder sessions do not have git push access

In Anthropic Cloud Runner (CCR) coder sessions, the git proxy returns 403 for all write operations (git-receive-pack / push). The same restriction applies to the GitHub Contents API via MCP tools. Only read (fetch/clone) works. Workaround: the reviewer session or the manager session (which appears to have push access based on prior commits) must perform the push. The coder should commit locally and document the blocker in CODER_SUMMARY.md.

## 2026-04-29 — Splitting wizard from landing page: guard initOnboarding() by DOM presence

When splitting a single-page wizard app into landing + wizard pages sharing the same JS, never call wizard-specific init functions (like initOnboarding()) unconditionally. Check that the target DOM element exists first: `if (document.getElementById('step-onboarding'))`. Similarly, update the STEPS array to remove any step IDs that only existed in the old combined page (in this case 'landing' was removed since index.html is now a static page with no .step elements).
