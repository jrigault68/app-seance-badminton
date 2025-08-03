import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import CustomRadio from "../components/ui/CustomRadio";
import Switch from "../components/ui/Switch";
import FloatingSaveButton from "../components/ui/FloatingSaveButton";
import FloatingProgrammeButton from "../components/ui/FloatingProgrammeButton";
import NavigationPromptDialog from "../components/ui/NavigationPromptDialog";
import ProgrammeFollowDialog from "../components/ui/ProgrammeFollowDialog";
import Snackbar from "../components/Snackbar";
import { useSafeBlocker } from "../utils/useBlocker";
import { Pencil, Layers, Plus, Trash2, BarChart2, Tag, User, CheckCircle, XCircle, Calendar, Play, Square, RefreshCw } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import SeanceStructure from "../components/ui/SeanceStructure";

export default function ProgrammeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const isNew = !id || id === "new";
  const [mode, setMode] = useState(isNew ? "new" : "detail"); // 'detail' | 'edit' | 'new'
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [niveaux, setNiveaux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Accordéons ouverts (clé = id de séance)
  const [openSeanceAccordions, setOpenSeanceAccordions] = useState([]);
  const toggleSeanceAccordion = id => setOpenSeanceAccordions(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);

  // Ajout pour édition des séances (façon ProgrammeSeancesGestion)
  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState([]); // [{ jour/date, seances: [seanceObj, ...] }, ...]
  const [seancesDispo, setSeancesDispo] = useState([]);
  const [loadingSeances, setLoadingSeances] = useState(false);
  const [errorSeances, setErrorSeances] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // États pour les snackbars
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  // États pour le suivi de programme
  const [programmeActuel, setProgrammeActuel] = useState(null);
  const [programmesUtilisateur, setProgrammesUtilisateur] = useState([]);
  const [loadingProgrammeActuel, setLoadingProgrammeActuel] = useState(false);
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [followDialogType, setFollowDialogType] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/niveaux`).then(res => res.json()).then(setNiveaux);
    fetch(`${apiUrl}/categories`).then(res => res.json()).then(setCategories);
    fetch(`${apiUrl}/types`).then(res => res.json()).then(setTypes);
  }, [apiUrl]);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setProgramme(null);
      return;
    }
    setLoading(true);
    fetch(`${apiUrl}/programmes/${id}`)
      .then(res => res.json())
      .then(data => setProgramme(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  // Récupérer le programme actuel et tous les programmes de l'utilisateur
  useEffect(() => {
    if (!user) return;
    
    const fetchProgrammesUtilisateur = async () => {
      setLoadingProgrammeActuel(true);
      try {
        // Récupérer le programme actuel
        const responseActuel = await fetch(`${apiUrl}/programmes/utilisateur/actuel`, {
          credentials: 'include'
        });
        if (responseActuel.ok) {
          const dataActuel = await responseActuel.json();
          setProgrammeActuel(dataActuel);
        } else {
          setProgrammeActuel(null);
        }

        // Récupérer tous les programmes de l'utilisateur
        const responseTous = await fetch(`${apiUrl}/programmes/utilisateur/tous`, {
          credentials: 'include'
        });
        if (responseTous.ok) {
          const dataTous = await responseTous.json();
          setProgrammesUtilisateur(dataTous);
        } else {
          setProgrammesUtilisateur([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des programmes utilisateur:', error);
        setProgrammeActuel(null);
        setProgrammesUtilisateur([]);
      } finally {
        setLoadingProgrammeActuel(false);
      }
    };

    fetchProgrammesUtilisateur();
  }, [user, apiUrl]);

  // Ajout : récupération des séances associées au programme (lecture seule)
  useEffect(() => {
    if (!programme || !programme.id) return;
    const fetchSeances = async () => {
      setLoadingSeances(true);
      try {
        let res, data;
        if (programme.type_programme === 'calendaire') {
          res = await fetch(`${apiUrl}/programmes/${programme.id}/dates`);
          data = await res.ok ? await res.json() : [];
        } else {
          res = await fetch(`${apiUrl}/programmes/${programme.id}/jours`);
          data = await res.ok ? await res.json() : [];
        }
        setItems(data);
      } catch (e) {
        setItems([]);
      } finally {
        setLoadingSeances(false);
      }
    };
    fetchSeances();
  }, [programme, apiUrl]);

  // Récupère les séances associées et disponibles (pour édition)
  useEffect(() => {
    if (!programme || !programme.id) return;
    const fetchSeances = async () => {
      setLoadingSeances(true);
      setErrorSeances(null);
      try {
        let res, data;
        if (programme.type_programme === 'calendaire') {
          res = await fetch(`${apiUrl}/programmes/${programme.id}/dates`);
          data = await res.ok ? await res.json() : [];
        } else {
          res = await fetch(`${apiUrl}/programmes/${programme.id}/jours`);
          data = await res.ok ? await res.json() : [];
        }
        setItems(data);
        // Toutes les séances dispo pour ajout
        const resSeances = await fetch(`${apiUrl}/seances`);
        const seancesData = await resSeances.ok ? await resSeances.json() : { seances: [] };
        setSeancesDispo(seancesData.seances || []);
      } catch (e) {
        setItems([]);
        setErrorSeances('Erreur lors du chargement des séances');
      } finally {
        setLoadingSeances(false);
      }
    };
    fetchSeances();
  }, [programme, apiUrl, editMode]);

  // Ajout d'une séance à un jour/date
  const handleAddSeance = async (key, seanceId) => {
    setLoadingSeances(true);
    setErrorSeances(null);
    try {
      let url;
      if (programme.type_programme === 'calendaire') {
        url = `${apiUrl}/programmes/${programme.id}/dates/${key}/seances`;
      } else {
        url = `${apiUrl}/programmes/${programme.id}/jours/${key}/seances`;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ seance_id: seanceId })
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout de la séance");
      setEditMode(true); // reste en mode édition
      // Recharge
      const fetchSeances = async () => {
        let res, data;
        if (programme.type_programme === 'calendaire') {
          res = await fetch(`${apiUrl}/programmes/${programme.id}/dates`);
          data = await res.ok ? await res.json() : [];
        } else {
          res = await fetch(`${apiUrl}/programmes/${programme.id}/jours`);
          data = await res.ok ? await res.json() : [];
        }
        setItems(data);
      };
      await fetchSeances();
    } catch (e) {
      setErrorSeances('Erreur lors de l\'ajout de la séance');
    } finally {
      setLoadingSeances(false);
    }
  };
  // Suppression d'une séance d'un jour/date
  const handleRemoveSeance = async (key, seanceId) => {
    setLoadingSeances(true);
    setErrorSeances(null);
    try {
      let url;
      if (programme.type_programme === 'calendaire') {
        url = `${apiUrl}/programmes/${programme.id}/dates/${key}/seances/${seanceId}`;
      } else {
        url = `${apiUrl}/programmes/${programme.id}/jours/${key}/seances/${seanceId}`;
      }
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression de la séance");
      setEditMode(true);
      // Recharge
      const fetchSeances = async () => {
        let res, data;
        if (programme.type_programme === 'calendaire') {
          res = await fetch(`${apiUrl}/programmes/${programme.id}/dates`);
          data = await res.ok ? await res.json() : [];
        } else {
          res = await fetch(`${apiUrl}/programmes/${programme.id}/jours`);
          data = await res.ok ? await res.json() : [];
        }
        setItems(data);
      };
      await fetchSeances();
    } catch (e) {
      setErrorSeances('Erreur lors de la suppression de la séance');
    } finally {
      setLoadingSeances(false);
    }
  };
  // Création d'une nouvelle séance
  const handleCreateSeance = (key) => {
    navigate('/seances/new', {
      state: {
        programmeId: programme.id,
        key,
        from: location.pathname
      }
    });
  };

  const isCreator = user && programme && user.id === programme.created_by;
  const isAdmin = user && user.is_admin;

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

  // Logique du formulaire (ex-ProgrammeForm)
  function normalizeFormValues(values) {
    return {
      ...values,
      nom: typeof values.nom === 'string' ? values.nom : (values.nom ?? ""),
      description: typeof values.description === 'string' ? values.description : (values.description ?? ""),
      objectif: typeof values.objectif === 'string' ? values.objectif : (values.objectif ?? ""),
      image_url: typeof values.image_url === 'string' ? values.image_url : (values.image_url ?? ""),
      date_debut: typeof values.date_debut === 'string' ? values.date_debut : (values.date_debut ?? ""),
      date_fin: typeof values.date_fin === 'string' ? values.date_fin : (values.date_fin ?? ""),
      niveau_id: values.niveau_id ?? "",
      categorie_id: values.categorie_id ?? "",
      type_id: values.type_id ?? "",
      nb_jours: typeof values.nb_jours === 'number' ? values.nb_jours : (parseInt(values.nb_jours, 10) || 1),
      type_programme: values.type_programme ?? "libre",
    };
  }

  const [form, setForm] = useState(() => normalizeFormValues({
    type_programme: "libre",
    nom: "",
    description: "",
    niveau_id: "",
    categorie_id: "",
    type_id: "",
    nb_jours: 1,
    objectif: "",
    image_url: "",
    date_debut: "",
    date_fin: "",
    est_actif: true,
    ...(mode === "edit" ? programme : {}),
  }));
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (mode === "edit") {
      setForm(f => normalizeFormValues({ ...f, ...programme }));
    } else if (mode === "new") {
      setForm(normalizeFormValues({}));
    }
  }, [programme, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const hasChanged = React.useMemo(() => {
    // Si on est en édition mais que le programme n'est pas encore chargé, ne pas bloquer
    if (mode === "edit" && !programme) return false;
    if(mode === "detail") return false;
    const clean = obj => {
      const {
        nom, description, objectif, image_url, date_debut, date_fin, niveau_id, categorie_id, type_id, nb_jours, type_programme, est_actif
      } = obj || {};
      return {
        nom: nom ?? "",
        description: description ?? "",
        objectif: objectif ?? "",
        image_url: image_url ?? "",
        date_debut: date_debut ?? "",
        date_fin: date_fin ?? "",
        niveau_id: niveau_id ?? "",
        categorie_id: categorie_id ?? "",
        type_id: type_id ?? "",
        nb_jours: nb_jours ?? 1,
        type_programme: type_programme ?? "libre",
        est_actif: !!est_actif,
      };
    };
    // En mode édition, comparer avec le programme chargé
    // En mode création, comparer avec l'état initial vide
    const reference = mode === "edit" ? programme : {};
    return JSON.stringify(clean(form)) !== JSON.stringify(clean(normalizeFormValues(reference)));
  }, [form, programme, mode]);

  const blocker = useSafeBlocker(
    ({ currentLocation, nextLocation }) => {
      if (mode === "detail") return false;
      return hasChanged;
    }
  );
  const [savingAndQuit, setSavingAndQuit] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

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
    setShowNavigationDialog(false);
    setPendingMode(null);
  };

  // Fonctions pour le suivi de programme
  const handleSuivreProgramme = () => {
    setFollowDialogType('suivre');
    setShowFollowDialog(true);
  };

  const handleArreterProgramme = () => {
    setFollowDialogType('arreter');
    setShowFollowDialog(true);
  };

  const handleChangerProgramme = () => {
    setFollowDialogType('changer');
    setShowFollowDialog(true);
  };

  const handleReprendreProgramme = () => {
    setFollowDialogType('reprendre');
    setShowFollowDialog(true);
  };

  const handleConfirmFollowAction = async () => {
    setFollowLoading(true);
    try {
      let response;
      
      switch (followDialogType) {
        case 'suivre':
          response = await fetch(`${apiUrl}/programmes/utilisateur/suivre`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ programme_id: programme.id })
          });
          break;
        case 'arreter':
          response = await fetch(`${apiUrl}/programmes/utilisateur/arreter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ programme_id: programme.id })
          });
          break;
        case 'reprendre':
          response = await fetch(`${apiUrl}/programmes/utilisateur/reprendre`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ programme_id: programme.id })
          });
          break;
        case 'changer':
          response = await fetch(`${apiUrl}/programmes/utilisateur/changer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ nouveau_programme_id: programme.id })
          });
          break;
        default:
          throw new Error('Type d\'action non reconnu');
      }

      if (response.ok) {
        const data = await response.json();
        setSnackbarMessage(data.message || 'Action effectuée avec succès');
        setSnackbarType('success');
        
        // Recharger le programme actuel et tous les programmes utilisateur
        const [programmeActuelResponse, programmesUtilisateurResponse] = await Promise.all([
          fetch(`${apiUrl}/programmes/utilisateur/actuel`, { credentials: 'include' }),
          fetch(`${apiUrl}/programmes/utilisateur/tous`, { credentials: 'include' })
        ]);
        
        if (programmeActuelResponse.ok) {
          const programmeActuelData = await programmeActuelResponse.json();
          setProgrammeActuel(programmeActuelData);
        }
        
        if (programmesUtilisateurResponse.ok) {
          const programmesUtilisateurData = await programmesUtilisateurResponse.json();
          setProgrammesUtilisateur(programmesUtilisateurData);
        }
      } else {
        const errorData = await response.json();
        setSnackbarMessage(errorData.error || 'Erreur lors de l\'action');
        setSnackbarType('error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'action sur le programme:', error);
      setSnackbarMessage('Erreur lors de l\'action');
      setSnackbarType('error');
    } finally {
      setFollowLoading(false);
      setShowFollowDialog(false);
    }
  };

  const handleCloseFollowDialog = () => {
    setShowFollowDialog(false);
    setFollowDialogType(null);
  };

  // Logique pour le bouton flottant de programme
  const getProgrammeButtonConfig = () => {
    // Ne pas afficher le bouton de suivi en mode édition, création ou édition de structure
    if (mode === "edit" || mode === "new" || editMode || !user) return { show: false };
    
    if (loadingProgrammeActuel) {
      return { show: true, type: 'suivre', disabled: true };
    }
    console.log("programmeActuel", programmeActuel);
    console.log("programmesUtilisateur", programmesUtilisateur);
    // Vérifier si l'utilisateur suit actuellement ce programme
    if (programmeActuel && programmeActuel.id === programme.id) {
      return { 
        show: true, 
        type: 'arreter', 
        onClick: handleArreterProgramme,
        disabled: false
      };
    }
    
    // Vérifier si l'utilisateur a déjà suivi ce programme (mais ne le suit plus)
    const programmeSuivi = programmesUtilisateur.find(p => p.id === programme.id);
    if (programmeSuivi && !programmeSuivi.est_actif) {
      return { 
        show: true, 
        type: 'reprendre', 
        onClick: handleReprendreProgramme,
        disabled: false
      };
    }
    
    // Si l'utilisateur suit un autre programme
    if (programmeActuel) {
      return { 
        show: true, 
        type: 'changer', 
        onClick: handleChangerProgramme,
        disabled: false
      };
    }
    
    // Si l'utilisateur ne suit aucun programme
    return { 
      show: true, 
      type: 'suivre', 
      onClick: handleSuivreProgramme,
      disabled: false
    };
  };

  const programmeButtonConfig = getProgrammeButtonConfig();

  const handleBackClick = () => {
    if (hasChanged) {
      setPendingMode("detail");
      setShowNavigationDialog(true);
    } else {
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
    if (form.type_programme === "calendaire") {
      if (!form.date_debut || !form.date_fin) {
        setFormError("Les dates de début et de fin sont obligatoires pour un programme calendaire.");
        return;
      }
      if (form.date_debut > form.date_fin) {
        setFormError("La date de début doit être antérieure à la date de fin.");
        return;
      }
    }
    handleUpdate(form);
  };

  const handleUpdate = async (form, options = {}) => {
    try {
      // Conversion des IDs vides en null
      const body = {
        ...form,
        niveau_id: form.niveau_id ? parseInt(form.niveau_id, 10) : null,
        categorie_id: form.categorie_id ? parseInt(form.categorie_id, 10) : null,
        type_id: form.type_id ? parseInt(form.type_id, 10) : null,
      };
      if (mode === "edit" && id && id !== "new") {
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
        //setMode("detail");
        // Recharge le programme depuis l'API pour avoir les bonnes valeurs
        fetch(`${apiUrl}/programmes/${data.id}`)
          .then(res => res.json())
          .then(data => setProgramme(data));
        if (id !== String(data.id)) {
          navigate(`/programmes/${data.id}`, { replace: true });
        }
        setSnackbarMessage("Programme mis à jour avec succès !");
        setSnackbarType("success");
      } else {
        const response = await fetch(`${apiUrl}/programmes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Erreur lors de la création du programme");
        const data = await response.json();
        const newId = data.id || (data.programme && data.programme.id);
        navigate(`/programmes/${newId}`, { replace: true });
        setMode("detail");
        // Recharge le programme depuis l'API pour avoir les bonnes valeurs
        fetch(`${apiUrl}/programmes/${newId}`)
          .then(res => res.json())
          .then(data => setProgramme(data));
        setSnackbarMessage("Programme créé avec succès !");
        setSnackbarType("success");
      }
    } catch (err) {
      setError(err.message);
      setSnackbarMessage("Erreur lors de la sauvegarde du programme.");
      setSnackbarType("error");
    }
  };

  // Suppression du programme
  const handleDelete = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/programmes/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression du programme");
      navigate("/programmes");
      setSnackbarMessage("Programme supprimé avec succès !");
      setSnackbarType("success");
    } catch (err) {
      setError(err.message);
      setSnackbarMessage("Erreur lors de la suppression du programme.");
      setSnackbarType("error");
    } finally {
      setSaving(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <Layout pageTitle="Détail du programme"><div className="text-center text-gray-400 py-10" aria-label="Chargement en cours">...</div></Layout>;
  if (error) return <Layout pageTitle="Détail du programme"><div className="text-center text-red-400 py-10">{error}</div></Layout>;

  // Mode édition ou création
  if (mode === "edit" || mode === "new") {
    return (
      <Layout 
        pageTitle={mode === "edit" ? "Modifier le programme" : "Créer un programme"} 
        backTo="/programmes" 
        backLabel="Retour à la liste des programmes"
        onBackClick={handleBackClick}
      >
        <div className="w-full flex items-center justify-center px-4 text-white mt-4">
          <div className="w-full max-w-4xl space-y-8 mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-400 text-center mb-2">{error}</div>}
              <FloatingLabelInput
                label="Nom *"
                name="nom"
                value={form.nom || ""}
                onChange={handleChange}
                required
                placeholder="Nom du programme"
              />
              <FloatingLabelInput
                label="Description"
                name="description"
                as="textarea"
                value={form.description || ""}
                onChange={handleChange}
                placeholder="Description du programme"
              />
              <FloatingLabelInput
                label="Objectif"
                name="objectif"
                value={form.objectif || ""}
                onChange={handleChange}
                placeholder="Objectif du programme"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput
                  as="select"
                  label="Niveau"
                  name="niveau_id"
                  value={form.niveau_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" className="bg-gray-700 text-gray-400">Sélectionner un niveau</option>
                  {niveaux.map(n => (
                    <option key={n.id} value={n.id} className={'bg-gray-700 text-white'}>{n.nom}</option>
                  ))}
                </FloatingLabelInput>
                <FloatingLabelInput
                  as="select"
                  label="Catégorie"
                  name="categorie_id"
                  value={form.categorie_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" className="bg-gray-700 text-gray-400">Sélectionner une catégorie</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-gray-700 text-white">{c.nom}</option>
                  ))}
                </FloatingLabelInput>
                <FloatingLabelInput
                  as="select"
                  label="Type"
                  name="type_id"
                  value={form.type_id || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" className="bg-gray-700 text-gray-400">Sélectionner un type</option>
                  {types.map(t => (
                    <option key={t.id} value={t.id} className="bg-gray-700 text-white">{t.nom}</option>
                  ))}
                </FloatingLabelInput>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white">Type de programme</label>
                <div className="flex gap-4">
                  <CustomRadio
                    label="Libre (nombre de jours, sans dates fixes)"
                    name="type_programme"
                    value="libre"
                    checked={form.type_programme === "libre"}
                    onChange={handleChange}
                  />
                  <CustomRadio
                    label="Calendaire (dates fixes)"
                    name="type_programme"
                    value="calendaire"
                    checked={form.type_programme === "calendaire"}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {form.type_programme === "libre" && (
                <FloatingLabelInput
                  label="Nombre de jours"
                  type="number"
                  name="nb_jours"
                  value={form.nb_jours ?? 1}
                  min={1}
                  onChange={handleChange}
                />
              )}
              {form.type_programme === "calendaire" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingLabelInput
                      label="Date de début"
                      type="date"
                      name="date_debut"
                      value={form.date_debut || ""}
                      onChange={handleChange}
                    />
                    <FloatingLabelInput
                      label="Date de fin"
                      type="date"
                      name="date_fin"
                      value={form.date_fin || ""}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                <Switch
                  checked={!!form.est_actif}
                  onChange={val => setForm(prev => ({ ...prev, est_actif: val }))}
                  id="switch-est-actif"
                />
                <label htmlFor="switch-est-actif" className="text-sm font-medium text-white select-none cursor-pointer">Activer le programme</label>
              </div>
              {formError && <div className="text-red-400 text-center mb-4">{formError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={() => {
                    if (programme && id !== String(programme.id)) {
                      navigate(`/programmes/${programme.id}`, { replace: true });
                    }
                    setMode("detail");
                  }}
                  disabled={loading}
                >
                  Annuler
                </button>
              </div>
              <FloatingSaveButton
                show={hasChanged}
                onClick={handleSubmit}
                loading={loading}
                label="Enregistrer"
              />

            </form>
          </div>
        </div>
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
  if (!programme) {
    return (
      <Layout pageTitle="Détail du programme" backTo="/programmes" backLabel="Retour à la liste des programmes">
        <div className="text-center text-gray-400 py-10">Programme introuvable.</div>
      </Layout>
    );
  }
  return (
    <Layout
      pageTitle={programme?.nom || "Détail du programme"}
      backTo="/programmes"
      backLabel="Retour à la liste des programmes"
      {...((isCreator || isAdmin) ? {
        pageActions: [
          { icon: <Pencil size={20} className="text-white" />, label: 'Modifier', onClick: () => setMode('edit') },
          { icon: <Layers size={20} className="text-white" />, label: 'Gérer les séances', onClick: () => setEditMode(e => !e) },
          { icon: <Trash2 size={20} className="text-red-400" />, label: 'Supprimer', onClick: () => setShowDeleteDialog(true), disabled: saving }
        ]
      } : {})}
    >
      <div className="w-full flex justify-center mt-4 px-2 sm:px-4 md:px-12">
        <div className="bg-black/40 border border-gray-700 rounded-2xl shadow-lg w-full max-w-none mx-auto p-4 sm:p-4 md:p-6 xl:px-8 xl:py-6" style={{maxWidth: '1800px'}}>
          {/* Badges arrondis façon HACS, valeurs seules */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Niveau du programme">
              <BarChart2 size={14} className="inline-block text-gray-300 mr-1" />
              {getNomNiveau(programme.niveau_id)}
            </span>
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Catégorie du programme">
              <Tag size={14} className="inline-block text-gray-300 mr-1" />
              {getNomCategorie(programme.categorie_id)}
            </span>
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Type du programme">
              <Layers size={14} className="inline-block text-gray-300 mr-1" />
              {getNomType(programme.type_id)}
            </span>
            <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Auteur du programme">
              <User size={14} className="inline-block text-gray-300 mr-1" />
              {programme.pseudo_createur || <span className="italic text-gray-400">Inconnu</span>}
            </span>
            <span className={
              "rounded-full px-4 py-1 text-xs font-semibold border flex items-center gap-1 " +
              (programme.est_actif
                ? "bg-green-900/80 border-green-700 text-green-300"
                : "bg-gray-800/80 border-gray-700 text-gray-400")
            } title={programme.est_actif ? "Programme actif" : "Programme inactif"}>
              {programme.est_actif ? <CheckCircle size={14} className="inline-block text-green-300 mr-1" /> : <XCircle size={14} className="inline-block text-gray-400 mr-1" />}
              {programme.est_actif ? "Actif" : "Inactif"}
            </span>
            {programme.created_at && (
              <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Date de création">
                <Calendar size={14} className="inline-block text-gray-300 mr-1" />
                {new Date(programme.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
            {programme.updated_at && (
              <span className="rounded-full border border-gray-600 text-white px-4 py-1 text-xs font-semibold bg-transparent flex items-center gap-1" title="Date de dernière modification">
                <Pencil size={14} className="inline-block text-gray-300 mr-1" />
                {new Date(programme.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2 text-rose-400">{programme.nom}</h2>
          
          {/* Description */}
          <p className="text-gray-300 italic mb-6 whitespace-pre-line">
            {programme.description || <span className="italic text-gray-500">Aucune description</span>}
          </p>

          {/* Infos supplémentaires façon sections HACS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
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
          </div>

          {/* --- Liste des séances associées (édition si droits) --- */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-orange-300 mb-4">Séances du programme</h3>
            {/* Bouton flottant pour quitter l'édition des séances */}
            {isCreator && editMode && (
              <FloatingSaveButton
                show={editMode}
                onClick={() => setEditMode(false)}
                label="Terminer l'édition"
              />
            )}
            {loadingSeances ? (
              <div className="text-gray-400 italic">Chargement des séances...</div>
            ) : errorSeances ? (
              <div className="text-red-400 italic">{errorSeances}</div>
            ) : items.length === 0 ? (
              <div className="text-gray-500 italic">Aucune séance associée à ce programme.</div>
            ) : (
              <div className="space-y-6">
                {programme.type_programme === 'calendaire'
                  ? items.map(({ date, seances }) => (
                      <div key={date} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="rounded-full bg-orange-900/60 text-orange-200 px-3 py-1 text-xs font-semibold">{new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                                <Plus size={16} className="inline mr-1" /> Créer une nouvelle séance
                              </button>
                            </>
                          )}
                        </div>
                        {seances.length === 0 ? (
                          <div className="text-gray-500 italic">Aucune séance</div>
                        ) : (
                          <ul className="space-y-2">
                            {seances.map(seance => {
                              const isOpen = openSeanceAccordions.includes(seance.id);
                              const isInstruction = seance.type_seance === "instruction";
                              
                              return (
                                <li key={seance.id} className="bg-gray-800/60 rounded-lg">
                                  {isInstruction ? (
                                    // Affichage pour les instructions
                                    <div className="px-4 py-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white">{seance.nom}</span>
                                            <span className="text-xs text-orange-300 bg-orange-900/60 px-2 py-1 rounded-full">Instruction</span>
                                          </div>
                                          {seance.description && (
                                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                                              {seance.description}
                                            </p>
                                          )}
                                        </div>
                                        {editMode && isCreator && (
                                          <button
                                            className="ml-2 text-red-400 hover:text-red-600 text-sm px-2 py-1 flex items-center gap-1"
                                            onClick={() => handleRemoveSeance(date, seance.id)}
                                            type="button"
                                          >
                                            <Trash2 size={16} /> Retirer
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    // Affichage pour les séances d'exercices (comportement existant)
                                    <>
                                      <button type="button" className="w-full flex items-center px-4 py-3 focus:outline-none" onClick={() => toggleSeanceAccordion(seance.id)}>
                                        <svg className={`w-5 h-5 mr-3 transition-transform text-white ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        <div>
                                          <span className="font-semibold text-white">{seance.nom}</span>
                                          <span className="ml-2 text-xs text-gray-400">{seance.type_nom}</span>
                                        </div>
                                        {editMode && isCreator && (
                                          <button
                                            className="ml-auto text-red-400 hover:text-red-600 text-sm px-2 py-1 flex items-center gap-1"
                                            onClick={e => { e.stopPropagation(); handleRemoveSeance(date, seance.id); }}
                                            type="button"
                                          >
                                            <Trash2 size={16} /> Retirer
                                          </button>
                                        )}
                                      </button>
                                      <div
                                        className="p-4 pt-0 transition-all duration-300 ease-in-out overflow-hidden"
                                        style={{
                                          maxHeight: isOpen ? 600 : 0,
                                          opacity: isOpen ? 1 : 0,
                                          paddingTop: 0,
                                          paddingBottom: isOpen ? 16 : 0
                                        }}
                                        aria-hidden={!isOpen}
                                      >
                                        {seance.structure && seance.structure.length > 0 && (
                                          <div className="pl-4">
                                            <SeanceStructure structure={seance.structure} />
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ))
                  : [...Array(programme.nb_jours || 0)].map((_, i) => {
                      const jour = i + 1;
                      const found = items.find(j => j.jour === jour);
                      const seances = found ? found.seances : [];
                      return (
                        <div key={jour} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="rounded-full bg-orange-900/60 text-orange-200 px-3 py-1 text-xs font-semibold">Jour {jour}</span>
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
                                  onClick={() => handleCreateSeance(jour)}
                                  type="button"
                                >
                                  <Plus size={16} className="inline mr-1" /> Créer une nouvelle séance
                                </button>
                              </>
                            )}
                          </div>
                          {(!seances || seances.length === 0) ? (
                            <div className="text-gray-500 italic">Aucune séance</div>
                          ) : (
                            <ul className="space-y-2">
                              {seances.map(seance => {
                                const isOpen = openSeanceAccordions.includes(seance.id);
                                const isInstruction = seance.type_seance === "instruction";
                                
                                return (
                                  <li key={seance.id} className="bg-gray-800/60 rounded-lg">
                                    {isInstruction ? (
                                      // Affichage pour les instructions
                                      <div className="px-4 py-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold text-white">{seance.nom}</span>
                                              <span className="text-xs text-orange-300 bg-orange-900/60 px-2 py-1 rounded-full">Instruction</span>
                                            </div>
                                            {seance.description && (
                                              <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                                                {seance.description}
                                              </p>
                                            )}
                                          </div>
                                          {editMode && isCreator && (
                                            <button
                                              className="ml-2 text-red-400 hover:text-red-600 text-sm px-2 py-1 flex items-center gap-1"
                                              onClick={() => handleRemoveSeance(jour, seance.id)}
                                              type="button"
                                            >
                                              <Trash2 size={16} /> Retirer
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      // Affichage pour les séances d'exercices (comportement existant)
                                      <>
                                        <button type="button" className="w-full flex items-center px-4 py-3 focus:outline-none" onClick={() => toggleSeanceAccordion(seance.id)}>
                                          <svg className={`w-5 h-5 mr-3 transition-transform text-white ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                          <div>
                                            <span className="font-semibold text-white">{seance.nom}</span>
                                            <span className="ml-2 text-xs text-gray-400">{seance.type_nom}</span>
                                          </div>
                                          {editMode && isCreator && (
                                            <button
                                              className="ml-auto text-red-400 hover:text-red-600 text-sm px-2 py-1 flex items-center gap-1"
                                              onClick={e => { e.stopPropagation(); handleRemoveSeance(jour, seance.id); }}
                                              type="button"
                                            >
                                              <Trash2 size={16} /> Retirer
                                            </button>
                                          )}
                                        </button>
                                        <div
                                          className="p-4 pt-0 transition-all duration-300 ease-in-out overflow-hidden"
                                          style={{
                                            maxHeight: isOpen ? 600 : 0,
                                            opacity: isOpen ? 1 : 0,
                                            paddingTop: 0,
                                            paddingBottom: isOpen ? 16 : 0
                                          }}
                                          aria-hidden={!isOpen}
                                        >
                                          {seance.structure && seance.structure.length > 0 && (
                                            <div className="pl-4">
                                              <SeanceStructure structure={seance.structure} />
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}
              </div>
            )}
          </div>
          {/* --- Fin liste séances --- */}

          {/* Image */}
          {programme.image_url && (
            <div className="mt-4 flex justify-center">
              <img src={programme.image_url} alt="Illustration du programme" className="max-h-48 rounded-lg border border-gray-700" />
            </div>
          )}
        </div>
      </div>
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#18191a] border border-gray-700 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-red-400 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-200 mb-6">Voulez-vous vraiment supprimer ce programme ? Cette action est irréversible.</p>
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
      
      {/* Bouton flottant pour le suivi de programme */}
      <FloatingProgrammeButton
        show={programmeButtonConfig.show}
        onClick={programmeButtonConfig.onClick}
        type={programmeButtonConfig.type}
        loading={followLoading}
        disabled={programmeButtonConfig.disabled}
      />
      
      {/* Dialogue de confirmation pour le suivi de programme */}
      <ProgrammeFollowDialog
        open={showFollowDialog}
        onClose={handleCloseFollowDialog}
        onConfirm={handleConfirmFollowAction}
        type={followDialogType}
        programme={programme}
        programmeActuel={programmeActuel}
        loading={followLoading}
      />
      
    </Layout>
  );
} 