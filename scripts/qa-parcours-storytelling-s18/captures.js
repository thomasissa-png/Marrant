// s18 : captures du parcours Storytelling (instance LOCALE, http://localhost:5000 uniquement).
// Visiteur et Premium, 375 / 768 / 1280 : page, étape 1, étape 5, fin de parcours.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5000';
const OUT = process.env.QA_OUT;
const WIDTHS = [375, 768, 1280];
const PW = 'QaLocal-2026!';
fs.mkdirSync(OUT, { recursive: true });
const ok = (name, pass, detail = '') => console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : ''));

let n = 0;
async function ctxFor(browser, w) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: w < 500 ? 812 : w < 1000 ? 1024 : 900 },
    deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500, locale: 'fr-FR', timezoneId: 'Europe/Paris',
    extraHTTPHeaders: { 'cf-connecting-ip': `10.98.${w % 256}.${++n}` },
  });
  ctx.__errors = [];
  await ctx.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith('http://localhost:5000') || u.startsWith('http://127.0.0.1:5000') || u.startsWith('data:') || u.startsWith('blob:')) return route.fallback();
    if (/umami/i.test(u)) return route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.umami={track:function(){}};' });
    return route.abort();
  });
  ctx.on('page', (p) => p.on('pageerror', (e) => ctx.__errors.push(e.message.slice(0, 160))));
  return ctx;
}

async function go(page, url) {
  const res = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(600);
  return res;
}

async function login(page, email) {
  await go(page, BASE + '/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', PW);
  await Promise.all([page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 30000 }).catch(() => {}), page.click('button[type="submit"]')]);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
}

async function shot(page, name, target) {
  const f = path.join(OUT, name + '.png');
  if (target) {
    // En-tête collant neutralisé le temps de la capture d'élément (sinon il apparaît au milieu de l'image).
    await page.addStyleTag({ content: 'header, [data-sticky], .sticky { position: static !important; }' }).catch(() => {});
    await target.scrollIntoViewIfNeeded().catch(() => {});
    await target.screenshot({ path: f });
  } else {
    await page.screenshot({ path: f, fullPage: true });
  }
  console.log('CAPTURE ' + path.basename(f));
}

async function openStep(page, k) {
  const head = page.locator(`#etape-${k}-entete`);
  if ((await head.getAttribute('aria-expanded')) !== 'true') await head.click();
  await page.waitForTimeout(1200);
  return page.locator(`#etape-${k}`);
}

async function parcours(browser, w, role, email, emailEtape5) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  if (email) await login(page, email);
  const res = await go(page, `${BASE}/parcours/storytelling?src=quiz`);
  ok(`[${role} ${w}] /parcours/storytelling en 200`, res.status() === 200, `HTTP ${res.status()}`);
  const h1 = (await page.locator('h1').first().innerText()).trim();
  ok(`[${role} ${w}] titre « Parcours Storytelling »`, h1 === 'Parcours Storytelling', h1);
  await page.screenshot({ path: path.join(OUT, `${role}-${w}-page-haut.png`) });
  await shot(page, `${role}-${w}-page`);
  const e1 = await openStep(page, 1);
  const t1 = await e1.innerText();
  ok(`[${role} ${w}] étape 1 : titre et défi COUPE`, /Ton anecdote, coupée au plus court/.test(t1) && /DÉFI COUPE/.test(t1));
  await shot(page, `${role}-${w}-etape1`, e1);
  if (emailEtape5) {
    // Premium : l'étape 5 s'ouvre après l'étape 4 (blocage s16) : compte qui a validé 1 à 4.
    await ctx.clearCookies();
    await login(page, emailEtape5);
    await go(page, `${BASE}/parcours/storytelling`);
  }
  const e5 = await openStep(page, 5);
  if (role === 'premium') await e5.getByText(/Parenthèse\s:\sun pigeon/).first().waitFor({ timeout: 15000 }).catch(() => {});
  const t5 = await e5.innerText();
  if (role === 'visiteur') ok(`[${role} ${w}] étape 5 : aperçu seul (ni défi ni vannes)`, !/DÉFI TIROIR|Parenthèse\s:/.test(t5));
  else ok(`[${role} ${w}] étape 5 : défi TIROIR et vannes neuves`, /DÉFI TIROIR/.test(t5) && /Parenthèse\s:\sun pigeon/.test(t5), `${(t5.match(/Parenthèse\s:/g) || []).length} tiroirs`);
  await shot(page, `${role}-${w}-etape5`, e5);
  if (role === 'premium') {
    // étapes 3 et 6 contrôlées sur le compte qui a fini (voir fin()).
  } else {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, `${role}-${w}-fin-de-page.png`) });
    console.log(`CAPTURE ${role}-${w}-fin-de-page.png`);
  }
  ok(`[${role} ${w}] aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

async function fin(browser, w) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, 'qa-fin@local.test');
  await go(page, `${BASE}/parcours/storytelling`);
  await page.waitForTimeout(1500);
  const h = page.locator('main h2', { hasText: /terminé/ }).first();
  const carte = h.locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  const txt = (await carte.innerText().catch(() => '')).replace(/\s+/g, ' ');
  ok(`[premium ${w}] fin : carte « terminé », 800 XP, suite proposée`, /terminé/.test(txt) && /800/.test(txt) && /Machine à Café/.test(txt), txt.slice(0, 220));
  await page.screenshot({ path: path.join(OUT, `premium-${w}-fin-parcours.png`) });
  console.log(`CAPTURE premium-${w}-fin-parcours.png`);
  await shot(page, `premium-${w}-fin-parcours-carte`, carte);
  const e3 = await openStep(page, 3);
  const t3 = await e3.innerText();
  ok(`[premium ${w}] étape 3 : repli solo et phrase de protection`, /Personne ce soir \?/.test(t3) && /jamais une blessure récente/.test(t3));
  const e6 = await openStep(page, 6);
  const t6 = await e6.innerText();
  ok(`[premium ${w}] étape 6 : défi SOIRÉE puis défi de l'anecdote`, /DÉFI SOIRÉE/.test(t6) && /Tu travailles ton anecdote du parcours Storytelling/.test(t6));
  if (w === 1280) await shot(page, `premium-${w}-etape6`, e6);
  ok(`[premium ${w}] fin : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const w of WIDTHS) {
    await parcours(browser, w, 'visiteur', null);
    await parcours(browser, w, 'premium', `qa-s${w}@local.test`, `qa-e5-${w}@local.test`);
    await fin(browser, w);
  }
  await browser.close();
})().catch((e) => { console.log('FAIL exception ' + e.message); process.exit(1); });
