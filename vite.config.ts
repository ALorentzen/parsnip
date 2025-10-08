import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  base: "/wp-content/themes/parsnip/",
  server: {
    host: "parsnip.test",
    port: 5173,
    strictPort: true,
    https: true,
    hmr: { protocol: "wss", host: "parsnip.test", port: 5173 },
  },
  build: {
    outDir: "dist",
    manifest: true,
    rollupOptions: { input: "assets/js/main.tsx" },
  },
});
