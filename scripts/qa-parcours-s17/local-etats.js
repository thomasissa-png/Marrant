// Tour 2 (DES-1-10, UXV-1-10) : états supplémentaires. À lancer APRÈS local-premium.js
// (réutilise qa-p768 = Confiance 2/6 et qa-conf = Confiance terminé). Instance LOCALE uniquement.
const { BASE, sql, launch, newCtx, shot, login, gotoW } = require('./local-common');
const seed = require('/home/user/Marrant/docs/content/parcours-seed.json');
const R = { checks: [], logs: {} };
const ok = (name, pass, detail = '') => { R.checks.push({ name, pass, detail }); console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : '')); };
// Tour 2 : le résultat (XP + date conseillée) vit dans la carte validée.
const RES = (n) => `#etape-${n} [data-testid="etape-resultat"]`;
const xpOf = (email) => Number(sql(`select xp from "User" where email='${email}'`));
const wrongIndex = (slug, step, q) => (seed.find((p) => p.slug === slug).steps[step - 1].quiz[q].correctIndex + 1) % 4;
const step = async (label, fn) => { try { await fn(); } catch (e) { ok(`étape de script « ${label} »`, false, e.message.split('\n').slice(0, 6).join(' | ').slice(0, 400)); } };
/** Clic souris sur l'interrupteur : la piste visible (l'input role=switch est sr-only). */
async function clicSwitch(sec) {
  // Clic humain dans le label, au niveau de la piste (x=20 px) : la pastille et la piste sont dans le label,
  // donc aucun « intercepts pointer events ». Plus de repli forcé (il pouvait rater le label).
  const lab = sec.locator('label:has([role="switch"])');
  const b = await lab.boundingBox();
  await lab.click({ position: { x: 20, y: Math.round(b.height / 2) }, timeout: 10000 });
}

/** Capture serrée d'un élément (marge autour), cadrage stable. */
async function clip(page, locator, name, pad = 24) {
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate((el) => { el.scrollIntoView({ block: 'center', behavior: 'instant' }); });
  await page.waitForTimeout(250);
  const b = await locator.boundingBox();
  if (!b) throw new Error('élément invisible pour ' + name);
  const vp = page.viewportSize();
  const x = Math.max(0, b.x - pad); const y = Math.max(0, b.y - pad);
  await page.screenshot({ path: `${require('./local-common').OUT}/${name}.png`, clip: { x, y, width: Math.min(vp.width - x, b.width + 2 * pad), height: Math.min(vp.height - y, b.height + 2 * pad) } });
}

/** Focus clavier réel (Tab) jusqu'à l'élément visé : déclenche :focus-visible. */
async function tabTo(page, locator, max = 120) {
  const handle = await locator.elementHandle();
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate((el) => document.activeElement === el, handle)) return true;
  }
  throw new Error('focus clavier jamais atteint');
}

/** Tour 3 : parcours terminé rechargé, la carte de fin doit arriver juste sous l'en-tête (sans défiler). */
async function finSousEntete(page) {
  await page.waitForTimeout(1200);
  return page.evaluate(() => {
    const h = [...document.querySelectorAll('main h2')].find((x) => /^Parcours .+ terminé$/.test((x.textContent || '').trim()));
    const hdr = document.querySelector('header');
    if (!h) return { ok: false, detail: 'carte de fin absente' };
    const card = h.closest('[class*="rounded"]') || h;
    const top = Math.round(card.getBoundingClientRect().top);
    const bas = hdr ? Math.round(hdr.getBoundingClientRect().bottom) : 0;
    // Critère : carte de fin visible à l'arrivée (haut < 60 % de la fenêtre) et placée AVANT « Pour qui ? » (DES-2-11).
    const pq = [...document.querySelectorAll('main h2, main h3')].find((x) => /^Pour qui/.test((x.textContent || '').trim()));
    const avantPourQui = !pq || !!(card.compareDocumentPosition(pq) & Node.DOCUMENT_POSITION_FOLLOWING);
    return { ok: top >= bas - 1 && top < window.innerHeight * 0.6 && avantPourQui, detail: `haut de la carte=${top}px (fenêtre ${window.innerHeight}px), bas de l'en-tête=${bas}px, avant « Pour qui ? »=${avantPourQui}` };
  });
}

/** Tour 4 (DES-3-02, UXV-3-02) : survol réel. On cadre D'ABORD (défilement), souris garée, capture « -repos »,
 *  puis hover() sans défilement, 300 ms, capture au même cadrage. Le changement de style est mesuré et noté. */
async function pairSurvol(page, cible, cadre, nom, pad = 16, styleDe = null) {
  await cadre.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(300);
  await page.mouse.move(1, 1);
  await page.waitForTimeout(300);
  const b = await cadre.boundingBox();
  const vp = page.viewportSize();
  const x = Math.max(0, b.x - pad); const y = Math.max(0, b.y - pad);
  const zone = { x, y, width: Math.min(vp.width - x, b.width + 2 * pad), height: Math.min(vp.height - y, b.height + 2 * pad) };
  const mesure = styleDe || cible;
  const lire = () => mesure.evaluate((el) => { const c = getComputedStyle(el); return [c.backgroundColor, c.borderColor, c.color, c.boxShadow, c.outlineColor, c.textDecorationLine].join(' | '); });
  const avant = await lire();
  await page.screenshot({ path: `${require('./local-common').OUT}/${nom}-repos.png`, clip: zone });
  await cible.hover(); // élément déjà à l'écran : aucun défilement
  await page.waitForTimeout(300);
  const apres = await lire();
  const b2 = await cadre.boundingBox();
  const bouge = Math.abs(b2.y - b.y) > 1;
  await page.screenshot({ path: `${require('./local-common').OUT}/${nom}.png`, clip: zone });
  ok(`survol ${nom} : style modifié au survol (souris posée, 300 ms)`, avant !== apres && !bouge, `avant=${avant} || après=${apres}${bouge ? ' || ATTENTION : la page a défilé' : ''}`);
  await page.mouse.move(1, 1);
}

/** Tour 4 (DES-3-03) : cadrage « barre de progression entièrement sous l'en-tête + carte de l'étape ». */
async function cadreProgression(page) {
  const r = await page.evaluate(() => {
    const hdr = document.querySelector('header'); const hb = hdr ? hdr.getBoundingClientRect().bottom : 0;
    // Repère de la CARTE DE PROGRESSION (pas le squelette d'une carte d'étape) : texte « N/M étapes complétées »,
    // sinon le squelette de progression, sinon le texte d'échec de la carte de progression.
    const feuilles = [...document.querySelectorAll('main p, main span, main div')].filter((e) => e.children.length === 0);
    const marque = feuilles.find((e) => /étapes complétées/.test(e.textContent || ''))
      || document.querySelector('main [data-testid="progression-squelette"]')
      || feuilles.find((e) => /Tes étapes n.ont pas voulu se charger/.test(e.textContent || ''));
    const carte = marque ? (marque.closest('[class*="rounded-xl"]') || marque.closest('[class*="rounded"]') || marque) : null;
    if (!carte) return { ok: false, detail: 'carte de progression introuvable' };
    window.scrollBy({ top: carte.getBoundingClientRect().top - hb - 12, behavior: 'instant' });
    const c = carte.getBoundingClientRect();
    const e2 = document.querySelector('#etape-2-entete');
    const e2b = e2 ? e2.getBoundingClientRect() : null;
    return { ok: c.top >= hb - 1 && c.bottom <= window.innerHeight && !!e2b && e2b.top >= hb && e2b.bottom <= window.innerHeight,
      detail: `barre ${Math.round(c.top)}-${Math.round(c.bottom)}px, en-tête fixe ${Math.round(hb)}px, en-tête étape 2 ${e2b ? Math.round(e2b.top) + '-' + Math.round(e2b.bottom) : 'absent'}px, fenêtre ${window.innerHeight}px` };
  });
  await page.waitForTimeout(300);
  return r;
}

/** Nombre de boutons « Réessayer » affichés dans la page (rendus et non masqués), et dans la fenêtre. */
const compteReessayer = (page) => page.evaluate(() => {
  const bs = [...document.querySelectorAll('main button')].filter((b) => /Réessayer/.test(b.textContent || '') && b.getClientRects().length > 0 && getComputedStyle(b).visibility !== 'hidden');
  const vue = bs.filter((b) => { const r = b.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; });
  return { page: bs.length, vue: vue.length };
});

async function finishQuiz(card) {
  for (let i = 0; i < 6; i++) {
    const g = card.locator('[role="group"][aria-labelledby^="quiz-q-"]');
    if (!(await g.count())) break;
    await g.locator('button').first().click();
    await card.getByRole('button', { name: /Question suivante|Voir le résultat/ }).click();
  }
  const c = card.getByRole('button', { name: 'Continuer' });
  if (await c.count()) await c.click();
}

async function openStep(page, n) {
  const head = page.locator(`#etape-${n}-entete`);
  if ((await head.getAttribute('aria-expanded')) !== 'true') await head.click();
  const card = page.locator(`#etape-${n}`);
  await card.getByText(/Vannes à pratiquer|Valider cette étape|Termine le quiz/).first().waitFor({ timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(300);
  return card;
}

async function validate(page, card, n) {
  await card.getByRole('button', { name: 'Valider cette étape' }).click();
  await page.locator(RES(n)).filter({ hasText: /XP/ }).waitFor({ timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
}

/** Parcours complet ; captures `p-<w>-<slug>-etapeN-…` si capture=true, fin + rechargement si end=true. */
async function runPath(page, w, email, slug, opts = {}) {
  const { capture = true, end = true, endName = `${slug}-fin-bilan`, wrongFirst = false } = opts;
  const n = seed.find((p) => p.slug === slug).steps.length;
  const xp0 = xpOf(email);
  const expected = seed.find((p) => p.slug === slug).steps.reduce((s, x) => s + (x.moduleXp || 0), 0) + 100;
  await gotoW(page, `${BASE}/parcours/${slug}`);
  for (let i = 1; i <= n; i++) {
    const card = await openStep(page, i);
    if (wrongFirst && i === 1 && capture) {
      const g = card.locator('[role="group"][aria-labelledby^="quiz-q-"]');
      await g.locator('button').nth(wrongIndex(slug, 1, 0)).click();
      await card.locator('[role="status"][aria-live="polite"]').first().evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(250);
      await shot(page, `p-${w}-${slug}-quiz-mauvaise-reponse`, false);
      await card.getByRole('button', { name: /Question suivante|Voir le résultat/ }).click();
    }
    const retour = card.locator(`[role="group"][aria-labelledby="retour-${i}"] button`);
    if (await retour.count()) await retour.nth(i % 3).click();
    await finishQuiz(card);
    if (capture) {
      // Tour 3 (UXV-2-06) : la version « vue » est cadrée sur « Valider cette étape ».
      await card.getByRole('button', { name: 'Valider cette étape' }).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })).catch(() => {});
      await page.waitForTimeout(250);
      await shot(page, `p-${w}-${slug}-etape${i}-avant-validation`);
    }
    await validate(page, card, i);
    const body = await page.locator('main').innerText();
    if (i < n) ok(`[${w}] ${slug} étape ${i} : pas de « Parcours terminé ! » avant la fin`, !/Parcours terminé/.test(body));
    if (capture) {
      await shot(page, `p-${w}-${slug}-etape${i}-apres-validation-vue`, false);
      await page.locator(`#etape-${i}`).evaluate((el) => { el.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy({ top: -90, behavior: 'instant' }); }).catch(() => {});
      await page.waitForTimeout(250);
      await shot(page, `p-${w}-${slug}-etape${i}-apres-validation`, false);
    }
    await page.waitForTimeout(6500); // rythme humain (message 6 s, limite 10 validations/min)
  }
  ok(`[${w}] ${slug} : +${expected} XP en base`, xpOf(email) - xp0 === expected, `delta=${xpOf(email) - xp0}`);
  if (end) {
    const fin = page.getByRole('heading', { level: 2, name: /^Parcours .+ terminé$/ });
    ok(`[${w}] ${slug} : carte de fin sans recharger`, await fin.isVisible().catch(() => false));
    await fin.evaluate((el) => { el.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy({ top: -100, behavior: 'instant' }); }).catch(() => {});
    await page.waitForTimeout(300);
    await shot(page, `p-${w}-${endName}`, false);
    if (capture) {
      await shot(page, `p-${w}-${slug}-fin-pleine-page`);
      await gotoW(page, page.url());
      const fsE = await finSousEntete(page);
      ok(`[${w}] ${slug} terminé rechargé : carte de fin visible à l'arrivée, avant « Pour qui ? »`, fsE.ok, fsE.detail);
      await shot(page, `p-${w}-${slug}-termine-apres-rechargement`);
    }
  }
}

(async () => {
  const browser = await launch();

  // 1. Visiteur : mauvaise réponse, aperçu verrouillé de près (DPR 2), survol du bouton principal
  for (const w of [375, 1280]) {
    await step(`visiteur ${w}`, async () => {
      const ctx = await newCtx(browser, w);
      const page = await ctx.newPage();
      await gotoW(page, `${BASE}/parcours/repartie`);
      const c1 = page.locator('#etape-1');
      const g = c1.locator('[role="group"][aria-labelledby^="quiz-q-"]');
      await g.locator('button').nth(wrongIndex('repartie', 1, 0)).click();
      const st = c1.locator('[role="status"][aria-live="polite"]').first();
      ok(`[${w}] visiteur : mauvaise réponse corrigée (bonne réponse donnée)`, /La [ABCD]/.test(await st.innerText()), (await st.innerText()).replace(/\s+/g, ' ').slice(0, 100));
      await st.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(250);
      await shot(page, `v-${w}-repartie-quiz-mauvaise-reponse`, false);
      if (w === 1280) {
        const offre = c1.getByRole('link', { name: "Voir l'offre Premium" }).first();
        await pairSurvol(page, offre, offre, 'v-1280-survol-voir-offre', 40);
      }
      R.logs['v' + w] = ctx.__log;
      await ctx.close();
      const ctx2 = await newCtx(browser, w, { deviceScaleFactor: 2 });
      const p2 = await ctx2.newPage();
      await gotoW(p2, `${BASE}/parcours/repartie`);
      await p2.locator('#etape-2-entete').click();
      await p2.waitForTimeout(500);
      await clip(p2, p2.locator('#etape-2'), `v-${w}-apercu-verrouille-zoom`, 12);
      await ctx2.close();
    });
  }

  /** Tour 3 (UXV-2-01/06, DES-2-09) : sur un compte dont l'étape 1 est validée, à la largeur w :
   *  chargement lent (≥ 3 s) et échec du chargement de l'étape 2 cadrés sur la carte, réessai,
   *  puis échec de la VALIDATION (POST bloqué), message, quiz conservé, nouvelle tentative. */
  async function chargementEchec(page, w, email) {
    const by = '**/api/parcours/by-slug/**';
    const etat = () => page.evaluate(() => {
      const main = document.querySelector('main');
      const t = main ? main.innerText : '';
      const vis = (el) => { const b = el.getBoundingClientRect(); return b.height > 0 && b.bottom > 0 && b.top < window.innerHeight; };
      const retry = [...document.querySelectorAll('main button')].find((b) => /Réessayer/.test(b.textContent || ''));
      return {
        busy: document.querySelectorAll('main [aria-busy="true"]').length,
        squelette: document.querySelectorAll('main [data-testid*="squelette"], main .animate-pulse').length,
        zero: /\b0\s*\/\s*\d+ étapes/.test(t), faux: (t.match(/Termine l.étape 1 pour débloquer/g) || []).length,
        verrous: (t.match(/Termine l.étape \d pour débloquer/g) || []).length,
        progression: (t.match(/\d+\s*\/\s*\d+ étapes complétées/) || [''])[0],
        alertes: [...document.querySelectorAll('main [role="alert"]')].filter(vis).map((a) => a.innerText.replace(/\s+/g, ' ').slice(0, 120)),
        retry: !!retry, retryVu: !!retry && vis(retry), retryH: retry ? Math.round(retry.getBoundingClientRect().height) : 0,
      };
    });
    const cadreCarte = async () => {
      await page.evaluate(() => {
        const cible = document.querySelector('#etape-2') || document.querySelector('main [aria-busy="true"]');
        if (cible) { cible.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy({ top: -100, behavior: 'instant' }); }
      });
      await page.waitForTimeout(300);
    };
    // a) chargement : requête retenue 6 s (≥ 3 s), captures à 1,5 s
    await page.route(by, async (route) => { await new Promise((r) => setTimeout(r, 6000)); return route.fallback(); });
    await page.goto('about:blank'); // vrai rechargement (un changement d'ancre seul ne recharge pas)
    await page.goto(`${BASE}/parcours/repartie#etape-2`, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    let e = await etat();
    ok(`[${w}] chargement : aria-busy présent`, e.busy > 0, `aria-busy=${e.busy}`);
    ok(`[${w}] chargement : squelette affiché`, e.squelette > 0, `squelettes=${e.squelette}`);
    ok(`[${w}] chargement : ni « 0/N » ni faux verrou (étape 1 validée)`, !e.zero && e.faux === 0, `0/N=${e.zero} faux verrous=${e.faux}`);
    const cp1 = await cadreProgression(page);
    ok(`[${w}] cadrage chargement : barre « N/4 » entière sous l'en-tête + en-tête de l'étape 2`, cp1.ok, cp1.detail);
    await shot(page, `p-${w}-etape-chargement`, false);
    if (await page.locator('#etape-2').count()) await clip(page, page.locator('#etape-2'), `p-${w}-etape-chargement-carte`, 12).catch(() => {});
    ok(`[${w}] chargement (progression connue) : progression gardée affichée`, /^1\s*\/\s*4/.test(e.progression), e.progression || 'aucune');
    await page.waitForTimeout(5000);
    // a2) progression inconnue : stockage du navigateur vidé (session gardée) -> barre grise neutre, aucun verrou
    await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch {} });
    await page.goto('about:blank');
    await page.goto(`${BASE}/parcours/repartie#etape-2`, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    e = await etat();
    ok(`[${w}] progression inconnue : squelette neutre, ni « N/4 » ni « 0/4 »`, e.squelette > 0 && !e.progression && !e.zero, `squelettes=${e.squelette} progression=${e.progression || 'aucune'}`);
    ok(`[${w}] progression inconnue : aucun verrou`, e.verrous === 0, `verrous=${e.verrous}`);
    const cp2 = await cadreProgression(page);
    ok(`[${w}] cadrage progression inconnue : barre grise entière sous l'en-tête + en-tête de l'étape 2`, cp2.ok, cp2.detail);
    await shot(page, `p-${w}-etape-chargement-inconnue`, false);
    await page.waitForTimeout(5000);
    await page.unroute(by);
    // b) échec du chargement : requête bloquée (progression connue, remise en cache par le chargement ci-dessus)
    await page.route(by, (route) => route.abort('failed'));
    await page.goto('about:blank');
    await page.goto(`${BASE}/parcours/repartie#etape-2`, { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Réessayer' }).first().waitFor({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500); // laisse le défilement vers l'ancre se faire, comme pour un humain
    // Mesure à l'ARRIVÉE (aucun défilement de notre part) : c'est ce que voit l'abonné venu par « Reprendre » ou l'e-mail
    // Lisible = entièrement sous l'en-tête fixe et dans la fenêtre (un liseré sous l'en-tête ne compte pas).
    const arrivee = await page.evaluate(() => {
      const hdr = document.querySelector('header'); const top = hdr ? hdr.getBoundingClientRect().bottom : 0;
      const lisible = (el) => { if (!el) return false; const b = el.getBoundingClientRect(); return b.height > 0 && b.top >= top - 1 && b.bottom <= window.innerHeight; };
      const textes = [...document.querySelectorAll('main p, main div')].filter((el) => el.children.length === 0 || el.getAttribute('role') === 'alert');
      const echec = textes.find((el) => /n'a pas voulu se charger|n.ont pas voulu se charger/.test(el.textContent || '') && lisible(el));
      const intacte = [...document.querySelectorAll('main *')].find((el) => el.children.length === 0 && /Ta progression est intacte/.test(el.textContent || ''));
      const retry = [...document.querySelectorAll('main button')].find((b) => /Réessayer/.test(b.textContent || '') && lisible(b));
      return { echec: echec ? (echec.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) : '', retry: !!retry, intacte: lisible(intacte) };
    });
    ok(`[${w}] échec du chargement, arrivée par #etape-2 : message d'échec et « Réessayer » lisibles sans défiler`, !!arrivee.echec && arrivee.retry, `message=« ${arrivee.echec || 'aucun'} » réessayer=${arrivee.retry}`);
    ok(`[${w}] échec du chargement, arrivée par #etape-2 : « Ta progression est intacte. » lisible sans défiler (info UX)`, arrivee.intacte, `intacte lisible=${arrivee.intacte}`);
    const intacteCarte = /Ta progression est intacte/.test(await page.locator('#etape-2').innerText().catch(() => ''));
    ok(`[${w}] échec, arrivée par #etape-2 : « Ta progression est intacte. » dans la carte de l'étape`, intacteCarte, '');
    const nR = await compteReessayer(page);
    console.log(`REESSAYER [${w}] boutons « Réessayer » affichés : ${nR.page} dans la page, ${nR.vue} dans la fenêtre`);
    ok(`[${w}] échec du chargement : un seul « Réessayer » affiché`, nR.page === 1, `page=${nR.page} fenêtre=${nR.vue}`);
    await shot(page, `p-${w}-etape-echec-arrivee`, false);
    // Puis cadrage sur l'alerte pour la relecture visuelle
    const cp3 = await cadreProgression(page);
    ok(`[${w}] cadrage échec : barre entière sous l'en-tête + en-tête de l'étape 2`, cp3.ok, cp3.detail);
    e = await etat();
    ok(`[${w}] échec du chargement : role="alert" avec « Ta progression est intacte. »`, e.alertes.some((a) => /Ta progression est intacte/.test(a)), JSON.stringify(e.alertes));
    ok(`[${w}] échec du chargement : « Réessayer » (≥ 44 px)`, e.retryVu && e.retryH >= 44, `vu=${e.retryVu} hauteur=${e.retryH}px`);
    ok(`[${w}] échec du chargement : ni « 0/N » ni faux verrou`, !e.zero && e.faux === 0, `0/N=${e.zero} faux verrous=${e.faux}`);
    await shot(page, `p-${w}-etape-echec-reessayer`, false);
    if (await page.locator('#etape-2').count()) await clip(page, page.locator('#etape-2'), `p-${w}-etape-echec-carte`, 12).catch(() => {});
    await page.unroute(by);
    const retry = page.getByRole('button', { name: 'Réessayer' }).first();
    if (await retry.count()) await retry.click();
    else { await page.goto('about:blank'); await page.goto(`${BASE}/parcours/repartie#etape-2`, { waitUntil: 'load' }); }
    const c2 = page.locator('#etape-2');
    await c2.getByText(/Vannes à pratiquer|Termine le quiz/).first().waitFor({ timeout: 15000 }).catch(() => {});
    ok(`[${w}] après « Réessayer » : étape 2 chargée`, /Vannes à pratiquer/.test(await c2.innerText()));
    await cadreProgression(page);
    await shot(page, `p-${w}-etape-apres-reessayer`, false);
    // c) échec de la validation elle-même : POST progress bloqué au clic
    const head2 = page.locator('#etape-2-entete');
    if ((await head2.getAttribute('aria-expanded')) !== 'true') await head2.click();
    await finishQuiz(c2);
    const xp0 = xpOf(email);
    const prog = '**/api/parcours/*/progress';
    await page.route(prog, (route) => (route.request().method() === 'POST' ? route.abort('failed') : route.fallback()));
    await c2.getByRole('button', { name: 'Valider cette étape' }).click();
    await page.waitForTimeout(1500);
    const msg = await page.locator('main [role="alert"]').allInnerTexts();
    const garde = (await c2.getByRole('button', { name: 'Valider cette étape' }).count()) > 0 && (await c2.getByText(/Termine le quiz/).count()) === 0;
    ok(`[${w}] échec de la validation : message affiché`, msg.join(' ').trim().length > 0, JSON.stringify(msg).slice(0, 160));
    ok(`[${w}] échec de la validation : quiz conservé, bouton « Valider » toujours là, XP inchangé`, garde && xpOf(email) === xp0, `garde=${garde} xp ${xp0}->${xpOf(email)}`);
    // Ce que voit l'abonné juste après le clic raté (aucun défilement de notre part)
    const vueClic = await page.evaluate(() => {
      const hdr = document.querySelector('header'); const hb = hdr ? hdr.getBoundingClientRect().bottom : 0;
      const al = [...document.querySelectorAll('main [role="alert"]')].find((a) => /connexion|valider|réessaie/i.test(a.textContent || ''));
      if (!al) return { lisible: false, detail: 'message introuvable' };
      const r = al.getBoundingClientRect();
      return { lisible: r.top >= hb - 1 && r.bottom <= window.innerHeight, detail: `message ${Math.round(r.top)}-${Math.round(r.bottom)}px (fenêtre ${window.innerHeight}px)` };
    });
    ok(`[${w}] échec de la validation : message lisible juste après le clic, sans défiler`, vueClic.lisible, vueClic.detail);
    await shot(page, `p-${w}-validation-echec-vue`, false);
    // Cadrage demandé : message + bouton « Valider » + quiz conservé ; une vue si possible, sinon deux captures
    const cadre = await page.evaluate(() => {
      const hdr = document.querySelector('header'); const hb = hdr ? hdr.getBoundingClientRect().bottom : 0;
      const al = [...document.querySelectorAll('main [role="alert"]')].find((a) => /connexion|valider|réessaie/i.test(a.textContent || ''));
      const c2 = document.querySelector('#etape-2');
      const bt = c2 ? [...c2.querySelectorAll('button')].find((b) => /Valider cette étape/.test(b.textContent || '')) : null;
      const qz = c2 ? [...c2.querySelectorAll('p, div')].find((e) => e.children.length === 0 && /Quiz bouclé|bonnes réponses|Sans faute/.test(e.textContent || '')) : null;
      const els = [al, bt, qz].filter(Boolean);
      if (!els.length) return { une: false, ecart: null };
      const rs = els.map((e) => e.getBoundingClientRect());
      const haut = Math.min(...rs.map((r) => r.top)); const bas = Math.max(...rs.map((r) => r.bottom));
      const dispo = window.innerHeight - hb - 24;
      const ecart = al && bt ? Math.round(Math.abs(bt.getBoundingClientRect().top - al.getBoundingClientRect().top)) : null;
      if (bas - haut <= dispo) { window.scrollBy({ top: haut - hb - 12, behavior: 'instant' }); return { une: true, ecart, quiz: !!qz }; }
      return { une: false, ecart, quiz: !!qz };
    });
    ok(`[${w}] échec de la validation : message, bouton et quiz conservé dans une même vue`, cadre.une, `écart message/bouton=${cadre.ecart}px quiz conservé repéré=${cadre.quiz}`);
    await page.waitForTimeout(300);
    if (!cadre.une) {
      const al = page.locator('main [role="alert"]').filter({ hasText: /connexion|valider|réessaie/i }).first();
      if (await al.count()) await al.evaluate((el) => { el.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy({ top: -90, behavior: 'instant' }); });
      await page.waitForTimeout(300);
      await shot(page, `p-${w}-validation-echec`, false);
      await c2.getByRole('button', { name: 'Valider cette étape' }).evaluate((el) => { el.scrollIntoView({ block: 'center', behavior: 'instant' }); });
      await page.waitForTimeout(300);
      await shot(page, `p-${w}-validation-echec-bouton`, false);
    } else {
    await shot(page, `p-${w}-validation-echec`, false);
    }
    await page.unroute(prog);
    await c2.getByRole('button', { name: 'Valider cette étape' }).click();
    await page.locator(RES(2)).filter({ hasText: /XP/ }).waitFor({ timeout: 15000 }).catch(() => {});
    ok(`[${w}] nouvelle tentative de validation réussie`, xpOf(email) > xp0, `xp ${xp0}->${xpOf(email)}`);
  }

  // 2. Premium 1280 : survols, focus clavier, bouton désactivé, retour « ça a marché », « On valide… »,
  //    focus + annonce aria-live après « Valider », puis chargement / échec / échec de validation
  await step('états Premium 1280', async () => {
    const email = 'qa-etats1280@local.test';
    const ctx = await newCtx(browser, 1280);
    const page = await ctx.newPage();
    await login(page, email);
    await gotoW(page, `${BASE}/parcours/repartie`);
    const c1 = page.locator('#etape-1');
    // Survols (DES-2-09) : en-tête d'étape, option de quiz
    await pairSurvol(page, page.locator('#etape-1-entete'), page.locator('#etape-1-entete'), 'p-1280-survol-entete-etape', 16);
    const g = c1.locator('[role="group"][aria-labelledby^="quiz-q-"]');
    await pairSurvol(page, g.locator('button').nth(1), g, 'p-1280-survol-option-quiz', 16);
    await page.locator('body').click({ position: { x: 5, y: 300 } });
    await tabTo(page, page.locator('#etape-1-entete'));
    await clip(page, page.locator('#etape-1-entete'), 'p-1280-focus-entete-etape', 16);
    const termine = c1.getByRole('button', { name: /Termine le quiz/ });
    ok('[1280] « Termine le quiz… » en aria-disabled', (await termine.getAttribute('aria-disabled')) === 'true', `aria-disabled=${await termine.getAttribute('aria-disabled')} disabled=${await termine.isDisabled()}`);
    await clip(page, termine, 'p-1280-bouton-desactive-quiz-a-finir');
    await tabTo(page, g.locator('button').first());
    await clip(page, g, 'p-1280-focus-reponse-quiz', 16);
    await g.locator('button').nth(wrongIndex('repartie', 1, 0)).click();
    const st = c1.locator('[role="status"][aria-live="polite"]').first();
    await st.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(250);
    await shot(page, 'p-1280-repartie-quiz-mauvaise-reponse', false);
    const next = c1.getByRole('button', { name: /Question suivante/ });
    await next.focus();
    await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); // focus clavier visible
    await clip(page, next, 'p-1280-focus-question-suivante', 40);
    await next.click();
    await finishQuiz(c1);
    const marche = c1.locator('[role="group"][aria-labelledby="retour-1"] button').nth(2);
    await tabTo(page, marche);
    await clip(page, c1.locator('[role="group"][aria-labelledby="retour-1"]').locator('xpath=..'), 'p-1280-focus-retour-exercice', 16);
    await marche.click();
    await page.waitForTimeout(400);
    await clip(page, c1.locator('[role="group"][aria-labelledby="retour-1"]').locator('xpath=..'), 'p-1280-retour-exercice-ca-a-marche', 16);
    const valider = c1.getByRole('button', { name: 'Valider cette étape' });
    await pairSurvol(page, valider, valider, 'p-1280-survol-valider', 40);
    await tabTo(page, valider);
    await clip(page, valider, 'p-1280-focus-valider', 40);
    // « On valide… » : la requête de validation est retenue 4 s ; validation lancée AU CLAVIER (Entrée)
    await page.route('**/api/parcours/*/progress', async (route) => {
      if (route.request().method() === 'POST') await new Promise((r) => setTimeout(r, 4000));
      return route.fallback();
    });
    await page.keyboard.press('Enter');
    const enCours = c1.getByRole('button', { name: /On valide/ });
    await enCours.waitFor({ timeout: 3000 });
    ok('[1280] bouton « On valide… » inactif pendant l\'envoi', (await enCours.isDisabled()) || (await enCours.getAttribute('aria-disabled')) === 'true');
    await clip(page, enCours, 'p-1280-on-valide', 40);
    await page.locator(RES(1)).filter({ hasText: /XP/ }).waitFor({ timeout: 15000 }).catch(() => {});
    await page.unroute('**/api/parcours/*/progress');
    // Focus et annonce après « Valider » (UXV-2-06 point 2) : on lit le DOM et on l'écrit au journal
    await page.waitForTimeout(1200);
    const apres = await page.evaluate(() => {
      const a = document.activeElement;
      const lives = [...document.querySelectorAll('[aria-live]')].map((el) => ({ mode: el.getAttribute('aria-live'), srOnly: el.classList.contains('sr-only'), texte: (el.textContent || '').replace(/\s+/g, ' ').trim() })).filter((x) => x.texte);
      return { focus: a ? `${a.tagName.toLowerCase()}#${a.id || '-'} « ${(a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60)} »` : 'aucun', focusId: a ? a.id : '', lives };
    });
    console.log(`ANNONCE [1280] focus après « Valider » : ${apres.focus}`);
    for (const l of apres.lives) console.log(`ANNONCE [1280] aria-live=${l.mode}${l.srOnly ? ' (sr-only)' : ''} : « ${l.texte.slice(0, 200)} »`);
    ok('[1280] après « Valider » : focus sur l\'étape suivante', /^etape-2/.test(apres.focusId), apres.focus);
    ok('[1280] après « Valider » : annonce aria-live du gain d\'XP', apres.lives.some((l) => /XP/.test(l.texte)), apres.lives.map((l) => l.texte.slice(0, 80)).join(' | '));
    const geo = await page.evaluate(() => {
      const hdr = document.querySelector('header'); const hb = hdr ? hdr.getBoundingClientRect().bottom : 0;
      const h = document.querySelector('#etape-2-entete');
      const cs = h ? getComputedStyle(h) : null;
      const anneau = cs ? (parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0) : 0;
      let suivant = h ? h.nextElementSibling : null;
      while (suivant && suivant.getBoundingClientRect().height === 0) suivant = suivant.nextElementSibling;
      const prem = suivant && suivant.firstElementChild ? suivant.firstElementChild : suivant;
      const ecart = h && prem ? Math.round(prem.getBoundingClientRect().top - (h.getBoundingClientRect().bottom + anneau)) : null;
      const prog = [...document.querySelectorAll('main h2')].find((x) => /Le programme/.test(x.textContent || ''));
      const r = prog ? prog.getBoundingClientRect() : null;
      const coupe = !!r && r.top < hb && r.bottom > hb;
      return { ecart, anneau, coupe, prog: r ? `${Math.round(r.top)}-${Math.round(r.bottom)} (en-tête ${Math.round(hb)})` : 'absent' };
    });
    ok('[1280] focus après « Valider » : écart visible entre l\'anneau et le bloc suivant', geo.ecart !== null && geo.ecart >= 4, `écart=${geo.ecart}px (anneau ${geo.anneau}px compris)`);
    ok('[1280] focus après « Valider » : titre « Le programme » non coupé par l\'en-tête', !geo.coupe, `Le programme ${geo.prog}`);
    await shot(page, 'p-1280-focus-apres-valider', false);
    await chargementEchec(page, 1280, email);
    R.logs.e1280 = ctx.__log;
    await ctx.close();
  });

  // 3. Premium 375 : étape 1 validée, puis chargement / échec / échec de validation
  await step('chargement et échec 375', async () => {
    const email = 'qa-etats375@local.test';
    const ctx = await newCtx(browser, 375);
    const page = await ctx.newPage();
    await login(page, email);
    await gotoW(page, `${BASE}/parcours/repartie`);
    const c1 = await openStep(page, 1);
    await finishQuiz(c1);
    await validate(page, c1, 1);
    await chargementEchec(page, 375, email);
    R.logs.e375 = ctx.__log;
    await ctx.close();
  });

  // 3 bis. Premium 768 (DES-3-04) : même série que 375 et 1280
  await step('chargement et échec 768', async () => {
    const email = 'qa-etats768@local.test';
    const ctx = await newCtx(browser, 768);
    const page = await ctx.newPage();
    await login(page, email);
    await gotoW(page, `${BASE}/parcours/repartie`);
    const c1 = await openStep(page, 1);
    await finishQuiz(c1);
    await validate(page, c1, 1);
    await chargementEchec(page, 768, email);
    R.logs.e768 = ctx.__log;
    await ctx.close();
  });

  // 4. Personas à 375 : Sophie (Machine à Café, avec mauvaise réponse), Marc (Confiance étapes 1 à 6)
  for (const [email, slug] of [['qa-mac375@local.test', 'machine-a-cafe'], ['qa-c375@local.test', 'confiance']]) {
    await step(`${slug} 375`, async () => {
      const ctx = await newCtx(browser, 375);
      const page = await ctx.newPage();
      await login(page, email);
      await runPath(page, 375, email, slug, { wrongFirst: slug === 'machine-a-cafe' });
      R.logs[slug] = ctx.__log;
      await ctx.close();
    });
  }

  // 5. Premium qa-p768 (Confiance 2/6) : accueil, liste /parcours, arrivée par « Reprendre »
  for (const w of [375, 768, 1280]) {
    await step(`reprendre ${w}`, async () => {
      const ctx = await newCtx(browser, w);
      const page = await ctx.newPage();
      await login(page, 'qa-p768@local.test');
      await gotoW(page, BASE + '/');
      ok(`[${w}] accueil Premium : bloc « Reprendre ton parcours »`, /Reprendre ton parcours/.test(await page.locator('main').innerText()));
      // Tour 3 : un seul bouton plein à l'écran à l'arrivée (variantes primary/secondary = fond accent-secondary)
      const pleins = await page.evaluate(() => [...document.querySelectorAll('main a, main button')].filter((el) => {
        const b = el.getBoundingClientRect();
        if (!(b.height > 0 && b.top < window.innerHeight && b.bottom > 0)) return false;
        return /(^|\s)bg-accent-(secondary|primary)(-hover)?(\s|$)/.test(el.className || '');
      }).map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)));
      ok(`[${w}] accueil Premium : un seul bouton plein à l'écran`, pleins.length === 1, JSON.stringify(pleins));
      await shot(page, `p-${w}-accueil-premium`);
      await gotoW(page, BASE + '/parcours');
      await shot(page, `p-${w}-parcours-liste-premium`);
      await gotoW(page, BASE + '/profil');
      await page.getByRole('link', { name: /Reprendre l.étape 3/ }).first().click();
      await page.waitForURL(/\/parcours\/confiance/);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const st = await page.locator('#etape-3').evaluate((el) => { const b = el.getBoundingClientRect(); return { top: Math.round(b.top), vis: b.top >= 0 && b.top < window.innerHeight }; });
      const ex = await page.locator('#etape-3-entete').getAttribute('aria-expanded');
      ok(`[${w}] « Reprendre l'étape 3 » : étape 3 ouverte et à l'écran`, st.vis && ex === 'true', `${page.url().replace(BASE, '')} top=${st.top} ouverte=${ex}`);
      await shot(page, `p-${w}-arrivee-reprendre`, false);
      await ctx.close();
    });
  }

  // 6. Interrupteur du rappel (role="switch", sous « Mes parcours », ancre #rappel-parcours), compte à e-mail vérifié
  for (const w of [375, 1280]) {
    await step(`rappel ${w}`, async () => {
      const ctx = await newCtx(browser, w);
      const page = await ctx.newPage();
      await login(page, 'qa-premium-verif@local.test');
      await gotoW(page, BASE + '/profil#rappel-parcours');
      await page.waitForTimeout(800);
      const sec = page.locator('[data-testid="rappel-parcours"]');
      const sw = sec.getByRole('switch');
      const sel = sec.locator('select');
      const enVue = await sec.evaluate((el) => { const b = el.getBoundingClientRect(); return b.top >= 0 && b.top < window.innerHeight; });
      ok(`[${w}] /profil#rappel-parcours : section du rappel à l'écran`, enVue);
      if (w === 375) await shot(page, 'p-375-rappel-arrivee-ancre', false);
      const ordre = await sec.evaluate((el) => {
        const find = (re) => [...document.querySelectorAll('main h2, main h3, main [class*="font-display"]')].find((h) => re.test(h.textContent || ''));
        const avant = (a, b) => !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));
        return { apresMesParcours: avant(find(/^Mes parcours/), el), avantSuppression: avant(el, find(/Supprimer mon compte/)) };
      });
      ok(`[${w}] rappel sous « Mes parcours » et avant « Supprimer mon compte »`, ordre.apresMesParcours && ordre.avantSuppression, JSON.stringify(ordre));
      if (await sw.isChecked()) { await clicSwitch(sec); await page.waitForTimeout(1200); }
      await clip(page, sec, `p-${w}-rappel-decoche`, 16);
      if (w === 1280) {
        // Survol de l'interrupteur (DES-2-09)
        { const lab = sec.locator('label:has([role="switch"])');
          const b = await lab.boundingBox();
          const cibleSw = { hover: () => lab.hover({ position: { x: 20, y: Math.round(b.height / 2) } }) };
          await pairSurvol(page, cibleSw, sec, 'p-1280-survol-rappel', 16, lab.locator('span[aria-hidden="true"]').first()); }
        // Au clavier : Tab jusqu'à l'interrupteur, Espace pour l'activer
        await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
        await tabTo(page, sw, 200);
        await clip(page, sec, 'p-1280-focus-rappel', 16);
        const jourAvant = await sel.inputValue();
        await page.keyboard.press('Space');
        await page.waitForTimeout(1500);
        // Sans jour enregistré, le focus part volontairement sur le choix du jour ; sinon il doit rester sur l'interrupteur.
        const garde = jourAvant === '' ? await sel.evaluate((el) => document.activeElement === el) : await sw.evaluate((el) => document.activeElement === el);
        const actif = await page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName.toLowerCase()}${a.id ? '#' + a.id : ''}` : 'aucun'; });
        ok(`[1280] rappel : focus conservé après Espace (${jourAvant === '' ? 'sur le choix du jour' : 'sur l\'interrupteur'})`, garde, `jour avant=${jourAvant || 'aucun'} focus sur ${actif}`);
        if (!(await sw.isChecked()) && (await sel.inputValue()) === '') {
          await clip(page, sec, 'p-1280-rappel-clavier-choisir-jour', 16);
          await sel.selectOption({ index: 1 });
        }
        await page.waitForTimeout(1200);
        ok('[1280] rappel activé au clavier (Tab + Espace)', await sw.isChecked(), (await sec.innerText()).replace(/\s+/g, ' ').slice(-80));
        await clip(page, sec, 'p-1280-rappel-clavier-coche', 16);
        // Tour 4 : choix du jour AU CLAVIER (Tab vers le sélecteur, Flèche bas), le focus doit rester sur le sélecteur
        if (!(await sel.evaluate((el) => document.activeElement === el))) await page.keyboard.press('Tab');
        const surSel = await sel.evaluate((el) => document.activeElement === el);
        const jour0 = await sel.inputValue();
        const base0 = sql(`select weekday from "ParcoursReminderPreference" p join "User" u on u.id = p."userId" where u.email='qa-premium-verif@local.test'`);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(1500);
        const jour1 = await sel.inputValue();
        const base1 = sql(`select weekday from "ParcoursReminderPreference" p join "User" u on u.id = p."userId" where u.email='qa-premium-verif@local.test'`);
        const garde2 = await sel.evaluate((el) => document.activeElement === el);
        const actif2 = await page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName.toLowerCase()}${a.id ? '#' + a.id : ''}` : 'aucun'; });
        ok('[1280] rappel : jour changé au clavier (Tab + Flèche bas) et enregistré', surSel && jour1 !== jour0 && String(base1) === String(jour1), `focus sur le sélecteur avant=${surSel} jour ${jour0}->${jour1} base ${base0}->${base1}`);
        ok('[1280] rappel : focus conservé sur le sélecteur après le choix du jour', garde2, `focus sur ${actif2}`);
        await clip(page, sec, 'p-1280-rappel-clavier-jour', 16);
        await clicSwitch(sec);
        await page.waitForTimeout(1200);
      }
      await clicSwitch(sec);
      await page.waitForTimeout(500);
      if (!(await sw.isChecked()) && (await sel.inputValue()) === '') await sel.selectOption({ index: 1 });
      await page.waitForTimeout(1200);
      ok(`[${w}] rappel coché et enregistré`, await sw.isChecked(), (await sec.innerText()).replace(/\s+/g, ' ').slice(-80));
      await clip(page, sec, `p-${w}-rappel-coche`, 16);
      await clicSwitch(sec);
      await page.waitForTimeout(1200);
      ok(`[${w}] rappel décoché et enregistré`, !(await sw.isChecked()));
      await clip(page, sec, `p-${w}-rappel-decoche-apres`, 16);
      await ctx.close();
    });
  }

  // 7. Les 3 parcours terminés (qa-conf a fini Confiance dans local-premium.js) : fin avec le carnet
  await step('trois parcours 1280', async () => {
    const email = 'qa-conf@local.test';
    const ctx = await newCtx(browser, 1280);
    const page = await ctx.newPage();
    await login(page, email);
    await runPath(page, 1280, email, 'repartie', { capture: false, end: false });
    await runPath(page, 1280, email, 'machine-a-cafe', { capture: false, end: true, endName: 'trois-parcours-fin-bilan' });
    const carte = page.getByRole('heading', { level: 2, name: /^Parcours .+ terminé$/ }).locator('xpath=ancestor::div[contains(@class,"text-center")][1]');
    ok('[1280] fin des 3 parcours : lien vers le carnet dans la carte de fin', (await carte.locator('a[href="/carnet"]').count()) > 0);
    await ctx.close();
  });

  console.log('LOGS', JSON.stringify(R.logs).slice(0, 4000));
  require('fs').writeFileSync(__dirname + '/local-etats.json', JSON.stringify(R, null, 1));
  await browser.close();
})();
