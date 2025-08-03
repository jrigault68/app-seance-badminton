const express = require("express");
const supabase = require("../supabase");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Middleware pour vérifier que l'utilisateur est admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.is_admin) {
      return res.status(403).json({ message: "Accès réservé aux administrateurs" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur de vérification des droits" });
  }
};

// Route pour récupérer tous les utilisateurs avec leurs statistiques
router.get("/utilisateurs", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { search = "", sortBy = "last_connection", limit = 50, offset = 0 } = req.query;

    // Requête de base pour les utilisateurs
    let query = supabase
      .from("utilisateurs")
      .select(`
        id,
        email,
        nom,
        pseudo,
        avatar_url,
        niveau_utilisateur,
        is_admin,
        created_at,
        last_connection
      `);

    // Appliquer le tri selon le paramètre
    switch (sortBy) {
      case "created_at":
        query = query.order("created_at", { ascending: false });
        break;
      case "last_connection":
        // On triera côté serveur pour avoir le contrôle total
        query = query.order("created_at", { ascending: false });
        break;
      case "last_session":
        // On triera après avoir récupéré les données
        query = query.order("created_at", { ascending: false });
        break;
      case "program_start":
        // On triera après avoir récupéré les données
        query = query.order("created_at", { ascending: false });
        break;
      case "nb_sessions":
        // On triera après avoir récupéré les données
        query = query.order("created_at", { ascending: false });
        break;
      default:
        // On triera côté serveur pour avoir le contrôle total
        query = query.order("created_at", { ascending: false });
    }

    // Filtrage par recherche
    if (search) {
      query = query.or(`nom.ilike.%${search}%,email.ilike.%${search}%,pseudo.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: utilisateurs, error: usersError } = await query;

    if (usersError) {
      console.error("Erreur lors de la récupération des utilisateurs:", usersError);
      return res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }

    // Pour chaque utilisateur, récupérer les statistiques
    const utilisateursAvecStats = await Promise.all(
      utilisateurs.map(async (utilisateur) => {
        // Récupérer le programme actuel
        const { data: programmeActuel } = await supabase
          .from("utilisateur_programmes")
          .select(`
            programme_id,
            date_debut,
            est_actif,
            programmes!inner(nom, description)
          `)
          .eq("utilisateur_id", utilisateur.id)
          .eq("est_actif", true)
          .single();

        // Compter le nombre total de séances réalisées
        const { count: nbSeances } = await supabase
          .from("sessions_entrainement")
          .select("*", { count: "exact", head: true })
          .eq("utilisateur_id", utilisateur.id)
          .eq("etat", "terminee");

        // Récupérer la dernière séance
        const { data: derniereSeance } = await supabase
          .from("sessions_entrainement")
          .select(`
            date_fin,
            seances!inner(nom)
          `)
          .eq("utilisateur_id", utilisateur.id)
          .eq("etat", "terminee")
          .order("date_fin", { ascending: false })
          .limit(1)
          .single();

        // Calculer les statistiques de progression
        const { data: sessionsRecentes } = await supabase
          .from("sessions_entrainement")
          .select("date_debut, duree_totale, calories_brulees")
          .eq("utilisateur_id", utilisateur.id)
          .eq("etat", "terminee")
          .gte("date_debut", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // 30 derniers jours
          .order("date_debut", { ascending: false });

        // Calculer les moyennes des 30 derniers jours
        const stats30Jours = sessionsRecentes.reduce((acc, session) => {
          acc.dureeTotale += session.duree_totale || 0;
          acc.caloriesTotales += session.calories_brulees || 0;
          acc.nbSessions += 1;
          return acc;
        }, { dureeTotale: 0, caloriesTotales: 0, nbSessions: 0 });

        return {
          ...utilisateur,
          programme_actuel: programmeActuel ? {
            id: programmeActuel.programme_id,
            nom: programmeActuel.programmes.nom,
            description: programmeActuel.programmes.description,
            date_debut: programmeActuel.date_debut
          } : null,
          statistiques: {
            nb_seances_totales: nbSeances || 0,
            derniere_seance: derniereSeance ? {
              date: derniereSeance.date_fin,
              nom: derniereSeance.seances.nom
            } : null,
            stats_30_jours: {
              nb_sessions: stats30Jours.nbSessions,
              duree_moyenne: stats30Jours.nbSessions > 0 ? Math.round(stats30Jours.dureeTotale / stats30Jours.nbSessions / 60) : 0, // en minutes
              calories_moyennes: stats30Jours.nbSessions > 0 ? Math.round(stats30Jours.caloriesTotales / stats30Jours.nbSessions) : 0
            }
          }
        };
      })
    );

    // Nettoyer et valider les données de last_connection
    utilisateursAvecStats.forEach(utilisateur => {
      // S'assurer que last_connection est une date valide ou null
      if (utilisateur.last_connection && isNaN(new Date(utilisateur.last_connection).getTime())) {
        utilisateur.last_connection = null;
      }
    });
    console.log(`Sort by : ${sortBy}`);
    // Extraire le premier critère de tri (avant la virgule)
    const sortByStr = String(sortBy);
    const primarySort = sortByStr.split(',')[0];
    console.log(`Primary sort: ${primarySort}`);
    
    // Tri côté serveur simple
    if (primarySort === "last_connection" || primarySort === "last_session" || primarySort === "program_start" || primarySort === "nb_sessions") {
             console.log(`Tri côté serveur par: ${primarySort}`);
      
      // Debug: afficher quelques valeurs avant tri
      console.log("Avant tri - 3 premiers:");
      utilisateursAvecStats.slice(0, 3).forEach((u, i) => {
        console.log(`${i+1}. ${u.nom}: last_connection=${u.last_connection}`);
      });
      
             utilisateursAvecStats.sort((a, b) => {
         switch (primarySort) {
          case "last_connection":
            // Tri par dernière connexion (plus récente en premier)
            if (!a.last_connection && !b.last_connection) return 0;
            if (!a.last_connection) return 1; // a null, le mettre en dernier
            if (!b.last_connection) return -1; // b null, le mettre en dernier
            
            const aLastConn = new Date(a.last_connection);
            const bLastConn = new Date(b.last_connection);
            const diff = bLastConn.getTime() - aLastConn.getTime();
            console.log(`Comparaison: ${a.nom}(${aLastConn.toISOString()}) vs ${b.nom}(${bLastConn.toISOString()}) = ${diff}`);
            return diff;
          
          case "last_session":
            // Tri par dernière séance (plus récente en premier)
            if (!a.statistiques.derniere_seance?.date && !b.statistiques.derniere_seance?.date) return 0;
            if (!a.statistiques.derniere_seance?.date) return 1; // a null, le mettre en dernier
            if (!b.statistiques.derniere_seance?.date) return -1; // b null, le mettre en dernier
            
            const aLastSession = new Date(a.statistiques.derniere_seance.date);
            const bLastSession = new Date(b.statistiques.derniere_seance.date);
            return bLastSession.getTime() - aLastSession.getTime();
          
          case "program_start":
            // Tri par date d'inscription au programme (plus récente en premier)
            if (!a.programme_actuel?.date_debut && !b.programme_actuel?.date_debut) return 0;
            if (!a.programme_actuel?.date_debut) return 1; // a null, le mettre en dernier
            if (!b.programme_actuel?.date_debut) return -1; // b null, le mettre en dernier
            
            const aProgramStart = new Date(a.programme_actuel.date_debut);
            const bProgramStart = new Date(b.programme_actuel.date_debut);
            return bProgramStart.getTime() - aProgramStart.getTime();
          
          case "nb_sessions":
            // Tri par nombre de sessions (plus élevé en premier)
            return b.statistiques.nb_seances_totales - a.statistiques.nb_seances_totales;
          
          default:
            return 0;
        }
      });
      
      // Debug: afficher quelques valeurs après tri
      console.log("Après tri - 3 premiers:");
      utilisateursAvecStats.slice(0, 3).forEach((u, i) => {
        console.log(`${i+1}. ${u.nom}: last_connection=${u.last_connection}`);
      });
    }



    res.json(utilisateursAvecStats);
  } catch (error) {
    console.error("Erreur dans /admin/utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
});

// Route pour obtenir les détails d'un utilisateur spécifique
router.get("/utilisateurs/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer les informations de base de l'utilisateur
    const { data: utilisateur, error: userError } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", id)
      .single();

    if (userError || !utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Récupérer l'historique des programmes
    const { data: programmesSuivis } = await supabase
      .from("utilisateur_programmes")
      .select(`
        date_debut,
        date_fin,
        est_actif,
        progression,
        programmes!inner(id, nom, description)
      `)
      .eq("utilisateur_id", id)
      .order("date_debut", { ascending: false });

    // Récupérer l'historique des sessions
    const { data: sessions } = await supabase
      .from("sessions_entrainement")
      .select(`
        id,
        date_debut,
        date_fin,
        duree_totale,
        calories_brulees,
        niveau_effort,
        satisfaction,
        etat,
        seances!inner(nom, description)
      `)
      .eq("utilisateur_id", id)
      .order("date_debut", { ascending: false })
      .limit(50); // Limiter à 50 dernières sessions

    // Calculer les statistiques détaillées
    const sessionsTerminees = sessions.filter(s => s.etat === "terminee");
    const stats = {
      total_sessions: sessionsTerminees.length,
      temps_total: sessionsTerminees.reduce((acc, s) => acc + (s.duree_totale || 0), 0),
      calories_totales: sessionsTerminees.reduce((acc, s) => acc + (s.calories_brulees || 0), 0),
      effort_moyen: sessionsTerminees.length > 0 
        ? sessionsTerminees.reduce((acc, s) => acc + (s.niveau_effort || 0), 0) / sessionsTerminees.length 
        : 0,
      satisfaction_moyenne: sessionsTerminees.length > 0 
        ? sessionsTerminees.reduce((acc, s) => acc + (s.satisfaction || 0), 0) / sessionsTerminees.length 
        : 0
    };

    res.json({
      utilisateur,
      programmes_suivis: programmesSuivis,
      sessions_recentes: sessions,
      statistiques: stats
    });
  } catch (error) {
    console.error("Erreur dans /admin/utilisateurs/:id:", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
});

// Route pour récupérer les dernières séances avec notes et commentaires
router.get("/seances-recentes", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 20, offset = 0, utilisateur_id } = req.query;

    let query = supabase
      .from("sessions_entrainement")
      .select(`
        id,
        date_debut,
        date_fin,
        duree_totale,
        calories_brulees,
        niveau_effort,
        satisfaction,
        notes,
        etat,
        utilisateur_id,
        seances!inner(
          id,
          nom,
          description,
          niveau_id,
          categories!inner(nom, couleur)
        ),
        utilisateurs!inner(
          id,
          nom,
          pseudo,
          email
        )
      `)
      .eq("etat", "terminee")
      .not("notes", "is", null)
      .order("date_fin", { ascending: false });

    // Filtrer par utilisateur si spécifié
    if (utilisateur_id) {
      query = query.eq("utilisateur_id", utilisateur_id);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: sessions, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des séances récentes:", error);
      return res.status(500).json({ message: "Erreur lors de la récupération des séances récentes" });
    }

    // Formater les données pour l'affichage
    const seancesFormatees = sessions.map(session => ({
      id: session.id,
      date_fin: session.date_fin,
      duree_minutes: Math.round((session.duree_totale || 0) / 60),
      calories: session.calories_brulees || 0,
      niveau_effort: session.niveau_effort,
      satisfaction: session.satisfaction,
      notes: session.notes,
      seance: {
        nom: session.seances.nom,
        description: session.seances.description,
        categorie: session.seances.categories.nom,
        couleur_categorie: session.seances.categories.couleur
      },
      utilisateur: {
        nom: session.utilisateurs.nom || session.utilisateurs.pseudo || "Utilisateur",
        email: session.utilisateurs.email
      }
    }));

    res.json({
      seances: seancesFormatees,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: seancesFormatees.length
      }
    });
  } catch (error) {
    console.error("Erreur dans /admin/seances-recentes:", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
});

module.exports = router; 