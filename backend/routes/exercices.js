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
      sous_categorie,
      zone_corps,
      muscle_specifique,
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
      query = query.contains('categories_noms', [categorie]);
    }
    if (sous_categorie) {
      query = query.contains('sous_categories_noms', [sous_categorie]);
    }
    if (zone_corps) {
      query = query.contains('zones_corps_noms', [zone_corps]);
    }
    if (muscle_specifique) {
      query = query.contains('muscles_specifiques_noms', [muscle_specifique]);
    }
    if (is_validated !== undefined) {
      query = query.eq('is_validated', is_validated === 'true');
    }
    if (search) {
      query = query.or(`nom.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Filtres de difficulté par aspect
    const {
      min_force, max_force,
      min_cardio, max_cardio,
      min_technique, max_technique,
      min_mobilite, max_mobilite,
      min_impact, max_impact,
      min_mentale, max_mentale,
      note_force, note_cardio, note_technique, note_mobilite, note_impact, note_mentale
    } = req.query;

    if (min_force !== undefined) query = query.gte('note_force', parseInt(min_force));
    if (max_force !== undefined) query = query.lte('note_force', parseInt(max_force));
    if (min_cardio !== undefined) query = query.gte('note_cardio', parseInt(min_cardio));
    if (max_cardio !== undefined) query = query.lte('note_cardio', parseInt(max_cardio));
    if (min_technique !== undefined) query = query.gte('note_technique', parseInt(min_technique));
    if (max_technique !== undefined) query = query.lte('note_technique', parseInt(max_technique));
    if (min_mobilite !== undefined) query = query.gte('note_mobilite', parseInt(min_mobilite));
    if (max_mobilite !== undefined) query = query.lte('note_mobilite', parseInt(max_mobilite));
    if (min_impact !== undefined) query = query.gte('note_impact', parseInt(min_impact));
    if (max_impact !== undefined) query = query.lte('note_impact', parseInt(max_impact));
    if (min_mentale !== undefined) query = query.gte('note_mentale', parseInt(min_mentale));
    if (max_mentale !== undefined) query = query.lte('note_mentale', parseInt(max_mentale));

    // Filtres de notes exactes (pour les exemples)
    if (note_force !== undefined) query = query.eq('note_force', parseInt(note_force));
    if (note_cardio !== undefined) query = query.eq('note_cardio', parseInt(note_cardio));
    if (note_technique !== undefined) query = query.eq('note_technique', parseInt(note_technique));
    if (note_mobilite !== undefined) query = query.eq('note_mobilite', parseInt(note_mobilite));
    if (note_impact !== undefined) query = query.eq('note_impact', parseInt(note_impact));
    if (note_mentale !== undefined) query = query.eq('note_mentale', parseInt(note_mentale));

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
      .from('categories')
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

// GET /exercices/sous-categories/list - Récupérer toutes les sous-catégories
router.get('/sous-categories/list', async (req, res) => {
  try {
    const { data: sousCategories, error } = await supabase
      .from('v_categories_avec_sous_categories')
      .select('*')
      .order('categorie_ordre, sous_categorie_ordre');

    if (error) {
      console.error('❌ Erreur lors de la récupération des sous-catégories:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des sous-catégories',
        details: error.message
      });
    }

    res.json({ sousCategories: sousCategories || [] });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /exercices/zones/list - Récupérer toutes les zones du corps
router.get('/zones/list', async (req, res) => {
  try {
    const { data: zones, error } = await supabase
      .from('zones_corps')
      .select('*')
      .order('ordre_affichage');

    if (error) {
      console.error('❌ Erreur lors de la récupération des zones du corps:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des zones du corps',
        details: error.message
      });
    }

    res.json({ zones: zones || [] });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /exercices/zones-specifiques/list - Récupérer toutes les zones spécifiques
router.get('/zones-specifiques/list', async (req, res) => {
  try {
    const { data: zonesSpecifiques, error } = await supabase
      .from('v_zones_corps_avec_zones_specifiques')
      .select('*')
      .order('zone_corps_ordre, zone_specifique_ordre');

    if (error) {
      console.error('❌ Erreur lors de la récupération des zones spécifiques:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des zones spécifiques',
        details: error.message
      });
    }

    res.json({ zonesSpecifiques: zonesSpecifiques || [] });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// GET /exercices/difficulte/stats - Statistiques de difficulté
router.get('/difficulte/stats', async (req, res) => {
  try {
    const { data: stats, error } = await supabase
      .from('v_exercices_completes')
      .select('note_force, note_cardio, note_technique, note_mobilite, note_impact, note_mentale');

    if (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération des statistiques',
        details: error.message
      });
    }

    // Calculer les statistiques pour chaque aspect
    const aspects = ['force', 'cardio', 'technique', 'mobilite', 'impact', 'mentale'];
    const statistiques = {};

    aspects.forEach(aspect => {
      const notes = stats.map(ex => ex[`note_${aspect}`]).filter(note => note !== null);
      if (notes.length > 0) {
        statistiques[aspect] = {
          moyenne: Math.round(notes.reduce((a, b) => a + b, 0) / notes.length * 10) / 10,
          min: Math.min(...notes),
          max: Math.max(...notes),
          nombre_exercices: notes.length
        };
      }
    });

    res.json({ statistiques });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// POST /exercices - Créer un nouvel exercice
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      id,
      nom,
      description,
      position_depart,
      famille_id,
      exercice_plus_dur_id,
      exercice_plus_facile_id,
      exercices_similaires,
      variantes,
      note_force,
      note_cardio,
      note_technique,
      note_mobilite,
      note_impact,
      note_mentale,
      erreurs,
      focus_zone,
      image_url,
      video_url,
      duree_estimee,
      calories_estimees,
      muscles_sollicites,
      conseils,
      sous_categories_ids,
      zones_specifiques_ids
    } = req.body;

    // Validation des champs obligatoires
    if (!id || !nom || !description) {
      return res.status(400).json({
        error: 'Données manquantes',
        details: 'Les champs id, nom et description sont obligatoires'
      });
    }

    // Créer l'exercice
    const exerciceData = {
      id,
      nom,
      description,
      position_depart: position_depart || null,
      famille_id: famille_id || null,
      exercice_plus_dur_id: exercice_plus_dur_id || null,
      exercice_plus_facile_id: exercice_plus_facile_id || null,
      exercices_similaires: exercices_similaires || [],
      variantes: variantes || [],
      note_force: note_force || 0,
      note_cardio: note_cardio || 0,
      note_technique: note_technique || 0,
      note_mobilite: note_mobilite || 0,
      note_impact: note_impact || 0,
      note_mentale: note_mentale || 0,
      erreurs: erreurs || [],
      focus_zone: focus_zone || [],
      image_url: image_url || null,
      video_url: video_url || null,
      duree_estimee: duree_estimee || null,
      calories_estimees: calories_estimees || null,
      muscles_sollicites: muscles_sollicites || [],
      conseils: conseils || [],
      created_by: req.user.id
    };

    const { data: exercice, error: exerciceError } = await supabase
      .from('exercices')
      .insert([exerciceData])
      .select()
      .single();

    if (exerciceError) {
      console.error('❌ Erreur lors de la création de l\'exercice:', exerciceError);
      return res.status(500).json({
        error: 'Erreur lors de la création de l\'exercice',
        details: exerciceError.message
      });
    }

    // Ajouter les sous-catégories si fournies
    if (sous_categories_ids && Array.isArray(sous_categories_ids) && sous_categories_ids.length > 0) {
      const sousCategoriesData = sous_categories_ids.map(sous_categorie_id => ({
        exercice_id: exercice.id,
        sous_categorie_id
      }));

      const { error: sousCategoriesError } = await supabase
        .from('exercices_sous_categories')
        .insert(sousCategoriesData);

      if (sousCategoriesError) {
        console.error('❌ Erreur lors de l\'ajout des sous-catégories:', sousCategoriesError);
        // On ne fait pas échouer la création de l'exercice pour ça
      }
    }

    // Ajouter les zones spécifiques si fournies
    if (zones_specifiques_ids && Array.isArray(zones_specifiques_ids) && zones_specifiques_ids.length > 0) {
      const zonesData = zones_specifiques_ids.map(zone_specifique_id => ({
        exercice_id: exercice.id,
        zone_specifique_id
      }));

      const { error: zonesError } = await supabase
        .from('exercices_zones_specifiques')
        .insert(zonesData);

      if (zonesError) {
        console.error('❌ Erreur lors de l\'ajout des zones spécifiques:', zonesError);
        // On ne fait pas échouer la création de l'exercice pour ça
      }
    }

    res.status(201).json({
      message: 'Exercice créé avec succès',
      exercice
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// PUT /exercices/:id - Mettre à jour un exercice
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      description,
      position_depart,
      famille_id,
      exercice_plus_dur_id,
      exercice_plus_facile_id,
      exercices_similaires,
      variantes,
      note_force,
      note_cardio,
      note_technique,
      note_mobilite,
      note_impact,
      note_mentale,
      erreurs,
      focus_zone,
      image_url,
      video_url,
      duree_estimee,
      calories_estimees,
      muscles_sollicites,
      conseils,
      sous_categories_ids,
      zones_specifiques_ids
    } = req.body;

    // Mettre à jour l'exercice
    const exerciceData = {
      nom,
      description,
      position_depart,
      famille_id,
      exercice_plus_dur_id,
      exercice_plus_facile_id,
      exercices_similaires,
      variantes,
      note_force,
      note_cardio,
      note_technique,
      note_mobilite,
      note_impact,
      note_mentale,
      erreurs,
      focus_zone,
      image_url,
      video_url,
      duree_estimee,
      calories_estimees,
      muscles_sollicites,
      conseils
    };

    // Supprimer les valeurs null/undefined
    Object.keys(exerciceData).forEach(key => {
      if (exerciceData[key] === null || exerciceData[key] === undefined) {
        delete exerciceData[key];
      }
    });

    const { data: exercice, error: exerciceError } = await supabase
      .from('exercices')
      .update(exerciceData)
      .eq('id', id)
      .select()
      .single();

    if (exerciceError) {
      console.error('❌ Erreur lors de la mise à jour de l\'exercice:', exerciceError);
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour de l\'exercice',
        details: exerciceError.message
      });
    }

    // Mettre à jour les sous-catégories si fournies
    if (sous_categories_ids !== undefined) {
      // Supprimer les anciennes associations
      await supabase
        .from('exercices_sous_categories')
        .delete()
        .eq('exercice_id', id);

      // Ajouter les nouvelles associations
      if (Array.isArray(sous_categories_ids) && sous_categories_ids.length > 0) {
        const sousCategoriesData = sous_categories_ids.map(sous_categorie_id => ({
          exercice_id: id,
          sous_categorie_id
        }));

        const { error: sousCategoriesError } = await supabase
          .from('exercices_sous_categories')
          .insert(sousCategoriesData);

        if (sousCategoriesError) {
          console.error('❌ Erreur lors de la mise à jour des sous-catégories:', sousCategoriesError);
        }
      }
    }

    // Mettre à jour les zones spécifiques si fournies
    if (zones_specifiques_ids !== undefined) {
      // Supprimer les anciennes associations
      await supabase
        .from('exercices_zones_specifiques')
        .delete()
        .eq('exercice_id', id);

      // Ajouter les nouvelles associations
      if (Array.isArray(zones_specifiques_ids) && zones_specifiques_ids.length > 0) {
        const zonesData = zones_specifiques_ids.map(zone_specifique_id => ({
          exercice_id: id,
          zone_specifique_id
        }));

        const { error: zonesError } = await supabase
          .from('exercices_zones_specifiques')
          .insert(zonesData);

        if (zonesError) {
          console.error('❌ Erreur lors de la mise à jour des zones spécifiques:', zonesError);
        }
      }
    }

    res.json({
      message: 'Exercice mis à jour avec succès',
      exercice
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: 'Erreur serveur interne',
      details: error.message
    });
  }
});

// DELETE /exercices/:id - Supprimer un exercice
router.delete('/:id', verifyToken, async (req, res) => {
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

module.exports = router; 