const { BASE, launch, newCtx, login } = require('./local-common');
const fs = require('fs');
(async () => {
  const b = await launch(); const ctx = await newCtx(b, 1280); const p = await ctx.newPage();
  await login(p, 'qa-p768@local.test'); await p.goto(BASE + '/profil', { waitUntil: 'networkidle' });
  await p.addScriptTag({ content: fs.readFileSync('/tmp/claude-0/-home-user-Marrant/bd072092-6ee5-586f-8f47-6fd05fa5f334/scratchpad/qa/node_modules/axe-core/axe.min.js', 'utf8') });
  const r = await p.evaluate(async () => (await axe.run(document, { runOnly: ['color-contrast'] })).violations.flatMap(v => v.nodes.map(n => ({ html: n.html.slice(0, 200), sum: n.failureSummary.slice(0, 250) }))));
  console.log(JSON.stringify(r, null, 1)); await b.close();
})();
