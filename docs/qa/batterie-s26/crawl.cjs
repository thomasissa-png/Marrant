// Crawl limité des liens internes : abonné depuis /mon-espace, gratuit et visiteur depuis les rubriques de l'espace.
const L = require('./lib.cjs');
const BASE = 'http://localhost:5400';
const MAX = Number(process.env.CRAWL_MAX || 220);
module.exports = async function (browser) {
  for (const [qui, depart] of [['abonne-en-cours@preversion.test', ['/mon-espace', '/mon-espace/quoi-repondre', '/mon-espace/bibliotheque', '/mon-espace/s-entrainer', '/favoris', '/profil', '/mon-espace/questions', '/mon-espace/repliques', '/mon-espace/lettres', '/carnet']], ['inscrit-gratuit@preversion.test', ['/mon-espace', '/mon-espace/quoi-repondre', '/mon-espace/bibliotheque', '/favoris', '/profil']], ['visiteur', ['/', '/mon-espace', '/mon-espace/quoi-repondre', '/mon-espace/bibliotheque', '/mon-espace/s-entrainer', '/abonnement', '/register']]]) {
    const ctx = await L.contexte(browser, 1280, BASE); const page = await ctx.newPage();
    if (qui !== 'visiteur') await L.connecter(page, qui);
    const vus = new Map(); const file = depart.map(c => [c, 'départ']); const casses = [];
    while (file.length && vus.size < MAX) {
      const [c, de] = file.shift(); const cle = c.split('#')[0];
      if (vus.has(cle) || /\/api\/|\/admin|signout|\.(png|jpg|svg|xml|txt|pdf)$/.test(cle)) continue;
      const r = await page.request.get(BASE + cle, { maxRedirects: 5 }).catch(e => null);
      const st = r ? r.status() : 0; vus.set(cle, st);
      if (st >= 400 || st === 0) { casses.push(`${st} ${cle} (depuis ${de})`); continue; }
      // On ne suit que l'espace et les pages qui y mènent (profondeur limitée par MAX).
      if (!/^\/(mon-espace|favoris|profil|carnet|parcours|lettre|abonnement)?/.test(cle)) continue;
      if (!(r.headers()['content-type'] || '').includes('text/html')) continue;
      const html = await r.text();
      for (const m of html.matchAll(/href="(\/[^"#]*)(#[^"]*)?"/g)) {
        const h = m[1].replace(/&amp;/g, '&');
        if (h.startsWith('/_next') || vus.has(h)) continue;
        if (/^\/(mon-espace|favoris|profil|carnet|parcours|lettre|abonnement|cgu|retractation|resiliation|confidentialite|mentions-legales|vannes\/|conseils\/|videos\/)/.test(h) || h === '/') file.push([h, cle]);
      }
    }
    // Ancre #etape-N : vérifiées à part sur les parcours (l'ancre doit exister).
    L.noter({ public: 'Transverse crawl', trajet: `liens internes (${qui.split('@')[0]})`, largeur: 1280, statut: casses.length ? 'FAIL' : 'PASS', detail: `${vus.size} adresses, ${casses.length} cassées${casses.length ? ' : ' + casses.slice(0, 8).join(' ; ') : ''}` });
    await ctx.close();
  }
};
