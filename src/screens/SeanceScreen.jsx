import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { screenStyle } from "@/styles/styles";
import StyledButton from "@/components/StyledButton";
import SeanceStats from "@/components/ui/SeanceStats";
import SeanceDetails from "@/components/ui/SeanceDetails";
import SeanceStructure from "@/components/ui/SeanceStructure";
import SeanceService from "@/services/seanceService";

export default function SeanceScreen({ onStart, onReturn }) {
  const { id } = useParams();
  const [seance, setSeance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSeance = async () => {
      if (!id) {
        setError("Aucun ID de séance fourni");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const seanceData = await SeanceService.getSeanceById(id);
        setSeance(seanceData);
      } catch (err) {
        console.error("Erreur lors du chargement de la séance:", err);
        setError(err.message || "Erreur lors du chargement de la séance");
      } finally {
        setLoading(false);
      }
    };

    loadSeance();
  }, [id]);

  if (loading) {
    return (
      <div className={screenStyle}>
        <div className="max-w-4xl w-full space-y-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement de la séance...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={screenStyle}>
        <div className="max-w-4xl w-full space-y-6">
          <div className="text-center">
            <div className="bg-red-900/50 border border-red-700 rounded-2xl p-6 mb-4">
              <span className="text-2xl mb-2 block">❌</span>
              <h2 className="text-xl font-bold text-red-300 mb-2">Erreur</h2>
              <p className="text-gray-300">{error}</p>
            </div>
            <StyledButton onClick={onReturn} className="bg-gray-700">
              ← Retour
            </StyledButton>
          </div>
        </div>
      </div>
    );
  }

  if (!seance) {
    return (
      <div className={screenStyle}>
        <div className="max-w-4xl w-full space-y-6">
          <div className="text-center">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-4">
              <span className="text-2xl mb-2 block">🔍</span>
              <h2 className="text-xl font-bold text-gray-300 mb-2">Séance non trouvée</h2>
              <p className="text-gray-400">La séance demandée n'existe pas ou n'est plus disponible.</p>
            </div>
            <StyledButton onClick={onReturn} className="bg-gray-700">
              ← Retour
            </StyledButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={screenStyle}>
      <div className="max-w-4xl w-full space-y-6">
        {/* En-tête de la séance */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-300 mb-2">
            {seance.nom}
          </h1>
          {seance.auteur_pseudo && (
            <p className="text-gray-400 text-sm">
              Créée par <span className="text-orange-400">{seance.auteur_pseudo}</span>
            </p>
          )}
        </div>

        {/* Statistiques de la séance */}
        <SeanceStats seance={seance} />

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - Détails */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
              <SeanceDetails seance={seance} />
            </div>
          </div>

          {/* Colonne de droite - Structure */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
              <SeanceStructure structure={seance.structure} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <StyledButton 
            onClick={() => onStart(seance)} 
            className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600"
          >
            🚀 Démarrer la séance
          </StyledButton>
          <StyledButton 
            onClick={onReturn} 
            className="bg-gray-700 hover:bg-gray-600"
          >
            ← Retour
          </StyledButton>
        </div>
      </div>
    </div>
  );
}
