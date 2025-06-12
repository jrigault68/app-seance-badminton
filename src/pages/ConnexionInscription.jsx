import { useState } from "react";
import { register, login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function ConnexionInscription() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    try {
      if (isSignup) await register(email, password, nom);
      await login(email, password);
	  
	  if (document.hasStorageAccess) {
		  try {
			const granted = await document.requestStorageAccess();
			console.log("✅ Storage access granted:", granted);
		  } catch (err) {
			console.warn("❌ Storage access not granted:", err);
		  }
		}

	  
      navigate("/profil");
    } catch (err) {
      setErreur(err.message);
    }
  };

  const googleLogin = () => {
	  const redirectURL = window.location.origin;
    window.location.href = `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/api/auth/google?redirect=${encodeURIComponent(redirectURL)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900 text-white px-4">
      <div className="w-full max-w-md space-y-6 bg-black/30 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center">
          {isSignup ? "Créer un compte" : "Connexion"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              className="w-full px-4 py-2 rounded bg-black/60 text-white placeholder-gray-400"
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          )}
          <input
            className="w-full px-4 py-2 rounded bg-black/60 text-white placeholder-gray-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-2 rounded bg-black/60 text-white placeholder-gray-400"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-bold transition"
          >
            {isSignup ? "S’inscrire" : "Se connecter"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-blue-400 hover:underline"
          >
            {isSignup ? "J’ai déjà un compte" : "Créer un compte"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400 my-2">ou</p>
          <button
            onClick={googleLogin}
            className="py-2 w-full bg-white text-black rounded font-semibold hover:bg-gray-200 transition"
          >
            Connexion avec Google
          </button>
        </div>

        {erreur && <p className="text-red-400 text-center">{erreur}</p>}
      </div>
    </div>
  );
}
