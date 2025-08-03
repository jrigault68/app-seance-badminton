const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class AdminService {
  async getUtilisateurs(search = "", sortBy = "last_connection", limit = 100) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
        params.append('sortBy', sortBy);
      params.append('limit', limit);
      
      const response = await fetch(`${apiUrl}/admin/utilisateurs?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Accès réservé aux administrateurs");
        }
        throw new Error("Erreur lors du chargement des utilisateurs");
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur AdminService.getUtilisateurs:', error);
      throw error;
    }
  }

  async getUtilisateurDetails(id) {
    try {
      const response = await fetch(`${apiUrl}/admin/utilisateurs/${id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Accès réservé aux administrateurs");
        }
        if (response.status === 404) {
          throw new Error("Utilisateur non trouvé");
        }
        throw new Error("Erreur lors du chargement des détails de l'utilisateur");
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur AdminService.getUtilisateurDetails:', error);
      throw error;
    }
  }

  async getSeancesRecentes(limit = 20, offset = 0, utilisateur_id = null) {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit);
      params.append('offset', offset);
      if (utilisateur_id) {
        params.append('utilisateur_id', utilisateur_id);
      }
      
      const response = await fetch(`${apiUrl}/admin/seances-recentes?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Accès réservé aux administrateurs");
        }
        throw new Error("Erreur lors du chargement des séances récentes");
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur AdminService.getSeancesRecentes:', error);
      throw error;
    }
  }
}

export default new AdminService(); 