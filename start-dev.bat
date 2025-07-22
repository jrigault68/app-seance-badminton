@echo off
setlocal

REM Définir le chemin du dossier où se trouve ce script
set "BASE_DIR=%~dp0"

echo 🚀 Démarrage de l'environnement de développement...

REM === Dossier du backend ===
start "Backend" cmd /k "cd /d %BASE_DIR%backend && call npm install && call node index.js"

REM === Dossier du frontend ===
start "Frontend" cmd /k "cd /d %BASE_DIR% && call npm install && call npm run dev"

echo ✅ Les serveurs backend et frontend ont été lancés dans des fenêtres séparées.
