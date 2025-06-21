const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SeanceService {
  // Récupérer toutes les séances avec filtres optionnels
  static async getSeances(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.niveau) params.append('niveau', filters.niveau);
      if (filters.type_seance) params.append('type_seance', filters.type_seance);
      if (filters.categorie) params.append('categorie', filters.categorie);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);
      if (filters.est_publique !== undefined) params.append('est_publique', filters.est_publique);

      const response = await fetch(`${API_BASE_URL}/seances?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des séances:', error);
      throw error;
    }
  }

  // Récupérer une séance par ID
  static async getSeanceById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/seances/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Séance non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.seance;
    } catch (error) {
      console.error('Erreur lors de la récupération de la séance:', error);
      throw error;
    }
  }

  // Récupérer les exercices d'une séance
  static async getExercicesSeance(seanceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/seances/${seanceId}/exercices`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.exercices;
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices:', error);
      throw error;
    }
  }

  // Créer une nouvelle séance (nécessite authentification)
  static async createSeance(seanceData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/seances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(seanceData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
      throw error;
    }
  }

  // Créer une séance personnalisée
  static async createSeancePersonnalisee(seanceData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/seances/personnalisees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(seanceData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la séance personnalisée:', error);
      throw error;
    }
  }

  // Démarrer une session d'entraînement
  static async startSession(sessionData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors du démarrage de la session:', error);
      throw error;
    }
  }
}

export default SeanceService; 