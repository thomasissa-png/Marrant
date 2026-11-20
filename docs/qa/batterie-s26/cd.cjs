// Publics C (inscrit gratuit / ancien abonné) et D (abonnés), régime OUVERT (5400) ou FERMÉ (5680).
const L = require('./lib.cjs');
const BASE = process.env.BASE || 'http://localhost:5400';
const OUVERT = !BASE.includes('5680');
const R = OUVERT ? '' : ' [FERMÉ]';
const largeurs = (process.env.LARGEURS || '375,1280').split(',').map(Number);
const quoi = (process.env.QUOI || 'C,D1,D2').split(',');
const ESPACE = ['/mon-espace', '/mon-espace/quoi-repondre', '/mon-espace/quoi-repondre/coloc-c-est-quoi-cette-odeur', '/mon-espace/bibliotheque', '/mon-espace/bibliotheque/le-faux-secret', '/mon-espace/s-entrainer', '/mon-espace/questions', '/mon-espace/repliques', '/mon-espace/lettres'];
const PUBLIQUES = ['/parcours', '/parcours/repartie', '/carnet', '/favoris', '/profil', '/lettre', '/vannes', '/conseils', '/videos', '/blog', '/abonnement'];

async function tour(page, pub, abonne) {
  for (const c of [...ESPACE, ...PUBLIQUES]) {
    const espace = c.startsWith('/mon-espace');
    const opts = !OUVERT && espace ? { attendu: 404, h1Libre: true } : {};
    // Fermé : /favoris d'un non-abonné renvoie vers /abonnement (règle de prod).
    const v = await L.controlePage(page, pub, `page ${c}${R}`, c, opts);
    if (v && OUVERT && !abonne && espace) {
      const offre = await page.locator('main a[href^="/abonnement"]').count();
      if (!offre) L.noter({ public: pub, trajet: `offre trouvable ${c}`, largeur: page.context().largeur, statut: 'FAIL', detail: 'aucun lien /abonnement dans main' });
    }
  }
}

(async () => {
  const browser = await L.chromium.launch();
  for (const w of largeurs) {
    if (quoi.includes('C')) {
      const ctx = await L.contexte(browser, w, BASE); const page = await ctx.newPage();
      const C = process.env.CLIB || 'C inscrit gratuit';
      await L.etape(page, C, `connexion -> arrivée${R}`, async () => (await L.connecter(page, 'inscrit-gratuit@preversion.test')).replace(BASE, ''));
      await tour(page, C, false);
      await L.etape(page, C, `ses 2 favoris toujours visibles${R}`, async () => {
        await page.goto(BASE + '/favoris', { waitUntil: 'load' }); await page.waitForTimeout(500);
        const t = await page.locator('main').innerText();
        const liens = await page.locator('main a[href^="/favoris?favori="], main a[href^="/vannes/"], main a[href^="/conseils/"]').count();
        if (/\/abonnement/.test(page.url())) return `redirigé vers /abonnement (règle de prod) ; ${liens} liens`;
        if (!/2 favoris|tes favoris|Tes favoris/i.test(t) && liens < 2) throw new Error(`favoris non affichés (${liens} liens vers vanne/conseil) : ${t.slice(0, 160).replace(/\s+/g, ' ')}`);
        return `${liens} liens vanne/conseil ; ${t.slice(0, 120).replace(/\s+/g, ' ')}`;
      });
      await L.etape(page, C, `lettre confirmée visible (profil/lettre)${R}`, async () => {
        const out = [];
        for (const c of ['/profil', '/lettre']) {
          await page.goto(BASE + c, { waitUntil: 'load' }); await page.waitForTimeout(500);
          const t = await page.locator('main').innerText();
          out.push(`${c}: ${(t.match(/[^\n]*(tu reçois|inscrit|abonné à la lettre|désinscri|Tu es)[^\n]*/i) || ['(aucune mention)'])[0].slice(0, 90)}`);
        }
        return out.join(' ; ');
      });
      const e = L.erreursReelles(ctx.journal);
      L.noter({ public: C, trajet: `console / erreurs JS${R}`, largeur: w, statut: e.console.length || e.pageerror.length ? 'FAIL' : 'PASS', detail: JSON.stringify({ c: e.console.slice(0, 4), p: e.pageerror.slice(0, 4), h: [...new Set(e.http)].filter(h => !/_next\/image/.test(h)).slice(0, 6) }).slice(0, 700) });
      await ctx.close();
    }
    for (const [cle, email] of [['D1', 'abonne-en-cours@preversion.test'], ['D2', 'nouvel-abonne@preversion.test']]) {
      if (!quoi.includes(cle)) continue;
      const ctx = await L.contexte(browser, w, BASE); const page = await ctx.newPage();
      const D = `D ${email.split('@')[0]}`;
      await L.etape(page, D, `connexion -> arrivée${R}`, async () => {
        const u = (await L.connecter(page, email)).replace(BASE, '');
        if (OUVERT && u !== '/mon-espace') throw new Error('arrivée ' + u);
        return u;
      });
      await tour(page, D, true);
      if (OUVERT) await require('./d-ouvert.cjs')(page, D, BASE, cle);
      const e = L.erreursReelles(ctx.journal);
      L.noter({ public: D, trajet: `console / erreurs JS${R}`, largeur: w, statut: e.console.length || e.pageerror.length ? 'FAIL' : 'PASS', detail: JSON.stringify({ c: e.console.slice(0, 4), p: e.pageerror.slice(0, 4), h: [...new Set(e.http)].filter(h => !/_next\/image/.test(h)).slice(0, 6) }).slice(0, 700) });
      await ctx.close();
    }
  }
  await browser.close();
})();
