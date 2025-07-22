-- =====================================================
-- INSERTION DES EXERCICES DE RÉCUPÉRATION ACTIVE
-- Catégorie : Récupération Active (ID: 7)
-- =====================================================

-- 1. Marche lente
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'marche_lente',
    'Marche lente',
    'Marche à un rythme très lent et détendu. Garde tes épaules relâchées et respire profondément. Concentre-toi sur la détente et la récupération.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    7, 1, 1, 7,
    '[]',
    '["Ne marche pas trop vite", "Ne tends pas tes épaules", "Ne bloque pas ta respiration"]',
    '["Tu devrais te sentir détendu", "Concentre-toi sur la respiration", "Sens tes muscles se relâcher"]',
    null,
    null,
    300,
    25,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux t''arrêter pour respirer"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter des mouvements de bras", "Si tu veux plus d''intensité, tu peux marcher un peu plus vite"]}',
    '["Respire profondément", "Garde tes épaules relâchées", "Concentre-toi sur la détente"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 2. Étirements doux en position allongée
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirements_doux_allonges',
    'Étirements doux en position allongée',
    'Allongé sur le dos, fais des étirements très doux de tes jambes et de tes bras. Ne force jamais et respire profondément. Concentre-toi sur la détente.',
    'Allongé sur le dos, les jambes tendues, les bras le long du corps.',
    7, 1, 1, 7,
    '[]',
    '["Ne force jamais", "Ne bloque pas ta respiration", "Ne tends pas tes muscles"]',
    '["Tu devrais te sentir détendu", "Concentre-toi sur la respiration", "Sens tes muscles s''étirer doucement"]',
    null,
    null,
    180,
    8,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire moins d''étirements"], "plus_difficiles": ["Si c''est trop facile, tu peux tenir plus longtemps", "Si tu veux plus d''intensité, tu peux ajouter des étirements plus variés"]}',
    '["Respire profondément", "Ne force jamais", "Concentre-toi sur la détente"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 3. Respiration diaphragmatique
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'respiration_diaphragmatique',
    'Respiration diaphragmatique',
    'Allongé sur le dos, pose tes mains sur ton ventre et respire profondément. Sens ton ventre se gonfler à l''inspiration et se dégonfler à l''expiration.',
    'Allongé sur le dos, les jambes pliées, les mains sur le ventre.',
    7, 3, 1, 7,
    '[]',
    '["Ne force pas ta respiration", "Ne tends pas tes épaules", "Ne bloque pas ta respiration"]',
    '["Tu devrais sentir ton ventre bouger", "Concentre-toi sur la respiration", "Sens ta détente augmenter"]',
    null,
    null,
    120,
    3,
    '["Tronc"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux respirer normalement"], "plus_difficiles": ["Si c''est trop facile, tu peux respirer plus lentement", "Si tu veux plus d''intensité, tu peux ajouter des exercices de respiration"]}',
    '["Respire profondément", "Concentre-toi sur ton ventre", "Détends-toi complètement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 4. Mobilisation douce des articulations
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'mobilisation_douce_articulations',
    'Mobilisation douce des articulations',
    'Debout ou assis, fais des mouvements très doux de tes articulations. Commence par les chevilles, puis les genoux, les hanches, les épaules. Respire régulièrement.',
    'Debout, les pieds écartés de la largeur des hanches, les bras le long du corps.',
    7, 1, 1, 7,
    '[]',
    '["Ne force jamais", "Ne fais pas de mouvements brusques", "Ne tends pas tes muscles"]',
    '["Tu devrais sentir tes articulations se mobiliser", "Concentre-toi sur la fluidité", "Sens ta mobilité s''améliorer"]',
    null,
    null,
    150,
    5,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire moins de mouvements"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter plus d''articulations", "Si tu veux plus d''intensité, tu peux faire des mouvements plus variés"]}',
    '["Fais des mouvements doux", "Respire régulièrement", "Concentre-toi sur la fluidité"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 5. Auto-massage avec rouleau
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'auto_massage_rouleau',
    'Auto-massage avec rouleau',
    'Utilise un rouleau de massage pour masser tes muscles. Commence par les jambes, puis le dos. Va doucement et respire profondément. Concentre-toi sur la détente.',
    'Assis au sol avec un rouleau de massage, prêt à commencer.',
    7, 1, 2, 7,
    '["Rouleau de massage"]',
    '["Ne roule pas trop vite", "Ne force jamais", "Ne masse pas les os"]',
    '["Tu devrais sentir tes muscles se détendre", "Concentre-toi sur la détente", "Sens la tension diminuer"]',
    null,
    null,
    240,
    10,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux utiliser moins de pression"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la pression", "Si tu veux plus d''intensité, tu peux masser plus de zones"]}',
    '["Va doucement", "Respire profondément", "Concentre-toi sur la détente"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 6. Yoga doux pour la récupération
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'yoga_doux_recuperation',
    'Yoga doux pour la récupération',
    'Fais des postures de yoga très douces. Commence par la posture de l''enfant, puis des étirements doux. Respire profondément et concentre-toi sur la détente.',
    'À quatre pattes, prêt à commencer les postures de yoga.',
    7, 1, 1, 7,
    '[]',
    '["Ne force jamais", "Ne tends pas tes muscles", "Ne bloque pas ta respiration"]',
    '["Tu devrais te sentir détendu", "Concentre-toi sur la respiration", "Sens ta détente augmenter"]',
    null,
    null,
    300,
    15,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire moins de postures"], "plus_difficiles": ["Si c''est trop facile, tu peux tenir plus longtemps", "Si tu veux plus d''intensité, tu peux ajouter des postures plus variées"]}',
    '["Respire profondément", "Ne force jamais", "Concentre-toi sur la détente"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 7. Marche avec étirements
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'marche_etirements',
    'Marche avec étirements',
    'Marche lentement et fais des étirements doux en marchant. Étire tes bras, tes jambes, ton dos. Respire profondément et concentre-toi sur la détente.',
    'Debout, les pieds écartés de la largeur des hanches, prêt à marcher.',
    7, 1, 1, 7,
    '[]',
    '["Ne marche pas trop vite", "Ne force jamais", "Ne tends pas tes muscles"]',
    '["Tu devrais te sentir détendu", "Concentre-toi sur la respiration", "Sens tes muscles se relâcher"]',
    null,
    null,
    360,
    30,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux marcher sans étirements"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter plus d''étirements", "Si tu veux plus d''intensité, tu peux marcher un peu plus vite"]}',
    '["Marche lentement", "Respire profondément", "Concentre-toi sur la détente"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 8. Étirements en position assise
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'etirements_position_assise',
    'Étirements en position assise',
    'Assis confortablement, fais des étirements doux de tes bras, de ton dos, de tes jambes. Respire profondément et concentre-toi sur la détente.',
    'Assis confortablement, le dos droit, les pieds au sol.',
    7, 1, 1, 7,
    '[]',
    '["Ne force jamais", "Ne tends pas tes muscles", "Ne bloque pas ta respiration"]',
    '["Tu devrais te sentir détendu", "Concentre-toi sur la respiration", "Sens tes muscles s''étirer doucement"]',
    null,
    null,
    180,
    8,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire moins d''étirements"], "plus_difficiles": ["Si c''est trop facile, tu peux tenir plus longtemps", "Si tu veux plus d''intensité, tu peux ajouter des étirements plus variés"]}',
    '["Respire profondément", "Ne force jamais", "Concentre-toi sur la détente"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 9. Respiration guidée
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'respiration_guidee',
    'Respiration guidée',
    'Assis ou allongé, respire en suivant un rythme guidé. Inspire pendant 4 secondes, retiens 4 secondes, expire pendant 6 secondes. Concentre-toi sur ta respiration.',
    'Assis confortablement ou allongé, le dos droit, les yeux fermés.',
    7, 3, 1, 7,
    '[]',
    '["Ne force pas ta respiration", "Ne tends pas tes épaules", "Ne bloque pas ta respiration"]',
    '["Tu devrais te sentir détendu", "Concentre-toi sur le rythme", "Sens ta détente augmenter"]',
    null,
    null,
    150,
    4,
    '["Tronc"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux respirer normalement"], "plus_difficiles": ["Si c''est trop facile, tu peux allonger les phases", "Si tu veux plus d''intensité, tu peux ajouter des exercices de respiration"]}',
    '["Suis le rythme", "Concentre-toi sur ta respiration", "Détends-toi complètement"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 10. Mobilisation articulaire douce
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'mobilisation_articulaire_douce',
    'Mobilisation articulaire douce',
    'Assis ou debout, fais des mouvements très doux de tes articulations. Commence par les doigts, puis les poignets, les coudes, les épaules. Respire régulièrement.',
    'Assis confortablement ou debout, les bras le long du corps.',
    7, 1, 1, 7,
    '[]',
    '["Ne force jamais", "Ne fais pas de mouvements brusques", "Ne tends pas tes muscles"]',
    '["Tu devrais sentir tes articulations se mobiliser", "Concentre-toi sur la fluidité", "Sens ta mobilité s''améliorer"]',
    null,
    null,
    180,
    6,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire moins de mouvements"], "plus_difficiles": ["Si c''est trop facile, tu peux ajouter plus d''articulations", "Si tu veux plus d''intensité, tu peux faire des mouvements plus variés"]}',
    '["Fais des mouvements doux", "Respire régulièrement", "Concentre-toi sur la fluidité"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 11. Auto-massage sans rouleau
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'auto_massage_sans_rouleau',
    'Auto-massage sans rouleau',
    'Utilise tes mains pour masser tes muscles. Commence par tes épaules, puis tes bras, tes jambes. Va doucement et respire profondément. Concentre-toi sur la détente.',
    'Assis confortablement, prêt à commencer l''auto-massage.',
    7, 1, 1, 7,
    '[]',
    '["Ne masse pas trop fort", "Ne force jamais", "Ne masse pas les os"]',
    '["Tu devrais sentir tes muscles se détendre", "Concentre-toi sur la détente", "Sens la tension diminuer"]',
    null,
    null,
    240,
    8,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux utiliser moins de pression"], "plus_difficiles": ["Si c''est trop facile, tu peux augmenter la pression", "Si tu veux plus d''intensité, tu peux masser plus de zones"]}',
    '["Va doucement", "Respire profondément", "Concentre-toi sur la détente"]',
    null,
    false,
    NOW(),
    NOW()
);

-- 12. Yoga restauratif
INSERT INTO exercices (
    id, nom, description, position_depart, 
    categorie_id, groupe_musculaire_id, niveau_id, type_id,
    materiel, erreurs, focus_zone, image_url, video_url,
    duree_estimee, calories_estimees, muscles_sollicites, variantes, conseils,
    created_by, is_validated, created_at, updated_at
) VALUES (
    'yoga_restauratif',
    'Yoga restauratif',
    'Fais des postures de yoga restauratif très douces. Utilise des supports si nécessaire. Respire profondément et concentre-toi sur la détente complète.',
    'Allongé sur le dos, prêt à commencer les postures restauratives.',
    7, 1, 1, 7,
    '[]',
    '["Ne force jamais", "Ne tends pas tes muscles", "Ne bloque pas ta respiration"]',
    '["Tu devrais te sentir complètement détendu", "Concentre-toi sur la respiration", "Sens ta détente augmenter"]',
    null,
    null,
    360,
    20,
    '["Corps entier"]',
    '{"plus_faciles": ["Si c''est trop difficile, tu peux faire moins de postures"], "plus_difficiles": ["Si c''est trop facile, tu peux tenir plus longtemps", "Si tu veux plus d''intensité, tu peux ajouter des postures plus variées"]}',
    '["Respire profondément", "Ne force jamais", "Concentre-toi sur la détente complète"]',
    null,
    false,
    NOW(),
    NOW()
);
