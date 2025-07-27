import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import SeanceStructure from "../components/ui/SeanceStructure";
import EditeurStructureSeance from "../components/EditeurStructureSeance";
import SeanceService from "../services/seanceService";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import FloatingSaveButton from "../components/ui/FloatingSaveButton";
import NavigationPromptDialog from "../components/ui/NavigationPromptDialog";
import { useUser } from "../contexts/UserContext";
import { Pencil, Calendar, BarChart2, Tag, Layers, User, CheckCircle, XCircle, Play, Trash2, Settings } from "lucide-react";
import { estimerDureeEtape } from "../utils/helpers";
import { genererEtapesDepuisStructure } from "../utils/genererEtapes";
import { JsonViewer } from "json-viewer-react";

export default function SeanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const isNew = location.pathname.endsWith("/new") || !id;
  const [mode, setMode] = useState(isNew ? "new" : "detail"); // 'detail' | 'edit' | 'new'
  const [structureEditMode, setStructureEditMode] = useState(false); // Nouveau mode pour l'édition de structure
  const [seance, setSeance] = useState(null);
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nom: "", description: "", niveau_id: "", type_id: "", categorie_id: "", structure: [] });
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [blockedLocation, setBlockedLocation] = useState(null);
  const [savingAndQuit, setSavingAndQuit] = useState(false);
  const initialFormRef = useRef(form);
  const [hasChanged, setHasChanged] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const isCreatorOrAdmin = user && seance && (user.id === seance.created_by || user.is_admin);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Récupère les listes de référence
  useEffect(() => {
    fetch(`${apiUrl}/niveaux`).then(res => res.json()).then(setNiveaux);
    fetch(`${apiUrl}/categories`).then(res => res.json()).then(setCategories);
    fetch(`${apiUrl}/types`).then(res => res.json()).then(setTypes);
  }, [apiUrl]);

  // Charge la séance si mode detail/edit
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setSeance(null);
      setForm({ nom: "", description: "", niveau_id: "", type_id: "", categorie_id: "", structure: [] });
      initialFormRef.current = { nom: "", description: "", niveau_id: "", type_id: "", categorie_id: "", structure: [] };
      return;
    }
    setLoading(true);
    SeanceService.getSeanceById(id)
      .then(data => {
        setSeance(data);
        setForm({
          nom: data.nom || "",
          description: data.description || "",
          niveau_id: data.niveau_id ? String(data.niveau_id) : "",
          type_id: data.type_id ? String(data.type_id) : "",
          categorie_id: data.categorie_id ? String(data.categorie_id) : "",
          structure: data.structure || []
        });
        initialFormRef.current = {
          nom: data.nom || "",
          description: data.description || "",
          niveau_id: data.niveau_id ? String(data.niveau_id) : "",
          type_id: data.type_id ? String(data.type_id) : "",
          categorie_id: data.categorie_id ? String(data.categorie_id) : "",
          structure: data.structure || []
        };
        
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

      SeanceService.getExercicesSeance(id).then(data => setExercices(data || []));
  }, [id, isNew]);

  // Dirty state
  useEffect(() => {
    setHasChanged(JSON.stringify(form) !== JSON.stringify(initialFormRef.current));
  }, [form]);

  // Blocage navigateur (fermeture/rafraîchissement)
  useEffect(() => {
    if (!hasChanged) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanged]);

  // Handlers formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Création ou édition
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const { categorie_id, type_id, niveau_id, ...rest } = form;
      const body = {
        ...rest,
        categorie_id: categorie_id ? parseInt(categorie_id, 10) : null,
        type_id: type_id ? parseInt(type_id, 10) : null,
        niveau_id: niveau_id ? parseInt(niveau_id, 10) : null,
      };
      let seanceResp;
      if (mode === "edit") {
        const response = await fetch(`${apiUrl}/seances/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Erreur lors de la modification de la séance");
        seanceResp = await response.json();
        setMode("detail");
        setSeance({ ...seance, ...form });
        initialFormRef.current = form;
        setHasChanged(false);
      } else {
        const response = await fetch(`${apiUrl}/seances`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...body, created_by: user.id })
        });
        if (!response.ok) throw new Error("Erreur lors de la création de la séance");
        seanceResp = await response.json();
        const newId = seanceResp.id || (seanceResp.seance && seanceResp.seance.id);
        navigate(`/seances/${newId}`);
        setMode("detail");
        setSeance({ ...form, id: newId });
        initialFormRef.current = form;
        setHasChanged(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/seances/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression de la séance");
      navigate("/seances");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setShowDeleteDialog(false);
    }
  };

  // Nouvelle fonction pour sauvegarder la structure
  const handleSaveStructure = async (newStructure) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/seances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          structure: newStructure, 
          updated_at: new Date().toISOString() 
        })
      });
      if (!response.ok) throw new Error("Erreur lors de la sauvegarde de la structure");
      const updatedSeance = await response.json();
      setSeance(updatedSeance.seance || updatedSeance);
      //setStructureEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Blocage navigation interne (optionnel, à ajouter si besoin)

  // UI
  if (loading) return <Layout pageTitle="Détail de la séance"><div className="text-center text-gray-400 py-10">Chargement...</div></Layout>;
  if (error) return <Layout pageTitle="Détail de la séance"><div className="text-center text-red-400 py-10">{error}</div></Layout>;

  // Mode édition ou création
  if (mode === "edit" || mode === "new") {
    return (
      <Layout pageTitle={mode === "edit" ? "Modifier la séance" : "Créer une séance"} backTo="/seances" backLabel="Retour à la liste des séances">
        <div className="w-full flex items-center justify-center px-4 text-white">
          <div className="w-full max-w-4xl space-y-8 mx-auto">
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="bg-black/40 rounded-2xl p-6 border border-gray-700 space-y-6 mt-8">
              {error && <div className="text-red-400 text-center mb-2">{error}</div>}
              <FloatingLabelInput label="Nom" name="nom" value={form.nom} onChange={handleChange} />
              <FloatingLabelInput label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" rows={3} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FloatingLabelInput label="Niveau" name="niveau_id" value={form.niveau_id} onChange={handleChange} as="select">
                  <option value="" className="bg-gray-700 text-gray-400">Sélectionner un niveau</option>
                  {niveaux.map(n => (<option key={n.id} value={n.id} className={'bg-gray-700 text-white'}>{n.nom}</option>))}
                </FloatingLabelInput>
                <FloatingLabelInput label="Catégorie" name="categorie_id" value={form.categorie_id} onChange={handleChange} as="select">
                  <option value="" className="bg-gray-700 text-gray-400">Sélectionner une catégorie</option>
                  {categories.map(c => (<option key={c.id} value={c.id} className="bg-gray-700 text-white">{c.nom}</option>))}
                </FloatingLabelInput>
                <FloatingLabelInput label="Type" name="type_id" value={form.type_id} onChange={handleChange} as="select">
                  <option value="" className="bg-gray-700 text-gray-400">Sélectionner un type</option>
                  {types.map(t => (<option key={t.id} value={t.id} className="bg-gray-700 text-white">{t.nom}</option>))}
                </FloatingLabelInput>
              </div>
              {/* Structure de la séance à compléter selon besoins */}
            </form>
            <FloatingSaveButton
              show={hasChanged}
              onClick={handleSave}
              loading={saving}
              label={mode === "edit" ? "Enregistrer les modifications" : "Créer la séance"}
              className="bg-green-600 hover:bg-green-700"
            />
          </div>
        </div>
      </Layout>
    );
  }

  // Mode détail (lecture seule)
  // Calcul du temps total (arrondi à la minute supérieure)
  const totalSeconds = seance?.structure?.reduce((acc, etape) => acc + estimerDureeEtape(etape), 0) || 0;
  const totalMinutes = Math.ceil(totalSeconds / 60);
  const hasPlayableStructure = Array.isArray(seance?.structure) && seance.structure.length > 0;


  return (
    <Layout
      pageTitle={seance?.nom || "Détail de la séance"}
      backTo="/seances"
      backLabel="Retour à la liste des séances"
      pageActions={[
        hasPlayableStructure && {
          icon: <Play size={20} className="text-green-400" />,
          label: 'Démarrer la séance',
          onClick: () => {
            if (seance) {
              navigate(`/seances/${seance.id}/execution`);
            } else {
              console.warn("Séance non chargée !");
            }
          },
          disabled: !seance
        },
        isCreatorOrAdmin && { icon: <Pencil size={20} className="text-white" />, label: 'Modifier', onClick: () => setMode('edit') },
        isCreatorOrAdmin && { 
          icon: <Layers size={20} className="text-white" />, 
          label: structureEditMode ? 'Terminer l\'édition' : 'Éditer la structure', 
          onClick: () => setStructureEditMode(!structureEditMode) 
        },
        isCreatorOrAdmin && {
          icon: <Trash2 size={20} className="text-red-400" />,
          label: 'Supprimer',
          onClick: () => setShowDeleteDialog(true),
          disabled: !seance
        }
      ].filter(Boolean)}
    >
      <div className="w-full flex justify-center mt-4 px-2 sm:px-4 md:px-12">
        <div className="bg-black/40 border border-gray-700 rounded-2xl shadow-lg w-full max-w-none mx-auto p-4 sm:p-4 md:p-6 xl:px-8 xl:py-6" style={{maxWidth: '1800px'}}>
          {/* Badges arrondis */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Niveau de la séance">
              <BarChart2 size={14} className="inline-block text-gray-300 mr-1" />
              {niveaux.find(n => n.id === Number(seance.niveau_id))?.nom || <span className="italic text-gray-500">Niveau inconnu</span>}
            </span>
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Catégorie de la séance">
              <Tag size={14} className="inline-block text-gray-300 mr-1" />
              {categories.find(c => c.id === Number(seance.categorie_id))?.nom || <span className="italic text-gray-500">Catégorie inconnue</span>}
            </span>
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Type de la séance">
              <Layers size={14} className="inline-block text-gray-300 mr-1" />
              {types.find(t => t.id === Number(seance.type_id))?.nom || <span className="italic text-gray-500">Type inconnu</span>}
            </span>
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Auteur de la séance">
              <User size={14} className="inline-block text-gray-300 mr-1" />
              {seance.auteur_pseudo || <span className="italic text-gray-400">Auteur inconnu</span>}
            </span>
            <span className={
              "rounded-full px-4 py-1 text-xs font-semibold border flex items-center gap-1 " +
              (seance.est_active !== false
                ? "bg-green-900/80 border-green-700 text-green-300"
                : "bg-gray-800/80 border-gray-700 text-gray-400")
            } title={seance.est_active !== false ? "Séance active" : "Séance inactive"}>
              {seance.est_active !== false ? <CheckCircle size={14} className="inline-block text-green-300 mr-1" /> : <XCircle size={14} className="inline-block text-gray-400 mr-1" />}
              {seance.est_active !== false ? "Active" : "Inactive"}
            </span>
            {seance.created_at && (
              <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Date de création">
                <Calendar size={14} className="inline-block text-gray-300 mr-1" />
                {new Date(seance.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
            {seance.updated_at && (
              <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Date de dernière modification">
                <Pencil size={14} className="inline-block text-gray-300 mr-1" />
                {new Date(seance.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2 text-rose-400">{seance.nom}</h2>
          <p className="text-gray-300 italic mb-6 whitespace-pre-line">
            {seance.description || <span className="italic text-gray-500">Aucune description</span>}
          </p>
          {/* Déroulé de la séance */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-orange-300 mb-4 flex items-center gap-4">
              Déroulé de la séance
              <span className="text-xs text-gray-300 bg-black/40 px-3 py-1 rounded-lg border border-gray-700 font-normal">{totalMinutes} min</span>
            </h3>
            
            {structureEditMode ? (
              <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-orange-300">Édition de la structure</h4>
                  <p className="text-gray-400 text-sm">Modifiez la structure de votre séance en ajoutant, supprimant ou réorganisant les exercices et blocs</p>
                </div>
                <EditeurStructureSeance
                  initialStructure={seance.structure || []}
                  onSave={handleSaveStructure}
                  mode="edit"
                  isRoot={true}
                  isSaving={saving}
                />
              </div>
            ) : (
              <>
                {isCreatorOrAdmin && (! seance.structure || seance.structure.length == 0) && (
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-blue-300">
                      <Layers size={16} />
                      <span className="text-sm font-medium">Vous pouvez éditer la structure de cette séance en cliquant sur "Éditer la structure" dans les actions de la page</span>
                    </div>
                  </div>
                )}
                <SeanceStructure structure={seance.structure} hideIcons />
                {/* Affichage côte à côte de la structure brute et du déroulé généré (JSON) */}
                {user?.is_admin && (<div className="flex flex-row gap-4 mt-8">
                  <div style={{width: '50%', height: '100vh'}}>
                    <h4 className="text-md font-semibold text-blue-300 mb-2">Structure brute (JSON)</h4>
                    <pre
                      style={{height: '100vh', width: '100%', overflow: 'auto'}}
                      className="bg-black/60 text-xs text-yellow-200 rounded-lg p-4 border border-gray-700"
                    >
                      {JSON.stringify(seance.structure, null, 2)}
                    </pre>
                  </div>
                  <div style={{width: '50%', height: '100vh'}}>
                    <h4 className="text-md font-semibold text-green-300 mb-2">Déroulé généré (JSON)</h4>
                    <pre
                      style={{height: '100vh', width: '100%', overflow: 'auto'}}
                      className="bg-black/60 text-xs text-green-200 rounded-lg p-4 border border-gray-700"
                    >
                      {JSON.stringify(genererEtapesDepuisStructure(seance.structure, exercices), null, 2)}
                    </pre>
                  </div>
                </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#18191a] border border-gray-700 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-red-400 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-200 mb-6">Voulez-vous vraiment supprimer cette séance ? Cette action est irréversible.</p>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
                onClick={() => setShowDeleteDialog(false)}
                disabled={saving}
              >Annuler</button>
              <button
                className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                onClick={handleDelete}
                disabled={saving}
              >Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
} 