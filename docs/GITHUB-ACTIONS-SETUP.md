# Configuration GitHub Actions - Guide Détaillé

## 🎯 Objectif
Configurer GitHub Actions pour maintenir vos services Vercel et Render actifs en les pingant toutes les 5 minutes.

## 📋 Prérequis
- Un repository GitHub avec votre code
- Les URLs de vos services déployés

## 🚀 Étapes de configuration

### Étape 1: Vérifier la structure du projet

Assurez-vous que ces fichiers existent dans votre repo :
```
.github/
  workflows/
    keep-alive.yml
scripts/
  external-monitor.js
package.json
```

### Étape 2: Configurer les Secrets GitHub

1. **Aller sur votre repository GitHub**
   - Ouvrez votre repo dans le navigateur
   - Cliquez sur l'onglet "Settings" (en haut à droite)

2. **Accéder aux Secrets**
   - Dans le menu de gauche, cliquez sur "Secrets and variables"
   - Puis "Actions"

3. **Ajouter les secrets**
   - Cliquez sur "New repository secret"
   - Ajoutez ces deux secrets :

   **Secret 1:**
   - Name: `VERCEL_URL`
   - Value: `https://app-seance-badminton.vercel.app`
   - Cliquez "Add secret"

   **Secret 2:**
   - Name: `RENDER_URL`
   - Value: `https://api.csbw.fr/health`
   - Cliquez "Add secret"

### Étape 3: Vérifier le workflow

Le fichier `.github/workflows/keep-alive.yml` doit contenir :

```yaml
name: Keep Alive Monitor

on:
  schedule:
    # Exécuter toutes les 5 minutes
    - cron: '*/5 * * * *'
  workflow_dispatch: # Permet l'exécution manuelle

jobs:
  monitor:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run external monitoring
      run: node scripts/external-monitor.js
      env:
        VERCEL_URL: ${{ secrets.VERCEL_URL || 'https://app-seance-badminton.vercel.app' }}
        RENDER_URL: ${{ secrets.RENDER_URL || 'https://app-seance-badminton.onrender.com' }}
        
    - name: Notify on failure
      if: failure()
      run: |
        echo "🚨 Monitoring failed! Services might be down."
```

### Étape 4: Tester le workflow

1. **Test manuel**
   - Allez dans l'onglet "Actions" de votre repo
   - Cliquez sur "Keep Alive Monitor"
   - Cliquez sur "Run workflow" (bouton bleu)
   - Sélectionnez la branche (généralement `main`)
   - Cliquez "Run workflow"

2. **Vérifier l'exécution**
   - Cliquez sur la tâche qui vient de se lancer
   - Vérifiez que tous les steps sont verts (✅)
   - Regardez les logs pour voir les pings

### Étape 5: Vérifier le fonctionnement automatique

1. **Attendre la première exécution automatique**
   - Le workflow se lance automatiquement toutes les 5 minutes
   - Vous pouvez voir l'historique dans l'onglet "Actions"

2. **Vérifier les logs**
   - Cliquez sur une exécution récente
   - Dans le step "Run external monitoring", vous devriez voir :
   ```
   🔍 Starting external monitoring...
   🔄 Checking vercel at https://app-seance-badminton.vercel.app...
   ✅ vercel: OK (1234ms)
   🔄 Checking render at https://api.csbw.fr/health...
   ✅ render: OK (567ms)
   📊 Monitoring Summary:
   ✅ vercel: 1234ms
   ✅ render: 567ms
   🎉 All services are running!
   ```

## 🔧 Configuration avancée

### Modifier la fréquence

Pour changer la fréquence, modifiez la ligne `cron` dans le workflow :

```yaml
# Toutes les 3 minutes
- cron: '*/3 * * * *'

# Toutes les 10 minutes  
- cron: '*/10 * * * *'

# Toutes les heures
- cron: '0 * * * *'
```

### Ajouter des notifications

Pour recevoir des notifications en cas d'échec, vous pouvez ajouter :

```yaml
- name: Notify on failure
  if: failure()
  run: |
    echo "🚨 Monitoring failed! Services might be down."
    # Ajouter ici votre logique de notification
```

## 📊 Monitoring et maintenance

### Vérifier le statut
- **Onglet Actions** : Voir l'historique des exécutions
- **Logs** : Vérifier les temps de réponse
- **Échecs** : Identifier les problèmes

### Métriques importantes
- **Temps de réponse** : Doit être < 10 secondes
- **Taux de succès** : Doit être 100%
- **Fréquence** : Vérifier que ça s'exécute toutes les 5 minutes

### Troubleshooting

**Problème : Workflow ne se lance pas**
- Vérifier que le fichier `.github/workflows/keep-alive.yml` existe
- Vérifier la syntaxe YAML
- Vérifier que le repo est public ou que vous avez des minutes GitHub Actions

**Problème : Échecs répétés**
- Vérifier les URLs dans les secrets
- Tester manuellement les URLs
- Vérifier que vos services sont bien déployés

**Problème : Temps de réponse élevés**
- Normal pour le premier ping après une pause
- Vérifier la performance de vos services
- Optimiser le code si nécessaire

## 💰 Coûts

- **GitHub Actions** : Gratuit jusqu'à 2000 minutes/mois
- **Ce workflow** : ~288 minutes/mois (5 min × 24h × 30j)
- **Marge** : Large marge de sécurité

## ✅ Checklist de validation

- [ ] Fichier `.github/workflows/keep-alive.yml` créé
- [ ] Secrets `VERCEL_URL` et `RENDER_URL` configurés
- [ ] Test manuel réussi
- [ ] Exécution automatique fonctionne
- [ ] Logs montrent des pings réussis
- [ ] Temps de réponse acceptables

## 🎉 Résultat attendu

Après cette configuration :
- Vos services Vercel et Render resteront actifs
- Réduction drastique des temps de chargement lents
- Monitoring automatique de la disponibilité
- Notifications en cas de problème 