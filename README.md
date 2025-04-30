````markdown
# TravelHub

TravelHub est une application web de réservation de voyages permettant aux utilisateurs de rechercher et de réserver des vols, des hôtels et des activités. Cette plateforme utilise une architecture moderne et distribuée pour offrir une expérience utilisateur fluide et performante.

## ✨ Fonctionnalités

- **Recherche d'offres de voyage** : Recherchez des vols par ville de départ et d'arrivée
- **Détails des offres** : Consultez les informations détaillées sur les vols, hôtels et activités
- **Recommandations** : Obtenez des suggestions de destinations similaires
- **Création d'offres** : Ajoutez de nouvelles offres de voyage
- **Interface responsive** : Expérience utilisateur optimisée sur tous les appareils

## 🏗️ Architecture technique

TravelHub est construit avec une architecture moderne utilisant plusieurs technologies:

### Frontend

- **Next.js** : Framework React pour le rendu côté serveur et le routage
- **Tailwind CSS** : Framework CSS utilitaire pour le design
- **shadcn/ui** : Composants UI réutilisables

### Backend

- **Next.js API Routes** : API RESTful pour la communication client-serveur
- **MongoDB** : Base de données principale pour stocker les offres de voyage
- **Redis** : Cache et système de publication/abonnement pour les performances
- **Neo4j** : Base de données graphe pour les recommandations et relations entre destinations

### Infrastructure

- **Docker** : Conteneurisation des services (MongoDB, Redis, Neo4j)

## 🚀 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- Docker et Docker Compose
- Git

### Étapes d'installation

1. Clonez le dépôt:
   ```bash
   git clone https://github.com/votre-username/travel-hub.git
   cd travel-hub
   ```
````

2. Installez les dépendances:

```shellscript
npm install
```

3. Lancez les services avec Docker Compose:

```shellscript
docker-compose up -d
```

## ⚙️ Configuration

1. Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```plaintext
# MongoDB
MONGO_URI=mongodb://root:root@localhost:27017/travel?authSource=admin

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=test1234
```

2. Les scripts d'initialisation pour les bases de données se trouvent dans:

1. `mongo-init/` pour MongoDB
1. `redis-init/` pour Redis
1. `neo4j-init/` pour Neo4j

## 🖥️ Utilisation

1. Démarrez le serveur de développement:

```shellscript
npm run dev
```

2. Accédez à l'application dans votre navigateur:

```plaintext
http://localhost:3000
```

## 📡 API

TravelHub expose plusieurs endpoints API:

### Offres de voyage

- `GET /api/offers?from={code}&to={code}` - Récupère les offres de voyage entre deux villes
- `GET /api/offers/{id}` - Récupère les détails d'une offre spécifique
- `POST /api/offers` - Crée une nouvelle offre de voyage

### Recommandations

- `GET /api/reco?city={code}` - Récupère des recommandations de destinations similaires

### Authentification

- `POST /api/auth/login` - Authentifie un utilisateur et crée une session

## 📊 Modèles de données

### Offre (Offer)

```typescript
interface Offer {
  _id: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  provider: string;
  price: number;
  currency: string;
  legs?: Array<{
    flightNum: string;
    dep: string;
    arr: string;
    duration: string;
  }>;
  hotel?: {
    name: string;
    nights: number;
    price: number;
  };
  activity?: {
    title: string;
    price: number;
  };
  relatedOffers?: string[];
  createdAt?: string;
}
```

## 🛠️ Développement

### Structure du projet

```plaintext
travel-hub/
├── docker-compose.yml      # Configuration Docker
├── mongo-init/             # Scripts d'initialisation MongoDB
├── neo4j-init/             # Scripts d'initialisation Neo4j
├── redis-init/             # Scripts d'initialisation Redis
├── src/
│   ├── app/                # Pages et routes Next.js
│   │   ├── api/            # Routes API
│   │   ├── offers/         # Pages des offres
│   │   └── page.tsx        # Page d'accueil
│   ├── components/         # Composants React
│   │   ├── ui/             # Composants UI réutilisables
│   │   └── ...
│   ├── lib/                # Utilitaires et types
│   │   ├── db.ts           # Connexion à la base de données
│   │   ├── types.ts        # Types TypeScript
│   │   └── utils.ts        # Fonctions utilitaires
│   └── scripts/            # Scripts utilitaires
```

### Commandes utiles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run start` - Démarre l'application en mode production
