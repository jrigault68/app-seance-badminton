import { useState, useEffect, useRef } from "react";
import SelectionSeances from "@/screens/SelectionSeances";
import MoteurExecution from "@/screens/MoteurExecution";
import SeanceScreen from "@/screens/SeanceScreen";
import { genererEtapesDepuisStructure } from "@/utils/genererEtapes";
import { getProfil } from "./services/authService";

export default function AppStyled() {
  const [selectedStructure, setSelectedStructure] = useState([]);
  const [metaSeance, setMetaSeance] = useState(null);
  const [etapes, setEtapes] = useState([]);
  const [started, setStarted] = useState(false);
  const wakeLockRef = useRef(null);
  const intervalRef = useRef(null);


	useEffect(() => {
	  getProfil()
		.then((user) => console.log("Connecté en tant que :", user))
		.catch(() => console.log("Non connecté"));
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
      return () => {if (wakeLockRef.current) wakeLockRef.current.release();};
    }
  }, []);

  const handleLoadSeance = (structure, meta, exercices) => {
    setSelectedStructure(structure);
    setMetaSeance(meta);
	console.log("🔍 Structure =", JSON.stringify(exercices, null, 2));
    const etapesGenerees = genererEtapesDepuisStructure(structure, exercices);
	console.log("🔍 Etapes =", JSON.stringify(etapesGenerees, null, 2));
    setEtapes(etapesGenerees);
  };

  const resetToAccueil = () => {
    setSelectedStructure([]);
    setMetaSeance(null);
    setEtapes([]);
    setStarted(false);
  };

  const startRoutine = () => {
    setStarted(true);
  };

  if (started && etapes.length > 0) {
    return (<MoteurExecution etapes={etapes} onFinish={() => setStarted(false)} resetToAccueil={resetToAccueil} intervalRef={intervalRef}/>);
  }

  if (selectedStructure.length > 0 && metaSeance) {
    return (<SeanceScreen structure={selectedStructure} meta={metaSeance} onStart={startRoutine} onReturn={resetToAccueil}/>);
  }

  return <SelectionSeances onLoadSeance={handleLoadSeance} />;
}