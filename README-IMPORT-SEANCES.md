# 📥 Import de Séances - Guide d'utilisation

## 🎯 Fonctionnalité implémentée

L'import de séances est maintenant disponible ! Cette fonctionnalité permet d'importer des séances d'entraînement au format JSON, avec une interface similaire à celle des exercices.

## ✅ Ce qui fonctionne

### Interface d'import
- **Bouton "Importer"** dans les actions de la page séance
- **Dialog d'import** avec zone de texte et upload de fichier
- **Validation JSON** automatique
- **Aide intégrée** avec modèle et directives

### Fonctionnalités
- Import de texte JSON collé
- Import de fichier JSON
- Validation du format
- Remplissage automatique du formulaire
- Messages d'erreur clairs

## 🔧 Comment utiliser

### 1. Accéder à l'import
- **Mode détail** : Cliquer sur "Importer" (icône Upload) dans les actions
- **Mode édition** : Cliquer sur "Importer une séance" dans le formulaire

### 2. Importer une séance
1. Coller le JSON dans la zone de texte
2. Ou cliquer sur "Choisir un fichier" pour importer un fichier JSON
3. Cliquer sur "Importer"

### 3. Utiliser l'aide
1. Cliquer sur "Aide modèle JSON"
2. Copier l'exemple ou le prompt IA
3. Utiliser avec votre IA préférée

## 📋 Format JSON attendu

```json
{
  "nom": "Nom de la séance",
  "description": "Description de la séance",
  "niveau_id": 1,
  "type_id": 1,
  "categorie_id": 1,
  "type_seance": "exercice",
  "notes": "Notes personnelles",
  "structure": [
    {
      "type": "bloc",
      "nom": "Nom du bloc",
      "description": "Description du bloc",
      "nbTours": 1,
      "temps_repos_bloc": 30,
      "temps_repos_exercice": 15,
      "contenu": [
        {
          "type": "exercice",
          "id": "id_exercice_existant",
          "series": 1,
          "repetitions": 0,
          "temps_series": 60,
          "temps_repos_series": 0,
          "temps_repos_exercice": 0
        }
      ]
    }
  ]
}
```

## 🎯 Références des IDs

### Niveaux (niveaux_difficulte)
- 1: facile
- 2: intermédiaire  
- 3: difficile
- 4: expert

### Types (types)
- 1: temps
- 2: repetitions
- 3: mouvement
- 4: mobilité
- 5: respiration
- 6: gainage
- 7: cardio
- 8: étirement

### Catégories (categories)
- 1: échauffement
- 2: mobilité
- 3: renforcement
- 4: étirement
- 5: cardio
- 6: gainage
- 7: récupération_active
- 8: ancrage

## 🤖 Utilisation avec l'IA

### Liste des exercices disponibles
Pour obtenir la liste complète des exercices avec leurs IDs :
```bash
node scripts/get-exercices-ids.js
```

### Exemple de prompt pour l'IA
```
Génère une séance d'échauffement de 15 minutes pour le badminton.
Utilise uniquement les exercices de cette liste : [liste des IDs]
Structure : 1 bloc d'échauffement articulaire + 1 bloc de renforcement léger.
Format JSON strict avec la structure fournie.
```

### Exemple de séance
Voir `examples/seance-exemple.json` pour un exemple complet.

## ⚠️ Points importants

### Validation actuelle
- ✅ Format JSON valide
- ✅ Structure hiérarchique correcte
- ✅ Types de séance valides

### Limitations actuelles
- ✅ Validation des exercices existants (implémentée)
- ✅ Suggestions d'exercices similaires (implémentées)
- ✅ Génération automatique par IA (implémentée)
- ❌ Pas de cache des séances générées
- ❌ Pas d'historique des générations

### Bonnes pratiques
1. **Testez d'abord** : Importez dans une séance de test
2. **Vérifiez les exercices** : Assurez-vous qu'ils existent dans la base
3. **Ajustez les temps** : Vérifiez la durée totale après import
4. **Sauvegardez** : N'oubliez pas de sauvegarder après import

## 🔄 Prochaines étapes

### Phase 2 : Intégration IA (✅ Terminée)
- [x] Validation des exercices existants
- [x] Suggestions d'exercices similaires
- [x] Génération automatique par IA
- [x] Interface de chat IA intégrée
- [x] Support multi-services (OpenAI, Claude, etc.)

### Phase 3 : Améliorations (à venir)
- [ ] Templates de séances
- [ ] Import/export de programmes
- [ ] Partage de séances
- [ ] Versioning des séances

## 📞 Support

Pour toute question ou problème :
1. Vérifiez le format JSON
2. Consultez les directives dans l'aide
3. Testez avec l'exemple fourni
4. Contactez l'équipe de développement

## 🎉 Test de la fonctionnalité

1. Créez une nouvelle séance
2. Cliquez sur "Importer une séance"
3. Copiez le contenu de `examples/seance-exemple.json`
4. Collez dans la zone de texte
5. Cliquez sur "Importer"
6. Vérifiez que les données sont bien importées
7. Sauvegardez la séance

La fonctionnalité d'import de séances est maintenant prête à être utilisée ! 🚀
