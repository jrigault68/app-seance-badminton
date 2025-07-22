-- =====================================================
-- INSERTION DES EXERCICES DE GAINAGE
-- Catégorie : Gainage (ID: 6)
-- =====================================================

-- 1. Planche haute
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'planche_haute',
    'Planche haute',
    'Maintiens ton corps en position de pompe avec les bras tendus. Garde ton corps aligné de la tête aux pieds. Contracte tes abdominaux et tes fessiers. Respire régulièrement.',
    'En position de pompe, les mains au sol, les bras tendus, le corps aligné.',
    6, 4, 2, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches s''affaisser", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur l''alignement", "Sens tes épaules stabiliser"]',
    null,
    null,
    60,
    8,
    '["Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sur les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux lever une jambe", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 2. Planche basse
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'planche_basse',
    'Planche basse',
    'Maintiens ton corps en position de pompe avec les avant-bras au sol. Garde ton corps aligné de la tête aux pieds. Contracte tes abdominaux et tes fessiers. Respire régulièrement.',
    'En position de pompe, les avant-bras au sol, les coudes sous les épaules, le corps aligné.',
    6, 4, 2, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches s''affaisser", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur l''alignement", "Sens tes épaules stabiliser"]',
    null,
    null,
    60,
    8,
    '["Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire sur les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux lever une jambe", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 3. Planche latérale
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'planche_laterale',
    'Planche latérale',
    'Maintiens ton corps en position latérale avec un avant-bras au sol. Garde ton corps aligné de la tête aux pieds. Contracte tes abdominaux et tes fessiers. Respire régulièrement.',
    'En position latérale, un avant-bras au sol, le corps aligné, les pieds empilés.',
    6, 4, 2, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches s''affaisser", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes obliques se contracter", "Concentre-toi sur l''alignement", "Sens tes épaules stabiliser"]',
    null,
    null,
    60,
    8,
    '["Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux plier les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux lever la jambe supérieure", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 4. Planche avec alternance de jambes
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'planche_alternance_jambes',
    'Planche avec alternance de jambes',
    'Maintiens la position de planche et lève alternativement tes jambes. Garde ton corps aligné et stable. Contracte tes abdominaux et tes fessiers. Respire régulièrement.',
    'En position de planche, les avant-bras au sol, le corps aligné.',
    6, 4, 3, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches bouger", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur la stabilité", "Sens tes fessiers travailler"]',
    null,
    null,
    90,
    12,
    '["Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire une planche simple"], "plus_difficiles": ["Si c''est trop facile, tu peux lever les deux jambes", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps stable", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 5. Gainage dorsal au sol
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'gainage_dorsal_sol',
    'Gainage dorsal au sol',
    'Allongé sur le ventre, lève ton buste et tes jambes du sol. Garde ton corps aligné et contracte tes muscles du dos. Respire régulièrement.',
    'Allongé sur le ventre, les bras tendus devant, les jambes tendues.',
    6, 7, 2, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne cambre pas trop ton dos", "Ne laisse pas tes jambes tomber"]',
    '["Tu devrais sentir tes muscles du dos se contracter", "Concentre-toi sur l''alignement", "Sens tes fessiers travailler"]',
    null,
    null,
    60,
    8,
    '["Dos", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever seulement le buste"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements de bras"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes muscles du dos"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 6. Superman hold
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'superman_hold',
    'Superman hold',
    'Allongé sur le ventre, lève tes bras et tes jambes du sol en position de superman. Garde ton corps aligné et contracte tes muscles du dos. Respire régulièrement.',
    'Allongé sur le ventre, les bras tendus devant, les jambes tendues.',
    6, 7, 2, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne cambre pas trop ton dos", "Ne laisse pas tes membres tomber"]',
    '["Tu devrais sentir tes muscles du dos se contracter", "Concentre-toi sur l''alignement", "Sens tes fessiers travailler"]',
    null,
    null,
    60,
    8,
    '["Dos", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever seulement les bras"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements alternés"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes muscles du dos"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 7. Hollow hold
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'hollow_hold',
    'Hollow hold',
    'Allongé sur le dos, lève tes jambes et ton buste du sol en formant un creux. Garde ton dos collé au sol et contracte tes abdominaux. Respire régulièrement.',
    'Allongé sur le dos, les bras tendus derrière la tête, les jambes tendues.',
    6, 4, 3, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton dos se décoller", "Ne plie pas tes jambes"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur le creux", "Sens tes muscles profonds travailler"]',
    null,
    null,
    90,
    10,
    '["Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux plier les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements"]}',
    '["Maintiens une respiration régulière", "Garde ton dos collé au sol", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 8. L-sit hold
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'l_sit_hold',
    'L-sit hold',
    'Assis au sol, lève ton corps en appui sur tes mains avec tes jambes tendues devant. Garde ton corps aligné et contracte tes abdominaux. Respire régulièrement.',
    'Assis au sol, les mains au sol à côté des hanches, les jambes tendues devant.',
    6, 4, 4, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes jambes tomber", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur l''équilibre", "Sens tes triceps travailler"]',
    null,
    null,
    120,
    15,
    '["Abdominaux", "Triceps"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux plier les genoux"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 9. Planche avec élévation d'une jambe
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'planche_elevation_jambe',
    'Planche avec élévation d''une jambe',
    'Maintiens la position de planche et lève une jambe vers l''arrière. Garde ton corps aligné et stable. Contracte tes abdominaux et tes fessiers. Respire régulièrement.',
    'En position de planche, les avant-bras au sol, le corps aligné.',
    6, 4, 3, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches bouger", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur la stabilité", "Sens tes fessiers travailler"]',
    null,
    null,
    90,
    12,
    '["Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire une planche simple"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps stable", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 10. Planche latérale avec rotation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'planche_laterale_rotation',
    'Planche latérale avec rotation',
    'Maintiens la position de planche latérale et fais des rotations du tronc. Garde ton corps aligné et stable. Contracte tes abdominaux et tes obliques. Respire régulièrement.',
    'En position de planche latérale, un avant-bras au sol, le corps aligné.',
    6, 4, 3, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches bouger", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes obliques se contracter", "Concentre-toi sur la stabilité", "Sens tes épaules stabiliser"]',
    null,
    null,
    90,
    12,
    '["Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire une planche latérale simple"], "plus_difficiles": ["Si c''est trop facile, tu peux faire plus de rotations", "Si tu veux plus d''intensité, tu peux ajouter une élévation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps stable", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 11. Gainage dorsal avec élévation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'gainage_dorsal_elevation',
    'Gainage dorsal avec élévation',
    'Allongé sur le ventre, lève ton buste et tes jambes plus haut. Garde ton corps aligné et contracte tes muscles du dos. Respire régulièrement.',
    'Allongé sur le ventre, les bras tendus devant, les jambes tendues.',
    6, 7, 3, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne cambre pas trop ton dos", "Ne laisse pas tes jambes tomber"]',
    '["Tu devrais sentir tes muscles du dos se contracter", "Concentre-toi sur l''alignement", "Sens tes fessiers travailler"]',
    null,
    null,
    90,
    12,
    '["Dos", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux lever moins haut"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter des mouvements"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes muscles du dos"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 12. Superman hold avec rotation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'superman_hold_rotation',
    'Superman hold avec rotation',
    'Allongé sur le ventre, lève tes bras et tes jambes et fais des rotations du tronc. Garde ton corps aligné et contracte tes muscles du dos. Respire régulièrement.',
    'Allongé sur le ventre, les bras tendus devant, les jambes tendues.',
    6, 7, 3, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne cambre pas trop ton dos", "Ne laisse pas tes membres tomber"]',
    '["Tu devrais sentir tes muscles du dos se contracter", "Concentre-toi sur l''alignement", "Sens tes fessiers travailler"]',
    null,
    null,
    90,
    12,
    '["Dos", "Fessiers"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire un superman simple"], "plus_difficiles": ["Si c''est trop facile, tu peux faire plus de rotations", "Si tu veux plus d''intensité, tu peux ajouter des mouvements"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes muscles du dos"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 13. Hollow hold avec mouvement
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'hollow_hold_mouvement',
    'Hollow hold avec mouvement',
    'Allongé sur le dos, lève tes jambes et ton buste et fais des mouvements contrôlés. Garde ton dos collé au sol et contracte tes abdominaux. Respire régulièrement.',
    'Allongé sur le dos, les bras tendus derrière la tête, les jambes tendues.',
    6, 4, 4, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas ton dos se décoller", "Ne plie pas tes jambes"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur le creux", "Sens tes muscles profonds travailler"]',
    null,
    null,
    120,
    15,
    '["Abdominaux"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire un hollow hold simple"], "plus_difficiles": ["Si c''est trop facile, tu peux faire plus de mouvements", "Si tu veux plus d''intensité, tu peux ajouter des rotations"]}',
    '["Maintiens une respiration régulière", "Garde ton dos collé au sol", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 14. L-sit hold avec balancement
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'l_sit_hold_balancement',
    'L-sit hold avec balancement',
    'Assis au sol, lève ton corps en appui sur tes mains et fais des balancements contrôlés. Garde ton corps aligné et contracte tes abdominaux. Respire régulièrement.',
    'Assis au sol, les mains au sol à côté des hanches, les jambes tendues devant.',
    6, 4, 4, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes jambes tomber", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur l''équilibre", "Sens tes triceps travailler"]',
    null,
    null,
    120,
    18,
    '["Abdominaux", "Triceps"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire un L-sit simple"], "plus_difficiles": ["Si c''est trop facile, tu peux faire plus de balancements", "Si tu veux plus d''intensité, tu peux ajouter des rotations"]}',
    '["Maintiens une respiration régulière", "Garde ton corps aligné", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 15. Planche avec rotation du tronc
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'planche_rotation_tronc',
    'Planche avec rotation du tronc',
    'Maintiens la position de planche et fais des rotations du tronc. Garde ton corps aligné et stable. Contracte tes abdominaux et tes obliques. Respire régulièrement.',
    'En position de planche, les avant-bras au sol, le corps aligné.',
    6, 4, 4, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches bouger", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes abdominaux se contracter", "Concentre-toi sur la stabilité", "Sens tes obliques travailler"]',
    null,
    null,
    120,
    15,
    '["Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire une planche simple"], "plus_difficiles": ["Si c''est trop facile, tu peux faire plus de rotations", "Si tu veux plus d''intensité, tu peux ajouter une élévation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps stable", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 16. Planche latérale avec élévation
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'planche_laterale_elevation',
    'Planche latérale avec élévation',
    'Maintiens la position de planche latérale et lève ton bras libre vers le haut. Garde ton corps aligné et stable. Contracte tes abdominaux et tes obliques. Respire régulièrement.',
    'En position de planche latérale, un avant-bras au sol, le corps aligné.',
    6, 4, 4, 6,
    '[]',
    '["Ne bloque pas ta respiration", "Ne laisse pas tes hanches bouger", "Ne courbe pas ton dos"]',
    '["Tu devrais sentir tes obliques se contracter", "Concentre-toi sur la stabilité", "Sens tes épaules stabiliser"]',
    null,
    null,
    120,
    15,
    '["Abdominaux", "Épaules"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire une planche latérale simple"], "plus_difficiles": ["Si c''est trop facile, tu peux lever plus haut", "Si tu veux plus d''intensité, tu peux ajouter une rotation"]}',
    '["Maintiens une respiration régulière", "Garde ton corps stable", "Contracte tes abdominaux"]',
    null,
    false,
    NOW(),
    NOW()
);
