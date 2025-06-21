require("dotenv").config();
const supabase = require('./supabase');
const fs = require('fs');
const path = require('path');

// =====================================================
// SCRIPT DE MIGRATION DES DONNÉES EXISTANTES
// =====================================================

async function importExercices() {
  console.log('🔄 Import des exercices...');
  
  try {
    const exercices = [];
    const exercicesDir = path.join(__dirname, '../src/exercices');
    
    // Fonction récursive pour parcourir tous les sous-dossiers
    function parcourirDossiers(dirPath, categorie = null) {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          // C'est un sous-dossier, on le parcourt récursivement
          const nouvelleCategorie = categorie || item;
          parcourirDossiers(itemPath, nouvelleCategorie);
        } else if (stat.isFile() && item.endsWith('.js') && item !== 'index.js') {
          // C'est un fichier d'exercice, on le charge
          try {
            const exerciceId = path.basename(item, '.js');
            console.log(`📖 Chargement de l'exercice: ${exerciceId}`);
            
            // Charger le module d'exercice
            const exerciceModule = require(itemPath);
            
            // Extraire les données de l'exercice
            let exerciceData = {};
            
            // Gérer les différents types d'export (export default, export const, etc.)
            if (exerciceModule.default) {
              exerciceData = exerciceModule.default;
            } else if (exerciceModule[exerciceId]) {
              exerciceData = exerciceModule[exerciceId];
            } else {
              // Prendre la première propriété exportée
              const keys = Object.keys(exerciceModule);
              if (keys.length > 0) {
                exerciceData = exerciceModule[keys[0]];
              }
            }
            
            // Créer l'objet exercice enrichi
            const exercice = {
              id: exerciceId,
              nom: exerciceData.nom || exerciceId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              description: exerciceData.description || `Exercice ${exerciceId}`,
              position_depart: exerciceData.position_depart || "Position de départ à définir",
              categorie_id: null, // Sera mappé plus tard
              groupe_musculaire_id: null, // Sera mappé plus tard
              niveau_id: null, // Sera mappé plus tard
              type_id: null, // Sera mappé plus tard
              materiel: exerciceData.materiel || [],
              erreurs: exerciceData.erreurs || [],
              focus_zone: exerciceData.focus_zone || [],
              image_url: exerciceData.image_url || null,
              video_url: exerciceData.video_url || null,
              duree_estimee: exerciceData.duree_estimee || 60,
              calories_estimees: exerciceData.calories_estimees || 5,
              muscles_sollicites: exerciceData.muscles_sollicites || [],
              variantes: exerciceData.variantes || [],
              conseils: exerciceData.conseils || [],
              // Propriétés temporaires pour le mapping
              _categorie: exerciceData.categorie || categorie,
              _groupe_musculaire: exerciceData.groupe_musculaire || [],
              _niveau: exerciceData.niveau || 'débutant',
              _type: exerciceData.type || 'renforcement'
            };
            
            exercices.push(exercice);
            
          } catch (error) {
            console.error(`❌ Erreur lors du chargement de ${item}:`, error.message);
          }
        }
      }
    }
    
    // Parcourir tous les dossiers d'exercices
    parcourirDossiers(exercicesDir);
    
    console.log(`📊 ${exercices.length} exercices trouvés`);
    
    // Récupérer les données de référence pour le mapping
    const referenceData = await getReferenceData();
    if (!referenceData) {
      console.error('❌ Impossible de récupérer les données de référence pour le mapping');
      return false;
    }
    
    // Fonction pour mapper une valeur textuelle vers un ID
    function mapperValeurVersId(valeur, tableReference, champNom = 'nom') {
      if (!valeur) return null;
      
      const item = tableReference.find(item => 
        item[champNom].toLowerCase() === valeur.toLowerCase()
      );
      
      return item ? item.id : null;
    }
    
    // Fonction pour mapper un tableau de valeurs vers des IDs
    function mapperTableauVersIds(valeurs, tableReference, champNom = 'nom') {
      if (!Array.isArray(valeurs)) return [];
      
      return valeurs
        .map(valeur => mapperValeurVersId(valeur, tableReference, champNom))
        .filter(id => id !== null);
    }
    
    // Mapper les propriétés textuelles vers les IDs
    console.log('🔄 Mapping des propriétés...');
    
    for (const exercice of exercices) {
      // Mapper la catégorie
      exercice.categorie_id = mapperValeurVersId(exercice._categorie, referenceData.categories);
      
      // Mapper le niveau
      exercice.niveau_id = mapperValeurVersId(exercice._niveau, referenceData.niveaux);
      
      // Mapper le type
      exercice.type_id = mapperValeurVersId(exercice._type, referenceData.types);
      
      // Mapper les groupes musculaires (prendre le premier si c'est un tableau)
      const groupes = Array.isArray(exercice._groupe_musculaire) 
        ? exercice._groupe_musculaire 
        : [exercice._groupe_musculaire];
      
      const groupesIds = mapperTableauVersIds(groupes, referenceData.groupes);
      exercice.groupe_musculaire_id = groupesIds.length > 0 ? groupesIds[0] : null;
      
      // Nettoyer les propriétés temporaires
      delete exercice._categorie;
      delete exercice._groupe_musculaire;
      delete exercice._niveau;
      delete exercice._type;
    }
    
    // Insérer les exercices dans la base de données
    if (exercices.length > 0) {
      const { data, error } = await supabase
        .from('exercices')
        .insert(exercices)
        .select();
      
      if (error) {
        console.error('❌ Erreur lors de l\'insertion des exercices:', error);
        return false;
      }
      
      console.log(`✅ ${data.length} exercices importés avec succès`);
      
      // Afficher quelques statistiques
      const avecCategorie = data.filter(e => e.categorie_id).length;
      const avecNiveau = data.filter(e => e.niveau_id).length;
      const avecType = data.filter(e => e.type_id).length;
      const avecGroupe = data.filter(e => e.groupe_musculaire_id).length;
      
      console.log(`📊 Statistiques de mapping:`);
      console.log(`   - Avec catégorie: ${avecCategorie}/${data.length}`);
      console.log(`   - Avec niveau: ${avecNiveau}/${data.length}`);
      console.log(`   - Avec type: ${avecType}/${data.length}`);
      console.log(`   - Avec groupe musculaire: ${avecGroupe}/${data.length}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des exercices:', error);
    return false;
  }
}

async function importSeances() {
  console.log('🔄 Import des séances...');
  
  try {
    const seancesDir = path.join(__dirname, '../src/seances');
    const seances = [];
    
    // Parcourir les dossiers de séances
    const semaines = fs.readdirSync(seancesDir).filter(dir => 
      fs.statSync(path.join(seancesDir, dir)).isDirectory()
    );
    
    for (const semaine of semaines) {
      const semainePath = path.join(seancesDir, semaine);
      const seanceFiles = fs.readdirSync(semainePath).filter(file => 
        file.endsWith('.js')
      );
      
      for (const seanceFile of seanceFiles) {
        try {
          const seancePath = path.join(semainePath, seanceFile);
          const seanceContent = fs.readFileSync(seancePath, 'utf8');
          
          // Extraire les données de la séance (à adapter selon ta structure)
          const seanceId = path.basename(seanceFile, '.js');
          const seanceName = seanceId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          // Créer l'objet séance
          const seance = {
            id: seanceId,
            nom: seanceName,
            description: `Séance de ${semaine}`,
            niveau_id: null, // À mapper
            type_seance: 'mixte',
            categories: [],
            objectifs: [],
            duree_estimee: 45, // 45 minutes par défaut
            calories_estimees: 200, // 200 calories par défaut
            materiel_requis: [],
            structure: {}, // Structure à extraire du fichier JS
            notes: `Séance importée depuis ${semaine}/${seanceFile}`,
            tags: [semaine],
            difficulte_ressentie: null,
            note_utilisateur: null,
            nombre_utilisations: 0,
            est_publique: true,
            auteur_id: null // À définir
          };
          
          seances.push(seance);
          
        } catch (error) {
          console.error(`❌ Erreur lors de la lecture de ${seanceFile}:`, error.message);
        }
      }
    }
    
    console.log(`📊 ${seances.length} séances trouvées`);
    
    // Insérer les séances dans la base de données
    if (seances.length > 0) {
      const { data, error } = await supabase
        .from('seances')
        .insert(seances)
        .select();
      
      if (error) {
        console.error('❌ Erreur lors de l\'insertion des séances:', error);
        return false;
      }
      
      console.log(`✅ ${data.length} séances importées avec succès`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des séances:', error);
    return false;
  }
}

async function getReferenceData() {
  console.log('🔄 Récupération des données de référence...');
  
  try {
    // Récupérer les catégories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories_exercices')
      .select('*');
    
    if (categoriesError) {
      console.error('❌ Erreur lors de la récupération des catégories:', categoriesError);
      return null;
    }
    
    // Récupérer les groupes musculaires
    const { data: groupes, error: groupesError } = await supabase
      .from('groupes_musculaires')
      .select('*');
    
    if (groupesError) {
      console.error('❌ Erreur lors de la récupération des groupes musculaires:', groupesError);
      return null;
    }
    
    // Récupérer les niveaux
    const { data: niveaux, error: niveauxError } = await supabase
      .from('niveaux_difficulte')
      .select('*');
    
    if (niveauxError) {
      console.error('❌ Erreur lors de la récupération des niveaux:', niveauxError);
      return null;
    }
    
    // Récupérer les types
    const { data: types, error: typesError } = await supabase
      .from('types_exercices')
      .select('*');
    
    if (typesError) {
      console.error('❌ Erreur lors de la récupération des types:', typesError);
      return null;
    }
    
    console.log('✅ Données de référence récupérées');
    
    return {
      categories,
      groupes,
      niveaux,
      types
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données de référence:', error);
    return null;
  }
}

async function clearTables() {
  console.log('🧹 Nettoyage des tables existantes...');
  
  try {
    // Supprimer les données dans l'ordre pour respecter les contraintes de clés étrangères
    const tablesToClear = [
      'exercices_completes',
      'exercices',
      'seances_personnalisees', 
      'seances'
    ];
    
    for (const table of tablesToClear) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', 'dummy'); // Supprimer toutes les lignes
        
        if (error) {
          console.log(`⚠️ Erreur lors du nettoyage de ${table}:`, error.message);
        } else {
          console.log(`✅ Table ${table} nettoyée`);
        }
      } catch (tableError) {
        console.log(`⚠️ Impossible de nettoyer ${table}:`, tableError.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des tables:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Début de la migration des données...');
  
  // Vérifier la connexion Supabase
  if (!supabase) {
    console.error('❌ Connexion Supabase non disponible');
    process.exit(1);
  }
  
  // Nettoyer les tables existantes
  const clearSuccess = await clearTables();
  if (!clearSuccess) {
    console.error('❌ Échec du nettoyage des tables');
    process.exit(1);
  }
  
  // Récupérer les données de référence
  const referenceData = await getReferenceData();
  if (!referenceData) {
    console.error('❌ Impossible de récupérer les données de référence');
    process.exit(1);
  }
  
  // Importer les exercices
  const exercicesSuccess = await importExercices();
  if (!exercicesSuccess) {
    console.error('❌ Échec de l\'import des exercices');
    process.exit(1);
  }
  
  // Importer les séances
  const seancesSuccess = await importSeances();
  if (!seancesSuccess) {
    console.error('❌ Échec de l\'import des séances');
    process.exit(1);
  }
  
  console.log('✅ Migration terminée avec succès !');
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  importExercices,
  importSeances,
  getReferenceData
}; 