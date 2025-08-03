import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MoteurExecution from '../screens/MoteurExecution';
import SeanceService from '../services/seanceService';
import programmeService from "../services/programmeService";
import { genererEtapesDepuisStructure } from "../utils/genererEtapes";
import { useSafeBlocker } from '../utils/useBlocker';
import NavigationPromptDialog from '../components/ui/NavigationPromptDialog';

export default function SeanceExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [etapes, setEtapes] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [programmeId, setProgrammeId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionEnCours, setSessionEnCours] = useState(null);
  const [isResuming, setIsResuming] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const seance = await SeanceService.getSeanceById(id);
        if (seance && isMounted) {
          setCurrentSession(seance);
          
          // Récupérer les exercices de la séance
          const exercices = await SeanceService.getExercicesSeance(id);
          
          // Générer les étapes avec les exercices récupérés
          const etapesGenerees = genererEtapesDepuisStructure(seance.structure, exercices);
          setEtapes(etapesGenerees);
          
          // Vérifier si l'utilisateur suit un programme actif
          let programmeActuel = null;
          try {
            programmeActuel = await programmeService.getProgrammeActuel();
            if (programmeActuel && programmeActuel.programme_id) {
              setProgrammeId(programmeActuel.programme_id);
            }
          } catch (error) {
            console.log('Aucun programme actif ou erreur:', error);
          }

          // Vérifier s'il y a une session en cours pour cette séance
          try {
            const sessionEnCours = await SeanceService.getSessionEnCours(id);
            if (sessionEnCours && isMounted) {
              console.log('📋 Session en cours trouvée:', sessionEnCours);
              setSessionEnCours(sessionEnCours);
              setSessionId(sessionEnCours.id);
              setIsResuming(true);
            } else {
              // Démarrer automatiquement une nouvelle session si aucune n'est en cours
              console.log('🚀 Aucune session en cours, démarrage automatique...');
              const nouvelleSession = await SeanceService.demarrerSession(id, programmeActuel?.programme_id, null, seance.nom);
              setSessionId(nouvelleSession.id);
              console.log('✅ Nouvelle session démarrée automatiquement:', nouvelleSession.id);
            }
          } catch (error) {
            console.log('Erreur lors de la vérification des sessions en cours:', error);
            // En cas d'erreur, essayer de démarrer une nouvelle session
            try {
              const nouvelleSession = await SeanceService.demarrerSession(id, programmeActuel?.programme_id, null, seance.nom);
              setSessionId(nouvelleSession.id);
              console.log('✅ Nouvelle session démarrée après erreur:', nouvelleSession.id);
            } catch (startError) {
              console.error('❌ Impossible de démarrer une session:', startError);
            }
          }
          
          setStarted(true);
          setLoading(false);
        } else if (isMounted) {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la séance:', error);
        if (isMounted) {
          navigate('/');
        }
      }
    })();
    return () => { isMounted = false; };
  }, [id, navigate]);

  // Activer sessionActive quand la session démarre
  useEffect(() => {
    if (sessionId && sessionEnCours) {
      setSessionActive(true);
      console.log('🔒 Session active - blocage de navigation activé');
    }
  }, [sessionId, sessionEnCours]);

  // Blocage beforeunload pour empêcher la fermeture du navigateur
  useEffect(() => {
    if (!sessionActive) return;
    
    const handleBeforeUnload = (event) => {
      // Arrêter la synthèse vocale avant de quitter
      if (window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.paused)) {
        console.log('🔇 Arrêt forcé de la synthèse vocale (beforeunload)');
        window.speechSynthesis.cancel();
        // Double arrêt pour être sûr
        setTimeout(() => {
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
        }, 100);
      }
      
      event.preventDefault();
      event.returnValue = '';
      return '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionActive]);

  // Blocage de navigation si une session est en cours
  const blocker = useSafeBlocker(
    ({ currentLocation, nextLocation }) => {
      // Bloquer seulement si on a une session active et qu'on essaie de quitter
      if (!sessionActive) return false;
      
      // Permettre la navigation vers la page d'accueil
      if (nextLocation.pathname === '/') return false;
      
      // Bloquer toutes les autres navigations
      return true;
    }
  );

  // Gérer la navigation bloquée
  useEffect(() => {
    if (blocker && blocker.state === "blocked") {
      setPendingLocation(blocker.location);
      setShowNavigationDialog(true);
    }
  }, [blocker]);

  const handleConfirmNavigation = () => {
    console.log('🔍 handleConfirmNavigation');
    // Arrêter la synthèse vocale avant de quitter
    
    if (window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.paused)) {
      console.log('🔇 Arrêt forcé de la synthèse vocale avant de quitter');
      window.speechSynthesis.cancel();
      // Double arrêt pour être sûr
      setTimeout(() => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      }, 100);
    }
    
    if (blocker && blocker.state === "blocked") {
      blocker.proceed();
    }
    setSessionActive(false);
    setShowNavigationDialog(false);
    setPendingLocation(null);
  };

  const handleCancelNavigation = () => {
    if (blocker && blocker.state === "blocked") {
      blocker.reset();
    }
    setShowNavigationDialog(false);
    setPendingLocation(null);
  };

  if (loading || !started || etapes.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-900">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mb-6"></div>
            <h2 className="text-xl font-bold text-orange-300 mb-2">Chargement de la séance...</h2>
            <p className="text-gray-400 text-sm">Merci de patienter pendant la préparation de votre séance.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleMarquerComplete = async (seanceId, sessionData, isUpdate = false) => {
    try {
      console.log('📤 Enregistrement de séance:', { seanceId, sessionData, isUpdate });
      
      let result;
      if (sessionId && !isUpdate) {
        // Terminer la session existante
        result = await SeanceService.terminerSession(sessionId, sessionData);
      } else {
        // Utiliser l'ancienne méthode pour compatibilité
        result = await SeanceService.enregistrerSeance(seanceId, sessionData, isUpdate);
      }
      
      console.log('✅ Séance enregistrée:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      throw error;
    }
  };

  const handleDemarrerSession = async () => {
    try {
      if (!sessionId) {
        console.log('🚀 Démarrage d\'une nouvelle session...');
        const session = await SeanceService.demarrerSession(id, programmeId);
        setSessionId(session.id);
        setSessionActive(true);
        console.log('✅ Nouvelle session démarrée:', session.id);
      }
    } catch (error) {
      console.error('❌ Erreur lors du démarrage de session:', error);
    }
  };

  const handleMettreAJourProgression = async (etapeActuelle, tempsEcoule) => {
    if (!sessionId) {
      console.log('❌ Pas de sessionId pour mettre à jour la progression');
      return;
    }
    
    try {
      console.log('📊 Mise à jour progression:', { etapeActuelle, tempsEcoule, sessionId });
      
      const progression = {
        etape_actuelle: etapeActuelle,
        nombre_total_etapes: etapes.length,
        temps_ecoule: tempsEcoule,
      };

      console.log('📋 Progression à envoyer:', progression);
      await SeanceService.mettreAJourProgression(sessionId, progression);
      console.log('✅ Progression mise à jour avec succès');
      setSessionActive(true);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de progression:', error);
    }
  };

  return (
    <Layout>
      <MoteurExecution
        etapes={etapes}
        onFinish={() => setStarted(false)}
        resetToAccueil={() => navigate('/')}
        intervalRef={intervalRef}
        currentSession={currentSession}
        programmeId={programmeId}
        onMarquerComplete={handleMarquerComplete}
        sessionId={sessionId}
        sessionEnCours={sessionEnCours}
        isResuming={isResuming}
        onDemarrerSession={handleDemarrerSession}
        onMettreAJourProgression={handleMettreAJourProgression}
      />
      <NavigationPromptDialog
        open={showNavigationDialog}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
        title="Séance en cours"
        message="Vous avez une séance en cours.<br/>Voulez-vous vraiment quitter ?<br/> Votre progression sera sauvegardée."
      />
    </Layout>
  );
} 