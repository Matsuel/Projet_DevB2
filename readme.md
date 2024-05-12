# 📖 Projet Adopteunmoniteur.fr

## 💬 Description

Bienvenue sur notre site web dédié à l'évaluation des auto-écoles et de leurs moniteurs par les anciens élèves. Notre plateforme offre la possibilité aux utilisateurs de différents profils de partager leurs avis et expériences. 

Sur notre site, différents types d'utilisateurs peuvent interagir :

1. **Les Auto-écoles** : Elles peuvent inscrire leurs élèves sur la plateforme afin qu'ils laissent des avis. 

2. **Les Anciens Élèves** : Ils peuvent noter l'auto-école et leurs moniteurs, répondre aux questions des personnes cherchant une auto-école, et consulter les avis pour aider leur recherche.

3. **Les Futurs Élèves** : Ils peuvent consulter les avis, rechercher une auto-école via notre outil de recherche, et contacter les créateurs des avis pour obtenir plus d'informations.

Tous les utilisateurs ont la possibilité d'accéder à leur compte pour modifier leurs informations de base telles que le mot de passe et l'adresse e-mail.

## 🔋 Fonctionnalités majeures

- Recherche d'auto-école par nom ou par localisation
- Création d'auto-école ou de futur conducteur
- Edition/Suppresion du compte
- Ajout d'avis et de commentaire sur les auto-écoles/moniteurs
- Fonction de chat avec les utilisateurs ayant posté des commentaires
- Consultation de la page auto-école/moniteur
- Consultation de la position sur leur page personnel
- Classement des meilleurs auto-écoles/moniteurs

## 🛠 Technologies utilisées

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://nextjs.org/">Next.js</a></li>
    <li><a href="">CSS</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
  </ul>
</details>

## 💻 Démarrage

### Prérequis

<ul>
    <li><a href="https://nodejs.org/en/download/current">NodeJS</a></li>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
  </ul>

### Setup

```bash
git clone https://github.com/Matsuel/Projet_DevB2
```

```bash
docker run -d -p 27017:27017 mongo
```

### Installation

```bash
cd Projet_DevB2
```

```bash
cd auto-ecole
npm i
```

*Pour le fonctionnement du site vous devrez vous créer une clé d'API sur le site [MapBox](https://account.mapbox.com/), afin de pouvoir consulter la position des auto-écoles sur une carte*
*Ensuite créez un fichier .env à la racine du dossier "auto-ecole" avec ce contenu*

```.env
NEXT_PUBLIC_MAP_API="Votre_cle_api_ici"
```

```bash
cd backend
npm i
```

*Pour le fonctionnement du site vous devrez créer uen clé secrète qui vous permettra de sécuriser les tokens de session à l'aide la fonction à lancer comme suit:*

```bash
node ./dist/Functions/createSecret.js
```

*Ensuite créez un fichier .env à la racine du dossier "auto-ecole" avec ce contenu*

```.env
SECRET="Le_resultat_de_la_fonction"
```

### Utilisation

*Vous devez utiliser 2 terminals un pour lancer le backend et l'autre pour lancer le site*


#### Serveur
```bash
cd backend
npm start
```

#### Site

```bash
cd auto-ecole
npm run dev
```

*Ensuite rendez-vous sur votre navigateur http://localhost:3000*

## 📷 Screenshots
![image](https://github.com/Matsuel/Projet_DevB2/assets/112950582/89838420-48e8-49ff-a4b0-b103f5af0213)

![image2](https://github.com/Matsuel/Projet_DevB2/assets/112950582/2b6b9626-a2ac-4850-aa25-ee4e972707b6)

![image3](https://github.com/Matsuel/Projet_DevB2/assets/112950582/46e02a88-ce11-4d86-b416-346c369d33c8)

![image4](https://github.com/Matsuel/Projet_DevB2/assets/112950582/71137558-e56a-4bab-a66a-d19137e655e6)

![account](https://github.com/Matsuel/Projet_DevB2/assets/75479794/874cdca8-5f77-487d-b194-877dd90f991c)

## 👥 Auteurs

### 👤 [Ninjawill543](https://github.com/ninjawill543): Front-End
### 👤 [Matsuel](https://github.com/Matsuel): Back-End


