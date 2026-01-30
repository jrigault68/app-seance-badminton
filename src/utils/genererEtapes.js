import { getMessagesFromKey } from './vocal.jsx';

/**
 * Générateur d'étapes pour séance de badminton
 * 
 * Cette fonction transforme une structure de séance (blocs et exercices) 
 * en une liste d'étapes détaillées avec vocaux et transitions.
 * 
 * @param {Array} structure - Structure de la séance (blocs et exercices)
 * @param {Array} exercices - Liste des exercices disponibles
 * @param {boolean} isBloc - Si on est dans un bloc
 * @param {number} blocIndex - Index du bloc actuel
 * @param {number} blocRepsIndex - Index de la répétition du bloc
 * @param {number} totalBlocReps - Nombre total de répétitions du bloc
 * @param {Object} nextBlocStep - Prochaine étape après le bloc
 * @param {Object} erreursUtiliseesParExo - Erreurs déjà utilisées par exercice
 * @returns {Array} Liste des étapes générées
 */
export function genererEtapesDepuisStructure(
  structure,
  exercices = [],
  stepIndex = 0,
  stepInBlocIndex = 0, // index de l'étape dans le bloc
  isBlocWithIntro = false,
  blocIndex = 0, // index du bloc actuel
  blocRepsIndex = 0, // index de la répétition du bloc actuel
  totalBlocReps = 0, // nombre total de répétitions du bloc
  nextBlocStep = null,
  infosDejaDiffusees = {}
) {
  const etapes = [];

  // ===== VALIDATION DES DONNÉES =====
  if (!exercices || !Array.isArray(exercices)) {
    console.warn('Exercices is not a valid array:', exercices);
    exercices = [];
  }
  
  if (!structure || !Array.isArray(structure)) {
    console.warn('Structure is not a valid array:', structure);
    return etapes;
  }

  // uniquement pour le premier appel de la fonction
  if (stepIndex === 0 && blocIndex === 0) {
    console.log("Load des infos exercices")
    // ===== PRÉPARATION DES EXERCICES ENRICHIS =====
    // Créer un dictionnaire des exercices de base pour accès rapide
    const exoDict = Object.fromEntries(exercices.map((e) => [e.id, e]));
    
    // Préparer tous les exercices avec leurs données complètes
    const exercicesEnrichis = preparerTousLesExercices(structure, exoDict);
    exercices = Object.values(exercicesEnrichis); // Convertir l'objet en array
  }

  // ===== TRAITEMENT DE CHAQUE ÉTAPE =====
  for (const step of structure) {
    if (step.type === "bloc") {
      etapes.push(...traiterBloc(step, structure, exercices, stepIndex, stepInBlocIndex, blocIndex, nextBlocStep, infosDejaDiffusees));
      blocIndex += 1;
      stepInBlocIndex += 1;
    } else {
      etapes.push(...traiterExercice(step, structure, exercices, stepIndex, stepInBlocIndex, isBlocWithIntro, blocIndex, blocRepsIndex, totalBlocReps, nextBlocStep, infosDejaDiffusees));
      stepInBlocIndex += 1;
    }
    stepIndex += 1;
  }
  
  return etapes;
}

/**
 * Prépare tous les exercices de la structure avec leurs données complètes
 */
function preparerTousLesExercices(structure, exoDict) {
  const exercicesEnrichis = {};
  let inlineCounter = 0;

  function preparerExerciceRecursif(step) {
    if (step.type === "bloc") {
      // Pour un bloc, traiter récursivement son contenu
      const contenu = step.contenu || [];
      contenu.forEach((item) => {
        preparerExerciceRecursif(item);
      });
    } else if (step.type === "exercice") {
      // Pour un exercice, l'enrichir avec toutes ses données
      const exoId = step.id;
      const exoData = exoDict[exoId] || {};
      const isInline = exoId == null || exoId === '';

      const hasPersonnalisations = !isInline && (
        (step.nom !== undefined && step.nom !== exoData.nom) ||
        step.description !== undefined ||
        step.position_depart !== undefined ||
        step.focus_zone !== undefined ||
        step.erreurs !== undefined ||
        step.conseils !== undefined
      );

      let exerciceId = isInline
        ? (step._uid || `inline-${++inlineCounter}`)
        : (hasPersonnalisations ? step._uid : exoId);
      if (isInline && !step._uid) step._uid = exerciceId;
      // Enrichir l'exercice avec toutes ses données (personnalisées + par défaut)
      const exerciceEnrichi = {
        ...exoData,           // Données de base de l'exercice
        ...step,              // Personnalisations de la structure
        // Garder l'ID original pour la compatibilité
        id: exoId,
        // Utiliser l'identifiant approprié (UID si personnalisé, ID sinon)
        exerciceId: exerciceId,
        // Priorité aux champs personnalisés, puis valeurs de la base
        nom: step.nom !== undefined ? step.nom : (exoData.nom || "Exercice"),
        
        // IMPORTANT: Toujours inclure description et position_depart même si vides
        // pour que les messages d'intro puissent les traiter
        description: step.description !== undefined 
          ? step.description 
          : (exoData.description || ""),
        position_depart: step.position_depart !== undefined 
          ? step.position_depart 
          : (exoData.position_depart || ""),
        
        // Listes avec gestion des valeurs vides
        focus_zone: step.focus_zone !== undefined
          ? step.focus_zone
          : (exoData.focus_zone || []),
        erreurs: step.erreurs !== undefined
          ? step.erreurs
          : (exoData.erreurs || []),
        conseils: step.conseils !== undefined
          ? step.conseils
          : (exoData.conseils || []),
        
        // Propriétés de configuration (priorité aux personnalisations)
        //series: step.series !== undefined ? step.series : (exoData.series || 1),
        //repetitions: step.repetitions !== undefined ? step.repetitions : (exoData.repetitions || 0),
        //temps_series: step.temps_series !== undefined ? step.temps_series : (exoData.temps_series || 0),
        //temps_par_repetition: step.temps_par_repetition !== undefined ? step.temps_par_repetition : (exoData.temps_par_repetition || 3),
        //temps_repos_series: step.temps_repos_series !== undefined ? step.temps_repos_series : (exoData.temps_repos_series || 0),
        //temps_repos_exercice: step.temps_repos_exercice !== undefined ? step.temps_repos_exercice : (exoData.temps_repos_exercice || 0),
        
        // Type d'exercice
        //exerciceType: step.exerciceType || exoData.exerciceType || "repetitions",
        
        // Changement de côté
        //changement_cote: step.changement_cote !== undefined ? step.changement_cote : (exoData.changement_cote || false),
      };
      //console.log("exerciceEnrichi :", exerciceEnrichi)
      // Stocker l'exercice enrichi avec son identifiant approprié
      exercicesEnrichis[exerciceId] = exerciceEnrichi;
    }
  }
  
  // Parcourir toute la structure pour préparer tous les exercices
  structure.forEach((step) => {
    preparerExerciceRecursif(step);
  });
  
  return exercicesEnrichis;
}

/**
 * Traite un bloc d'exercices
 */
function traiterBloc(step, structure, exercicesEnrichis, stepIndex, stepInBlocIndex, blocIndex, nextBlocStep, infosDejaDiffusees) {
  const etapes = [];
  const totalBlocReps = step.nbTours || 1;
  const blocRepos = step.temps_repos_bloc || 0;
  const contenu = step.contenu || [];

  // ===== ÉTAPE D'INTRODUCTION DU BLOC =====
  if (step.intro_bloc) {
    etapes.push({
      type: "intro_bloc",
      nom: step.nom,
      description: step.description,
      exercices: contenu,
      nbTours: totalBlocReps,
    });
  }

  // ===== RÉPÉTITIONS DU BLOC =====
  for (let blocRepsIndex = 0; blocRepsIndex < totalBlocReps; blocRepsIndex++) {
    const nextStepInBloc = blocRepsIndex < totalBlocReps - 1 ? contenu[0] : structure[stepIndex + 1];
    etapes.push(
      ...genererEtapesDepuisStructure(
        contenu,
        Object.values(exercicesEnrichis), // Convertir l'objet en array
        stepIndex,
        stepInBlocIndex, // stepInBlocIndex
        step.intro_bloc,//isBlocWithIntro
        blocIndex, // blocIndex
        blocRepsIndex,
        totalBlocReps, // totalBlocReps
        nextStepInBloc,
        infosDejaDiffusees
      )
    );
  }
  
  // ===== REPOS APRÈS BLOC =====
  if (blocRepos) {
    const reposEtapes = genererReposApresEtape(
      blocRepos,
      structure[stepIndex + 1] || nextBlocStep,
      exercicesEnrichis,
      0,
      totalBlocReps,
      0, // nextStepRepsIndex
      infosDejaDiffusees,
      getNextExo(structure[stepIndex + 1] || nextBlocStep, exercicesEnrichis), // nextExo
      true // isReposBloc
    );
    etapes.push(...reposEtapes);
  }
    
  return etapes;
}

function getNextExo(nextStep, exercicesEnrichis){
    let nextExo = null;
    // Si c'est un bloc, prendre le premier exercice
    if (nextStep && nextStep.type === "bloc") {
      nextStep = nextStep.contenu[0] || [];
    }
    // Récupérer l'exercice enrichi
    // Chercher d'abord par UID, puis par ID de base
    if (nextStep) {
      if (nextStep._uid) {
        // Chercher par UID en priorité
        nextExo = exercicesEnrichis.find(e => e.exerciceId === nextStep._uid);
      }
      
      // Fallback sur l'ID de base si pas trouvé par UID
      if (!nextExo) {
        nextExo = exercicesEnrichis.find(e => e.id === nextStep.id) || {};
      }
    }
    return nextExo;
}

/**
 * Traite un exercice individuel
 */
function traiterExercice(step, structure, exercicesEnrichis, stepIndex, stepInBlocIndex, isBlocWithIntro, blocIndex, blocRepsIndex, totalBlocReps, nextBlocStep, infosDejaDiffusees) {
  const etapes = [];
  const exoId = step.id;
  
  // Récupérer l'exercice enrichi en 2 étapes : UID puis ID de base
  let exerciceEnrichi = null;
  //console.log("step ids :", step.id, step._uid)
  
  // Étape 1 : Chercher par UID si disponible (obligatoire pour exercices inline id null)
  if (step._uid) {
    exerciceEnrichi = exercicesEnrichis.find(e => e.exerciceId === step._uid);
  }
  // Étape 2 : Fallback sur l'ID de base si pas trouvé par UID (exercices de la base)
  if (!exerciceEnrichi && exoId != null) {
    exerciceEnrichi = exercicesEnrichis.find(e => e.id === exoId);
  }
  
  //console.log("exerciceEnrichi :", exerciceEnrichi)
  if (!exerciceEnrichi) {
    console.warn(`Exercice ${step._uid || exoId} non trouvé dans les exercices enrichis`);
    return etapes;
  }

  // ===== PRÉPARATION DES DONNÉES DE L'EXERCICE =====
  const stepData = {
    ...exerciceEnrichi,
    // Ajouter les informations de contexte du bloc
    blocTour: blocRepsIndex + 1,
    totalBlocTour: totalBlocReps,
  };
  const base = { id: exoId, exo: stepData };

  let nextStep = structure[stepInBlocIndex +1] || nextBlocStep;
  let nextExo = getNextExo(nextStep, exercicesEnrichis);

  // ===== ÉTAPE D'INTRODUCTION (si premier exercice) =====
  let aUneIntro = false;
  if (doitAjouterIntro(stepIndex, stepInBlocIndex, isBlocWithIntro, blocIndex, blocRepsIndex)) {
    aUneIntro = true;
    etapes.push(creerEtapeIntro(stepData, isBlocWithIntro, infosDejaDiffusees));
  }

  // ===== GÉNÉRATION DES SÉRIES =====
  const nbSeries = step.series && step.series > 0 ? step.series : 1;
  const seriesEtapes = genererSeries(step, stepData, base, nbSeries, exoId, infosDejaDiffusees, nextExo, aUneIntro);
  etapes.push(...seriesEtapes);
  
  // ===== REPOS APRÈS EXERCICE =====
  const reposApres = step.temps_repos_exercice || 0;
  if (reposApres) {
    let nextStepRepsIndex = structure[stepInBlocIndex + 1] ? blocRepsIndex : blocRepsIndex + 1;
    const reposEtapes = genererReposApresEtape(
      reposApres,
      nextStep,
      exercicesEnrichis,
      stepInBlocIndex,
      blocRepsIndex,
      totalBlocReps,
      nextStepRepsIndex,
      infosDejaDiffusees,
      nextExo,
      false // isReposBloc
    );
    etapes.push(...reposEtapes);
  }
  
  return etapes;
}

/**
 * Détermine si on doit ajouter une étape d'introduction
 */
function doitAjouterIntro(stepIndex, stepInBlocIndex, isBlocWithIntro, blocIndex, blocRepsIndex) {
  //console.log("doitAjouterIntro :", stepIndex, stepInBlocIndex, isBlocWithIntro, blocIndex, blocRepsIndex)
  return (stepIndex === 0 && blocIndex === 0 && blocRepsIndex === 0) ||
         (stepIndex > 0 && isBlocWithIntro && stepInBlocIndex === 0 && blocRepsIndex === 0);
}

/**
 * Formate les messages vocaux en évitant les répétitions
 */
function formaterMessagesVocaux(messages, stepData, exoId, infosDejaDiffusees, nextExo) {
  // Initialiser le suivi pour cet exercice si nécessaire
  if (!infosDejaDiffusees[exoId]) {
    infosDejaDiffusees[exoId] = {
      description: "",
      position_depart: "",
      nom: "",
      erreurs: new Set(),
      conseils: new Set(),
      focus_zone: new Set()
    };
  }
  const suivi = infosDejaDiffusees[exoId];
  
  // Créer un objet current temporaire avec seulement les infos non dites
  const currentTemp = {
    duree: stepData.duree,
    exo: {
      series: stepData.series,
      repetitions: stepData.repetitions,
      temps_series: stepData.temps_series,
      temps_par_repetition: stepData.temps_par_repetition,
      temps_repos_series: stepData.temps_repos_series,
      temps_repos_exercice: stepData.temps_repos_exercice,
      nom: !suivi.nom && stepData.nom ? stepData.nom : undefined,
      description: !suivi.description && stepData.description && stepData.description.trim() ? stepData.description : undefined,
      position_depart: !suivi.position_depart && stepData.position_depart && stepData.position_depart.trim() ? stepData.position_depart : undefined,
      conseils: Array.isArray(stepData.conseils) ? stepData.conseils.filter(c => !suivi.conseils?.has(c)) : [],
      focus_zone: Array.isArray(stepData.focus_zone) ? stepData.focus_zone.filter(z => !suivi.focus_zone?.has(z)) : [],
      erreurs: Array.isArray(stepData.erreurs) ? stepData.erreurs.filter(e => !suivi.erreurs?.has(e)) : []
    }
  };
  const messagesComplets = [];
  
  for (const message of messages) {
    if (!message) continue;
    if (message === "intro.start_bloc" || message === "intro.start_seance" || message === "message_retarde" || message === "repos.prochain_tour") {messagesComplets.push(message); continue;}
    const messageTraite = getMessagesFromKey(message, currentTemp, null, infosDejaDiffusees, nextExo);
    if (Array.isArray(messageTraite)) {
      messagesComplets.push(...messageTraite);
    } else if (messageTraite) {
      messagesComplets.push(messageTraite);
    }
  }
  
  return messagesComplets;
}

/**
 * Crée une étape d'introduction
 */
function creerEtapeIntro(stepData, isBlocWithIntro, infosDejaDiffusees) {
  const messagesVocaux = genererMessages({
    type: 'intro',
    exercice: stepData,
    contexte: {
      isBlocWithIntro,
    },
    infosDejaDiffusees
  });
  
  const introEtape = {
    type: "intro",
    duree: 30,
    messages: messagesVocaux,
    exo: stepData, // Garder toutes les infos pour l'affichage
  };

  return introEtape;
}

/**
 * Génère toutes les séries d'un exercice
 * @param {boolean} aUneIntro - Si true, les messages position_depart et description ne seront pas répétés au début des séries (déjà dits dans l'intro)
 */
function genererSeries(step, stepData, base, nbSeries, exoId, infosDejaDiffusees, nextExo, aUneIntro = false) {
  const etapes = [];

  // ===== GÉNÉRATION DE CHAQUE SÉRIE =====
  for (let s = 0; s < nbSeries; s++) {
    const isLastSerie = s === nbSeries - 1;
    const noReposSeries = !step.temps_repos_series || step.temps_repos_series === 0;
    const noReposExo = !step.temps_repos_exercice || step.temps_repos_exercice === 0;

    // Calculer la durée de la série
    const duree = calculerDureeSerie(step);
    
    // Gérer le changement de côté
    if (step.changement_cote) {
      etapes.push(...genererSerieAvecChangementCote(step, stepData, base, s, nbSeries, duree, isLastSerie, noReposSeries, noReposExo, exoId, infosDejaDiffusees, nextExo, aUneIntro));
    } else {
      etapes.push(genererSerieNormale(step, stepData, base, s, nbSeries, duree, isLastSerie, noReposSeries, noReposExo, exoId, infosDejaDiffusees, nextExo, aUneIntro));
    }

    // Ajouter repos entre séries (sauf dernière série)
    if (s < nbSeries - 1 && !noReposSeries) {
      etapes.push(genererReposEntreSeries(step, base, s, nbSeries, infosDejaDiffusees));
    }
  }
  return etapes;
}

/**
 * Calcule la durée d'une série
 */
function calculerDureeSerie(step) {
  const isSerieReps = step.repetitions && step.series;
  const isSerieTemps = step.series && step.temps_series;
  
  return isSerieReps
    ? step.repetitions * (step.temps_par_repetition || 3)
    : step.temps_series;
}

/**
 * Génère une série avec changement de côté
 */
function genererSerieAvecChangementCote(step, stepData, base, serieIndex, nbSeries, duree, isLastSerie, noReposSeries, noReposExo, exoId, infosDejaDiffusees, nextExo, aUneIntro = false) {
  const etapes = [];
  const dureePremierePartie = Math.floor(duree / 2);
  const dureeDeuxiemePartie = duree - dureePremierePartie;
  
  const messagesComplets = genererMessages({
    type: 'debut',
    exercice: stepData,
    contexte: {
      serie: serieIndex + 1,
      totalSeries: nbSeries,
      isLastSerie,
      isFirstSerie: serieIndex === 0,
      hasReposSeries: !noReposSeries,
      hasReposExercise: !noReposExo,
      partie: 1,
      totalParties: 2
    },
    infosDejaDiffusees,
    aUneIntro
  });

  // Première partie
  etapes.push({
    ...base,
    type: "exercice",
    serie: serieIndex + 1,
    total_series: nbSeries,
    duree: dureePremierePartie,
    messages: messagesComplets,
    partie: 1,
  });

  // Transition changement de côté
  etapes.push({
    type: "changement_cote",
    duree: 5,
    messages: ["repos.changement_cote"],
    exo: stepData,
  });

  const messagesDeuxiemePartie = genererMessages({
    type: 'milieu',
    exercice: stepData,
    contexte: {
      serie: serieIndex + 1,
      totalSeries: nbSeries,
      isLastSerie,
      partie: 2,
      totalParties: 2
    },
    infosDejaDiffusees
  });

  const messagesFinComplets = genererMessages({
    type: 'fin',
    exercice: stepData,
    nextExercice: nextExo,
    contexte: {
      serie: serieIndex + 1,
      totalSeries: nbSeries,
      isLastSerie,
      hasReposSeries: !noReposSeries,
      hasReposExercise: !noReposExo,
      partie: 2,
      totalParties: 2
    },
    infosDejaDiffusees
  });
  
  etapes.push({
    ...base,
    type: "exercice",
    serie: serieIndex + 1,
    total_series: nbSeries,
    duree: dureeDeuxiemePartie,
    messages: messagesDeuxiemePartie,
    messages_fin: messagesFinComplets,
    partie: 2,
  });

  return etapes;
}

/**
 * Génère une série normale (sans changement de côté)
 */
function genererSerieNormale(step, stepData, base, serieIndex, nbSeries, duree, isLastSerie, noReposSeries, noReposExo, exoId, infosDejaDiffusees, nextExo, aUneIntro = false) {
  const messagesComplets = genererMessages({
    type: 'debut',
    exercice: stepData,
    contexte: {
      serie: serieIndex + 1,
      totalSeries: nbSeries,
      isLastSerie,
      isFirstSerie: serieIndex === 0,
      hasReposSeries: !noReposSeries,
      hasReposExercise: !noReposExo
    },
    infosDejaDiffusees,
    aUneIntro
  });
  
  const messagesFinComplets = genererMessages({
    type: 'fin',
    exercice: stepData,
    nextExercice: nextExo,
    contexte: {
      serie: serieIndex + 1,
      totalSeries: nbSeries,
      isLastSerie,
      hasReposSeries: !noReposSeries,
      hasReposExercise: !noReposExo
    },
    infosDejaDiffusees
  });
  
  return {
    ...base,
    type: "exercice",
    serie: serieIndex + 1,
    total_series: nbSeries,
    duree,
    messages: messagesComplets,
    messages_fin: messagesFinComplets,
  };
}

/**
 * Génère un repos entre séries
 */
function genererReposEntreSeries(step, base, serieIndex, nbSeries, infosDejaDiffusees) {
  const stepData = base.exo;
  const messagesComplets = genererMessages({
    type: 'repos_series',
    exercice: stepData,
    contexte: {
      serie: serieIndex,
      totalSeries: nbSeries
    },
    infosDejaDiffusees
  });
  
  return {
    ...base,
    type: "repos",
    duree: step.temps_repos_series || 0,
    messages: messagesComplets,
  };
}

/**
 * Génère un repos après une étape (exercice ou bloc)
 */
function genererReposApresEtape(duree, nextStep, exercicesEnrichis, stepInBlocIndex, blocRepsIndex, totalBlocReps, nextStepRepsIndex, infosDejaDiffusees, nextExo, isReposBloc = false) {
  const etapes = [];  
  
  // Vérifier si le prochain élément est un bloc avec lancement manuel
  const isNextBlocWithManualLaunch = nextStep && nextStep.type === "bloc" && nextStep.intro_bloc;
  
  // Ne pas ajouter de repos si le prochain élément est un bloc avec lancement manuel
  if (!isNextBlocWithManualLaunch) {
    
    if (nextExo) {
      const nextExoData = {
        ...nextExo,
        ...nextStep,
        nom: nextExo.nom || nextStep.nom || "Exercice suivant",
        description: nextExo.description || nextStep.description || "",
        position_depart: nextExo.position_depart || nextStep.position_depart || "",
      };
      
             const messagesComplets = genererMessages({
         type: isReposBloc ? 'repos_bloc' : 'repos_exercice',
         exercice: nextExoData,
         contexte: {
           blocTour: blocRepsIndex + 1,
           totalBlocTour: totalBlocReps,
           isLastTour: blocRepsIndex + 1 === totalBlocReps,
           isFirstExerciseOfTour: stepInBlocIndex === 0
         },
         infosDejaDiffusees
       });
      
      etapes.push({
        type: "repos",
        duree,
        messages: messagesComplets,
        blocTour: nextStepRepsIndex + 1,
        totalBlocTour: totalBlocReps,
        exo: nextExoData, // Garder toutes les infos pour l'affichage
      });
    } else if (nextStep) {
      etapes.push({
        type: "repos",
        duree,
        messages: ["repos.annonce_suivant"],
      });
    }
  }
  
  return etapes;
} 

/**
 * Fonction unifiée pour générer les messages vocaux selon le contexte
 * 
 * @param {Object} options - Options de configuration
 * @param {string} options.type - Type de message ('debut', 'milieu', 'fin')
 * @param {Object} options.exercice - Données de l'exercice actuel
 * @param {Object} options.nextExercice - Données de l'exercice suivant (optionnel)
 * @param {Object} options.contexte - Contexte de l'exercice (série, bloc, etc.)
 * @param {Object} options.infosDejaDiffusees - Infos déjà diffusées
 * @param {boolean} options.aUneIntro - Si true (exercice avec intro), ne pas ajouter position_depart/description au type 'debut'
 * @returns {Array} Liste des messages à prononcer
 */
function genererMessages(options) {
  const {type, exercice, nextExercice = null, contexte = {}, infosDejaDiffusees = {}, aUneIntro = false} = options;

  const {
    serie = 1,
    totalSeries = 1,
    isLastSerie = false,
    isFirstSerie = false,
    blocTour = 1,
    totalBlocTour = 1,
    isLastBlocTour = false,
    isFirstExerciseOfTour = false,
    isBlocWithIntro = false,
    isFirstExercise = false,
    isLastExercise = false,
    hasReposSeries = true,
    hasReposExercise = true,
    partie = 1, // pour changement de côté
    totalParties = 1
  } = contexte;

  const messages = [];


  switch (type) {
    case 'intro':
      messages.push(isBlocWithIntro ? 'intro.start_bloc' : 'intro.start_seance');
      messages.push('intro.annonce_premier_exercice');
      messages.push('exercice.position_depart');
      messages.push('exercice.description');
      break;
    case 'debut':
      // Messages de début d'exercice
      if (isFirstExercise && !isBlocWithIntro) {
        messages.push('intro.start_seance');
        messages.push('intro.annonce_premier_exercice');
      } else if (isFirstExercise && isBlocWithIntro) {
        messages.push('intro.start_bloc');
        messages.push('intro.annonce_premier_exercice');
      }

      // Messages spécifiques à l'exercice (position_depart, description) — ne pas répéter si déjà dits dans l'intro
      if ((isFirstSerie || totalSeries === 1) && !aUneIntro) {
        messages.push('exercice.position_depart');
        messages.push('exercice.description');
      }

      // Messages de début de série
      if (totalSeries > 1) {
        if (isFirstSerie) {
          messages.push('exercice.start_serie');
        } else if (isLastSerie) {
          messages.push('exercice.start_last_serie');
        } else {
          messages.push('exercice.start');
        }
      } else {
        messages.push('exercice.start');
      }

      // Messages spécifiques au changement de côté
      if (totalParties > 1 && partie === 1) {
        messages.push('exercice.premier_cote');
      }

      // Messages d'erreurs pour exercices longs
      if (exercice.duree > 30) {
        messages.push('exercice.erreur');
      }

      break;

    case 'milieu':
      // Messages de motivation pendant l'exercice
      messages.push('motivations.milieu');
      break;

    case 'fin':
      // Messages de fin selon le contexte
      if (totalParties > 1 && partie < totalParties) {
        // Changement de côté
        messages.push('repos.changement_cote');
      } else if (!isLastSerie && !hasReposSeries) {
        // Enchaînement direct vers série suivante
        messages.push('exercice.enchainement_serie');
      } else if (isLastSerie && !hasReposExercise && nextExercice) {
        // Enchaînement direct vers exercice suivant
        messages.push('exercice.enchainement_suivant');
      }
      break;

    case 'repos_series':
      // Messages de repos entre séries
      if (totalSeries - serie === 2) {
        messages.push('repos.avant_derniere_serie');
      } else if (totalSeries - serie === 1) {
        messages.push('repos.derniere_serie');
      } else {
        messages.push('repos.serie_suivante');
      }
      break;
    case 'repos_exercice':
      // Messages de repos après exercice
      if (isFirstExerciseOfTour) {
        if (isLastBlocTour) {
          messages.push('repos.dernier_tour');
        } else if (blocTour < totalBlocTour) {
          messages.push('repos.prochain_tour');
        }
      }

      if (nextExercice) {
        messages.push('repos.annonce_suivant');
        // Annoncer position et description seulement si premier tour
        if (blocTour === 1) {
          messages.push('exercice.position_depart');
          messages.push('exercice.description');
        }
      }
      break;

    case 'repos_bloc':
      // Messages de repos après bloc complet
      messages.push('repos.apres_bloc');
      if (nextExercice) {
        messages.push('repos.annonce_suivant');
        messages.push('exercice.position_depart');
        messages.push('exercice.description');
      }
      break;

    case 'fin_seance':
      // Messages de fin de séance
      if (isLastExercise) {
        messages.push('seance.dernier_exo');
      }
      messages.push('seance.fin');
      messages.push('seance.resume');
      break;
  }

  // Filtrer les messages vides et formater
  const messagesFiltres = messages.filter(msg => msg && msg.trim());
  return formaterMessagesVocaux(messagesFiltres, exercice, exercice.id, infosDejaDiffusees, nextExercice);
} 
