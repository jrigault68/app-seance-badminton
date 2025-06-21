// Configuration de la marque SmartSports
export const BRAND_CONFIG = {
  name: "SmartSports",
  displayName: "SmartSports",
  tagline: "Votre partenaire sportif intelligent",
  description: "Application complète de suivi sportif pour individus et clubs",
  logo: "🏆", // Emoji temporaire, à remplacer par un vrai logo
  colors: {
    primary: "#dc2626", // Rouge
    secondary: "#1f2937", // Gris foncé
    accent: "#3b82f6", // Bleu
    background: "from-red-950 via-red-900 to-black",
  },
  contact: {
    email: "contact@smartsports.app",
    website: "https://smartsports.app",
  }
};

// Fonction utilitaire pour obtenir le nom de la marque
export const getBrandName = () => BRAND_CONFIG.name;

// Fonction utilitaire pour obtenir le nom d'affichage
export const getDisplayName = () => BRAND_CONFIG.displayName;

// Fonction utilitaire pour obtenir le tagline
export const getTagline = () => BRAND_CONFIG.tagline; 