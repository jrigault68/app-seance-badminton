import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { TransitionScreen } from "./screens/TransitionScreen";
import { ActiveExerciceScreen } from "./screens/ActiveExerciceScreen";
import { FinishedScreen } from "./screens/FinishedScreen";

export default function AppStyled() {
  const [selectedPath, setSelectedPath] = useState(null);
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [transition, setTransition] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [transitionLeft, setTransitionLeft] = useState(30);
  const [paused, setPaused] = useState(false);
  const [availableSeances, setAvailableSeances] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [erreurCourante, setErreurCourante] = useState(null);

  const transitionTime = 30;
  const synthRef = useRef(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const wakeLockRef = useRef(null);


  const StyledButton = ({ children, className = "", ...props }) => (
    <button
      {...props}
      className={`bg-red-800 hover:bg-red-700 active:bg-red-900 text-white px-4 py-2 rounded-2xl shadow-md transition-all duration-300 w-full text-lg font-semibold ${className}`}
    >
      {children}
    </button>
  );
  
	useEffect(() => {
	  const context = import.meta.glob("/src/seances/**/*.js");
	  const entries = Object.entries(context);
	  const grouped = {};

	  entries.forEach(async ([path, loader]) => {
		try {
		  const mod = await loader();
		  const cleanPath = path.replace(/^.*\/seances\//, "").replace(".js", "");
		  const segments = cleanPath.split("/");
		  const folder = segments.length > 1 ? segments[0] : "non_classé";
		  const name = segments.length > 1 ? segments[1] : segments[0];

		  if (!grouped[folder]) grouped[folder] = [];
		  grouped[folder].push({
			name,
			path,
			loader,
			meta: mod.meta || null
		  });

		  // Important : faire la mise à jour complète après tout le chargement
		  setAvailableSeances({ ...grouped });
		} catch (err) {
		  console.error("Erreur lors du chargement :", path, err);
		}
	  });
	}, []);

  useEffect(() => {
    if ('wakeLock' in navigator) {
      const requestWakeLock = async () => {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch (err) {
          console.warn("Wake lock error:", err);
        }
      };
      requestWakeLock();
      return () => {
        if (wakeLockRef.current) wakeLockRef.current.release();
      };
    }
  }, []);

  const loadSeance = async (path) => {
    setLoading(true);
    try {
      const file = Object.values(availableSeances).flat().find(f => f.path === path);
      const module = await file.loader();
      setExercices(module.default);
      setSelectedPath(path);
      setLoading(false);
    } catch (err) {
      console.error("Erreur de chargement :", err);
      alert("Erreur : fichier non trouvé ou mal formaté");
      setLoading(false);
    }
  };
  
  function pickRandom(arr) {
	  if (!Array.isArray(arr) || arr.length === 0) return null;
	  return arr[Math.floor(Math.random() * arr.length)];
	}

  const resetToAccueil = () => {
    setSelectedPath(null);
    setStarted(false);
    setStep(-1);
    setFinished(false);
    setExercices([]);
    setStartTime(null);
    setPaused(false);
    clearAllTimers();
  };

  const startRoutine = () => {
    setStarted(true);
    setStartTime(Date.now());
    setStep(0);
  };

  const clearAllTimers = () => {
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
    if (synthRef.current) synthRef.current.cancel();
  };

  const speak = (text) => {
    if (!text || paused) return;
    if (synthRef.current) synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current = speechSynthesis;
    synthRef.current.speak(utterance);
  };

  const speakIntro = (exo) => {
    let intro = `Prochain exercice : ${exo.name}.`;
    if (exo.description) intro += ` ${exo.description}`;
    if (exo.position) intro += ` Position de départ : ${exo.position}.`;
    speak(intro);
  };

  useEffect(() => {
    if (step >= 0 && !transition && !isActive && !finished) {
      setTransition(true);
      setTransitionLeft(transitionTime);
      speakIntro(exercices[step]);
    }
  }, [step]);

  useEffect(() => {
    if (!transition || !exercices.length) return;
    intervalRef.current = setInterval(() => {
      setTransitionLeft((prev) => {
        if (paused) return prev;
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimeLeft(exercices[step].duration);
          setIsActive(true);
          setTransition(false); 
          if (exercices[step].erreurs && Array.isArray(exercices[step].erreurs)) {
			  const erreur = pickRandom(exercices[step].erreurs);
			  setErreurCourante(erreur);
			  speak("Début de l'exercice. " + erreur);
			} else {
			  setErreurCourante(null);
			  speak("Début de l'exercice.");
			}
          return 0;
        }
		if (!paused && prev == 6) speak("Prêt ?");
        if (!paused && prev <= 4 && prev > 0) speak(`${prev - 1}`);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [transition, paused, step]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0 || paused) return;
    timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
	// Annonce de la moitié du temps
    if (timeLeft === Math.floor(exercices[step].duration / 2)) speak("Mi-temps");
	// Annonce d'une phrase focus_zone dans la seconde moitié du temps 
	if (timeLeft === Math.floor(exercices[step].duration / 2) + 5 && timeLeft > 10) {
	  const focus = pickRandom(exercices[step].focus_zone);
	  if (focus) speak(focus);
	}
	// décompte des 5 dernières secondes
    if (timeLeft <= 5 && timeLeft > 0) speak(`${timeLeft}`);
	// fin de l'exercice
    if (timeLeft === 1) {
      setTimeout(() => {
        setIsActive(false);
        if (step + 1 >= exercices.length) {
          setFinished(true);
          speak("Bravo, c'est terminé !");
          return;
        }
        setStep(step + 1);
      }, 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft, paused]);

  const totalDuration = exercices.reduce((sum, e) => sum + e.duration + transitionTime, 0);
  const elapsedSteps = step >= 0 ? exercices.slice(0, step).reduce((sum, e) => sum + e.duration + transitionTime, 0) : 0;
  const globalProgress = Math.min((elapsedSteps / totalDuration) * 100, 100);
  const exo = exercices[step] || {};

  const screenStyle = "min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900 text-white p-6";

 if (transition && exercices[step]) {
    return <TransitionScreen
	  exo={exo}
	  globalProgress={globalProgress}
	  transitionLeft={transitionLeft}
	  transitionTime={transitionTime}
	  paused={paused}
	  setPaused={setPaused}
	  setIsActive={setIsActive}
	  setTimeLeft={setTimeLeft}
	  setTransition={setTransition}
	  speak={speak}
	  intervalRef={intervalRef}
	  step={step}
	  exercices={exercices}
	/>;
  }

  if (isActive && exercices[step]) {
    return <ActiveExerciceScreen
      exo={exo}
      globalProgress={globalProgress}
      timeLeft={timeLeft}
      paused={paused}
      setPaused={setPaused}
      setStep={setStep}
      setIsActive={setIsActive}
      setFinished={setFinished}
      exercices={exercices}
      step={step}
	  erreurCourante={erreurCourante}
    />;
  }

  if (finished) {
    return <FinishedScreen startTime={startTime} resetToAccueil={resetToAccueil} />;
  }

  return (
    <div className={screenStyle}>
      <AnimatePresence mode="wait">
        {!selectedPath && !started && (
          <motion.div key="choix" className="w-full max-w-xl space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-bold mb-4 text-center">Choisis une séance</h1>
            {!selectedFolder ? (
              Object.keys(availableSeances).map((folder, idx) => (
                <StyledButton key={idx} onClick={() => setSelectedFolder(folder)}>
                  {folder}
                </StyledButton>
              ))
            ) : (
              <>
                <StyledButton onClick={() => setSelectedFolder(null)} className="bg-gray-700">
                  ← Retour
                </StyledButton>
                {availableSeances[selectedFolder].map((file, idx) => (
                  <StyledButton key={idx} onClick={() => loadSeance(file.path)}>
                    {file.name}
                  </StyledButton>
                ))}
              </>
            )}
          </motion.div>
        )}

        {selectedPath && !started && !loading && exercices.length > 0 && (
          <motion.div key="presentation" className="w-full max-w-xl space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-semibold">Séance sélectionnée</h2>
            <p><strong>Durée estimée :</strong> ~{Math.ceil(totalDuration / 60)} min</p>
            <ul className="list-disc pl-5">
              {exercices.map((exo, idx) => (
                <li key={idx}><strong>{exo.name}</strong> ({exo.duration}s)</li>
              ))}
            </ul>
            <StyledButton onClick={startRoutine}>Démarrer la séance</StyledButton>
            <StyledButton onClick={resetToAccueil} className="bg-gray-700">← Retour</StyledButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

