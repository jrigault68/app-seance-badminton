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

  // Démarrer une nouvelle session d'entraînement
  static async demarrerSession(seanceId, programmeId = null, jourProgramme = null, nomSession = null) {
    try {
      console.log('🚀 Démarrage de session:', { seanceId, programmeId, jourProgramme, nomSession });
      
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seance_id: seanceId,
          programme_id: programmeId,
          jour_programme: jourProgramme,
          nom_session: nomSession
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Session démarrée avec succès:', result);
      return result.session;
    } catch (error) {
      console.error('❌ Erreur lors du démarrage de session:', error);
      throw error;
    }
  }

  // Mettre à jour la progression d'une session
  static async mettreAJourProgression(sessionId, progression) {
    try {
      console.log('📊 Mise à jour progression:', { sessionId, progression });
      
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/progression`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progression)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Progression mise à jour:', result);
      return result.session;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de progression:', error);
      throw error;
    }
  }

  // Récupérer une session en cours pour une séance
  static async getSessionEnCours(seanceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/en-cours/${seanceId}`, {
        credentials: "include"
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Pas de session en cours, c'est normal
          return null;
        }
        // Pour les autres erreurs, on ne log pas pour éviter le spam
        return null;
      }

      const data = await response.json();
      return data.session;
    } catch (error) {
      // Erreur réseau ou autre, on ne log pas pour éviter le spam
      return null;
    }
  }

  // Enregistrer une séance terminée
  static async enregistrerSeance(seanceId, sessionData = {}, isUpdate = false) {
    try {
      console.log('📤 Enregistrement de séance:', { seanceId, sessionData, isUpdate });
      
      const url = isUpdate 
        ? `${API_BASE_URL}/sessions/${seanceId}/update`
        : `${API_BASE_URL}/seances/${seanceId}/complete`;
      
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Séance enregistrée avec succès:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      throw error;
    }
  }

  // Terminer une session
  static async terminerSession(sessionId, sessionData = {}) {
    try {
      console.log('🏁 Terminaison de session:', { sessionId, sessionData });
      
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...sessionData,
          etat: 'terminee'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Session terminée avec succès:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la terminaison de session:', error);
      throw error;
    }
  }

  // Annuler une session
  static async annulerSession(sessionId) {
    try {
      console.log('❌ Annulation de session:', { sessionId });
      
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          etat: 'annulee'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Session annulée avec succès:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation de session:', error);
      throw error;
    }
  }
}

export default SeanceService; 