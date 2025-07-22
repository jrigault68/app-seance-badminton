-- Insertion des exercices de renforcement
-- Catégorie: Renforcement (categorie_id: 3)
-- Généré le: 2024-12-19

-- 1. Pompes classiques
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pompes_classiques',
    'Pompes classiques',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'En position de planche, les mains au sol écartées de la largeur des épaules, les bras tendus.',
    3, 8, 2, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne laisse pas tes hanches s''affaisser"]',
    '["Tu devrais sentir tes pectoraux se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes triceps travailler"]',
    null,
    null,
    3,
    0.4,
    '["Pectoraux", "Triceps", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux passer aux pompes classiques", "Si tu veux plus d''intensité, tu peux ralentir le mouvement"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 2. Pompes sur les genoux
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pompes_genoux',
    'Pompes sur les genoux',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'En position de planche sur les genoux, les mains au sol écartées de la largeur des épaules.',
    3, 8, 1, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne laisse pas tes hanches s''affaisser"]',
    '["Tu devrais sentir tes pectoraux se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes triceps travailler"]',
    null,
    null,
    3,
    0.3,
    '["Pectoraux", "Triceps", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux descendre plus bas", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 3. Squats au poids du corps
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'squats_poids_corps',
    'Squats au poids du corps',
    'Plie tes genoux en descendant tes fessiers vers l''arrière puis remonte.',
    'Debout, les pieds écartés de la largeur des épaules, les bras tendus devant toi.',
    3, 2, 2, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux dépasser tes orteils", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes quadriceps se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes fessiers travailler"]',
    null,
    null,
    4,
    0.5,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux descendre plus bas"], "plus_difficiles": ["Si c''est trop facile, tu peux réduire l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur la technique", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 4. Fentes avant alternées
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'fentes_avant_alternes',
    'Fentes avant alternées',
    'Fais un pas en avant et plie les deux genoux puis reviens à la position de départ.',
    'Debout, les pieds écartés de la largeur des hanches, les mains sur les hanches.',
    3, 2, 2, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton genou arrière toucher le sol", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes quadriceps se contracter", "Concentre-toi sur l''équilibre", "Sens tes fessiers travailler"]',
    null,
    null,
    5,
    0.6,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des fentes plus profondes", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur l''équilibre", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 5. Pont fessier au sol
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pont_fessier_sol',
    'Pont fessier au sol',
    'Lève tes hanches vers le haut en contractant tes fessiers puis redescends.',
    'Allongé sur le dos, les genoux pliés, les pieds au sol, les bras le long du corps.',
    3, 3, 1, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne cambre pas trop ton dos", "Ne laisse pas tes hanches s''affaisser"]',
    '["Tu devrais sentir tes fessiers se contracter", "Concentre-toi sur la montée contrôlée", "Sens tes ischio-jambiers travailler"]',
    null,
    null,
    4,
    0.3,
    '["Fessiers", "Ischio-jambiers", "Lombaires"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever une jambe"], "plus_difficiles": ["Si c''est trop facile, tu peux réduire l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter une pause en haut"]}',
    '["Concentre-toi sur la contraction des fessiers", "Garde ton dos neutre", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 6. Chaise murale isométrique
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'chaise_murale_isometrique',
    'Chaise murale isométrique',
    'Maintiens la position de chaise en appui contre le mur.',
    'Dos contre le mur, les genoux pliés à 90 degrés, les pieds écartés de la largeur des hanches.',
    3, 4, 2, 6,
    '["Mur"]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux dépasser tes orteils", "Ne te laisse pas glisser"]',
    '["Tu devrais sentir tes quadriceps brûler", "Concentre-toi sur le maintien de la position", "Sens tes fessiers se contracter"]',
    null,
    null,
    45,
    0.4,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux remonter légèrement"], "plus_difficiles": ["Si c''est trop facile, tu peux descendre plus bas", "Si tu veux plus d''intensité, tu peux lever une jambe"]}',
    '["Concentre-toi sur le maintien", "Garde ton dos contre le mur", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 7. Dips sur chaise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'dips_chaise',
    'Dips sur chaise',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'Assis sur une chaise, les mains sur le bord, les jambes tendues devant toi.',
    3, 11, 2, 2,
    '["Chaise stable"]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes épaules monter", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes triceps se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes épaules travailler"]',
    null,
    null,
    4,
    0.4,
    '["Triceps", "Épaules", "Pectoraux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux plier les jambes"], "plus_difficiles": ["Si c''est trop facile, tu peux ralentir le mouvement", "Si tu veux plus d''intensité, tu peux ajouter une pause en bas"]}',
    '["Concentre-toi sur la technique", "Garde tes épaules basses", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 8. Burpees
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'burpees',
    'Burpees',
    'Descends en position de pompe, fais une pompe, puis saute en levant les bras.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    3, 1, 3, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne saute pas trop haut", "Ne laisse pas ton dos s''affaisser"]',
    '["Tu devrais sentir tout ton corps travailler", "Concentre-toi sur la fluidité", "Sens ton cardio monter"]',
    null,
    null,
    6,
    0.75,
    '["Pectoraux", "Triceps", "Quadriceps", "Fessiers", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux enlever le saut"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un saut plus haut", "Si tu veux plus d''intensité, tu peux ajouter une pompe"]}',
    '["Concentre-toi sur la fluidité", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 9. Mountain climbers
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'mountain_climbers',
    'Mountain climbers',
    'Ramène alternativement tes genoux vers ta poitrine en position de planche.',
    'En position de planche, les mains au sol, les bras tendus, le corps aligné.',
    3, 1, 2, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches bouger", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur la stabilité", "Sens ton cardio monter"]',
    null,
    null,
    3,
    0.6,
    '["Abdominaux", "Épaules", "Triceps", "Quadriceps"]',
    '{"plus_faciles": ["Si c''est trop facile, tu peux accélérer le rythme"], "plus_difficiles": ["Si c''est trop difficile, tu peux ralentir", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur la stabilité", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 10. Jump squats
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'jump_squats',
    'Jump squats',
    'Plie tes genoux puis saute en levant les bras vers le haut.',
    'Debout, les pieds écartés de la largeur des épaules, les bras le long du corps.',
    3, 2, 3, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne saute pas trop haut", "Ne laisse pas tes genoux s''effondrer"]',
    '["Tu devrais sentir tes quadriceps exploser", "Concentre-toi sur l''atterrissage", "Sens tes fessiers travailler"]',
    null,
    null,
    4,
    0.7,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire des squats simples"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus haut", "Si tu veux plus d''intensité, tu peux ajouter une pause en bas"]}',
    '["Concentre-toi sur l''atterrissage", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 11. Push-ups diamant
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'push_ups_diamant',
    'Push-ups diamant',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'En position de planche, les mains formant un diamant sous ta poitrine, les bras tendus.',
    3, 11, 3, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne laisse pas tes hanches s''affaisser"]',
    '["Tu devrais sentir tes triceps se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes pectoraux travailler"]',
    null,
    null,
    4,
    0.5,
    '["Triceps", "Pectoraux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sur les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux ralentir le mouvement", "Si tu veux plus d''intensité, tu peux ajouter un claquement"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 12. Pistol squats
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pistol_squats',
    'Pistol squats',
    'Plie ton genou en descendant sur une jambe puis remonte.',
    'Debout sur une jambe, l''autre jambe tendue devant toi, les bras tendus devant toi.',
    3, 2, 4, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton genou dépasser ton orteil", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir tes quadriceps se contracter", "Concentre-toi sur l''équilibre", "Sens tes fessiers travailler"]',
    null,
    null,
    6,
    0.8,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux tenir un support"], "plus_difficiles": ["Si c''est trop facile, tu peux descendre plus bas", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur l''équilibre", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 13. Handstand push-ups
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'handstand_push_ups',
    'Handstand push-ups',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'En équilibre sur les mains contre le mur, le corps vertical, les bras tendus.',
    3, 9, 4, 2,
    '["Mur"]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton corps basculer", "Ne plie pas trop les bras"]',
    '["Tu devrais sentir tes épaules se contracter", "Concentre-toi sur l''équilibre", "Sens tes triceps travailler"]',
    null,
    null,
    8,
    0.9,
    '["Épaules", "Triceps", "Trapèzes"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire contre le mur"], "plus_difficiles": ["Si c''est trop facile, tu peux ralentir le mouvement", "Si tu veux plus d''intensité, tu peux ajouter une pause en bas"]}',
    '["Concentre-toi sur l''équilibre", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 14. Pull-ups
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pull_ups',
    'Pull-ups',
    'Tire ton corps vers le haut jusqu''à ce que ton menton passe au-dessus de la barre puis redescends.',
    'Suspendu à une barre de traction, les bras tendus, les mains en pronation.',
    3, 7, 3, 2,
    '["Barre de traction"]',
    '["Ne bloque pas ta respiration", "Ne balance pas ton corps", "Ne laisse pas tes épaules monter"]',
    '["Tu devrais sentir tes dorsaux se contracter", "Concentre-toi sur la traction contrôlée", "Sens tes biceps travailler"]',
    null,
    null,
    6,
    0.6,
    '["Dorsaux", "Biceps", "Trapèzes"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux utiliser une bande"], "plus_difficiles": ["Si c''est trop facile, tu peux ralentir le mouvement", "Si tu veux plus d''intensité, tu peux ajouter une pause en haut"]}',
    '["Concentre-toi sur la technique", "Garde tes épaules basses", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 15. Muscle-ups
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'muscle_ups',
    'Muscle-ups',
    'Tire ton corps vers le haut puis pousse pour passer au-dessus de la barre.',
    'Suspendu à une barre de traction, les bras tendus, les mains en pronation.',
    3, 1, 4, 2,
    '["Barre de traction"]',
    '["Ne bloque pas ta respiration", "Ne balance pas ton corps", "Ne laisse pas tes épaules monter"]',
    '["Tu devrais sentir tout ton corps travailler", "Concentre-toi sur la transition", "Sens tes épaules exploser"]',
    null,
    null,
    8,
    1.0,
    '["Dorsaux", "Biceps", "Épaules", "Triceps", "Pectoraux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire des pull-ups"], "plus_difficiles": ["Si c''est trop facile, tu peux ralentir le mouvement", "Si tu veux plus d''intensité, tu peux ajouter une pause en haut"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 16. Fentes latérales
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'fentes_laterales',
    'Fentes latérales',
    'Fais un pas sur le côté et plie le genou de la jambe de support puis reviens.',
    'Debout, les pieds écartés de la largeur des hanches, les mains sur les hanches.',
    3, 2, 2, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton genou dépasser ton orteil", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes adducteurs se contracter", "Concentre-toi sur l''équilibre", "Sens tes fessiers travailler"]',
    null,
    null,
    5,
    0.6,
    '["Quadriceps", "Fessiers", "Adducteurs"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des fentes plus profondes", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur l''équilibre", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 17. Pompes déclinées
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pompes_declinees',
    'Pompes déclinées',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'En position de planche, les pieds surélevés sur un support, les mains au sol.',
    3, 8, 3, 2,
    '["Chaise ou support"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux surélever davantage"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des pompes classiques"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un claquement"]}',
    '["Tu devrais sentir tes pectoraux se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes triceps travailler"]',
    null,
    null,
    4,
    0.5,
    '["Pectoraux", "Triceps", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux surélever davantage"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des pompes classiques"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un claquement"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 18. Squats sumo
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'squats_sumo',
    'Squats sumo',
    'Plie tes genoux en écartant les jambes puis remonte.',
    'Debout, les pieds très écartés, les orteils pointés vers l''extérieur, les mains sur les hanches.',
    3, 2, 2, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux dépasser tes orteils", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes adducteurs se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes fessiers travailler"]',
    null,
    null,
    4,
    0.5,
    '["Quadriceps", "Fessiers", "Adducteurs"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux descendre plus bas"], "plus_difficiles": ["Si c''est trop facile, tu peux réduire l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur la technique", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 19. Dips sur barres parallèles
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'dips_barres_paralleles',
    'Dips sur barres parallèles',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'Suspendu entre deux barres parallèles, les bras tendus, le corps vertical.',
    3, 11, 3, 2,
    '["Barres parallèles"]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes épaules monter", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes triceps se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes épaules travailler"]',
    null,
    null,
    5,
    0.6,
    '["Triceps", "Épaules", "Pectoraux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux utiliser une bande"], "plus_difficiles": ["Si c''est trop facile, tu peux ralentir le mouvement", "Si tu veux plus d''intensité, tu peux ajouter une pause en bas"]}',
    '["Concentre-toi sur la technique", "Garde tes épaules basses", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 20. Fentes arrière
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'fentes_arriere',
    'Fentes arrière',
    'Fais un pas en arrière et plie les deux genoux puis reviens à la position de départ.',
    'Debout, les pieds écartés de la largeur des hanches, les mains sur les hanches.',
    3, 2, 2, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton genou arrière toucher le sol", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes quadriceps se contracter", "Concentre-toi sur l''équilibre", "Sens tes fessiers travailler"]',
    null,
    null,
    5,
    0.6,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des fentes plus profondes", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur l''équilibre", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 21. Pompes avec claquement
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pompes_claquement',
    'Pompes avec claquement',
    'Descends ton corps en pliant les bras puis remonte en sautant et en claquant des mains.',
    'En position de planche, les mains au sol écartées de la largeur des épaules, les bras tendus.',
    3, 8, 4, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne saute pas trop haut", "Ne laisse pas ton dos s''affaisser"]',
    '["Tu devrais sentir tes pectoraux exploser", "Concentre-toi sur l''atterrissage", "Sens tes triceps travailler"]',
    null,
    null,
    6,
    0.75,
    '["Pectoraux", "Triceps", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux sauter plus haut"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des pompes classiques"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un double claquement"]}',
    '["Concentre-toi sur l''atterrissage", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 22. Squats bulgares
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'squats_bulgares',
    'Squats bulgares',
    'Plie ton genou en descendant sur une jambe avec l''autre jambe posée sur un support.',
    'Debout face à un support, une jambe posée dessus, l''autre jambe au sol.',
    3, 2, 3, 2,
    '["Chaise ou support"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux descendre plus bas"], "plus_difficiles": ["Si c''est trop facile, tu peux réduire l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Tu devrais sentir tes quadriceps se contracter", "Concentre-toi sur l''équilibre", "Sens tes fessiers travailler"]',
    null,
    null,
    6,
    0.7,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux descendre plus bas"], "plus_difficiles": ["Si c''est trop facile, tu peux réduire l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur l''équilibre", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 23. Pompes avec rotation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pompes_rotation',
    'Pompes avec rotation',
    'Descends ton corps en pliant les bras puis remonte en tournant ton corps sur le côté.',
    'En position de planche, les mains au sol écartées de la largeur des épaules, les bras tendus.',
    3, 8, 3, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches s''affaisser", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir tes pectoraux se contracter", "Concentre-toi sur la rotation contrôlée", "Sens tes abdominaux travailler"]',
    null,
    null,
    6,
    0.6,
    '["Pectoraux", "Triceps", "Épaules", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire une rotation plus complète"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des pompes classiques"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un saut"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 24. Fentes sautées
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'fentes_sautees',
    'Fentes sautées',
    'Fais une fente puis saute en changeant de jambe en l''air.',
    'Debout, les pieds écartés de la largeur des hanches, les mains sur les hanches.',
    3, 2, 3, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne saute pas trop haut", "Ne laisse pas tes genoux s''effondrer"]',
    '["Tu devrais sentir tes quadriceps exploser", "Concentre-toi sur l''atterrissage", "Sens tes fessiers travailler"]',
    null,
    null,
    6,
    0.8,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire des fentes simples"], "plus_difficiles": ["Si c''est trop facile, tu peux sauter plus haut", "Si tu veux plus d''intensité, tu peux ajouter une pause en bas"]}',
    '["Concentre-toi sur l''atterrissage", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 25. Pompes avec élévation des jambes
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pompes_elevation_jambes',
    'Pompes avec élévation des jambes',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'En position de planche, les mains au sol, les jambes surélevées sur un support.',
    3, 8, 4, 2,
    '["Chaise ou support"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux surélever davantage"], "plus_difficiles": ["Si c''est trop facile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux accélérer le rythme", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Tu devrais sentir tes pectoraux se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes abdominaux travailler"]',
    null,
    null,
    6,
    0.7,
    '["Pectoraux", "Triceps", "Épaules", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux surélever davantage"], "plus_difficiles": ["Si c''est trop facile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux accélérer le rythme", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 26. Squats avec saut
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'squats_saut',
    'Squats avec saut',
    'Plie tes genoux puis saute en levant les bras vers le haut.',
    'Debout, les pieds écartés de la largeur des épaules, les bras le long du corps.',
    3, 2, 3, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne saute pas trop haut", "Ne laisse pas tes genoux s''effondrer"]',
    '["Tu devrais sentir tes quadriceps exploser", "Concentre-toi sur l''atterrissage", "Sens tes fessiers travailler"]',
    null,
    null,
    4,
    0.75,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux sauter plus haut"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des squats simples", "Si tu veux plus d''intensité, tu peux ajouter une pause en bas"]}',
    '["Concentre-toi sur l''atterrissage", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 27. Pompes avec marche latérale
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pompes_marche_laterale',
    'Pompes avec marche latérale',
    'Descends ton corps en pliant les bras puis remonte en te déplaçant sur le côté.',
    'En position de planche, les mains au sol écartées de la largeur des épaules, les bras tendus.',
    3, 8, 4, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches s''affaisser", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir tes pectoraux se contracter", "Concentre-toi sur le déplacement contrôlé", "Sens tes abdominaux travailler"]',
    null,
    null,
    8,
    0.9,
    '["Pectoraux", "Triceps", "Épaules", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire plus de déplacements"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des pompes classiques"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un saut"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 28. Fentes avec rotation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'fentes_rotation',
    'Fentes avec rotation',
    'Fais une fente puis tourne ton tronc vers le côté de la jambe avant.',
    'Debout, les pieds écartés de la largeur des hanches, les bras tendus devant toi.',
    3, 2, 3, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton genou dépasser ton orteil", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir tes quadriceps se contracter", "Concentre-toi sur la rotation contrôlée", "Sens tes abdominaux travailler"]',
    null,
    null,
    6,
    0.7,
    '["Quadriceps", "Fessiers", "Mollets", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire une rotation plus complète"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des fentes simples"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un saut"]}',
    '["Concentre-toi sur l''équilibre", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 29. Pompes avec élévation d'une jambe
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pompes_elevation_jambe',
    'Pompes avec élévation d''une jambe',
    'Descends ton corps en pliant les bras puis remonte en les tendant.',
    'En position de planche, les mains au sol, une jambe levée vers l''arrière.',
    3, 8, 4, 2,
    '[]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever la jambe plus haut"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des pompes classiques"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un claquement"]}',
    '["Tu devrais sentir tes pectoraux se contracter", "Concentre-toi sur la stabilité", "Sens tes abdominaux travailler"]',
    null,
    null,
    6,
    0.8,
    '["Pectoraux", "Triceps", "Épaules", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever la jambe plus haut"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des pompes classiques"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter un claquement"]}',
    '["Concentre-toi sur la technique", "Garde ton corps aligné", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 30. Squats avec élévation des talons
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'squats_elevation_talons',
    'Squats avec élévation des talons',
    'Plie tes genoux en levant tes talons puis redescends-les.',
    'Debout, les pieds écartés de la largeur des épaules, les bras tendus devant toi.',
    3, 2, 2, 2,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes genoux dépasser tes orteils", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes mollets se contracter", "Concentre-toi sur la descente contrôlée", "Sens tes quadriceps travailler"]',
    null,
    null,
    4,
    0.6,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux descendre plus bas"], "plus_difficiles": ["Si c''est trop facile, tu peux réduire l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter un saut"]}',
    '["Concentre-toi sur la technique", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
); 