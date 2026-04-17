# Checklist Securite — Avant tout deploiement

A verifier AVANT chaque mise en production. Pas de raccourci.

## Secrets

- [ ] **Aucun mot de passe dans le code source** — grep -r "password" sur tout le repo
- [ ] **Aucune cle API dans le code source** — grep -r "key.*=.*['\"]" sur les .py, .ts, .js
- [ ] **Aucun secret dans l'historique git** — Si un secret a ete commit, le considerer comme compromis et le changer
- [ ] **.env n'est PAS dans git** — Verifier .gitignore
- [ ] **.env.example est a jour** — Toutes les variables necessaires y sont listees
- [ ] **Secrets definis dans l'env de prod** — Supabase secrets, GitHub secrets, systemd env, etc.
- [ ] **Variables d'env validees au demarrage** — L'app crash avec un message clair si une variable manque

## Authentification

- [ ] **Mots de passe hashses** — Jamais stockes en clair (Supabase Auth fait ca)
- [ ] **Sessions expirent** — JWT a duree limitee, refresh token en place
- [ ] **Logout fonctionne** — Le token est invalide cote serveur apres deconnexion
- [ ] **Roles verifies cote serveur** — RLS ou middleware, pas juste cote client

## Base de donnees

- [ ] **Row Level Security activee** — Sur TOUTES les tables avec donnees utilisateur
- [ ] **Service role key uniquement cote serveur** — Jamais dans le frontend
- [ ] **Anon key dans le frontend** — Seule cle autorisee cote client
- [ ] **Foreign keys avec ON DELETE explicite** — RESTRICT ou CASCADE, jamais SET NULL par defaut
- [ ] **Backups actives** — Point-in-time recovery ou dump regulier

## Infrastructure

- [ ] **HTTPS partout** — Pas de HTTP en prod, redirection forcee
- [ ] **Headers de securite** — X-Frame-Options, X-Content-Type-Options, CSP
- [ ] **Firewall configure** — Seuls les ports necessaires sont ouverts (22, 80, 443)
- [ ] **SSH par cle** — Pas de login par mot de passe SSH
- [ ] **Updates systeme** — unattended-upgrades active ou cron de mise a jour

## Application

- [ ] **Erreurs non exposees** — Les messages d'erreur en prod ne montrent pas de stack trace
- [ ] **Rate limiting** — Sur les endpoints sensibles (login, envoi email)
- [ ] **CORS configure** — Pas de wildcard `*` en prod, domaines explicites
- [ ] **Input valide** — Toutes les entrees utilisateur sont verifiees avant traitement
- [ ] **Logs actifs** — Les erreurs sont loggees quelque part (fichier, service)

## Emails

- [ ] **SPF/DKIM/DMARC configures** — Pour le domaine d'envoi
- [ ] **Pas de double envoi** — Mecanisme de dedup (timestamp, flag, idempotency key)
- [ ] **Adresse d'envoi verifiee** — Le service d'email (Resend, Gmail) accepte le From

## Avant de deployer

- [ ] **CI passe** — Tous les checks sont verts
- [ ] **Migration testee** — Le SQL a ete execute sur un env de test
- [ ] **Rollback possible** — On sait comment revenir en arriere si ca casse
- [ ] **Quelqu'un d'autre a relu** — Code review ou pair programming

---

*Checklist v1.0 — 2026-04-17*
