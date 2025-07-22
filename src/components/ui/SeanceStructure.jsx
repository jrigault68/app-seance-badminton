import React from 'react';
import { formatDureeTexte, estimerDureeEtape, getDetails } from '@/utils/helpers';

const SeanceStructure = ({ structure }) => {
  if (!structure || !Array.isArray(structure)) {
    return (
      <div className="text-center text-gray-400 italic py-8">
        Aucune structure disponible
      </div>
    );
  }

  const totalSeconds = structure.reduce((acc, etape) => acc + estimerDureeEtape(etape), 0);

  const renderEtape = (etape, index, level = 0) => {
    if (!etape) return null;

    const paddingLeft = level * 16; // 16px par niveau

    if (etape.type === "bloc") {
      return (
        <div key={index} className="mb-4">
          <div 
            className="bg-gradient-to-r from-red-900/50 to-red-800/30 border border-red-700/50 rounded-xl p-4 mb-3"
            style={{ paddingLeft: `${paddingLeft + 16}px` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔁</span>
                <div>
                  <h4 className="font-semibold text-orange-300">
                    {etape.nom || 'Section'} (x{etape.nbTours || 1})
                  </h4>
                  <p className="text-sm text-gray-400">
                    Durée estimée: ~{formatDureeTexte(etape.contenu?.reduce((acc, e) => acc + estimerDureeEtape(e), 0) * (etape.nbTours || 1))}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {(etape.contenu || []).map((sousEtape, i) => 
              renderEtape(sousEtape, `${index}-${i}`, level + 1)
            )}
          </div>
        </div>
      );
    }

    // Les détails de l'exercice viennent maintenant de la base de données
    // via les props ou le contexte
    const nom = etape.nom || etape.id || "Exercice";
    const desc = getDetails(etape);
    const duree = estimerDureeEtape(etape);
    const categorieIcon = etape.categorie_icone || '💪';

    return (
      <div 
        key={index} 
        className="bg-black/40 border border-gray-700 rounded-xl p-4 mb-2 hover:bg-black/60 transition-colors duration-200"
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">
              <span className="text-lg">
                {categorieIcon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white mb-1">{nom}</h4>
              <p className="text-sm text-gray-300">{desc}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="bg-gray-800/50 px-2 py-1 rounded-lg">
              ⏱️ {formatDureeTexte(duree)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <span className="mr-2">📋</span>
          Structure de la séance
        </h3>
        <div className="text-sm text-gray-400 bg-black/40 px-3 py-1 rounded-lg border border-gray-700">
          Durée totale: ~{formatDureeTexte(totalSeconds)}
        </div>
      </div>

      <div className="bg-black/20 rounded-2xl p-4 border border-gray-700">
        <div className="space-y-2">
          {structure.map((etape, idx) => renderEtape(etape, idx))}
        </div>
      </div>
    </div>
  );
};

export default SeanceStructure; 