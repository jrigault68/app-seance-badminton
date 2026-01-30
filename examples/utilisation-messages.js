// Exemple d'utilisation de la fonction genererMessages()

// Données d'exemple
const exerciceExemple = {
  id: "exo_001",
  nom: "Flexions de jambes",
  description: "Placez-vous debout, pieds écartés de la largeur des épaules",
  position_depart: "Position debout, dos droit",
  duree: 45,
  series: 3,
  repetitions: 10,
  temps_par_repetition: 3,
  erreurs: ["Ne pas arrondir le dos", "Garder les genoux alignés"],
  conseils: ["Respirez profondément", "Contrôlez le mouvement"]
};

const exerciceSuivant = {
  id: "exo_002", 
  nom: "Pompes",
  description: "En position de planche, descendez et remontez",
  position_depart: "Position de planche",
  duree: 30,
  series: 2,
  repetitions: 8
};

const infosDejaDiffusees = {};

// Exemple 1: Début du premier exercice de la séance
console.log("=== DÉBUT PREMIER EXERCICE ===");
const messagesDebut = genererMessages({
  type: 'debut',
  exercice: exerciceExemple,
  contexte: {
    serie: 1,
    totalSeries: 3,
    isLastSerie: false,
    isFirstSerie: true,
    isFirstExercise: true,
    isBlocWithIntro: false,
    hasReposSeries: true,
    hasReposExercise: true
  },
  infosDejaDiffusees
});
console.log("Messages de début:", messagesDebut);

// Exemple 2: Début de la deuxième série
console.log("\n=== DÉBUT DEUXIÈME SÉRIE ===");
const messagesDeuxiemeSerie = genererMessages({
  type: 'debut',
  exercice: exerciceExemple,
  contexte: {
    serie: 2,
    totalSeries: 3,
    isLastSerie: false,
    isFirstSerie: false,
    isFirstExercise: false,
    hasReposSeries: true,
    hasReposExercise: true
  },
  infosDejaDiffusees
});
console.log("Messages deuxième série:", messagesDeuxiemeSerie);

// Exemple 3: Début de la dernière série
console.log("\n=== DÉBUT DERNIÈRE SÉRIE ===");
const messagesDerniereSerie = genererMessages({
  type: 'debut',
  exercice: exerciceExemple,
  contexte: {
    serie: 3,
    totalSeries: 3,
    isLastSerie: true,
    isFirstSerie: false,
    isFirstExercise: false,
    hasReposSeries: true,
    hasReposExercise: true
  },
  infosDejaDiffusees
});
console.log("Messages dernière série:", messagesDerniereSerie);

// Exemple 4: Repos entre séries
console.log("\n=== REPOS ENTRE SÉRIES ===");
const messagesReposSeries = genererMessages({
  type: 'repos_series',
  exercice: exerciceExemple,
  contexte: {
    serie: 1,
    totalSeries: 3
  },
  infosDejaDiffusees
});
console.log("Messages repos séries:", messagesReposSeries);

// Exemple 5: Repos après exercice avec annonce du suivant
console.log("\n=== REPOS APRÈS EXERCICE ===");
const messagesReposExercice = genererMessages({
  type: 'repos_exercice',
  exercice: exerciceSuivant,
  contexte: {
    blocTour: 1,
    totalBlocTour: 2,
    isLastTour: false,
    isFirstExerciseOfTour: true
  },
  infosDejaDiffusees
});
console.log("Messages repos exercice:", messagesReposExercice);

// Exemple 6: Fin d'exercice avec enchaînement direct
console.log("\n=== FIN AVEC ENCHAÎNEMENT ===");
const messagesFinEnchainement = genererMessages({
  type: 'fin',
  exercice: exerciceExemple,
  nextExercice: exerciceSuivant,
  contexte: {
    serie: 3,
    totalSeries: 3,
    isLastSerie: true,
    hasReposSeries: true,
    hasReposExercise: false // Pas de repos, enchaînement direct
  },
  infosDejaDiffusees
});
console.log("Messages fin avec enchaînement:", messagesFinEnchainement);

// Exemple 7: Messages de motivation pendant l'exercice
console.log("\n=== MESSAGES DE MOTIVATION ===");
const messagesMotivation = genererMessages({
  type: 'milieu',
  exercice: exerciceExemple,
  contexte: {
    serie: 2,
    totalSeries: 3,
    isLastSerie: false
  },
  infosDejaDiffusees
});
console.log("Messages motivation:", messagesMotivation);

// Exemple 8: Fin de séance
console.log("\n=== FIN DE SÉANCE ===");
const messagesFinSeance = genererMessages({
  type: 'fin_seance',
  exercice: exerciceExemple,
  contexte: {
    isLastExercise: true
  },
  infosDejaDiffusees
});
console.log("Messages fin séance:", messagesFinSeance);

