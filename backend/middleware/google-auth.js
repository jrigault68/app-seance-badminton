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
			console.log("🟥 Étape 3 : erreur SELECT utilisateur");
          console.error("Erreur Supabase : ", error);
          return done(error);
        }

        // Crée l'utilisateur s'il n'existe pas
        if (!existingUser) {
			console.log("🟠 Étape 4 : utilisateur inexistant → insertion");
          const { data: newUser, error: insertError } = await supabase
            .from("utilisateurs")
            .insert({
              email,
              nom,
              google_id,
            })
            .select("id")
            .single();

          if (insertError) {
			  console.log("🟥 Étape 5 : erreur INSERT utilisateur");
			  console.error({
				  message: insertError.message,
				  details: insertError.details,
				  hint: insertError.hint,
				  code: insertError.code,
				});

			  return done(insertError);
		  }
		  console.log("🟢 Étape 6 : insertion réussie, id =", newUser.id);
          return done(null, { id: newUser.id });
        }
console.log("🟢 Étape 7 : utilisateur existant, id =", existingUser.id);
        return done(null, { id: existingUser.id });
      } catch (err) {
        console.error("Erreur stratégie Google :", err);
		console.log("❌ Stack complète :", JSON.stringify(err, null, 2));
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
