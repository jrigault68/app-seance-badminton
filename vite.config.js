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
      }
    }
  },
  define: {
    __BRAND_NAME__: JSON.stringify(BRAND_CONFIG.name),
    __BRAND_DISPLAY_NAME__: JSON.stringify(BRAND_CONFIG.displayName),
    __BRAND_TAGLINE__: JSON.stringify(BRAND_CONFIG.tagline),
  }
});
