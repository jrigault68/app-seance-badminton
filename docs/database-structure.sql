-- =====================================================
-- STRUCTURE COMPLÈTE DE BASE DE DONNÉES SMARTSPORTS
-- =====================================================

-- Table des utilisateurs 
CREATE TABLE IF NOT EXISTS utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    pseudo VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    last_connection TIMESTAMP WITH TIME ZONE,
    niveau_utilisateur VARCHAR(20) DEFAULT 'debutant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    google_id VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- TABLES POUR LA GESTION DES SÉANCES
-- =====================================================

-- Table des catégories d'activités (pour séances et programmes)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    couleur VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des groupes musculaires
CREATE TABLE IF NOT EXISTS groupes_musculaires (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    zone_corps VARCHAR(50),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des niveaux de difficulté
CREATE TABLE IF NOT EXISTS niveaux_difficulte (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    ordre INTEGER DEFAULT 0,
    couleur VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des types d'exercices
CREATE TABLE IF NOT EXISTS types (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(30) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table du matériel
CREATE TABLE IF NOT EXISTS materiel (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- Liaison exercices <-> matériel
CREATE TABLE IF NOT EXISTS exercice_materiel (
  exercice_id VARCHAR(100) REFERENCES exercices(id) ON DELETE CASCADE,
  materiel_id INTEGER REFERENCES materiel(id) ON DELETE CASCADE,
  PRIMARY KEY (exercice_id, materiel_id)
);

-- Table des exercices 
CREATE TABLE IF NOT EXISTS exercices (
    id VARCHAR(100) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    position_depart TEXT,
    categorie_id INTEGER REFERENCES categories(id),
    groupe_musculaire_id INTEGER REFERENCES groupes_musculaires(id),
    niveau_id INTEGER REFERENCES niveaux_difficulte(id),
    type_id INTEGER REFERENCES types(id),
    erreurs JSONB DEFAULT '[]',
    focus_zone JSONB DEFAULT '[]',
    image_url TEXT,
    video_url TEXT,
    duree_estimee NUMERIC, -- en secondes
    calories_estimees NUMERIC,
    muscles_sollicites JSONB DEFAULT '[]',
    variantes JSONB DEFAULT '[]',
    conseils JSONB DEFAULT '[]',
    created_by UUID REFERENCES utilisateurs(id),
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES utilisateurs(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des séances
CREATE TABLE IF NOT EXISTS seances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    niveau_id INTEGER REFERENCES niveaux_difficulte(id),
    type_id INTEGER REFERENCES types(id),
    categorie_id INTEGER REFERENCES categories(id),
    objectifs JSONB DEFAULT '[]',
    duree_estimee INTEGER,
    calories_estimees INTEGER,
    structure JSONB NOT NULL,
    notes TEXT,
    est_publique BOOLEAN DEFAULT false,
    created_by UUID REFERENCES utilisateurs(id),
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES utilisateurs(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des programmes sportifs
CREATE TABLE IF NOT EXISTS programmes (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  niveau_id INTEGER REFERENCES niveaux_difficulte(id),
  nb_jours INTEGER,
  image_url TEXT,
  objectif TEXT,
  type_id INTEGER REFERENCES types(id),
  categorie_id INTEGER REFERENCES categories(id),
  date_debut DATE,
  date_fin DATE,
  est_actif BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- UTC, format ISO 8601 avec 'Z'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- UTC, toujours stocké en ISO 8601 avec 'Z'
  type_programme VARCHAR(20) NOT NULL DEFAULT 'libre' -- 'libre' ou 'calendaire'
);

-- Table de liaison entre programmes et séances
CREATE TABLE IF NOT EXISTS programme_seances (
  id SERIAL PRIMARY KEY,
  programme_id INTEGER REFERENCES programmes(id) ON DELETE CASCADE,
  jour INTEGER,
  date DATE,
  seance_id UUID REFERENCES seances(id) ON DELETE CASCADE
);
--
-- Pour un programme libre : renseigner 'jour', laisser 'date' à NULL
-- Pour un programme calendaire : renseigner 'date', laisser 'jour' à NULL

-- Table des programmes suivis par les utilisateurs
CREATE TABLE IF NOT EXISTS utilisateur_programmes (
  id SERIAL PRIMARY KEY,
  utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
  programme_id INTEGER REFERENCES programmes(id) ON DELETE CASCADE,
  date_debut DATE DEFAULT CURRENT_DATE,
  date_fin DATE,
  est_actif BOOLEAN DEFAULT TRUE,
  progression JSONB DEFAULT '{}', -- Suivi de la progression dans le programme
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(utilisateur_id, programme_id) -- Un utilisateur ne peut suivre qu'un seul programme à la fois
);

-- =====================================================
-- TABLES POUR LE SUIVI DES SÉANCES
-- =====================================================

-- Table des sessions d'entraînement
CREATE TABLE IF NOT EXISTS sessions_entrainement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    seance_id UUID REFERENCES seances(id),
    seance_personnalisee_id UUID, -- Pour les séances personnalisées
    programme_id INTEGER REFERENCES programmes(id), -- Lien avec le programme
    jour_programme INTEGER, -- Jour dans le programme (1, 2, 3...)
    nom_session VARCHAR(150),
    date_debut TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_fin TIMESTAMP WITH TIME ZONE,
    duree_totale INTEGER, -- en secondes
    calories_brulees INTEGER,
    niveau_effort DECIMAL(3,1), -- 1.0 à 10.0
    satisfaction DECIMAL(3,1), -- 1.0 à 5.0
    notes TEXT,
    etat VARCHAR(20) DEFAULT 'en_cours', -- 'en_cours', 'terminee', 'interrompue'
    progression JSONB DEFAULT '{}', -- Suivi de la progression pendant la session
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances de sessions_entrainement
CREATE INDEX IF NOT EXISTS idx_sessions_utilisateur ON sessions_entrainement(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_sessions_programme ON sessions_entrainement(programme_id);
CREATE INDEX IF NOT EXISTS idx_sessions_seance ON sessions_entrainement(seance_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions_entrainement(date_debut);
CREATE INDEX IF NOT EXISTS idx_sessions_etat ON sessions_entrainement(etat);

-- Table des exercices réalisés dans une session
-- CREATE TABLE IF NOT EXISTS exercices_realises (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     session_id UUID REFERENCES sessions_entrainement(id) ON DELETE CASCADE,
--     exercice_id VARCHAR(100) REFERENCES exercices(id),
--     ordre_execution INTEGER NOT NULL,
--     series_realisees JSONB DEFAULT '[]', -- Détail des séries réalisées
--     temps_total INTEGER, -- en secondes
--     calories_brulees INTEGER,
--     difficulte_ressentie DECIMAL(3,1),
--     notes TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Table des séries réalisées (détail des exercices)
-- CREATE TABLE IF NOT EXISTS series_realisees (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     exercice_realise_id UUID REFERENCES exercices_realises(id) ON DELETE CASCADE,
--     numero_serie INTEGER NOT NULL,
--     repetitions_realisees INTEGER,
--     temps_serie INTEGER, -- en secondes
--     temps_repos INTEGER, -- en secondes
--     difficulte_ressentie DECIMAL(3,1),
--     notes TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- =====================================================
-- TABLES POUR LES STATISTIQUES ET SUIVI
-- =====================================================

-- Table des statistiques utilisateur
--CREATE TABLE IF NOT EXISTS statistiques_utilisateur (
--    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
--    date_statistique DATE NOT NULL,
--    nombre_sessions INTEGER DEFAULT 0,
--    temps_total_entrainement INTEGER DEFAULT 0, -- en minutes
--    calories_totales INTEGER DEFAULT 0,
--    seances_completees JSONB DEFAULT '[]',
--      exercices_favoris JSONB DEFAULT '[]',
--    progression_niveau JSONB DEFAULT '{}',
--    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--    UNIQUE(utilisateur_id, date_statistique)
--);

-- Table des objectifs utilisateur
--CREATE TABLE IF NOT EXISTS objectifs_utilisateur (
--    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
--    nom VARCHAR(100) NOT NULL,
--    description TEXT,
--    type_objectif VARCHAR(50), -- 'frequence', 'duree', 'calories', 'performance'
--    valeur_cible INTEGER,
--    unite VARCHAR(20),
--    date_debut DATE NOT NULL,
--    date_fin DATE,
--    progression_actuelle DECIMAL(5,2) DEFAULT 0,
--    est_atteint BOOLEAN DEFAULT false,
--    est_actif BOOLEAN DEFAULT true,
--    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
--);

-- Table des favoris (séances et exercices favoris)
--CREATE TABLE IF NOT EXISTS favoris (
--    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
--    type_favori VARCHAR(20) NOT NULL, -- 'seance', 'exercice'
--    element_id VARCHAR(100), -- ID de la séance ou exercice
--    date_ajout TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--    notes TEXT,
--    UNIQUE(utilisateur_id, type_favori, element_id)
--);

-- =====================================================
-- TABLES POUR LES RECOMMANDATIONS
-- =====================================================

-- Table des recommandations
--CREATE TABLE IF NOT EXISTS recommandations (
--    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
--    seance_id VARCHAR(100) REFERENCES seances(id),
--    type_recommandation VARCHAR(50), -- 'niveau', 'objectif', 'variete', 'progression'
--    score_recommandation DECIMAL(3,2), -- 0.0 à 1.0
--    raison TEXT,
--    date_recommandation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--    est_acceptee BOOLEAN,
--    date_acceptation TIMESTAMP WITH TIME ZONE
--);

-- =====================================================
-- INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index pour les exercices
CREATE INDEX IF NOT EXISTS idx_exercices_categorie ON exercices(categorie_id);
CREATE INDEX IF NOT EXISTS idx_exercices_groupe_musculaire ON exercices(groupe_musculaire_id);
CREATE INDEX IF NOT EXISTS idx_exercices_niveau ON exercices(niveau_id);
CREATE INDEX IF NOT EXISTS idx_exercices_type ON exercices(type_id);
CREATE INDEX IF NOT EXISTS idx_exercices_created_by ON exercices(created_by);
CREATE INDEX IF NOT EXISTS idx_exercices_is_validated ON exercices(is_validated);
CREATE INDEX IF NOT EXISTS idx_exercices_validated_by ON exercices(validated_by);
CREATE INDEX IF NOT EXISTS idx_exercices_validated_at ON exercices(validated_at);

-- Index pour les séances
CREATE INDEX IF NOT EXISTS idx_seances_niveau ON seances(niveau_id);
CREATE INDEX IF NOT EXISTS idx_seances_type ON seances(type_id);
CREATE INDEX IF NOT EXISTS idx_seances_auteur ON seances(created_by);
CREATE INDEX IF NOT EXISTS idx_seances_publiques ON seances(est_publique) WHERE est_publique = true;

-- Index pour les sessions
--CREATE INDEX IF NOT EXISTS idx_sessions_utilisateur ON sessions_entrainement(utilisateur_id);
--CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions_entrainement(date_debut);
--CREATE INDEX IF NOT EXISTS idx_sessions_etat ON sessions_entrainement(etat);

-- Index pour les statistiques
--CREATE INDEX IF NOT EXISTS idx_stats_utilisateur_date ON statistiques_utilisateur(utilisateur_id, date_statistique);

-- Index pour les favoris
--CREATE INDEX IF NOT EXISTS idx_favoris_utilisateur ON favoris(utilisateur_id);
--CREATE INDEX IF NOT EXISTS idx_favoris_type ON favoris(type_favori);

-- Index pour les recommandations
--CREATE INDEX IF NOT EXISTS idx_recommandations_utilisateur ON recommandations(utilisateur_id);
--CREATE INDEX IF NOT EXISTS idx_recommandations_score ON recommandations(score_recommandation DESC);

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Insertion des catégories d'exercices
INSERT INTO categories (nom, description, couleur, icone, ordre_affichage) VALUES
('échauffement', 'Exercices pour préparer le corps à l''effort', '#10B981', '🔥', 1),
('mobilité', 'Exercices pour améliorer la mobilité articulaire', '#3B82F6', '🔄', 2),
('renforcement', 'Exercices de musculation et tonification', '#F59E0B', '💪', 3),
('étirement', 'Exercices pour assouplir les muscles', '#8B5CF6', '🧘', 4),
('cardio', 'Exercices cardiovasculaires', '#EF4444', '❤️', 5),
('gainage', 'Exercices de stabilisation et renforcement profond', '#06B6D4', '🛡️', 6),
('récupération_active', 'Exercices doux pour la récupération', '#84CC16', '🌿', 7),
('ancrage', 'Exercices de respiration et concentration', '#6366F1', '🧘‍♀️', 8)
ON CONFLICT (nom) DO NOTHING;

-- Insertion des groupes musculaires
INSERT INTO groupes_musculaires (nom, description, zone_corps, ordre_affichage) VALUES
('corps entier', 'Tout le corps', 'général', 1),
('jambes', 'Muscles des membres inférieurs', 'inférieur', 2),
('fessiers', 'Muscles fessiers', 'inférieur', 3),
('cuisses', 'Muscles des cuisses', 'inférieur', 4),
('mollets', 'Muscles des mollets', 'inférieur', 5),
('abdominaux', 'Muscles abdominaux', 'tronc', 6),
('dos', 'Muscles du dos', 'tronc', 7),
('pectoraux', 'Muscles pectoraux', 'tronc', 8),
('épaules', 'Muscles des épaules', 'supérieur', 9),
('bras', 'Muscles des bras', 'supérieur', 10),
('triceps', 'Muscles triceps', 'supérieur', 11),
('biceps', 'Muscles biceps', 'supérieur', 12),
('avant-bras', 'Muscles des avant-bras', 'supérieur', 13),
('tronc', 'Muscles du tronc', 'tronc', 14),
('colonne vertébrale', 'Colonne vertébrale', 'tronc', 15),
('hanches', 'Muscles des hanches', 'inférieur', 16),
('cheville', 'Articulation de la cheville', 'inférieur', 17)
ON CONFLICT (nom) DO NOTHING;

-- Insertion des niveaux de difficulté
INSERT INTO niveaux_difficulte (nom, description, ordre, couleur) VALUES
('facile', 'Niveau débutant, accessible à tous', 1, '#10B981'),
('intermédiaire', 'Niveau intermédiaire, nécessite une base', 2, '#F59E0B'),
('difficile', 'Niveau avancé, pour sportifs confirmés', 3, '#EF4444'),
('expert', 'Niveau expert, très exigeant', 4, '#7C3AED')
ON CONFLICT (nom) DO NOTHING;

-- Insertion des types d'exercices
INSERT INTO types (nom, description) VALUES
('temps', 'Exercice chronométré'),
('repetitions', 'Exercice avec nombre de répétitions'),
('mouvement', 'Mouvement libre'),
('mobilité', 'Exercice de mobilité'),
('respiration', 'Exercice de respiration'),
('gainage', 'Exercice de gainage'),
('cardio', 'Exercice cardiovasculaire'),
('etirement', 'Exercice d''étirement')
ON CONFLICT (nom) DO NOTHING;

-- Insertion du matériel
INSERT INTO materiel (nom, description) VALUES
('Barre de musculation', 'Barre de musculation standard'),
('Poids de musculation', 'Poids de musculation pour les exercices de force'),
('Ballon de yoga', 'Ballon de yoga pour les exercices de renforcement'),
('Bande élastique', 'Bande élastique pour les exercices de résistance'),
('Foulard de musculation', 'Foulard pour les exercices de musculation'),
('Gourde d''eau', 'Gourde d''eau pour les exercices de cardio'),
('Chaussures de sport', 'Chaussures de sport pour les exercices de musculation'),
('Tapis de yoga', 'Tapis de yoga pour les exercices de renforcement')
ON CONFLICT (nom) DO NOTHING;


-- =====================================================
-- TRIGGERS ET FONCTIONS
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
--CREATE TRIGGER update_utilisateurs_updated_at BEFORE UPDATE ON utilisateurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--CREATE TRIGGER update_exercices_updated_at BEFORE UPDATE ON exercices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--CREATE TRIGGER update_seances_updated_at BEFORE UPDATE ON seances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--CREATE TRIGGER update_programmes_updated_at BEFORE UPDATE ON programmes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--CREATE TRIGGER update_sessions_entrainement_updated_at BEFORE UPDATE ON sessions_entrainement FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--CREATE TRIGGER update_statistiques_utilisateur_updated_at BEFORE UPDATE ON statistiques_utilisateur FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
--CREATE TRIGGER update_objectifs_utilisateur_updated_at BEFORE UPDATE ON objectifs_utilisateur FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour les séances avec toutes les informations
CREATE OR REPLACE VIEW v_seances_completes AS
SELECT 
    s.*,
    nd.nom as niveau_nom,
    nd.couleur as niveau_couleur,
    COALESCE(u.pseudo, u.nom, 'Utilisateur ' || s.created_by::text) as auteur_pseudo
FROM seances s
LEFT JOIN niveaux_difficulte nd ON s.niveau_id = nd.id
LEFT JOIN utilisateurs u ON s.created_by = u.id;

-- Vue pour les exercices avec toutes les informations
CREATE OR REPLACE VIEW v_exercices_completes AS
SELECT 
    e.*,
    ce.nom as categorie_nom,
    ce.couleur as categorie_couleur,
    ce.icone as categorie_icone,
    gm.nom as groupe_musculaire_nom,
    gm.zone_corps,
    nd.nom as niveau_nom,
    nd.couleur as niveau_couleur,
    te.nom as type_nom,
    COALESCE(u.pseudo, u.nom, 'Utilisateur ' || e.created_by::text) as auteur_pseudo
FROM exercices e
LEFT JOIN categories ce ON e.categorie_id = ce.id
LEFT JOIN groupes_musculaires gm ON e.groupe_musculaire_id = gm.id
LEFT JOIN niveaux_difficulte nd ON e.niveau_id = nd.id
LEFT JOIN types te ON e.type_id = te.id
LEFT JOIN utilisateurs u ON e.created_by = u.id;

-- Vue pour les statistiques utilisateur par semaine
--CREATE OR REPLACE VIEW v_stats_utilisateur_semaine AS
--SELECT 
--    su.utilisateur_id,
--    DATE_TRUNC('week', su.date_statistique) as semaine,
--    SUM(su.nombre_sessions) as total_sessions,
--    SUM(su.temps_total_entrainement) as total_temps_minutes,
--    SUM(su.calories_totales) as total_calories,
--    AVG(su.nombre_sessions) as moyenne_sessions_par_jour
--FROM statistiques_utilisateur su
--GROUP BY su.utilisateur_id, DATE_TRUNC('week', su.date_statistique);

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE utilisateurs IS 'Table des utilisateurs de l''application';
COMMENT ON TABLE categories IS 'Catégories d''exercices (échauffement, mobilité, etc.)';
COMMENT ON TABLE groupes_musculaires IS 'Groupes musculaires sollicités';
COMMENT ON TABLE niveaux_difficulte IS 'Niveaux de difficulté des exercices';
COMMENT ON TABLE types IS 'Types d''exercices (temps, répétitions, etc.)';
COMMENT ON TABLE exercices IS 'Exercices disponibles dans l''application';
COMMENT ON TABLE seances IS 'Séances prédéfinies';
COMMENT ON TABLE programmes IS 'Programmes sportifs';
--COMMENT ON TABLE sessions_entrainement IS 'Sessions d''entraînement réalisées';
--COMMENT ON TABLE exercices_realises IS 'Exercices réalisés dans une session';
--COMMENT ON TABLE series_realisees IS 'Séries réalisées pour un exercice';
--COMMENT ON TABLE statistiques_utilisateur IS 'Statistiques quotidiennes des utilisateurs';
--COMMENT ON TABLE objectifs_utilisateur IS 'Objectifs personnalisés des utilisateurs';
--COMMENT ON TABLE favoris IS 'Séances et exercices favoris des utilisateurs';
--COMMENT ON TABLE recommandations IS 'Recommandations de séances pour les utilisateurs';

