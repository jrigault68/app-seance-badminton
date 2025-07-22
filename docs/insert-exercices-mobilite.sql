-- Insertion des exercices de mobilité
-- Catégorie: Mobilité (categorie_id: 2)
-- Généré le: 2024-12-19

-- 1. Rotation des poignets
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_poignets_mobilite',
    'Rotation des poignets',
    'Fais des cercles avec tes poignets dans un sens puis dans l''autre.',
    'Debout, les bras tendus devant toi, les paumes ouvertes, les épaules détendues.',
    2, 13, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes poignets se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    4,
    0.1,
    '["Avant-bras", "Poignets", "Doigts"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde tes bras tendus", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 2. Rotation des coudes
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_coudes_mobilite',
    'Rotation des coudes',
    'Fais des cercles avec tes coudes dans un sens puis dans l''autre.',
    'Debout, les bras pliés à 90 degrés, les mains sur les épaules, les épaules détendues.',
    2, 10, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes coudes se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    4,
    0.1,
    '["Bras", "Épaules", "Coudes"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde tes épaules détendues", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 3. Ouverture de hanche en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'ouverture_hanche_assise',
    'Ouverture de hanche en position assise',
    'Écarte tes genoux vers l''extérieur en gardant tes pieds joints.',
    'Assis par terre, les pieds joints devant toi, le dos droit, les mains posées sur tes genoux.',
    2, 16, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas l''étirement", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes hanches s''ouvrir", "Concentre-toi sur la respiration", "Sens l''étirement dans tes adducteurs"]',
    null,
    null,
    6,
    0.2,
    '["Fessiers", "Adducteurs", "Abducteurs"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux écarter moins les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux rapprocher tes pieds", "Si tu veux plus d''intensité, tu peux pencher le buste en avant"]}',
    '["Concentre-toi sur la respiration", "Garde ton dos droit", "Ne force pas l''étirement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 4. Rotation du tronc en position debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_tronc_debout',
    'Rotation du tronc en position debout',
    'Tourne ton tronc vers la droite puis vers la gauche en gardant tes hanches fixes.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, le dos droit.',
    2, 14, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne bouge pas tes hanches"]',
    '["Tu devrais sentir ton tronc se mobiliser", "Concentre-toi sur la rotation", "Sens tes abdominaux se contracter"]',
    null,
    null,
    5,
    0.2,
    '["Abdominaux", "Lombaires", "Obliques"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la rotation", "Garde tes hanches fixes", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 5. Flexion-extension des genoux
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'flexion_extension_genoux_mobilite',
    'Flexion-extension des genoux',
    'Plie légèrement tes genoux puis redresse-toi en gardant le contrôle.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, le dos droit.',
    2, 4, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne plie pas trop tes genoux"]',
    '["Tu devrais sentir tes genoux se mobiliser", "Concentre-toi sur la fluidité du mouvement", "Sens tes quadriceps s''étirer"]',
    null,
    null,
    4,
    0.2,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux plier davantage tes genoux", "Si tu veux plus d''intensité, tu peux ajouter des squats"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 6. Rotation des chevilles
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_chevilles_mobilite',
    'Rotation des chevilles',
    'Fais des cercles avec tes chevilles dans un sens puis dans l''autre.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, l''équilibre stable.',
    2, 17, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir tes chevilles se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    4,
    0.1,
    '["Chevilles", "Mollets", "Tibial antérieur"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux faire sur une jambe"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde ton équilibre", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 7. Ouverture d'épaule avec rotation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'ouverture_epaule_rotation',
    'Ouverture d''épaule avec rotation',
    'Lève tes bras sur les côtés puis fais des cercles vers l''avant et l''arrière.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, le dos droit.',
    2, 9, 2, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes épaules s''ouvrir", "Concentre-toi sur l''amplitude du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    5,
    0.2,
    '["Épaules", "Pectoraux", "Deltoïdes"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur l''ouverture des épaules", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 8. Mobilité de la colonne vertébrale
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'mobilite_colonne_vertebrale',
    'Mobilité de la colonne vertébrale',
    'Fais des mouvements de flexion et d''extension de ta colonne vertébrale. Commence par le bas du dos puis remonte progressivement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, le dos droit.',
    2, 15, 2, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas trop le dos"]',
    '["Tu devrais sentir ta colonne se mobiliser", "Concentre-toi sur la progression", "Sens chaque vertèbre bouger"]',
    null,
    null,
    6,
    0.3,
    '["Colonne vertébrale", "Lombaires", "Dorsales"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter des rotations"]}',
    '["Concentre-toi sur la progression", "Respire profondément", "Ne force pas"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 9. Rotation des épaules en cercle
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_epaules_cercle',
    'Rotation des épaules en cercle',
    'Fais des cercles complets avec tes épaules en avant puis en arrière.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, les épaules détendues.',
    2, 9, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes épaules se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    4,
    0.2,
    '["Épaules", "Trapèzes", "Deltoïdes"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde tes épaules détendues", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 10. Flexion latérale du tronc
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'flexion_laterale_tronc',
    'Flexion latérale du tronc',
    'Penche ton tronc vers la droite puis vers la gauche en gardant tes hanches fixes.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, le dos droit.',
    2, 14, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas l''étirement", "Ne bouge pas tes hanches"]',
    '["Tu devrais sentir tes obliques s''étirer", "Concentre-toi sur l''étirement latéral", "Sens ton tronc se mobiliser"]',
    null,
    null,
    5,
    0.2,
    '["Obliques", "Abdominaux", "Lombaires"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux lever le bras opposé"]}',
    '["Concentre-toi sur l''étirement latéral", "Garde tes hanches fixes", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 11. Rotation des hanches en position debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_hanches_debout',
    'Rotation des hanches en position debout',
    'Fais des cercles avec tes hanches dans le sens des aiguilles d''une montre puis dans l''autre sens.',
    'Debout, les mains sur les hanches, les jambes légèrement fléchies, le dos droit.',
    2, 16, 2, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes hanches se mobiliser", "Concentre-toi sur l''amplitude du mouvement", "Sens tes abdominaux se contracter légèrement"]',
    null,
    null,
    5,
    0.2,
    '["Fessiers", "Abdominaux", "Lombaires"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur l''amplitude du mouvement", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 12. Ouverture de la cage thoracique
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'ouverture_cage_thoracique',
    'Ouverture de la cage thoracique',
    'Lève tes bras vers le haut puis ouvre-les sur les côtés.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, le dos droit.',
    2, 8, 2, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir ta cage thoracique s''ouvrir", "Concentre-toi sur la respiration", "Sens tes pectoraux s''étirer"]',
    null,
    null,
    5,
    0.2,
    '["Pectoraux", "Épaules", "Intercostaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur l''ouverture de la cage thoracique", "Respire profondément", "Garde ton dos droit"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 13. Mobilité des chevilles en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'mobilite_chevilles_assise',
    'Mobilité des chevilles en position assise',
    'Fais des mouvements de flexion et d''extension avec tes chevilles.',
    'Assis par terre, les jambes tendues devant toi, le dos droit, les mains posées sur le sol.',
    2, 17, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes chevilles se mobiliser", "Concentre-toi sur la fluidité du mouvement", "Sens tes mollets s''étirer"]',
    null,
    null,
    4,
    0.1,
    '["Chevilles", "Mollets", "Tibial antérieur"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde tes jambes tendues", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 14. Rotation des genoux en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_genoux_assise',
    'Rotation des genoux en position assise',
    'Fais des petits cercles avec tes genoux en gardant tes pieds au sol.',
    'Assis par terre, les jambes pliées, les pieds au sol, le dos droit, les mains posées sur le sol.',
    2, 4, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes genoux se mobiliser", "Concentre-toi sur la fluidité du mouvement", "Sens tes articulations se détendre"]',
    null,
    null,
    4,
    0.2,
    '["Quadriceps", "Fessiers", "Genoux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux lever les pieds"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 15. Mobilité des doigts
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'mobilite_doigts',
    'Mobilité des doigts',
    'Fais des mouvements de flexion et d''extension avec tes doigts.',
    'Assis ou debout, les bras tendus devant toi, les mains détendues, les paumes ouvertes.',
    2, 13, 1, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne crispe pas tes mains"]',
    '["Tu devrais sentir tes doigts se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens chaque articulation bouger"]',
    null,
    null,
    3,
    0.05,
    '["Avant-bras", "Mains", "Doigts"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la vitesse", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde tes mains détendues", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 16. Rotation complète du corps
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_complete_corps',
    'Rotation complète du corps',
    'Fais une rotation complète de ton corps en gardant tes pieds ancrés au sol.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps, le dos droit.',
    2, 1, 2, 4,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir tout ton corps se mobiliser", "Concentre-toi sur la fluidité du mouvement", "Sens chaque articulation bouger"]',
    null,
    null,
    6,
    0.3,
    '["Colonne vertébrale", "Hanches", "Épaules", "Tronc"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter des bras"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde ton équilibre", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
); 