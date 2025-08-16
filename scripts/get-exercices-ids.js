#!/usr/bin/env node

/**
 * Script pour récupérer la liste des exercices avec leurs IDs exacts
 * Utile pour l'aide à l'IA lors de la génération de séances
 */

import fetch from 'node-fetch';

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';

async function getExercicesIds() {
  try {
    console.log('🔍 Récupération des exercices depuis l\'API...');
    
    const response = await fetch(`${API_URL}/exercices?limit=1000`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    const exercices = Array.isArray(data) ? data : (data.exercices || []);
    
    if (exercices.length === 0) {
      console.log('❌ Aucun exercice trouvé');
      return;
    }
    
    console.log(`✅ ${exercices.length} exercices trouvés\n`);
    
    // Grouper par catégorie
    const exercicesParCategorie = {};
    
    exercices.forEach(exo => {
      const categorie = exo.categorie_nom || 'Sans catégorie';
      if (!exercicesParCategorie[categorie]) {
        exercicesParCategorie[categorie] = [];
      }
      exercicesParCategorie[categorie].push({
        id: exo.id,
        nom: exo.nom,
        niveau: exo.niveau_nom || 'N/A',
        type: exo.type_nom || 'N/A'
      });
    });
    
    // Afficher les exercices par catégorie
    Object.keys(exercicesParCategorie).sort().forEach(categorie => {
      console.log(`\n📂 ${categorie.toUpperCase()} (${exercicesParCategorie[categorie].length} exercices):`);
      console.log('─'.repeat(80));
      
      exercicesParCategorie[categorie].forEach(exo => {
        console.log(`  • ${exo.id} - ${exo.nom} (${exo.niveau}, ${exo.type})`);
      });
    });
    
    // Générer le JSON pour l'IA
    console.log('\n\n🤖 JSON pour l\'IA:');
    console.log('─'.repeat(80));
    
    const exercicesForAI = exercices.map(exo => ({
      id: exo.id,
      nom: exo.nom,
      categorie: exo.categorie_nom,
      niveau: exo.niveau_nom,
      type: exo.type_nom
    }));
    
    console.log(JSON.stringify(exercicesForAI, null, 2));
    
    // Générer la liste simple des IDs
    console.log('\n\n📋 Liste simple des IDs:');
    console.log('─'.repeat(80));
    exercices.forEach(exo => {
      console.log(`"${exo.id}",`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
getExercicesIds();
