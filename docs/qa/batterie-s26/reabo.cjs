const L = require('./lib.cjs');
(async () => {
  const b = await L.chromium.launch(); const ctx = await L.contexte(b, 1280, 'http://localhost:5400'); const page = await ctx.newPage();
  await L.connecter(page, 'inscrit-gratuit@preversion.test');
  await L.etape(page, 'C ancien abonné', 'réabonné : ses 2 favoris réapparaissent', async () => {
    await page.goto('http://localhost:5400/favoris', { waitUntil: 'load' }); await page.waitForTimeout(800);
    const n = await page.locator('main a[href^="/favoris?favori="]').count();
    if (n !== 2) throw new Error(`${n} favoris affichés au lieu de 2`);
    return `${n} favoris affichés`;
  });
  await b.close();
})();
