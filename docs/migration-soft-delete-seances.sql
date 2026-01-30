-- Migration : suppression douce (soft delete) des séances
-- Une séance "supprimée" reste en base (deleted_at renseigné) pour conserver
-- les stats (sessions_entrainement). Elle n'apparaît plus dans les listes.
-- À exécuter une fois dans l'éditeur SQL Supabase.

-- 1. Ajouter la colonne deleted_at
ALTER TABLE seances
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN seances.deleted_at IS 'Date de suppression (soft delete). NULL = séance active.';

-- 2. Mettre à jour la vue pour inclure deleted_at dans le GROUP BY
DROP VIEW IF EXISTS v_seances_completes;

CREATE VIEW v_seances_completes AS
SELECT 
    s.*,
    array_agg(DISTINCT c.nom) as categories_noms,
    array_agg(DISTINCT c.couleur) as categories_couleurs,
    array_agg(DISTINCT c.icone) as categories_icones,
    array_agg(DISTINCT sc.nom) as sous_categories_noms,
    array_agg(DISTINCT sc.id) as sous_categories_ids,
    COALESCE(u.pseudo, u.nom, 'Utilisateur ' || s.created_by::text) as auteur_pseudo
FROM seances s
LEFT JOIN seances_sous_categories ssc ON s.id = ssc.seance_id
LEFT JOIN sous_categories sc ON ssc.sous_categorie_id = sc.id
LEFT JOIN categories c ON sc.categorie_id = c.id
LEFT JOIN utilisateurs u ON s.created_by = u.id
GROUP BY 
    s.id, s.nom, s.description, s.type_seance, s.structure, s.notes,
    s.duree_estimee, s.created_by, s.created_at, s.updated_at, s.deleted_at,
    u.pseudo, u.nom;
