/**
 * Service IA unifié : configuration + appels API.
 * - Prompts : src/config/aiPrompts.js
 * - Config : .env → VITE_AI_PROVIDER (openai | claude | custom) + clés correspondantes
 */

import { filterExercicesByPrompt, formatExercicesCompact } from '../utils/exercicesPourIA.js';
import { getPromptSeanceTemplate, getPromptExerciceTemplate, EXERCICES_PREFIX_SEANCE } from '../utils/aiPrompts.js';

const ENV = import.meta.env;
const PROVIDER = ENV.VITE_AI_PROVIDER || 'openai';

// Configuration des fournisseurs (pour affichage ou usage futur)
export const AI_CONFIG = {
  openai: {
    name: 'OpenAI GPT-4',
    description: 'VITE_OPENAI_API_KEY',
    enabled: !!ENV.VITE_OPENAI_API_KEY
  },
  claude: {
    name: 'Anthropic Claude',
    description: 'VITE_CLAUDE_API_KEY',
    enabled: !!ENV.VITE_CLAUDE_API_KEY
  },
  custom: {
    name: 'API personnalisée',
    description: 'VITE_CUSTOM_AI_URL',
    enabled: !!ENV.VITE_CUSTOM_AI_URL
  }
};

/** true si au moins un fournisseur a sa clé/URL configurée */
export function isAnyProviderConfigured() {
  return Object.values(AI_CONFIG).some(c => c.enabled);
}

/** Retourne le service IA ou null si aucune clé configurée */
export function getActiveAIService() {
  return isAnyProviderConfigured() ? Promise.resolve(aiServiceInstance) : Promise.resolve(null);
}

function buildSeancePayload(prompt, exercices) {
  const filtered = filterExercicesByPrompt(prompt, exercices || []);
  const exercicesList = formatExercicesCompact(filtered);
  const systemPrompt = `${getPromptSeanceTemplate()}`;
  const userPrompt = `${EXERCICES_PREFIX_SEANCE}${JSON.stringify(exercicesList)}
  Description de la séance demandée :${prompt}`;
  return { systemPrompt, userPrompt, exercicesList };
}

function getActiveProvider() {
  if (ENV.VITE_OPENAI_API_KEY && (PROVIDER === 'openai')) return 'openai';
  if (ENV.VITE_CLAUDE_API_KEY && (PROVIDER === 'claude')) return 'claude';
  if (ENV.VITE_CUSTOM_AI_URL && (PROVIDER === 'custom')) return 'custom';
  return null;
}

function extractJsonFromText(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Format de réponse invalide - JSON non trouvé');
  JSON.parse(jsonMatch[0]);
  return jsonMatch[0];
}

async function callOpenAI(messages, { model = 'gpt-4', temperature = 0.7, max_tokens = 2000 } = {}) {
  const key = ENV.VITE_OPENAI_API_KEY;
  if (!key) throw new Error('Clé API OpenAI non configurée. Ajoutez VITE_OPENAI_API_KEY dans votre .env');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature, max_tokens })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erreur OpenAI');
  }
  const data = await res.json();
  return data.choices[0]?.message?.content || '';
}

async function callClaude(systemPrompt, userPrompt, { model = 'claude-3-sonnet-20240229', max_tokens = 2000 } = {}) {
  const key = ENV.VITE_CLAUDE_API_KEY;
  if (!key) throw new Error('Clé API Claude non configurée. Ajoutez VITE_CLAUDE_API_KEY dans votre .env');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens,
      messages: [{ role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erreur Claude');
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function callCustom(body, type = 'seance_generation') {
  const url = ENV.VITE_CUSTOM_AI_URL;
  if (!url) throw new Error('URL API personnalisée non configurée. Ajoutez VITE_CUSTOM_AI_URL dans votre .env');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, type })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText || 'Erreur API personnalisée');
  }
  const data = await res.json();
  return data;
}

// ——— API publique (même interface pour tout le monde) ———
class AIService {
  async generateSeance(prompt, exercices) {
    const provider = getActiveProvider();
    if (!provider) throw new Error('Aucun fournisseur IA configuré. Configurez VITE_AI_PROVIDER et la clé/URL correspondante.');

    const { systemPrompt, userPrompt, exercicesList } = buildSeancePayload(prompt, exercices);
    if (typeof console?.debug === 'function') {
      console.debug('[IA] Payload envoyé:', { provider, exercicesCount: exercicesList.length, systemPrompt, userPrompt });
    }

    let raw;
    if (provider === 'openai') {
      raw = await callOpenAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);
    } else if (provider === 'claude') {
      raw = await callClaude(systemPrompt, userPrompt);
    } else {
      const data = await callCustom({
        prompt,
        exercices: exercicesList,
        template: getPromptSeanceTemplate(),
        systemPrompt,
        userPrompt
      }, 'seance_generation');
      const generatedText = data.seance ?? data.response ?? data.content ?? data;
      if (typeof generatedText === 'object') return JSON.stringify(generatedText, null, 2);
      raw = generatedText || '';
    }

    if (!raw) throw new Error('Aucune réponse générée par l\'IA');
    return extractJsonFromText(raw);
  }

  async generateExercice(prompt) {
    const provider = getActiveProvider();
    if (!provider) throw new Error('Aucun fournisseur IA configuré. Configurez VITE_AI_PROVIDER et la clé/URL correspondante.');

    const systemPrompt = getPromptExerciceTemplate();
    const userPrompt = `Description de l'exercice demandé :\n${prompt}\n\nRéponds uniquement avec le JSON, sans explication.`;

    let raw;
    if (provider === 'openai') {
      raw = await callOpenAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);
    } else if (provider === 'claude') {
      raw = await callClaude(systemPrompt, userPrompt);
    } else {
      const data = await callCustom({
        prompt,
        template: getPromptExerciceTemplate(),
        systemPrompt,
        userPrompt
      }, 'exercice_generation');
      const generatedText = data.exercice ?? data.response ?? data.content ?? data;
      if (typeof generatedText === 'object') return JSON.stringify(generatedText, null, 2);
      raw = generatedText || '';
    }

    if (!raw) throw new Error('Aucune réponse générée par l\'IA');
    return extractJsonFromText(raw);
  }
}

const aiServiceInstance = new AIService();
export default aiServiceInstance;
