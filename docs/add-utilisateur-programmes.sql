-- Script pour ajouter la table utilisateur_programmes
-- À exécuter dans votre base de données Supabase

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

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_utilisateur_programmes_utilisateur ON utilisateur_programmes(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_utilisateur_programmes_programme ON utilisateur_programmes(programme_id);
CREATE INDEX IF NOT EXISTS idx_utilisateur_programmes_actif ON utilisateur_programmes(est_actif) WHERE est_actif = true;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_utilisateur_programmes_updated_at 
BEFORE UPDATE ON utilisateur_programmes 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commentaire sur la table
COMMENT ON TABLE utilisateur_programmes IS 'Programmes suivis par les utilisateurs'; 