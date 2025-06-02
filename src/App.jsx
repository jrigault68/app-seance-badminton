import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function App() {
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
  const transitionTime = 30;
  const synthRef = useRef(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const wakeLockRef = useRef(null);

  const [availableSeances, setAvailableSeances] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const context = import.meta.glob("./seances/**/*.js");
    const entries = Object.entries(context);
    const grouped = {};
    for (const [path, loader] of entries) {
      const cleanPath = path.replace("./seances/", "").replace(".js", "");
      const [folder, name] = cleanPath.split("/");
      if (!grouped[folder]) grouped[folder] = [];
      grouped[folder].push({ name, path, loader });
    }
    setAvailableSeances(grouped);
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
    if (!text) return;
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
      speakIntro(exercices[step]);
    }
  }, [step]);

  useEffect(() => {
    if (!transition || !exercices.length) return;
    setTransitionLeft(transitionTime);
    intervalRef.current = setInterval(() => {
      setTransitionLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimeLeft(exercices[step].duration);
          setIsActive(true);
          setTransition(false);
          speak("Début de l'exercice." + (exercices[step].erreurs ? ` ${exercices[step].erreurs}` : ""));
          return 0;
        }
        if (prev <= 4 && prev > 0) speak(`${prev - 1}`);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [transition]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0 || paused) return;
    timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    if (timeLeft === Math.floor(exercices[step].duration / 2)) speak("Moitié du temps");
    if (timeLeft <= 5 && timeLeft > 0) speak(`${timeLeft}`);
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

  if (!selectedPath && !started && Object.keys(availableSeances).length > 0) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card>
          <CardContent className="space-y-4">
            <h1 className="text-xl font-bold">Choisis une séance :</h1>
            {!selectedFolder ? (
              Object.keys(availableSeances).map((folder, idx) => (
                <Button key={idx} onClick={() => setSelectedFolder(folder)} className="w-full">
                  {folder}
                </Button>
              ))
            ) : (
              <>
                <Button onClick={() => setSelectedFolder(null)} className="mb-4">← Retour</Button>
                {availableSeances[selectedFolder].map((file, idx) => (
                  <Button key={idx} onClick={() => loadSeance(file.path)} className="w-full">
                    {file.name}
                  </Button>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
if (selectedPath && !started && !loading && exercices.length > 0) {
  const minutes = Math.ceil(totalDuration / 60);
  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardContent className="space-y-4">
          <Button onClick={resetToAccueil} className="mb-4">← Retour aux séances</Button>
          <h1 className="text-2xl font-bold text-blue-900">Séance sélectionnée</h1>
          <p><strong>Durée estimée :</strong> ~{minutes} min</p>
          <ul className="list-disc pl-5">
            {exercices.map((exo, idx) => (
              <li key={idx}><strong>{exo.name}</strong> ({exo.duration}s)</li>
            ))}
          </ul>
          <Button className="mt-4 w-full" onClick={startRoutine}>Démarrer la séance</Button>
        </CardContent>
      </Card>
    </div>
  );
}
  if (transition && exercices[step]) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card className="bg-orange-50 shadow-xl">
          <CardContent className="space-y-4 text-center">
            <h2 className="text-xl font-bold text-orange-700">Préparation du prochain exercice...</h2>
            <Progress value={globalProgress} max={100} className="h-1 mb-2 bg-orange-200" />
            <p className="text-lg font-semibold">{exo.name}</p>
            {exo.description && <p><strong>Description :</strong> {exo.description}</p>}
            {exo.position && <p><strong>Position :</strong> {exo.position}</p>}
            <p>Temps de l'exercice : {exo.duration}s</p>
            <p><strong>Début dans :</strong> {transitionLeft} sec</p>
            <Progress value={(transitionTime - transitionLeft) * 100 / transitionTime} max={100} className="h-2 bg-orange-300" />
            <div className="flex justify-between mt-4">
              <Button onClick={() => setPaused(!paused)}>{paused ? "Reprendre" : "Pause"}</Button>
              <Button onClick={() => {
                clearInterval(intervalRef.current);
                setTransition(false);
                setIsActive(true);
                setTimeLeft(exo.duration);
                speak("Début de l'exercice." + (exo.erreurs ? ` ${exo.erreurs}` : ""));
              }}>Passer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (finished) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card className="bg-green-50 shadow-xl">
          <CardContent className="space-y-4 text-center">
            <h1 className="text-2xl font-bold text-green-800">Séance terminée !</h1>
            <p>Bravo pour votre engagement. 🎉</p>
            <p>Temps total : {minutes} min {seconds} sec</p>
            <Button onClick={resetToAccueil}>Retour à l'accueil</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isActive && exercices[step]) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card className="bg-blue-50 shadow-xl">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-800">{exo.name}</h2>
            <Progress value={globalProgress} max={100} className="h-1 mb-2" />
            {exo.description && <p><strong>Description :</strong> {exo.description}</p>}
            {exo.position && <p><strong>Position de départ :</strong> {exo.position}</p>}
            {exo.erreurs && <p><strong>Erreurs fréquentes :</strong> {exo.erreurs}</p>}
            <p><strong>Temps restant :</strong> {timeLeft} sec</p>
            <Progress value={(exo.duration - timeLeft) * 100 / exo.duration} max={100} className="h-2 bg-blue-200" />
            <div className="flex justify-between mt-4">
              <Button onClick={() => setPaused(!paused)}>{paused ? "Reprendre" : "Pause"}</Button>
              <Button onClick={() => {
                setIsActive(false);
                if (step + 1 >= exercices.length) {
                  setFinished(true);
                  return;
                }
                setStep(step + 1);
              }}>Passer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
