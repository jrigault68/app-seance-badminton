const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const supabase = require("../supabase"); // modifie le chemin si besoin

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const nom = profile.displayName;
        const google_id = profile.id;
		console.log("→ Profil Google :", JSON.stringify({ email, nom, google_id }, null, 2));
        // Vérifie si l'utilisateur existe déjà
        const { data: existingUser, error } = await supabase
          .from("utilisateurs")
          .select("id")
          .eq("email", email)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Erreur Supabase : ", error);
          return done(error);
        }

        // Crée l'utilisateur s'il n'existe pas
        if (!existingUser) {
          const { data: newUser, error: insertError } = await supabase
            .from("utilisateurs")
            .insert({
              email,
              nom,
              google_id,
            })
            .select("id")
            .single();

          if (insertError) return done(insertError);
          return done(null, { id: newUser.id });
        }

        return done(null, { id: existingUser.id });
      } catch (err) {
        console.error("Erreur stratégie Google :", err);
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
