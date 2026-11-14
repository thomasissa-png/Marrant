// Captures s25, section par section : node captures-sections.mjs <section> <dossier> [base]
// 5 largeurs (375, 768, 1280, 1456, 1920), sombre, comptes : visiteur, gratuit, en-cours, nouvel.
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("/opt/node-tools/node_modules/playwright/index.js");
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const [section, dossier, baseArg] = process.argv.slice(2);
const BASE = baseArg || "http://localhost:5400";
const LARGEURS = (process.env.LARGEURS || "375,768,1280,1456,1920").split(",").map(Number);
const MDP = "preversion-s24";
const COMPTES = {
  visiteur: null,
  gratuit: "inscrit-gratuit@preversion.test",
  "en-cours": "abonne-en-cours@preversion.test",
  nouvel: "nouvel-abonne@preversion.test",
};

// action : "page" (pleine page), "haut" (fenêtre seule), "menu" (menu mobile ouvert), "cloche", "compte"
const SECTIONS = {
  etalon: { comptes: ["visiteur"], pages: [["accueil", "/", "page"]] },
  entete: {
    comptes: ["visiteur", "gratuit", "en-cours", "nouvel"],
    pages: [
      ["accueil", "/", "haut"],
      ["vannes", "/vannes", "haut"],
      ["mon-espace", "/mon-espace", "haut"],
      ["menu-accueil", "/", "menu"],
      ["menu-mon-espace", "/mon-espace", "menu"],
      ["menu-situation", "/mon-espace/fiche/situation/coloc-la-poele", "menu"],
      ["menu-vannes", "/vannes", "menu"],
      ["profil", "/profil", "haut"],
      ["menu-profil", "/profil", "menu"],
      ["cloche", "/mon-espace", "cloche"],
      ["compte", "/vannes", "compte"],
      ["cloche-vide", "/mon-espace", "cloche-vide"],
      ["focus-menu", "/vannes", "focus"],
    ],
    largeurs: [320, 375, 440, 520, 600, 640, 641, 768, 1024, 1280, 1456, 1920],
  },
  aujourdhui: { comptes: ["en-cours", "nouvel"], pages: [["aujourdhui", "/mon-espace", "page"]] },
  "quoi-repondre": { comptes: ["en-cours", "nouvel"], pages: [["quoi-repondre", "/mon-espace/quoi-repondre", "page"]] },
  bibliotheque: { comptes: ["en-cours", "nouvel"], pages: [["bibliotheque", "/mon-espace/bibliotheque", "page"]] },
  "s-entrainer": { comptes: ["en-cours", "nouvel"], pages: [["s-entrainer", "/mon-espace/s-entrainer", "page"]] },
  questions: { comptes: ["en-cours", "nouvel"], pages: [["questions", "/mon-espace/questions", "page"]] },
  repliques: { comptes: ["en-cours", "nouvel"], pages: [["repliques", "/mon-espace/repliques", "page"]] },
  lettre: { comptes: ["visiteur", "gratuit", "en-cours", "nouvel"], pages: [["lettre", "/lettre", "page"], ["lettres-espace", "/mon-espace/lettres", "page"]] },
  favoris: { comptes: ["gratuit", "en-cours", "nouvel"], pages: [["favoris", "/favoris", "page"]] },
  carnet: { comptes: ["visiteur", "en-cours", "nouvel"], pages: [["carnet", "/carnet", "page"]] },
  parcours: { comptes: ["visiteur", "gratuit", "en-cours", "nouvel"], pages: [["parcours", "/parcours", "page"], ["parcours-repartie", "/parcours/repartie", "page"]] },
  profil: { comptes: ["gratuit", "en-cours", "nouvel"], pages: [["profil", "/profil", "page"]] },
  vannes: { comptes: ["visiteur", "gratuit", "en-cours"], pages: [["vannes", "/vannes", "page"]] },
};

const def = SECTIONS[section];
if (!def) throw new Error(`section inconnue : ${section} (${Object.keys(SECTIONS).join(", ")})`);
const largeurs = process.env.LARGEURS ? LARGEURS : def.largeurs || LARGEURS;
const comptes = (process.env.COMPTES ? process.env.COMPTES.split(",") : def.comptes);
mkdirSync(dossier, { recursive: true });
const etatDir = join(dossier, "..", ".etats"); // jetons de session de TEST, ignorés par git (.gitignore)
mkdirSync(etatDir, { recursive: true });

const browser = await chromium.launch();
const ip = () => `10.${[1, 2, 3].map(() => Math.floor(Math.random() * 250)).join(".")}`;

async function etat(compte) {
  if (!COMPTES[compte]) return undefined;
  const f = join(etatDir, `${compte}-${BASE.replace(/\W/g, "_")}.json`);
  if (existsSync(f) && !process.env.RECONNECTER) return f;
  const ctx = await browser.newContext(BASE.includes("localhost") ? { extraHTTPHeaders: { "cf-connecting-ip": ip() } } : {});
  const p = await ctx.newPage();
  await p.goto(BASE + "/login", { waitUntil: "networkidle" });
  await p.locator("#email").fill(COMPTES[compte]);
  await p.locator("#password").fill(MDP);
  await p.getByRole("button", { name: "Se connecter" }).click();
  await p.waitForURL((u) => !/\/login|arrivee/.test(u.toString()), { timeout: 30000 });
  await p.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await ctx.storageState({ path: f });
  await ctx.close();
  return f;
}

const lignes = [`# Captures ${section} (${new Date().toISOString().slice(0, 16)}, ${BASE})`, ""];
for (const compte of comptes) {
  const storageState = await etat(compte);
  for (const w of largeurs) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 812 : 900 }, colorScheme: "dark", deviceScaleFactor: 1, storageState });
    const page = await ctx.newPage();
    const erreurs = [];
    page.on("pageerror", (e) => erreurs.push(e.message));
    for (const [nom, url, action] of def.pages) {
      if (action === "menu" && w >= 1024) continue;
      if (action === "focus" && ![375, 768, 1280].includes(w)) continue;
      if (action.startsWith("cloche") && !compte.match(/en-cours|nouvel/)) continue;
      if (action === "cloche-vide" && compte !== "nouvel") continue;
      if (action === "cloche-vide") await page.route("**/api/espace/cloche", (route) => route.request().method() === "GET" ? route.fulfill({ json: { nonLues: 0, reponses: [], nouveautes: [], lettre: null } }) : route.continue());
      else await page.unroute("**/api/espace/cloche").catch(() => {});
      if (action === "compte" && (compte === "visiteur" || w < 768)) continue;
      const r = await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 45000 }).catch((e) => ({ status: () => "ERR " + e.message.slice(0, 60) }));
      await page.waitForTimeout(400);
      const fichier = `${compte}-${nom}-${w}.png`;
      try {
        if (action === "menu") await page.getByRole("button", { name: /menu/i }).first().click();
        if (action === "focus") {
          // Tab jusqu'à chaque contrôle de l'en-tête, une capture par contrôle (focus clavier visible)
          await page.goto(BASE + url, { waitUntil: "networkidle" });
          let n = 0;
          for (let i = 0; i < 25 && n < 6; i++) {
            await page.keyboard.press("Tab");
            const dansEntete = await page.evaluate(() => !!document.activeElement?.closest("header"));
            if (!dansEntete) { if (n > 0) break; else continue; }
            await page.waitForTimeout(150);
            await page.screenshot({ path: join(dossier, `${compte}-focus-${String(++n).padStart(2, "0")}-${w}.png`), clip: { x: 0, y: 0, width: w, height: 120 } });
          }
          lignes.push(`- ${compte}-focus-*-${w}.png : ${url} (focus clavier, ${n} contrôles de l'en-tête)`);
          continue;
        }
        if (action.startsWith("cloche")) await page.getByRole("banner").getByRole("button", { name: /^Notifications/ }).click();
        if (action === "compte") await page.getByRole("banner").getByRole("button", { name: /compte/i }).first().click();
        if (action !== "page") await page.waitForTimeout(500);
        await page.screenshot({ path: join(dossier, fichier), fullPage: action === "page" });
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        const deb = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        lignes.push(`- ${fichier} : ${url} (${action}), HTTP ${r?.status?.()}, hauteur ${h}px${deb ? ", DÉBORDEMENT HORIZONTAL" : ""}`);
      } catch (e) {
        lignes.push(`- ${fichier} : ${url} (${action}) ÉCHEC ${String(e.message).slice(0, 120)}`);
      }
    }
    if (erreurs.length) lignes.push(`  - erreurs JS (${compte}, ${w}) : ${erreurs.slice(0, 3).join(" | ")}`);
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(dossier, "INDEX.md"), lignes.join("\n") + "\n");
console.log(lignes.join("\n"));
