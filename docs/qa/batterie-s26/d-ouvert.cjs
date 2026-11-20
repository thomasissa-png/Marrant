// Trajets interactifs des abonnés, régime ouvert.
const L = require('./lib.cjs');
const vis = (loc) => loc.filter({ visible: true }).first();

module.exports = async function (page, D, BASE, cle) {
  const nouveauxMails = (avant) => L.mails().slice(avant).map(m => `${[m.to].flat().join(',')} « ${m.subject} »`);
  if (cle === 'D2') {
    await L.etape(page, D, 'Aujourd’hui : premier pas -> clic', async () => {
      await page.goto(BASE + '/mon-espace', { waitUntil: 'load' });
      const t = await page.locator('main').innerText();
      const lien = vis(page.locator('main a').filter({ hasText: /premier pas|Commencer|Démarrer|Reprendre/i }));
      if (!(await lien.count())) throw new Error('aucun lien de premier pas : ' + t.slice(0, 200).replace(/\s+/g, ' '));
      const libelle = (await lien.innerText()).replace(/\s+/g, ' ').slice(0, 60);
      await lien.click(); await page.waitForLoadState('load'); await page.waitForTimeout(600);
      const h1 = await page.locator('h1').first().innerText().catch(() => '(pas de H1)');
      await page.goBack(); await page.waitForLoadState('load');
      if (!/\/mon-espace$/.test(page.url())) throw new Error('retour arrière -> ' + page.url());
      return `« ${libelle} » -> H1 « ${h1} », retour OK`;
    });
    return;
  }
  await L.etape(page, D, 'Aujourd’hui -> Reprendre -> retour', async () => {
    await page.goto(BASE + '/mon-espace', { waitUntil: 'load' });
    await Promise.all([page.waitForURL(/\/parcours\/machine-a-cafe/), vis(page.getByRole('link', { name: 'Reprendre' })).click()]);
    await page.waitForTimeout(800);
    const etape = await page.evaluate(() => { const e = document.getElementById('etape-3'); return e ? Math.round(e.getBoundingClientRect().top) : null; });
    await page.goBack(); await page.waitForURL(/\/mon-espace$/);
    if (etape === null) throw new Error('ancre #etape-3 absente');
    return `étape 3 à ${etape}px du haut ; retour OK`;
  });
  await L.etape(page, D, 'cloche -> réponse de l’équipe -> lue', async () => {
    await page.goto(BASE + '/mon-espace', { waitUntil: 'load' });
    const cloche = vis(page.getByRole('button', { name: /Notifications/ }));
    const avant = await cloche.getAttribute('aria-label');
    await cloche.click(); await page.waitForTimeout(500);
    const item = vis(page.locator('a[href*="/mon-espace/questions/"]').filter({ hasText: /répondu|réponse/i }));
    await Promise.all([page.waitForURL(/\/mon-espace\/questions\//), item.click()]);
    await page.waitForTimeout(800);
    const t = await page.locator('main').innerText();
    if (!/équipe/i.test(t)) throw new Error('réponse de l’équipe absente');
    await page.goto(BASE + '/mon-espace', { waitUntil: 'load' }); await page.waitForTimeout(500);
    const apres = await vis(page.getByRole('button', { name: /Notifications/ })).getAttribute('aria-label');
    return `avant « ${avant} » ; après « ${apres} »`;
  });
  await L.etape(page, D, 'Quoi répondre : liste -> détail -> Oui -> Fait -> réplique -> suivante -> retour', async () => {
    await page.goto(BASE + '/mon-espace/quoi-repondre', { waitUntil: 'load' });
    await Promise.all([page.waitForURL(/coloc-c-est-quoi-cette-odeur/), vis(page.locator('main a[href="/mon-espace/quoi-repondre/coloc-c-est-quoi-cette-odeur"]')).click()]);
    await page.waitForTimeout(800);
    await vis(page.locator('main').getByRole('button', { name: 'Oui', exact: true })).click(); await page.waitForTimeout(800);
    await vis(page.locator('main').getByRole('button', { name: 'Essayé, ça a marché' })).click(); await page.waitForTimeout(1200);
    const champ = vis(page.locator('main textarea'));
    await champ.fill('Réplique test batterie s26 : « C’est le parfum de la réussite. »');
    await vis(page.locator('main').getByRole('button', { name: 'Enregistrer' })).click(); await page.waitForTimeout(1500);
    const apresEnr = (await page.locator('main').innerText()).match(/[^\n]*(enregistr|modifier|ta réplique)[^\n]*/gi) || [];
    await Promise.all([page.waitForURL(/coloc-samedi/), vis(page.getByRole('link', { name: 'Situation suivante' })).click()]);
    await page.waitForTimeout(600);
    await Promise.all([page.waitForURL(/\/mon-espace\/quoi-repondre$/), vis(page.getByRole('link', { name: /Retour : Quoi répondre/ })).click()]).catch(async () => { await page.goto(BASE + '/mon-espace/quoi-repondre'); });
    await page.waitForTimeout(800);
    const fait = await page.locator('main a[href="/mon-espace/quoi-repondre/coloc-c-est-quoi-cette-odeur"]').first().innerText();
    const rep = await page.request.get(BASE + '/mon-espace/repliques'); const html = await rep.text();
    if (!/Fait/.test(fait)) throw new Error('« Fait » absent de la tuile après retour : ' + fait.replace(/\s+/g, ' '));
    if (!/cette odeur/.test(html)) throw new Error('réplique absente de Mes répliques');
    return `tuile « ${fait.replace(/\s+/g, ' ')} » ; après Enregistrer : ${apresEnr.slice(0, 2).join(' / ').slice(0, 100)}`;
  });
  await L.etape(page, D, 'question à l’équipe -> envoyée (+ e-mail équipe)', async () => {
    await page.goto(BASE + '/mon-espace/questions', { waitUntil: 'load' });
    const avant = L.mails().length;
    await vis(page.locator('main textarea')).fill('Question test batterie s26 : comment je rattrape une vanne qui tombe à plat ?');
    await vis(page.locator('main').getByRole('button', { name: /Envoyer à l.équipe/ })).click(); await page.waitForTimeout(2500);
    const t = await page.locator('main').innerText();
    const ok = /envoy|reçu|bien reçu|on te répond/i.test(t);
    const m = nouveauxMails(avant);
    if (!ok) throw new Error('aucune confirmation visible : ' + t.slice(0, 200).replace(/\s+/g, ' '));
    return `confirmation visible ; e-mails : ${m.join(' / ') || 'aucun'}`;
  });
  await L.etape(page, D, 'favoris : ajouter depuis /vannes puis retirer', async () => {
    const compter = async () => { await page.goto(BASE + '/favoris', { waitUntil: 'load' }); await page.waitForTimeout(600); return page.locator('main a[href^="/favoris?favori="]').count(); };
    const n0 = await compter();
    await page.goto(BASE + '/vannes', { waitUntil: 'load' }); await page.waitForTimeout(600);
    const btn = vis(page.locator('main').getByRole('button', { name: /^Ajouter aux favoris/ }));
    await btn.click(); await page.waitForTimeout(1200);
    const n1 = await compter();
    // Retrait depuis /favoris (favori ouvert à droite ou sous la liste) : le dernier ajouté est en tête.
    await vis(page.locator('main a[href^="/favoris?favori="]')).click(); await page.waitForTimeout(800);
    await vis(page.locator('main').getByRole('button', { name: /^Retirer des favoris/ })).click();
    await page.waitForTimeout(1500);
    const n2 = await compter();
    if (n2 !== n0) throw new Error(`retrait KO : ${n0} -> ${n1} -> ${n2}`);
    if (!(n1 > n0)) throw new Error(`favori non ajouté (${n0} -> ${n1})`);
    return `liens favoris ${n0} -> ${n1} -> ${n2}`;
  });
  await L.etape(page, D, 'Bibliothèque : liste -> détail -> retour', async () => {
    await page.goto(BASE + '/mon-espace/bibliotheque', { waitUntil: 'load' });
    await Promise.all([page.waitForURL(/le-faux-secret/), vis(page.locator('main a[href="/mon-espace/bibliotheque/le-faux-secret"]')).click()]);
    await page.waitForTimeout(600);
    const h1 = await page.locator('h1').first().innerText();
    const retour = vis(page.getByRole('link', { name: /Retour/ }));
    if (await retour.count()) { await retour.click(); await page.waitForURL(/\/mon-espace\/bibliotheque$/); } else { await page.goBack(); }
    return `détail « ${h1.replace(/\s+/g, ' ')} » ; retour -> ${page.url().replace(BASE, '')}`;
  });
  await L.etape(page, D, 'S’entraîner : carte du jour -> réponse', async () => {
    await page.goto(BASE + '/mon-espace/s-entrainer', { waitUntil: 'load' }); await page.waitForTimeout(600);
    await vis(page.locator('main').getByRole('button', { name: 'Oui', exact: true })).click(); await page.waitForTimeout(1200);
    return (await page.locator('main').innerText()).slice(0, 160).replace(/\s+/g, ' ');
  });
};
