# Séances d'Instructions

## Vue d'ensemble

Les séances d'instructions sont un nouveau type de séance qui permet d'ajouter des instructions simples dans les programmes, sans exercices physiques. Elles sont utiles pour :

- **Jours de repos** : Instructions pour se reposer et récupérer
- **Inspiration** : Regarder des matchs de haut niveau, analyser la technique
- **Préparation mentale** : Visualisation, méditation, concentration
- **Instructions spéciales** : Conseils personnalisés, objectifs spécifiques

## Fonctionnalités

### 1. Création de séances d'instructions

- **Type de séance** : Choisir "Instruction simple" lors de la création
- **Description** : Le texte de l'instruction (utilise le champ description existant)
- **Pas de structure** : Les instructions n'ont pas d'exercices, donc pas d'édition de structure
- **Validation** : L'utilisateur peut valider ou refuser l'instruction

### 2. Affichage dans les programmes

- **Badge "Instruction"** : Les séances d'instructions sont clairement identifiées
- **Description visible** : Le texte de l'instruction s'affiche directement sous le nom
- **Pas d'accordéon** : Les instructions n'ont pas de structure à déplier

### 3. Validation des instructions

- **Bouton "Valider l'instruction"** : Au lieu de "Démarrer la séance"
- **Page de validation** : Interface simple pour confirmer ou refuser
- **Enregistrement** : La validation est enregistrée dans `sessions_entrainement`

## Utilisation

### Créer une séance d'instruction

1. Aller dans "Séances" → "Créer une séance"
2. Choisir "Instruction simple" comme type de séance
3. Remplir le nom et la description (l'instruction)
4. Sauvegarder

### Ajouter à un programme

1. Aller dans le programme
2. Cliquer sur "Gérer les séances"
3. Ajouter la séance d'instruction au jour souhaité
4. L'instruction apparaîtra avec un badge orange

### Valider une instruction

1. Cliquer sur "Valider l'instruction" depuis la page de détail
2. Lire l'instruction
3. Cliquer sur "Oui, j'ai fait" ou "Non, je n'ai pas fait"
4. L'instruction est enregistrée et on peut passer au jour suivant

## Exemples d'instructions

### Jour de repos
```
Aujourd'hui, accordez-vous une journée de repos complet. 
Votre corps a besoin de récupérer pour progresser. 
Profitez-en pour vous étirer doucement ou faire une activité relaxante.
```

### Regarder un match
```
Regardez un match de badminton de haut niveau. 
Observez attentivement la technique, les déplacements, la stratégie. 
Prenez des notes si vous le souhaitez pour analyser les points clés.
```

### Visualisation
```
Fermez les yeux et visualisez-vous en train de jouer parfaitement. 
Imaginez vos mouvements, votre technique, votre confiance. 
Cette pratique mentale améliore la confiance et la performance.
```

## Base de données

### Nouveau champ
- `type_seance` : 'exercice' ou 'instruction' (défaut: 'exercice')

### Script de migration
```sql
-- Ajouter le champ type_seance
ALTER TABLE seances 
ADD COLUMN IF NOT EXISTS type_seance VARCHAR(20) DEFAULT 'exercice';

-- Mettre à jour les séances existantes
UPDATE seances 
SET type_seance = 'exercice' 
WHERE type_seance IS NULL;
```

## Avantages

1. **Flexibilité** : Permet d'intégrer des jours de repos et d'inspiration
2. **Cohérence** : Utilise la même architecture que les séances classiques
3. **Suivi** : Permet de valider la réalisation des instructions
4. **Progression** : Les instructions s'intègrent dans le suivi de programme
5. **Simplicité** : Interface claire et intuitive

## Limitations actuelles

- Les instructions utilisent le champ `description` existant
- Pas de validation obligatoire (l'utilisateur peut passer sans valider)
- Pas de durée estimée pour les instructions (0 par défaut) 