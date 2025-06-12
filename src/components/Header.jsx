import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <header className="bg-black/40 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Mon App Séance</h1>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300 hidden sm:inline">Bienvenue, {user.nom}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-semibold"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-semibold"
        >
          Connexion
        </button>
      )}
    </header>
  );
}
