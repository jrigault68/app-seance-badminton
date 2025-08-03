# Calcul du Temps Total des Séances

## Problème identifié

Le système précédent calculait le temps total d'une séance en se basant uniquement sur la différence entre l'heure de début et l'heure de fin. Cela posait un problème lors de la reprise d'une séance interrompue : le temps total incluait le temps d'interruption.

## Solution implémentée

### Nouveau système de calcul

Le temps total est maintenant calculé en **additionnant le temps réel passé sur chaque étape** plutôt qu'en utilisant la différence entre début et fin.

### Structure des données

La progression d'une session contient maintenant :

```json
{
  "etape_actuelle": 5,
  "nombre_total_etapes": 20,
  "temps_ecoule": 1800,
  "temps_total_cumule": 740,
  "derniere_mise_a_jour": "2024-01-15T10:30:00.000Z"
}
```

### Champs expliqués

- **`temps_total_cumule`** : Somme de tous les temps d'étapes (temps total réel)
- **`temps_ecoule`** : Temps écoulé depuis le début (pour compatibilité)

### Logique de calcul

1. **À la fin de chaque étape** : Le temps réel passé sur l'étape est calculé
2. **Cumul** : Ce temps est ajouté au `temps_total_cumule`
3. **Reprise** : Le temps cumulé est récupéré au chargement de la session

### Exemple concret

**Scénario** : Séance avec 3 étapes de 30s chacune

1. **Étape 1** : 30s → `temps_total_cumule = 30s`
2. **Étape 2** : 30s → `temps_total_cumule = 60s`
3. **Interruption** : L'utilisateur quitte
4. **Reprise** : L'utilisateur reprend à l'étape 3 avec `temps_total_cumule = 60s`
5. **Étape 3** : 30s → `temps_total_cumule = 90s`

### Avantages

✅ **Simplicité** : Un seul champ à maintenir
✅ **Précision** : Le temps total reflète le temps réel d'activité
✅ **Reprise** : Pas d'impact du temps d'interruption
✅ **Performance** : Moins de données à stocker et traiter
✅ **Compatibilité** : Le système fonctionne même sans temps d'étapes

### Implémentation technique

#### Backend (`backend/routes/sessions.js`)

```javascript
// Calcul du temps total cumulé
let tempsTotalCumule = progressionExistante.temps_total_cumule || 0;

if (temps_etape_actuelle && temps_etape_actuelle > 0) {
  tempsTotalCumule += temps_etape_actuelle;
  console.log(`📊 Ajout de ${temps_etape_actuelle}s au temps cumulé. Nouveau total: ${tempsTotalCumule}s`);
}
```

#### Frontend (`src/screens/MoteurExecution.jsx`)

```javascript
// À la fin de chaque étape
if (current && current.duree && onMettreAJourProgression) {
  const tempsEtapeActuelle = current.duree; // L'étape est terminée
  onMettreAJourProgression(stepIndex, tempsEcoule, tempsEtapeActuelle);
}
```

### Migration

Le système est **rétrocompatible** :
- Les anciennes sessions continuent de fonctionner
- Le temps total est calculé avec le nouveau système si possible
- Fallback sur l'ancien système si nécessaire

### Tests recommandés

1. **Séance complète** : Vérifier que le temps total est correct
2. **Séance interrompue** : Vérifier que le temps d'interruption n'est pas compté
3. **Reprise multiple** : Vérifier que le temps ne double pas
4. **Étapes sans durée** : Vérifier que le système fonctionne

### Monitoring

Les logs suivent le nouveau système :
- `📊 Temps total cumulé récupéré: X`
- `📊 Ajout de Xs au temps cumulé. Nouveau total: Ys`
- `📊 Fin d'étape X, temps passé: Ys` 