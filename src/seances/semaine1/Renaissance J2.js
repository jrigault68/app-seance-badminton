// === Fichier complet des exercices de la séance Renaissance – Jour 2 ===

export const structure = [
  {
    type: "bloc",
    temps_repos_bloc: 30,
    contenu: [
      {
        id: "jumping_jacks",
        series: 2,
        repetitions: 1,
        temps_series: 30,
        temps_par_repetition: 1,
        temps_repos_series: 20,
        temps_repos_exercice: 10
      },
      {
        id: "fentes_arriere_bras_leves",
        series: 2,
        repetitions: 8,
        temps_series: 40,
        temps_par_repetition: 5,
        temps_repos_series: 20,
        temps_repos_exercice: 10
      },
      {
        id: "rotation_bras_tronc",
        series: 2,
        repetitions: 1,
        temps_series: 15,
        temps_par_repetition: 1,
        temps_repos_series: 15,
        temps_repos_exercice: 10
      },
      {
        id: "marche_genoux_hauts_bras",
        series: 2,
        repetitions: 1,
        temps_series: 20,
        temps_par_repetition: 1,
        temps_repos_series: 20,
        temps_repos_exercice: 30
      }
    ]
  },
  {
    type: "bloc",
    repetitions: 3,
    temps_repos_bloc: 60,
    contenu: [
      {
        id: "squats_dynamiques",
        series: 1,
        repetitions: 1,
        temps_series: 30,
        temps_par_repetition: 1,
        temps_repos_series: 20,
        temps_repos_exercice: 20
      },
      {
        id: "pompes_inclinees",
        series: 1,
        repetitions: 1,
        temps_series: 30,
        temps_par_repetition: 1,
        temps_repos_series: 20,
        temps_repos_exercice: 20
      },
      {
        id: "gainage_touches_epaules",
        series: 1,
        repetitions: 1,
        temps_series: 30,
        temps_par_repetition: 1,
        temps_repos_series: 20,
        temps_repos_exercice: 60
      }
    ]
  },
  {
    type: "bloc",
    temps_repos_bloc: 30,
    contenu: [
      {
        id: "shadow_deplacement",
        series: 2,
        repetitions: 1,
        temps_series: 30,
        temps_par_repetition: 1,
        temps_repos_series: 20,
        temps_repos_exercice: 10
      },
      {
        id: "montees_genoux_cadence",
        series: 2,
        repetitions: 1,
        temps_series: 20,
        temps_par_repetition: 1,
        temps_repos_series: 20,
        temps_repos_exercice: 10
      },
      {
        id: "tirage_bras_air",
        series: 2,
        repetitions: 12,
        temps_series: 30,
        temps_par_repetition: 2.5,
        temps_repos_series: 20,
        temps_repos_exercice: 30
      }
    ]
  },
  {
    type: "bloc",
    contenu: [
      {
        id: "etirement_dos_hanches_sol",
        series: 2,
        repetitions: 1,
        temps_series: 30,
        temps_par_repetition: 1,
        temps_repos_series: 10,
        temps_repos_exercice: 5
      },
      {
        id: "inspire_leve_bras_expire",
        series: 3,
        repetitions: 1,
        temps_series: 20,
        temps_par_repetition: 1,
        temps_repos_series: 10,
        temps_repos_exercice: 5
      },
      {
        id: "respiration_abdominale_allonge",
        series: 1,
        repetitions: 1,
        temps_series: 120,
        temps_par_repetition: 1,
        temps_repos_series: 0,
        temps_repos_exercice: 0
      }
    ]
  }
];

export const meta = {
  id: "renaissance_jour_2",
  nom: "Renaissance – Jour 2 : Activation tonique",
  niveau: "facile",
  type: "mixte",
  categorie: ["mobilité", "renforcement", "cardio", "ancrage"],
  description: "Séance de relance post-reprise avec tonification globale, cardio léger et mobilité active.",
  objectifs: [
    "Activer les chaînes musculaires sans charge",
    "Travailler le souffle et la fluidité de mouvement",
    "Relancer progressivement la tonicité et la coordination"
  ]
};

// === Exercices ===

export function jumping_jacks() {
  return {
    id: "jumping_jacks",
    nom: "Jumping Jacks",
    description: "Sauter sur place en écartant bras et jambes, puis revenir à la position initiale.",
    position_depart: "Debout, bras le long du corps, pieds joints.",
    erreurs: [
      "Ne laisse pas tes bras partiellement pliés pendant le mouvement.",
      "Évite les sauts rigides, rebondis de manière fluide."
    ],
    categorie: "cardio",
    groupe_musculaire: "corps entier",
    materiel: "aucun",
    niveau: "facile",
    type: "mouvement",
    focus_zone: [
      "Concentre-toi sur le rythme et la coordination des bras et jambes.",
      "Respire régulièrement pendant l'exercice."
    ],
    image: "jumping_jacks.png"
  };
}

export function fentes_arriere_bras_leves() {
  return {
    id: "fentes_arriere_bras_leves",
    nom: "Fentes arrière bras levés",
    description: "Faire une fente arrière en levant les bras au-dessus de la tête.",
    position_depart: "Debout, bras le long du corps.",
    erreurs: [
      "Ne laisse pas le genou avant dépasser les orteils.",
      "Pense à garder les bras tendus et alignés au-dessus de la tête."
    ],
    categorie: "mobilité",
    groupe_musculaire: "jambes, tronc, épaules",
    materiel: "aucun",
    niveau: "facile",
    type: "mouvement",
    focus_zone: [
      "Allonge bien les bras pour ouvrir les épaules.",
      "Stabilise le tronc pendant la descente."
    ],
    image: "fentes_arriere_bras_leves.png"
  };
}

export function rotation_bras_tronc() {
  return {
    id: "rotation_bras_tronc",
    nom: "Rotation bras et tronc",
    description: "Effectuer des rotations du haut du corps en balançant les bras de gauche à droite.",
    position_depart: "Debout, jambes légèrement écartées, bras relâchés.",
    erreurs: [
      "Ne force pas l’amplitude, reste dans une rotation naturelle.",
      "Ne contracte pas les épaules, garde-les relâchées."
    ],
    categorie: "mobilité",
    groupe_musculaire: "dos, épaules",
    materiel: "aucun",
    niveau: "facile",
    type: "mobilité",
    focus_zone: [
      "Laisse le mouvement partir du bassin et du tronc.",
      "Cherche la fluidité, sans tension dans les bras."
    ],
    image: "rotation_bras_tronc.png"
  };
}

export function marche_genoux_hauts_bras() {
  return {
    id: "marche_genoux_hauts_bras",
    nom: "Marche genoux hauts avec bras opposés",
    description: "Marcher sur place en montant les genoux et en levant le bras opposé.",
    position_depart: "Debout, bras relâchés, jambes légèrement fléchies.",
    erreurs: [
      "Ne lève pas les genoux trop bas.",
      "Ne néglige pas la coordination bras-jambe opposée."
    ],
    categorie: "cardio",
    groupe_musculaire: "jambes, tronc",
    materiel: "aucun",
    niveau: "facile",
    type: "coordination",
    focus_zone: [
      "Soulève bien les genoux à chaque pas.",
      "Coordonne bras et jambes pour une activation complète."
    ],
    image: "marche_genoux_hauts_bras.png"
  };
}

export function squats_dynamiques() {
  return {
    id: "squats_dynamiques",
    nom: "Squats dynamiques bras en avant",
    description: "Effectuer des squats avec les bras tendus devant soi.",
    position_depart: "Debout, pieds largeur bassin, bras tendus devant.",
    erreurs: [
      "Ne laisse pas les genoux partir vers l’intérieur.",
      "Ne cambre pas exagérément le dos."
    ],
    categorie: "renforcement",
    groupe_musculaire: "jambes, fessiers",
    materiel: "aucun",
    niveau: "facile",
    type: "renforcement",
    focus_zone: [
      "Garde les talons ancrés au sol.",
      "Engage les abdos pour protéger ton dos."
    ],
    image: "squats_dynamiques.png"
  };
}

export function pompes_inclinees() {
  return {
    id: "pompes_inclinees",
    nom: "Pompes inclinées",
    description: "Faire des pompes en appui sur un support surélevé (mur, banc).",
    position_depart: "Position de planche inclinée, bras tendus sur support.",
    erreurs: [
      "Ne creuse pas le bas du dos.",
      "Pense à garder les coudes proches du corps."
    ],
    categorie: "renforcement",
    groupe_musculaire: "pectoraux, triceps, gainage",
    materiel: "mur ou banc",
    niveau: "facile",
    type: "renforcement",
    focus_zone: [
      "Contracte les abdos pour stabiliser le tronc.",
      "Fléchis les bras à 45° par rapport au buste."
    ],
    image: "pompes_inclinees.png"
  };
}

export function gainage_touches_epaules() {
  return {
    id: "gainage_touches_epaules",
    nom: "Gainage dynamique : toucher épaules",
    description: "Depuis une position de planche, alterner le toucher d'épaule avec la main opposée.",
    position_depart: "Planche bras tendus, pieds écartés largeur bassin.",
    erreurs: [
      "Ne balance pas le bassin d’un côté à l’autre.",
      "Ne retiens pas ta respiration."
    ],
    categorie: "gainage",
    groupe_musculaire: "abdominaux, épaules",
    materiel: "aucun",
    niveau: "facile",
    type: "renforcement",
    focus_zone: [
      "Stabilise ton tronc pendant le mouvement.",
      "Reste fluide sans précipitation."
    ],
    image: "gainage_touches_epaules.png"
  };
}

export function shadow_deplacement() {
  return {
    id: "shadow_deplacement",
    nom: "Shadow déplacement",
    description: "Simuler des déplacements badminton (fente, recul, pas croisé) sans raquette.",
    position_depart: "Debout en position dynamique, léger fléchissement des genoux.",
    erreurs: [
      "Ne reste pas figé sur place, cherche à bouger constamment.",
      "Pense à pousser avec les jambes et pas à tirer."
    ],
    categorie: "cardio",
    groupe_musculaire: "corps entier",
    materiel: "aucun",
    niveau: "facile",
    type: "coordination",
    focus_zone: [
      "Travaille tes appuis comme en match.",
      "Reste bas et dynamique."
    ],
    image: "shadow_deplacement.png"
  };
}

export function montees_genoux_cadence() {
  return {
    id: "montees_genoux_cadence",
    nom: "Montées de genoux cadence 60%",
    description: "Élever rapidement les genoux à hauteur du bassin sur place.",
    position_depart: "Debout, jambes fléchies, bras prêts à bouger.",
    erreurs: [
      "Ne tape pas le sol trop fort avec les pieds.",
      "Pense à garder le buste droit pendant la montée."
    ],
    categorie: "cardio",
    groupe_musculaire: "jambes",
    materiel: "aucun",
    niveau: "facile",
    type: "cardio",
    focus_zone: [
      "Cherche la cadence sans perdre ta posture.",
      "Utilise les bras pour accompagner le mouvement."
    ],
    image: "montees_genoux_cadence.png"
  };
}

export function tirage_bras_air() {
  return {
    id: "tirage_bras_air",
    nom: "Tirage bras dans l’air",
    description: "Simuler un tirage horizontal bras fléchis sans élastique.",
    position_depart: "Debout ou assis, bras tendus à l’avant, paumes vers l’intérieur.",
    erreurs: [
      "Ne lève pas les épaules pendant le tirage.",
      "Ne creuse pas le dos en tirant."
    ],
    categorie: "renforcement",
    groupe_musculaire: "haut du dos, biceps",
    materiel: "aucun",
    niveau: "facile",
    type: "renforcement",
    focus_zone: [
      "Imagine que tu tires une bande élastique contrôlée.",
      "Resserre les omoplates à la fin du mouvement."
    ],
    image: "tirage_bras_air.png"
  };
}

export function etirement_dos_hanches_sol() {
  return {
    id: "etirement_dos_hanches_sol",
    nom: "Étirement dos et hanches au sol",
    description: "Allongé sur le dos, ramener les genoux vers la poitrine pour étirer le bas du dos et les hanches.",
    position_depart: "Allongé sur le dos, jambes fléchies, bras le long du corps.",
    erreurs: [
      "Ne contracte pas les épaules pendant l’étirement.",
      "Ne force pas la flexion des genoux."
    ],
    categorie: "mobilité",
    groupe_musculaire: "dos, hanches",
    materiel: "aucun",
    niveau: "facile",
    type: "étirement",
    focus_zone: [
      "Relâche tout le haut du corps pendant l’étirement.",
      "Concentre-toi sur la respiration profonde."
    ],
    image: "etirement_dos_hanches_sol.png"
  };
}

export function inspire_leve_bras_expire() {
  return {
    id: "inspire_leve_bras_expire",
    nom: "Inspiration bras levés, expiration avant",
    description: "Lever les bras à l’inspiration, puis se pencher doucement vers l’avant à l’expiration.",
    position_depart: "Debout, bras le long du corps.",
    erreurs: [
      "Ne bloque pas la respiration.",
      "Ne force pas la descente vers l’avant."
    ],
    categorie: "mobilité",
    groupe_musculaire: "dos, épaules",
    materiel: "aucun",
    niveau: "facile",
    type: "mobilité",
    focus_zone: [
      "Suis la respiration pour guider le mouvement.",
      "Cherche l’allongement sans forcer."
    ],
    image: "inspire_leve_bras_expire.png"
  };
}

export function respiration_abdominale_allonge() {
  return {
    id: "respiration_abdominale_allonge",
    nom: "Respiration abdominale allongé",
    description: "Allongé sur le dos, mains sur le ventre, respirer lentement en gonflant l’abdomen.",
    position_depart: "Allongé confortablement sur le dos, jambes pliées ou tendues.",
    erreurs: [
      "Ne respire pas uniquement avec la poitrine.",
      "Pense à relâcher les mâchoires et les épaules."
    ],
    categorie: "respiration",
    groupe_musculaire: "diaphragme",
    materiel: "aucun",
    niveau: "facile",
    type: "relaxation",
    focus_zone: [
      "Concentre-toi sur la montée et descente naturelle du ventre.",
      "Ralentis progressivement chaque cycle de respiration."
    ],
    image: "respiration_abdominale_allonge.png"
  };
}
