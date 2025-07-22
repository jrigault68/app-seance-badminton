import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Eye, Clock, User, Calendar } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import Snackbar from '../components/Snackbar';

export default function AdminExercices() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercice, setSelectedExercice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('pending'); // 'pending', 'validated', 'all'
  const [selectedIds, setSelectedIds] = useState([]);
  const [snackbar, setSnackbar] = useState(null);

  // Sélectionner/désélectionner un exercice
  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  // Sélectionner/désélectionner tous les exercices en attente
  const toggleSelectAll = () => {
    const idsToSelect = exercices.filter(e => !e.is_validated).map(e => e.id);
    if (selectedIds.length === idsToSelect.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(idsToSelect);
    }
  };
  // Valider la sélection
  const validerSelection = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      for (const id of selectedIds) {
        await validerExercice(id, true); // true = pas d'alerte individuelle
      }
      setSelectedIds([]);
      await chargerExercices();
      setSnackbar(`${selectedIds.length} exercice(s) validé(s) !`);
      setTimeout(() => setSnackbar(null), 3000);
    } catch (error) {
      setSnackbar('Erreur lors de la validation groupée.');
      setTimeout(() => setSnackbar(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  // Refuser la sélection
  const refuserSelection = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter les exercices sélectionnés ?')) return;
    setLoading(true);
    try {
      for (const id of selectedIds) {
        await rejeterExercice(id, true);
      }
      setSelectedIds([]);
      await chargerExercices();
      setSnackbar(`${selectedIds.length} exercice(s) rejeté(s) !`);
      setTimeout(() => setSnackbar(null), 3000);
    } catch (error) {
      setSnackbar('Erreur lors du rejet groupé.');
      setTimeout(() => setSnackbar(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/admin-exercices' } });
      return;
    }
    
    // Vérifier si l'utilisateur est admin
    if (!user.is_admin) {
      alert('Accès refusé. Vous devez être administrateur pour accéder à cette page.');
      navigate('/');
      return;
    }
    
    chargerExercices();
  }, [user, navigate, filter]);

  const chargerExercices = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      let url = `${apiUrl}/exercices`;
      if (filter === 'pending') {
        url += '?is_validated=false';
      } else if (filter === 'validated') {
        url += '?is_validated=true';
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      setExercices(data.exercices || []);
    } catch (error) {
      console.error('Erreur lors du chargement des exercices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modifie validerExercice et rejeterExercice pour ne plus appeler chargerExercices
  const validerExercice = async (id, noAlert) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/exercices/${id}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ validated_by: user.id })
      });

      if (response.ok) {
        if (!noAlert) alert('Exercice validé avec succès !');
        // NE PAS recharger la liste ici
      } else {
        const error = await response.json();
        if (!noAlert) alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      if (!noAlert) alert('Erreur lors de la validation');
    }
  };
  const rejeterExercice = async (id, noAlert) => {
    if (!noAlert && !confirm('Êtes-vous sûr de vouloir rejeter cet exercice ?')) {
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/exercices/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        if (!noAlert) alert('Exercice rejeté et supprimé !');
        // NE PAS recharger la liste ici
      } else {
        const error = await response.json();
        if (!noAlert) alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      if (!noAlert) alert('Erreur lors du rejet');
    }
  };

  // Fonction pour valider tous les exercices en attente
  const validerTout = async () => {
    const aValider = exercices.filter(e => !e.is_validated);
    if (aValider.length === 0) return;
    setLoading(true);
    try {
      for (const exo of aValider) {
        await validerExercice(exo.id);
      }
      await chargerExercices();
      alert('Tous les exercices en attente ont été validés !');
    } catch (error) {
      alert('Erreur lors de la validation en masse.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-red-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Administration des exercices</h1>
                <p className="text-gray-400 text-sm">Gestion et validation des exercices soumis</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Connecté en tant que</p>
              <p className="font-semibold">{user?.email || user?.nom}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filter === 'pending' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Clock size={16} />
            En attente ({exercices.filter(e => !e.is_validated).length})
          </button>
          <button
            onClick={() => setFilter('validated')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filter === 'validated' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Check size={16} />
            Validés ({exercices.filter(e => e.is_validated).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Eye size={16} />
            Tous ({exercices.length})
          </button>
        </div>
        {/* Sélection groupée */}
        {filter === 'pending' && exercices.filter(e => !e.is_validated).length > 0 && (
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <label className="inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedIds.length === exercices.filter(e => !e.is_validated).length}
                  onChange={toggleSelectAll}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-2 text-white font-semibold">Sélectionner tous</span>
              </label>
            </div>
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={validerSelection}
                  className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded-lg text-white font-semibold disabled:opacity-50"
                  disabled={loading}
                >
                  Valider la sélection
                </button>
                <button
                  onClick={refuserSelection}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg text-white font-semibold disabled:opacity-50"
                  disabled={loading}
                >
                  Refuser la sélection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Liste des exercices */}
        <div className="space-y-4">
          {exercices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {filter === 'pending' ? 'Aucun exercice en attente de validation' :
                 filter === 'validated' ? 'Aucun exercice validé' :
                 'Aucun exercice trouvé'}
              </p>
            </div>
          ) : (
            exercices.map((exercice) => (
              <div
                key={exercice.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Case à cocher pour la sélection */}
                      {!exercice.is_validated && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(exercice.id)}
                          onChange={() => toggleSelect(exercice.id)}
                          className="form-checkbox h-5 w-5 text-green-600 mr-2"
                        />
                      )}
                      <h3 className="text-xl font-semibold">{exercice.nom}</h3>
                      {exercice.is_validated ? (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full flex items-center gap-1">
                          <Check size={12} />
                          Validé
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full flex items-center gap-1">
                          <Clock size={12} />
                          En attente
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-3">{exercice.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>Créé par: {exercice.created_by || 'Anonyme'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Créé le: {formatDate(exercice.created_at)}</span>
                      </div>
                      {exercice.validated_by && (
                        <div className="flex items-center gap-2">
                          <Check size={14} />
                          <span>Validé par: {exercice.validated_by}</span>
                        </div>
                      )}
                    </div>

                    {/* Détails de l'exercice */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {exercice.categorie_nom && (
                        <div>
                          <span className="text-gray-500">Catégorie:</span>
                          <p className="text-white">{exercice.categorie_nom}</p>
                        </div>
                      )}
                      {exercice.groupe_musculaire_nom && (
                        <div>
                          <span className="text-gray-500">Groupe musculaire:</span>
                          <p className="text-white">{exercice.groupe_musculaire_nom}</p>
                        </div>
                      )}
                      {exercice.niveau_nom && (
                        <div>
                          <span className="text-gray-500">Niveau:</span>
                          <p className="text-white">{exercice.niveau_nom}</p>
                        </div>
                      )}
                      {exercice.duree_estimee && (
                        <div>
                          <span className="text-gray-500">Durée:</span>
                          <p className="text-white">{exercice.duree_estimee}s</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!exercice.is_validated && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => validerExercice(exercice.id)}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        title="Valider l'exercice"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => rejeterExercice(exercice.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        title="Rejeter l'exercice"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Snackbar notification */}
      <Snackbar message={snackbar} type="success" onClose={() => setSnackbar(null)} />
    </div>
  );
} 