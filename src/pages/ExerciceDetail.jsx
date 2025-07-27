import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import FloatingSaveButton from "../components/ui/FloatingSaveButton";
import NavigationPromptDialog from "../components/ui/NavigationPromptDialog";
import { useBlocker } from "react-router-dom";
import { Pencil, Clock, Target, AlertTriangle, Lightbulb, Users, Calendar, Activity,  X, Trash2, Upload, HelpCircle, Copy } from "lucide-react";
import { useUser } from "../contexts/UserContext";

export default function ExerciceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, ready } = useUser();
  const isNew = !id || id === "new";
  const [mode, setMode] = useState(isNew ? "new" : "detail"); // 'detail' | 'edit' | 'new'
  const [exercice, setExercice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingAndQuit, setSavingAndQuit] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [copied, setCopied] = useState({ json: false, prompt: false });
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Exemple JSON et prompt IA
  const exempleJson = `{
  "nom": "Course sur place",
  "description": "Lève alternativement tes genoux vers ta poitrine en gardant le dos droit.",
  "position_depart": "Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.",
  "categorie_id": 1,
  "groupe_musculaire_id": 1,
  "niveau_id": 1,
  "type_id": 1,
  "materiel": [],
  "erreurs": ["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas tes genoux trop haut"],
  "focus_zone": ["Tu devrais sentir ton cardio monter progressivement", "Concentre-toi sur ta coordination bras-jambes", "Sens tes jambes s'échauffer"],
  "image_url": null,
  "video_url": null,
  "duree_estimee": 3,
  "calories_estimees": 0.5,
  "muscles_sollicites": ["Quadriceps", "Fessiers", "Mollets", "Abdominaux"],
  "variantes": {
    "plus_faciles": ["Si c'est trop difficile, tu peux plier les genoux", "Si tu veux moins d'intensité, réduis l'amplitude"],
    "plus_difficiles": ["Si c'est trop facile, tu peux ajouter un saut", "Si tu veux plus d'intensité, ralentis la descente"]
  },
  "conseils": ["Concentre-toi sur ta respiration régulière", "Garde ton dos bien droit", "Maintiens un rythme constant"]
}`;

  const directives = [
    "Utilise le tutoiement dans toutes les descriptions et conseils.",
    "La description doit être concise (1-2 phrases), sans conseils ni position de départ.",
    "Les conseils, erreurs, focus_zone sont des tableaux de phrases complètes, positives et audio-friendly.",
    "Le champ 'variantes' est un objet avec 'plus_faciles' et 'plus_difficiles', chacun étant un tableau de suggestions.",
    "La durée et les calories sont pour 1 répétition.",
    "Évite les termes techniques complexes, privilégie la clarté et la sécurité.",
    "Tous les textes doivent pouvoir être lus à haute voix.",
    "Respecte le format JSON strict (guillemets, virgules, etc.)."
  ];

  const promptIA = `Génère un objet JSON pour un exercice sportif. Respecte strictement ce format et ces consignes :
- Tutoiement partout
- La description doit décrire le mouvement à réaliser dans l'exercice (après la position de départ)
- Description concise (1-2 phrases), sans conseils ni position de départ
- Conseils, erreurs, focus_zone : tableaux de phrases complètes, positives, audio-friendly
- 'variantes' : objet avec 'plus_faciles' et 'plus_difficiles', chacun tableau de suggestions
- Durée et calories pour 1 répétition
- Tous les textes doivent pouvoir être lus à haute voix
- Remplis tous les champs pertinents
- Réponds uniquement avec le JSON, sans explication
{
  "nom": "<NOM_EXERCICE>",
  "description": "",
  "position_depart": "",
  "categorie_id": 1,
  "groupe_musculaire_id": 1,
  "niveau_id": 1,
  "type_id": 1,
  "materiel": [],
  "erreurs": [],
  "focus_zone": [],
  "image_url": null,
  "video_url": null,
  "duree_estimee": 0,
  "calories_estimees": 0,
  "muscles_sollicites": [],
  "variantes": { "plus_faciles": [], "plus_difficiles": [] },
  "conseils": []
}`;

  // Données de référence
  const [categories, setCategories] = useState([]);
  const [groupesMusculaires, setGroupesMusculaires] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [types, setTypes] = useState([]);

  // Formulaire pour édition/création
  const [form, setForm] = useState({
    nom: '',
    description: '',
    position_depart: '',
    categorie_id: '',
    groupe_musculaire_id: '',
    niveau_id: '',
    type_id: '',
    duree_estimee: '',
    calories_estimees: '',
    muscles_sollicites: '',
    erreurs: '',
    variantes_plus_difficiles: '',
    variantes_plus_faciles: '',
    conseils: '',
    focus_zone: '',
    image_url: '',
    video_url: ''
  });

  // Navigation blocker pour les modifications non sauvegardées
  const hasChanged = JSON.stringify(form) !== JSON.stringify(normalizeFormValues(exercice || {}));
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      // Ne pas bloquer si on est en mode détail
      if (mode === "detail") return false;
      
      // Ne pas bloquer si on reste sur la même page
      if (currentLocation.pathname === nextLocation.pathname) return false;
      
      // Bloquer seulement si il y a des changements
      return hasChanged;
    }
  );

  useEffect(() => {
    chargerDonneesReference();
  }, []);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setExercice(null);
      return;
    }
    setLoading(true);
    fetch(`${apiUrl}/exercices/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Exercice non trouvé");
          }
          throw new Error("Erreur lors du chargement de l'exercice");
        }
        return res.json();
      })
      .then(data => {
        setExercice(data.exercice);
        setForm(normalizeFormValues(data.exercice));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew, apiUrl]);

  const chargerDonneesReference = async () => {
    try {
      const [categoriesRes, groupesRes, niveauxRes, typesRes] = await Promise.all([
        fetch(`${apiUrl}/exercices/categories/list`),
        fetch(`${apiUrl}/exercices/groupes/list`),
        fetch(`${apiUrl}/exercices/niveaux/list`),
        fetch(`${apiUrl}/exercices/types/list`)
      ]);
      
      const categoriesData = await categoriesRes.json();
      const groupesData = await groupesRes.json();
      const niveauxData = await niveauxRes.json();
      const typesData = await typesRes.json();
      
      setCategories(categoriesData.categories || []);
      setGroupesMusculaires(groupesData.groupes || []);
      setNiveaux(niveauxData.niveaux || []);
      setTypes(typesData.types || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
    }
  };

  function normalizeFormValues(exercice) {
    if (!exercice) return {
      nom: '',
      description: '',
      position_depart: '',
      categorie_id: '',
      groupe_musculaire_id: '',
      niveau_id: '',
      type_id: '',
      duree_estimee: '',
      calories_estimees: '',
      muscles_sollicites: '',
      erreurs: '',
      variantes_plus_difficiles: '',
      variantes_plus_faciles: '',
      conseils: '',
      focus_zone: '',
      image_url: '',
      video_url: ''
    };

    return {
      nom: exercice.nom || '',
      description: exercice.description || '',
      position_depart: exercice.position_depart || '',
      categorie_id: exercice.categorie_id || '',
      groupe_musculaire_id: exercice.groupe_musculaire_id || '',
      niveau_id: exercice.niveau_id || '',
      type_id: exercice.type_id || '',
      duree_estimee: exercice.duree_estimee ? String(exercice.duree_estimee) : '',
      calories_estimees: exercice.calories_estimees ? String(exercice.calories_estimees) : '',
      muscles_sollicites: Array.isArray(exercice.muscles_sollicites) ? exercice.muscles_sollicites.join('; ') : '',
      erreurs: Array.isArray(exercice.erreurs) ? exercice.erreurs.join('; ') : '',
      variantes_plus_difficiles: exercice.variantes?.plus_difficiles ? exercice.variantes.plus_difficiles.join('; ') : '',
      variantes_plus_faciles: exercice.variantes?.plus_faciles ? exercice.variantes.plus_faciles.join('; ') : '',
      conseils: Array.isArray(exercice.conseils) ? exercice.conseils.join('; ') : '',
      focus_zone: Array.isArray(exercice.focus_zone) ? exercice.focus_zone.join('; ') : '',
      image_url: exercice.image_url || '',
      video_url: exercice.video_url || ''
    };
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAndQuit = async () => {
    setSavingAndQuit(true);
    try {
      await handleUpdate(form);
      if (blocker) blocker.proceed();
    } finally {
      setSavingAndQuit(false);
    }
  };

  const handleConfirm = () => {
    blocker.proceed();
  };

  const handleCancel = () => {
    blocker.reset();
  };

  useEffect(() => {
    if (!hasChanged) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanged]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setFormError("");
    
    if (!form.nom || !form.description) {
      setFormError("Le nom et la description sont obligatoires.");
      return;
    }
    
    if (form.calories_estimees && parseFloat(form.calories_estimees) < 0) {
      setFormError("Les calories estimées doivent être un nombre positif.");
      return;
    }
    
    handleUpdate(form);
  };

  const handleUpdate = async (formData) => {
    try {
      setSaving(true);
      setFormError("");

      // Préparer les données
      const exerciceData = {
        nom: formData.nom,
        description: formData.description,
        position_depart: formData.position_depart,
        categorie_id: formData.categorie_id ? parseInt(formData.categorie_id, 10) : null,
        groupe_musculaire_id: formData.groupe_musculaire_id ? parseInt(formData.groupe_musculaire_id, 10) : null,
        niveau_id: formData.niveau_id ? parseInt(formData.niveau_id, 10) : null,
        type_id: formData.type_id ? parseInt(formData.type_id, 10) : null,
        duree_estimee: formData.duree_estimee ? parseFloat(String(formData.duree_estimee).replace(',', '.')) : null,
        calories_estimees: formData.calories_estimees ? parseFloat(String(formData.calories_estimees).replace(',', '.')) : null,
        muscles_sollicites: formData.muscles_sollicites.split(';').map(s => s.trim()).filter(s => s),
        erreurs: formData.erreurs.split(';').map(s => s.trim()).filter(s => s),
        variantes: {
          plus_difficiles: formData.variantes_plus_difficiles.split(';').map(s => s.trim()).filter(s => s),
          plus_faciles: formData.variantes_plus_faciles.split(';').map(s => s.trim()).filter(s => s)
        },
        conseils: formData.conseils.split(';').map(s => s.trim()).filter(s => s),
        focus_zone: formData.focus_zone.split(';').map(s => s.trim()).filter(s => s),
        image_url: formData.image_url || null,
        video_url: formData.video_url || null,
        materiel: []
      };

      if (mode === "edit" && id && id !== "new") {
        // Mise à jour
        const response = await fetch(`${apiUrl}/exercices/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(exerciceData)
        });
        if (!response.ok) throw new Error("Erreur lors de la mise à jour");
        const data = await response.json();
        setMode("detail");
        // Recharger l'exercice
        fetch(`${apiUrl}/exercices/${id}`)
          .then(res => res.json())
          .then(data => {
            setExercice(data.exercice);
            setForm(normalizeFormValues(data.exercice));
          });
      } else {
        // Création
        // Générer l'id à partir du nom
        let generatedId = formData.nom
          .toLowerCase()
          .normalize('NFD').replace(/\p{Diacritic}/gu, '')
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
        if (!generatedId) generatedId = 'exercice_' + Date.now();
        
        exerciceData.id = generatedId;
        exerciceData.created_by = user?.id;

        const response = await fetch(`${apiUrl}/exercices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(exerciceData)
        });
        if (!response.ok) throw new Error("Erreur lors de la création");
        const data = await response.json();
        const newId = data.exercice?.id || generatedId;
        navigate(`/exercices/${newId}`, { replace: true });
        setMode("detail");
        // Recharger l'exercice
        fetch(`${apiUrl}/exercices/${newId}`)
          .then(res => res.json())
          .then(data => {
            setExercice(data.exercice);
            setForm(normalizeFormValues(data.exercice));
          });
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${apiUrl}/exercices/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      navigate('/exercices');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 1500);
  };

  const handleImportJson = () => {
    try {
      const data = JSON.parse(importJsonText);
      setForm({
        nom: data.nom || '',
        description: data.description || '',
        position_depart: data.position_depart || '',
        categorie_id: data.categorie_id || '',
        groupe_musculaire_id: data.groupe_musculaire_id || '',
        niveau_id: data.niveau_id || '',
        type_id: data.type_id || '',
        duree_estimee: data.duree_estimee ? String(data.duree_estimee) : '',
        calories_estimees: data.calories_estimees ? String(data.calories_estimees) : '',
        muscles_sollicites: Array.isArray(data.muscles_sollicites) ? data.muscles_sollicites.join('; ') : '',
        erreurs: Array.isArray(data.erreurs) ? data.erreurs.join('; ') : '',
        variantes_plus_difficiles: data.variantes?.plus_difficiles ? data.variantes.plus_difficiles.join('; ') : '',
        variantes_plus_faciles: data.variantes?.plus_faciles ? data.variantes.plus_faciles.join('; ') : '',
        conseils: Array.isArray(data.conseils) ? data.conseils.join('; ') : '',
        focus_zone: Array.isArray(data.focus_zone) ? data.focus_zone.join('; ') : '',
        image_url: data.image_url || '',
        video_url: data.video_url || ''
      });
      setShowImportDialog(false);
      setImportError('');
    } catch (error) {
      setImportError('Erreur de format JSON. Vérifiez la syntaxe.');
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportJsonText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const getNiveauColor = (niveau) => {
    switch (niveau?.toLowerCase()) {
      case 'facile': return 'bg-green-500';
      case 'intermédiaire': return 'bg-yellow-500';
      case 'difficile': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategorieIcon = (categorie) => {
    switch (categorie?.toLowerCase()) {
      case 'échauffement': return '🔥';
      case 'renforcement': return '💪';
      case 'cardio': return '❤️';
      case 'étirement': return '🧘';
      case 'gainage': return '🛡️';
      case 'mobilité': return '🔄';
      case 'récupération active': return '🌿';
      default: return '🏋️';
    }
  };

  const formatDuree = (secondes) => {
    if (!secondes || secondes === 0) return 'Non spécifiée';
    const minutes = Math.floor(secondes / 60);
    const secs = secondes % 60;
    if (minutes > 0) {
      return `${minutes}min${secs > 0 ? ` ${secs}s` : ''}`;
    }
    return `${secs}s`;
  };

  if (loading) {
    return (
      <Layout pageTitle="Chargement...">
        <div className="w-full flex flex-col items-center bg-[#18191a] min-h-screen">
          <div className="text-center text-gray-400 py-12 animate-pulse">
            <div className="h-6 bg-[#232526] rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-[#232526] rounded w-2/3 mx-auto mb-2"></div>
            <div className="h-4 bg-[#232526] rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout pageTitle="Erreur">
        <div className="w-full flex flex-col items-center bg-[#18191a] min-h-screen">
          <div className="text-center text-red-400 py-12">
            <div className="text-xl font-semibold mb-4">Erreur</div>
            <div>{error}</div>
            <button
              onClick={() => navigate('/exercices')}
              className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
            >
              Retour aux exercices
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Mode formulaire (création ou édition)
  if (mode === "new" || mode === "edit") {
    const pageTitle = mode === "new" ? "Nouvel exercice" : `Modifier ${exercice?.nom || 'l\'exercice'}`;
    const pageActions = [
      { icon: <Upload size={20} />, label: 'Importer JSON', onClick: () => setShowImportDialog(true) }
    ];

    return (
      <Layout pageTitle={pageTitle} pageActions={pageActions} backTo="/exercices" backLabel="Retour aux exercices">
        <div className="w-full flex flex-col items-center bg-[#18191a] min-h-screen">
          <div className="w-full max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                  {formError}
                </div>
              )}

              {/* Informations de base */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Informations de base</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingLabelInput
                    label="Nom *"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                  />
                  <FloatingLabelInput
                    label="Description *"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    as="textarea"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Catégorisation */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Catégorisation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
                    <select
                      name="categorie_id"
                      value={form.categorie_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#2a2a2a] text-gray-100 border border-[#232526] rounded-lg focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Groupe musculaire</label>
                    <select
                      name="groupe_musculaire_id"
                      value={form.groupe_musculaire_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#2a2a2a] text-gray-100 border border-[#232526] rounded-lg focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Sélectionner un groupe</option>
                      {groupesMusculaires.map(groupe => (
                        <option key={groupe.id} value={groupe.id}>{groupe.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Niveau</label>
                    <select
                      name="niveau_id"
                      value={form.niveau_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#2a2a2a] text-gray-100 border border-[#232526] rounded-lg focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Sélectionner un niveau</option>
                      {niveaux.map(niveau => (
                        <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      name="type_id"
                      value={form.type_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#2a2a2a] text-gray-100 border border-[#232526] rounded-lg focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="">Sélectionner un type</option>
                      {types.map(type => (
                        <option key={type.id} value={type.id}>{type.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Détails techniques */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Détails techniques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingLabelInput
                    label="Position de départ"
                    name="position_depart"
                    value={form.position_depart}
                    onChange={handleChange}
                    as="textarea"
                    rows={3}
                  />
                  <div className="space-y-4">
                    <FloatingLabelInput
                      label="Durée estimée (secondes)"
                      name="duree_estimee"
                      value={form.duree_estimee}
                      onChange={handleChange}
                      type="number"
                    />
                    <FloatingLabelInput
                      label="Calories estimées"
                      name="calories_estimees"
                      value={form.calories_estimees}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Informations détaillées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FloatingLabelInput
                      label="Muscles sollicités (séparés par ;)"
                      name="muscles_sollicites"
                      value={form.muscles_sollicites}
                      onChange={handleChange}
                      as="textarea"
                      rows={3}
                    />
                    <FloatingLabelInput
                      label="Zones à focus (séparées par ;)"
                      name="focus_zone"
                      value={form.focus_zone}
                      onChange={handleChange}
                      as="textarea"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-4">
                    <FloatingLabelInput
                      label="Erreurs fréquentes (séparées par ;)"
                      name="erreurs"
                      value={form.erreurs}
                      onChange={handleChange}
                      as="textarea"
                      rows={3}
                    />
                    <FloatingLabelInput
                      label="Conseils (séparés par ;)"
                      name="conseils"
                      value={form.conseils}
                      onChange={handleChange}
                      as="textarea"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Variantes */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Variantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingLabelInput
                    label="Variantes plus faciles (séparées par ;)"
                    name="variantes_plus_faciles"
                    value={form.variantes_plus_faciles}
                    onChange={handleChange}
                    as="textarea"
                    rows={3}
                  />
                  <FloatingLabelInput
                    label="Variantes plus difficiles (séparées par ;)"
                    name="variantes_plus_difficiles"
                    value={form.variantes_plus_difficiles}
                    onChange={handleChange}
                    as="textarea"
                    rows={3}
                  />
                </div>
              </div>

              {/* Médias */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Médias</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingLabelInput
                    label="URL de l'image"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    type="url"
                  />
                  <FloatingLabelInput
                    label="URL de la vidéo"
                    name="video_url"
                    value={form.video_url}
                    onChange={handleChange}
                    type="url"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <FloatingSaveButton
          show={mode !== "detail" && hasChanged}
          onClick={handleSubmit}
          loading={saving}
          disabled={saving}
        />
        {blocker && (
          <NavigationPromptDialog
            isOpen={blocker.state === "blocked"}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onSaveAndQuit={handleSaveAndQuit}
            saving={savingAndQuit}
          />
        )}

        {/* Dialog Import JSON */}
        {showImportDialog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={e => {
              if (e.target === e.currentTarget) {
                setShowImportDialog(false); setImportError('');
              }
            }}
          >
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg border border-gray-700 relative" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => { setShowImportDialog(false); setImportError(''); }}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
              <h2 className="text-lg font-bold text-white mb-4">Importer un exercice au format JSON</h2>
              <textarea
                className="w-full h-32 p-2 bg-gray-800 border border-gray-600 rounded mb-2 text-white"
                placeholder="Collez ici le texte JSON..."
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
              />
              <div className="flex items-center gap-2 mb-2">
                <input type="file" accept="application/json,.json,.txt" onChange={handleImportFile} className="text-white" />
                <span className="text-xs text-gray-400">ou choisir un fichier</span>
              </div>
              {importError && <div className="text-red-400 mb-2">{importError}</div>}
              <div className="flex justify-between gap-2 mt-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                  onClick={() => setShowHelpDialog(true)}
                  type="button"
                >
                  <HelpCircle size={18} /> Aide modèle JSON
                </button>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                    onClick={() => { setShowImportDialog(false); setImportError(''); }}
                  >Annuler</button>
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                    onClick={handleImportJson}
                  >Importer</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dialog Aide JSON */}
        {showHelpDialog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={e => {
              if (e.target === e.currentTarget) setShowHelpDialog(false);
            }}
          >
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl border border-gray-700 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setShowHelpDialog(false)}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
              <h2 className="text-lg font-bold text-white mb-4">Modèle JSON & Directives</h2>
              <div className="mb-4 relative">
                <h3 className="text-md font-semibold text-orange-300 mb-2">Exemple de modèle JSON</h3>
                <button
                  className="absolute top-0 right-0 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                  onClick={() => handleCopy(exempleJson, 'json')}
                  type="button"
                >
                  <Copy size={14} /> {copied.json ? 'Copié !' : 'Copier'}
                </button>
                <pre className="bg-black/70 text-white text-xs rounded p-3 overflow-x-auto mt-6">
                  {exempleJson}
                </pre>
              </div>
              <div>
                <h3 className="text-md font-semibold text-orange-300 mb-2">Directives importantes</h3>
                <ul className="list-disc pl-6 text-gray-200 text-sm space-y-1">
                  {directives.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 relative">
                <h3 className="text-md font-semibold text-orange-300 mb-2">Prompt IA prêt à l'emploi</h3>
                <button
                  className="absolute top-0 right-0 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                  onClick={() => handleCopy(promptIA, 'prompt')}
                  type="button"
                >
                  <Copy size={14} /> {copied.prompt ? 'Copié !' : 'Copier'}
                </button>
                <pre className="bg-black/70 text-white text-xs rounded p-3 overflow-x-auto whitespace-pre-line mt-6">
{promptIA}
                </pre>
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  // Mode affichage (détail)
  if (!exercice) {
    return (
      <Layout pageTitle="Exercice non trouvé">
        <div className="w-full flex flex-col items-center bg-[#18191a] min-h-screen">
          <div className="text-center text-gray-400 py-12">
            <div className="text-xl font-semibold mb-4">Exercice non trouvé</div>
            <button
              onClick={() => navigate('/exercices')}
              className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
            >
              Retour aux exercices
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const pageActions = {...((user && (user.is_admin || exercice.created_by === user.id)) ? {
    pageActions: [
      { icon: <Pencil size={20} className="text-white" />, label: 'Modifier', onClick: () => setMode('edit') },
      { icon: <Trash2 size={20} className="text-red-400" />, label: 'Supprimer', onClick: () => setShowDeleteDialog(true), disabled: saving }
    ]
  } : {})}

  return (
    <Layout 
      pageTitle={exercice.nom} 
      pageActions={pageActions}
      backTo="/exercices"
      backLabel="Retour à la liste des exercices"
    >
      <div className="w-full flex flex-col items-center bg-[#18191a] min-h-screen">
        <div className="w-full max-w-4xl mx-auto p-4">
          {/* En-tête de l'exercice */}
          <div className="bg-[#222] rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl bg-[#232526] rounded-lg p-4 flex-shrink-0">
                {getCategorieIcon(exercice.categorie_nom)}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-orange-100 mb-2">{exercice.nom}</h1>
                {exercice.description && (
                  <p className="text-gray-300 mb-4">{exercice.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {exercice.categorie_nom && (
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {exercice.categorie_nom}
                    </span>
                  )}
                  {exercice.groupe_musculaire_nom && (
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                      {exercice.groupe_musculaire_nom}
                    </span>
                  )}
                  {exercice.niveau_nom && (
                    <span className={`text-white px-3 py-1 rounded-full text-sm font-medium ${getNiveauColor(exercice.niveau_nom)}`}>
                      {exercice.niveau_nom}
                    </span>
                  )}
                  {exercice.type_nom && (
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                      {exercice.type_nom}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {exercice.duree_estimee && (
              <div className="bg-[#222] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} className="text-orange-400" />
                  <span className="font-semibold text-orange-100">Durée estimée</span>
                </div>
                <p className="text-gray-300">{formatDuree(exercice.duree_estimee)}</p>
              </div>
            )}
            
            {exercice.calories_estimees && (
              <div className="bg-[#222] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={20} className="text-orange-400" />
                  <span className="font-semibold text-orange-100">Calories estimées</span>
                </div>
                <p className="text-gray-300">{exercice.calories_estimees} cal</p>
              </div>
            )}

            {exercice.created_by && (
              <div className="bg-[#222] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className="text-orange-400" />
                  <span className="font-semibold text-orange-100">Créé par</span>
                </div>
                <p className="text-gray-300">{exercice.created_by}</p>
              </div>
            )}
          </div>

          {/* Contenu détaillé */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-6">
              {exercice.position_depart && (
                <div className="bg-[#222] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3">Position de départ</h3>
                  <p className="text-gray-300 whitespace-pre-line">{exercice.position_depart}</p>
                </div>
              )}

              {exercice.muscles_sollicites && Array.isArray(exercice.muscles_sollicites) && exercice.muscles_sollicites.length > 0 && (
                <div className="bg-[#222] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3">Muscles sollicités</h3>
                  <ul className="space-y-1">
                    {exercice.muscles_sollicites.map((muscle, index) => (
                      <li key={index} className="text-gray-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        {muscle}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exercice.erreurs && Array.isArray(exercice.erreurs) && exercice.erreurs.length > 0 && (
                <div className="bg-[#222] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-400" />
                    Erreurs fréquentes
                  </h3>
                  <ul className="space-y-2">
                    {exercice.erreurs.map((erreur, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{erreur}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Colonne droite */}
            <div className="space-y-6">
              {exercice.focus_zone && Array.isArray(exercice.focus_zone) && exercice.focus_zone.length > 0 && (
                <div className="bg-[#222] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3">Zones à focus</h3>
                  <ul className="space-y-1">
                    {exercice.focus_zone.map((zone, index) => (
                      <li key={index} className="text-gray-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        {zone}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exercice.conseils && Array.isArray(exercice.conseils) && exercice.conseils.length > 0 && (
                <div className="bg-[#222] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3 flex items-center gap-2">
                    <Lightbulb size={20} className="text-yellow-400" />
                    Conseils
                  </h3>
                  <ul className="space-y-2">
                    {exercice.conseils.map((conseil, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{conseil}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exercice.variantes && exercice.variantes.plus_faciles && Array.isArray(exercice.variantes.plus_faciles) && exercice.variantes.plus_faciles.length > 0 && (
                <div className="bg-[#222] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3">Variantes plus faciles</h3>
                  <ul className="space-y-1">
                    {exercice.variantes.plus_faciles.map((variante, index) => (
                      <li key={index} className="text-gray-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {variante}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exercice.variantes && exercice.variantes.plus_difficiles && Array.isArray(exercice.variantes.plus_difficiles) && exercice.variantes.plus_difficiles.length > 0 && (
                <div className="bg-[#222] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3">Variantes plus difficiles</h3>
                  <ul className="space-y-1">
                    {exercice.variantes.plus_difficiles.map((variante, index) => (
                      <li key={index} className="text-gray-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        {variante}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Médias */}
          {(exercice.image_url || exercice.video_url) && (
            <div className="mt-6 bg-[#222] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-100 mb-4">Médias</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercice.image_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Image</h4>
                    <img 
                      src={exercice.image_url} 
                      alt={exercice.nom} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                {exercice.video_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Vidéo</h4>
                    <a 
                      href={exercice.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                    >
                      <Activity size={16} />
                      Voir la vidéo
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Métadonnées */}
          <div className="mt-6 bg-[#222] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Informations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {exercice.created_at && (
                <div>
                  <span className="text-gray-400">Créé le :</span>
                  <span className="text-gray-300 ml-2">
                    {new Date(exercice.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              {exercice.updated_at && (
                <div>
                  <span className="text-gray-400">Modifié le :</span>
                  <span className="text-gray-300 ml-2">
                    {new Date(exercice.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              {exercice.is_validated !== undefined && (
                <div>
                  <span className="text-gray-400">Statut :</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    exercice.is_validated 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {exercice.is_validated ? 'Validé' : 'En attente de validation'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de confirmation de suppression */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#222] border border-[#232526] rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-orange-100 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer l'exercice "{exercice.nom}" ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition"
                disabled={saving}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
} 