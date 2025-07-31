import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import programmeService from '../../services/programmeService';

const ProgressionProgramme = ({ programme, progression = {} }) => {
  const [stats, setStats] = useState({
    totalSeances: 0,
    seancesCompletees: 0,
    pourcentage: 0,
    joursRestants: 0,
    objectifAtteint: false
  });
  const [loading, setLoading] = useState(true);

  // Charger les vraies données de progression
  useEffect(() => {
    const chargerProgression = async () => {
      if (!programme?.id) return;
      
      setLoading(true);
      try {
        const progressionData = await programmeService.getProgressionProgramme(programme.id);
        setStats({
          totalSeances: progressionData.totalSeances,
          seancesCompletees: progressionData.seancesCompletees,
          pourcentage: progressionData.pourcentage,
          joursRestants: progressionData.joursRestants,
          objectifAtteint: progressionData.pourcentage >= 100
        });
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
        // En cas d'erreur, on utilise des données par défaut
        setStats({
          totalSeances: 0,
          seancesCompletees: 0,
          pourcentage: 0,
          joursRestants: 0,
          objectifAtteint: false
        });
      } finally {
        setLoading(false);
      }
    };

    chargerProgression();
  }, [programme?.id]);

  const getCouleurProgression = (pourcentage) => {
    if (pourcentage >= 80) return 'from-green-500 to-green-600';
    if (pourcentage >= 60) return 'from-blue-500 to-blue-600';
    if (pourcentage >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 rounded-2xl p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-3 bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
          Progression du programme
        </h3>
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-300">
            {stats.pourcentage}% complété
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Séances complétées</span>
          <span>{stats.seancesCompletees}/{stats.totalSeances}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${getCouleurProgression(stats.pourcentage)} transition-all duration-500`}
            style={{ width: `${stats.pourcentage}%` }}
          ></div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {stats.seancesCompletees}
              </div>
              <div className="text-xs text-gray-400">
                Séances terminées
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {stats.joursRestants}
              </div>
              <div className="text-xs text-gray-400">
                Jours restants
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {stats.pourcentage}%
              </div>
              <div className="text-xs text-gray-400">
                Progression
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message d'encouragement */}
      {stats.pourcentage > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-300">
              {stats.pourcentage >= 80 
                ? "Excellent travail ! Vous êtes presque au bout ! 🎉"
                : stats.pourcentage >= 50
                ? "Continuez comme ça ! Vous progressez bien ! 💪"
                : "Bonne progression ! Gardez le rythme ! 🚀"
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressionProgramme; 