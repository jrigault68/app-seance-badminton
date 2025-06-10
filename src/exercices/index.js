// Imports
import pompes from "/src/exercices/renforcement/haut_du_corps/pompes.js";
import { echauffement_marche_active } from "/src/exercices/echauffement/echauffement_marche_active.js";
import { genoux_hauts_talons_fesses } from "/src/exercices/echauffement/genoux_hauts_talons_fesses.js";
import { mobilisation_cheville_gauche } from "/src/exercices/echauffement/mobilisation_cheville_gauche.js";
import { cercles_epaules_legers } from "/src/exercices/echauffement/cercles_epaules_legers.js";
import { pendulaire_bras_droit } from "/src/exercices/mobilite/pendulaire_bras_droit.js";
import { glissement_bras_droit_table } from "/src/exercices/mobilite/glissement_bras_droit_table.js";
import { rotation_externe_allongee } from "/src/exercices/mobilite/rotation_externe_allongee.js";
import { massage_grand_rond } from "/src/exercices/mobilite/massage_grand_rond.js";
import { chat_vache } from "/src/exercices/mobilite/chat_vache.js";
import { rotation_articulaire_epaule } from "/src/exercices/mobilite/rotation_articulaire_epaule.js";
import { ouverture_hanche_debout } from "/src/exercices/mobilite/ouverture_hanche_debout.js";
import { pont_fessier_sol } from "/src/exercices/renforcement/pont_fessier_sol.js";
import { gainage_dorsal_sol } from "/src/exercices/renforcement/gainage_dorsal_sol.js";
import { planche_laterale_hanche } from "/src/exercices/renforcement/planche_laterale_hanche.js";
import { chaise_murale_isometrique } from "/src/exercices/renforcement/chaise_murale_isometrique.js";
import { planche_haute_alternance_jambes } from "/src/exercices/renforcement/planche_haute_alternance_jambes.js";
import { gainage_respiratoire_allonge } from "/src/exercices/renforcement/gainage_respiratoire_allonge.js";
import { etirement_psoas_fente } from "/src/exercices/etirement/etirement_psoas_fente.js";
import { etirement_fessier_sol } from "/src/exercices/etirement/etirement_fessier_sol.js";
import { etirement_pectoraux_mur } from "/src/exercices/etirement/etirement_pectoraux_mur.js";
import { respiration_allongee } from "/src/exercices/etirement/respiration_allongee.js";
import { etirement_actif_dos_sol } from "/src/exercices/etirement/etirement_actif_dos_sol.js";
import { ouverture_hanche_sol_respiration } from "/src/exercices/etirement/ouverture_hanche_sol_respiration.js";


// Liste des exercices
const exercices = [
  { id: "pompes", ...pompes },
  { id: "echauffement_marche_active", ...echauffement_marche_active },
  { id: "genoux_hauts_talons_fesses", ...genoux_hauts_talons_fesses },
  { id: "mobilisation_cheville_gauche", ...mobilisation_cheville_gauche },
  { id: "cercles_epaules_legers", ...cercles_epaules_legers },
  { id: "pendulaire_bras_droit", ...pendulaire_bras_droit },
  { id: "glissement_bras_droit_table", ...glissement_bras_droit_table },
  { id: "rotation_externe_allongee", ...rotation_externe_allongee },
  { id: "massage_grand_rond", ...massage_grand_rond },
  { id: "chat_vache", ...chat_vache },
  { id: "rotation_articulaire_epaule", ...rotation_articulaire_epaule },
  { id: "ouverture_hanche_debout", ...ouverture_hanche_debout },
  { id: "pont_fessier_sol", ...pont_fessier_sol },
{ id: "gainage_dorsal_sol", ...gainage_dorsal_sol },
{ id: "planche_laterale_hanche", ...planche_laterale_hanche },
{ id: "chaise_murale_isometrique", ...chaise_murale_isometrique },
{ id: "planche_haute_alternance_jambes", ...planche_haute_alternance_jambes },
{ id: "gainage_respiratoire_allonge", ...gainage_respiratoire_allonge },
{ id: "etirement_psoas_fente", ...etirement_psoas_fente },
{ id: "etirement_fessier_sol", ...etirement_fessier_sol },
{ id: "etirement_pectoraux_mur", ...etirement_pectoraux_mur },
{ id: "etirement_actif_dos_sol", ...etirement_actif_dos_sol },
{ id: "ouverture_hanche_sol_respiration", ...ouverture_hanche_sol_respiration },
{ id: "respiration_allongee", ...respiration_allongee }

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
