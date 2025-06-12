import { createContext, useContext, useState, useEffect } from "react";
import { getProfil, logout as apiLogout } from "../services/authservice";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getProfil()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, ready }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
