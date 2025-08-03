import { createContext, useContext, useState, useEffect } from "react";
import { getProfil, logout as apiLogout } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // Chargement initial de l'utilisateur
  useEffect(() => {
    getProfil()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  // Mettre à jour last_connection périodiquement quand l'utilisateur est connecté
  useEffect(() => {
    if (!user) return;

    const updateLastConnection = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/profil`, {
          method: 'GET',
          credentials: 'include',
        });
      } catch (error) {
        console.warn('Erreur lors de la mise à jour de last_connection:', error);
      }
    };

    // Mettre à jour toutes les 30 minutes
    const interval = setInterval(updateLastConnection, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const logout = async () => {
    await apiLogout();
    setUser(null);
    // Rediriger vers l'accueil après déconnexion
    navigate('/', { replace: true });
  };

  const refreshUser = async () => {
    await getProfil()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, refreshUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
