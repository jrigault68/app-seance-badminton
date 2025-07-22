# Template d'Exercice 📝

## Informations de base (champs de la base de données)

**id :** [ID unique généré automatiquement à partir du nom]  
**nom :** [Nom de l'exercice]  
**description :** [Description complète en phrases parlées pour l'audio - TUTOIEMENT]  
**position_depart :** [Position de départ en phrases parlées - TUTOIEMENT]  
**categorie_id :** [ID de la catégorie - voir liste ci-dessous]  
**groupe_musculaire_id :** [ID du groupe musculaire - voir liste ci-dessous]  
**niveau_id :** [ID du niveau - voir liste ci-dessous]  
**type_id :** [ID du type - voir liste ci-dessous]  
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

## Références des IDs

### Catégories (categories_exercices)
- 1: échauffement
- 2: mobilité  
- 3: renforcement
- 4: étirement
- 5: cardio
- 6: gainage
- 7: récupération_active
- 8: ancrage

### Groupes musculaires (groupes_musculaires)
- 1: corps entier
- 2: jambes
- 3: fessiers
- 4: cuisses
- 5: mollets
- 6: abdominaux
- 7: dos
- 8: pectoraux
- 9: épaules
- 10: bras
- 11: triceps
- 12: biceps
- 13: avant-bras
- 14: tronc
- 15: colonne vertébrale
- 16: hanches
- 17: cheville

### Niveaux (niveaux_difficulte)
- 1: facile
- 2: intermédiaire
- 3: difficile
- 4: expert

### Types (types_exercices)
- 1: temps
- 2: repetitions
- 3: mouvement
- 4: mobilité
- 5: respiration
- 6: gainage
- 7: cardio
- 8: etirement

## Exemple de remplissage

### Informations de base
**id :** marche_active_sur_place  
**nom :** Marche active sur place  
**description :** "Lève alternativement tes genoux vers ta poitrine en gardant le dos droit."  
**position_depart :** "Debout, les pieds écartés de la largeur des hanches, les bras le long du corps."  
**categorie_id :** 1  
**groupe_musculaire_id :** 1  
**niveau_id :** 1  
**type_id :** 1  
**materiel :** []  
**erreurs :** ["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas tes genoux trop haut"]  
**focus_zone :** ["Tu devrais sentir ton cardio monter progressivement", "Concentre-toi sur ta coordination bras-jambes", "Sens tes jambes s'échauffer"]  
**image_url :** null  
**video_url :** null  
**duree_estimee :** 3  
**calories_estimees :** 0.5  
**muscles_sollicites :** ["Quadriceps", "Fessiers", "Mollets", "Abdominaux"]  
**variantes :** [Objet JSON avec plus_faciles et plus_difficiles]  
**conseils :** ["Concentre-toi sur ta respiration régulière", "Garde ton dos bien droit", "Maintiens un rythme constant"]  

## Instructions pour la rédaction

### Position de départ
- **Format :** Une phrase claire et concise
- **Style :** Descriptif et précis (TUTOIEMENT)
- **Exemple :** "Debout, les jambes écartées de la largeur des hanches..."
- **Objectif :** Permettre à l'utilisateur de se positionner correctement

### Description
- **Format :** Phrases complètes et naturelles
- **Style :** Direct et instructif (TUTOIEMENT)
- **Important :** Ne pas reprendre les informations de la position de départ
- **Important :** Ne pas inclure de conseils (respiration, posture, etc.) qui sont déjà dans les champs dédiés
- **Longueur :** 1-2 phrases maximum, très concises
- **Objectif :** Être lu à haute voix par l'application
- **Exemple :** "Tourne ton tronc vers la droite puis vers la gauche en gardant tes hanches fixes." (au lieu de "Tourne ton tronc vers la droite puis vers la gauche en gardant tes hanches fixes. Garde ton dos droit et respire régulièrement.")

### Erreurs communes
- **Format :** Array de phrases complètes
- **Style :** Direct et positif (utiliser "Ne bloque pas..." au lieu de "Ne pas bloquer...")
- **Exemple :** ["Ne bloque pas ta respiration", "Ne courbe pas ton dos"]

### Focus zones
- **Format :** Array de phrases complètes
- **Style :** Descriptif et encourageant (TUTOIEMENT)
- **Exemple :** ["Tu devrais sentir le cardio monter", "Concentre-toi sur la coordination"]

### Conseils
- **Format :** Array de phrases complètes
- **Style :** Positif et encourageant (TUTOIEMENT)
- **Exemple :** ["Concentre-toi sur ta respiration", "Va à ton rythme"]

### Variantes
- **Format :** Objet JSON avec deux propriétés
- **Structure :** `{ "plus_faciles": [...], "plus_difficiles": [...] }`
- **Style :** Conditionnel et suggestif (TUTOIEMENT)
- **Exemple :** 
  ```json
  {
    "plus_faciles": ["Si c'est trop difficile, tu peux plier les genoux", "Si tu veux moins d'intensité, réduis l'amplitude"],
    "plus_difficiles": ["Si c'est trop facile, tu peux ajouter un saut", "Si tu veux plus d'intensité, ralentis la descente"]
  }
  ```

### Durée estimée
- **Format :** Durée en secondes pour 1 répétition
- **Exemple :** Une pompe = 2-3 secondes
- **Objectif :** Permettre le calcul du temps total selon le nombre de répétitions

### Calories estimées
- **Format :** Calories pour 1 répétition
- **Exemple :** 0.5 calorie par répétition
- **Objectif :** Permettre le calcul des calories totales selon le nombre de répétitions

## Génération SQL

```sql
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'marche_active_sur_place',
    'Marche active sur place',
    'Lève alternativement tes genoux vers ta poitrine en gardant le dos droit.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 1, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas tes genoux trop haut"]',
    '["Tu devrais sentir ton cardio monter progressivement", "Concentre-toi sur ta coordination bras-jambes", "Sens tes jambes s''échauffer"]',
    null,
    null,
    3,
    0.5,
    '["Quadriceps", "Fessiers", "Mollets", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux plier les genoux", "Si tu veux moins d''intensité, réduis l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un saut", "Si tu veux plus d''intensité, ralentis la descente"]}',
    '["Concentre-toi sur ta respiration régulière", "Garde ton dos bien droit", "Maintiens un rythme constant"]',
    null,
    false,
    NOW(),
    NOW()
);
```

## Notes importantes

1. **Type flexible :** Le type peut être modifié selon l'utilisation dans la séance
2. **Audio-friendly :** Toutes les descriptions doivent être écrites pour être lues à haute voix
3. **Tutoiement :** Utilise le tutoiement dans toutes les descriptions et conseils
4. **Simplicité :** Évite les termes techniques complexes
5. **Clarté :** Instructions précises et faciles à suivre
6. **Sécurité :** Inclus toujours les erreurs communes à éviter
7. **Durée unitaire :** La durée estimée est pour 1 répétition, pas pour l'exercice complet
8. **Calories unitaires :** Les calories estimées sont pour 1 répétition, pas pour l'exercice complet
9. **Description concise :** La description doit être très concise et ne pas répéter les conseils déjà présents dans les champs dédiés

---

**Date de création :** 2024-12-19  
**Créé par :** Assistant IA  
**Dernière modification :** 2024-12-19  
**Version :** 2.1 