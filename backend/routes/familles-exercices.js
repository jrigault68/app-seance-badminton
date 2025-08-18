const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../middleware/auth');

// =====================================================
// ROUTES POUR LA GESTION DES FAMILLES D'EXERCICES
// =====================================================

// GET /familles-exercices - Récupérer toutes les familles avec filtres
router.get('/', async (req, res) => {
  try {
    const {
      search,
      limit = 50,
      offset = 0
    } = req.query;

    let query = supabase
      .from('familles_exercices')
      .select('*')
      .order('nom');

    // Filtre de recherche
    if (search) {
      query = query.or(`nom.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: familles, error, count } = await query;

    if (error) {
      console.error('❌ Erreur lors de la récupération des familles:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des familles',
        details: error.message
      });
    }

    res.json({
      familles: familles || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count || familles?.length || 0
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

// GET /familles-exercices/:id - Récupérer une famille par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: famille, error } = await supabase
      .from('familles_exercices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Famille non trouvée',
          details: `Aucune famille trouvée avec l'ID: ${id}`
        });
      }
      console.error('❌ Erreur lors de la récupération de la famille:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération de la famille',
        details: error.message
      });
    }

    res.json({ famille });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// POST /familles-exercices - Créer une nouvelle famille (Admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const familleData = req.body;

    // Vérifier que l'utilisateur est admin
    if (!req.user.is_admin) {
      return res.status(403).json({
        error: 'Accès refusé',
        details: 'Vous devez être administrateur pour créer une famille'
      });
    }

    // Ajouter les champs par défaut
    familleData.created_at = new Date().toISOString();
    familleData.updated_at = new Date().toISOString();

    const { data: famille, error } = await supabase
      .from('familles_exercices')
      .insert([familleData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création de la famille:', error);
      return res.status(500).json({
        error: 'Erreur lors de la création de la famille',
        details: error.message
      });
    }

    res.status(201).json({ famille });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// PUT /familles-exercices/:id - Mettre à jour une famille (Admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const familleData = req.body;

    // Vérifier que l'utilisateur est admin
    if (!req.user.is_admin) {
      return res.status(403).json({
        error: 'Accès refusé',
        details: 'Vous devez être administrateur pour modifier une famille'
      });
    }

    // Mettre à jour le timestamp
    familleData.updated_at = new Date().toISOString();

    const { data: famille, error } = await supabase
      .from('familles_exercices')
      .update(familleData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Famille non trouvée',
          details: `Aucune famille trouvée avec l'ID: ${id}`
        });
      }
      console.error('❌ Erreur lors de la mise à jour de la famille:', error);
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour de la famille',
        details: error.message
      });
    }

    res.json({ famille });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// DELETE /familles-exercices/:id - Supprimer une famille (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur est admin
    if (!req.user.is_admin) {
      return res.status(403).json({
        error: 'Accès refusé',
        details: 'Vous devez être administrateur pour supprimer une famille'
      });
    }

    const { error } = await supabase
      .from('familles_exercices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erreur lors de la suppression de la famille:', error);
      return res.status(500).json({
        error: 'Erreur lors de la suppression de la famille',
        details: error.message
      });
    }

    res.json({ message: 'Famille supprimée avec succès' });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

module.exports = router;
