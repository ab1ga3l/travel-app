// Copies the plain logic and data the web app and the phone app share from ../src/lib
// into src/shared. Edit the originals in ../src/lib, then run `npm run sync`.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const out = path.resolve(__dirname, "../src/shared");
const FILES = ["site", "types", "countries", "countryExtras", "gems", "visa", "world", "geo", "events", "tripTypes", "tripBuild", "badges", "match", "interestTags", "tripText", "money"];

fs.mkdirSync(out, { recursive: true });
for (const f of FILES) {
  const src = fs.readFileSync(path.join(root, "src/lib", `${f}.ts`), "utf8");
  fs.writeFileSync(path.join(out, `${f}.ts`), `// GENERATED from src/lib/${f}.ts by scripts/sync-shared.js. Do not edit here.\n${src}`);
}
fs.copyFileSync(path.join(root, "src/data/visa-matrix.json"), path.join(out, "visa-matrix.json"));
console.log(`Synced ${FILES.length} files and the visa matrix into src/shared`);
