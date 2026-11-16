# Périmètre de la première version en production

Ce document est un cadrage initial basé sur les écrans et les flux présents dans le dépôt. Les règles indiquées comme « à confirmer » demandent une validation de la direction de l’école avant implémentation.

## MVP proposé

- Dossiers d’élèves et inscriptions/réinscriptions par année scolaire.
- Niveaux, classes et affectation des enseignants titulaires.
- Suivi des frais et paiements avec reçus et historique des opérations.
- Rapports essentiels : effectifs, inscriptions, soldes et encaissements.
- Comptes utilisateurs avec exactement deux rôles initiaux : Directrice et Enseignant.

Les notes, résultats d’examens, transferts et états imprimables déjà amorcés sont inclus lorsque leurs règles et leur source de données sont fiabilisées. Les fonctions de démonstration ne constituent pas des données de production.

## Rôles initiaux

| Rôle | Permissions proposées |
| --- | --- |
| Directrice | Accès complet : configuration, dossiers, inscriptions, classes, enseignants, finances, rapports et gestion des comptes |
| Enseignant | Consultation de sa classe titulaire et de son effectif ; aucune liste nominative ni saisie de notes n’est exposée dans cette première tranche |

L’accès ultérieur à la liste nominative des élèves, aux résultats, à la modification de notes après validation et à d’autres données personnelles devra être autorisé explicitement. Aucun rôle distinct de secrétariat ou de comptabilité n’est prévu pour le moment.

## Règles métier à confirmer

1. Un élève garde un dossier permanent ; chaque année scolaire crée une inscription distincte.
2. Un seul enregistrement d’inscription est permis par élève et par année scolaire.
3. Une inscription référence une classe et une année scolaire cohérentes.
4. Le matricule est unique selon une règle de génération à valider (permanent ou renouvelé chaque année).
5. Les versements sont des opérations datées et historisées. Les annulations/corrections ne suppriment pas la trace initiale.
6. Un dossier incomplet est signalé et ne bloque l’inscription que si la direction le décide.
7. Les transferts précisent leur sens, leur date et les informations d’origine/destination applicables.
8. Les notes, résultats d’examens et périodes évaluées suivent les règles de l’établissement.

## Critères d’acceptation du MVP

- Les parcours d’inscription, réinscription, affectation et paiement enregistrent des données persistantes en PostgreSQL.
- Les contraintes de base empêchent les doublons d’inscription et de matricule selon les règles validées.
- Chaque action sensible vérifie l’identité et le rôle côté serveur.
- Les soldes et rapports sont calculés depuis les inscriptions et opérations persistées.
- Une sauvegarde de production peut être restaurée et les migrations sont reproductibles.
- Les parcours critiques sont validés en préproduction avec des données de test, sans dépendance aux tableaux mémoire de démonstration.
