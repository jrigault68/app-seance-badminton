import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function CreerSeance({ mode = "create" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useUser();
  const [form, setForm] = useState({
    nom: "",
    description: "",
    niveau_id: "",
    type_id: "",
    categorie_id: "",
    structure: [],
  });
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Récupérer le contexte (programmeId, key, from)
  const { programmeId, key, from } = location.state || {};
  const isEdit = mode === "edit" || location.pathname.includes("/modifier");
  const seanceId = params.id;

  useEffect(() => {
    fetch(`${apiUrl}/niveaux`).then(res => res.json()).then(setNiveaux);
    fetch(`${apiUrl}/categories`).then(res => res.json()).then(setCategories);
    fetch(`${apiUrl}/types`).then(res => res.json()).then(setTypes);
    // Si édition, charger la séance existante
    if (isEdit && seanceId) {
      setLoading(true);
      fetch(`${apiUrl}/seances/${seanceId}`)
        .then(res => res.json())
        .then(data => {
          // Correction : gérer { seance: ... } ou { ... }
          const s = data.seance || data;
          setForm({
            nom: s.nom || "",
            description: s.description || "",
            niveau_id: s.niveau_id ? String(s.niveau_id) : "",
            type_id: s.type_id ? String(s.type_id) : "",
            categorie_id: s.categorie_id ? String(s.categorie_id) : "",
            structure: s.structure || [],
          });
        })
        .catch(() => setError("Erreur lors du chargement de la séance"))
        .finally(() => setLoading(false));
    }
  }, [apiUrl, isEdit, seanceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Conversion des IDs en entiers et suppression de tout champ 'categories'
      const { categorie_id, type_id, niveau_id, ...rest } = form;
      const body = {
        ...rest,
        categorie_id: parseInt(categorie_id, 10),
        type_id: parseInt(type_id, 10),
        niveau_id: parseInt(niveau_id, 10),
      };
      let seance;
      if (isEdit && seanceId) {
        // Nettoie le body des champs non modifiables et ajoute updated_at
        const { id, created_by, ...bodyToSend } = body;
        bodyToSend.updated_at = new Date().toISOString();
        const response = await fetch(`${apiUrl}/seances/${seanceId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(bodyToSend)
        });
        if (!response.ok) throw new Error("Erreur lors de la modification de la séance");
        const updated = await response.json();
        // Redirige vers la page de détail de la séance après modification
        navigate(`/seance/${seanceId}`);
      } else {
        // Créer la séance (POST)
        const response = await fetch(`${apiUrl}/seances`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...body, created_by: user.id })
        });
        if (!response.ok) throw new Error("Erreur lors de la création de la séance");
        seance = await response.json();
        // Correction : extraire l'id de la séance selon la structure de la réponse
        const seanceId = seance.id || (seance.seance && seance.seance.id);
        if (programmeId && key && seanceId) {
          if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
            await fetch(`${apiUrl}/programmes/${programmeId}/dates/${key}/seances`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ seance_id: seanceId })
            });
          } else {
            await fetch(`${apiUrl}/programmes/${programmeId}/jours/${key}/seances`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ seance_id: seanceId })
            });
          }
        }
      }
      // Retour à la page d'édition du programme ou à la liste des séances
      if (from) {
        navigate(from, { replace: true, state: { forceEdit: true } });
      } else if (programmeId) {
        navigate(`/programmes/${programmeId}/seances`, { state: { forceEdit: true } });
      } else {
        navigate(`/seance/${seanceId}`);
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
            onClick={() => navigate(-1)}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Retour
          </button>
          <h1 className="text-2xl font-bold text-orange-300">{isEdit ? "Modifier la séance" : "Créer une séance"}</h1>
          <div className="w-8" />
        </div>
        <form onSubmit={handleSubmit} className="bg-black/40 rounded-2xl p-6 border border-gray-700 space-y-6">
          {error && <div className="text-red-400 text-center mb-2">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
              placeholder="Nom de la séance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
              placeholder="Description de la séance"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Niveau</label>
              <select
                name="niveau_id"
                value={form.niveau_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all shadow-sm"
              >
                <option value="" className="bg-gray-700 text-gray-400">Sélectionner un niveau</option>
                {niveaux.map(n => (
                  <option key={n.id} value={n.id} className={'bg-gray-700 text-white'}>{n.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                name="categorie_id"
                value={form.categorie_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all shadow-sm"
              >
                <option value="" className="bg-gray-700 text-gray-400">Sélectionner une catégorie</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="bg-gray-700 text-white">{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type_id"
                value={form.type_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all shadow-sm"
              >
                <option value="" className="bg-gray-700 text-gray-400">Sélectionner un type</option>
                {types.map(t => (
                  <option key={t.id} value={t.id} className="bg-gray-700 text-white">{t.nom}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Structure de la séance à compléter selon besoins */}
          <div className="flex justify-end gap-4 mt-8">
            <button type="submit" className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold" disabled={loading}>
              {isEdit ? "Enregistrer les modifications" : "Créer la séance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 