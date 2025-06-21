import { BRAND_CONFIG } from '../src/config/brand.js';
import fs from 'fs';
import path from 'path';

const manifest = {
  name: `${BRAND_CONFIG.displayName} - ${BRAND_CONFIG.tagline}`,
  short_name: BRAND_CONFIG.displayName,
  start_url: ".",
  display: "standalone",
  background_color: "#000000",
  theme_color: "#ef4444",
  icons: [
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png"
    }
  ]
};

const manifestPath = path.join(process.cwd(), 'public', 'manifest.webmanifest');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Manifeste généré avec le nom: ${BRAND_CONFIG.displayName}`); 