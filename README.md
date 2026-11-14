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

Un fichier `.env.local` est nécessaire pour connecter PostgreSQL et l'authentification. Les fichiers d'environnement sont ignorés par Git ; ne publiez jamais de secrets dans le dépôt. Sans base ni compte configurés, l'application n'est pas accessible en mode démo.

### Comptes et accès

L'accès à l'application nécessite PostgreSQL, `DATABASE_URL` et `AUTH_SECRET`. Placez `DATABASE_URL` dans `.env.local` ; les scripts CLI chargent ce fichier automatiquement. Après avoir configuré la base, appliquez les migrations avec `npm run db:migrate`, puis créez le compte initial de direction :

```bash
npx auth secret
# Copier la valeur générée dans AUTH_SECRET, puis définir le mot de passe dans l'environnement du terminal :
npm run user:create -- direction@example.org director "Direction"
```

`SCHOOL_USER_PASSWORD` doit être défini dans l'environnement avant la commande et contenir au moins 12 caractères. Pour un compte enseignant, fournir aussi l'identifiant de son profil enseignant comme dernier argument :

```bash
npm run user:create -- enseignant@example.org teacher "Nom enseignant" <teacherId>
```

Les comptes enseignants ne voient que leur classe titulaire ; les autres écrans et toutes les actions administratives sont réservés à la Directrice. Le premier compte Directrice est créé avec la commande d'administration. Une fois connectée, la Directrice peut créer les autres comptes depuis « Créer un compte » dans l'en-tête. Aucune inscription publique n'est disponible.

## Déploiement

L'application peut être déployée sur une plateforme compatible avec Next.js. Construire avec `npm run build`, puis lancer avec `npm run start` ou configurer la plateforme pour exécuter les scripts Next.js correspondants.
