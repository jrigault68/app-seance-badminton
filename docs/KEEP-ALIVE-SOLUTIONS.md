# Solutions pour éviter les pauses d'inactivité

## Problème
Vercel et Render mettent en pause les applications gratuites après une période d'inactivité, ce qui peut causer des temps de chargement lents lors de la première visite.

## Solutions mises en place

### 1. Keep-Alive Interne (Déjà en place)
- **Fichier**: `backend/keep-alive.js`
- **Fréquence**: Toutes les 3 minutes
- **Fonction**: Ping le serveur Render et Supabase
- **Avantage**: Solution intégrée, pas de service externe

### 2. Monitoring Externe GitHub Actions
- **Fichier**: `.github/workflows/keep-alive.yml`
- **Fréquence**: Toutes les 5 minutes
- **Fonction**: Ping Vercel et Render depuis GitHub
- **Avantage**: Gratuit, fiable, notifications possibles

### 3. Script de Monitoring Externe
- **Fichier**: `scripts/external-monitor.js`
- **Usage**: Peut être exécuté par des services tiers
- **Fonction**: Vérifie la disponibilité des services

## Services de monitoring gratuits recommandés

### UptimeRobot
1. Créer un compte sur [uptimerobot.com](https://uptimerobot.com)
2. Ajouter un nouveau monitor
3. URL: `https://app-seance-badminton.vercel.app`
4. Type: HTTP(s)
5. Intervalle: 5 minutes
6. Notifications: Email/Slack

### Cron-job.org
1. Créer un compte sur [cron-job.org](https://cron-job.org)
2. Créer un nouveau cron job
3. URL: `https://app-seance-badminton.vercel.app`
4. Schedule: `*/5 * * * *` (toutes les 5 minutes)

### Pingdom
1. Créer un compte sur [pingdom.com](https://pingdom.com)
2. Ajouter un nouveau check
3. URL: `https://app-seance-badminton.vercel.app`
4. Intervalle: 1 minute (gratuit)

## Configuration des variables d'environnement

### GitHub Secrets (pour GitHub Actions)
```bash
VERCEL_URL=https://app-seance-badminton.vercel.app
RENDER_URL=https://app-seance-badminton.onrender.com
```

### Variables d'environnement Render
```bash
RENDER_EXTERNAL_URL=https://app-seance-badminton.onrender.com
```

## Commandes utiles

```bash
# Démarrer le serveur avec keep-alive
npm run server:keepalive

# Tester le monitoring externe
npm run monitor

# Démarrer le keep-alive Vercel
npm run vercel-keepalive
```

## Stratégie recommandée

1. **Solution principale**: GitHub Actions (gratuit, fiable)
2. **Solution de secours**: UptimeRobot ou Cron-job.org
3. **Keep-alive interne**: Continue à fonctionner sur Render

## Monitoring et alertes

### GitHub Actions
- Exécution automatique toutes les 5 minutes
- Notifications en cas d'échec
- Logs disponibles dans l'onglet Actions

### Services externes
- Notifications par email/Slack
- Dashboard de monitoring
- Historique des temps de réponse

## Optimisations supplémentaires

### Vercel
- Utiliser les Edge Functions pour réduire le cold start
- Optimiser le bundle size
- Utiliser le cache Vercel

### Render
- Optimiser le code pour un démarrage rapide
- Utiliser les variables d'environnement appropriées
- Monitorer les logs pour détecter les problèmes

## Coûts
- **GitHub Actions**: Gratuit (2000 minutes/mois)
- **UptimeRobot**: Gratuit (50 monitors)
- **Cron-job.org**: Gratuit (5 jobs)
- **Pingdom**: Gratuit (1 check)

## Maintenance
- Vérifier les logs GitHub Actions régulièrement
- Surveiller les notifications d'échec
- Mettre à jour les URLs si nécessaire
- Tester manuellement le monitoring périodiquement 