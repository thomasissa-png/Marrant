import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("/opt/node-tools/node_modules/playwright/index.js");
const [url, w] = [process.argv[2] || "http://localhost:5400/mon-espace", Number(process.argv[3] || 1280)];
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: "dark" })).newPage();
await p.goto(url, { waitUntil: "networkidle" });
const r = await p.evaluate(() => {
  const m = new Map();
  const root = document.querySelector("main") || document.body;
  for (const el of root.querySelectorAll("*")) {
    const t = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(" ");
    if (!t) continue;
    const r = el.getBoundingClientRect(); if (r.top > 900 || r.width === 0) continue;
    const cs = getComputedStyle(el);
    const k = `${cs.fontSize} ${cs.fontWeight} ${cs.fontFamily.split(",")[0]}${cs.textTransform === "uppercase" ? " MAJ" : ""}`;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(t.slice(0, 30));
  }
  return [...m.entries()].sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
});
for (const [k, v] of r) console.log(k.padEnd(40), "|", v.slice(0, 3).join(" / "));
const sizes = new Set(r.map(([k]) => k.split(" ")[0]));
console.log("TAILLES DISTINCTES :", sizes.size, [...sizes].join(", "), "| COMBINAISONS :", r.length);
await b.close();
