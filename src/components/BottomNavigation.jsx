import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Home, Dumbbell, User, LogIn } from "lucide-react";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navigationItems = user ? [
    {
      name: "Séances",
      path: "/recherche",
      icon: <Dumbbell size={20} />,
      activeIcon: <Dumbbell size={20} />
    },
    {
      name: "Profil",
      path: "/profil",
      icon: <User size={20} />,
      activeIcon: <User size={20} />
    }
  ] : [
    {
      name: "Accueil",
      path: "/",
      icon: <Home size={20} />,
      activeIcon: <Home size={20} />
    },
    {
      name: "Séances",
      path: "/recherche",
      icon: <Dumbbell size={20} />,
      activeIcon: <Dumbbell size={20} />
    },
    {
      name: "Connexion",
      path: "/login",
      icon: <LogIn size={20} />,
      activeIcon: <LogIn size={20} />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-gray-800 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-all duration-200 ${
                active
                  ? "text-orange-400 bg-orange-400/10"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`}
            >
              <span className="mb-1">
                {active ? item.activeIcon : item.icon}
              </span>
              <span className={`text-xs font-medium ${
                active ? "text-orange-400" : "text-gray-400"
              }`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
} 