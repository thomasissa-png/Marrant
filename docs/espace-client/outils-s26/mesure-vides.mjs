// Mesures v7 tour 2 d'« Aujourd'hui » : vides des tuiles, extrait, pastilles, cibles. node mesure.mjs [largeurs] [comptes]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("/opt/node-tools/node_modules/playwright/index.js");
const BASE = "http://localhost:5400";
const LARGEURS = (process.argv[2] || "375,768,1280,1920").split(",").map(Number);
const COMPTES_ALL = { visiteur: null, gratuit: "inscrit-gratuit@preversion.test", "en-cours": "abonne-en-cours@preversion.test", nouvel: "nouvel-abonne@preversion.test" };
const comptes = (process.argv[3] || "visiteur,gratuit,en-cours,nouvel").split(",");
const browser = await chromium.launch();
const ip = () => `10.${[1, 2, 3].map(() => Math.floor(Math.random() * 250)).join(".")}`;

async function etat(compte) {
  if (!COMPTES_ALL[compte]) return undefined;
  const ctx = await browser.newContext({ extraHTTPHeaders: { "cf-connecting-ip": ip() } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/login", { waitUntil: "networkidle" });
  await p.locator("#email").fill(COMPTES_ALL[compte]);
  await p.locator("#password").fill("preversion-s24");
  await p.getByRole("button", { name: "Se connecter" }).click();
  await p.waitForURL((u) => !/\/login|arrivee/.test(u.toString()), { timeout: 30000 });
  const s = await ctx.storageState();
  await ctx.close();
  return s;
}

function mesurer() {
  // Lignes de contenu d'un bloc : rectangles des nœuds texte, svg, barres, boutons, vignettes.
  function contenus(el) {
    const rects = [];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.textContent.trim()) continue;
      const p = n.parentElement;
      if (p.closest(".sr-only,[data-badge-premium]")) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const x of r.getClientRects()) if (x.height > 0) rects.push({ t: x.top, b: x.bottom });
    }
    for (const e of el.querySelectorAll("svg,[data-barre-etapes],[data-segments-cap],button,a.rounded-md,.aspect-video,li.rounded-md,span[aria-disabled]")) {
      if (e.closest("[data-badge-premium]")) continue;
      const x = e.getBoundingClientRect();
      if (x.height > 0) rects.push({ t: x.top, b: x.bottom });
    }
    for (const e of el.querySelectorAll('[class*="border-t"]')) {
      const x = e.getBoundingClientRect();
      if (parseFloat(getComputedStyle(e).borderTopWidth) > 0 && x.height > 0) rects.push({ t: x.top, b: x.top + 1 });
    }
    rects.sort((a, b) => a.t - b.t);
    const u = [];
    for (const r of rects) {
      const d = u.at(-1);
      if (d && r.t <= d.b + 0.5) d.b = Math.max(d.b, r.b);
      else u.push({ ...r });
    }
    return u;
  }
  function bloc(el) {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const pb = parseFloat(cs.paddingBottom), pt = parseFloat(cs.paddingTop), bb = parseFloat(cs.borderBottomWidth), bt = parseFloat(cs.borderTopWidth);
    const u = contenus(el);
    if (!u.length) return { h: Math.round(b.height) };
    let gapMax = 0;
    for (let i = 1; i < u.length; i++) gapMax = Math.max(gapMax, u[i].t - u[i - 1].b);
    const basBrut = b.bottom - bb - u.at(-1).b;
    return { h: Math.round(b.height), basBrut: Math.round(basBrut), basEnTrop: Math.round(basBrut - pb), hautEnTrop: Math.round(u[0].t - b.top - bt - pt), creuxMax: Math.round(gapMax) };
  }
  const q = (s) => document.querySelector(s);
  const out = {};
  if (q("[data-apercu-verrouille]")) {
    const r1 = q('[data-apercu-rangee="1"]');
    const [z1, z2] = r1 ? Array.from(r1.querySelectorAll(":scope > [data-tuile-fermee] > section")) : [];
    out.Z1 = bloc(z1);
    out.Z2 = bloc(z2);
    const suite = q("[data-apercu-suite]");
    if (suite) {
      const s = suite.getBoundingClientRect();
      const transp = s.bottom - 48;
      const coupees = [];
      const w = document.createTreeWalker(suite, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (!n.textContent.trim() || n.parentElement.closest("[data-badge-premium]")) continue;
        const r = document.createRange();
        r.selectNodeContents(n);
        for (const x of r.getClientRects()) if (x.top < transp && x.bottom > transp) coupees.push(n.textContent.trim().slice(0, 30));
      }
      // v7 tour 3 : chaque tuile de la rangée 2, lignes de texte avec leur opacité de masque au milieu de la ligne.
      const H = s.height, NOIR = 112, TR = H - 48;
      const alpha = (y) => (y <= NOIR ? 1 : y >= TR ? 0 : 1 - (y - NOIR) / (TR - NOIR));
      out.tuiles2 = Array.from(suite.querySelectorAll("[data-tuile-fermee]")).filter((t) => t.getBoundingClientRect().top < s.bottom).map((t) => {
        const lignes = [];
        const w2 = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
        for (let n = w2.nextNode(); n; n = w2.nextNode()) {
          if (!n.textContent.trim() || n.parentElement.closest("[data-badge-premium]")) continue;
          const r = document.createRange();
          r.selectNodeContents(n);
          for (const x of r.getClientRects()) {
            const m = (x.top + x.bottom) / 2 - s.top;
            if (x.top - s.top < H) lignes.push(`${Math.round(x.top - s.top)}:${alpha(m).toFixed(2)}:${n.textContent.trim().slice(0, 14)}`);
          }
        }
        return lignes.join(" | ");
      });
      const fin = document.querySelector('[data-position="fin"]').getBoundingClientRect();
      const haut = document.querySelector('[data-apercu-verrouille] [data-position="haut"]').getBoundingClientRect();
      out.boutons = { hautY: Math.round(haut.top), finY: Math.round(fin.top + scrollY), finVisible: fin.top < innerHeight };
      const leg = document.querySelector("[data-apercu-extrait] > p:last-child").getBoundingClientRect();
      const pied = document.querySelector("footer").getBoundingClientRect();
      out.legendePied = Math.round(pied.top - leg.bottom);
      const prom = document.querySelector("[data-apercu-hero] p.text-lg").getBoundingClientRect();
      const offre = document.querySelector("[data-apercu-offre]").getBoundingClientRect();
      out.hero = { promesseLignes: Math.round(prom.height / 28), promesseDroite: Math.round(prom.right), offreGauche: Math.round(offre.left), offreHaut: Math.round(offre.top), badgeHaut: Math.round(document.querySelector("[data-apercu-hero] [data-badge-premium]").getBoundingClientRect().top) };
      // Contraste des éléments figés : opacité effective et composition sur le fond de la tuile.
      const lum = (c) => { const v = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
      const rgb = (t) => t.match(/[\d.]+/g).slice(0, 3).map(Number);
      const contraste = (el, fondEl) => {
        let o = 1; for (let e = el; e && !e.hasAttribute("data-tuile-fermee"); e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
        const fond = rgb(getComputedStyle(fondEl).backgroundColor === "rgba(0, 0, 0, 0)" ? "rgb(31,31,31)" : getComputedStyle(fondEl).backgroundColor);
        const bgEl = getComputedStyle(el).backgroundColor;
        const bg = bgEl.startsWith("rgba(0, 0, 0, 0") ? fond : rgb(bgEl);
        const tx = rgb(getComputedStyle(el).color);
        const mix = (a) => a.map((x, i) => o * x + (1 - o) * fond[i]);
        const [l1, l2] = [lum(mix(tx)), lum(mix(bg))].sort((a, b) => b - a);
        return `${o.toFixed(2)} ${((l1 + 0.05) / (l2 + 0.05)).toFixed(2)}`;
      };
      const fige = Array.from(document.querySelectorAll("[data-apercu-extrait] span[aria-disabled]"));
      out.figes = fige.map((f) => contraste(f, f.closest("section")));
      out.extrait = { capBas: Math.round(z2?.getBoundingClientRect().bottom ?? 0), suiteHaut: Math.round(s.top), capAvantFondu: (z2?.getBoundingClientRect().bottom ?? 1e9) <= s.top + 0.5, suiteH: Math.round(s.height), lignesCoupees: coupees };
    }
    const lis = Array.from(document.querySelectorAll("[data-apercu-pastilles] li")).map((l) => Math.round(l.getBoundingClientRect().top));
    const rangees = [...new Set(lis)].map((t) => lis.filter((x) => x === t).length);
    out.pastilles = rangees.join("+");
    const cx = Array.from(document.querySelectorAll("[data-apercu-offre] a")).find((a) => /Connexion/.test(a.textContent));
    if (cx) out.connexion = Math.round(cx.getBoundingClientRect().height) + "x" + Math.round(cx.getBoundingClientRect().width);
    const re = q("[data-apercu-offre] [data-reassurance]");
    if (re) out.reassurance = getComputedStyle(re).fontSize + " " + getComputedStyle(re).color;
    const obj = Array.from(document.querySelectorAll("[data-apercu-offre] p")).find((p) => p !== re && !p.hasAttribute("data-preuve") && !p.querySelector("a"));
    if (obj) out.objet = getComputedStyle(obj).fontSize + " " + getComputedStyle(obj).color;
  } else {
    out.Z1 = bloc(q("[data-carte-du-jour] > section"));
    out.Z2 = bloc(q('[data-zone="cap"] > section'));
    for (const z of ["parcours", "semaines", "mission", "rafale"]) {
      const e = q(`[data-zone="${z}"] > *`);
      if (e) out[z] = bloc(e);
    }
    for (const id of ["jour-vanne", "jour-conseil", "jour-video"]) out[id] = bloc(q("#" + id)?.closest("article"));
    const sem = Array.from(document.querySelectorAll("[data-semaines] li"));
    if (sem.length) out.semainesDebuts = sem.map((l) => l.innerText.trim().slice(0, 9)).join(" | ");
    const aise = q("[data-question-aise] [role=group]");
    if (aise) { const g = aise.getBoundingClientRect(); const bs = Array.from(aise.children).map((b) => b.getBoundingClientRect()); out.aise = `groupe ${Math.round(g.width)} puces ${Math.round(bs.at(-1).right - bs[0].left)} videDroite ${Math.round(g.right - bs.at(-1).right)}`; }
    const vid = q("#jour-video")?.closest("article");
    if (vid) out.video = `${Math.round(vid.getBoundingClientRect().width)}x${Math.round(vid.getBoundingClientRect().height)} vignette ${Math.round(vid.querySelector(".aspect-video")?.getBoundingClientRect().width ?? 0)}`;
    const acc = q("[data-rafale-accroche]");
    if (acc) out.rafale1 = `titreHaut ${Math.round(q("#rafale-titre").getBoundingClientRect().top - q("[data-carte-du-jour] > section").getBoundingClientRect().top)} accrocheSousTitre ${acc.getBoundingClientRect().top > q("#rafale-titre").getBoundingClientRect().bottom}`;
    const main = q("main"); const pied = q("footer");
    out.basPage = Math.round(pied.getBoundingClientRect().top - Array.from(main.querySelectorAll("section,article")).reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0));
    const pt = q('[data-testid="parcours-tuile"]');
    if (pt) out.parcoursTuile = (pt.querySelector("[data-barre-etapes]") ? "barre " : "SANS barre ") + (pt.innerText.match(/Étape \d+ sur \d+/) || ["?"])[0];
  }
  return out;
}

for (const compte of comptes) {
  const storageState = await etat(compte);
  for (const w of LARGEURS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 812 : 900 }, colorScheme: "dark", deviceScaleFactor: 1, storageState });
    const page = await ctx.newPage();
    await page.goto(BASE + "/mon-espace", { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(800);
    console.log(`== ${compte} ${w}`, JSON.stringify(await page.evaluate(mesurer)));
    await ctx.close();
  }
}
await browser.close();
