const express = require("express");
const router = express.Router();
const db = require("../supabase"); // À adapter si tu utilises un autre système de connexion
const verifyToken = require('../middleware/auth');

// GET catégories
router.get("/", async (req, res) => {
  try {
    const { data, error } = await db.from("categories").select("id, nom").order("ordre_affichage");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des catégories", details: err.message });
  }
});

module.exports = router; 