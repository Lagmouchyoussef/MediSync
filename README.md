# 🏥 Dossier de Projet : MediSync - Clinical Management System

Ce document constitue le **Compte Rendu Général** et le **Cahier des Charges** du projet MediSync. Il détaille la vision, la conception technique et le processus de développement du logiciel.

---

## 📋 PARTIE 1 : CAHIER DES CHARGES (Le "Quoi ?")

### 1.1 Contexte et Objectifs
Le projet MediSync est né du besoin de moderniser la gestion des petits et moyens cabinets médicaux. L'objectif est de remplacer les processus manuels par une plateforme numérique centralisée permettant de gérer le cycle de vie complet d'un rendez-vous médical.

### 1.2 Public Cible
- **Les Patients** : Souhaitent une interface simple pour gérer leur santé et leurs rendez-vous.
- **Les Médecins** : Besoin d'un outil d'administration puissant pour organiser leur patientèle et leur planning.

### 1.3 Besoins Fonctionnels (Fonctionnalités Clés)
- **Système d'Authentification** : Inscription et connexion sécurisées avec distinction des rôles (Patient vs Docteur).
- **Gestion de Profil** : Personnalisation des informations (photo, adresse, spécialité).
- **Module de Rendez-vous** : Système de demande, confirmation et annulation en temps réel.
- **Tableau de Bord Analytique** : Graphiques et statistiques sur l'activité du cabinet pour le médecin.
- **Notifications Automatisées** : Envoi d'emails transactionnels pour chaque événement important.

### 1.4 Contraintes Techniques
- **Sécurité** : Protection des données personnelles via cryptage et authentification par Token.
- **Disponibilité** : Architecture robuste capable de fonctionner 24h/24.
- **Responsive Design** : Le logiciel doit fonctionner sur PC, Tablette et Smartphone.

---

## 🛠️ PARTIE 2 : COMPTE RENDU DE DÉVELOPPEMENT (Le "Comment ?")

### 2.1 Choix de l'Architecture (Full-Stack Découplé)
Nous avons choisi de séparer totalement le **Front-end** et le **Back-end**. Cela permet de faire évoluer une partie sans casser l'autre. La communication se fait via des points d'accès sécurisés appelés **Endpoints API**.

### 2.2 Développement du Backend (Le Cerveau)
Développé avec **Django (Python)**, le backend gère toute la logique métier.
- **Modélisation** : Nous avons utilisé l'ORM Django pour créer des relations entre les utilisateurs, les profils et les rendez-vous.
- **API REST** : Utilisation de *Django Rest Framework* pour sérialiser les données (les transformer en format JSON, lisible par le web).
- **Sécurité** : Mise en place de middlewares pour vérifier les droits d'accès à chaque action.

### 2.3 Développement du Frontend (L'Interface)
Développé avec **React.js**, le frontend offre une interface utilisateur moderne.
- **Composants** : Utilisation de composants réutilisables pour garantir une cohérence visuelle.
- **État (State)** : Gestion de la mémoire de l'application (ex: savoir qui est connecté) en temps réel.
- **Design Glassmorphic** : Utilisation de CSS avancé pour créer des effets de transparence et de flou, donnant un aspect "Premium" et futuriste.

### 2.4 Intégration et API Tierce (L'Emailing)
Pour la communication, nous avons intégré l'API de **Brevo**. 
- Le code backend capture les actions (ex: nouveau RDV).
- Il envoie une commande formatée au service Brevo.
- Le patient reçoit un email professionnel en quelques secondes.

### 2.5 Base de Données
Le projet utilise une base de données relationnelle. Chaque donnée est liée : un rendez-vous est attaché à UN patient et UN docteur, garantissant qu'aucune information n'est orpheline.

---

## 🚀 PARTIE 3 : LANCEMENT ET MAINTENANCE

### Procédure de Lancement
1.  **Lancer le Backend** : `python manage.py runserver 8001` (Démarre la cuisine et le cerveau).
2.  **Lancer le Frontend** : `npm run dev` (Démarre la salle et l'affichage).

### Maintenance
Le code a été documenté et structuré pour être facilement modifiable. L'ajout d'une nouvelle fonctionnalité (ex: paiement en ligne) peut se faire sans réécrire le système existant.

---
**MediSync Clinical Systems © 2026**
*Document technique officiel pour présentation de soutenance.*
