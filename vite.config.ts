import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import FullReload from "vite-plugin-full-reload";
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import type { ServerOptions as HttpsServerOptions } from "node:https";

const siteUrl = new URL(
  process.env.WP_HOME ??
    process.env.WORDPRESS_URL ??
    process.env.VITE_ALLOWED_ORIGIN ??
    "https://parsnip.test",
);

const devPort = Number(process.env.VITE_DEV_PORT ?? 5173);
const devUrl = new URL(
  process.env.VITE_DEV_URL ?? `${siteUrl.protocol}//${siteUrl.hostname}:${devPort}`,
);
const devHost = devUrl.hostname;
const devPortValue = Number(devUrl.port) || devPort;
const useHttps = devUrl.protocol === "https:";

const allowedOrigin = process.env.VITE_ALLOWED_ORIGIN ?? `${siteUrl.protocol}//${siteUrl.host}`;

const herdCertDir =
  process.env.HERD_CERT_DIR ??
  path.join(homedir(), "Library", "Application Support", "Herd", "config", "valet", "Certificates");

const readCertPair = (basename: string): HttpsServerOptions | undefined => {
  const keyPath = path.join(herdCertDir, `${basename}.key`);
  const certPath = path.join(herdCertDir, `${basename}.crt`);
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
  return undefined;
};

const httpsConfig: boolean | HttpsServerOptions | undefined = (() => {
  if (!useHttps) return undefined;

  if (process.env.VITE_DEV_KEY && process.env.VITE_DEV_CERT) {
    return {
      key: fs.readFileSync(process.env.VITE_DEV_KEY),
      cert: fs.readFileSync(process.env.VITE_DEV_CERT),
    };
  }

  return readCertPair(devHost) ?? true;
})();

export default defineConfig({
  plugins: [react(), FullReload(["**/*.php"], { delay: 200 })],
  server: {
    host: devHost,
    port: devPortValue,
    https: httpsConfig === true ? undefined : httpsConfig,
    hmr: {
      host: devHost,
      protocol: httpsConfig ? "wss" : "ws",
      port: devPortValue,
    },
    cors: {
      origin: allowedOrigin,
    },
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
    },
    allowedHosts: Array.from(new Set([devHost, siteUrl.hostname, "localhost", "127.0.0.1"])),
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
