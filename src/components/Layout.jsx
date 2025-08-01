import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, ChevronLeft, MoreVertical, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../contexts/PageTitleContext";
import { useWakeLock } from "../utils/useWakeLock";
import { useUser } from "../contexts/UserContext";

function ActionButton({ icon, label, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-full hover:bg-rose-800/60 transition flex items-center justify-center ${className}`}
      title={label}
      aria-label={label}
      type="button"
    >
      {icon}
    </button>
  );
}

function ActionsMenu({ actions, onClose }) {
  // Animation fermeture
  const [closing, setClosing] = useState(false);
  // Calculer la largeur minimale requise pour le plus long label
  const longestLabel = actions.reduce((max, a) => a.label.length > max.length ? a.label : max, '');
  const minWidth = Math.max(180, longestLabel.length * 12 + 60); // 12px par caractère + icône + padding
  useEffect(() => {
    if (!closing) return;
    const timeout = setTimeout(() => onClose(), 180);
    return () => clearTimeout(timeout);
  }, [closing, onClose]);
  return (
    <div
      className={`absolute right-2 top-12 z-50 bg-[#18191a] border border-gray-700 rounded-xl shadow-lg py-2 ${closing ? 'animate-dropdown-out' : 'animate-dropdown'}`}
      style={{ minWidth }}
    >
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => { action.onClick(); setClosing(true); }}
          className="w-full flex items-center gap-3 px-5 py-3 text-base text-white hover:bg-rose-900/40 transition text-left"
        >
          {React.cloneElement(action.icon, { size: 22 })}
          <span className="whitespace-nowrap">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

// Composant pour l'indicateur Wake Lock (visible uniquement pour les admins)
function WakeLockIndicator() {
  const { user } = useUser();
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  
  // Détecter si on est sur une page d'exécution de séance
  const isExecutionPage = window.location.pathname.includes('/execution');
  
  // Utiliser le hook Wake Lock pour détecter l'état
  useWakeLock(isExecutionPage);
  
  // Détecter l'état du Wake Lock
  useEffect(() => {
    const checkWakeLockState = () => {
      // Vérifier si on est sur une page d'exécution et si le Wake Lock est supporté
      const isActive = isExecutionPage && 'wakeLock' in navigator;
      setIsWakeLockActive(isActive);
    };
    
    checkWakeLockState();
    // Vérifier périodiquement
    const interval = setInterval(checkWakeLockState, 2000);
    
    return () => clearInterval(interval);
  }, [isExecutionPage]);
  
  // Ne pas afficher si l'utilisateur n'est pas admin
  if (!user?.is_admin) return null;
  
  // Ne pas afficher si le Wake Lock n'est pas actif
  if (!isWakeLockActive) return null;
  
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-full">
      <Monitor size={14} className="text-green-400" />
      <span className="text-xs text-green-400 font-medium">Wake Lock</span>
    </div>
  );
}

export function PageToolbar({ title, actions, leftAction, showMenuButton, onMenuClick, collapsed }) {
  // actions: tableau d'objets {icon, label, onClick, showOnMobile}
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const visibleActions = Array.isArray(actions) ? actions.filter(a => a) : [];
  return (
    <header
      className={`sticky top-0 z-30 h-14 flex items-center bg-rose-900/90 backdrop-blur border-b border-red-900/40 shadow-sm transition-all duration-200 ${collapsed ? 'md:pl-14' : 'md:pl-64'}`}
    >
      {/* Left action (ex: bouton retour) */}
      {leftAction && (
        <div className="flex items-center md:pl-2">{leftAction}</div>
      )}
      {/* Menu hamburger mobile uniquement si pas de leftAction */}
      {!leftAction && showMenuButton && (
        <button
          className="mr-2 ml-1 flex md:hidden items-center justify-center rounded-full p-3 hover:bg-rose-800/60 transition"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
        >
          <Menu size={26} className="text-rose-200" />
        </button>
      )}
      <h1 className={`${leftAction ? 'md:pl-0' : 'md:pl-8'} text-lg font-semibold text-white truncate flex-1 select-none`}>{title}</h1>
      {/* Actions à droite */}
      <div className="flex items-center gap-2 pr-4 relative">
        {/* Indicateur Wake Lock pour les admins */}
        <WakeLockIndicator />
        
        {/* Desktop: tous les boutons visibles, Mobile: menu si >1 action */}
        {visibleActions.length > 0 && (
          <>
            <div className="hidden md:flex gap-2">
              {visibleActions.map((action, idx) => (
                <ActionButton key={idx} className="text-white" icon={action.icon} label={action.label} onClick={action.onClick} />
              ))}
            </div>
            <div className="flex md:hidden">
              {visibleActions.length === 1 ? (
                <ActionButton className="text-white" icon={visibleActions[0].icon} label={visibleActions[0].label} onClick={visibleActions[0].onClick} />
              ) : (
                <>
                  <button
                    className="p-3 text-white rounded-full hover:bg-rose-800/60 transition flex items-center justify-center"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Plus d'actions"
                    type="button"
                  >
                    <MoreVertical size={22} className="text-white" />
                  </button>
                  {menuOpen && <ActionsMenu actions={visibleActions} onClose={() => setMenuOpen(false)} />}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default function Layout({ children, pageTitle, pageActions, pageLeftAction, backTo, backLabel, onBackClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false;
  });
  const { setPageTitle } = usePageTitle();
  
  // Synchronise le localStorage si modifié par Sidebar
  const handleCollapse = (value) => {
    setCollapsed(value);
    localStorage.setItem('sidebar-collapsed', value);
  };
  
  // Mettre à jour le titre de la page quand pageTitle change
  useEffect(() => {
    setPageTitle(pageTitle);
  }, [pageTitle, setPageTitle]);
  
  const navigate = useNavigate();
  // Générer le bouton retour si backTo fourni
  const leftAction = backTo
    ? (
      <button
        onClick={onBackClick || (() => navigate(backTo))}
        className="mr-2 ml-1 flex items-center justify-center rounded-full p-3 hover:bg-rose-800/60 transition"
        aria-label={backLabel || "Retour"}
      >
        <ChevronLeft size={24} className="text-rose-200" />
      </button>
    )
    : pageLeftAction;
  return (
    <div className="min-h-screen w-full bg-[#18191a]">
      {/* Sidebar fixe à gauche (desktop) ou drawer (mobile) */}
      <Sidebar
        logoZoneClass="h-14 flex items-center border-b border-red-900/40"
        logoSizeClass="h-8 w-8"
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={handleCollapse}
      />
      {/* Toolbar d'en-tête sticky */}
      <div className="fixed top-0 left-0 w-full z-30">
        <PageToolbar
          title={pageTitle}
          actions={pageActions}
          leftAction={leftAction}
          showMenuButton={true}
          onMenuClick={() => setSidebarOpen(true)}
          collapsed={collapsed}
        />
      </div>
      {/* Contenu principal avec padding à gauche pour la sidebar desktop */}
      <main
        className={`transition-all duration-200 min-h-screen flex flex-col pt-14 ${collapsed ? 'md:pl-14' : 'md:pl-64'}`}
      >
        {children}
      </main>
    </div>
  );
} 