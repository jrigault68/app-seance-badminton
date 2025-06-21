# Déploiement Render - Guide Anti-Reload

## 🚀 Configuration Optimisée

### Variables d'environnement Render

Assurez-vous d'avoir ces variables dans votre service Render :

```bash
NODE_ENV=production
PORT=10000
RENDER_EXTERNAL_URL=https://votre-app.onrender.com
SUPABASE_URL=votre-supabase-url
SUPABASE_ANON_KEY=votre-supabase-anon-key
SUPABASE_SERVICE_KEY=votre-supabase-service-key
```

### Script de démarrage

Le projet utilise maintenant `start-render.js` qui :
- Démarrer le serveur principal
- Lance automatiquement le keep-alive en production
- Gère proprement les signaux d'arrêt

## 🔄 Système Keep-Alive

### Keep-Alive Interne (Automatique)

Le script `keep-alive.js` :
- Ping le serveur toutes les 5 minutes
- Ping Supabase toutes les 5 minutes
- Gère les échecs consécutifs
- Logs détaillés pour le debugging

### Monitoring Externe (Recommandé)

Pour une protection maximale, utilisez un service externe :

#### Option 1: UptimeRobot (Gratuit)
1. Créez un compte sur [UptimeRobot](https://uptimerobot.com)
2. Ajoutez un nouveau monitor :
   - Type: HTTP(s)
   - URL: `https://votre-app.onrender.com/health`
   - Interval: 5 minutes
   - Alert: Email/SMS en cas d'échec

#### Option 2: Cron-job.org (Gratuit)
1. Créez un compte sur [Cron-job.org](https://cron-job.org)
2. Créez un nouveau cron job :
   - URL: `https://votre-app.onrender.com/ping`
   - Schedule: Toutes les 4 minutes
   - Timeout: 30 secondes

#### Option 3: Script de monitoring local
```bash
# Exécuter sur votre machine ou un serveur
node monitor-external.js
```

## 📊 Routes de Monitoring

### `/health`
- Statut général du serveur
- Uptime et environnement
- Réponse JSON complète

### `/ping`
- Test simple de connectivité
- Réponse: "pong"

### `/supabase-ping`
- Test de connexion Supabase
- Vérifie que la base de données est accessible

## 🛠️ Debugging

### Logs Render
```bash
# Dans le dashboard Render, vérifiez les logs pour :
✅ "Keep-alive script started"
✅ "Server pinged successfully"
✅ "Supabase pinged successfully"
```

### Test manuel
```bash
# Testez votre serveur manuellement
curl https://votre-app.onrender.com/health
curl https://votre-app.onrender.com/ping
curl https://votre-app.onrender.com/supabase-ping
```

## ⚠️ Problèmes Courants

### 1. Reloads fréquents
**Cause** : Pas de trafic pendant 15+ minutes
**Solution** : Utilisez un service de monitoring externe

### 2. Keep-alive ne démarre pas
**Cause** : Variables d'environnement manquantes
**Solution** : Vérifiez `RENDER_EXTERNAL_URL` et `SUPABASE_*`

### 3. Erreurs de connexion
**Cause** : Timeout ou réseau instable
**Solution** : Augmentez les timeouts dans les scripts

## 🔧 Maintenance

### Mise à jour du code
1. Push sur votre repo
2. Render redéploie automatiquement
3. Le keep-alive redémarre automatiquement

### Monitoring des performances
- Surveillez les logs Render
- Vérifiez les temps de réponse
- Ajustez les intervalles si nécessaire

## 📈 Métriques Recommandées

- **Uptime** : > 99.5%
- **Temps de réponse** : < 2 secondes
- **Pings réussis** : > 95%
- **Reloads** : < 1 par jour

## 🆘 Support

En cas de problème :
1. Vérifiez les logs Render
2. Testez les routes de monitoring
3. Vérifiez les variables d'environnement
4. Contactez le support si nécessaire 