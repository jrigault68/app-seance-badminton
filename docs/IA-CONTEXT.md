# Contexte IA - App Séance Badminton

## Vue d'ensemble du projet

Cette application permet de créer, gérer et exécuter des séances d'entraînement de badminton avec un système de coaching vocal intégré. L'IA doit comprendre la structure technique et les spécificités du projet pour fournir une assistance pertinente.

## Architecture technique

### Backend
- **Framework** : Node.js avec Express
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : JWT + Google OAuth
- **Modules** : CommonJS (require/module.exports)
- **Démarrage** : `node index.js` (pas npm start)

### Frontend
- **Framework** : React + Vite
- **Styling** : Tailwind CSS
- **Design** : Inspiré de Home Assistant (minimaliste, transparent, FAB)
- **Thème** : Rouge/orange sur fond sombre

## Structure de données

### Exercices
- **ID** : Identifiant unique basé sur le nom
- **Catégories** : échauffement, mobilité, renforcement, étirement, cardio, gainage, récupération_active, ancrage
- **Groupes musculaires** : 17 groupes (corps entier, jambes, fessiers, etc.)
- **Niveaux actuels** : facile (1), intermédiaire (2), difficile (3), expert (4)
- **Types** : temps, répétitions, mouvement, mobilité, respiration, gainage, cardio, étirement

### Séances
- **Structure hiérarchique** : séances → blocs → exercices
- **Configuration** : séries, répétitions, temps, repos
- **Types** : exercice, instruction

## Système de difficulté

### Système actuel (6 notes sur 20)
Chaque exercice est évalué selon 6 aspects indépendants :

- **Force (0-20)** : Intensité musculaire et charge de travail
- **Cardio (0-20)** : Effort cardiovasculaire et respiratoire  
- **Technique (0-20)** : Complexité d'exécution et précision
- **Mobilité (0-20)** : Amplitude articulaire et flexibilité
- **Impact (0-20)** : Stress mécanique sur les articulations
- **Mentale (0-20)** : Concentration et endurance mentale

### Calcul du score global
Score pondéré selon l'importance pour le badminton :
```
Score global = (Force × 0.20 + Cardio × 0.25 + Technique × 0.20 + Mobilité × 0.15 + Impact × 0.10 + Mentale × 0.10)
```

### Catégories de difficulté
- **0-6** : Très facile
- **7-10** : Facile  
- **11-14** : Modéré
- **15-18** : Difficile
- **19-20** : Expert

### Calcul de difficulté globale d'une séance
```
Score_séance = Σ(Score_exercice × Poids_exercice) / Σ(Poids_exercice)

Où Poids_exercice = (séries × répétitions × temps_series) / durée_totale_séance
```

### Avantages du nouveau système
- **Précision** : Comparaison fine entre séances
- **Progression** : Suivi quantitatif de l'évolution
- **Génération IA** : Création de séances avec difficulté cible précise
- **Personnalisation** : Adaptation au niveau réel de l'utilisateur

## Spécificités techniques

### Variables d'environnement
- Déjà configurées dans le système
- Import direct depuis `process.env`
- Pas de fichier `.env` nécessaire

### Routes API
- Backend : `/api/...`
- Frontend : Pas de préfixe `/api`

### Gestion des erreurs
- Messages d'erreur clairs et informatifs
- Logs détaillés côté serveur
- Validation des données en amont

## Règles de développement

### Code
- Modifications ciblées uniquement (pas de régénération complète)
- Respect du style existant
- Documentation des changements

### UI/UX
- Design inspiré de Home Assistant
- Boutons transparents, FAB pour actions principales
- Thème rouge/orange sur fond sombre

### Données
- Descriptions d'exercices concises (pas de conseils)
- Conseils dans le champ dédié
- Format audio-friendly (tutoiement)

## Intégration IA

### Génération de contenu
- Respect strict des formats JSON
- Utilisation des IDs existants
- Validation des données générées

### Assistance utilisateur
- Suggestions contextuelles
- Aide à la création d'exercices/séances
- Validation et amélioration de contenu existant

## État du système

### Fonctionnalités opérationnelles
- ✅ Authentification et gestion utilisateurs
- ✅ CRUD exercices et séances
- ✅ Import/export JSON
- ✅ Exécution de séances avec coaching vocal
- ✅ Programmes d'entraînement
- ✅ Interface d'administration

### Améliorations en cours
- ✅ Système de difficulté précis (6 notes sur 20)
- ✅ Calcul automatique de difficulté des séances
- ✅ Suivi de progression quantitatif
- 🔄 Génération IA avec difficulté cible
- 🔄 Interface d'édition des scores
- 🔄 Analytics de progression

## Points d'attention

### Performance
- Optimisation des requêtes Supabase
- Cache des données fréquemment utilisées
- Pagination pour les listes volumineuses

### Sécurité
- Validation des données côté serveur
- Authentification JWT sécurisée
- Gestion des permissions utilisateur/admin

### Expérience utilisateur
- Interface responsive et accessible
- Feedback visuel et vocal
- Sauvegarde automatique des données 