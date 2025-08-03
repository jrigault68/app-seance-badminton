-- Script pour modifier le type du champ progression de JSONB à TEXT
-- Cela permettra de stocker des structures de séances plus volumineuses

-- Vérifier si la colonne existe et son type actuel
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sessions_entrainement' 
AND column_name = 'progression';

-- Modifier le type de la colonne progression
ALTER TABLE sessions_entrainement 
ALTER COLUMN progression TYPE TEXT;

-- Vérifier que la modification a été appliquée
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sessions_entrainement' 
AND column_name = 'progression';

-- Mettre à jour les valeurs existantes si nécessaire
UPDATE sessions_entrainement 
SET progression = '{}' 
WHERE progression IS NULL OR progression = '';

-- Vérifier les données
SELECT id, progression 
FROM sessions_entrainement 
LIMIT 5; 