// Helpers QA locale s17 (B3). Instance LOCALE uniquement : aucune requête vers la prod.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BASE = 'http://localhost:5000';
const OUT = process.env.QA_OUT || '/home/user/Marrant/docs/qa/captures-parcours-apprentissage-s17/apres';
fs.mkdirSync(OUT, { recursive: true });
const AXE = fs.readFileSync('/tmp/claude-0/-home-user-Marrant/bd072092-6ee5-586f-8f47-6fd05fa5f334/scratchpad/qa/node_modules/axe-core/axe.min.js', 'utf8');
const WIDTHS = [375, 768, 1280];
const PW = 'QaLocal-2026!';

function sql(q) {
  return execFileSync('psql', ['-h', '127.0.0.1', '-p', '55433', '-U', 'postgres', '-d', 'marrant_qa', '-At', '-c', q], { encoding: 'utf8' }).trim();
}

async function launch() {
  return chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
  });
}

let ctxCount = 0;
/** Contexte avec garde-fous : prod bloquée, Umami intercepté (aucune stat polluée), écritures externes bloquées. */
async function newCtx(browser, width, extra = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height: width < 500 ? 812 : width < 1000 ? 1024 : 900 },
    deviceScaleFactor: 1, isMobile: width < 500, hasTouch: width < 500,
    locale: 'fr-FR', timezoneId: 'Europe/Paris',
    // IP fictive par contexte : la limite de connexion (30 / 15 min par IP) ne bloque pas un tour complet.
    extraHTTPHeaders: { 'cf-connecting-ip': `10.99.${width % 256}.${(++ctxCount) % 250}` },
    ...extra,
  });
  ctx.__log = { umami: [], blocked: [], errors: [], http: [] };
  await ctx.route('**/*', (route) => {
    const req = route.request();
    const u = req.url();
    const local = u.startsWith('http://localhost:5000') || u.startsWith('http://127.0.0.1:5000') || u.startsWith('data:') || u.startsWith('blob:');
    if (local) return route.fallback();
    if (/umami/i.test(u)) {
      if (req.method() === 'POST') ctx.__log.umami.push(req.postData());
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: req.method() === 'POST' ? '{}' : 'window.umami={track:function(){}};' });
    }
    if (/deviens-marrant\.fr/.test(u) || req.method() !== 'GET') { ctx.__log.blocked.push(req.method() + ' ' + u); return route.abort(); }
    return route.fallback();
  });
  ctx.on('page', (p) => {
    p.on('pageerror', (e) => ctx.__log.errors.push('pageerror ' + e.message.slice(0, 200)));
    p.on('console', (m) => { if (m.type() === 'error') ctx.__log.errors.push('console ' + m.text().slice(0, 200)); });
    p.on('response', (r) => { if (r.status() >= 400 && r.url().includes('localhost:5000')) ctx.__log.http.push(r.status() + ' ' + r.url()); });
  });
  return ctx;
}

/** Navigation : 'load' puis réseau calme (15 s max) ; un dépassement est journalisé avec les requêtes en vol. */
async function gotoW(page, url) {
  const inflight = new Set();
  const on = (r) => inflight.add(r.url()); const off = (r) => inflight.delete(r.url());
  page.on('request', on); page.on('requestfinished', off); page.on('requestfailed', off);
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
    const ctx = page.context();
    if (ctx.__log) ctx.__log.errors.push('networkidle>15s ' + url + ' en vol: ' + [...inflight].slice(0, 5).join(' '));
  });
  page.off('request', on); page.off('requestfinished', off); page.off('requestfailed', off);
}

async function shot(page, name, full = true) {
  const f = path.join(OUT, name + '.png');
  const vue = full && page.viewportSize().width < 500;
  // Tour 3 : la version « vue » est prise AVANT la pleine page (la pleine page perd la position de défilement).
  if (vue) await page.screenshot({ path: path.join(OUT, name + '-vue.png'), fullPage: false });
  await page.screenshot({ path: f, fullPage: full });
  return f;
}

async function login(page, email) {
  await gotoW(page, BASE + '/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', PW);
  await Promise.all([page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 30000 }).catch(() => {}), page.click('button[type="submit"]')]);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
}

async function axe(page) {
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] })).violations
    .map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes.slice(0, 3).map((x) => x.target.join(' ')) })));
  return r;
}

module.exports = { gotoW, BASE, OUT, WIDTHS, PW, sql, launch, newCtx, shot, login, axe };
