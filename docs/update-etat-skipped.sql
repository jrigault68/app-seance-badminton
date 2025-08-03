-- Script pour ajouter 'skipped' comme valeur possible du champ etat
-- À exécuter sur la base de données existante

-- Mettre à jour les sessions existantes qui ont des notes contenant 'refusée'
UPDATE sessions_entrainement 
SET etat = 'skipped'
WHERE etat = 'terminee' 
AND notes LIKE '%refusée%';

-- Ajouter une contrainte pour s'assurer que etat est valide
-- (supprimer l'ancienne contrainte si elle existe)
ALTER TABLE sessions_entrainement 
DROP CONSTRAINT IF EXISTS check_etat;

-- Ajouter la nouvelle contrainte avec 'skipped'
ALTER TABLE sessions_entrainement 
ADD CONSTRAINT check_etat 
CHECK (etat IN ('en_cours', 'terminee', 'interrompue', 'skipped'));

-- Vérifier les données
SELECT etat, COUNT(*) as nombre_sessions
FROM sessions_entrainement
GROUP BY etat
ORDER BY nombre_sessions DESC; 