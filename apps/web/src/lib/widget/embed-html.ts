/**
 * HTML de la page d'iframe /embed/vanne-du-jour (s22) : document autonome,
 * sans gabarit du site, sans cookie, sans Umami côté visiteur, sans police à
 * charger, sans JSON-LD ni canonical (document noindex). Un seul script en
 * ligne, autorisé par empreinte dans la CSP (next.config.js).
 *
 * Mise en page (revue @design v1) : la carte occupe toute la hauteur réservée ;
 * le pied (« Pourquoi ça marche ? », « Deviens Marrant ») est ancré en bas et
 * ne sort JAMAIS du cadre (revue QA B2) : si le texte dépasse (texte agrandi),
 * seule la zone de la vanne défile.
 */
import { WIDGET_IFRAME_TITLE } from "@/config/widget-vanne-du-jour";
import { withWidgetUtm, type WidgetVanne } from "@/lib/widget/vanne-du-jour";

const data = require("./embed-script.data.cjs") as { EMBED_INLINE_SCRIPT: string };
export const EMBED_INLINE_SCRIPT: string = data.EMBED_INLINE_SCRIPT;

export type WidgetTheme = "auto" | "clair" | "sombre";

/** Seuls `auto`, `clair` et `sombre` sont acceptés ; tout le reste vaut `auto`. */
export function parseWidgetTheme(value: string | null): WidgetTheme {
  return value === "clair" || value === "sombre" ? value : "auto";
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Contrastes AA (revue @design) : texte #FFFFFF sur #1F1F1F 16:1, lien #A78BFA 6:1,
// bouton blanc sur #6D28D9 7,1:1 (survol #7C3AED 5,7:1, appui #5B21B6 ~10:1) ;
// thème clair : #0D0D0D 19:1 et #6D28D9 7,1:1 sur blanc.
const SOMBRE = "--bg:#1F1F1F;--tx:#FFFFFF;--li:#A78BFA;--bd:#2A2A2A;--ch:rgba(139,92,246,.14)";
const CLAIR = "--bg:#FFFFFF;--tx:#0D0D0D;--li:#6D28D9;--bd:#E2E2E2;--ch:rgba(109,40,217,.08)";

const CSS =
  // Schéma de couleurs déclaré (revue @design B1) : fond de l'iframe transparent quand il
  // coïncide avec celui de l'hôte ; sinon le rayon posé sur l'iframe rogne le fond opaque.
  `:root{${SOMBRE};color-scheme:light dark}html.t-clair{${CLAIR};color-scheme:light}html.t-sombre{color-scheme:dark}` +
  `@media (prefers-color-scheme:light){html.t-auto{${CLAIR}}}` +
  "*{box-sizing:border-box}html,body{margin:0;background:transparent;color:var(--tx)}" +
  "body{font:16px/24px system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
  "main{position:relative;display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--bg);" +
  "border:1px solid var(--bd);border-radius:12px;padding:20px 16px 4px}" +
  // Bande dégradée du site (h-1 from-accent-primary to-accent-secondary), sans croissant aux coins.
  'main::before{content:"";position:absolute;inset:0 0 auto 0;height:4px;background:linear-gradient(90deg,#8B5CF6,#6D28D9)}' +
  "@media (min-width:480px){main{padding:24px 24px 8px}}" +
  // Zone de la vanne : en haut de la carte, le vide éventuel va entre le bouton et le pied (carte du site).
  ".k{flex:1 1 auto;min-height:0;overflow-y:auto}figure,blockquote{margin:0}" +
  ".titre{font-size:12px;line-height:16px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--li);margin:0 0 8px}" +
  ".amorce{font-size:18px;line-height:28px;font-weight:500;margin:0 0 16px}" +
  ".chute{font-size:18px;line-height:28px;font-weight:600;margin:0 0 16px;padding:8px 12px;border-radius:8px;background:var(--ch);color:var(--tx)}" +
  "#b{display:none;width:100%;min-height:44px;margin:0 0 16px;border:0;border-radius:8px;background:#6D28D9;color:#FFFFFF;font:inherit;font-weight:600;cursor:pointer}" +
  "#b:hover{background:#7C3AED}#b:active{background:#5B21B6}" +
  "a{color:var(--li)}a:focus-visible,#b:focus-visible,.chute:focus-visible{outline:2px solid var(--li);outline-offset:2px}" +
  ".chute:focus:not(:focus-visible){outline:none}" +
  ".js #b{display:block}.js .chute,.js .pourquoi{display:none}.js.ouvert .chute{display:block}.js.ouvert .pourquoi{display:inline-flex}.js.ouvert #b{display:none}" +
  ".pied{flex:none;display:flex;flex-wrap:wrap;align-items:center;gap:0 16px;border-top:1px solid var(--bd)}" +
  ".pied a{display:inline-flex;align-items:center;min-height:44px}" +
  ".marque{margin-left:auto;font-size:14px;line-height:20px;font-weight:700;color:var(--tx)!important;text-underline-offset:3px}" +
  "main.repli{justify-content:center;align-items:center;text-align:center}main.repli .pied{border:0}main.repli .marque{margin:0}" +
  ".sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}" +
  "@media (prefers-reduced-motion:no-preference){.js.ouvert .chute{animation:f .3s ease-out}@keyframes f{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}}";

const NOUVEL_ONGLET = '<span class="sr"> (s’ouvre dans un nouvel onglet)</span>';

function lien(href: string, texte: string, classe: string): string {
  return `<a class="${classe}" data-utm href="${escapeHtml(href)}" target="_blank" rel="noopener">${texte}${NOUVEL_ONGLET}</a>`;
}

const MARQUE = (): string => lien(withWidgetUtm("/", null), "Deviens Marrant", "marque");

function page(theme: WidgetTheme, mainClass: string, corps: string): string {
  return (
    `<!doctype html><html lang="fr" class="t-${theme}"><head><meta charset="utf-8">` +
    '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">' +
    '<meta name="color-scheme" content="light dark">' +
    `<title>${escapeHtml(WIDGET_IFRAME_TITLE)}</title><style>${CSS}</style></head>` +
    `<body><main${mainClass ? ` class="${mainClass}"` : ""}>${corps}</main>` +
    `<script>${EMBED_INLINE_SCRIPT}</script></body></html>`
  );
}

/** Iframe avec la vanne du jour : amorce, bouton, chute, pied (fiche, marque). */
export function renderEmbedVanne(vanne: WidgetVanne, theme: WidgetTheme = "auto"): string {
  return page(
    theme,
    "",
    '<div class="k" id="k"><figure><figcaption class="titre">La vanne du jour</figcaption><blockquote>' +
      `<p class="amorce">${escapeHtml(vanne.amorce)}</p>` +
      `<p id="c" class="chute" tabindex="-1">${escapeHtml(vanne.chute)}</p></blockquote></figure>` +
      '<button id="b" type="button" aria-expanded="false" aria-controls="c">Révéler la chute</button></div>' +
      `<footer class="pied">${lien(withWidgetUtm(vanne.fichePath, null), "Pourquoi ça marche&nbsp;?", "pourquoi")}${MARQUE()}</footer>`,
  );
}

/**
 * Repli neutre sans vanne (widget non publié, liste vide, base indisponible,
 * domaine bloqué) : jamais une vanne hors liste, aucune phrase (aucun texte
 * non validé ne s'affiche chez un hôte), seulement le titre et la marque.
 */
export function renderEmbedRepli(theme: WidgetTheme = "auto"): string {
  return page(theme, "repli", `<p class="titre">La vanne du jour</p><footer class="pied">${MARQUE()}</footer>`);
}
