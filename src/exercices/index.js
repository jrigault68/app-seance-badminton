import pompes from "/src/exercices/renforcement/haut_du_corps/pompes.js";

const exercices = [
  { id: "pompes", ...pompes }
];

export default exercices;

/** 🔍 Fonctions utilitaires **/

// Renvoie toutes les valeurs uniques pour un champ (ex : "categorie", "groupe_musculaire", "niveau")
export function getValeursUniques(champ) {
  const flat = exercices.flatMap(e => Array.isArray(e[champ]) ? e[champ] : [e[champ]]);
  return [...new Set(flat)].filter(Boolean);
}

// Filtrer par champ = valeur (ex : getParCategorie("renforcement"))
export function getParCategorie(categorie) {
  return exercices.filter(e => e.categorie === categorie);
}

export function getParNiveau(niveau) {
  return exercices.filter(e => e.niveau === niveau);
}

export function getParGroupeMusculaire(groupe) {
  return exercices.filter(e => e.groupe_musculaire.includes(groupe));
}

export function getParMateriel(materiel) {
  return exercices.filter(e => e.materiel.includes(materiel));
}

// Recherche par id
export function getParId(id) {
  return exercices.find(e => e.id === id);
}