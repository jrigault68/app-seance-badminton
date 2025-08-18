-- =====================================================
-- RESTRUCTURATION COMPLÈTE DES EXERCICES
-- =====================================================

-- Étape 1 : Vérifier la structure actuelle
-- =====================================================

-- Afficher les colonnes actuelles de la table exercices
SELECT 
    'STRUCTURE EXERCICES ACTUELLE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'exercices' 
ORDER BY ordinal_position;

-- Compter les exercices avec chaque type de relation
SELECT 
    'RELATIONS ACTUELLES' as section,
    COUNT(*) as total_exercices,
    COUNT(CASE WHEN niveau_id IS NOT NULL THEN 1 END) as avec_niveau,
    COUNT(CASE WHEN type_id IS NOT NULL THEN 1 END) as avec_type,
    COUNT(CASE WHEN categorie_id IS NOT NULL THEN 1 END) as avec_categorie
FROM exercices;

-- Étape 2 : Modifier la table categories pour utiliser UUID
-- =====================================================

-- Créer une nouvelle table categories avec UUID
CREATE TABLE IF NOT EXISTS categories_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    couleur VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrer les données existantes
INSERT INTO categories_new (nom, description, couleur, icone, ordre_affichage, created_at)
SELECT nom, description, couleur, icone, ordre_affichage, created_at
FROM categories
ORDER BY ordre_affichage;

-- Étape 3 : Créer la table sous_categories
-- =====================================================

CREATE TABLE IF NOT EXISTS sous_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    categorie_id UUID REFERENCES categories_new(id),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Étape 4 : Créer la table de jointure exercices-sous_categories
-- =====================================================

CREATE TABLE IF NOT EXISTS exercices_sous_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercice_id INTEGER REFERENCES exercices(id) ON DELETE CASCADE,
    sous_categorie_id UUID REFERENCES sous_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exercice_id, sous_categorie_id)
);

-- Étape 5 : Supprimer les colonnes de la table exercices
-- =====================================================

-- Supprimer les contraintes de clés étrangères existantes
ALTER TABLE exercices DROP CONSTRAINT IF EXISTS exercices_niveau_id_fkey;
ALTER TABLE exercices DROP CONSTRAINT IF EXISTS exercices_type_id_fkey;
ALTER TABLE exercices DROP CONSTRAINT IF EXISTS exercices_categorie_id_fkey;

-- Supprimer les colonnes
ALTER TABLE exercices DROP COLUMN IF EXISTS niveau_id;
ALTER TABLE exercices DROP COLUMN IF EXISTS type_id;
ALTER TABLE exercices DROP COLUMN IF EXISTS categorie_id;

-- Étape 6 : Supprimer les tables obsolètes
-- =====================================================

-- Supprimer les tables qui ne sont plus utilisées
DROP TABLE IF EXISTS niveaux_difficulte CASCADE;
DROP TABLE IF EXISTS types CASCADE;

-- Étape 7 : Finaliser la migration des categories
-- =====================================================

-- Supprimer l'ancienne table categories
DROP TABLE IF EXISTS categories CASCADE;

-- Renommer categories_new en categories
ALTER TABLE categories_new RENAME TO categories;

-- Étape 8 : Créer les index pour les performances
-- =====================================================

-- Index pour la table de jointure
CREATE INDEX IF NOT EXISTS idx_exercices_sous_categories_exercice ON exercices_sous_categories(exercice_id);
CREATE INDEX IF NOT EXISTS idx_exercices_sous_categories_sous_categorie ON exercices_sous_categories(sous_categorie_id);

-- Index pour les sous_categories
CREATE INDEX IF NOT EXISTS idx_sous_categories_categorie ON sous_categories(categorie_id);

-- Étape 9 : Vérification finale
-- =====================================================

-- Vérifier la nouvelle structure de la table exercices
SELECT 
    'NOUVELLE STRUCTURE EXERCICES' as section,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'exercices' 
ORDER BY ordinal_position;

-- Vérifier les nouvelles tables
SELECT 
    'TABLES CRÉÉES' as section,
    table_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as existe
FROM (VALUES 
    ('categories'),
    ('sous_categories'),
    ('exercices_sous_categories')
) AS t(table_name);

-- Vérifier les tables supprimées
SELECT 
    'TABLES SUPPRIMÉES' as section,
    table_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as existe_encore
FROM (VALUES 
    ('niveaux_difficulte'),
    ('types')
) AS t(table_name);

-- Afficher les catégories migrées
SELECT 
    'CATÉGORIES MIGRÉES' as section,
    id,
    nom,
    LENGTH(id::text) as longueur_uuid
FROM categories
ORDER BY ordre_affichage;

-- =====================================================
-- MIGRATION TERMINÉE
-- =====================================================

-- ✅ La table exercices a été nettoyée
-- ✅ La table categories utilise maintenant des UUID
-- ✅ La table sous_categories a été créée
-- ✅ La table de jointure exercices_sous_categories a été créée
-- ✅ Les tables niveaux_difficulte et types ont été supprimées
-- ✅ Les index ont été créés pour les performances

-- =====================================================
-- PROCHAINES ÉTAPES
-- =====================================================

-- 1. Insérer les sous-catégories appropriées
-- 2. Migrer les exercices existants vers les nouvelles sous-catégories
-- 3. Adapter les routes backend
-- 4. Adapter les composants frontend
-- 5. Tester l'application
