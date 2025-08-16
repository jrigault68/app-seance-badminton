/**
 * Service d'API personnalisée
 * Permet d'intégrer votre propre API IA
 */

const CUSTOM_AI_URL = import.meta.env.VITE_CUSTOM_AI_URL;

class CustomAIService {
  /**
   * Génère une séance d'entraînement avec votre API personnalisée
   * @param {string} prompt - Description de la séance souhaitée
   * @param {Array} exercices - Liste des exercices disponibles
   * @param {string} template - Template JSON pour la structure
   * @returns {Promise<string>} - JSON de la séance générée
   */
  async generateSeance(prompt, exercices, template) {
    if (!CUSTOM_AI_URL) {
      throw new Error('URL API personnalisée non configurée. Ajoutez VITE_CUSTOM_AI_URL dans votre .env');
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

      // Préparer la requête pour votre API
      const requestBody = {
        prompt,
        exercices: exercicesList,
        template,
        type: 'seance_generation'
      };

      // Appel à votre API personnalisée
      const response = await fetch(CUSTOM_AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ajoutez ici vos headers personnalisés si nécessaire
          // 'Authorization': `Bearer ${YOUR_API_KEY}`,
          // 'X-Custom-Header': 'value'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        throw new Error(`Erreur API personnalisée: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Adapter selon le format de réponse de votre API
      const generatedText = data.seance || data.response || data.content || data;

      if (!generatedText) {
        throw new Error('Aucune réponse générée par votre API');
      }

      // Si votre API retourne déjà du JSON valide
      if (typeof generatedText === 'string') {
        try {
          JSON.parse(generatedText);
          return generatedText;
        } catch (parseError) {
          // Essayer d'extraire le JSON si c'est dans du texte
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            JSON.parse(jsonMatch[0]);
            return jsonMatch[0];
          }
          throw new Error('Format de réponse invalide - JSON non trouvé');
        }
      } else if (typeof generatedText === 'object') {
        // Si votre API retourne un objet JSON directement
        return JSON.stringify(generatedText, null, 2);
      } else {
        throw new Error('Format de réponse invalide');
      }

    } catch (error) {
      throw new Error(`Erreur lors de la génération avec votre API : ${error.message}`);
    }
  }

  /**
   * Suggère des exercices similaires avec votre API
   * @param {string} searchTerm - Terme de recherche
   * @param {Array} exercices - Liste des exercices
   * @returns {Promise<Array>} - Exercices suggérés
   */
  async suggestExercices(searchTerm, exercices) {
    if (!CUSTOM_AI_URL) {
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

      // Préparer la requête pour les suggestions
      const requestBody = {
        searchTerm,
        exercices: exercicesList,
        type: 'suggestion'
      };

      const response = await fetch(CUSTOM_AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ajoutez ici vos headers personnalisés si nécessaire
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        return this.simpleSearch(searchTerm, exercices);
      }

      const data = await response.json();
      
      // Adapter selon le format de réponse de votre API
      const suggestedIds = data.suggestions || data.ids || data.response || [];

      if (Array.isArray(suggestedIds)) {
        return exercices.filter(exo => suggestedIds.includes(exo.id)).slice(0, 5);
      } else if (typeof suggestedIds === 'string') {
        // Si votre API retourne une chaîne JSON
        try {
          const parsedIds = JSON.parse(suggestedIds);
          return exercices.filter(exo => parsedIds.includes(exo.id)).slice(0, 5);
        } catch (parseError) {
          return this.simpleSearch(searchTerm, exercices);
        }
      } else {
        return this.simpleSearch(searchTerm, exercices);
      }

    } catch (error) {
      console.warn('Erreur suggestion API personnalisée, fallback vers recherche simple:', error);
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

  /**
   * Test de connectivité avec votre API
   * @returns {Promise<boolean>} - True si l'API est accessible
   */
  async testConnection() {
    if (!CUSTOM_AI_URL) {
      return false;
    }

    try {
      const response = await fetch(CUSTOM_AI_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.warn('Erreur de connexion à l\'API personnalisée:', error);
      return false;
    }
  }
}

export default new CustomAIService();
