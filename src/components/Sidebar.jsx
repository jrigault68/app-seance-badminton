import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Home, Dumbbell, User, LogIn, Calendar, Menu, X, ChevronLeft, ChevronRight, LogOut, Activity } from "lucide-react";

// Palette principale
const COLORS = {
  bg: "bg-black",
  sidebar: "bg-red-950",
  accent: "text-rose-300",
  activeBg: "bg-rose-900/90",
  inactive: "text-gray-300",
  border: "border-r border-red-900/60",
};

const navigationItems = (user) => user ? [
  {
    name: "Profil",
    path: "/profil",
    icon: <User size={22} />,
  },
  {
    name: "Programmes",
    path: "/programmes",
    icon: <Calendar size={22} />,
  },
  {
    name: "Séances",
    path: "/seances",
    icon: <Dumbbell size={22} />,
  },
  {
    name: "Exercices",
    path: "/exercices",
    icon: <Activity size={22} />,
  },
  
  
] : [
  {
    name: "Accueil",
    path: "/",
    icon: <Home size={22} />,
  },
  {
    name: "Exercices",
    path: "/exercices",
    icon: <Activity size={22} />,
  },
  {
    name: "Inscription",
    path: "/login?tab=inscription",
    icon: <User size={22} />,
  },
  {
    name: "Connexion",
    path: "/login?tab=login",
    icon: <LogIn size={22} />,
  },
  
];

// Icône custom hamburger + flèche, avec rotation animée
function SidebarToggleIcon({ collapsed }) {
  // Largeurs animées des barres
  const color = '#d1d5db'; // gris comme les liens inactifs
  const topWidth = collapsed ? 7 : 10;
  const midWidth = collapsed ? 10 : 7;
  const botWidth = collapsed ? 7 : 10;
  // Décalage x pour centrer la barre raccourcie
  const topX = 7;
  const midX = collapsed ? 7 : 7;
  const botX = 7;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hamburger animé */}
      <rect x={topX} y="10" width={topWidth} height="2" rx="1" fill={color} style={{ transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)' }} />
      <rect x={midX} y="15" width={midWidth} height="2" rx="1" fill={color} style={{ transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)' }} />
      <rect x={botX} y="20" width={botWidth} height="2" rx="1" fill={color} style={{ transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)' }} />
      {/* Flèche, animée */}
      <g style={{
        transform: `rotate(${collapsed ? 0 : 180}deg)`,
        transformOrigin: '22px 16px',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)'
      }}>
        <path d="M18 10 L24 16 L18 22" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function Sidebar({ logoZoneClass = 'py-4 select-none', logoSizeClass = 'w-6 h-6', separatorAlignClass = 'mt-4', open, setOpen, collapsed, setCollapsed }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Sauvegarder l'état collapsed dans localStorage
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Sidebar content (réutilisé pour desktop et mobile)
  const sidebarContent = (
    <div className={`flex flex-col h-full ${collapsed ? 'w-14' : 'w-64'} ${COLORS.sidebar} ${COLORS.border} shadow-xl transition-all duration-200`}>
      {/* Top: bouton réduire + logo */}
      <div className={`flex items-center justify-start px-2 ${logoZoneClass}`}> 
        {/* Bouton réduire/agrandir aligné comme un lien */}
        
          <button
            onClick={handleCollapse}
            className="hidden md:flex items-center justify-center rounded-full transition-all duration-200 hover:bg-red-900/40 p-1"
            title={collapsed ? 'Agrandir' : 'Réduire'}
            tabIndex={0}
          >
            <SidebarToggleIcon collapsed={collapsed} />
          </button>
        {/* Bouton fermer (mobile uniquement, menu ouvert) */}
        {open && (
          <button
            className="items-center justify-center rounded-full transition-all duration-200 hover:bg-red-900/40 p-2 flex md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={26} className="text-rose-200" />
          </button>
        )}
        {/* Logo et titre alignés comme le texte des liens */}
        {!collapsed && (
          <div className={`flex items-center cursor-pointer select-none ml-1 md:ml-2`} onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="Logo" className={`${logoSizeClass} hidden`} />
            <span className="text-lg font-bold text-red-400 tracking-wide">Smart</span>
            <span className="text-lg font-bold text-white">Sports</span>
          </div>
        )}
        
      </div>
      {/* Séparateur sous le logo */}
      {/* plus de séparateur ici, il est dans logoZoneClass */}
      {/* Navigation */}
      <nav className={`flex-1 flex flex-col mt-2`}>
        {navigationItems(user).map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.name}
              onClick={() => { navigate(item.path); setOpen(false); }}
              className={`flex items-center w-full py-3 mb-1 rounded-l-full transition-all duration-200 text-base font-medium pl-4 justify-start leading-none ${active ? COLORS.accent + ' ' + COLORS.activeBg : COLORS.inactive + ' hover:bg-white/10'} focus:outline-none`}
              title={item.name}
            >
              <span className="w-7 min-w-7 flex justify-center">{item.icon}</span>
              <span
                className={`transition-all duration-300 overflow-hidden whitespace-nowrap min-w-0 ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[180px] opacity-100 ml-3'}`}
                style={{ display: 'inline-block', lineHeight: '22px' }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
      {/* Bas de sidebar : utilisateur/actions + déconnexion */}
      <div className="border-t border-red-900/40 mt-auto flex flex-col">
        {user ? (
          <>
            {user.is_admin && (
              <button
                onClick={() => { navigate('/admin-exercices'); setOpen(false); }}
                className={`flex items-center w-full mt-2 py-3 mb-1 rounded-l-full transition-all duration-200 text-base font-medium text-blue-400 hover:bg-blue-900/60 focus:outline-none pl-4 justify-start leading-none`}
                title="Admin"
              >
                <span className="w-7 min-w-7 flex justify-center"><User size={22} /></span>
                <span
                  className={`transition-all duration-300 overflow-hidden whitespace-nowrap min-w-0 ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[180px] opacity-100 ml-3'}`}
                  style={{ display: 'inline-block' }}
                >
                  Admin
                </span>
              </button>
            )}
            {/* Bouton Déconnexion comme item de menu en bas */}
            <button
              onClick={() => { logout(); navigate('/login'); setOpen(false); }}
              className={`flex items-center w-full py-3 mb-1 rounded-l-full transition-all duration-200 text-base font-medium text-gray-300 hover:bg-black/80 focus:outline-none pl-4 justify-start leading-none`}
              title="Déconnexion"
            >
              <span className="w-7 min-w-7 flex justify-center"><LogOut size={22} /></span>
              <span
                className={`transition-all duration-300 overflow-hidden whitespace-nowrap min-w-0 ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[180px] opacity-100 ml-3'}`}
                style={{ display: 'inline-block' }}
              >
                Déconnexion
              </span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full z-50">
        {sidebarContent}
      </aside>
      {/* Animation ouverture/fermeture du drawer mobile */}
      <MobileSidebarDrawer open={open} onClose={() => setOpen(false)}>{sidebarContent}</MobileSidebarDrawer>
    </>
  );
}

// Composant pour gérer l'animation d'ouverture/fermeture du drawer mobile
function MobileSidebarDrawer({ open, onClose, children }) {
  const [show, setShow] = useState(open);
  const [closing, setClosing] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (open) {
      setShow(true);
      setClosing(false);
    } else if (show) {
      setClosing(true);
      timeoutRef.current = setTimeout(() => {
        setShow(false);
        setClosing(false);
      }, 250); // durée de l'animation
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Sidebar drawer */}
      <div className={`relative h-full ${closing ? 'animate-slideOutLeft' : 'animate-slideInLeft'}`}>
        {children}
      </div>
    </div>
  );
}

// Animation utilitaire (à ajouter dans tailwind.config.js si besoin)
// .animate-slideInLeft { animation: slideInLeft 0.25s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
// .animate-slideOutLeft { animation: slideOutLeft 0.25s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } } 