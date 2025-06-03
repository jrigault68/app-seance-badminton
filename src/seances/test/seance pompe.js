import { getParId } from "/src/exercices/index.js";

export default [
  {
    ...getParId("pompes"),
    duration: 45
  }
];

export const meta = {
  id: "niveau1_jour1",
  nom: "Jour 1 - Niveau 1",
  niveau: "débutant",
  type: "renforcement",
  categorie: ["haut du corps"]
};