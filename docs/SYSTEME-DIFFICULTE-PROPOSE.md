# Système de Difficulté Proposé - App Séance Badminton

## 🎯 Objectif

Remplacer le système actuel de 4 niveaux (facile, intermédiaire, difficile, expert) par un système de score de difficulté sur 100 points, permettant une comparaison précise entre séances et un suivi de progression quantitatif.

## 📊 Système actuel vs nouveau

### Système actuel (limitations)
- **4 niveaux** : facile (1), intermédiaire (2), difficile (3), expert (4)
- **Problèmes** :
  - Pas assez précis pour la comparaison
  - Difficile de mesurer la progression
  - Génération IA limitée
  - Pas de calcul automatique de difficulté des séances

### Nouveau système (avantages)
- **Score 0-100** : Précision fine pour chaque exercice
- **Calcul automatique** : Difficulté des séances basée sur les exercices
- **Comparaison quantitative** : "Cette séance est 15 points plus difficile"
- **Suivi de progression** : Évolution mesurable du niveau utilisateur

## 🔧 Spécifications techniques

### Structure de la base de données

#### Modification de la table `exercices`
```sql
-- Ajouter le champ score_difficulte
ALTER TABLE exercices ADD COLUMN score_difficulte INTEGER DEFAULT 25;

-- Ajouter des champs pour les facteurs de difficulté
ALTER TABLE exercices ADD COLUMN complexite_technique INTEGER DEFAULT 5;
ALTER TABLE exercices ADD COLUMN intensite_physique INTEGER DEFAULT 5;
ALTER TABLE exercices ADD COLUMN endurance_requise INTEGER DEFAULT 5;
ALTER TABLE exercices ADD COLUMN equilibre_coordination INTEGER DEFAULT 5;
```

#### Modification de la table `seances`
```sql
-- Ajouter le champ score_difficulte_calcule
ALTER TABLE seances ADD COLUMN score_difficulte_calcule INTEGER DEFAULT 25;

-- Ajouter le champ score_difficulte_cible (pour la génération IA)
ALTER TABLE seances ADD COLUMN score_difficulte_cible INTEGER DEFAULT 25;
```

### Calcul du score de difficulté

#### Pour un exercice (0-100 points)
```
Score_exercice = Complexité_technique + Intensité_physique + Endurance_requise + Équilibre_coordination

Où :
- Complexité_technique : 0-30 points
- Intensité_physique : 0-30 points  
- Endurance_requise : 0-20 points
- Équilibre_coordination : 0-20 points
```

#### Pour une séance (0-100 points)
```
Score_séance = Σ(Score_exercice × Poids_exercice) / Σ(Poids_exercice)

Où Poids_exercice = (séries × répétitions × temps_series) / durée_totale_séance
```

### Échelles de référence

#### Complexité technique (0-30)
- **0-5** : Mouvements basiques (marche, étirements simples)
- **6-10** : Mouvements coordonnés (squats, pompes genoux)
- **11-15** : Techniques intermédiaires (burpees, planches)
- **16-20** : Techniques avancées (pompes strictes, fentes sautées)
- **21-25** : Techniques complexes (muscle-ups, handstand)
- **26-30** : Techniques expert (planche, levers)

#### Intensité physique (0-30)
- **0-5** : Très léger (étirements, respiration)
- **6-10** : Léger (marche, mobilité)
- **11-15** : Modéré (squats, gainage)
- **16-20** : Intense (burpees, sprints)
- **21-25** : Très intense (circuits, HIIT)
- **26-30** : Extrême (compétition, max effort)

#### Endurance requise (0-20)
- **0-5** : Très court (< 30 secondes)
- **6-10** : Court (30-60 secondes)
- **11-15** : Moyen (1-3 minutes)
- **16-20** : Long (> 3 minutes)

#### Équilibre/coordination (0-20)
- **0-5** : Aucun (exercices statiques)
- **6-10** : Léger (mouvements simples)
- **11-15** : Modéré (coordination bras-jambes)
- **16-20** : Élevé (équilibre, coordination complexe)

## 🚀 Plan d'implémentation

### Phase 1 : Migration de la base de données
1. **Ajout des colonnes** dans les tables `exercices` et `seances`
2. **Migration des données existantes** :
   - Facile (1) → Score 15-25
   - Intermédiaire (2) → Score 30-45
   - Difficile (3) → Score 50-70
   - Expert (4) → Score 75-90
3. **Calcul initial** des scores pour tous les exercices existants

### Phase 2 : Backend
1. **API de calcul** de difficulté des séances
2. **Fonctions utilitaires** pour le calcul des scores
3. **Migration des routes** existantes pour supporter les nouveaux champs
4. **Validation** des scores lors de la création/modification

### Phase 3 : Frontend
1. **Interface de saisie** des facteurs de difficulté
2. **Affichage des scores** dans les listes et détails
3. **Comparaison visuelle** entre séances
4. **Graphiques de progression** pour l'utilisateur

### Phase 4 : IA et génération
1. **Génération de séances** avec difficulté cible
2. **Suggestions d'exercices** basées sur le niveau utilisateur
3. **Adaptation automatique** des séances selon la progression

## 📋 Exemples concrets

### Exercice : "Pompes genoux"
```
Complexité_technique : 8 (mouvement coordonné)
Intensité_physique : 12 (modéré)
Endurance_requise : 8 (court)
Équilibre_coordination : 6 (léger)
Score_total : 34/100
```

### Exercice : "Burpees"
```
Complexité_technique : 18 (technique avancée)
Intensité_physique : 25 (très intense)
Endurance_requise : 15 (moyen)
Équilibre_coordination : 12 (modéré)
Score_total : 70/100
```

### Séance : "Échauffement complet"
```
Exercices :
- Course sur place (score: 20, poids: 0.1)
- Rotation épaules (score: 15, poids: 0.05)
- Squats air (score: 35, poids: 0.15)
- Pompes genoux (score: 34, poids: 0.2)

Score_séance = (20×0.1 + 15×0.05 + 35×0.15 + 34×0.2) / (0.1 + 0.05 + 0.15 + 0.2) = 28.5/100
```

## 🎯 Avantages pour l'utilisateur

### Suivi de progression
- **Niveau actuel** : Score moyen des séances réalisées
- **Évolution** : Graphique de progression sur le temps
- **Objectifs** : Définition de scores cibles à atteindre

### Personnalisation
- **Séances adaptées** : Génération selon le niveau réel
- **Progression graduelle** : Augmentation de 5-10 points par semaine
- **Variété** : Mélange d'exercices de différents niveaux

### Comparaison
- **Entre séances** : "Cette séance est 15 points plus difficile"
- **Entre utilisateurs** : Classements basés sur les scores
- **Recommandations** : Suggestions de séances similaires

## 🔄 Migration et compatibilité

### Rétrocompatibilité
- **Ancien système** : Maintien des niveaux 1-4 pour l'affichage
- **Conversion automatique** : Mapping niveau → score
- **Interface hybride** : Affichage des deux systèmes pendant la transition

### Migration des données
- **Script de migration** : Calcul automatique des scores
- **Validation** : Vérification de la cohérence des données
- **Rollback** : Possibilité de revenir à l'ancien système

## 📈 Métriques et analytics

### Suivi utilisateur
- **Score moyen** par session
- **Progression** sur 30/60/90 jours
- **Séances préférées** par niveau de difficulté

### Optimisation
- **Séances populaires** par score
- **Abandon** selon la difficulté
- **Performance** vs difficulté cible

## 🎨 Interface utilisateur

### Affichage des scores
- **Badges colorés** : Vert (facile), Orange (moyen), Rouge (difficile)
- **Barres de progression** : Visualisation du niveau
- **Comparaisons** : "Plus facile que votre séance précédente"

### Saisie des facteurs
- **Sliders** pour chaque facteur de difficulté
- **Prévisualisation** du score total
- **Suggestions** basées sur les exercices similaires

### Graphiques de progression
- **Évolution temporelle** du score moyen
- **Objectifs** et seuils à atteindre
- **Recommandations** de progression
