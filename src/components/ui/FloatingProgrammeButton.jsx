import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Play, Square, RefreshCw, CheckCircle, Loader2 } from "lucide-react";

export default function FloatingProgrammeButton({ 
  show, 
  onClick, 
  loading = false, 
  type = 'suivre', // 'suivre', 'arreter', 'changer'
  programmeActuel,
  disabled = false
}) {
  const [visible, setVisible] = useState(show);
  const [animateOut, setAnimateOut] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (show) {
      setVisible(true);
      setAnimateOut(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (visible && !loading) {
      setAnimateOut(true);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        setAnimateOut(false);
      }, 200);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [show, visible, loading]);

  const getButtonConfig = () => {
    switch (type) {
      case 'suivre':
        return {
          icon: <Play size={20} />,
          label: 'Suivre ce programme',
          bgColor: 'bg-green-500 hover:bg-green-600',
          disabledColor: 'bg-gray-500'
        };
      case 'arreter':
        return {
          icon: <Square size={20} />,
          label: 'Arrêter de suivre',
          bgColor: 'bg-orange-500 hover:bg-orange-600',
          disabledColor: 'bg-gray-500'
        };
      case 'reprendre':
        return {
          icon: <Play size={20} />,
          label: 'Reprendre ce programme',
          bgColor: 'bg-green-500 hover:bg-green-600',
          disabledColor: 'bg-gray-500'
        };
      case 'changer':
        return {
          icon: <RefreshCw size={20} />,
          label: `Changer pour ce programme`,
          bgColor: 'bg-blue-500 hover:bg-blue-600',
          disabledColor: 'bg-gray-500'
        };
      case 'suivi':
        return {
          icon: <CheckCircle size={20} />,
          label: 'Vous suivez ce programme',
          bgColor: 'bg-green-500',
          disabledColor: 'bg-green-500'
        };
      default:
        return {
          icon: <Play size={20} />,
          label: 'Suivre ce programme',
          bgColor: 'bg-green-500 hover:bg-green-600',
          disabledColor: 'bg-gray-500'
        };
    }
  };

  const config = getButtonConfig();

  if (!visible) return null;
  
  return ReactDOM.createPortal(
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 right-4 ${
        loading || disabled 
          ? config.disabledColor + ' cursor-not-allowed' 
          : config.bgColor
      } uppercase text-white px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2 transition-all duration-300 text-sm font-medium ${
        animateOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      disabled={loading || disabled}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        config.icon
      )}
      <span>{config.label}</span>
    </button>,
    document.body
  );
} 