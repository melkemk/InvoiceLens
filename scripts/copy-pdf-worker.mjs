// Copies the pdf.js worker into public/ so it's served as a static asset.
// Bundling it through webpack breaks: Terser can't minify the ESM worker.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve("pdfjs-dist/package.json"));

mkdirSync("public", { recursive: true });
copyFileSync(
  join(pkgDir, "build", "pdf.worker.min.mjs"),
  join("public", "pdf.worker.min.mjs")
);
console.log("Copied pdf.worker.min.mjs → public/");
