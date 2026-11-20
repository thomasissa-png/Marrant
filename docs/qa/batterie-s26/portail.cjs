const L = require('./lib.cjs');
(async () => {
  const b = await L.chromium.launch();
  for (const w of [375, 1280]) {
  const ctx = await L.contexte(b, w, 'http://localhost:5400'); const page = await ctx.newPage();
  await L.connecter(page, 'abonne-en-cours@preversion.test');
  await L.etape(page, 'D abonne-en-cours', 'Profil -> gérer / résilier l’abonnement (portail Stripe)', async () => {
    await page.goto('http://localhost:5400/profil', { waitUntil: 'load' }); await page.waitForTimeout(600);
    const api = [];
    page.on('response', r => { if (/api\/stripe/.test(r.url())) api.push(`${new URL(r.url()).pathname} ${r.status()}`); });
    const btn = page.locator('main').getByRole('button', { name: /abonnement|Gérer|Résilier|facturation/i }).filter({ visible: true }).first();
    const lien = page.locator('main').getByRole('link', { name: /abonnement|Gérer|Résilier|facturation/i }).filter({ visible: true }).first();
    const cible = (await btn.count()) ? btn : lien;
    if (!(await cible.count())) throw new Error('aucun bouton de gestion d’abonnement visible sur /profil');
    const lib = (await cible.innerText()).replace(/\s+/g, ' ');
    await cible.click(); await page.waitForTimeout(1300);
    const toast = (await page.locator('[role=status],[role=alert]').filter({ visible: true }).allInnerTexts()).join(' ').replace(/\s+/g, ' ');
    await L.capture(page, `D-portail-stripe-${w}`);
    return `« ${lib} » -> ${page.url().replace('http://localhost:5400', '')} ; API ${api.join(', ') || 'aucune'} ; message « ${toast} »`;
  });
  await ctx.close(); }
  await b.close();
})();
