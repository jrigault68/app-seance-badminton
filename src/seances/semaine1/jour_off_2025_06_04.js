export const structure = [
  // Échauffement simple
  { id: "genoux_hauts_talons_fesses", temps_series: 120, temps_repos_exercice: 15 },
  { id: "mobilisation_cheville_gauche", temps_series: 120, temps_repos_exercice: 15 },
  { id: "cercles_epaules_legers", temps_series: 120, temps_repos_exercice: 20 },

  // Mobilité épaule
  { id: "pendulaire_bras_droit", temps_series: 120, temps_repos_exercice: 10 },
  { id: "glissement_bras_droit_table", temps_series: 120, temps_repos_exercice: 10 },
  { id: "rotation_externe_allongee", temps_series: 120, temps_repos_exercice: 10 },
  { id: "massage_grand_rond", temps_series: 180, temps_repos_exercice: 30 },

  // Renfo au sol
  {
    id: "pont_fessier_sol",
    series: 3,
    repetitions: 12,
    temps_par_repetition: 3,
    temps_repos_series: 30,
    temps_repos_exercice: 30
  },
  {
    id: "gainage_dorsal_sol",
    series: 1,
    temps_series: 30,
    temps_repos_exercice: 20
  },
  {
    id: "planche_laterale_hanche",
    series: 1,
    temps_series: 20,
    temps_repos_exercice: 30
  },
  {
    id: "chaise_murale_isometrique",
    series: 1,
    temps_series: 30,
    temps_repos_exercice: 45
  },

  // Étirements
  { id: "etirement_psoas_fente", temps_series: 60, temps_repos_exercice: 10 },
  { id: "etirement_fessier_sol", temps_series: 60, temps_repos_exercice: 10 },
  { id: "etirement_pectoraux_mur", temps_series: 60, temps_repos_exercice: 10 },

  // Fin de séance : respiration (repos = fin)
  { id: "respiration_allongee", temps_series: 60 }
];

export const meta = {
  id: "jour_off_2025_06_04",
  nom: "Jour Off actif – Mobilité & gainage sans bras",
  niveau: "facile",
  type: "récupération_active",
  categorie: ["mobilité", "renforcement", "récupération"],
  description: "Séance douce sans sollicitation du bras droit, avec mobilité ciblée, gainage, renforcement bas du corps et étirements.",
  objectifs: [
    "Préserver la mobilité de l’épaule douloureuse",
    "Renforcer jambes et tronc sans appui sur les bras",
    "Favoriser la récupération active globale"
  ]
};
