// Outils communs, lecture seule. Toute requête non-GET/HEAD du navigateur est bloquée et journalisée.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = 'https://deviens-marrant.fr';
const DIR = __dirname;
const compteur = { navigations: 0, apiGet: 0, navigateurTotal: 0, bloquees: [] };

async function ouvrir(largeur) {
  const browser = await chromium.launch();
  const mobile = largeur < 768;
  const context = await browser.newContext({
    viewport: { width: largeur, height: mobile ? 812 : 900 },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    locale: 'fr-FR',
    userAgent: mobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  await context.route('**/*', (route) => {
    const req = route.request();
    const m = req.method();
    compteur.navigateurTotal++;
    if (m !== 'GET' && m !== 'HEAD') {
      compteur.bloquees.push(`${m} ${req.url()}`);
      return route.abort('blockedbyclient');
    }
    return route.fallback();
  });
  return { browser, context };
}

function suivreConsole(page, journal) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') journal.push({ url: page.url(), type: 'console', texte: msg.text().slice(0, 300) });
  });
  page.on('pageerror', (err) => journal.push({ url: page.url(), type: 'pageerror', texte: String(err).slice(0, 300) }));
}

// Mesures de la page courante (aucune action).
async function mesurer(page) {
  return page.evaluate(() => {
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null;
    const h1 = [...document.querySelectorAll('h1')].filter((e) => e.offsetParent !== null).map((e) => e.innerText.trim());
    const texte = document.body.innerText;
    const liens = [...document.querySelectorAll('a[href]')]
      .map((a) => a.href)
      .filter((h) => h.startsWith(location.origin))
      .map((h) => h.split('#')[0]);
    return {
      titre: document.title,
      robots,
      h1,
      scrollWidth: document.documentElement.scrollWidth,
      largeur: window.innerWidth,
      a1500: /1\s?500\s?\+/.test(texte),
      premium: (texte.match(/Premium/g) || []).length,
      toutOuvrir: [...document.querySelectorAll('a,button')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /Tout ouvrir/.test(t)),
      prix199: /1,99\s?€/.test(texte),
      undefinedVisible: /\bundefined\b|\[object Object\]|\bNaN\b/.test(texte),
      liens: [...new Set(liens)],
    };
  });
}

async function visiter(page, chemin, nomCapture, resultats) {
  compteur.navigations++;
  const rep = await page.goto(BASE + chemin, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  const m = await mesurer(page);
  const r = { chemin, statut: rep ? rep.status() : null, urlFinale: page.url().replace(BASE, ''),
    cacheControl: rep ? rep.headers()['cache-control'] : null, xRobots: rep ? rep.headers()['x-robots-tag'] : null, ...m };
  if (nomCapture) { await page.screenshot({ path: path.join(DIR, nomCapture), fullPage: false }); r.capture = nomCapture; }
  resultats.push(r);
  return r;
}

function ecrire(nom, data) { fs.writeFileSync(path.join(DIR, nom), JSON.stringify(data, null, 2)); }

module.exports = { BASE, DIR, compteur, ouvrir, suivreConsole, mesurer, visiter, ecrire };
