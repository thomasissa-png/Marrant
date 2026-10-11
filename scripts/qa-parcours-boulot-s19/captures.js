// s19 : captures du parcours Boulot (instance LOCALE, http://localhost:5000 uniquement).
// Modèle : scripts/qa-parcours-storytelling-s18/captures.js.
// Visiteur et Premium, 375 / 768 / 1280 : hub /parcours, page /parcours/boulot, étape 1 (lisible
// par le visiteur), étapes 2 à 6 (aperçu visiteur ; Premium dépliée, une par compte), fin de parcours.
// s19 itération 2 : HTML ISR JavaScript coupé (garde-fou B1 : étape 1 complète, sinon code de sortie 1),
// « Programme » déplié du hub (B2 @design), états N8 @ux en 375 : étape 2 verrouillée par l'ordre conseillé,
// retour d'exercice choisi, étape 1 validée (375 et 1280), quiz visiteur répondu, page haute avec progression,
// erreur de chargement abonné.
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

/** s19 itération 2 : capture de la zone qui va du haut du premier élément au bas du dernier. */
async function shotZone(page, name, first, last) {
  await page.addStyleTag({ content: 'header, [data-sticky], .sticky { position: static !important; }' }).catch(() => {});
  await last.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(300);
  const box = async (l) => l.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, bottom: r.bottom + window.scrollY };
  });
  const a = await box(first);
  const b = await box(last);
  const x = Math.min(a.x, b.x);
  await page.screenshot({
    path: path.join(OUT, name + '.png'), fullPage: true,
    clip: { x, y: a.y, width: Math.max(a.x + a.width, b.x + b.width) - x, height: b.bottom - a.y },
  });
  console.log('CAPTURE ' + name + '.png');
}

async function playQuiz(card) {
  for (let i = 0; i < 6; i++) {
    const group = card.locator('[role="group"][aria-labelledby^="quiz-q-"]');
    if (!(await group.count())) break;
    await group.locator('button').first().click();
    await card.getByRole('button', { name: /Question suivante|Voir le résultat/ }).click();
  }
  const cont = card.getByRole('button', { name: 'Continuer' });
  if (await cont.count()) await cont.click();
}

/** Garde-fou B1 (rendu itération 1) : l'étape 1 lue par le visiteur porte le conseil, l'exemple et le défi. */
const BLOCS_ETAPE1 = ['Le conseil', 'Exemple concret', 'Exercice pratique', 'Alors, ce défi ?'];
const CONSEIL1 = require('../../docs/content/parcours-boulot-s19.json')._meta.conseils.find((c) => c.etape === 1);
function etape1Complete(t) {
  const manque = BLOCS_ETAPE1.filter((b) => !t.includes(b));
  if (!has(t, CONSEIL1.exercise, 60)) manque.push('texte du défi');
  if (!has(t, CONSEIL1.example, 40)) manque.push("texte de l'exemple");
  return manque;
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
  if (role === 'visiteur' && (await carte.count())) {
    // B2 @design (itération 1) : « Programme » de la carte Boulot déplié (3e rendu du moduleDetail).
    await carte.locator('summary').first().click();
    await page.waitForTimeout(500);
    const prog = (await carte.locator('details').first().innerText()).replace(/\s+/g, ' ');
    const debord = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`[${role} ${w}] hub : Programme Boulot déplié (6 étapes, Format, XP), aucun débordement horizontal`,
      (prog.match(/Étape \d/g) || []).length === 6 && /Format\s?:/.test(prog) && /\+\d+ XP/.test(prog) && debord <= 0,
      `étapes=${(prog.match(/Étape \d/g) || []).length} débord=${debord}px`);
    await shot(page, `${role}-${w}-hub-programme-boulot`, carte);
  }
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
  // Garde-fou B1 : conseil, exemple, défi et « Alors, ce défi ? » visibles (visiteur et Premium).
  const manque = etape1Complete(t1);
  ok(`[${role} ${w}] étape 1 complète : conseil, exemple, défi TRACE, « Alors, ce défi ? »`, manque.length === 0, manque.length ? 'manque : ' + manque.join(', ') : '');
  if (manque.length) process.exitCode = 1;
  if (role === 'visiteur') {
    const fin1 = await e1.getByRole('link', { name: /Voir l'offre Premium/ }).count();
    ok(`[visiteur ${w}] étape 1 : bouton « Voir l'offre Premium » en bas`, fin1 > 0);
  }
  await waitThumbs(page, e1);
  await shot(page, `${role}-${w}-etape1`, e1);
  if (role === 'premium' && w === 375) {
    // N8 @ux : étape 2 verrouillée par l'ordre conseillé (étape 1 pas encore validée).
    await shot(page, `premium-${w}-etape2-ordre-conseille`, page.locator('#etape-2'));
    // N8 @ux : retour d'exercice choisi et sa réponse.
    await e1.getByRole('button', { name: 'Essayé, ça a marché' }).click();
    await page.waitForTimeout(1200);
    const exo = e1.locator('h4', { hasText: 'Exercice pratique' }).first().locator('xpath=..');
    ok(`[premium ${w}] retour d'exercice : bouton sélectionné et réponse affichée`,
      (await e1.getByRole('button', { name: 'Essayé, ça a marché' }).getAttribute('aria-pressed')) === 'true'
      && /Bien joué/.test(await exo.innerText()));
    await shot(page, `premium-${w}-retour-exercice`, exo);
  }
  if (role === 'premium' && w !== 768) {
    // N8 @ux : validation de l'étape 1, gain d'XP et prochaine étape conseillée.
    await playQuiz(e1);
    await e1.getByRole('button', { name: 'Valider cette étape' }).click();
    await page.locator('#etape-1 [data-testid="etape-resultat"]').filter({ hasText: /XP/ }).waitFor({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const res1 = (await page.locator('#etape-1').innerText()).replace(/\s+/g, ' ');
    ok(`[premium ${w}] étape 1 validée : gain d'XP affiché`, /\+50 XP/.test(res1), res1.match(/.{0,80}XP.{0,140}/)?.[0] ?? '');
    await shot(page, `premium-${w}-etape1-apres-validation`, page.locator('#etape-1'));
  }
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
    if (w === 375) {
      // N8 @ux : quiz visiteur répondu (résultat, « Refaire le quiz »), puis l'offre sous le quiz.
      const e = await openStep(page, 1);
      await playQuiz(e);
      await page.waitForTimeout(800);
      const quiz = e.locator('h4', { hasText: "Petit quiz pour t'entraîner" }).first().locator('xpath=..');
      const qt = await quiz.innerText().catch(() => '');
      ok(`[visiteur ${w}] quiz répondu : résultat et « Refaire le quiz »`, /Refaire le quiz/.test(qt), qt.replace(/\s+/g, ' ').slice(-160));
      await shotZone(page, `visiteur-${w}-etape1-quiz-repondu`, quiz, e.getByRole('link', { name: /Voir l'offre Premium/ }).last());
    }
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

/** B1 : HTML ISR tel que servi (JavaScript coupé) : source (base ou repli seed) et étape 1 complète. */
async function htmlIsr(browser, w) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, javaScriptEnabled: false });
  await ctx.route('**/*', (r) => (/^http:\/\/(localhost|127\.0\.0\.1):5000/.test(r.request().url()) ? r.fallback() : r.abort()));
  const page = await ctx.newPage();
  const res = await page.goto(`${BASE}/parcours/boulot`, { waitUntil: 'load', timeout: 45000 });
  const html = await res.text();
  const source = html.includes('seed-boulot') ? 'repli seed (seed-boulot)' : 'base (identifiant réel)';
  console.log(`INFO [html ${w}] page construite sur : ${source}`);
  const manque = etape1Complete(await page.locator('#etape-1').innerText());
  ok(`[html ${w}] HTML ISR, JavaScript coupé : étape 1 complète`, manque.length === 0, `${source}${manque.length ? ' ; manque : ' + manque.join(', ') : ''}`);
  if (manque.length) process.exitCode = 1;
  await ctx.close();
}

/** N8 @ux : page haute Premium avec progression (2/6 validées, prochaine étape conseillée). */
async function hautProgression(browser, w) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, `qa-b3-${w}@local.test`);
  await go(page, `${BASE}/parcours/boulot`);
  await page.getByText(/2\/6 étapes complétées/).first().waitFor({ timeout: 15000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  const t = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  ok(`[premium ${w}] page haute avec progression : 2/6 et rythme affichés`, /2\/6 étapes complétées/.test(t), (t.match(/.{0,60}2\/6.{0,160}/) || [''])[0]);
  await viewport(page, `premium-${w}-page-haut-progression`);
  await ctx.close();
}

/** N8 @ux : erreur de chargement abonné (API coupée pour ce contexte seulement). */
async function erreurChargement(browser, w) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, `qa-b4-${w}@local.test`);
  await page.route('**/api/parcours/by-slug/**', (r) => r.abort());
  await go(page, `${BASE}/parcours/boulot`);
  const alerte = page.locator('[role="alert"]').filter({ hasText: /Réessayer/ }).first();
  await alerte.waitFor({ timeout: 15000 }).catch(() => {});
  ok(`[premium ${w}] erreur de chargement : alerte et « Réessayer »`, (await alerte.count()) > 0);
  if (await alerte.count()) {
    await alerte.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(300);
  }
  await viewport(page, `premium-${w}-erreur-chargement`);
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
    await htmlIsr(browser, w);
    if (w === 375) {
      await hautProgression(browser, w);
      await erreurChargement(browser, w);
    }
    await hub(browser, w, 'visiteur', null);
    await hub(browser, w, 'premium', `qa-b${w}@local.test`);
    await page1(browser, w, 'visiteur', null);
    await page1(browser, w, 'premium', `qa-b${w}@local.test`);
    for (let k = 2; k <= 6; k++) await etapePremium(browser, w, k);
    await fin(browser, w);
  }
  await browser.close();
})().catch((e) => { console.log('FAIL exception ' + e.message); process.exit(1); });
