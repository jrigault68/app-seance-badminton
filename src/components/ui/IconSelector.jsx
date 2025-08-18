import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Search, X, HelpCircle, ExternalLink } from 'lucide-react';
import { DynamicIcon, iconNames } from 'lucide-react/dynamic';

export default function IconSelector({ isOpen, onClose, onSelect, currentIcon = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const searchInputRef = useRef(null);

  // Filtrer les icônes selon la recherche
  const filteredIconsMemo = useMemo(() => {
    const searchLower = searchTerm.toLowerCase().trim();

    const icons = searchLower
      ? iconNames.filter(
          name =>
            name.toLowerCase().includes(searchLower) ||
            name.replace(/-/g, ' ').includes(searchLower) ||
            name.replace(/-/g, '').includes(searchLower),
        )
      : iconNames;

    return icons; // Afficher toutes les icônes par défaut
  }, [searchTerm]);

  // Mettre à jour les icônes filtrées
  useEffect(() => {
    setFilteredIcons(filteredIconsMemo);
  }, [filteredIconsMemo]);

  // Focus sur l'input de recherche à l'ouverture
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = useCallback((iconName) => {
    onSelect(iconName);
    onClose();
  }, [onSelect, onClose]);

  const handleClose = useCallback(() => {
    setSearchTerm('');
    onClose();
  }, [onClose]);

  const handleOpenLucideSite = useCallback(() => {
    window.open('https://lucide.dev/icons', '_blank');
  }, []);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Sélectionner une icône</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher une icône..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleOpenLucideSite}
              className="p-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-orange-500 transition flex items-center gap-1"
              title="Ouvrir le site Lucide pour plus d'icônes"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-4" 
          style={{ 
            maxHeight: '400px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#4B5563 #1F2937'
          }}
        >
          <style jsx>{`
            .icon-selector-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .icon-selector-scroll::-webkit-scrollbar-track {
              background: #1F2937;
              border-radius: 4px;
            }
            .icon-selector-scroll::-webkit-scrollbar-thumb {
              background: #4B5563;
              border-radius: 4px;
            }
            .icon-selector-scroll::-webkit-scrollbar-thumb:hover {
              background: #6B7280;
            }
          `}</style>
          <div className="icon-selector-scroll">
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              {searchTerm ? `Résultats (${filteredIcons.length})` : `Toutes les icônes (${filteredIcons.length})`}
            </h4>
            {filteredIcons.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Aucune icône trouvée pour "{searchTerm}"
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-2">
                {filteredIcons.map(iconName => (
                  <button
                    key={iconName}
                    onClick={() => handleSelect(iconName)}
                    className={`p-3 rounded-lg border transition-all hover:border-orange-500 hover:bg-gray-900 ${
                      currentIcon === iconName 
                        ? 'border-orange-500 bg-gray-900' 
                        : 'border-gray-600 bg-gray-900'
                    }`}
                    title={iconName.replace(/-/g, ' ')}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-white">
                        <DynamicIcon name={iconName} size={24} />
                      </div>
                      <span className="text-xs text-gray-400 text-center">
                        {iconName.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
