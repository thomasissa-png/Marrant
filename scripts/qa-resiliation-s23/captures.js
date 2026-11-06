// s23 : captures de la page de résiliation (instance LOCALE, http://localhost:5000 uniquement).
// QA_PHASE=avant : interrupteur fermé (état livré) : 404 + pied de page et carte du profil actuels.
// QA_PHASE=apres : interrupteur forcé ouvert : états de /resiliation et /resiliation/confirmee.
// Aucun appel Stripe : l'API est interceptée pour l'envoi, l'erreur Stripe et la confirmation ; le seul
// appel réel à l'API locale (compte sans client Stripe) ne touche pas Stripe.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5000';
const OUT = process.env.QA_OUT;
const PHASE = process.env.QA_PHASE;
const PW = 'QaLocal-2026!';
const API = '**/api/user/subscription/resiliation';
const TAILLES = [
  { nom: 'pc-1440', viewport: { width: 1440, height: 900 }, mobile: false },
  { nom: 'mobile-390', viewport: { width: 390, height: 844 }, mobile: true },
];
// v2 (UX O9) : tablette 768, états vide et confirmée seulement.
const TABLETTE = { nom: 'tablette-768', viewport: { width: 768, height: 1024 }, mobile: true };
fs.mkdirSync(OUT, { recursive: true });
const ok = (name, pass, detail = '') => console.log((pass ? 'PASS ' : 'FAIL ') + name + (detail ? ' :: ' + detail : ''));
const psql = (sql) => execSync(`${process.env.QA_PSQL} -At -c ${JSON.stringify(sql)}`).toString().trim();

async function go(page, url) {
  const res = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  return res;
}
async function login(page, email, retour = '/') {
  await go(page, `${BASE}/login?callbackUrl=${encodeURIComponent(retour)}`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', PW);
  await Promise.all([page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 30000 }).catch(() => {}), page.click('button[type="submit"]')]);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
}
async function shot(page, nom, opts = {}) {
  await page.waitForTimeout(300);
  if (opts.clip) {
    await opts.clip.scrollIntoViewIfNeeded().catch(() => {});
    const box = await opts.clip.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
    });
    await page.screenshot({ path: path.join(OUT, nom + '.png'), fullPage: true, clip: box });
  } else if (opts.fullPage === false) {
    await page.screenshot({ path: path.join(OUT, nom + '.png') });
  } else {
    // Pleine page : fenêtre agrandie à la hauteur du document, pour que la barre collante soit rendue
    // à sa place réelle (une capture « fullPage » la figerait au milieu de l'image).
    const vp = page.viewportSize();
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewportSize({ width: vp.width, height: h });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, nom + '.png') });
    await page.setViewportSize(vp);
    await page.waitForTimeout(200);
  }
  console.log('CAPTURE ' + nom + '.png');
}
async function contexte(browser, t) {
  return browser.newContext({ viewport: t.viewport, isMobile: t.mobile, hasTouch: t.mobile, deviceScaleFactor: t.mobile ? 2 : 1, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
}
const bouton = (page) => page.getByRole('button', { name: /Confirmer la résiliation|Réessayer|On résilie/ });

async function controlesEcran(page, t) {
  const b = bouton(page);
  ok(`${t.nom} bouton actif au chargement`, (await b.isEnabled()) && (await b.getAttribute('disabled')) === null && (await b.getAttribute('aria-disabled')) === null);
  const debord = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(`${t.nom} aucun défilement horizontal`, debord <= 0, `${debord}px`);
  await page.evaluate(() => window.scrollTo(0, 0));
  const r = await b.boundingBox();
  ok(`${t.nom} bouton visible sans défilement (sticky)`, r && r.y + r.height <= t.viewport.height, r ? `bas ${Math.round(r.y + r.height)} / ${t.viewport.height}` : 'absent');
  const hauteurs = await page.locator('fieldset label:has(input[type=checkbox])').evaluateAll((ls) => ls.map((l) => Math.round(l.getBoundingClientRect().height)));
  ok(`${t.nom} 7 raisons, cibles >= 44 px`, hauteurs.length === 7 && hauteurs.every((h) => h >= 44), hauteurs.join(','));
  ok(`${t.nom} aucune case pré-cochée`, (await page.locator('input[type=checkbox]:checked').count()) === 0);
  const garder = await page.getByRole('link', { name: 'Garder mon abonnement' }).boundingBox();
  ok(`${t.nom} lien Garder >= 44 px`, garder && garder.height >= 44, garder ? `${Math.round(garder.height)}px` : 'absent');
  const corps = await page.locator('main').innerText();
  ok(`${t.nom} zéro tiret cadratin`, !corps.includes('—'));
}

// Design O5 : sur les états courts, le pied de page descend au moins jusqu'au bas du viewport (pas de bande noire).
async function piedEnBas(page, t, nom) {
  const r = await page.evaluate(() => ({ bas: Math.round(document.querySelector('footer').getBoundingClientRect().bottom + window.scrollY), vh: window.innerHeight }));
  ok(`${t.nom} ${nom} : pied de page au bas du viewport (design O5)`, r.bas >= r.vh - 1, `bas du pied ${r.bas} / viewport ${r.vh}`);
}
async function avant(browser) {
  for (const t of TAILLES) {
    const ctx = await contexte(browser, t);
    const page = await ctx.newPage();
    const r = await go(page, BASE + '/resiliation');
    ok(`${t.nom} /resiliation fermé = 404`, r.status() === 404, String(r.status()));
    await go(page, BASE + '/cgu');
    const lien = page.locator('footer').getByRole('link', { name: 'Résilier ton contrat' });
    ok(`${t.nom} pied de page fermé -> /profil#abonnement`, (await lien.getAttribute('href')) === '/profil#abonnement');
    await shot(page, `avant-pied-de-page-${t.nom}`, { clip: page.locator('footer') });
    await login(page, 'yanis.avant@local.test', '/profil#abonnement');
    await go(page, BASE + '/profil#abonnement');
    const carte = page.locator('#abonnement');
    await carte.waitFor({ timeout: 20000 }).catch(() => {});
    ok(`${t.nom} carte fermée : bouton du portail`, (await carte.getByRole('button', { name: 'Résilier ton contrat' }).count()) === 1);
    await shot(page, `avant-profil-carte-abonnement-${t.nom}`, { clip: carte });
    await go(page, BASE + '/confidentialite');
    ok(`${t.nom} confidentialité fermée : aucun ajout résiliation`, (await page.getByTestId('confidentialite-resiliation').count()) === 0 && (await page.locator('#resiliation').count()) === 0);
    await ctx.close();
  }
}

async function apres(browser) {
  for (const t of TAILLES) {
    const n = t.nom;
    // Sans session : connexion puis retour (message de contexte).
    let ctx = await contexte(browser, t);
    let page = await ctx.newPage();
    await go(page, BASE + '/resiliation');
    ok(`${n} sans session -> /login?callbackUrl=/resiliation`, page.url().includes('/login?callbackUrl=%2Fresiliation'), page.url());
    await shot(page, `resiliation-connexion-${n}`, { fullPage: false });
    await go(page, BASE + '/cgu');
    ok(`${n} pied de page ouvert -> /resiliation`, (await page.locator('footer').getByRole('link', { name: 'Résilier ton contrat' }).getAttribute('href')) === '/resiliation');
    await shot(page, `apres-pied-de-page-${n}`, { clip: page.locator('footer') });

    // Compte mensuel actif : vide, raisons cochées, envoi, erreur Stripe (API interceptée).
    await login(page, 'yanis@local.test', '/resiliation');
    ok(`${n} retour sur /resiliation après connexion`, new URL(page.url()).pathname === '/resiliation', page.url());
    await go(page, BASE + '/resiliation');
    await controlesEcran(page, t);
    await shot(page, `resiliation-vide-${n}`);
    // v2 (UX O9) : premier écran aussi sur PC 1440x900 (barre collée visible).
    await shot(page, `resiliation-vide-premier-ecran-${n}`, { fullPage: false });
    await page.getByRole('checkbox', { name: 'Je voulais juste essayer' }).check();
    await page.getByRole('checkbox', { name: 'Trop cher pour moi' }).check();
    await page.getByLabel(/Un mot de plus/).fill('Je reviendrai sûrement après les partiels.');
    ok(`${n} bouton toujours actif après réponse`, await bouton(page).isEnabled());
    await shot(page, `resiliation-raisons-cochees-${n}`);
    if (t.mobile) {
      // UX C3 : clavier ouvert simulé (Playwright n'ouvre pas de clavier virtuel) : viewport réduit à
      // 390x450 (844 moins ~390 px de clavier iOS), focus dans « Un mot de plus ? ».
      const vp = page.viewportSize();
      await page.setViewportSize({ width: 390, height: 450 });
      await page.getByLabel(/Un mot de plus/).focus();
      await page.waitForTimeout(400);
      const rb = await bouton(page).boundingBox();
      ok(`${n} clavier ouvert (390x450) : « Confirmer la résiliation » visible et atteignable`, !!rb && rb.y >= 0 && rb.y + rb.height <= 450, rb ? `bouton y ${Math.round(rb.y)} à ${Math.round(rb.y + rb.height)} / 450` : 'absent');
      await shot(page, 'resiliation-clavier-mobile-390', { fullPage: false });
      await page.getByLabel(/Un mot de plus/).blur();
      await page.setViewportSize(vp);
      await page.waitForTimeout(300);
    }
    let relacher;
    await page.route(API, (route) => new Promise((r) => (relacher = () => r(route.abort()))));
    await bouton(page).click();
    await page.waitForTimeout(3500);
    ok(`${n} envoi : aria-disabled, jamais disabled`, (await bouton(page).getAttribute('aria-disabled')) === 'true' && (await bouton(page).getAttribute('disabled')) === null);
    await shot(page, `resiliation-envoi-${n}`, { fullPage: false });
    relacher && relacher();
    await page.unroute(API);
    await page.waitForTimeout(500);
    await page.route(API, (route) => route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ etat: 'transmis', dateFin: '2026-12-01T10:00:00.000Z', formule: 'monthly' }) }));
    await bouton(page).click();
    await page.locator('form [role="alert"]').waitFor();
    ok(`${n} erreur Stripe : saisie conservée`, (await page.getByRole('checkbox', { name: 'Trop cher pour moi' }).isChecked()) && (await page.getByLabel(/Un mot de plus/).inputValue()).startsWith('Je reviendrai'));
    ok(`${n} erreur Stripe : « Réessayer » actif`, (await bouton(page).innerText()).includes('Réessayer') && (await bouton(page).isEnabled()));
    await shot(page, `resiliation-erreur-stripe-${n}`, { fullPage: false });
    await shot(page, `resiliation-erreur-stripe-page-${n}`);
    await page.unroute(API);
    // v2 (UX O9) : hors ligne (aucune réponse), puis refus 429 (UX O4).
    await page.route(API, (route) => route.abort('internetdisconnected'));
    await bouton(page).click();
    await page.locator('form [role="alert"]').waitFor();
    const horsLigne = await page.locator('form [role="alert"]').innerText();
    ok(`${n} hors ligne : « Pas de connexion », bouton « Confirmer la résiliation »`, horsLigne.includes('Pas de connexion') && (await bouton(page).innerText()).includes('Confirmer la résiliation'));
    await shot(page, `resiliation-hors-ligne-${n}`, { fullPage: false });
    await page.unroute(API);
    await page.route(API, (route) => route.fulfill({ status: 429, contentType: 'application/json', body: '{"error":"trop"}' }));
    await bouton(page).click();
    await page.waitForFunction(() => document.querySelector('form [role="alert"]')?.textContent?.includes('pas pu partir'), null, { timeout: 10000 }).catch(() => {});
    ok(`${n} refus 429 : message « refus », pas « Pas de connexion »`, (await page.locator('form [role="alert"]').innerText()).includes('pas pu partir'));
    await page.unroute(API);
    // v2 (UX O5, O9) : App Store, carte Apple seule (plus de bouton « Confirmer »).
    await page.route(API, (route) => route.fulfill({ status: 409, contentType: 'application/json', body: '{"etat":"app_store"}' }));
    await bouton(page).click();
    await page.getByTestId('resiliation-app-store').waitFor({ timeout: 10000 }).catch(() => {});
    ok(`${n} App Store : carte Apple, aucun bouton Confirmer`, (await page.getByTestId('resiliation-app-store').count()) === 1 && (await bouton(page).count()) === 0);
    await piedEnBas(page, t, 'App Store');
    await shot(page, `resiliation-app-store-${n}`);
    await page.unroute(API);
    await ctx.close();

    // v2 (@legal O6) : carte abonnement du profil, interrupteur ouvert (lien vers /resiliation).
    ctx = await contexte(browser, t);
    page = await ctx.newPage();
    await login(page, 'yanis.avant@local.test', '/profil#abonnement');
    await go(page, BASE + '/profil#abonnement');
    const carte = page.locator('#abonnement');
    await carte.waitFor({ timeout: 20000 }).catch(() => {});
    ok(`${n} carte ouverte : lien vers /resiliation`, (await carte.getByRole('link', { name: 'Résilier ton contrat' }).first().getAttribute('href')) === '/resiliation');
    await shot(page, `apres-profil-carte-abonnement-${n}`, { clip: carte });
    await ctx.close();

    // Annuel, déjà résilié, sans abonnement, sans client Stripe (vrai appel à l'API locale, sans Stripe).
    for (const [email, nom] of [['sophie.annuel@local.test', 'annuel'], ['marc@local.test', 'deja-resilie'], ['gratuit@local.test', 'sans-abonnement'], ['offert@local.test', 'sans-client-stripe'], ['impaye@local.test', 'impaye']]) {
      ctx = await contexte(browser, t);
      page = await ctx.newPage();
      await login(page, email, '/resiliation');
      await go(page, BASE + '/resiliation');
      if (nom === 'deja-resilie') ok(`${n} déjà résilié : ni question ni Confirmer`, (await page.locator('fieldset').count()) === 0 && (await bouton(page).count()) === 0);
      if (nom === 'sans-client-stripe') {
        await bouton(page).click();
        await page.locator('form [role="alert"]').waitFor({ timeout: 15000 }).catch(() => {});
        // @reviewer R1 : accès offert, demande transmise sans échec ni « Réessayer », retour à l'accueil.
        ok(`${n} sans client Stripe : demande transmise (vrai appel local), sans « Réessayer » (R1)`, (await page.locator('form [role="alert"]').innerText().catch(() => '')).includes('on s’occupe de ta résiliation') && (await bouton(page).count()) === 0);
      }
      if (nom === 'sans-abonnement') await piedEnBas(page, t, 'Rien à résilier');
      if (nom === 'impaye') ok(`${n} impayé : lignes prudentes @legal O7`, (await page.locator('main').innerText()).includes('sauf si la facture en cours reste impayée') && !(await page.locator('main').innerText()).includes('Aucun nouveau prélèvement après.'));
      await shot(page, `resiliation-${nom}-${n}`);
      await ctx.close();
    }

    // Parcours complet jusqu'à la page finale : API interceptée, base locale mise à jour comme le ferait la route.
    const id = `qa_flux_${t.viewport.width}`;
    ctx = await contexte(browser, t);
    page = await ctx.newPage();
    await login(page, `flux${t.viewport.width}@local.test`, '/resiliation');
    await go(page, BASE + '/resiliation');
    await page.getByRole('checkbox', { name: 'Trop cher pour moi' }).check();
    await page.route(API, (route) => {
      psql(`update "Subscription" set "cancelAtPeriodEnd"=true where "userId"='${id}'`);
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ etat: 'resilie', dateFin: '2026-12-01T10:00:00.000Z', formule: 'monthly' }) });
    });
    await bouton(page).click();
    await page.waitForURL('**/resiliation/confirmee', { timeout: 20000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    const texte = await page.locator('main').innerText();
    ok(`${n} page finale : date, effets, ni merci ni aide (UX O1)`, texte.includes('C’est noté.') && texte.includes('1er décembre 2026') && !texte.includes('Merci d’avoir répondu.') && !texte.includes('chaque parcours'));
    const focus = await page.evaluate(() => document.activeElement?.tagName);
    ok(`${n} page finale : H1 focalisé`, focus === 'H1', focus);
    await shot(page, `resiliation-confirmee-${n}`);
    await ctx.close();
  }
  // v2 (UX O9) : tablette 768, vide puis confirmée.
  const t = TABLETTE;
  let ctx = await contexte(browser, t);
  let page = await ctx.newPage();
  await login(page, 'flux768@local.test', '/resiliation');
  await go(page, BASE + '/resiliation');
  await controlesEcran(page, t);
  await shot(page, `resiliation-vide-${t.nom}`);
  await page.route(API, (route) => {
    psql(`update "Subscription" set "cancelAtPeriodEnd"=true where "userId"='qa_flux_768'`);
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ etat: 'resilie', dateFin: '2026-12-01T10:00:00.000Z', formule: 'monthly' }) });
  });
  await bouton(page).click();
  await page.waitForURL('**/resiliation/confirmee', { timeout: 20000 }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  ok(`${t.nom} page finale atteinte`, page.url().endsWith('/resiliation/confirmee'), page.url());
  await shot(page, `resiliation-confirmee-${t.nom}`);
  await ctx.close();
  // v2 : politique de confidentialité ouverte, ancre #resiliation.
  ctx = await contexte(browser, TAILLES[0]);
  page = await ctx.newPage();
  await go(page, BASE + '/confidentialite#resiliation');
  ok('confidentialité ouverte : ancre #resiliation et 4 ajouts', (await page.locator('#resiliation').count()) === 1 && (await page.getByTestId('confidentialite-resiliation').count()) === 4);
  await shot(page, 'resiliation-confidentialite-ancre-pc-1440', { fullPage: false });
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1'] });
  try {
    if (PHASE === 'avant') await avant(browser);
    else await apres(browser);
  } catch (e) {
    ok('exécution', false, e.message.split('\n')[0]);
  } finally {
    await browser.close();
  }
})();
