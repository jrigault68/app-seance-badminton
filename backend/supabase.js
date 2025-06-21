const { createClient } = require("@supabase/supabase-js");

let supabase = null;

// Créer le client Supabase seulement si les variables d'environnement sont définies
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
} else {
  console.warn("⚠️ Supabase environment variables not configured");
}

module.exports = supabase;
