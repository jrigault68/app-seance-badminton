import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, CalendarDays, ChevronDown, ChevronRight } from 'lucide-react';
import programmeService from '../../services/programmeService';
import SeanceStructure from './SeanceStructure';

const SemaineProgramme = ({ programmeId, onSeanceClick }) => {
  const [seancesSemaine, setSeancesSemaine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programmeInfo, setProgrammeInfo] = useState(null);
  const [calendrierDataComplet, setCalendrierDataComplet] = useState(null);
  const [openSeances, setOpenSeances] = useState({});

  // Charger les données étape par étape
  useEffect(() => {
    const chargerDonnees = async () => {
      if (!programmeId) return;
      
      setLoading(true);
      try {
        // ÉTAPE 1 : Récupérer les informations du programme
        const programmeData = await programmeService.getProgrammeActuel();
        if (!programmeData) {
          throw new Error('Aucun programme actuel trouvé');
        }
        
        setProgrammeInfo({
          type_programme: programmeData.type_programme,
          nb_jours: programmeData.nb_jours,
          date_debut: programmeData.date_debut,
          date_fin: programmeData.date_fin
        });

        // ÉTAPE 2 : Récupérer les séances avec toutes les informations (progression, sessions, etc.)
        const calendrierData = await programmeService.getSeancesCalendrier(programmeId);
        
        // Stocker les données complètes pour le calcul de progression
        setCalendrierDataComplet(calendrierData);
        
        // ÉTAPE 3 : Organiser les séances par jour
        const seancesOrganisees = organiserSeancesParJour(calendrierData.seances, programmeData.type_programme);
        
        // ÉTAPE 4 : Générer les 7 jours à afficher
        const joursAffiches = genererJoursAffiches(seancesOrganisees, programmeData);
        
        setSeancesSemaine(joursAffiches);
      } catch (error) {
        console.error('Erreur lors du chargement des séances:', error);
        setError('Impossible de charger les données du programme');
        setSeancesSemaine([]);
        setProgrammeInfo(null);
      } finally {
        setLoading(false);
      }
    };

    chargerDonnees();
  }, [programmeId]);

  // Fonction pour organiser les séances par jour
  const organiserSeancesParJour = (seancesData, typeProgramme) => {
    const seancesOrganisees = [];
    
    seancesData.forEach((seance, index) => {
      // Les données de getSeancesCalendrier ont déjà le jour calculé
      const jour = seance.jour;
      
      const seanceFormatee = {
        id: seance.seance.id,
        nom: seance.seance.nom,
        duree: seance.seance.duree_estimee ? `${Math.round(seance.seance.duree_estimee / 60)} min` : '45 min',
        niveau: seance.seance.niveau?.nom || 'Intermédiaire',
        completed: seance.est_completee,
        est_aujourd_hui: seance.est_aujourd_hui,
        est_a_venir: seance.est_a_venir,
        session_data: seance.session_data,
        date_reelle: seance.date,
        jour_programme: jour,
        index_global: index,
        seance: seance.seance // Garder l'objet séance complet pour l'accordéon
      };

      // Trouver ou créer le groupe pour ce jour
      let groupeJour = seancesOrganisees.find(g => g.jour === jour);
      if (!groupeJour) {
        groupeJour = {
          jour: jour,
          seances: [],
          date_reelle: seance.date
        };
        seancesOrganisees.push(groupeJour);
      }
      
      groupeJour.seances.push(seanceFormatee);
    });

    return seancesOrganisees;
  };

  // Fonction pour générer les 7 prochains jours (ou moins si programme plus court)
  const genererJoursAffiches = (seancesOrganisees, programmeData) => {
    // Déterminer le nombre total de jours du programme
    let totalJours;
    if (programmeData?.type_programme === 'libre') {
      totalJours = programmeData?.nb_jours || 0;
    } else if (programmeData?.type_programme === 'calendaire') {
      if (programmeData?.date_debut && programmeData?.date_fin) {
        const dateDebut = new Date(programmeData.date_debut);
        const dateFin = new Date(programmeData.date_fin);
        totalJours = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
      } else {
        totalJours = programmeData?.nb_jours || 0;
      }
    } else {
      // Fallback : compter les jours uniques des séances
      const toutesSeances = seancesOrganisees.flatMap(groupe => groupe.seances);
      const joursUniques = [...new Set(toutesSeances.map(s => s.jour_programme))];
      totalJours = Math.max(...joursUniques, 0);
    }

    // Limiter à 7 jours ou au total du programme si plus court
    const joursAAfficher = Math.min(7, totalJours);
    
    // Créer un tableau des jours à afficher
    const joursAffiches = [];
    for (let jour = 1; jour <= joursAAfficher; jour++) {
      const groupeExistant = seancesOrganisees.find(g => g.jour === jour);
      
      if (groupeExistant) {
        // Le jour a des séances
        joursAffiches.push(groupeExistant);
      } else {
        // Le jour n'a pas de séances, créer un groupe vide
        joursAffiches.push({
          jour: jour,
          seances: [],
          date_reelle: null
        });
      }
    }

    return joursAffiches;
  };

  // Fonction pour obtenir l'index de la prochaine séance
  const getProchaineSeanceIndex = () => {
    const toutesSeances = seancesSemaine.flatMap(groupe => groupe.seances);
    const premiereSeanceNonCompletee = toutesSeances.find(s => !s.completed);
    return premiereSeanceNonCompletee ? premiereSeanceNonCompletee.index_global : -1;
  };

  // Fonction pour calculer la progression en jours
  const getProgressionJours = () => {
    // Calculer le total des jours selon le type de programme
    let totalJours;
    
    if (programmeInfo?.type_programme === 'libre') {
      // Pour les programmes libres, utiliser nb_jours du programme
      totalJours = programmeInfo?.nb_jours || 0;
    } else if (programmeInfo?.type_programme === 'calendaire') {
      // Pour les programmes calendaires, calculer la différence entre date_fin et date_debut
      if (programmeInfo?.date_debut && programmeInfo?.date_fin) {
        const dateDebut = new Date(programmeInfo.date_debut);
        const dateFin = new Date(programmeInfo.date_fin);
        const differenceEnJours = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
        totalJours = differenceEnJours;
      } else {
        totalJours = programmeInfo?.nb_jours || 0;
      }
    } else {
      // Fallback : compter les jours uniques des séances visibles
      const toutesSeances = seancesSemaine.flatMap(groupe => groupe.seances);
      const joursUniques = [...new Set(toutesSeances.map(s => s.jour_programme))];
      totalJours = Math.max(...joursUniques, 0);
    }

    // Pour calculer les jours complétés, on doit utiliser toutes les séances du programme
    // Pas seulement celles visibles (7 jours). On va utiliser les données du calendrier complet
    let joursCompletees = 0;
    
    // Si on a les données du calendrier complet, on peut les utiliser
    if (calendrierDataComplet) {
      const toutesSeances = calendrierDataComplet.seances;
      const joursUniques = [...new Set(toutesSeances.map(s => s.jour))];
      joursCompletees = joursUniques.filter(jour => {
        const seancesDuJour = toutesSeances.filter(s => s.jour === jour);
        return seancesDuJour.every(s => s.est_completee);
      }).length;
    } else {
      // Fallback : compter les jours complétés parmi les séances visibles
      joursCompletees = seancesSemaine.filter(groupe => 
        groupe.seances.length > 0 && groupe.seances.every(seance => seance.completed)
      ).length;
    }
    
    return { joursCompletees, totalJours };
  };

  // Fonction pour vérifier s'il y a des séances à venir
  const aDesSeancesAVenir = () => {
    if (!calendrierDataComplet) return false;
    
    // Vérifier s'il y a au moins une séance non complétée
    const seancesNonCompletees = calendrierDataComplet.seances.filter(seance => 
      !seance.est_completee
    );
    
    return seancesNonCompletees.length > 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusSeance = (seance) => {
    if (seance.completed) return 'completed';
    if (!seance.completed && seance.index_global === getProchaineSeanceIndex()) return 'next';
    return 'future';
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

  const toggleSeance = (seanceId) => {
    setOpenSeances(prev => ({
      ...prev,
      [seanceId]: !prev[seanceId]
    }));
  };

  const handleLancerSeance = (seance) => {
    if (seance && seance.id) {
      window.location.href = `/seances/${seance.id}/execution`;
    }
  };

  const getJourLabel = (jour, dateReelle) => {
    if (programmeInfo?.type_programme === 'libre') {
      return `Jour ${jour}`;
    } else {
      return formatDate(dateReelle);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-400" />
            Programme {programmeInfo?.type_programme === 'libre' ? 'par jours' : 'de la semaine'}
          </h3>
          {seancesSemaine.length > 0 && programmeInfo && (
            <div className="text-sm text-gray-400">
              {(() => {
                const { joursCompletees, totalJours } = getProgressionJours();
                return `${joursCompletees}/${totalJours} jours`;
              })()}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-center py-8">
          <div className="text-red-400 text-lg mb-2">
            ⚠️ Erreur de chargement
          </div>
          <div className="text-gray-500 text-sm">
            {error}
          </div>
        </div>
      )}

      {!error && !aDesSeancesAVenir() && calendrierDataComplet && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">
            🎉 Programme terminé !
          </div>
          <div className="text-gray-500 text-sm">
            Toutes les séances de ce programme ont été complétées.
          </div>
        </div>
      )}
      
      {!error && (
        <div className="space-y-3">
          {seancesSemaine.map((jour) => (
          <div key={jour.jour}>
            {jour.seances.length > 0 ? (
              jour.seances.map((seance) => {
                const status = getStatusSeance(seance);
                const isProchaineSeance = !seance.completed && seance.index_global === getProchaineSeanceIndex();
                const isOpen = openSeances[seance.id];
                
                return (
                  <div
                    key={seance.id}
                    className={`rounded-lg border transition-all mb-3 ${
                      isProchaineSeance
                        ? 'bg-orange-500/20 border-orange-400/50'
                        : status === 'completed' 
                        ? 'bg-green-500/20 border-green-400/50' 
                        : status === 'next'
                        ? 'bg-blue-500/20 border-blue-400/50'
                        : 'bg-gray-600/50 border-gray-500/50'
                    }`}
                  >
                    {/* Header de la séance */}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Bouton accordéon à gauche */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSeance(seance.id);
                            }}
                            className={`p-1 ${isProchaineSeance ? 'hover:bg-orange-500/20' : 'hover:bg-gray-500/20'} rounded transition-colors`}
                            title="Voir le contenu"
                          >
                            {isOpen ? (
                              <ChevronDown className="w-4 h-4 text-white" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-white" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className={`text-sm font-medium text-white ${
                                status === 'completed' ? 'line-through opacity-75' : ''
                              }`}>
                                {getJourLabel(jour.jour, jour.date_reelle)} : {seance.nom}
                              </div>
                              {status === 'completed' && (
                                <div className="flex items-center gap-5">
                                  <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                  <span className="text-xs text-green-400">
                                    {seance.session_data.date_fin && (formatDate(seance.session_data.date_fin))}
                                  </span>
                                  </div>
                                  {seance.session_data.duree && (
                                    <>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                                        <span className="text-xs text-green-400">
                                          {`${Math.round(seance.session_data.duree / 60)} min`}
                                        </span>
                                      </div>
                                    </>
                                    )}
                                </div>
                              )}
                              {status !== 'completed' && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-400">{seance.duree}</span>
                                </div>
                              )}
                              {isProchaineSeance && (
                                  <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                                    Prochaine
                                  </span>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              
                              {programmeInfo?.type_programme !== 'libre' && (
                                <span className="text-gray-500">
                                  {formatDate(jour.date_reelle)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Icône de statut (cliquable pour la prochaine séance) */}
                        <div className="flex items-center justify-center">
                          {isProchaineSeance ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLancerSeance(seance);
                              }}
                              className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center hover:bg-orange-500/30 transition-colors cursor-pointer"
                              title="Lancer la séance"
                            >
                              <Play className="w-5 h-5 text-orange-400" />
                            </button>
                          ) : status === 'completed' ? (
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                          ) : status === 'next' ? (
                            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                              <Play className="w-5 h-5 text-blue-400" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
                              <Clock className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contenu de la séance (accordéon) */}
                    {isOpen && (
                      <div className="px-3 pb-3">
                        {seance.seance?.structure ? (
                          <SeanceStructure structure={seance.seance.structure} />
                        ) : (
                          <div className="text-gray-400 text-sm italic py-2">
                            Aucun contenu disponible pour cette séance
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Jour sans séances
              <div className="p-3 rounded-lg border border-gray-600/50 bg-gray-600/30 mb-3">
                <div className="flex items-center justify-center">
                  <div className="text-gray-400 text-sm italic">
                    {getJourLabel(jour.jour, jour.date_reelle)} : À venir
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default SemaineProgramme; 