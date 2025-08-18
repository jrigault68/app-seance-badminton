import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Plus, Search, Filter, ChevronDown, Dumbbell, Heart, Target } from "lucide-react";

export default function Exercices() {
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categorie: '',
    groupe_musculaire: '',
    type: '',
    search: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchExercices = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (filters.categorie) params.append('categorie', filters.categorie);
        if (filters.groupe_musculaire) params.append('groupe_musculaire', filters.groupe_musculaire);

        if (filters.type) params.append('type', filters.type);
        if (filters.search) params.append('search', filters.search);
        params.append('limit', 50);
        const response = await fetch(`${apiUrl}/exercices?${params.toString()}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des exercices");
        const data = await response.json();
        let exercicesList = Array.isArray(data) ? data : (data.exercices || []);
        setExercices(exercicesList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercices();
  }, [apiUrl, filters]);

  // Suggestions dynamiques (nom, description, catégorie, groupe musculaire)
  useEffect(() => {
    if (!filters.search) {
      setSuggestions([]);
      return;
    }
    const lower = filters.search.toLowerCase();
    const sugg = exercices
      .flatMap(e => [e.nom, e.description, e.categorie_nom, e.groupe_musculaire_nom])
      .filter(Boolean)
      .map(s => s.toString())
      .filter((s, i, arr) => s.toLowerCase().includes(lower) && arr.indexOf(s) === i)
      .slice(0, 5);
    setSuggestions(sugg);
  }, [filters.search, exercices]);

  const handleExerciceClick = (exerciceId) => {
    navigate(`/exercices/${exerciceId}`);
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

  // Surlignage des correspondances
  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-orange-300 text-black rounded px-1">{part}</mark> : part
    );
  }

  // Barre sticky style
  const stickyStyle = {
    minHeight: 56,
    left: 0,
    width: '100%',
    top: 56,
    right: 0,
    zIndex: 30,
    position: 'sticky',
  };

  return (
    <Layout pageTitle="Exercices" pageActions={[
      { icon: <Plus size={20} />, label: 'Ajouter un exercice', onClick: () => navigate('/exercices/new') }
    ]}>
      <div className="w-full flex flex-col items-center bg-[#18191a] min-h-screen relative">
        {/* Barre sticky de recherche/filtres */}
        <div
          className="flex flex-row justify-between items-center gap-4 px-4 bg-[#222] border-b border-[#232526] shadow-sm overflow-x-auto"
          style={stickyStyle}
        >
          {/* Bouton Filtres (non fonctionnel, pour harmonie visuelle) */}
          <button className="flex items-center gap-2 px-4 h-8 rounded-full bg-[#2a2a2a] text-gray-200 hover:bg-[#333] border border-[#232526] focus:ring-2 focus:ring-orange-400 transition min-w-[44px]">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtres</span>
          </button>
          {/* Champ de recherche */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full h-8 pl-9 pr-4 rounded-full bg-[#2a2a2a] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-[#232526] text-sm"
              placeholder="Rechercher un exercice"
              value={filters.search}
              onChange={e => {
                setFilters({ ...filters, search: e.target.value });
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              autoComplete="off"
            />
            {/* Suggestions dynamiques */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-[#232526] border border-[#232526] rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 text-gray-100 hover:bg-orange-500 hover:text-white cursor-pointer"
                    onMouseDown={() => {
                      setFilters({ ...filters, search: s });
                      setShowSuggestions(false);
                      searchInputRef.current?.blur();
                    }}
                  >
                    {highlightMatch(s, filters.search)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Filtres catégorie */}
          <select
            value={filters.categorie}
            onChange={e => setFilters({ ...filters, categorie: e.target.value })}
            className="h-8 px-4 rounded-full bg-[#2a2a2a] text-gray-100 border border-[#232526] focus:ring-2 focus:ring-orange-400 text-sm"
          >
            <option value="">Toutes catégories</option>
            <option value="échauffement">Échauffement</option>
            <option value="renforcement">Renforcement</option>
            <option value="cardio">Cardio</option>
            <option value="étirement">Étirement</option>
            <option value="gainage">Gainage</option>
            <option value="mobilité">Mobilité</option>
            <option value="récupération active">Récupération active</option>
          </select>
          {/* Filtres groupe musculaire */}
          <select
            value={filters.groupe_musculaire}
            onChange={e => setFilters({ ...filters, groupe_musculaire: e.target.value })}
            className="h-8 px-4 rounded-full bg-[#2a2a2a] text-gray-100 border border-[#232526] focus:ring-2 focus:ring-orange-400 text-sm"
          >
            <option value="">Tous groupes</option>
            <option value="pectoraux">Pectoraux</option>
            <option value="dos">Dos</option>
            <option value="épaules">Épaules</option>
            <option value="biceps">Biceps</option>
            <option value="triceps">Triceps</option>
            <option value="abdominaux">Abdominaux</option>
            <option value="jambes">Jambes</option>
            <option value="fessiers">Fessiers</option>
            <option value="mollets">Mollets</option>
            <option value="cardio">Cardio</option>
            <option value="tout le corps">Tout le corps</option>
          </select>

          {/* Filtres type */}
          <select
            value={filters.type}
            onChange={e => setFilters({ ...filters, type: e.target.value })}
            className="h-8 px-4 rounded-full bg-[#2a2a2a] text-gray-100 border border-[#232526] focus:ring-2 focus:ring-orange-400 text-sm"
          >
            <option value="">Tous types</option>
            <option value="répétitions">Répétitions</option>
            <option value="temps">Temps</option>
            <option value="distance">Distance</option>
            <option value="isométrique">Isométrique</option>
          </select>
        </div>
        {/* Liste des exercices */}
        <div className="w-full">
          {loading ? (
            <div className="text-center text-gray-400 py-12 animate-pulse">
              <div className="h-6 bg-[#232526] rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-[#232526] rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-4 bg-[#232526] rounded w-1/2 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">{error}</div>
          ) : exercices.length === 0 ? (
            <div className="text-center text-gray-400 py-12">Aucun exercice trouvé.</div>
          ) : (
            <div className="divide-y divide-[#232526]">
              {exercices.map((exercice, idx) => (
                <div
                  key={exercice.id}
                  className={`flex items-center justify-between px-4 py-4 border-b border-[#232526] hover:bg-orange-950/40 transition-all cursor-pointer group ${idx === exercices.length - 1 ? 'border-b-0' : ''}`}
                  onClick={() => handleExerciceClick(exercice.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-2xl bg-[#232526] rounded-lg p-2 flex-shrink-0">{getCategorieIcon(exercice.categorie_nom)}</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-orange-100 text-base truncate">{highlightMatch(exercice.nom, filters.search)}</div>
                      <div className="text-gray-400 text-sm max-w-xl truncate">{exercice.description ? highlightMatch(exercice.description, filters.search) : <span className="italic text-gray-600">Aucune description</span>}</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {exercice.categorie_nom && (
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">{exercice.categorie_nom}</span>
                        )}
                        {exercice.groupe_musculaire_nom && (
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">{exercice.groupe_musculaire_nom}</span>
                        )}
                        {exercice.type_nom && (
                          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">{exercice.type_nom}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 min-w-[120px]">
                                                                     {/* Notes de difficulté */}
                         <div className="flex flex-wrap gap-1 justify-end">
                           {exercice.note_force !== undefined && (
                             <span className="text-xs bg-gray-700 text-white px-1 py-1 rounded flex items-center gap-1" title="Force">
                               <Dumbbell size={10} />
                               {exercice.note_force}
                             </span>
                           )}
                           {exercice.note_cardio !== undefined && (
                             <span className="text-xs bg-gray-700 text-white px-1 py-1 rounded flex items-center gap-1" title="Cardio">
                               <Heart size={10} />
                               {exercice.note_cardio}
                             </span>
                           )}
                           {exercice.note_technique !== undefined && (
                             <span className="text-xs bg-gray-700 text-white px-1 py-1 rounded flex items-center gap-1" title="Technique">
                               <Target size={10} />
                               {exercice.note_technique}
                             </span>
                           )}
                         </div>
                    <span className="text-xs text-gray-400">{formatDuree(exercice.duree_estimee)}</span>
                    {exercice.calories_estimees && (
                      <span className="text-xs text-gray-400">{exercice.calories_estimees} cal</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 