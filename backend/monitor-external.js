// Script de monitoring externe pour maintenir le serveur actif
// Peut être exécuté par un service comme UptimeRobot, Cron-job.org, etc.

import fetch from 'node-fetch';

const SERVER_URL = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL || 'https://ton-app.vercel.app';
const MONITOR_INTERVAL = 4 * 60 * 1000; // 4 minutes

async function monitorServer() {
  const timestamp = new Date().toISOString();
  console.log(`🕐 [${timestamp}] Monitoring server at ${SERVER_URL}...`);

  try {
    // Test de la route health
    const healthResponse = await fetch(`${SERVER_URL}/health`, {
      method: 'GET',
      timeout: 15000,
      headers: {
        'User-Agent': 'External-Monitor/1.0'
      }
    });

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`✅ Health check passed:`, healthData);
    } else {
      console.log(`⚠️ Health check failed with status: ${healthResponse.status}`);
    }

    // Test de la route ping
    const pingResponse = await fetch(`${SERVER_URL}/ping`, {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'External-Monitor/1.0'
      }
    });

    if (pingResponse.ok) {
      const pingData = await pingResponse.text();
      console.log(`✅ Ping check passed: ${pingData}`);
    } else {
      console.log(`⚠️ Ping check failed with status: ${pingResponse.status}`);
    }

    // Test de Supabase
    const supabaseResponse = await fetch(`${SERVER_URL}/supabase-ping`, {
      method: 'GET',
      timeout: 15000,
      headers: {
        'User-Agent': 'External-Monitor/1.0'
      }
    });

    if (supabaseResponse.ok) {
      const supabaseData = await supabaseResponse.json();
      console.log(`✅ Supabase check passed:`, supabaseData);
    } else {
      console.log(`⚠️ Supabase check failed with status: ${supabaseResponse.status}`);
    }

  } catch (error) {
    console.error(`❌ Monitoring failed: ${error.message}`);
  }

  console.log(`✅ Monitoring cycle completed at ${new Date().toISOString()}\n`);
}

// Exécution immédiate
monitorServer();

// Puis toutes les 4 minutes
setInterval(monitorServer, MONITOR_INTERVAL);

console.log(`🔄 External monitor started. Checking server every ${MONITOR_INTERVAL / 1000} seconds`);
console.log(`📡 Server URL: ${SERVER_URL}`);

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 External monitor shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 External monitor shutting down...');
  process.exit(0);
}); 