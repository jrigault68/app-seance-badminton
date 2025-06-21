import React from "react";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

export default function Layout({ children, showBottomNav = true }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-950 via-black to-red-900">
      {/* Header fixe en haut */}
      <Header />
      
      {/* Contenu principal avec padding pour header et navigation */}
      <main className={`pt-20 ${showBottomNav ? 'pb-20' : ''} min-h-screen flex flex-col justify-evenly`}>
        {children}
      </main>
      
      {/* Navigation en bas (mobile uniquement) */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
} 