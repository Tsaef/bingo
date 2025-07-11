# Projet Bingo

Ce projet est une application Bingo développée sous forme de monorepo, comprenant deux sous-dossiers principaux :

- **bingo-backend/** : le backend de l'application, construit avec Express.js et PostgreSQL. Il gère la logique métier, la gestion des grilles de bingo, l'API REST et la persistance des données.
- **bingo-frontend/** : le frontend, développé avec Next.js et TypeScript. Il permet aux utilisateurs de créer, visualiser et jouer sur des grilles de bingo via une interface web moderne.

## Principe du projet
L'application permet de générer des grilles de bingo personnalisées, de sauvegarder leur état et de les partager. Chaque grille est composée de cellules, et chaque cellule peut contenir un texte personnalisé. L'utilisateur peut créer une nouvelle grille, la remplir, puis la partager ou la rejouer.

## Utilisation

### 1. Installation des dépendances
Dans chaque dossier (bingo-backend et bingo-frontend), exécutez :
```bash
npm install
```

### 2. Lancement du backend
Configurez la base de données PostgreSQL et le fichier `.env` (voir bingo-backend/README.md pour les détails), puis lancez le serveur :
```bash
npm run dev
```
Le backend sera accessible sur [http://localhost:3001](http://localhost:3001).

### 3. Lancement du frontend
Dans le dossier bingo-frontend :
```bash
npm run dev
```
Le frontend sera accessible sur [http://localhost:3000](http://localhost:3000).

## Fonctionnalités principales
- Création et gestion de grilles de bingo
- API REST pour interagir avec les grilles
- Interface utilisateur moderne et réactive
- Persistance des données via PostgreSQL

## Structure du monorepo
- **bingo-backend/** : code source du serveur, modèles, contrôleurs, routes, scripts de migration
- **bingo-frontend/** : code source du client web, composants React, pages, services

Pour plus de détails sur chaque partie, consultez les README respectifs dans chaque dossier.
