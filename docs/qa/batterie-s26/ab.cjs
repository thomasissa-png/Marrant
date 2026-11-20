// Publics A (visiteur -> inscription) et B (nouvel inscrit gratuit), régime OUVERT (5400).
const L = require('./lib.cjs');
const BASE = 'http://localhost:5400';
const largeurs = (process.env.LARGEURS || '375,1280').split(',').map(Number);

async function ouvrirNav(page, nom) {
  const lien = page.locator('header').getByRole('link', { name: new RegExp('^' + nom) }).first();
  if (await lien.isVisible().catch(() => false)) return lien.click();
  await page.locator('header').getByRole('button', { name: /^Menu/ }).first().click();
  await page.getByRole('link', { name: new RegExp('^' + nom) }).filter({ visible: true }).first().click();
}

(async () => {
  const browser = await L.chromium.launch();
  for (const w of largeurs) {
    const ctx = await L.contexte(browser, w, BASE);
    const page = await ctx.newPage();
    const email = `batterie-${Date.now()}-${w}@preversion.test`;
    const A = 'A visiteur';
    await L.controlePage(page, A, 'accueil /', '/');
    await L.etape(page, A, 'accueil -> rubrique Quoi répondre (nav)', async () => {
      await Promise.all([page.waitForURL(/\/mon-espace\/quoi-repondre/), ouvrirNav(page, 'Quoi répondre')]);
      await page.waitForLoadState('load');
      const h1 = await page.locator('h1').first().innerText();
      if (!/Quoi répondre/.test(h1)) throw new Error('H1 ' + h1);
      return 'aperçu ' + page.url().replace(BASE, '');
    });
    await L.etape(page, A, 'clic tuile fermée -> signal offre', async () => {
      const tuile = page.locator('[data-tuile-fermee]').filter({ visible: true }).first();
      await tuile.scrollIntoViewIfNeeded();
      const bb = await tuile.boundingBox();
      if (!bb) throw new Error('aucune tuile fermée visible');
      await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
      await page.waitForTimeout(700);
      const etat = await page.evaluate(() => ({ signal: !!document.querySelector('[data-signal]'), focus: document.activeElement?.innerText?.trim(), url: location.pathname }));
      if (!etat.signal && !/Tout ouvrir/.test(etat.focus || '') && !/abonnement/.test(etat.url)) throw new Error('aucune réaction au clic (pas de signal, pas de focus offre) ' + JSON.stringify(etat));
      return `signal=${etat.signal} focus=« ${etat.focus} »`;
    });
    await L.etape(page, A, 'offre « Tout ouvrir » -> /abonnement', async () => {
      await Promise.all([page.waitForURL(/\/abonnement/), page.getByRole('link', { name: /Tout ouvrir/ }).filter({ visible: true }).first().click()]);
      await page.waitForLoadState('load');
      const t = await page.locator('main').innerText();
      if (!/1,99/.test(t) || !/16,99/.test(t)) throw new Error('prix absents');
      return page.url().replace(BASE, '');
    });
    await L.etape(page, A, '/abonnement : liens CGV / renonciation / résiliation', async () => {
      const liens = await page.evaluate(() => [...document.querySelectorAll('a')].map(a => a.getAttribute('href')));
      const manque = ['/cgu', '/retractation'].filter(h => !liens.some(l => l && l.startsWith(h)));
      for (const h of ['/cgu', '/retractation']) { const r = await page.request.get(BASE + h); if (r.status() !== 200) throw new Error(`${h} -> ${r.status()}`); }
      const resil = (await page.request.get(BASE + '/resiliation')).status();
      const t = await page.locator('main').innerText();
      const mentions = ['rembours', 'Résiliable', 'Stripe'].filter(x => t.includes(x)).join(',');
      if (manque.length) throw new Error('liens absents de /abonnement : ' + manque.join(', ') + ` (pages en 200) ; /resiliation=${resil} ; mentions=${mentions} ; liens légaux=${liens.filter(l => /cgu|retract|resil|mentions|confid/.test(l || '')).join(' ')}`);
      return `liens présents ; /resiliation=${resil} ; mentions=${mentions}`;
    });
    await L.etape(page, A, '/abonnement -> S’abonner -> /register', async () => {
      await Promise.all([page.waitForURL(/\/register/), page.getByRole('link', { name: /S.abonner/ }).filter({ visible: true }).first().click()]);
      return page.url().replace(BASE, '');
    });
    await L.etape(page, A, '/register : liens CGV / renonciation depuis le tunnel', async () => {
      const liens = await page.evaluate(() => [...document.querySelectorAll('main a, form a')].map(a => a.getAttribute('href')));
      const manque = ['/cgu', '/retractation'].filter(h => !liens.some(l => l && l.startsWith(h)));
      if (manque.length) throw new Error('absents de /register : ' + manque.join(', '));
      return liens.filter(l => /cgu|retract|resil/.test(l || '')).join(' ');
    });
    let apresInscription = '';
    await L.etape(page, A, `/register : compte neuf ${email}`, async () => {
      await page.fill('#email', email); await page.fill('#password', 'batterie-s26-motdepasse');
      const cases = page.locator('form input[type=checkbox]'); for (let i = 0; i < await cases.count(); i++) await cases.nth(i).check();
      await page.getByRole('button', { name: /Créer mon compte/ }).click();
      await page.waitForURL(u => !u.pathname.startsWith('/register'), { timeout: 30000 });
      await page.waitForTimeout(1500);
      await L.capture(page, `B-apres-inscription-1s5-${w}`);
      const toast = await page.locator('[role=status], [role=alert], [data-sonner-toast], li[role]').filter({ visible: true }).allInnerTexts().catch(() => []);
      await page.waitForTimeout(4500);
      const err = await page.locator('[role=alert], .text-red-400, .text-destructive').filter({ visible: true }).allInnerTexts();
      apresInscription = `${page.url().replace(BASE, '')} | toast à 1,5 s: ${toast.join(' / ').replace(/\s+/g, ' ') || 'aucun'} | alerte à 6 s: ${err.join(' / ') || 'aucune'}`;
      return apresInscription;
    });
    await L.capture(page, `B-apres-inscription-tunnel-${w}`);
    await L.etape(page, A, 'e-mail de bienvenue (faux Resend)', async () => {
      await page.waitForTimeout(2000);
      const m = L.mails().filter(x => [x.to].flat().includes(email));
      if (!m.length) throw new Error('BLOQUE : aucun e-mail à l’inscription gratuite (par conception : la bienvenue Premium part du webhook Stripe) pour ' + email);
      const out = [];
      for (const x of m) {
        const hrefs = [...new Set([...(x.html || '').matchAll(/href="([^"]+)"/g)].map(y => y[1].replace(/&amp;/g, '&')))];
        const ko = [];
        for (const h of hrefs) {
          if (/^mailto:/.test(h)) continue;
          const u = new URL(h, BASE); const local = BASE + u.pathname + u.search;
          if (!/localhost|deviens-marrant\.fr/.test(u.host)) { ko.push('externe:' + u.host); continue; }
          const r = await page.request.get(local, { maxRedirects: 5 }); if (r.status() >= 400) ko.push(`${r.status()} ${u.pathname}`);
        }
        const brut = /undefined|\{\{|null/.test((x.html || '') + (x.subject || ''));
        out.push(`« ${x.subject} » ${hrefs.length} liens${ko.length ? ' KO: ' + ko.join(',') : ''}${brut ? ' TEXTE BRUT' : ''} hôtes=${[...new Set(hrefs.map(h => { try { return new URL(h).host; } catch { return 'rel'; } }))].join(',')}`);
        if (ko.filter(k => !k.startsWith('externe')).length || brut) throw new Error(out.join(' || '));
      }
      return out.join(' || ');
    });
    // B : nouvel inscrit gratuit (même contexte, session ouverte après inscription)
    const B = 'B nouvel inscrit';
    for (const [nom, chemin] of [['Aujourd’hui', '/mon-espace'], ['Parcours (liste)', '/parcours'], ['Parcours Répartie', '/parcours/repartie'], ['Quoi répondre (aperçu)', '/mon-espace/quoi-repondre'], ['Bibliothèque (aperçu)', '/mon-espace/bibliotheque'], ['S’entraîner (aperçu)', '/mon-espace/s-entrainer'], ['Carnet', '/carnet'], ['Favoris', '/favoris'], ['Profil', '/profil'], ['La lettre', '/lettre'], ['Mes questions', '/mon-espace/questions'], ['Mes répliques', '/mon-espace/repliques']]) {
      await L.controlePage(page, B, nom, chemin);
    }
    await L.etape(page, B, 'Parcours Répartie : étape 1 gratuite ouverte', async () => {
      await page.goto(BASE + '/parcours/repartie#etape-1', { waitUntil: 'load' });
      const t = await page.locator('main').innerText();
      if (/réservé|Premium/i.test(t.slice(0, 300)) && !/gratuit/i.test(t)) throw new Error('étape 1 semble fermée');
      const btn = page.getByRole('button', { name: /Commencer|Valider|Fait|J.ai fait/i }).filter({ visible: true }).first();
      return `boutons: ${(await page.locator('main button').filter({ visible: true }).allInnerTexts()).slice(0, 6).join(' | ').replace(/\s+/g, ' ')} ; « gratuit » ${/gratuit/i.test(t) ? 'présent' : 'absent'} ; bouton action ${await btn.count()}`;
    });
    await L.etape(page, B, 'La lettre : inscription', async () => {
      await page.goto(BASE + '/lettre', { waitUntil: 'load' });
      const avant = L.mails().length;
      const champ = page.locator('main input[type=email]').filter({ visible: true }).first();
      if (await champ.count()) await champ.fill(email);
      const cases = page.locator('main input[type=checkbox]').filter({ visible: true }); for (let i = 0; i < await cases.count(); i++) await cases.nth(i).check();
      await page.locator('main').getByRole('button', { name: /inscri|recevoir|abonne|lettre/i }).filter({ visible: true }).first().click();
      await page.waitForTimeout(3000);
      const msg = (await page.locator('main').innerText()).match(/[^\n]*(merci|c.est noté|confirm|inscrit|vérifie|boîte)[^\n]*/i);
      const m = L.mails().slice(avant).filter(x => [x.to].flat().includes(email));
      if (!msg && !m.length) throw new Error('aucun retour visible ni e-mail');
      return `message: ${msg ? msg[0].slice(0, 90) : 'aucun'} ; e-mails: ${m.map(x => x.subject).join(' / ') || 'aucun'}`;
    });
    await L.etape(page, B, 'déconnexion puis reconnexion', async () => {
      await page.goto(BASE + '/api/auth/signout', { waitUntil: 'load' });
      await page.getByRole('button', { name: /sign out|déconnex/i }).first().click().catch(() => {});
      await page.waitForTimeout(1500);
      const r = await page.request.get(BASE + '/api/auth/session'); const s = await r.json();
      if (s && s.user) throw new Error('toujours connecté');
      const arrivee = await L.connecter(page, email, 'batterie-s26-motdepasse');
      return 'arrivée après connexion ' + arrivee.replace(BASE, '');
    });
    await L.etape(page, B, 'tentative de paiement (connecté) depuis /abonnement', async () => {
      await page.goto(BASE + '/abonnement', { waitUntil: 'load' });
      const req = [];
      page.on('response', r => { if (/api\/stripe/.test(r.url())) req.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
      const cta = page.locator('main').getByRole('button', { name: /S.abonner|Payer|Continuer|Tout ouvrir/ }).filter({ visible: true }).first();
      if (await cta.count()) await cta.click(); else await page.locator('main').getByRole('link', { name: /S.abonner/ }).filter({ visible: true }).first().click();
      await page.waitForTimeout(1200);
      await L.capture(page, `B-paiement-toast-${w}`);
      const toast = await page.locator('[role=status], [role=alert], [data-sonner-toast], li[role]').filter({ visible: true }).allInnerTexts().catch(() => []);
      await page.waitForTimeout(4800);
      const err = toast.join(' / ');
      const msg = err.replace(/\s+/g, ' ');
      const morte = (await page.locator('h1').count()) === 0;
      if (morte) throw new Error('page morte après clic paiement ' + page.url());
      return `URL ${page.url().replace(BASE, '')} ; API ${req.join(', ') || 'aucun appel'} ; message « ${msg.slice(0, 120)} »`;
    });
    const e = L.erreursReelles(ctx.journal);
    L.noter({ public: 'A+B', trajet: 'console / erreurs JS / HTTP>=400', largeur: w, statut: e.console.length || e.pageerror.length ? 'FAIL' : 'PASS', detail: JSON.stringify({ c: e.console.slice(0, 5), p: e.pageerror.slice(0, 5), h: [...new Set(e.http)].slice(0, 8), ext: [...ctx.journal.externes] }).slice(0, 900) });
    await ctx.close();
  }
  await browser.close();
})();
