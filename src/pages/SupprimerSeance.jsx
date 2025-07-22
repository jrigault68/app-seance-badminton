import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SupprimerSeance() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/seances/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de la séance");
      navigate("/recherche");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4 text-white">
      <div className="max-w-md w-full space-y-8 mt-16">
        <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
          <h1 className="text-2xl font-bold text-red-400 mb-4 text-center">Supprimer la séance</h1>
          {error && <div className="text-red-400 text-center mb-2">{error}</div>}
          <p className="mb-6 text-center">Es-tu sûr de vouloir supprimer cette séance ? Cette action est irréversible.</p>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={handleDelete}
              disabled={loading}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 