// Transverses : auth, mot de passe oublié, 404, temps, débordement, noindex, crawl limité.
const L = require('./lib.cjs');
const BASE = 'http://localhost:5400';
const T = 'Transverse';
const quoi = (process.env.QUOI || 'auth,mdp,404,perf,crawl').split(',');

(async () => {
  const browser = await L.chromium.launch();
  if (quoi.includes('auth')) {
    const ctx = await L.contexte(browser, 375, BASE); const page = await ctx.newPage();
    await L.etape(page, T, '/login mauvais mot de passe : message, pas d’énumération', async () => {
      const msgs = [];
      for (const email of ['abonne-en-cours@preversion.test', 'inconnu-batterie@preversion.test']) {
        await page.goto(BASE + '/login', { waitUntil: 'load' });
        await page.fill('#email', email); await page.fill('#password', 'mauvais-mdp-123');
        await page.getByRole('button', { name: 'Se connecter', exact: true }).click(); await page.waitForTimeout(2500);
        msgs.push((await page.locator('[role=alert], .text-red-400, .text-destructive').filter({ visible: true }).allInnerTexts()).join(' ').trim());
      }
      if (!msgs[0]) throw new Error('aucun message d’erreur');
      if (msgs[0] !== msgs[1]) throw new Error(`messages différents (énumération) : « ${msgs[0]} » / « ${msgs[1]} »`);
      return `« ${msgs[0]} »`;
    });
    await L.etape(page, T, '/register entrées adversariales (e-mail invalide, mdp court, e-mail existant, 10 000 car.)', async () => {
      const out = [];
      for (const [email, mdp] of [['pas-un-email', 'motdepasse-long-1'], ['court-batterie@preversion.test', '123'], ['abonne-en-cours@preversion.test', 'motdepasse-long-1'], ['x'.repeat(10000) + '@preversion.test', 'motdepasse-long-1'], ['<svg onload=alert(1)>@preversion.test', 'motdepasse-long-1']]) {
        await page.goto(BASE + '/register', { waitUntil: 'load' });
        await page.fill('#email', email); await page.fill('#password', mdp);
        await page.getByRole('button', { name: /Créer mon compte/ }).click(); await page.waitForTimeout(2000);
        const invalide = await page.evaluate(() => [...document.querySelectorAll('input')].filter(i => !i.checkValidity()).map(i => i.validationMessage).join(' '));
        const msg = (await page.locator('[role=alert], .text-red-400, .text-destructive').filter({ visible: true }).allInnerTexts()).join(' ').trim();
        const u = page.url().replace(BASE, '');
        out.push(`${email.slice(0, 22)}… -> ${u.startsWith('/register') ? 'reste' : u} « ${(msg || invalide || 'aucun message').slice(0, 90)} »`);
        if (!u.startsWith('/register')) throw new Error('entrée acceptée : ' + out.join(' | '));
      }
      return out.join(' | ');
    });
    await ctx.close();
  }
  if (quoi.includes('mdp')) {
    const ctx = await L.contexte(browser, 1280, BASE); const page = await ctx.newPage();
    const email = 'inscrit-gratuit@preversion.test';
    let lien = null;
    await L.etape(page, T, 'mot de passe oublié : demande, même message si inconnu, e-mail reçu', async () => {
      const msgs = [];
      const avant = L.mails().length;
      for (const e of [email, 'inconnu-batterie@preversion.test']) {
        await page.goto(BASE + '/forgot-password', { waitUntil: 'load' });
        await page.fill('#email', e); await page.getByRole('button', { name: 'Envoyer le lien' }).click(); await page.waitForTimeout(2500);
        msgs.push((await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 160));
      }
      const m = L.mails().slice(avant).filter(x => [x.to].flat().includes(email));
      if (!m.length) throw new Error('aucun e-mail de réinitialisation');
      const corps = (m[0].text || '') + (m[0].html || '');
      lien = (corps.match(/https?:\/\/[^\s"<]+reset-password[^\s"<]*/) || [null])[0];
      if (!lien) throw new Error('lien absent de l’e-mail « ' + m[0].subject + ' »');
      if (msgs[0] !== msgs[1]) throw new Error(`messages différents (énumération) : ${msgs.join(' / ')}`);
      return `« ${m[0].subject} » ; lien vers ${new URL(lien).host}${new URL(lien).pathname} ; message identique`;
    });
    await L.etape(page, T, 'réinitialisation par le lien reçu puis connexion', async () => {
      if (!lien) throw new Error('BLOQUE : pas de lien');
      const u = new URL(lien); await page.goto(BASE + u.pathname + u.search, { waitUntil: 'load' });
      const champs = page.locator('main input[type=password]');
      for (let i = 0; i < await champs.count(); i++) await champs.nth(i).fill('nouveau-mdp-batterie-s26');
      await page.locator('main button[type=submit], main button').filter({ hasText: /réinitialiser|enregistrer|valider|changer|modifier/i }).first().click();
      await page.waitForTimeout(3000);
      const msg = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 140);
      const arrivee = await L.connecter(page, email, 'nouveau-mdp-batterie-s26');
      // Ancien lien : doit être refusé.
      const p2 = await ctx.newPage(); await p2.goto(BASE + u.pathname + u.search, { waitUntil: 'load' });
      return `après : « ${msg} » ; connexion -> ${arrivee.replace(BASE, '')}`;
    });
    await ctx.close();
  }
  if (quoi.includes('404')) {
    const ctx = await L.contexte(browser, 375, BASE); const page = await ctx.newPage();
    await L.controlePage(page, T, '404 /page-qui-n-existe-pas (visiteur)', '/page-qui-n-existe-pas', { attendu: 404 });
    await L.connecter(page, 'abonne-en-cours@preversion.test');
    await L.controlePage(page, T, '404 /mon-espace/quoi-repondre/inexistante (abonné)', '/mon-espace/quoi-repondre/situation-inexistante', { attendu: 404 });
    await L.controlePage(page, T, '404 /mon-espace/bibliotheque/inexistante (abonné)', '/mon-espace/bibliotheque/fiche-inexistante', { attendu: 404 });
    await L.controlePage(page, T, '404 /mon-espace/questions/inexistant (abonné)', '/mon-espace/questions/fil-inexistant', { attendu: 404 });
    await L.etape(page, T, 'IDOR : fil de question d’un autre abonné', async () => {
      const ctx2 = await L.contexte(browser, 375, BASE); const p2 = await ctx2.newPage();
      await L.connecter(p2, 'nouvel-abonne@preversion.test');
      const r = await p2.goto(BASE + '/mon-espace/questions/prev-fil-1'); const st = r.status();
      const t = await p2.locator('main').innerText(); await ctx2.close();
      if (st === 200 && /test/i.test(t) && !/introuvable|n.existe/i.test(t)) throw new Error('fil d’un autre lisible (HTTP 200)');
      return `HTTP ${st}`;
    });
    await ctx.close();
  }
  if (quoi.includes('perf')) await require('./perf.cjs')(browser);
  if (quoi.includes('crawl')) await require('./crawl.cjs')(browser);
  await browser.close();
})();
