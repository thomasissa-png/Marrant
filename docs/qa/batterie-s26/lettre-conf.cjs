const L = require('./lib.cjs');
(async () => {
  const b = await L.chromium.launch(); const ctx = await L.contexte(b, 375, 'http://localhost:5400'); const page = await ctx.newPage();
  const m = L.mails().filter(x => /dernière étape/.test(x.subject || '') && /batterie-/.test([x.to].flat()[0])).pop();
  const email = [m.to].flat()[0];
  await L.etape(page, 'B nouvel inscrit', 'La lettre : lien de confirmation de l’e-mail -> confirmé', async () => {
    const liens = (m.text.match(/https?:\/\/\S+/g) || []);
    const ko = [];
    for (const h of liens) { const u = new URL(h); const r = await page.request.get('http://localhost:5400' + u.pathname + u.search); if (r.status() >= 400) ko.push(r.status() + ' ' + u.pathname); }
    const lien = liens.find(h => /confirmer/.test(h)); const u = new URL(lien);
    await page.goto('http://localhost:5400' + u.pathname + u.search, { waitUntil: 'load' });
    await page.getByRole('button', { name: /Confirmer mon adresse/ }).click(); await page.waitForTimeout(2500);
    const t = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 140);
    const nouveaux = L.mails().filter(x => [x.to].flat().includes(email)).map(x => x.subject);
    if (ko.length) throw new Error('liens KO dans l’e-mail : ' + ko.join(', '));
    return `${liens.length} liens de l’e-mail en 200 (hôte ${new URL(liens[0]).host}) ; après clic : « ${t} » ; e-mails reçus : ${nouveaux.join(' / ')}`;
  });
  await b.close();
})();
