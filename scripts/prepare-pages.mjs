import { copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");

// SPA fallback: GitHub Pages sirve 404.html en rutas desconocidas.
copyFileSync(join(dist, "index.html"), join(dist, "404.html"));
writeFileSync(join(dist, ".nojekyll"), "");
console.log("Prepared dist for GitHub Pages (404.html, .nojekyll)");
