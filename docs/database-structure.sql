-- =====================================================
-- STRUCTURE DE LA BASE DE DONNÉES
-- Application de gestion de séances de badminton
-- =====================================================

-- =====================================================
-- TABLES POUR LA GESTION DES SÉANCES
-- =====================================================

-- Table des catégories d'activités (classification fonctionnelle)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    couleur VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sous-catégories (types techniques)
CREATE TABLE IF NOT EXISTS sous_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    categorie_id UUID REFERENCES categories(id),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des zones du corps (remplace groupes_musculaires)
CREATE TABLE IF NOT EXISTS zones_corps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    couleur VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des zones spécifiques
CREATE TABLE IF NOT EXISTS zones_specifiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    zone_corps_id UUID REFERENCES zones_corps(id),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des familles d'exercices
CREATE TABLE IF NOT EXISTS familles_exercices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    famille_parent_id UUID REFERENCES familles_exercices(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    famille_id UUID REFERENCES familles_exercices(id),
    
    -- Exercices de progression (plus dur/facile)
    exercice_plus_dur_id VARCHAR(100) REFERENCES exercices(id),
    exercice_plus_facile_id VARCHAR(100) REFERENCES exercices(id),
    
    -- Exercices similaires et variantes
    exercices_similaires JSONB DEFAULT '[]', -- Array d'IDs d'exercices similaires
    variantes JSONB DEFAULT '[]', -- Array d'IDs d'exercices variantes
    
    -- Notes de difficulté (0-20 pour chaque aspect)
    note_force INTEGER DEFAULT 0 CHECK (note_force >= 0 AND note_force <= 20),
    note_cardio INTEGER DEFAULT 0 CHECK (note_cardio >= 0 AND note_cardio <= 20),
    note_technique INTEGER DEFAULT 0 CHECK (note_technique >= 0 AND note_technique <= 20),
    note_mobilite INTEGER DEFAULT 0 CHECK (note_mobilite >= 0 AND note_mobilite <= 20),
    note_impact INTEGER DEFAULT 0 CHECK (note_impact >= 0 AND note_impact <= 20),
    note_mentale INTEGER DEFAULT 0 CHECK (note_mentale >= 0 AND note_mentale <= 20),
    
    -- Informations techniques
    erreurs JSONB DEFAULT '[]',
    focus_zone JSONB DEFAULT '[]',
    image_url TEXT,
    video_url TEXT,
    duree_estimee NUMERIC, -- en secondes
    calories_estimees NUMERIC,
    muscles_sollicites JSONB DEFAULT '[]',
    variantes JSONB DEFAULT '[]',
    conseils JSONB DEFAULT '[]',
    
    -- Métadonnées
    created_by UUID REFERENCES utilisateurs(id),
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES utilisateurs(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de jointure exercices <-> sous_categories
CREATE TABLE IF NOT EXISTS exercices_sous_categories (
    exercice_id VARCHAR(100) REFERENCES exercices(id) ON DELETE CASCADE,
    sous_categorie_id UUID REFERENCES sous_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exercice_id, sous_categorie_id)
);

-- Table des zones du corps
CREATE TABLE IF NOT EXISTS zones_corps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    couleur VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des zones spécifiques
CREATE TABLE IF NOT EXISTS zones_specifiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    zone_corps_id UUID REFERENCES zones_corps(id),
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de jointure exercices <-> zones_specifiques
CREATE TABLE IF NOT EXISTS exercices_zones_specifiques (
    exercice_id VARCHAR(100) REFERENCES exercices(id) ON DELETE CASCADE,
    zone_specifique_id UUID REFERENCES zones_specifiques(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (exercice_id, zone_specifique_id)
);

-- Table des séances
CREATE TABLE IF NOT EXISTS seances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    type_seance VARCHAR(20) DEFAULT 'exercice', -- 'exercice' ou 'instruction'
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE  -- Soft delete : NULL = active, valeur = date de suppression (conservée pour les stats)
);

-- Table de jointure seances <-> sous_categories
CREATE TABLE IF NOT EXISTS seances_sous_categories (
    seance_id UUID REFERENCES seances(id) ON DELETE CASCADE,
    sous_categorie_id UUID REFERENCES sous_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seance_id, sous_categorie_id)
);

-- Table des programmes sportifs
CREATE TABLE IF NOT EXISTS programmes (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  nb_jours INTEGER,
  image_url TEXT,
  objectif TEXT,
  date_debut DATE,
  date_fin DATE,
  est_actif BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- UTC, format ISO 8601 avec 'Z'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- UTC, toujours stocké en ISO 8601 avec 'Z'
  type_programme VARCHAR(20) NOT NULL DEFAULT 'libre', -- 'libre' ou 'calendaire'
  deleted_at TIMESTAMP WITH TIME ZONE  -- Soft delete : NULL = actif, valeur = date de suppression (conservé pour les stats)
);

-- Table de jointure programmes <-> sous_categories
CREATE TABLE IF NOT EXISTS programmes_sous_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programme_id INTEGER REFERENCES programmes(id) ON DELETE CASCADE,
    sous_categorie_id UUID REFERENCES sous_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(programme_id, sous_categorie_id)
);

-- Table de liaison entre programmes et séances
CREATE TABLE IF NOT EXISTS programme_seances (
  id SERIAL PRIMARY KEY,
  programme_id INTEGER REFERENCES programmes(id) ON DELETE CASCADE,
  jour INTEGER,
  date DATE,
  seance_id UUID REFERENCES seances(id) ON DELETE CASCADE,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLES POUR LA GESTION DES UTILISATEURS
-- =====================================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    pseudo VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLES POUR LE SUIVI DES SESSIONS
-- =====================================================

-- Table des sessions d'entraînement
CREATE TABLE IF NOT EXISTS sessions_entrainement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    seance_id UUID REFERENCES seances(id) ON DELETE SET NULL,
    programme_id INTEGER REFERENCES programmes(id) ON DELETE SET NULL,
    date_debut TIMESTAMP WITH TIME ZONE NOT NULL,
    date_fin TIMESTAMP WITH TIME ZONE,
    duree_totale INTEGER, -- en secondes
    calories_totales INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index pour les exercices
CREATE INDEX IF NOT EXISTS idx_exercices_groupe_musculaire ON exercices(groupe_musculaire_id);
CREATE INDEX IF NOT EXISTS idx_exercices_famille ON exercices(famille_id);
CREATE INDEX IF NOT EXISTS idx_exercices_created_by ON exercices(created_by);
CREATE INDEX IF NOT EXISTS idx_exercices_is_validated ON exercices(is_validated);

-- Index pour les sous-catégories
CREATE INDEX IF NOT EXISTS idx_sous_categories_categorie ON sous_categories(categorie_id);
CREATE INDEX IF NOT EXISTS idx_sous_categories_ordre ON sous_categories(ordre_affichage);

-- Index pour les tables de jointure
CREATE INDEX IF NOT EXISTS idx_exercices_sous_categories_exercice ON exercices_sous_categories(exercice_id);
CREATE INDEX IF NOT EXISTS idx_exercices_sous_categories_sous_categorie ON exercices_sous_categories(sous_categorie_id);
CREATE INDEX IF NOT EXISTS idx_seances_sous_categories_seance ON seances_sous_categories(seance_id);
CREATE INDEX IF NOT EXISTS idx_seances_sous_categories_sous_categorie ON seances_sous_categories(sous_categorie_id);
CREATE INDEX IF NOT EXISTS idx_programmes_sous_categories_programme ON programmes_sous_categories(programme_id);
CREATE INDEX IF NOT EXISTS idx_programmes_sous_categories_sous_categorie ON programmes_sous_categories(sous_categorie_id);

-- Index pour les séances
CREATE INDEX IF NOT EXISTS idx_seances_created_by ON seances(created_by);
CREATE INDEX IF NOT EXISTS idx_seances_type_seance ON seances(type_seance);
CREATE INDEX IF NOT EXISTS idx_seances_is_validated ON seances(is_validated);

-- Index pour les programmes
CREATE INDEX IF NOT EXISTS idx_programmes_created_by ON programmes(created_by);
CREATE INDEX IF NOT EXISTS idx_programmes_est_actif ON programmes(est_actif);
CREATE INDEX IF NOT EXISTS idx_programmes_type_programme ON programmes(type_programme);

-- Index pour les sessions d'entraînement
CREATE INDEX IF NOT EXISTS idx_sessions_utilisateur ON sessions_entrainement(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_sessions_seance ON sessions_entrainement(seance_id);
CREATE INDEX IF NOT EXISTS idx_sessions_programme ON sessions_entrainement(programme_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date_debut ON sessions_entrainement(date_debut);

-- =====================================================
-- FONCTIONS ET TRIGGERS
-- =====================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_utilisateurs_updated_at BEFORE UPDATE ON utilisateurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_familles_exercices_updated_at BEFORE UPDATE ON familles_exercices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercices_updated_at BEFORE UPDATE ON exercices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seances_updated_at BEFORE UPDATE ON seances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programmes_updated_at BEFORE UPDATE ON programmes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_entrainement_updated_at BEFORE UPDATE ON sessions_entrainement FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour les exercices avec toutes les informations
CREATE VIEW v_exercices_completes AS
SELECT 
    e.*,
    -- Informations sur les catégories et sous-catégories
    array_agg(DISTINCT c.nom) as categories_noms,
    array_agg(DISTINCT c.couleur) as categories_couleurs,
    array_agg(DISTINCT c.icone) as categories_icones,
    array_agg(DISTINCT sc.nom) as sous_categories_noms,
    array_agg(DISTINCT sc.id) as sous_categories_ids,
    -- Informations sur les zones du corps et zones spécifiques
    array_agg(DISTINCT zc.nom) as zones_corps_noms,
    array_agg(DISTINCT zc.couleur) as zones_corps_couleurs,
    array_agg(DISTINCT zc.icone) as zones_corps_icones,
    array_agg(DISTINCT zs.nom) as zones_specifiques_noms,
    array_agg(DISTINCT zs.id) as zones_specifiques_ids,
    -- Informations sur les familles d'exercices
    fe.nom as famille_nom,
    -- Exercices de progression
    e_plus_dur.nom as exercice_plus_dur_nom,
    e_plus_facile.nom as exercice_plus_facile_nom,
    -- Auteur
    COALESCE(u.pseudo, u.nom, 'Utilisateur ' || e.created_by::text) as auteur_pseudo
FROM exercices e
-- Jointure avec les sous-catégories via la table de jointure
LEFT JOIN exercices_sous_categories esc ON e.id = esc.exercice_id
LEFT JOIN sous_categories sc ON esc.sous_categorie_id = sc.id
LEFT JOIN categories c ON sc.categorie_id = c.id
-- Jointure avec les zones spécifiques via la table de jointure
LEFT JOIN exercices_zones_specifiques ezs ON e.id = ezs.exercice_id
LEFT JOIN zones_specifiques zs ON ezs.zone_specifique_id = zs.id
LEFT JOIN zones_corps zc ON zs.zone_corps_id = zc.id
-- Autres jointures
LEFT JOIN familles_exercices fe ON e.famille_id = fe.id
LEFT JOIN exercices e_plus_dur ON e.exercice_plus_dur_id = e_plus_dur.id
LEFT JOIN exercices e_plus_facile ON e.exercice_plus_facile_id = e_plus_facile.id
LEFT JOIN utilisateurs u ON e.created_by = u.id
GROUP BY 
    e.id, e.nom, e.description, e.position_depart, e.famille_id,
    e.exercice_plus_dur_id, e.exercice_plus_facile_id,
    e.exercices_similaires, e.variantes, e.note_force, e.note_cardio,
    e.note_technique, e.note_mobilite, e.note_impact, e.note_mentale,
    e.erreurs, e.focus_zone, e.image_url, e.video_url, e.duree_estimee,
    e.calories_estimees, e.muscles_sollicites, e.conseils, e.created_by,
    e.is_validated, e.validated_by, e.validated_at, e.created_at, e.updated_at,
    fe.nom, e_plus_dur.nom, e_plus_facile.nom,
    u.pseudo, u.nom;

-- Vue pour les séances avec toutes les informations
CREATE VIEW v_seances_completes AS
SELECT 
    s.*,
    -- Informations sur les catégories et sous-catégories
    array_agg(DISTINCT c.nom) as categories_noms,
    array_agg(DISTINCT c.couleur) as categories_couleurs,
    array_agg(DISTINCT c.icone) as categories_icones,
    array_agg(DISTINCT sc.nom) as sous_categories_noms,
    array_agg(DISTINCT sc.id) as sous_categories_ids,
    -- Auteur
    COALESCE(u.pseudo, u.nom, 'Utilisateur ' || s.created_by::text) as auteur_pseudo
FROM seances s
-- Jointure avec les sous-catégories via la table de jointure
LEFT JOIN seances_sous_categories ssc ON s.id = ssc.seance_id
LEFT JOIN sous_categories sc ON ssc.sous_categorie_id = sc.id
LEFT JOIN categories c ON sc.categorie_id = c.id
-- Autres jointures
LEFT JOIN utilisateurs u ON s.created_by = u.id
GROUP BY 
    s.id, s.nom, s.description, s.type_seance, s.structure, s.notes,
    s.duree_estimee, s.created_by, s.created_at, s.updated_at, s.deleted_at,
    u.pseudo, u.nom;

-- Vue pour les catégories avec leurs sous-catégories
CREATE VIEW v_categories_avec_sous_categories AS
SELECT 
    c.id as categorie_id,
    c.nom as categorie_nom,
    c.description as categorie_description,
    c.couleur as categorie_couleur,
    c.icone as categorie_icone,
    c.ordre_affichage as categorie_ordre,
    sc.id as sous_categorie_id,
    sc.nom as sous_categorie_nom,
    sc.description as sous_categorie_description,
    sc.ordre_affichage as sous_categorie_ordre
FROM categories c
LEFT JOIN sous_categories sc ON c.id = sc.categorie_id
ORDER BY c.ordre_affichage, sc.ordre_affichage;

-- Vue pour les statistiques d'utilisation des sous-catégories
CREATE VIEW v_stats_sous_categories AS
SELECT 
    sc.id as sous_categorie_id,
    sc.nom as sous_categorie_nom,
    c.nom as categorie_nom,
    COUNT(DISTINCT esc.exercice_id) as nombre_exercices,
    COUNT(DISTINCT ssc.seance_id) as nombre_seances
FROM sous_categories sc
LEFT JOIN categories c ON sc.categorie_id = c.id
LEFT JOIN exercices_sous_categories esc ON sc.id = esc.sous_categorie_id
LEFT JOIN seances_sous_categories ssc ON sc.id = ssc.sous_categorie_id
GROUP BY sc.id, sc.nom, c.nom
ORDER BY c.nom, sc.nom;

-- Vue pour les zones du corps avec leurs zones spécifiques
CREATE VIEW v_zones_corps_avec_zones_specifiques AS
SELECT 
    zc.id as zone_corps_id,
    zc.nom as zone_corps_nom,
    zc.description as zone_corps_description,
    zc.couleur as zone_corps_couleur,
    zc.icone as zone_corps_icone,
    zc.ordre_affichage as zone_corps_ordre,
    zs.id as zone_specifique_id,
    zs.nom as zone_specifique_nom,
    zs.description as zone_specifique_description,
    zs.ordre_affichage as zone_specifique_ordre
FROM zones_corps zc
LEFT JOIN zones_specifiques zs ON zc.id = zs.zone_corps_id
ORDER BY zc.ordre_affichage, zs.ordre_affichage;

-- Vue pour les statistiques d'utilisation des zones spécifiques
CREATE VIEW v_stats_zones_specifiques AS
SELECT 
    zs.id as zone_specifique_id,
    zs.nom as zone_specifique_nom,
    zc.nom as zone_corps_nom,
    COUNT(DISTINCT ezs.exercice_id) as nombre_exercices
FROM zones_specifiques zs
LEFT JOIN zones_corps zc ON zs.zone_corps_id = zc.id
LEFT JOIN exercices_zones_specifiques ezs ON zs.id = ezs.zone_specifique_id
GROUP BY zs.id, zs.nom, zc.nom
ORDER BY zc.nom, zs.nom;

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE utilisateurs IS 'Table des utilisateurs de l''application';
COMMENT ON TABLE categories IS 'Catégories d''exercices (classification fonctionnelle)';
COMMENT ON TABLE sous_categories IS 'Sous-catégories techniques des exercices';
COMMENT ON TABLE zones_corps IS 'Zones du corps (remplace groupes_musculaires)';
COMMENT ON TABLE zones_specifiques IS 'Zones spécifiques par zone du corps (muscles, articulations, tendons, etc.)';
COMMENT ON TABLE familles_exercices IS 'Familles d''exercices pour regrouper les exercices similaires';
COMMENT ON TABLE exercices IS 'Exercices disponibles dans l''application';
COMMENT ON COLUMN exercices.note_force IS 'Note de difficulté force (0-20) : intensité musculaire et charge de travail';
COMMENT ON COLUMN exercices.note_cardio IS 'Note de difficulté cardio (0-20) : effort cardiovasculaire et respiratoire';
COMMENT ON COLUMN exercices.note_technique IS 'Note de difficulté technique (0-20) : complexité d''exécution et précision';
COMMENT ON COLUMN exercices.note_mobilite IS 'Note de difficulté mobilité (0-20) : amplitude articulaire et flexibilité';
COMMENT ON COLUMN exercices.note_impact IS 'Note de difficulté impact (0-20) : stress mécanique sur les articulations';
COMMENT ON COLUMN exercices.note_mentale IS 'Note de difficulté mentale (0-20) : concentration et endurance mentale';
COMMENT ON COLUMN exercices.exercices_similaires IS 'Array d''IDs d''exercices similaires (même famille, même type)';
COMMENT ON COLUMN exercices.exercices_variantes IS 'Array d''IDs d''exercices variantes (même base, modifications)';
COMMENT ON COLUMN exercices.exercices_complementaires IS 'Array d''IDs d''exercices complémentaires (équilibre, antagoniste)';
COMMENT ON TABLE seances IS 'Séances prédéfinies';
COMMENT ON TABLE programmes IS 'Programmes sportifs';
COMMENT ON TABLE sessions_entrainement IS 'Sessions d''entraînement réalisées';
COMMENT ON TABLE exercices_sous_categories IS 'Table de jointure entre exercices et sous-catégories';
COMMENT ON TABLE exercices_zones_specifiques IS 'Table de jointure entre exercices et zones spécifiques';
COMMENT ON TABLE seances_sous_categories IS 'Table de jointure entre séances et sous-catégories';
COMMENT ON TABLE programmes_sous_categories IS 'Table de jointure entre programmes et sous-catégories';

