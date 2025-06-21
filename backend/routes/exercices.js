const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../middleware/auth');

// =====================================================
// ROUTES PUBLIQUES (sans authentification)
// =====================================================

// GET /api/exercices - Récupérer tous les exercices avec filtres
router.get('/', async (req, res) => {
  try {
    const {
      categorie,
      groupe_musculaire,
      niveau,
      type,
      search,
      is_validated,
      limit = 50,
      offset = 0
    } = req.query;

    let query = supabase
      .from('v_exercices_completes')
      .select('*');

    // Filtres
    if (categorie) {
      query = query.eq('categorie_nom', categorie);
    }
    if (groupe_musculaire) {
      query = query.eq('groupe_musculaire_nom', groupe_musculaire);
    }
    if (niveau) {
      query = query.eq('niveau_nom', niveau);
    }
    if (type) {
      query = query.eq('type_nom', type);
    }
    if (search) {
      query = query.or(`nom.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (is_validated !== undefined) {
      query = query.eq('is_validated', is_validated === 'true');
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Erreur lors de la récupération des exercices:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des exercices',
        details: error.message
      });
    }

    res.json({
      exercices: data,
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

// GET /api/exercices/:id - Récupérer un exercice par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('v_exercices_completes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Exercice non trouvé',
          details: `Aucun exercice trouvé avec l'ID: ${id}`
        });
      }
      console.error('❌ Erreur lors de la récupération de l\'exercice:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération de l\'exercice',
        details: error.message
      });
    }

    res.json({ exercice: data });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /api/exercices/categories/list - Récupérer toutes les catégories
router.get('/categories/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories_exercices')
      .select('*')
      .order('ordre_affichage');

    if (error) {
      console.error('❌ Erreur lors de la récupération des catégories:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des catégories',
        details: error.message
      });
    }

    res.json({ categories: data });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /api/exercices/groupes/list - Récupérer tous les groupes musculaires
router.get('/groupes/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('groupes_musculaires')
      .select('*')
      .order('ordre_affichage');

    if (error) {
      console.error('❌ Erreur lors de la récupération des groupes musculaires:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des groupes musculaires',
        details: error.message
      });
    }

    res.json({ groupes: data });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /api/exercices/niveaux/list - Récupérer tous les niveaux
router.get('/niveaux/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('niveaux_difficulte')
      .select('*')
      .order('ordre');

    if (error) {
      console.error('❌ Erreur lors de la récupération des niveaux:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des niveaux',
        details: error.message
      });
    }

    res.json({ niveaux: data });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /api/exercices/types/list - Récupérer tous les types
router.get('/types/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('types_exercices')
      .select('*')
      .order('nom');

    if (error) {
      console.error('❌ Erreur lors de la récupération des types:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des types',
        details: error.message
      });
    }

    res.json({ types: data });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// POST /exercices - Créer un nouvel exercice (collaboratif, en attente de validation)
router.post('/', async (req, res) => {
  try {
    const {
      nom,
      description,
      position_depart,
      categorie_id,
      groupe_musculaire_id,
      niveau_id,
      type_id,
      materiel,
      erreurs,
      muscles_sollicites,
      variantes,
      conseils,
      duree_estimee,
      calories_estimees,
      created_by
    } = req.body;

    // Validation des champs obligatoires
    if (!nom || !description) {
      return res.status(400).json({
        error: 'Données manquantes',
        details: 'Les champs nom et description sont obligatoires'
      });
    }

    // Générer l'ID automatiquement basé sur le nom
    const generateId = (nom) => {
      return nom.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .trim();
    };

    const id = generateId(nom);

    // Vérifier si l'exercice existe déjà
    const { data: existingExercise } = await supabase
      .from('exercices')
      .select('id')
      .eq('id', id)
      .single();

    if (existingExercise) {
      return res.status(409).json({
        error: 'Exercice déjà existant',
        details: `Un exercice avec le nom "${nom}" existe déjà`
      });
    }

    const exerciceData = {
      id,
      nom,
      description,
      position_depart,
      categorie_id: categorie_id || null,
      groupe_musculaire_id: groupe_musculaire_id || null,
      niveau_id: niveau_id || null,
      type_id: type_id || null,
      materiel: materiel || [],
      erreurs: erreurs || [],
      muscles_sollicites: muscles_sollicites || [],
      variantes: variantes || {},
      conseils: conseils || [],
      duree_estimee: duree_estimee || null,
      calories_estimees: calories_estimees || null,
      created_by: created_by || 'anonymous',
      is_validated: false, // En attente de validation par un admin
      created_at: new Date().toISOString()
    };

    console.log('🔍 Données de l\'exercice à créer:', JSON.stringify(exerciceData, null, 2));

    const { data, error } = await supabase
      .from('exercices')
      .insert([exerciceData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de l\'exercice:', error);
      console.error('❌ Détails de l\'erreur:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return res.status(500).json({
        error: 'Erreur lors de la création de l\'exercice',
        details: error.message
      });
    }

    console.log('✅ Exercice créé avec succès:', data);

    res.status(201).json({
      message: 'Exercice créé avec succès et en attente de validation',
      exercice: data
    });

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

// PUT /exercices/:id - Mettre à jour un exercice (admin seulement)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Vérifier les permissions (admin seulement pour l'instant)
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Accès refusé',
        details: 'Seuls les administrateurs peuvent modifier des exercices'
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Supprimer les champs qui ne doivent pas être modifiés
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    const { data, error } = await supabase
      .from('exercices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Exercice non trouvé',
          details: `Aucun exercice trouvé avec l'ID: ${id}`
        });
      }
      console.error('❌ Erreur lors de la mise à jour de l\'exercice:', error);
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour de l\'exercice',
        details: error.message
      });
    }

    res.json({
      message: 'Exercice mis à jour avec succès',
      exercice: data
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// DELETE /exercices/:id - Supprimer un exercice (admin seulement)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Vérifier les permissions (admin seulement pour l'instant)
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: 'Accès refusé',
        details: 'Seuls les administrateurs peuvent supprimer des exercices'
      });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('exercices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erreur lors de la suppression de l\'exercice:', error);
      return res.status(500).json({
        error: 'Erreur lors de la suppression de l\'exercice',
        details: error.message
      });
    }

    res.json({
      message: 'Exercice supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// POST /exercices/:id/validate - Valider un exercice (admin)
router.post('/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req; // Supposé être défini par le middleware d'auth

    console.log(`🔍 Validation de l'exercice ${id} par l'utilisateur ${user?.id}`);

    // Vérifier que l'exercice existe
    const { data: exercice, error: fetchError } = await supabase
      .from('exercices')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !exercice) {
      console.error('❌ Exercice non trouvé:', fetchError);
      return res.status(404).json({
        error: 'Exercice non trouvé',
        details: fetchError?.message
      });
    }

    // Mettre à jour l'exercice avec les informations de validation
    const { data, error } = await supabase
      .from('exercices')
      .update({
        is_validated: true,
        validated_by: user?.id || user?.email,
        validated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la validation:', error);
      return res.status(500).json({
        error: 'Erreur lors de la validation de l\'exercice',
        details: error.message
      });
    }

    console.log(`✅ Exercice ${id} validé avec succès par ${user?.email}`);

    res.json({
      message: 'Exercice validé avec succès',
      exercice: data
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

module.exports = router; 