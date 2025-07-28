import { useEffect, useRef } from "react";
import Programmes from "@/pages/Programmes";
import ConnexionInscription from "./pages/ConnexionInscription";
import AuthSuccess from "./pages/AuthSuccess";
import Profil from "./pages/Profil";
import PrivateRoute from "./components/PrivateRoute";
import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import DynamicTitle from "./components/DynamicTitle";
import AjouterExercice from "./pages/AjouterExercice";
import AdminExercices from "./pages/AdminExercices";
import Exercices from "./pages/Exercices";
import ExerciceDetail from "./pages/ExerciceDetail";
import CreerProgramme from "./pages/CreerProgramme";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import CreerSeance from "./pages/CreerSeance";
import { PageTitleProvider } from "./contexts/PageTitleContext";

import Seances from './pages/Seances';
import SeanceDetail from './pages/SeanceDetail';
import SeanceExecution from "./pages/SeanceExecution";

export default function App() {
  const wakeLockRef = useRef(null);

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

  return (
    <PageTitleProvider>
      <DynamicTitle />
      <Routes>
        <Route path="/profil" element={
          <PrivateRoute>
            <Profil />
          </PrivateRoute>
        } />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/login" element={<ConnexionInscription />} />
        <Route path="/" element={<Accueil />} />
        <Route path="/seances" element={<Seances />} />
        <Route path="/seances/creer" element={<CreerSeance />} />
        <Route path="/seances/:id/execution" element={<SeanceExecution />} />
        <Route path="/seances/:id" element={<SeanceDetail />} />
        <Route path="/programmes" element={<Programmes />} />
        <Route path="/programmes/creer" element={<CreerProgramme />} />
        <Route path="/programmes/:id" element={<ProgrammeDetail />} />
        <Route path="/exercices" element={<Exercices />} />
        <Route path="/exercices/:id" element={<ExerciceDetail />} />
        <Route path="/ajouter-exercice" element={
          <PrivateRoute>
            <AjouterExercice />
          </PrivateRoute>
        } />
        <Route path="/admin-exercices" element={
          <PrivateRoute>
            <AdminExercices />
          </PrivateRoute>
        } />
        <Route path="/seances/:id/modifier" element={
          <PrivateRoute>
            <CreerSeance mode="edit" />
          </PrivateRoute>
        } />

        
        <Route path="*" element={<Accueil />} />
      </Routes>
    </PageTitleProvider>
  );
}