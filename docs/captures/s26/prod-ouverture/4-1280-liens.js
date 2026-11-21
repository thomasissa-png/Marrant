// Passage rapide en 1280, lecteur YouTube des fiches remplacées (erreur du lecteur ?), puis statuts de tous les liens
// internes relevés sur les pages visitées (GET, une fois par chemin), et sitemap. Lecture seule.
const fs = require('fs');
const { BASE, DIR, compteur, ouvrir, suivreConsole, visiter, ecrire } = require('./lib');

const PAGES = [['/', '16-accueil-1280.png'], ['/mon-espace', null], ['/mon-espace/quoi-repondre', '17-quoi-repondre-1280.png'], ['/abonnement', null],
  ['/register?callbackUrl=%2Fabonnement&src=abonnement', '18-register-1280.png']];
const v3 = JSON.parse(fs.readFileSync(DIR + '/res-3-videos.json', 'utf8')).res;

(async () => {
  const { browser, context } = await ouvrir(1280);
  const page = await context.newPage();
  const err = []; suivreConsole(page, err);
  const res = [];
  for (const [c, cap] of PAGES) {
    const r = await visiter(page, c, null, res);
    if (c === '/mon-espace/quoi-repondre') {
      await page.locator('[data-tuile-fermee]').first().click({ force: true });
      await page.waitForTimeout(3600);
      r.focus = await page.evaluate(() => document.activeElement?.innerText?.replace(/\s+/g, ' ').trim());
    }
    if (c.startsWith('/register')) r.retractation = await page.evaluate(() => [...document.querySelectorAll('a[href="/retractation"]')].map((a) => a.innerText.trim() + (a.offsetParent ? '' : ' (caché)')));
    if (cap) await page.screenshot({ path: DIR + '/' + cap });
  }
  const lecteurs = [];
  for (const v of v3) {
    const r = await visiter(page, v.urlFinale, v.nom === 'Gad Elmaleh' ? '19-video-gad-1280.png' : null, res);
    await page.waitForTimeout(3000);
    const fr = page.frames().find((f) => /youtube(-nocookie)?\.com\/embed\//.test(f.url()));
    let etat = 'iframe absente';
    if (fr) {
      etat = await fr.evaluate(() => {
        const e = document.querySelector('.ytp-error, .ytp-error-content');
        const vis = e && e.offsetParent !== null;
        return (vis ? 'ERREUR LECTEUR : ' + e.innerText.replace(/\s+/g, ' ').slice(0, 160) : 'lecteur sans erreur')
          + ' | titre=' + (document.querySelector('.ytp-title-link')?.innerText || document.title || '').slice(0, 80);
      }).catch((e) => 'cadre illisible : ' + String(e).slice(0, 80));
    }
    lecteurs.push({ nom: v.nom, sw: r.scrollWidth, etat });
  }
  // Statuts des liens internes (une requête par chemin, requêtes sans session).
  const vus = new Map(res.map((r) => [r.chemin.split('?')[0], r.statut]));
  for (const f of ['res-1-trajet-375.json', 'res-2-espace-legal-auth-375.json']) {
    for (const r of JSON.parse(fs.readFileSync(DIR + '/' + f, 'utf8')).res) if (r.statut) vus.set(r.chemin.split('?')[0], r.statut);
  }
  const tous = new Set();
  const sources = [res, ...['res-1-trajet-375.json', 'res-2-espace-legal-auth-375.json'].map((f) => JSON.parse(fs.readFileSync(DIR + '/' + f, 'utf8')).res)].flat();
  for (const r of sources) for (const l of r.liens || []) tous.add(l.replace(BASE, ''));
  const parChemin = new Map();
  for (const l of tous) { const p = l.split('?')[0]; if (!parChemin.has(p)) parChemin.set(p, l); }
  const liens = [];
  for (const [p, l] of parChemin) {
    if (vus.has(p) && p !== '/mon-espace/bonus' && p !== '/resiliation') { liens.push({ lien: l, statut: vus.get(p), via: 'page visitée' }); continue; }
    compteur.apiGet++;
    const x = await context.request.get(BASE + l, { maxRedirects: 5 }).catch((e) => ({ status: () => 'ERR ' + e.message.slice(0, 60), url: () => '' }));
    liens.push({ lien: l, statut: x.status(), final: x.url().replace(BASE, '') });
  }
  compteur.apiGet++;
  const sm = await (await context.request.get(BASE + '/sitemap.xml')).text();
  const smInfo = { urls: (sm.match(/<loc>/g) || []).length, monEspace: (sm.match(/mon-espace/g) || []).length,
    anciensSlugs: (sm.match(/laura-domenge-jamel-comedy-club|gad-elmaleh-decalages|kev-adams-du-cote|thomas-ngijol-au-jamel|ngijol-le-voisin|eboue-plus-rien/g) || []),
    nouveaux: (sm.match(/laura-domenge-se-remettre|gad-elmaleh-la-visite|kev-adams-le-tennis|ngijol-superman|eboue-les-vegans/g) || []) };
  ecrire('res-4-1280-liens.json', { res, lecteurs, liens, smInfo, err, compteur });
  for (const r of res.slice(0, 5)) console.log(r.chemin, r.statut, 'sw=' + r.scrollWidth + '/' + r.largeur, 'robots=' + r.robots, 'h1=' + JSON.stringify(r.h1), 'TO=' + JSON.stringify(r.toutOuvrir), r.focus ? 'focus=' + r.focus : '', r.retractation ? 'retr=' + JSON.stringify(r.retractation) : '');
  console.log(JSON.stringify(lecteurs, null, 1));
  console.log('liens', liens.length, 'KO', JSON.stringify(liens.filter((l) => !(l.statut >= 200 && l.statut < 400))));
  console.log('sitemap', JSON.stringify(smInfo));
  console.log('console', JSON.stringify(err.filter((e) => !/BLOCKED_BY_CLIENT/.test(e.texte)), null, 1));
  console.log('nav', compteur.navigations, 'api', compteur.apiGet, 'bloquees', [...new Set(compteur.bloquees.map((b) => b.split('?')[0]))]);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
