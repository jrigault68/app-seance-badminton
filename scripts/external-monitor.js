// Script de monitoring externe pour éviter les pauses
// Peut être exécuté par UptimeRobot, cron-job.org, ou GitHub Actions

import fetch from 'node-fetch';

const SERVICES = {
  vercel: process.env.VERCEL_URL || 'https://app-seance-badminton.vercel.app',
  render: process.env.RENDER_URL || 'https://app-seance-badminton.onrender.com'
};

async function monitorServices() {
  console.log('🔍 Starting external monitoring...');
  const results = {};

  for (const [service, url] of Object.entries(SERVICES)) {
    try {
      console.log(`🔄 Checking ${service} at ${url}...`);
      
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        timeout: 30000, // 30 secondes
        headers: {
          'User-Agent': 'External-Monitor/1.0'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        results[service] = {
          status: 'success',
          responseTime,
          statusCode: response.status
        };
        console.log(`✅ ${service}: OK (${responseTime}ms)`);
      } else {
        results[service] = {
          status: 'error',
          statusCode: response.status,
          error: `HTTP ${response.status}`
        };
        console.log(`❌ ${service}: HTTP ${response.status}`);
      }
    } catch (error) {
      results[service] = {
        status: 'error',
        error: error.message
      };
      console.log(`❌ ${service}: ${error.message}`);
    }
  }

  // Afficher le résumé
  console.log('\n📊 Monitoring Summary:');
  for (const [service, result] of Object.entries(results)) {
    if (result.status === 'success') {
      console.log(`✅ ${service}: ${result.responseTime}ms`);
    } else {
      console.log(`❌ ${service}: ${result.error}`);
    }
  }

  // Retourner un code d'erreur si au moins un service est en échec
  const hasErrors = Object.values(results).some(r => r.status === 'error');
  if (hasErrors) {
    console.log('\n🚨 Some services are down!');
    process.exit(1);
  } else {
    console.log('\n🎉 All services are running!');
    process.exit(0);
  }
}

// Exécuter le monitoring
monitorServices().catch(error => {
  console.error('💥 Monitoring failed:', error);
  process.exit(1);
}); 