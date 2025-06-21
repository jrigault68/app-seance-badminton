// Script pour maintenir le serveur et Supabase actifs
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes
const SERVER_URL = process.env.SERVER_URL || 'https://ton-app.vercel.app';

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function pingServer() {
  try {
    const response = await fetch(`${SERVER_URL}/api/health`);
    if (response.ok) {
      console.log(`✅ Server pinged successfully at ${new Date().toISOString()}`);
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Failed to ping server: ${error.message}`);
  }
}

async function pingSupabase() {
  try {
    // Faire une requête simple pour maintenir Supabase actif
    const { data, error } = await supabase
      .from('users') // Remplace par une table qui existe
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
  await Promise.all([
    pingServer(),
    pingSupabase()
  ]);
}

// Ping immédiatement au démarrage
keepAlive();

// Puis toutes les 10 minutes
setInterval(keepAlive, KEEP_ALIVE_INTERVAL);

console.log(`🔄 Keep-alive script started. Pinging server and Supabase every 10 minutes`); 