# Architecture Unifiée des Messages Vocaux

## Vue d'ensemble

La fonction `genererMessages()` centralise toute la logique de génération des messages vocaux selon le contexte. Cette approche unifiée remplace la logique dispersée qui était présente dans différentes fonctions.

## Fonction `genererMessages()`

### Paramètres

```javascript
function genererMessages(options) {
  const {
    type, // Type de message à générer
    exercice, // Données de l'exercice actuel
    nextExercice = null, // Données de l'exercice suivant (optionnel)
    contexte = {}, // Informations sur le contexte
    infosDejaDiffusees = {} // Suivi des informations déjà diffusées
  } = options;
}
```

### Types de messages supportés

- `'debut'` - Messages de début d'exercice/série
- `'milieu'` - Messages de motivation pendant l'exercice
- `'fin'` - Messages de fin d'exercice/série
- `'repos_series'` - Messages de repos entre séries
- `'repos_exercice'` - Messages de repos après exercice
- `'fin_seance'` - Messages de fin de séance

### Contexte

L'objet `contexte` contient les informations nécessaires pour déterminer quels messages générer :

```javascript
{
  serie: 1, // Numéro de la série actuelle
  totalSeries: 3, // Nombre total de séries
  isLastSerie: false, // Si c'est la dernière série
  isFirstSerie: true, // Si c'est la première série
  blocTour: 1, // Numéro du tour dans le bloc
  totalBlocTour: 2, // Nombre total de tours du bloc
  isLastTour: false, // Si c'est le dernier tour
  isBlocWithIntro: false, // Si le bloc a une introduction
  isFirstExercise: false, // Si c'est le premier exercice
  isLastExercise: false, // Si c'est le dernier exercice
  hasReposSeries: true, // Si il y a un repos entre séries
  hasReposExercise: true, // Si il y a un repos après l'exercice
  partie: 1, // Partie actuelle (pour changement de côté)
  totalParties: 1 // Nombre total de parties
}
```

## Exemples d'utilisation

### Début d'exercice

```javascript
const messages = genererMessages({
  type: 'debut',
  exercice: stepData,
  contexte: {
    serie: 1,
    totalSeries: 3,
    isLastSerie: false,
    isFirstSerie: true,
    isFirstExercise: true,
    isBlocWithIntro: false
  },
  infosDejaDiffusees
});
```

### Fin d'exercice avec enchaînement

```javascript
const messages = genererMessages({
  type: 'fin',
  exercice: stepData,
  nextExercice: nextExo,
  contexte: {
    serie: 3,
    totalSeries: 3,
    isLastSerie: true,
    hasReposExercise: false
  },
  infosDejaDiffusees
});
```

### Repos entre séries

```javascript
const messages = genererMessages({
  type: 'repos_series',
  exercice: stepData,
  contexte: {
    serie: 2,
    totalSeries: 3
  },
  infosDejaDiffusees
});
```

## Avantages de cette approche

1. **Centralisation** : Toute la logique de sélection des messages est dans une seule fonction
2. **Réutilisabilité** : La même fonction peut être utilisée dans différents contextes
3. **Maintenabilité** : Plus facile de modifier ou ajouter de nouveaux types de messages
4. **Cohérence** : Garantit que les messages sont générés de manière cohérente
5. **Testabilité** : Plus facile de tester la logique de génération des messages

## Migration depuis l'ancienne architecture

Les fonctions suivantes ont été refactorisées pour utiliser `genererMessages()` :

- `creerEtapeIntro()` - Utilise `type: 'debut'`
- `genererSerieNormale()` - Utilise `type: 'debut'` et `type: 'fin'`
- `genererSerieAvecChangementCote()` - Utilise `type: 'debut'`, `type: 'milieu'` et `type: 'fin'`
- `genererReposEntreSeries()` - Utilise `type: 'repos_series'`
- `genererReposApresEtape()` - Utilise `type: 'repos_exercice'`

## Messages disponibles

Les messages sont définis dans `src/assets/messages_vocaux.json` et organisés par catégories :

- `intro` - Messages d'introduction
- `exercice` - Messages pendant les exercices
- `repos` - Messages de repos
- `seance` - Messages de fin de séance
- `motivations` - Messages de motivation

Chaque message peut contenir des variables dynamiques comme `{exo.nom}`, `{serie}`, `{duration}`, etc.

