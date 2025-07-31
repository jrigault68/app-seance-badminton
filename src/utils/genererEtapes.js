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
    exercices = Object.values(exercicesEnrichis);
  }

  // ===== TRAITEMENT DE CHAQUE ÉTAPE =====
  for (const step of structure) {
    if (step.type === "bloc") {
      etapes.push(...traiterBloc(step, structure, exercices, stepIndex, blocIndex, nextBlocStep, infosDejaDiffusees));
      blocIndex += 1;
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
  
  function preparerExerciceRecursif(step, path = []) {
    if (step.type === "bloc") {
      // Pour un bloc, traiter récursivement son contenu
      const contenu = step.contenu || [];
      contenu.forEach((item, index) => {
        preparerExerciceRecursif(item, [...path, index]);
      });
    } else if (step.type === "exercice") {
      // Pour un exercice, l'enrichir avec toutes ses données
      const exoId = step.id;
      const exoData = exoDict[exoId] || {};
      
      // Enrichir l'exercice avec toutes ses données (personnalisées + par défaut)
      const exerciceEnrichi = {
        ...exoData,           // Données de base de l'exercice
        ...step,              // Personnalisations de la structure
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
        series: step.series !== undefined ? step.series : (exoData.series || 1),
        repetitions: step.repetitions !== undefined ? step.repetitions : (exoData.repetitions || 0),
        temps_series: step.temps_series !== undefined ? step.temps_series : (exoData.temps_series || 0),
        temps_par_repetition: step.temps_par_repetition !== undefined ? step.temps_par_repetition : (exoData.temps_par_repetition || 3),
        temps_repos_series: step.temps_repos_series !== undefined ? step.temps_repos_series : (exoData.temps_repos_series || 0),
        temps_repos_exercice: step.temps_repos_exercice !== undefined ? step.temps_repos_exercice : (exoData.temps_repos_exercice || 0),
        
        // Type d'exercice
        exerciceType: step.exerciceType || exoData.exerciceType || "repetitions",
        
        // Changement de côté
        changement_cote: step.changement_cote !== undefined ? step.changement_cote : (exoData.changement_cote || false),
      };
      
      // Stocker l'exercice enrichi avec son ID comme clé
      exercicesEnrichis[exoId] = exerciceEnrichi;
    }
  }
  
  // Parcourir toute la structure pour préparer tous les exercices
  structure.forEach((step, index) => {
    preparerExerciceRecursif(step, [index]);
  });
  
  return exercicesEnrichis;
}

/**
 * Traite un bloc d'exercices
 */
function traiterBloc(step, structure, exercicesEnrichis, stepIndex, blocIndex, nextBlocStep, infosDejaDiffusees) {
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
      tempsReposBloc: blocRepos,
    });
  }

  // ===== RÉPÉTITIONS DU BLOC =====
  for (let blocRepsIndex = 0; blocRepsIndex < totalBlocReps; blocRepsIndex++) {
    const nextStepInBloc = blocRepsIndex < totalBlocReps - 1 ? contenu[0] : structure[stepIndex + 1];
    etapes.push(
      ...genererEtapesDepuisStructure(
        contenu,
        Object.values(exercicesEnrichis), // Convertir le dictionnaire en tableau
        stepIndex,
        0, // stepInBlocIndex
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
  const reposApresBloc = step.temps_repos_exercice || 0;
  if (reposApresBloc) {
    const reposEtapes = genererReposApresEtape(
      reposApresBloc,
      structure[stepIndex + 1] || nextBlocStep,
      exercicesEnrichis,
      blocRepsIndex,
      999,
      infosDejaDiffusees
    );
    etapes.push(...reposEtapes);
  }
  
  return etapes;
}

/**
 * Traite un exercice individuel
 */
function traiterExercice(step, structure, exercicesEnrichis, stepIndex, stepInBlocIndex, isBlocWithIntro, blocIndex, blocRepsIndex, totalBlocReps, nextBlocStep, infosDejaDiffusees) {
  const etapes = [];
  const exoId = step.id;
  
  // Récupérer l'exercice enrichi (déjà préparé avec toutes ses données)
  const exerciceEnrichi = exercicesEnrichis.find(e => e.id === exoId);
  if (!exerciceEnrichi) {
    console.warn(`Exercice ${exoId} non trouvé dans les exercices enrichis`);
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

  // ===== ÉTAPE D'INTRODUCTION (si premier exercice) =====
  if (doitAjouterIntro(stepIndex, stepInBlocIndex, isBlocWithIntro, blocIndex, blocRepsIndex)) {
    etapes.push(creerEtapeIntro(stepData, isBlocWithIntro, exoId, infosDejaDiffusees));
  }

  // ===== GÉNÉRATION DES SÉRIES =====
  const nbSeries = step.series && step.series > 0 ? step.series : 1;
  const seriesEtapes = genererSeries(step, stepData, base, nbSeries, exoId, infosDejaDiffusees);
  etapes.push(...seriesEtapes);
  
  // ===== REPOS APRÈS EXERCICE =====
  const reposApres = step.temps_repos_exercice || 0;
  if (reposApres) {
    let nextStepRepsIndex = structure[stepInBlocIndex + 1] ? blocRepsIndex : blocRepsIndex + 1;
    const reposEtapes = genererReposApresEtape(
      reposApres,
      structure[stepInBlocIndex +1] || nextBlocStep,
      exercicesEnrichis,
      blocRepsIndex,
      totalBlocReps,
      nextStepRepsIndex,
      infosDejaDiffusees
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
function formaterMessagesVocaux(messages, stepData, exoId, infosDejaDiffusees) {
  
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
    const messageTraite = getMessagesFromKey(message, currentTemp, infosDejaDiffusees);
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
function creerEtapeIntro(stepData, isBlocWithIntro, exoId, infosDejaDiffusees) {
  const messages = [];
  messages.push(isBlocWithIntro ? "intro.start_bloc" : "intro.start_seance");
  messages.push("intro.annonce_premier_exercice");
  messages.push("exercice.position_depart");
  messages.push("exercice.description");
//console.log("intro :", stepData)

  const messagesVocaux = formaterMessagesVocaux(messages, stepData, exoId, infosDejaDiffusees);
  
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
 */
function genererSeries(step, stepData, base, nbSeries, exoId, infosDejaDiffusees) {
  const etapes = [];

  // ===== GÉNÉRATION DE CHAQUE SÉRIE =====
  for (let s = 0; s < nbSeries; s++) {
    const isLastSerie = s === nbSeries - 1;
    const noRepos = !step.temps_repos_series || step.temps_repos_series === 0;

    // Calculer la durée de la série
    const duree = calculerDureeSerie(step);
    
    // Gérer le changement de côté
    if (step.changement_cote) {
      etapes.push(...genererSerieAvecChangementCote(step, stepData, base, s, nbSeries, duree, isLastSerie, noRepos, exoId, infosDejaDiffusees));
    } else {
      etapes.push(genererSerieNormale(step, stepData, base, s, nbSeries, duree, isLastSerie, noRepos, exoId, infosDejaDiffusees));
    }

    // Ajouter repos entre séries (sauf dernière série)
    if (s < nbSeries - 1 && !noRepos) {
      etapes.push(genererReposEntreSeries(step, base, s, nbSeries));
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
function genererSerieAvecChangementCote(step, stepData, base, serieIndex, nbSeries, duree, isLastSerie, noRepos, exoId, infosDejaDiffusees) {
  const etapes = [];
  const dureePremierePartie = Math.floor(duree / 2);
  const dureeDeuxiemePartie = duree - dureePremierePartie;
  
  const messages = [
    nbSeries > 1
      ? (serieIndex === 0
          ? "exercice.start_serie"
          : (isLastSerie ? "exercice.start_last_serie" : "exercice.start"))
      : "exercice.start",
    "exercice.premier_cote",
    "message_retarde",
  ];
  const messagesComplets = formaterMessagesVocaux(messages, stepData, exoId, infosDejaDiffusees);

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

  const messagesErreur = formaterMessagesVocaux(["exercice.erreur"], stepData, exoId, infosDejaDiffusees);
  
  etapes.push({
    ...base,
    type: "exercice",
    serie: serieIndex + 1,
    total_series: nbSeries,
    duree: dureeDeuxiemePartie,
    messages: messagesErreur,
    partie: 2,
  });

  return etapes;
}

/**
 * Génère une série normale (sans changement de côté)
 */
function genererSerieNormale(step, stepData, base, serieIndex, nbSeries, duree, isLastSerie, noRepos, exoId, infosDejaDiffusees) {
  const messages = [
    nbSeries > 1
      ? (serieIndex === 0
          ? "exercice.start_serie"
          : (isLastSerie ? "exercice.start_last_serie" : "exercice.start"))
      : "exercice.start",
    "message_retarde",
    step.duree > 30 ? "exercice.erreur" : "",
    !isLastSerie && noRepos ? "exercice.enchainement_serie" : "",
  ];
  
  // Traiter tous les messages avec getMessagesFromKey
  const messagesComplets = formaterMessagesVocaux(messages, stepData, exoId, infosDejaDiffusees);

  return {
    ...base,
    type: "exercice",
    serie: serieIndex + 1,
    total_series: nbSeries,
    duree,
    messages: messagesComplets
  };
}

/**
 * Génère un repos entre séries
 */
function genererReposEntreSeries(step, base, serieIndex, nbSeries) {
  const isSerieReps = step.repetitions && step.series;
  const messages = isSerieReps
    ? nbSeries - serieIndex === 2
      ? "repos.avant_derniere_serie"
      : nbSeries - serieIndex === 1
      ? "repos.derniere_serie"
      : "repos.serie_suivante"
    : "repos.serie_suivante";
  const messagesComplets = formaterMessagesVocaux(messages, stepData, exoId, infosDejaDiffusees);
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
function genererReposApresEtape(duree, nextStep, exercicesEnrichis, blocRepsIndex, totalBlocReps, nextStepRepsIndex, infosDejaDiffusees) {
  const etapes = [];
  
  // Vérifier si le prochain élément est un bloc avec lancement manuel
  const isNextBlocWithManualLaunch = nextStep && nextStep.type === "bloc" && nextStep.intro_bloc;
  
  // Ne pas ajouter de repos si le prochain élément est un bloc avec lancement manuel
  if (!isNextBlocWithManualLaunch) {
    let nextStepToProcess = nextStep;
    
    // Si c'est un bloc, prendre le premier exercice
    if (nextStepToProcess && nextStepToProcess.type === "bloc") {
      nextStepToProcess = nextStepToProcess.contenu[0] || [];
    }
    
    // Récupérer l'exercice enrichi
    const nextExo = nextStepToProcess ? exercicesEnrichis.find(e => e.id === nextStepToProcess.id) || {} : null;
    console.log("nextExo :", nextExo)
    if (nextExo) {
      const nextExoData = {
        ...nextExo,
        ...nextStepToProcess,
        nom: nextExo.nom || nextStepToProcess.nom || "Exercice suivant",
        description: nextExo.description || nextStepToProcess.description || "",
        position_depart: nextExo.position_depart || nextStepToProcess.position_depart || "",
      };
      // Formater les messages vocaux pour le prochain exercice
      const messages = [
        nextStepRepsIndex > blocRepsIndex ? nextStepRepsIndex + 1 === totalBlocReps ? "repos.dernier_tour" : "repos.prochain_tour"   : "",
        "repos.annonce_suivant", 
        nextStepRepsIndex <= 0 ? "exercice.position_depart" : "", 
        nextStepRepsIndex <= 0 ? "exercice.description" : ""
      ];
      const messagesComplets = formaterMessagesVocaux(messages, nextExoData, nextStepToProcess.id, infosDejaDiffusees);
      
      etapes.push({
        type: "repos",
        duree,
        messages: messagesComplets,
        blocTour: nextStepRepsIndex + 1,
        totalBlocTour: totalBlocReps,
        exo: nextExoData, // Garder toutes les infos pour l'affichage
      });
    } else if (nextStepToProcess) {
      etapes.push({
        type: "repos",
        duree,
        messages: ["repos.annonce_suivant"],
      });
    }
  }
  
  return etapes;
} 
