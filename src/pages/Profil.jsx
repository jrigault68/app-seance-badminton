import { useUser } from "../contexts/UserContext";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgrammeActuelCard from "../components/ui/ProgrammeActuelCard";
import SemaineProgramme from "../components/ui/SemaineProgramme";
import ProgressionProgramme from "../components/ui/ProgressionProgramme";
import programmeService from "../services/programmeService";
import { Trophy, Calendar, Target, User } from "lucide-react";

export default function Profil() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [programmeActuel, setProgrammeActuel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statistiques, setStatistiques] = useState({
    seancesCompletees: 0,
    programmesSuivis: 0,
    objectifsAtteints: 0
  });

  // Charger le programme actuel et les statistiques
  useEffect(() => {
    const chargerDonnees = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Charger le programme actuel
        const programmeData = await programmeService.getProgrammeActuel();
        setProgrammeActuel(programmeData);
        
        // Charger les statistiques
        const statsData = await programmeService.getStatistiquesUtilisateur();
        console.log('Statistiques récupérées:', statsData);
        setStatistiques(statsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    chargerDonnees();
  }, [user]);

  const handleVoirProgramme = () => {
    if (programmeActuel) {
      navigate(`/programmes/${programmeActuel.id}`);
    }
  };

  const handleSeanceClick = (seance) => {
    // Naviguer vers la page de détail de la séance
    if (seance && seance.id) {
      navigate(`/seances/${seance.id}`);
    }
  };

  if (!user) return null;

  return (
    <Layout pageTitle="Profil">
      <div className="w-full flex justify-center px-2 sm:px-4 md:px-12">
        <div className="w-full max-w-none mx-auto" style={{maxWidth: '1200px', marginTop: '2rem'}}>
          
          {/* En-tête du profil */}
          <div className="bg-black/40 border border-gray-700 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.nom}</h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Membre depuis</div>
                <div className="text-white font-medium">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>

          {/* Section Programme Actuel */}
          {loading ? (
            <div className="bg-gray-800/30 rounded-2xl p-6 mb-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
              </div>
            </div>
          ) : programmeActuel ? (
            <>
              {console.log('Rendu du programme actuel:', programmeActuel)}
              {/* Carte du programme actuel */}
              <ProgrammeActuelCard 
                programme={programmeActuel}
                onVoirProgramme={handleVoirProgramme}
              />

              {/* Progression du programme - seulement si le programme a un ID */}
              {programmeActuel.id && (
                <ProgressionProgramme 
                  programme={programmeActuel}
                />
              )}

              {/* Vue calendrier de la semaine - seulement si le programme a un ID */}
              {programmeActuel.id && (
                <SemaineProgramme 
                  programmeId={programmeActuel.id}
                  onSeanceClick={handleSeanceClick}
                />
              )}
            </>
          ) : (
            <>
              {console.log('Aucun programme actuel trouvé')}
              /* Aucun programme actuel */
              <div className="bg-gray-800/30 rounded-2xl p-8 text-center">
                <div className="mb-6">
                  <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Aucun programme en cours
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Rejoignez un programme pour commencer votre entraînement !
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/programmes')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <Target className="w-5 h-5 inline mr-2" />
                    Découvrir les programmes
                  </button>
                  
                  <button
                    onClick={() => navigate('/seances')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Voir les séances
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Section Statistiques générales */}
          <div className="bg-gray-800/30 rounded-2xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Mes statistiques
            </h3>
            
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-gray-700/50 rounded-lg p-4">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-blue-500/20 rounded-lg">
                     <Calendar className="w-5 h-5 text-blue-400" />
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-white">{statistiques.seancesCompletees}</div>
                     <div className="text-xs text-gray-400">Séances complétées</div>
                   </div>
                 </div>
               </div>

               <div className="bg-gray-700/50 rounded-lg p-4">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-green-500/20 rounded-lg">
                     <Target className="w-5 h-5 text-green-400" />
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-white">{statistiques.programmesSuivis}</div>
                     <div className="text-xs text-gray-400">Programmes suivis</div>
                   </div>
                 </div>
               </div>

               <div className="bg-gray-700/50 rounded-lg p-4">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-purple-500/20 rounded-lg">
                     <Trophy className="w-5 h-5 text-purple-400" />
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-white">{statistiques.objectifsAtteints}</div>
                     <div className="text-xs text-gray-400">Objectifs atteints</div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
