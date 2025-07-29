import React, { useState, useEffect } from 'react';

// Composant pour l'aide des exercices
export default function ExerciceHelpDialog({ open, onClose, exercice }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && exercice && exercice.id) {
      setLoading(true);
      setError(null);
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

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
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
        <div className="text-rose-400 font-semibold mb-4 text-center pr-8">{exercice?.nom || 'Exercice'}</div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : details ? (
          <div className="text-sm text-gray-200 space-y-3 overflow-y-auto flex-1 pr-1">
            {details.position_depart && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Position de départ :</div>
                <div className="text-gray-300">{details.position_depart}</div>
              </div>
            )}
            {details.description && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Description :</div>
                <div className="text-gray-300">{details.description}</div>
              </div>
            )}
            {details.conseils && Array.isArray(details.conseils) && details.conseils.length > 0 && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Conseils :</div>
                <ul className="text-gray-300">
                  {details.conseils.map((conseil, i) => <li key={i}>{conseil}</li>)}
                </ul>
              </div>
            )}
            {details.erreurs && Array.isArray(details.erreurs) && details.erreurs.length > 0 && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">À éviter :</div>
                <ul className="text-gray-300">
                  {details.erreurs.map((erreur, i) => <li key={i}>{erreur}</li>)}
                </ul>
              </div>
            )}
            {details.focus_zone && Array.isArray(details.focus_zone) && details.focus_zone.length > 0 && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Zones à focus :</div>
                <ul className="text-gray-300">
                  {details.focus_zone.map((zone, i) => <li key={i}>{zone}</li>)}
                </ul>
              </div>
            )}
            {details.muscles_sollicites && Array.isArray(details.muscles_sollicites) && details.muscles_sollicites.length > 0 && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Muscles sollicités :</div>
                <ul className="text-gray-300">
                  {details.muscles_sollicites.map((muscle, i) => <li key={i}>{muscle}</li>)}
                </ul>
              </div>
            )}
            {details.image_url && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Image :</div>
                <img src={details.image_url} alt="Aperçu exercice" className="max-h-32 rounded mt-1" />
              </div>
            )}
            {details.video_url && (
              <div>
                <div className="font-semibold text-orange-300 mb-1">Vidéo :</div>
                <a href={details.video_url} target="_blank" rel="noopener noreferrer" className="text-orange-300 underline">
                  Voir la vidéo
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">Aucune information disponible</div>
        )}
      </div>
    </div>
  );
} 