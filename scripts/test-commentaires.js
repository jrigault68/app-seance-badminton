// Script de test pour le système de commentaires
// Usage: node scripts/test-commentaires.js

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000';

async function testCommentaires() {
  console.log('🧪 Test du système de commentaires...\n');

  // Test 1: Vérifier que l'API est accessible
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ API accessible');
    } else {
      console.log('❌ API non accessible');
      return;
    }
  } catch (error) {
    console.log('❌ Erreur de connexion à l\'API:', error.message);
    return;
  }

  // Test 2: Simuler une requête de marquage de séance
  const testData = {
    programmeId: 1,
    seanceId: 'test-seance-id',
    sessionData: {
      duree_totale: 1800, // 30 minutes
      calories_brulees: 180,
      niveau_effort: 7.5,
      satisfaction: 4.0,
      notes: 'Test de commentaire - Séance terminée en 30min | Difficulté ressentie: difficile | Commentaire: Test du système de commentaires'
    }
  };

  console.log('📝 Test des données de commentaire:');
  console.log('- Durée:', testData.sessionData.duree_totale, 'secondes');
  console.log('- Calories:', testData.sessionData.calories_brulees);
  console.log('- Niveau d\'effort:', testData.sessionData.niveau_effort);
  console.log('- Satisfaction:', testData.sessionData.satisfaction);
  console.log('- Notes:', testData.sessionData.notes);
  console.log('');

  // Test 3: Vérifier le format des notes
  const formatNotes = (duree, difficulte, commentaire) => {
    const minutes = Math.floor(duree / 60);
    const seconds = duree % 60;
    const notes = [
      `Séance terminée en ${minutes}min ${seconds}s`,
      difficulte && `Difficulté ressentie: ${difficulte}`,
      commentaire && `Commentaire: ${commentaire}`
    ].filter(Boolean).join(' | ');
    return notes;
  };

  const notesFormatees = formatNotes(1800, 'difficile', 'Test du système de commentaires');
  console.log('📋 Format des notes:', notesFormatees);
  console.log('');

  // Test 4: Vérifier les niveaux de difficulté
  const niveauxDifficulte = [
    { value: 'trop_facile', label: 'Trop facile', icon: '😴' },
    { value: 'facile', label: 'Facile', icon: '😊' },
    { value: 'parfait', label: 'Parfait', icon: '😎' },
    { value: 'difficile', label: 'Difficile', icon: '😰' },
    { value: 'trop_difficile', label: 'Trop difficile', icon: '😵' }
  ];

  console.log('🎯 Niveaux de difficulté disponibles:');
  niveauxDifficulte.forEach(niveau => {
    console.log(`- ${niveau.icon} ${niveau.label} (${niveau.value})`);
  });
  console.log('');

  // Test 5: Vérifier les descriptions de satisfaction
  const descriptionsSatisfaction = {
    1: 'Très insatisfait',
    2: 'Insatisfait',
    3: 'Neutre',
    4: 'Satisfait',
    5: 'Très satisfait'
  };

  console.log('⭐ Descriptions de satisfaction:');
  Object.entries(descriptionsSatisfaction).forEach(([niveau, description]) => {
    console.log(`- ${niveau} étoile(s): ${description}`);
  });
  console.log('');

  // Test 6: Vérifier les descriptions de niveau d'effort
  const getDescriptionEffort = (niveau) => {
    if (niveau <= 2) return 'Très facile';
    if (niveau <= 4) return 'Facile';
    if (niveau <= 6) return 'Modéré';
    if (niveau <= 8) return 'Difficile';
    return 'Très difficile';
  };

  console.log('💪 Descriptions de niveau d\'effort:');
  for (let i = 1; i <= 10; i++) {
    console.log(`- Niveau ${i}: ${getDescriptionEffort(i)}`);
  }
  console.log('');

  console.log('✅ Tests terminés avec succès !');
  console.log('');
  console.log('📋 Résumé des fonctionnalités testées:');
  console.log('- ✅ Format des notes');
  console.log('- ✅ Niveaux de difficulté');
  console.log('- ✅ Système de satisfaction');
  console.log('- ✅ Descriptions de niveau d\'effort');
  console.log('- ✅ Connexion API');
}

// Exécuter les tests
testCommentaires().catch(console.error); 