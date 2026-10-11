// s19 : captures du parcours Boulot (instance LOCALE, http://localhost:5000 uniquement).
// Modèle : scripts/qa-parcours-storytelling-s18/captures.js.
// Visiteur et Premium, 375 / 768 / 1280 : hub /parcours, page /parcours/boulot, étape 1 (lisible
// par le visiteur), étapes 2 à 6 (aperçu visiteur ; Premium dépliée, une par compte), fin de parcours.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5000';
const OUT = process.env.QA_OUT;
const WIDTHS = [375, 768, 1280];
const PW = 'QaLocal-2026!';
const DATA = require('../../docs/content/parcours-boulot-s19.json').parcours;
fs.mkdirSync(OUT, { recursive: true });
const ok = (name, pass, detail = '') => console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : ''));
// Comparaison insensible à la typographie (frTypo : espaces insécables, apostrophes courbes).
const norm = (s) => s.normalize('NFC').toLowerCase().replace(/[^a-z0-9àâäçéèêëîïôöùûüÿœ]/g, '');
const has = (txt, s, n = 40) => norm(txt).includes(norm(s).slice(0, n));

let n = 0;
async function ctxFor(browser, w) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: w < 500 ? 812 : w < 1000 ? 1024 : 900 },
    deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500, locale: 'fr-FR', timezoneId: 'Europe/Paris',
    extraHTTPHeaders: { 'cf-connecting-ip': `10.97.${w % 256}.${++n}` },
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
    await page.waitForTimeout(300);
    // Découpe d'une capture pleine page : `target.screenshot()` en émulation mobile (375) laissait une
    // bande noire en bas des éléments moins hauts que la fenêtre (bouton Premium masqué, run 2).
    const box = await target.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
    });
    await page.screenshot({ path: f, fullPage: true, clip: box });
  } else {
    await page.screenshot({ path: f, fullPage: true });
  }
  console.log('CAPTURE ' + path.basename(f));
}

async function viewport(page, name) {
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  console.log('CAPTURE ' + name + '.png');
}

/** Chaque miniature vidéo de la zone est chargée avant la capture (chargement différé). */
async function waitThumbs(page, target) {
  const imgs = target.locator('img');
  for (let i = 0; i < (await imgs.count()); i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded().catch(() => {});
    await imgs.nth(i).evaluate((el) => el.complete || new Promise((res) => { el.onload = res; el.onerror = res; setTimeout(res, 8000); })).catch(() => {});
  }
}

async function openStep(page, k) {
  const head = page.locator(`#etape-${k}-entete`);
  if ((await head.getAttribute('aria-expanded')) !== 'true') await head.click();
  await page.waitForTimeout(1200);
  return page.locator(`#etape-${k}`);
}

async function videosVisibles(el, step) {
  let c = 0;
  for (const v of step.videos) if (await el.locator(`[src*="${v.youtubeId}"], [srcset*="${v.youtubeId}"], [data-youtube-id="${v.youtubeId}"]`).count()) c++;
  return c;
}

async function hub(browser, w, role, email) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  if (email) await login(page, email);
  const res = await go(page, `${BASE}/parcours`);
  const txt = await page.locator('main').innerText().catch(() => '');
  ok(`[${role} ${w}] hub /parcours en 200, Boulot présent`, res.status() === 200 && /Boulot/.test(txt), `HTTP ${res.status()}`);
  ok(`[${role} ${w}] hub : « 5 parcours » si le compte est affiché`, !/\b4 parcours\b/.test(txt), (txt.match(/.{0,30}\d parcours.{0,30}/) || [''])[0]);
  await viewport(page, `${role}-${w}-hub-haut`);
  await shot(page, `${role}-${w}-hub`);
  const carte = page.locator('main h2, main h3', { hasText: /Parcours Boulot/ }).first().locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  if (await carte.count()) await shot(page, `${role}-${w}-hub-carte-boulot`, carte);
  else ok(`[${role} ${w}] hub : carte Boulot trouvée`, false);
  ok(`[${role} ${w}] hub : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

async function page1(browser, w, role, email) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  if (email) await login(page, email);
  const res = await go(page, `${BASE}/parcours/boulot?src=hub`);
  ok(`[${role} ${w}] /parcours/boulot en 200`, res.status() === 200, `HTTP ${res.status()}`);
  const h1 = (await page.locator('h1').first().innerText()).trim();
  ok(`[${role} ${w}] titre « ${DATA.title} »`, norm(h1) === norm(DATA.title), h1);
  await viewport(page, `${role}-${w}-page-haut`);
  await shot(page, `${role}-${w}-page`);
  const e1 = await openStep(page, 1);
  const t1 = await e1.innerText();
  // Visiteur : étape 1 en lecture libre (scène, conseil, défi, vidéos, quiz) ; les vannes restent Premium (StepJokes).
  const vannes1 = role === 'premium' ? has(t1, DATA.steps[0].jokeContents[0], 30) : /vannes choisies pour cette étape t.attendent avec Premium/.test(t1);
  ok(`[${role} ${w}] étape 1 lisible : titre, ${role === 'premium' ? 'vannes' : 'encart vannes Premium'}, quiz`, has(t1, DATA.steps[0].moduleTitle) && vannes1
    && (await e1.locator('[role="group"][aria-labelledby^="quiz-q-"]').count()) > 0);
  ok(`[${role} ${w}] étape 1 : ${DATA.steps[0].videos.length} vidéo(s)`, (await videosVisibles(e1, DATA.steps[0])) === DATA.steps[0].videos.length);
  await waitThumbs(page, e1);
  await shot(page, `${role}-${w}-etape1`, e1);
  if (role === 'visiteur') {
    for (let k = 2; k <= 6; k++) {
      const e = await openStep(page, k);
      const t = await e.innerText();
      const s = DATA.steps[k - 1];
      ok(`[visiteur ${w}] étape ${k} : aperçu seul (ni vannes ni quiz)`, !has(t, s.jokeContents[0], 30)
        && (await e.locator('[role="group"][aria-labelledby^="quiz-q-"]').count()) === 0);
      await shot(page, `visiteur-${w}-etape${k}-apercu`, e);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await viewport(page, `visiteur-${w}-fin-de-page`);
  }
  ok(`[${role} ${w}] aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

/** Premium : étape k dépliée, sur un compte qui a validé les étapes 1 à k-1 (blocage s16). */
async function etapePremium(browser, w, k) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, `qa-b${k}-${w}@local.test`);
  await go(page, `${BASE}/parcours/boulot`);
  const e = await openStep(page, k);
  const s = DATA.steps[k - 1];
  await e.getByText(new RegExp(s.jokeContents[0].slice(0, 12).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s'))).first()
    .waitFor({ timeout: 15000 }).catch(() => {});
  const t = await e.innerText();
  const vannes = s.jokeContents.filter((c) => has(t, c, 30)).length;
  ok(`[premium ${w}] étape ${k} : titre, ${vannes}/${s.jokeContents.length} vannes, quiz`, has(t, s.moduleTitle)
    && vannes === s.jokeContents.length && (await e.locator('[role="group"][aria-labelledby^="quiz-q-"]').count()) > 0);
  ok(`[premium ${w}] étape ${k} : ${s.videos.length} vidéo(s)`, (await videosVisibles(e, s)) === s.videos.length);
  await waitThumbs(page, e);
  await shot(page, `premium-${w}-etape${k}`, e);
  ok(`[premium ${w}] étape ${k} : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

async function fin(browser, w) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, 'qa-bfin@local.test');
  await go(page, `${BASE}/parcours/boulot`);
  await page.waitForTimeout(1500);
  const h = page.locator('main h2', { hasText: /terminé/ }).first();
  const carte = h.locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  const txt = (await carte.innerText().catch(() => '')).replace(/\s+/g, ' ');
  // 600 XP d'étapes + bonus de fin = 700 (même total que « 700 XP à gagner » du hub).
  ok(`[premium ${w}] fin : carte « terminé », 700 XP bonus compris, suite proposée`, /terminé/.test(txt) && /\b700 XP\b/.test(txt) && /Storytelling/.test(txt), txt.slice(0, 400));
  await viewport(page, `premium-${w}-fin-parcours`);
  if (await carte.count()) await shot(page, `premium-${w}-fin-parcours-carte`, carte);
  ok(`[premium ${w}] fin : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const w of WIDTHS) {
    await hub(browser, w, 'visiteur', null);
    await hub(browser, w, 'premium', `qa-b${w}@local.test`);
    await page1(browser, w, 'visiteur', null);
    await page1(browser, w, 'premium', `qa-b${w}@local.test`);
    for (let k = 2; k <= 6; k++) await etapePremium(browser, w, k);
    await fin(browser, w);
  }
  await browser.close();
})().catch((e) => { console.log('FAIL exception ' + e.message); process.exit(1); });
