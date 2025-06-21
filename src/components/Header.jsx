import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { User, LogOut } from "lucide-react"; // Icônes
import { getDisplayName, BRAND_CONFIG } from "../config/brand";

export default function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAuthClick = () => {
    // Si on est déjà sur la page de login, on bascule vers l'autre mode
    if (location.pathname === "/login") {
      const searchParams = new URLSearchParams(location.search);
      const currentTab = searchParams.get('tab');
      
      if (currentTab === 'inscription') {
        // Si on est en mode inscription, on passe en mode connexion
        navigate("/login?tab=login");
      } else {
        // Si on est en mode connexion (ou sans paramètre), on passe en mode inscription
        navigate("/login?tab=inscription");
      }
    } else {
      // Si on n'est pas sur la page de login, on y va en mode connexion
      navigate("/login?tab=login");
    }
  };

  const links = [
    { name: "Séances", path: "/recherche" },
    // d'autres liens viendront ici
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-950 via-red-900 to-black text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Logo à gauche */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          <div className="text-2xl font-semibold tracking-wide flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-red-400">Smart</span>
            <span className="text-white">Sports</span>
          </div>
        </div>
      </div>

      {/* Desktop Links - Centré */}
      <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
        {links.map(link => (
          <button
            key={link.name}
            onClick={() => navigate(link.path)}
            className="text-sm font-medium hover:text-red-300 transition-colors"
          >
            {link.name}
          </button>
        ))}
      </nav>

      {/* Bouton Connexion/Déconnexion à droite */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {user ? (
          <>
            <span className="hidden md:inline text-sm text-gray-300">Bonjour, <span className="font-medium text-white">{user.nom}</span></span>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 px-4 py-1.5 rounded-xl text-sm font-semibold"
            >
              <span className="hidden sm:inline">Déconnexion</span>
              <LogOut size={18} className="sm:hidden" />
            </button>
          </>
        ) : (
          <button
            onClick={handleAuthClick}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-xl text-sm font-semibold"
          >
            <span className="hidden sm:inline">Connexion / Inscription</span>
            <User size={18} className="sm:hidden" />
          </button>
        )}
      </div>
    </header>
  );
}
