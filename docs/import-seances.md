# 📥 Import de Séances

## Vue d'ensemble

L'import de séances permet de créer rapidement des séances d'entraînement en important un fichier JSON ou en collant du texte JSON. Cette fonctionnalité est particulièrement utile pour :

- Importer des séances créées par une IA
- Partager des séances entre utilisateurs
- Créer des séances à partir de templates

## 🎯 Fonctionnalités

### ✅ Disponible maintenant
- **Import JSON** : Coller du texte JSON ou importer un fichier
- **Validation** : Vérification automatique du format JSON
- **Aide intégrée** : Modèle JSON et directives
- **Prompt IA** : Template prêt à l'emploi pour les IA

### 🔄 À venir (partie IA)
- **Génération IA** : Création automatique de séances par IA
- **Validation exercices** : Vérification que les exercices existent
- **Suggestions** : Propositions d'exercices similaires

## 📋 Format JSON attendu

### Structure de base
```json
{
  "nom": "Nom de la séance",
  "description": "Description de la séance",
  "niveau_id": 1,
  "type_id": 1,
  "categorie_id": 1,
  "type_seance": "exercice",
  "notes": "Notes personnelles",
  "structure": []
}
```

### Structure des blocs
```json
{
  "type": "bloc",
  "nom": "Nom du bloc",
  "description": "Description du bloc",
  "nbTours": 1,
  "temps_repos_bloc": 30,
  "temps_repos_exercice": 15,
  "contenu": []
}
```

### Structure des exercices
```json
{
  "type": "exercice",
  "id": "id_exercice_existant",
  "series": 1,
  "repetitions": 0,
  "temps_series": 60,
  "temps_repos_series": 0,
  "temps_repos_exercice": 0
}
```

## 🔧 Utilisation

### 1. Accéder à l'import
- **Mode détail** : Cliquer sur "Importer" dans les actions de la page
- **Mode édition** : Cliquer sur "Importer une séance" dans le formulaire

### 2. Importer une séance
1. Coller le JSON dans la zone de texte
2. Ou cliquer sur "Choisir un fichier" pour importer un fichier JSON
3. Cliquer sur "Importer"

### 3. Utiliser l'aide
1. Cliquer sur "Aide modèle JSON"
2. Copier l'exemple ou le prompt IA
3. Utiliser avec votre IA préférée

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

### Prompt recommandé
Utilisez le prompt fourni dans l'aide qui inclut :
- Format JSON strict
- Structure hiérarchique
- Références aux exercices existants
- Configuration des temps et séries

### Liste des exercices
Pour obtenir la liste des exercices disponibles :
```bash
node scripts/get-exercices-ids.js
```

### Exemple de prompt
```
Génère une séance d'échauffement de 15 minutes pour le badminton.
Utilise uniquement les exercices de la liste fournie.
Structure : 1 bloc d'échauffement articulaire + 1 bloc de renforcement léger.
```

## ⚠️ Points importants

### Validation
- ✅ Format JSON valide
- ✅ Structure hiérarchique correcte
- ✅ IDs d'exercices existants (à venir)
- ✅ Types de séance valides

### Limitations actuelles
- ❌ Pas de validation des exercices existants
- ❌ Pas de suggestions d'exercices similaires
- ❌ Pas de génération automatique par IA

### Bonnes pratiques
1. **Testez d'abord** : Importez dans une séance de test
2. **Vérifiez les exercices** : Assurez-vous qu'ils existent
3. **Ajustez les temps** : Vérifiez la durée totale
4. **Sauvegardez** : N'oubliez pas de sauvegarder après import

## 🔄 Prochaines étapes

### Phase 2 : Intégration IA
- [ ] Validation des exercices existants
- [ ] Suggestions d'exercices similaires
- [ ] Génération automatique par IA
- [ ] Interface de chat IA intégrée

### Phase 3 : Améliorations
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
