
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const exercices = [
  {
    name: "Automassage Quadriceps",
    duration: 30,
    description:
      "Allongé sur le ventre, rouleau sous les cuisses. Faire des va-et-vient lents du haut vers le bas des quadriceps.",
    position: "Face contre sol, appui sur les avant-bras",
    erreurs: "Ne pas rouler trop vite ni passer directement sur les articulations.",
  },
  {
    name: "Étirement bras croisé",
    duration: 30,
    description:
      "Attraper le bras droit avec la main gauche et le tirer doucement vers la gauche à hauteur d’épaule.",
    position: "Debout ou assis, dos droit",
    erreurs: "Ne pas tourner le buste, garder les épaules basses.",
  },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [transition, setTransition] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [transitionLeft, setTransitionLeft] = useState(30);
  const transitionTime = 30;
  const synthRef = useRef(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const totalSteps = exercices.length;
  const totalDuration = exercices.reduce((sum, e) => sum + e.duration + transitionTime, 0);
  const elapsedSteps = step >= 0 ? exercices.slice(0, step).reduce((sum, e) => sum + e.duration + transitionTime, 0) : 0;
  const globalProgress = Math.min((elapsedSteps / totalDuration) * 100, 100);

  const exo = exercices[step] || {};

  const clearAllTimers = () => {
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
    if (synthRef.current) synthRef.current.cancel();
  };

  useEffect(() => {
    if (transition) {
      setTransitionLeft(transitionTime);
      intervalRef.current = setInterval(() => {
        setTransitionLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setTimeLeft(exo.duration);
            setIsActive(true);
            setTransition(false);
            speak("Début de l'exercice. " + exo.erreurs);
            return 0;
          }
          if (prev <= 4 && prev > 0) speak(`${prev-1}`);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [transition]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      if (timeLeft === Math.floor(exo.duration / 2)) speak("Moitié du temps");
      if (timeLeft <= 5 && timeLeft > 0) speak(`${timeLeft}`);
    } else if (isActive && timeLeft === 0) {
      clearTimeout(timerRef.current);
      setIsActive(false);
      if (step + 1 >= exercices.length) {
        setFinished(true);
        speak("Bravo, c'est terminé !");
        return;
      }
      const next = step + 1;
      setStep(next);
      setTransition(true);
      speakIntro(exercices[next]);
    }
    return () => clearTimeout(timerRef.current);
  }, [isActive, timeLeft]);

  const speak = (text) => {
    if (synthRef.current) synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current = speechSynthesis;
    synthRef.current.speak(utterance);
  };

  const speakIntro = (exo) => {
    const intro = `Prochain exercice : ${exo.name}. ${exo.description} Position de départ : ${exo.position}.`;
    speak(intro);
  };

  const startRoutine = () => {
    setStarted(true);
    setStartTime(Date.now());
    const first = 0;
    setStep(first);
    setTransition(true);
    speakIntro(exercices[first]);
  };

  const pauseRoutine = () => {
    setIsActive(false);
    clearAllTimers();
  };

  const resumeRoutine = () => {
    setIsActive(true);
  };

  const skipRoutine = () => {
    clearAllTimers();
    if (transition) {
      setTimeLeft(exo.duration);
      setIsActive(true);
      setTransition(false);
      speak("Début de l'exercice.");
      speak(exo.erreurs);
    } else {
      if (step + 1 >= exercices.length) {
        setFinished(true);
        return;
      }
      const next = step + 1;
      setStep(next);
      setTransition(true);
      speakIntro(exercices[next]);
    }
  };

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
            <Button onClick={() => window.location.reload()}>Recommencer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!started) {
    const totalSeconds = exercices.reduce((sum, e) => sum + e.duration + transitionTime, 0);
    const minutes = Math.ceil(totalSeconds / 60);
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardContent className="space-y-4">
            <h1 className="text-2xl font-bold text-center text-blue-900">Séance Récupération Post-Tournoi</h1>
            <p><strong>Durée estimée :</strong> ~{minutes} min</p>
            <p><strong>Objectif :</strong> Détendre les jambes et bras post-compétition</p>
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
            <p><strong>Description :</strong> {exo.description}</p>
            <p><strong>Position :</strong> {exo.position}</p>
            <p>Temps de l'exercice : {exo.duration}s</p>
            <p><strong>Début dans :</strong> {transitionLeft} sec</p>
            <Progress value={(transitionTime - transitionLeft) * 100 / transitionTime} max={100} className="h-2 bg-orange-300" />
            <div className="flex gap-4 pt-4 justify-center">
              <Button onClick={skipRoutine}>Passer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card className="bg-blue-50 shadow-xl">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-800">{exo.name}</h2>
          <Progress value={globalProgress} max={100} className="h-1 mb-2" />
          <p><strong>Description :</strong> {exo.description}</p>
          <p><strong>Position de départ :</strong> {exo.position}</p>
          <p><strong>Erreurs fréquentes :</strong> {exo.erreurs}</p>
          <p><strong>Temps restant :</strong> {timeLeft} sec</p>
          <Progress value={(exo.duration - timeLeft) * 100 / exo.duration} max={100} className="h-2 bg-blue-200" />
          <div className="flex gap-4 pt-4">
            {isActive ? <Button onClick={pauseRoutine}>Pause</Button> : <Button onClick={resumeRoutine}>Reprendre</Button>}
            <Button onClick={skipRoutine}>Passer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
