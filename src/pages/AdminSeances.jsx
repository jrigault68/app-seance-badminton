import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useUser } from "../contexts/UserContext";
import { 
  Activity, 
  Clock, 
  MessageSquare, 
  User, 
  Calendar,
  Filter,
  Search,
  TrendingUp,
  CheckCircle,
  XCircle,
  PlayCircle,
  AlertCircle,
  SkipForward
} from 'lucide-react';
import AdminService from "../services/adminService";

// Fonction pour surligner les correspondances
function highlightMatch(text, query) {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-orange-300 text-black rounded px-1">{part}</mark> : part
  );
}

// Fonction pour formater la date
function formatDate(dateString) {
  if (!dateString) return "Date inconnue";
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
  const mins = Math.floor(minutes % 60);
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  return `${mins}min`;
}

// Fonction pour formater la durée en secondes
function formatDurationSeconds(seconds) {
  if (!seconds || seconds === 0) return "0 min";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  return `${minutes}min${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
}



// Fonction pour afficher le niveau d'effort
function EffortLevel({ niveau }) {
  if (!niveau) return <span className="text-gray-400">Non évalué</span>;
  
  const getEffortColor = (niveau) => {
    if (niveau <= 3) return "text-green-600";
    if (niveau <= 6) return "text-yellow-600";
    if (niveau <= 8) return "text-orange-600";
    return "text-red-600";
  };
  
  const getEffortText = (niveau) => {
    if (niveau <= 2) return "Très facile";
    if (niveau <= 4) return "Facile";
    if (niveau <= 6) return "Modéré";
    if (niveau <= 8) return "Difficile";
    return "Très difficile";
  };
  
  return (
    <div className="flex items-center gap-2">
      <Activity className={`w-4 h-4 ${getEffortColor(niveau)}`} />
      <span className={`text-sm font-medium ${getEffortColor(niveau)}`}>
        {getEffortText(niveau)} ({niveau}/10)
      </span>
    </div>
  );
}

// Fonction pour afficher l'état de la séance
function SeanceStatus({ etat }) {
  const getStatusConfig = (etat) => {
    switch (etat) {
      case 'terminee':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          text: 'Terminée'
        };
      case 'skipped':
        return {
          icon: SkipForward,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          text: 'Passée'
        };
      case 'en_cours':
        return {
          icon: PlayCircle,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          text: 'En cours'
        };
      case 'interrompue':
        return {
          icon: AlertCircle,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          text: 'Interrompue'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          text: etat || 'Inconnu'
        };
    }
  };

  const config = getStatusConfig(etat);
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${config.bgColor}`}>
      <IconComponent className={`w-4 h-4 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
}

// Fonction pour afficher les informations de progression pour les séances en cours
function ProgressionInfo({ progression, dateDebut }) {
  if (!progression) return null;

  const pourcentageProgression = progression.nombre_total_etapes > 0 
    ? Math.round((progression.etape_actuelle / progression.nombre_total_etapes) * 100)
    : 0;

  return (
    <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <PlayCircle className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-blue-400">Progression en cours</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-gray-400">Début:</span>
          <div className="text-blue-300 font-medium">
            {formatDate(dateDebut)}
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">Durée écoulée:</span>
          <div className="text-blue-300 font-medium">
            {formatDurationSeconds(progression.temps_ecoule)}
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">Étape actuelle:</span>
          <div className="text-blue-300 font-medium">
            {progression.etape_actuelle} / {progression.nombre_total_etapes}
          </div>
        </div>
        
        <div>
          <span className="text-gray-400">Progression:</span>
          <div className="text-blue-300 font-medium">
            {pourcentageProgression}%
          </div>
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="mt-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pourcentageProgression}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSeances() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterUtilisateur, setFilterUtilisateur] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSeances = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminService.getSeancesRecentes(50, 0, filterUtilisateur || null);
        setSeances(data.seances || []);
        
        // Debug: afficher les états des premières séances
        console.log("États reçus côté frontend:");
        (data.seances || []).slice(0, 5).forEach((seance, index) => {
          console.log(`${index + 1}. Séance ${seance.seance.nom}: etat = ${seance.etat}`);
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.is_admin) {
      fetchSeances();
    }
  }, [filterUtilisateur, user]);

  // Filtrer les séances par recherche
  const filteredSeances = seances.filter(seance => {
    const searchLower = search.toLowerCase();
    return (
      seance.seance.nom.toLowerCase().includes(searchLower) ||
      seance.utilisateur.nom.toLowerCase().includes(searchLower) ||
      seance.notes.toLowerCase().includes(searchLower) ||
      seance.seance.categorie.toLowerCase().includes(searchLower)
    );
  });



  if (!user?.is_admin) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#18191a] text-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
                         <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                 <Activity className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h1 className="text-3xl font-bold text-gray-100">Toutes les Séances</h1>
                 <p className="text-gray-400">Suivi de toutes les séances avec leur état et commentaires</p>
               </div>
             </div>

            {/* Barre de recherche et filtres */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-[300px]">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#232526] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-700"
                  placeholder="Rechercher par séance, utilisateur, commentaire..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 h-10 rounded-lg bg-[#232526] text-gray-100 border border-gray-700 hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </button>
            </div>

            {showFilters && (
              <div className="mb-6 p-4 bg-[#232526] rounded-lg border border-gray-700">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Utilisateur
                    </label>
                    <input
                      type="text"
                      placeholder="Filtrer par utilisateur..."
                      value={filterUtilisateur}
                      onChange={(e) => setFilterUtilisateur(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-[#18191a] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#232526] rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Séances totales</p>
                    <p className="text-2xl font-bold text-gray-100">{filteredSeances.length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-[#232526] rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Durée moyenne</p>
                    <p className="text-2xl font-bold text-gray-100">
                      {filteredSeances.length > 0 
                        ? formatDuration(Math.round(filteredSeances.reduce((acc, s) => acc + s.duree_minutes, 0) / filteredSeances.length))
                        : "0 min"
                      }
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-[#232526] rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Effort moyen</p>
                    <p className="text-2xl font-bold text-gray-100">
                      {filteredSeances.length > 0 
                        ? (filteredSeances.reduce((acc, s) => acc + (s.niveau_effort || 0), 0) / filteredSeances.filter(s => s.niveau_effort).length).toFixed(1)
                        : "0"
                      }
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

          {/* Liste des séances */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredSeances.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Aucune séance trouvée</h3>
              <p className="text-gray-400">Aucune séance n'a été trouvée avec les critères de recherche actuels.</p>
            </div>
          ) : (
                         <div className="space-y-2">
               {filteredSeances.map((seance) => (
                 <div 
                   key={seance.id} 
                   className="bg-[#232526] rounded-lg border border-gray-700 hover:border-orange-500 transition-colors p-4"
                 >
                   {/* Ligne principale */}
                   <div className="flex items-center justify-between mb-3">
                     {/* Informations séance */}
                     <div className="flex-1 min-w-0">
                       <h3 className="font-semibold text-gray-100 truncate">
                         {seance.seance.nom}
                       </h3>
                     </div>

                     {/* État de la séance */}
                     <SeanceStatus etat={seance.etat} />
                   </div>

                   {/* Ligne des statistiques */}
                   <div className="flex items-center gap-4 text-sm mb-3">
                     {/* Utilisateur */}
                     <div className="flex items-center gap-1" title="Utilisateur">
                       <User className="w-4 h-4 text-blue-500" />
                       <span className="text-gray-300 text-xs">
                         {seance.utilisateur.nom}
                       </span>
                     </div>

                     {/* Durée */}
                     <div className="flex items-center gap-1" title="Durée">
                       <Clock className="w-4 h-4 text-green-500" />
                       <span className="text-gray-300 font-medium">
                         {formatDuration(seance.etat === 'en_cours' && seance.progression ? seance.progression.temps_ecoule/60 : seance.duree_minutes)}
                       </span>
                     </div>

                     {/* Niveau d'effort */}
                     <div className="flex items-center gap-1" title="Niveau d'effort">
                       <TrendingUp className="w-4 h-4 text-purple-500" />
                       <span className="text-gray-300 text-xs">
                         {seance.niveau_effort ? `${seance.niveau_effort}/10` : "N/A"}
                       </span>
                     </div>

                     {/* Date */}
                     <div className="flex items-center gap-1" title="Date">
                       <Calendar className="w-4 h-4 text-yellow-500" />
                       <span className="text-gray-300 text-xs">
                         {seance.date_fin 
                           ? new Date(seance.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
                           : new Date(seance.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
                         }
                       </span>
                     </div>
                   </div>

                   {/* Informations de progression pour les séances en cours */}
                   {seance.etat === 'en_cours' && seance.progression && (
                     <ProgressionInfo 
                       progression={seance.progression} 
                       dateDebut={seance.date_debut} 
                     />
                   )}

                   {/* Commentaire directement affiché */}
                   {seance.notes && (
                     <div className="flex items-start gap-2 pt-3 border-t border-gray-700">
                       <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                       <p className="text-gray-200 text-sm leading-relaxed flex-1">
                         {highlightMatch(seance.notes, search)}
                       </p>
                     </div>
                   )}
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 