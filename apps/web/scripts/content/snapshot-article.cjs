/**
 * Étape locale de snapshot-article.sh (aucun accès réseau) :
 *  1. inline les CSS /_next/static téléchargées par curl (polices en data URI),
 *     retire les scripts (page SSR complète, aucun JS ni Umami en file://) ;
 *  2. capture avec Playwright depuis file:// :
 *     - 390 px : tranches de 1600 px (m00.png, m01.png…) ;
 *     - 1280 px : haut (d-haut.png) et bas (d-bas.png) de la page.
 *
 *   node scripts/content/snapshot-article.cjs <apercu-source.html> <dossier>
 */
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const SLICE = 1600;
const MOBILE_WIDTH = 390;
const DESKTOP_WIDTH = 1280;
const CHROMIUM = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";
const MIME = { ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp" };

const [sourceHtml, outDir] = process.argv.slice(2);
if (!sourceHtml || !outDir) {
  console.error("Usage : node snapshot-article.cjs <apercu-source.html> <dossier>");
  process.exit(2);
}
const assetsDir = path.join(outDir, "assets");

/** Même règle que local_name() dans snapshot-article.sh. */
const localName = (p) => p.replace(/^\/+/, "").replace(/[^A-Za-z0-9._-]/g, "_");
const readAsset = (p) => {
  const file = path.join(assetsDir, localName(p));
  return fs.existsSync(file) ? fs.readFileSync(file) : null;
};

function inlineCss(css) {
  return css.replace(/url\((['"]?)(\/_next\/static\/media\/[^'")?#]+)[^'")]*\1\)/g, (match, _q, p) => {
    const data = readAsset(p);
    if (!data) return match;
    const mime = MIME[path.extname(p).toLowerCase()] || "application/octet-stream";
    return `url(data:${mime};base64,${data.toString("base64")})`;
  });
}

function buildStandaloneHtml(html) {
  let missing = 0;
  const out = html
    // Feuilles de style Next → <style> inline.
    .replace(/<link\b[^>]*\bhref="(\/_next\/static\/[^"]+\.css)[^"]*"[^>]*>/g, (tag, p) => {
      const css = readAsset(p);
      if (!css) {
        missing += 1;
        return tag;
      }
      return `<style data-source="${p}">${inlineCss(css.toString("utf8"))}</style>`;
    })
    // Préchargements /_next (polices déjà inlinées, scripts retirés).
    .replace(/<link\b[^>]*\bhref="\/_next\/[^"]*"[^>]*>/g, "")
    // Scripts exécutables retirés ; JSON-LD conservé (inerte).
    .replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, "");
  if (missing) console.warn(`Attention : ${missing} CSS non trouvée(s) localement, rendu possiblement incomplet.`);
  return out;
}

async function shoot(browser, width, fileUrl, onPage) {
  const context = await browser.newContext({ viewport: { width, height: SLICE }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(fileUrl, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const height = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await onPage(page, height);
  await context.close();
  return height;
}

async function main() {
  const html = buildStandaloneHtml(fs.readFileSync(sourceHtml, "utf8"));
  const standalone = path.join(outDir, "apercu.html");
  fs.writeFileSync(standalone, html);
  const fileUrl = pathToFileURL(standalone).href;

  const browser = await chromium.launch({ executablePath: CHROMIUM });
  try {
    const files = [];
    const mobileHeight = await shoot(browser, MOBILE_WIDTH, fileUrl, async (page, height) => {
      for (let i = 0, y = 0; y < height; i += 1, y += SLICE) {
        const name = `m${String(i).padStart(2, "0")}.png`;
        const clip = { x: 0, y, width: MOBILE_WIDTH, height: Math.min(SLICE, height - y) };
        await page.screenshot({ path: path.join(outDir, name), fullPage: true, clip });
        files.push(name);
      }
    });
    await shoot(browser, DESKTOP_WIDTH, fileUrl, async (page, height) => {
      const sliceHeight = Math.min(SLICE, height);
      await page.screenshot({ path: path.join(outDir, "d-haut.png"), fullPage: true, clip: { x: 0, y: 0, width: DESKTOP_WIDTH, height: sliceHeight } });
      await page.screenshot({ path: path.join(outDir, "d-bas.png"), fullPage: true, clip: { x: 0, y: height - sliceHeight, width: DESKTOP_WIDTH, height: sliceHeight } });
      files.push("d-haut.png", "d-bas.png");
    });
    console.log(`HTML autonome : ${standalone}`);
    console.log(`Captures (${files.length}, page mobile ${mobileHeight} px) : ${files.join(", ")}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
