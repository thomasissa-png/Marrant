// 08/11 : « À toi de jouer » des fiches vanne (instance LOCALE, http://localhost:5000 uniquement).
// Lancé par captures.sh avec QA_CAPTURES_JS=captures-vanne.js et AVANT_REF=<commit d'avant>.
// QA_PHASE=avant : le texte part en prop (lisible sans session) ; QA_PHASE=apres : chargé par la route.
// Contrôles : non-fuite (HTML + payload RSC sans session), bloc abonné, bloc non abonné identique.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5000';
const OUT = process.env.QA_OUT;
const PHASE = process.env.QA_PHASE;
const PW = 'QaLocal-2026!';
const F = JSON.parse(fs.readFileSync(process.env.QA_FICHES, 'utf-8'));
const TAILLES = [
  { nom: 'pc-1440', viewport: { width: 1440, height: 900 }, mobile: false },
  { nom: 'mobile-390', viewport: { width: 390, height: 844 }, mobile: true },
];
const URL_VANNE = `/vannes/${F.vanne.id.slice(0, 10)}`;
const ok = (name, pass, detail = '') => console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : ''));
// Extrait témoin : la plus longue suite de mots sans ponctuation (insensible au retraitement typographique).
const temoin = (t) => (t.match(/[A-Za-zÀ-ÿ ]{12,}/g) || [t]).sort((a, b) => b.length - a.length)[0].trim().slice(0, 40);
const TEMOIN = temoin(F.vanne.exercice);
const blocFichier = path.join(path.dirname(process.env.QA_FICHES), 'bloc-gratuit-vanne-%s.html');

async function go(page, url) {
  await page.goto(BASE + url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(600);
}
async function login(page, email) {
  await go(page, '/login?callbackUrl=%2F');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', PW);
  await Promise.all([page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 30000 }).catch(() => {}), page.click('button[type="submit"]')]);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
}
async function pleinePage(page, nom) {
  const vp = page.viewportSize();
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: vp.width, height: h });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, nom + '.png') });
  await page.setViewportSize(vp);
  console.log('CAPTURE ' + nom);
}
// Zone de la fiche autour du bloc : de la section qui précède jusqu'au lien de parcours qui suit.
async function zone(page, nom) {
  const box = await page.evaluate(() => {
    const ancre = document.querySelector('[data-bloc-exercice]') || document.querySelector('main section:last-of-type');
    const els = [ancre && ancre.previousElementSibling, ancre, ancre && ancre.nextElementSibling].filter(Boolean);
    const rs = els.map((e) => e.getBoundingClientRect());
    const top = Math.min(...rs.map((r) => r.top)) - 16, bottom = Math.max(...rs.map((r) => r.bottom)) + 16;
    const r0 = (ancre || document.body).parentElement.getBoundingClientRect();
    return { x: Math.max(0, r0.left - 16), y: top + window.scrollY, width: Math.min(r0.width + 32, window.innerWidth), height: bottom - top };
  });
  await page.evaluate(() => document.querySelectorAll('header, [class*="fixed"], [class*="sticky"]').forEach((el) => { el.style.visibility = 'hidden'; }));
  await page.screenshot({ path: path.join(OUT, nom + '.png'), fullPage: true, clip: box });
  await page.evaluate(() => document.querySelectorAll('header, [class*="fixed"], [class*="sticky"]').forEach((el) => { el.style.visibility = ''; }));
  console.log('CAPTURE ' + nom);
}

(async () => {
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1'] });
  // 1. Sans session : HTML et payload RSC bruts de l'URL canonique, puis la route (401).
  const ctx0 = await browser.newContext();
  const p0 = await ctx0.newPage();
  await p0.goto(BASE + URL_VANNE, { waitUntil: 'load', timeout: 45000 });
  const final = new URL(p0.url()).pathname;
  await ctx0.close();
  const res = await fetch(BASE + final, { redirect: 'manual' });
  const html = await res.text();
  const rsc = await (await fetch(BASE + final, { redirect: 'manual', headers: { RSC: '1' } })).text();
  const dans = [html.includes(TEMOIN) && 'HTML', rsc.includes(TEMOIN) && 'RSC'].filter(Boolean);
  console.log(`INFO ${PHASE} vanne ${res.status} ${final}, témoin « ${TEMOIN} », HTML ${html.length} o, RSC ${rsc.length} o`);
  if (PHASE === 'avant') ok(`avant défaut reproduit : « À toi de jouer » lisible sans session`, dans.length > 0, dans.join(' + '));
  else ok(`apres non-fuite vanne (${res.status})`, res.status === 200 && dans.length === 0, dans.join(' + '));
  if (PHASE === 'apres') {
    const r = await fetch(`${BASE}/api/fiches/exercice?type=vanne&id=${F.vanne.id}`);
    const corps = await r.text();
    ok(`apres route sans session : 401, sans le texte`, r.status === 401 && !corps.includes(TEMOIN), `${r.status} ${r.headers.get('cache-control')}`);
  }

  for (const t of TAILLES) {
    for (const compte of [{ nom: 'premium', email: 'premium@local.test' }, { nom: 'gratuit', email: 'gratuit@local.test' }]) {
      const ctx = await browser.newContext({ viewport: t.viewport, isMobile: t.mobile, hasTouch: t.mobile, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const appels = [];
      const routes = [];
      page.on('request', (r) => { if (/stripe\.com/.test(r.url())) appels.push(r.url()); });
      page.on('response', (r) => { if (r.url().includes('/api/fiches/exercice')) routes.push(r.status()); });
      await login(page, compte.email);
      await go(page, URL_VANNE);
      const bloc = page.locator('[data-bloc-exercice]');
      if (compte.nom === 'premium') await page.getByText('À toi de jouer').first().waitFor({ timeout: 8000 }).catch(() => {});
      const n = await bloc.count();
      const texte = n ? await bloc.first().innerText() : '';
      const nom = `vanne-${PHASE}-${compte.nom}-${t.nom}`;
      if (compte.nom === 'premium') {
        ok(`${nom} exercice affiché sous « À toi de jouer »`, texte.includes('À toi de jouer') && texte.includes(TEMOIN));
        ok(`${nom} aucun bouton dans le bloc abonné`, n > 0 && (await bloc.first().locator('a').count()) === 0);
        if (PHASE === 'apres') ok(`${nom} chargé par la route (200)`, routes.length === 1 && routes[0] === 200, routes.join(','));
      } else {
        const blocHtml = n ? await bloc.first().innerHTML() : '';
        const fichier = blocFichier.replace('%s', t.nom);
        if (PHASE === 'avant') fs.writeFileSync(fichier, blocHtml);
        else if (fs.existsSync(fichier)) { ok(`${nom} bloc d'appel identique à avant`, fs.readFileSync(fichier, 'utf-8') === blocHtml); fs.unlinkSync(fichier); }
        ok(`${nom} bloc d'appel, sans l'exercice`, n === 1 && (await bloc.first().locator('[data-fiche-cta="premium"]').count()) === 1 && !texte.includes(TEMOIN));
        ok(`${nom} aucun appel à la route`, routes.length === 0, routes.join(','));
        await pleinePage(page, nom);
      }
      if (compte.nom === 'premium') await pleinePage(page, nom);
      await zone(page, `${nom}-zone`);
      ok(`${PHASE} ${compte.nom} ${t.nom} aucun appel Stripe`, appels.length === 0, appels.join(' '));
      await ctx.close();
    }
  }
  await browser.close();
})().catch((e) => { console.log('FAIL exception :: ' + e.message); process.exit(1); });
