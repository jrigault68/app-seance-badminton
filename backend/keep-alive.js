// Script pour maintenir le serveur et Supabase actifs
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const KEEP_ALIVE_INTERVAL = 3 * 60 * 1000; // 3 minutes (plus fréquent pour éviter les pauses)
const SERVER_URL = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL || 'https://ton-app.vercel.app';

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

let consecutiveFailures = 0;
const MAX_FAILURES = 3;

async function pingServer() {
  try {
    console.log(`🔄 Pinging server at ${SERVER_URL}/health...`);
    const response = await fetch(`${SERVER_URL}/health`, {
      method: 'GET',
      timeout: 10000, // 10 secondes de timeout
      headers: {
        'User-Agent': 'Keep-Alive-Script/1.0'
      }
    });
    
    if (response.ok) {
      console.log(`✅ Server pinged successfully at ${new Date().toISOString()}`);
      consecutiveFailures = 0;
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}`);
      consecutiveFailures++;
    }
  } catch (error) {
    console.error(`❌ Failed to ping server: ${error.message}`);
    consecutiveFailures++;
    
    if (consecutiveFailures >= MAX_FAILURES) {
      console.error(`🚨 Too many consecutive failures (${consecutiveFailures}). Exiting...`);
      process.exit(1);
    }
  }
}

async function pingSupabase() {
  try {
    console.log('🔄 Pinging Supabase...');
    // Faire une requête simple pour maintenir Supabase actif
    const { data, error } = await supabase
      .from('utilisateurs')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`⚠️ Supabase ping warning: ${error.message}`);
    } else {
      console.log(`✅ Supabase pinged successfully at ${new Date().toISOString()}`);
    }
  } catch (error) {
    console.error(`❌ Failed to ping Supabase: ${error.message}`);
  }
}

async function keepAlive() {
  console.log(`\n🕐 Keep-alive cycle started at ${new Date().toISOString()}`);
  
  try {
    await Promise.allSettled([
      pingServer(),
      pingSupabase()
    ]);
  } catch (error) {
    console.error(`❌ Keep-alive cycle failed: ${error.message}`);
  }
  
  console.log(`✅ Keep-alive cycle completed at ${new Date().toISOString()}`);
}

// Ping immédiatement au démarrage
console.log('🚀 Keep-alive script starting...');
console.log(`📡 Server URL: ${SERVER_URL}`);
console.log(`⏰ Interval: ${KEEP_ALIVE_INTERVAL / 1000} seconds`);

keepAlive();

// Puis toutes les 5 minutes
const interval = setInterval(keepAlive, KEEP_ALIVE_INTERVAL);

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Keep-alive script shutting down...');
  clearInterval(interval);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Keep-alive script shutting down...');
  clearInterval(interval);
  process.exit(0);
});

console.log(`🔄 Keep-alive script started. Pinging server and Supabase every ${KEEP_ALIVE_INTERVAL / 1000} seconds`); 