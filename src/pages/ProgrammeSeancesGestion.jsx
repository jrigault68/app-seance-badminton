import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function formatDateFr(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Ajoute une fonction utilitaire pour générer la liste des dates entre deux bornes
function getDatesBetween(start, end) {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Composant récursif pour afficher la structure de la séance
function RenderStructure({ structure }) {
  if (!structure || structure.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 pl-4 border-l-2 border-gray-700 text-sm space-y-1">
      {structure.map((item, index) => (
        <div key={index} className="text-gray-300">
          {item.type === 'bloc' ? (
            <div className="bg-gray-700/30 p-2 rounded-md">
              <span className="font-semibold text-orange-200">
                {item.nom || "Section"} (x{item.nbTours || 1})
              </span>
              <RenderStructure structure={item.contenu} />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span>{item.nom}</span>
              <span className="text-xs text-gray-400">
                {item.type_exercice === 'temps' && `${item.duree}s`}
                {item.type_exercice === 'reps' && `${item.repetitions} reps`}
                {item.type_exercice === 'temps+reps' && `${item.duree}s / ${item.repetitions} reps`}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProgrammeSeancesGestion() {
  const { id } = useParams(); // id du programme
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [programme, setProgramme] = useState(null);
  const [items, setItems] = useState([]); // [{ jour/date, seances: [seanceObj, ...] }, ...]
  const [seancesDispo, setSeancesDispo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Déplacer fetchData hors du useEffect pour pouvoir l'appeler après ajout/suppression
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Charger le programme
      const resProg = await fetch(`${apiUrl}/programmes/${id}`);
      if (!resProg.ok) throw new Error("Programme introuvable");
      const prog = await resProg.json();
      setProgramme(prog);
      // Charger les associations (jours ou dates)
      let resItems, itemsData;
      if (prog.type_programme === 'calendaire') {
        resItems = await fetch(`${apiUrl}/programmes/${id}/dates`);
        itemsData = await resItems.ok ? await resItems.json() : [];
      } else {
        resItems = await fetch(`${apiUrl}/programmes/${id}/jours`);
        itemsData = await resItems.ok ? await resItems.json() : [];
      }
      setItems(itemsData);
      // Charger toutes les séances dispo (pour ajout)
      const resSeances = await fetch(`${apiUrl}/seances`);
      const seancesData = await resSeances.ok ? await resSeances.json() : { seances: [] };
      setSeancesDispo(seancesData.seances || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, apiUrl, editMode]);

  useEffect(() => {
    // Active le mode édition si on arrive avec le flag forceEdit
    if (location.state && location.state.forceEdit) {
      setEditMode(true);
    }
  }, [location.state]);

  const isCreator = user && programme && user.id === programme.created_by;
  const isCalendaire = programme?.type_programme === 'calendaire';
  const nbJours = programme?.nb_jours || 0;

  // Ajout d'une séance à un jour/date
  const handleAddSeance = async (key, seanceId) => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (isCalendaire) {
        url = `${apiUrl}/programmes/${id}/dates/${key}/seances`;
      } else {
        url = `${apiUrl}/programmes/${id}/jours/${key}/seances`;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ seance_id: seanceId })
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout de la séance");
      await fetchData(); // Recharge la liste immédiatement
      setEditMode(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'une séance d'un jour/date
  const handleRemoveSeance = async (key, seanceId) => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (isCalendaire) {
        url = `${apiUrl}/programmes/${id}/dates/${key}/seances/${seanceId}`;
      } else {
        url = `${apiUrl}/programmes/${id}/jours/${key}/seances/${seanceId}`;
      }
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression de la séance");
      await fetchData(); // Recharge la liste immédiatement
      setEditMode(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer une nouvelle séance et revenir ensuite
  const handleCreateSeance = (key) => {
    // On passe le contexte dans le state de navigation
    navigate('/seances/creer', {
      state: {
        programmeId: id,
        key, // jour ou date
        from: location.pathname
      }
    });
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-10">Chargement...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 py-10">{error}</div>;
  }
  if (!programme) {
    return <div className="text-center text-gray-400 py-10">Programme introuvable.</div>;
  }

  return (
    <div className="w-full flex items-center justify-center px-4 text-white">
      <div className="max-w-3xl w-full space-y-8">
        <div className="flex items-center justify-between mt-8 mb-6">
          <button
            onClick={() => navigate(`/programmes/${id}`)}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Retour au programme
          </button>
          <h1 className="text-2xl font-bold text-orange-300">Séances du programme {isCalendaire ? "(calendaire)" : "(libre)"}</h1>
          <div className="w-8" />
        </div>
        {isCreator && (
          <div className="flex justify-end mb-4">
            <button
              className={`px-4 py-2 rounded-lg font-semibold ${editMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
              onClick={() => setEditMode(e => !e)}
            >
              {editMode ? "Terminer l'édition" : "Modifier les séances"}
            </button>
          </div>
        )}
        <div className="space-y-6">
          {isCalendaire
            ? (
                programme.date_debut && programme.date_fin ? (
                  getDatesBetween(programme.date_debut, programme.date_fin).map(date => {
                    const found = items.find(item => item.date === date);
                    const seances = found ? found.seances : [];
                    return (
                      <div key={date} className="bg-black/40 border border-gray-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-lg font-semibold text-orange-200">{formatDateFr(date)}</h2>
                          {editMode && isCreator && (
                            <>
                              <select
                                className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white"
                                onChange={e => {
                                  if (e.target.value) handleAddSeance(date, e.target.value);
                                }}
                                defaultValue=""
                              >
                                <option value="">+ Associer une séance</option>
                                {seancesDispo.map(seance => {
                                  const dejaAssocie = seances.some(s => s.id === seance.id);
                                  return (
                                    <option key={seance.id} value={seance.id} disabled={dejaAssocie}>
                                      {seance.nom}{dejaAssocie ? " (déjà associé)" : ""}
                                    </option>
                                  );
                                })}
                              </select>
                              <button
                                className="ml-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-semibold"
                                onClick={() => handleCreateSeance(date)}
                                type="button"
                              >
                                Créer une nouvelle séance
                              </button>
                            </>
                          )}
                        </div>
                        {seances.length === 0 ? (
                          <div className="text-gray-400 italic">Aucune séance associée</div>
                        ) : (
                          <ul className="space-y-2">
                            {seances.map(seance => (
                              <li key={seance.id} className="bg-gray-800/60 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-semibold text-white">{seance.nom}</span>
                                    <span className="ml-2 text-xs text-gray-400">{seance.type_nom}</span>
                                  </div>
                                  {editMode && isCreator && (
                                    <div className="flex gap-2 items-center">
                                      <button
                                        className="text-blue-400 hover:text-blue-600 text-sm px-2 py-1"
                                        onClick={() => navigate(`/seance/${seance.id}`)}
                                      >
                                        Voir
                                      </button>
                                       <button
                                        className="text-green-400 hover:text-green-600 text-sm px-2 py-1"
                                        onClick={() => navigate(`/seances/${seance.id}/exercices`)}
                                      >
                                        Gérer
                                      </button>
                                      <button
                                        className="text-red-400 hover:text-red-600 text-sm px-2 py-1"
                                        onClick={() => handleRemoveSeance(date, seance.id)}
                                      >
                                        Retirer
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <RenderStructure structure={seance.structure} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-400 italic">Dates du programme non renseignées.</div>
                )
              )
            : [...Array(nbJours)].map((_, i) => {
                const jour = i + 1;
                const seancesJour = items.find(j => j.jour === jour)?.seances || [];
                return (
                  <div key={jour} className="bg-black/40 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold text-orange-200">Jour {jour}</h2>
                      {editMode && isCreator && (
                        <>
                          <select
                            className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white"
                            onChange={e => {
                              if (e.target.value) handleAddSeance(jour, e.target.value);
                            }}
                            defaultValue=""
                          >
                            <option value="">+ Associer une séance</option>
                            {seancesDispo.map(seance => {
                              const dejaAssocie = seancesJour.some(s => s.id === seance.id);
                              return (
                                <option key={seance.id} value={seance.id} disabled={dejaAssocie}>
                                  {seance.nom}{dejaAssocie ? " (déjà associé)" : ""}
                                </option>
                              );
                            })}
                          </select>
                          <button
                            className="ml-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-semibold"
                            onClick={() => handleCreateSeance(jour)}
                            type="button"
                          >
                            Créer une nouvelle séance
                          </button>
                        </>
                      )}
                    </div>
                    {seancesJour.length === 0 ? (
                      <div className="text-gray-400 italic">Aucune séance associée</div>
                    ) : (
                      <ul className="space-y-2">
                        {seancesJour.map(seance => (
                          <li key={seance.id} className="bg-gray-800/60 rounded-lg p-3">
                             <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-semibold text-white">{seance.nom}</span>
                                  <span className="ml-2 text-xs text-gray-400">{seance.type_nom}</span>
                                </div>
                                {editMode && isCreator && (
                                  <div className="flex gap-2 items-center">
                                     <button
                                      className="text-blue-400 hover:text-blue-600 text-sm px-2 py-1"
                                      onClick={() => navigate(`/seance/${seance.id}`)}
                                    >
                                      Voir
                                    </button>
                                    <button
                                      className="text-green-400 hover:text-green-600 text-sm px-2 py-1"
                                      onClick={() => navigate(`/seances/${seance.id}/exercices`)}
                                    >
                                      Gérer
                                    </button>
                                    <button
                                      className="text-red-400 hover:text-red-600 text-sm px-2 py-1"
                                      onClick={() => handleRemoveSeance(jour, seance.id)}
                                    >
                                      Retirer
                                    </button>
                                  </div>
                                )}
                              </div>
                              <RenderStructure structure={seance.structure} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
} 