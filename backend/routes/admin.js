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
    console.error('Erreur dans requireAdmin:', error);
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
    
    // Extraire le premier critère de tri (avant la virgule)
    const sortByStr = String(sortBy);
    const primarySort = sortByStr.split(',')[0];
    
    // Tri côté serveur simple
    if (primarySort === "last_connection" || primarySort === "last_session" || primarySort === "program_start" || primarySort === "nb_sessions") {
      utilisateursAvecStats.sort((a, b) => {
        switch (primarySort) {
          case "last_connection":
            // Tri par dernière connexion (plus récente en premier)
            if (!a.last_connection && !b.last_connection) return 0;
            if (!a.last_connection) return 1; // a null, le mettre en dernier
            if (!b.last_connection) return -1; // b null, le mettre en dernier
            
            const aLastConn = new Date(a.last_connection);
            const bLastConn = new Date(b.last_connection);
            return bLastConn.getTime() - aLastConn.getTime();
          
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
        progression,
        utilisateur_id,
        seances!inner(
          id,
          nom,
          description,
          type_seance
        ),
        utilisateurs!inner(
          id,
          nom,
          pseudo,
          email
        )
      `)
      .order("date_debut", { ascending: false })
      .order("id", { ascending: false });

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
    const seancesFormatees = sessions.map(session => {
      // Parser la progression pour les séances en cours
      let progressionInfo = null;
      if (session.etat === 'en_cours' && session.progression) {
        try {
          const progression = JSON.parse(session.progression);
          progressionInfo = {
            etape_actuelle: progression.etape_actuelle || 0,
            nombre_total_etapes: progression.nombre_total_etapes || 0,
            temps_ecoule: progression.temps_ecoule || 0,
            temps_etape_actuelle: progression.temps_etape_actuelle || 0
          };
        } catch (error) {
          console.error('Erreur parsing progression:', error);
        }
      }

      return {
        id: session.id,
        date_debut: session.date_debut,
        date_fin: session.date_fin,
        duree_minutes: Math.round((session.duree_totale || 0) / 60),
        calories: session.calories_brulees || 0,
        niveau_effort: session.niveau_effort,
        satisfaction: session.satisfaction,
        notes: session.notes,
        etat: session.etat,
        progression: progressionInfo,
        seance: {
          nom: session.seances.nom,
          description: session.seances.description,
          categorie: session.seances.categories?.nom || 'Non catégorisée',
          couleur_categorie: session.seances.categories?.couleur || '#6B7280',
          type_seance: session.seances.type_seance
        },
        utilisateur: {
          nom: session.utilisateurs.nom || session.utilisateurs.pseudo || "Utilisateur",
          email: session.utilisateurs.email
        }
      };
    });

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

// =====================================================
// ROUTES POUR L'ADMINISTRATION DES ZONES
// =====================================================

// GET /admin/zones-corps - Liste toutes les zones du corps
router.get('/zones-corps', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('zones_corps')
      .select('*')
      .order('ordre_affichage', { ascending: true });

    if (error) throw error;

    res.json({ zones: data });
  } catch (error) {
    console.error('Erreur lors de la récupération des zones du corps:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /admin/zones-corps - Créer une nouvelle zone du corps
router.post('/zones-corps', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { nom, description, couleur, icone, ordre_affichage } = req.body;

    if (!nom) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const { data, error } = await supabase
      .from('zones_corps')
      .insert([{
        nom,
        description,
        couleur: couleur || '#3B82F6',
        icone: icone || '🦵',
        ordre_affichage: ordre_affichage || 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ zone: data });
  } catch (error) {
    console.error('Erreur lors de la création de la zone du corps:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /admin/zones-corps/ordre - Mettre à jour l'ordre des zones du corps
router.put('/zones-corps/ordre', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { zones } = req.body;

    if (!Array.isArray(zones)) {
      return res.status(400).json({ error: 'Le paramètre zones doit être un tableau' });
    }

    // Mettre à jour l'ordre de chaque zone
    for (let i = 0; i < zones.length; i++) {
      const { error } = await supabase
        .from('zones_corps')
        .update({ ordre_affichage: i })
        .eq('id', zones[i].id);

      if (error) throw error;
    }

    res.json({ message: 'Ordre mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /admin/zones-corps/:id - Modifier une zone du corps
router.put('/zones-corps/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, couleur, icone, ordre_affichage } = req.body;

    if (!nom) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const { data, error } = await supabase
      .from('zones_corps')
      .update({
        nom,
        description,
        couleur: couleur || '#3B82F6',
        icone: icone || '🦵',
        ordre_affichage: ordre_affichage || 0
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ zone: data });
  } catch (error) {
    console.error('Erreur lors de la modification de la zone du corps:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /admin/zones-corps/:id - Supprimer une zone du corps
router.delete('/zones-corps/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des zones spécifiques liées
    const { data: zonesSpecifiques, error: checkError } = await supabase
      .from('zones_specifiques')
      .select('id')
      .eq('zone_corps_id', id);

    if (checkError) throw checkError;

    if (zonesSpecifiques && zonesSpecifiques.length > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer cette zone du corps car elle contient des zones spécifiques' 
      });
    }

    const { error } = await supabase
      .from('zones_corps')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Zone du corps supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la zone du corps:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// PUT /admin/zones-specifiques/ordre - Mettre à jour l'ordre des zones spécifiques
router.put('/zones-specifiques/ordre', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { zonesSpecifiques } = req.body;

    if (!Array.isArray(zonesSpecifiques)) {
      return res.status(400).json({ error: 'Le paramètre zonesSpecifiques doit être un tableau' });
    }

    // Mettre à jour l'ordre de chaque zone spécifique
    for (let i = 0; i < zonesSpecifiques.length; i++) {
      const { error } = await supabase
        .from('zones_specifiques')
        .update({ ordre_affichage: i })
        .eq('id', zonesSpecifiques[i].id);

      if (error) throw error;
    }

    res.json({ message: 'Ordre mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /admin/zones-specifiques - Liste toutes les zones spécifiques
router.get('/zones-specifiques', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('zones_specifiques')
      .select(`
        *,
        zones_corps (
          id,
          nom,
          icone,
          couleur
        )
      `)
      .order('ordre_affichage', { ascending: true });

    if (error) throw error;

    res.json({ zonesSpecifiques: data });
  } catch (error) {
    console.error('Erreur lors de la récupération des zones spécifiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /admin/zones-specifiques - Créer une nouvelle zone spécifique
router.post('/zones-specifiques', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { nom, description, zone_corps_id, ordre_affichage } = req.body;

    if (!nom || !zone_corps_id) {
      return res.status(400).json({ error: 'Le nom et la zone du corps sont requis' });
    }

    const { data, error } = await supabase
      .from('zones_specifiques')
      .insert([{
        nom,
        description,
        zone_corps_id,
        ordre_affichage: ordre_affichage || 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ zoneSpecifique: data });
  } catch (error) {
    console.error('Erreur lors de la création de la zone spécifique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /admin/zones-specifiques/:id - Modifier une zone spécifique
router.put('/zones-specifiques/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, zone_corps_id, ordre_affichage } = req.body;

    if (!nom || !zone_corps_id) {
      return res.status(400).json({ error: 'Le nom et la zone du corps sont requis' });
    }

    const { data, error } = await supabase
      .from('zones_specifiques')
      .update({
        nom,
        description,
        zone_corps_id,
        ordre_affichage: ordre_affichage || 0
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ zoneSpecifique: data });
  } catch (error) {
    console.error('Erreur lors de la modification de la zone spécifique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /admin/zones-specifiques/:id - Supprimer une zone spécifique
router.delete('/zones-specifiques/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des exercices liés
    const { data: exercices, error: checkError } = await supabase
      .from('exercices_zones_specifiques')
      .select('exercice_id')
      .eq('zone_specifique_id', id);

    if (checkError) throw checkError;

    if (exercices && exercices.length > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer cette zone spécifique car elle est utilisée par des exercices' 
      });
    }

    const { error } = await supabase
      .from('zones_specifiques')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Zone spécifique supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la zone spécifique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// =====================================================
// ROUTES POUR L'ADMINISTRATION DES CATÉGORIES
// =====================================================

// GET /admin/categories - Liste toutes les catégories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('ordre_affichage', { ascending: true });

    if (error) throw error;

    res.json({ categories: data });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /admin/categories - Créer une nouvelle catégorie
router.post('/categories', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { nom, description, couleur, icone, ordre_affichage } = req.body;

    if (!nom) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        nom,
        description,
        couleur: couleur || '#3B82F6',
        icone: icone || '📁',
        ordre_affichage: ordre_affichage || 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ categorie: data });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /admin/categories/ordre - Mettre à jour l'ordre des catégories
router.put('/categories/ordre', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'Le paramètre categories doit être un tableau' });
    }

    // Mettre à jour l'ordre de chaque catégorie
    for (let i = 0; i < categories.length; i++) {
      const { error } = await supabase
        .from('categories')
        .update({ ordre_affichage: i })
        .eq('id', categories[i].id);

      if (error) throw error;
    }

    res.json({ message: 'Ordre mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /admin/categories/:id - Modifier une catégorie
router.put('/categories/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, couleur, icone, ordre_affichage } = req.body;

    if (!nom) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        nom,
        description,
        couleur: couleur || '#3B82F6',
        icone: icone || '📁',
        ordre_affichage: ordre_affichage || 0
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ categorie: data });
  } catch (error) {
    console.error('Erreur lors de la modification de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /admin/categories/:id - Supprimer une catégorie
router.delete('/categories/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des sous-catégories liées
    const { data: sousCategories, error: checkError } = await supabase
      .from('sous_categories')
      .select('id')
      .eq('categorie_id', id);

    if (checkError) throw checkError;

    if (sousCategories && sousCategories.length > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer cette catégorie car elle contient des sous-catégories' 
      });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// =====================================================
// ROUTES POUR L'ADMINISTRATION DES SOUS-CATÉGORIES
// =====================================================

// GET /admin/sous-categories - Liste toutes les sous-catégories
router.get('/sous-categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sous_categories')
      .select(`
        *,
        categories (
          id,
          nom,
          icone,
          couleur
        )
      `)
      .order('ordre_affichage', { ascending: true });

    if (error) throw error;

    res.json({ sousCategories: data });
  } catch (error) {
    console.error('Erreur lors de la récupération des sous-catégories:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /admin/sous-categories - Créer une nouvelle sous-catégorie
router.post('/sous-categories', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { nom, description, categorie_id, ordre_affichage } = req.body;

    if (!nom || !categorie_id) {
      return res.status(400).json({ error: 'Le nom et la catégorie sont requis' });
    }

    const { data, error } = await supabase
      .from('sous_categories')
      .insert([{
        nom,
        description,
        categorie_id,
        ordre_affichage: ordre_affichage || 0
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ sousCategorie: data });
  } catch (error) {
    console.error('Erreur lors de la création de la sous-catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /admin/sous-categories/ordre - Mettre à jour l'ordre des sous-catégories
router.put('/sous-categories/ordre', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { sousCategories } = req.body;

    if (!Array.isArray(sousCategories)) {
      return res.status(400).json({ error: 'Le paramètre sousCategories doit être un tableau' });
    }

    // Mettre à jour l'ordre de chaque sous-catégorie
    for (let i = 0; i < sousCategories.length; i++) {
      const { error } = await supabase
        .from('sous_categories')
        .update({ ordre_affichage: i })
        .eq('id', sousCategories[i].id);

      if (error) throw error;
    }

    res.json({ message: 'Ordre mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /admin/sous-categories/:id - Modifier une sous-catégorie
router.put('/sous-categories/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, categorie_id, ordre_affichage } = req.body;

    if (!nom || !categorie_id) {
      return res.status(400).json({ error: 'Le nom et la catégorie sont requis' });
    }

    const { data, error } = await supabase
      .from('sous_categories')
      .update({
        nom,
        description,
        categorie_id,
        ordre_affichage: ordre_affichage || 0
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ sousCategorie: data });
  } catch (error) {
    console.error('Erreur lors de la modification de la sous-catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /admin/sous-categories/:id - Supprimer une sous-catégorie
router.delete('/sous-categories/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des exercices liés
    const { data: exercices, error: checkError } = await supabase
      .from('exercices_sous_categories')
      .select('exercice_id')
      .eq('sous_categorie_id', id);

    if (checkError) throw checkError;

    if (exercices && exercices.length > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer cette sous-catégorie car elle est utilisée par des exercices' 
      });
    }

    const { error } = await supabase
      .from('sous_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Sous-catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la sous-catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router; 