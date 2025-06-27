
# CS ÉTOILE MUGUNGA - Système de gestion scolaire

## Configuration de l'environnement

### Variables d'environnement Supabase

L'application est configurée avec les identifiants Supabase suivants:

```
VITE_SUPABASE_URL=https://nnmylgnlaalvoulwfeyt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubXlsZ25sYWFsdm91bHdmZXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDUxNTcsImV4cCI6MjA1ODcyMTE1N30.EDwj-gvqm7CQFbWzK-lQ-_rkcYj-kig87_EysLBedCs
```

### Structure de la base de données

⚠️ **IMPORTANT**: Pour que l'application fonctionne correctement, vous **DEVEZ** créer les tables nécessaires dans votre projet Supabase en suivant ces étapes:

1. Connectez-vous à votre projet Supabase (https://app.supabase.com)
2. Allez dans la section "SQL Editor"
3. Créez une nouvelle requête
4. Copiez-collez tout le contenu du fichier `schema.sql` de ce projet
5. Exécutez la requête (cliquez sur "Run")
6. Une fois les tables créées, vous pouvez ajouter des données de test en exécutant la requête d'insertion fournie

Sans ces étapes, l'application affichera une erreur de connexion car les tables nécessaires n'existent pas encore.

### Démarrage du projet

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

## Fonctionnalités

- Gestion des élèves
- Suivi des paiements
- Configuration de l'année scolaire
- Gestion des utilisateurs
- Tableau de bord avec statistiques
