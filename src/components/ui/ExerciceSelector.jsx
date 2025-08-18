import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import FloatingLabelInput from './FloatingLabelInput';
import { Search, X } from 'lucide-react';

// Composant Spinner réutilisable
const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function ExerciceSelector({ 
  open, 
  onClose, 
  onSelect, 
  title = "Sélectionner un exercice",
  placeholder = "Rechercher un exercice...",
  multiple = false,
  selectedExercices = [],
  onMultipleSelect = null
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(selectedExercices.map(e => e.id || e));

  // Debounce la recherche
  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search, open]);

  // Fetch dynamique à chaque recherche
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    params.append("limit", "50");
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/exercices?${params.toString()}`)
      .then(r => r.json())
      .then(d => setExercices(d.exercices || []))
      .finally(() => setLoading(false));
  }, [debouncedSearch, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (exercice) => {
    if (multiple) {
      const newSelectedIds = selectedIds.includes(exercice.id) 
        ? selectedIds.filter(id => id !== exercice.id)
        : [...selectedIds, exercice.id];
      setSelectedIds(newSelectedIds);
    } else {
      onSelect(exercice);
      onClose();
    }
  };

  const handleConfirmMultiple = () => {
    if (onMultipleSelect) {
      const selectedExercicesList = exercices.filter(ex => selectedIds.includes(ex.id));
      onMultipleSelect(selectedExercicesList);
    }
    onClose();
  };

  const isSelected = (exerciceId) => selectedIds.includes(exerciceId);

  console.log('🔍 ExerciceSelector render:', { open, exercices: exercices.length, loading, search });

  if (!open) {
    console.log('🔍 ExerciceSelector: not open, returning null');
    return null;
  }

  console.log('🔍 ExerciceSelector: rendering portal');
  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999999]"
      style={{ zIndex: 9999999 }}
      onClick={e => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700 min-w-[400px] w-[500px] max-w-full max-h-[90vh] flex flex-col"
        style={{ zIndex: 9999999 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-orange-300">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 flex-1 flex flex-col min-h-0">
          <div className="relative w-full">
            <FloatingLabelInput
              label="Rechercher"
              value={search}
              onChange={e => setSearch(e.target.value)}
              inputRef={inputRef}
              className="w-full pr-10"
              placeholder={placeholder}
            />
            {loading && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <Spinner />
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 rounded scrollbar-thumb-rounded-full scrollbar-track-rounded-full pr-1 transition-opacity duration-200" 
               style={{ scrollbarColor: '#374151 #111827', scrollbarWidth: 'thin', opacity: loading ? 0.7 : 1 }}>
            {(!loading && exercices.length === 0) ? (
              <div className="text-gray-400 text-center py-4">
                {search ? 'Aucun exercice trouvé' : 'Aucun exercice disponible'}
              </div>
            ) : (
              exercices.map(exo => (
                <button
                  key={exo.id}
                  onClick={() => handleSelect(exo)}
                  className={`p-3 bg-gray-800 rounded-md text-left text-sm hover:bg-gray-700 text-white border transition-colors duration-150 ${
                    isSelected(exo.id) 
                      ? 'border-orange-500 bg-orange-500/20' 
                      : 'border-gray-700'
                  }`}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <div className="font-medium">{exo.nom}</div>
                  {exo.description && (
                    <div className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {exo.description}
                    </div>
                  )}
                  {multiple && isSelected(exo.id) && (
                    <div className="text-orange-400 text-xs mt-1">
                      ✓ Sélectionné
                    </div>
                  )}
                </button>
              ))
            )}
          </div>

          {multiple && (
            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                {selectedIds.length} exercice(s) sélectionné(s)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmMultiple}
                  disabled={selectedIds.length === 0}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Confirmer ({selectedIds.length})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
