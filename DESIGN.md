# Design Language — Project Launcher

## Aesthetic direction

Dark, minimal, purposeful. Think: a tool made by someone who cares about craft. Not a SaaS dashboard. Not a landing page. Something in between — closer to a focused productivity tool.

Reference energy: Linear, Raycast, Vercel. Clean surfaces, high contrast text, micro-interactions that confirm actions without being distracting.

## Typography

- Primary: Inter or system-ui (clean, legible, neutral)
- Monospace: JetBrains Mono or Fira Code (code blocks, repo names, config)
- Scale: restrained — 3-4 sizes max. Large headings are intentional, not decorative.
- Weight: 400 for body, 600 for headings and labels, 700 only for CTAs

## Color

- Background: near-black (#0a0a0a), not pure black
- Surface: dark grey (#141414) for cards and panels
- Borders: subtle (#2a2a2a) — present but not dominant
- Text primary: off-white (#f0f0f0)
- Text secondary: mid grey (#888)
- Accent: muted purple-blue (#7c6af7) — used sparingly, only for CTAs and active states
- Success: soft green (#4ade80)
- Error: soft red (#f87171)

**Anti-patterns to avoid:**
- No gradients unless they serve a clear purpose
- No bright purple (generic AI look)
- No low-contrast text
- No decorative color splashes

## Spacing

- Base unit: 8px
- Generous padding inside cards (20-24px)
- Breathing room between sections (40-48px)
- Never cramped. White space is intentional.

## Layout

- Single column, centered, max-width 640px
- One idea per screen — the wizard model
- No sidebars, no grids in the main flow

## Motion

- Subtle fade-in on step transitions (opacity + slight translateY)
- No bounce, no overshoot
- Prefer `ease` or custom cubic-bezier, never linear
- Respect `prefers-reduced-motion`

## Interaction

- Buttons: clear visual states (default, hover, active, disabled)
- Inputs: focus ring using accent color, no box-shadow glow effects
- Progress: a thin line at the top, not a percentage number
- Loading: inline spinner or step-by-step progress list, never a blank screen

## UX Writing

- Headings: short, declarative. "Connect GitHub" not "Please connect your GitHub account below"
- Hints: one sentence max, below the input
- Error messages: say what happened and what to do. "Invalid token — check the scope is set to repo."
- CTAs: verb-first, specific. "Create project" not "Submit". "My routines are active" not "Next"
- No exclamation marks. No "Amazing!", no "You're all set! 🎉"

## Component rules

- Cards: 1px border, 10px radius, dark surface — no shadow
- Buttons: no shadow, no gradient, solid fill
- No nested cards
- Tooltips/panels: appear inline, not floating — less disorienting for non-technical users

## Anti-patterns (Impeccable reference)

- No purple/blue gradients
- No hero images or stock photos
- No overuse of rounded corners (everything rounded = nothing highlighted)
- No generic icon sets as visual fillers
- No "glass morphism" or blur effects
- No animated backgrounds
