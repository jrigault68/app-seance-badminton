import { useState, useEffect, useRef } from "react";
import SelectionSeances from "@/screens/SelectionSeances";
import MoteurExecution from "@/screens/MoteurExecution";
import SeanceScreen from "@/screens/SeanceScreen";
import { genererEtapesDepuisStructure } from "@/utils/genererEtapes";
import ConnexionInscription from "./pages/ConnexionInscription";
import AuthSuccess from "./pages/AuthSuccess";
import Profil from "./pages/Profil";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import { Routes, Route, useLocation } from "react-router-dom";
import Accueil from "./pages/Accueil";
import DynamicTitle from "./components/DynamicTitle";

export default function App() {
  const [selectedStructure, setSelectedStructure] = useState([]);
  const [metaSeance, setMetaSeance] = useState(null);
  const [etapes, setEtapes] = useState([]);
  const [started, setStarted] = useState(false);
  const wakeLockRef = useRef(null);
  const intervalRef = useRef(null);

	const location = useLocation();
  const estDansRoutine =
    started ||
    (selectedStructure.length > 0 && metaSeance) ||
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/profil";

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



  return (
    <>
      <DynamicTitle />
      {!estDansRoutine && <Header />}

      <Routes>
        <Route path="/profil" element={
          <PrivateRoute>
            <Profil />
          </PrivateRoute>
        } />
		<Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/login" element={<ConnexionInscription />} />
        <Route path="/" element={<Accueil />} />
        <Route path="*" element={<SelectionSeances onLoadSeance={handleLoadSeance} />} />
      </Routes>
    </>
  );
}