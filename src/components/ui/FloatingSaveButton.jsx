import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Save, Loader2 } from "lucide-react";

export default function FloatingSaveButton({ show, onClick, loading = false, label = "Enregistrer", children }) {
  const [visible, setVisible] = useState(show);
  const [animateOut, setAnimateOut] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimateOut(false);
      // Annuler l'animation de sortie si elle était en cours
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (visible && !loading) {
      // Commencer la transition de sortie
      setAnimateOut(true);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        setAnimateOut(false);
      }, 200); // durée réduite pour la transition CSS
    }
    return () => clearTimeout(timeoutRef.current);
  }, [show, visible, loading]);

  if (!visible) return null;
  return ReactDOM.createPortal(
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 right-4 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} uppercase text-white px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2 transition-all duration-300 text-sm font-medium ${animateOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      disabled={loading}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <Save size={20} />
      )}
      <span>{children || label}</span>
    </button>,
    document.body
  );
} 