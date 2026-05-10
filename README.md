# 🏥 MediSync - Guide Simplifié (Pour Tous)

Bienvenue dans MediSync ! Ce document explique comment fonctionne votre logiciel comme si nous expliquions une recette de cuisine ou le fonctionnement d'un restaurant. Pas besoin d'être un expert en informatique pour comprendre !

---

## 🌟 1. C'est quoi MediSync ? (L'idée générale)
Imaginez un cabinet médical numérique. 
- **Le Patient** a sa propre clé pour entrer et voir ses rendez-vous.
- **Le Docteur** a un grand tableau de bord pour voir tous ses patients.
- **Le Système** envoie des lettres (emails) automatiquement pour que personne n'oublie rien.

---

## 🏗️ 2. Comment c'est construit ? (Les 3 piliers)

Pour faire marcher MediSync, nous avons trois "équipes" qui travaillent ensemble :

### 🏛️ Le Backend (Le Cerveau / La Cuisine)
C'est la partie invisible. Imaginez la **cuisine** d'un restaurant. 
- C'est là qu'on prépare les données (les ingrédients).
- Si un patient s'inscrit, c'est le chef (le Backend) qui vérifie si tout est correct et qui enregistre l'information.
- *Fichiers importants :* Les dossiers dans `backend/`.

### 📱 Le Frontend (Le Visage / La Salle de Restaurant)
C'est ce que vous voyez sur votre écran (les boutons, les couleurs, les tableaux). C'est la **salle à manger**.
- C'est le menu que le client regarde.
- Quand vous cliquez sur un bouton, vous envoyez une commande à la cuisine.
- *Fichiers importants :* Les dossiers dans `frontend/`.

### 🗄️ La Base de Données (L'Armoire / Le Garde-manger)
C'est une grande armoire où on range tout : les noms des patients, les dates des rendez-vous, les mots de passe.
- Rien ne se perd, tout est classé dans des tiroirs (qu'on appelle des "Tables").

---

## 🔗 3. Comment tout ce beau monde communique ?

C'est la partie la plus importante ! Comment la salle (Frontend) parle à la cuisine (Backend) ?

### ⚡ L'API (Le Serveur / Le Bon de Commande)
L'API est comme un **serveur de restaurant**. 
1. Vous cliquez sur "Prendre RDV" (**Frontend**).
2. Le serveur (**API**) note votre demande sur un petit papier.
3. Il apporte ce papier au chef (**Backend**).
4. Le chef prépare le plat et le serveur vous le rapporte.

### 🔑 Le "Token" (La Carte de Fidélité VIP)
Pour éviter de redonner votre nom et votre mot de passe à chaque clic :
- Quand vous vous connectez, le système vous donne une petite carte invisible (le **Token**).
- À chaque fois que vous demandez quelque chose, vous montrez cette carte. Le système sait alors immédiatement que c'est bien vous.

### 📩 Brevo (Le Facteur)
Quand le système veut envoyer un email :
- Le Backend écrit la lettre.
- Il appelle un facteur spécial (**Brevo**).
- Le facteur prend la lettre et va la livrer dans la boîte email du patient.

---

## 🏁 4. Comment lancer le programme ? (Pas à pas)

Même si vous n'avez jamais fait ça, suivez ces étapes comme une recette :

### Étape A : Préparer la Cuisine (Le Backend)
1. Ouvrez l'application "Terminal" ou "PowerShell" sur votre ordinateur.
2. Tapez cette commande pour aller dans le bon dossier : `cd MediSync/backend`
3. Tapez cette commande pour allumer le cerveau : `python manage.py runserver 8001`
4. **Laissez cette fenêtre ouverte !** Si vous la fermez, le cerveau s'éteint.

### Étape B : Allumer les Lumières (Le Frontend)
1. Ouvrez une **deuxième** fenêtre "Terminal".
2. Allez dans le dossier visuel : `cd MediSync/frontend`
3. Tapez cette commande pour allumer l'écran : `npm run dev -- --port 3000`
4. **Laissez aussi cette fenêtre ouverte !**

### Étape C : Utiliser le logiciel
- Ouvrez votre navigateur internet (Chrome ou Edge).
- Tapez cette adresse : **http://localhost:3000**
- Magie ! Le programme s'affiche.

---

## 📖 5. Petit dictionnaire pour briller en société :
- **Bug** : Une petite erreur dans la recette qui fait que le plat ne sort pas comme prévu.
- **Code** : Les instructions écrites pour le chef (le Backend) et le décorateur (le Frontend).
- **Serveur** : L'ordinateur qui fait tourner tout ça (ici, c'est votre propre ordinateur).

---
**MediSync Clinical Systems © 2026**
*Simple. Efficace. Connecté.*
