const axios = require('axios');

// =====================================================
// SCRIPT DE TEST DES APIs
// =====================================================

const BASE_URL = 'http://localhost:5000';

async function testHealth() {
  console.log('🏥 Test du health check...');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check OK:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check échoué:', error.message);
    return false;
  }
}

async function testSupabasePing() {
  console.log('🔄 Test du ping Supabase...');
  
  try {
    const response = await axios.get(`${BASE_URL}/supabase-ping`);
    console.log('✅ Supabase ping OK:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Supabase ping échoué:', error.message);
    return false;
  }
}

async function testExercicesAPI() {
  console.log('💪 Test de l\'API exercices...');
  
  try {
    // Test GET /api/exercices
    const response = await axios.get(`${BASE_URL}/api/exercices`);
    console.log('✅ GET /api/exercices OK:', {
      count: response.data.exercices?.length || 0,
      pagination: response.data.pagination
    });
    
    // Test GET /api/exercices/categories/list
    const categoriesResponse = await axios.get(`${BASE_URL}/api/exercices/categories/list`);
    console.log('✅ GET /api/exercices/categories/list OK:', {
      count: categoriesResponse.data.categories?.length || 0
    });
    
    // Test GET /api/exercices/groupes/list
    const groupesResponse = await axios.get(`${BASE_URL}/api/exercices/groupes/list`);
    console.log('✅ GET /api/exercices/groupes/list OK:', {
      count: groupesResponse.data.groupes?.length || 0
    });
    
    // Test GET /api/exercices/niveaux/list
    const niveauxResponse = await axios.get(`${BASE_URL}/api/exercices/niveaux/list`);
    console.log('✅ GET /api/exercices/niveaux/list OK:', {
      count: niveauxResponse.data.niveaux?.length || 0
    });
    
    // Test GET /api/exercices/types/list
    const typesResponse = await axios.get(`${BASE_URL}/api/exercices/types/list`);
    console.log('✅ GET /api/exercices/types/list OK:', {
      count: typesResponse.data.types?.length || 0
    });
    
    return true;
  } catch (error) {
    console.error('❌ API exercices échoué:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
    return false;
  }
}

async function testSeancesAPI() {
  console.log('🏋️ Test de l\'API séances...');
  
  try {
    // Test GET /api/seances
    const response = await axios.get(`${BASE_URL}/api/seances`);
    console.log('✅ GET /api/seances OK:', {
      count: response.data.seances?.length || 0,
      pagination: response.data.pagination
    });
    
    return true;
  } catch (error) {
    console.error('❌ API séances échoué:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
    return false;
  }
}

async function testSessionsAPI() {
  console.log('⏱️ Test de l\'API sessions...');
  
  try {
    // Test GET /api/sessions (devrait retourner une erreur 401 sans token)
    try {
      await axios.get(`${BASE_URL}/api/sessions`);
      console.log('⚠️ GET /api/sessions devrait nécessiter une authentification');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ GET /api/sessions correctement protégé (401)');
      } else {
        console.log('⚠️ GET /api/sessions retourne:', error.response?.status);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ API sessions échoué:', error.message);
    return false;
  }
}

async function testFilters() {
  console.log('🔍 Test des filtres...');
  
  try {
    // Test filtre par catégorie
    const response = await axios.get(`${BASE_URL}/api/exercices?categorie=échauffement`);
    console.log('✅ Filtre par catégorie OK:', {
      count: response.data.exercices?.length || 0
    });
    
    // Test filtre par niveau
    const niveauResponse = await axios.get(`${BASE_URL}/api/exercices?niveau=facile`);
    console.log('✅ Filtre par niveau OK:', {
      count: niveauResponse.data.exercices?.length || 0
    });
    
    // Test recherche
    const searchResponse = await axios.get(`${BASE_URL}/api/exercices?search=pompe`);
    console.log('✅ Recherche OK:', {
      count: searchResponse.data.exercices?.length || 0
    });
    
    return true;
  } catch (error) {
    console.error('❌ Test des filtres échoué:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Début des tests des APIs...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'Supabase Ping', fn: testSupabasePing },
    { name: 'API Exercices', fn: testExercicesAPI },
    { name: 'API Séances', fn: testSeancesAPI },
    { name: 'API Sessions', fn: testSessionsAPI },
    { name: 'Filtres', fn: testFilters }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🧪 Test: ${test.name}`);
    console.log(`${'='.repeat(50)}`);
    
    const success = await test.fn();
    results.push({ name: test.name, success });
    
    if (success) {
      console.log(`✅ ${test.name}: SUCCÈS`);
    } else {
      console.log(`❌ ${test.name}: ÉCHEC`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log(`${'='.repeat(50)}`);
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Résultat: ${successCount}/${totalCount} tests réussis`);
  
  if (successCount === totalCount) {
    console.log('🎉 Tous les tests sont passés !');
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez la configuration.');
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testHealth,
  testSupabasePing,
  testExercicesAPI,
  testSeancesAPI,
  testSessionsAPI,
  testFilters
}; 