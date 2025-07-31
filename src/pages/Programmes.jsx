import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useUser } from "../contexts/UserContext";
import { Filter, Search, List, SortAsc, ChevronDown, ChevronRight, LayoutGrid, Plus, Calendar } from 'lucide-react';

function groupByCategory(programmes) {
  const groups = {};
  programmes.forEach(p => {
    const cat = p.categorie || "Non groupé";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(p);
  });
  return groups;
}

// Fonction utilitaire pour surligner les correspondances
function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-orange-300 text-black rounded px-1">{part}</mark> : part
  );
}

export default function Programmes() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [groupBy, setGroupBy] = useState('categorie');
  const [sortBy, setSortBy] = useState('nom');

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/programmes`);
        if (!response.ok) throw new Error("Erreur lors du chargement des programmes");
        const data = await response.json();
        setProgrammes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgrammes();
  }, [apiUrl]);

  // Extraire toutes les catégories uniques
  const allCategories = Array.from(new Set(programmes.map(p => p.categorie || "Non groupé")));

  // Suggestions dynamiques (noms, catégories, descriptions)
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    const lower = search.toLowerCase();
    const sugg = programmes
      .flatMap(p => [p.nom, p.categorie, p.description])
      .filter(Boolean)
      .map(s => s.toString())
      .filter((s, i, arr) => s.toLowerCase().includes(lower) && arr.indexOf(s) === i)
      .slice(0, 5);
    setSuggestions(sugg);
  }, [search, programmes]);

  // Filtrage par recherche et catégorie
  const filtered = programmes.filter(p => {
    const matchSearch =
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.categorie && p.categorie.toLowerCase().includes(search.toLowerCase())) ||
      (p.nbSeances !== undefined && p.nbSeances !== null && p.nbSeances.toString().includes(search));
    const matchCategory = !categoryFilter || (p.categorie || "Non groupé") === categoryFilter;
    return matchSearch && matchCategory;
  });
  const grouped = groupByCategory(filtered);
  const groupKeys = Object.keys(grouped);

  // Ouvre le premier groupe par défaut si aucun n'est ouvert
  useEffect(() => {
    if (groupKeys.length > 0 && Object.keys(expanded).length === 0) {
      setExpanded({ [groupKeys[0]]: true });
    }
  }, [groupKeys.length]);

  const toggleGroup = (cat) => setExpanded(e => ({ ...e, [cat]: !e[cat] }));

  // À adapter selon ta logique locale (exemple simple, à personnaliser)
  const sidebarWidth = 256; // ou 56 si réduit, ou 0 en mobile
  const style = {
    minHeight: 56,
    left: 0,
    width: '100%',
    top: 56,
    right: 0,
    zIndex: 30,
    position: 'sticky',
  };

  return (
    <Layout pageTitle="Programmes sportifs">
      <div className="w-full flex flex-col items-center bg-[#18191a] min-h-screen relative">
        {/* Barre de recherche fixed sous le header, décalée selon sidebar */}
        <div
          className="flex flex-row justify-between items-center gap-4 px-4 bg-[#222] border-b border-[#232526] shadow-sm overflow-x-auto"
          style={style}
        >
          {/* Bouton Filtres */}
          <button className="flex items-center gap-2 px-4 h-8 rounded-full bg-[#2a2a2a] text-gray-200 hover:bg-[#333] border border-[#232526] focus:ring-2 focus:ring-orange-400 transition min-w-[44px]">
            <Filter size={18} className="" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
          {/* Champ de recherche */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full h-8 pl-9 pr-4 rounded-full bg-[#2a2a2a] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-[#232526] text-sm"
              placeholder="Rechercher parmi les programmes"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
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
                      setSearch(s);
                      setShowSuggestions(false);
                      searchInputRef.current?.blur();
                    }}
                  >
                    {highlightMatch(s, search)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Bouton Grouper par */}
          <button className="flex items-center gap-2 px-4 h-8 rounded-full bg-[#2a2a2a] text-gray-200 border border-[#232526] hover:bg-[#333] focus:ring-2 focus:ring-orange-400 transition min-w-[170px] justify-between">
            <List size={18} className="" />
            <span className="hidden sm:inline">Grouper par</span>
            <span className="font-semibold ml-1">{groupBy === 'type' ? 'Type' : groupBy === 'categorie' ? 'Catégorie' : 'Niveau'}</span>
            <ChevronDown size={16} className="ml-2" />
          </button>
          {/* Bouton Trier par */}
          <button className="flex items-center gap-2 px-4 h-8 rounded-full bg-[#2a2a2a] text-gray-200 border border-[#232526] hover:bg-[#333] focus:ring-2 focus:ring-orange-400 transition min-w-[190px] justify-between">
            <SortAsc size={18} className="" />
            <span className="hidden sm:inline">Trier par</span>
            <span className="font-semibold ml-1">{sortBy === 'nom' ? 'Nom' : sortBy === 'date' ? 'Date' : 'Nombre de séances'}</span>
            <ChevronDown size={16} className="ml-2" />
          </button>
          {/* Bouton vue grille/liste */}
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2a2a2a] text-gray-300 hover:bg-[#333] border border-[#232526] focus:ring-2 focus:ring-orange-400 transition">
            <LayoutGrid size={18} className="" />
          </button>
        </div>
        {/* Liste groupée */}
        <div className="w-full">
          {loading ? (
            <div className="text-center text-gray-400 py-12 animate-pulse">
              <div className="h-6 bg-[#232526] rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-[#232526] rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-4 bg-[#232526] rounded w-1/2 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">{error}</div>
          ) : groupKeys.length === 0 ? (
            <div className="text-center text-gray-400 py-12">Aucun programme trouvé.</div>
          ) : (
            <div className="divide-y divide-[#232526]">
              {groupKeys.map((cat, idx) => (
                <div key={cat}>
                  <button
                    className="w-full flex items-center justify-between px-2 py-3 bg-transparent hover:bg-[#232526] transition-all group focus:outline-none"
                    onClick={() => toggleGroup(cat)}
                    style={{borderTop: idx === 0 ? 'none' : undefined}}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight size={18} className={`transition-transform duration-200 ${expanded[cat] ? 'rotate-90' : ''}`} />
                      <span className="font-semibold text-orange-200 text-lg">{cat}</span>
                      <span className="ml-2 text-xs text-gray-400">{grouped[cat].length} programme{grouped[cat].length > 1 ? 's' : ''}</span>
                    </div>
                  </button>
                  {expanded[cat] && (
                    <div className="">
                      {grouped[cat].map((p, i) => (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between px-4 py-4 border-b border-[#232526] hover:bg-orange-950/40 transition-all cursor-pointer group ${i === grouped[cat].length - 1 ? 'border-b-0' : ''}`}
                          onClick={() => navigate(`/programmes/${p.id}`)}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <Calendar size={20} className="text-orange-400 bg-[#232526] rounded-lg p-2 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-semibold text-orange-100 text-base truncate">{highlightMatch(p.nom, search)}</div>
                              <div className="text-gray-400 text-sm max-w-xl truncate">{p.description ? highlightMatch(p.description, search) : <span className="italic text-gray-600">Aucune description</span>}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 min-w-[120px]">
                            {p.nbSeances !== undefined && p.nbSeances !== null && (
                              <span className="text-xs text-gray-400">{p.nbSeances} séance{p.nbSeances > 1 ? 's' : ''}</span>
                            )}
                            {p.updatedAt && <span className="text-xs text-gray-500">Modifié le {p.updatedAt}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Bouton flottant - visible seulement pour les admins */}
        {user?.is_admin && (
          <button
            className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg text-lg z-50"
            onClick={() => navigate('/programmes/new')}
          >
            <Plus size={20} className="" />
            Créer un programme
          </button>
        )}
      </div>
    </Layout>
  );
} 