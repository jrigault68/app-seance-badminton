-- Backfill du champ jour_programme pour les sessions existantes
-- Hypothèse: le jour du programme correspond au décalage en jours entre
-- la date_debut du programme utilisateur et la date_fin de la session.
-- Cette logique fonctionne pour les programmes libres et calendaires où
-- les séances sont planifiées par jour relatif.

-- 1) Vérifier l'impact (sélection)
-- SELECT s.id, s.utilisateur_id, s.programme_id, s.seance_id, s.date_fin::date AS date_session,
--        up.date_debut, (s.date_fin::date - up.date_debut)::int + 1 AS jour_calcule
-- FROM sessions_entrainement s
-- JOIN utilisateur_programmes up ON up.programme_id = s.programme_id AND up.utilisateur_id = s.utilisateur_id
-- WHERE s.jour_programme IS NULL
--   AND s.programme_id IS NOT NULL
--   AND s.date_fin IS NOT NULL
--   AND s.etat IN ('terminee','skipped')
-- ORDER BY s.date_fin DESC
-- LIMIT 100;

-- 2) Appliquer le backfill en bornant entre 1 et nb_jours du programme
UPDATE sessions_entrainement s
SET jour_programme = GREATEST(1, LEAST(p.nb_jours,
                       (s.date_fin::date - up.date_debut)::int + 1))
FROM utilisateur_programmes up
JOIN programmes p ON p.id = up.programme_id
WHERE s.programme_id = up.programme_id
  AND s.utilisateur_id = up.utilisateur_id
  AND s.jour_programme IS NULL
  AND s.programme_id IS NOT NULL
  AND s.date_fin IS NOT NULL
  AND s.etat IN ('terminee','skipped');

-- 3) Optionnel: rapport rapide
-- SELECT COUNT(*) AS sessions_mises_a_jour
-- FROM sessions_entrainement
-- WHERE jour_programme IS NOT NULL;

