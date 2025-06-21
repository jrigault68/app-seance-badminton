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
