 -- Insertion des exercices d'échauffement
-- Catégorie: Échauffement (categorie_id: 1)
-- Généré le: 2024-12-19

-- 1. Marche active sur place
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'marche_active_sur_place',
    'Marche active sur place',
    'Lève alternativement tes genoux vers ta poitrine en gardant le dos droit. Balance tes bras naturellement comme si tu marchais. Maintiens un rythme régulier et respire profondément.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 1, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas tes genoux trop haut"]',
    '["Tu devrais sentir ton cardio monter progressivement", "Concentre-toi sur ta coordination bras-jambes", "Sens tes jambes s''échauffer"]',
    null,
    null,
    3,
    0.5,
    '["Quadriceps", "Fessiers", "Mollets", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter le rythme", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur ta respiration régulière", "Garde ton dos bien droit", "Maintiens un rythme constant"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 2. Genoux hauts alternés
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'genoux_hauts_alternes',
    'Genoux hauts alternés',
    'Lève alternativement tes genoux vers ta poitrine en gardant le dos droit. Balance tes bras en rythme avec tes jambes. Monte tes genoux au moins à hauteur de hanche. Maintiens un rythme soutenu et respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 2, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas tes genoux trop bas"]',
    '["Tu devrais sentir tes quadriceps travailler", "Concentre-toi sur l''élévation de tes genoux", "Sens ton cardio s''activer"]',
    null,
    null,
    2,
    0.3,
    '["Quadriceps", "Fessiers", "Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le rythme"], "plus_difficiles": ["Si c''est trop facile, tu peux monter tes genoux plus haut", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur l''élévation de tes genoux", "Balance tes bras naturellement", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 3. Talons-fesses alternés
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'talons_fesses_alternes',
    'Talons-fesses alternés',
    'Ramène alternativement tes talons vers tes fessiers en pliant les genoux. Garde tes cuisses verticales et ton dos droit. Balance tes bras naturellement. Maintiens un rythme régulier et respire profondément.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 2, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "N''avance pas tes genoux"]',
    '["Tu devrais sentir tes ischio-jambiers s''étirer", "Concentre-toi sur le rapprochement talon-fesse", "Sens tes mollets travailler"]',
    null,
    null,
    2,
    0.3,
    '["Ischio-jambiers", "Fessiers", "Mollets", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux rapprocher davantage tes talons", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur le rapprochement talon-fesse", "Garde tes cuisses verticales", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 4. Rotation des épaules
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_des_epaules',
    'Rotation des épaules',
    'Fais des cercles avec tes coudes en avant puis en arrière. Garde ton dos droit et tes épaules détendues. Respire régulièrement pendant l''exercice.',
    'Debout, les mains posées sur les épaules, le dos droit.',
    1, 9, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes épaules se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    3,
    0.2,
    '["Épaules", "Trapèzes", "Deltoïdes"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde tes épaules détendues", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 5. Rotation des hanches
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_des_hanches',
    'Rotation des hanches',
    'Fais des cercles avec tes hanches dans le sens des aiguilles d''une montre puis dans l''autre sens. Garde ton dos droit et tes jambes légèrement fléchies. Respire régulièrement.',
    'Debout, les mains sur les hanches, les jambes légèrement fléchies.',
    1, 16, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes hanches se mobiliser", "Concentre-toi sur l''amplitude du mouvement", "Sens tes abdominaux se contracter légèrement"]',
    null,
    null,
    4,
    0.2,
    '["Fessiers", "Abdominaux", "Lombaires"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur l''amplitude du mouvement", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 6. Flexions-extensions des chevilles
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'flexions_extensions_chevilles',
    'Flexions-extensions des chevilles',
    'Lève tes talons du sol en te mettant sur la pointe des pieds, puis redescends. Garde ton dos droit et tes jambes tendues. Balance tes bras naturellement. Maintiens un rythme régulier.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 17, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne plie pas tes genoux", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes mollets se contracter", "Concentre-toi sur l''équilibre", "Sens tes chevilles se mobiliser"]',
    null,
    null,
    2,
    0.1,
    '["Mollets", "Tibial antérieur", "Soléaire"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux monter plus haut sur tes pointes", "Si tu veux plus d''intensité, tu peux faire sur une jambe"]}',
    '["Concentre-toi sur l''équilibre", "Monte bien sur tes pointes", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 7. Balancement des bras
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'balancement_des_bras',
    'Balancement des bras',
    'Balance tes bras d''avant en arrière comme si tu marchais. Garde ton dos droit et tes épaules détendues. Augmente progressivement l''amplitude du mouvement. Respire régulièrement pendant l''exercice.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 9, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes épaules se détendre", "Concentre-toi sur l''amplitude du mouvement", "Sens la coordination de tes bras"]',
    null,
    null,
    2,
    0.2,
    '["Épaules", "Deltoïdes", "Trapèzes"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur l''amplitude du mouvement", "Garde tes épaules détendues", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 8. Pas chassés latéraux
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pas_chasses_lateraux',
    'Pas chassés latéraux',
    'Fais des pas chassés vers la droite puis vers la gauche. Garde tes genoux légèrement fléchis et ton dos droit. Balance tes bras naturellement. Maintiens un rythme régulier.',
    'Debout, les pieds écartés de la largeur des hanches, les genoux légèrement fléchis.',
    1, 2, 2, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas trop tes pieds"]',
    '["Tu devrais sentir tes jambes travailler", "Concentre-toi sur la coordination", "Sens ton cardio s''activer"]',
    null,
    null,
    3,
    0.4,
    '["Quadriceps", "Fessiers", "Adducteurs", "Abducteurs"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la vitesse", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur la coordination", "Garde tes genoux fléchis", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 9. Jumping jacks
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'jumping_jacks',
    'Jumping jacks',
    'Saute en écartant tes jambes et en levant tes bras au-dessus de ta tête, puis reviens à la position de départ. Garde ton dos droit et respire régulièrement. Maintiens un rythme soutenu.',
    'Debout, les pieds joints, les bras le long du corps.',
    1, 1, 2, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cardio monter rapidement", "Concentre-toi sur la coordination", "Sens tout ton corps s''activer"]',
    null,
    null,
    2,
    0.5,
    '["Quadriceps", "Fessiers", "Épaules", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sans saut"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la vitesse", "Si tu veux plus d''intensité, tu peux ajouter des squats"]}',
    '["Concentre-toi sur la coordination", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 10. Course sur place
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'course_sur_place',
    'Course sur place',
    'Lève alternativement tes genoux vers ta poitrine en gardant le dos droit. Balance tes bras naturellement comme si tu courais. Maintiens un rythme soutenu et respire profondément.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 1, 2, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas tes genoux trop haut"]',
    '["Tu devrais sentir ton cardio monter rapidement", "Concentre-toi sur le rythme", "Sens tes jambes s''échauffer"]',
    null,
    null,
    2,
    0.6,
    '["Quadriceps", "Fessiers", "Mollets", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la vitesse", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur le rythme", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 11. Rotation des poignets
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_des_poignets',
    'Rotation des poignets',
    'Fais des cercles avec tes poignets dans un sens puis dans l''autre. Garde tes bras tendus devant toi. Respire régulièrement pendant l''exercice.',
    'Debout, les bras tendus devant toi, les paumes ouvertes.',
    1, 13, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes poignets se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    3,
    0.1,
    '["Avant-bras", "Poignets", "Doigts"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde tes bras tendus", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 12. Rotation des coudes
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_des_coudes',
    'Rotation des coudes',
    'Fais des cercles avec tes coudes dans un sens puis dans l''autre. Garde tes bras pliés et tes épaules détendues. Respire régulièrement pendant l''exercice.',
    'Debout, les bras pliés à 90 degrés, les mains sur les épaules.',
    1, 10, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes coudes se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    3,
    0.1,
    '["Bras", "Épaules", "Coudes"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde tes épaules détendues", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 13. Flexion-extension des genoux
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'flexion_extension_genoux',
    'Flexion-extension des genoux',
    'Plie légèrement tes genoux puis redresse-toi. Garde ton dos droit et tes pieds bien ancrés au sol. Balance tes bras naturellement. Maintiens un rythme régulier.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 4, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne plie pas trop tes genoux"]',
    '["Tu devrais sentir tes quadriceps s''échauffer", "Concentre-toi sur la fluidité du mouvement", "Sens tes genoux se mobiliser"]',
    null,
    null,
    3,
    0.2,
    '["Quadriceps", "Fessiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux plier davantage tes genoux", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 14. Balancement des jambes
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'balancement_des_jambes',
    'Balancement des jambes',
    'Balance tes jambes d''avant en arrière en gardant ton équilibre. Garde ton dos droit et tes épaules détendues. Maintiens un rythme régulier et respire profondément.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 2, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir tes jambes se détendre", "Concentre-toi sur l''équilibre", "Sens la mobilité de tes hanches"]',
    null,
    null,
    3,
    0.2,
    '["Quadriceps", "Fessiers", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur l''équilibre", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 15. Rotation du tronc
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_du_tronc',
    'Rotation du tronc',
    'Tourne ton tronc vers la droite puis vers la gauche en gardant tes hanches fixes. Garde ton dos droit et respire régulièrement. Maintiens un rythme lent et contrôlé.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 14, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne bouge pas tes hanches"]',
    '["Tu devrais sentir ton tronc se mobiliser", "Concentre-toi sur la rotation", "Sens tes abdominaux se contracter"]',
    null,
    null,
    4,
    0.2,
    '["Abdominaux", "Lombaires", "Obliques"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la rotation", "Garde tes hanches fixes", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 16. Pas de côté
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'pas_de_cote',
    'Pas de côté',
    'Fais des pas vers la droite puis vers la gauche en gardant tes genoux légèrement fléchis. Garde ton dos droit et balance tes bras naturellement. Maintiens un rythme régulier.',
    'Debout, les pieds écartés de la largeur des hanches, les genoux légèrement fléchis.',
    1, 2, 2, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas trop tes pieds"]',
    '["Tu devrais sentir tes jambes travailler", "Concentre-toi sur la coordination", "Sens ton cardio s''activer"]',
    null,
    null,
    3,
    0.4,
    '["Quadriceps", "Fessiers", "Adducteurs", "Abducteurs"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la vitesse", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur la coordination", "Garde tes genoux fléchis", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 17. Sauts sur place
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'sauts_sur_place',
    'Sauts sur place',
    'Saute sur place en gardant ton dos droit et tes pieds joints. Balance tes bras naturellement. Maintiens un rythme régulier et respire profondément.',
    'Debout, les pieds joints, les bras le long du corps.',
    1, 1, 2, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne saute pas trop haut"]',
    '["Tu devrais sentir ton cardio monter rapidement", "Concentre-toi sur l''atterrissage", "Sens tout ton corps s''activer"]',
    null,
    null,
    2,
    0.5,
    '["Quadriceps", "Fessiers", "Mollets", "Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sans saut"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la hauteur", "Si tu veux plus d''intensité, tu peux ajouter des squats"]}',
    '["Concentre-toi sur l''atterrissage", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 18. Marche avec balancement des bras
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'marche_balancement_bras',
    'Marche avec balancement des bras',
    'Marche sur place en balançant tes bras naturellement. Lève tes genoux vers ta poitrine et balance tes bras en rythme. Maintiens un rythme régulier et respire profondément.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 1, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne courbe pas ton dos", "Ne lève pas tes genoux trop haut"]',
    '["Tu devrais sentir ton cardio monter progressivement", "Concentre-toi sur la coordination", "Sens tes jambes s''échauffer"]',
    null,
    null,
    3,
    0.4,
    '["Quadriceps", "Fessiers", "Mollets", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter le rythme", "Si tu veux plus d''intensité, tu peux ajouter des sauts"]}',
    '["Concentre-toi sur la coordination", "Garde ton dos droit", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 19. Rotation des chevilles
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'rotation_des_chevilles',
    'Rotation des chevilles',
    'Fais des cercles avec tes chevilles dans un sens puis dans l''autre. Garde ton équilibre et respire régulièrement. Maintiens un rythme lent et contrôlé.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 17, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir tes chevilles se détendre", "Concentre-toi sur la fluidité du mouvement", "Sens la mobilité de tes articulations"]',
    null,
    null,
    3,
    0.1,
    '["Chevilles", "Mollets", "Tibial antérieur"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux faire des cercles plus larges", "Si tu veux plus d''intensité, tu peux faire sur une jambe"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Garde ton équilibre", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 20. Étirements dynamiques légers
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirements_dynamiques_legers',
    'Étirements dynamiques légers',
    'Fais des mouvements d''étirement dynamique en gardant ton dos droit. Étire tes bras vers le haut puis vers les côtés. Respire régulièrement et ne force pas les mouvements.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    1, 1, 1, 1,
    '[]',
    '["Ne bloque pas ta respiration", "Ne force pas les mouvements", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes muscles s''étirer légèrement", "Concentre-toi sur la fluidité du mouvement", "Sens ton corps se détendre"]',
    null,
    null,
    4,
    0.3,
    '["Épaules", "Dos", "Bras", "Tronc"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux ralentir le mouvement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux ajouter de la résistance"]}',
    '["Concentre-toi sur la fluidité du mouvement", "Ne force pas les étirements", "Respire régulièrement"]',
    null,
    false,
    NOW(),
    NOW()
);