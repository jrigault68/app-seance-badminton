export function genererEtapesDepuisStructure(
  structure,
  exercices = [],
  isBloc = false,
  blocIndex = 1,
  blocRepsIndex = 1,
  totalBlocReps = 1,
  nextBlocStep = null,
  erreursUtiliseesParExo = {}
) {
  const etapes = [];
  
  // Vérifier que exercices est un tableau valide
  if (!exercices || !Array.isArray(exercices)) {
    console.warn('Exercices is not a valid array:', exercices);
    exercices = [];
  }
  
  const exoDict = Object.fromEntries(exercices.map((e) => [e.id, e]));
  var s = 0;
  
  // Vérifier que structure est un tableau itérable
  if (!structure || !Array.isArray(structure)) {
    console.warn('Structure is not a valid array:', structure);
    return etapes;
  }
  
  for (const step of structure) {
    if (step.type === "bloc") {
      console.log("step :", step);
      const blocReps = step.nbTours || 1;
      const blocRepos = step.temps_repos_bloc || 0;
      const contenu = step.contenu || [];

      // Ajout de l'étape intro_bloc si demandé
      if (step.intro_bloc) {
        etapes.push({
          type: "intro_bloc",
          nom: step.nom,
          description: step.description,
          exercices: contenu,
          nbTours: blocReps,
          tempsReposBloc: blocRepos,
        });
      }

      for (let i = 0; i < blocReps; i++) {
        /*if (blocReps > 1) {
          etapes.push({
            type: "annonce_bloc",
            messages: ["bloc.debut"],
            numero: i + 1,
            total: blocReps,
            nb_exos: contenu.length,
          });
        }*/
        etapes.push(
          ...genererEtapesDepuisStructure(
            contenu,
            exercices,
            true,
            s + i + 1,
            i+1,
            blocReps,
            i < blocReps - 1 ? contenu[0] : structure[s + 1],
            erreursUtiliseesParExo
          )
        );

        /*if (blocRepos && i < blocReps - 1) {
          etapes.push({
            type: "repos",
            duree: blocRepos,
            messages: ["repos.bloc_suivant"],
          });
        }*/
      }
      
      // Gérer le temps de repos après un bloc (si le bloc a un temps_repos_exercice)
      const reposApresBloc = step.temps_repos_exercice || 0;
      if (reposApresBloc) {
        var nextStepAfterBloc = structure[s + 1] || nextBlocStep;
        
        // Vérifier si le prochain élément est un bloc avec lancement manuel
        const isNextBlocWithManualLaunch = nextStepAfterBloc && nextStepAfterBloc.type === "bloc" && nextStepAfterBloc.intro_bloc;
        
        // Ne pas ajouter de temps de repos si le prochain élément est un bloc avec lancement manuel
        if (!isNextBlocWithManualLaunch) {
          if (nextStepAfterBloc && nextStepAfterBloc.type === "bloc") {
            nextStepAfterBloc = nextStepAfterBloc.contenu[0] || [];
          }
          const nextExoAfterBloc = nextStepAfterBloc ? exoDict[nextStepAfterBloc.id] || {} : null;
          if (nextExoAfterBloc) {
            const nextExoDataAfterBloc = {
              ...nextExoAfterBloc,
              ...nextStepAfterBloc,
              nom: nextExoAfterBloc.nom || nextStepAfterBloc.nom || "Exercice suivant",
              description: nextExoAfterBloc.description || nextStepAfterBloc.description || "",
              instructions: nextExoAfterBloc.instructions || nextStepAfterBloc.instructions || "",
              position_depart: nextExoAfterBloc.position_depart || nextStepAfterBloc.position_depart || "",
            };
            etapes.push({
              type: "repos",
              duree: reposApresBloc,
              messages: ["repos.annonce_suivant", blocRepsIndex <= 1 ? "exercice.position_depart" : "", blocRepsIndex <= 1 ? "exercice.description" : ""],
              exo: nextExoDataAfterBloc,
            });
          } else if (nextStepAfterBloc) {
            // Il y a un prochain élément mais pas d'exercice associé (cas rare)
            etapes.push({
              type: "repos",
              duree: reposApresBloc,
              messages: ["repos.annonce_suivant"],
            });
          }
          // Si nextStepAfterBloc est null/undefined, on ne fait rien (fin de séance)
        }
      }
      
      s += 1; // Correction : incrémenter s après toutes les répétitions du bloc
      continue;
    }

    const exoId = step.id;
    const exoData = exoDict[exoId] || {};

    // Adapter les données de la base aux propriétés attendues par le moteur
    const stepData = {
      ...exoData,
      ...step,
      // Mapper les propriétés de la base vers les propriétés attendues
      nom: exoData.nom || step.nom || "Exercice",
      description: exoData.description || step.description || "",
      instructions: exoData.instructions || step.instructions || "",
      focus_zone: exoData.focus_zone || step.focus_zone || [],
      position_depart: exoData.position_depart || step.position_depart || "",
      erreurs_courantes: exoData.erreurs_courantes || step.erreurs_courantes || [],
      conseils: exoData.conseils || step.conseils || [],
      // Garder les propriétés de configuration de l'exercice
      series: step.series,
      repetitions: step.repetitions,
      temps_series: step.temps_series,
      temps_par_repetition: step.temps_par_repetition,
      temps_repos_series: step.temps_repos_series,
      temps_repos_exercice: step.temps_repos_exercice,
      blocTour: blocRepsIndex,
      totalBlocTour: totalBlocReps,
    };

    const base = { id: exoId, exo: stepData };

    if (
      etapes.length === 0 &&
      (!isBloc || (blocIndex >= 1 && blocRepsIndex == 1)) &&
      !(s === 0 && step.type === "bloc" && step.intro_bloc)
    ) {
      etapes.push({
        type: "intro",
        duree: 30,
        messages: [
          isBloc ? "intro.start_bloc" : "intro.start_seance",
          "intro.annonce_premier_exercice",
          step.description ? step.description : "",
          "exercice.position_depart",
          "exercice.description",
        ],
        exo: stepData,
      });
    }

    // On force le nombre de séries à 1 si non renseigné ou < 1
    const nbSeries = step.series && step.series > 0 ? step.series : 1;
    const isSerieReps = step.repetitions && nbSeries;
    const isSerieTemps = nbSeries && step.temps_series;

    // Préparer la liste des erreurs à distribuer sur les séries
    if (!erreursUtiliseesParExo[exoId]) {
      erreursUtiliseesParExo[exoId] = [];
    }
    let erreurs = Array.isArray(stepData.erreurs_courantes)
      ? stepData.erreurs_courantes.filter(e => !erreursUtiliseesParExo[exoId].includes(e))
      : [];
    for (let s = 0; s < nbSeries; s++) {
      // Sélectionner une erreur aléatoire et la supprimer du tableau pour ne jamais la répéter
      let erreurCourante = null;
      if (erreurs.length > 0) {
        const idx = Math.floor(Math.random() * erreurs.length);
        erreurCourante = erreurs[idx];
        erreursUtiliseesParExo[exoId].push(erreurCourante); // Ajout à la liste globale
        erreurs.splice(idx, 1); // supprime l'erreur choisie
      }

      const isLastSerie = s === nbSeries - 1;
      const noRepos = !step.temps_repos_series || step.temps_repos_series === 0;
      const duree = isSerieReps
        ? step.repetitions * (step.temps_par_repetition || 3)
        : step.temps_series;
      const messages = [
        nbSeries > 1
          ? (s === 0
              ? "exercice.start_serie"
              : (isLastSerie ? "exercice.start_last_serie" : "exercice.start"))
          : "exercice.start",
        "message_retarde",
        step.duree > 30 ? erreurCourante : "",
      ];

      const messages_fin = !isLastSerie && noRepos ? ["exercice.enchainement_serie"] : [];

      etapes.push({
        ...base,
        type: "exercice",
        serie: s + 1,
        total_series: nbSeries,
        duree,
        messages,
        ...(messages_fin.length > 0 ? { messages_fin } : {}),
      });

      if (s < nbSeries - 1 && !noRepos) {
        const msg = isSerieReps
          ? nbSeries - s === 2
            ? "repos.avant_derniere_serie"
            : nbSeries - s === 1
            ? "repos.derniere_serie"
            : "repos.serie_suivante"
          : "repos.serie_suivante";
        etapes.push({
          ...base,
          type: "repos",
          duree: step.temps_repos_series || 0,
          messages: [msg],
        });
      }
    }
    
    const reposApres = step.temps_repos_exercice || 0;
    if (reposApres) {
      var nextStep = structure[s + 1] || nextBlocStep;
      
      // Vérifier si le prochain élément est un bloc avec lancement manuel
      const isNextBlocWithManualLaunch = nextStep && nextStep.type === "bloc" && nextStep.intro_bloc;
      
      // Ne pas ajouter de temps de repos si le prochain élément est un bloc avec lancement manuel
      if (!isNextBlocWithManualLaunch) {
        if (nextStep && nextStep.type === "bloc") {
          nextStep = nextStep.contenu[0] || [];
        }
        const nextExo = nextStep ? exoDict[nextStep.id] || {} : null;
        if (nextExo) {
          const nextExoData = {
            ...nextExo,
            ...nextStep,
            nom: nextExo.nom || nextStep.nom || "Exercice suivant",
            description: nextExo.description || nextStep.description || "",
            instructions: nextExo.instructions || nextStep.instructions || "",
            position_depart: nextExo.position_depart || nextStep.position_depart || "",
          };
          etapes.push({
            type: "repos",
            duree: reposApres,
            messages: ["repos.annonce_suivant", blocRepsIndex <= 1 ? "exercice.position_depart" : "", blocRepsIndex <= 1 ? "exercice.description" : ""],
            exo: nextExoData,
          });
        } else if (nextStep) {
          // Il y a un prochain élément mais pas d'exercice associé (cas rare)
          etapes.push({
            type: "repos",
            duree: reposApres,
            messages: ["repos.annonce_suivant"],
          });
        }
        // Si nextStep est null/undefined, on ne fait rien (fin de séance)
      }
    }
    s += 1;
  }
  return etapes;
} 
