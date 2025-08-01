import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { blockStyle, paragraphStyle } from "../styles/styles";
import SeanceService from "@/services/seanceService";
import { estimerDureeEtape, calculerTempsTotalSeance } from "@/utils/helpers";
import { Plus, Search, Filter, ChevronDown } from "lucide-react";

export default function Seances() {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    niveau: '',
    type_seance: '',
    search: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSeances = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (filters.niveau) params.append('niveau', filters.niveau);
        if (filters.type_seance) params.append('type_seance', filters.type_seance);
        if (filters.search) params.append('search', filters.search);
        params.append('limit', 50);
        const response = await fetch(`${apiUrl}/seances?${params.toString()}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des séances");
        const data = await response.json();
        let seancesList = Array.isArray(data) ? data : (data.seances || []);
        //seancesList = seancesList.filter(seance => seance.structure && Array.isArray(seance.structure) && seance.structure.length > 0);
        setSeances(seancesList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSeances();
  }, [apiUrl, filters]);

  // Suggestions dynamiques (nom, description, auteur)
  useEffect(() => {
    if (!filters.search) {
      setSuggestions([]);
      return;
    }
    const lower = filters.search.toLowerCase();
    const sugg = seances
      .flatMap(s => [s.nom, s.description, s.auteur_pseudo])
      .filter(Boolean)
      .map(s => s.toString())
      .filter((s, i, arr) => s.toLowerCase().includes(lower) && arr.indexOf(s) === i)
      .slice(0, 5);
    setSuggestions(sugg);
  }, [filters.search, seances]);

  const handleSeanceClick = (seanceId) => {
    navigate(`/seances/${seanceId}`);
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

  const calculerDureeReelle = (seance) => {
    // Utiliser le temps total depuis la BDD si disponible
    console.log('Duree reelle:', seance.duree_estimee);
    if (seance.duree_estimee) {
      return seance.duree_estimee;
    }
    
    // Fallback vers le calcul si pas de temps en BDD
    if (!seance.structure || !Array.isArray(seance.structure)) return 0;
    return calculerTempsTotalSeance(seance.structure);
  };

  const formatDuree = (secondes) => {
    if (!secondes || secondes === 0) return 'Non calculée';
    const heures = Math.floor(secondes / 3600);
    const minutes = Math.round((secondes % 3600) / 60);
    if (heures > 0) {
      return `${heures}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `${minutes}min`;
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
    <Layout pageTitle="Séances d'entraînement" pageActions={[
      { icon: <Plus size={20} />, label: 'Créer une séance', onClick: () => navigate('/seances/new') }
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
              placeholder="Rechercher une séance"
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
          {/* Filtres niveau */}
          <select
            value={filters.niveau}
            onChange={e => setFilters({ ...filters, niveau: e.target.value })}
            className="h-8 px-4 rounded-full bg-[#2a2a2a] text-gray-100 border border-[#232526] focus:ring-2 focus:ring-orange-400 text-sm"
          >
            <option value="">Tous niveaux</option>
            <option value="facile">Facile</option>
            <option value="intermédiaire">Intermédiaire</option>
            <option value="difficile">Difficile</option>
            <option value="expert">Expert</option>
          </select>
          {/* Filtres type */}
          <select
            value={filters.type_seance}
            onChange={e => setFilters({ ...filters, type_seance: e.target.value })}
            className="h-8 px-4 rounded-full bg-[#2a2a2a] text-gray-100 border border-[#232526] focus:ring-2 focus:ring-orange-400 text-sm"
          >
            <option value="">Tous types</option>
            <option value="mobilité">Mobilité</option>
            <option value="renforcement">Renforcement</option>
            <option value="cardio">Cardio</option>
            <option value="étirement">Étirement</option>
            <option value="gainage">Gainage</option>
            <option value="échauffement">Échauffement</option>
            <option value="récupération">Récupération</option>
          </select>
          {/* Bouton + déjà dans le bandeau via pageActions */}
        </div>
        {/* Liste des séances */}
        <div className="w-full">
          {loading ? (
            <div className="text-center text-gray-400 py-12 animate-pulse">
              <div className="h-6 bg-[#232526] rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-[#232526] rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-4 bg-[#232526] rounded w-1/2 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">{error}</div>
          ) : seances.length === 0 ? (
            <div className="text-center text-gray-400 py-12">Aucune séance trouvée.</div>
          ) : (
            <div className="divide-y divide-[#232526]">
              {seances.map((seance, idx) => {
                const dureeReelle = calculerDureeReelle(seance);
                return (
                  <div
                    key={seance.id}
                    className={`flex items-center justify-between px-4 py-4 border-b border-[#232526] hover:bg-orange-950/40 transition-all cursor-pointer group ${idx === seances.length - 1 ? 'border-b-0' : ''}`}
                    onClick={() => handleSeanceClick(seance.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="text-2xl bg-[#232526] rounded-lg p-2 flex-shrink-0">{getTypeIcon(seance.type_seance)}</div>
                      <div className="min-w-0">
                        <div className="font-semibold text-orange-100 text-base truncate">{highlightMatch(seance.nom, filters.search)}</div>
                        <div className="text-gray-400 text-sm max-w-xl truncate">{seance.description ? highlightMatch(seance.description, filters.search) : <span className="italic text-gray-600">Aucune description</span>}</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {seance.categories && seance.categories.slice(0, 2).map((cat, i) => (
                            <span key={i} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">{cat}</span>
                          ))}
                          {seance.categories && seance.categories.length > 2 && (
                            <span className="text-gray-400 text-xs px-2 py-1">+{seance.categories.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 min-w-[120px]">
                      <span className={`text-xs text-white px-2 py-1 rounded-full font-medium ${getNiveauColor(seance.niveau_nom)}`}>{seance.niveau_nom || 'Non spécifié'}</span>
                      <span className="text-xs text-gray-400">{seance.structure?.length || 0} exercice{seance.structure?.length > 1 ? 's' : ''}</span>
                      <span className="text-xs text-gray-400">{formatDuree(dureeReelle)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 