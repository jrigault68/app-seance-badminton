import { useEffect, useState } from "react";
import { backgroundMainColor, blockStyle } from "@/styles/styles";
import { CheckCircle, Clock, Flame } from "lucide-react";

export function FinishedScreen({ startTime, resetToAccueil, seanceId, programmeId, onMarquerComplete }) {
  const [isMarking, setIsMarking] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  // Marquer automatiquement la séance comme terminée au chargement
  useEffect(() => {
    const marquerAutomatiquement = async () => {
      if (!seanceId || !programmeId || isMarking || isMarked) return;
      
      setIsMarking(true);
      try {
        await onMarquerComplete(programmeId, seanceId, {
          duree_totale: elapsed,
          calories_brulees: Math.round(elapsed * 0.1), // Estimation basique
          niveau_effort: 7.5, // Estimation par défaut
          satisfaction: 4.0, // Estimation par défaut
          notes: `Séance terminée en ${minutes}min ${seconds}s`
        });
        setIsMarked(true);
      } catch (error) {
        console.error('Erreur lors de la marque comme terminée:', error);
      } finally {
        setIsMarking(false);
      }
    };

    // Petit délai pour laisser le temps à l'écran de s'afficher
    const timer = setTimeout(marquerAutomatiquement, 1000);
    return () => clearTimeout(timer);
  }, [seanceId, programmeId, onMarquerComplete, elapsed, minutes, seconds, isMarking, isMarked]);

  return (
    <div className={`min-h-[calc(100vh-64px)] w-full flex items-center justify-center ${backgroundMainColor}`}>
      <div className={"max-w-xl w-full " + blockStyle + " text-center"}>
        <h1 className="text-3xl font-bold text-green-300">👏 Séance terminée !</h1>
        <p className="text-lg text-green-100">
          {programmeId ? "Bravo pour ton engagement dans ton programme !" : "Bravo pour ton engagement !"}
        </p>
        
        <div className="flex items-center justify-center gap-4 my-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{minutes}min {seconds}s</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>~{Math.round(elapsed * 0.1)} cal</span>
          </div>
        </div>

        {programmeId && seanceId ? (
          <div className="mb-4">
            {isMarking ? (
              <div className="p-3 bg-blue-600/20 border border-blue-500 rounded-lg">
                <div className="flex items-center gap-2 text-blue-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enregistrement de votre séance...</span>
                </div>
              </div>
            ) : isMarked ? (
              <div className="p-3 bg-green-600/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>Séance enregistrée dans votre programme !</span>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mb-4 p-3 bg-gray-600/20 border border-gray-500 rounded-lg">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4" />
              <span>Séance terminée avec succès !</span>
            </div>
          </div>
        )}

        <button
          onClick={resetToAccueil}
          className="px-6 py-2 bg-green-700 hover:bg-green-600 rounded-xl shadow"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
