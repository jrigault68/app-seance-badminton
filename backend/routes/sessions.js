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

// GET /api/sessions/en-cours/:seanceId - Récupérer une session en cours pour une séance
router.get('/en-cours/:seanceId', verifyToken, async (req, res) => {
  try {
    const { seanceId } = req.params;

    const { data, error } = await supabase
      .from('sessions_entrainement')
      .select('*')
      .eq('utilisateur_id', req.user.id)
      .eq('seance_id', seanceId)
      .eq('etat', 'en_cours')
      .order('date_debut', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucune session en cours trouvée - retourner un objet vide au lieu d'une erreur
        return res.json({
          session: null
        });
      }
      console.error('❌ Erreur lors de la récupération de la session en cours:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération de la session en cours',
        details: error.message
      });
    }

    // Parser la progression JSON si elle existe
    if (data.progression) {
      try {
        data.progression = JSON.parse(data.progression);
      } catch (parseError) {
        console.error('❌ Erreur lors du parsing de la progression:', parseError);
        data.progression = {
          etape_actuelle: 0,
          nombre_total_etapes: 0,
          structure_etapes: [],
          derniere_mise_a_jour: new Date().toISOString()
        };
      }
    }

    res.json({
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

// GET /api/sessions/:id - Récupérer une session par ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('sessions_entrainement')
      .select('*')
      .eq('id', id)
      .eq('utilisateur_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Session non trouvée' });
      }
      console.error('❌ Erreur lors de la récupération de la session:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération de la session',
        details: error.message
      });
    }

    // Parser la progression JSON si elle existe
    if (data.progression) {
      try {
        data.progression = JSON.parse(data.progression);
      } catch (parseError) {
        console.error('❌ Erreur lors du parsing de la progression:', parseError);
        data.progression = {
          etape_actuelle: 0,
          nombre_total_etapes: 0,
          temps_total_cumule: 0,
          derniere_mise_a_jour: new Date().toISOString()
        };
      }
    }

    res.json({
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

// POST /api/sessions - Démarrer une nouvelle session
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('📥 Requête POST /sessions reçue:', req.body);
    
    const {
      seance_id,
      seance_personnalisee_id,
      programme_id,
      jour_programme,
      nom_session
    } = req.body;

    console.log('📋 Données extraites:', {
      seance_id,
      seance_personnalisee_id,
      programme_id,
      jour_programme,
      nom_session
    });

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
      programme_id: programme_id || null,
      jour_programme: jour_programme || null,
      nom_session: nom_session || 'Session d\'entraînement',
      date_debut: new Date().toISOString(),
      etat: 'en_cours',
      progression: JSON.stringify({
        etape_actuelle: 0,
        nombre_total_etapes: 0, // Sera mis à jour par le frontend
        temps_total_cumule: 0, // Initialiser le temps cumulé
        derniere_mise_a_jour: new Date().toISOString()
      })
    };

    console.log('📋 Création de session avec données:', {
      ...sessionData,
      progression_length: sessionData.progression.length
    });

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

    console.log('✅ Session créée avec succès:', data);

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

// PUT /api/sessions/:id/progression - Mettre à jour la progression d'une session
router.put('/:id/progression', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { etape_actuelle, temps_ecoule, nombre_total_etapes, temps_etape_actuelle } = req.body;

    console.log('📥 Mise à jour progression reçue:', {
      sessionId: id,
      etape_actuelle,
      temps_ecoule,
      nombre_total_etapes,
      temps_etape_actuelle,
      body: req.body
    });

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
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // Parser la progression existante
    let progressionExistante = {};
    if (session.progression) {
      try {
        progressionExistante = JSON.parse(session.progression);
      } catch (parseError) {
        console.error('❌ Erreur lors du parsing de la progression existante:', parseError);
        progressionExistante = {
          etape_actuelle: 0,
          nombre_total_etapes: 0,
          temps_total_cumule: 0,
          derniere_mise_a_jour: new Date().toISOString()
        };
      }
    }

    // Calculer le temps total cumulé
    let tempsTotalCumule = progressionExistante.temps_total_cumule || 0;
    
    // Si on a un temps pour l'étape actuelle, l'ajouter au cumul
    if (temps_etape_actuelle && temps_etape_actuelle > 0) {
      tempsTotalCumule += temps_etape_actuelle;
      console.log(`📊 Ajout de ${temps_etape_actuelle}s au temps cumulé. Nouveau total: ${tempsTotalCumule}s`);
    }

    // Préparer les données de progression
    const progressionData = {
      progression: JSON.stringify({
        etape_actuelle: etape_actuelle || 0,
        nombre_total_etapes: nombre_total_etapes || 0,
        temps_ecoule: temps_ecoule || 0,
        temps_total_cumule: tempsTotalCumule,
        derniere_mise_a_jour: new Date().toISOString()
      }),
      date_fin: new Date().toISOString() // Mettre à jour la date de fin à chaque progression
    };

    console.log('📋 Données de progression à sauvegarder:', progressionData);

    const { data, error } = await supabase
      .from('sessions_entrainement')
      .update(progressionData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la mise à jour de la progression:', error);
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour de la progression',
        details: error.message
      });
    }

    console.log('✅ Progression mise à jour avec succès:', data);

    res.json({
      message: 'Progression mise à jour avec succès',
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