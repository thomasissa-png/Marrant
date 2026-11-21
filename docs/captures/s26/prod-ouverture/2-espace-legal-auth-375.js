// Aperçus visiteur de l'espace, pages légales, /login et mot de passe oublié, à 375 px. Lecture seule, aucun envoi.
const { BASE, compteur, ouvrir, suivreConsole, visiter, ecrire } = require('./lib');

const ESPACE = [
  ['/mon-espace', '07-mon-espace-375.png'],
  ['/mon-espace/quoi-repondre', null],
  ['/mon-espace/bibliotheque', '08-bibliotheque-375.png'],
  ['/mon-espace/s-entrainer', '09-s-entrainer-375.png'],
  ['/mon-espace/questions', '10-questions-375.png'],
  ['/mon-espace/repliques', '11-repliques-375.png'],
  ['/carnet', '12-carnet-375.png'],
  ['/parcours', null],
  ['/favoris', '13-favoris-375.png'],
  ['/mon-espace/lettres', null],
  ['/mon-espace/bonus', null],
];
const LEGAL = ['/cgu', '/confidentialite', '/retractation', '/resiliation'];
const AUTH = [['/login', '14-login-375.png'], ['/forgot-password', null]];

(async () => {
  const { browser, context } = await ouvrir(375);
  const page = await context.newPage();
  const err = []; suivreConsole(page, err);
  const res = [];
  for (const [c, cap] of ESPACE) {
    const r = await visiter(page, c, cap, res);
    Object.assign(r, await page.evaluate(() => {
      const t = document.body.innerText;
      return {
        tuiles: document.querySelectorAll('[data-tuile-fermee]').length,
        offreHaut: !!document.querySelector('a[data-position="haut"][href^="/abonnement"]'),
        liensAbonnement: document.querySelectorAll('a[href^="/abonnement"]').length,
        deconnexion: /Déconnexion|Se déconnecter/i.test(t),
        emails: (t.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || []).filter((e) => e !== 'contact@deviens-marrant.fr'),
        connexionVisible: [...document.querySelectorAll('a[href^="/login"]')].some((a) => a.offsetParent !== null),
        debordants: [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(e).position !== 'fixed').slice(0, 3).map((e) => e.tagName + '.' + String(e.className).slice(0, 40)),
      };
    }));
  }
  for (const c of LEGAL) {
    const r = await visiter(page, c, null, res);
    r.date20nov = await page.evaluate(() => /20 novembre 2026/.test(document.body.innerText));
    r.dates = await page.evaluate(() => [...new Set(document.body.innerText.match(/\d{1,2}(er)? (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) 20\d\d/g) || [])].slice(0, 6));
  }
  for (const [c, cap] of AUTH) {
    const r = await visiter(page, c, cap, res);
    r.formulaire = await page.evaluate(() => ({
      champs: [...document.querySelectorAll('input')].map((i) => i.type + ':' + (i.name || i.id)),
      boutons: [...document.querySelectorAll('button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean),
      lienOubli: [...document.querySelectorAll('a[href]')].filter((a) => /forgot|oubli/i.test(a.href + a.innerText)).map((a) => a.getAttribute('href')),
    }));
  }
  ecrire('res-2-espace-legal-auth-375.json', { res, err, compteur });
  for (const r of res) {
    console.log([r.chemin, r.statut, '→' + r.urlFinale, 'robots=' + r.robots, 'xrobots=' + r.xRobots, 'cc=' + (r.cacheControl || '').slice(0, 30),
      'h1=' + JSON.stringify(r.h1), 'sw=' + r.scrollWidth, '1500=' + r.a1500, 'prem=' + r.premium, 'TO=' + r.toutOuvrir.length,
      'tuiles=' + r.tuiles, 'offreHaut=' + r.offreHaut, 'abo=' + r.liensAbonnement, 'deco=' + r.deconnexion, 'mails=' + JSON.stringify(r.emails),
      'undef=' + r.undefinedVisible, r.debordants && r.debordants.length ? 'DEBORD=' + JSON.stringify(r.debordants) : '',
      r.date20nov !== undefined ? 'date20=' + r.date20nov + ' ' + JSON.stringify(r.dates) : '', r.formulaire ? JSON.stringify(r.formulaire) : ''].join(' | '));
  }
  console.log('console', JSON.stringify(err.filter((e) => !/BLOCKED_BY_CLIENT/.test(e.texte)), null, 1));
  console.log('bloquees', compteur.bloquees.length, [...new Set(compteur.bloquees.map((b) => b.split('?')[0]))], 'nav', compteur.navigations, 'total', compteur.navigateurTotal);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
