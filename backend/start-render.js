import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting server optimized for Render...');

// Variables d'environnement pour Render
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5000;

console.log(`📊 Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`🔌 Port: ${port}`);

// Démarrer le serveur principal
const server = spawn('node', ['index.js'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    PORT: port
  }
});

// En production, démarrer aussi le keep-alive
if (isProduction) {
  console.log('🔄 Starting keep-alive script for production...');
  
  const keepAlive = spawn('node', ['keep-alive.js'], {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL
    }
  });

  // Gérer l'arrêt du keep-alive
  keepAlive.on('exit', (code) => {
    console.log(`🛑 Keep-alive process exited with code ${code}`);
  });

  // Gérer l'arrêt propre
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    server.kill('SIGINT');
    keepAlive.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down...');
    server.kill('SIGTERM');
    keepAlive.kill('SIGTERM');
    process.exit(0);
  });
} else {
  // En développement, juste le serveur
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    server.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down...');
    server.kill('SIGTERM');
    process.exit(0);
  });
}

// Gérer les erreurs du serveur
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`🛑 Server process exited with code ${code}`);
  process.exit(code);
});

console.log('✅ Server startup process completed'); 