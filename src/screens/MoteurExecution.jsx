// Ce fichier contient la logique pour exécuter une séance structurée sous forme d'étapes (générées via `genererEtapesDepuisStructure`)
// Il gère les états : intro, exercice, repos, transition, fin

import { useEffect, useRef, useState } from "react";
import { TransitionScreen } from "@/screens/TransitionScreen";
import { ActiveExerciceScreen } from "@/screens/ActiveExerciceScreen";
import { FinishedScreen } from "@/screens/FinishedScreen";
import { speak, formatDureeVocal, speakMessage } from "@/utils/vocal";
import { pickRandom } from "@/utils/helpers";

// Composant pour l'intro de bloc
function getExoResume(exo) {
  const s = exo.series || 1;
  const r = exo.repetitions || 0;
  const t = exo.temps_series || 0;
  const repOrDuree = r > 0 ? `${r} répétition${r > 1 ? 's' : ''}` : t > 0 ? `${t}s` : null;
  let main = s > 1 ? `${s} séries` : '1 série';
  if (repOrDuree) main += ` de ${repOrDuree}`;
  const reposSerie = exo.temps_repos_series ? `, repos ${exo.temps_repos_series}s entre séries` : '';
  const reposExo = exo.temps_repos_exercice ? `, repos ${exo.temps_repos_exercice}s après` : '';
  return main + reposSerie + reposExo;
}

function IntroBlocScreen({ nom, description, exercices, bloc, onStart }) {
  const nbTours = bloc?.nbTours || 1;
  const tempsReposBloc = bloc?.temps_repos_bloc || 0;
  return (
    <div className="min-h-screen w-full flex items-center justify-center flex-col gap-4 bg-gradient-to-br from-orange-950 via-black to-orange-900 text-white px-4">
      <div className="max-w-xl w-full bg-white/10 rounded-2xl p-6 shadow-2xl space-y-6 text-center">
        <h2 className="text-2xl font-bold text-orange-300 mb-2">{nom || "Section"}</h2>
        {description && <p className="text-orange-100 mb-4">{description}</p>}
        <div className="text-left mb-4 space-y-2">
          {nbTours > 1 && (
            <div className="text-orange-200 text-sm font-semibold mb-1">Nombre de tours : <span className="text-orange-100 font-bold">{nbTours}</span></div>
          )}
          {nbTours > 1 && tempsReposBloc > 0 && (
            <div className="text-orange-200 text-sm mb-2">Repos entre les tours : <span className="text-orange-100 font-bold">{tempsReposBloc}s</span></div>
          )}
          <div className="font-semibold text-orange-200 mb-2">Exercices de cette section :</div>
          <ol className="list-decimal ml-6 space-y-2">
            {exercices && exercices.map((exo, idx) => (
              <li key={exo._uid || exo.id || idx} className="text-orange-100">
                <span className="font-bold text-orange-100">{exo.nom || `Exercice ${idx + 1}`}</span>
                <span className="block text-xs text-orange-300 mt-0.5">{getExoResume(exo)}</span>
              </li>
            ))}
          </ol>
        </div>
        <button
          onClick={onStart}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-full shadow text-white font-semibold text-lg mt-4"
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

  const timerRef = useRef(null);
  const spokenStepIndex = useRef(null);
  const spokenCountdownRef = useRef(null);
  const skippedMessagesRef = useRef([]);
  const totalExercices = etapes.filter(e => e.type === "exercice").length;
  const exerciceNumero = etapes.slice(0, stepIndex + 1).filter(e => e.type === "exercice").length;

  const current = etapes[stepIndex];

// === 1. Initialisation de l'étape courante ===
  useEffect(() => {
	clearInterval(intervalRef.current);
	setPaused(false);
	speechSynthesis.cancel();
	setTimeLeft(0);
	if (exerciceNumero >= totalExercices) { setFinished(true); return; }
    if (!current || finished) return;
	

    console.log("🔁 Nouvelle étape", stepIndex, current.type);
	console.log("🔍 current =", JSON.stringify(current, null, 2));
    const shouldSpeak = current.messages?.length && spokenStepIndex.current !== stepIndex;

    // Identifie si on est dans une transition (repos, intro...) ou un exercice
    const isTransition = ["repos", "intro", "annonce_bloc"].includes(current.type);
    setMode(isTransition ? "transition" : "exercice");
    if(isTransition || !current.exo?.repetitions){setTimeLeft(current.duree);}
console.log("should speak : " + shouldSpeak + current.messages?.length + spokenStepIndex.current);
	if (shouldSpeak) {
	  speak(current.messages, current, (current.duree -5) * 1000,500, skippedMessagesRef)
      .then(skipped => {
        skippedMessagesRef.current = skipped;
      });
	  spokenStepIndex.current = stepIndex;
	}
  }, [stepIndex]);


// === 2 & 3 & 4. Décompte vocal + chronomètre principal + gestion fin d'étape ===
  useEffect(() => {
	  if (paused && speechSynthesis.speaking) {
		console.log("⏸️ vocal interrompu");
		speechSynthesis.pause();
	  } else if (!paused && speechSynthesis.paused) {
		console.log("▶️ vocal repris");
		speechSynthesis.resume();
	  }
    if (!current || paused || finished || timeLeft <= 0) return;

    // Décompte vocal si <= 5 secondes
    if (timeLeft <= 5 && timeLeft >= 1) {
		if (spokenCountdownRef.current !== timeLeft) {
		  spokenCountdownRef.current = timeLeft;
		  speechSynthesis.cancel();
		  speakMessage(`${timeLeft}`, 1.5);
		}
	  }

    // Focus vocal à mi-exercice
    if (mode === "exercice" && timeLeft === Math.floor(current.duree / 2) && current.exo?.focus_zone) {
      const focus = pickRandom(current.exo.focus_zone);
      if (focus) {
		speakMessage("Mi-temps");
        speak(focus);
        setCurrentFocus(focus);
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
      setStepIndex(prev => prev + 1);
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
        bloc={current.bloc}
        onStart={() => setStepIndex(prev => prev + 1)}
      />
    );
  }

  if (mode === "transition" && current) {
    return (
      <TransitionScreen
        current={current}
        timeLeft={timeLeft}
        transitionTime={current.duree}
        paused={paused}
        setPaused={setPaused}
        exerciceNumero={exerciceNumero}
        totalExercices={totalExercices}
		setStepIndex = {setStepIndex}
      />
    );
  }

  if (mode === "exercice" && current) {
    return (
      <ActiveExerciceScreen
        exo={current.exo || {}}
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
