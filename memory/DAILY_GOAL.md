# Daily Goal — 30 avril 2026

## Context

Sprint 1, jour 2. Hier : landing page créée (src/index.html) + wizard déplacé (src/app.html). PR #1 mergée sur main. GitHub Pages déployé.

Restant du sprint : polish du wizard (design, questions, UX), voice input Whisper, étape routines avec redirect claude.ai/code/routines, Impeccable audit.

## Objective

Revoir et polir le wizard `src/app.html` — en particulier les étapes 2 (questionnaire) et 6 (setup routines).

Étape 2 — questions conversationnelles :
- Une question par écran, animation fade-in propre
- Labels courts et directs (référence DESIGN.md UX Writing)
- Bouton retour discret, bouton suivant proéminent

Étape 6 — setup routines :
- Instructions step-by-step claires pour un non-technique
- Lien direct vers claude.ai/code/routines (nouvelle URL)
- Instructions de chaque routine affichées avec bouton "Copier"
- Mention des limites de plans (Pro 5/jour, Max 15/jour, Team 25/jour)

Design global : référence DESIGN.md. Utiliser /impeccable audit après chaque section.

## Success Criteria

- Étape 2 : transitions fluides, une question à la fois, labels clairs
- Étape 6 : un non-technique peut configurer les routines en suivant les instructions sans aide
- /impeccable audit sans blocants majeurs sur ces deux étapes

## Priority Justification

Le wizard est le cœur du produit. Si l'étape 2 est confuse ou l'étape 6 floue, l'utilisateur abandonne. Ce sont les deux étapes les plus critiques pour la conversion.

## Branch

feature/20260430-wizard-polish
