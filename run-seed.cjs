// Seed runner — exécuté depuis la racine du workspace par le build Replit
// Utilise l'API CJS de tsx pour compiler seed.ts sans passer par le loader ESM
// qui résout les chemins depuis la racine au lieu du cwd.
const path = require("path");
const webDir = path.join(__dirname, "apps", "web");
process.chdir(webDir);
require("tsx/cjs/api").register();
require("./prisma/seed.ts");
