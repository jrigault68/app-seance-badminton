// Script de test local pour vérifier le monitoring
import fetch from 'node-fetch';

const SERVICES = {
  vercel: 'https://app-seance-badminton.vercel.app',
  render: 'https://api.csbw.fr/health'
};

async function testMonitoring() {
  console.log('🧪 Testing monitoring locally...\n');
  
  for (const [service, url] of Object.entries(SERVICES)) {
    try {
      console.log(`🔄 Testing ${service} at ${url}...`);
      
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        timeout: 30000,
        headers: {
          'User-Agent': 'Test-Monitor/1.0'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        console.log(`✅ ${service}: SUCCESS (${responseTime}ms)`);
      } else {
        console.log(`❌ ${service}: HTTP ${response.status} (${responseTime}ms)`);
      }
    } catch (error) {
      console.log(`❌ ${service}: ERROR - ${error.message}`);
    }
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  console.log('🎯 Test completed!');
  console.log('📝 If all tests pass, your GitHub Actions should work correctly.');
}

// Exécuter le test
testMonitoring().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
}); 