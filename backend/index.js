const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./middleware/google-auth");

const app = express();

const allowedOrigins = [
  "https://coach.csbw.fr",
  "http://localhost:5173",
  "http://localhost:5000",
  "https://api.csbw.fr"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Cas spécial pour les health checks Render (souvent sans origin)
    if (process.env.NODE_ENV === "production" && origin === undefined) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());

// Routes
app.use("/auth", require("./routes/auth"));

// Health check routes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Endpoint pour maintenir Supabase actif
app.get("/supabase-ping", async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    
    // Faire une requête simple pour maintenir Supabase actif
    const { data, error } = await supabase
      .from('utilisateurs') // Table correcte
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`⚠️ Supabase ping warning: ${error.message}`);
      res.status(200).json({
        status: "OK",
        supabase: "warning",
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`✅ Supabase pinged successfully`);
      res.status(200).json({
        status: "OK",
        supabase: "active",
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error(`❌ Failed to ping Supabase: ${error.message}`);
    res.status(500).json({
      status: "ERROR",
      supabase: "inactive",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("API lancée sur http://localhost:" + port));
