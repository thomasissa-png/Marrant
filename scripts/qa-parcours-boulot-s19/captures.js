// s19 : captures du parcours Boulot (instance LOCALE, http://localhost:5000 uniquement).
// Modèle : scripts/qa-parcours-storytelling-s18/captures.js.
// Visiteur et Premium, 375 / 768 / 1280 : hub /parcours, page /parcours/boulot, étape 1 (lisible
// par le visiteur), étapes 2 à 6 (aperçu visiteur ; Premium dépliée, une par compte), fin de parcours.
// s19 itération 2 : HTML ISR JavaScript coupé (garde-fou B1 : étape 1 complète, sinon code de sortie 1),
// « Programme » déplié du hub (B2 @design), états N8 @ux en 375 : étape 2 verrouillée par l'ordre conseillé,
// retour d'exercice choisi, étape 1 validée (375 et 1280), quiz visiteur répondu, page haute avec progression,
// erreur de chargement abonné.
// QA_REGRESSION=1 : non-régression des 4 parcours en ligne seulement (voir regression() en bas).
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

/** Rendu itération 4 (point 3) : « N XP gagnés sur T, bonus de fin compris » (0 et 1 au singulier). */
const xpTotal = (steps) => steps.reduce((a, s) => a + (s.moduleXp ?? 20), 0) + 100;
const xpGagnes = (steps, k) => steps.slice(0, k).reduce((a, s) => a + (s.moduleXp ?? 20), 0);
const xpTexte = (g, t) => `${g} XP ${g > 1 ? 'gagnés' : 'gagné'} sur ${t}, bonus de fin compris`;

/** Rendu itération 4 (C @design) : marges haute et basse de la carte de progression (contenu visible). */
async function margesCarte(page) {
  return page.evaluate(() => {
    const barre = document.querySelector('[role="progressbar"]');
    const carte = barre?.closest('div.rounded-lg');
    if (!carte) return null;
    const r = carte.getBoundingClientRect();
    let haut = Infinity, bas = -Infinity;
    const walker = document.createTreeWalker(carte, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const b of range.getClientRects()) { if (b.height) { haut = Math.min(haut, b.top); bas = Math.max(bas, b.bottom); } }
    }
    const pb = barre.getBoundingClientRect();
    haut = Math.min(haut, pb.top);
    return { haut: Math.round(haut - r.top), bas: Math.round(r.bottom - bas) };
  });
}

/** Rendu itération 5 (S15 @ux) : raison du quiz et de l'onboarding vers Boulot, la même pour les 3 réponses. */
const RAISON_BOULOT = "Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un.";

/** Capture d'élément découpée dans la pleine page, en-tête collant neutralisé (comme `shot`). */
async function clipTo(page, dir, nom, loc) {
  await page.addStyleTag({ content: 'header, [data-sticky], .sticky { position: static !important; }' }).catch(() => {});
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(300);
  const box = await loc.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height }; });
  await page.screenshot({ path: path.join(dir, nom + '.png'), fullPage: true, clip: box });
  console.log('CAPTURE ' + (dir === OUT ? '' : 'regression/') + nom + '.png');
}

/** Rendu itération 4 (point 1) : quiz d'orientation de /parcours, « Au boulot… » puis la réponse q2.
 *  Itération 5 : `raison` (S15) contrôlée mot pour mot si fournie, absente sinon. */
async function quizOrientation(browser, w, q2, attendu, nom, dir, raison = null) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await go(page, `${BASE}/parcours`);
  await page.getByRole('button', { name: /Au boulot, en réunion, à la pause/ }).click();
  await page.getByRole('button', { name: q2 }).click();
  await page.waitForTimeout(500);
  const res = page.getByText('Ton point de départ :').first().locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  const t = (await res.innerText().catch(() => '')).replace(/\s+/g, ' ');
  ok(`[quiz ${w}] « Au boulot » + ${q2} : ${attendu}`, t.includes(attendu), t.slice(0, 200));
  if (raison) ok(`[quiz ${w}] « Au boulot » + ${q2} : raison « ${raison.slice(0, 40)}… »`, norm(t).includes(norm(raison)), t.slice(0, 220));
  else ok(`[quiz ${w}] « Au boulot » + ${q2} : pas la raison de Boulot`, !norm(t).includes(norm(RAISON_BOULOT)));
  await clipTo(page, dir, nom, res);
  ok(`[quiz ${w}] aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

/** Rendu itération 5 (N-3 @design, réserve §7 @ux) : icône de « Au boulot » à la Q1, puis l'écran de Q2. */
async function quizQ1Q2(browser, w, icone, dir, prefixe) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await go(page, `${BASE}/parcours`);
  const btn = page.getByRole('button', { name: /Au boulot, en réunion, à la pause/ });
  const ic = (await btn.locator('span[aria-hidden="true"]').first().innerText().catch(() => '')).trim();
  ok(`[quiz ${w}] Q1 : icône de « Au boulot » = ${icone}`, ic.includes(icone) && !(icone === '☕' ? /💼/ : /☕/).test(ic), `icône=${ic}`);
  const carte = (titre) => page.getByRole('heading', { name: titre }).first().locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  await clipTo(page, dir, `${prefixe}-quiz-orientation-q1-icone`, carte('Dans quelle situation tu voudrais être plus drôle ?'));
  await btn.click();
  await page.waitForTimeout(500);
  const q2 = carte("Qu'est-ce qui coince le plus ?");
  const t = (await q2.innerText().catch(() => '')).replace(/\s+/g, ' ');
  ok(`[quiz ${w}] Q2 après « Au boulot » : « Question 2/2 » et les 3 réponses`, /Question 2\/2/.test(t)
    && /rien de drôle à raconter/.test(t) && /quoi répondre sur le moment/.test(t) && /perdu confiance en moi/.test(t), t.slice(0, 220));
  await clipTo(page, dir, `${prefixe}-quiz-orientation-q2-apres-boulot`, q2);
  ok(`[quiz ${w}] Q1, Q2 : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

/** Rendu itération 5 (réserve §7 @ux) : onboarding « Tout ça à la fois » + « Au boulot », résultat. */
async function onboardingToutBoulot(browser, w, email, attendu, raison, dir, nom) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, email);
  await go(page, `${BASE}/onboarding`);
  await page.getByRole('button', { name: /Tout ça à la fois/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Au boulot \/ machine à café/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Parfois ça marche/ }).click();
  const boite = page.getByText('Ton point de départ :').first().locator('xpath=..');
  await boite.waitFor({ timeout: 15000 }).catch(() => {});
  const t = (await boite.innerText().catch(() => '')).replace(/\s+/g, ' ');
  ok(`[onboarding ${w}] « Tout ça à la fois » + « Au boulot » : ${attendu}`, t.includes(attendu)
    && (raison ? norm(t).includes(norm(raison)) : !norm(t).includes(norm(RAISON_BOULOT))), t.slice(0, 220));
  await clipTo(page, dir, nom, boite);
  ok(`[onboarding ${w}] aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

/** Rendu itération 5 (H @design, S17 @ux) : ni « : ; ? ! » » en tête de ligne, ni pronom coupé après « -⁠ ». */
async function typoLignes(loc) {
  return loc.evaluate((root) => {
    const NBSP = String.fromCharCode(0xa0);
    const GLUON = String.fromCharCode(0x2060);
    const res = { tete: [], coupes: [], insecables: 0, gluons: 0 };
    const rect = (n, i) => { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1); return r.getClientRects()[0]; };
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = n.textContent;
      for (let i = 1; i < t.length; i++) {
        if (/[:;?!»]/.test(t[i])) {
          if (t[i - 1] === NBSP) res.insecables++;
          let j = i - 1; while (j >= 0 && /\s/.test(t[j])) j--;
          const a = j >= 0 && rect(n, j); const b = rect(n, i);
          if (a && b && b.top > a.top + 4) res.tete.push(t.slice(Math.max(0, j - 20), i + 8));
        }
        if (t[i] === GLUON && t[i - 1] === '-' && i + 1 < t.length) {
          res.gluons++;
          const a = rect(n, i - 1); const b = rect(n, i + 1);
          if (a && b && b.top > a.top + 4) res.coupes.push(t.slice(Math.max(0, i - 15), i + 6));
        }
      }
    }
    return res;
  });
}

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
/** Rendu itération 3 (N4) : début du repli attendu dans « Version sans risque », étapes 1 à 6. */
const REPLIS = ['Pas de réunion en vue', 'Pas de mail pro à envoyer', 'Pas de couloir aujourd', "Pas d'afterwork à venir",
  'Personne ne te le demande', 'Aucun pot en vue'];
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
  // Rendu itération 3 (S8 @ux) : intro tirée des parcours publiés (0441569), 5 noms avec Boulot.
  ok(`[${role} ${w}] hub : intro « 5 parcours … Machine à Café, Répartie, Confiance, Storytelling et Boulot »`,
    has(txt, '5 parcours pour progresser en humour') && has(txt, 'Machine à Café, Répartie, Confiance, Storytelling et Boulot', 80),
    (txt.replace(/\s+/g, ' ').match(/\d parcours pour progresser.{0,160}/) || [''])[0]);
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
  if (role === 'premium') {
    // Rendu itération 4 (point 3) : compte neuf, « 0 XP gagné sur 700, bonus de fin compris ».
    const attendu = xpTexte(0, xpTotal(DATA.steps));
    const ligneXp = page.getByText(/XP gagnés? sur/).first();
    await ligneXp.waitFor({ timeout: 15000 }).catch(() => {});
    ok(`[premium ${w}] XP avant toute étape : « ${attendu} »`, norm(await ligneXp.innerText().catch(() => '')) === norm(attendu), await ligneXp.innerText().catch(() => 'absent'));
    if (w !== 768) await shot(page, `premium-${w}-carte-progression-0xp`, page.locator('[role="progressbar"]').first().locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]'));
  }
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
  // Rendu itération 3 (N4) : repli dans l'encadré « Version sans risque », coupé sur la dernière question.
  const vsr = e.locator('[data-testid="version-sans-risque"]');
  const vsrTxt = (await vsr.innerText().catch(() => '')).replace(/\s+/g, ' ');
  ok(`[premium ${w}] étape ${k} : encadré « Version sans risque » qui commence par « ${REPLIS[k - 1]} »`,
    (await vsr.count()) === 1 && /^Version sans risque/.test(vsrTxt) && has(vsrTxt.replace(/^Version sans risque/, ''), REPLIS[k - 1], 20), vsrTxt.slice(0, 90));
  // Rendu itération 4 (@copywriter) : étapes 2 et 6, le critère commun sort de l'encadré, sous lui.
  const suite = e.locator('[data-testid="defi-suite"]');
  const suiteTxt = (await suite.innerText().catch(() => '')).replace(/\s+/g, ' ');
  if (k === 2 || k === 6) {
    ok(`[premium ${w}] étape ${k} : critère « C'est … » sous l'encadré, hors de « Version sans risque »`,
      (await suite.count()) === 1 && /^C.est (réussi|gagné)/.test(suiteTxt) && !/C.est (réussi|gagné)/.test(vsrTxt), suiteTxt.slice(0, 90));
  } else {
    ok(`[premium ${w}] étape ${k} : pas de 3e morceau (repli inchangé)`, (await suite.count()) === 0);
  }
  // Rendu itération 5 (S16 @ux) : titre « Version sans risque » en 13 px medium, sous « DÉFI X » en 14 px semi-gras.
  const tailles = await e.evaluate((el) => {
    const cs = (n) => (n ? { px: parseFloat(getComputedStyle(n).fontSize), poids: getComputedStyle(n).fontWeight } : null);
    const vsr = el.querySelector('[data-testid="version-sans-risque"]');
    return { titre: cs(vsr?.querySelector('p')), defi: cs(vsr?.previousElementSibling?.querySelector('strong')) };
  });
  ok(`[premium ${w}] étape ${k} : titre « Version sans risque » en 13 px, plus petit et plus léger que « DÉFI X »`,
    tailles.titre?.px === 13 && !!tailles.defi && tailles.defi.px > tailles.titre.px && Number(tailles.defi.poids) > Number(tailles.titre.poids),
    JSON.stringify(tailles));
  if (k === 2 || k === 6) {
    // Rendu itération 5 (G @design) : le critère se détache du repli (marge plus franche que défi → repli).
    const ecarts = await e.evaluate((el) => {
      const vsr = el.querySelector('[data-testid="version-sans-risque"]');
      const s = el.querySelector('[data-testid="defi-suite"]');
      const defi = vsr?.previousElementSibling;
      if (!vsr || !s || !defi) return null;
      const r = (n) => n.getBoundingClientRect();
      return { defiRepli: Math.round(r(vsr).top - r(defi).bottom), repliCritere: Math.round(r(s).top - r(vsr).bottom), poids: getComputedStyle(s).fontWeight };
    });
    ok(`[premium ${w}] étape ${k} : critère détaché du repli (marge > défi → repli), sans gras`,
      !!ecarts && ecarts.repliCritere > ecarts.defiRepli && Number(ecarts.poids) < 500, JSON.stringify(ecarts));
  }
  const allerDefi = e.getByRole('link', { name: 'Aller au défi' });
  const hLien = await allerDefi.evaluate((el) => el.getBoundingClientRect().height).catch(() => 0);
  ok(`[premium ${w}] étape ${k} : lien « Aller au défi » (cible >= 44 px)`, (await allerDefi.count()) === 1 && hLien >= 44, `hauteur ${hLien}px`);
  // Rendu itération 4 (S13) : blanc visible entre le texte du lien et « Pourquoi cette étape ? ».
  const blanc = await allerDefi.evaluate((el) => {
    const r = document.createRange(); r.selectNodeContents(el);
    const t = r.getBoundingClientRect(); const n = el.nextElementSibling?.getBoundingClientRect();
    return n ? Math.round(n.top - t.bottom) : -1;
  }).catch(() => -1);
  console.log(`INFO [premium ${w}] étape ${k} : blanc sous le texte « Aller au défi » = ${blanc}px`);
  if (w === 375 && k === 3) {
    // Lien cliqué, en-tête collant ACTIF : « Exercice pratique » doit apparaître sous la barre fixe.
    await allerDefi.click();
    await page.waitForTimeout(1000);
    const pos = await page.evaluate((id) => {
      const t = document.getElementById(id)?.getBoundingClientRect().top ?? -1;
      const hd = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
      return { t: Math.round(t), hd: Math.round(hd), hash: location.hash };
    }, `etape-${k}-defi`);
    ok(`[premium ${w}] étape ${k} : après « Aller au défi », « Exercice pratique » sous l'en-tête collant`, pos.t >= pos.hd && pos.t < 260 && pos.hash === `#etape-${k}-defi`, JSON.stringify(pos));
    await viewport(page, `premium-${w}-etape${k}-aller-au-defi`);
  }
  if ((k === 3 || k === 6 || (k === 2 && w === 375)) && w !== 768) {
    await shot(page, `premium-${w}-etape${k}-version-sans-risque`, e.locator(`#etape-${k}-defi`));
  }
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
  // Rendu itération 3 (N2b) : la phrase validée mène à l'étape 3, numéro et titre en second plan.
  const lien = page.locator('[data-testid="lien-prochaine-etape"]');
  const lt = (await lien.innerText().catch(() => '')).replace(/\s+/g, ' ');
  const hl = await lien.evaluate((el) => el.getBoundingClientRect().height).catch(() => 0);
  // Rendu itération 4 (S11) : « Étape 3 · <titre> », point médian, plus de double « : ».
  ok(`[premium ${w}] lien d'étape : « La prochaine étape t'attend. » vers #etape-3, « Étape 3 · ${DATA.steps[2].moduleTitle} », >= 44 px`,
    (await lien.getAttribute('href').catch(() => '')) === '#etape-3' && /La prochaine étape t.attend\./.test(lt)
      && lt.includes('Étape 3 · ') && has(lt, `Étape 3 ${DATA.steps[2].moduleTitle}`) && !/aujourd/i.test(lt) && hl >= 44, `${lt} ; ${hl}px`);
  // Rendu itération 4 (N-a) : la 2e ligne a la couleur de la 1re (lien).
  const couleurs = await lien.evaluate((el) => [...el.querySelectorAll(':scope > span')].map((x) => getComputedStyle(x).color)).catch(() => []);
  ok(`[premium ${w}] lien d'étape : 2e ligne en couleur de lien`, couleurs.length === 2 && couleurs[0] === couleurs[1], couleurs.join(' / '));
  // Rendu itération 4 (point 3) : XP gagnés sur le total (étapes 1 et 2 validées).
  const attendu = xpTexte(xpGagnes(DATA.steps, 2), xpTotal(DATA.steps));
  const ligneXp = page.getByText(/XP gagnés? sur/).first();
  ok(`[premium ${w}] XP : « ${attendu} »`, norm(await ligneXp.innerText().catch(() => '')) === norm(attendu), await ligneXp.innerText().catch(() => 'absent'));
  // Total d'XP : à gauche sous 640 px, à droite au-dessus (S2 @ux).
  const align = await ligneXp.evaluate((el) => getComputedStyle(el).textAlign).catch(() => '?');
  ok(`[premium ${w}] ligne d'XP alignée ${w < 640 ? 'à gauche' : 'à droite'}`, align === (w < 640 ? 'left' : 'right'), align);
  const marges = await margesCarte(page);
  ok(`[premium ${w}] carte de progression : marges haute et basse équilibrées (écart <= 12 px)`, !!marges && Math.abs(marges.haut - marges.bas) <= 12, JSON.stringify(marges));
  await viewport(page, `premium-${w}-page-haut-progression`);
  const carteProg = page.locator('[role="progressbar"]').first().locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]');
  await shot(page, `premium-${w}-carte-progression-en-cours`, carteProg);
  if (w === 375) {
    await lien.click();
    await page.waitForTimeout(1200);
    const pos = await page.evaluate(() => ({
      t: Math.round(document.getElementById('etape-3')?.getBoundingClientRect().top ?? -1),
      hd: Math.round(document.querySelector('header')?.getBoundingClientRect().bottom ?? 0),
      ouverte: document.getElementById('etape-3-entete')?.getAttribute('aria-expanded'),
      focus: document.activeElement?.id,
    }));
    ok(`[premium ${w}] lien d'étape cliqué : étape 3 ouverte, sous l'en-tête collant, focus sur son en-tête`,
      pos.t >= pos.hd && pos.ouverte === 'true' && pos.focus === 'etape-3-entete', JSON.stringify(pos));
    await viewport(page, `premium-${w}-lien-etape-apres-clic`);
  }
  await ctx.close();
}

/** Rendu itération 3 (S6 @ux) : quiz visiteur, une question répondue (mauvaise réponse) et son explication. */
async function quizQuestionRepondue(browser, w) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await go(page, `${BASE}/parcours/boulot`);
  const e = await openStep(page, 1);
  const q = DATA.steps[0].quiz[0];
  const faux = q.options.findIndex((_, i) => i !== q.correctIndex);
  const group = e.locator('[role="group"][aria-labelledby^="quiz-q-"]').first();
  await group.locator('button').nth(faux).click();
  await page.waitForTimeout(600);
  const quiz = e.locator('h4', { hasText: "Petit quiz pour t'entraîner" }).first().locator('xpath=..');
  const qt = (await quiz.innerText().catch(() => '')).replace(/\s+/g, ' ');
  ok(`[visiteur ${w}] quiz : question répondue, « Pas tout à fait », « La bonne réponse : », explication visible`,
    /Pas tout à fait/.test(qt) && /La bonne réponse/.test(qt) && (!q.explanation || has(qt, q.explanation, 30)), qt.slice(0, 220));
  await shot(page, `visiteur-${w}-etape1-quiz-question-repondue`, quiz);
  ok(`[visiteur ${w}] quiz question : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

/** Rendu itération 3 (§4 @ux) : suites de fin avec Boulot publié (build forcé à true). */
async function finAutreParcours(browser, w, email, slug, attendu, nom) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, email);
  await go(page, `${BASE}/parcours/${slug}`);
  const h = page.locator('main h2', { hasText: /terminé/ }).first();
  await h.waitFor({ timeout: 15000 }).catch(() => {});
  const carte = h.locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  const lien = carte.locator('a[href*="?src=suite"]').first();
  await lien.waitFor({ timeout: 15000 }).catch(() => {});
  const href = await lien.getAttribute('href').catch(() => '');
  ok(`[premium ${w}] fin ${slug} (Boulot publié) : suite = ${attendu}`, href === `/parcours/${attendu}?src=suite`, `${href} ; ${(await lien.innerText().catch(() => '')).replace(/\s+/g, ' ')}`);
  await viewport(page, `premium-${w}-${nom}`);
  if (await carte.count()) await shot(page, `premium-${w}-${nom}-carte`, carte);
  ok(`[premium ${w}] fin ${slug} : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
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
  // Rendu itération 3 (S4 @design, S3 @ux) : pas de ligne XP orpheline ; rien de visiteur montré à l'abonné.
  const t = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  ok(`[premium ${w}] erreur : ni ligne d'XP, ni « arrive bientôt », ni « Voir l'offre Premium », ni « Lecture libre »`,
    !/XP au total|XP gagnés? sur/.test(t) && !/arrive bientôt/.test(t) && !/Voir l.offre Premium/.test(t) && !/Lecture libre/.test(t));
  if (await alerte.count()) await shot(page, `premium-${w}-carte-progression-erreur`, alerte.locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]'));
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, `premium-${w}-erreur-chargement-page`);
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

// ---------------------------------------------------------------------------------------------------
// Mode QA_REGRESSION=1 (s19, après 508cd96) : non-régression des 4 parcours EN LIGNE, Boulot inactif
// (BOULOT_PUBLIE = false, état de la prod). 375 et 1280 : hub, page (haut + pleine), étape 1 visiteur,
// étape 2 Premium (compte qui a validé l'étape 1), carte de fin (compte qui a tout validé).
// Comptes : comptes-regression.sh. Sortie : <QA_OUT>/regression/.
const REG_DIR = path.join(OUT, 'regression');
const REG_SEED = require('../../docs/content/parcours-seed.json');
const REG_STORY = require('../../docs/content/parcours-storytelling-s18.json').parcours;
const REG_PARCOURS = ['machine-a-cafe', 'repartie', 'confiance', 'storytelling']
  .map((slug) => (slug === 'storytelling' ? REG_STORY : REG_SEED.find((p) => p.slug === slug)));
const REG_TITRES = Object.fromEntries([...REG_SEED, REG_STORY].map((p) => [p.slug, p.title]));
const TROUS = /\bundefined\b|\bnull\b|\bNaN\b|\[object Object\]/;
/** BR1 a @design : parcours dont l'aperçu de l'étape 2 est capturé déplié (375 et 1280). */
const APERCU_ETAPE2 = ['repartie', 'storytelling'];

/** Aucune chaîne « undefined », « null », « NaN » ou « [object Object] » visible dans la zone. */
async function sansTrou(name, loc) {
  const t = (await loc.innerText().catch(() => '')).replace(/\s+/g, ' ');
  const m = t.match(new RegExp('.{0,50}(' + TROUS.source + ').{0,50}'));
  ok(`${name} : aucune chaîne undefined / null visible`, !m, m ? m[0] : '');
}

async function regShot(page, name, target) {
  const f = path.join(REG_DIR, name + '.png');
  if (target) {
    await page.addStyleTag({ content: 'header, [data-sticky], .sticky { position: static !important; }' }).catch(() => {});
    await target.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);
    const box = await target.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
    });
    await page.screenshot({ path: f, fullPage: true, clip: box });
  } else {
    await page.screenshot({ path: f, fullPage: true });
  }
  console.log('CAPTURE regression/' + path.basename(f));
}

async function regViewport(page, name) {
  await page.screenshot({ path: path.join(REG_DIR, name + '.png') });
  console.log('CAPTURE regression/' + name + '.png');
}

async function regHub(browser, w) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  const res = await go(page, `${BASE}/parcours`);
  const txt = await page.locator('main').innerText().catch(() => '');
  const absents = REG_PARCOURS.filter((p) => !norm(txt).includes(norm(p.title))).map((p) => p.slug);
  ok(`[reg visiteur ${w}] hub /parcours en 200, 4 parcours en ligne présents`, res.status() === 200 && absents.length === 0, `HTTP ${res.status()}${absents.length ? ' ; absents : ' + absents.join(', ') : ''}`);
  ok(`[reg visiteur ${w}] hub : Boulot absent (BOULOT_PUBLIE = false)`, !/Parcours Boulot/.test(txt));
  // Rendu itération 3 (S8 @ux) : intro du hub après 0441569, tirée des 4 parcours publiés (Storytelling compris).
  ok(`[reg visiteur ${w}] hub : intro « 4 parcours … Machine à Café, Répartie, Confiance et Storytelling »`,
    has(txt, '4 parcours pour progresser en humour') && has(txt, 'Machine à Café, Répartie, Confiance et Storytelling', 80) && !/Boulot/.test(txt),
    (txt.replace(/\s+/g, ' ').match(/\d parcours pour progresser.{0,160}/) || [''])[0]);
  await sansTrou(`[reg visiteur ${w}] hub`, page.locator('main'));
  await regViewport(page, `hub-${w}-visiteur-haut`);
  await regShot(page, `hub-${w}-visiteur-page`);
  ok(`[reg visiteur ${w}] hub : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

/** Texte d'une section titrée (h4) de l'étape, titre exclu. */
async function sectionTexte(step, titre) {
  const h = step.locator('h4', { hasText: titre }).first();
  if (!(await h.count()) || !(await h.isVisible())) return '';
  return (await h.locator('xpath=..').innerText()).replace(titre, '').trim();
}

async function regVisiteur(browser, w, p) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  const res = await go(page, `${BASE}/parcours/${p.slug}?src=hub`);
  ok(`[reg ${p.slug} visiteur ${w}] /parcours/${p.slug} en 200`, res.status() === 200, `HTTP ${res.status()}`);
  const h1 = (await page.locator('h1').first().innerText().catch(() => '')).trim();
  ok(`[reg ${p.slug} visiteur ${w}] titre « ${p.title} »`, norm(h1) === norm(p.title), h1);
  await sansTrou(`[reg ${p.slug} visiteur ${w}] page`, page.locator('main'));
  await regViewport(page, `${p.slug}-${w}-visiteur-page-haut`);
  await regShot(page, `${p.slug}-${w}-visiteur-page`);
  const e1 = await openStep(page, 1);
  const conseil = await sectionTexte(e1, 'Le conseil');
  const defi = await sectionTexte(e1, 'Exercice pratique');
  ok(`[reg ${p.slug} visiteur ${w}] étape 1 : conseil et défi visibles`, conseil.length > 20 && defi.length > 20,
    `conseil=${conseil.length} car. ; défi=${defi.length} car.`);
  ok(`[reg ${p.slug} visiteur ${w}] étape 1 : titre « ${p.steps[0].moduleTitle.slice(0, 40)} »`, has(await e1.innerText(), p.steps[0].moduleTitle));
  await sansTrou(`[reg ${p.slug} visiteur ${w}] étape 1`, e1);
  await waitThumbs(page, e1);
  await regShot(page, `${p.slug}-${w}-visiteur-etape1`, e1);
  if (APERCU_ETAPE2.includes(p.slug) && w !== 768) {
    // BR1 a @design : aperçu verrouillé de l'étape 2 déplié (scène au corps de l'étape ouverte, N4), bouton plein.
    const e2 = await openStep(page, 2);
    const t2 = await e2.innerText();
    const offre = e2.getByRole('link', { name: /Voir l'offre Premium/ });
    const h = await offre.first().evaluate((el) => el.getBoundingClientRect().height).catch(() => 0);
    ok(`[reg ${p.slug} visiteur ${w}] étape 2 dépliée : aperçu (scène, « Fait partie de Premium »), « Voir l'offre Premium » >= 44 px, ni vannes ni quiz`,
      has(t2, p.steps[1].moduleTitle) && /Fait partie de Premium/.test(t2) && (await offre.count()) > 0 && h >= 44
        && (await e2.locator('[role="group"][aria-labelledby^="quiz-q-"]').count()) === 0, `bouton ${h}px`);
    await sansTrou(`[reg ${p.slug} visiteur ${w}] étape 2`, e2);
    await regShot(page, `${p.slug}-${w}-visiteur-apercu-etape2`, e2);
  }
  ok(`[reg ${p.slug} visiteur ${w}] aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

async function regPremium(browser, w, p) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, `qa-r2-${p.slug}-${w}@local.test`);
  const res = await go(page, `${BASE}/parcours/${p.slug}`);
  ok(`[reg ${p.slug} premium ${w}] /parcours/${p.slug} en 200`, res.status() === 200, `HTTP ${res.status()}`);
  if (w === 375) {
    // BR1 b @design : haut de page en cours de parcours (étape 1 validée il y a 7 jours) ; N2b : lien d'étape.
    await page.getByText(new RegExp(`1/${p.steps.length} étapes complétées`)).first().waitFor({ timeout: 15000 }).catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const lien = page.locator('[data-testid="lien-prochaine-etape"]');
    const lt = (await lien.innerText().catch(() => '')).replace(/\s+/g, ' ');
    const ordre = await page.evaluate(() => {
      const prog = [...document.querySelectorAll('main h2')].find((h) => h.textContent.trim() === 'Le programme');
      const pq = document.getElementById('parcours-pour-qui');
      return { programme: Math.round(prog?.getBoundingClientRect().top ?? -1), pourQui: Math.round(pq?.getBoundingClientRect().top ?? -1) };
    });
    ok(`[reg ${p.slug} premium ${w}] haut de page en cours : 1/${p.steps.length}, lien « Étape 2 · ${p.steps[1].moduleTitle.slice(0, 30)} » vers #etape-2, argumentaire après le programme`,
      (await lien.getAttribute('href').catch(() => '')) === '#etape-2' && lt.includes('Étape 2 · ') && has(lt, `Étape 2 ${p.steps[1].moduleTitle}`)
        && ordre.pourQui > ordre.programme, `${lt} ; ${JSON.stringify(ordre)}`);
    // Rendu itération 4 (point 3) : étape 1 validée.
    const attendu = xpTexte(xpGagnes(p.steps, 1), xpTotal(p.steps));
    const ligneXp = page.getByText(/XP gagnés? sur/).first();
    ok(`[reg ${p.slug} premium ${w}] XP en cours : « ${attendu} »`, norm(await ligneXp.innerText().catch(() => '')) === norm(attendu), await ligneXp.innerText().catch(() => 'absent'));
    const marges = await margesCarte(page);
    ok(`[reg ${p.slug} premium ${w}] carte de progression : marges équilibrées (écart <= 12 px)`, !!marges && Math.abs(marges.haut - marges.bas) <= 12, JSON.stringify(marges));
    await regViewport(page, `${p.slug}-${w}-premium-page-haut`);
    await regShot(page, `${p.slug}-${w}-premium-carte-progression-en-cours`, page.locator('[role="progressbar"]').first().locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]'));
  }
  const k = p.steps.findIndex((s) => !s.free) + 1;
  const s = p.steps[k - 1];
  const e = await openStep(page, k);
  await e.getByText(new RegExp(s.jokeContents[0].slice(0, 12).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s'))).first()
    .waitFor({ timeout: 15000 }).catch(() => {});
  const t = await e.innerText();
  const vannes = s.jokeContents.filter((c) => has(t, c, 30)).length;
  ok(`[reg ${p.slug} premium ${w}] étape ${k} (1re Premium) : titre, ${vannes}/${s.jokeContents.length} vannes, quiz`, has(t, s.moduleTitle)
    && vannes === s.jokeContents.length && (await e.locator('[role="group"][aria-labelledby^="quiz-q-"]').count()) > 0);
  await sansTrou(`[reg ${p.slug} premium ${w}] étape ${k}`, e);
  // Rendu itération 4 (point 4) : « DÉFI X » en gras, exemple en paragraphes ; rien de Boulot.
  const exo = e.locator('h4', { hasText: 'Exercice pratique' }).first().locator('xpath=..');
  const gras = (await exo.locator('strong').first().innerText().catch(() => '')).trim();
  const exemple = e.locator('h4', { hasText: 'Exemple concret' }).first().locator('xpath=..');
  const paras = await exemple.locator('div > p').count();
  ok(`[reg ${p.slug} premium ${w}] étape ${k} : défi « ${gras || 'sans libellé'} » en gras, exemple en ${paras} paragraphe(s), ni « Version sans risque » ni « Aller au défi »`,
    /^DÉFI /.test(gras) && paras >= 1 && (await e.locator('[data-testid="version-sans-risque"]').count()) === 0
      && (await e.getByRole('link', { name: 'Aller au défi' }).count()) === 0, `gras=${gras} ; paragraphes=${paras}`);
  if (p.slug !== 'storytelling') {
    // Zone « Exemple concret » jusqu'au bas de « Exercice pratique » (défi et « Alors, ce défi ? » compris).
    await page.addStyleTag({ content: 'header, [data-sticky], .sticky { position: static !important; }' }).catch(() => {});
    await exo.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);
    const b = async (l) => l.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, bas: r.bottom + window.scrollY }; });
    const a = await b(exemple); const z = await b(exo);
    await page.screenshot({ path: path.join(REG_DIR, `${p.slug}-${w}-premium-etape${k}-exemple-defi.png`), fullPage: true,
      clip: { x: Math.min(a.x, z.x), y: a.y, width: Math.max(a.w, z.w), height: z.bas - a.y } });
    console.log(`CAPTURE regression/${p.slug}-${w}-premium-etape${k}-exemple-defi.png`);
  }
  // Rendu itération 5 (H @design, S17 @ux) : typographie française sur les 4 parcours en ligne, mesurée ligne à ligne.
  const typo = await typoLignes(e);
  ok(`[reg ${p.slug} premium ${w}] étape ${k} : typographie, aucun « : ; ? ! » » en tête de ligne, aucun pronom coupé`,
    typo.tete.length === 0 && typo.coupes.length === 0,
    `insécables=${typo.insecables} gluons=${typo.gluons} tête=${JSON.stringify(typo.tete)} coupes=${JSON.stringify(typo.coupes)}`);
  const NBSP = String.fromCharCode(0xa0); const GLUON = String.fromCharCode(0x2060);
  const brut = await e.evaluate((el) => el.textContent);
  if (p.slug === 'machine-a-cafe') {
    ok(`[reg ${p.slug} premium ${w}] étape ${k} : « tu ne dis rien : tu laisses » et « très calme : » liés par une insécable`,
      brut.includes(`tu ne dis rien${NBSP}: tu laisses`) && brut.includes(`très calme${NBSP}:`));
  }
  if (p.slug === 'confiance') {
    ok(`[reg ${p.slug} premium ${w}] étape ${k} : « réécris-le » et « Écris-le » protégés (gluon)`,
      brut.includes(`réécris-${GLUON}le`) && brut.includes(`Écris-${GLUON}le`));
  }
  if (w === 375 && (p.slug === 'machine-a-cafe' || p.slug === 'confiance')) {
    // Du « Conseil » au bas de « Exercice pratique » : tous les textes touchés par la typographie à l'étape 2.
    const conseil = e.locator('h4', { hasText: 'Le conseil' }).first().locator('xpath=..');
    await page.addStyleTag({ content: 'header, [data-sticky], .sticky { position: static !important; }' }).catch(() => {});
    await exo.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);
    const b = async (l) => l.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, bas: r.bottom + window.scrollY }; });
    const a = await b((await conseil.count()) ? conseil : exemple); const z = await b(exo);
    await page.screenshot({ path: path.join(REG_DIR, `${p.slug}-${w}-premium-etape${k}-typographie.png`), fullPage: true,
      clip: { x: Math.min(a.x, z.x), y: a.y, width: Math.max(a.w, z.w), height: z.bas - a.y } });
    console.log(`CAPTURE regression/${p.slug}-${w}-premium-etape${k}-typographie.png`);
  }
  await waitThumbs(page, e);
  await regShot(page, `${p.slug}-${w}-premium-etape${k}`, e);
  ok(`[reg ${p.slug} premium ${w}] aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

async function regFin(browser, w, p) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, `qa-rfin-${p.slug}@local.test`);
  await go(page, `${BASE}/parcours/${p.slug}`);
  const h = page.locator('main h2', { hasText: /terminé/ }).first();
  await h.waitFor({ timeout: 15000 }).catch(() => {});
  const carte = h.locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
  const txt = (await carte.innerText().catch(() => '')).replace(/\s+/g, ' ');
  const suite = REG_TITRES[p.nextParcours] || p.nextParcours;
  ok(`[reg ${p.slug} premium ${w}] fin : carte « terminé », XP, suite proposée`, /terminé/.test(txt) && /\d+ XP/.test(txt) && /Parcours /.test(txt),
    `suite attendue (seed) : ${suite} ; carte : ${txt.slice(0, 300)}`);
  if (await carte.count()) await sansTrou(`[reg ${p.slug} premium ${w}] fin`, carte);
  await regViewport(page, `${p.slug}-${w}-premium-fin`);
  if (await carte.count()) await regShot(page, `${p.slug}-${w}-premium-fin-carte`, carte);
  ok(`[reg ${p.slug} premium ${w}] fin : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

/** Rendu itération 4 (point 3, S10) : carte de progression d'un parcours en ligne, à 0 XP puis en erreur. */
async function regCarteProgression(browser, w, p) {
  const ctx = await ctxFor(browser, w);
  const page = await ctx.newPage();
  await login(page, `qa-r0-${w}@local.test`);
  await go(page, `${BASE}/parcours/${p.slug}`);
  const attendu = xpTexte(0, xpTotal(p.steps));
  const ligneXp = page.getByText(/XP gagnés? sur/).first();
  await ligneXp.waitFor({ timeout: 15000 }).catch(() => {});
  ok(`[reg ${p.slug} premium ${w}] XP avant toute étape : « ${attendu} »`, norm(await ligneXp.innerText().catch(() => '')) === norm(attendu), await ligneXp.innerText().catch(() => 'absent'));
  await page.evaluate(() => window.scrollTo(0, 0));
  await regShot(page, `${p.slug}-${w}-premium-carte-progression-0xp`, page.locator('[role="progressbar"]').first().locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]'));
  if (w === 375) {
    await page.route('**/api/parcours/by-slug/**', (r) => r.abort());
    await go(page, `${BASE}/parcours/${p.slug}`);
    const alerte = page.locator('[role="alert"]').filter({ hasText: /Réessayer/ }).first();
    await alerte.waitFor({ timeout: 15000 }).catch(() => {});
    const t = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
    ok(`[reg ${p.slug} premium ${w}] erreur de chargement : alerte, ni ligne d'XP ni « arrive bientôt »`,
      (await alerte.count()) > 0 && !/XP gagnés? sur/.test(t) && !/arrive bientôt/.test(t), (t.match(/.{0,40}arrive bientôt.{0,20}/) || [''])[0]);
    if (await alerte.count()) await regShot(page, `${p.slug}-${w}-premium-carte-progression-erreur`, alerte.locator('xpath=ancestor::div[contains(@class,"rounded-lg")][1]'));
    await regShot(page, `${p.slug}-${w}-premium-erreur-chargement-page`);
  }
  ok(`[reg ${p.slug} premium ${w}] carte de progression : aucune erreur JS`, ctx.__errors.length === 0, ctx.__errors.join(' | '));
  await ctx.close();
}

async function regression() {
  fs.mkdirSync(REG_DIR, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  // Rendu itération 4 (point 1) : Boulot masqué, « Au boulot » ne change rien (comportement d'avant).
  for (const [q2, attendu, nom] of [[/rien de drôle à raconter/, 'Parcours Machine à Café', 'raconter'],
    [/quoi répondre sur le moment/, 'Parcours Répartie', 'repondre'], [/perdu confiance en moi/, 'Parcours Confiance', 'confiance']]) {
    await quizOrientation(browser, 375, q2, attendu, `quiz-orientation-375-boulot-masque-${nom}`, REG_DIR);
  }
  // Rendu itération 5 : Boulot masqué, l'icône reste ☕ et l'onboarding « Tout ça » + « Au boulot » reste Machine à Café.
  await quizQ1Q2(browser, 375, '☕', REG_DIR, 'quiz-375-boulot-masque');
  await onboardingToutBoulot(browser, 375, 'qa-r0-375@local.test', 'Parcours Machine à Café', null, REG_DIR, 'onboarding-375-tout-boulot-masque-resultat');
  for (const w of [375, 1280]) await regCarteProgression(browser, w, REG_PARCOURS.find((p) => p.slug === 'repartie'));
  for (const w of [375, 1280]) {
    await regHub(browser, w);
    for (const p of REG_PARCOURS) {
      await regVisiteur(browser, w, p);
      await regPremium(browser, w, p);
      await regFin(browser, w, p);
    }
  }
  // Rendu itération 3 (S9 @ux) : page visiteur des 4 parcours en 768.
  for (const p of REG_PARCOURS) await regVisiteur(browser, 768, p);
  await browser.close();
}

if (process.env.QA_REGRESSION === '1') {
  regression().catch((e) => { console.log('FAIL exception ' + e.message); process.exit(1); });
} else (async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const w of WIDTHS) {
    await htmlIsr(browser, w);
    if (w !== 768) await hautProgression(browser, w);
    if (w === 375) {
      await erreurChargement(browser, w);
      await quizQuestionRepondue(browser, w);
      // §4 @ux : Machine à Café finie, Boulot publié = Boulot ; Machine à Café puis Storytelling finis = Répartie.
      await finAutreParcours(browser, w, 'qa-bmac@local.test', 'machine-a-cafe', 'boulot', 'fin-machine-a-cafe-boulot-publie');
      await finAutreParcours(browser, w, 'qa-bmacstory@local.test', 'storytelling', 'repartie', 'fin-storytelling-apres-machine-a-cafe');
      // Rendu itération 4 (point 1) : Boulot publié, « Au boulot » mène à Boulot quelle que soit la 2e réponse.
      // Itération 5 : raison S15 identique pour les 3, icône 💼 (N-3), écran de Q2, onboarding « Tout ça » + « Au boulot ».
      ok('[quiz] la raison de Boulot est la fin de la description validée de la fiche', DATA.description.endsWith(RAISON_BOULOT));
      await quizQ1Q2(browser, w, '💼', OUT, `visiteur-${w}`);
      for (const [q2, nom] of [[/rien de drôle à raconter/, 'raconter'], [/quoi répondre sur le moment/, 'repondre'], [/perdu confiance en moi/, 'confiance']]) {
        await quizOrientation(browser, w, q2, 'Parcours Boulot', `visiteur-${w}-quiz-orientation-boulot-${nom}`, OUT, RAISON_BOULOT);
      }
      await onboardingToutBoulot(browser, w, `qa-b${w}@local.test`, 'Parcours Boulot', RAISON_BOULOT, OUT, `premium-${w}-onboarding-tout-boulot-resultat`);
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
