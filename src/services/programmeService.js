const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ProgrammeService {
  // Récupérer le programme actuel de l'utilisateur
  static async getProgrammeActuel() {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/actuel`, {
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Aucun programme actuel
        }
        throw new Error('Erreur lors de la récupération du programme actuel');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.getProgrammeActuel:', error);
      throw error;
    }
  }

  // Récupérer tous les programmes de l'utilisateur (actifs et inactifs)
  static async getProgrammesUtilisateur() {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/tous`, {
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des programmes utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.getProgrammesUtilisateur:', error);
      throw error;
    }
  }

  // Suivre un programme
  static async suivreProgramme(programmeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/suivre`, {
        method: 'POST',
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ programme_id: programmeId })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du suivi du programme');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.suivreProgramme:', error);
      throw error;
    }
  }

  // Arrêter de suivre un programme
  static async arreterProgramme(programmeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/arreter`, {
        method: 'POST',
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ programme_id: programmeId })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'arrêt du programme');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.arreterProgramme:', error);
      throw error;
    }
  }

  // Reprendre un programme
  static async reprendreProgramme(programmeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/reprendre`, {
        method: 'POST',
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ programme_id: programmeId })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la reprise du programme');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.reprendreProgramme:', error);
      throw error;
    }
  }

  // Changer de programme
  static async changerProgramme(nouveauProgrammeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/changer`, {
        method: 'POST',
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nouveau_programme_id: nouveauProgrammeId })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du changement de programme');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.changerProgramme:', error);
      throw error;
    }
  }

  // Récupérer les séances d'un programme par jour
  static async getSeancesParJour(programmeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/${programmeId}/jours`, {
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des séances par jour');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.getSeancesParJour:', error);
      throw error;
    }
  }

  // Récupérer les séances d'un programme par date
  static async getSeancesParDate(programmeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/${programmeId}/dates`, {
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des séances par date');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.getSeancesParDate:', error);
      throw error;
    }
  }

  // Récupérer les statistiques de progression d'un programme
  static async getProgressionProgramme(programmeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/progression/${programmeId}`, {
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la progression');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.getProgressionProgramme:', error);
      throw error;
    }
  }

  // Récupérer les statistiques générales de l'utilisateur
  static async getStatistiquesUtilisateur() {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/statistiques`, {
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.getStatistiquesUtilisateur:', error);
      throw error;
    }
  }

  // Récupérer les séances d'un programme avec calendrier calculé automatiquement
  static async getSeancesCalendrier(programmeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/${programmeId}/seances-calendrier`, {
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des séances calendrier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.getSeancesCalendrier:', error);
      throw error;
    }
  }

  // Marquer une séance comme complétée
  static async marquerSeanceComplete(programmeId, seanceId, sessionData = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/${programmeId}/seances/${seanceId}/complete`, {
        method: 'POST',
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la complétion de la séance');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.marquerSeanceComplete:', error);
      throw error;
    }
  }

  // Reprendre un programme avec date optimisée
  static async reprendreProgrammeAvance(programmeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/utilisateur/reprendre-avance`, {
        method: 'POST',
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ programme_id: programmeId })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la reprise du programme');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.reprendreProgrammeAvance:', error);
      throw error;
    }
  }

  // Méthode de debug temporaire
  static async debugSessions() {
    try {
      const response = await fetch(`${API_BASE_URL}/programmes/debug/sessions`, {
        credentials: "include", // pour envoyer le cookie HttpOnly
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du debug des sessions');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProgrammeService.debugSessions:', error);
      throw error;
    }
  }
}

export default ProgrammeService; 