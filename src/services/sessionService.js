const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SessionService {
  // Récupérer toutes les sessions de l'utilisateur
  static async getSessions(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.sessions;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error);
      throw error;
    }
  }

  // Démarrer une nouvelle session
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
      return data.session;
    } catch (error) {
      console.error('Erreur lors du démarrage de la session:', error);
      throw error;
    }
  }

  // Terminer une session
  static async endSession(sessionId, sessionData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'PUT',
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
      return data.session;
    } catch (error) {
      console.error('Erreur lors de la fin de session:', error);
      throw error;
    }
  }

  // Récupérer une session par ID
  static async getSessionById(sessionId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.session;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      throw error;
    }
  }

  // Récupérer une session par ID (sans token, pour usage interne)
  static async getSessionByIdInternal(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.session;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      throw error;
    }
  }
}

export default SessionService; 