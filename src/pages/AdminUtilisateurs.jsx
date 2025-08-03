import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useUser } from "../contexts/UserContext";
import { Filter, Search, Users, Calendar, Clock, Target, TrendingUp, User, Shield, Mail, ArrowRight, ChevronDown, ChevronRight, Activity, Zap } from 'lucide-react';
import AdminService from "../services/adminService";

// Fonction utilitaire pour surligner les correspondances
function highlightMatch(text, query) {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-orange-300 text-black rounded px-1">{part}</mark> : part
  );
}

// Fonction pour formater la date
function formatDate(dateString) {
  if (!dateString) return "Jamais";
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Fonction pour formater la durée
function formatDuration(minutes) {
  if (!minutes || minutes === 0) return "0 min";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  return `${mins}min`;
}

export default function AdminUtilisateurs() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sortBy, setSortBy] = useState("last_connection");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const searchInputRef = useRef(null);
  const sortMenuRef = useRef(null);

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminService.getUtilisateurs(search, sortBy);
        setUtilisateurs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.is_admin) {
      fetchUtilisateurs();
    }
  }, [search, sortBy, user]);

  // Fermer le menu de tri quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Suggestions dynamiques
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    const lower = search.toLowerCase();
    const sugg = utilisateurs
      .flatMap(u => [u.nom, u.email, u.pseudo])
      .filter(Boolean)
      .map(s => s.toString())
      .filter((s, i, arr) => s.toLowerCase().includes(lower) && arr.indexOf(s) === i)
      .slice(0, 5);
    setSuggestions(sugg);
  }, [search, utilisateurs]);

  // Options de tri
  const sortOptions = [
    { value: "last_connection", label: "Dernière connexion", icon: "🕒" },
    { value: "created_at", label: "Date d'inscription", icon: "📅" },
    { value: "last_session", label: "Dernière séance", icon: "🏃" },
    { value: "program_start", label: "Début programme", icon: "🎯" },
    { value: "nb_sessions", label: "Nombre de séances", icon: "📊" },
  ];

  const getSortLabel = (value) => {
    const option = sortOptions.find(opt => opt.value === value);
    return option ? option.label : "Trier par";
  };

  // Fonction pour basculer l'expansion d'un utilisateur
  const toggleUserExpansion = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  // Filtrage par recherche
  const filtered = utilisateurs.filter(u => {
    const matchSearch =
      (u.nom && u.nom.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.pseudo && u.pseudo.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  if (!user?.is_admin) {
    return (
      <Layout pageTitle="Accès refusé">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-100 mb-2">Accès refusé</h1>
            <p className="text-gray-400">Cette page est réservée aux administrateurs.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Administration - Utilisateurs">
      <div className="p-4 space-y-4">
        {/* En-tête avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#232526]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-100">{utilisateurs.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
                     <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#232526]">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-gray-400 text-sm">Utilisateurs actifs</p>
                 <p className="text-2xl font-bold text-gray-100">
                   {utilisateurs.filter(u => u.last_connection && new Date(u.last_connection) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                 </p>
                 <p className="text-xs text-gray-500">Connexion &lt; 7 jours</p>
                 <p className="text-xs text-red-400">
                   {utilisateurs.filter(u => !u.last_connection).length} jamais connectés
                 </p>
               </div>
               <TrendingUp className="w-8 h-8 text-green-500" />
             </div>
           </div>
          
          <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#232526]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Nouveaux (7j)</p>
                <p className="text-2xl font-bold text-gray-100">
                  {utilisateurs.filter(u => u.created_at && new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-xs text-gray-500">Inscription &lt; 7 jours</p>
              </div>
              <User className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#232526]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Administrateurs</p>
                <p className="text-2xl font-bold text-gray-100">
                  {utilisateurs.filter(u => u.is_admin).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#232526]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avec programme</p>
                <p className="text-2xl font-bold text-gray-100">
                  {utilisateurs.filter(u => u.programme_actuel).length}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Barre de recherche et tri */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[300px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#2a2a2a] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-[#232526]"
              placeholder="Rechercher par nom, email ou pseudo..."
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

          {/* Sélecteur de tri */}
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2 h-10 rounded-lg bg-[#2a2a2a] text-gray-100 border border-[#232526] hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-orange-400 transition min-w-[200px] justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} />
                {getSortLabel(sortBy)}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu de tri */}
            {showSortMenu && (
              <div className="absolute right-0 mt-1 bg-[#232526] border border-[#232526] rounded-lg shadow-lg z-30 min-w-[200px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-3 ${
                      sortBy === option.value ? 'bg-orange-500 text-white' : 'text-gray-100'
                    }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

                 {/* Liste des utilisateurs */}
         {loading ? (
           <div className="flex items-center justify-center py-12">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
           </div>
         ) : error ? (
           <div className="text-center py-12">
             <p className="text-red-500">{error}</p>
           </div>
         ) : (
           <div className="space-y-2">
             {filtered.map((utilisateur) => (
               <div 
                 key={utilisateur.id} 
                 className="bg-[#2a2a2a] rounded-lg border border-[#232526] hover:border-orange-500 transition-colors"
               >
                                   {/* Ligne principale compacte */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleUserExpansion(utilisateur.id)}
                  >
                    {/* Flèche d'accordéon à gauche */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUserExpansion(utilisateur.id);
                      }}
                      className="p-1 hover:bg-[#333] rounded transition-colors mr-2"
                    >
                      {expandedUsers.has(utilisateur.id) ? 
                        <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      }
                    </button>

                    {/* Informations utilisateur */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-100 truncate">
                            {utilisateur.nom || utilisateur.pseudo || "Utilisateur sans nom"}
                          </h3>
                          {utilisateur.is_admin && (
                            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">Admin</span>
                          )}
                        </div>
                      </div>
                    </div>

                                         {/* Statistiques rapides avec icônes */}
                     <div className="flex items-center gap-4 text-sm">
                       {/* Programme actuel */}
                       <div className="flex items-center gap-1" title="Programme actuel">
                         <Target className="w-4 h-4 text-blue-500" />
                         <span className="text-gray-300">
                           {utilisateur.programme_actuel ? "✓" : "✗"}
                         </span>
                       </div>
 

                       {/* Nombre de séances */}
                       <div className="flex items-center gap-1" title="Nombre de séances">
                         <Clock className="w-4 h-4 text-green-500" />
                         <span className="text-gray-300 font-medium">
                           {utilisateur.statistiques.nb_seances_totales}
                         </span>
                       </div>
                  

                       {/* Dernière connexion */}
                       <div className="flex items-center gap-1" title="Dernière connexion">
                         <Zap className={`w-4 h-4 ${!utilisateur.last_connection ? 'text-red-400' : 'text-yellow-500'}`} />
                         <span className={`text-xs ${!utilisateur.last_connection ? 'text-red-400' : 'text-gray-300'}`}>
                           {utilisateur.last_connection ? 
                             new Date(utilisateur.last_connection).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : 
                             "Jamais"
                           }
                         </span>
                       </div>

                       {/* Bouton de navigation */}
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           navigate(`/admin-utilisateurs/${utilisateur.id}`);
                         }}
                         className="p-1 hover:bg-orange-500 hover:text-white rounded transition-colors"
                         title="Voir les détails"
                       >
                         <ArrowRight className="w-4 h-4 text-orange-500" />
                       </button>
                     </div>
                  </div>

                 {/* Accordéon avec détails */}
                 {expandedUsers.has(utilisateur.id) && (
                   <div className="border-t border-[#232526] p-4 bg-[#232526]">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                               {/* Informations de base */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-400">Email:</span>
                            <span className="text-gray-100">{utilisateur.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-400">Inscrit le:</span>
                            <span className="text-gray-100">{formatDate(utilisateur.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-400">Dernière connexion:</span>
                            <span className={!utilisateur.last_connection ? 'text-red-400' : 'text-gray-100'}>
                              {utilisateur.last_connection ? formatDate(utilisateur.last_connection) : "Jamais connecté"}
                            </span>
                          </div>
                        </div>

                       {/* Programme actuel */}
                       <div className="space-y-2">
                         <div className="flex items-center gap-2 text-sm">
                           <Target className="w-4 h-4 text-blue-500" />
                           <span className="text-gray-400">Programme:</span>
                           <span className="text-gray-100">
                             {utilisateur.programme_actuel ? utilisateur.programme_actuel.nom : "Aucun"}
                           </span>
                         </div>
                         {utilisateur.programme_actuel && (
                           <div className="flex items-center gap-2 text-sm">
                             <Calendar className="w-4 h-4 text-green-500" />
                             <span className="text-gray-400">Depuis:</span>
                             <span className="text-gray-100">{formatDate(utilisateur.programme_actuel.date_debut)}</span>
                           </div>
                         )}
                       </div>

                       {/* Statistiques détaillées */}
                       <div className="space-y-2">
                         <div className="flex items-center gap-2 text-sm">
                           <Clock className="w-4 h-4 text-green-500" />
                           <span className="text-gray-400">Séances totales:</span>
                           <span className="text-gray-100 font-medium">{utilisateur.statistiques.nb_seances_totales}</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm">
                           <Activity className="w-4 h-4 text-orange-500" />
                           <span className="text-gray-400">30j:</span>
                           <span className="text-gray-100 font-medium">
                             {utilisateur.statistiques.stats_30_jours.nb_sessions} sessions
                           </span>
                         </div>
                       </div>

                       {/* Dernière séance */}
                       <div className="space-y-2">
                         {utilisateur.statistiques.derniere_seance ? (
                           <>
                             <div className="flex items-center gap-2 text-sm">
                               <Calendar className="w-4 h-4 text-purple-500" />
                               <span className="text-gray-400">Dernière séance:</span>
                               <span className="text-gray-100">{utilisateur.statistiques.derniere_seance.nom}</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm">
                               <Clock className="w-4 h-4 text-blue-500" />
                               <span className="text-gray-400">Le:</span>
                               <span className="text-gray-100">{formatDate(utilisateur.statistiques.derniere_seance.date)}</span>
                             </div>
                           </>
                         ) : (
                           <div className="flex items-center gap-2 text-sm text-gray-500">
                             <Calendar className="w-4 h-4" />
                             <span>Aucune séance</span>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             ))}

             {filtered.length === 0 && !loading && (
               <div className="text-center py-12">
                 <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                 <p className="text-gray-400">Aucun utilisateur trouvé</p>
               </div>
             )}
           </div>
         )}
      </div>
    </Layout>
  );
} 