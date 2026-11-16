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

Les données de démonstration sont définies dans `src/services/schoolService.ts`. Pour conserver les données, l'application utilise PostgreSQL : configurez `DATABASE_URL` dans `.env.local`, puis appliquez les migrations avec `npm run db:migrate`.

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
npm run user:create -- enseignant@example.org teacher "Nom enseignant" IDENTIFIANT_DU_PROFIL
```

La Directrice peut aussi créer une fiche et le compte de l'enseignant en une seule étape depuis « Ajouter un enseignant ». L'adresse e-mail est facultative; sans e-mail, l'application génère un identifiant `ens-...` et l'affiche après la création. Un mot de passe initial d'au moins 12 caractères est requis. Pour créer un compte à une fiche enseignant existante sans e-mail avec le script, remplacer l'adresse par `-` :

```powershell
$env:SCHOOL_USER_PASSWORD = "un-mot-de-passe-de-12-caracteres-minimum"
npm run user:create -- - teacher "Nom enseignant" IDENTIFIANT_DU_PROFIL
Remove-Item Env:SCHOOL_USER_PASSWORD
```

Les comptes enseignants ne voient que leur classe titulaire ; les autres écrans et toutes les actions administratives sont réservés à la Directrice. Le premier compte Directrice est créé avec la commande d'administration. Une fois connectée, la Directrice peut créer les autres comptes depuis « Créer un compte » dans l'en-tête. Aucune inscription publique n'est disponible.

## Coordination des agents avec Concord MCP

[Concord MCP](https://github.com/get-concord-ai/concord-mcp) est un outil open source externe à l'application. Il permet aux agents de code de partager l'état des tâches, de se transmettre des messages et de signaler les chevauchements avant de modifier les mêmes fichiers. Il n'est pas une dépendance de School Manager et n'est pas nécessaire à son exécution.

### Installation et configuration

Sur une nouvelle machine, l'installation générale documentée par Concord est :

```bash
npm install -g @concord-ai/concord-mcp
cd /chemin/vers/le/depot
concord setup
```

Redémarrez ensuite les sessions des agents de code pour qu'ils chargent le serveur MCP et ses instructions. Consultez le [guide officiel Concord](https://github.com/get-concord-ai/concord-mcp#quick-start) pour les autres clients et méthodes d'installation. Dans l'environnement utilisé pour ce projet, Concord MCP était déjà fourni globalement; aucun paquet Concord ni fichier de configuration propre au dépôt n'a été ajouté. Les instructions d'agent du projet précisent de ne pas exécuter `concord setup` dans ce dépôt.

### Utilisation dans ce projet

Le flux utilisé pour coordonner les agents est le suivant :

1. `start_work` déclare l'objectif et les fichiers prévus avant une modification, puis signale les chevauchements.
2. `inspect_work` consulte l'état du workspace ou d'une tâche.
3. `update_work` consigne l'avancement ou transmet un message à un autre agent.
4. `transfer_work` sert à attribuer, libérer ou transmettre une tâche.
5. `finish_work` enregistre le résultat, les fichiers touchés et les vérifications effectuées.

Depuis la racine du dépôt, le CLI peut afficher les tâches et leur compte rendu :

```powershell
concord --repo C:\school-manager status
concord --repo C:\school-manager tasks
concord --repo C:\school-manager handoff teacher-login-identifier-20261114
```

Exemple réel : la tâche `teacher-login-identifier-20261114` a été marquée terminée dans le workspace Concord de `C:\school-manager`. La commande `concord --repo C:\school-manager handoff teacher-login-identifier-20261114` affiche le résumé et la liste de fichiers enregistrés. Le compte rendu indique également qu'aucun test ni build n'a été exécuté pour cette tâche.

Concord conserve cet état dans son workspace local ou global selon la configuration de la machine. Il ne s'affiche donc pas nécessairement dans GitHub et n'est pas publié avec le code par défaut. Le dépôt de l'outil et ses instructions complètes sont disponibles sur [GitHub](https://github.com/get-concord-ai/concord-mcp).

## Déploiement

L'application peut être déployée sur une plateforme compatible avec Next.js. Construire avec `npm run build`, puis lancer avec `npm run start` ou configurer la plateforme pour exécuter les scripts Next.js correspondants.
