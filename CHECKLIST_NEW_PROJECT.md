# Checklist — Demarrage d'un nouveau projet

A suivre dans l'ordre. Ne pas sauter d'etapes.

## 1. Cadrage

- [ ] **Objectif defini** — En une phrase : a quoi sert ce projet ? Pour qui ?
- [ ] **Scope V1** — Liste des fonctionnalites minimum pour une premiere version utilisable
- [ ] **Stack choisie** — Frontend, backend, BDD, hosting, email, auth
- [ ] **Contraintes identifiees** — Budget, deadline, equipe, competences dispo

## 2. Repository

- [ ] **Repo cree** (GitHub/GitLab)
- [ ] **README.md** — Description, stack, instructions de lancement local
- [ ] **.gitignore** — Adapte a la stack (node_modules, .env, __pycache__, etc.)
- [ ] **.env.example** — Toutes les variables d'env documentees avec des valeurs placeholder
- [ ] **Structure de dossiers** — Coherente, documentee dans le README

## 3. Base de donnees

- [ ] **Schema initial** — Migration numerotee (001_schema.sql)
- [ ] **Row Level Security** — Activee sur toutes les tables avec donnees utilisateur
- [ ] **Foreign keys** — Toutes les relations ont des FK avec ON DELETE explicite
- [ ] **Seed data** — Script ou instructions pour les donnees de test

## 4. Authentification

- [ ] **Auth provider configure** (Supabase Auth, Auth0, etc.)
- [ ] **Roles definis** — Qui peut faire quoi (manager, stagiaire, admin, etc.)
- [ ] **Guard sur les redirections** — Verifier que toutes les valeurs existent avant redirect
- [ ] **Gestion session** — Refresh token, expiration, deconnexion propre

## 5. Secrets et securite

- [ ] **Aucun secret dans le code** — Tout vient de variables d'env
- [ ] **Secrets stockes** — Gestionnaire de secrets (Supabase secrets, GitHub secrets, etc.)
- [ ] **Checklist securite passee** — Voir CHECKLIST_SECURITY.md
- [ ] **Env vars validees au demarrage** — Crash explicite si variable manquante

## 6. CI/CD

- [ ] **Pipeline CI** — Au minimum : lint, scan secrets, validation configs
- [ ] **Branche protegee** — main/master requiert une PR approuvee
- [ ] **Tests** — Au moins un test de smoke (l'app demarre sans crash)
- [ ] **Deploiement** — Procedure documentee (manuelle OK en V1, automatique en V2)

## 7. Documentation

- [ ] **README complet** — Un nouveau dev peut lancer le projet en 10 min
- [ ] **SPRINTS.md** — Historique des sprints (copier SPRINT_TEMPLATE.md)
- [ ] **LESSONS.md** — Lecons apprises sprint par sprint
- [ ] **Config serveur** — Si deploiement sur VPS : nginx.conf, systemd service, etc.

## 8. Premier sprint

- [ ] **Sprint 1 planifie** — Objectif, taches, deadline
- [ ] **Board cree** — GitHub Projects, Notion, ou simple fichier markdown
- [ ] **Premiere retro planifiee** — Date fixee pour la fin du sprint

---

*Checklist v1.0 — 2026-04-17*
