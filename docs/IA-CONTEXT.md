# 🤖 CONTEXTE IA - Application Smart Sports

## 📋 Vue d'ensemble du projet

**Nom :** Smart Sports  
**Type :** Application web de génération de séances d'entraînement multi-sports  
**Stack :** React + Vite (Frontend) + Node.js/Express (Backend) + Supabase (Base de données)  
**Objectif :** Générer automatiquement des séances d'entraînement personnalisées pour tous les sports

## 🏗️ Architecture technique

### Frontend
- **Framework :** React 18 avec Vite
- **Styling :** Tailwind CSS
- **Navigation :** React Router
- **État global :** Context API (UserContext)
- **Structure :** Composants modulaires avec pages et screens séparés

### Backend
- **Framework :** Node.js avec Express
- **Port local :** 5000
- **Base de données :** Supabase (PostgreSQL)
- **Authentification :** Google OAuth via Supabase Auth
- **Déploiement :** Render.com
- **Middleware :** CORS, authentification, validation

### Base de données (Supabase)
- **Type :** PostgreSQL hébergé
- **Tables principales :** exercices, categories, groupes_musculaires, niveaux, types, seances, sessions
- **Authentification :** Supabase Auth avec Google OAuth
- **API :** REST API via Express + Supabase Client

## 🎯 Spécificités du projet

### 1. Gestion des exercices
- **111 exercices** répartis en 7 catégories (actuellement orientés badminton mais extensibles)
- **Structure des variantes :** JSON avec `plus_faciles` et `plus_difficiles`
- **Descriptions concises** sans conseils intégrés
- **Conseils séparés** dans un champ dédié
- **Niveaux :** Facile (1) → Intermédiaire (2) → Difficile (3) → Expert (4)

### 2. Catégories d'exercices
1. **Échauffement** (ID: 1) - 15 exercices - Préparation musculaire
2. **Mobilité** (ID: 2) - 12 exercices - Amplitude articulaire  
3. **Renforcement** (ID: 3) - 20 exercices - Développement force
4. **Étirements** (ID: 4) - 16 exercices - Assouplissement
5. **Cardio** (ID: 5) - 20 exercices - Endurance cardiovasculaire
6. **Gainage** (ID: 6) - 16 exercices - Stabilité du tronc
7. **Récupération active** (ID: 7) - 12 exercices - Détente

### 3. Gestion des séances
- **Génération automatique** basée sur le niveau et les préférences
- **Structure modulaire** avec transitions entre exercices
- **Suivi de progression** avec statistiques
- **Sauvegarde des sessions** complétées
- **Multi-sports** : Extensible pour tous les sports

### 4. Authentification
- **Google OAuth** via Supabase Auth
- **Pas de mot de passe** - uniquement Google
- **Sessions persistantes** avec refresh token
- **Profil utilisateur** avec préférences

## 🔧 Configuration et déploiement

### Variables d'environnement
**IMPORTANT :** Les variables d'environnement existent déjà dans le système. Utiliser l'import direct :
```javascript
// ✅ CORRECT - Import direct depuis process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// ❌ INCORRECT - Ne pas créer de .env
// Ne pas demander de créer des fichiers .env
```

### Variables disponibles
```env
# Supabase (déjà configurées)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth (déjà configurées)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Serveur
PORT=5000  # Port local
NODE_ENV=production
```

### Déploiement
- **Frontend :** Vercel (automatique via Git)
- **Backend :** Render.com (service web)
- **Base de données :** Supabase (hébergé)
- **Keep-alive :** Script pour maintenir le backend actif

## 📁 Structure des fichiers

```
app-seance-badminton/
├── backend/                 # API Express
│   ├── routes/             # Routes API
│   ├── middleware/         # Middleware auth
│   ├── supabase.js         # Configuration Supabase
│   └── index.js            # Serveur principal (port 5000)
├── src/                    # Frontend React
│   ├── components/         # Composants réutilisables
│   ├── pages/              # Pages principales
│   ├── screens/            # Écrans d'exercices
│   ├── services/           # Services API
│   ├── contexts/           # Context API
│   └── utils/              # Utilitaires
├── docs/                   # Documentation
│   ├── *.md               # Documentation des exercices
│   ├── insert-*.sql       # Scripts SQL d'exercices
│   └── deploy-*.sql       # Scripts de déploiement
└── public/                 # Assets statiques
```

## 🎨 Interface utilisateur

### Design
- **Thème :** Moderne et épuré
- **Couleurs :** Palette cohérente par catégorie
- **Responsive :** Mobile-first design
- **Animations :** Transitions fluides entre exercices

### Navigation
- **Bottom Navigation :** Accueil, Recherche, Profil
- **Header :** Titre dynamique selon la page
- **Transitions :** Écrans de transition entre exercices

### Composants clés
- **SeanceScreen :** Affichage des exercices en cours
- **ActiveExerciceScreen :** Exercice actuel avec timer
- **TransitionScreen :** Transition entre exercices
- **MoteurExecution :** Logique de progression

## 🔄 Flux de données

### Génération de séance
1. **Sélection catégories** par l'utilisateur
2. **Filtrage exercices** selon niveau et préférences
3. **Génération structure** avec transitions
4. **Sauvegarde séance** en base

### Exécution de séance
1. **Chargement séance** depuis l'API
2. **Progression automatique** avec timers
3. **Sauvegarde progression** en temps réel
4. **Statistiques finales** à la fin

## 🛠️ Développement

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Google Cloud (OAuth)

### Installation
```bash
# Backend (port 5000)
cd backend
npm install
npm run dev

# Frontend
cd ..
npm install
npm run dev
```

### Scripts utiles
```bash
# Déploiement exercices
cd docs
.\deploy-all-exercices.ps1

# Keep-alive backend
cd backend
node keep-alive.js
```

## 📊 Base de données Supabase

### Tables principales
```sql
-- Exercices
exercices (id, nom, description, categorie_id, niveau_id, ...)

-- Catégories
categories (id, nom, couleur, icone, ordre_affichage)

-- Groupes musculaires
groupes_musculaires (id, nom)

-- Niveaux
niveaux (id, nom, description)

-- Types d'exercices
types (id, nom, description)

-- Séances
seances (id, nom, description, exercices, ...)

-- Sessions utilisateur
sessions (id, user_id, seance_id, date_debut, date_fin, ...)
```

### Relations
- `exercices.categorie_id` → `categories.id`
- `exercices.groupe_musculaire_id` → `groupes_musculaires.id`
- `exercices.niveau_id` → `niveaux.id`
- `exercices.type_id` → `types.id`

## 🎯 Règles de développement

### Code
- **Modifications ciblées** : Éviter de régénérer des fichiers entiers
- **Descriptions concises** : Pas de conseils dans les descriptions d'exercices
- **Variantes structurées** : JSON avec `plus_faciles` et `plus_difficiles`
- **Conseils séparés** : Champ dédié pour les conseils

### Base de données
- **Pas de préfixe `/api`** : Routes frontend directes
- **Variables d'environnement** : Import direct depuis `process.env` (déjà configurées)
- **Supabase Client** : Utilisation du client officiel
- **Migrations** : Scripts SQL pour les changements de structure

### Interface
- **Mobile-first** : Design responsive prioritaire
- **Transitions fluides** : Animations entre exercices
- **Feedback utilisateur** : Indicateurs de progression
- **Accessibilité** : Support des lecteurs d'écran

### Commandes terminal
- **❌ NE PAS utiliser `&&`** : Les commandes doivent être séparées
- **✅ Utiliser des commandes séquentielles** : Une commande à la fois
- **✅ Vérifier chaque étape** : S'assurer que chaque commande fonctionne

## 🔍 Points d'attention

### Performance
- **Lazy loading** des composants
- **Optimisation images** et assets
- **Cache API** pour les exercices
- **Keep-alive** pour le backend

### Sécurité
- **Authentification** obligatoire pour les séances
- **Validation** côté serveur
- **CORS** configuré correctement
- **Variables d'environnement** sécurisées (déjà configurées)

### Maintenance
- **Logs détaillés** pour le debugging
- **Backup automatique** avant déploiements
- **Tests de validation** post-déploiement
- **Documentation** à jour (mise à jour automatique)

## 📈 Évolutions futures

### Fonctionnalités prévues
- **Multi-sports** : Extension pour tous les sports
- **Séances personnalisées** par entraîneur
- **Progression avancée** avec objectifs
- **Partage de séances** entre utilisateurs
- **Analytics détaillées** de performance

### Améliorations techniques
- **PWA** (Progressive Web App)
- **Offline mode** pour les séances
- **Notifications** push
- **Intégration** avec wearables

## 🔄 Mise à jour de la documentation

### Règles de mise à jour
- **Mise à jour automatique** : Dès qu'une information change
- **Ajout d'informations** : Nouvelles spécificités, configurations
- **Correction d'erreurs** : Ports, noms, configurations
- **Évolution du projet** : Nouvelles fonctionnalités, changements d'architecture

### Exemples de mises à jour nécessaires
- Changement de port (5000)
- Changement de nom (Smart Sports)
- Nouvelles variables d'environnement
- Nouvelles règles de développement
- Changements d'architecture

---

**Dernière mise à jour :** 22/06/2025  
**Version :** 1.1  
**Maintenu par :** Assistant IA  
**Port local :** 5000  
**Nom de l'app :** Smart Sports  
**Multi-sports :** Oui 