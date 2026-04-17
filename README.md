# Project Launcher — Framework de lancement de projets

Une methodologie structuree pour lancer, gerer et livrer des projets tech. Concu pour etre utilise par n'importe qui, meme sans background technique.

## Pourquoi ce framework ?

Lancer un projet c'est pas juste coder. C'est :
- Savoir quoi faire et dans quel ordre
- Ne rien oublier (securite, docs, CI/CD, secrets)
- Garder une trace de ce qui a ete fait et pourquoi
- Apprendre de ses erreurs sprint apres sprint

Ce repo est la boite a outils. Chaque fichier est un template pret a l'emploi.

## Comment l'utiliser

### 1. Nouveau projet ? Commence ici
Ouvre **[CHECKLIST_NEW_PROJECT.md](CHECKLIST_NEW_PROJECT.md)** et suis chaque etape. C'est ta checklist de demarrage.

### 2. Avant de deployer
Ouvre **[CHECKLIST_SECURITY.md](CHECKLIST_SECURITY.md)** et verifie chaque point. Pas de raccourci.

### 3. Chaque semaine : un sprint
Copie **[SPRINT_TEMPLATE.md](SPRINT_TEMPLATE.md)** dans ton repo projet (ex: `SPRINTS.md`). Remplis-le au fil de la semaine.

### 4. A la fin du sprint : retrospective
Copie **[RETROSPECTIVE_TEMPLATE.md](RETROSPECTIVE_TEMPLATE.md)** et fais le bilan avec ton equipe (ou tout seul, ca marche aussi).

## Structure

```
project-launcher/
├── README.md                    # Ce fichier
├── SPRINT_TEMPLATE.md           # Template pour documenter un sprint
├── RETROSPECTIVE_TEMPLATE.md    # Template pour les retros
├── CHECKLIST_NEW_PROJECT.md     # Checklist demarrage projet
└── CHECKLIST_SECURITY.md        # Checklist securite pre-deploiement
```

## Principes

1. **Ecris tout.** Si c'est pas ecrit, ca n'existe pas. Decisions, bugs, lecons — tout va dans un fichier.
2. **Sprints courts.** Une semaine max. Objectifs clairs, resultats mesurables.
3. **Securite d'abord.** Pas de secrets dans le code. Pas de deploiement sans checklist.
4. **Simplicite.** Le framework le plus simple qui fonctionne. Pas de tooling inutile.
5. **Iteration.** Le framework s'ameliore a chaque sprint, comme le produit.

## Origine

Cree par Les Pilotes a partir du projet Skill Tracker (suivi de competences pour jeunes en formation). Le framework a ete extrait et generalise pour etre reutilisable sur n'importe quel projet.

---

*Derniere mise a jour : 2026-04-17*
