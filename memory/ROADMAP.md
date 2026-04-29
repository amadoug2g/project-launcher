# Roadmap — Project Launcher

**Deadline Sprint 1:** 10 mai 2026
**Goal:** Publier une version polished et partageable — landing page + wizard fonctionnel, prêt pour de vrais utilisateurs

---

## Sprint 1 — v0.1 (29 avril → 10 mai 2026)

### Landing page (priorité absolue)
- [ ] Hero section : valeur en 1 phrase + CTA clair
- [ ] Section "Comment ça marche" : 3 étapes visuelles
- [ ] Section features : ce que ça fait, pour qui
- [ ] Section prérequis : GitHub + Claude (et rien d'autre)
- [ ] Footer : lien repo GitHub, licence

### Wizard (onboarding)
- [ ] Design poli sur chaque étape (dark, clean, typographie soignée)
- [ ] Questions conversationnelles bien formulées (1 à la fois)
- [ ] Voice input Whisper fonctionnel
- [ ] Étape GitHub : instructions claires + lien direct token
- [ ] Étape routines : instructions step-by-step + redirect vers claude.ai/code/routines
- [ ] Barre de progression génération (5 étapes visibles)

### Infra
- [ ] Landing page = src/index.html (page publique)
- [ ] Wizard = src/app.html (lié depuis la landing)
- [ ] GitHub Pages déployé et fonctionnel
- [ ] Impeccable /audit passé sur toutes les pages UI

---

## Sprint 2 — v0.2 (à définir par le manager après sprint 1)

- Onboarding amélioré (feedback utilisateurs réels)
- Support multi-stack (web, mobile, API, CLI)
- Notifications email post-run
- Amélioration génération (PRODUCT.md + DESIGN.md auto-générés)
- Intégration Impeccable dans les projets générés

---

## Out of scope v0.1

- Authentification OAuth GitHub (token manuel pour l'instant)
- Création automatique de routines via API (impossible actuellement)
- Dashboard de suivi de projet
- Notifications email/SMS
