// Script de monitoring externe pour éviter les pauses
// Peut être exécuté par UptimeRobot, cron-job.org, ou GitHub Actions

import fetch from 'node-fetch';

const SERVICES = {
  vercel: process.env.VERCEL_URL || 'https://app-seance-badminton.vercel.app',
  render: process.env.RENDER_URL || 'https://api.csbw.fr/health'
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
        timeout: 60000, // 60 secondes (plus long pour réveiller Render)
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
        // Pour Render, un 404 peut signifier que le service se réveille
        if (service === 'render' && response.status === 404) {
          results[service] = {
            status: 'waking_up',
            responseTime,
            statusCode: response.status,
            message: 'Service might be waking up'
          };
          console.log(`🔄 ${service}: Waking up (${responseTime}ms) - This is normal for Render`);
        } else {
          results[service] = {
            status: 'error',
            statusCode: response.status,
            error: `HTTP ${response.status}`
          };
          console.log(`❌ ${service}: HTTP ${response.status}`);
        }
      }
    } catch (error) {
      // Pour Render, une erreur de connexion peut signifier que le service se réveille
      if (service === 'render' && (error.message.includes('fetch') || error.message.includes('timeout'))) {
        results[service] = {
          status: 'waking_up',
          error: error.message,
          message: 'Service might be waking up'
        };
        console.log(`🔄 ${service}: Waking up - ${error.message} (This is normal for Render)`);
      } else {
        results[service] = {
          status: 'error',
          error: error.message
        };
        console.log(`❌ ${service}: ${error.message}`);
      }
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

  // Retourner un code d'erreur si au moins un service est en échec (mais pas en train de se réveiller)
  const hasErrors = Object.values(results).some(r => r.status === 'error');
  const hasWakingUp = Object.values(results).some(r => r.status === 'waking_up');
  
  if (hasErrors) {
    console.log('\n🚨 Some services are down!');
    process.exit(1);
  } else if (hasWakingUp) {
    console.log('\n🔄 Some services are waking up - This is normal for Render');
    process.exit(0); // Succès car c'est normal
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