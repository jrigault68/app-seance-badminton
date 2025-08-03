const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase");
const router = express.Router();


router.get("/test-cookie", (req, res) => {
  const token = jwt.sign({ id: "test" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const isLocalhost = req.headers.origin?.includes("localhost");

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "Lax" : "None",
      maxAge: 1000 * 60 * 60 * 24,
    })
    .json({ message: "Cookie posé" });
});


const passport = require("passport");
router.get("/google", (req, res, next) => {
  const redirect = req.query.redirect || "";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: encodeURIComponent(redirect),
  })(req, res, next);
});
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false // ⬅️ pareil ici
  }),
  async (req, res) => {
    try {
      // Récupérer l'utilisateur complet pour avoir is_admin
      const { data: user, error } = await supabase
        .from("utilisateurs")
        .select("id, is_admin")
        .eq("id", req.user.id)
        .single();
      if (error || !user) throw new Error("Utilisateur Google non trouvé ou erreur Supabase");

      // Mettre à jour la dernière connexion
      await supabase
        .from("utilisateurs")
        .update({ last_connection: new Date().toISOString() })
        .eq("id", user.id);

      const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const redirectBase = decodeURIComponent(req.query.state || process.env.FRONTEND_URL || "https://coach.csbw.fr");
      const isLocalhost  = redirectBase.includes("localhost");
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: !isLocalhost ,
          sameSite: isLocalhost  ? "Lax" : "None",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .redirect(`${redirectBase}/profil`);
    } catch (err) {
      console.log("Erreur dans la route /google/callback :", JSON.stringify(err, null, 2));
      res.status(500).send("Erreur interne");
    }
  }
);

// Register
router.post("/register", async (req, res) => {
  const { nom, email, password } = req.body;

  // Vérifie que l'utilisateur n'existe pas déjà
  const { data: existingUser } = await supabase
    .from("utilisateurs")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return res.status(409).json({ message: "Email déjà utilisé." });
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Enregistrement en base
  const { data, error } = await supabase.from("utilisateurs").insert({
    nom,
    email,
    password_hash: hashedPassword,
  });

  if (error) {
	  console.error("❌ Erreur Supabase Register :", {
		message: error.message,
		details: error.details,
		hint: error.hint,
		code: error.code,
	  });
	  return res.status(500).json({ message: error.message });
	} 

  res.status(201).json({ message: "Inscription réussie" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("utilisateurs")
    .select("id, email, nom, password_hash, is_admin") // <-- ajouter is_admin
    .eq("email", email)
    .single();

  if (error || !user) return res.status(401).json({ message: "Email invalide" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: "Mot de passe invalide" });

  // Mettre à jour la dernière connexion
  await supabase
    .from("utilisateurs")
    .update({ last_connection: new Date().toISOString() })
    .eq("id", user.id);

  const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: "7d" }); // <-- inclure is_admin
  const redirectBase = decodeURIComponent(req.query.redirect || process.env.FRONTEND_URL || "https://coach.csbw.fr");

  const isLocalhost  = redirectBase.includes("localhost");
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: !isLocalhost ,
          sameSite: isLocalhost  ? "Lax" : "None",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        }).json({ success: true });
        //.json({ user: { id: user.id, email: user.email, nom: user.nom } });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Déconnexion réussie" });
});

const verifyToken = require("../middleware/auth");

router.get("/profil", verifyToken, async (req, res) => {
	console.log("🍪 Cookies:", req.cookies);
	console.log('profil', req.user?.id);
  
  // Mettre à jour la dernière connexion à chaque vérification de profil
  await supabase
    .from("utilisateurs")
    .update({ last_connection: new Date().toISOString() })
    .eq("id", req.user.id);

  const { data, error } = await supabase
    .from("utilisateurs")
    .select("id, email, nom, is_admin, created_at, last_connection")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(400).json({ message: error.message });

  res.json(data);
});

module.exports = router;