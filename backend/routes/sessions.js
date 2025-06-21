const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const verifyToken = require('../middleware/auth');

// GET /api/sessions - Test simple (protégé)
router.get('/', verifyToken, async (req, res) => {
  try {
    res.json({
      message: 'API Sessions fonctionne !',
      sessions: []
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur serveur',
      details: error.message
    });
  }
});

module.exports = router; 