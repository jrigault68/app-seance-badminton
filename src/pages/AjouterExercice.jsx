import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, HelpCircle, Copy } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function AjouterExercice() {
  const navigate = useNavigate();
  const { user, ready } = useUser();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [groupesMusculaires, setGroupesMusculaires] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [copied, setCopied] = useState({ json: false, prompt: false });

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 1500);
  };

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    position_depart: '',
    categorie_id: '',
    groupe_musculaire_id: '',
    niveau_id: '',
    duree_par_repetition: '',
    calories_estimees: '',
    muscles_sollicites: '',
    erreurs: '',
    variantes_plus_difficiles: '',
    variantes_plus_faciles: '',
    conseils: ''
  });

  useEffect(() => {
    // Charger les données de référence une fois que l'utilisateur est connecté
    if (user && ready) {
      chargerDonneesReference();
    }
  }, [user, ready]);

  const chargerDonneesReference = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Charger les données de référence
      const [categoriesRes, groupesRes, niveauxRes] = await Promise.all([
        fetch(`${apiUrl}/categories`),
        fetch(`${apiUrl}/exercices/groupes/list`),
        fetch(`${apiUrl}/exercices/niveaux/list`)
      ]);
      const categoriesData = await categoriesRes.json();
      // Correction : la réponse est un tableau direct
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      const groupesData = await groupesRes.json();
      const niveauxData = await niveauxRes.json();
      setGroupesMusculaires(groupesData.groupes || []);
      setNiveaux(niveauxData.niveaux || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.description) {
      alert('Veuillez remplir les champs obligatoires (Nom, Description)');
      return;
    }
    if (formData.calories_estimees && parseFloat(formData.calories_estimees) < 0) {
      alert('Les calories estimées doivent être un nombre positif.');
      return;
    }

    setLoading(true);

    try {
      // Générer l'id à partir du nom (sans accents, minuscules, _)
      let generatedId = formData.nom
        .toLowerCase()
        .normalize('NFD').replace(/\p{Diacritic}/gu, '') // enlève tous les accents unicode
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      if (!generatedId) generatedId = 'exercice_' + Date.now();
      // Convertir les champs texte en tableaux et préparer les données
      const exerciceData = {
        id: generatedId,
        nom: formData.nom,
        description: formData.description,
        position_depart: formData.position_depart,
        categorie_id: formData.categorie_id || null,
        groupe_musculaire_id: formData.groupe_musculaire_id || null,
        niveau_id: formData.niveau_id || null,
        duree_estimee: formData.duree_par_repetition ? parseFloat(String(formData.duree_par_repetition).replace(',', '.')) : null,
        calories_estimees: formData.calories_estimees ? parseFloat(String(formData.calories_estimees).replace(',', '.')) : null,
        muscles_sollicites: String(formData.muscles_sollicites).split(';').map(s => s.trim()).filter(s => s),
        erreurs: formData.erreurs.split(';').map(s => s.trim()).filter(s => s),
        variantes: {
          plus_difficiles: formData.variantes_plus_difficiles.split(';').map(s => s.trim()).filter(s => s),
          plus_faciles: formData.variantes_plus_faciles.split(';').map(s => s.trim()).filter(s => s)
        },
        conseils: formData.conseils.split(';').map(s => s.trim()).filter(s => s),
        materiel: [],
        created_by: user.id
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/exercices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciceData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Exercice créé avec succès ! Il sera visible après validation par un administrateur.');
        navigate('/recherche');
      } else {
        alert(`Erreur: ${data.error || 'Erreur lors de la création'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de l\'exercice');
    } finally {
      setLoading(false);
    }
  };

  // Champs obligatoires pour l'import
  const champsObligatoires = ['nom', 'description'];

  const handleImportJson = () => {
    setImportError('');
    let data;
    try {
      data = JSON.parse(importJsonText);
    } catch (e) {
      setImportError('Le texte n\'est pas un JSON valide.');
      return;
    }
    // Vérification des champs obligatoires
    for (const champ of champsObligatoires) {
      if (!data[champ] || typeof data[champ] !== 'string' || !data[champ].trim()) {
        setImportError(`Le champ obligatoire '${champ}' est manquant ou vide.`);
        return;
      }
    }
    // Correction des variantes et durée
    const variantes = data.variantes || { plus_faciles: [], plus_difficiles: [] };
    // Correction durée
    let duree = data.duree_estimee;
    if (typeof duree === 'string') {
      duree = parseFloat(duree.replace(',', '.'));
    }
    setFormData(prev => ({
      ...prev,
      ...data,
      variantes_plus_faciles: (variantes.plus_faciles || []).join('; '),
      variantes_plus_difficiles: (variantes.plus_difficiles || []).join('; '),
      duree_par_repetition: duree || '',
      erreurs: (data.erreurs || []).join('; '),
      conseils: (data.conseils || []).join('; '),
      muscles_sollicites: (data.muscles_sollicites || []).join('; '),
    }));
    setShowImportDialog(false);
    setImportJsonText('');
    setImportError('');
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportJsonText(event.target.result);
    };
    reader.readAsText(file);
  };

  // Exemple de modèle JSON minimal et complet
  const exempleJson = `{
  "nom": "Marche active sur place",
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

  // Directives importantes sur le format des textes
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

  // Prompt IA concis avec directives importantes et structure JSON intégrée
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

  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/recherche')}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors md:hidden"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <button
            onClick={() => navigate('/recherche')}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
            <span className="text-white">Retour</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Créer un exercice</h1>
          <div className="w-8 md:w-20"></div> {/* Spacer pour centrer le titre */}
        </div>

        {/* Boutons Import JSON & Aide */}
        <div className="flex justify-end mb-2 gap-2">
          <button
            type="button"
            onClick={() => setShowImportDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Upload size={18} /> Importer JSON
          </button>
        </div>

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
                ✕
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
                ✕
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
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                  onClick={() => setShowHelpDialog(false)}
                >Fermer</button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-gray-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                Informations de base
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Pompes en diamant"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="Description détaillée de l'exercice..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Position de départ</label>
                <textarea
                  value={formData.position_depart}
                  onChange={(e) => handleInputChange('position_depart', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Position de planche avec les mains jointes..."
                />
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                Classification
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Catégorie</label>
                  <select
                    value={formData.categorie_id}
                    onChange={(e) => handleInputChange('categorie_id', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Groupe musculaire</label>
                  <select
                    value={formData.groupe_musculaire_id}
                    onChange={(e) => handleInputChange('groupe_musculaire_id', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                  >
                    <option value="">Sélectionner...</option>
                    {groupesMusculaires.map(groupe => (
                      <option key={groupe.id} value={groupe.id}>{groupe.nom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Niveau</label>
                  <select
                    value={formData.niveau_id}
                    onChange={(e) => handleInputChange('niveau_id', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                  >
                    <option value="">Sélectionner...</option>
                    {niveaux.map(niveau => (
                      <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Durée par répétition (secondes)</label>
                  <input
                    type="number"
                    value={formData.duree_par_repetition}
                    onChange={(e) => handleInputChange('duree_par_repetition', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                    min="1"
                    max="300"
                    placeholder="ex: 45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Calories estimées</label>
                  <input
                    type="number"
                    value={formData.calories_estimees}
                    onChange={(e) => handleInputChange('calories_estimees', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                    min="0.01"
                    step="0.01"
                    placeholder="ex: 0.5"
                  />
                </div>
              </div>
            </div>

            {/* Détails techniques */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                Détails techniques
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Muscles sollicités</label>
                <input
                  type="text"
                  value={formData.muscles_sollicites}
                  onChange={(e) => handleInputChange('muscles_sollicites', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: triceps brachial; pectoral majeur; deltoïde antérieur"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des points-virgules</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Erreurs communes (phrases complètes)</label>
                <input
                  type="text"
                  value={formData.erreurs}
                  onChange={(e) => handleInputChange('erreurs', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Pense à garder les hanches alignées; Garde le dos droit"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des points-virgules. Utilisez des phrases complètes qui pourront être lues vocalement.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Variantes plus faciles</label>
                <input
                  type="text"
                  value={formData.variantes_plus_faciles}
                  onChange={(e) => handleInputChange('variantes_plus_faciles', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Sur les genoux; Avec support"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des points-virgules</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Variantes plus difficiles</label>
                <input
                  type="text"
                  value={formData.variantes_plus_difficiles}
                  onChange={(e) => handleInputChange('variantes_plus_difficiles', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Avec élévation des pieds; Avec poids"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des points-virgules</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Conseils (phrases complètes)</label>
                <input
                  type="text"
                  value={formData.conseils}
                  onChange={(e) => handleInputChange('conseils', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Garde le corps aligné de la tête aux pieds; Contrôle la descente et la montée"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des points-virgules. Utilisez des phrases complètes qui pourront être lues vocalement.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/recherche')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 text-white"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Créer l'exercice
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Note d'information */}
        <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h3 className="font-semibold text-blue-300 mb-2">💡 Information</h3>
          <p className="text-sm text-gray-300">
            Votre exercice sera soumis pour validation par un administrateur. 
            Une fois validé, il sera disponible dans la base d'exercices pour tous les utilisateurs.
          </p>
        </div>
      </div>
    </div>
  );
} 