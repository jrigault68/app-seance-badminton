import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, CalendarDays, ChevronDown, ChevronRight, CheckCircle2, XCircle, SkipForward, RotateCcw } from 'lucide-react';
import programmeService from '../../services/programmeService';
import SeanceStructure from './SeanceStructure';
import InstructionValidationDialog from './InstructionValidationDialog';
import SeanceService from '../../services/seanceService';

const SemaineProgramme = ({ programmeId, onSeanceClick }) => {
  const [seancesSemaine, setSeancesSemaine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programmeInfo, setProgrammeInfo] = useState(null);
  const [calendrierDataComplet, setCalendrierDataComplet] = useState(null);
  const [openSeances, setOpenSeances] = useState({});
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [sessionsEnCours, setSessionsEnCours] = useState({});
  const [loadingSessions, setLoadingSessions] = useState(false);

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

  // Charger les sessions en cours pour toutes les séances
  useEffect(() => {
    const chargerSessionsEnCours = async () => {
      if (!seancesSemaine.length) return;
      
      setLoadingSessions(true);
      const sessions = {};
      
      try {
        // Récupérer toutes les sessions en cours pour les séances de cette semaine
        const seancesIds = seancesSemaine.flatMap(jour => 
          jour.seances.map(seance => seance.id)
        );
        
        for (const seanceId of seancesIds) {
          try {
            const session = await SeanceService.getSessionEnCours(seanceId);
            if (session) {
              sessions[seanceId] = session;
            }
          } catch (error) {
            console.log(`Pas de session en cours pour la séance ${seanceId}:`, error);
          }
        }
        
        setSessionsEnCours(sessions);
      } catch (error) {
        console.error('Erreur lors du chargement des sessions en cours:', error);
      } finally {
        setLoadingSessions(false);
      }
    };

    chargerSessionsEnCours();
  }, [seancesSemaine]);

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
    
    let indexProchaineSeance = getProchaineSeanceIndex(seancesOrganisees);
    let firstDay = Math.max(1, indexProchaineSeance - 3);
    // Créer un tableau des jours à afficher
    const joursAffiches = [];
    for (let jour = firstDay; jour <= joursAAfficher + firstDay; jour++) {
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
  const getProchaineSeanceIndex = (seancesOrganisees) => {
    const toutesSeances = seancesOrganisees.flatMap(groupe => groupe.seances);

    // Chercher la première séance non complétée
    const premiereSeanceNonCompletee = toutesSeances.find(s => !s.completed);
    if (premiereSeanceNonCompletee) {
      return premiereSeanceNonCompletee.index_global;
    }

    // Si toutes les séances sont complétées ou aucune séance, prendre le jour après la dernière séance complétée
    if (toutesSeances.length === 0) {
      return -1;
    }

    // Trouver la dernière séance complétée
    const dernierIndexComplete = (() => {
      // On cherche le dernier index_global d'une séance complétée
      const seancesCompletees = toutesSeances.filter(s => s.completed);
      if (seancesCompletees.length === 0) {
        // Si aucune séance n'est complétée, retourner le premier jour
        return toutesSeances[0].index_global;
      }
      // Sinon, retourner l'index_global de la dernière séance complétée + 1 (prochain jour)
      const maxIndex = Math.max(...seancesCompletees.map(s => s.index_global));
      // Si on dépasse le nombre de séances, retourner le dernier jour
      if (maxIndex + 1 >= toutesSeances.length) {
        return toutesSeances[toutesSeances.length - 1].index_global;
      }
      return maxIndex + 1;
    })();

    return dernierIndexComplete;
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
    // Vérifier d'abord s'il y a une session en cours
    const sessionEnCours = sessionsEnCours[seance.id];
    if (sessionEnCours) {
      return 'in_progress';
    }
    
    // Si la séance a une session (complétée), utiliser etat
    if (seance.session_data) {
      switch (seance.session_data.etat) {
        case 'terminee':
          return 'completed';
        case 'skipped':
          return 'skipped';
        case 'en_cours':
          return 'in_progress';
        case 'interrompue':
          return 'interrupted';
        default:
          return 'completed'; // Fallback pour les anciennes sessions
      }
    }
    
    // Si pas de session, vérifier si c'est la prochaine séance
    if (seance.index_global === getProchaineSeanceIndex(seancesSemaine)) return 'next';
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
      const jour = seance.jour_programme ? `?jour=${encodeURIComponent(seance.jour_programme)}` : '';
      window.location.href = `/seances/${seance.id}/execution${jour}`;
    }
  };

  const handleInstructionValidation = (seance) => {
    setSelectedSeance(seance);
    setShowValidationDialog(true);
  };

  const handleValidateInstruction = async (commentaire = '') => {
    if (!selectedSeance) return;
    
    setIsValidating(true);
    try {
      const notes = commentaire || '';
      
      // Si on est dans le contexte d'un programme, marquer via l'API programme pour conserver programme_id/jour
      if (programmeId) {
        await programmeService.marquerSeanceComplete(programmeId, selectedSeance.id, {
          jour_programme: selectedSeance.jour_programme,
          duree_totale: 0,
          notes: notes
        });
      } else {
        await SeanceService.enregistrerSeance(selectedSeance.id, {
          etat: 'terminee',
          date_debut: new Date().toISOString(),
          date_fin: new Date().toISOString(),
          duree: 0,
          notes: notes
        });
      }
      
      // Recharger les données
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      alert('Erreur lors de la validation de l\'instruction');
    } finally {
      setIsValidating(false);
      setShowValidationDialog(false);
      setSelectedSeance(null);
    }
  };

  const handleDeclineInstruction = async (commentaire = '') => {
    if (!selectedSeance) return;
    setIsValidating(true);
    try {
      const notes = commentaire || '';
        
      await SeanceService.enregistrerSeance(selectedSeance.id, {
        etat: 'skipped',
        date_debut: new Date().toISOString(),
        date_fin: new Date().toISOString(),
        duree: 0,
        notes: notes
      });
      
      // Recharger les données
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      alert('Erreur lors du refus de l\'instruction');
    } finally {
      setIsValidating(false);
      setShowValidationDialog(false);
      setSelectedSeance(null);
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
                const isProchaineSeance = !seance.completed && seance.index_global === getProchaineSeanceIndex(seancesSemaine);
                const isOpen = openSeances[seance.id];
                const isInstruction = seance.seance?.type_seance === "instruction";
                
                return (
                  <div
                    key={seance.id}
                    className={`rounded-lg border transition-all mb-3 ${
                      isProchaineSeance
                        ? 'bg-orange-500/20 border-orange-400/50'
                        : status === 'completed' || status === 'skipped'
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
                          {/* Bouton accordéon à gauche - seulement pour les exercices */}
                          {!isInstruction && (
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
                          )}
                          
                          <div className="flex-1 min-w-0">
                                                          <div className="flex items-center gap-3 flex-wrap">
                                <div className={`text-sm font-medium text-white ${
                                  (status === 'completed' || status === 'skipped') ? 'line-through opacity-75' : ''
                                }`}>
                                  {getJourLabel(jour.jour, jour.date_reelle)} : {seance.nom}
                                </div>
                                {(status === 'completed' || status === 'skipped') && (
                                  <div className="flex items-center gap-5">
                                    <div className="flex items-center gap-1">
                                      {status === 'skipped' ? (
                                      <SkipForward className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    )}
                                    <span className={`text-xs ${
                                      status === 'skipped' 
                                        ? 'text-yellow-400' 
                                        : 'text-green-400'
                                    }`}>
                                      {seance.session_data.date_fin && (formatDate(seance.session_data.date_fin))}
                                    </span>
                                  </div>
                                  {!isInstruction && seance.session_data.duree && seance.session_data.duree > 0  && (
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
                              {status !== 'completed' && !isInstruction && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-400">{seance.duree}</span>
                                </div>
                              )}
                              {status === 'in_progress' && sessionsEnCours[seance.id] && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-orange-400" />
                                  <span className="text-xs text-orange-400">
                                    Dernière activité: {formatDate(sessionsEnCours[seance.id].date_fin)}
                                  </span>
                                </div>
                              )}
                              {isProchaineSeance && (
                                  <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                                    Prochaine
                                  </span>
                                )}
                            </div>
                            
                            {/* Description pour les instructions */}
                            {isInstruction && seance.seance?.description && (
                              <div className="mt-2 text-xs text-gray-400">
                                {seance.seance.description}
                              </div>
                            )}
                            
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
                            isInstruction ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInstructionValidation(seance);
                                }}
                                className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center hover:bg-orange-500/30 transition-colors cursor-pointer"
                                title="Valider l'instruction"
                              >
                                <CheckCircle2 className="w-5 h-5 text-orange-400" />
                              </button>
                            ) : (
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
                            )
                          ) : status === 'in_progress' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLancerSeance(seance);
                              }}
                              className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center hover:bg-orange-500/30 transition-colors cursor-pointer"
                              title="Reprendre la séance"
                            >
                              <RotateCcw className="w-5 h-5 text-orange-400" />
                            </button>
                          ) : status === 'completed' || status === 'skipped' ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              status === 'skipped' 
                                ? 'bg-yellow-500/20' 
                                : 'bg-green-500/20'
                            }`}>
                              {status === 'skipped' ? (
                                <SkipForward className="w-5 h-5 text-yellow-400" />
                              ) : (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              )}
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

                    {/* Contenu de la séance (accordéon) - seulement pour les exercices */}
                    {isOpen && !isInstruction && (
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

      {/* Dialog de validation des instructions */}
      <InstructionValidationDialog
        isOpen={showValidationDialog}
        onClose={() => {
          setShowValidationDialog(false);
          setSelectedSeance(null);
        }}
        seance={selectedSeance}
        onValidate={handleValidateInstruction}
        onDecline={handleDeclineInstruction}
        isLoading={isValidating}
      />
    </div>
  );
};

export default SemaineProgramme; 