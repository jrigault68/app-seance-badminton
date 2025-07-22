import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ProgrammeForm from "../components/ProgrammeForm";

export default function ProgrammeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Récupérer les listes de référence pour affichage lisible
    fetch(`${apiUrl}/niveaux`).then(res => res.json()).then(setNiveaux);
    fetch(`${apiUrl}/categories`).then(res => res.json()).then(setCategories);
    fetch(`${apiUrl}/types`).then(res => res.json()).then(setTypes);
  }, [apiUrl]);

  useEffect(() => {
    const fetchProgramme = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/programmes/${id}`);
        if (!response.ok) throw new Error("Programme introuvable");
        const data = await response.json();
        setProgramme(data);
        setForm(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgramme();
  }, [id, apiUrl]);

  const isCreator = user && programme && user.id === programme.created_by;

  const getNomNiveau = (niveau_id) => {
    const n = niveaux.find(n => n.id === niveau_id);
    return n ? n.nom : <span className="italic text-gray-500">Non renseigné</span>;
  };
  const getNomCategorie = (categorie_id) => {
    const c = categories.find(c => c.id === categorie_id);
    return c ? c.nom : <span className="italic text-gray-500">Non renseignée</span>;
  };
  const getNomType = (type_id) => {
    const t = types.find(t => t.id === type_id);
    return t ? t.nom : <span className="italic text-gray-500">Non renseigné</span>;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUpdate = async (form) => {
    try {
      setLoading(true);
      setError(null);
      // On ne garde que les champs éditables
      const body = { ...form };
      delete body.id;
      delete body.created_by;
      delete body.created_at;
      delete body.updated_at;
      delete body.pseudo_createur;
      if (body.date_debut === "") delete body.date_debut;
      if (body.date_fin === "") delete body.date_fin;
      const response = await fetch(`${apiUrl}/programmes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      const data = await response.json();
      setProgramme(data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex items-center justify-between mt-8 mb-6">
          <button
            onClick={() => navigate("/programmes")}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Retour
          </button>
          <h1 className="text-2xl font-bold text-orange-300">Détail du programme</h1>
          <div className="w-8" />
        </div>
        {editMode ? (
          <ProgrammeForm
            initialValues={programme}
            onSubmit={handleUpdate}
            niveaux={niveaux}
            categories={categories}
            types={types}
            mode="edit"
            loading={loading}
            error={error}
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <div className="bg-black/40 rounded-2xl p-6 border border-gray-700 space-y-6">
            <h2 className="text-xl font-bold mb-2">{programme.nom}</h2>
            <p className="text-gray-300 mb-4">
              {programme.description
                ? programme.description.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                : <span className="italic text-gray-500">Aucune description</span>}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Niveau :</span>
                <span className="text-white ml-2">{getNomNiveau(programme.niveau_id)}</span>
              </div>
              <div>
                <span className="text-gray-400">Catégorie :</span>
                <span className="text-white ml-2">{getNomCategorie(programme.categorie_id)}</span>
              </div>
              <div>
                <span className="text-gray-400">Type :</span>
                <span className="text-white ml-2">{getNomType(programme.type_id)}</span>
              </div>
              <div>
                <span className="text-gray-400">Type de programme :</span>
                <span className="text-white ml-2 capitalize">{programme.type_programme || <span className="italic text-gray-500">Non renseigné</span>}</span>
              </div>
              {programme.type_programme === 'libre' && (
                <div>
                  <span className="text-gray-400">Nombre de jours :</span>
                  <span className="text-white ml-2">{programme.nb_jours || <span className="italic text-gray-500">Non renseigné</span>}</span>
                </div>
              )}
              {programme.type_programme === 'calendaire' && (
                <>
                  <div>
                    <span className="text-gray-400">Date de début :</span>
                    <span className="text-white ml-2">{programme.date_debut ? new Date(programme.date_debut).toLocaleDateString() : <span className="italic text-gray-500">Non renseignée</span>}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Date de fin :</span>
                    <span className="text-white ml-2">{programme.date_fin ? new Date(programme.date_fin).toLocaleDateString() : <span className="italic text-gray-500">Non renseignée</span>}</span>
                  </div>
                </>
              )}
              <div>
                <span className="text-gray-400">Objectif :</span>
                <span className="text-white ml-2">{programme.objectif || <span className="italic text-gray-500">Non renseigné</span>}</span>
              </div>
              <div>
                <span className="text-gray-400">Statut :</span>
                <span className={"ml-2 px-2 py-1 rounded-full text-xs " + (programme.est_actif ? "bg-green-700 text-white" : "bg-gray-700 text-gray-300")}>{programme.est_actif ? "Actif" : "Inactif"}</span>
              </div>
              <div>
                <span className="text-gray-400">Créé par :</span>
                <span className="text-white ml-2">{programme.pseudo_createur || <span className="italic text-gray-500">Non renseigné</span>}</span>
              </div>
              <div>
                <span className="text-gray-400">Créé le :</span>
                <span className="text-white ml-2">{programme.created_at ? new Date(programme.created_at).toLocaleString() : <span className="italic text-gray-500">Non renseignée</span>}</span>
              </div>
              <div>
                <span className="text-gray-400">Modifié le :</span>
                <span className="text-white ml-2">{programme.updated_at ? new Date(programme.updated_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) : <span className="italic text-gray-500">Non renseignée</span>}</span>
              </div>
            </div>
            {programme.image_url && (
              <div className="mt-4">
                <img src={programme.image_url} alt="Illustration du programme" className="max-h-48 rounded-lg mx-auto border border-gray-700" />
              </div>
            )}
            {isCreator && (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold mt-4"
                onClick={() => setEditMode(true)}
              >
                Modifier le programme
              </button>
            )}
            
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={() => navigate(`/programmes/${programme.id}/seances`)}
                >
                  Voir les séances
                </button>
              </div>
            
          </div>
        )}
      </div>
    </div>
  );
} 