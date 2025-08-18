# Système de Difficulté Final - 6 Notes sur 20

## 🎯 Vue d'ensemble

Système de difficulté basé sur 6 notes indépendantes de 0 à 20, permettant une évaluation précise et différenciée de chaque exercice selon différents aspects.

## 📊 Les 6 notes

### **1. Force (0-20)**
Évaluation de l'intensité musculaire et de la charge de travail.

- **0-4** : Aucune charge (étirements, mobilité, respiration)
- **5-8** : Poids du corps léger (squats air, marche)
- **9-12** : Poids du corps modéré (pompes genoux, gainage)
- **13-16** : Poids du corps intense (pompes strictes, pistols)
- **17-20** : Charge externe (haltères, barres, résistance)

### **2. Cardio (0-20)**
Évaluation de l'effort cardiovasculaire et respiratoire.

- **0-4** : Aucun effort cardiaque (exercices statiques)
- **5-8** : Léger (marche, mobilité, étirements)
- **9-12** : Modéré (squats, gainage, exercices lents)
- **13-16** : Intense (burpees, sprints, circuits)
- **17-20** : Extrême (HIIT, compétition, efforts maximaux)

### **3. Technique (0-20)**
Évaluation de la complexité d'exécution et de la précision requise.

- **0-4** : Mouvement basique (marche, étirements simples)
- **5-8** : Simple (squats, pompes genoux, exercices de base)
- **9-12** : Moyen (pompes strictes, fentes, gainage avancé)
- **13-16** : Complexe (muscle-ups, handstand, mouvements techniques)
- **17-20** : Expert (planche, levers, mouvements de gymnastique)

### **4. Mobilité (0-20)**
Évaluation de l'amplitude articulaire et de la flexibilité requise.

- **0-4** : Aucune mobilité requise (exercices statiques)
- **5-8** : Mobilité basique (mouvements simples)
- **9-12** : Mobilité modérée (étirements, mouvements d'amplitude)
- **13-16** : Mobilité avancée (positions complexes, flexibilité)
- **17-20** : Mobilité extrême (contorsions, positions de yoga avancées)

### **5. Impact (0-20)**
Évaluation de l'impact sur les articulations et du stress mécanique.

- **0-4** : Aucun impact (exercices au sol, statiques)
- **5-8** : Impact léger (marche, exercices debout)
- **9-12** : Impact modéré (squats, mouvements dynamiques)
- **13-16** : Impact élevé (sauts, rebonds)
- **17-20** : Impact extrême (plyométrie, sauts hauts)

### **6. Mentale (0-20)**
Évaluation de la concentration et de l'endurance mentale requise.

- **0-4** : Aucune concentration requise (mouvements automatiques)
- **5-8** : Concentration basique (exercices simples)
- **9-12** : Concentration modérée (exercices coordonnés)
- **13-16** : Concentration élevée (exercices complexes, longs)
- **17-20** : Concentration extrême (exercices très longs, techniques complexes)

## 📊 Exemples concrets

### **Burpees**
```
💪 Force: 12/20 (poids du corps modéré)
🏃‍♂️ Cardio: 18/20 (très intense)
🎯 Technique: 8/20 (mouvement simple)
🔄 Mobilité: 6/20 (mobilité basique)
💥 Impact: 14/20 (sauts modérés)
🧠 Mentale: 12/20 (concentration modérée)
```

### **Planche**
```
💪 Force: 16/20 (gainage intense)
🏃‍♂️ Cardio: 3/20 (statique)
🎯 Technique: 14/20 (position précise)
🔄 Mobilité: 4/20 (peu de mobilité)
💥 Impact: 2/20 (aucun impact)
🧠 Mentale: 16/20 (concentration élevée)
```

### **Squats air**
```
💪 Force: 8/20 (poids du corps léger)
🏃‍♂️ Cardio: 6/20 (léger)
🎯 Technique: 8/20 (mouvement simple)
🔄 Mobilité: 8/20 (mobilité basique)
💥 Impact: 6/20 (impact léger)
🧠 Mentale: 6/20 (concentration basique)
```

### **Muscle-ups**
```
💪 Force: 18/20 (charge intense)
🏃‍♂️ Cardio: 12/20 (modéré)
🎯 Technique: 18/20 (très technique)
🔄 Mobilité: 14/20 (mobilité avancée)
💥 Impact: 8/20 (impact léger)
🧠 Mentale: 16/20 (concentration élevée)
```

## 🔧 Structure de la base de données

```sql
-- Notes sur 20 (déjà ajoutées)
note_force INTEGER DEFAULT 0,
note_cardio INTEGER DEFAULT 0,
note_technique INTEGER DEFAULT 0,
note_mobilite INTEGER DEFAULT 0,
note_impact INTEGER DEFAULT 0,
note_mentale INTEGER DEFAULT 0
```

## 📈 Calcul du score global

### **Moyenne simple**
```sql
score_global = (note_force + note_cardio + note_technique + note_mobilite + note_impact + note_mentale) / 6
```

### **Moyenne pondérée (recommandée)**
```sql
-- Pondération selon l'importance pour le badminton
score_global = (
  note_force * 0.20 +
  note_cardio * 0.25 +
  note_technique * 0.20 +
  note_mobilite * 0.15 +
  note_impact * 0.10 +
  note_mentale * 0.10
)
```

## 🎨 Interface utilisateur

### **Affichage compact**
```
💪 12  🏃‍♂️ 18  🎯 8  🔄 6  💥 14  🧠 12
```

### **Affichage détaillé**
```
Difficulté par aspect :
• Force : ████████████ (12/20) - Modérée
• Cardio : ██████████████████ (18/20) - Très intense
• Technique : ████████ (8/20) - Simple
• Mobilité : ██████ (6/20) - Basique
• Impact : ████████████████ (14/20) - Modéré
• Mentale : ████████████ (12/20) - Modérée

Score global : 11.7/20 (Modéré)
```

## 🚀 Avantages du système

### **1. Précision maximale**
- 21 niveaux par aspect (0-20)
- Différenciation fine entre variantes
- Évaluation complète de chaque exercice

### **2. Flexibilité utilisateur**
- Filtrage par aspect spécifique
- Comparaison ciblée
- Progression différenciée

### **3. Génération IA précise**
```
"Génère une séance cardio 15/20, technique 8/20"
"Exercice force 12/20, impact 6/20"
"Séance mobilité 14/20, mentale 10/20"
```

### **4. Personnalisation**
- L'utilisateur peut avoir des préférences par aspect
- Recommandations ciblées selon les objectifs
- Suivi de progression par compétence

## 🔄 Migration depuis l'ancien système

### **Mapping des niveaux existants**
```
Facile (1) → Notes: 4-8 selon l'aspect
Intermédiaire (2) → Notes: 8-12 selon l'aspect
Difficile (3) → Notes: 12-16 selon l'aspect
Expert (4) → Notes: 16-20 selon l'aspect
```

## 📊 Catégories de difficulté globale

```
0-6 : Très facile
7-10 : Facile
11-14 : Modéré
15-18 : Difficile
19-20 : Expert
```

## 🎯 Utilisation dans l'application

### **Filtrage des exercices**
- Par note minimale/maximale
- Par aspect spécifique
- Combinaison de critères

### **Comparaison de séances**
- Score global de chaque séance
- Répartition par aspect
- Recommandations personnalisées

### **Génération IA**
- Cibles précises par aspect
- Séances équilibrées
- Progression adaptée
