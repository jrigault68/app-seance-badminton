/**
 * Service d'intégration avec Anthropic Claude
 * Exemple d'utilisation de l'API Claude
 */

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

class ClaudeService {
  /**
   * Génère une séance d'entraînement avec Claude
   * @param {string} prompt - Description de la séance souhaitée
   * @param {Array} exercices - Liste des exercices disponibles
   * @param {string} template - Template JSON pour la structure
   * @returns {Promise<string>} - JSON de la séance générée
   */
  async generateSeance(prompt, exercices, template) {
    if (!CLAUDE_API_KEY) {
      throw new Error('Clé API Claude non configurée. Ajoutez VITE_CLAUDE_API_KEY dans votre .env');
    }

    try {
      // Préparer les exercices pour l'IA
      const exercicesList = exercices.map(exo => ({
        id: exo.id,
        nom: exo.nom,
        categorie: exo.categorie_nom,
        niveau: exo.niveau_nom,
        type: exo.type_nom
      }));

      // Construire le prompt complet
      const systemPrompt = `Tu es un expert en entraînement sportif spécialisé dans la création de séances d'exercices.

${template}

IMPORTANT :
- Utilise UNIQUEMENT les exercices de la liste fournie
- Respecte strictement le format JSON fourni
- Ne génère que le JSON, sans explication ni commentaire
- Les temps sont en secondes
- Les IDs d'exercices doivent correspondre exactement à ceux de la liste`;

      const userPrompt = `Liste des exercices disponibles :
${JSON.stringify(exercicesList, null, 2)}

Description de la séance demandée :
${prompt}

Génère uniquement le JSON de la séance selon le format fourni.`;

      // Appel à l'API Claude
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\n${userPrompt}`
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur Claude: ${error.error?.message || 'Erreur inconnue'}`);
      }

      const data = await response.json();
      const generatedText = data.content[0]?.text;

      if (!generatedText) {
        throw new Error('Aucune réponse générée par Claude');
      }

      // Extraire le JSON de la réponse
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Format de réponse invalide - JSON non trouvé');
      }

      // Valider que c'est du JSON valide
      try {
        JSON.parse(jsonMatch[0]);
        return jsonMatch[0];
      } catch (parseError) {
        throw new Error('JSON généré invalide');
      }

    } catch (error) {
      throw new Error(`Erreur lors de la génération Claude : ${error.message}`);
    }
  }

  /**
   * Suggère des exercices similaires avec Claude
   * @param {string} searchTerm - Terme de recherche
   * @param {Array} exercices - Liste des exercices
   * @returns {Promise<Array>} - Exercices suggérés
   */
  async suggestExercices(searchTerm, exercices) {
    if (!CLAUDE_API_KEY) {
      // Fallback vers la recherche simple
      return this.simpleSearch(searchTerm, exercices);
    }

    try {
      const exercicesList = exercices.map(exo => ({
        id: exo.id,
        nom: exo.nom,
        categorie: exo.categorie_nom,
        niveau: exo.niveau_nom
      }));

      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 100,
          messages: [
            {
              role: 'user',
              content: `Tu es un assistant spécialisé dans la suggestion d'exercices sportifs. Réponds uniquement avec un tableau JSON d'IDs d'exercices pertinents.

Trouve 5 exercices similaires à "${searchTerm}" dans cette liste :
${JSON.stringify(exercicesList, null, 2)}

Réponds uniquement avec un tableau d'IDs, exemple : ["id1", "id2", "id3"]`
            }
          ]
        })
      });

      if (!response.ok) {
        return this.simpleSearch(searchTerm, exercices);
      }

      const data = await response.json();
      const suggestedIds = JSON.parse(data.content[0]?.text || '[]');

      return exercices.filter(exo => suggestedIds.includes(exo.id)).slice(0, 5);

    } catch (error) {
      console.warn('Erreur suggestion Claude, fallback vers recherche simple:', error);
      return this.simpleSearch(searchTerm, exercices);
    }
  }

  /**
   * Recherche simple en fallback
   * @param {string} searchTerm - Terme de recherche
   * @param {Array} exercices - Liste des exercices
   * @returns {Array} - Exercices trouvés
   */
  simpleSearch(searchTerm, exercices) {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    
    return exercices
      .filter(exo => 
        exo.nom.toLowerCase().includes(term) ||
        exo.categorie_nom?.toLowerCase().includes(term) ||
        exo.niveau_nom?.toLowerCase().includes(term)
      )
      .slice(0, 5);
  }
}

export default new ClaudeService();
