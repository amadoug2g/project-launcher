# Daily Goal — 29 avril 2026

## Context

Premier run. Sprint 1 vient de démarrer. L'objectif du sprint est d'avoir une version publiable d'ici le 10 mai. Actuellement, src/index.html contient le wizard (7 étapes) mais pas de landing page séparée. Le design est fonctionnel mais pas au niveau attendu.

## Objective

Créer `src/index.html` comme landing page publique du produit (remplace l'actuel), et déplacer le wizard dans `src/app.html`.

La landing page doit contenir :
- Hero : headline percutante + sous-titre + bouton "Commencer" → /app.html
- Section "Comment ça marche" : 3 étapes illustrées (décrire → GitHub → lancer)
- Section features : 3-4 bénéfices clés pour l'utilisateur non-technique
- Section prérequis : ce qu'il faut avoir (compte GitHub, compte Claude)
- Footer : lien GitHub repo, mention open source

Design : dark, minimaliste, Linear-style. Référence : DESIGN.md. Utiliser /impeccable shape avant de commencer, /impeccable audit après.

## Success Criteria

- `src/index.html` est une landing page (pas un wizard)
- `src/app.html` contient le wizard actuel (déplacé, pas réécrit)
- La landing page affiche proprement sur desktop et mobile
- Bouton CTA redirige vers app.html
- GitHub Pages déploie les deux pages sans erreur

## Priority Justification

C'est la première impression. Un utilisateur non-technique doit comprendre en 10 secondes ce que ça fait et avoir envie de cliquer. Sans landing page soignée, le produit n'est pas partageable.

## Branch

feature/20260429-landing-page
