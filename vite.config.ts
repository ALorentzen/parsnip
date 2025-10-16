import fs from "node:fs";
import path from "node:path";
import { defineConfig, type ServerOptions } from "vite";
import react from "@vitejs/plugin-react";
import FullReload from "vite-plugin-full-reload";
import { viteStaticCopy } from "vite-plugin-static-copy";

type CopyTarget = { src: string; dest: string };
type ChunkInfo = { name: string };
type AssetInfo = { name?: string | null };

function discoverBlocks(rootDir: string = process.cwd()) {
  const blocksDir = path.resolve(rootDir, "blocks");
  const entries: Record<string, string> = {};
  const copyTargets: CopyTarget[] = [];
  if (!fs.existsSync(blocksDir)) return { entries, copyTargets };

  for (const dirEntry of fs.readdirSync(blocksDir, { withFileTypes: true })) {
    if (!dirEntry.isDirectory()) continue;
    const name = dirEntry.name;
    const dir = path.join(blocksDir, name);
    const entry = ["index.tsx", "index.ts", "index.js"]
      .map((entryFileName) => path.join(dir, entryFileName))
      .find(fs.existsSync);
    if (!entry) continue;
    entries[name] = entry;

    // IMPORTANT: include index.asset.php so WP loads core deps before your script
    for (const fileName of ["block.json", "style.css", "editor.css", "index.asset.php"]) {
      const filePath = path.join(dir, fileName);
      if (fs.existsSync(filePath)) copyTargets.push({ src: filePath, dest: `blocks/${name}` });
    }
  }
  return { entries, copyTargets };
}

const { entries, copyTargets } = discoverBlocks();

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
const httpsOptions: ServerOptions["https"] =
  USE_HTTPS &&
  fs.existsSync(path.join(herdCertDir, `${DOMAIN}.key`)) &&
  fs.existsSync(path.join(herdCertDir, `${DOMAIN}.crt`))
    ? {
        key: fs.readFileSync(path.join(herdCertDir, `${DOMAIN}.key`)),
        cert: fs.readFileSync(path.join(herdCertDir, `${DOMAIN}.crt`)),
      }
    : USE_HTTPS
      ? {}
      : undefined;

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
      babel: {
        plugins: [
          [
            "@babel/plugin-transform-react-jsx",
            {
              runtime: "classic",
              pragma: "wp.element.createElement",
              pragmaFrag: "wp.element.Fragment",
            },
          ],
        ],
      },
    }),
    FullReload(["**/*.php"], { delay: 200 }),
    viteStaticCopy({ targets: copyTargets }),
  ],
  base: "/wp-content/themes/parsnip/",
  server: {
    host: DOMAIN,
    port: PORT,
    strictPort: true,
    https: httpsOptions,
    hmr: { host: DOMAIN, protocol: USE_HTTPS ? "wss" : "ws", port: PORT },
    cors: {
      origin: [`${PROTOCOL}://${DOMAIN}`, `${PROTOCOL}://www.${DOMAIN}`],
      credentials: true,
    },
    headers: {
      "Access-Control-Allow-Origin": `${PROTOCOL}://${DOMAIN}`,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    allowedHosts: [DOMAIN, "localhost", "127.0.0.1"],
  },
  build: {
    outDir: "dist",
    manifest: true,
    minify: false,
    rollupOptions: {
      input: { theme: "assets/js/main.tsx", ...entries },
      output: {
        entryFileNames: (chunkInfo: ChunkInfo) =>
          entries[chunkInfo.name] ? `blocks/${chunkInfo.name}/index.js` : "assets/main.js",
        assetFileNames: (assetInfo: AssetInfo) =>
          entries[assetInfo.name ?? ""]
            ? `blocks/${assetInfo.name}/[name][extname]`
            : "assets/[name][extname]",
        intro: (chunk) => (entries[chunk.name] ? "(function() {" : ""),
        outro: (chunk) => (entries[chunk.name] ? "})();" : ""),
      },
    },
  },
});
