import React from 'react';

const SeanceStats = ({ seance }) => {
  if (!seance) return null;

  const formatDuree = (minutes) => {
    if (!minutes) return 'Non spécifiée';
    const heures = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (heures > 0) {
      return `${heures}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  const getNiveauColor = (niveau) => {
    switch (niveau?.toLowerCase()) {
      case 'facile': return 'bg-green-500';
      case 'intermédiaire': return 'bg-yellow-500';
      case 'difficile': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'mobilité': return '🔄';
      case 'renforcement': return '💪';
      case 'cardio': return '❤️';
      case 'étirement': return '🧘';
      case 'gainage': return '🛡️';
      case 'échauffement': return '🔥';
      case 'récupération': return '🌿';
      default: return '🏋️';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Durée estimée */}
      <div className="bg-black/40 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-2 rounded-xl">
            <span className="text-2xl">⏱️</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Durée</p>
            <p className="text-white font-semibold">
              {formatDuree(seance.duree_estimee)}
            </p>
          </div>
        </div>
      </div>

      {/* Niveau */}
      <div className="bg-black/40 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center space-x-3">
          <div className={`${getNiveauColor(seance.niveau_nom)}/20 p-2 rounded-xl`}>
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Niveau</p>
            <p className="text-white font-semibold">
              {seance.niveau_nom || 'Non spécifié'}
            </p>
          </div>
        </div>
      </div>

      {/* Type de séance */}
      <div className="bg-black/40 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-500/20 p-2 rounded-xl">
            <span className="text-2xl">{getTypeIcon(seance.type_seance)}</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Type</p>
            <p className="text-white font-semibold">
              {seance.type_seance || 'Mixte'}
            </p>
          </div>
        </div>
      </div>

      {/* Calories estimées */}
      <div className="bg-black/40 rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500/20 p-2 rounded-xl">
            <span className="text-2xl">🔥</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Calories</p>
            <p className="text-white font-semibold">
              {seance.calories_estimees ? `${seance.calories_estimees} kcal` : 'Non estimées'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeanceStats; 