const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class AdminService {
  async getUtilisateurs(search = "", sortBy = "last_connection", limit = 100) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      // Ajout d'un tri secondaire par défaut (ex: par nom si égalité sur sortBy)
      if (sortBy) {
        params.append('sortBy', sortBy);
        // Ajoute un tri secondaire par 'nom' si le tri principal n'est pas déjà 'nom'
        if (sortBy !== 'last_session') {
          params.append('sortBy', 'last_session');
        }
      }
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
}

export default new AdminService(); 