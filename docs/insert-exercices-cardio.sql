-- =====================================================
-- INSERTION DES EXERCICES DE CARDIO
-- Catégorie : Cardio (ID: 5)
-- =====================================================

-- 1. Course sur place
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'course_sur_place',
    'Course sur place',
    'Cours sur place en levant les genoux alternativement. Garde ton corps droit et tes bras en mouvement naturel. Respire régulièrement et maintien un rythme soutenu.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 1, 2, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes épaules se tendre", "Ne cours pas trop vite"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur le rythme", "Sens tes jambes travailler"]',
    null,
    null,
    120,
    20,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux marcher sur place"], "plus_difficiles": ["Si c''est trop facile, tu peux lever les genoux plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements de bras"]}',
    '["Maintiens une respiration régulière", "Garde ton corps droit", "Maintien un rythme soutenu"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 2. Jumping jacks
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'jumping_jacks',
    'Jumping jacks',
    'Saute en écartant tes jambes et en levant tes bras au-dessus de ta tête, puis reviens en position de départ. Garde ton corps aligné et respire régulièrement.',
    'Debout, les pieds joints, les bras le long du corps.',
    5, 1, 2, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux s''affaisser", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la coordination", "Sens tout ton corps travailler"]',
    null,
    null,
    90,
    15,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sans sauter"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus haut", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Coordonne tes mouvements"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 3. Burpees
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'burpees',
    'Burpees',
    'Commence debout, descends en position de pompe, fais une pompe, puis saute en levant tes bras. Garde ton corps aligné et respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 1, 3, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches s''affaisser", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la fluidité", "Sens tout ton corps travailler"]',
    null,
    null,
    120,
    25,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sans sauter"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter une pompe", "Si tu veux plus d''intensité, tu peux ajouter un saut plus haut"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Fais des mouvements fluides"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 4. Mountain climbers
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'mountain_climbers',
    'Mountain climbers',
    'En position de pompe, ramène alternativement tes genoux vers ta poitrine. Garde ton corps aligné et respire régulièrement.',
    'En position de pompe, les mains au sol, les bras tendus, le corps aligné.',
    5, 1, 2, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches bouger", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la stabilité", "Sens tes abdominaux travailler"]',
    null,
    null,
    90,
    18,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire plus lentement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire plus vite", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps stable", "Contrôle tes mouvements"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 5. High knees
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'high_knees',
    'High knees',
    'Cours sur place en levant tes genoux le plus haut possible. Garde ton corps droit et tes bras en mouvement naturel. Respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 2, 2, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton dos se courber", "Ne cours pas trop vite"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la hauteur des genoux", "Sens tes jambes travailler"]',
    null,
    null,
    90,
    16,
    '["Jambes", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever moins haut"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements de bras"]}',
    '["Maintiens une respiration régulière", "Garde ton corps droit", "Lève tes genoux haut"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 6. Butt kicks
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'butt_kicks',
    'Butt kicks',
    'Cours sur place en touchant tes fessiers avec tes talons. Garde ton corps droit et tes bras en mouvement naturel. Respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 2, 2, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton dos se courber", "Ne cours pas trop vite"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur le contact talon-fessier", "Sens tes jambes travailler"]',
    null,
    null,
    90,
    16,
    '["Jambes", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire plus lentement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire plus vite", "Si tu veux plus d''intensité, tu peux ajouter des mouvements de bras"]}',
    '["Maintiens une respiration régulière", "Garde ton corps droit", "Touche tes fessiers avec tes talons"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 7. Jump squats
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'jump_squats',
    'Jump squats',
    'Descends en position de squat, puis saute en levant tes bras. Atterris doucement et répète. Garde ton corps aligné et respire régulièrement.',
    'Debout, les pieds écartés de la largeur des épaules, les bras le long du corps.',
    5, 2, 3, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux s''affaisser", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur l''atterrissage", "Sens tes jambes travailler"]',
    null,
    null,
    90,
    20,
    '["Jambes", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire des squats simples"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus haut", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Atterris doucement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 8. Skater jumps
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'skater_jumps',
    'Skater jumps',
    'Saute latéralement d''un côté à l''autre en touchant le sol avec ta main opposée. Garde ton corps aligné et respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 2, 3, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux s''affaisser", "Ne saute pas trop loin"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur l''équilibre", "Sens tes jambes travailler"]',
    null,
    null,
    90,
    22,
    '["Jambes", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire des pas latéraux"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus loin", "Si tu veux plus d''intensité, tu peux ajouter un saut plus haut"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Touche le sol avec ta main"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 9. Box jumps
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'box_jumps',
    'Box jumps',
    'Saute sur une boîte ou un support, puis redescends. Garde ton corps aligné et respire régulièrement.',
    'Debout devant une boîte ou un support, les pieds écartés de la largeur des hanches.',
    5, 2, 4, 5,
    '["Boîte ou support"]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux s''affaisser", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur l''atterrissage", "Sens tes jambes travailler"]',
    null,
    null,
    120,
    25,
    '["Jambes", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux utiliser une boîte plus basse"], "plus_difficiles": ["Si c''est trop facile, tu peux utiliser une boîte plus haute", "Si tu veux plus d''intensité, tu peux ajouter un claquement"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Atterris doucement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 10. Tabata protocol
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'tabata_protocol',
    'Tabata protocol',
    'Fais 20 secondes d''effort intense suivi de 10 secondes de repos, répète 8 fois. Choisis un exercice cardio et donne tout pendant les phases d''effort.',
    'Debout, prêt à commencer l''exercice choisi.',
    5, 1, 4, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton rythme baisser", "Ne saute pas les phases de repos"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur l''intensité", "Sens tout ton corps travailler"]',
    null,
    null,
    240,
    30,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''intensité"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''intensité", "Si tu veux plus d''intensité, tu peux ajouter plus de cycles"]}',
    '["Maintiens une respiration régulière", "Donne tout pendant l''effort", "Respecte les phases de repos"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 11. Course avec genoux hauts
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'course_genoux_hauts',
    'Course avec genoux hauts',
    'Cours sur place en levant tes genoux très haut. Garde ton corps droit et tes bras en mouvement naturel. Respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 2, 2, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton dos se courber", "Ne cours pas trop vite"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la hauteur des genoux", "Sens tes jambes travailler"]',
    null,
    null,
    90,
    18,
    '["Jambes", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever moins haut"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements de bras"]}',
    '["Maintiens une respiration régulière", "Garde ton corps droit", "Lève tes genoux très haut"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 12. Jumping jacks avec rotation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'jumping_jacks_rotation',
    'Jumping jacks avec rotation',
    'Saute en écartant tes jambes et en levant tes bras avec une rotation du tronc. Garde ton corps aligné et respire régulièrement.',
    'Debout, les pieds joints, les bras le long du corps.',
    5, 1, 3, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux s''affaisser", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la coordination", "Sens tout ton corps travailler"]',
    null,
    null,
    90,
    20,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sans sauter"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus haut", "Si tu veux plus d''intensité, tu peux ajouter plus de rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Coordonne tes mouvements"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 13. Burpees avec pompe
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'burpees_pompe',
    'Burpees avec pompe',
    'Commence debout, descends en position de pompe, fais une pompe complète, puis saute en levant tes bras. Garde ton corps aligné et respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 1, 4, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches s''affaisser", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la fluidité", "Sens tout ton corps travailler"]',
    null,
    null,
    120,
    28,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sans pompe"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter plusieurs pompes", "Si tu veux plus d''intensité, tu peux ajouter un saut plus haut"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Fais des mouvements fluides"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 14. Mountain climbers avec rotation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'mountain_climbers_rotation',
    'Mountain climbers avec rotation',
    'En position de pompe, ramène tes genoux vers ta poitrine avec une rotation du tronc. Garde ton corps aligné et respire régulièrement.',
    'En position de pompe, les mains au sol, les bras tendus, le corps aligné.',
    5, 1, 3, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches bouger", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la stabilité", "Sens tes abdominaux travailler"]',
    null,
    null,
    90,
    22,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sans rotation"], "plus_difficiles": ["Si c''est trop facile, tu peux faire plus vite", "Si tu veux plus d''intensité, tu peux ajouter plus de rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps stable", "Contrôle tes mouvements"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 15. High knees avec balancement des bras
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'high_knees_balancement_bras',
    'High knees avec balancement des bras',
    'Cours sur place en levant tes genoux et en balançant tes bras de manière exagérée. Garde ton corps droit et respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 1, 2, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton dos se courber", "Ne cours pas trop vite"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur la coordination", "Sens tout ton corps travailler"]',
    null,
    null,
    90,
    18,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever moins haut"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements de bras plus exagérés"]}',
    '["Maintiens une respiration régulière", "Garde ton corps droit", "Coordonne tes mouvements"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 16. Butt kicks avec saut
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'butt_kicks_saut',
    'Butt kicks avec saut',
    'Saute sur place en touchant tes fessiers avec tes talons. Garde ton corps droit et tes bras en mouvement naturel. Respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 2, 3, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton dos se courber", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur le contact talon-fessier", "Sens tes jambes travailler"]',
    null,
    null,
    90,
    20,
    '["Jambes", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sans sauter"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements de bras"]}',
    '["Maintiens une respiration régulière", "Garde ton corps droit", "Touche tes fessiers avec tes talons"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 17. Jump squats avec rotation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'jump_squats_rotation',
    'Jump squats avec rotation',
    'Descends en position de squat, puis saute avec une rotation du tronc. Atterris doucement et répète. Garde ton corps aligné et respire régulièrement.',
    'Debout, les pieds écartés de la largeur des épaules, les bras le long du corps.',
    5, 1, 4, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux s''affaisser", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur l''atterrissage", "Sens tout ton corps travailler"]',
    null,
    null,
    90,
    24,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire des squats simples"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus haut", "Si tu veux plus d''intensité, tu peux ajouter plus de rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Atterris doucement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 18. Skater jumps avec saut
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'skater_jumps_saut',
    'Skater jumps avec saut',
    'Saute latéralement d''un côté à l''autre avec un saut plus haut. Touche le sol avec ta main opposée. Garde ton corps aligné et respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    5, 2, 4, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux s''affaisser", "Ne saute pas trop loin"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur l''équilibre", "Sens tes jambes travailler"]',
    null,
    null,
    90,
    26,
    '["Jambes", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire des pas latéraux"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus loin", "Si tu veux plus d''intensité, tu peux ajouter un saut plus haut"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Touche le sol avec ta main"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 19. Box jumps avec claquement
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'box_jumps_claquement',
    'Box jumps avec claquement',
    'Saute sur une boîte et fais un claquement au-dessus de ta tête. Redescends doucement. Garde ton corps aligné et respire régulièrement.',
    'Debout devant une boîte ou un support, les pieds écartés de la largeur des hanches.',
    5, 1, 4, 5,
    '["Boîte ou support"]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux s''affaisser", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur l''atterrissage", "Sens tout ton corps travailler"]',
    null,
    null,
    120,
    30,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux utiliser une boîte plus basse"], "plus_difficiles": ["Si c''est trop facile, tu peux utiliser une boîte plus haute", "Si tu veux plus d''intensité, tu peux ajouter plusieurs claquements"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Atterris doucement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 20. Tabata protocol avancé
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'tabata_protocol_avance',
    'Tabata protocol avancé',
    'Fais 30 secondes d''effort très intense suivi de 15 secondes de repos, répète 10 fois. Choisis un exercice cardio difficile et donne tout pendant les phases d''effort.',
    'Debout, prêt à commencer l''exercice choisi.',
    5, 1, 4, 5,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton rythme baisser", "Ne saute pas les phases de repos"]',
    '["Tu devrais sentir ton cœur s''accélérer", "Concentre-toi sur l''intensité maximale", "Sens tout ton corps travailler"]',
    null,
    null,
    300,
    35,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''intensité"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''intensité", "Si tu veux plus d''intensité, tu peux ajouter plus de cycles"]}',
    '["Maintiens une respiration régulière", "Donne tout pendant l''effort", "Respecte les phases de repos"]',
    null,
    false,
    NOW(),
    NOW()
);
