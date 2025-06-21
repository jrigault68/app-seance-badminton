import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint de health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint de ping simple
router.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Endpoint pour maintenir Supabase actif
router.get('/supabase-ping', async (req, res) => {
  try {
    // Faire une requête simple pour maintenir Supabase actif
    const { data, error } = await supabase
      .from('users') // Remplace par une table qui existe
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`⚠️ Supabase ping warning: ${error.message}`);
      res.status(200).json({
        status: 'OK',
        supabase: 'warning',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`✅ Supabase pinged successfully`);
      res.status(200).json({
        status: 'OK',
        supabase: 'active',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error(`❌ Failed to ping Supabase: ${error.message}`);
    res.status(500).json({
      status: 'ERROR',
      supabase: 'inactive',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 