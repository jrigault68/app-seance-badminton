# SmartSports - API Backend

> **ℹ️ Note importante :**
> 
> Le backend fonctionne en **CommonJS** (utilise `require`/`module.exports`).
> - **Ne pas ajouter `"type": "module"` dans le `package.json`**
> - **Ne pas utiliser `import ... from ...` ni `export default ...`**
> - **Toujours utiliser `require(...)` et `module.exports`**
> - **Pour démarrer le backend, utiliser :**
>   - `node index.js` (ou `node start-render.js` pour Render)
> - **Si besoin de passer à ES modules, il faudra migrer tout le backend d'un coup.**

## 🚀 Démarrage rapide

### Installation des dépendances
```bash
cd backend
npm install
```

### Variables d'environnement
Créer un fichier `.env` avec :
```env
SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_KEY=votre_clé_service_supabase
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
```

### Lancer le serveur
```bash
# Production
npm start

# Développement (avec nodemon)
npm run dev

# Tests des APIs
npm test

# Migration des données
npm run migrate
```

## 📚 Documentation des APIs

### Base URL
```
http://localhost:5000
```

### Authentification
La plupart des endpoints nécessitent un token JWT dans les cookies.
Les endpoints publics sont marqués avec 🔓.

---

## 🏥 Health Checks

### GET /health
🔓 **Public** - Vérifier l'état du serveur

**Réponse :**
```json
{
  "status": "OK",
  "timestamp": "2025-01-21T15:00:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

### GET /supabase-ping
🔓 **Public** - Vérifier la connexion Supabase

**Réponse :**
```json
{
  "status": "OK",
  "supabase": "active",
  "timestamp": "2025-01-21T15:00:00.000Z"
}
```

---

## 💪 API Exercices

### GET /api/exercices
🔓 **Public** - Récupérer tous les exercices

**Paramètres de requête :**
- `categorie` (string) - Filtrer par catégorie
- `groupe_musculaire` (string) - Filtrer par groupe musculaire
- `niveau` (string) - Filtrer par niveau
- `type` (string) - Filtrer par type
- `search` (string) - Recherche dans nom et description
- `limit` (number, défaut: 50) - Nombre d'éléments par page
- `offset` (number, défaut: 0) - Décalage pour la pagination

**Réponse :**
```json
{
  "exercices": [
    {
      "id": "pompes",
      "nom": "Pompes",
      "description": "Exercice de renforcement...",
      "categorie_nom": "renforcement",
      "groupe_musculaire_nom": "pectoraux",
      "niveau_nom": "intermédiaire",
      "type_nom": "repetitions",
      "duree_estimee": 60,
      "calories_estimees": 5
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 150
  }
}
```

### GET /api/exercices/:id
🔓 **Public** - Récupérer un exercice par ID

**Réponse :**
```json
{
  "exercice": {
    "id": "pompes",
    "nom": "Pompes",
    "description": "Exercice de renforcement...",
    "position_depart": "Position de départ...",
    "materiel": [],
    "erreurs": [],
    "focus_zone": [],
    "image_url": null,
    "video_url": null,
    "duree_estimee": 60,
    "calories_estimees": 5,
    "muscles_sollicites": [],
    "variantes": [],
    "conseils": []
  }
}
```

### GET /api/exercices/categories/list
🔓 **Public** - Récupérer toutes les catégories

**Réponse :**
```json
{
  "categories": [
    {
      "id": 1,
      "nom": "échauffement",
      "description": "Exercices pour préparer le corps",
      "couleur": "#10B981",
      "icone": "🔥",
      "ordre_affichage": 1
    }
  ]
}
```

### GET /api/exercices/groupes/list
🔓 **Public** - Récupérer tous les groupes musculaires

### GET /api/exercices/niveaux/list
🔓 **Public** - Récupérer tous les niveaux

### GET /api/exercices/types/list
🔓 **Public** - Récupérer tous les types

### POST /api/exercices
🔒 **Admin** - Créer un nouvel exercice

**Corps de la requête :**
```json
{
  "id": "nouvel_exercice",
  "nom": "Nouvel exercice",
  "description": "Description de l'exercice",
  "position_depart": "Position de départ",
  "categorie_id": 1,
  "groupe_musculaire_id": 1,
  "niveau_id": 1,
  "type_id": 1,
  "materiel": [],
  "erreurs": [],
  "focus_zone": [],
  "image_url": null,
  "video_url": null,
  "duree_estimee": 60,
  "calories_estimees": 5,
  "muscles_sollicites": [],
  "variantes": [],
  "conseils": []
}
```

### PUT /api/exercices/:id
🔒 **Admin** - Mettre à jour un exercice

### DELETE /api/exercices/:id
🔒 **Admin** - Supprimer un exercice

---

## 🏋️ API Séances

### GET /api/seances
🔓 **Public** - Récupérer toutes les séances

**Paramètres de requête :**
- `niveau` (string) - Filtrer par niveau
- `type_seance` (string) - Filtrer par type de séance
- `categorie` (string) - Filtrer par catégorie
- `search` (string) - Recherche dans nom et description
- `limit` (number, défaut: 20) - Nombre d'éléments par page
- `offset` (number, défaut: 0) - Décalage pour la pagination
- `est_publique` (boolean, défaut: true) - Filtrer par visibilité

**Réponse :**
```json
{
  "seances": [
    {
      "id": "seance_1",
      "nom": "Séance de renforcement",
      "description": "Séance complète de renforcement",
      "niveau_nom": "intermédiaire",
      "niveau_couleur": "#F59E0B",
      "type_seance": "renforcement",
      "categories": ["renforcement", "cardio"],
      "objectifs": ["force", "endurance"],
      "duree_estimee": 45,
      "calories_estimees": 200,
      "materiel_requis": [],
      "structure": {},
      "auteur_pseudo": "coach123"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 50
  }
}
```

### GET /api/seances/:id
🔓 **Public** - Récupérer une séance par ID

### POST /api/seances
🔒 **Authentifié** - Créer une nouvelle séance

**Corps de la requête :**
```json
{
  "id": "ma_seance",
  "nom": "Ma séance personnalisée",
  "description": "Description de la séance",
  "niveau_id": 1,
  "type_seance": "renforcement",
  "categories": ["renforcement"],
  "objectifs": ["force"],
  "duree_estimee": 45,
  "calories_estimees": 200,
  "materiel_requis": [],
  "structure": {
    "blocs": [
      {
        "nom": "Échauffement",
        "exercices": [
          {
            "id": "pompes",
            "series": 3,
            "repetitions": 10,
            "temps_series": 60,
            "temps_par_repetition": 2,
            "temps_repos_series": 90,
            "temps_repos_exercice": 120
          }
        ]
      }
    ]
  },
  "notes": "Notes personnelles",
  "tags": ["personnel"],
  "est_publique": false
}
```

### POST /api/seances/personnalisees
🔒 **Authentifié** - Créer une séance personnalisée

### GET /api/seances/personnalisees
🔒 **Authentifié** - Récupérer les séances personnalisées de l'utilisateur

### PUT /api/seances/:id
🔒 **Auteur/Admin** - Mettre à jour une séance

### DELETE /api/seances/:id
🔒 **Auteur/Admin** - Supprimer une séance

---

## ⏱️ API Sessions d'entraînement

### GET /api/sessions
🔒 **Authentifié** - Récupérer les sessions de l'utilisateur

### POST /api/sessions
🔒 **Authentifié** - Créer une nouvelle session

### GET /api/sessions/:id
🔒 **Authentifié** - Récupérer une session par ID

### PUT /api/sessions/:id
🔒 **Authentifié** - Mettre à jour une session

### DELETE /api/sessions/:id
🔒 **Authentifié** - Supprimer une session

---

## 🔐 Authentification

### Structure du token JWT
```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "pseudo": "user123",
  "isAdmin": false,
  "iat": 1642780800,
  "exp": 1642867200
}
```

### Gestion des erreurs
```json
{
  "error": "Description de l'erreur",
  "details": "Détails techniques (optionnel)"
}
```

### Codes de statut HTTP
- `200` - Succès
- `201` - Créé avec succès
- `400` - Données invalides
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

---

## 🧪 Tests

### Lancer les tests
```bash
npm test
```

### Tests disponibles
- Health check du serveur
- Connexion Supabase
- API Exercices (CRUD + filtres)
- API Séances (CRUD + filtres)
- API Sessions (protection d'authentification)
- Tests des filtres et recherche

---

## 📊 Migration des données

### Importer les données existantes
```bash
npm run migrate
```