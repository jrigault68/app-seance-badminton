import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import FloatingSaveButton from "../components/ui/FloatingSaveButton";
import NavigationPromptDialog from "../components/ui/NavigationPromptDialog";
import Snackbar from "../components/Snackbar";
import ExerciceSelector from "../components/ui/ExerciceSelector";
import FamilleSelector from "../components/ui/FamilleSelector";
import DifficultyHelpDialog from "../components/ui/DifficultyHelpDialog";
import ImportAIDialog, { ImportAIDialogTriggerIcon } from "../components/ui/ImportAIDialog";
import { useSafeBlocker } from "../utils/useBlocker";
import { getActiveAIService, isAnyProviderConfigured } from "../services/aiService";
import { getPromptExerciceTemplate } from "../utils/aiPrompts.js";
import { Pencil, Clock, Target, AlertTriangle, Lightbulb, Users, Calendar, Activity, X, Trash2, HelpCircle, Copy, Tag, BarChart2, Layers, User, CheckCircle, XCircle, Folder, ArrowUp, ArrowDown, Link, Dumbbell, Heart, Zap, Move, Shield, Brain, Edit, ArrowLeft } from "lucide-react";
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
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [showDifficultyHelpDialog, setShowDifficultyHelpDialog] = useState(false);
  const [currentDifficultyType, setCurrentDifficultyType] = useState(null);
  const [pendingMode, setPendingMode] = useState(null);
  
  // États pour les sélecteurs
  const [showExercicePlusDurSelector, setShowExercicePlusDurSelector] = useState(false);
  const [showExercicePlusFacileSelector, setShowExercicePlusFacileSelector] = useState(false);
  const [showExercicesSimilairesSelector, setShowExercicesSimilairesSelector] = useState(false);
  
  // États pour les snackbars
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const [copied, setCopied] = useState({ json: false, prompt: false });
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Exemple JSON et prompt IA
  const exempleJson = `{
  "nom": "Course sur place",
  "description": "Lève alternativement tes genoux vers ta poitrine en gardant le dos droit.",
  "position_depart": "Debout, les pieds écartés de la largeur des hanches.",
  "categorie_id": 1,
  "groupe_musculaire_id": 1,
  "note_force": 3,
  "note_cardio": 8,
  "note_technique": 2,
  "note_mobilite": 4,
  "note_impact": 1,
  "note_mentale": 2,
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
    "Les notes de difficulté sont des valeurs entre 0 et 20 pour chaque aspect (force, cardio, technique, mobilité, impact, mentale).",
    "La durée et les calories sont pour 1 répétition.",
    "Évite les termes techniques complexes, privilégie la clarté et la sécurité.",
    "Tous les textes doivent pouvoir être lus à haute voix.",
    "Respecte le format JSON strict (guillemets, virgules, etc.).",
    "Les anciens champs (niveau_id, type_id) sont ignorés automatiquement."
  ];

  const promptIA = `Génère un objet JSON pour un exercice sportif. Respecte strictement ce format et ces consignes :
- Tutoiement partout
- La description doit décrire le mouvement à réaliser dans l'exercice (après la position de départ)
- Description concise (1-2 phrases), sans conseils ni position de départ
- Conseils, erreurs, focus_zone : tableaux de phrases complètes, positives, audio-friendly
- 'variantes' : objet avec 'plus_faciles' et 'plus_difficiles', chacun tableau de suggestions
- Notes de difficulté : valeurs entre 0 et 20 pour chaque aspect (force, cardio, technique, mobilité, impact, mentale)
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
  "note_force": 0,
  "note_cardio": 0,
  "note_technique": 0,
  "note_mobilite": 0,
  "note_impact": 0,
  "note_mentale": 0,
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
  const [types, setTypes] = useState([]);
  const [familles, setFamilles] = useState([]);

  // Formulaire pour édition/création
  const [form, setForm] = useState({
    nom: '',
    description: '',
    position_depart: '',
    categorie_id: '',
    groupe_musculaire_id: '',
    type_id: '',
    famille_id: '',
    famille_nom: '',
    exercice_plus_dur_id: '',
    exercice_plus_dur_nom: '',
    exercice_plus_facile_id: '',
    exercice_plus_facile_nom: '',
    exercices_similaires: [],
    exercices_similaires_noms: [],
    // Notes de difficulté (0-20)
    note_force: 0,
    note_cardio: 0,
    note_technique: 0,
    note_mobilite: 0,
    note_impact: 0,
    note_mentale: 0,
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
  const blocker = useSafeBlocker(
    ({ currentLocation, nextLocation }) => {
      if (mode === "detail") return false;
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
      const [categoriesRes, groupesRes, famillesRes] = await Promise.all([
        fetch(`${apiUrl}/exercices/categories/list`).catch(() => ({ json: () => ({ categories: [] }) })),
        fetch(`${apiUrl}/exercices/groupes/list`).catch(() => ({ json: () => ({ groupes: [] }) })),
        fetch(`${apiUrl}/familles-exercices?limit=100`).catch(() => ({ json: () => ({ familles: [] }) }))
      ]);
      
      const categoriesData = await categoriesRes.json();
      const groupesData = await groupesRes.json();
      const famillesData = await famillesRes.json();
      
      setCategories(categoriesData.categories || []);
      setGroupesMusculaires(groupesData.groupes || []);
      setTypes([]); // Les types ne sont plus utilisés dans le nouveau système
      setFamilles(famillesData.familles || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
      setCategories([]);
      setGroupesMusculaires([]);
      setTypes([]);
      setFamilles([]);
    }
  };

  function normalizeFormValues(exercice) {
    if (!exercice) return {
      nom: '',
      description: '',
      position_depart: '',
      categorie_id: '',
      groupe_musculaire_id: '',
      type_id: '',
      famille_id: '',
      famille_nom: '',
      exercice_plus_dur_id: '',
      exercice_plus_dur_nom: '',
      exercice_plus_facile_id: '',
      exercice_plus_facile_nom: '',
      exercices_similaires: [],
      exercices_similaires_noms: [],
      // Notes de difficulté (0-20)
      note_force: 0,
      note_cardio: 0,
      note_technique: 0,
      note_mobilite: 0,
      note_impact: 0,
      note_mentale: 0,
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
      type_id: exercice.type_id || '',
      famille_id: exercice.famille_id || '',
      famille_nom: exercice.famille_nom || '',
      exercice_plus_dur_id: exercice.exercice_plus_dur_id || '',
      exercice_plus_dur_nom: exercice.exercice_plus_dur_nom || '',
      exercice_plus_facile_id: exercice.exercice_plus_facile_id || '',
      exercice_plus_facile_nom: exercice.exercice_plus_facile_nom || '',
      exercices_similaires: Array.isArray(exercice.exercices_similaires) ? exercice.exercices_similaires : [],
      exercices_similaires_noms: Array.isArray(exercice.exercices_similaires_noms) ? exercice.exercices_similaires_noms : [],
      // Notes de difficulté (0-20)
      note_force: exercice.note_force || 0,
      note_cardio: exercice.note_cardio || 0,
      note_technique: exercice.note_technique || 0,
      note_mobilite: exercice.note_mobilite || 0,
      note_impact: exercice.note_impact || 0,
      note_mentale: exercice.note_mentale || 0,
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
    
    // Gestion spéciale pour les notes de difficulté (doivent être des nombres)
    if (name.startsWith('note_')) {
      const numValue = parseInt(value) || 0;
      setForm(prev => ({
        ...prev,
        [name]: Math.max(0, Math.min(20, numValue)) // Limite entre 0 et 20
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handlers pour les sélecteurs
  const handleExercicePlusDurSelect = (exercice) => {
    console.log('🔍 handleExercicePlusDurSelect called with:', exercice);
    setForm(prev => ({
      ...prev,
      exercice_plus_dur_id: exercice.id,
      exercice_plus_dur_nom: exercice.nom
    }));
  };

  const handleExercicePlusFacileSelect = (exercice) => {
    setForm(prev => ({
      ...prev,
      exercice_plus_facile_id: exercice.id,
      exercice_plus_facile_nom: exercice.nom
    }));
  };

  const handleExercicesSimilairesSelect = (exercices) => {
    setForm(prev => ({
      ...prev,
      exercices_similaires: exercices.map(e => e.id),
      exercices_similaires_noms: exercices.map(e => e.nom)
    }));
  };

  const clearExercicePlusDur = () => {
    setForm(prev => ({
      ...prev,
      exercice_plus_dur_id: '',
      exercice_plus_dur_nom: ''
    }));
  };

  const clearExercicePlusFacile = () => {
    setForm(prev => ({
      ...prev,
      exercice_plus_facile_id: '',
      exercice_plus_facile_nom: ''
    }));
  };

  const clearExercicesSimilaires = () => {
    setForm(prev => ({
      ...prev,
      exercices_similaires: [],
      exercices_similaires_noms: []
    }));
  };

  const handleSaveAndQuit = async () => {
    setSavingAndQuit(true);
    try {
      await handleUpdate(form);
      if (blocker && blocker.state === "blocked") blocker.proceed();
      if(pendingMode && pendingMode !== mode) {
        setMode(pendingMode);
        setPendingMode(null);
      }
    } finally {
      setSavingAndQuit(false);
      setShowNavigationDialog(false);
    }
  };

  const handleConfirm = () => {
    if (blocker && blocker.state === "blocked") blocker.proceed();
    if(pendingMode && pendingMode !== mode) {
      setMode(pendingMode);
      setPendingMode(null);
    }
    setShowNavigationDialog(false);
  };

  const handleCancel = () => {
    if (blocker && blocker.state === "blocked") blocker.reset();
    setPendingMode(null);
    setShowNavigationDialog(false);
  };

  // Handler pour le bouton retour avec vérification des modifications
  const handleBackClick = () => {
    console.log("🔍 handleBackClick called:", { hasChanged, mode, showNavigationDialog });
    if (hasChanged) {
      // Si il y a des modifications, montrer le dialog
      setPendingMode("detail");
      console.log("mode", mode);
      setShowNavigationDialog(true);
    } else {
      // Sinon, changer le mode directement
      setMode("detail");
    }
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
         type_id: formData.type_id ? parseInt(formData.type_id, 10) : null,
         famille_id: formData.famille_id || null,
         exercice_plus_dur_id: formData.exercice_plus_dur_id || null,
         exercice_plus_facile_id: formData.exercice_plus_facile_id || null,
         exercices_similaires: formData.exercices_similaires || [],
         // Notes de difficulté (0-20)
         note_force: parseInt(formData.note_force) || 0,
         note_cardio: parseInt(formData.note_cardio) || 0,
         note_technique: parseInt(formData.note_technique) || 0,
         note_mobilite: parseInt(formData.note_mobilite) || 0,
         note_impact: parseInt(formData.note_impact) || 0,
         note_mentale: parseInt(formData.note_mentale) || 0,
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
         materiel: [],
         zones_specifiques_ids: [] // Ajout du champ manquant avec une valeur par défaut vide
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

        // Afficher le message de succès
        setSnackbarType("success");
        setSnackbarMessage("Exercice mis à jour avec succès !");

        // Recharger l'exercice
        fetch(`${apiUrl}/exercices/${id}`)
          .then(res => res.json())
          .then(data => {
            setExercice(data.exercice);
            //setForm(normalizeFormValues(data.exercice));
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
        
        // Afficher le message de succès
        setSnackbarType("success");
        setSnackbarMessage("Exercice créé avec succès !");
        
        navigate(`/exercices/${newId}`, { replace: true });
        console.log("set mode detail2");
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
      // Afficher le message d'erreur
      setSnackbarType("error");
      setSnackbarMessage(err.message);
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
      
      // Afficher le message de succès
      setSnackbarType("success");
      setSnackbarMessage("Exercice supprimé avec succès !");
      
      navigate('/exercices');
    } catch (err) {
      setFormError(err.message);
      // Afficher le message d'erreur
      setSnackbarType("error");
      setSnackbarMessage(err.message);
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

  const cleanData = (value, defaultValue = '') => {
    if (value === null || value === undefined) return defaultValue;
    return value;
  };

  const arrayToString = (arr) => {
    if (!Array.isArray(arr)) return '';
    return arr.filter(item => item && typeof item === 'string').join('; ');
  };

  const applyExerciceJson = async (jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      setForm({
        nom: cleanData(data.nom),
        description: cleanData(data.description),
        position_depart: cleanData(data.position_depart),
        categorie_id: cleanData(data.categorie_id),
        groupe_musculaire_id: cleanData(data.groupe_musculaire_id),
        type_id: cleanData(data.type_id),
        famille_id: cleanData(data.famille_id),
        famille_nom: cleanData(data.famille_nom),
        note_force: cleanData(data.note_force, 0),
        note_cardio: cleanData(data.note_cardio, 0),
        note_technique: cleanData(data.note_technique, 0),
        note_mobilite: cleanData(data.note_mobilite, 0),
        note_impact: cleanData(data.note_impact, 0),
        note_mentale: cleanData(data.note_mentale, 0),
        duree_estimee: cleanData(data.duree_estimee) ? String(data.duree_estimee) : '',
        calories_estimees: cleanData(data.calories_estimees) ? String(data.calories_estimees) : '',
        muscles_sollicites: arrayToString(data.muscles_sollicites),
        erreurs: arrayToString(data.erreurs),
        conseils: arrayToString(data.conseils),
        focus_zone: arrayToString(data.focus_zone),
        variantes_plus_difficiles: data.variantes?.plus_difficiles ? arrayToString(data.variantes.plus_difficiles) : arrayToString(data.variantes_plus_difficiles),
        variantes_plus_faciles: data.variantes?.plus_faciles ? arrayToString(data.variantes.plus_faciles) : arrayToString(data.variantes_plus_faciles),
        image_url: cleanData(data.image_url),
        video_url: cleanData(data.video_url),
        exercice_plus_dur_id: cleanData(data.exercice_plus_dur_id),
        exercice_plus_dur_nom: cleanData(data.exercice_plus_dur_nom),
        exercice_plus_facile_id: cleanData(data.exercice_plus_facile_id),
        exercice_plus_facile_nom: cleanData(data.exercice_plus_facile_nom),
        exercices_similaires: Array.isArray(data.exercices_similaires) ? data.exercices_similaires : [],
        exercices_similaires_noms: Array.isArray(data.exercices_similaires_noms) ? data.exercices_similaires_noms : []
      });
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de l\'import JSON:', err);
      return { success: false, error: `Erreur de format JSON: ${err.message}` };
    }
  };

  const buildFullPromptForExercice = (userPrompt) => {
    return `${getPromptExerciceTemplate()}

Description de l'exercice demandé :
${userPrompt}

Réponds uniquement avec le JSON, sans explication.`;
  };

  const generateExerciceWithAI = async (prompt) => {
    const aiService = await getActiveAIService();
    if (!aiService) return null;
    return await aiService.generateExercice(prompt);
  };

  const handleDifficultyHelp = (difficultyType) => {
    setCurrentDifficultyType(difficultyType);
    setShowDifficultyHelpDialog(true);
  };

  const handleNoteSelect = (note) => {
    const noteField = `note_${currentDifficultyType}`;
    setForm(prev => ({
      ...prev,
      [noteField]: note
    }));
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
      { icon: <ImportAIDialogTriggerIcon />, label: "Générer un exercice avec l'IA", onClick: () => setShowImportDialog(true) }
    ];

    return (
          <Layout 
      pageTitle={pageTitle} 
      pageActions={pageActions} 
      backTo="/exercices" 
      backLabel="Retour aux exercices"
      onBackClick={handleBackClick}
    >
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
                <div className="flex flex-col gap-4">
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
                  <FloatingLabelInput
                    label="Position de départ"
                    name="position_depart"
                    value={form.position_depart}
                    onChange={handleChange}
                    as="textarea"
                    rows={3}
                  />
                </div>
              </div>

              {/* Catégorisation */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Catégorisation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FloatingLabelInput
                    label="Catégorie"
                    name="categorie_id"
                    value={form.categorie_id}
                    onChange={handleChange}
                    as="select"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </FloatingLabelInput>
                  <FloatingLabelInput
                    label="Groupe musculaire"
                    name="groupe_musculaire_id"
                    value={form.groupe_musculaire_id}
                    onChange={handleChange}
                    as="select"
                  >
                    <option value="">Sélectionner un groupe</option>
                    {groupesMusculaires.map(groupe => (
                      <option key={groupe.id} value={groupe.id}>{groupe.nom}</option>
                    ))}
                  </FloatingLabelInput>
                  
                  <FloatingLabelInput
                    label="Type"
                    name="type_id"
                    value={form.type_id}
                    onChange={handleChange}
                    as="select"
                  >
                    <option value="">Sélectionner un type</option>
                    {types.map(type => (
                      <option key={type.id} value={type.id}>{type.nom}</option>
                    ))}
                  </FloatingLabelInput>
                </div>
                             </div>

                               {/* Notes de difficulté */}
                <div className="bg-[#222] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-100 mb-4">Notation de l'exercice</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                         {/* Force */}
                     <button
                       type="button"
                       onClick={() => handleDifficultyHelp('force')}
                       className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all w-full"
                     >
                       <div className="flex items-center gap-2">
                         <Dumbbell size={18} className="text-gray-300" />
                         <span className="text-sm font-medium text-white">Force</span>
                       </div>
                       <div className="flex items-center gap-2">
                         {form.note_force > 0 ? (
                           <span className="text-white font-medium">{form.note_force}/20</span>
                         ) : (
                           <span className="text-gray-400 text-sm">Non noté</span>
                         )}
                         <Edit size={16} className="text-gray-400" />
                       </div>
                     </button>

                                         {/* Cardio */}
                     <button
                       type="button"
                       onClick={() => handleDifficultyHelp('cardio')}
                       className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all w-full"
                     >
                       <div className="flex items-center gap-2">
                         <Heart size={18} className="text-gray-300" />
                         <span className="text-sm font-medium text-white">Cardio</span>
                       </div>
                       <div className="flex items-center gap-2">
                         {form.note_cardio > 0 ? (
                           <span className="text-white font-medium">{form.note_cardio}/20</span>
                         ) : (
                           <span className="text-gray-400 text-sm">Non noté</span>
                         )}
                         <Edit size={16} className="text-gray-400" />
                       </div>
                     </button>

                                         {/* Technique */}
                     <button
                       type="button"
                       onClick={() => handleDifficultyHelp('technique')}
                       className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all w-full"
                     >
                       <div className="flex items-center gap-2">
                         <Target size={18} className="text-gray-300" />
                         <span className="text-sm font-medium text-white">Technique</span>
                       </div>
                       <div className="flex items-center gap-2">
                         {form.note_technique > 0 ? (
                           <span className="text-white font-medium">{form.note_technique}/20</span>
                         ) : (
                           <span className="text-gray-400 text-sm">Non noté</span>
                         )}
                         <Edit size={16} className="text-gray-400" />
                       </div>
                     </button>

                                         {/* Mobilité */}
                     <button
                       type="button"
                       onClick={() => handleDifficultyHelp('mobilite')}
                       className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all w-full"
                     >
                       <div className="flex items-center gap-2">
                         <Move size={18} className="text-gray-300" />
                         <span className="text-sm font-medium text-white">Mobilité</span>
                       </div>
                       <div className="flex items-center gap-2">
                         {form.note_mobilite > 0 ? (
                           <span className="text-white font-medium">{form.note_mobilite}/20</span>
                         ) : (
                           <span className="text-gray-400 text-sm">Non noté</span>
                         )}
                         <Edit size={16} className="text-gray-400" />
                       </div>
                     </button>

                                         {/* Impact */}
                     <button
                       type="button"
                       onClick={() => handleDifficultyHelp('impact')}
                       className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all w-full"
                     >
                       <div className="flex items-center gap-2">
                         <Shield size={18} className="text-gray-300" />
                         <span className="text-sm font-medium text-white">Impact</span>
                       </div>
                       <div className="flex items-center gap-2">
                         {form.note_impact > 0 ? (
                           <span className="text-white font-medium">{form.note_impact}/20</span>
                         ) : (
                           <span className="text-gray-400 text-sm">Non noté</span>
                         )}
                         <Edit size={16} className="text-gray-400" />
                       </div>
                     </button>

                                         {/* Mentale */}
                     <button
                       type="button"
                       onClick={() => handleDifficultyHelp('mentale')}
                       className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 hover:bg-gray-750 transition-all w-full"
                     >
                       <div className="flex items-center gap-2">
                         <Brain size={18} className="text-gray-300" />
                         <span className="text-sm font-medium text-white">Mentale</span>
                       </div>
                       <div className="flex items-center gap-2">
                         {form.note_mentale > 0 ? (
                           <span className="text-white font-medium">{form.note_mentale}/20</span>
                         ) : (
                           <span className="text-gray-400 text-sm">Non noté</span>
                         )}
                         <Edit size={16} className="text-gray-400" />
                       </div>
                     </button>
                  </div>
                </div>

               {/* Familles et variantes */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Familles et variantes</h3>
                <div className="space-y-4">
                  
                  {/* Famille */}
                  <FamilleSelector
                    value={form.famille_id}
                    onChange={(e) => {
                      const familleId = e.target.value;
                      const famille = familles.find(f => f.id === familleId);
                      setForm(prev => ({
                        ...prev,
                        famille_id: familleId,
                        famille_nom: famille ? famille.nom : ''
                      }));
                    }}
                    placeholder="Sélectionner une famille..."
                  />

                  {/* Exercice plus difficile */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">Exercice plus difficile</label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700 min-h-[44px] flex items-center">
                        {form.exercice_plus_dur_nom ? (
                          <div className="flex items-center gap-2">
                            <ArrowUp size={16} className="text-red-400" />
                            <span className="text-white">{form.exercice_plus_dur_nom}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Aucun exercice sélectionné</span>
                        )}
                      </div>
                                             <button
                         type="button"
                         onClick={() => {
                           console.log('🔍 Bouton Sélectionner cliqué, setting showExercicePlusDurSelector to true');
                           setShowExercicePlusDurSelector(true);
                         }}
                         className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                       >
                         Sélectionner
                       </button>
                      {form.exercice_plus_dur_id && (
                        <button
                          type="button"
                          onClick={clearExercicePlusDur}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Exercice plus facile */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">Exercice plus facile</label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700 min-h-[44px] flex items-center">
                        {form.exercice_plus_facile_nom ? (
                          <div className="flex items-center gap-2">
                            <ArrowDown size={16} className="text-green-400" />
                            <span className="text-white">{form.exercice_plus_facile_nom}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Aucun exercice sélectionné</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowExercicePlusFacileSelector(true)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                      >
                        Sélectionner
                      </button>
                      {form.exercice_plus_facile_id && (
                        <button
                          type="button"
                          onClick={clearExercicePlusFacile}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Exercices similaires */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">Exercices similaires</label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-700 min-h-[44px]">
                        {form.exercices_similaires_noms.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {form.exercices_similaires_noms.map((nom, index) => (
                              <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                                <Link size={12} />
                                {nom}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Aucun exercice sélectionné</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowExercicesSimilairesSelector(true)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                      >
                        Sélectionner
                      </button>
                      {form.exercices_similaires.length > 0 && (
                        <button
                          type="button"
                          onClick={clearExercicesSimilaires}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails techniques */}
              <div className="bg-[#222] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-100 mb-4">Détails techniques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
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
              <div className="bg-[#222] rounded-lg p-6 hidden">
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
        {showNavigationDialog && (
          <NavigationPromptDialog
            open={showNavigationDialog}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onSaveAndQuit={handleSaveAndQuit}
            savingAndQuit={savingAndQuit}
          />
        )}
        {blocker && !showNavigationDialog && (
          <NavigationPromptDialog
            open={blocker.state === "blocked"}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onSaveAndQuit={handleSaveAndQuit}
            savingAndQuit={savingAndQuit}
          />
        )}

        <ImportAIDialog
          open={showImportDialog}
          onClose={() => setShowImportDialog(false)}
          title="Générer un exercice avec l'IA"
          subtitle={"Décrivez le nom ou la description de l'exercice pour " + (isAnyProviderConfigured() ? "appeler l'IA." : "générer le prompt.")}
          descriptionLabel="Nom ou description de l'exercice"
          promptPlaceholder="Ex : Pompes, Pompes diamant, Pompes avec les mains écartées..."
          buildFullPrompt={buildFullPromptForExercice}
          onApplyJson={applyExerciceJson}
          generateWithAI={generateExerciceWithAI}
          isAnyProviderConfigured={isAnyProviderConfigured}
          texts={{
            applyButtonLabel: "Appliquer cet exercice",
          }}
          renderPreview={(aiResponse) => {
            try {
              const data = JSON.parse(aiResponse);
              return (
                <div className="space-y-2">
                  <div><strong>Nom:</strong> {data.nom}</div>
                  <div><strong>Description:</strong> {(data.description || '').slice(0, 80)}…</div>
                </div>
              );
            } catch (e) {
              return <pre className="whitespace-pre-wrap break-words">{aiResponse}</pre>;
            }
          }}
        />

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

      {/* Composants de sélection */}
      <ExerciceSelector
        open={showExercicePlusDurSelector}
        onClose={() => setShowExercicePlusDurSelector(false)}
        onSelect={handleExercicePlusDurSelect}
        title="Sélectionner un exercice plus difficile"
        placeholder="Rechercher un exercice plus difficile..."
      />
      
      <ExerciceSelector
        open={showExercicePlusFacileSelector}
        onClose={() => setShowExercicePlusFacileSelector(false)}
        onSelect={handleExercicePlusFacileSelect}
        title="Sélectionner un exercice plus facile"
        placeholder="Rechercher un exercice plus facile..."
      />
      
             <ExerciceSelector
         open={showExercicesSimilairesSelector}
         onClose={() => setShowExercicesSimilairesSelector(false)}
         onMultipleSelect={handleExercicesSimilairesSelect}
         title="Sélectionner des exercices similaires"
         placeholder="Rechercher des exercices similaires..."
         multiple={true}
         selectedExercices={form.exercices_similaires}
       />

       {/* Dialog d'aide pour les notes de difficulté */}
       <DifficultyHelpDialog
         open={showDifficultyHelpDialog}
         onClose={() => setShowDifficultyHelpDialog(false)}
         difficultyType={currentDifficultyType}
         onNoteSelect={handleNoteSelect}
       />
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

  const isCreatorOrAdmin = user && (user.is_admin || exercice.created_by === user.id);

  return (
    <Layout 
      pageTitle={exercice.nom} 
      pageActions={isCreatorOrAdmin ? [
        { icon: <Pencil size={20} className="text-white" />, label: 'Modifier', onClick: () => setMode('edit') },
        { icon: <Trash2 size={20} className="text-red-400" />, label: 'Supprimer', onClick: () => setShowDeleteDialog(true), disabled: saving }
      ] : []}
      backTo="/exercices"
      backLabel="Retour à la liste des exercices"
    >
      <div className="w-full flex justify-center mt-4 mb-4 px-2 sm:px-4 md:px-12">
        <div className="bg-black/40 border border-gray-700 rounded-2xl shadow-lg w-full max-w-none mx-auto p-4 sm:p-4 md:p-6 xl:px-8 xl:py-6" style={{maxWidth: '1800px'}}>
          {/* Badges arrondis */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Catégorie de l'exercice">
              <Tag size={14} className="inline-block text-gray-300 mr-1" />
              {exercice.categorie_nom || <span className="italic text-gray-500">Catégorie inconnue</span>}
            </span>
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Groupe musculaire">
              <Activity size={14} className="inline-block text-gray-300 mr-1" />
              {exercice.groupe_musculaire_nom || <span className="italic text-gray-500">Groupe inconnu</span>}
            </span>
                         {/* Notes de difficulté */}
             <div className="flex flex-wrap gap-1">
               {exercice.note_force !== undefined && (
                 <span className="rounded-full border border-gray-600 text-white px-2 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Force">
                   <Dumbbell size={12} className="text-gray-300" />
                   {exercice.note_force}/20
                 </span>
               )}
               {exercice.note_cardio !== undefined && (
                 <span className="rounded-full border border-gray-600 text-white px-2 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Cardio">
                   <Heart size={12} className="text-gray-300" />
                   {exercice.note_cardio}/20
                 </span>
               )}
               {exercice.note_technique !== undefined && (
                 <span className="rounded-full border border-gray-600 text-white px-2 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Technique">
                   <Target size={12} className="text-gray-300" />
                   {exercice.note_technique}/20
                 </span>
               )}
               {exercice.note_mobilite !== undefined && (
                 <span className="rounded-full border border-gray-600 text-white px-2 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Mobilité">
                   <Move size={12} className="text-gray-300" />
                   {exercice.note_mobilite}/20
                 </span>
               )}
               {exercice.note_impact !== undefined && (
                 <span className="rounded-full border border-gray-600 text-white px-2 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Impact">
                   <Shield size={12} className="text-gray-300" />
                   {exercice.note_impact}/20
                 </span>
               )}
               {exercice.note_mentale !== undefined && (
                 <span className="rounded-full border border-gray-600 text-white px-2 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Mentale">
                   <Brain size={12} className="text-gray-300" />
                   {exercice.note_mentale}/20
                 </span>
               )}
             </div>
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Type d'exercice">
              <Layers size={14} className="inline-block text-gray-300 mr-1" />
              {exercice.type_nom || <span className="italic text-gray-500">Type inconnu</span>}
            </span>
            {exercice.auteur_pseudo && (
              <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Auteur de l'exercice">
                <User size={14} className="inline-block text-gray-300 mr-1" />
                {exercice.auteur_pseudo}
              </span>
            )}
            {exercice.is_validated !== undefined && (
              <span className={
                "rounded-full px-4 py-1 text-xs font-semibold border flex items-center gap-1 " +
                (exercice.is_validated
                  ? "bg-green-900/80 border-green-700 text-green-300"
                  : "bg-yellow-900/80 border-yellow-700 text-yellow-300")
              } title={exercice.is_validated ? "Exercice validé" : "Exercice en attente de validation"}>
                {exercice.is_validated ? <CheckCircle size={14} className="inline-block text-green-300 mr-1" /> : <XCircle size={14} className="inline-block text-yellow-300 mr-1" />}
                {exercice.is_validated ? "Validé" : "En attente"}
              </span>
            )}
            {exercice.created_at && (
              <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Date de création">
                <Calendar size={14} className="inline-block text-gray-300 mr-1" />
                {new Date(exercice.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
            {exercice.updated_at && (
              <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Date de dernière modification">
                <Pencil size={14} className="inline-block text-gray-300 mr-1" />
                {new Date(exercice.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-rose-400">{exercice.nom}</h2>

          {/* Familles et variantes */}
          {(exercice.famille_nom || exercice.exercice_plus_dur_nom || exercice.exercice_plus_facile_nom || (exercice.exercices_similaires_noms && exercice.exercices_similaires_noms.length > 0)) && (
            <div className="bg-black/40 rounded-lg p-4 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-orange-100 mb-3 flex items-center gap-2">
                <Folder size={20} className="text-orange-400" />
                Familles et variantes
              </h3>
              
              <div className="space-y-3">
                {/* Famille */}
                {exercice.famille_nom && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-300 min-w-[120px]">Famille :</span>
                    <span className="text-orange-300">{exercice.famille_nom}</span>
                  </div>
                )}

                {/* Exercice plus difficile */}
                {exercice.exercice_plus_dur_nom && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-300 min-w-[120px]">Plus difficile :</span>
                    <div className="flex items-center gap-2">
                      <ArrowUp size={16} className="text-red-400" />
                      <span className="text-red-300">{exercice.exercice_plus_dur_nom}</span>
                    </div>
                  </div>
                )}

                {/* Exercice plus facile */}
                {exercice.exercice_plus_facile_nom && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-300 min-w-[120px]">Plus facile :</span>
                    <div className="flex items-center gap-2">
                      <ArrowDown size={16} className="text-green-400" />
                      <span className="text-green-300">{exercice.exercice_plus_facile_nom}</span>
                    </div>
                  </div>
                )}

                {/* Exercices similaires */}
                {exercice.exercices_similaires_noms && exercice.exercices_similaires_noms.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-gray-300 min-w-[120px] mt-1">Similaires :</span>
                    <div className="flex flex-wrap gap-2">
                      {exercice.exercices_similaires_noms.map((nom, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                          <Link size={12} />
                          {nom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Position de départ + Description ensemble */}
          {(exercice.position_depart || exercice.description) && (
            <div className="bg-black/40 rounded-lg p-4 border border-gray-700 mb-6">
              {exercice.position_depart && (
                <div className="mb-2">
                  <span className="font-semibold text-orange-100">Position de départ</span>
                  <p className="text-gray-300 text-sm">{exercice.position_depart}</p>
                </div>
              )}
              {exercice.description && (
                <div>
                  <span className="font-semibold text-orange-100">Description</span>
                  <p className="text-gray-300 text-sm">{exercice.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Contenu détaillé */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exercice.muscles_sollicites && Array.isArray(exercice.muscles_sollicites) && exercice.muscles_sollicites.length > 0 && (
                <div className="bg-black/40 rounded-lg p-6 border border-gray-700">
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

              {exercice.focus_zone && Array.isArray(exercice.focus_zone) && exercice.focus_zone.length > 0 && (
                <div className="bg-black/40 rounded-lg p-6 border border-gray-700">
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

              {exercice.erreurs && Array.isArray(exercice.erreurs) && exercice.erreurs.length > 0 && (
                <div className="bg-black/40 rounded-lg p-6 border border-gray-700">
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

              {exercice.conseils && Array.isArray(exercice.conseils) && exercice.conseils.length > 0 && (
                <div className="bg-black/40 rounded-lg p-6 border border-gray-700">
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
                <div className="bg-black/40 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-orange-100 mb-3">Variantes plus faciles</h3>
                  <ul className="space-y-2">
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
                <div className="bg-black/40 rounded-lg p-6 border border-gray-700">
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

          {/* Médias */}
          {(exercice.image_url || exercice.video_url) && (
            <div className="mt-6 bg-black/40 rounded-lg p-6 border border-gray-700">
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
             {/* Snackbar pour les messages de validation et d'erreur */}
       <Snackbar 
         message={snackbarMessage} 
         type={snackbarType} 
         onClose={() => setSnackbarMessage("")} 
       />

       {/* Dialog d'aide pour les notes de difficulté */}
       <DifficultyHelpDialog
         open={showDifficultyHelpDialog}
         onClose={() => setShowDifficultyHelpDialog(false)}
         difficultyType={currentDifficultyType}
         onNoteSelect={handleNoteSelect}
       />

     </Layout>
   );
 } 