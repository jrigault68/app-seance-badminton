import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, CheckCircle, Clock, Calendar } from 'lucide-react';
import programmeService from '../../services/programmeService';

const SemaineProgramme = ({ programmeId, onSeanceClick }) => {
  const [semaineActuelle, setSemaineActuelle] = useState(new Date());
  const [seancesSemaine, setSeancesSemaine] = useState([]);
  const [loading, setLoading] = useState(true);

  // Générer les jours de la semaine
  const getJoursSemaine = (date) => {
    const jours = [];
    const debut = new Date(date);
    debut.setDate(debut.getDate() - debut.getDay() + 1); // Lundi

    for (let i = 0; i < 7; i++) {
      const jour = new Date(debut);
      jour.setDate(debut.getDate() + i);
      jours.push(jour);
    }
    return jours;
  };

  // Charger les séances de la semaine
  useEffect(() => {
    const chargerSeances = async () => {
      if (!programmeId) return;
      
      setLoading(true);
      try {
        // Récupérer les séances avec leurs vraies dates calculées
        const calendrierData = await programmeService.getSeancesCalendrier(programmeId);
        const jours = getJoursSemaine(semaineActuelle);
        
        // Mapper les séances aux jours de la semaine selon leur vraie date
        const seancesSemaine = jours.map((jour) => {
          const dateJour = jour.toISOString().split('T')[0]; // Format YYYY-MM-DD
          
          // Trouver les séances qui correspondent à cette date
          const seancesDuJour = calendrierData.seances.filter(seance => 
            seance.date === dateJour
          );
          
          return {
            jour: jour,
            seances: seancesDuJour.map(seance => ({
              id: seance.seance.id,
              nom: seance.seance.nom,
              duree: seance.seance.duree_estimee ? `${Math.round(seance.seance.duree_estimee / 60)} min` : '45 min',
              niveau: seance.seance.niveau?.nom || 'Intermédiaire',
              completed: seance.est_completee,
              est_aujourd_hui: seance.est_aujourd_hui,
              est_a_venir: seance.est_a_venir,
              session_data: seance.session_data
            }))
          };
        });
        
        setSeancesSemaine(seancesSemaine);
      } catch (error) {
        console.error('Erreur lors du chargement des séances:', error);
        // En cas d'erreur, on affiche des données simulées
        const jours = getJoursSemaine(semaineActuelle);
        const seancesSimulees = jours.map((jour, index) => ({
          jour: jour,
          seances: index % 2 === 0 ? [
            {
              id: `seance-${index}`,
              nom: `Séance ${index + 1}`,
              duree: '45 min',
              niveau: 'Intermédiaire',
              completed: index < 2
            }
          ] : []
        }));
        setSeancesSemaine(seancesSimulees);
      } finally {
        setLoading(false);
      }
    };

    chargerSeances();
  }, [programmeId, semaineActuelle]);

  const changerSemaine = (direction) => {
    const nouvelleSemaine = new Date(semaineActuelle);
    nouvelleSemaine.setDate(nouvelleSemaine.getDate() + (direction === 'next' ? 7 : -7));
    setSemaineActuelle(nouvelleSemaine);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const isAujourdhui = (date) => {
    const aujourdhui = new Date();
    return date.toDateString() === aujourdhui.toDateString();
  };

  const getStatusSeance = (seance) => {
    if (seance.completed) return 'completed';
    if (seance.est_aujourd_hui) return 'today';
    if (seance.est_a_venir) return 'future';
    return 'past';
  };

  const handleSeanceClick = (seance) => {
    if (onSeanceClick) {
      onSeanceClick(seance);
    } else {
      // Navigation par défaut vers la page de détail de la séance
      if (seance && seance.id) {
        window.location.href = `/seances/${seance.id}`;
      }
    }
  };

  const raccourcirNom = (nom, maxLength = 25) => {
    if (nom.length <= maxLength) return nom;
    return nom.substring(0, maxLength - 3) + '...';
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-400" />
          Programme de la semaine
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => changerSemaine('prev')}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => changerSemaine('next')}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {seancesSemaine.map((jour, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 min-h-[140px] ${
              isAujourdhui(jour.jour) 
                ? 'bg-blue-500/20 border border-blue-400' 
                : 'bg-gray-700/50'
            }`}
          >
            <div className="text-center mb-2">
              <div className={`text-xs font-medium ${
                isAujourdhui(jour.jour) ? 'text-blue-300' : 'text-gray-400'
              }`}>
                {formatDate(jour.jour)}
              </div>
            </div>

            <div className="space-y-2">
              {jour.seances.map((seance) => {
                const status = getStatusSeance(seance);
                return (
                                     <div
                     key={seance.id}
                     onClick={() => handleSeanceClick(seance)}
                     className={`p-2 rounded cursor-pointer transition-all ${
                      status === 'completed' 
                        ? 'bg-green-500/20 border border-green-400' 
                        : status === 'today'
                        ? 'bg-blue-500/20 border border-blue-400'
                        : 'bg-gray-600/50 hover:bg-gray-600/70'
                    }`}
                     title={`${seance.nom} - ${seance.duree}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate leading-tight" title={seance.nom}>
                          {raccourcirNom(seance.nom)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {seance.duree}
                        </div>
                        {seance.session_data && (
                          <div className="text-xs text-green-400 mt-1">
                            ✓ {seance.session_data.duree ? `${Math.round(seance.session_data.duree / 60)}min` : ''}
                            {seance.session_data.calories && ` • ${seance.session_data.calories} cal`}
                          </div>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : status === 'today' ? (
                          <Play className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemaineProgramme; 