// Harnais de la batterie avant lancement (s26). Aucun appel externe : tout ce qui sort de localhost est bloqué.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const CAPT = '/home/user/Marrant/docs/captures/s26/batterie';
const SP = __dirname;
fs.mkdirSync(CAPT, { recursive: true });
const RES = path.join(SP, 'resultats.jsonl');
const MDP = 'preversion-s24';

function noter(r) { fs.appendFileSync(RES, JSON.stringify({ t: new Date().toISOString(), ...r }) + '\n'); console.log(`[${r.statut}] ${r.public} | ${r.trajet} | ${r.largeur || ''} | ${r.detail || ''}`); }

function nbCaptures() { return fs.readdirSync(CAPT).filter(f => f.endsWith('.png')).length; }
async function capture(page, nom) {
  if (nbCaptures() >= 60) return null;
  const f = path.join(CAPT, nom.replace(/[^a-z0-9-]+/gi, '-').slice(0, 80) + '.png');
  try { await page.screenshot({ path: f, fullPage: false }); return path.basename(f); } catch { return null; }
}

async function contexte(browser, largeur, base) {
  const ctx = await browser.newContext({ viewport: { width: largeur, height: largeur < 500 ? 812 : 900 }, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const journal = { console: [], pageerror: [], http: [], externes: new Set() };
  await ctx.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (['localhost', '127.0.0.1'].includes(u.hostname) || u.protocol === 'data:' || u.protocol === 'blob:') return route.fallback();
    journal.externes.add(u.hostname);
    return route.abort();
  });
  ctx.on('page', (p) => brancher(p, journal));
  ctx.journal = journal; ctx.base = base; ctx.largeur = largeur;
  return ctx;
}
function brancher(p, journal) {
  p.on('console', (m) => { if (m.type() === 'error') journal.console.push(`${p.url()} :: ${m.text().slice(0, 200)}`); });
  p.on('pageerror', (e) => journal.pageerror.push(`${p.url()} :: ${String(e).slice(0, 200)}`));
  p.on('response', (r) => { const u = r.url(); if (r.status() >= 400 && /localhost|127\.0\.0\.1/.test(u)) journal.http.push(`${r.status()} ${u}`); });
}
// Erreurs console dues au blocage volontaire des domaines externes : écartées (on les compte à part).
function erreursReelles(j) {
  const bruit = /ERR_FAILED|ERR_BLOCKED|net::|youtube|ytimg|umami|google|Failed to load resource/i;
  return { console: j.console.filter(c => !bruit.test(c)), pageerror: j.pageerror, http: j.http };
}

async function visiter(page, chemin, { attendu = 200 } = {}) {
  const base = page.context().base;
  const t0 = Date.now();
  const r = await page.goto(chemin.startsWith('http') ? chemin : base + chemin, { waitUntil: 'load', timeout: 45000 });
  const ms = Date.now() - t0;
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const txt = document.body.innerText;
    return {
      debord: document.documentElement.scrollWidth - window.innerWidth,
      h1: [...document.querySelectorAll('h1')].filter(h => h.offsetParent !== null || getComputedStyle(h).position === 'fixed').map(h => h.innerText.trim()),
      h1caches: [...document.querySelectorAll('h1')].filter(h => h.offsetParent === null).length,
      ttfb: nav ? Math.round(nav.responseStart) : null,
      dcl: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      morts: (txt.match(/\bundefined\b|\[object Object\]|\bNaN\b|Lorem ipsum/g) || []),
      robots: document.querySelector('meta[name=robots]')?.content || '',
      titre: document.title,
    };
  });
  return { statut: r ? r.status() : 0, url: page.url(), ms, ...m, ok: (r ? r.status() : 0) === attendu };
}

async function connecter(page, email, mdp = MDP) {
  const base = page.context().base;
  await page.goto(base + '/login', { waitUntil: 'load' });
  await page.fill('#email', email); await page.fill('#password', mdp);
  await Promise.all([page.waitForURL(u => !u.pathname.startsWith('/login'), { timeout: 30000 }), page.getByRole('button', { name: 'Se connecter', exact: true }).click()]);
  await page.waitForLoadState('load');
  return page.url();
}

// Vérification standard d'une page : statut, H1 unique, pas de débordement, pas de texte mort.
async function controlePage(page, pub, trajet, chemin, opts = {}) {
  let v;
  try { v = await visiter(page, chemin, opts); } catch (e) { const c = await capture(page, `${pub}-${trajet}-${page.context().largeur}`); noter({ public: pub, trajet, largeur: page.context().largeur, statut: 'FAIL', detail: `exception ${String(e).slice(0, 150)}`, capture: c }); return null; }
  const pb = [];
  if (!v.ok) pb.push(`HTTP ${v.statut} (attendu ${opts.attendu || 200})`);
  if (opts.urlAttendue && !opts.urlAttendue.test(v.url)) pb.push(`URL ${v.url}`);
  if (v.debord > 1) pb.push(`débordement horizontal ${v.debord}px`);
  if (v.h1.length !== 1 && !opts.h1Libre) pb.push(`${v.h1.length} H1`);
  if (v.morts.length) pb.push(`texte mort ${v.morts.join(',')}`);
  const statut = pb.length ? 'FAIL' : 'PASS';
  const c = statut === 'FAIL' ? await capture(page, `${pub}-${trajet}-${page.context().largeur}`) : null;
  noter({ public: pub, trajet, largeur: page.context().largeur, statut, detail: (pb.join(' ; ') || `${v.statut} ${v.h1[0] || ''}`).slice(0, 200), ms: v.ms, ttfb: v.ttfb, url: v.url, capture: c });
  return v;
}

async function etape(page, pub, trajet, fn) {
  try {
    const d = await fn();
    noter({ public: pub, trajet, largeur: page.context().largeur, statut: 'PASS', detail: d || '' });
    return true;
  } catch (e) {
    const bloque = /^BLOQUE/.test(String(e.message || e));
    const c = bloque ? null : await capture(page, `${pub}-${trajet}-${page.context().largeur}`);
    noter({ public: pub, trajet, largeur: page.context().largeur, statut: bloque ? 'BLOQUÉ' : 'FAIL', detail: String(e.message || e).split('\n')[0].slice(0, 220), url: page.url(), capture: c });
    return false;
  }
}

function mails() { const d = path.join(SP, 'mails'); return fs.readdirSync(d).sort().map(f => ({ f, ...JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')) })); }

module.exports = { chromium, contexte, visiter, connecter, controlePage, etape, noter, capture, erreursReelles, mails, MDP, SP };
