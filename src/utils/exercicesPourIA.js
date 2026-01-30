/**
 * Prépare la liste d'exercices pour l'IA : format compact (moins de tokens) et
 * filtrage optionnel par pertinence selon le prompt utilisateur.
 * L'IA ne peut pas appeler d'URL ; la liste doit être envoyée dans le prompt.
 */

const CATEGORIES_PAR_MOT = {
  echauffement: ['échauffement', 'echauffement', 'mobilité', 'mobilite', 'mobilisation'],
  renforcement: ['renforcement', 'gainage', 'muscle', 'force', 'renfo'],
  cardio: ['cardio', 'endurance', 'course', 'cardio'],
  etirement: ['étirement', 'etirement', 'stretch', 'récupération', 'recupération', 'récup'],
  instruction: ['instruction', 'technique', 'travail']
};

/**
 * Extrait des mots significatifs du prompt (pour matcher des noms d'exercices).
 */
function extractMotsFromPrompt(prompt) {
  if (!prompt?.trim()) return [];
  const normalized = prompt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length >= 3);
  return [...new Set(words)];
}

/**
 * Filtre les exercices selon les mots-clés du prompt.
 * Inclut aussi les exercices dont le nom apparaît dans la description (ex: "squats sumo").
 */
export function filterExercicesByPrompt(prompt, exercices, maxSiFiltre = 80) {
  if (!prompt || !exercices?.length) return exercices || [];

  const pl = prompt.toLowerCase();
  const motsPrompt = extractMotsFromPrompt(prompt);

  // Exercices dont le nom matche un mot de la description (ex: user dit "squats sumo" → on inclut "Squats sumo")
  const byName = motsPrompt.length
    ? exercices.filter(exo => {
        const nom = (exo.nom || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return motsPrompt.some(m => nom.includes(m));
      })
    : [];

  let categoriesToKeep = null;
  for (const [key, keywords] of Object.entries(CATEGORIES_PAR_MOT)) {
    if (keywords.some(kw => pl.includes(kw))) {
      categoriesToKeep = categoriesToKeep || [];
      categoriesToKeep.push(key);
    }
  }

  if (!categoriesToKeep?.length) {
    const merged = byName.length ? [...byName, ...exercices.filter(e => !byName.includes(e))] : exercices;
    return merged.slice(0, 120);
  }

  const byCategory = exercices.filter(exo => {
    const cat = (exo.categorie_nom || '').toLowerCase();
    return categoriesToKeep.some(key => {
      const mots = CATEGORIES_PAR_MOT[key];
      return mots.some(m => cat.includes(m.replace('é', 'e').replace('è', 'e')));
    });
  });

  const idsByName = new Set(byName.map(e => e.id));
  const fromCategoryNotInByName = byCategory.filter(e => !idsByName.has(e.id));
  const merged = [...byName, ...fromCategoryNotInByName];
  if (merged.length === 0) return exercices.slice(0, 120);
  return merged.slice(0, maxSiFiltre);
}

/**
 * Format compact pour l'IA : id + nom + catégorie (moins de tokens que l'objet complet).
 * @param {Array} exercices - Liste des exercices (après filtrage éventuel)
 * @returns {Array<{id: string, n: string, c: string}>} Liste compacte (n=nom, c=catégorie)
 */
export function formatExercicesCompact(exercices) {
  if (!exercices?.length) return [];
  return exercices.map(exo => ({
    id: exo.id,
    n: exo.nom || '',
    c: exo.categorie_nom || ''
  }));
}
