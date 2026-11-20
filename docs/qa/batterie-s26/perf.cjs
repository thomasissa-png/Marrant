// Temps de chargement (serveur local, mesure simple) + débordement + robots, 4 largeurs, pages clés.
const L = require('./lib.cjs');
const BASE = 'http://localhost:5400';
const PAGES = {
  visiteur: ['/', '/abonnement', '/register', '/login', '/mon-espace/quoi-repondre', '/parcours/repartie', '/cgu', '/retractation'],
  'abonne-en-cours@preversion.test': ['/mon-espace', '/mon-espace/quoi-repondre', '/mon-espace/quoi-repondre/coloc-la-poele', '/mon-espace/bibliotheque', '/mon-espace/s-entrainer', '/parcours', '/favoris', '/profil', '/carnet', '/lettre'],
};
module.exports = async function (browser) {
  for (const w of [375, 768, 1280, 1920]) {
    for (const [qui, pages] of Object.entries(PAGES)) {
      const ctx = await L.contexte(browser, w, BASE); const page = await ctx.newPage();
      if (qui !== 'visiteur') await L.connecter(page, qui);
      for (const c of pages) {
        await page.goto(BASE + c, { waitUntil: 'load' }); // chauffe (1re compilation / cache)
        const v = await L.visiter(page, c);
        const xrobots = (await page.request.get(BASE + c)).headers()['x-robots-tag'] || '';
        const pb = [];
        if (v.debord > 1) pb.push(`débordement ${v.debord}px`);
        if (v.ms > 3000) pb.push(`lent ${v.ms} ms`);
        if (v.h1.length !== 1) pb.push(`${v.h1.length} H1 visibles`);
        const statut = pb.length ? 'FAIL' : 'PASS';
        const cap = statut === 'FAIL' ? await L.capture(page, `perf-${qui.split('@')[0]}-${c}-${w}`) : null;
        L.noter({ public: 'Transverse perf', trajet: `${qui.split('@')[0]} ${c}`, largeur: w, statut, detail: `${pb.join(' ; ') || 'ok'} ; load ${v.ms} ms ; ttfb ${v.ttfb} ms ; robots « ${v.robots} » ; x-robots « ${xrobots} »`, ms: v.ms, ttfb: v.ttfb, robots: v.robots, capture: cap });
      }
      const e = L.erreursReelles(ctx.journal);
      if (e.console.length || e.pageerror.length) L.noter({ public: 'Transverse perf', trajet: `console ${qui.split('@')[0]}`, largeur: w, statut: 'FAIL', detail: JSON.stringify(e).slice(0, 500) });
      await ctx.close();
    }
  }
};
