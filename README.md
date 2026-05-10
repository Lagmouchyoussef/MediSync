# 🏥 MediSync : Un Système Complet de Gestion Clinique 🚀

![Logo MediSync](Logo_Medisync.png)

[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/)
[![React 19](https://img.shields.io/badge/react-19-blue.svg)](https://reactjs.org/)
[![Django 5.2](https://img.shields.io/badge/django-5.2-green.svg)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15-orange.svg)](https://www.postgresql.org/)

## 📋 Table des Matières
1. [Introduction](#introduction)
2. [Qu'est-ce que MediSync ?](#quest-ce-que-medisync)
3. [Fonctionnalités Clés](#fonctionnalités-clés)
4. [Pile Technologique](#pile-technologique)
5. [Aperçu de l'Architecture](#aperçu-de-larchitecture)
6. [Détails Frontend](#détails-frontend)
7. [Détails Backend](#détails-backend)
8. [Base de Données (PostgreSQL)](#base-de-données-postgresql)
9. [Points de Terminaison API](#points-de-terminaison-api)
10. [Services Email (Brevo)](#services-email-brevo)
11. [Installation et Configuration](#installation-et-configuration)
12. [Guide d'Utilisation](#guide-dutilisation)
13. [Configuration](#configuration)
14. [Sécurité et Bonnes Pratiques](#sécurité-et-bonnes-pratiques)
15. [Déploiement](#déploiement)
16. [Contribution](#contribution)
17. [Dépannage](#dépannage)
18. [Licence](#licence)

## Introduction

🎊 Bienvenue dans **MediSync** 🏥, un système de gestion clinique de pointe conçu pour révolutionner le fonctionnement des cabinets médicaux de petite et moyenne taille. Ce guide complet vous accompagnera à travers tous les aspects de l'application, depuis son objectif principal jusqu'aux détails d'implémentation technique. Que vous soyez un développeur 👨‍💻 cherchant à comprendre le code source, un professionnel médical 👩‍⚕️ évaluant le système, ou un débutant en développement logiciel, ce README fournit des explications à un niveau adapté aux débutants tout en maintenant une profondeur professionnelle. 📚

### Pourquoi MediSync est Important

Dans les environnements de soins de santé traditionnels 🏨, la gestion des rendez-vous implique souvent des systèmes papier encombrants 📄, des appels téléphoniques 📞, et une planification manuelle qui peuvent entraîner des erreurs ❌, des inefficacités ⏰, et l'insatisfaction des patients 😞. MediSync répond à ces défis en fournissant une plateforme numérique 💻 qui automatise et rationalise l'ensemble du cycle de vie des rendez-vous 🔄, garantissant de meilleurs soins aux patients 🏥 et une efficacité administrative ⚡.

## 🎯 Diagramme des Cas d'Utilisation

```mermaid
graph TD
    A[👤 Patient] --> B[📅 Demander un Rendez-vous]
    A --> C[👀 Voir le Statut du Rendez-vous]
    A --> D[📝 Mettre à Jour le Profil]
    A --> E[🔔 Recevoir des Notifications]

    F[👨‍⚕️ Médecin] --> G[✅ Accepter/Rejeter les Rendez-vous]
    F --> H[📊 Voir les Analyses]
    F --> I[👥 Gérer les Patients]
    F --> J[⏰ Définir la Disponibilité]
    F --> K[📧 Envoyer des Notifications]

    B --> L[📧 Notification Email]
    G --> M[📧 Notification Email]
    L --> F
    M --> A
```

## 🔍 Qu'est-ce que MediSync ?

MediSync est une application web qui sert deux groupes d'utilisateurs principaux :

### Pour les Patients
- **Réservation Facile de Rendez-vous** : Les patients peuvent demander des rendez-vous avec leurs médecins via une interface intuitive
- **Suivi du Statut en Temps Réel** : Surveiller les demandes de rendez-vous de la soumission à la confirmation
- **Gestion du Profil** : Maintenir les informations de santé personnelles et les préférences
- **Notifications** : Recevoir des mises à jour via l'application et l'email
- **Design Réactif** : Accéder au système sur n'importe quel appareil - ordinateur de bureau, tablette, ou mobile

### Pour les Médecins
- **Tableau de Bord Administratif** : Gérer les dossiers patients, les rendez-vous, et les opérations de la clinique
- **Gestion de la Disponibilité** : Définir les horaires hebdomadaires et les créneaux de disponibilité
- **Supervision des Patients** : Voir et mettre à jour les informations des patients
- **Analyses et Rapports** : Générer des insights via des graphiques et des statistiques
- **Système de Notification** : Rester informé des demandes des patients et des mises à jour

L'application fonctionne 24h/24 et 7j/7, fournissant un accès sécurisé aux données de santé critiques tout en maintenant des normes strictes de confidentialité et de conformité.

## ✨ Fonctionnalités Clés

### Fonctionnalités de Base
1. **Contrôle d'Accès Basé sur les Rôles** : Authentification sécurisée avec des interfaces distinctes pour les patients et les médecins
2. **Gestion des Rendez-vous** : Cycle de vie complet de la demande à l'achèvement
3. **Notifications en Temps Réel** : Alertes dans l'application et par email pour tous les événements importants
4. **Gestion du Profil** : Profils utilisateur complets avec paramètres personnalisables
5. **Journalisation des Activités** : Traçabilité de toutes les actions des utilisateurs pour la conformité
6. **Tableau de Bord d'Analyses** : Rapports visuels et statistiques pour les insights opérationnels

### Fonctionnalités d'Expérience Utilisateur
- **Design Réactif** : Fonctionne parfaitement sur tous les appareils
- **Interface Moderne** : Design glassmorphic avec des animations fluides
- **Navigation Intuitive** : Interface facile à utiliser avec des workflows clairs
- **Accessibilité** : Conçu selon les normes d'accessibilité

### Fonctionnalités Techniques
- **API RESTful** : API bien documentée pour les intégrations
- **Intégrité de la Base de Données** : Base de données relationnelle avec des relations appropriées
- **Intégration Email** : Emails transactionnels professionnels
- **Sécurité** : Mesures de sécurité intégrées et bonnes pratiques
- **Évolutivité** : Architecture conçue pour la croissance

## 🛠️ Pile Technologique

MediSync est construit en utilisant des technologies modernes et standards de l'industrie, choisies pour leur fiabilité, leurs performances et l'expérience développeur.

### Technologies Backend
- **Python 3.12** : Langage de programmation connu pour sa lisibilité et ses bibliothèques étendues
- **Django 5.2.13** : Framework web haut niveau qui encourage le développement rapide et le design propre
- **Django REST Framework (DRF)** : Boîte à outils puissante pour construire des APIs Web
- **PostgreSQL 15** : Base de données relationnelle open-source avancée
- **Docker** : Plateforme de conteneurisation pour des environnements cohérents
- **Brevo (anciennement Sendinblue)** : Service de livraison d'emails pour les emails transactionnels

### Technologies Frontend
- **React 19** : Bibliothèque JavaScript pour construire des interfaces utilisateur
- **Vite** : Outil de construction rapide et serveur de développement
- **Tailwind CSS** : Framework CSS utilitaire en premier pour un style rapide
- **Axios** : Client HTTP pour la communication API
- **React Router** : Routage déclaratif pour les applications React
- **Recharts** : Bibliothèque de graphiques composables pour la visualisation de données
- **Framer Motion** : Bibliothèque de mouvement prête pour la production

### Outils de Développement
- **Git** : Système de contrôle de version pour suivre les changements
- **PowerShell** : Scripting pour la configuration de l'environnement de développement
- **NPM/Yarn** : Gestionnaires de paquets pour les dépendances frontend

## 🏗️ Aperçu de l'Architecture

MediSync suit une **architecture découplée**, séparant le frontend et le backend pour une meilleure maintenabilité et évolutivité.

### 🖥️ Architecture de Haut Niveau

```mermaid
graph TB
    subgraph "🌐 Couche Frontend"
        A[Application React<br/>Port 3001<br/>📱 Interface Utilisateur Réactive]
        B[Serveur de Développement Vite<br/>⚡ Rechargement à Chaud]
    end

    subgraph "🖧 Communication"
        C[HTTP/JSON<br/>🔄 Axios]
        D[En-têtes CORS<br/>🔒 Sécurité]
    end

    subgraph "⚙️ Couche Backend"
        E[API REST Django<br/>Port 8001<br/>🐍 Python]
        F[Authentification<br/>🔐 Jetons JWT]
        G[Logique Métier<br/>📋 Vues/Modèles]
    end

    subgraph "💾 Couche Base de Données"
        H[PostgreSQL<br/>🐘 Conteneur Docker]
        I[ORM Django<br/>🔗 Migrations]
    end

    subgraph "📧 Services Externes"
        J[API Email Brevo<br/>📬 SMTP]
        K[Emails Transactionnels<br/>✉️ Modèles]
    end

    A --> C
    C --> E
    E --> F
    E --> G
    G --> I
    I --> H
    E --> J
    J --> K
```

### Composants d'Architecture Expliqués

1. **Couche Frontend** : Gère les interactions utilisateur et présente les données
2. **Couche Backend** : Traite la logique métier et gère les données
3. **Couche Base de Données** : Persiste les données de l'application
4. **Services Externes** : Livraison d'emails et autres intégrations

### 🔄 Flux de Données
1. L'utilisateur interagit avec l'interface frontend
2. Le frontend envoie des requêtes HTTP aux APIs backend
3. Le backend traite les requêtes, interagit avec la base de données
4. Le backend retourne des réponses JSON au frontend
5. Le frontend met à jour l'interface utilisateur selon les réponses
6. Les notifications par email sont envoyées de manière asynchrone si nécessaire

### 📊 Diagramme de Séquence - Réservation de Rendez-vous

```mermaid
sequenceDiagram
    participant P as 👤 Patient
    participant FE as 🖥️ Frontend
    participant BE as ⚙️ API Backend
    participant DB as 💾 PostgreSQL
    participant EM as 📧 Brevo Email

    P->>FE: Formulaire de demande de rendez-vous
    FE->>BE: POST /api/patient/rendez-vous/
    BE->>DB: Créer un enregistrement de rendez-vous
    DB-->>BE: Rendez-vous créé
    BE-->>FE: Réponse de succès
    FE-->>P: Afficher la confirmation

    BE->>EM: Envoyer un email de notification
    EM-->>BE: Email envoyé

    Note over P,EM: Le médecin reçoit une notification par email
```

## 🎨 Détails Frontend

Le frontend est construit avec React et fournit une expérience utilisateur moderne et réactive.

### Structure Frontend
```
frontend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Composants d'authentification
│   │   ├── doctor/        # Fonctionnalités spécifiques au médecin
│   │   ├── patient/       # Fonctionnalités spécifiques au patient
│   │   └── shared/        # Composants communs
│   ├── core/              # Utilitaires et services de base
│   └── App.js             # Composant principal de l'application
├── public/                # Ressources statiques
└── package.json           # Dépendances et scripts
```

### Concepts Clés Frontend

#### Composants React
Les applications React sont construites en utilisant des composants - des morceaux de code réutilisables qui retournent du JSX (JavaScript XML). Par exemple :
```jsx
function CarteRendezVous({ rendezVous }) {
  return (
    <div className="carte-rendez-vous">
      <h3>{rendezVous.nom_patient}</h3>
      <p>{rendezVous.date} à {rendezVous.heure}</p>
      <span className={`statut ${rendezVous.statut.toLowerCase()}`}>
        {rendezVous.statut}
      </span>
    </div>
  );
}
```

#### Gestion d'État
L'application utilise la gestion d'état intégrée de React avec des hooks comme `useState` et `useEffect` pour gérer l'état des composants et les effets secondaires.

#### Style avec Tailwind CSS
Tailwind fournit des classes utilitaires pour un style rapide :
```jsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  {/* Contenu */}
</div>
```

#### Communication API
Axios est utilisé pour faire des requêtes HTTP vers le backend :
```javascript
const reponse = await axios.get('/api/rendez-vous/');
const rendezVous = reponse.data;
```

## ⚙️ Détails Backend

Le backend est alimenté par Django, fournissant des fonctionnalités côté serveur robustes.

### Structure Backend
```
backend/
├── manage.py              # Utilitaire de ligne de commande Django
├── backend/
│   ├── settings.py        # Paramètres de configuration
│   ├── urls.py            # Routage des URLs
│   └── wsgi.py            # Configuration WSGI
├── api/                   # Logique principale de l'application
│   ├── models.py          # Modèles de base de données
│   ├── views.py           # Fonctions de vue
│   ├── serializers.py     # Sérialisation des données
│   └── urls.py            # Routage API
├── authentication/        # Gestion des utilisateurs
└── static/                # Fichiers statiques
```

### Fondamentaux Django

#### Modèles
Les modèles définissent la structure de vos données et les relations :
```python
class RendezVous(models.Model):
    CHOIX_STATUT = [
        ('En_attente', 'En attente'),
        ('Accepte', 'Accepté'),
        ('Rejete', 'Rejeté'),
        ('Confirme', 'Confirmé'),
        ('Annule', 'Annulé'),
    ]

    medecin = models.ForeignKey(User, on_delete=models.CASCADE)
    nom_patient = models.CharField(max_length=100)
    date = models.DateField()
    heure = models.TimeField()
    statut = models.CharField(max_length=20, choices=CHOIX_STATUT, default='En_attente')

    class Meta:
        ordering = ['-date', '-heure']
```

#### Vues
Les vues gèrent les requêtes HTTP et retournent des réponses :
```python
class ListeCreationRendezVous(generics.ListCreateAPIView):
    serializer_class = SerializerRendezVous
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        utilisateur = self.request.user
        if hasattr(utilisateur, 'profile') and utilisateur.profile.role == 'medecin':
            return RendezVous.objects.filter(medecin=utilisateur)
        return RendezVous.objects.filter(patient_user=utilisateur)
```

#### URLs
Les motifs d'URL mappent les URLs aux vues :
```python
urlpatterns = [
    path('rendez-vous/', ListeCreationRendezVous.as_view(), name='liste-rendez-vous'),
    path('rendez-vous/<int:pk>/', DetailRendezVous.as_view(), name='detail-rendez-vous'),
]
```

## 💾 Base de Données (PostgreSQL)

MediSync utilise PostgreSQL, une base de données relationnelle open-source puissante.

### 🏛️ Principes de Conception de Base de Données

#### 📊 Diagramme Entité-Relation

```mermaid
erDiagram
    Utilisateur ||--o{ Profil : a
    Utilisateur ||--o{ Patient : gere
    Utilisateur ||--o{ RendezVous : cree
    Utilisateur ||--o{ Disponibilite : definit
    Utilisateur ||--o{ Activite : effectue
    Utilisateur ||--o{ Notification : recoit

    Profil {
        string role
        string image
        string telephone
        string adresse
        string specialite
        json preferences
    }

    Patient {
        string prenom
        string nom
        string email
        string telephone
        date date_naissance
        string genre
        string adresse
        string statut
    }

    RendezVous {
        string nom_patient
        date date
        time heure
        string statut
        string type
        text notes
        string role_initiateur
    }

    Disponibilite {
        string jour_semaine
        time heure_debut
        time heure_fin
        boolean actif
    }

    Activite {
        string action
        text details
        string type
    }

    Notification {
        string titre
        text message
        string type
        boolean lu
    }
```

#### 🔗 Relations Clés
- **Un-à-Un** : Utilisateur ↔ Profil (chaque utilisateur a un profil)
- **Un-à-Plusieurs** : Médecin → Patients, Médecin → Rendez-vous
- **Plusieurs-à-Un** : Les rendez-vous appartiennent aux médecins et aux patients
- **Extensible** : Prêt pour les relations plusieurs-à-plusieurs si nécessaire

### ⚙️ Configuration de Base de Données
PostgreSQL est configuré via Docker pour le développement :
```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: medisync
      POSTGRES_USER: utilisateur_medisync
      POSTGRES_PASSWORD: mot_de_passe_medisync
    ports:
      - "5432:5432"
```

### 📋 Diagramme de Classes - Modèles Django

```mermaid
classDiagram
    class Utilisateur {
        +username: string
        +email: string
        +password: string
        +is_active: boolean
        +date_joined: datetime
        +get_profile()
    }

    class Profil {
        +utilisateur: Utilisateur[1]
        +role: string
        +image: string
        +telephone: string
        +adresse: string
        +specialite: string
        +preferences: json
        +nom_clinique: string
        +adresse_clinique: string
    }

    class Patient {
        +medecin: Utilisateur[1]
        +patient_user: Utilisateur[0..1]
        +prenom: string
        +nom: string
        +email: string
        +telephone: string
        +date_naissance: date
        +genre: string
        +adresse: string
        +statut: string
    }

    class RendezVous {
        +medecin: Utilisateur[1]
        +patient_user: Utilisateur[0..1]
        +patient: Patient[0..1]
        +nom_patient: string
        +date: date
        +heure: time
        +statut: string
        +type: string
        +notes: text
        +role_initiateur: string
        +created_at: datetime
    }

    class Disponibilite {
        +medecin: Utilisateur[1]
        +jour_semaine: string
        +heure_debut: time
        +heure_fin: time
        +actif: boolean
    }

    class Activite {
        +utilisateur: Utilisateur[1]
        +action: string
        +details: text
        +timestamp: datetime
        +type: string
    }

    class Notification {
        +utilisateur: Utilisateur[1]
        +titre: string
        +message: text
        +type: string
        +lu: boolean
        +created_at: datetime
    }

    Utilisateur ||--|| Profil : "1-1"
    Utilisateur ||--o{ Patient : "1-*"
    Utilisateur ||--o{ RendezVous : "1-*"
    Utilisateur ||--o{ Disponibilite : "1-*"
    Utilisateur ||--o{ Activite : "1-*"
    Utilisateur ||--o{ Notification : "1-*"
    RendezVous }o--o| Patient : "*-*"
```

## 🔗 Points de Terminaison API

L'API fournit des points de terminaison RESTful pour toutes les fonctionnalités de l'application.

### Points de Terminaison d'Authentification
```
POST /api/connexion/              # Connexion utilisateur
POST /api/inscription/           # Inscription utilisateur
GET  /api/utilisateur/           # Informations utilisateur actuel
PUT  /api/profil/                # Mettre à jour le profil
POST /api/changer-mot-de-passe/  # Changer le mot de passe
DELETE /api/supprimer-compte/    # Supprimer le compte
```

### Points de Terminaison Médecin
```
GET  /api/medecin/patients/           # Lister les patients
POST /api/medecin/patients/           # Créer un patient
GET  /api/medecin/patients/{id}/      # Détails patient
PUT  /api/medecin/patients/{id}/      # Mettre à jour patient
DELETE /api/medecin/patients/{id}/    # Supprimer patient

GET  /api/medecin/disponibilites/     # Disponibilité du médecin
POST /api/medecin/disponibilites/     # Définir la disponibilité

GET  /api/medecin/rendez-vous/        # Lister les rendez-vous
POST /api/medecin/rendez-vous/        # Créer un rendez-vous
GET  /api/medecin/rendez-vous/{id}/   # Détails rendez-vous
PUT  /api/medecin/rendez-vous/{id}/   # Mettre à jour rendez-vous
DELETE /api/medecin/rendez-vous/{id}/ # Supprimer rendez-vous

GET  /api/medecin/analyses/           # Analyses du tableau de bord
GET  /api/medecin/activites/          # Journaux d'activité
GET  /api/medecin/notifications/      # Notifications
```

### Points de Terminaison Patient
```
GET  /api/patient/rendez-vous/        # Lister les rendez-vous
POST /api/patient/rendez-vous/        # Demander un rendez-vous
GET  /api/patient/rendez-vous/{id}/   # Détails rendez-vous
PUT  /api/patient/rendez-vous/{id}/   # Mettre à jour rendez-vous
DELETE /api/patient/rendez-vous/{id}/ # Annuler rendez-vous

GET  /api/patient/medecins/           # Médecins disponibles
GET  /api/patient/analyses/           # Analyses patient
GET  /api/patient/activites/          # Journaux d'activité
GET  /api/patient/notifications/      # Notifications
```

### 🔄 Diagramme de Flux API

```mermaid
flowchart TD
    A[👤 Requête Utilisateur] --> B{Authentification ?}
    B -->|Non| C[❌ 401 Non autorisé]
    B -->|Oui| D[🔍 Vérification Rôle]

    D -->|Patient| E[👨‍⚕️ Points de Terminaison Patient]
    D -->|Médecin| F[👩‍⚕️ Points de Terminaison Médecin]

    E --> G[📊 Logique Métier]
    F --> G

    G --> H[💾 Requête Base de Données]
    H --> I[📋 Sérialiser Données]
    I --> J[📤 Réponse JSON]

    C --> K[🚫 Réponse Erreur]
    J --> L[✅ Réponse Succès]
```

## 📧 Services Email (Brevo)

MediSync s'intègre avec Brevo (anciennement Sendinblue) pour une livraison d'emails professionnelle.

### Architecture du Service Email
```python
class ServiceEmailBrevo:
    def __init__(self):
        self.cle_api = settings.CLE_API_BREVO
        self.configuration = sib_api_v3_sdk.Configuration()
        self.configuration.api_key['api-key'] = self.cle_api
        self.instance_api = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(self.configuration)
        )

    def envoyer_email(self, email_destinataire, sujet, contenu_html):
        envoyer_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": email_destinataire}],
            sender={"name": "MediSync", "email": "noreply@medisync.com"},
            subject=sujet,
            html_content=contenu_html
        )
        self.instance_api.send_transac_email(envoyer_smtp_email)
```

### Modèles d'Email

#### Email de Bienvenue
Envoyé lorsqu'un nouvel utilisateur s'inscrit, personnalisé selon le rôle :
- **Patients** : Message de bienvenue avec instructions de réservation de rendez-vous
- **Médecins** : Message de bienvenue avec conseils de configuration de clinique

#### Notifications de Rendez-vous
- **Nouvelle Demande** : Patient demande rendez-vous → Médecin notifié
- **Mises à Jour de Statut** : Accepté/Rejeté → Patient notifié
- **Confirmations** : Patient confirme → Médecin notifié

### Fonctionnalités Email
- **Modèles HTML** : Design professionnel avec branding MediSync
- **Images Intégrées** : Logo et éléments visuels
- **Design Réactif** : Les emails se présentent bien sur tous les appareils
- **Suivi** : Suivi de livraison et d'ouverture via Brevo
- **Gestion d'Erreurs** : Gestion d'erreurs robuste et journalisation

### 📊 Diagramme d'État des Rendez-vous

```mermaid
stateDiagram-v2
    [*] --> En_attente: Patient demande
    En_attente --> Accepte: Médecin accepte
    En_attente --> Rejete: Médecin rejette

    Accepte --> Confirme: Patient confirme
    Confirme --> [*]: Rendez-vous terminé

    Rejete --> [*]: Demande annulée
    Accepte --> Annule: L'une des parties annule
    Confirme --> Annule: L'une des parties annule
    Annule --> [*]: État final
```

## 🚀 Installation et Configuration

### Prérequis
- Python 3.12 ou supérieur
- Node.js 18 ou supérieur
- Docker et Docker Compose
- Git

### Installation Étape par Étape

#### 1. Cloner le Dépôt
```bash
git clone <url-du-depot>
cd medisync
```

#### 2. Configuration Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 3. Configuration Base de Données
```bash
docker-compose up -d db
python manage.py migrate
python manage.py createsuperuser
```

#### 4. Configuration Frontend
```bash
cd ../frontend
npm install
npm run dev
```

#### 5. Configuration Variables d'Environnement
Créer un fichier `.env` dans le répertoire backend :
```
DEBUG=True
SECRET_KEY=votre-cle-secrete
DATABASE_URL=postgresql://utilisateur_medisync:mot_de_passe_medisync@localhost:5432/medisync
BREVO_API_KEY=votre-cle-api-brevo
```

#### 6. Démarrer les Serveurs de Développement
Utiliser le script PowerShell fourni :
```powershell
.\start-dev.ps1
```

Ceci démarrera :
- Serveur backend sur http://localhost:8001
- Serveur de développement frontend sur http://localhost:3001

## 📖 Guide d'Utilisation

### Pour les Nouveaux Utilisateurs

#### Processus d'Inscription
1. Naviguer vers la page d'inscription
2. Choisir votre rôle (Patient ou Médecin)
3. Remplir les informations requises
4. Vérifier l'adresse email
5. Terminer la configuration du profil

#### Processus de Connexion
1. Entrer nom d'utilisateur/email et mot de passe
2. Le système redirige selon le rôle
3. Accéder au tableau de bord spécifique au rôle

### Pour les Patients

#### Réserver un Rendez-vous
1. Voir les médecins disponibles
2. Sélectionner le médecin préféré et le créneau horaire
3. Fournir les détails du rendez-vous
4. Soumettre la demande
5. Surveiller le statut via le tableau de bord

#### Gérer le Profil
1. Accéder aux paramètres du profil
2. Mettre à jour les informations personnelles
3. Configurer les préférences de notification
4. Télécharger une photo de profil

### Pour les Médecins

#### Gérer la Disponibilité
1. Définir les créneaux de disponibilité hebdomadaire
2. Définir les types de consultation
3. Mettre à jour les horaires si nécessaire

#### Gérer les Rendez-vous
1. Examiner les demandes entrantes
2. Accepter ou rejeter les rendez-vous
3. Communiquer avec les patients
4. Mettre à jour les statuts des rendez-vous

#### Gestion des Patients
1. Ajouter de nouveaux patients
2. Mettre à jour les dossiers patients
3. Voir l'historique des patients
4. Générer des rapports

## ⚙️ Configuration

### Configuration Backend (settings.py)

#### Paramètres de Base de Données
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'medisync'),
        'USER': os.environ.get('DB_USER', 'utilisateur_medisync'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'mot_de_passe_medisync'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

#### Configuration Email
```python
CLE_API_BREVO = os.environ.get('BREVO_API_KEY')
BACKEND_EMAIL = 'django.core.mail.backends.smtp.EmailBackend'
HOST_EMAIL = 'smtp-relay.brevo.com'
PORT_EMAIL = 587
EMAIL_USE_TLS = True
HOST_USER_EMAIL = 'votre-utilisateur-smtp-brevo'
HOST_PASSWORD_EMAIL = CLE_API_BREVO
```

#### Paramètres de Sécurité
```python
CLE_SECRETE = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
HOSTS_AUTORISES = ['localhost', '127.0.0.1']
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]
```

### Configuration Frontend

#### Configuration Vite (vite.config.js)
```javascript
export default defineConfig({
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
  }
})
```

## 🔒 Sécurité et Bonnes Pratiques

### Authentification et Autorisation
- Authentification basée sur les jetons utilisant Django REST Framework
- Contrôle d'accès basé sur les rôles (RBAC)
- Hachage des mots de passe avec PBKDF2
- Gestion des sessions avec des cookies sécurisés

### Protection des Données
- Protection CSRF sur tous les formulaires
- Prévention XSS par l'échappement des modèles
- Prévention des injections SQL via l'ORM
- Validation et assainissement des entrées

### En-têtes de Sécurité
```python
# settings.py
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### Sécurité API
- Limitation du débit (100 req/jour anonyme, 1000 req/jour authentifié)
- Limitation des requêtes
- Versionnage des API
- Gestion d'erreurs appropriée (pas de données sensibles dans les erreurs)

## 🌐 Déploiement

### Considérations de Production
1. **Variables d'Environnement** : Utiliser des secrets uniques et forts
2. **Base de Données** : Utiliser un service PostgreSQL géré
3. **Fichiers Statiques** : Configurer un CDN pour les ressources statiques
4. **HTTPS** : Activer les certificats SSL/TLS
5. **Surveillance** : Configurer la journalisation et la surveillance
6. **Sauvegarde** : Sauvegardes régulières de base de données

### Étapes de Déploiement
1. Construire le frontend : `npm run build`
2. Collecter les fichiers statiques : `python manage.py collectstatic`
3. Configurer le serveur web (nginx/apache)
4. Configurer le gestionnaire de processus (gunicorn/uwsgi)
5. Configurer le proxy inverse
6. Activer les certificats SSL

## 🤝 Contribution

### Flux de Développement
1. Forker le dépôt
2. Créer une branche de fonctionnalité
3. Faire des changements suivant les standards de codage
4. Écrire des tests pour les nouvelles fonctionnalités
5. Soumettre une pull request

### Standards de Codage
- Suivre PEP 8 pour le code Python
- Utiliser ESLint pour le code JavaScript/React
- Écrire des docstrings complètes
- Utiliser des messages de commit significatifs

### Tests
- Backend : `python manage.py test`
- Frontend : `npm test`
- Tests d'intégration pour les points de terminaison API

## 🔧 Dépannage

### Problèmes Courants

#### Problèmes de Connexion à la Base de Données
- Vérifier que le conteneur Docker fonctionne : `docker ps`
- Vérifier les identifiants de base de données dans `.env`
- S'assurer que le port 5432 est disponible

#### Problèmes de Construction Frontend
- Vider node_modules : `rm -rf node_modules && npm install`
- Vérifier la version de Node.js : `node --version`
- Vérifier la configuration Vite

#### Problèmes d'Authentification API
- Vérifier la validité du jeton
- Vérifier les permissions utilisateur
- Examiner la limitation des requêtes API

#### Problèmes de Livraison Email
- Vérifier la clé API Brevo
- Vérifier les modèles d'email
- Examiner le tableau de bord Brevo pour le statut de livraison

### Journaux et Débogage
- Journaux backend : Vérifier la sortie console Django
- Journaux frontend : Outils de développement du navigateur
- Journaux base de données : `docker logs medisync_db`
- Journaux email : Examiner le tableau de bord Brevo

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

🎉 **MediSync** représente une solution complète pour la gestion moderne des soins de santé, combinant des technologies de pointe avec un design convivial. Cette documentation fournit tout ce qui est nécessaire pour comprendre, installer, configurer et étendre le système. Pour un support supplémentaire, veuillez vous référer au suivi des problèmes du projet ou au wiki de documentation. 🌟
