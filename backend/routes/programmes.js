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

// PUT /:id - Modifier un programme (créateur uniquement)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    // Vérifier que le programme appartient à l'utilisateur
    const { data: existing, error: errorGet } = await db.from('programmes').select('*').eq('id', id).single();
    if (errorGet) throw errorGet;
    if (!existing || existing.created_by !== userId) {
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
    console.error('Erreur lors de la mise à jour du programme :', err);
    res.status(500).json({ error: "Erreur lors de la mise à jour du programme", details: err.message });
  }
});

// Associer une séance à un jour (programme libre)
router.post('/:id/jours/:jour/seances', verifyToken, async (req, res) => {
  const { id, jour } = req.params;
  const { seance_id } = req.body;
  try {
    const { data, error } = await db.from('programme_seances').insert([
      { programme_id: id, jour: parseInt(jour, 10), date: null, seance_id }
    ]).select();
    if (error) throw error;
    res.status(201).json({ message: 'Séance associée au programme (jour)', data });
  } catch (err) {
    console.error('Erreur lors de l\'association séance-programme (jour) :', err);
    res.status(500).json({ error: 'Erreur lors de l\'association séance-programme (jour)', details: err.message });
  }
});

// Associer une séance à une date (programme calendaire)
router.post('/:id/dates/:date/seances', verifyToken, async (req, res) => {
  const { id, date } = req.params;
  const { seance_id } = req.body;
  try {
    const { data, error } = await db.from('programme_seances').insert([
      { programme_id: id, jour: null, date, seance_id }
    ]).select();
    if (error) throw error;
    res.status(201).json({ message: 'Séance associée au programme (date)', data });
  } catch (err) {
    console.error('Erreur lors de l\'association séance-programme (date) :', err);
    res.status(500).json({ error: 'Erreur lors de l\'association séance-programme (date)', details: err.message });
  }
});

// Supprimer une séance d'un jour (programme libre)
router.delete('/:id/jours/:jour/seances/:seanceId', verifyToken, async (req, res) => {
  const { id, jour, seanceId } = req.params;
  try {
    const { error } = await db
      .from('programme_seances')
      .delete()
      .eq('programme_id', id)
      .eq('jour', parseInt(jour, 10))
      .eq('seance_id', seanceId);
    if (error) throw error;
    res.json({ message: 'Séance dissociée du programme (jour)' });
  } catch (err) {
    console.error('Erreur lors de la suppression séance-programme (jour) :', err);
    res.status(500).json({ error: 'Erreur lors de la suppression séance-programme (jour)', details: err.message });
  }
});

// Supprimer une séance d'une date (programme calendaire)
router.delete('/:id/dates/:date/seances/:seanceId', verifyToken, async (req, res) => {
  const { id, date, seanceId } = req.params;
  try {
    const { error } = await db
      .from('programme_seances')
      .delete()
      .eq('programme_id', id)
      .eq('date', date)
      .eq('seance_id', seanceId);
    if (error) throw error;
    res.json({ message: 'Séance dissociée du programme (date)' });
  } catch (err) {
    console.error('Erreur lors de la suppression séance-programme (date) :', err);
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

module.exports = router; 