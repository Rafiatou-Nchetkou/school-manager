# Gestion scolaire

Application web de gestion d'une école primaire, construite avec Next.js et React. L'interface est en français et propose un tableau de bord ainsi que des écrans de suivi des élèves, des enseignants, des classes et des finances.

## Fonctionnalités

- Tableau de bord : effectifs, répartition des élèves, recettes et résultats d'examens.
- Élèves : liste filtrable et paginée, inscription d'un élève et suivi des frais.
- Enseignants : liste filtrable, ajout d'un enseignant et affectation aux classes.
- Classes : effectifs, enseignant titulaire et accès aux élèves de chaque classe.
- Finances : montants attendus, payés et soldes par élève.
- Personnel : état de mise en place imprimable ou exportable en PDF depuis le navigateur.

## Prérequis

- Node.js compatible avec Next.js 16.
- npm (un `package-lock.json` est fourni).

## Installation et lancement

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # Démarrer le serveur de développement
npm run lint    # Exécuter ESLint
npm run build   # Compiler l'application pour la production
npm run start   # Démarrer la version compilée
```

Pour tester le mode production :

```bash
npm run build
npm run start
```

## Structure principale

```text
src/
  app/          Routes et pages Next.js
  components/   Composants d'interface et de navigation
  services/     Accès aux données de démonstration
  types/        Types TypeScript du domaine
```

## Données et configuration

Les données actuelles sont des exemples définis dans `src/services/schoolService.ts`. Il n'y a pas encore de base de données configurée : les ajouts et affectations ne constituent pas une persistance de production.

Aucun fichier `.env` n'est requis pour lancer la version actuelle. Les fichiers d'environnement sont ignorés par Git ; ne publiez jamais de secrets dans le dépôt.

## Déploiement

L'application peut être déployée sur une plateforme compatible avec Next.js. Construire avec `npm run build`, puis lancer avec `npm run start` ou configurer la plateforme pour exécuter les scripts Next.js correspondants.
