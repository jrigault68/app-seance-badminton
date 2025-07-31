import React from 'react';
import { Calendar, Target, User, Play, CheckCircle, Clock } from 'lucide-react';

const ProgrammeActuelCard = ({ programme, onVoirProgramme }) => {
  if (!programme) return null;

  const getStatusColor = () => {
    // Logique pour déterminer la couleur selon le type de programme
    return 'bg-gradient-to-r from-blue-500 to-purple-600';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6 mb-6 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${getStatusColor()}`}>
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{programme.nom}</h3>
            <p className="text-gray-400 text-sm flex items-center">
              <User className="w-4 h-4 mr-1" />
              {programme.pseudo_createur || 'Créateur inconnu'}
            </p>
          </div>
        </div>
        <button
          onClick={onVoirProgramme}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Voir le programme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 text-sm">Type</span>
          </div>
          <p className="text-white font-medium mt-1">
            {programme.type_programme === 'libre' ? 'Programme libre' : 'Programme calendaire'}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-gray-300 text-sm">Objectif</span>
          </div>
          <p className="text-white font-medium mt-1">
            {programme.objectif || 'Non spécifié'}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-300 text-sm">Durée</span>
          </div>
          <p className="text-white font-medium mt-1">
            {programme.nb_jours ? `${programme.nb_jours} jours` : 'Non spécifiée'}
          </p>
        </div>
      </div>

      {programme.description && (
        <div className="bg-gray-800/30 rounded-lg p-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            {programme.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgrammeActuelCard; 