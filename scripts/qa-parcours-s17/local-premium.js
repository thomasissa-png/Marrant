// B3 s17 : parcours Premium (validation des étapes), profil, axe. Instance LOCALE uniquement.
// Comptes : qa-p375 / qa-p768 / qa-premium (1280) font Répartie en entier ; qa-premium fait aussi Confiance ;
// qa-p768 commence Confiance (2 étapes) pour « Reprendre ton parcours » ; qa-premium-verif sert de témoin rappel.
const { BASE, WIDTHS, sql, launch, newCtx, shot, login, axe } = require('./local-common');
const { gotoW, OUT } = require('./local-common');
const R = { checks: [], axe: {}, logs: {}, dumps: {} };
const ok = (name, pass, detail = '') => { R.checks.push({ name, pass, detail }); console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : '')); };
const ACCOUNTS = { 375: 'qa-p375@local.test', 768: 'qa-p768@local.test', 1280: 'qa-premium@local.test' };
const xpOf = (email) => Number(sql(`select xp from "User" where email='${email}'`));
// Tour 2 : résultat (gain d'XP + date conseillée) affiché DANS la carte validée, sans minuterie.
const resultat = (page, n) => page.locator(`#etape-${n} [data-testid="etape-resultat"]`);

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

async function openStep(page, n) {
  const head = page.locator(`#etape-${n}-entete`);
  if ((await head.getAttribute('aria-expanded')) !== 'true') await head.click();
  const card = page.locator(`#etape-${n}`);
  await card.getByText(/Vannes à pratiquer|Valider cette étape|Termine le quiz/).first().waitFor({ timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(400);
  return card;
}

async function runPath(page, w, email, slug, nSteps, expectedTotal, stopAfter = nSteps, capture = true) {
  await gotoW(page, `${BASE}/parcours/${slug}`);
  let prevXp = xpOf(email);
  for (let n = 1; n <= stopAfter; n++) {
    const card = await openStep(page, n);
    const vannes = await card.locator('a[href^="/vannes/"]').count();
    const txt = await card.innerText();
    const retour = card.locator(`[role="group"][aria-labelledby="retour-${n}"] button`);
    const nRetour = await retour.count();
    if (capture && slug === 'repartie') {
      ok(`[${w}] ${slug} étape ${n} : 5 vannes affichées`, vannes === 5, `liens vannes=${vannes}`);
      ok(`[${w}] ${slug} étape ${n} : vidéos « facultatif »`, /facultatif/i.test(txt), (txt.match(/.{0,30}facultatif.{0,20}/i) || [''])[0]);
      ok(`[${w}] ${slug} étape ${n} : 3 boutons de retour d'exercice`, nRetour === 3, `boutons=${nRetour}`);
    }
    if (nRetour) await retour.nth(n % 3).click();
    await playQuiz(card);
    if (capture) {
      // Tour 3 (UXV-2-06) : la version « vue » est cadrée sur « Valider cette étape ».
      await card.getByRole('button', { name: 'Valider cette étape' }).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })).catch(() => {});
      await page.waitForTimeout(250);
      await shot(page, `p-${w}-${slug}-etape${n}-avant-validation`);
    }
    await card.getByRole('button', { name: 'Valider cette étape' }).click();
    await resultat(page, n).filter({ hasText: /XP/ }).waitFor({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(800);
    const msg = (await resultat(page, n).innerText().catch(() => '')).replace(/\s+/g, ' ');
    const body = await page.locator('main').innerText();
    const xp = xpOf(email);
    const last = n === nSteps;
    R.dumps[`${w}-${slug}-${n}`] = msg;
    ok(`[${w}] ${slug} étape ${n} : gain d'XP dans la carte validée`, /\+\d+ XP/.test(msg), `${msg.slice(0, 140)} | base +${xp - prevXp}`);
    if (!last) {
      ok(`[${w}] ${slug} étape ${n} : pas de « Parcours terminé ! » avant la fin`, !/Parcours terminé/.test(body), '');
      ok(`[${w}] ${slug} étape ${n} : « prochaine étape conseillée » dans la carte validée`, /[Pp]rochaine étape conseillée/.test(msg), (msg.match(/[Pp]rochaine étape conseillée.{0,60}/) || ['absent'])[0]);
    }
    // Ce que voit l'utilisateur juste après le clic (sans défiler) : message d'XP et date conseillée à l'écran ?
    const vue = await page.evaluate((k) => {
      const hdr = document.querySelector('header');
      const top = hdr ? Math.max(0, hdr.getBoundingClientRect().bottom) : 0;
      const inView = (el) => { if (!el) return false; const b = el.getBoundingClientRect(); return b.height > 0 && b.top >= top - 1 && b.bottom <= window.innerHeight; };
      const box = document.querySelector(`#etape-${k} [data-testid="etape-resultat"]`);
      const ps = box ? [...box.querySelectorAll('p')] : [];
      return { xp: inView(ps.find((p) => /XP/.test(p.textContent || ''))), next: inView(ps.find((p) => /Prochaine étape conseillée/.test(p.textContent || ''))) };
    }, n);
    R.vue = R.vue || [];
    R.vue.push({ w, slug, n, ...vue });
    if (!last) ok(`[${w}] ${slug} étape ${n} : gain d'XP à l'écran sans défiler`, vue.xp, '');
    else {
      // Dernière étape : la page amène la carte de fin (avant « Le programme ») à l'écran.
      const finVue = await page.getByRole('heading', { level: 2, name: /^Parcours .+ terminé$/ }).evaluate((el) => { const b = el.getBoundingClientRect(); return b.top >= 0 && b.bottom <= window.innerHeight; }).catch(() => false);
      ok(`[${w}] ${slug} étape ${n} (dernière) : carte de fin à l'écran sans défiler`, finVue, '');
    }
    if (!last) ok(`[${w}] ${slug} étape ${n} : date conseillée à l'écran sans défiler`, vue.next, '');
    if (capture) {
      await shot(page, `p-${w}-${slug}-etape${n}-apres-validation-vue`, false);
      await page.locator(`#etape-${n}`).evaluate((el) => { el.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy({ top: -90, behavior: 'instant' }); }).catch(() => {});
      await page.waitForTimeout(300);
      await shot(page, `p-${w}-${slug}-etape${n}-apres-validation`, false);
      // Tour 2 : la carte validée seule (résultat dans la carte), 375 / 768 / 1280
      if (slug === 'repartie' && n === 2) await page.locator('#etape-2').screenshot({ path: `${OUT}/p-${w}-resultat-carte-validee.png` });
    }
    prevXp = xp;
    // Rythme humain : la route limite à 10 validations/min.
    await page.waitForTimeout(6500);
  }
  if (stopAfter === nSteps) {
    const fin = page.getByRole('heading', { level: 2, name: /^Parcours .+ terminé$/ });
    const visible = await fin.isVisible().catch(() => false);
    const body = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
    const finTxt = visible ? (await fin.locator('xpath=..').innerText()).replace(/\s+/g, ' ') : '';
    ok(`[${w}] ${slug} : carte de fin + bilan sans recharger`, visible && /Ce que tu sais faire maintenant/.test(finTxt) && new RegExp(`les ${nSteps} étapes et gagné ${expectedTotal} XP`).test(finTxt), finTxt.slice(0, 220));
    const xp = xpOf(email);
    ok(`[${w}] ${slug} : total XP en base = étapes + 100`, xp - (R.startXp[email + slug] || 0) === expectedTotal, `delta=${xp - (R.startXp[email + slug] || 0)} attendu=${expectedTotal}`);
    ok(`[${w}] ${slug} : total XP affiché`, body.includes(String(expectedTotal)), (body.match(/.{0,40}\b\d{3}\s*XP.{0,40}/) || [''])[0]);
    if (capture || slug === 'confiance') {
      await fin.evaluate((el) => { el.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy({ top: -100, behavior: 'instant' }); }).catch(() => {});
      await page.waitForTimeout(300);
      await shot(page, `p-${w}-${slug}-fin-bilan`, false);
      await shot(page, `p-${w}-${slug}-fin-pleine-page`);
    }
  }
}

(async () => {
  const browser = await launch();
  R.startXp = {};
  const pathId = (slug) => sql(`select id from "LearningPath" where slug='${slug}'`);
  for (const w of WIDTHS) {
    const email = ACCOUNTS[w];
    const ctx = await newCtx(browser, w);
    const page = await ctx.newPage();
    await login(page, email);
    R.startXp[email + 'repartie'] = xpOf(email);
    await runPath(page, w, email, 'repartie', 4, 475);
    // Rejouer une validation déjà faite : pas de double XP
    const before = xpOf(email);
    const resp = await page.evaluate(async (id) => { const r = await fetch(`/api/parcours/${id}/progress`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepOrder: 1 }) }); return { s: r.status, j: await r.json().catch(() => null) }; }, pathId('repartie'));
    ok(`[${w}] rejouer l'étape 1 : pas de double XP`, xpOf(email) === before, `HTTP ${resp.s} alreadyCompleted=${resp.j && resp.j.alreadyCompleted} xpGained=${resp.j && resp.j.xpGained}`);
    await gotoW(page, page.url());
    const fsE = await finSousEntete(page);
    ok(`[${w}] repartie terminé rechargé : carte de fin visible à l'arrivée, avant « Pour qui ? »`, fsE.ok, fsE.detail);
    await shot(page, `p-${w}-repartie-termine-apres-rechargement`);
    if (w === 768) await runPath(page, w, email, 'confiance', 6, 800, 2, false);
    R.logs[w] = ctx.__log;
    await ctx.close();
  }

  // Confiance (6 étapes) en entier, compte dédié (qa-conf), 1280
  {
    const email = 'qa-conf@local.test';
    const ctx = await newCtx(browser, 1280);
    const page = await ctx.newPage();
    await login(page, email);
    R.startXp[email + 'confiance'] = xpOf(email);
    await runPath(page, 1280, email, 'confiance', 6, 800, 6, false);
    R.logs.conf = ctx.__log;
    await ctx.close();
  }
  // Profil : « Reprendre ton parcours » (qa-p768, Confiance 2/6) et interrupteur du rappel
  for (const [email, tag, attendu] of [['qa-p768@local.test', 'non-verifie', false], ['qa-premium-verif@local.test', 'verifie', true]]) {
    for (const w of WIDTHS) {
      const ctx = await newCtx(browser, w);
      const page = await ctx.newPage();
      await login(page, email);
      if (tag === 'verifie' && w === 375) await runPath(page, w, email, 'confiance', 6, 800, 1, false);
      await gotoW(page, BASE + '/profil');
      const body = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
      const rappel = await page.locator('[data-testid="rappel-parcours"]').count();
      if (tag === 'non-verifie') {
        const m = body.match(/Reprendre ton parcours.{0,140}/);
        ok(`[${w}] profil : « Reprendre ton parcours » au format attendu`, /Parcours Confiance, étape 3 sur 6 : /.test(body), m ? m[0] : 'absent');
      }
      ok(`[${w}] profil ${tag} : interrupteur du rappel ${attendu ? 'présent' : 'absent'}`, (rappel > 0) === attendu, `rappel=${rappel}`);
      await shot(page, `p-${w}-profil-${tag}`);
      if (w === 1280 && tag === 'non-verifie') {
        R.axe['/profil'] = await axe(page);
        for (const slug of ['machine-a-cafe', 'repartie', 'confiance']) {
          await gotoW(page, `${BASE}/parcours/${slug}`);
          R.axe[`/parcours/${slug} (Premium)`] = await axe(page);
        }
      }
      await ctx.close();
    }
  }
  // axe visiteur sur les 3 pages détail (375 et 1280)
  for (const w of [375, 1280]) {
    const ctx = await newCtx(browser, w);
    const page = await ctx.newPage();
    for (const slug of ['machine-a-cafe', 'repartie', 'confiance']) {
      await gotoW(page, `${BASE}/parcours/${slug}`);
      R.axe[`/parcours/${slug} (visiteur ${w})`] = await axe(page);
    }
    await ctx.close();
  }
  for (const [k, v] of Object.entries(R.axe)) {
    const bad = v.filter((x) => x.impact === 'serious' || x.impact === 'critical');
    ok(`axe ${k} : 0 violation serious/critical`, bad.length === 0, v.map((x) => `${x.id}(${x.impact},${x.n})`).join(' ') || 'aucune violation');
  }
  console.log('LOGS', JSON.stringify(R.logs));
  require('fs').writeFileSync(__dirname + '/local-premium.json', JSON.stringify(R, null, 1));
  await browser.close();
})();
