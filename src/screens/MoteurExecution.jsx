// Ce fichier contient la logique pour exécuter une séance structurée sous forme d'étapes (générées via `genererEtapesDepuisStructure`)
// Il gère les états : intro, exercice, repos, transition, fin

import { useEffect, useRef, useState, useMemo } from "react";
import { TransitionScreen } from "@/screens/TransitionScreen";
import { ActiveExerciceScreen } from "@/screens/ActiveExerciceScreen";
import { FinishedScreen } from "@/screens/FinishedScreen";
import { speak, speakMessage, estimerTempsParole, expandMessages } from "@/utils/vocal";
import { pickRandom } from "@/utils/helpers";
import { backgroundMainColor, blockStyle } from "@/styles/styles";
import { HelpCircle } from 'lucide-react';
import ExerciceHelpDialog from '../components/ui/ExerciceHelpDialog';
import { useWakeLock } from "@/utils/useWakeLock";

// Fonction pour obtenir le résumé d'un exercice
function getExoResume(exo) {
  const s = exo.series || 1;
  const r = exo.repetitions || 0;
  const t = exo.temps_series || 0;
  const repOrDuree = r > 0 ? `${r} répétition${r > 1 ? 's' : ''}` : t > 0 ? `${t}s` : null;
  let main = (s > 1 ? `${s} séries de ` : '') + `${repOrDuree ? repOrDuree : ''}`;
  const reposSerie = exo.temps_repos_series ? `, ${exo.temps_repos_series}s repos entre séries` : '';
  //const reposExo = exo.temps_repos_exercice ? `, ${exo.temps_repos_exercice}s repos` : '';
  return '(' + main + reposSerie + ')';
}

// Composant pour l'intro de la séance
function IntroSeanceScreen({ nom, notes, onStart, isResuming, sessionEnCours }) {
  return (
    <div className={`h-[calc(100vh-56px)] w-full flex items-center justify-center flex-col gap-4 ${backgroundMainColor} text-white px-4`}>
      <div className={"max-w-xl w-full " + blockStyle + " text-center"}>
        <h1 className="text-3xl font-bold text-rose-400 mb-4">{nom || "Séance"}</h1>
        {notes && (
          <p className="text-orange-200 mb-6 text-lg">{notes}</p>
        )}
        
        {isResuming && sessionEnCours && (
          <div className="mb-6 p-4 bg-blue-600/20 border border-blue-500 rounded-lg">
            <div className="flex items-center gap-2 text-blue-300 mb-2">
              <span className="text-lg">🔄</span>
              <span className="font-semibold">Séance en cours</span>
            </div>
            <p className="text-blue-200 text-sm">
              Vous avez une séance en cours. Voulez-vous la reprendre ou recommencer ?
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onStart(true)} // true pour reprendre
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
              >
                Reprendre
              </button>
              <button
                onClick={() => onStart(false)} // false pour recommencer
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium"
              >
                Recommencer
              </button>
            </div>
          </div>
        )}
        
        {!isResuming && (
          <button
            onClick={() => onStart(false)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full shadow text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            Démarrer la séance
          </button>
        )}
      </div>
    </div>
  );
}

// Composant pour l'intro de bloc
function IntroBlocScreen({ nom, description, exercices, nbTours = 1, tempsReposBloc = 0, onStart, numeroSection = 1, totalSections = 1 }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedExo, setSelectedExo] = useState(null);
  const hasSpoken = useRef(false);
  
  // Lecture vocale de l'introduction du bloc
  useEffect(() => {
    // Éviter les lectures multiples
    if (hasSpoken.current) return;
    hasSpoken.current = true;
    
    // Déterminer le type de section
    let typeSection = "";
    if (totalSections >= 3) {
      if (numeroSection === 1) {
        typeSection = "Première section : ";
      } else if (numeroSection === totalSections) {
        typeSection = "Dernière section : ";
      } else {
        typeSection = "Prochaine section : ";
      }
    } else {
      typeSection = "Section : ";
    }

    const messages = [
      `${typeSection}${nom}`,
      nbTours > 1 ? `${nbTours} tours` : "",
      description || "",
      "Cliquez sur commencer pour démarrer la section"
    ].filter(msg => msg); // Filtrer les messages vides
    
    if (messages.length > 0) {
      // Petit délai pour éviter les conflits avec d'autres lectures vocales
      setTimeout(() => {
        speak(messages, { nom, nbTours, description, numeroSection, totalSections }, 1000000, 1000);
      }, 500);
    }
  }, [nom, nbTours, description, numeroSection, totalSections]);

  //console.log("exercices :", exercices);
  return (
    <div className={`h-[calc(100vh-56px)] w-full flex items-center justify-center flex-col gap-4 ${backgroundMainColor} text-white px-4`}>
      <div className={"max-w-xl w-full " + blockStyle + " text-center"}>
        <h2 className="text-2xl font-bold text-rose-400 mb-2">{nom || "Section"}</h2>
        {description && <p className="text-gray-300 italic mb-4">{description}</p>}
        <div className="text-left mb-4 space-y-2">
          {nbTours > 1 && (
            <div className="text-orange-200 text-sm font-semibold mb-1">Nombre de tours : <span className="text-orange-100 font-bold">{nbTours}</span></div>
          )}
          {nbTours > 1 && tempsReposBloc > 0 && (
            <div className="text-orange-200 text-sm mb-2">Repos entre les tours : <span className="text-orange-100 font-bold">{tempsReposBloc}s</span></div>
          )}
          <div className="font-semibold text-white mb-2">Exercices de cette section :</div>
          <ol className="list-decimal ml-6 space-y-2">
            {exercices && exercices.map((exo, idx) => (
              <li key={exo._uid || exo.id || idx} className="text-orange-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-100">{exo.nom || `Exercice ${idx + 1}`}</span>
                  <span className="text-xs text-orange-300 ml-2">{getExoResume(exo)}</span>
                  <button
                    className="ml-2 text-orange-300 hover:text-orange-400"
                    title="Aide exercice"
                    onClick={() => { setSelectedExo(exo); setHelpOpen(true); }}
                  >
                    <HelpCircle size={18} />
                  </button>
                </div>
                
              </li>
            ))}
          </ol>
        </div>
        <button
          onClick={onStart}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-full shadow text-white font-semibold text-lg mt-4"
        >
          Commencer la section
        </button>
        <ExerciceHelpDialog 
          open={helpOpen} 
          onClose={() => setHelpOpen(false)} 
          exercice={selectedExo} 
          modifiedData={selectedExo}
        />
      </div>
    </div>
  );
}

export default function MoteurExecution({ 
  etapes, 
  onFinish, 
  resetToAccueil, 
  intervalRef, 
  currentSession, 
  programmeId, 
  onMarquerComplete,
  sessionId,
  sessionEnCours,
  isResuming,
  onDemarrerSession,
  onMettreAJourProgression
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [mode, setMode] = useState("intro_seance"); // "intro_seance", "transition", "exercice", "fini"
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [finMessagesSpoken, setFinMessagesSpoken] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [sessionStarted, setSessionStarted] = useState(false);

  const timerRef = useRef(null);
  const spokenStepIndex = useRef(null);
  const spokenCountdownRef = useRef(null);
  const messagesQueueRef = useRef([]); // File de messages à lire/restants
  const skippedMessagesRef = useRef([]);
  const progressionTimerRef = useRef(null);
  
  // Fonction pour arrêter forcément la synthèse vocale
  const stopSpeechSynthesis = () => {
    console.log('🔇 Arrêt forcé de la synthèse vocale');
    
    // 1. Arrêter la synthèse vocale
    if (speechSynthesis.speaking || speechSynthesis.paused) {
      speechSynthesis.cancel();
    }
    
    // 2. Réinitialiser les refs pour éviter les lectures suivantes
    // NE PAS réinitialiser spokenStepIndex.current pour permettre la lecture vocale
    spokenCountdownRef.current = null;
    //messagesQueueRef.current = [];
    //skippedMessagesRef.current = [];
    
    // 3. Arrêter les timers en cours
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // 4. Forcer l'arrêt de tous les utterances en cours
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      // Attendre un peu puis recanceler pour être sûr
      setTimeout(() => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      }, 100);
    }
  };

  // Fonction wrapper pour setStepIndex qui arrête la synthèse vocale
  const setStepIndexWithStopSpeech = (newIndex) => {
    stopSpeechSynthesis();
    setStepIndex(newIndex);
  };
  
  // Activer le Wake Lock pendant l'exécution de la séance
  const isExecutionActive = mode !== "intro_seance" && !finished;
  const { requestWakeLock, releaseWakeLock } = useWakeLock(isExecutionActive);

  // Initialiser la reprise de session si nécessaire
  useEffect(() => {
    if (isResuming && sessionEnCours && sessionEnCours.progression) {
      const progression = sessionEnCours.progression;
      
      // Vérifier que le nombre d'étapes est cohérent
      if (progression.nombre_total_etapes && progression.nombre_total_etapes !== etapes.length) {
        console.log('⚠️ Nombre d\'étapes différent:', {
          sauvegarde: progression.nombre_total_etapes,
          actuel: etapes.length
        });
        // Reprendre depuis le début si la structure a changé
        setStepIndexWithStopSpeech(0);
        setSessionStarted(true);
        return;
      }
      
      if (progression.etape_actuelle && progression.etape_actuelle > 0) {
        console.log('🔄 Reprise de session à l\'étape:', progression.etape_actuelle);
        setStepIndexWithStopSpeech(progression.etape_actuelle);
        
        // Pour la reprise, utiliser le temps cumulé de la progression
        // plutôt que de recalculer depuis le début de la session
        if (progression.temps_ecoule) {
          console.log('📊 Utilisation du temps cumulé pour la reprise:', progression.temps_ecoule);
          // Calculer le startTime en fonction du temps cumulé
          const maintenant = Date.now();
          const tempsCumuleMs = progression.temps_ecoule * 1000;
          setStartTime(maintenant - tempsCumuleMs);
        } else if (sessionEnCours.date_debut) {
          // Fallback : calculer le temps écoulé depuis le début
          const debut = new Date(sessionEnCours.date_debut);
          const maintenant = new Date();
          const tempsEcoule = Math.floor((maintenant - debut) / 1000);
          setStartTime(maintenant.getTime() - (tempsEcoule * 1000));
        }
        
        // Marquer la session comme démarrée
        setSessionStarted(true);
      }
    }
  }, [isResuming, sessionEnCours, etapes.length]);

  // Démarrer la session dès qu'on a un sessionId
  useEffect(() => {
    if (sessionId && !sessionStarted) {
      console.log('🚀 Session démarrée avec ID:', sessionId);
      setSessionStarted(true);
    }
  }, [sessionId, sessionStarted]);
  
  // Vérifier que etapes n'est pas vide
  if (!etapes || etapes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mb-6"></div>
          <h2 className="text-xl font-bold text-orange-300 mb-2">Chargement de la séance...</h2>
          <p className="text-gray-400 text-sm">Préparation des étapes...</p>
        </div>
      </div>
    );
  }

  const totalExercices = etapes.filter(e => e.type === "exercice").length;
  const exerciceNumero = etapes.slice(0, stepIndex + 1).filter(e => e.type === "exercice").length;

  const current = etapes[stepIndex];

  // Compter le nombre de sections (intro_bloc) pour déterminer le numéro de section
  // On compte les étapes intro_bloc qui ont été générées
  const sections = etapes.filter(e => e.type === "intro_bloc");
  // Pour trouver le numéro de section actuelle, on compte combien d'étapes intro_bloc 
  // sont passées avant l'étape actuelle (stepIndex)
  const currentSectionIndex = etapes
    .slice(0, stepIndex + 1)
    .filter(e => e.type === "intro_bloc")
    .length - 1; // -1 car on veut l'index (0-based)
  const numeroSection = currentSectionIndex + 1;

  const totalSections = sections.length;

  const expandedMessagesFin = useMemo(() => {
    if (current && current.messages_fin && current.messages_fin.length > 0) {
      return expandMessages(current.messages_fin, current);
    }
    return [];
  }, [current]);

  const dureeFinMs = useMemo(() => {
    return expandedMessagesFin.reduce((acc, msg) => acc + estimerTempsParole(msg), 0);
  }, [expandedMessagesFin]);

  const dureeFinSec = Math.ceil(dureeFinMs / 1000);

  // Mettre à jour la progression périodiquement
  useEffect(() => {
    console.log('🔄 Vérification mise à jour progression:', { sessionStarted, onMettreAJourProgression, stepIndex });
    
    if (sessionStarted && onMettreAJourProgression) {
      const tempsEcoule = Math.floor((Date.now() - startTime) / 1000);
      
      console.log('📊 Mise à jour progression pour étape:', stepIndex, 'temps écoulé:', tempsEcoule);
      
      // Mettre à jour la progression à chaque changement d'étape (sans temps d'étape)
      onMettreAJourProgression(stepIndex, tempsEcoule, 0);
      
      // Mettre à jour aussi périodiquement (toutes les 30 secondes) pour les longues étapes
      if (progressionTimerRef.current) {
        clearTimeout(progressionTimerRef.current);
      }
      
      
    }

    return () => {
      if (progressionTimerRef.current) {
        clearTimeout(progressionTimerRef.current);
      }
    };
  }, [stepIndex, sessionStarted, onMettreAJourProgression, startTime]);

  // Mettre à jour la progression quand sessionStarted devient true
  useEffect(() => {
    if (sessionStarted && sessionId && onMettreAJourProgression) {
      console.log('🚀 Session démarrée, mise à jour initiale de la progression');
      const tempsEcoule = Math.floor((Date.now() - startTime) / 1000);
      console.log('📊 Mise à jour initiale - temps écoulé:', tempsEcoule, 'étape:', stepIndex);
      onMettreAJourProgression(stepIndex, tempsEcoule, 0);
    }
  }, [sessionStarted, sessionId, onMettreAJourProgression, stepIndex, startTime]);

  // === 1. Initialisation de l'étape courante ===
  useEffect(() => {
	  clearInterval(intervalRef.current);
    setPaused(false);
    speechSynthesis.cancel();
    setTimeLeft(0);
    setFinMessagesSpoken(false);

    // Nettoyer le timer si la séance est finie
    if (stepIndex >= etapes.length) { 
      setFinished(true); 
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return; 
    }
    if (!current || finished) return;
	
    //console.log("🔁 Nouvelle étape", stepIndex, current.type);
	  //console.log("🔍 current =", JSON.stringify(current, null, 2));
    
    // Ne pas déclencher la lecture vocale pour les étapes intro_bloc
    // car elles ont leur propre logique de lecture vocale
    if (current.type === "intro_bloc") {
      setMode("intro_bloc");
      return;
    }
    
    // Ne pas déclencher la lecture vocale si on est encore en mode intro_seance
    if (mode === "intro_seance") {
      return;
    }
    
    const shouldSpeak = current.messages?.length && spokenStepIndex.current !== stepIndex;
  console.log("shouldSpeak :", shouldSpeak, current.messages, spokenStepIndex.current, stepIndex)
    // Identifie si on est dans une transition (repos, intro...) ou un exercice
    const isTransition = ["repos", "intro", "annonce_bloc", "changement_cote"].includes(current.type);
    setMode(isTransition ? "transition" : "exercice");
    if(isTransition || !current.exo?.repetitions){setTimeLeft(current.duree);}
    //console.log("should speak : " + shouldSpeak + " messages: " + current.messages?.length + " spokenStep: " + spokenStepIndex.current);
    if (shouldSpeak) {
      // todo : voir si on peut trouvre une solution pour lire les message non lu après une pause ou si on passe direct à l'exo
      speak(current.messages, current, (current.duree - (current.type === "changement_cote" ? 0:5)) * 1000,500, skippedMessagesRef)
        .then(skipped => {
          skippedMessagesRef.current = skipped;
        });
      spokenStepIndex.current = stepIndex;
    }
  }, [stepIndex]);

  // === 2 & 3 & 4. Décompte vocal + chronomètre principal + gestion fin d'étape ===
  useEffect(() => {
    // Arrêter complètement le timer si la séance est finie
    if (finished) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    //console.log("speechSynthesis.speaking : " + speechSynthesis.speaking + " " + speechSynthesis.paused + " " + paused);
	  if (paused && speechSynthesis.speaking) {
      console.log("⏸️ vocal interrompu");
      speechSynthesis.pause();
	  } else if (!paused && speechSynthesis.paused) {
      console.log("▶️ vocal repris");
      speechSynthesis.resume();
	  } else if (!paused && !speechSynthesis.speaking && messagesQueueRef.current.length > 0) {
      // Si on n'est pas en pause, rien n'est en cours, et il reste des messages, on relance la lecture
      // playNextMessage(); // This line is removed as per the new_code
    }
    if (!current || paused || timeLeft <= 0) return;

    // Décompte vocal si <= 5 secondes
    if (current.duree > 5 && (current.duree > 30 ? timeLeft <= 5 : timeLeft <=3) && timeLeft >= 1) {
      if (spokenCountdownRef.current !== timeLeft) {
        spokenCountdownRef.current = timeLeft;
        speechSynthesis.cancel();
        speakMessage(`${timeLeft}`,1.5);
      }
	  }

    // Focus vocal à mi-exercice
    if (mode === "exercice" && (current.duree > 30 && timeLeft === Math.floor(current.duree / 2) ) ) {
      speak("exercice.mi_temps");
      if( current.exo?.focus_zone && current.exo.focus_zone.length > 0) {
        const focus = pickRandom(current.exo.focus_zone);
        if (focus) {
          speak(focus);
          setCurrentFocus(focus);
        }
      }
    }

    // Déclencher la lecture des messages_fin au bon moment
    if (
      current &&
      current.messages_fin &&
      current.messages_fin.length > 0 &&
      !finMessagesSpoken &&
      timeLeft === (dureeFinSec + (current.duree > 30 ?  5 : 3) + 1) &&
      timeLeft > 0
    ) {
      //console.log("Lecture message de fin");
      setFinMessagesSpoken(true);
      // Si on a le temps d'afficher au moins 1 message, on le fait
      if (expandedMessagesFin.length > 0 && messagesQueueRef.current.length === 0) {
        messagesQueueRef.current = expandedMessagesFin;
        // playNextMessage(); // This line is removed as per the new_code
      }
    }

    // Fin d'étape à 1 seconde restante
    if (timeLeft === 1) {
      setTimeout(() => {
        setCurrentFocus(null);
        
        // Calculer le temps passé sur cette étape et l'envoyer
        if (current && current.duree && onMettreAJourProgression) {
          const tempsEtapeActuelle = current.duree; // L'étape est terminée, donc on a passé toute la durée
          const tempsEcoule = Math.floor((Date.now() - startTime) / 1000);
          console.log(`📊 Fin d'étape ${stepIndex}, temps passé: ${tempsEtapeActuelle}s, temps écoulé total: ${tempsEcoule}s`);
          onMettreAJourProgression(stepIndex, tempsEcoule, tempsEtapeActuelle);
        }
        
        if (stepIndex + 1 >= etapes.length) {
          setFinished(true);
          setMode("fini");
          speak("seance.fin");
          // Nettoyer le timer quand la séance est finie
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        } else {
          setStepIndex(prev => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      spokenCountdownRef.current = null;
    }

    // Chronomètre
    timerRef.current = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, paused, finished]);

  // Enchaînement automatique des transitions à durée 0
  useEffect(() => {
    if (mode === "transition" && current && current.duree === 0) {
      // Pour les transitions à durée 0, calculer le temps passé (qui sera 0)
      if (current && onMettreAJourProgression) {
        const tempsEtapeActuelle = 0; // Durée 0
        const tempsEcoule = Math.floor((Date.now() - startTime) / 1000);
        console.log(`📊 Transition à durée 0, étape ${stepIndex}, temps passé: ${tempsEtapeActuelle}s, temps écoulé total: ${tempsEcoule}s`);
        onMettreAJourProgression(stepIndex, tempsEcoule, tempsEtapeActuelle);
      }
      
      if (stepIndex + 1 >= etapes.length) {
        setFinished(true);
        setMode("fini");
        speak("seance.fin");
        // Nettoyer le timer quand la séance est finie
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setStepIndex(prev => prev + 1);
      }
    }
    // eslint-disable-next-line
  }, [mode, current, stepIndex]);

  // === 5. Rendu selon l'état ===

  // Gestion de l'intro de séance
  if (mode === "intro_seance") {
    return (
      <IntroSeanceScreen
        nom={currentSession?.nom}
        notes={currentSession?.notes}
        isResuming={isResuming}
        sessionEnCours={sessionEnCours}
        onStart={async (resume) => {
          if (resume && sessionEnCours) {
            // Reprendre la session existante
            console.log('🔄 Reprise de session existante');
            setSessionStarted(true);
          } else {
            // Démarrer une nouvelle session
            await onDemarrerSession();
            setSessionStarted(true);
            console.log('🚀 Nouvelle session démarrée');
          }
          
          setMode("transition");
          setStartTime(Date.now());
          // Initialiser la première étape
          if (etapes.length > 0) {
            const firstStep = etapes[0];
            setTimeLeft(firstStep.duree || 0);
            // Déclencher la lecture vocale pour la première étape
            if (firstStep.messages && firstStep.messages.length > 0) {
              speak(firstStep.messages, firstStep, (firstStep.duree - 5) * 1000, 500, skippedMessagesRef);
            }
          }
        }}
      />
    );
  }

  if (finished || mode === "fini") {
    return (
      <FinishedScreen 
        resetToAccueil={() => {
          stopSpeechSynthesis();
          resetToAccueil();
        }}
        startTime={startTime}
        seanceId={currentSession?.id}
        programmeId={programmeId}
        onMarquerComplete={onMarquerComplete}
        sessionId={sessionId}
      />
    );
  }

  // Ajout gestion intro_bloc
  if (current && current.type === "intro_bloc") {
    return (
      <IntroBlocScreen
        nom={current.nom}
        description={current.description}
        exercices={current.exercices}
        nbTours={current.nbTours}
        tempsReposBloc={current.tempsReposBloc}
        onStart={() => setStepIndex(prev => prev + 1)}
        numeroSection={numeroSection}
        totalSections={totalSections}
      />
    );
  }

  if (mode === "transition" && current) {
    //console.log("current :", current);
    return (
      <TransitionScreen
        current={current}
        timeLeft={timeLeft}
        transitionTime={current.duree}
        paused={paused}
        setPaused={setPaused}
        exerciceNumero={exerciceNumero}
        totalExercices={totalExercices}
        setStepIndex={setStepIndex}
        // Ajout des infos de séries et de tours de bloc
        serie={current.serie || 1}
        total_series={current.total_series || current.exo?.series || 1}
        series={current.total_series || current.exo?.series || 1}
        blocTour={current?.blocTour || current.exo?.blocTour || 1}
        totalBlocTour={current?.totalBlocTour || current.exo?.totalBlocTour || 1}
      />
    );
  }

  if (mode === "exercice" && current) {
    
    return (
      <ActiveExerciceScreen
        exo={{
          ...current.exo,
          duree: current.duree,
          serie: current.serie || 1,
          total_series: current.total_series || current.exo?.series || 1,
          blocTour: current.exo?.blocTour || 1,
          totalBlocTour: current.exo?.totalBlocTour || 1,
        }}
        timeLeft={timeLeft}
        paused={paused}
        setPaused={setPaused}
        setStepIndex={setStepIndex}
        setFinished={setFinished}
        exerciceNumero={exerciceNumero}
        totalExercices={totalExercices}
      />
    );
  }

  return null;
}

