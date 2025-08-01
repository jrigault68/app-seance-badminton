import { genererEtapesDepuisStructure } from "./genererEtapes";

export function pickRandom(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatDureeTexte(sec) {
  sec = Math.round(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) return `${h} h${m ? " " + m + " min" : ""}`;
  if (m > 0) return `${m} min${s ? " " + s + " sec" : ""}`;
  return `${s} sec`;
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(n, max));
}

export function isBloc(etape) {
  return etape && etape.type === "bloc";
}

export function estExercice(etape) {
  return etape && etape.type === "exercice";
}

/** Estime la durée d'une étape (exercice ou bloc), de manière récursive */
export function estimerDureeEtape(etape) {
  if (!etape) return 0;

  if (etape.type === "bloc") {
    const repetitions = etape.repetitions || 1;
    const reposBloc = etape.temps_repos_bloc || 0;

    const totalBloc = (etape.contenu || []).reduce((acc, sousEtape) => {
      return acc + estimerDureeEtape(sousEtape);
    }, 0);

    return repetitions * totalBloc + (repetitions - 1) * reposBloc;
  }

  if (etape.series && etape.repetitions) {
    const tpr = etape.temps_par_repetition || 3;
    return etape.series * etape.repetitions * tpr +
           (etape.series - 1) * (etape.temps_repos_series || 0);
  }

  if (etape.series && etape.temps_series) {
    return etape.series * etape.temps_series +
           (etape.series - 1) * (etape.temps_repos_series || 0);
  }

  if (etape.temps_series) {
    return etape.temps_series;
  }

  return 0;
}

export function getDetails(exo){
  if (!exo) return "Exercice libre";
  // Séries + répétitions (classique)
  if (exo.series && exo.series > 1 && exo.repetitions) {
	return `${exo.series} x ${exo.repetitions} rép.`;
  }
  // Séries + temps par série
  if (exo.series && exo.series > 1 && exo.temps_series) {
	return `${exo.series} x ${formatDureeTexte(exo.temps_series)}`;
  }
  // Juste répétitions
  if (exo.repetitions) {
	return `${exo.repetitions} rép.`;
  }
  // Pas de séries, mais durée fixe
  if ((!exo.series || exo.series <=1) && exo.temps_series) {
	return `${formatDureeTexte(exo.temps_series)}`;
  }
  // Juste durée
  if (exo.duree || exo.duration) {
	return `${formatDureeTexte(exo.duree || exo.duration)}`;
  }
  // Fallback
  return "Exercice libre";
}

/**
 * Calcule le temps total d'une séance en parcourant chaque étape
 * @param {Array} structure - Structure de la séance
 * @param {Array} exercices - Liste des exercices disponibles
 * @returns {number} Temps total en secondes
 */
export function calculerTempsTotalSeance(structure, exercices = []) {
  if (!structure || !Array.isArray(structure) || structure.length === 0) {
    return 0;
  }

  // Déplacer l'import en haut du fichier si ce n'est pas déjà fait :
  // import { genererEtapesDepuisStructure } from "./genererEtapes";
  const etapes = genererEtapesDepuisStructure(structure, exercices);

  // Temps par défaut pour les transitions
  const TEMPS_DEFAUT = {
    transition: 30,         // Transition par défaut : 30 secondes
    exercice_sans_duree: 60 // Exercice sans durée : 60 secondes
  };

  // Fonction pour calculer la durée d'une étape
  function calculerDureeEtape(etape) {
    // Si l'étape a une durée, l'utiliser directement (convertir en nombre)
    if (etape.duree) {
      return parseInt(etape.duree, 10) || 0;
    }

    // Si c'est un exercice avec séries et répétitions
    if (etape.series && etape.repetitions) {
      const tempsParRep = parseInt(etape.temps_par_repetition, 10) || 3;
      const tempsSeries = parseInt(etape.series, 10) * parseInt(etape.repetitions, 10) * tempsParRep;
      const tempsRepos = (parseInt(etape.series, 10) - 1) * (parseInt(etape.temps_repos_series, 10) || 0);
      return tempsSeries + tempsRepos;
    }

    // Si c'est un exercice avec séries et temps par série
    if (etape.series && etape.temps_series) {
      const tempsSeries = parseInt(etape.series, 10) * parseInt(etape.temps_series, 10);
      const tempsRepos = (parseInt(etape.series, 10) - 1) * (parseInt(etape.temps_repos_series, 10) || 0);
      return tempsSeries + tempsRepos;
    }

    // Si c'est un exercice avec juste temps par série
    if (etape.temps_series) {
      return parseInt(etape.temps_series, 10);
    }

    // Si c'est un exercice sans durée spécifiée
    if (etape.type === "exercice") {
      return TEMPS_DEFAUT.exercice_sans_duree;
    }

    // Pour les transitions ou autres étapes sans durée
    return TEMPS_DEFAUT.transition;
  }

  // Parcourir chaque étape et additionner les durées
  const tempsTotal = etapes.reduce((acc, etape) => {
    const duree = calculerDureeEtape(etape);
    console.log('Étape:', etape.type, 'Durée calculée:', duree);
    return acc + duree;
  }, 0);

  console.log('Temps total calculé:', tempsTotal);
  return tempsTotal;
}