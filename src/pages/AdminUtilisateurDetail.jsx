import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useUser } from "../contexts/UserContext";
import { ArrowLeft, User, Mail, Calendar, Clock, Target, TrendingUp, Shield, Activity, BarChart3, History } from 'lucide-react';
import AdminService from "../services/adminService";

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
function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0 min";
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  return `${mins}min`;
}

export default function AdminUtilisateurDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [utilisateur, setUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUtilisateurDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminService.getUtilisateurDetails(id);
        setUtilisateur(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.is_admin && id) {
      fetchUtilisateurDetails();
    }
  }, [id, user]);

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

  if (loading) {
    return (
      <Layout pageTitle="Chargement...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout pageTitle="Erreur">
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate('/admin-utilisateurs')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retour à la liste
          </button>
        </div>
      </Layout>
    );
  }

  if (!utilisateur) {
    return (
      <Layout pageTitle="Utilisateur non trouvé">
        <div className="text-center py-12">
          <p className="text-gray-400">Utilisateur non trouvé</p>
          <button
            onClick={() => navigate('/admin-utilisateurs')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retour à la liste
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={`Détails - ${utilisateur.utilisateur.nom || utilisateur.utilisateur.email}`}>
      <div className="p-4 space-y-6">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/admin-utilisateurs')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour à la liste
        </button>

        {/* Informations de base */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#232526]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                {utilisateur.utilisateur.nom || utilisateur.utilisateur.pseudo || "Utilisateur sans nom"}
              </h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{utilisateur.utilisateur.email}</span>
                </div>
                {utilisateur.utilisateur.is_admin && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">Administrateur</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#232526] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-400">Inscription</span>
              </div>
              <p className="text-gray-100">{formatDate(utilisateur.utilisateur.created_at)}</p>
            </div>

            <div className="bg-[#232526] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-400">Dernière connexion</span>
              </div>
              <p className="text-gray-100">{formatDate(utilisateur.utilisateur.last_connection)}</p>
            </div>

            <div className="bg-[#232526] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-400">Niveau</span>
              </div>
              <p className="text-gray-100 capitalize">{utilisateur.utilisateur.niveau_utilisateur || "Non défini"}</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#232526]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#232526] rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-100">{utilisateur.statistiques.total_sessions}</p>
              <p className="text-sm text-gray-400">Sessions totales</p>
            </div>
            <div className="bg-[#232526] rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-100">{formatDuration(utilisateur.statistiques.temps_total)}</p>
              <p className="text-sm text-gray-400">Temps total</p>
            </div>
            <div className="bg-[#232526] rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-100">{utilisateur.statistiques.calories_totales}</p>
              <p className="text-sm text-gray-400">Calories totales</p>
            </div>
            <div className="bg-[#232526] rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-100">
                {utilisateur.statistiques.effort_moyen ? utilisateur.statistiques.effort_moyen.toFixed(1) : "0"}
              </p>
              <p className="text-sm text-gray-400">Effort moyen (/10)</p>
            </div>
          </div>
        </div>

        {/* Programmes suivis */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#232526]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Programmes suivis
          </h2>
          {utilisateur.programmes_suivis.length > 0 ? (
            <div className="space-y-3">
              {utilisateur.programmes_suivis.map((programme, index) => (
                <div key={index} className="bg-[#232526] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">{programme.programmes.nom}</h3>
                      <p className="text-sm text-gray-400">{programme.programmes.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Début: {formatDate(programme.date_debut)}</span>
                        {programme.date_fin && <span>Fin: {formatDate(programme.date_fin)}</span>}
                        <span className={programme.est_actif ? "text-green-500" : "text-gray-500"}>
                          {programme.est_actif ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aucun programme suivi</p>
          )}
        </div>

        {/* Sessions récentes */}
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#232526]">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            Sessions récentes
          </h2>
          {utilisateur.sessions_recentes.length > 0 ? (
            <div className="space-y-3">
              {utilisateur.sessions_recentes.map((session) => (
                <div key={session.id} className="bg-[#232526] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">{session.seances.nom}</h3>
                      <p className="text-sm text-gray-400">{session.seances.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Début: {formatDate(session.date_debut)}</span>
                        {session.date_fin && <span>Fin: {formatDate(session.date_fin)}</span>}
                        <span className={session.etat === 'terminee' ? "text-green-500" : "text-orange-500"}>
                          {session.etat === 'terminee' ? "Terminée" : session.etat}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      {session.duree_totale && (
                        <p className="text-gray-100">{formatDuration(session.duree_totale)}</p>
                      )}
                      {session.calories_brulees && (
                        <p className="text-gray-400">{session.calories_brulees} cal</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aucune session récente</p>
          )}
        </div>
      </div>
    </Layout>
  );
} 