// B3 s17 : parcours visiteur sur instance locale. Usage : node local-visiteur.js
const { BASE, WIDTHS, sql, launch, newCtx, shot } = require('./local-common');
const { gotoW } = require('./local-common');
const seed = require('/home/user/Marrant/docs/content/parcours-seed.json');
const R = { checks: [], logs: {} };
const ok = (name, pass, detail = '') => { R.checks.push({ name, pass, detail }); console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : '')); };

async function playQuiz(page, card, tag) {
  const letters = [];
  const explanations = [];
  for (let i = 0; i < 6; i++) {
    const group = card.locator('[role="group"][aria-labelledby^="quiz-q-"]');
    if (!(await group.count())) break;
    letters.push((await group.locator('[data-testid="quiz-lettre"]').allInnerTexts()).join(''));
    // 1re question : mauvaise réponse exprès (correction + bonne réponse affichées)
    await group.locator('button').nth(i === 0 ? 3 : 0).click();
    const st = card.locator('[role="status"][aria-live="polite"]').first();
    await st.waitFor();
    explanations.push((await st.innerText()).replace(/\s+/g, ' ').slice(0, 160));
    if (i === 0 && tag) await shot(page, tag, false);
    const next = card.getByRole('button', { name: /Question suivante|Voir le résultat/ });
    await next.click();
  }
  return { letters, explanations };
}

(async () => {
  const browser = await launch();
  const rep = seed.find((p) => p.slug === 'repartie');
  // Contenus payants de Répartie (étapes 2+) qui ne doivent JAMAIS atteindre un visiteur
  const tips = sql(`select t.content from "LearningPathStep" s join "Tip" t on t.id=s."tipId" join "LearningPath" p on p.id=s."learningPathId" where p.slug='repartie' and s."order">1`).split('\n').filter(Boolean);
  const secrets = [];
  const freeVideos = new Set((rep.steps[0].videos || []).map((v) => v.youtubeId));
  const apercus = rep.steps.map((s) => (s.moduleDetail || '') + ' ' + (s.why || '')).join(' ');
  rep.steps.slice(1).forEach((s) => {
    (s.quiz || []).forEach((q) => secrets.push(['quiz', q.question.slice(0, 40)]));
    (s.videos || []).filter((v) => !freeVideos.has(v.youtubeId)).forEach((v) => secrets.push(['video', v.youtubeId]));
    (s.jokeContents || []).forEach((j) => secrets.push(['vanne', j.slice(0, 40)]));
  });
  tips.forEach((t) => { const n = t.replace(/\s+/g, ' '); for (let o = 150; o < n.length - 60; o += 150) { const sub = n.slice(o, o + 50); if (!apercus.includes(sub)) secrets.push(['conseil', sub]); } });

  const vanneId = sql(`select id from "Joke" where content like 'Mon père a vu mon appart%'`);
  // 1. HTML brut (sans JS) de /parcours/repartie
  const html = await (await fetch(BASE + '/parcours/repartie')).text();
  const leaks = secrets.filter(([, s]) => html.includes(s) || html.includes(s.replace(/'/g, '&#x27;')));
  ok('HTML brut repartie : aucun contenu payant étape 2+', leaks.length === 0, leaks.length ? JSON.stringify(leaks.slice(0, 5)) : `${secrets.length} chaînes testées`);

  for (const w of WIDTHS) {
    const ctx = await newCtx(browser, w);
    const page = await ctx.newPage();
    const apiBodies = [];
    page.on('response', async (r) => { if (r.url().includes('/api/parcours')) { try { apiBodies.push(await r.text()); } catch {} } });

    await gotoW(page, BASE + '/parcours');
    await shot(page, `v-${w}-parcours-liste`);

    await gotoW(page, BASE + '/parcours/repartie');
    await shot(page, `v-${w}-repartie-arrivee`);
    const c1 = page.locator('#etape-1');
    const exp1 = await page.locator('#etape-1-entete').getAttribute('aria-expanded');
    ok(`[${w}] étape 1 ouverte par défaut`, exp1 === 'true', 'aria-expanded=' + exp1);
    const q = await playQuiz(page, c1, `v-${w}-repartie-quiz-explication`);
    ok(`[${w}] lettres A-D sur chaque question`, q.letters.length > 0 && q.letters.every((l) => l === 'ABCD'), JSON.stringify(q.letters));
    ok(`[${w}] explication affichée après réponse`, q.explanations.every((e) => /La [ABCD]/.test(e)), q.explanations[0]);
    const finBox = c1.locator('[role="status"]').filter({ hasText: /sur \d/ }).first();
    await finBox.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(300);
    await shot(page, `v-${w}-repartie-quiz-fin-visiteur`, false);
    const finTxt = (await finBox.innerText()).replace(/\s+/g, ' ');
    const mur = /Valider l.étape fait partie de Premium/.test(await c1.innerText());
    ok(`[${w}] fin de quiz visiteur (score + mur Premium)`, /\d+ sur \d+/.test(finTxt) && mur, finTxt.slice(0, 120) + ' | mur=' + mur);
    // Tour 1 corrigé (UXV-1-04) : plus de « Continuer », « Refaire le quiz » en contour
    const nCont = await c1.getByRole('button', { name: 'Continuer' }).count();
    const nRefaire = await c1.getByRole('button', { name: 'Refaire le quiz' }).count();
    ok(`[${w}] fin de quiz visiteur : « Refaire le quiz », pas de « Continuer »`, nCont === 0 && nRefaire === 1, `continuer=${nCont} refaire=${nRefaire}`);

    // 2. Aperçu étape 2
    await page.locator('#etape-2-entete').click();
    await page.waitForTimeout(500);
    const c2 = page.locator('#etape-2');
    await c2.scrollIntoViewIfNeeded();
    await shot(page, `v-${w}-repartie-apercu-etape2`, false);
    const t2 = await c2.innerText();
    const badge = /Premium/i.test(await page.locator('#etape-2-entete').innerText());
    const btn = await c2.getByRole('link', { name: /Premium/i }).count();
    const dom = await page.content();
    const domLeaks = secrets.filter(([, s]) => dom.includes(s));
    const iframes = await c2.locator('iframe, [data-youtube-id], img[src*="ytimg"]').count();
    const quizInCard = await c2.locator('[data-testid="quiz-lettre"]').count();
    ok(`[${w}] aperçu étape 2 : badge + texte + bouton Premium`, badge && /Ce que tu vas apprendre/.test(t2) && btn > 0, `badge=${badge} bouton=${btn}`);
    ok(`[${w}] aperçu étape 2 : ni conseil, ni quiz, ni vidéo dans le DOM`, domLeaks.length === 0 && iframes === 0 && quizInCard === 0, `fuites=${JSON.stringify(domLeaks.slice(0, 3))} video=${iframes} quiz=${quizInCard}`);
    const apiLeaks = secrets.filter(([, s]) => apiBodies.some((b) => b.includes(s)));
    ok(`[${w}] réponses /api/parcours visiteur sans contenu payant`, apiLeaks.length === 0, `${apiBodies.length} réponses, fuites=${apiLeaks.length}`);

    // 3. Accueil : lien « Lire la première étape gratuite »
    await gotoW(page, BASE + '/');
    const homeLink = page.getByRole('link', { name: 'Lire la première étape gratuite' }).first();
    const href = (await homeLink.count()) ? await homeLink.getAttribute('href') : null;
    ok(`[${w}] accueil : lien étape 1 gratuite`, !!href && /#etape-1$/.test(href), href);
    await shot(page, `v-${w}-accueil`, false);
    if (href) {
      await homeLink.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(800);
      const inView = await page.locator('#etape-1').evaluate((el) => { const b = el.getBoundingClientRect(); return b.top < window.innerHeight && b.bottom > 0; });
      ok(`[${w}] accueil -> arrivée sur #etape-1 visible`, page.url().includes('#etape-1') && inView, page.url());
      await shot(page, `v-${w}-accueil-vers-etape1`, false);
    }
    // 4. Entrées blog et fiche vanne -> #etape-1
    for (const [nom, url, re] of [
      ['blog', '/blog/repondre-moqueries-avec-humour', /src=blog#etape-1$/],
      ['fiche vanne', '/vannes/' + vanneId.slice(0, 10), /src=fiche#etape-1$/],
    ]) {
      await gotoW(page, BASE + url);
      const l = page.locator('a[href*="#etape-1"]').first();
      const h = (await l.count()) ? await l.getAttribute('href') : null;
      if (h) { await l.scrollIntoViewIfNeeded(); await shot(page, `v-${w}-entree-${nom.replace(' ', '-')}`, false); }
      ok(`[${w}] ${nom} : lien vers étape 1`, !!h && re.test(h), h);
      if (!h) continue;
      await l.click();
      await page.waitForURL(/#etape-1/);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(800);
      const st = await page.locator('#etape-1').evaluate((el) => { const b = el.getBoundingClientRect(); return { vis: b.top < window.innerHeight && b.bottom > 0, top: Math.round(b.top) }; });
      const ex = await page.locator('#etape-1-entete').getAttribute('aria-expanded');
      ok(`[${w}] ${nom} -> #etape-1 ouverte et à l'écran`, st.vis && ex === 'true', page.url().replace(BASE, '') + ' top=' + st.top);
      await shot(page, `v-${w}-entree-${nom.replace(' ', '-')}-arrivee`, false);
    }
    R.logs[w] = ctx.__log;
    await ctx.close();
  }
  console.log('LOGS', JSON.stringify(R.logs, null, 1).slice(0, 3000));
  require('fs').writeFileSync(__dirname + '/local-visiteur.json', JSON.stringify(R, null, 1));
  await browser.close();
})();
