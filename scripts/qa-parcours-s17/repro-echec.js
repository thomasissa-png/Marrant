// Diagnostic : échec du chargement Premium à 375, alerte parfois absente de l'écran ?
// Usage : refaire-captures.sh <dossier> --sans-build --seul repro-echec.js
const { BASE, OUT, sql, launch, newCtx, login, gotoW } = require('./local-common');

(async () => {
  const browser = await launch();
  for (const w of [375, 1280]) {
    const ctx = await newCtx(browser, w);
    const page = await ctx.newPage();
    await login(page, w === 375 ? 'qa-etats375@local.test' : 'qa-etats1280@local.test');
    const pid = sql(`select id from "LearningPath" where slug='repartie'`);
    await page.evaluate(async (id) => { await fetch(`/api/parcours/${id}/progress`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepOrder: 1 }) }); }, pid);
    await gotoW(page, `${BASE}/parcours/repartie`); // met la progression en cache navigateur
    await page.waitForTimeout(1500);
    for (let k = 1; k <= 5; k++) {
      await page.route('**/api/parcours/by-slug/**', (r) => r.abort('failed'));
      await page.goto('about:blank');
      const t0 = Date.now();
      await page.goto(`${BASE}/parcours/repartie#etape-2`, { waitUntil: 'load' });
      const trace = [];
      for (let i = 0; i < 16; i++) {
        trace.push(await page.evaluate((t) => {
          const al = [...document.querySelectorAll('main [role="alert"]')].map((a) => { const b = a.getBoundingClientRect(); return `${Math.round(b.top)}:${(a.innerText || '').slice(0, 25).replace(/\s+/g, ' ')}`; });
          return `${Date.now() - t}ms y=${Math.round(scrollY)}/${document.documentElement.scrollHeight} alertes=[${al.join(' | ')}] e2=${document.querySelector('#etape-2') ? Math.round(document.querySelector('#etape-2').getBoundingClientRect().top) : 'absent'}`;
        }, t0));
        await page.waitForTimeout(250);
      }
      console.log(`[${w}] essai ${k} :`);
      for (const l of [trace[0], trace[2], trace[4], trace[8], trace[15]]) console.log('   ' + l);
      await page.screenshot({ path: `${OUT}/repro-echec-${w}-${k}.png` });
      await page.unroute('**/api/parcours/by-slug/**');
    }
    await ctx.close();
  }
  await browser.close();
})();
