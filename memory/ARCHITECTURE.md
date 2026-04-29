# Architecture — Project Launcher

**Stack:** HTML / CSS / JavaScript vanilla (no build step, no framework)
**Hosting:** GitHub Pages (deploy automatique sur push main via GitHub Actions)
**Source directory:** `src/`

## Structure

```
src/
  index.html        ← Landing page publique (marketing)
  app.html          ← Wizard d'onboarding (7 étapes)
  styles/
    main.css        ← Design system complet (variables, composants)
  js/
    main.js         ← Navigation entre étapes, state global
    onboarding.js   ← Questionnaire guidé + voice input (Whisper)
    github.js       ← GitHub API (vérif token, création repo)
    generator.js    ← Génération scaffolding + push vers GitHub
```

## Pages

### Landing (index.html)
Page publique. Présente le produit. Pas d'état, pas de JS complexe.
CTA → app.html

### Wizard (app.html)
7 étapes :
1. Prérequis
2. Questionnaire guidé (voice ou texte)
3. Connexion GitHub (PAT)
4. Récap + customisation modèles agents
5. Génération (push scaffolding via GitHub API)
6. Setup routines (instructions + redirect claude.ai/code/routines)
7. Confirmation

## GitHub API

Utilisée côté navigateur avec le Personal Access Token de l'utilisateur.
Opérations : GET /user (vérif), POST /user/repos (création repo), PUT /repos/.../contents/... (push fichiers).
Le token n'est jamais stocké — in-memory uniquement.

## Génération de scaffolding

Les templates agents et memory sont inlinés dans generator.js.
L'injection de contexte se fait via remplacement de variables `{{PLACEHOLDER}}`.
Jamais généré from scratch — toujours copié depuis template + injecté.

## Build & Test

```bash
# Serveur local (Python)
python3 -m http.server 8000 --directory src/

# Ou avec Node
npx serve src/

# Déploiement
git push origin main  # GitHub Actions deploy automatique
```

## Conventions

- Pas de framework, pas de build step
- CSS variables pour tout (couleurs, radius, font)
- JS vanilla ES6+ (modules natifs non utilisés pour compatibilité GitHub Pages)
- Nommage : kebab-case pour les fichiers, camelCase pour les fonctions JS
- Branch : feature/YYYYMMDD-<slug>
- Commit : feat: / fix: / ci: / docs: / refactor:
