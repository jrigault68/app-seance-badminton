const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../middleware/auth');

// =====================================================
// ROUTES PUBLIQUES (sans authentification)
// =====================================================

// GET /api/seances - Récupérer toutes les séances avec filtres
router.get('/', async (req, res) => {
  try {
    const {
      niveau,
      type_seance,
      categorie,
      search,
      limit = 20,
      offset = 0,
      est_publique = true
    } = req.query;

    let query = supabase
      .from('v_seances_completes')
      .select('*');

    // Filtres
    if (niveau) {
      query = query.eq('niveau_nom', niveau);
    }
    if (type_seance) {
      query = query.eq('type_seance', type_seance);
    }
    if (categorie) {
      query = query.contains('categories', [categorie]);
    }
    if (search) {
      query = query.or(`nom.ilike.%${search}%,description.ilike.%${search}%`);
    }
    /*if (est_publique !== undefined) {
      query = query.eq('est_publique', est_publique === 'true');
    }*/

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Erreur lors de la récupération des séances:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des séances',
        details: error.message
      });
    }

    res.json({
      seances: data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count || data.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /api/seances/:id - Récupérer une séance par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('v_seances_completes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Séance non trouvée',
          details: `Aucune séance trouvée avec l'ID: ${id}`
        });
      }
      console.error('❌ Erreur lors de la récupération de la séance:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération de la séance',
        details: error.message
      });
    }

    res.json({ seance: data });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /api/seances/:id/exercices - Récupérer les exercices d'une séance
router.get('/:id/exercices', async (req, res) => {
  try {
    const { id } = req.params;

    // D'abord récupérer la séance pour avoir sa structure
    const { data: seance, error: seanceError } = await supabase
      .from('v_seances_completes')
      .select('*')
      .eq('id', id)
      .single();

    if (seanceError) {
      if (seanceError.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Séance non trouvée',
          details: `Aucune séance trouvée avec l'ID: ${id}`
        });
      }
      console.error('❌ Erreur lors de la récupération de la séance:', seanceError);
      return res.status(500).json({
        error: 'Erreur lors de la récupération de la séance',
        details: seanceError.message
      });
    }

    if (!seance.structure || !Array.isArray(seance.structure)) {
      return res.json({ exercices: [] });
    }

    // Extraire tous les IDs d'exercices de la structure
    const exerciceIds = new Set();
    
    const extractExerciceIds = (structure) => {
      structure.forEach(step => {
        if (step.type === 'bloc' && step.contenu) {
          extractExerciceIds(step.contenu);
        } else if (step.id) {
          exerciceIds.add(step.id);
        }
      });
    };

    extractExerciceIds(seance.structure);

    if (exerciceIds.size === 0) {
      return res.json({ exercices: [] });
    }

    // Récupérer les exercices
    const { data: exercices, error: exercicesError } = await supabase
      .from('v_exercices_completes')
      .select('*')
      .in('id', Array.from(exerciceIds));

    if (exercicesError) {
      console.error('❌ Erreur lors de la récupération des exercices:', exercicesError);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des exercices',
        details: exercicesError.message
      });
    }

    res.json({ exercices: exercices || [] });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// =====================================================
// ROUTES PROTÉGÉES (avec authentification)
// =====================================================

// POST /api/seances - Créer une nouvelle séance
router.post('/', verifyToken, async (req, res) => {
  console.log("Body reçu pour création séance :", req.body);
  try {
    const {
      nom,
      description,
      niveau_id,
      type_id,
      categorie_id,
      type_seance,
      created_by
    } = req.body;

    // Validation des champs obligatoires
    if (!nom) {
      return res.status(400).json({
        error: 'Données manquantes',
        details: 'Le champs nom est obligatoire'
      });
    }

    const seanceData = {
      nom,
      description,
      niveau_id: niveau_id || null,
      type_id: type_id || null,
      categorie_id: categorie_id || null,
      type_seance: type_seance || "exercice",
      created_by: req.user.id
    };

    const { data, error } = await supabase
      .from('seances')
      .insert([seanceData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de la séance:', error);
      return res.status(500).json({
        error: 'Erreur lors de la création de la séance',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Séance créée avec succès',
      seance: data
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// POST /api/seances/personnalisees - Créer une séance personnalisée
router.post('/personnalisees', verifyToken, async (req, res) => {
  try {
    const {
      nom,
      description,
      niveau_id,
      type_seance,
      categories,
      objectifs,
      duree_estimee,
      calories_estimees,
      materiel_requis,
      structure,
      notes,
      tags,
      est_publique = false
    } = req.body;

    // Validation des champs obligatoires
    if (!nom || !structure) {
      return res.status(400).json({
        error: 'Données manquantes',
        details: 'Les champs nom et structure sont obligatoires'
      });
    }

    const seanceData = {
      utilisateur_id: req.user.id,
      nom,
      description,
      niveau_id: niveau_id || null,
      type_seance,
      categories: categories || [],
      objectifs: objectifs || [],
      duree_estimee,
      calories_estimees,
      materiel_requis: materiel_requis || [],
      structure,
      notes,
      tags: tags || [],
      est_publique
    };

    const { data, error } = await supabase
      .from('seances_personnalisees')
      .insert([seanceData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de la séance personnalisée:', error);
      return res.status(500).json({
        error: 'Erreur lors de la création de la séance personnalisée',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Séance personnalisée créée avec succès',
      seance: data
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /api/seances/personnalisees - Récupérer les séances personnalisées de l'utilisateur
router.get('/personnalisees', verifyToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from('seances_personnalisees')
      .select(`
        *,
        niveau_nom: niveaux_difficulte(nom, couleur)
      `)
      .eq('utilisateur_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('❌ Erreur lors de la récupération des séances personnalisées:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des séances personnalisées',
        details: error.message
      });
    }

    res.json({
      seances: data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count || data.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// PUT /api/seances/:id - Mettre à jour une séance (auteur ou admin seulement)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    // Vérifier les permissions
    const { data: seance, error: fetchError } = await supabase
      .from('seances')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Séance non trouvée',
          details: `Aucune séance trouvée avec l'ID: ${id}`
        });
      }
      return res.status(500).json({
        error: 'Erreur lors de la vérification des permissions',
        details: fetchError.message
      });
    }

    if (seance.created_by !== userId && !isAdmin) {
      return res.status(403).json({
        error: 'Accès refusé',
        details: 'Vous ne pouvez modifier que vos propres séances'
      });
    }

    // Supprimer les champs qui ne doivent pas être modifiés
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;
    delete updateData.auteur_id;
    delete updateData.created_by;

    const { data, error } = await supabase
      .from('seances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour de la séance',
        details: error.message
      });
    }

    res.json({
      message: 'Séance mise à jour avec succès',
      seance: data
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// DELETE /api/seances/:id - Supprimer une séance (auteur ou admin seulement)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    // Vérifier les permissions
    const { data: seance, error: fetchError } = await supabase
      .from('seances')
      .select('created_by')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Séance non trouvée',
          details: `Aucune séance trouvée avec l'ID: ${id}`
        });
      }
      return res.status(500).json({
        error: 'Erreur lors de la vérification des permissions',
        details: fetchError.message
      });
    }

    if (seance.created_by !== userId && !isAdmin) {
      return res.status(403).json({
        error: 'Accès refusé',
        details: 'Vous ne pouvez supprimer que vos propres séances'
      });
    }

    const { error } = await supabase
      .from('seances')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        error: 'Erreur lors de la suppression de la séance',
        details: error.message
      });
    }

    res.json({
      message: 'Séance supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});



// Route pour enregistrer une séance terminée
router.post('/:id/complete', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { duree_totale, calories_brulees, niveau_effort, satisfaction, notes, etat } = req.body;
  
  console.log('Enregistrement séance - Paramètres reçus:', { id, body: req.body, user: req.user.id });
  
  try {
    // Validation des paramètres
    if (!id) {
      return res.status(400).json({ error: 'ID de la séance requis' });
    }

    // Vérifier que la séance existe
    const { data: seance, error: seanceError } = await supabase
      .from('seances')
      .select('*')
      .eq('id', id)
      .single();

    if (seanceError) {
      console.error('Erreur lors de la vérification de la séance:', seanceError);
      return res.status(500).json({ error: 'Erreur lors de la vérification de la séance' });
    }

    if (!seance) {
      console.log('Séance non trouvée:', { seance_id: id });
      return res.status(404).json({ error: 'Séance non trouvée' });
    }

    // Permettre plusieurs sessions pour la même séance
    // (suppression de la vérification de session existante)

    // Préparer les données de session
    const sessionData = {
      utilisateur_id: req.user.id,
      seance_id: id,
      programme_id: null,
      jour_programme: null,
      nom_session: seance.nom,
      date_debut: new Date().toISOString(),
      date_fin: new Date().toISOString(),
      duree_totale: duree_totale || 0,
      calories_brulees: calories_brulees || 0,
      niveau_effort: niveau_effort || null,
      satisfaction: satisfaction || null,
      notes: notes || '',
      etat: etat || 'terminee'
    };

    console.log('Données de session à insérer:', sessionData);

    // Créer une session terminée
    const { data: sessionCreated, error: sessionError } = await supabase
      .from('sessions_entrainement')
      .insert([sessionData])
      .select()
      .single();
    
    if (sessionError) {
      console.error('Erreur lors de l\'insertion de la session:', sessionError);
      throw sessionError;
    }
    
    console.log('Session créée avec succès:', sessionCreated);
    
    res.json({ 
      message: 'Séance enregistrée avec succès',
      session: sessionCreated
    });

  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de la séance :', err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la séance', details: err.message });
  }
});



module.exports = router;