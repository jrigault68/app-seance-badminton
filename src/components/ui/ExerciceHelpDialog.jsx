import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Composant pour l'aide des exercices
export default function ExerciceHelpDialog({ open, onClose, exercice, modifiedData = null }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && exercice && exercice.id) {
      setLoading(true);
      setError(null);
      
      // On fait toujours l'appel API pour récupérer les données de base
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/exercices/${exercice.id}`)
        .then(r => r.json())
        .then(d => {
          if (d.exercice) {
            setDetails(d.exercice);
          } else {
            setError("Exercice non trouvé");
          }
        })
        .catch(() => setError("Erreur lors du chargement"))
        .finally(() => setLoading(false));
    } else if (!open) {
      setDetails(null);
      setError(null);
    }
  }, [open, exercice]);

  // Fonction pour fusionner les données modifiées avec les données de base
  const getDisplayData = () => {
    if (!details) return null;

    // Si on a des données modifiées, on les fusionne avec les données de base
    if (modifiedData) {
      return {
        ...details,
        ...modifiedData,
        // Pour les champs personnalisables, prioriser les données modifiées si elles ne sont pas vides
        nom: modifiedData.nom !== undefined 
          ? modifiedData.nom 
          : details.nom,
        description: modifiedData.description && modifiedData.description.trim() !== "" 
          ? modifiedData.description 
          : details.description,
        position_depart: modifiedData.position_depart && modifiedData.position_depart.trim() !== "" 
          ? modifiedData.position_depart 
          : details.position_depart,

        conseils: modifiedData.conseils && modifiedData.conseils.length > 0 
          ? modifiedData.conseils 
          : details.conseils,
        erreurs: modifiedData.erreurs && modifiedData.erreurs.length > 0 
          ? modifiedData.erreurs 
          : details.erreurs,
        focus_zone: modifiedData.focus_zone && modifiedData.focus_zone.length > 0 
          ? modifiedData.focus_zone 
          : details.focus_zone,
      };
    }
    
    return details;
  };

  const displayData = getDisplayData();

  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 sm:p-6 min-w-[320px] max-w-lg w-full max-h-[90vh] flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-orange-400 z-10"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
        <div className="text-rose-400 font-semibold mb-4 text-center pr-8">{displayData?.nom || exercice?.nom || 'Exercice'}</div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : displayData ? (
          <div className="text-sm text-gray-200 space-y-3 overflow-y-auto flex-1 pr-1">
            {displayData.position_depart && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Position de départ :</div>
                <div className="text-gray-300">{displayData.position_depart}</div>
              </div>
            )}
            {displayData.description && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Description :</div>
                <div className="text-gray-300">{displayData.description}</div>
              </div>
            )}
            {displayData.conseils && Array.isArray(displayData.conseils) && displayData.conseils.length > 0 && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Conseils :</div>
                <ul className="text-gray-300">
                  {displayData.conseils.map((conseil, i) => <li key={i}>{conseil}</li>)}
                </ul>
              </div>
            )}
            {displayData.erreurs && Array.isArray(displayData.erreurs) && displayData.erreurs.length > 0 && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">À éviter :</div>
                <ul className="text-gray-300">
                  {displayData.erreurs.map((erreur, i) => <li key={i}>{erreur}</li>)}
                </ul>
              </div>
            )}
            {displayData.focus_zone && Array.isArray(displayData.focus_zone) && displayData.focus_zone.length > 0 && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Zones à focus :</div>
                <ul className="text-gray-300">
                  {displayData.focus_zone.map((zone, i) => <li key={i}>{zone}</li>)}
                </ul>
              </div>
            )}
            {displayData.muscles_sollicites && Array.isArray(displayData.muscles_sollicites) && displayData.muscles_sollicites.length > 0 && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Muscles sollicités :</div>
                <ul className="text-gray-300">
                  {displayData.muscles_sollicites.map((muscle, i) => <li key={i}>{muscle}</li>)}
                </ul>
              </div>
            )}
            {displayData.image_url && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Image :</div>
                <img src={displayData.image_url} alt="Aperçu exercice" className="max-h-32 rounded mt-1" />
              </div>
            )}
            {displayData.video_url && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Vidéo :</div>
                <a href={displayData.video_url} target="_blank" rel="noopener noreferrer" className="text-orange-300 underline">
                  Voir la vidéo
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">Aucune information disponible</div>
        )}
      </div>
    </div>,
    document.body
  );
} 