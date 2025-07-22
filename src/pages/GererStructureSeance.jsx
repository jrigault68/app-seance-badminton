import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditeurStructureSeance from "../components/EditeurStructureSeance";
import { useUser } from "../contexts/UserContext";
// import { usePrompt } from "../utils/usePrompt";

export default function GererStructureSeance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [seance, setSeance] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [isDirty, setIsDirty] = useState(false);
  const initialStructureRef = useRef(null);

  useEffect(() => {
    const fetchSeance = async () => {
      setPageLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiUrl}/seances/${id}`);
        const data = await res.json();
        const s = data.seance || data;
        setSeance(s);
        initialStructureRef.current = JSON.stringify(s.structure || []);
      } catch (err) {
        setError("Erreur lors du chargement de la séance");
      } finally {
        setPageLoading(false);
      }
    };
    fetchSeance();
  }, [id, apiUrl]);

  // Nettoyage récursif de la structure avant enregistrement
  function cleanStructure(structure) {
    return structure
      .filter(step => {
        if (step.type === "exercice") {
          return step.id && step.nom;
        } else if (step.type === "bloc") {
          return Array.isArray(step.contenu) && step.contenu.length > 0;
        }
        return false;
      })
      .map(step => {
        if (step.type === "exercice") {
          return {
            type: "exercice",
            id: step.id,
            nom: step.nom,
            duree: step.duree || 0,
            repetitions: step.repetitions || 0
          };
        } else if (step.type === "bloc") {
          return {
            type: "bloc",
            nom: step.nom || "Bloc",
            contenu: cleanStructure(step.contenu || [])
          };
        }
        return null;
      });
  }

  const handleSave = async (newStructure) => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    // On enregistre la structure brute, sans nettoyage ni validation bloquante
    const structureToSave = newStructure;
    try {
      const res = await fetch(`${apiUrl}/seances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ structure: structureToSave, updated_at: new Date().toISOString() })
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      setSuccess("Structure enregistrée avec succès !");
      initialStructureRef.current = JSON.stringify(structureToSave);
      setIsDirty(false);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStructureChange = (newStructure) => {
    if (initialStructureRef.current) {
      setIsDirty(JSON.stringify(newStructure) !== initialStructureRef.current);
    }
  };

  // Blocage navigation interne si dirty
  // usePrompt(isDirty, "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?");

  if (pageLoading) return <div className="text-center text-gray-400 py-10">Chargement...</div>;
  if (error) return <div className="text-center text-red-400 py-10">{error}</div>;
  if (!seance) return <div className="text-center text-gray-400 py-10">Séance introuvable.</div>;

  // Vérification propriétaire
  if (user && seance.created_by !== user.id) {
    return <div className="text-center text-red-400 py-10">Accès refusé : vous n'êtes pas le propriétaire de cette séance.</div>;
  }

  return (
    <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto py-4 px-1 sm:px-4 text-white">
      <h1 className="text-2xl font-bold text-orange-300 mb-6 text-center">Gérer la structure de la séance</h1>
      {success && <div className="text-green-400 text-center mb-4">{success}</div>}
      <EditeurStructureSeance
        initialStructure={seance.structure || []}
        onSave={handleSave}
        mode="edit"
        isRoot={true}
        isSaving={isSaving}
        onChange={handleStructureChange}
        isDirty={isDirty}
      />
      <div className="flex justify-center mt-8">
        <button
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold"
          onClick={() => navigate(`/seance/${id}`)}
        >
          Retour à la séance
        </button>
      </div>
    </div>
  );
} 