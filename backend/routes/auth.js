const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../db");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password, nom } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  const { data, error } = await supabase
    .from("utilisateurs")
    .insert([{ email, mot_de_passe: hash, nom }])
	.select(); // ← important !

  if (error) return res.status(400).json({ message: error.message });

  res.status(201).json({ id: data[0].id, email });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("utilisateurs")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return res.status(401).json({ message: "Email inconnu" });

  const valid = bcrypt.compareSync(password, data.mot_de_passe);
  if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user: { id: data.id, email: data.email, nom: data.nom } });
});

const verifyToken = require("../middleware/auth");

router.get("/profil", verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from("utilisateurs")
    .select("id, email, nom")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(400).json({ message: error.message });

  res.json(data);
});


module.exports = router;
