-- =====================================================
-- RESTRUCTURATION DES GROUPES MUSCULAIRES
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

-- Compter les exercices avec groupe musculaire
SELECT 
    'RELATIONS ACTUELLES' as section,
    COUNT(*) as total_exercices,
    COUNT(CASE WHEN groupe_musculaire_id IS NOT NULL THEN 1 END) as avec_groupe_musculaire
FROM exercices;

-- Afficher les groupes musculaires existants
SELECT 
    'GROUPES MUSCULAIRES EXISTANTS' as section,
    id,
    nom,
    description,
    zone_corps,
    ordre_affichage
FROM groupes_musculaires
ORDER BY ordre_affichage;

-- Étape 2 : Créer la table zones_corps
-- =====================================================

CREATE TABLE IF NOT EXISTS zones_corps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    couleur VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Étape 3 : Créer la table zones_specifiques
-- =====================================================

CREATE TABLE IF NOT EXISTS zones_specifiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    zone_corps_id UUID REFERENCES zones_corps(id),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Étape 4 : Créer la table de jointure exercices-zones_specifiques
-- =====================================================

CREATE TABLE IF NOT EXISTS exercices_zones_specifiques (
    exercice_id VARCHAR(100) REFERENCES exercices(id) ON DELETE CASCADE,
    zone_specifique_id UUID REFERENCES zones_specifiques(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (exercice_id, zone_specifique_id)
);

-- Étape 5 : Insérer les zones du corps
-- =====================================================

INSERT INTO zones_corps (nom, description, couleur, icone, ordre_affichage) VALUES
('muscles_bas_corps', 'Muscles des membres inférieurs', '#10B981', '🦵', 1),
('muscles_haut_corps', 'Muscles des membres supérieurs et tronc', '#F59E0B', '💪', 2),
('articulations', 'Articulations et mobilité', '#3B82F6', '🦴', 3),
('tendons_ligaments', 'Tendons et ligaments', '#8B5CF6', '🔗', 4),
('systeme_cardiovasculaire', 'Système cardio-respiratoire', '#EF4444', '❤️', 5),
('systeme_nerveux', 'Système nerveux et coordination', '#6366F1', '🧠', 6)
ON CONFLICT (nom) DO NOTHING;

-- Étape 6 : Insérer les zones spécifiques
-- =====================================================

-- Muscles bas du corps
INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'quadriceps',
    'Muscles antérieurs de la cuisse',
    zc.id,
    1
FROM zones_corps zc WHERE zc.nom = 'muscles_bas_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'ischio_jambiers',
    'Muscles postérieurs de la cuisse',
    zc.id,
    2
FROM zones_corps zc WHERE zc.nom = 'muscles_bas_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'fessiers',
    'Muscles fessiers',
    zc.id,
    3
FROM zones_corps zc WHERE zc.nom = 'muscles_bas_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'mollets',
    'Muscles du mollet',
    zc.id,
    4
FROM zones_corps zc WHERE zc.nom = 'muscles_bas_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'adducteurs',
    'Muscles adducteurs de la cuisse',
    zc.id,
    5
FROM zones_corps zc WHERE zc.nom = 'muscles_bas_corps'
ON CONFLICT (nom) DO NOTHING;

-- Muscles haut du corps
INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'pectoraux',
    'Muscles pectoraux',
    zc.id,
    1
FROM zones_corps zc WHERE zc.nom = 'muscles_haut_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'dorsaux',
    'Muscles du dos',
    zc.id,
    2
FROM zones_corps zc WHERE zc.nom = 'muscles_haut_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'deltoides',
    'Muscles des épaules',
    zc.id,
    3
FROM zones_corps zc WHERE zc.nom = 'muscles_haut_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'biceps',
    'Muscles biceps',
    zc.id,
    4
FROM zones_corps zc WHERE zc.nom = 'muscles_haut_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'triceps',
    'Muscles triceps',
    zc.id,
    5
FROM zones_corps zc WHERE zc.nom = 'muscles_haut_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'abdominaux',
    'Muscles abdominaux',
    zc.id,
    6
FROM zones_corps zc WHERE zc.nom = 'muscles_haut_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'avant_bras',
    'Muscles des avant-bras',
    zc.id,
    7
FROM zones_corps zc WHERE zc.nom = 'muscles_haut_corps'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'trapezes',
    'Muscles trapèzes',
    zc.id,
    8
FROM zones_corps zc WHERE zc.nom = 'muscles_haut_corps'
ON CONFLICT (nom) DO NOTHING;

-- Articulations
INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'genoux',
    'Articulation des genoux',
    zc.id,
    1
FROM zones_corps zc WHERE zc.nom = 'articulations'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'chevilles',
    'Articulation des chevilles',
    zc.id,
    2
FROM zones_corps zc WHERE zc.nom = 'articulations'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'hanches',
    'Articulation des hanches',
    zc.id,
    3
FROM zones_corps zc WHERE zc.nom = 'articulations'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'epaules',
    'Articulation des épaules',
    zc.id,
    4
FROM zones_corps zc WHERE zc.nom = 'articulations'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'coudes',
    'Articulation des coudes',
    zc.id,
    5
FROM zones_corps zc WHERE zc.nom = 'articulations'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'poignets',
    'Articulation des poignets',
    zc.id,
    6
FROM zones_corps zc WHERE zc.nom = 'articulations'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'colonne_vertebrale',
    'Colonne vertébrale',
    zc.id,
    7
FROM zones_corps zc WHERE zc.nom = 'articulations'
ON CONFLICT (nom) DO NOTHING;

-- Tendons et ligaments
INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'tendons_achille',
    'Tendon d''Achille',
    zc.id,
    1
FROM zones_corps zc WHERE zc.nom = 'tendons_ligaments'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'ligaments_genoux',
    'Ligaments des genoux',
    zc.id,
    2
FROM zones_corps zc WHERE zc.nom = 'tendons_ligaments'
ON CONFLICT (nom) DO NOTHING;

-- Système cardiovasculaire
INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'coeur',
    'Muscle cardiaque',
    zc.id,
    1
FROM zones_corps zc WHERE zc.nom = 'systeme_cardiovasculaire'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'poumons',
    'Système respiratoire',
    zc.id,
    2
FROM zones_corps zc WHERE zc.nom = 'systeme_cardiovasculaire'
ON CONFLICT (nom) DO NOTHING;

-- Système nerveux
INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'coordination',
    'Coordination et équilibre',
    zc.id,
    1
FROM zones_corps zc WHERE zc.nom = 'systeme_nerveux'
ON CONFLICT (nom) DO NOTHING;

INSERT INTO zones_specifiques (nom, description, zone_corps_id, ordre_affichage) 
SELECT 
    'proprioception',
    'Proprioception',
    zc.id,
    2
FROM zones_corps zc WHERE zc.nom = 'systeme_nerveux'
ON CONFLICT (nom) DO NOTHING;

-- Étape 7 : Supprimer la colonne groupe_musculaire_id de la table exercices
-- =====================================================

-- Supprimer la contrainte de clé étrangère existante
ALTER TABLE exercices DROP CONSTRAINT IF EXISTS exercices_groupe_musculaire_id_fkey;

-- Supprimer la colonne
ALTER TABLE exercices DROP COLUMN IF EXISTS groupe_musculaire_id;

-- Étape 8 : Supprimer l'ancienne table groupes_musculaires
-- =====================================================

-- Supprimer la table qui n'est plus utilisée
DROP TABLE IF EXISTS groupes_musculaires CASCADE;

-- Étape 9 : Créer les index pour les performances
-- =====================================================

-- Index pour les zones_specifiques
CREATE INDEX IF NOT EXISTS idx_zones_specifiques_zone_corps ON zones_specifiques(zone_corps_id);
CREATE INDEX IF NOT EXISTS idx_zones_specifiques_ordre ON zones_specifiques(ordre_affichage);

-- Index pour la table de jointure
CREATE INDEX IF NOT EXISTS idx_exercices_zones_specifiques_exercice ON exercices_zones_specifiques(exercice_id);
CREATE INDEX IF NOT EXISTS idx_exercices_zones_specifiques_muscle ON exercices_zones_specifiques(zone_specifique_id);

-- Étape 10 : Vérification finale
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
    ('zones_corps'),
    ('zones_specifiques'),
    ('exercices_zones_specifiques')
) AS t(table_name);

-- Vérifier les tables supprimées
SELECT 
    'TABLES SUPPRIMÉES' as section,
    table_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as existe_encore
FROM (VALUES 
    ('groupes_musculaires')
) AS t(table_name);

-- Afficher les zones du corps créées
SELECT 
    'ZONES DU CORPS CRÉÉES' as section,
    id,
    nom,
    description,
    LENGTH(id::text) as longueur_uuid
FROM zones_corps
ORDER BY ordre_affichage;

-- Afficher quelques muscles spécifiques
SELECT 
    'MUSCLES SPÉCIFIQUES CRÉÉS' as section,
    ms.nom as muscle,
    zc.nom as zone,
    ms.description
FROM zones_specifiques ms
JOIN zones_corps zc ON ms.zone_corps_id = zc.id
ORDER BY zc.ordre_affichage, ms.ordre_affichage
LIMIT 10;

-- =====================================================
-- MIGRATION TERMINÉE
-- =====================================================

-- ✅ La table exercices a été nettoyée (suppression groupe_musculaire_id)
-- ✅ La table zones_corps a été créée avec UUID
-- ✅ La table zones_specifiques a été créée avec UUID
-- ✅ La table de jointure exercices_zones_specifiques a été créée
-- ✅ La table groupes_musculaires a été supprimée
-- ✅ Les données initiales ont été insérées
-- ✅ Les index ont été créés pour les performances

-- =====================================================
-- PROCHAINES ÉTAPES
-- =====================================================

-- 1. Mettre à jour les vues pour utiliser les nouvelles tables
-- 2. Adapter les routes backend
-- 3. Adapter les composants frontend
-- 4. Migrer les exercices existants vers les nouvelles relations
-- 5. Tester l'application
