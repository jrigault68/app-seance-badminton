import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { getDisplayName, getTagline, BRAND_CONFIG } from "../config/brand";

export default function Accueil() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profil");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-black">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-red-400">Bienvenue sur {getDisplayName()} !</h1>
        <p className="text-xl text-gray-300 mb-4">{getTagline()}</p>
        <p className="text-lg text-gray-200 mb-8 max-w-xl">
          Organisez, suivez et optimisez vos séances de badminton facilement. Connectez-vous pour accéder à votre espace personnel, suivre vos progrès et découvrir des programmes adaptés à votre niveau.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-lg font-semibold text-white shadow-md"
        >
          Connexion / Inscription
        </button>
      </div>
    </div>
  );
} 