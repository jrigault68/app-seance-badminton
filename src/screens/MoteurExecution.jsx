// Ce fichier contient la logique pour exécuter une séance structurée sous forme d'étapes (générées via `genererEtapesDepuisStructure`)
// Il gère les états : intro, exercice, repos, transition, fin

import { useEffect, useRef, useState, useMemo } from "react";
import { TransitionScreen } from "@/screens/TransitionScreen";
import { ActiveExerciceScreen } from "@/screens/ActiveExerciceScreen";
import { FinishedScreen } from "@/screens/FinishedScreen";
import { speak, speakMessage, estimerTempsParole, expandMessages } from "@/utils/vocal";
import { pickRandom } from "@/utils/helpers";
import { backgroundMainColor, blockStyle } from "@/styles/styles";

// Composant pour l'intro de bloc
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

function IntroBlocScreen({ nom, description, exercices, nbTours = 1, tempsReposBloc = 0, onStart }) {
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
                <span className="font-bold text-orange-100">{exo.nom || `Exercice ${idx + 1}`}</span>
                <span className="text-xs text-orange-300 ml-2">{getExoResume(exo)}</span>
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
      </div>
    </div>
  );
}

export default function MoteurExecution({ etapes, onFinish, resetToAccueil, intervalRef  }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [mode, setMode] = useState("transition"); // "transition", "exercice", "fini"
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [finMessagesSpoken, setFinMessagesSpoken] = useState(false);

  const timerRef = useRef(null);
  const spokenStepIndex = useRef(null);
  const spokenCountdownRef = useRef(null);
  const messagesQueueRef = useRef([]); // File de messages à lire/restants
  const skippedMessagesRef = useRef([]);
  
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

// === 1. Initialisation de l'étape courante ===
  useEffect(() => {
	clearInterval(intervalRef.current);
	setPaused(false);
	speechSynthesis.cancel();
	setTimeLeft(0);
	setFinMessagesSpoken(false);

	if (stepIndex >= etapes.length) { setFinished(true); return; }
    if (!current || finished) return;
	
    //console.log("🔁 Nouvelle étape", stepIndex, current.type);
	  //console.log("🔍 current =", JSON.stringify(current, null, 2));
    const shouldSpeak = current.messages?.length && spokenStepIndex.current !== stepIndex;

    // Identifie si on est dans une transition (repos, intro...) ou un exercice
    const isTransition = ["repos", "intro", "annonce_bloc"].includes(current.type);
    setMode(isTransition ? "transition" : "exercice");
    if(isTransition || !current.exo?.repetitions){setTimeLeft(current.duree);}
    console.log("should speak : " + shouldSpeak + current.messages?.length + spokenStepIndex.current);
    if (shouldSpeak) {
      // todo : voir si on peut trouvre une solution pour lire les message non lu après une pause ou si on passe direct à l'exo
      speak(current.messages, current, (current.duree -5) * 1000,500, skippedMessagesRef)
        .then(skipped => {
          skippedMessagesRef.current = skipped;
        });
      spokenStepIndex.current = stepIndex;
    }
    }, [stepIndex]);

  // === 2 & 3 & 4. Décompte vocal + chronomètre principal + gestion fin d'étape ===
  useEffect(() => {
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
    if (!current || paused || finished || timeLeft <= 0) return;

    // Décompte vocal si <= 5 secondes
    if ((current.duree > 30 ? timeLeft <= 5 : timeLeft <=3) && timeLeft >= 1) {
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
      console.log("Lecture message de fin");
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
        if (stepIndex + 1 >= etapes.length) {
          setFinished(true);
          setMode("fini");
          speak("seance.fin");
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
      if (stepIndex + 1 >= etapes.length) {
        setFinished(true);
        setMode("fini");
        speak("seance.fin");
      } else {
        setStepIndex(prev => prev + 1);
      }
    }
    // eslint-disable-next-line
  }, [mode, current, stepIndex]);

  // === 5. Rendu selon l'état ===

  if (finished || mode === "fini") {
    return <FinishedScreen resetToAccueil={resetToAccueil} />;
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
      />
    );
  }

  if (mode === "transition" && current) {
    console.log("current :", current);
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
        blocTour={current.exo?.blocTour || 1}
        totalBlocTour={current.exo?.totalBlocTour || 1}
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
