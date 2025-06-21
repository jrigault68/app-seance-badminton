import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { getDisplayName, getTagline, BRAND_CONFIG } from "../config/brand";
import { Target, Users, Brain, TrendingUp } from "lucide-react";

export default function Accueil() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/profil");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Entraînement personnalisé",
      description: "Séances adaptées à ton niveau et à tes objectifs"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Suivi complet",
      description: "Physique, nutrition, mental - Tout en un"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Communauté",
      description: "Entraînement en club ou solo, selon tes préférences"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Objectifs intelligents",
      description: "IA qui s'adapte à tes progrès et te guide"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-red-950 via-red-900 to-black flex flex-col justify-evenly">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
          Votre partenaire sportif{" "}
          <span className="text-red-400">intelligent</span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl">
          Organisez, suivez et optimisez vos séances sportives facilement. 
          Connectez-vous pour accéder à votre espace personnel, suivre vos progrès 
          et découvrir des programmes adaptés à votre niveau et à votre sport.
        </p>
      </section>

      {/* Fonctionnalités clés */}
      <section className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
            Pourquoi choisir {getDisplayName()} ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-black/50 transition-all duration-300 border border-red-900/30"
              >
                <div className="text-red-400 mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action final */}
      <section className="px-4 py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Prêt à transformer ton sport ?
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Rejoins la communauté {getDisplayName()} et commence ton parcours vers l'excellence
          </p>
          <button
            onClick={() => navigate("/login?tab=inscription")}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-xl text-lg font-semibold text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Commencer maintenant
          </button>
        </div>
      </section>
    </div>
  );
} 