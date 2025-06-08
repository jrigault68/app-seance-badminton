// Ce fichier contient la logique pour exécuter une séance structurée sous forme d'étapes (générées via `genererEtapesDepuisStructure`)
// Il gère les états : intro, exercice, repos, transition, fin

import { useEffect, useRef, useState } from "react";
import { TransitionScreen } from "@/screens/TransitionScreen";
import { ActiveExerciceScreen } from "@/screens/ActiveExerciceScreen";
import { FinishedScreen } from "@/screens/FinishedScreen";
import { speak, formatDureeVocal, speakMessage } from "@/utils/vocal";
import { pickRandom } from "@/utils/helpers";

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
	if (exerciceNumero >= totalExercices) { setFinished(true); return; }
    if (!current || finished) return;
	

    console.log("🔁 Nouvelle étape", stepIndex, current.type);
	console.log("🔍 current =", JSON.stringify(current, null, 2));
    const shouldSpeak = current.messages?.length && spokenStepIndex.current !== stepIndex;

    // Identifie si on est dans une transition (repos, intro...) ou un exercice
    const isTransition = ["repos", "intro", "annonce_bloc"].includes(current.type);
    setMode(isTransition ? "transition" : "exercice");
    setTimeLeft(current.duree);
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

  // === 5. Rendu selon l'état ===

  if (finished || mode === "fini") {
    return <FinishedScreen resetToAccueil={resetToAccueil} />;
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
