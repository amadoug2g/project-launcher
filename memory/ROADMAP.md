# Roadmap — Project Launcher

**Deadline Sprint 1:** 10 mai 2026
**Goal:** Publier une version polished et partageable — landing page + wizard fonctionnel, prêt pour de vrais utilisateurs

---

## Sprint 1 — v0.1 (29 avril → 10 mai 2026)

### Landing page
- [x] Hero section : valeur en 1 phrase + CTA clair — 29/04
- [x] Section "Comment ça marche" : 3 étapes visuelles — 29/04
- [x] Section features : ce que ça fait, pour qui — 29/04
- [x] Section prérequis : GitHub + Claude (et rien d'autre) — 29/04
- [x] Footer : lien repo GitHub, licence — 29/04

### Wizard (onboarding)
- [x] Landing séparée du wizard (src/app.html) — 29/04
- [ ] Design poli sur chaque étape (dark, clean, typographie soignée)
- [ ] Questions conversationnelles bien formulées (1 à la fois)
- [ ] Voice input Whisper fonctionnel
- [ ] Étape routines : instructions step-by-step + redirect claude.ai/code/routines
- [ ] Barre de progression génération (5 étapes visibles)

### Infra
- [x] GitHub Pages déployé et fonctionnel — 29/04
- [x] CI/CD deploy sur push main — 29/04
- [ ] Impeccable /audit passé sur toutes les pages UI

---

## v0.2 — Dashboard (sprint 2)

**Auth :** PAT GitHub (même flow que wizard — in-memory, jamais stocké)
**Architecture :** 100% client-side, GitHub API depuis le navigateur

- [ ] `src/dashboard.html` — page dashboard
- [ ] Détection auto des projets project-launcher dans les repos GitHub de l'user
- [ ] Vue par projet : sprint actif, objectif du jour, % avancement, deadline countdown
- [ ] Édition DAILY_GOAL.md et ROADMAP.md depuis le dashboard (sans IDE)
- [ ] Historique SESSION_LOG.md consultable
- [ ] Distinction projets actifs / terminés
- [ ] CTA fin du wizard → dashboard

---

## v1.0 — Auth OAuth + améliorations (sprint 3+)

- **GitHub OAuth** (flux propre sans PAT — nécessite un petit backend ou service proxy pour l'échange de token)
- Amélioration génération : PRODUCT.md + DESIGN.md auto-générés depuis les réponses du wizard
- Impeccable intégré dans les projets générés
- Notifications email post-run (via GitHub Actions webhook)
- Support multi-stack (templates web, mobile, API, CLI)

---

## Hors scope définitif

- Création automatique de routines Claude Code via API (impossible, doit se faire manuellement sur claude.ai)
- Backend lourd / base de données centrale
- Compte utilisateur propre à project-launcher (GitHub = l'identité)
