import { useEffect, useState } from "react";
import { backgroundMainColor, blockStyle } from "@/styles/styles";
import { CheckCircle, Clock, Flame, MessageCircle, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import SessionService from "../services/sessionService";

export function FinishedScreen({ startTime, resetToAccueil, seanceId, programmeId, onMarquerComplete, sessionId: propSessionId }) {
  const [isMarking, setIsMarking] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [sessionId, setSessionId] = useState(propSessionId);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [difficulty, setDifficulty] = useState(null);
  const [error, setError] = useState(null);
  const [tempsTotalCumule, setTempsTotalCumule] = useState(null);
  
  // Calculer le temps écoulé une seule fois au début (fallback)
  const [finalElapsed] = useState(() => Math.round((Date.now() - startTime) / 1000));

  // Récupérer le temps total cumulé depuis la session si disponible
  useEffect(() => {
    const recupererTempsCumule = async () => {
      if (!sessionId) return;
      
      try {
        const session = await SessionService.getSessionByIdInternal(sessionId);
        if (session && session.progression) {
          const progression = typeof session.progression === 'string' 
            ? JSON.parse(session.progression) 
            : session.progression;
          
          if (progression.temps_ecoule) {
            setTempsTotalCumule(progression.temps_ecoule);
            console.log('📊 Temps total cumulé récupéré:', progression.temps_ecoule);
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération du temps cumulé:', error);
      }
    };

    recupererTempsCumule();
  }, [sessionId]);

  // Utiliser le temps cumulé s'il est disponible, sinon le temps écoulé
  const tempsFinal = tempsTotalCumule !== null ? tempsTotalCumule : finalElapsed;
  const minutesFinales = Math.floor(tempsFinal / 60);
  const secondesFinales = tempsFinal % 60;

  // Enregistrer automatiquement la séance au chargement (une seule fois)
  useEffect(() => {
    // Ne s'exécuter qu'une seule fois au montage du composant
    if (!seanceId || isMarking) return;
    
    const enregistrerSeance = async () => {
      if (isMarking) return;
    
      setIsMarking(true);
      setError(null);
      
      try {
        const sessionData = {
          duree_totale: tempsFinal, // Utiliser tempsFinal ici
          calories_brulees: Math.round(tempsFinal * 0.1),
          niveau_effort: null,
          satisfaction: null,
          notes: `Séance terminée en ${minutesFinales}min ${secondesFinales}s`
        };

        const result = await onMarquerComplete(seanceId, sessionData);
        
        // Extraire l'ID de session du résultat
        if (result && result.session) {
          setSessionId(result.session.id);
        }
        
        setIsMarked(true);
        
        // Afficher le formulaire de commentaire après un délai
        setTimeout(() => setShowCommentForm(true), 1000);
      } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement:', error);
        setError('Erreur lors de l\'enregistrement de la séance.');
      } finally {
        setIsMarking(false);
      }
    };

    const timer = setTimeout(enregistrerSeance, 100);
    return () => clearTimeout(timer);
  }, []); // Dépendances vides = exécution unique au montage

  const handleSubmitComment = async () => {
    if (!comment.trim() && difficulty === null) return;
    
    setIsMarking(true);
    setError(null);
    
    try {
      // Convertir la difficulté en niveau d'effort (1-10)
      let niveauEffort = null;
      if (difficulty) {
        switch(difficulty) {
          case 'trop_facile': niveauEffort = 1; break;
          case 'facile': niveauEffort = 3; break;
          case 'parfait': niveauEffort = 5; break;
          case 'difficile': niveauEffort = 7; break;
          case 'trop_difficile': niveauEffort = 10; break;
          default: niveauEffort = null;
        }
      }

      const notes = comment.trim() || null;
      
      // Mettre à jour la session existante ou créer une nouvelle session
      if (sessionId) {
        await onMarquerComplete(sessionId, {
          niveau_effort: niveauEffort,
          notes: notes
        }, true); // true pour indiquer que c'est un update
      } else {
        // Si pas de sessionId, créer une nouvelle session avec les commentaires
        const sessionData = {
          duree_totale: tempsFinal, // Utiliser tempsFinal ici
          calories_brulees: Math.round(tempsFinal * 0.1),
          niveau_effort: niveauEffort,
          notes: notes
        };
        await onMarquerComplete(seanceId, sessionData);
      }
      
      setShowCommentForm(false);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du commentaire:', error);
      setError('Erreur lors de l\'envoi du commentaire.');
    } finally {
      setIsMarking(false);
    }
  };

  const getDifficultyText = (diff) => {
    switch(diff) {
      case 'trop_facile': return 'Trop facile';
      case 'facile': return 'Facile';
      case 'parfait': return 'Niveau parfait';
      case 'difficile': return 'Difficile';
      case 'trop_difficile': return 'Trop difficile';
      default: return '';
    }
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] w-full flex items-center justify-center ${backgroundMainColor}`}>
      <div className={"max-w-xl w-full " + blockStyle + " text-center"}>
        <h1 className="text-3xl font-bold text-green-300">👏 Séance terminée !</h1>
        <p className="text-lg text-green-100">
          {programmeId ? "Bravo pour ton engagement dans ton programme !" : "Bravo pour ton engagement !"}
        </p>
        
        <div className="flex items-center justify-center gap-4 my-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{minutesFinales}min {secondesFinales}s</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>~{Math.round(tempsFinal * 0.1)} cal</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-500 rounded-lg">
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        )}

        <div className="mb-4 p-3 bg-gray-600/20 border border-gray-500 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4" />
            <span>Séance terminée avec succès !</span>
          </div>
        </div>

        {/* Formulaire de commentaire */}
        {showCommentForm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600 fade-in-up">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              Partagez votre expérience
            </h3>
            
            <p className="text-sm text-left text-gray-400 mb-4">
              Vos retours nous aident à améliorer les séances et à mieux vous accompagner dans votre progression.
            </p>
            
            {/* Niveau de difficulté */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Comment avez-vous trouvé cette séance ?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { value: 'trop_facile', label: 'Trop facile', icon: '😴', color: 'bg-green-600' },
                  { value: 'facile', label: 'Facile', icon: '😊', color: 'bg-blue-600' },
                  { value: 'parfait', label: 'Parfait', icon: '😎', color: 'bg-purple-600' },
                  { value: 'difficile', label: 'Difficile', icon: '😰', color: 'bg-orange-600' },
                  { value: 'trop_difficile', label: 'Trop difficile', icon: '😵', color: 'bg-red-600' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDifficulty(option.value)}
                    className={`p-2 rounded-lg text-xs transition-all transform hover:scale-105 difficulty-button ${
                      difficulty === option.value
                        ? `${option.color} text-white border-2 border-white shadow-lg`
                        : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div>{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Commentaire libre */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Commentaire libre (optionnel mais très utile !)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Décrivez votre expérience, vos ressentis, ce qui vous a plu ou déplu, vos suggestions d'amélioration, les exercices que vous avez trouvés difficiles ou faciles..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows="4"
              />
              <div className="text-xs text-gray-400 mt-1">
                💡 Plus votre commentaire est détaillé, plus nous pouvons vous aider à progresser !
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmitComment}
                disabled={isMarking}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white font-medium transition-all transform hover:scale-105"
              >
                {isMarking ? 'Enregistrement...' : 'Envoyer le commentaire'}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={resetToAccueil}
          className="px-6 py-2 bg-green-700 hover:bg-green-600 rounded-xl shadow"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
