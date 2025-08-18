-- =====================================================
-- ADAPTATION DES VUES ET ROUTES APRÈS RESTRUCTURATION
-- =====================================================

-- Étape 1 : Mettre à jour la vue v_exercices_completes
-- =====================================================

-- Supprimer l'ancienne vue
DROP VIEW IF EXISTS v_exercices_completes;

-- Créer la nouvelle vue avec les sous-catégories
CREATE VIEW v_exercices_completes AS
SELECT 
    e.*,
    -- Informations sur les catégories et sous-catégories
    array_agg(DISTINCT c.nom) as categories_noms,
    array_agg(DISTINCT c.couleur) as categories_couleurs,
    array_agg(DISTINCT c.icone) as categories_icones,
    array_agg(DISTINCT sc.nom) as sous_categories_noms,
    array_agg(DISTINCT sc.id) as sous_categories_ids,
    -- Informations sur les groupes musculaires
    gm.nom as groupe_musculaire_nom,
    gm.zone_corps,
    -- Informations sur les familles d'exercices
    fe.nom as famille_nom,
    -- Exercices de progression
    e_plus_dur.nom as exercice_plus_dur_nom,
    e_plus_facile.nom as exercice_plus_facile_nom,
    -- Auteur
    COALESCE(u.pseudo, u.nom, 'Utilisateur ' || e.created_by::text) as auteur_pseudo
FROM exercices e
-- Jointure avec les sous-catégories via la table de jointure
LEFT JOIN exercices_sous_categories esc ON e.id = esc.exercice_id
LEFT JOIN sous_categories sc ON esc.sous_categorie_id = sc.id
LEFT JOIN categories c ON sc.categorie_id = c.id
-- Autres jointures
LEFT JOIN groupes_musculaires gm ON e.groupe_musculaire_id = gm.id
LEFT JOIN familles_exercices fe ON e.famille_id = fe.id
LEFT JOIN exercices e_plus_dur ON e.exercice_plus_dur_id = e_plus_dur.id
LEFT JOIN exercices e_plus_facile ON e.exercice_plus_facile_id = e_plus_facile.id
LEFT JOIN utilisateurs u ON e.created_by = u.id
GROUP BY 
    e.id, e.nom, e.description, e.position_depart, e.groupe_musculaire_id,
    e.famille_id, e.exercice_plus_dur_id, e.exercice_plus_facile_id,
    e.exercices_similaires, e.variantes, e.note_force, e.note_cardio,
    e.note_technique, e.note_mobilite, e.note_impact, e.note_mentale,
    e.erreurs, e.focus_zone, e.image_url, e.video_url, e.duree_estimee,
    e.calories_estimees, e.muscles_sollicites, e.conseils, e.created_by,
    e.is_validated, e.validated_by, e.validated_at, e.created_at, e.updated_at,
    gm.nom, gm.zone_corps, fe.nom, e_plus_dur.nom, e_plus_facile.nom,
    u.pseudo, u.nom;

-- Étape 2 : Mettre à jour la vue v_seances_completes
-- =====================================================

-- Supprimer l'ancienne vue
DROP VIEW IF EXISTS v_seances_completes;

-- Créer la nouvelle vue (sans niveau_id et type_id)
CREATE VIEW v_seances_completes AS
SELECT 
    s.*,
    -- Informations sur les catégories et sous-catégories
    array_agg(DISTINCT c.nom) as categories_noms,
    array_agg(DISTINCT c.couleur) as categories_couleurs,
    array_agg(DISTINCT c.icone) as categories_icones,
    array_agg(DISTINCT sc.nom) as sous_categories_noms,
    array_agg(DISTINCT sc.id) as sous_categories_ids,
    -- Auteur
    COALESCE(u.pseudo, u.nom, 'Utilisateur ' || s.created_by::text) as auteur_pseudo
FROM seances s
-- Jointure avec les sous-catégories via la table de jointure
LEFT JOIN seances_sous_categories ssc ON s.id = ssc.seance_id
LEFT JOIN sous_categories sc ON ssc.sous_categorie_id = sc.id
LEFT JOIN categories c ON sc.categorie_id = c.id
-- Autres jointures
LEFT JOIN utilisateurs u ON s.created_by = u.id
GROUP BY 
    s.id, s.nom, s.description, s.type_seance, s.structure, s.notes,
    s.duree_estimee, s.created_by, s.created_at, s.updated_at,
    u.pseudo, u.nom;

-- Étape 3 : Créer la table de jointure pour les séances
-- =====================================================

-- Créer la table de jointure seances-sous_categories
CREATE TABLE IF NOT EXISTS seances_sous_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seance_id VARCHAR(100) REFERENCES seances(id) ON DELETE CASCADE,
    sous_categorie_id UUID REFERENCES sous_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seance_id, sous_categorie_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_seances_sous_categories_seance ON seances_sous_categories(seance_id);
CREATE INDEX IF NOT EXISTS idx_seances_sous_categories_sous_categorie ON seances_sous_categories(sous_categorie_id);

-- Étape 4 : Supprimer les colonnes obsolètes des séances
-- =====================================================

-- Supprimer les contraintes de clés étrangères existantes
ALTER TABLE seances DROP CONSTRAINT IF EXISTS seances_niveau_id_fkey;
ALTER TABLE seances DROP CONSTRAINT IF EXISTS seances_type_id_fkey;
ALTER TABLE seances DROP CONSTRAINT IF EXISTS seances_categorie_id_fkey;

-- Supprimer les colonnes
ALTER TABLE seances DROP COLUMN IF EXISTS niveau_id;
ALTER TABLE seances DROP COLUMN IF EXISTS type_id;
ALTER TABLE seances DROP COLUMN IF EXISTS categorie_id;

-- Étape 5 : Créer des vues utilitaires pour les filtres
-- =====================================================

-- Vue pour les catégories avec leurs sous-catégories
CREATE VIEW v_categories_avec_sous_categories AS
SELECT 
    c.id as categorie_id,
    c.nom as categorie_nom,
    c.description as categorie_description,
    c.couleur as categorie_couleur,
    c.icone as categorie_icone,
    c.ordre_affichage as categorie_ordre,
    sc.id as sous_categorie_id,
    sc.nom as sous_categorie_nom,
    sc.description as sous_categorie_description,
    sc.ordre_affichage as sous_categorie_ordre
FROM categories c
LEFT JOIN sous_categories sc ON c.id = sc.categorie_id
ORDER BY c.ordre_affichage, sc.ordre_affichage;

-- Vue pour les statistiques d'utilisation des sous-catégories
CREATE VIEW v_stats_sous_categories AS
SELECT 
    sc.id as sous_categorie_id,
    sc.nom as sous_categorie_nom,
    c.nom as categorie_nom,
    COUNT(DISTINCT esc.exercice_id) as nombre_exercices,
    COUNT(DISTINCT ssc.seance_id) as nombre_seances
FROM sous_categories sc
LEFT JOIN categories c ON sc.categorie_id = c.id
LEFT JOIN exercices_sous_categories esc ON sc.id = esc.sous_categorie_id
LEFT JOIN seances_sous_categories ssc ON sc.id = ssc.sous_categorie_id
GROUP BY sc.id, sc.nom, c.nom
ORDER BY c.nom, sc.nom;

-- Étape 6 : Vérification finale
-- =====================================================

-- Vérifier que les nouvelles vues fonctionnent
SELECT 
    'VÉRIFICATION VUES' as section,
    'v_exercices_completes' as vue,
    COUNT(*) as nombre_lignes
FROM v_exercices_completes;

SELECT 
    'VÉRIFICATION VUES' as section,
    'v_seances_completes' as vue,
    COUNT(*) as nombre_lignes
FROM v_seances_completes;

-- Vérifier les nouvelles tables
SELECT 
    'TABLES CRÉÉES' as section,
    table_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as existe
FROM (VALUES 
    ('seances_sous_categories'),
    ('v_categories_avec_sous_categories'),
    ('v_stats_sous_categories')
) AS t(table_name);

-- Afficher un exemple d'exercice avec ses sous-catégories
SELECT 
    'EXEMPLE EXERCICE' as section,
    e.nom,
    e.categories_noms,
    e.sous_categories_noms
FROM v_exercices_completes e
LIMIT 3;

-- =====================================================
-- ADAPTATION TERMINÉE
-- =====================================================

-- ✅ Les vues ont été mises à jour pour utiliser les sous-catégories
-- ✅ La table de jointure seances_sous_categories a été créée
-- ✅ Les colonnes obsolètes ont été supprimées des séances
-- ✅ Les vues utilitaires ont été créées
-- ✅ Les index ont été créés pour les performances

-- =====================================================
-- PROCHAINES ÉTAPES
-- =====================================================

-- 1. Adapter les routes backend pour utiliser les nouvelles vues
-- 2. Adapter les composants frontend pour afficher les sous-catégories
-- 3. Migrer les données existantes vers les nouvelles sous-catégories
-- 4. Tester l'application complète
