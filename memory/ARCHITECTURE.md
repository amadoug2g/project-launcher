# Architecture — Project Launcher

## Vision

Un outil qui permet à n'importe qui de lancer un projet logiciel en le décrivant — et de le suivre jusqu'à la publication, sans jamais toucher à du code.

**Principe fondateur : GitHub = base de données. Claude Code = équipe de dev.**
Zéro backend, zéro base de données, zéro infrastructure à gérer.

---

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    Navigateur (client-side)                  │
│                                                             │
│  index.html      app.html         dashboard.html            │
│  (landing)       (wizard)         (suivi + mise à jour)     │
│      │               │                    │                 │
│      └───────────────┴────────────────────┘                 │
│                       │                                     │
│              GitHub API (PAT en mémoire)                    │
└───────────────────────┼─────────────────────────────────────┘
                        │
        ┌───────────────┴──────────────────┐
        │              GitHub              │
        │                                  │
        │  [outil]              [projets]  │
        │  project-launcher     user/mon-projet
        │  ├── src/             ├── .claude/agents/
        │  ├── templates/       ├── memory/
        │  └── scripts/         ├── src/   (le vrai code)
        │                       └── .github/workflows/
        └───────────────┬──────────────────┘
                        │
        ┌───────────────┴──────────────────┐
        │          Claude Code             │
        │          (cloud routines)        │
        │                                  │
        │  Weekly Manager (lundi)          │
        │  └── lit memory/ → planifie      │
        │                                  │
        │  Daily Dev Loop (weekdays)       │
        │  ├── coder → implémente          │
        │  └── reviewer → valide + merge   │
        └──────────────────────────────────┘
```

---

## Couches

### 1. Interface utilisateur (src/)

| Fichier | Rôle |
|---------|------|
| `src/index.html` | Landing page publique — présente le produit, CTA vers wizard |
| `src/app.html` | Wizard 6 étapes — crée le projet, push le scaffolding |
| `src/dashboard.html` | Dashboard — liste les projets, suit les sprints, édite les objectifs |
| `src/styles/main.css` | Design system (dark, minimaliste) |
| `src/js/main.js` | Navigation, état global |
| `src/js/onboarding.js` | Questionnaire guidé + voice input Whisper |
| `src/js/github.js` | GitHub API (auth, création repo) |
| `src/js/generator.js` | Génération scaffolding + push |
| `src/js/dashboard.js` | Lecture memory/ des projets, édition objectifs *(sprint 2)* |

**Hébergement :** GitHub Pages — déploiement automatique sur push main.

---

### 2. Données (GitHub repos)

**Chaque projet créé = 1 repo GitHub** avec cette structure :

```
[user]/[projet]/
├── .claude/
│   └── agents/
│       ├── manager.md     ← stratège hebdo
│       ├── coder.md       ← dev quotidien
│       ├── reviewer.md    ← validateur + PR
│       └── retro-bot.md   ← rétrospective
│
├── memory/                ← TOUTE la mémoire du projet
│   ├── DAILY_GOAL.md      ← objectif du jour (lu par coder)
│   ├── CODER_SUMMARY.md   ← résumé session coder
│   ├── REVIEWER_FEEDBACK.md
│   ├── SESSION_LOG.md     ← historique complet
│   ├── LESSONS_LEARNED.md
│   ├── ROADMAP.md         ← features + milestones
│   ├── SPRINT_CURRENT.md  ← sprint actif
│   ├── ARCHITECTURE.md    ← description tech du projet
│   └── sprints/           ← archives sprints + retros
│
├── .github/
│   └── workflows/
│       └── release.yml    ← CI/CD publication
│
├── CLAUDE.md              ← contexte projet pour agents
├── PRODUCT.md             ← contexte produit + audience
├── DESIGN.md              ← langage visuel (si front)
└── src/                   ← code du projet
```

**Détection :** Un repo est un projet project-launcher si `.claude/agents/manager.md` existe.
**Accès :** GitHub API (PAT) — lecture et écriture depuis le navigateur.
**Persistance :** Rien n'est supprimé. Les sprints s'archivent dans `memory/sprints/`.

---

### 3. Exécution (Claude Code routines)

Deux routines par projet, configurées manuellement sur `claude.ai/code/routines` :

| Routine | Schedule | Modèle | Rôle |
|---------|----------|--------|------|
| Weekly Manager | Chaque lundi | Opus | Lit SESSION_LOG, évalue sprint, nettoie branches, écrit DAILY_GOAL |
| Daily Dev Loop | Weekdays | Sonnet | Lance coder → implémente. Lance reviewer → valide, merge, supprime branche |

**Les routines lisent et écrivent uniquement dans `memory/` et le code source du projet.**
**Pas d'accès à d'autres repos, pas d'accès à l'outil lui-même.**

---

### 4. Templates (templates/)

Fichiers sources que le générateur copie + injecte lors de la création d'un projet.
Jamais générés from scratch — toujours copiés depuis templates/ avec substitution `{{VARIABLE}}`.

```
templates/
├── agents/        ← manager.md, coder.md, reviewer.md, retro-bot.md
├── memory/        ← ROADMAP.md, ARCHITECTURE.md, SESSION_LOG.md, etc.
└── CLAUDE.md
```

---

## Flux utilisateur

```
Landing → Wizard → GitHub Auth → Génération repo → Setup routines → Dashboard

         [Une fois]                                  [Recurring]
         Setup en 5 min                              Agents tournent seuls
                                                     jusqu'à la publication

                                    ↕ Dashboard
                                    L'user suit la progression
                                    et met à jour les objectifs
                                    sans toucher au code
```

---

## Ce qui n'existe pas (intentionnellement)

- Pas de backend / API server
- Pas de base de données centrale
- Pas de compte utilisateur sur project-launcher (GitHub = l'identité)
- Pas d'accès aux repos de l'utilisateur sauf ceux créés par l'outil
- Pas de stockage du PAT GitHub (in-memory uniquement)

---

## Roadmap technique

| Sprint | Fonctionnalité |
|--------|---------------|
| Sprint 1 (→ 10 mai) | Landing + wizard poli + routines fonctionnelles |
| Sprint 2 | Dashboard — liste projets, sprint status, édition objectifs |
| Sprint 3 | Amélioration génération — PRODUCT.md + DESIGN.md auto, Impeccable intégré |
| Sprint 4 | Notifications email post-run (via GitHub Actions ou webhook) |
| Sprint 5 | Multi-stack (web, mobile, API, CLI) — templates spécialisés |

## Stack

- **Frontend :** HTML / CSS / JavaScript vanilla (no build step)
- **Auth :** GitHub Personal Access Token (in-memory)
- **Storage :** GitHub repos via GitHub Contents API
- **Hosting :** GitHub Pages
- **Execution :** Claude Code cloud routines
- **Design system :** Impeccable (7 pillars, DESIGN.md, PRODUCT.md)
- **CI/CD :** GitHub Actions (deploy.yml sur push main)

## Build & Test

```bash
python3 -m http.server 8000 --directory src/   # local dev
git push origin main                            # déclenche deploy GitHub Pages
```
