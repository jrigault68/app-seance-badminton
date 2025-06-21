import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting server with keep-alive...');

// Démarrer le serveur principal
const server = spawn('node', ['backend/index.js'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

// Démarrer le script keep-alive
const keepAlive = spawn('node', ['backend/keep-alive.js'], {
  stdio: 'inherit',
  cwd: process.cwd()
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