import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import FullReload from "vite-plugin-full-reload";
import type { ServerOptions } from "vite";

const DOMAIN = process.env.VITE_DEV_HOST ?? "parsnip.test";
const PORT = Number(process.env.VITE_DEV_PORT ?? 5173);
const PROTOCOL =
  (process.env.VITE_DEV_PROTOCOL ?? "https").toLowerCase() === "http" ? "http" : "https";
const USE_HTTPS = PROTOCOL === "https";

const herdCertDir = path.join(
  process.env.HOME ?? "",
  "Library",
  "Application Support",
  "Herd",
  "config",
  "valet",
  "Certificates",
);
const keyPath = path.join(herdCertDir, `${DOMAIN}.key`);
const certPath = path.join(herdCertDir, `${DOMAIN}.crt`);

const httpsOptions: ServerOptions["https"] =
  USE_HTTPS && fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      }
    : USE_HTTPS
      ? {}
      : undefined;

export default defineConfig({
  plugins: [react(), FullReload(["**/*.php"], { delay: 200 })],
  base: "/wp-content/themes/parsnip/",
  server: {
    host: DOMAIN,
    port: PORT,
    strictPort: true,
    https: httpsOptions,
    hmr: {
      host: DOMAIN,
      protocol: USE_HTTPS ? "wss" : "ws",
      port: PORT,
    },
    cors: { origin: `${PROTOCOL}://${DOMAIN}` },
    headers: { "Access-Control-Allow-Origin": `${PROTOCOL}://${DOMAIN}` },
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
