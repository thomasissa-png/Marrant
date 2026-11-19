import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw; try { pw = require('/opt/node-tools/node_modules/playwright'); } catch { pw = require('playwright'); }
const NB=' ';
const cands = { tout: `Tout ouvrir${NB}·${NB}1,99${NB}€/mois`, bosser: `Bosser ta répartie${NB}·${NB}1,99${NB}€/mois`, mieux: `Mieux répondre${NB}·${NB}1,99${NB}€/mois` };
const b = await pw.chromium.launch();
for (const w of [640, 700, 768, 1280]) {
  for (const [k, t] of Object.entries(cands)) {
    const p = await b.newPage({ viewport: { width: w, height: 300 } });
    await p.goto('http://localhost:5400/', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    const r = await p.evaluate((t) => {
      const s=[...document.querySelectorAll('header a span')].filter(s=>/€\/mois/.test(s.textContent)&&s.offsetParent)[0]; s.textContent=t;
      const a=s.closest('a'); const ar=a.getBoundingClientRect(); const hdr=a.closest('header');
      const vis=[...hdr.querySelectorAll('a,button,input,svg')].filter(e=>e.offsetParent!==null||e.tagName==='svg').map(e=>e.getBoundingClientRect()).filter(r=>r.width&&r.height&&Math.abs(r.top+r.height/2-(ar.top+ar.height/2))<20);
      let gap=1e9; for (const r of vis) if (r.right<=ar.left+0.5) gap=Math.min(gap, ar.left-r.right);
      return {w:Math.round(ar.width), gap:Math.round(gap), droite:Math.round(innerWidth-ar.right), debord:document.documentElement.scrollWidth-innerWidth, texte:a.textContent};
    }, t);
    await p.waitForTimeout(300);
    const txt = await p.evaluate(()=>[...document.querySelectorAll('header a span')].filter(s=>/€\/mois/.test(s.textContent)&&s.offsetParent)[0].textContent);
    console.log(w, k, JSON.stringify(r), 'après:', txt);
    if (w===640||w===1280) await p.screenshot({ path: `entete-${k}-${w}.png`, clip: { x: 0, y: 0, width: w, height: 70 } });
    await p.close();
  }
}
await b.close();
