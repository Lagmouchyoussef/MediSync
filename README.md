# 🏥 MediSync - Système de Gestion Clinique

MediSync est une plateforme de gestion clinique de haute fidélité, conçue pour simplifier les interactions entre médecins et patients. Développée avec une architecture moderne et une esthétique "glassmorphic" premium, elle offre une gestion des rendez-vous en temps réel, des notifications par email automatisées et un suivi complet de la santé.

---

## 🚀 Présentation : De A à Z

### 1. Le Portail Patient
Les patients peuvent s'inscrire, gérer leur profil médical et prendre rendez-vous. L'interface propose :
- **Suivi d'Activité Santé** : Historique visuel des événements médicaux.
- **Gestion des Rendez-vous** : Planification en temps réel avec mise à jour automatique des statuts.
- **Design Moderne** : Une interface fluide, propre et réactive.

### 2. Le Tableau de Bord Docteur
Les médecins disposent d'un "Centre de Commandement Clinique" pour gérer leur cabinet :
- **Gestion des Patients** : Vue complète sur l'historique et les dossiers des patients.
- **Planification Intelligente** : Gestion des disponibilités et réponse aux demandes.
- **Analyses (Analytics)** : Insights basés sur les données concernant le volume de patients et les tendances.

### 3. Communication Automatisée (Brevo API)
MediSync gère toutes les communications de manière professionnelle :
- **Emails de Bienvenue** : Envoyés automatiquement lors de l'inscription.
- **Notifications de Rendez-vous** : Alertes en temps réel pour les confirmations ou modifications.
- **Branding Officiel** : Tous les emails portent le logo officiel MediSync.

---

## 🏗️ Architecture du Code (Explication Technique)

### Backend (Django & DRF)
- **`backend/api/models.py`** : Cœur de la base de données. Définit comment les patients, les docteurs, les rendez-vous et les notifications sont stockés.
- **`backend/api/email_service.py`** : Module spécialisé qui utilise l'API Brevo. Il transforme le code Python en emails HTML élégants avec le logo intégré.
- **`backend/authentication/views.py`** : Gère la logique de sécurité, l'inscription des utilisateurs et la création automatique des profils.
- **`backend/backend/settings.py`** : Configuration centrale du projet (Base de données, Clés API, Sécurité).

### Frontend (React & Vite)
- **`frontend/src/core/services/api.js`** : Le pont entre le client et le serveur. Il gère toutes les requêtes vers le backend Django.
- **`frontend/src/modules/`** : Structure modulaire séparant les interfaces `doctor` et `patient` pour une meilleure maintenance.
- **`frontend/src/core/App.jsx`** : Le cerveau du routage, décidant quelle page afficher selon le rôle de l'utilisateur.

---

## 🔗 Connexions et Flux de Données (Le "Câblage")

Voici comment les différentes parties du projet communiquent entre elles :

### 1. Connexion Backend ↔️ Base de Données (Django ORM)
Le backend n'écrit pas de SQL manuellement. Il utilise l'**ORM de Django** :
- Les fichiers `models.py` définissent les tables comme des classes Python.
- La connexion est configurée dans `backend/settings.py` (via la clé `DATABASES`).
- Django traduit automatiquement vos actions Python (ex: `Patient.objects.create()`) en commandes pour la base de données.

### 2. Connexion Frontend ↔️ Backend (REST API)
C'est ici que la magie opère entre React et Django :
- **CORS (Cross-Origin Resource Sharing)** : Dans `settings.py`, nous avons autorisé `localhost:3000` (React) à parler à `localhost:8001` (Django). Sans cela, le navigateur bloquerait la connexion pour sécurité.
- **Axios & API.js** : Le fichier `frontend/src/core/services/api.js` contient une instance de client HTTP. Il envoie des requêtes (GET, POST, etc.) vers les URLs définies dans le backend.
- **Authentification par Token** : Quand vous vous connectez, le backend génère un **Token** unique. Le frontend stocke ce token et l'envoie dans l'en-tête de chaque requête (`Authorization: Token <votre_clé>`) pour prouver l'identité de l'utilisateur.

### 3. Connexion Backend ↔️ APIs Externes (Brevo)
Pour envoyer des emails, le backend agit comme un client :
- Le fichier `email_service.py` récupère votre clé API secrète depuis le fichier `.env`.
- Il utilise le SDK de Brevo pour envoyer des données formattées en JSON vers les serveurs de Brevo, qui se chargent ensuite de livrer l'email à votre patient.

### 4. Le cycle d'une requête (Exemple : Prendre un rendez-vous)
1. **Frontend** : L'utilisateur clique sur "Confirmer". React envoie les données à `api.js`.
2. **Réseau** : La requête arrive au backend Django.
3. **Backend** : `urls.py` dirige la requête vers une `view`.
4. **Logique** : La `view` valide les données, les enregistre via le `model` dans la **Database**, puis appelle `email_service.py`.
5. **API Externe** : Brevo reçoit l'ordre et envoie l'email.
6. **Réponse** : Django renvoie un message de succès (JSON) au frontend.
7. **UI** : React met à jour l'écran pour afficher "Rendez-vous confirmé !".

---

## 🛠️ Stack Technique

- **Backend** : Python / Django / Django Rest Framework
- **Frontend** : React / Vite / Tailwind CSS
- **Emails** : Brevo (Sendinblue) Transactional API
- **Design** : CSS personnalisé avec Glassmorphism & Patterns UI modernes

---

## 🏁 Comment Lancer le Programme Manuellement

Suivez ces étapes pour démarrer MediSync sur votre machine locale.

### Prérequis
- **Python 3.10+**
- **Node.js 18+**

### Étape 1 : Configuration du Backend (Django)
1. Ouvrez un terminal et allez dans le dossier backend :
   ```powershell
   cd "MediSync/backend"
   ```
2. Installez les dépendances :
   ```powershell
   pip install -r requirements.txt
   ```
3. Appliquez les migrations (initialisation de la base de données) :
   ```powershell
   python manage.py migrate
   ```
4. **Lancer le serveur Backend** :
   ```powershell
   python manage.py runserver 8001
   ```
   *Le backend sera disponible sur : http://localhost:8001*

### Étape 2 : Configuration du Frontend (React)
1. Ouvrez un **nouveau terminal** et allez dans le dossier frontend :
   ```powershell
   cd "MediSync/frontend"
   ```
2. Installez les paquets Node :
   ```powershell
   npm install
   ```
3. **Lancer le serveur Frontend** :
   ```powershell
   npm run dev -- --port 3000
   ```
   *Le frontend sera disponible sur : http://localhost:3000*

### Étape 3 : Accès à l'Administration
Pour gérer les données directement depuis le backend :
1. Allez sur : **http://localhost:8001/admin/**
2. **Utilisateur** : `admin`
3. **Mot de passe** : `admin123`

---

**Développé pour l'Excellence dans les Soins de Santé.**
*MediSync Clinical Systems © 2026*
