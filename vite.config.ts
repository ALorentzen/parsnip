import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import FullReload from "vite-plugin-full-reload";
import basicSsl from "@vitejs/plugin-basic-ssl";

const DOMAIN = process.env.VITE_DEV_HOST ?? "parsnip.test";
const PORT = Number(process.env.VITE_DEV_PORT ?? 5173);
const USE_HTTPS = (process.env.VITE_DEV_PROTOCOL ?? "https").toLowerCase() !== "http";

export default defineConfig({
  plugins: [
    react(),
    FullReload(["**/*.php"], { delay: 200 }),
    USE_HTTPS && basicSsl({ name: `${DOMAIN}-local`, domains: [DOMAIN, "localhost", "127.0.0.1"] }),
  ].filter(Boolean),
  base: "/wp-content/themes/parsnip/",
  server: {
    host: DOMAIN,
    port: PORT,
    strictPort: true,
    https: USE_HTTPS ? {} : undefined,
    hmr: {
      host: DOMAIN,
      protocol: USE_HTTPS ? "wss" : "ws",
      port: PORT,
    },
    cors: { origin: `https://${DOMAIN}` },
    headers: { "Access-Control-Allow-Origin": `https://${DOMAIN}` },
    allowedHosts: [DOMAIN, "localhost", "127.0.0.1"],
  },
  build: {
    outDir: "dist",
    manifest: true,
    rollupOptions: {
      input: "assets/js/main.tsx",
      output: {
        entryFileNames: "assets/main.js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
