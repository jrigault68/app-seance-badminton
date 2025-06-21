import { useState, useEffect  } from "react";
import { register, login } from "../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { User, Mail, Lock, ArrowRight, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { getDisplayName } from "../config/brand";

export default function ConnexionInscription() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	// redirection si déjà connecté
	const { user, ready, refreshUser } = useUser();
	const [waited, setWaited] = useState(false);
	
	useEffect(() => {
	   if (ready && user && waited === false) {
		 navigate("/");
	   }
	   else if (waited && user) {
		navigate("/profil");
	   }
	 }, [ready, user, waited]);

	// Vérifier si on doit afficher directement l'inscription
	useEffect(() => {
		const tab = searchParams.get('tab');
		if (tab === 'inscription') {
			setIsSignup(true);
		} else if (tab === 'login') {
			setIsSignup(false);
		}
		// Si pas de paramètre tab, on garde le comportement par défaut (connexion)
	}, [searchParams]);
	
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
	e.preventDefault();
	setErreur(null);
	setIsLoading(true);
	try {
	  if (isSignup) await register(email, password, nom);
	  await login(email, password);
	  
	  if (document.hasStorageAccess) {
		  try {
			const granted = await document.requestStorageAccess();
		  } catch (err) {
			//console.warn("❌ Storage access not granted:", err);
		  }
		}
		console.log("✅ Login réussi, on redirige !");
	  await refreshUser();
	  setWaited(true);
	  console.log("user: ", user);
	  navigate("/profil");
	} catch (err) {
	  setErreur(err.message);
	} finally {
	  setIsLoading(false);
	}
  };

  const googleLogin = () => {
	  const redirectURL = window.location.origin;
	window.location.href = `${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}/auth/google?redirect=${encodeURIComponent(redirectURL)}`;
  };

  return (
	<div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900 text-white px-4 py-3 sm:py-6">
	  <div className="w-full max-w-md space-y-4 sm:space-y-5">
		{/* Header avec titre et sous-titre */}
		<div className="text-center mb-5 sm:mb-7">
		  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
			{isSignup ? `Rejoignez ${getDisplayName()}` : "Bienvenue"}
		  </h1>
		  <p className="text-gray-400 text-xs sm:text-sm">
			{isSignup 
			  ? "Commencez votre parcours vers l'excellence sportive" 
			  : "Connectez-vous à votre espace personnel"
			}
		  </p>
		</div>

		{/* Formulaire */}
		<div className="bg-black/30 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-2xl border border-red-900/30">
		  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
			{isSignup && (
			  <div className="space-y-2">
				<label className="text-sm font-medium text-gray-300 flex items-center gap-2">
				  <User size={16} />
				  Nom / Pseudo
				  <div className="relative group">
					<HelpCircle size={14} className="text-gray-400 cursor-help" />
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
					  Public
					</div>
				  </div>
				</label>
				<input
				  className="w-full px-4 py-3 rounded-xl bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-red-500 focus:outline-none transition-colors text-sm sm:text-base"
				  type="text"
				  placeholder="Nom / Pseudo"
				  value={nom}
				  onChange={(e) => setNom(e.target.value)}
				  required
				/>
			  </div>
			)}
			
			<div className="space-y-2">
			  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
				<Mail size={16} />
				Email
			  </label>
			  <input
				className="w-full px-4 py-3 rounded-xl bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-red-500 focus:outline-none transition-colors text-sm sm:text-base"
				type="email"
				placeholder="votre@email.com"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			  />
			</div>
			
			<div className="space-y-2">
			  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
				<Lock size={16} />
				Mot de passe
			  </label>
			  <input
				className="w-full px-4 py-3 rounded-xl bg-white text-black placeholder-gray-500 border border-gray-300 focus:border-red-500 focus:outline-none transition-colors text-sm sm:text-base"
				type="password"
				placeholder="••••••••"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			  />
			</div>

			{/* Bouton principal */}
			<button
			  type="submit"
			  disabled={isLoading}
			  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
			>
			  {isLoading ? (
				<>
				  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				  <span className="text-sm">{isSignup ? "Création du compte..." : "Connexion..."}</span>
				</>
			  ) : (
				<>
				  {isSignup ? "Créer mon compte" : "Se connecter"}
				  <ArrowRight size={18} />
				</>
			  )}
			</button>
		  </form>

		  {/* Séparateur */}
		  <div className="my-5 sm:my-6 flex items-center">
			<div className="flex-1 h-px bg-gray-700"></div>
			<span className="px-4 text-sm text-gray-400">ou</span>
			<div className="flex-1 h-px bg-gray-700"></div>
		  </div>

		  {/* Google Login */}
		  <button
			onClick={googleLogin}
			className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 text-sm sm:text-base"
		  >
			<svg className="w-5 h-5" viewBox="0 0 24 24">
			  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
			  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
			  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
			  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
			</svg>
			Continuer avec Google
		  </button>

		  {/* Lien de basculement */}
		  <div className="text-center mt-5 sm:mt-6">
			<button
			  onClick={() => setIsSignup(!isSignup)}
			  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
			>
			  {isSignup ? "J'ai déjà un compte" : "Créer un nouveau compte"}
			</button>
		  </div>
		</div>

		{/* Message d'erreur */}
		{erreur && (
		  <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
			<AlertCircle size={20} className="text-red-400 flex-shrink-0" />
			<p className="text-red-400 text-sm">{erreur}</p>
		  </div>
		)}
	  </div>
	</div>
  );
}
