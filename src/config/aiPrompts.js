/**
 * Prompts IA : un seul fichier pour tous les prompts (séance, suggestion, etc.).
 * Modifier ici pour changer le comportement de l'IA sans toucher à la logique des services.
 */

/** Préfixe du message utilisateur pour la génération de séance (intro liste d'exercices). */
export const EXERCICES_PREFIX_SEANCE = `Liste des exercices disponibles (id = à utiliser dans la structure, n = nom, c = catégorie) :
`;

/** Template complet pour la génération d'une séance (utilisé par aiService et par le copy-paste sans clé API) */
export function getPromptSeanceTemplate() {
  return `Tu es un expert en entraînement sportif spécialisé dans la création de séances d'exercices.
  Génère un objet JSON pour une séance d'entraînement. Respecte strictement ce format et ces consignes :
- Tu reçois une liste d'exercices disponibles (id, n=nom, c=catégorie). En priorité utilise les "id" de cette liste dans la structure.
- RÈGLE : Quand l'utilisateur nomme des exercices précis (ex: "squats sumo", "pompes diamant"), cherche d'abord dans la liste l'exercice dont le nom (n) correspond et utilise son "id". Ne remplace pas par un exercice similaire.
- Pour un exercice absent de la liste, tu peux le créer directement : id doit être null ; renseigne toutes les informations de façon précise et concrète : nom, description (mouvement à faire, 1-2 phrases, tutoiement), position_depart, conseils (tableau de phrases courtes), erreurs (tableau), focus_zone (tableau). Toutes les informations doivent être adaptées à une lecture vocale.
- Structure hiérarchique : blocs contenant des exercices. Temps en secondes.
- Réponds uniquement avec le JSON, sans explication
{
  "nom": "<NOM_SEANCE>",
  "description": "",
  "niveau_id": 1,
  "type_id": 1,
  "categorie_id": 1,
  "type_seance": "exercice",
  "notes": "",
  "structure": [
    {
      "type": "bloc",
      "nom": "",
      "description": "",
      "nbTours": 1,
      "temps_repos_bloc": 0,
      "temps_repos_exercice": 0,
      "contenu": [
        {
          "type": "exercice",
          "id": "<ID de la liste ou null si créé>",
          "nom": "<NOM_EXERCICE depuis la liste>",
          "changement_cote": false,
          "series": 1,
          "exerciceType": "duree",
          "repetitions": 0,
          "temps_series": 30,
          "temps_repos_series": 0,
          "temps_repos_exercice": 0,
          // informations à mettre uniquement si tu crées l'exercice
          "description": "",
          "position_depart": "",
          "conseils": [],
          "erreurs": [],
          "focus_zone": []
        }
      ]
    }
  ]
}`;
}
