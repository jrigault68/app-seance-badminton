import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgrammeForm from "../components/ProgrammeForm";

export default function CreerProgramme() {
  const navigate = useNavigate();
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${apiUrl}/niveaux`).then(res => res.json()).then(setNiveaux);
    fetch(`${apiUrl}/categories`).then(res => res.json()).then(setCategories);
    fetch(`${apiUrl}/types`).then(res => res.json()).then(setTypes);
  }, [apiUrl]);

  const handleSubmit = async (form) => {
    setLoading(true);
    setError(null);
    const body = { ...form };
    if (form.type_programme === "libre") {
      body.date_debut = "";
      body.date_fin = "";
    } else {
      body.nb_jours = "";
    }
    try {
      const response = await fetch(`${apiUrl}/programmes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const data = await response.json();
        navigate(`/programmes/${data.id}`);
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la création");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4 text-white">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex items-center justify-between mt-8 mb-6">
          <button
            onClick={() => navigate("/programmes")}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Retour
          </button>
          <h1 className="text-2xl font-bold text-orange-300">Créer un programme</h1>
          <div className="w-8" />
        </div>
        <ProgrammeForm
          initialValues={{}}
          onSubmit={handleSubmit}
          niveaux={niveaux}
          categories={categories}
          types={types}
          mode="create"
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
} 