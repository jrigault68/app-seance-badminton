import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSafeBlocker } from "../utils/useBlocker";
import Layout from "../components/Layout";
import SeanceStructure from "../components/ui/SeanceStructure";
import EditeurStructureSeance from "../components/EditeurStructureSeance";
import SeanceService from "../services/seanceService";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import FloatingSaveButton from "../components/ui/FloatingSaveButton";
import NavigationPromptDialog from "../components/ui/NavigationPromptDialog";
import ImportAIDialog, { ImportAIDialogTriggerIcon } from "../components/ui/ImportAIDialog";
import Snackbar from "../components/Snackbar";
import { useUser } from "../contexts/UserContext";
import { Pencil, Calendar, BarChart2, Tag, Layers, User, CheckCircle, XCircle, Play, Trash2, RotateCcw, Copy, X } from "lucide-react";
import { calculerTempsTotalSeance } from "../utils/helpers";
import { genererEtapesDepuisStructure } from "../utils/genererEtapes";
import { getActiveAIService, isAnyProviderConfigured } from "../services/aiService";
import { filterExercicesByPrompt, formatExercicesCompact } from "../utils/exercicesPourIA.js";
import { getPromptSeanceTemplate } from "../utils/aiPrompts.js";

// Composant pour sélectionner une séance à copier
function SeanceCopySelector({ onSelect, onCancel }) {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${apiUrl}/seances?limit=100`)
      .then(res => res.json())
      .then(data => {
        setSeances(data.seances || data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des séances:', error);
        setLoading(false);
      });
  }, [apiUrl]);

  const filteredSeances = seances.filter(seance =>
    seance.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seance.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Rechercher une séance..."
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredSeances.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            {searchTerm ? 'Aucune séance trouvée' : 'Aucune séance disponible'}
          </div>
        ) : (
          filteredSeances.map(seance => (
            <div
              key={seance.id}
              className="p-3 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700 cursor-pointer"
              onClick={() => onSelect(seance)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{seance.nom}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {seance.description || 'Aucune description'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                      {seance.type_seance === 'instruction' ? 'Instruction' : 'Exercices'}
                    </span>
                    {seance.structure && (
                      <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
                        {seance.structure.length} bloc(s)
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="ml-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(seance);
                  }}
                >
                  Copier
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

export default function SeanceDetail() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const isNew = !id || id === "new";
  
  const [mode, setMode] = useState(isNew ? "new" : "detail"); // 'detail' | 'edit' | 'new'
  const [structureEditMode, setStructureEditMode] = useState(false); // Nouveau mode pour l'édition de structure
  const [seance, setSeance] = useState(null);
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nom: "", description: "", niveau_id: "", type_id: "", categorie_id: "", notes: "", structure: [], type_seance: "exercice" });
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savingAndQuit, setSavingAndQuit] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);
  const initialFormRef = useRef(form);
  const isCreatorOrAdmin = user && seance && (user.id === seance.created_by || user.is_admin);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sessionEnCours, setSessionEnCours] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);

  // États pour les snackbars
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  // États pour l'import de séances
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [hasImportedData, setHasImportedData] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);

  // Fonction pour valider les exercices dans la structure (id null = exercice créé par l'IA, autorisé)
  const validateExercicesInStructure = (structure, availableExercices) => {
    const errors = [];
    const exerciceIds = new Set(availableExercices.map(exo => exo.id));
    
    const validateStructure = (items) => {
      items.forEach(item => {
        if (item.type === 'bloc' && item.contenu) {
          validateStructure(item.contenu);
        } else if (item.type === 'exercice') {
          if (item.id != null && item.id !== '' && !exerciceIds.has(item.id)) {
            errors.push(`Exercice "${item.id}" n'existe pas dans la base de données`);
          }
        }
      });
    };
    
    if (Array.isArray(structure)) {
      validateStructure(structure);
    }
    
    return {
      hasErrors: errors.length > 0,
      errors
    };
  };

  // Fonction pour copier une séance existante
  const handleCopySeance = (seanceToCopy = null) => {
    const seanceSource = seanceToCopy || seance;
    
    if (!seanceSource) {
      setSnackbarMessage("Aucune séance à copier");
      setSnackbarType("error");
      return;
    }
    
    // S'assurer qu'on est bien en mode création
    if (mode !== "new") {
      console.warn("Tentative de copie en mode non-création:", mode);
      return;
    }
    
    // Remplir directement le formulaire avec les données copiées
    const newForm = {
      nom: `${seanceSource.nom} (copie)`,
      description: seanceSource.description || '',
      niveau_id: seanceSource.niveau_id ? String(seanceSource.niveau_id) : '',
      type_id: seanceSource.type_id ? String(seanceSource.type_id) : '',
      categorie_id: seanceSource.categorie_id ? String(seanceSource.categorie_id) : '',
      notes: seanceSource.notes || '',
      structure: seanceSource.structure ? JSON.parse(JSON.stringify(seanceSource.structure)) : [],
      type_seance: seanceSource.type_seance || 'exercice'
    };
    
    setForm(newForm);
    initialFormRef.current = newForm;
    setHasImportedData(true);
    
    // Fermer le dialog de sélection
    setShowCopyDialog(false);
    
    setSnackbarMessage("Séance copiée ! Modifiez les champs selon vos besoins puis sauvegardez.");
    setSnackbarType("success");
  };

  // Construit le prompt complet à copier-coller dans un chat IA (quand pas de clé API)
  const buildFullPromptForCopy = (userPrompt) => {
    const filtered = filterExercicesByPrompt(userPrompt || '', exercices || []);
    const list = formatExercicesCompact(filtered);
    return `${getPromptSeanceTemplate()}

Liste des exercices disponibles (utilise uniquement ces "id" dans le JSON, n=nom, c=catégorie) :
${JSON.stringify(list)}

Description de la séance demandée :
${userPrompt}

Réponds uniquement avec le JSON de la séance, sans explication ni texte autour.`;
  };

  const applyJsonToForm = async (jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      const validationResult = validateExercicesInStructure(data.structure, exercices);
      if (validationResult.hasErrors) {
        return { success: false, error: validationResult.errors.join(', ') };
      }
      setForm({
        nom: data.nom || '',
        description: data.description || '',
        niveau_id: data.niveau_id ? String(data.niveau_id) : '',
        type_id: data.type_id ? String(data.type_id) : '',
        categorie_id: data.categorie_id ? String(data.categorie_id) : '',
        notes: data.notes || '',
        structure: data.structure || [],
        type_seance: data.type_seance || 'exercice'
      });
      setSnackbarMessage('Séance appliquée. Enregistrez pour finaliser.');
      setSnackbarType('success');
      return { success: true };
    } catch (e) {
      return { success: false, error: 'JSON invalide. Collez uniquement le JSON retourné par l\'IA.' };
    }
  };

  const generateSeanceWithAI = async (prompt) => {
    const aiService = await getActiveAIService();
    if (!aiService) return null;
    return await aiService.generateSeance(prompt, exercices);
  };

  // Récupère les listes de référence
  useEffect(() => {
    // Charger les données de référence pour les séances
    // Note: Les séances utilisent encore l'ancien système de niveau/type/catégorie
    // mais on utilise les nouveaux endpoints pour éviter les erreurs
    Promise.all([
      fetch(`${apiUrl}/niveaux`).then(res => res.json()).catch(() => []),
      fetch(`${apiUrl}/categories`).then(res => res.json()).catch(() => []),
      fetch(`${apiUrl}/types`).then(res => res.json()).catch(() => []),
      fetch(`${apiUrl}/exercices?limit=1000`).then(res => res.json()).catch(() => ({ exercices: [] }))
    ]).then(([niveauxData, categoriesData, typesData, exercicesData]) => {
      setNiveaux(Array.isArray(niveauxData) ? niveauxData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setTypes(Array.isArray(typesData) ? typesData : []);
      const exercicesArray = exercicesData.exercices || exercicesData || [];
      console.log('Exercices chargés:', exercicesArray.length);
      setExercices(exercicesArray);
    }).catch(err => {
      console.warn('Erreur lors du chargement des données de référence:', err);
      setNiveaux([]);
      setCategories([]);
      setTypes([]);
      setExercices([]);
    });
  }, [apiUrl]);

  // Charge la séance si mode detail/edit
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setSeance(null);
      
      // Pas de logique de navigation avec state nécessaire
      
      // Formulaire vide par défaut
      setForm({ nom: "", description: "", niveau_id: "", type_id: "", categorie_id: "", notes: "", structure: [], type_seance: "exercice" });
      initialFormRef.current = { nom: "", description: "", niveau_id: "", type_id: "", categorie_id: "", notes: "", structure: [], type_seance: "exercice" };
      setHasImportedData(false);
      return;
    }
    
    // Vérifier que l'ID n'est pas "new" ou invalide
    if (!id || id === "new") {
      setError("ID de séance invalide");
      setLoading(false);
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
          notes: data.notes || "",
          structure: data.structure || [],
          type_seance: data.type_seance || "exercice"
        });
        initialFormRef.current = {
          nom: data.nom || "",
          description: data.description || "",
          niveau_id: data.niveau_id ? String(data.niveau_id) : "",
          type_id: data.type_id ? String(data.type_id) : "",
          categorie_id: data.categorie_id ? String(data.categorie_id) : "",
          notes: data.notes || "",
          structure: data.structure || [],
          type_seance: data.type_seance || "exercice"
        };
        setHasImportedData(false);
        
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

      // Ne pas écraser exercices : on garde le catalogue complet (chargé au montage)
      // pour l'affichage de la structure et pour la génération IA.
  }, [id, isNew]);

  // Vérifier s'il y a une session en cours pour cette séance
  useEffect(() => {
    if (!isNew && seance && seance.id && seance.id !== "new") {
      setLoadingSession(true);
      SeanceService.getSessionEnCours(seance.id)
        .then(session => {
          setSessionEnCours(session);
          console.log('Session en cours trouvée:', session);
        })
        .catch(error => {
          console.log('Aucune session en cours ou erreur:', error);
          setSessionEnCours(null);
        })
        .finally(() => setLoadingSession(false));
    }
  }, [isNew, seance]);

  // Navigation blocker pour les modifications non sauvegardées
  const hasChanged = (() => {
    if (mode === "detail" && !structureEditMode) {
      return false;
    }
    
    const formChanged = mode !== "detail" && JSON.stringify(form) !== JSON.stringify(initialFormRef.current);
    const structureChanged = structureEditMode && seance && JSON.stringify(seance.structure) !== JSON.stringify(initialFormRef.current.structure);
    console.log("formChanged", formChanged);
    console.log("structureChanged", structureChanged);
    return formChanged || structureChanged;
  })();

  const blocker = useSafeBlocker(
    ({ currentLocation, nextLocation }) => {
      if (mode === "detail" && !structureEditMode) return false;
      return hasChanged;
    }
  );

  const handleSaveAndQuit = async () => {
    setSavingAndQuit(true);
    try {
      if (structureEditMode) {
        await handleSaveStructure(seance.structure);
      } else {
        await handleSave();
      }
      if (blocker && blocker.state === "blocked") blocker.proceed();
      if (pendingMode && pendingMode !== mode) {
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
    if (pendingMode && pendingMode !== mode) {
      setMode(pendingMode);
      setPendingMode(null);
    }
    setShowNavigationDialog(false);
  };

  const handleCancel = () => {
    if (blocker && blocker.state === "blocked") blocker.reset();
    setShowNavigationDialog(false);
    setPendingMode(null);
  };

  // Handler pour le bouton retour avec vérification des modifications
  const handleBackClick = () => {
    console.log("hasChanged", hasChanged);
    if (hasChanged) {
      setPendingMode("detail");
      setShowNavigationDialog(true);
    } else {
      if (structureEditMode) {
        setStructureEditMode(false);
      } else if (mode === "detail" || isNew) {
        // En mode détail ou nouvelle séance, naviguer vers la liste des séances
        navigate("/seances");
      } else {
        setMode("detail");
      }
    }
  };

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
      
      // Calculer le temps total de la séance seulement si la structure n'est pas vide
      const tempsTotal = form.structure && form.structure.length > 0 
        ? calculerTempsTotalSeance(form.structure, exercices) 
        : 0;
      
      const body = {
        ...rest,
        categorie_id: categorie_id ? parseInt(categorie_id, 10) : null,
        type_id: type_id ? parseInt(type_id, 10) : null,
        niveau_id: niveau_id ? parseInt(niveau_id, 10) : null,
        duree_estimee: tempsTotal, // Ajouter le temps total calculé dans le champ existant
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
        setSeance({ ...seance, ...form, duree_estimee: tempsTotal });
        initialFormRef.current = form;
        setSnackbarMessage("Séance modifiée avec succès !");
        setSnackbarType("success");
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
        
        // Forcer la navigation vers la nouvelle URL avec rechargement complet
        window.location.href = `/seances/${newId}`;
      }
    } catch (err) {
      setError(err.message);
      setSnackbarMessage("Erreur lors de la sauvegarde de la séance : " + err.message);
      setSnackbarType("error");
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
      setSnackbarMessage("Séance supprimée avec succès !");
      setSnackbarType("success");
    } catch (err) {
      setError(err.message);
      setSnackbarMessage("Erreur lors de la suppression de la séance : " + err.message);
      setSnackbarType("error");
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
      // Vérifier qu'on a un ID valide
      if (!id || id === "new") {
        console.warn("Tentative de sauvegarde structure avec ID invalide:", id);
        throw new Error("Impossible de sauvegarder la structure. Veuillez d'abord sauvegarder la séance.");
      }
      
      // Calculer le temps total de la séance avec la nouvelle structure
      const tempsTotal = calculerTempsTotalSeance(newStructure, exercices);
      console.log('Temps total calculé:', tempsTotal);
      
      const bodyData = { 
        structure: newStructure, 
        duree_estimee: tempsTotal // Sauvegarder le temps total calculé dans le champ existant
      };
      
      console.log('Données envoyées au serveur:', bodyData);
      
      const response = await fetch(`${apiUrl}/seances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse du serveur:', response.status, errorText);
        throw new Error(`Erreur lors de la sauvegarde de la structure: ${response.status} - ${errorText}`);
      }
      const updatedSeance = await response.json();
      // Mettre à jour la séance en préservant la structure exacte qui a été sauvegardée
      setSeance(prev => ({
        ...(updatedSeance.seance || updatedSeance),
        structure: newStructure, // Garder la structure exacte qui a été envoyée
        duree_estimee: tempsTotal // Mettre à jour le temps total
      }));
      
      // Mettre à jour initialFormRef.current pour que hasChanged repasse à false
      initialFormRef.current = {
        ...initialFormRef.current,
        structure: newStructure
      };
      
      //setStructureEditMode(false);
      setSnackbarMessage("Structure sauvegardée avec succès !");
      setSnackbarType("success");
    } catch (err) {
      setError(err.message);
      setSnackbarMessage("Erreur lors de la sauvegarde de la structure : " + err.message);
      setSnackbarType("error");
      throw err; // Re-lancer l'erreur pour que l'éditeur puisse la gérer
    } finally {
      setSaving(false);
    }
  };

  // Blocage navigation interne (optionnel, à ajouter si besoin)

  // UI
  if (loading) return <Layout pageTitle="Détail de la séance"><div className="text-center text-gray-400 py-10" aria-label="Chargement en cours">...</div></Layout>;
  if (error) return <Layout pageTitle="Détail de la séance"><div className="text-center text-red-400 py-10">{error}</div></Layout>;

  // Mode édition ou création
  if (mode === "edit" || mode === "new") {
    return (
      <Layout 
        pageTitle={mode === "edit" ? "Modifier la séance" : "Créer une séance"} 
        backTo="/seances" 
        backLabel="Retour à la liste des séances"
        onBackClick={handleBackClick}
        pageActions={[
          ...(mode === "new" ? [{
            icon: <Copy size={20} className="text-green-400" />,
            label: 'Copier une séance',
            onClick: () => setShowCopyDialog(true)
          }] : []),
          {
            icon: <ImportAIDialogTriggerIcon />,
            label: 'Générer une séance avec l\'IA',
            onClick: () => setShowAIDialog(true)
          }
        ]}
      >
        <div className="page-wrapper">
          <div className="page-content">
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="bg-black/40 rounded-2xl p-6 border border-gray-700 space-y-6 mt-8">
              {error && <div className="text-red-400 text-center mb-2">{error}</div>}
              
              {/* Sélecteur de type de séance */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white">Type de séance</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type_seance"
                      value="exercice"
                      checked={form.type_seance === "exercice"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-white">Séance d'exercices</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type_seance"
                      value="instruction"
                      checked={form.type_seance === "instruction"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-white">Instruction simple</span>
                  </label>
                </div>
              </div>
              <FloatingLabelInput label="Nom" name="nom" value={form.nom} onChange={handleChange} />
              <FloatingLabelInput label="Description" name="description" value={form.description} onChange={handleChange} as="textarea" rows={3} />
              {form.type_seance === "exercice" && (
                <FloatingLabelInput label="Focus ou état d'esprit" name="notes" value={form.notes} onChange={handleChange} as="textarea" rows={2} placeholder="Ex: Se concentrer sur la technique, respirer profondément, rester positif..." />
              )}
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
              {mode === "new" && form.structure && form.structure.length > 0 && (
                <div className="bg-blue-900/50 border border-blue-700 rounded p-3 text-blue-300">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <div>
                      <strong>Structure prête :</strong> {form.structure.length} bloc(s) avec {form.structure.reduce((total, bloc) => total + (bloc.contenu?.length || 0), 0)} exercice(s)
                      <div className="text-xs text-blue-400 mt-1">
                        La structure sera sauvegardée avec la séance
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
            <FloatingSaveButton
              show={hasChanged || hasImportedData}
              onClick={handleSave}
              loading={saving}
              label={mode === "edit" ? "Enregistrer les modifications" : "Créer la séance"}
              className="bg-green-600 hover:bg-green-700"
            />
          </div>
        </div>
        
        <ImportAIDialog
          open={showAIDialog}
          onClose={() => setShowAIDialog(false)}
          title="Générer une séance avec l'IA"
          subtitle="Décrivez la séance, temps, exercices, etc."
          descriptionLabel="Description de la séance"
          promptPlaceholder="Ex : Échauffement 15 min puis renforcement..."
          buildFullPrompt={buildFullPromptForCopy}
          onApplyJson={applyJsonToForm}
          generateWithAI={generateSeanceWithAI}
          isAnyProviderConfigured={isAnyProviderConfigured}
          texts={{
            applyButtonLabel: "Appliquer cette séance",
          }}
          renderPreview={(aiResponse) => {
            try {
              const data = JSON.parse(aiResponse);
              return (
                <div className="space-y-2">
                  <div><strong>Nom:</strong> {data.nom}</div>
                  <div><strong>Structure:</strong> {data.structure?.length || 0} bloc(s)</div>
                  {data.structure?.map((bloc, i) => (
                    <div key={i} className="ml-4 border-l-2 border-gray-600 pl-2">
                      {bloc.nom} — {bloc.contenu?.length || 0} ex.
                    </div>
                  ))}
                </div>
              );
            } catch (e) {
              return <pre>{aiResponse}</pre>;
            }
          }}
        />

        {/* Dialog de sélection de séance à copier */}
        {showCopyDialog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={e => {
              if (e.target === e.currentTarget) setShowCopyDialog(false);
            }}
          >
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl border border-gray-700 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setShowCopyDialog(false)}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
              <h2 className="text-lg font-bold text-white mb-4">Sélectionner une séance à copier</h2>
              <SeanceCopySelector 
                onSelect={(seance) => {
                  handleCopySeance(seance);
                  setShowCopyDialog(false);
                }}
                onCancel={() => setShowCopyDialog(false)}
              />
            </div>
          </div>
        )}

        {(blocker || showNavigationDialog) && (
        <NavigationPromptDialog
          open={blocker?.state === "blocked" || showNavigationDialog}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onSaveAndQuit={handleSaveAndQuit}
          savingAndQuit={savingAndQuit}
        />
      )}
      <Snackbar message={snackbarMessage} type={snackbarType} onClose={() => setSnackbarMessage("")} />
      </Layout>
    );
  }

  // Mode détail (lecture seule)
  const hasPlayableStructure = Array.isArray(seance?.structure) && seance.structure.length > 0;
  const isInstruction = seance?.type_seance === "instruction";
  console.log("Seance type_seance:", seance?.type_seance, "isInstruction:", isInstruction);

  // Utiliser le temps total depuis la BDD, avec fallback vers le calcul si pas disponible
  const totalSeconds = seance?.duree_estimee || 0;
  const totalMinutes = Math.round(totalSeconds / 60);

  // Déterminer l'action principale selon s'il y a une session en cours
  const getMainAction = () => {
    if (!hasPlayableStructure || isInstruction) return null;
    
    if (sessionEnCours) {
      const progression = sessionEnCours.progression;
      const etapeActuelle = progression?.etape_actuelle || 0;
      const nombreTotal = progression?.nombre_total_etapes || 0;
      
      return {
        icon: <RotateCcw size={20} className="text-orange-400" />,
        label: `Reprendre (étape ${etapeActuelle + 1}/${nombreTotal})`,
        onClick: () => {
          if (seance) {
            navigate(`/seances/${seance.id}/execution`);
          }
        },
        disabled: !seance || loadingSession
      };
    } else {
      return {
        icon: <Play size={20} className="text-green-400" />,
        label: 'Démarrer la séance',
        onClick: () => {
          if (seance) {
            navigate(`/seances/${seance.id}/execution`);
          } else {
            console.warn("Séance non chargée !");
          }
        },
        disabled: !seance || loadingSession
      };
    }
  };

  const mainAction = getMainAction();

  return (
    <Layout
      pageTitle={seance?.nom || "Détail de la séance"}
      backTo="/seances"
      backLabel="Retour à la liste des séances"
      onBackClick={handleBackClick}
      pageActions={[
        mainAction,
        isCreatorOrAdmin && { icon: <Pencil size={20} className="text-white" />, label: 'Modifier', onClick: () => setMode('edit') },
        isCreatorOrAdmin && !isInstruction && { 
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
      <div className="page-wrapper">
        <div className="page-content">
          {/* Badges arrondis */}
          <div className="badge-container">
            <span className="badge badge-white" title="Niveau de la séance">
              <BarChart2 size={14} className="badge-icon" />
              {false || <span className="badge-text-italic">Niveau inconnu</span>}
            </span>
            <span className="badge badge-white" title="Catégorie de la séance">
              <Tag size={14} className="badge-icon" />
              {categories.find(c => c.id === Number(seance.categorie_id))?.nom || <span className="badge-text-italic">Catégorie inconnue</span>}
            </span>
            <span className="badge badge-white" title="Type de la séance">
              <Layers size={14} className="badge-icon" />
              {false || <span className="badge-text-italic">Type inconnu</span>}
            </span>
            <span className={"badge " + (seance.type_seance === "instruction" ? "badge-orange" : "badge-blue")
            } title={seance.type_seance === "instruction" ? "Séance d'instruction" : "Séance d'exercices"}>
              {seance.type_seance === "instruction" ? "Instruction" : "Exercices"}
            </span>
            <span className="badge badge-white" title="Auteur de la séance">
              <User size={14} className="badge-icon" />
              {seance.auteur_pseudo || <span className="badge-text-italic">Auteur inconnu</span>}
            </span>
            <span className={"badge " + (seance.est_active !== false ? "badge-green" : "badge-gray")} title={seance.est_active !== false ? "Séance active" : "Séance inactive"}>
              {seance.est_active !== false ? <CheckCircle size={14} className="inline-block text-green-300 mr-1" /> : <XCircle size={14} className="inline-block text-gray-400 mr-1" />}
              {seance.est_active !== false ? "Active" : "Inactive"}
            </span>
            {seance.created_at && (
              <span className="badge badge-white" title="Date de création">
                <Calendar size={14} className="badge-icon" />
                {new Date(seance.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
            {seance.updated_at && (
              <span className="badge badge-white" title="Date de dernière modification">
                <Pencil size={14} className="badge-icon" />
                {new Date(seance.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          <h2 className="page-title">{seance.nom}</h2>
            <p className="page-description">{seance.description || ""}</p>
          {seance.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-orange-300 mb-2">Focus ou état d'esprit</h3>
              <p className="text-gray-300 italic">
                {seance.notes}
              </p>
            </div>
          )}
          {/* Contenu de la séance */}
          <div className="mt-10">
            {!isInstruction && (
              <>
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
                    <SeanceStructure structure={seance.structure} hideIcons tempsTotal={totalSeconds} />
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
      
      {/* Bouton flottant pour lancer la séance */}
      {hasPlayableStructure && mode === "detail" && !structureEditMode && !isInstruction && (
        <button
          className={`fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg text-lg z-50 ${
            sessionEnCours 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          onClick={() => {
            if (seance) {
              navigate(`/seances/${seance.id}/execution`);
            }
          }}
        >
          {sessionEnCours ? <RotateCcw size={20} /> : <Play size={20} />}
          {sessionEnCours ? 'Reprendre la séance' : 'Lancer la séance'}
        </button>
      )}

    </Layout>
  );
} 