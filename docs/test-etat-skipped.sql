-- Script pour tester le nouveau système avec etat = 'skipped'
-- À exécuter après avoir ajouté 'skipped' aux valeurs possibles

-- Vérifier la contrainte sur le champ etat
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'sessions_entrainement'::regclass 
AND conname = 'check_etat';

-- Voir quelques exemples de sessions avec les différents états
SELECT 
    se.nom as seance_nom,
    se.type_seance,
    s.etat,
    s.notes,
    s.date_fin
FROM sessions_entrainement s
JOIN seances se ON s.seance_id = se.id
ORDER BY s.date_fin DESC
LIMIT 10;

-- Compter les sessions par état
SELECT 
    etat,
    COUNT(*) as nombre_sessions
FROM sessions_entrainement
GROUP BY etat
ORDER BY nombre_sessions DESC; 