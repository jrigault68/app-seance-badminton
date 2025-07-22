import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StyledButton from "@/components/StyledButton";
import SeanceService from "@/services/seanceService";
import { estimerDureeEtape } from "@/utils/helpers";
import { Plus } from "lucide-react";

export default function RechercheSeances() {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    niveau: '',
    type_seance: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadSeances();
  }, [filters]);

  const loadSeances = async () => {
    try {
      setLoading(true);
      const data = await SeanceService.getSeances({
        ...filters,
        limit: 20,
        est_publique: true
      });
      
      // Filtrer les séances qui ont une structure d'exercices
      const seancesAvecStructure = (data.seances || []).filter(seance => 
        seance.structure && 
        Array.isArray(seance.structure) && 
        seance.structure.length > 0
      );
      
      setSeances(seancesAvecStructure);
    } catch (err) {
      console.error("Erreur lors du chargement des séances:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeanceClick = (seanceId) => {
    navigate(`/seance/${seanceId}`);
  };

  const handleAddExercice = () => {
    navigate('/ajouter-exercice');
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

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'mobilité': return '🔄';
      case 'renforcement': return '💪';
      case 'cardio': return '❤️';
      case 'étirement': return '🧘';
      case 'gainage': return '🛡️';
      case 'échauffement': return '🔥';
      case 'récupération': return '🌿';
      default: return '🏋️';
    }
  };

  const calculerDureeReelle = (structure) => {
    if (!structure || !Array.isArray(structure)) return 0;
    
    return structure.reduce((total, etape) => {
      return total + estimerDureeEtape(etape);
    }, 0);
  };

  const formatDuree = (secondes) => {
    if (!secondes || secondes === 0) return 'Non calculée';
    
    const heures = Math.floor(secondes / 3600);
    const minutes = Math.floor((secondes % 3600) / 60);
    
    if (heures > 0) {
      return `${heures}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `${minutes}min`;
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center px-4">
        <div className="max-w-6xl w-full space-y-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement des séances...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center px-4">
      <div className="max-w-6xl w-full space-y-6">
        {/* En-tête */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-300 mb-2">
            🏋️ Séances d'entraînement
          </h1>
          <p className="text-gray-300 mb-4">
            Découvrez nos séances spécialement conçues pour améliorer votre performance
          </p>
          <button
            onClick={handleAddExercice}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Ajouter un exercice
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-black/40 rounded-2xl p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-3">🔍 Filtres</h2>
          <form onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Recherche
                </label>
                <input
                  type="text"
                  placeholder="Nom de la séance..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Niveau
                </label>
                <select
                  value={filters.niveau}
                  onChange={(e) => setFilters({...filters, niveau: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Tous les niveaux</option>
                  <option value="facile">Facile</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="difficile">Difficile</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={filters.type_seance}
                  onChange={(e) => setFilters({...filters, type_seance: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Tous les types</option>
                  <option value="mobilité">Mobilité</option>
                  <option value="renforcement">Renforcement</option>
                  <option value="cardio">Cardio</option>
                  <option value="étirement">Étirement</option>
                  <option value="gainage">Gainage</option>
                  <option value="échauffement">Échauffement</option>
                  <option value="récupération">Récupération</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Liste des séances */}
        {error ? (
          <div className="text-center">
            <div className="bg-red-900/50 border border-red-700 rounded-2xl p-6">
              <span className="text-2xl mb-2 block">❌</span>
              <h2 className="text-xl font-bold text-red-300 mb-2">Erreur</h2>
              <p className="text-gray-300">{error}</p>
            </div>
          </div>
        ) : seances.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <span className="text-2xl mb-2 block">🔍</span>
              <h2 className="text-xl font-bold text-gray-300 mb-2">Aucune séance trouvée</h2>
              <p className="text-gray-400">Essayez de modifier vos filtres de recherche.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seances.map((seance) => {
              const dureeReelle = calculerDureeReelle(seance.structure);
              
              return (
                <div
                  key={seance.id}
                  onClick={() => handleSeanceClick(seance.id)}
                  className="bg-black/40 border border-gray-700 rounded-2xl p-4 hover:bg-black/60 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group"
                >
                  {/* En-tête de la carte */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <span className="text-xl">{getTypeIcon(seance.type_seance)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors text-sm">
                          {seance.nom}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {seance.auteur_pseudo ? `Par ${seance.auteur_pseudo}` : 'Séance officielle'}
                        </p>
                      </div>
                    </div>
                    <span className={`${getNiveauColor(seance.niveau_nom)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                      {seance.niveau_nom || 'Non spécifié'}
                    </span>
                  </div>

                  {/* Description */}
                  {seance.description && (
                    <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                      {seance.description.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  )}

                  {/* Statistiques */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Durée réelle</p>
                      <p className="text-xs font-semibold text-white">
                        {formatDuree(dureeReelle)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Exercices</p>
                      <p className="text-xs font-semibold text-white">
                        {seance.structure?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Catégories */}
                  {seance.categories && seance.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {seance.categories.slice(0, 2).map((categorie, index) => (
                        <span
                          key={index}
                          className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs"
                        >
                          {categorie}
                        </span>
                      ))}
                      {seance.categories.length > 2 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{seance.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bouton d'action */}
                  <div className="text-center">
                    <span className="text-orange-400 text-xs font-medium group-hover:text-orange-300 transition-colors">
                      Voir la séance →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 