/**
 * Configuration des services IA
 * Permet de choisir facilement entre différents fournisseurs IA
 */

// Choisir le service IA à utiliser
// Options : 'simulation', 'openai', 'claude', 'custom'
export const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'simulation';

// Configuration des services
export const AI_CONFIG = {
  simulation: {
    name: 'Simulation IA',
    description: 'Génération locale pour tests',
    enabled: true,
    service: 'aiService'
  },
  openai: {
    name: 'OpenAI GPT-4',
    description: 'Génération avec OpenAI (nécessite une clé API)',
    enabled: !!import.meta.env.VITE_OPENAI_API_KEY,
    service: 'openaiService',
    requiresKey: true
  },
  claude: {
    name: 'Anthropic Claude',
    description: 'Génération avec Claude (nécessite une clé API)',
    enabled: !!import.meta.env.VITE_CLAUDE_API_KEY,
    service: 'claudeService',
    requiresKey: true
  },
  custom: {
    name: 'API personnalisée',
    description: 'Votre propre API IA',
    enabled: !!import.meta.env.VITE_CUSTOM_AI_URL,
    service: 'customAIService',
    requiresKey: true
  }
};

// Obtenir le service IA actif
export function getActiveAIService() {
  const config = AI_CONFIG[AI_PROVIDER];
  
  if (!config || !config.enabled) {
    console.warn(`Service IA ${AI_PROVIDER} non disponible, utilisation de la simulation`);
    return import('../services/aiService.js').then(module => module.default);
  }

  switch (AI_PROVIDER) {
    case 'openai':
      return import('../services/openaiService.js').then(module => module.default);
    case 'claude':
      return import('../services/claudeService.js').then(module => module.default);
    case 'custom':
      return import('../services/customAIService.js').then(module => module.default);
    case 'simulation':
    default:
      return import('../services/aiService.js').then(module => module.default);
  }
}

// Vérifier si un service IA est disponible
export function isAIServiceAvailable(provider = AI_PROVIDER) {
  const config = AI_CONFIG[provider];
  return config && config.enabled;
}

// Obtenir la liste des services disponibles
export function getAvailableAIServices() {
  return Object.entries(AI_CONFIG)
    .filter(([key, config]) => config.enabled)
    .map(([key, config]) => ({
      key,
      name: config.name,
      description: config.description,
      requiresKey: config.requiresKey
    }));
}

// Configuration des prompts par défaut
export const DEFAULT_PROMPTS = {
  seance: {
    system: `Tu es un expert en entraînement sportif spécialisé dans la création de séances d'exercices.
    
IMPORTANT :
- Utilise UNIQUEMENT les exercices de la liste fournie
- Respecte strictement le format JSON fourni
- Ne génère que le JSON, sans explication ni commentaire
- Les temps sont en secondes
- Les IDs d'exercices doivent correspondre exactement à ceux de la liste`,

    user: `Liste des exercices disponibles :
{exercices}

Description de la séance demandée :
{prompt}

Génère uniquement le JSON de la séance selon le format fourni.`
  },

  suggestion: {
    system: 'Tu es un assistant spécialisé dans la suggestion d\'exercices sportifs. Réponds uniquement avec un tableau JSON d\'IDs d\'exercices pertinents.',
    
    user: `Trouve 5 exercices similaires à "{searchTerm}" dans cette liste :
{exercices}

Réponds uniquement avec un tableau d'IDs, exemple : ["id1", "id2", "id3"]`
  }
};

// Configuration des modèles par défaut
export const DEFAULT_MODELS = {
  openai: {
    generation: 'gpt-4',
    suggestion: 'gpt-3.5-turbo'
  },
  claude: {
    generation: 'claude-3-sonnet-20240229',
    suggestion: 'claude-3-haiku-20240307'
  },
  custom: {
    generation: 'custom',
    suggestion: 'custom'
  }
};

// Configuration des paramètres par défaut
export const DEFAULT_PARAMS = {
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
};
