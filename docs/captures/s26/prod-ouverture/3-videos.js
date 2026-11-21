// Fiches /videos des vidéos remplacées (s26) : statut, iframe YouTube, anciennes adresses (308), oEmbed public. Lecture seule.
const { BASE, compteur, ouvrir, suivreConsole, ecrire } = require('./lib');

const ACC = { à: 'a', â: 'a', ä: 'a', á: 'a', ã: 'a', é: 'e', è: 'e', ê: 'e', ë: 'e', î: 'i', ï: 'i', í: 'i', ô: 'o', ö: 'o', ó: 'o', õ: 'o', ù: 'u', û: 'u', ü: 'u', ú: 'u', ç: 'c', ñ: 'n', œ: 'oe', æ: 'ae' };
function slug(t, id) { // copie de slugifyText + buildCatalogueSlug (src/lib/catalogue-slug.ts)
  let c = t.toLowerCase().replace(/[àâäáãéèêëîïíôöóõùûüúçñœæ]/g, (x) => ACC[x] ?? x).replace(/['`’"“”]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (c.length > 60) { const tr = c.slice(0, 60); const d = tr.lastIndexOf('-'); c = d > 30 ? tr.slice(0, d) : tr; }
  return `${c}-${id.slice(0, 10)}`;
}
// id10 relevés dans /sitemap.xml de production (21/11).
const VIDEOS = [
  { nom: 'Domenge', id: 'cmmp8p0zu0', yt: 'W7i0KRn_GLY', titre: 'Laura Domenge - Se remettre avec son ex', anciens: ['Laura Domenge - Jamel Comedy Club', 'Laura Domenge - La vie de couple'] },
  { nom: 'Gad Elmaleh', id: 'cmmp8p3dw0', yt: 'BY8kpWBf57M', titre: "Gad Elmaleh - La visite d'appartement (La vie normale)", anciens: ['Gad Elmaleh - Décalages (spectacle complet 1997)'] },
  { nom: 'Kev Adams', id: 'cmmp8p0fd0', yt: 'fSMhy3-7Xpk', titre: 'Kev Adams - Le tennis', anciens: ['Kev Adams - Du côté de chez vous'] },
  { nom: 'Ngijol', id: 'cmmp8p0xs0', yt: 'l__Xirj2N6c', titre: 'Thomas Ngijol - Superman (Jamel Comedy Club)', anciens: ['Thomas Ngijol au Jamel Comedy Club', 'Thomas Ngijol - Le voisin'] },
  { nom: 'Éboué', id: 'cmmp8p3hw0', yt: 'gBILqA2eVrk', titre: 'Fabrice Éboué - Les vegans (Plus rien à perdre)', anciens: ['Fabrice Éboué - Plus rien à perdre (spectacle complet)'] },
  { nom: 'Bun Hay Mean (titre gardé)', id: 'cmmp8p1dx0', yt: 'PaF0YbHim2E', titre: 'Bun Hay Mean - Le Chinois marrant', anciens: [] },
  { nom: 'Fellag (titre gardé)', id: 'cmmp8p3fw0', yt: 'z563EqfnqQE', titre: 'Fellag - Petits chocs des civilisations', anciens: [] },
];

(async () => {
  const { browser, context } = await ouvrir(375);
  const page = await context.newPage();
  const err = []; suivreConsole(page, err);
  const res = [];
  for (const v of VIDEOS) {
    const r = { nom: v.nom, nouveau: '/videos/' + slug(v.titre, v.id), anciens: [] };
    compteur.navigations++;
    const rep = await page.goto(BASE + r.nouveau, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);
    r.statut = rep.status(); r.urlFinale = page.url().replace(BASE, '');
    Object.assign(r, await page.evaluate(() => ({
      h1: [...document.querySelectorAll('h1')].map((e) => e.innerText.trim()),
      iframes: [...document.querySelectorAll('iframe')].map((f) => f.src || f.dataset.src || ''),
      ytMentions: [...new Set((document.documentElement.innerHTML.match(/(?:embed\/|watch\?v=|vi\/|youtu\.be\/)([\w-]{11})/g) || []))].slice(0, 8),
      parcours: /Dans un parcours/i.test(document.body.innerText),
      sw: document.documentElement.scrollWidth,
    })));
    if (v.nom === 'Domenge') await page.screenshot({ path: __dirname + '/15-video-domenge-375.png' });
    for (const a of v.anciens) {
      const chemin = '/videos/' + slug(a, v.id);
      compteur.apiGet++;
      const x = await context.request.get(BASE + chemin, { maxRedirects: 0 });
      r.anciens.push({ chemin, statut: x.status(), location: (x.headers().location || '').replace(BASE, '') });
    }
    compteur.apiGet++;
    const o = await context.request.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.yt}&format=json`, { maxRedirects: 0 });
    let oj = null; try { oj = await o.json(); } catch {}
    r.oembed = { statut: o.status(), titre: oj?.title, chaine: oj?.author_name };
    res.push(r);
    console.log(JSON.stringify(r));
  }
  ecrire('res-3-videos.json', { res, err, compteur });
  console.log('console', JSON.stringify(err.filter((e) => !/BLOCKED_BY_CLIENT/.test(e.texte)), null, 1));
  console.log('nav', compteur.navigations, 'api', compteur.apiGet, 'bloquees', compteur.bloquees.length, [...new Set(compteur.bloquees.map((b) => b.split('?')[0]))]);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
