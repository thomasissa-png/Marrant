// s23 : captures des fiches conseil et vidéo (instance LOCALE, http://localhost:5000 uniquement).
// QA_PHASE=avant : code d'avant la correction (l'abonné ne voit rien) ; QA_PHASE=apres : correction.
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
const FICHES = [
  { type: 'conseil', url: `/conseils/${F.conseil.id.slice(0, 10)}`, exercice: F.conseil.exercice, points: [] },
  { type: 'video', url: `/videos/${F.video.id.slice(0, 10)}`, exercice: F.video.exercice, points: F.video.points },
];
const ok = (name, pass, detail = '') => console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : ''));
// Extrait témoin : la plus longue suite de mots sans ponctuation (insensible au retraitement typographique).
const temoin = (t) => (t.match(/[A-Za-zÀ-ÿ ]{12,}/g) || [t]).sort((a, b) => b.length - a.length)[0].trim().slice(0, 40);
const blocFichier = path.join(path.dirname(process.env.QA_FICHES), 'bloc-gratuit-%s.html');

// URL canonique lue par le navigateur (le shortId seul redirige), puis HTML et payload RSC bruts.
async function fuite(browser, url, textes) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: 'load', timeout: 45000 });
  const final = new URL(page.url()).pathname;
  await ctx.close();
  const res = await fetch(BASE + final, { redirect: 'manual' });
  const html = await res.text();
  const rsc = await (await fetch(BASE + final, { redirect: 'manual', headers: { RSC: '1' } })).text();
  return { statut: res.status, final, trouves: textes.filter((t) => html.includes(t) || rsc.includes(t)) };
}
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
    const prev = ancre && ancre.previousElementSibling;
    const next = ancre && ancre.nextElementSibling;
    const els = [prev, ancre, next].filter(Boolean);
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
  // 1. Non-fuite, sans session : ni l'exercice ni les points clés dans le HTML ou le payload RSC.
  for (const f of FICHES) {
    const r = await fuite(browser, f.url, [f.exercice, ...f.points].map(temoin));
    ok(`${PHASE} non-fuite ${f.type} (${r.statut} ${r.final})`, r.statut === 200 && r.trouves.length === 0, r.trouves.join(' / '));
  }
  const rv = await fuite(browser, `/vannes/${F.vanne.id.slice(0, 10)}`, [temoin(F.vanne.exercice)]);
  console.log(`INFO ${PHASE} vanne (${rv.statut}) : « À toi de jouer » ${rv.trouves.length ? 'PRÉSENT' : 'absent'} dans le HTML/RSC sans session (hors périmètre, signalé)`);

  for (const t of TAILLES) {
    for (const compte of [{ nom: 'premium', email: 'premium@local.test' }, { nom: 'gratuit', email: 'gratuit@local.test' }]) {
      const ctx = await browser.newContext({ viewport: t.viewport, isMobile: t.mobile, hasTouch: t.mobile, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const appels = [];
      page.on('request', (r) => { if (/stripe\.com/.test(r.url())) appels.push(r.url()); });
      await login(page, compte.email);
      for (const f of FICHES) {
        await go(page, f.url);
        const bloc = page.locator('[data-bloc-exercice]');
        if (compte.nom === 'premium') await bloc.first().waitFor({ timeout: PHASE === 'apres' ? 8000 : 2000 }).catch(() => {});
        const n = await bloc.count();
        const texte = n ? await bloc.first().innerText() : '';
        const nom = `${PHASE}-${compte.nom}-${f.type}-${t.nom}`;
        if (compte.nom === 'premium' && PHASE === 'avant') ok(`${nom} défaut reproduit : aucun bloc`, n === 0);
        if (compte.nom === 'premium' && PHASE === 'apres') {
          ok(`${nom} exercice affiché`, texte.includes('À toi de jouer') && texte.includes(temoin(f.exercice)));
          if (f.type === 'video') ok(`${nom} points clés affichés`, texte.includes('Les points clés') && f.points.every((p) => texte.includes(temoin(p))));
          ok(`${nom} aucun bouton dans le bloc abonné`, (await bloc.first().locator('a').count()) === 0);
        }
        if (compte.nom === 'gratuit') {
          const html = await bloc.first().innerHTML();
          const fichier = blocFichier.replace('%s', `${f.type}-${t.nom}`);
          if (PHASE === 'avant') fs.writeFileSync(fichier, html);
          else if (fs.existsSync(fichier)) { ok(`${nom} bloc d'appel identique à avant`, fs.readFileSync(fichier, 'utf-8') === html); fs.unlinkSync(fichier); }
          ok(`${nom} bloc d'appel, ni exercice ni points clés`, (await bloc.first().locator('[data-fiche-cta="premium"]').count()) === 1
            && !texte.includes(temoin(f.exercice)) && (await page.locator('[data-points-cles]').count()) === 0);
        }
        if (compte.nom === 'premium') await pleinePage(page, nom);
        await zone(page, `${nom}-zone`);
      }
      ok(`${PHASE} ${compte.nom} ${t.nom} aucun appel Stripe`, appels.length === 0, appels.join(' '));
      await ctx.close();
    }
  }
  await browser.close();
})().catch((e) => { console.log('FAIL exception :: ' + e.message); process.exit(1); });
