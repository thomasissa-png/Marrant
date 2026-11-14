// Préversion locale s25 : connexion des 3 comptes de test par le formulaire /login, puis visite des pages
// de l'espace. Pour chaque page : code HTTP final, URL finale, erreurs JS (pageerror), écran d'erreur.
// Captures pleine page dans ./captures/<compte>/. Code de sortie 1 si une page attendue échoue.
// Usage : node /root/marrant-preversion-s25/verifier.mjs [--sans-captures]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = "http://localhost:5400";
const DOSSIER = new URL("./captures/", import.meta.url).pathname;
const CAPTURES = !process.argv.includes("--sans-captures");
const PAGES = [
  "/", "/mon-espace", "/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer",
  "/mon-espace/questions", "/mon-espace/repliques", "/mon-espace/lettres", "/favoris", "/carnet", "/parcours",
  "/profil", "/vannes", "/lettre", "/mon-espace/fiche/situation/coloc-la-poele",
];
const COMPTES = ["abonne-en-cours", "nouvel-abonne", "inscrit-gratuit"];
const ECRAN_ERREUR = /Application error|Internal Server Error|Une erreur est survenue|Something went wrong/i;

const navigateur = await chromium.launch();
let echecs = 0;
for (const compte of COMPTES) {
  const contexte = await navigateur.newContext({
    viewport: { width: 1280, height: 900 },
    extraHTTPHeaders: { "cf-connecting-ip": `10.${[1, 2, 3].map(() => randomBytes(1)[0]).join(".")}` },
  });
  const page = await contexte.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(e.message));
  await page.goto(`${BASE}/login`);
  await page.getByLabel(/e-?mail/i).fill(`${compte}@preversion.test`);
  await page.locator("#password").fill("preversion-s24");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.waitForURL((u) => !/\/login|\/api\/espace\/arrivee/.test(u.pathname), { timeout: 20_000 });
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  const session = await (await contexte.request.get(`${BASE}/api/auth/session`)).json();
  console.log(`\n== ${compte} : connecté (${session?.user?.email ?? "SANS SESSION"}), arrivée ${new URL(page.url()).pathname}`);
  if (!session?.user?.email) echecs++;
  if (CAPTURES) mkdirSync(`${DOSSIER}${compte}`, { recursive: true });
  for (const chemin of PAGES) {
    erreurs.length = 0;
    const rep = await page.goto(`${BASE}${chemin}`, { waitUntil: "load" });
    await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => undefined);
    const code = rep?.status() ?? 0;
    const finale = new URL(page.url()).pathname;
    const ecran = ECRAN_ERREUR.test(await page.locator("body").innerText().catch(() => ""));
    const ok = code === 200 && erreurs.length === 0 && !ecran;
    if (!ok) echecs++;
    const renvoi = finale !== chemin ? ` -> ${finale}` : "";
    console.log(`${ok ? "OK " : "KO "} ${code} ${chemin}${renvoi}${erreurs.length ? ` erreurs JS: ${erreurs.join(" | ")}` : ""}${ecran ? " ÉCRAN D'ERREUR" : ""}`);
    if (CAPTURES) await page.screenshot({ path: `${DOSSIER}${compte}/${chemin.replace(/\//g, "_") || "_"}.png`, fullPage: true });
  }
  await contexte.close();
}
await navigateur.close();
console.log(echecs ? `\n${echecs} échec(s)` : "\nToutes les pages : 200, aucune erreur JS, aucun écran d'erreur.");
process.exit(echecs ? 1 : 0);
