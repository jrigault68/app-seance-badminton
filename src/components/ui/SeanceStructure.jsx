import React, { useState } from 'react';
import { formatDureeTexte, estimerDureeEtape, getDetails } from '@/utils/helpers';
import { ChevronDown, ChevronRight, SquareChevronRight } from 'lucide-react';

const SeanceStructure = ({ structure, hideIcons }) => {
  if (!structure || !Array.isArray(structure)) {
    return (
      <div className="text-center text-gray-400 italic py-8">
        Aucune structure disponible
      </div>
    );
  }

  // Calcul du temps total (arrondi à la minute supérieure)
  const totalSeconds = structure.reduce((acc, etape) => acc + estimerDureeEtape(etape), 0);
  const totalMinutes = Math.ceil(totalSeconds / 60);

  // Pour gérer l'ouverture des blocs accordéon (par id ou index)
  const [openBlocks, setOpenBlocks] = useState({});
  const toggleBlock = (key) => setOpenBlocks((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderEtape = (etape, index, level = 0, parentKey = '') => {
    if (!etape) return null;
    const key = parentKey ? `${parentKey}-${index}` : `${index}`;
    const paddingLeft = level * 12; // plus compact

    if (etape.type === "bloc") {
      return (
        <div key={key} className="mb-2 border border-gray-700 rounded-lg bg-black/30">
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 focus:outline-none transition group hover:bg-white/10"
            style={{ paddingLeft: `${paddingLeft + 4}px`, borderRadius: '0.5rem' }}
            onClick={() => toggleBlock(key)}
            aria-expanded={!!openBlocks[key]}
          >
            <div className="flex items-center gap-2">
              {/* Icône accordéon animée : SquareChevronRight uniquement */}
              <span className="mr-1 flex items-center ml-2">
                <SquareChevronRight size={20} className="text-white transition-transform duration-200" style={{ transform: openBlocks[key] ? 'rotate(90deg)' : 'rotate(0deg)' }} />
              </span>
              <span className="font-semibold text-white mr-2">{etape.nom || 'Section'}</span>
              {etape.nbTours > 1 && (
                <span className="text-xs text-orange-200 font-semibold ml-1">{etape.nbTours} tours</span>
              )}
            </div>
          </button>
          {openBlocks[key] && (
            <div className="pl-4 pr-2 pb-2 pt-1">
              {(etape.contenu || []).map((sousEtape, i) =>
                renderEtape(sousEtape, i, level + 1, key)
              )}
            </div>
          )}
        </div>
      );
    }

    // Etape/exercice
    const nom = etape.nom || etape.id || "Exercice";
    const desc = getDetails(etape);
    // Compact : nom, durée, reps, description
    return (
      <div
        key={key}
        className="flex items-center border border-gray-800 rounded-md bg-black/20 px-3 py-2 mb-1 text-sm"
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
      >
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-white mr-2">{nom}</span>
          {desc && <span className="text-xs text-blue-200">{desc}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {structure.map((etape, idx) => renderEtape(etape, idx))}
    </div>
  );
};

export default SeanceStructure; 