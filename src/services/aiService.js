/**
 * Service pour l'intelligence artificielle
 * Ce service peut être facilement remplacé par une vraie API IA
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class AIService {
  /**
   * Génère une séance d'entraînement avec l'IA
   * @param {string} prompt - Description de la séance souhaitée
   * @param {Array} exercices - Liste des exercices disponibles
   * @param {string} template - Template JSON pour la structure
   * @returns {Promise<string>} - JSON de la séance générée
   */
  async generateSeance(prompt, exercices, template) {
    try {
      // En production, remplacez cette simulation par un vrai appel API
      // Exemple avec OpenAI, Claude, ou votre propre API
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Génération basée sur le prompt et les exercices disponibles
      const seance = this.generateSeanceFromPrompt(prompt, exercices, template);
      
      return JSON.stringify(seance, null, 2);
      
    } catch (error) {
      throw new Error(`Erreur lors de la génération IA : ${error.message}`);
    }
  }

  /**
   * Génère une séance basée sur le prompt (logique de simulation)
   * @param {string} prompt - Description de la séance
   * @param {Array} exercices - Exercices disponibles
   * @param {string} template - Template JSON
   * @returns {Object} - Séance générée
   */
  generateSeanceFromPrompt(prompt, exercices, template) {
    const promptLower = prompt.toLowerCase();
    
    // Analyser le prompt pour déterminer le type de séance
    const isEchauffement = promptLower.includes('échauffement') || promptLower.includes('echauffement');
    const isRenforcement = promptLower.includes('renforcement') || promptLower.includes('muscle');
    const isCardio = promptLower.includes('cardio') || promptLower.includes('endurance');
    const isEtirement = promptLower.includes('étirement') || promptLower.includes('etirement');
    const isMobilite = promptLower.includes('mobilité') || promptLower.includes('mobilite');
    
    // Extraire la durée si mentionnée
    const durationMatch = prompt.match(/(\d+)\s*(min|minutes?)/);
    const targetDuration = durationMatch ? parseInt(durationMatch[1]) : 30;
    
    // Filtrer les exercices par catégorie
    let selectedExercices = [];
    
    if (isEchauffement) {
      selectedExercices = exercices.filter(exo => 
        exo.categorie_nom === 'échauffement' || 
        exo.categorie_nom === 'mobilité'
      );
    } else if (isRenforcement) {
      selectedExercices = exercices.filter(exo => 
        exo.categorie_nom === 'renforcement' || 
        exo.categorie_nom === 'gainage'
      );
    } else if (isCardio) {
      selectedExercices = exercices.filter(exo => 
        exo.categorie_nom === 'cardio' || 
        exo.categorie_nom === 'renforcement'
      );
    } else if (isEtirement) {
      selectedExercices = exercices.filter(exo => 
        exo.categorie_nom === 'étirement' || 
        exo.categorie_nom === 'récupération_active'
      );
    } else if (isMobilite) {
      selectedExercices = exercices.filter(exo => 
        exo.categorie_nom === 'mobilité' || 
        exo.categorie_nom === 'échauffement'
      );
    } else {
      // Séance mixte par défaut
      selectedExercices = exercices;
    }
    
    // Limiter le nombre d'exercices
    selectedExercices = selectedExercices.slice(0, 8);
    
    // Déterminer le niveau
    let niveau = 1; // facile par défaut
    if (promptLower.includes('difficile') || promptLower.includes('avancé')) {
      niveau = 3;
    } else if (promptLower.includes('intermédiaire') || promptLower.includes('moyen')) {
      niveau = 2;
    } else if (promptLower.includes('expert') || promptLower.includes('pro')) {
      niveau = 4;
    }
    
    // Générer la structure de la séance
    const structure = this.generateStructure(selectedExercices, targetDuration, promptLower);
    
    // Générer le nom de la séance
    const nom = this.generateSeanceName(prompt, isEchauffement, isRenforcement, isCardio, isEtirement, isMobilite);
    
    return {
      nom,
      description: `Séance générée automatiquement : ${prompt}`,
      niveau_id: niveau,
      type_id: 1,
      categorie_id: this.getCategorieId(isEchauffement, isRenforcement, isCardio, isEtirement, isMobilite),
      type_seance: "exercice",
      notes: "Séance générée par IA - Vérifiez et ajustez selon vos besoins",
      structure
    };
  }

  /**
   * Génère la structure de la séance
   * @param {Array} exercices - Exercices sélectionnés
   * @param {number} targetDuration - Durée cible en minutes
   * @param {string} promptLower - Prompt en minuscules
   * @returns {Array} - Structure de la séance
   */
  generateStructure(exercices, targetDuration, promptLower) {
    const structure = [];
    
    // Déterminer le nombre de blocs
    let nbBlocs = 2; // Par défaut
    if (targetDuration > 45) nbBlocs = 3;
    if (targetDuration < 20) nbBlocs = 1;
    
    // Répartir les exercices dans les blocs
    const exercicesParBloc = Math.ceil(exercices.length / nbBlocs);
    
    for (let i = 0; i < nbBlocs; i++) {
      const blocExercices = exercices.slice(i * exercicesParBloc, (i + 1) * exercicesParBloc);
      
      if (blocExercices.length === 0) continue;
      
      const bloc = {
        type: "bloc",
        nom: this.generateBlocName(i, nbBlocs, promptLower),
        description: this.generateBlocDescription(i, nbBlocs, promptLower),
        nbTours: this.getNbTours(i, nbBlocs),
        temps_repos_bloc: this.getTempsReposBloc(i, nbBlocs),
        temps_repos_exercice: this.getTempsReposExercice(i, nbBlocs),
        contenu: blocExercices.map(exo => this.generateExerciceConfig(exo, i, nbBlocs))
      };
      
      structure.push(bloc);
    }
    
    return structure;
  }

  /**
   * Génère le nom d'un bloc
   * @param {number} index - Index du bloc
   * @param {number} total - Nombre total de blocs
   * @param {string} promptLower - Prompt en minuscules
   * @returns {string} - Nom du bloc
   */
  generateBlocName(index, total, promptLower) {
    const names = [];
    
    if (promptLower.includes('échauffement') || promptLower.includes('echauffement')) {
      names.push('Échauffement articulaire', 'Échauffement cardio', 'Échauffement spécifique');
    } else if (promptLower.includes('renforcement')) {
      names.push('Renforcement léger', 'Renforcement modéré', 'Renforcement intense');
    } else if (promptLower.includes('cardio')) {
      names.push('Cardio léger', 'Cardio modéré', 'Cardio intense');
    } else if (promptLower.includes('étirement')) {
      names.push('Étirements doux', 'Étirements modérés', 'Étirements profonds');
    } else {
      names.push('Bloc 1', 'Bloc 2', 'Bloc 3');
    }
    
    return names[index] || `Bloc ${index + 1}`;
  }

  /**
   * Génère la description d'un bloc
   * @param {number} index - Index du bloc
   * @param {number} total - Nombre total de blocs
   * @param {string} promptLower - Prompt en minuscules
   * @returns {string} - Description du bloc
   */
  generateBlocDescription(index, total, promptLower) {
    if (index === 0 && promptLower.includes('échauffement')) {
      return "Mobilisation progressive des articulations et échauffement cardiovasculaire";
    } else if (index === total - 1 && promptLower.includes('étirement')) {
      return "Étirements et récupération pour terminer la séance";
    } else {
      return "Exercices variés pour maintenir l'intensité";
    }
  }

  /**
   * Génère la configuration d'un exercice
   * @param {Object} exercice - Exercice à configurer
   * @param {number} blocIndex - Index du bloc
   * @param {number} nbBlocs - Nombre total de blocs
   * @returns {Object} - Configuration de l'exercice
   */
  generateExerciceConfig(exercice, blocIndex, nbBlocs) {
    // Déterminer les paramètres selon le type d'exercice
    let series = 1;
    let repetitions = 0;
    let temps_series = 0;
    let temps_repos_series = 0;
    
    if (exercice.type_nom === 'temps') {
      temps_series = 30 + Math.random() * 90; // 30s à 2min
    } else if (exercice.type_nom === 'repetitions') {
      repetitions = 8 + Math.floor(Math.random() * 12); // 8 à 20 répétitions
      series = 1 + Math.floor(Math.random() * 2); // 1 à 3 séries
      temps_repos_series = 30 + Math.random() * 60; // 30s à 1min30
    } else {
      // Par défaut
      temps_series = 60;
    }
    
    return {
      type: "exercice",
      id: exercice.id,
      series: Math.floor(series),
      repetitions: Math.floor(repetitions),
      temps_series: Math.floor(temps_series),
      temps_repos_series: Math.floor(temps_repos_series),
      temps_repos_exercice: 0
    };
  }

  /**
   * Génère le nom de la séance
   * @param {string} prompt - Prompt original
   * @param {boolean} isEchauffement - Si c'est un échauffement
   * @param {boolean} isRenforcement - Si c'est du renforcement
   * @param {boolean} isCardio - Si c'est du cardio
   * @param {boolean} isEtirement - Si ce sont des étirements
   * @param {boolean} isMobilite - Si c'est de la mobilité
   * @returns {string} - Nom de la séance
   */
  generateSeanceName(prompt, isEchauffement, isRenforcement, isCardio, isEtirement, isMobilite) {
    if (isEchauffement) return "Séance d'échauffement complète";
    if (isRenforcement) return "Séance de renforcement musculaire";
    if (isCardio) return "Séance cardio-training";
    if (isEtirement) return "Séance d'étirements";
    if (isMobilite) return "Séance de mobilité";
    
    // Extraire des mots-clés du prompt
    const words = prompt.split(' ').slice(0, 3);
    return `Séance ${words.join(' ')}`;
  }

  /**
   * Obtient l'ID de catégorie
   * @param {boolean} isEchauffement - Si c'est un échauffement
   * @param {boolean} isRenforcement - Si c'est du renforcement
   * @param {boolean} isCardio - Si c'est du cardio
   * @param {boolean} isEtirement - Si ce sont des étirements
   * @param {boolean} isMobilite - Si c'est de la mobilité
   * @returns {number} - ID de la catégorie
   */
  getCategorieId(isEchauffement, isRenforcement, isCardio, isEtirement, isMobilite) {
    if (isEchauffement) return 1;
    if (isMobilite) return 2;
    if (isRenforcement) return 3;
    if (isEtirement) return 4;
    if (isCardio) return 5;
    return 1; // échauffement par défaut
  }

  /**
   * Obtient le nombre de tours pour un bloc
   * @param {number} index - Index du bloc
   * @param {number} total - Nombre total de blocs
   * @returns {number} - Nombre de tours
   */
  getNbTours(index, total) {
    if (index === 0) return 1; // Premier bloc : 1 tour
    if (index === total - 1) return 1; // Dernier bloc : 1 tour
    return 2; // Blocs intermédiaires : 2 tours
  }

  /**
   * Obtient le temps de repos entre blocs
   * @param {number} index - Index du bloc
   * @param {number} total - Nombre total de blocs
   * @returns {number} - Temps de repos en secondes
   */
  getTempsReposBloc(index, total) {
    if (index === total - 1) return 0; // Dernier bloc : pas de repos
    return 60; // 1 minute entre les blocs
  }

  /**
   * Obtient le temps de repos entre exercices
   * @param {number} index - Index du bloc
   * @param {number} total - Nombre total de blocs
   * @returns {number} - Temps de repos en secondes
   */
  getTempsReposExercice(index, total) {
    if (index === 0) return 15; // Premier bloc : repos court
    if (index === total - 1) return 10; // Dernier bloc : repos très court
    return 30; // Blocs intermédiaires : repos moyen
  }

  /**
   * Suggère des exercices similaires
   * @param {string} searchTerm - Terme de recherche
   * @param {Array} exercices - Liste des exercices
   * @returns {Array} - Exercices suggérés
   */
  suggestExercices(searchTerm, exercices) {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    
    return exercices
      .filter(exo => 
        exo.nom.toLowerCase().includes(term) ||
        exo.categorie_nom?.toLowerCase().includes(term) ||
        exo.niveau_nom?.toLowerCase().includes(term)
      )
      .slice(0, 5);
  }
}

export default new AIService();
