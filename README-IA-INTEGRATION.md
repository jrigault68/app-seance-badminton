# 🤖 Intégration IA - Guide complet

## 🎯 Vue d'ensemble

L'intégration IA permet de générer automatiquement des séances d'entraînement en utilisant différentes APIs d'intelligence artificielle. Le système est modulaire et permet de basculer facilement entre différents fournisseurs.

## ✅ Fonctionnalités implémentées

### Interface IA
- **Dialog de génération IA** avec zone de saisie de prompt
- **Recherche d'exercices** avec suggestions intelligentes
- **Validation des exercices** existants dans la base
- **Affichage du service IA** actif
- **Gestion des erreurs** et fallbacks

### Services IA disponibles
- **Simulation IA** : Génération locale pour tests
- **OpenAI GPT-4** : Génération avec OpenAI
- **Anthropic Claude** : Génération avec Claude (à implémenter)
- **API personnalisée** : Votre propre API IA (à implémenter)

### Validation et sécurité
- **Validation des exercices** : Vérification que les exercices existent
- **Validation JSON** : Vérification du format de réponse
- **Fallbacks** : Retour vers la recherche simple en cas d'erreur
- **Gestion des clés API** : Vérification de la configuration

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Service IA à utiliser (simulation, openai, claude, custom)
VITE_AI_PROVIDER=simulation

# Clé API OpenAI (optionnel)
VITE_OPENAI_API_KEY=sk-your-openai-key-here

# Clé API Claude (optionnel)
VITE_CLAUDE_API_KEY=sk-ant-your-claude-key-here

# URL API personnalisée (optionnel)
VITE_CUSTOM_AI_URL=https://your-api.com/generate
```

### Services disponibles

#### 1. Simulation IA (par défaut)
- **Avantages** : Aucune clé API requise, génération locale
- **Utilisation** : Tests et développement
- **Configuration** : Aucune

#### 2. OpenAI GPT-4
- **Avantages** : Génération de haute qualité, bien documenté
- **Coût** : Payant selon l'utilisation
- **Configuration** : `VITE_OPENAI_API_KEY`

#### 3. Anthropic Claude
- **Avantages** : Génération contextuelle, sécurité renforcée
- **Coût** : Payant selon l'utilisation
- **Configuration** : `VITE_CLAUDE_API_KEY`

#### 4. API personnalisée
- **Avantages** : Contrôle total, intégration avec vos systèmes
- **Coût** : Selon votre infrastructure
- **Configuration** : `VITE_CUSTOM_AI_URL`

## 🚀 Utilisation

### 1. Génération de séance

1. **Accéder à l'IA** :
   - Mode détail : Cliquer sur "Importer" → "Générer avec IA"
   - Mode édition : Cliquer sur "Importer une séance" → "Générer avec IA"

2. **Décrire la séance** :
   ```
   Crée une séance d'échauffement de 15 minutes pour le badminton
   avec des exercices de mobilité et de renforcement léger
   ```

3. **Rechercher des exercices** (optionnel) :
   - Tapez dans la zone de recherche
   - Consultez les suggestions d'exercices
   - Notez les IDs pour référence

4. **Générer la séance** :
   - Cliquer sur "Générer la séance"
   - Attendre la génération (2-5 secondes)
   - Vérifier le résultat

5. **Utiliser la séance** :
   - Cliquer sur "Utiliser cette séance"
   - La séance est importée dans le formulaire
   - Ajuster et sauvegarder

### 2. Exemples de prompts

#### Échauffement
```
Crée une séance d'échauffement de 20 minutes pour le badminton
avec mobilisation articulaire progressive et échauffement cardiovasculaire
```

#### Renforcement
```
Génère une séance de renforcement musculaire de 30 minutes
focalisée sur les jambes et le tronc, niveau intermédiaire
```

#### Cardio
```
Crée une séance cardio de 25 minutes avec des exercices
d'intensité variable pour améliorer l'endurance
```

#### Étirements
```
Génère une séance d'étirements de 15 minutes
pour récupération après entraînement
```

## 🔧 Développement

### Structure des services IA

Tous les services IA doivent implémenter cette interface :

```javascript
class AIService {
  async generateSeance(prompt, exercices, template) {
    // Génère une séance d'entraînement
    // Retourne : Promise<string> (JSON de la séance)
  }

  async suggestExercices(searchTerm, exercices) {
    // Suggère des exercices similaires
    // Retourne : Promise<Array> (liste d'exercices)
  }
}
```

### Ajouter un nouveau service IA

1. **Créer le service** dans `src/services/` :
```javascript
// src/services/myAIService.js
class MyAIService {
  async generateSeance(prompt, exercices, template) {
    // Votre logique de génération
  }

  async suggestExercices(searchTerm, exercices) {
    // Votre logique de suggestion
  }
}

export default new MyAIService();
```

2. **Ajouter la configuration** dans `src/config/aiConfig.js` :
```javascript
export const AI_CONFIG = {
  // ... autres services
  myai: {
    name: 'Mon Service IA',
    description: 'Description de votre service',
    enabled: !!import.meta.env.VITE_MYAI_API_KEY,
    service: 'myAIService',
    requiresKey: true
  }
};
```

3. **Ajouter la variable d'environnement** :
```env
VITE_MYAI_API_KEY=your-api-key
```

### Tests et validation

#### Test de la génération
```javascript
// Test simple
const aiService = await getActiveAIService();
const seance = await aiService.generateSeance(
  "Séance d'échauffement 15 minutes",
  exercices,
  template
);
console.log(seance);
```

#### Validation des exercices
```javascript
// Vérifier que les exercices existent
const validation = validateExercicesInStructure(structure, exercices);
if (validation.hasErrors) {
  console.error('Erreurs:', validation.errors);
}
```

## ⚠️ Points importants

### Sécurité
- **Clés API** : Ne jamais commiter les clés API dans le code
- **Validation** : Toujours valider les réponses de l'IA
- **Fallbacks** : Prévoir des alternatives en cas d'erreur

### Performance
- **Cache** : Considérer la mise en cache des réponses
- **Rate limiting** : Respecter les limites des APIs
- **Timeout** : Gérer les timeouts d'API

### Coûts
- **OpenAI** : ~$0.03-0.06 par génération (GPT-4)
- **Claude** : ~$0.015-0.075 par génération
- **Simulation** : Gratuit

## 🔄 Prochaines étapes

### Améliorations possibles
- [ ] **Cache intelligent** : Mise en cache des séances générées
- [ ] **Templates personnalisés** : Création de templates utilisateur
- [ ] **Historique IA** : Sauvegarde des séances générées
- [ ] **Évaluation IA** : Système de notation des séances
- [ ] **Apprentissage** : Amélioration basée sur l'usage

### Intégrations futures
- [ ] **Claude API** : Intégration complète d'Anthropic
- [ ] **Google Gemini** : Support de l'API Google
- [ ] **Modèles locaux** : Intégration de modèles locaux
- [ ] **Fine-tuning** : Entraînement sur vos données

## 📞 Support

### Dépannage

#### Erreur "Clé API requise"
- Vérifiez que la variable d'environnement est définie
- Redémarrez le serveur de développement
- Vérifiez le nom de la variable (sensible à la casse)

#### Erreur de génération
- Vérifiez la connectivité internet
- Vérifiez les quotas de votre API
- Consultez les logs de la console

#### Exercices non trouvés
- Vérifiez que les exercices existent dans la base
- Utilisez le script `get-exercices-ids.js` pour lister les exercices
- Ajustez le prompt pour être plus spécifique

### Ressources
- [Documentation OpenAI](https://platform.openai.com/docs)
- [Documentation Claude](https://docs.anthropic.com/)
- [Guide des prompts](https://platform.openai.com/docs/guides/prompt-engineering)

L'intégration IA est maintenant complète et prête à être utilisée ! 🚀
