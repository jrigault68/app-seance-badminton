import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Save } from "lucide-react";

export default function FloatingSaveButton({ show, onClick, loading = false, label = "Enregistrer", children }) {
  const [visible, setVisible] = useState(show);
  const [animateOut, setAnimateOut] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimateOut(false);
    } else if (visible) {
      setAnimateOut(true);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        setAnimateOut(false);
      }, 250); // durée de l'animation de sortie
    }
    return () => clearTimeout(timeoutRef.current);
  }, [show, visible]);

  if (!visible) return null;
  return ReactDOM.createPortal(
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 right-4 bg-green-500 hover:bg-green-600 uppercase text-white px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2 transition-all duration-300 text-sm font-medium ${animateOut ? 'animate-slide-down-fade' : 'animate-slide-up-fade'}`}
      disabled={loading}
    >
      <Save size={20} />
      <span>{children || label}</span>
    </button>,
    document.body
  );
} 