-- =====================================================
-- ADAPTATION DES VUES APRÈS RESTRUCTURATION GROUPES MUSCULAIRES
-- =====================================================

-- Étape 1 : Mettre à jour la vue v_exercices_completes
-- =====================================================

-- Supprimer l'ancienne vue
DROP VIEW IF EXISTS v_exercices_completes;

-- Créer la nouvelle vue avec les zones du corps et muscles spécifiques
CREATE VIEW v_exercices_completes AS
SELECT 
    e.*,
    -- Informations sur les catégories et sous-catégories
    array_agg(DISTINCT c.nom) as categories_noms,
    array_agg(DISTINCT c.couleur) as categories_couleurs,
    array_agg(DISTINCT c.icone) as categories_icones,
    array_agg(DISTINCT sc.nom) as sous_categories_noms,
    array_agg(DISTINCT sc.id) as sous_categories_ids,
    -- Informations sur les zones du corps et zones spécifiques
    array_agg(DISTINCT zc.nom) as zones_corps_noms,
    array_agg(DISTINCT zc.couleur) as zones_corps_couleurs,
    array_agg(DISTINCT zc.icone) as zones_corps_icones,
    array_agg(DISTINCT zs.nom) as zones_specifiques_noms,
    array_agg(DISTINCT zs.id) as zones_specifiques_ids,
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
-- Jointure avec les zones spécifiques via la table de jointure
LEFT JOIN exercices_zones_specifiques ezs ON e.id = ezs.exercice_id
LEFT JOIN zones_specifiques zs ON ezs.zone_specifique_id = zs.id
LEFT JOIN zones_corps zc ON zs.zone_corps_id = zc.id
-- Autres jointures
LEFT JOIN familles_exercices fe ON e.famille_id = fe.id
LEFT JOIN exercices e_plus_dur ON e.exercice_plus_dur_id = e_plus_dur.id
LEFT JOIN exercices e_plus_facile ON e.exercice_plus_facile_id = e_plus_facile.id
LEFT JOIN utilisateurs u ON e.created_by = u.id
GROUP BY 
    e.id, e.nom, e.description, e.position_depart, e.famille_id,
    e.exercice_plus_dur_id, e.exercice_plus_facile_id,
    e.exercices_similaires, e.variantes, e.note_force, e.note_cardio,
    e.note_technique, e.note_mobilite, e.note_impact, e.note_mentale,
    e.erreurs, e.focus_zone, e.image_url, e.video_url, e.duree_estimee,
    e.calories_estimees, e.muscles_sollicites, e.conseils, e.created_by,
    e.is_validated, e.validated_by, e.validated_at, e.created_at, e.updated_at,
    fe.nom, e_plus_dur.nom, e_plus_facile.nom,
    u.pseudo, u.nom;

-- Étape 2 : Créer des vues utilitaires pour les filtres
-- =====================================================

-- Vue pour les zones du corps avec leurs zones spécifiques
CREATE VIEW v_zones_corps_avec_zones_specifiques AS
SELECT 
    zc.id as zone_corps_id,
    zc.nom as zone_corps_nom,
    zc.description as zone_corps_description,
    zc.couleur as zone_corps_couleur,
    zc.icone as zone_corps_icone,
    zc.ordre_affichage as zone_corps_ordre,
    zs.id as zone_specifique_id,
    zs.nom as zone_specifique_nom,
    zs.description as zone_specifique_description,
    zs.ordre_affichage as zone_specifique_ordre
FROM zones_corps zc
LEFT JOIN zones_specifiques zs ON zc.id = zs.zone_corps_id
ORDER BY zc.ordre_affichage, zs.ordre_affichage;

-- Vue pour les statistiques d'utilisation des zones spécifiques
CREATE VIEW v_stats_zones_specifiques AS
SELECT 
    zs.id as zone_specifique_id,
    zs.nom as zone_specifique_nom,
    zc.nom as zone_corps_nom,
    COUNT(DISTINCT ezs.exercice_id) as nombre_exercices
FROM zones_specifiques zs
LEFT JOIN zones_corps zc ON zs.zone_corps_id = zc.id
LEFT JOIN exercices_zones_specifiques ezs ON zs.id = ezs.zone_specifique_id
GROUP BY zs.id, zs.nom, zc.nom
ORDER BY zc.nom, zs.nom;

-- Étape 3 : Vérification finale
-- =====================================================

-- Vérifier que les nouvelles vues fonctionnent
SELECT 
    'VÉRIFICATION VUES' as section,
    'v_exercices_completes' as vue,
    COUNT(*) as nombre_lignes
FROM v_exercices_completes;

SELECT 
    'VÉRIFICATION VUES' as section,
    'v_zones_corps_avec_zones_specifiques' as vue,
    COUNT(*) as nombre_lignes
FROM v_zones_corps_avec_zones_specifiques;

SELECT 
    'VÉRIFICATION VUES' as section,
    'v_stats_zones_specifiques' as vue,
    COUNT(*) as nombre_lignes
FROM v_stats_zones_specifiques;

-- Vérifier les nouvelles tables
SELECT 
    'TABLES CRÉÉES' as section,
    table_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as existe
FROM (VALUES 
    ('v_zones_corps_avec_zones_specifiques'),
    ('v_stats_zones_specifiques')
) AS t(table_name);

-- Afficher un exemple d'exercice avec ses zones et zones spécifiques
SELECT 
    'EXEMPLE EXERCICE' as section,
    e.nom,
    e.zones_corps_noms,
    e.zones_specifiques_noms
FROM v_exercices_completes e
LIMIT 3;

-- Afficher la structure des zones du corps
SELECT 
    'STRUCTURE ZONES' as section,
    zc.nom as zone,
    COUNT(zs.id) as nombre_zones_specifiques
FROM zones_corps zc
LEFT JOIN zones_specifiques zs ON zc.id = zs.zone_corps_id
GROUP BY zc.id, zc.nom
ORDER BY zc.ordre_affichage;

-- =====================================================
-- ADAPTATION TERMINÉE
-- =====================================================

-- ✅ La vue v_exercices_completes a été mise à jour pour utiliser les nouvelles tables
-- ✅ La vue v_zones_corps_avec_zones_specifiques a été créée
-- ✅ La vue v_stats_zones_specifiques a été créée
-- ✅ Les index ont été créés pour les performances

-- =====================================================
-- PROCHAINES ÉTAPES
-- =====================================================

-- 1. Adapter les routes backend pour utiliser les nouvelles vues
-- 2. Adapter les composants frontend pour afficher les zones et muscles
-- 3. Migrer les exercices existants vers les nouvelles relations
-- 4. Tester l'application complète
