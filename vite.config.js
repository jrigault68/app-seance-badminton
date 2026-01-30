import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { BRAND_CONFIG } from "./src/config/brand.js";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html"
      },
      output: {
        // Regrouper tout lucide-react (et lucide-react/dynamic) dans un seul chunk
        // pour éviter des centaines de petits chunks par icône (surtout avec DynamicIcon).
        manualChunks(id) {
          if (id.includes("node_modules") && id.includes("lucide")) {
            return "lucide-react";
          }
        },
      },
    },
  },
  define: {
    __BRAND_NAME__: JSON.stringify(BRAND_CONFIG.name),
    __BRAND_DISPLAY_NAME__: JSON.stringify(BRAND_CONFIG.displayName),
    __BRAND_TAGLINE__: JSON.stringify(BRAND_CONFIG.tagline),
  }
});
