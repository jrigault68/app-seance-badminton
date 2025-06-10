export function genererEtapesDepuisStructure(structure, exercices, isBloc = false, blocIndex = 1, totalBlocs = 1, nextBlocStep = null) {
  const etapes = [];
  const exoDict = Object.fromEntries(exercices.map(e => [e.id, e]));
  var s = 0
  for (const step of structure) {
    if (step.type === "bloc") {
      const blocReps = step.repetitions || 1;
      const blocRepos = step.temps_repos_bloc || 0;
      const contenu = step.contenu || [];

      for (let i = 0; i < blocReps; i++) {
        /*if (blocReps > 1) {
          etapes.push({
            type: "annonce_bloc",
            messages: ["bloc.debut"],
            numero: i + 1,
            total: blocReps,
            nb_exos: contenu.length
          });
        }*/
        etapes.push(...genererEtapesDepuisStructure(contenu, exercices, true, s + i + 1, blocReps, (i < blocReps-1 ? contenu[0] : structure[s + 1])));

        /*if (blocRepos && i < blocReps - 1) {
          etapes.push({
            type: "repos",
            duree: blocRepos,
            messages: ["repos.bloc_suivant"]
          });
        }*/
      }
	  s+=1;
      continue;
    }

    const exoId = step.id;
    const exoData = exoDict[exoId] || {};
    const stepData = { ...exoData, ...step };
    const base = { id: exoId, exo: stepData };

    if (etapes.length === 0 && (!isBloc || blocIndex == 1)) { // && 
      etapes.push({
        type: "intro",
        duree: 30,
        messages: ["intro.start_seance", "intro.annonce_premier_exercice", "exercice.position_depart", "exercice.description"],
        exo: stepData
      });
    }

    

    if (step.repetitions && step.series) {
      for (let s = 0; s < step.series; s++) {
        etapes.push({
          ...base,
          type: "exercice",
          serie: s + 1,
          total_series: step.series,
          duree: step.repetitions * (step.temps_par_repetition || 3),
          messages: [(step.series > 1 ? "exercice.start_serie" : "exercice.start"), "message_retarde", "exercice.erreur"]
        });

        if (s < step.series - 1) {
          const msg =
            step.series - s === 2
              ? "repos.avant_derniere_serie"
              : step.series - s === 1
              ? "repos.derniere_serie"
              : "repos.serie_suivante";

          etapes.push({
			...base,
            type: "repos",
            duree: step.temps_repos_series || 0,
            messages: [msg]
          });
        }
      }
    } else if (step.series && step.temps_series) {
      for (let s = 0; s < step.series; s++) {
        etapes.push({
          ...base,
          type: "exercice",
          serie: s + 1,
          total_series: step.series,
          duree: step.temps_series,
          messages: ["exercice.start_serie", "message_retarde", "exercice.erreur"]
        });

        if (s < step.series - 1) {
          etapes.push({
            type: "repos",
            duree: step.temps_repos_series || 0,
            messages: ["repos.serie_suivante"]
          });
        }
      }
    } else if (step.temps_series) {
      etapes.push({
        ...base,
        type: "exercice",
        duree: step.temps_series,
        messages: ["exercice.start", "message_retarde", "exercice.erreur"]
      });
    } else {
      etapes.push({
        ...base,
        type: "exercice",
        duree: 30,
        messages: ["exercice.start", "message_retarde", "exercice.erreur"]
      });
    }
	
	const reposApres = step.temps_repos_exercice || 0;
    if (reposApres) {
      var nextStep = (structure[s + 1]  || nextBlocStep);
	  if (nextStep.type === "bloc") {
		  nextStep = nextStep.contenu[0] || [];
	  }
      const nextExo = nextStep ? exoDict[nextStep.id] || {} : null;
      etapes.push({
        type: "repos",
        duree: reposApres,
        messages: ["repos.annonce_suivant", "exercice.position_depart", "exercice.description"],
        exo: nextExo ? { ...nextExo, ...nextStep } : undefined
      });
    }
	s+=1;
  }
  return etapes;
} 
