# 🏸 Déploiement des Exercices de Badminton

Ce dossier contient tous les scripts nécessaires pour déployer les 111 exercices de badminton dans votre base de données.

## 📁 Structure des fichiers

```
docs/
├── deploy-exercices.sql                    # Script principal de nettoyage et validation
├── deploy-all-exercices.ps1               # Script PowerShell automatisé
├── README-DEPLOIEMENT.md                  # Ce fichier
├── insert-exercices-echauffement.sql      # 15 exercices d'échauffement
├── insert-exercices-mobilite.sql          # 12 exercices de mobilité
├── insert-exercices-renforcement.sql      # 20 exercices de renforcement
├── insert-exercices-etirement.sql         # 16 exercices d'étirement
├── insert-exercices-cardio.sql            # 20 exercices de cardio
├── insert-exercices-gainage.sql           # 16 exercices de gainage
└── insert-exercices-recuperation-active.sql # 12 exercices de récupération active
```

## 🎯 Résumé des exercices

| Catégorie | Nombre | Niveaux | Description |
|-----------|--------|---------|-------------|
| **Échauffement** | 15 | Facile → Intermédiaire | Préparation musculaire et articulaire |
| **Mobilité** | 12 | Facile → Difficile | Amélioration de l'amplitude articulaire |
| **Renforcement** | 20 | Intermédiaire → Expert | Développement de la force |
| **Étirements** | 16 | Facile → Difficile | Assouplissement et récupération |
| **Cardio** | 20 | Intermédiaire → Expert | Endurance cardiovasculaire |
| **Gainage** | 16 | Intermédiaire → Expert | Stabilité et renforcement du tronc |
| **Récupération active** | 12 | Facile | Récupération et détente |

**Total : 111 exercices**

## 🚀 Méthodes de déploiement

### Option 1 : Déploiement automatisé (Recommandé)

1. **Préparation**
   ```powershell
   # Ouvrir PowerShell dans le dossier docs
   cd "C:\Users\jerem\OneDrive - EDOX FRANCE SAS\Perso\Sports\app-seance-badminton\docs"
   ```

2. **Configuration**
   - Modifier la variable `$DatabaseConnectionString` dans `deploy-all-exercices.ps1`
   - Adapter la logique de connexion à votre base de données

3. **Exécution**
   ```powershell
   # Déploiement complet
   .\deploy-all-exercices.ps1
   
   # Test sans modification (dry run)
   .\deploy-all-exercices.ps1 -DryRun
   
   # Ignorer la sauvegarde
   .\deploy-all-exercices.ps1 -SkipBackup
   ```

### Option 2 : Déploiement manuel

1. **Nettoyage et validation**
   ```sql
   -- Exécuter le script de nettoyage
   \i deploy-exercices.sql
   ```

2. **Insertion des exercices** (dans l'ordre)
   ```sql
   \i insert-exercices-echauffement.sql
   \i insert-exercices-mobilite.sql
   \i insert-exercices-renforcement.sql
   \i insert-exercices-etirement.sql
   \i insert-exercices-cardio.sql
   \i insert-exercices-gainage.sql
   \i insert-exercices-recuperation-active.sql
   ```

## ⚠️ Points importants

### ⚠️ ATTENTION : Suppression des données existantes
Le script `deploy-exercices.sql` supprime **TOUS** les exercices existants dans la table `exercices`.

### 🔄 Sauvegarde automatique
Le script PowerShell crée automatiquement une sauvegarde avant le déploiement.

### 📊 Validation automatique
Le script vérifie :
- L'existence des catégories, groupes musculaires, niveaux et types
- Le nombre d'exercices insérés par catégorie
- L'intégrité des données (pas d'exercices orphelins)

## 🛠️ Configuration requise

### Base de données
- Tables : `exercices`, `categories`, `groupes_musculaires`, `niveaux`, `types`
- Droits : INSERT, DELETE, SELECT sur la table `exercices`

### Système
- PowerShell 5.0 ou supérieur
- Accès à la base de données
- Droits d'écriture dans le dossier `docs`

## 📋 Vérification post-déploiement

Après le déploiement, vérifiez :

1. **Comptage des exercices**
   ```sql
   SELECT COUNT(*) FROM exercices; -- Doit retourner 111
   ```

2. **Répartition par catégorie**
   ```sql
   SELECT c.nom, COUNT(e.id) 
   FROM categories c 
   LEFT JOIN exercices e ON c.id = e.categorie_id 
   GROUP BY c.id, c.nom;
   ```

3. **Vérification des variantes**
   ```sql
   SELECT nom, variantes 
   FROM exercices 
   WHERE variantes IS NOT NULL 
   LIMIT 5;
   ```

## 🔧 Personnalisation

### Ajouter de nouveaux exercices
1. Créer un nouveau fichier SQL : `insert-exercices-nouvelle-categorie.sql`
2. Suivre le format des fichiers existants
3. Ajouter le fichier dans `deploy-all-exercices.ps1`

### Modifier les exercices existants
1. Éditer directement les fichiers SQL
2. Réexécuter le script de déploiement
3. Ou créer un script de mise à jour spécifique

## 📞 Support

En cas de problème :
1. Consulter le fichier de log généré
2. Vérifier les permissions de base de données
3. Tester avec l'option `-DryRun`

## 📈 Prochaines étapes

Après le déploiement réussi :
1. Tester l'interface utilisateur
2. Créer des séances types
3. Valider la génération automatique de séances
4. Former les utilisateurs

---

**Version :** 1.0  
**Date :** 22/06/2025  
**Auteur :** Assistant IA  
**Statut :** Prêt pour déploiement 