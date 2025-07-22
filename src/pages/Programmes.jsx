import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Programmes() {
  const navigate = useNavigate();
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/programmes`);
        if (!response.ok) throw new Error("Erreur lors du chargement des programmes");
        const data = await response.json();
        setProgrammes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgrammes();
  }, [apiUrl]);

  return (
    <div className="w-full flex items-center justify-center px-4 text-white">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center mt-8 mb-6">
          <h1 className="text-3xl font-bold text-orange-300 mb-2">📅 Programmes sportifs</h1>
          <p className="text-gray-300 mb-4">Choisissez un programme à suivre pour structurer votre entraînement et progresser efficacement.</p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold mb-4"
            onClick={() => navigate("/programmes/creer")}
          >
            + Créer un programme
          </button>
        </div>
        {loading ? (
          <div className="text-center text-gray-400">Chargement des programmes...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programmes.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400">Aucun programme trouvé.</div>
            ) : programmes.map((programme) => (
              <div key={programme.id} className="bg-black/40 border border-gray-700 rounded-2xl p-6 hover:bg-black/60 transition-all cursor-pointer">
                <h2 className="text-xl font-semibold text-white mb-2">{programme.nom}</h2>
                <p className="text-gray-300 mb-4">{programme.description}</p>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={() => navigate(`/programmes/${programme.id}`)}
                >
                  Voir le programme
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 