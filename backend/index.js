// Smart Sports Backend - ES Modules
// Ce backend utilise la syntaxe ES modules (import/export) car le package.json contient "type": "module".
// Tous les fichiers doivent utiliser import/export et non require/module.exports.

const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./middleware/google-auth");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
  "https://smart-sports-app.vercel.app",
  "https://smart-sports-backend.onrender.com",
  "https://app-seance-badminton-3u1t-62u8mf9x8-gloumy68s-projects.vercel.app",
  "https://coach.csbw.fr"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// =====================================================
// ROUTES DE SANTÉ
// =====================================================

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/supabase-ping", async (req, res) => {
  try {
    const supabase = require("./supabase");
    if (!supabase) {
      return res.status(500).json({
        status: "ERROR",
        supabase: "not_configured",
        timestamp: new Date().toISOString(),
      });
    }

    const { data, error } = await supabase.from("categories_exercices").select("count").limit(1);
    
    if (error) {
      return res.status(500).json({
        status: "ERROR",
        supabase: "connection_failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      status: "OK",
      supabase: "active",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      supabase: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// =====================================================
// NOUVELLES ROUTES POUR LA GESTION DES SÉANCES
// =====================================================

// API pour les exercices
app.use("/exercices", require("./routes/exercices"));

// API pour les familles d'exercices
app.use("/familles-exercices", require("./routes/familles-exercices"));

// API pour les séances
app.use("/seances", require("./routes/seances"));

// API pour les sessions d'entraînement
app.use("/sessions", require("./routes/sessions"));

// API pour les programmes
app.use("/programmes", require("./routes/programmes"));
app.use("/niveaux", require("./routes/niveaux"));
app.use("/categories", require("./routes/categories"));
app.use("/types", require("./routes/types"));

// =====================================================
// ROUTES D'ADMINISTRATION
// =====================================================

app.use("/admin", require("./routes/admin"));

// =====================================================
// ROUTES D'AUTHENTIFICATION
// =====================================================

app.use("/auth", require("./routes/auth"));

// =====================================================
// GESTION DES ERREURS
// =====================================================

app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur:", err);
  res.status(500).json({
    error: "Erreur serveur interne",
    details: process.env.NODE_ENV === "development" ? err.message : "Une erreur est survenue",
  });
});

// =====================================================
// DÉMARRAGE DU SERVEUR
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});
