// Diagnostic : l'aperçu Quoi répondre reste-t-il en squelette ? (navigation directe puis navigation client)
const { BASE, compteur, ouvrir, suivreConsole, ecrire } = require('./lib');
(async () => {
  const { browser, context } = await ouvrir(375);
  const page = await context.newPage();
  const err = []; suivreConsole(page, err);
  const reps = [];
  page.on('response', (r) => { if (r.url().startsWith(BASE)) reps.push(`${r.status()} ${r.request().resourceType()} ${r.url().replace(BASE, '')}`.slice(0, 160)); });
  compteur.navigations++;
  const rep = await page.goto(BASE + '/mon-espace/quoi-repondre', { waitUntil: 'domcontentloaded' });
  const t0 = Date.now();
  const ok = await page.waitForSelector('[data-tuile-fermee]', { timeout: 20000 }).then(() => true).catch(() => false);
  console.log('direct', rep.status(), rep.headers()['cache-control'], 'tuiles', ok, Date.now() - t0, 'ms');
  const html = await rep.text();
  console.log('HTML contient data-tuile-fermee :', html.includes('data-tuile-fermee'), ' taille', html.length, ' animate-pulse:', (html.match(/animate-pulse/g) || []).length);
  await page.screenshot({ path: __dirname + '/06-quoi-repondre-direct-375.png' });
  // Navigation client depuis /mon-espace (lien de la barre)
  compteur.navigations++;
  await page.goto(BASE + '/mon-espace', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const l = page.locator('a[href="/mon-espace/quoi-repondre"]:visible').first();
  const t1 = Date.now();
  await l.click();
  const ok2 = await page.waitForSelector('[data-tuile-fermee]', { timeout: 20000 }).then(() => true).catch(() => false);
  console.log('client', page.url(), 'tuiles', ok2, Date.now() - t1, 'ms');
  console.log(reps.filter((x) => !/_next\/static|\.woff|image/.test(x)).join('\n'));
  console.log('erreurs', err.filter((e) => !/BLOCKED_BY_CLIENT/.test(e.texte)));
  console.log('bloquees', compteur.bloquees.length, 'total', compteur.navigateurTotal);
  await browser.close();
})();
