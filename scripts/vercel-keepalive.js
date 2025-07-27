// Script pour maintenir le frontend Vercel actif
import fetch from 'node-fetch';

const VERCEL_URL = process.env.VERCEL_URL || 'https://app-seance-badminton.vercel.app';
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes

let consecutiveFailures = 0;
const MAX_FAILURES = 3;

async function pingVercel() {
  try {
    console.log(`🔄 Pinging Vercel frontend at ${VERCEL_URL}...`);
    const response = await fetch(VERCEL_URL, {
      method: 'GET',
      timeout: 15000, // 15 secondes de timeout
      headers: {
        'User-Agent': 'Vercel-Keep-Alive/1.0'
      }
    });
    
    if (response.ok) {
      console.log(`✅ Vercel frontend pinged successfully at ${new Date().toISOString()}`);
      consecutiveFailures = 0;
    } else {
      console.log(`⚠️ Vercel responded with status: ${response.status}`);
      consecutiveFailures++;
    }
  } catch (error) {
    console.error(`❌ Failed to ping Vercel: ${error.message}`);
    consecutiveFailures++;
    
    if (consecutiveFailures >= MAX_FAILURES) {
      console.error(`🚨 Too many consecutive failures (${consecutiveFailures}). Exiting...`);
      process.exit(1);
    }
  }
}

// Ping immédiatement au démarrage
console.log('🚀 Vercel keep-alive script starting...');
console.log(`📡 Vercel URL: ${VERCEL_URL}`);
console.log(`⏰ Interval: ${KEEP_ALIVE_INTERVAL / 1000} seconds`);

pingVercel();

// Puis toutes les 10 minutes
const interval = setInterval(pingVercel, KEEP_ALIVE_INTERVAL);

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Vercel keep-alive script shutting down...');
  clearInterval(interval);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Vercel keep-alive script shutting down...');
  clearInterval(interval);
  process.exit(0);
});

console.log(`🔄 Vercel keep-alive script started. Pinging frontend every ${KEEP_ALIVE_INTERVAL / 1000} seconds`); 