# SmartSports - API Backend

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

Ce script va :
1. Parcourir les dossiers `src/exercices/` et `src/seances/`
2. Extraire les données des fichiers JS
3. Les insérer dans la base de données Supabase
4. Mapper les catégories, groupes musculaires, niveaux et types

### Structure attendue
```
src/
├── exercices/
│   ├── renforcement/
│   │   ├── haut_du_corps/
│   │   │   └── pompes.js
│   │   └── bas_du_corps/
│   └── mobilite/
│       └── chat_vache.js
└── seances/
    └── semaine1/
        ├── 2025-10-06.js
        └── Renaissance J2.js
```

---

## 🛠️ Développement

### Structure du projet
```
backend/
├── index.js                 # Point d'entrée principal
├── supabase.js             # Configuration Supabase
├── routes/                 # Routes API
│   ├── auth.js            # Authentification
│   ├── exercices.js       # API Exercices
│   ├── seances.js         # API Séances
│   └── sessions.js        # API Sessions
├── middleware/            # Middlewares
│   ├── auth.js           # Vérification JWT
│   └── google-auth.js    # OAuth Google
├── migration-import-data.js # Script de migration
├── test-apis.js          # Tests des APIs
└── database-structure.sql # Structure de la base
```

### Ajouter une nouvelle route
1. Créer le fichier dans `routes/`
2. Importer dans `index.js`
3. Ajouter les tests dans `test-apis.js`
4. Documenter dans ce README

### Variables d'environnement
- `SUPABASE_URL` - URL de votre projet Supabase
- `SUPABASE_SERVICE_KEY` - Clé de service Supabase
- `JWT_SECRET` - Secret pour signer les tokens JWT
- `NODE_ENV` - Environnement (development/production)
- `PORT` - Port du serveur (défaut: 5000)

---

## 📝 Notes importantes

### Sécurité
- Toutes les routes sensibles sont protégées par JWT
- Validation des données côté serveur
- Gestion des permissions (auteur/admin)
- CORS configuré pour les origines autorisées

### Performance
- Pagination sur toutes les listes
- Index sur les colonnes fréquemment utilisées
- Vues optimisées pour les requêtes complexes
- Cache des données de référence

### Base de données
- Structure complète dans `database-structure.sql`
- Triggers pour `updated_at`
- Vues pour les requêtes complexes
- Données initiales incluses

---

*Dernière mise à jour: 21/01/2025* 

# API Documentation

## Système d'Administration

### Configuration des administrateurs

Pour définir un utilisateur comme administrateur, modifiez directement la base de données :

```sql
-- Ajouter la colonne is_admin si elle n'existe pas
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Définir un utilisateur comme admin
UPDATE utilisateurs SET is_admin = true WHERE email = 'admin@example.com';
```

### Structure de la base de données

#### Table `utilisateurs`
- `id` : Identifiant unique (UUID)
- `email` : Email de l'utilisateur (unique)
- `nom` : Nom de l'utilisateur
- `password_hash` : Hash du mot de passe
- `is_admin` : Statut administrateur (boolean, défaut: false)
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

### Sécurité
- Seuls les utilisateurs avec `is_admin = true` peuvent accéder à l'interface admin
- Le bouton "Admin" n'apparaît que pour les utilisateurs admin
- L'interface admin est protégée par authentification
- Les actions de validation/suppression nécessitent un token valide

## Routes des exercices

### GET /exercices
Récupère tous les exercices avec filtres optionnels.

**Paramètres de requête :**
- `categorie` : Filtrer par catégorie
- `groupe_musculaire` : Filtrer par groupe musculaire  
- `niveau` : Filtrer par niveau
- `type` : Filtrer par type
- `search` : Recherche dans le nom et la description
- `is_validated` : Filtrer par statut de validation (true/false)
- `limit` : Nombre d'exercices à retourner (défaut: 50)
- `offset` : Offset pour la pagination (défaut: 0)

**Exemple :**
```
GET /exercices?is_validated=false&limit=10
```

### POST /exercices
Crée un nouvel exercice.

**Corps de la requête :**
```json
{
  "nom": "Nom de l'exercice",
  "description": "Description de l'exercice",
  "categorie_id": 1,
  "groupe_musculaire_id": 1,
  "niveau_id": 1,
  "type_id": 1,
  "duree_estimee": 30
}
```

### POST /exercices/:id/validate
Valide un exercice (interface admin).

**Headers requis :**
- `Authorization: Bearer <token>`

**Exemple :**
```
POST /exercices/123/validate
```

### DELETE /exercices/:id
Supprime un exercice (interface admin).

**Headers requis :**
- `Authorization: Bearer <token>`

## Interface Admin

L'interface admin est accessible via `/admin-exercices` et permet de :

1. **Voir tous les exercices** avec leur statut de validation
2. **Filtrer les exercices** par statut (en attente, validés, tous)
3. **Valider des exercices** en attente
4. **Rejeter et supprimer** des exercices non désirés

### Fonctionnalités de l'interface admin :

- **Filtres** : En attente, Validés, Tous
- **Actions** : Valider (✓) ou Rejeter (✗) pour les exercices en attente
- **Informations affichées** :
  - Nom et description de l'exercice
  - Statut de validation
  - Créateur et date de création
  - Validateur et date de validation (si validé)
  - Catégorie, groupe musculaire, niveau, durée

### Sécurité :
- Accès réservé aux utilisateurs connectés
- Vérification des permissions admin (à implémenter selon vos besoins)
- Authentification requise pour les actions de validation/suppression

## Structure de la base de données

### Table `exercices`
- `id` : Identifiant unique
- `nom` : Nom de l'exercice
- `description` : Description de l'exercice
- `categorie_id` : Référence vers la table catégories
- `groupe_musculaire_id` : Référence vers la table groupes_musculaires
- `niveau_id` : Référence vers la table niveaux
- `type_id` : Référence vers la table types
- `duree_estimee` : Durée estimée en secondes
- `created_by` : Email de l'utilisateur créateur
- `is_validated` : Statut de validation (boolean)
- `validated_by` : Email de l'admin validateur
- `validated_at` : Date de validation
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

### Vue `v_exercices_completes`
Vue qui joint toutes les tables pour récupérer les informations complètes des exercices. 