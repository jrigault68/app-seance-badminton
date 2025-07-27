import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import MoteurExecution from "../screens/MoteurExecution";
import SeanceService from "../services/seanceService";
import { genererEtapesDepuisStructure } from "../utils/genererEtapes";

export default function SeanceExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [etapes, setEtapes] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const seance = await SeanceService.getSeanceById(id);
        if (seance && isMounted) {
          setCurrentSession(seance);
          
          // Récupérer les exercices de la séance
          const exercices = await SeanceService.getExercicesSeance(id);
          
          // Générer les étapes avec les exercices récupérés
          const etapesGenerees = genererEtapesDepuisStructure(seance.structure, exercices);
          setEtapes(etapesGenerees);
          setStarted(true);
          setLoading(false);
        } else if (isMounted) {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la séance:', error);
        if (isMounted) {
          navigate('/');
        }
      }
    })();
    return () => { isMounted = false; };
  }, [id, navigate]);

  if (loading || !started || etapes.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mb-6"></div>
            <h2 className="text-xl font-bold text-orange-300 mb-2">Chargement de la séance...</h2>
            <p className="text-gray-400 text-sm">Merci de patienter pendant la préparation de votre séance.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MoteurExecution
        etapes={etapes}
        onFinish={() => setStarted(false)}
        resetToAccueil={() => navigate('/')}
        intervalRef={intervalRef}
        currentSession={currentSession}
      />
    </Layout>
  );
} 