const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../middleware/auth');

// GET /api/sessions - Récupérer les sessions de l'utilisateur
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessions_entrainement')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .order('date_debut', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors de la récupération des sessions:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des sessions',
        details: error.message
      });
    }

    res.json({
      sessions: data
    });
  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// POST /api/sessions - Démarrer une nouvelle session
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      seance_id,
      seance_personnalisee_id,
      nom_session
    } = req.body;

    // Validation des données
    if (!seance_id && !seance_personnalisee_id) {
      return res.status(400).json({
        error: 'Données manquantes',
        details: 'seance_id ou seance_personnalisee_id est requis'
      });
    }

    const sessionData = {
      utilisateur_id: req.user.id,
      seance_id: seance_id || null,
      seance_personnalisee_id: seance_personnalisee_id || null,
      nom_session: nom_session || 'Session d\'entraînement',
      date_debut: new Date().toISOString(),
      etat: 'en_cours'
    };

    const { data, error } = await supabase
      .from('sessions_entrainement')
      .insert([sessionData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de la session:', error);
      return res.status(500).json({
        error: 'Erreur lors de la création de la session',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Session démarrée avec succès',
      session: data
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// PUT /api/sessions/:id - Terminer une session
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      duree_totale,
      calories_brulees,
      niveau_effort,
      satisfaction,
      notes,
      etat = 'terminee'
    } = req.body;

    const updateData = {
      date_fin: new Date().toISOString(),
      duree_totale,
      calories_brulees,
      niveau_effort,
      satisfaction,
      notes,
      etat
    };

    const { data, error } = await supabase
      .from('sessions_entrainement')
      .update(updateData)
      .eq('id', id)
      .eq('utilisateur_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la mise à jour de la session:', error);
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour de la session',
        details: error.message
      });
    }

    res.json({
      message: 'Session terminée avec succès',
      session: data
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// Route pour mettre à jour une session existante
router.put('/:id/update', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { niveau_effort, notes } = req.body;
  
  console.log('Update session - Paramètres reçus:', { id, body: req.body, user: req.user.id });
  
  try {
    // Validation des paramètres
    if (!id) {
      return res.status(400).json({ error: 'ID de la session requis' });
    }

    // Vérifier que la session existe et appartient à l'utilisateur
    const { data: session, error: sessionError } = await supabase
      .from('sessions_entrainement')
      .select('*')
      .eq('id', id)
      .eq('utilisateur_id', req.user.id)
      .single();

    if (sessionError) {
      console.error('Erreur lors de la vérification de la session:', sessionError);
      return res.status(500).json({ error: 'Erreur lors de la vérification de la session' });
    }

    if (!session) {
      console.log('Session non trouvée:', { session_id: id });
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // Préparer les données de mise à jour
    const updateData = {};
    if (niveau_effort !== undefined) updateData.niveau_effort = niveau_effort;
    if (notes !== undefined) updateData.notes = notes;

    console.log('Données de mise à jour:', updateData);

    // Mettre à jour la session
    const { data: sessionUpdated, error: updateError } = await supabase
      .from('sessions_entrainement')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour de la session:', updateError);
      throw updateError;
    }
    
    console.log('Session mise à jour avec succès:', sessionUpdated);
    
    res.json({ 
      message: 'Session mise à jour avec succès',
      session: sessionUpdated
    });

  } catch (err) {
    console.error('Erreur lors de la mise à jour de la session :', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la session', details: err.message });
  }
});

module.exports = router; 