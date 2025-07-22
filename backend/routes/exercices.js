const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../middleware/auth');

// =====================================================
// ROUTES POUR LA GESTION DES EXERCICES
// =====================================================

// GET /exercices - Récupérer tous les exercices avec filtres
router.get('/', async (req, res) => {
  try {
    const {
      categorie,
      groupe_musculaire,
      niveau,
      type,
      search,
      limit = 50,
      offset = 0,
      is_validated
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
    if (is_validated !== undefined) {
      query = query.eq('is_validated', is_validated === 'true');
    }
    if (search) {
      query = query.or(`nom.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: exercices, error, count } = await query;

    if (error) {
      console.error('❌ Erreur lors de la récupération des exercices:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des exercices',
        details: error.message
      });
    }

    res.json({
      exercices: exercices || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count || exercices?.length || 0
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

// GET /exercices/:id - Récupérer un exercice par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: exercice, error } = await supabase
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

    res.json({ exercice });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /exercices/categories/list - Récupérer toutes les catégories
router.get('/categories/list', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
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

    res.json({ categories: categories || [] });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /exercices/groupes/list - Récupérer tous les groupes musculaires
router.get('/groupes/list', async (req, res) => {
  try {
    const { data: groupes, error } = await supabase
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

    res.json({ groupes: groupes || [] });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /exercices/niveaux/list - Récupérer tous les niveaux
router.get('/niveaux/list', async (req, res) => {
  try {
    const { data: niveaux, error } = await supabase
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

    res.json({ niveaux: niveaux || [] });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /exercices/types/list - Récupérer tous les types
router.get('/types/list', async (req, res) => {
  try {
    const { data: types, error } = await supabase
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

    res.json({ types: types || [] });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// POST /exercices - Créer un nouvel exercice (Admin)
router.post('/', async (req, res) => {
  try {
    const exerciceData = req.body;

    // Ajouter les champs par défaut
    exerciceData.created_at = new Date().toISOString();
    exerciceData.updated_at = new Date().toISOString();

    const { data: exercice, error } = await supabase
      .from('exercices')
      .insert([exerciceData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de l\'exercice:', error);
      return res.status(500).json({
        error: 'Erreur lors de la création de l\'exercice',
        details: error.message
      });
    }

    res.status(201).json({ exercice });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// PUT /exercices/:id - Mettre à jour un exercice (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exerciceData = req.body;

    // Mettre à jour le timestamp
    exerciceData.updated_at = new Date().toISOString();

    const { data: exercice, error } = await supabase
      .from('exercices')
      .update(exerciceData)
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

    res.json({ exercice });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// DELETE /exercices/:id - Supprimer un exercice (Admin)
router.delete('/:id', async (req, res) => {
  try {
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

    res.json({ message: 'Exercice supprimé avec succès' });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// POST /exercices/:id/validate - Valider un exercice (Admin)
router.post('/:id/validate', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedBy = req.user && req.user.id ? req.user.id : null;
    if (!validatedBy) {
      return res.status(401).json({ error: 'Utilisateur non authentifié pour la validation.' });
    }
    const { data: exercice, error } = await supabase
      .from('exercices')
      .update({
        is_validated: true,
        validated_by: validatedBy,
        validated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
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
      console.error('❌ Erreur lors de la validation de l\'exercice:', error);
      return res.status(500).json({
        error: 'Erreur lors de la validation de l\'exercice',
        details: error.message
      });
    }

    res.json({ exercice });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

module.exports = router; 