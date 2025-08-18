# Template d'Exercice 📝

## Informations de base (champs de la base de données)

**id :** [ID unique généré automatiquement à partir du nom]  
**nom :** [Nom de l'exercice]  
**description :** [Description complète en phrases parlées pour l'audio - TUTOIEMENT]  
**position_depart :** [Position de départ en phrases parlées - TUTOIEMENT]  
**famille_id :** [ID de la famille d'exercices - voir liste ci-dessous]  
**sous_categories_ids :** [Array d'UUIDs des sous-catégories - voir liste ci-dessous]  
**zones_specifiques_ids :** [Array d'UUIDs des zones spécifiques - voir liste ci-dessous]  
**materiel :** [Array JSON des matériaux nécessaires]  
**erreurs :** [Array JSON des erreurs communes à éviter]  
**focus_zone :** [Array JSON des zones à surveiller]  
**image_url :** [URL de l'image de l'exercice]  
**video_url :** [URL de la vidéo de l'exercice]  
**duree_estimee :** [Durée estimée en secondes pour 1 répétition]  
**calories_estimees :** [Calories estimées pour 1 répétition]  
**muscles_sollicites :** [Array JSON des muscles sollicités]  
**variantes :** [Objet JSON avec plus_faciles et plus_difficiles]  
**conseils :** [Array JSON des conseils d'exécution]

## Notes de difficulté (0-20 pour chaque aspect)

**note_force :** [Note de difficulté force (0-20) : intensité musculaire et charge de travail]  
**note_cardio :** [Note de difficulté cardio (0-20) : effort cardiovasculaire et respiratoire]  
**note_technique :** [Note de difficulté technique (0-20) : complexité d'exécution et précision]  
**note_mobilite :** [Note de difficulté mobilité (0-20) : amplitude articulaire et flexibilité]  
**note_impact :** [Note de difficulté impact (0-20) : stress mécanique sur les articulations]  
**note_mentale :** [Note de difficulté mentale (0-20) : concentration et endurance mentale]

## Références des IDs

### Zones du corps et zones spécifiques (zones_corps + zones_specifiques)

#### Muscles bas du corps
- quadriceps
- ischio_jambiers
- fessiers
- mollets
- adducteurs

#### Muscles haut du corps
- pectoraux
- dorsaux
- deltoides
- biceps
- triceps
- abdominaux
- avant_bras
- trapezes

#### Articulations
- genoux
- chevilles
- hanches
- epaules
- coudes
- poignets
- colonne_vertebrale

#### Tendons et ligaments
- tendons_achille
- ligaments_genoux

#### Système cardiovasculaire
- coeur
- poumons

#### Système nerveux
- coordination
- proprioception

### Familles d'exercices (familles_exercices)
- UUID: [UUID de la famille d'exercices]
- Voir la liste complète dans l'application

### Sous-catégories (sous_categories)
Les sous-catégories sont organisées par catégories principales :

#### Renforcement
- pliométrie
- force_pure
- endurance_musculaire
- isométrique
- dynamique

#### Cardio
- haute_intensité
- endurance
- intervalle
- continu

#### Mobilité
- étirement_dynamique
- étirement_statique
- mobilité_articulaire
- flexibilité

#### Stabilisation
- gainage
- équilibre
- proprioception
- renforcement_profond

#### Récupération
- récupération_active
- respiration
- relaxation
- étirement_doux

## Exemple de structure JSON

```json
{
  "id": "pompes_renforcement",
  "nom": "Pompes",
  "description": "Tu te mets en position de planche, les mains au sol légèrement plus écartées que tes épaules. Tu descends ton corps en pliant les coudes, puis tu remontes en poussant sur tes bras.",
  "position_depart": "Tu commences en position de planche, le corps aligné de la tête aux pieds.",
  "zones_specifiques_ids": ["uuid-pectoraux", "uuid-triceps"],
  "famille_id": "uuid-de-la-famille-pompes",
  "sous_categories_ids": ["uuid-renforcement", "uuid-dynamique"],
  "note_force": 12,
  "note_cardio": 8,
  "note_technique": 6,
  "note_mobilite": 4,
  "note_impact": 3,
  "note_mentale": 5,
  "duree_estimee": 60,
  "calories_estimees": 5,
  "materiel": [],
  "erreurs": [
    "Ne pas garder le corps aligné",
    "Laisser les hanches s'affaisser",
    "Ne pas descendre suffisamment"
  ],
  "focus_zone": [
    "Maintenir l'alignement du corps",
    "Contrôler la descente",
    "Engager les abdominaux"
  ],
  "muscles_sollicites": ["pectoraux", "triceps", "épaules"],
  "conseils": [
    "Garde ton corps bien aligné",
    "Descends lentement et de manière contrôlée",
    "Engage tes abdominaux pour maintenir la position"
  ]
}
```

## Notes importantes

- Les **sous-catégories** remplacent les anciens champs `categorie_id`, `type_id`, et `niveau_id`
- Un exercice peut avoir **plusieurs sous-catégories** (ex: pliométrie + haute_intensité)
- Les **notes de difficulté** sont sur une échelle de 0 à 20 pour chaque aspect
- Les **UUIDs** sont générés automatiquement par la base de données
- Les **arrays JSON** doivent être des tableaux valides même s'ils sont vides 