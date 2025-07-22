-- Insertion des exercices d'étirement
-- Catégorie: Étirement (categorie_id: 4)
-- Généré le: 2024-12-19

-- 1. Étirement des ischio-jambiers assis
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_ischio_jambiers_assis',
    'Étirement des ischio-jambiers assis',
    'Penche-toi vers l''avant en gardant le dos droit pour étirer l''arrière de tes cuisses.',
    'Assis au sol, les jambes tendues devant toi, le dos droit.',
    4, 4, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne courbe pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir l''arrière de tes cuisses s''étirer", "Concentre-toi sur ta respiration", "Sens la tension se relâcher progressivement"]',
    null,
    null,
    30,
    0.15,
    '["Ischio-jambiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux plier légèrement les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux aller plus loin", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Va progressivement dans l''étirement", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 2. Étirement des quadriceps debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_quadriceps_debout',
    'Étirement des quadriceps debout',
    'Plie ton genou en ramenant ton pied vers tes fessiers pour étirer l''avant de ta cuisse.',
    'Debout, les pieds écartés de la largeur des hanches, les mains sur les hanches.',
    4, 4, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne perds pas l''équilibre"]',
    '["Tu devrais sentir l''avant de ta cuisse s''étirer", "Concentre-toi sur l''équilibre", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.1,
    '["Quadriceps", "Psoas"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux rapprocher ton pied"], "plus_difficiles": ["Si c''est trop facile, tu peux rapprocher ton pied", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 3. Étirement des mollets au mur
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_mollets_mur',
    'Étirement des mollets au mur',
    'Pousse ton talon vers le sol en gardant ta jambe tendue pour étirer ton mollet.',
    'Face au mur, une jambe en avant pliée, l''autre jambe tendue en arrière.',
    4, 5, 1, 8,
    '["Mur"]',
    '["Ne force pas l''étirement", "Ne laisse pas ton talon se décoller", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir ton mollet s''étirer", "Concentre-toi sur la pression du talon", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.1,
    '["Mollets", "Achille"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux rapprocher ton pied"], "plus_difficiles": ["Si c''est trop facile, tu peux reculer davantage", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 4. Étirement des fessiers en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_fessiers_assis',
    'Étirement des fessiers en position assise',
    'Croise ta jambe sur l''autre et tire ton genou vers ta poitrine pour étirer tes fessiers.',
    'Assis au sol, le dos droit, les jambes tendues devant toi.',
    4, 3, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne courbe pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes fessiers s''étirer", "Concentre-toi sur ta respiration", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.15,
    '["Fessiers", "Piriforme"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux rapprocher ton genou", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 5. Étirement des pectoraux au mur
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_pectoraux_mur',
    'Étirement des pectoraux au mur',
    'Place ton bras contre le mur et tourne ton corps pour étirer tes pectoraux.',
    'Debout face au mur, un bras tendu contre le mur à hauteur d''épaule.',
    4, 8, 2, 8,
    '["Mur"]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes pectoraux s''étirer", "Concentre-toi sur la rotation", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.15,
    '["Pectoraux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la rotation", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 6. Étirement du dos en position allongée
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_dos_allonge',
    'Étirement du dos en position allongée',
    'Ramène tes genoux vers ta poitrine et balance-toi doucement pour étirer ton dos.',
    'Allongé sur le dos, les jambes tendues, les bras le long du corps.',
    4, 7, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne balance pas trop fort", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir ton dos s''étirer", "Concentre-toi sur le balancement", "Sens la tension se relâcher"]',
    null,
    null,
    45,
    0.2,
    '["Lombaires", "Dorsaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire le balancement"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''amplitude", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde tes épaules au sol", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 7. Étirement des épaules en position debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_epaules_debout',
    'Étirement des épaules en position debout',
    'Passe ton bras devant ta poitrine et tire-le avec l''autre bras pour étirer ton épaule.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    4, 9, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir ton épaule s''étirer", "Concentre-toi sur la traction", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.1,
    '["Épaules", "Deltos"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la traction", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 8. Étirement des triceps derrière la tête
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_triceps_tete',
    'Étirement des triceps derrière la tête',
    'Plie ton bras derrière ta tête et tire ton coude avec l''autre main pour étirer tes triceps.',
    'Debout ou assis, le dos droit, les bras le long du corps.',
    4, 11, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes triceps s''étirer", "Concentre-toi sur la traction", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.1,
    '["Triceps", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la traction", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 9. Étirement des hanches en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_hanches_assis',
    'Étirement des hanches en position assise',
    'Place tes pieds l''un contre l''autre et pousse tes genoux vers le sol pour étirer tes hanches.',
    'Assis au sol, le dos droit, les pieds joints devant toi.',
    4, 16, 2, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne courbe pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes hanches s''étirer", "Concentre-toi sur la pression des genoux", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.15,
    '["Adducteurs", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux écarter les pieds"], "plus_difficiles": ["Si c''est trop facile, tu peux rapprocher tes pieds", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 10. Étirement du psoas en fente
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_psoas_fente',
    'Étirement du psoas en fente',
    'Fais une fente et pousse tes hanches vers l''avant pour étirer ton psoas.',
    'En position de fente, une jambe en avant pliée, l''autre jambe tendue en arrière.',
    4, 16, 2, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir ton psoas s''étirer", "Concentre-toi sur la poussée des hanches", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.2,
    '["Psoas", "Quadriceps"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la poussée", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 11. Étirement des adducteurs en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_adducteurs_assis',
    'Étirement des adducteurs en position assise',
    'Écarte tes jambes et penche-toi vers l''avant pour étirer tes adducteurs.',
    'Assis au sol, les jambes écartées, le dos droit.',
    4, 2, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne courbe pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes adducteurs s''étirer", "Concentre-toi sur ta respiration", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.15,
    '["Adducteurs", "Ischio-jambiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux plier légèrement les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux aller plus loin", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 12. Étirement complet du corps en position allongée
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_complet_corps',
    'Étirement complet du corps en position allongée',
    'Étire tes bras et tes jambes dans des directions opposées pour étirer tout ton corps.',
    'Allongé sur le dos, les jambes tendues, les bras tendus au-dessus de la tête.',
    4, 1, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tout ton corps s''étirer", "Concentre-toi sur ta respiration", "Sens la tension se relâcher"]',
    null,
    null,
    60,
    0.25,
    '["Tout le corps", "Colonne vertébrale"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''étirement", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos au sol", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 13. Étirement des ischio-jambiers debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_ischio_jambiers_debout',
    'Étirement des ischio-jambiers debout',
    'Penche-toi vers l''avant en gardant tes jambes tendues pour étirer l''arrière de tes cuisses.',
    'Debout, les pieds écartés de la largeur des hanches, les jambes tendues.',
    4, 4, 2, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne courbe pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir l''arrière de tes cuisses s''étirer", "Concentre-toi sur ta respiration", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.2,
    '["Ischio-jambiers", "Mollets"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux plier légèrement les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux aller plus loin", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 14. Étirement des quadriceps allongé
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_quadriceps_allonge',
    'Étirement des quadriceps allongé',
    'Plie ton genou et tire ton pied vers tes fessiers pour étirer l''avant de ta cuisse.',
    'Allongé sur le côté, la jambe du dessus pliée, l''autre jambe tendue.',
    4, 4, 1, 8,
    '[]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux rapprocher ton pied", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 15. Étirement des mollets en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_mollets_assis',
    'Étirement des mollets en position assise',
    'Tire tes orteils vers toi pour étirer tes mollets.',
    'Assis au sol, les jambes tendues devant toi, le dos droit.',
    4, 5, 1, 8,
    '[]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux augmenter la traction"], "plus_difficiles": ["Si c''est trop facile, tu peux réduire l''amplitude", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 16. Étirement des fessiers allongé
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_fessiers_allonge',
    'Étirement des fessiers allongé',
    'Croise ta jambe sur l''autre et tire ton genou vers ta poitrine pour étirer tes fessiers.',
    'Allongé sur le dos, les jambes tendues, les bras le long du corps.',
    4, 3, 1, 8,
    '[]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux rapprocher ton genou", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos au sol", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 17. Étirement des pectoraux en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_pectoraux_assis',
    'Étirement des pectoraux en position assise',
    'Place tes mains derrière ta tête et écarte tes coudes pour étirer tes pectoraux.',
    'Assis, le dos droit, les mains derrière la tête.',
    4, 8, 2, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes pectoraux s''étirer", "Concentre-toi sur l''écartement", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.15,
    '["Pectoraux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''écartement", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 18. Étirement du dos en position debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_dos_debout',
    'Étirement du dos en position debout',
    'Penche-toi vers l''avant en gardant le dos droit pour étirer ton dos.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    4, 7, 2, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne courbe pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir ton dos s''étirer", "Concentre-toi sur ta respiration", "Sens la tension se relâcher"]',
    null,
    null,
    45,
    0.2,
    '["Lombaires", "Dorsaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux aller plus loin"], "plus_difficiles": ["Si c''est trop facile, tu peux réduire l''amplitude", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 19. Étirement des épaules en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_epaules_assis',
    'Étirement des épaules en position assise',
    'Passe ton bras devant ta poitrine et tire-le avec l''autre bras pour étirer ton épaule.',
    'Assis, le dos droit, les bras le long du corps.',
    4, 9, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir ton épaule s''étirer", "Concentre-toi sur la traction", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.1,
    '["Épaules", "Deltos"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la traction", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 20. Étirement des triceps en position debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_triceps_debout',
    'Étirement des triceps en position debout',
    'Plie ton bras derrière ta tête et tire ton coude avec l''autre main pour étirer tes triceps.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    4, 11, 1, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes triceps s''étirer", "Concentre-toi sur la traction", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.1,
    '["Triceps", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la traction", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 21. Étirement des hanches en position debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_hanches_debout',
    'Étirement des hanches en position debout',
    'Lève ta jambe et place ton pied sur un support pour étirer tes hanches.',
    'Debout, les pieds écartés de la largeur des hanches, les mains sur les hanches.',
    4, 16, 2, 8,
    '["Chaise ou support"]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes hanches s''étirer", "Concentre-toi sur l''équilibre", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.2,
    '["Adducteurs", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux augmenter la hauteur"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la hauteur", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 22. Étirement du psoas allongé
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_psoas_allonge',
    'Étirement du psoas allongé',
    'Allonge-toi sur le bord d''un lit et laisse ta jambe pendre pour étirer ton psoas.',
    'Allongé sur le dos, une jambe sur le lit, l''autre jambe pendante.',
    4, 16, 2, 8,
    '["Lit ou support"]',
    '["Ne force pas l''étirement", "Ne cambre pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir ton psoas s''étirer", "Concentre-toi sur la relaxation", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.15,
    '["Psoas", "Quadriceps"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter l''étirement", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos au sol", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 23. Étirement des adducteurs debout
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_adducteurs_debout',
    'Étirement des adducteurs debout',
    'Écarte tes jambes et penche-toi sur le côté pour étirer tes adducteurs.',
    'Debout, les jambes très écartées, les mains sur les hanches.',
    4, 2, 2, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne courbe pas ton dos", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes adducteurs s''étirer", "Concentre-toi sur la flexion latérale", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.2,
    '["Adducteurs", "Ischio-jambiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux aller plus loin", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde ton dos droit", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 24. Étirement des obliques en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirement_obliques_assis',
    'Étirement des obliques en position assise',
    'Tourne ton tronc sur le côté en gardant tes hanches fixes pour étirer tes obliques.',
    'Assis au sol, les jambes tendues, le dos droit.',
    4, 6, 2, 8,
    '[]',
    '["Ne force pas l''étirement", "Ne bouge pas tes hanches", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir tes obliques s''étirer", "Concentre-toi sur la rotation", "Sens la tension se relâcher"]',
    null,
    null,
    30,
    0.15,
    '["Obliques", "Tronc"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux réduire l''amplitude"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la rotation", "Si tu veux plus d''intensité, tu peux tenir plus longtemps"]}',
    '["Respire profondément", "Garde tes hanches fixes", "Écoute ton corps"]',
    null,
    false,
    NOW(),
    NOW()
); 