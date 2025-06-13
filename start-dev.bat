@echo off
setlocal

echo 🚀 Démarrage de l'environnement de développement...

REM === Dossier du backend ===
start "Backend" cmd /k "cd C:\Users\jerem\OneDrive - EDOX FRANCE SAS\Perso\Sports\app-seance-badminton\backend && call npm install && call node index.js"

REM === Dossier du frontend ===
start "Frontend" cmd /k "cd C:\Users\jerem\OneDrive - EDOX FRANCE SAS\Perso\Sports\app-seance-badminton && call npm install && call npm run dev"

echo ✅ Les serveurs backend et frontend ont été lancés dans des fenêtres séparées.
