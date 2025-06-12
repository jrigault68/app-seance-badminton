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
  (req, res) => {
    try {
      console.log("→ Utilisateur authentifié :", JSON.stringify(req.user, null, 2));

      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

console.log("→ req.query :", JSON.stringify(req.query, null, 2));

const redirectBase = decodeURIComponent(req.query.state || process.env.FRONTEND_URL || "https://app-seance-badminton.vercel.app/");
	/*const redirectBase =
      req.query.redirect ||
      process.env.FRONTEND_URL ||
      "https://app-seance-badminton.vercel.app/";*/

	res.send(<html><script>localStorage.setItem("token", token); location.href = "/profil"</script></html>)

	/*const isLocalhost  = redirectBase.includes("localhost");
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: !isLocalhost ,
          sameSite: isLocalhost  ? "Lax" : "None",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .redirect(`${redirectBase}/profil`);*/
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
/*router.post("/register", async (req, res) => {
  const { email, password, nom } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  const { data, error } = await supabase
    .from("utilisateurs")
    .insert([{ email, mot_de_passe: hash, nom }])
	.select(); // ← important !

  if (error) return res.status(400).json({ message: error.message });

  res.status(201).json({ id: data[0].id, email });
});*/

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("utilisateurs")
    .select("id, email, nom, password_hash")
    .eq("email", email)
    .single();

  if (error || !user) return res.status(401).json({ message: "Email invalide" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: "Mot de passe invalide" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
	const redirectBase = decodeURIComponent(
	  req.query.redirect || process.env.FRONTEND_URL || "https://app-seance-badminton.vercel.app"
	);
res.json({
  token, // ← le JWT directement
  user: { id: user.id, email: user.email, nom: user.nom }
});
  /*const isLocalhost  = redirectBase.includes("localhost");
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: !isLocalhost ,
          sameSite: isLocalhost  ? "Lax" : "None",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .json({ user: { id: user.id, email: user.email, nom: user.nom } });*/
});
/*router.post("/login", async (req, res) => {
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
});*/

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Déconnexion réussie" });
});

const verifyToken = require("../middleware/auth");

router.get("/profil", verifyToken, async (req, res) => {
	console.log('profil', req.user.id);
  const { data, error } = await supabase
    .from("utilisateurs")
    .select("id, email, nom")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(400).json({ message: error.message });

  res.json(data);
});


module.exports = router;
