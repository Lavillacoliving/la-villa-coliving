import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Dev seulement : les Edge Functions n'acceptent en CORS que https://www.lavillacoliving.com ; en local, le client
  // Supabase (src/lib/supabase.ts) les appelle en même origine et Vite relaie vers Supabase.
  server: {
    proxy: {
      "/functions/v1": { target: "https://tefpynkdxxfiefpkgitz.supabase.co", changeOrigin: true, secure: true },
    },
  },
});
