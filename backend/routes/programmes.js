const express = require("express");
const router = express.Router();
const db = require("../supabase"); // À adapter si tu utilises un autre système de connexion
const verifyToken = require('../middleware/auth');

// POST création programme
router.post("/", verifyToken, async (req, res) => {
  console.log("Body reçu pour création programme :", req.body);
  let {
    nom, description, niveau_id, categorie_id, type_id, nb_jours,
    objectif, image_url, date_debut, date_fin, est_actif, type_programme
  } = req.body;

  // Forcer les dates vides à null
  if (!date_debut) date_debut = null;
  if (!date_fin) date_fin = null;

  // Idem pour les autres champs optionnels si besoin
  if (!nb_jours) nb_jours = null;
  if (!objectif) objectif = null;
  if (!image_url) image_url = null;

  const created_by = req.user?.id || null;

  try {
    const { data, error } = await db.from("programmes").insert([
      {
        nom, description, niveau_id, categorie_id, type_id, nb_jours,
        objectif, image_url, date_debut, date_fin, est_actif, type_programme,
        created_by
      }
    ]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Erreur lors de la création du programme :", err);
    res.status(500).json({ error: "Erreur lors de la création du programme", details: err.message });
  }
});

// GET / - Récupérer tous les programmes
router.get('/', async (req, res) => {
  try {
    const { data, error } = await db.from('programmes').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Erreur lors de la récupération des programmes :', err);
    res.status(500).json({ error: "Erreur lors de la récupération des programmes", details: err.message });
  }
});

// GET /:id - Détail d'un programme (avec pseudo créateur ou nom)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Récupérer le programme
    const { data: programme, error } = await db.from('programmes').select('*').eq('id', id).single();
    if (error) throw error;
    let pseudo = null;
    if (programme && programme.created_by) {
      // Récupérer le pseudo ou nom de l'utilisateur créateur
      const { data: user, error: userError } = await db.from('utilisateurs').select('pseudo, nom').eq('id', programme.created_by).single();
      if (!userError && user) {
        pseudo = user.pseudo || user.nom || null;
      }
    }
    res.json({ ...programme, pseudo_createur: pseudo });
  } catch (err) {
    console.error('Erreur lors de la récupération du programme :', err);
    res.status(500).json({ error: "Erreur lors de la récupération du programme", details: err.message });
  }
});

// PUT /:id - Modifier un programme (créateur ou admin)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.is_admin;
  try {
    // Vérifier que le programme appartient à l'utilisateur ou que c'est un admin
    const { data: existing, error: errorGet } = await db.from('programmes').select('*').eq('id', id).single();
    if (errorGet) throw errorGet;
    if (!existing || (!isAdmin && existing.created_by !== userId)) {
      return res.status(403).json({ error: "Accès refusé : vous n'êtes pas le créateur de ce programme." });
    }
    // Préparer les champs à mettre à jour
    const updateFields = { ...req.body };
    // Nettoyer les champs non modifiables
    delete updateFields.id;
    delete updateFields.created_by;
    delete updateFields.created_at;
    delete updateFields.updated_at; // on ignore la valeur envoyée par le client
    updateFields.updated_at = new Date().toISOString(); // on force la vraie date de modif
    // Mettre à jour
    const { data, error } = await db.from('programmes').update(updateFields).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du programme", details: err.message });
  }
});

// DELETE /:id - Supprimer un programme (créateur ou admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.is_admin;
  try {
    // Vérifier que le programme appartient à l'utilisateur ou que c'est un admin
    const { data: existing, error: errorGet } = await db.from('programmes').select('*').eq('id', id).single();
    if (errorGet) throw errorGet;
    console.log("existing", existing);
    console.log("userId", userId);
    console.log("isAdmin", isAdmin);
    console.log("existing.created_by", existing.created_by);
    
    if (!existing || (!isAdmin && existing.created_by !== userId)) {
      return res.status(403).json({ error: "Accès refusé : vous n'êtes pas le créateur de ce programme." });
    }
    // Supprimer le programme (les entrées dans programme_seances seront supprimées automatiquement grâce à ON DELETE CASCADE)
    const { error } = await db.from('programmes').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: "Programme supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression du programme", details: err.message });
  }
});

// Associer une séance à un jour (programme libre)
router.post('/:id/jours/:jour/seances', verifyToken, async (req, res) => {
  const { id, jour } = req.params;
  const { seance_id } = req.body;
  const userId = req.user?.id;
  const isAdmin = req.user?.is_admin;
  try {
    // Vérifier que le programme appartient à l'utilisateur ou que c'est un admin
    const { data: existing, error: errorGet } = await db.from('programmes').select('*').eq('id', id).single();
    if (errorGet) throw errorGet;
    if (!existing || (!isAdmin && existing.created_by !== userId)) {
      return res.status(403).json({ error: "Accès refusé : vous n'êtes pas le créateur de ce programme." });
    }
    const { data, error } = await db.from('programme_seances').insert([
      { programme_id: id, jour: parseInt(jour, 10), date: null, seance_id }
    ]).select();
    if (error) throw error;
    res.status(201).json({ message: 'Séance associée au programme (jour)', data });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'association séance-programme (jour)', details: err.message });
  }
});

// Associer une séance à une date (programme calendaire)
router.post('/:id/dates/:date/seances', verifyToken, async (req, res) => {
  const { id, date } = req.params;
  const { seance_id } = req.body;
  const userId = req.user?.id;
  const isAdmin = req.user?.is_admin;
  try {
    // Vérifier que le programme appartient à l'utilisateur ou que c'est un admin
    const { data: existing, error: errorGet } = await db.from('programmes').select('*').eq('id', id).single();
    if (errorGet) throw errorGet;
    if (!existing || (!isAdmin && existing.created_by !== userId)) {
      return res.status(403).json({ error: "Accès refusé : vous n'êtes pas le créateur de ce programme." });
    }
    const { data, error } = await db.from('programme_seances').insert([
      { programme_id: id, jour: null, date, seance_id }
    ]).select();
    if (error) throw error;
    res.status(201).json({ message: 'Séance associée au programme (date)', data });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'association séance-programme (date)', details: err.message });
  }
});

// Supprimer une séance d'un jour (programme libre)
router.delete('/:id/jours/:jour/seances/:seanceId', verifyToken, async (req, res) => {
  const { id, jour, seanceId } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.is_admin;
  try {
    // Vérifier que le programme appartient à l'utilisateur ou que c'est un admin
    const { data: existing, error: errorGet } = await db.from('programmes').select('*').eq('id', id).single();
    if (errorGet) throw errorGet;
    if (!existing || (!isAdmin && existing.created_by !== userId)) {
      return res.status(403).json({ error: "Accès refusé : vous n'êtes pas le créateur de ce programme." });
    }
    const { error } = await db
      .from('programme_seances')
      .delete()
      .eq('programme_id', id)
      .eq('jour', parseInt(jour, 10))
      .eq('seance_id', seanceId);
    if (error) throw error;
    res.json({ message: 'Séance dissociée du programme (jour)' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression séance-programme (jour)', details: err.message });
  }
});

// Supprimer une séance d'une date (programme calendaire)
router.delete('/:id/dates/:date/seances/:seanceId', verifyToken, async (req, res) => {
  const { id, date, seanceId } = req.params;
  const userId = req.user?.id;
  const isAdmin = req.user?.is_admin;
  try {
    // Vérifier que le programme appartient à l'utilisateur ou que c'est un admin
    const { data: existing, error: errorGet } = await db.from('programmes').select('*').eq('id', id).single();
    if (errorGet) throw errorGet;
    if (!existing || (!isAdmin && existing.created_by !== userId)) {
      return res.status(403).json({ error: "Accès refusé : vous n'êtes pas le créateur de ce programme." });
    }
    const { error } = await db
      .from('programme_seances')
      .delete()
      .eq('programme_id', id)
      .eq('date', date)
      .eq('seance_id', seanceId);
    if (error) throw error;
    res.json({ message: 'Séance dissociée du programme (date)' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression séance-programme (date)', details: err.message });
  }
});

// Récupérer les séances associées à un programme par jour (libre)
router.get('/:id/jours', async (req, res) => {
  const { id } = req.params;
  try {
    // Récupérer tous les jours associés à ce programme
    const { data, error } = await db
      .from('programme_seances')
      .select('jour, seance_id, seances(*)')
      .eq('programme_id', id)
      .not('jour', 'is', null)
      .order('jour', { ascending: true });
    if (error) throw error;
    // Regrouper par jour
    const jours = {};
    for (const row of data) {
      if (!jours[row.jour]) jours[row.jour] = [];
      if (row.seances) jours[row.jour].push(row.seances);
    }
    // Format [{ jour: 1, seances: [seanceObj, ...] }, ...]
    const result = Object.entries(jours).map(([jour, seances]) => ({ jour: parseInt(jour, 10), seances }));
    res.json(result);
  } catch (err) {
    console.error('Erreur lors de la récupération des séances par jour :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des séances par jour', details: err.message });
  }
});

// Récupérer les séances associées à un programme par date (calendaire)
router.get('/:id/dates', async (req, res) => {
  const { id } = req.params;
  try {
    // Récupérer toutes les dates associées à ce programme
    const { data, error } = await db
      .from('programme_seances')
      .select('date, seance_id, seances(*)')
      .eq('programme_id', id)
      .not('date', 'is', null)
      .order('date', { ascending: true });
    if (error) throw error;
    // Regrouper par date
    const dates = {};
    for (const row of data) {
      if (!dates[row.date]) dates[row.date] = [];
      if (row.seances) dates[row.date].push(row.seances);
    }
    // Format [{ date: 'YYYY-MM-DD', seances: [seanceObj, ...] }, ...]
    const result = Object.entries(dates).map(([date, seances]) => ({ date, seances }));
    res.json(result);
  } catch (err) {
    console.error('Erreur lors de la récupération des séances par date :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des séances par date', details: err.message });
  }
});

// Route pour récupérer le programme suivi par un utilisateur
router.get('/utilisateur/actuel', verifyToken, async (req, res) => {
  try {
    const { data, error } = await db.from('utilisateur_programmes').select('*').eq('utilisateur_id', req.user.id).eq('est_actif', true);
    if (error) throw error;
    
    // Si aucun programme actuel trouvé
    if (!data || data.length === 0) {
      return res.json(null);
    }
    
    // Prendre le premier programme actuel (il ne devrait y en avoir qu'un)
    const programmeActuel = data[0];
    const { data: programme, error: programmeError } = await db.from('programmes').select('*').eq('id', programmeActuel.programme_id).single();
    if (programmeError) throw programmeError;
    
    let pseudo = null;
    if (programme && programme.created_by) {
      const { data: user, error: userError } = await db.from('utilisateurs').select('pseudo, nom').eq('id', programme.created_by).single();
      if (!userError && user) {
        pseudo = user.pseudo || user.nom || null;
      }
    }
    res.json({ ...programme, pseudo_createur: pseudo });
  } catch (error) {
    console.error('Erreur lors de la récupération du programme actuel:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer tous les programmes de l'utilisateur (actifs et inactifs)
router.get('/utilisateur/tous', verifyToken, async (req, res) => {
  try {
    const { data, error } = await db.from('utilisateur_programmes').select('*').eq('utilisateur_id', req.user.id);
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.json([]);
    }
    
    // Récupérer les détails des programmes
    const programmesAvecDetails = await Promise.all(
      data.map(async (up) => {
        const { data: programme, error: programmeError } = await db.from('programmes').select('*').eq('id', up.programme_id);
        if (programmeError || !programme || programme.length === 0) return null;
        
        const programmeData = programme[0];
        let pseudo = null;
        if (programmeData && programmeData.created_by) {
          const { data: user, error: userError } = await db.from('utilisateurs').select('pseudo, nom').eq('id', programmeData.created_by);
          if (!userError && user && user.length > 0) {
            pseudo = user[0].pseudo || user[0].nom || null;
          }
        }
        
        return {
          ...programmeData,
          pseudo_createur: pseudo,
          est_actif: up.est_actif,
          date_debut: up.date_debut,
          date_fin: up.date_fin
        };
      })
    );
    
    res.json(programmesAvecDetails.filter(p => p !== null));
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour suivre un programme
router.post('/utilisateur/suivre', verifyToken, async (req, res) => {
  try {
    const { programme_id } = req.body;
    
    if (!programme_id) {
      return res.status(400).json({ error: 'ID du programme requis' });
    }
    
    // Vérifier que le programme existe
    const { data: programmeCheck, error: programmeCheckError } = await db.from('programmes').select('id').eq('id', programme_id);
    
    if (programmeCheckError || !programmeCheck || programmeCheck.length === 0) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }
    
    // Désactiver le programme actuel s'il y en a un
    await db.from('utilisateur_programmes').update({ est_actif: false, date_fin: new Date().toISOString().split('T')[0] }).eq('utilisateur_id', req.user.id).eq('est_actif', true);
    
    // Ajouter le nouveau programme
    const { data, error } = await db.from('utilisateur_programmes').insert([
      { utilisateur_id: req.user.id, programme_id, date_debut: new Date().toISOString().split('T')[0], est_actif: true }
    ]).select();
    
    if (error) throw error;
    res.json({ message: 'Programme suivi avec succès', programme: data[0] });
  } catch (error) {
    console.error('Erreur lors du suivi du programme:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour arrêter de suivre un programme
router.post('/utilisateur/arreter', verifyToken, async (req, res) => {
  try {
    const { programme_id } = req.body;
    
    if (!programme_id) {
      return res.status(400).json({ error: 'ID du programme requis' });
    }
    
    const { data, error } = await db.from('utilisateur_programmes').update({ est_actif: false, date_fin: new Date().toISOString() }).eq('utilisateur_id', req.user.id).eq('programme_id', programme_id).eq('est_actif', true).select();
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Programme non trouvé ou déjà arrêté' });
    }
    
    res.json({ message: 'Programme arrêté avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'arrêt du programme:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour reprendre un programme
router.post('/utilisateur/reprendre', verifyToken, async (req, res) => {
  try {
    const { programme_id } = req.body;
    
    if (!programme_id) {
      return res.status(400).json({ error: 'ID du programme requis' });
    }
    
    // Vérifier que le programme existe
    const { data: programmeCheck, error: programmeCheckError } = await db.from('programmes').select('id').eq('id', programme_id);
    
    if (programmeCheckError || !programmeCheck || programmeCheck.length === 0) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }
    
    // Désactiver le programme actuel s'il y en a un
    await db.from('utilisateur_programmes').update({ est_actif: false, date_fin: new Date().toISOString().split('T')[0] }).eq('utilisateur_id', req.user.id).eq('est_actif', true);
    
    // Réactiver le programme ou le créer s'il n'existe pas
    const { data, error } = await db.from('utilisateur_programmes').upsert([
      { 
        utilisateur_id: req.user.id, 
        programme_id, 
        date_debut: new Date().toISOString().split('T')[0], 
        date_fin: null,
        est_actif: true 
      }
    ], {
      onConflict: 'utilisateur_id,programme_id'
    }).select();
    
    if (error) throw error;
    res.json({ message: 'Programme repris avec succès', programme: data[0] });
  } catch (error) {
    console.error('Erreur lors de la reprise du programme:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour changer de programme
router.post('/utilisateur/changer', verifyToken, async (req, res) => {
  try {
    const { nouveau_programme_id } = req.body;
    
    if (!nouveau_programme_id) {
      return res.status(400).json({ error: 'ID du nouveau programme requis' });
    }
    
    // Vérifier que le nouveau programme existe
    const { data: programmeCheck, error: programmeCheckError } = await db.from('programmes').select('id').eq('id', nouveau_programme_id);
    
    if (programmeCheckError || !programmeCheck || programmeCheck.length === 0) {
      return res.status(404).json({ error: 'Nouveau programme non trouvé' });
    }
    
    // Désactiver le programme actuel
    await db.from('utilisateur_programmes').update({ est_actif: false, date_fin: new Date().toISOString().split('T')[0] }).eq('utilisateur_id', req.user.id).eq('est_actif', true);
    
    // Ajouter le nouveau programme
    const { data, error } = await db.from('utilisateur_programmes').insert([
      { utilisateur_id: req.user.id, programme_id: nouveau_programme_id, date_debut: new Date().toISOString().split('T')[0], est_actif: true }
    ]).select();
    
    if (error) throw error;
    res.json({ message: 'Programme changé avec succès', programme: data[0] });
  } catch (error) {
    console.error('Erreur lors du changement de programme:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les statistiques de progression d'un programme
router.get('/utilisateur/progression/:programmeId', verifyToken, async (req, res) => {
  try {
    const { programmeId } = req.params;
    
    // Récupérer le programme utilisateur
    const { data: programmeUtilisateur, error: programmeError } = await db
      .from('utilisateur_programmes')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .eq('programme_id', programmeId)
      .single();
    
    if (programmeError || !programmeUtilisateur) {
      return res.status(404).json({ error: 'Programme utilisateur non trouvé' });
    }
    
    // Récupérer toutes les séances du programme
    const { data: seancesProgramme, error: seancesError } = await db
      .from('programme_seances')
      .select('seance_id')
      .eq('programme_id', programmeId);
    
    if (seancesError) throw seancesError;
    
    const totalSeances = seancesProgramme.length;
    
    // Récupérer les séances complétées depuis la table sessions_entrainement
    const { data: sessionsCompletees, error: sessionsError } = await db
      .from('sessions_entrainement')
      .select('seance_id, duree_totale, calories_brulees, satisfaction, date_fin')
      .eq('utilisateur_id', req.user.id)
      .eq('programme_id', programmeId)
      .eq('etat', 'terminee');
    
    if (sessionsError) throw sessionsError;
    
    const seancesCompletees = sessionsCompletees.length;
    
    // Calculer les statistiques
    const totalDuree = sessionsCompletees.reduce((sum, session) => sum + (session.duree_totale || 0), 0);
    const totalCalories = sessionsCompletees.reduce((sum, session) => sum + (session.calories_brulees || 0), 0);
    const satisfactionMoyenne = sessionsCompletees.length > 0 
      ? sessionsCompletees.reduce((sum, session) => sum + (session.satisfaction || 0), 0) / sessionsCompletees.length 
      : 0;
    
    // Calculer les jours restants
    const dateDebut = new Date(programmeUtilisateur.date_debut);
    const aujourdhui = new Date();
    const joursEcoules = Math.floor((aujourdhui - dateDebut) / (1000 * 60 * 60 * 24));
    const joursRestants = Math.max(0, (programmeUtilisateur.progression?.jours_estimes || 30) - joursEcoules);
    
    const pourcentage = totalSeances > 0 ? Math.round((seancesCompletees / totalSeances) * 100) : 0;
    
    res.json({
      totalSeances,
      seancesCompletees,
      pourcentage,
      joursRestants,
      dateDebut: programmeUtilisateur.date_debut,
      dateFin: programmeUtilisateur.date_fin,
      estActif: programmeUtilisateur.est_actif,
      statistiques: {
        totalDuree, // en secondes
        totalCalories,
        satisfactionMoyenne: Math.round(satisfactionMoyenne * 10) / 10, // arrondi à 1 décimale
        derniereSeance: sessionsCompletees.length > 0 
          ? sessionsCompletees.sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin))[0].date_fin 
          : null
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la progression:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les statistiques générales de l'utilisateur
router.get('/utilisateur/statistiques', verifyToken, async (req, res) => {
  try {
    // Récupérer tous les programmes de l'utilisateur
    const { data: programmesUtilisateur, error: programmesError } = await db
      .from('utilisateur_programmes')
      .select('*')
      .eq('utilisateur_id', req.user.id);
    
    if (programmesError) throw programmesError;
    
    // Calculer les statistiques
    const programmesSuivis = programmesUtilisateur.length;
    const programmesActifs = programmesUtilisateur.filter(p => p.est_actif).length;
    
    // Récupérer toutes les sessions complétées de l'utilisateur LIÉES À DES PROGRAMMES
    const { data: sessionsCompletees, error: sessionsError } = await db
      .from('sessions_entrainement')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .eq('etat', 'terminee')
      .not('programme_id', 'is', null); // Seulement les sessions liées à un programme
    
    if (sessionsError) throw sessionsError;
    
    // Calculer les statistiques globales (uniquement pour les programmes)
    const seancesCompletees = sessionsCompletees.length;
    const totalDuree = sessionsCompletees.reduce((sum, session) => sum + (session.duree_totale || 0), 0);
    const totalCalories = sessionsCompletees.reduce((sum, session) => sum + (session.calories_brulees || 0), 0);
    const satisfactionMoyenne = sessionsCompletees.length > 0 
      ? sessionsCompletees.reduce((sum, session) => sum + (session.satisfaction || 0), 0) / sessionsCompletees.length 
      : 0;
    
    // Récupérer aussi les sessions libres (non liées à un programme) pour les statistiques générales
    const { data: sessionsLibres, error: sessionsLibresError } = await db
      .from('sessions_entrainement')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .eq('etat', 'terminee')
      .is('programme_id', null); // Sessions libres
    
    if (sessionsLibresError) throw sessionsLibresError;
    
    // Calculer les objectifs atteints (programmes terminés)
    const objectifsAtteints = programmesUtilisateur.filter(p => 
      p.date_fin && new Date(p.date_fin) < new Date()
    ).length;
    
    // Calculer la fréquence d'entraînement (sessions par semaine) - toutes sessions confondues
    const maintenant = new Date();
    const ilYAAuMoinsUneSemaine = new Date(maintenant.getTime() - 7 * 24 * 60 * 60 * 1000);
    const toutesSessions = [...sessionsCompletees, ...sessionsLibres];
    const sessionsCetteSemaine = toutesSessions.filter(session => 
      new Date(session.date_fin) >= ilYAAuMoinsUneSemaine
    ).length;
    
    res.json({
      seancesCompletees, // Seulement les séances de programmes
      seancesLibres: sessionsLibres.length, // Séances faites en dehors des programmes
      totalSeances: seancesCompletees + sessionsLibres.length, // Total toutes séances confondues
      programmesSuivis,
      objectifsAtteints,
      programmesActifs,
      statistiques: {
        totalDuree, // en secondes (uniquement programmes)
        totalCalories, // uniquement programmes
        satisfactionMoyenne: Math.round(satisfactionMoyenne * 10) / 10, // uniquement programmes
        sessionsCetteSemaine, // toutes sessions confondues
        derniereSeance: toutesSessions.length > 0 
          ? toutesSessions.sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin))[0].date_fin 
          : null
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les séances d'un programme avec dates calculées automatiquement
router.get('/:id/seances-calendrier', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    // Récupérer le programme utilisateur pour obtenir la date de début
    const { data: programmeUtilisateur, error: programmeUtilisateurError } = await db
      .from('utilisateur_programmes')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .eq('programme_id', id)
      .single();
    
    if (programmeUtilisateurError || !programmeUtilisateur) {
      return res.status(404).json({ error: 'Programme utilisateur non trouvé' });
    }

    // Récupérer les informations du programme pour obtenir le type_programme
    const { data: programme, error: programmeError } = await db
      .from('programmes')
      .select('type_programme, nb_jours, date_debut, date_fin')
      .eq('id', id)
      .single();
    
    if (programmeError || !programme) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }

    // Récupérer toutes les séances du programme (par jour)
    const { data: seancesProgramme, error: seancesError } = await db
      .from('programme_seances')
      .select('jour, seance_id, seances(*)')
      .eq('programme_id', id)
      .not('jour', 'is', null)
      .order('jour', { ascending: true });
    
    if (seancesError) throw seancesError;

    // Récupérer les séances déjà complétées par l'utilisateur (programme + libres)
    const { data: sessionsCompletees, error: sessionsError } = await db
      .from('sessions_entrainement')
      .select('seance_id, jour_programme, date_fin, duree_totale, calories_brulees, satisfaction')
      .eq('utilisateur_id', req.user.id)
      .eq('etat', 'terminee');

    if (sessionsError) throw sessionsError;

    const seancesCompletees = sessionsCompletees.map(s => s.seance_id);

    // Calculer les dates pour chaque séance
    const dateDebut = new Date(programmeUtilisateur.date_debut);
    const seancesAvecDates = [];

    for (const seance of seancesProgramme) {
      if (seance.seances) {
        // Calculer la date de cette séance de manière plus robuste
        const dateSeance = new Date(dateDebut);
        // Ajouter le nombre de jours depuis le début (jour 1 = date de début)
        const joursAAjouter = seance.jour - 1;
        dateSeance.setTime(dateSeance.getTime() + (joursAAjouter * 24 * 60 * 60 * 1000));

        // Vérifier si cette séance est déjà complétée
        const estCompletee = seancesCompletees.includes(seance.seance_id);
        const sessionCompletee = sessionsCompletees.find(s => s.seance_id === seance.seance_id);

        const dateFormatted = dateSeance.toISOString().split('T')[0];
        
        seancesAvecDates.push({
          jour: seance.jour,
          date: dateFormatted, // Format YYYY-MM-DD
          seance: seance.seances,
          est_completee: estCompletee,
          est_a_venir: dateSeance > new Date(),
          est_aujourd_hui: dateSeance.toDateString() === new Date().toDateString(),
          session_data: sessionCompletee ? {
            date_fin: sessionCompletee.date_fin,
            duree: sessionCompletee.duree_totale,
            calories: sessionCompletee.calories_brulees,
            satisfaction: sessionCompletee.satisfaction
          } : null
        });
      }
    }

    // Trier par date
    seancesAvecDates.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculer la prochaine séance
    const prochaineSeance = seancesAvecDates.find(s => 
      !s.est_completee && s.date >= new Date().toISOString().split('T')[0]
    );

    res.json({
      date_debut: programmeUtilisateur.date_debut,
      type_programme: programme.type_programme,
      nb_jours: programme.nb_jours,
      date_debut_programme: programme.date_debut,
      date_fin_programme: programme.date_fin,
      seances: seancesAvecDates,
      progression: {
        total_seances: seancesAvecDates.length,
        seances_completees: seancesAvecDates.filter(s => s.est_completee).length,
        prochaine_seance: prochaineSeance
      }
    });

  } catch (err) {
    console.error('Erreur lors de la récupération des séances calendrier :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des séances calendrier', details: err.message });
  }
});

// Route pour marquer une séance comme complétée dans un programme
router.post('/:id/seances/:seanceId/complete', verifyToken, async (req, res) => {
  const { id, seanceId } = req.params;
  const { duree_totale, calories_brulees, niveau_effort, satisfaction, notes } = req.body;
  
  console.log('Enregistrement séance programme - Paramètres reçus:', { id, seanceId, body: req.body, user: req.user.id });
  
  try {
    // Validation des paramètres
    if (!id || !seanceId) {
      return res.status(400).json({ error: 'ID du programme et ID de la séance requis' });
    }

    // Préparer les données de session
    const sessionData = {
      utilisateur_id: req.user.id,
      seance_id: seanceId,
      programme_id: parseInt(id),
      jour_programme: null,
      nom_session: `Séance du programme`,
      date_debut: new Date().toISOString(),
      date_fin: new Date().toISOString(),
      duree_totale: duree_totale || 0,
      calories_brulees: calories_brulees || 0,
      niveau_effort: niveau_effort || null,
      satisfaction: satisfaction || null,
      notes: notes || '',
      etat: 'terminee'
    };

    console.log('Données de session à insérer:', sessionData);

    // Créer une session terminée
    const { data, error } = await db
      .from('sessions_entrainement')
      .insert([sessionData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'insertion de la session:', error);
      throw error;
    }
    
    console.log('Session créée avec succès:', data);
    
    res.json({
      message: 'Séance marquée comme complétée',
      session: data
    });

  } catch (err) {
    console.error('Erreur lors de la complétion de la séance :', err);
    res.status(500).json({ error: 'Erreur lors de la complétion de la séance', details: err.message });
  }
});

// Route pour rattacher une séance libre à un programme
router.post('/:id/rattacher-seance-libre', verifyToken, async (req, res) => {
  const { id } = req.params; // id du programme
  const { seanceId, jourProgramme } = req.body;
  
  console.log('Rattachement séance libre - Paramètres reçus:', { id, seanceId, jourProgramme, user: req.user.id });
  
  try {
    if (!seanceId || !jourProgramme) {
      return res.status(400).json({ error: 'ID de la séance et jour du programme requis' });
    }

    // Vérifier que la séance existe dans le programme
    const { data: seanceProgramme, error: seanceProgrammeError } = await db
      .from('programme_seances')
      .select('*')
      .eq('programme_id', parseInt(id))
      .eq('seance_id', seanceId)
      .eq('jour', jourProgramme)
      .single();

    if (seanceProgrammeError || !seanceProgramme) {
      return res.status(404).json({ error: 'Séance non trouvée dans ce programme pour ce jour' });
    }

    // Vérifier que l'utilisateur a fait cette séance en libre
    const { data: sessionLibre, error: sessionLibreError } = await db
      .from('sessions_entrainement')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .eq('seance_id', seanceId)
      .is('programme_id', null)
      .eq('etat', 'terminee')
      .single();

    if (sessionLibreError || !sessionLibre) {
      return res.status(404).json({ error: 'Séance libre non trouvée pour cet utilisateur' });
    }

    // Mettre à jour la session pour l'associer au programme
    const { data: sessionUpdated, error: updateError } = await db
      .from('sessions_entrainement')
      .update({
        programme_id: parseInt(id),
        jour_programme: jourProgramme,
        nom_session: `Séance du programme (rattachée)`
      })
      .eq('id', sessionLibre.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur lors de la mise à jour de la session:', updateError);
      throw updateError;
    }

    console.log('Session rattachée avec succès:', sessionUpdated);

    res.json({
      message: 'Séance libre rattachée au programme avec succès',
      session: sessionUpdated
    });

  } catch (err) {
    console.error('Erreur lors du rattachement de la séance libre :', err);
    res.status(500).json({ error: 'Erreur lors du rattachement de la séance libre', details: err.message });
  }
});

// Route pour reprendre un programme avec calcul de la prochaine séance
router.post('/utilisateur/reprendre-avance', verifyToken, async (req, res) => {
  try {
    const { programme_id } = req.body;
    
    if (!programme_id) {
      return res.status(400).json({ error: 'ID du programme requis' });
    }
    
    // Vérifier que le programme existe
    const { data: programmeCheck, error: programmeCheckError } = await db.from('programmes').select('id').eq('id', programme_id);
    
    if (programmeCheckError || !programmeCheck || programmeCheck.length === 0) {
      return res.status(404).json({ error: 'Programme non trouvé' });
    }
    
    // Récupérer les séances déjà complétées pour ce programme
    const { data: sessionsCompletees, error: sessionsError } = await db
      .from('sessions_entrainement')
      .select('jour_programme')
      .eq('utilisateur_id', req.user.id)
      .eq('programme_id', programme_id)
      .eq('etat', 'terminee')
      .order('jour_programme', { ascending: true });

    if (sessionsError) throw sessionsError;

    // Récupérer toutes les séances du programme pour calculer la prochaine
    const { data: seancesProgramme, error: seancesError } = await db
      .from('programme_seances')
      .select('jour')
      .eq('programme_id', programme_id)
      .not('jour', 'is', null)
      .order('jour', { ascending: true });

    if (seancesError) throw seancesError;

    // Calculer la prochaine séance
    const joursCompletees = sessionsCompletees.map(s => s.jour_programme);
    const tousLesJours = seancesProgramme.map(s => s.jour);
    const prochaineJour = tousLesJours.find(jour => !joursCompletees.includes(jour));

    // Si toutes les séances sont complétées, recommencer au jour 1
    const jourReprise = prochaineJour || 1;
    
    // Désactiver le programme actuel s'il y en a un
    await db.from('utilisateur_programmes').update({ est_actif: false, date_fin: new Date().toISOString().split('T')[0] }).eq('utilisateur_id', req.user.id).eq('est_actif', true);
    
    // Calculer la date de début optimale
    const aujourdhui = new Date();
    const dateDebut = aujourdhui.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Réactiver le programme avec la nouvelle date de début
    const { data, error } = await db.from('utilisateur_programmes').upsert([
      { 
        utilisateur_id: req.user.id, 
        programme_id, 
        date_debut: dateDebut, 
        date_fin: null,
        est_actif: true 
      }
    ], {
      onConflict: 'utilisateur_id,programme_id'
    }).select();
    
    if (error) throw error;
    
    res.json({ 
      message: 'Programme repris avec succès', 
      programme: data[0],
      date_debut: dateDebut,
      progression: {
        seances_completees: joursCompletees.length,
        total_seances: tousLesJours.length,
        prochaine_jour: jourReprise,
        jours_completees: joursCompletees
      },
      note: prochaineJour 
        ? `Reprise à la séance ${jourReprise} (${joursCompletees.length} séances déjà complétées)`
        : 'Toutes les séances sont complétées, reprise depuis le début'
    });
  } catch (error) {
    console.error('Erreur lors de la reprise du programme:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de debug temporaire pour voir les sessions
router.get('/debug/sessions', verifyToken, async (req, res) => {
  try {
    // Récupérer toutes les sessions de l'utilisateur
    const { data: toutesSessions, error: sessionsError } = await db
      .from('sessions_entrainement')
      .select('*')
      .eq('utilisateur_id', req.user.id);
    
    if (sessionsError) throw sessionsError;
    
    // Récupérer les sessions liées à des programmes
    const { data: sessionsProgrammes, error: programmesError } = await db
      .from('sessions_entrainement')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .not('programme_id', 'is', null);
    
    if (programmesError) throw programmesError;
    
    // Récupérer les sessions libres
    const { data: sessionsLibres, error: libresError } = await db
      .from('sessions_entrainement')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .is('programme_id', null);
    
    if (libresError) throw libresError;
    
    res.json({
      toutesSessions: toutesSessions.length,
      sessionsProgrammes: sessionsProgrammes.length,
      sessionsLibres: sessionsLibres.length,
      details: {
        toutes: toutesSessions,
        programmes: sessionsProgrammes,
        libres: sessionsLibres
      }
    });
    
  } catch (error) {
    console.error('Erreur lors du debug des sessions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router; 