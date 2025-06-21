import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, ready } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (ready && !user) {
      navigate("/login", { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [ready, user, navigate, location.pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900 text-white">
        <p>Chargement...</p>
      </div>
    );
  }

  return user ? children : null;
}
