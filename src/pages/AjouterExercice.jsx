import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function AjouterExercice() {
  const navigate = useNavigate();
  const { user, ready } = useUser();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [groupesMusculaires, setGroupesMusculaires] = useState([]);
  const [niveaux, setNiveaux] = useState([]);

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
        fetch(`${apiUrl}/exercices/categories/list`),
        fetch(`${apiUrl}/exercices/groupes/list`),
        fetch(`${apiUrl}/exercices/niveaux/list`)
      ]);

      const categoriesData = await categoriesRes.json();
      const groupesData = await groupesRes.json();
      const niveauxData = await niveauxRes.json();

      setCategories(categoriesData.categories || []);
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

    setLoading(true);

    try {
      // Convertir les champs texte en tableaux et préparer les données
      const exerciceData = {
        nom: formData.nom,
        description: formData.description,
        position_depart: formData.position_depart,
        categorie_id: formData.categorie_id || null,
        groupe_musculaire_id: formData.groupe_musculaire_id || null,
        niveau_id: formData.niveau_id || null,
        duree_estimee: formData.duree_par_repetition ? parseInt(formData.duree_par_repetition) : null,
        calories_estimees: formData.calories_estimees ? parseInt(formData.calories_estimees) : null,
        muscles_sollicites: formData.muscles_sollicites.split(',').map(s => s.trim()).filter(s => s),
        erreurs: formData.erreurs.split(',').map(s => s.trim()).filter(s => s),
        variantes: {
          plus_difficiles: formData.variantes_plus_difficiles.split(',').map(s => s.trim()).filter(s => s),
          plus_faciles: formData.variantes_plus_faciles.split(',').map(s => s.trim()).filter(s => s)
        },
        conseils: formData.conseils.split(',').map(s => s.trim()).filter(s => s),
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
                    min="1"
                    max="50"
                    placeholder="ex: 8"
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
                  placeholder="ex: triceps brachial, pectoral majeur, deltoïde antérieur"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des virgules</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Erreurs communes (phrases complètes)</label>
                <input
                  type="text"
                  value={formData.erreurs}
                  onChange={(e) => handleInputChange('erreurs', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Pense à garder les hanches alignées, Garde le dos droit"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des virgules. Utilisez des phrases complètes qui pourront être lues vocalement.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Variantes plus faciles</label>
                <input
                  type="text"
                  value={formData.variantes_plus_faciles}
                  onChange={(e) => handleInputChange('variantes_plus_faciles', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Sur les genoux, Avec support"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des virgules</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Variantes plus difficiles</label>
                <input
                  type="text"
                  value={formData.variantes_plus_difficiles}
                  onChange={(e) => handleInputChange('variantes_plus_difficiles', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Avec élévation des pieds, Avec poids"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des virgules</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Conseils (phrases complètes)</label>
                <input
                  type="text"
                  value={formData.conseils}
                  onChange={(e) => handleInputChange('conseils', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white placeholder-gray-400"
                  placeholder="ex: Garde le corps aligné de la tête aux pieds, Contrôle la descente et la montée"
                />
                <p className="text-xs text-gray-400 mt-1">Séparer par des virgules. Utilisez des phrases complètes qui pourront être lues vocalement.</p>
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