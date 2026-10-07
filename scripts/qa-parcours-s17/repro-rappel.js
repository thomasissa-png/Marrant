// Diagnostic : l'interrupteur du rappel ne bascule plus à la souris après une activation au clavier (1280) ?
// Usage : refaire-captures.sh <dossier> --sans-build --seul repro-rappel.js
const { BASE, sql, launch, newCtx, login, gotoW } = require('./local-common');

async function scenario(browser, w, nom, actions) {
  const ctx = await newCtx(browser, w);
  const page = await ctx.newPage();
  const api = [];
  page.on('request', (r) => { if (r.url().includes('/api/user/rappel-parcours') && r.method() === 'POST') api.push('POST ' + r.postData()); });
  page.on('response', (r) => { if (r.url().includes('/api/user/rappel-parcours') && r.request().method() === 'POST') api.push('-> ' + r.status()); });
  await login(page, 'qa-premium-verif@local.test');
  // parcours en cours (éligibilité du rappel) : validation de Confiance étape 1 par l'API, une seule fois
  const pid = sql(`select id from "LearningPath" where slug='confiance'`);
  await page.evaluate(async (id) => { await fetch(`/api/parcours/${id}/progress`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepOrder: 1 }) }); }, pid);
  await gotoW(page, BASE + '/profil#rappel-parcours');
  await page.waitForTimeout(800);
  const sec = page.locator('[data-testid="rappel-parcours"]');
  const sw = sec.getByRole('switch');
  const labP = sec.locator('label:has([role="switch"])');
  const piste = { click: async () => { const b = await labP.boundingBox(); await labP.click({ position: { x: 20, y: Math.round(b.height / 2) } }); } };
  const lab = sec.locator('label:has([role="switch"])');
  const etat = async (quoi) => {
    const d = await sw.evaluate((el) => ({ checked: el.checked, disabled: el.disabled, focus: document.activeElement === el }));
    const sel = await sec.locator('select').evaluate((el) => ({ v: el.value, disabled: el.disabled }));
    const db = sql(`select coalesce(string_agg(enabled::text || '/' || coalesce(weekday::text,'-'), ','), 'aucune') from "ParcoursReminderPreference" p join "User" u on u.id = p."userId" where u.email='qa-premium-verif@local.test'`);
    console.log(`[${w}] ${nom} | ${quoi} -> coché=${d.checked} inactif=${d.disabled} focus=${d.focus} | jour=${sel.v || '-'} (inactif=${sel.disabled}) | base=${db} | api=${api.splice(0).join(' ')}`);
  };
  await etat('arrivée');
  for (const [libelle, fn] of actions(page, sw, piste, lab, sec)) { await fn(); await page.waitForTimeout(1500); await etat(libelle); }
  await ctx.close();
}

(async () => {
  const browser = await launch();
  // jour enregistré au préalable par la souris, pour isoler le seul effet du clavier
  const souris = (page, sw, piste, lab, sec) => [
    ['clic piste (allumer)', () => piste.click()],
    ['choix du jour si demandé', async () => { if (!(await sw.isChecked()) && (await sec.locator('select').inputValue()) === '') await sec.locator('select').selectOption({ index: 1 }); }],
    ['clic piste (éteindre)', () => piste.click()],
    ['clic piste (allumer)', () => piste.click()],
    ['clic piste (éteindre)', () => piste.click()],
  ];
  const clavierPuisSouris = (page, sw, piste, lab, sec) => [
    ['Tab jusqu\'à l\'interrupteur + Espace (allumer)', async () => { await sw.focus(); await page.keyboard.press('Space'); }],
    ['clic piste (éteindre)', () => piste.click()],
    ['clic piste (allumer)', () => piste.click()],
    ['clic sur le texte du label (éteindre)', () => lab.locator('span').last().click()],
    ['Espace (allumer)', async () => { await sw.focus(); await page.keyboard.press('Space'); }],
    ['Espace (éteindre)', async () => { await page.keyboard.press('Space'); }],
  ];
  for (const w of [375, 1280]) {
    await scenario(browser, w, 'souris seule', souris);
    await scenario(browser, w, 'clavier puis souris', clavierPuisSouris);
  }
  await browser.close();
})();
