// Trajet visiteur en navigation privée, 375 px : accueil → Quoi répondre → tuile fermée → offre → /abonnement → /register.
// Lecture seule : clics sur des liens et une tuile (aucun formulaire, aucun bouton de paiement).
const { BASE, compteur, ouvrir, suivreConsole, mesurer, visiter, ecrire } = require('./lib');

(async () => {
  const { browser, context } = await ouvrir(375);
  const page = await context.newPage();
  const consoleErr = [];
  suivreConsole(page, consoleErr);
  const res = [];
  const etapes = [];

  await visiter(page, '/', '01-accueil-375.png', res);

  // Menu → Quoi répondre (lien visible, sinon ouverture du menu mobile).
  let lienQR = page.locator('a[href="/mon-espace/quoi-repondre"]:visible').first();
  if (!(await lienQR.count())) {
    const btnMenu = page.getByRole('button', { name: /menu/i }).first();
    if (await btnMenu.count()) { await btnMenu.click(); await page.waitForTimeout(600); etapes.push('menu mobile ouvert'); }
    lienQR = page.locator('a[href="/mon-espace/quoi-repondre"]:visible').first();
  }
  if (await lienQR.count()) {
    etapes.push('lien Quoi répondre : ' + (await lienQR.innerText()).trim());
    compteur.navigations++;
    await Promise.all([page.waitForURL('**/mon-espace/quoi-repondre**', { timeout: 30000 }), lienQR.click()]);
  } else {
    etapes.push('ECHEC : lien Quoi répondre introuvable dans le menu, accès direct');
    compteur.navigations++;
    await page.goto(BASE + '/mon-espace/quoi-repondre');
  }
  const tq = Date.now();
  const tuilesOk = await page.waitForSelector('[data-tuile-fermee]', { timeout: 20000 }).then(() => true).catch(() => false);
  etapes.push(`tuiles visibles après clic menu : ${tuilesOk} en ${Date.now() - tq} ms`);
  await page.waitForTimeout(800);
  const qr = { chemin: '(clic menu) ' + page.url().replace(BASE, ''), ...(await mesurer(page)) };
  await page.screenshot({ path: __dirname + '/02-quoi-repondre-apercu-375.png' });
  qr.capture = '02-quoi-repondre-apercu-375.png';
  res.push(qr);

  // Tuile fermée → signal sur l'offre, focus attendu sur « Tout ouvrir ».
  const tuiles = page.locator('[data-tuile-fermee]');
  etapes.push('tuiles fermées : ' + (await tuiles.count()));
  if (await tuiles.count()) {
    await tuiles.first().scrollIntoViewIfNeeded();
    await tuiles.first().click({ force: true }); // l'extrait (inert) reçoit le clic par position : comportement voulu
    await page.waitForTimeout(3600);
    const focus = await page.evaluate(() => {
      const e = document.activeElement;
      return e ? { tag: e.tagName, texte: e.innerText?.replace(/\s+/g, ' ').trim(), label: e.getAttribute('aria-label'), href: e.getAttribute('href') } : null;
    });
    etapes.push('focus après tuile : ' + JSON.stringify(focus));
    await page.screenshot({ path: __dirname + '/03-tuile-signal-offre-375.png' });
  }

  // Offre → /abonnement (lien).
  const offre = page.locator('a[data-position="haut"][href^="/abonnement"]:visible').first();
  const offreAlt = page.locator('a[href^="/abonnement"]:visible').first();
  const cible = (await offre.count()) ? offre : offreAlt;
  etapes.push('bouton offre : « ' + ((await cible.innerText()).replace(/\s+/g, ' ').trim()) + ' » → ' + (await cible.getAttribute('href')));
  compteur.navigations++;
  await Promise.all([page.waitForURL('**/abonnement**', { timeout: 30000 }), cible.click()]);
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  const ab = { chemin: '(clic offre) ' + page.url().replace(BASE, ''), ...(await mesurer(page)) };
  ab.prix1699 = await page.evaluate(() => /16,99\s?€/.test(document.body.innerText));
  await page.screenshot({ path: __dirname + '/04-abonnement-375.png' });
  ab.capture = '04-abonnement-375.png';
  res.push(ab);

  // /abonnement → /register : on suit le LIEN d'inscription (jamais un bouton qui POST).
  const liensReg = await page.$$eval('a[href*="/register"]', (as) => as.map((a) => ({ href: a.getAttribute('href'), texte: a.innerText.replace(/\s+/g, ' ').trim(), visible: a.offsetParent !== null })));
  etapes.push('liens /register sur /abonnement : ' + JSON.stringify(liensReg));
  const reg = page.locator('a[href*="/register"]:visible').first();
  if (await reg.count()) {
    compteur.navigations++;
    await Promise.all([page.waitForURL('**/register**', { timeout: 30000 }), reg.click()]);
  } else {
    etapes.push('ECHEC : aucun lien visible vers /register, accès direct');
    compteur.navigations++;
    await page.goto(BASE + '/register');
  }
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  const rg = { chemin: '(clic S\'abonner) ' + page.url().replace(BASE, ''), ...(await mesurer(page)) };
  rg.legal = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a[href]')].filter((x) => /cgu|retractation/.test(x.getAttribute('href')));
    return a.map((x) => ({ href: x.getAttribute('href'), texte: x.innerText.trim(), visible: x.offsetParent !== null,
      contexte: x.parentElement?.innerText.replace(/\s+/g, ' ').trim().slice(0, 220) }));
  });
  await page.screenshot({ path: __dirname + '/05-register-375.png', fullPage: true });
  rg.capture = '05-register-375.png';
  res.push(rg);

  ecrire('res-1-trajet-375.json', { res, etapes, consoleErr, compteur });
  console.log(JSON.stringify({ etapes, consoleErr, compteur: { ...compteur, bloquees: compteur.bloquees.length } }, null, 1));
  for (const r of res) console.log(r.chemin, r.statut ?? '', 'robots=' + r.robots, 'h1=' + JSON.stringify(r.h1), 'sw=' + r.scrollWidth, '1500=' + r.a1500, 'prix=' + r.prix199, 'TO=' + JSON.stringify(r.toutOuvrir), 'liens=' + r.liens.length);
  console.log('legal register', JSON.stringify(rg.legal, null, 1));
  console.log('bloquees', compteur.bloquees);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
