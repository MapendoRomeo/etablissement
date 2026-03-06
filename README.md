# 🎓 CS ÉTOILE MUGUNGA – Frontend (Système de Gestion des Paiements)

Interface web du système de gestion des paiements scolaires développée pour le **service comptable de l’école CS Étoile de Mugunga**.

Cette application permet de gérer les **élèves, les paiements scolaires et les statistiques financières** via une interface moderne et simple à utiliser.

⚠️ Ce dépôt contient **uniquement le frontend** de l'application.  
Le **backend est disponible dans un dépôt séparé**.

---

# 🚀 Aperçu

Le système permet au comptable de l’école de :

- Consulter la **liste des élèves**
- Enregistrer les **paiements scolaires**
- Suivre les **paiements par trimestre**
- Identifier les **paiements en attente**
- Consulter des **statistiques financières**
- Gérer les informations liées à l’année scolaire

---

# 🛠️ Technologies utilisées

- React
- TypeScript
- Vite
- TailwindCSS
- Axios

---

# ⚙️ Installation du projet

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/MapendoRomeo/etablissement
```

### 2️⃣ Accéder au dossier du projet

```bash
cd etablissement
```

### 3️⃣ Installer les dépendances

```bash
npm install
```

### 4️⃣ Lancer le serveur de développement

```bash
npm run dev
```

L'application sera disponible sur :

```
http://localhost:5173
```

---

# 🔗 Connexion au Backend

Cette application communique avec un **backend API développé séparément**.

Avant de lancer le projet, assurez-vous que :

- le **backend est démarré**
- l’URL de l’API est correctement configurée dans les services frontend.

Exemple de configuration :

```ts
const API_URL = "http://localhost:5000/api";
```

---

# 📁 Structure du projet

```
src/
│
├── api/          # configuration des appels API
├── components/   # composants réutilisables de l’interface
├── contexts/     # context React pour la gestion de l’état global
├── hooks/        # hooks personnalisés
├── lib/          # librairies ou configurations partagées
├── pages/        # pages principales de l’application
├── services/     # logique des appels au backend
├── types/        # types TypeScript
└── utils/        # fonctions utilitaires
```

---

# 📊 Fonctionnalités principales

### 👨‍🎓 Gestion des élèves
- Consultation des élèves
- Organisation par classe

### 💰 Gestion des paiements
- Enregistrement des paiements
- Suivi des paiements par trimestre
- Vérification des paiements restants

### 📈 Tableau de bord
- Statistiques générales
- Vue globale des paiements

---

# 🎯 Objectif du projet

Ce projet a été développé pour :

- **digitaliser la gestion comptable de l’école**
- faciliter le **suivi des paiements scolaires**
- réduire les **erreurs liées à la gestion papier**
- améliorer l’**organisation administrative**

---

# 👨‍💻 Auteur

**Mapendo Rubuga Roméo**

Développeur Full Stack  
React • Node.js • TypeScript  

📍 Goma, RDC

---

# 📌 Statut du projet

✅ Frontend fonctionnel  
✅ Backend disponible dans ce dépôt : https://github.com/MapendoRomeo/backend_etablissement