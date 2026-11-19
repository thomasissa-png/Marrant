// tailles.mjs + connexion (storageState, comme captures-sections.mjs) : 4 comptes x largeurs, premier écran de main.
// node tailles-comptes.mjs [base] ; LARGEURS=375,1280 par défaut ; PAGE=/mon-espace par défaut (s26 : toute rubrique).
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("/opt/node-tools/node_modules/playwright/index.js");
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const BASE = process.argv[2] || "http://localhost:5400";
const LARGEURS = (process.env.LARGEURS || "375,1280").split(",").map(Number);
const MDP = "preversion-s24";
const COMPTES = { visiteur: null, gratuit: "inscrit-gratuit@preversion.test", "en-cours": "abonne-en-cours@preversion.test", nouvel: "nouvel-abonne@preversion.test" };
const etatDir = (process.env.TRAVAIL || "/root/marrant-travail-s26") + "/etats-tailles";
mkdirSync(etatDir, { recursive: true });
const b = await chromium.launch();
const ip = () => `10.${[1, 2, 3].map(() => Math.floor(Math.random() * 250)).join(".")}`;

async function etat(compte) {
  if (!COMPTES[compte]) return undefined;
  const f = join(etatDir, `${compte}.json`);
  if (existsSync(f) && !process.env.RECONNECTER) return f;
  const ctx = await b.newContext({ extraHTTPHeaders: { "cf-connecting-ip": ip() } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/login", { waitUntil: "networkidle" });
  await p.locator("#email").fill(COMPTES[compte]);
  await p.locator("#password").fill(MDP);
  await p.getByRole("button", { name: "Se connecter" }).click();
  await p.waitForURL((u) => !/\/login|arrivee/.test(u.toString()), { timeout: 30000 });
  await ctx.storageState({ path: f });
  await ctx.close();
  return f;
}

for (const compte of Object.keys(COMPTES)) {
  const storageState = await etat(compte);
  for (const w of LARGEURS) {
    const h = w < 768 ? 812 : 900;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: "dark", storageState });
    const p = await ctx.newPage();
    await p.goto(BASE + (process.env.PAGE || "/mon-espace"), { waitUntil: process.env.ATTENTE || "networkidle" }); if (process.env.ATTENTE) await p.waitForTimeout(1500);
    const r = await p.evaluate((h) => {
      const m = new Map();
      const root = document.querySelector("main") || document.body;
      for (const el of root.querySelectorAll("*")) {
        const t = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(" ");
        if (!t) continue;
        const r = el.getBoundingClientRect();
        if (r.top > h || r.bottom < 0 || r.width === 0) continue;
        const cs = getComputedStyle(el);
        const k = `${cs.fontSize} ${cs.fontWeight} ${cs.fontFamily.split(",")[0]}${cs.textTransform === "uppercase" ? " MAJ" : ""}`;
        if (!m.has(k)) m.set(k, []);
        m.get(k).push(t.slice(0, 30));
      }
      return [...m.entries()].sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
    }, h);
    console.log(`\n## ${compte} ${w} x ${h}`);
    for (const [k, v] of r) console.log(k.padEnd(40), "|", v.slice(0, 3).join(" / "));
    const sizes = new Set(r.map(([k]) => k.split(" ")[0]));
    console.log("TAILLES DISTINCTES :", sizes.size, [...sizes].join(", "), "| COMBINAISONS :", r.length);
    await ctx.close();
  }
}
await b.close();
