const express = require("express");
const router = express.Router();
const db = require("../supabase"); // À adapter si tu utilises un autre système de connexion
const verifyToken = require('../middleware/auth');

// GET niveaux
router.get("/", async (req, res) => {
  try {
    const { data, error } = await db.from("niveaux_difficulte").select("id, nom").order("ordre");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des niveaux", details: err.message });
  }
});

module.exports = router; 