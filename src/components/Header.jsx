import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Menu, X } from "lucide-react"; // Icônes
import { getDisplayName, BRAND_CONFIG } from "../config/brand";

export default function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { name: "Entraînement", path: "/seances" },
    // d'autres liens viendront ici
  ];

  return (
    <header className="bg-gradient-to-r from-red-950 via-red-900 to-black text-white px-6 py-4 flex justify-between items-center shadow-lg relative z-50">
      {/* Hamburger à gauche en mobile */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          className="md:hidden mr-2"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
        {/* Titre */}
        <div
          className="text-2xl font-semibold tracking-wide cursor-pointer hover:opacity-80 transition-opacity truncate"
          onClick={() => navigate("/")}
        >
          <span className="text-red-400">{BRAND_CONFIG.logo}</span> {getDisplayName()}
        </div>
      </div>

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
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

      {/* Bouton Connexion/Déconnexion toujours visible à droite */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {user ? (
          <>
            <span className="hidden md:inline text-sm text-gray-300">Bonjour, <span className="font-medium text-white">{user.nom}</span></span>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 px-4 py-1.5 rounded-xl text-sm font-semibold"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-xl text-sm font-semibold"
          >
            Connexion
          </button>
        )}
      </div>

      {/* Mobile Drawer (liens uniquement) */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-black/90 flex flex-col items-start px-6 py-4 gap-4 md:hidden shadow-2xl rounded-b-2xl backdrop-blur-sm z-50">
          {links.map(link => (
            <button
              key={link.name}
              onClick={() => {
                setOpen(false);
                navigate(link.path);
              }}
              className="text-white text-base font-medium w-full text-left hover:text-red-300"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
