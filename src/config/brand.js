// Configuration de la marque SmartSports
export const BRAND_CONFIG = {
  name: "SmartSports",
  displayName: "SmartSports",
  tagline: "Votre partenaire sportif intelligent",
  logo: "/logo.svg", // Nouveau logo SVG
  logoAlt: "🏆", // Garder l'emoji comme alternative
  colors: {
    primary: "#EF4444", // Rouge
    secondary: "#1F2937", // Gris foncé
    accent: "#F59E0B", // Orange
    background: "#000000", // Noir
    text: "#FFFFFF" // Blanc
  },
  // Informations de contact
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

export const getLogo = () => BRAND_CONFIG.logo;
export const getLogoAlt = () => BRAND_CONFIG.logoAlt; 