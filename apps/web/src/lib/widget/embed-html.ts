/**
 * HTML de la page d'iframe /embed/vanne-du-jour (s22) : document autonome,
 * sans gabarit du site, sans cookie, sans Umami, sans police à charger, sans
 * JSON-LD ni canonical (document noindex). Un seul script en ligne, autorisé
 * par empreinte dans la CSP de /embed/* (next.config.js).
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

// Contrastes AA vérifiés : texte #FFFFFF sur #1F1F1F, lien #A78BFA sur #1F1F1F,
// bouton blanc sur #6D28D9 (7,1:1) ; thème clair : #0D0D0D et #6D28D9 sur blanc.
const SOMBRE = "--bg:#1F1F1F;--tx:#FFFFFF;--mu:#B3B3B3;--li:#A78BFA;--bd:#2A2A2A;--ch:rgba(139,92,246,.14)";
const CLAIR = "--bg:#FFFFFF;--tx:#0D0D0D;--mu:#4A4A4A;--li:#6D28D9;--bd:#E2E2E2;--ch:rgba(109,40,217,.08)";

const CSS =
  `:root{${SOMBRE}}html.t-clair{${CLAIR}}@media (prefers-color-scheme:light){html.t-auto{${CLAIR}}}` +
  // La carte occupe toute la hauteur réservée (fond opaque de l’iframe quand le schéma de couleurs de l’hôte diffère).
  "*{box-sizing:border-box}html,body{margin:0;background:transparent;color:var(--tx)}" +
  "body{font:16px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
  "main{min-height:100vh;background:var(--bg);padding:16px 18px 12px;border:1px solid var(--bd);border-radius:12px;border-top:4px solid #8B5CF6}" +
  "figure,blockquote{margin:0}.titre{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--li);margin:0 0 8px}" +
  ".amorce{font-size:18px;font-weight:500;margin:0 0 12px}" +
  ".chute{font-size:17px;font-weight:600;margin:0 0 12px;padding:10px 12px;border-radius:8px;background:var(--ch);color:var(--tx);outline:none}" +
  "#b{display:none;width:100%;min-height:44px;margin:0 0 12px;border:0;border-radius:8px;background:#6D28D9;color:#FFFFFF;font:inherit;font-weight:600;cursor:pointer}" +
  "#b:hover{background:#7C3AED}a{color:var(--li)}a:focus-visible,#b:focus-visible,.chute:focus-visible{outline:2px solid var(--li);outline-offset:2px}" +
  ".js #b{display:block}.js .chute,.js .pourquoi{display:none}.js.ouvert .chute,.js.ouvert .pourquoi{display:block}.js.ouvert #b{display:none}" +
  ".pourquoi{margin:0 0 8px;font-size:15px}.marque{margin:0;font-size:13px;color:var(--mu);text-align:right}" +
  ".marque a{color:var(--mu);font-weight:600}.vide{margin:0 0 12px;color:var(--mu)}" +
  ".sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}" +
  "@media (prefers-reduced-motion:no-preference){.js.ouvert .chute{animation:f .3s ease-out}@keyframes f{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}}";

const NOUVEL_ONGLET = '<span class="sr"> (s’ouvre dans un nouvel onglet)</span>';

function lien(href: string, texte: string): string {
  return `<a data-utm href="${escapeHtml(href)}" target="_blank" rel="noopener">${texte}${NOUVEL_ONGLET}</a>`;
}

function page(theme: WidgetTheme, corps: string): string {
  return (
    `<!doctype html><html lang="fr" class="t-${theme}"><head><meta charset="utf-8">` +
    '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">' +
    `<title>${escapeHtml(WIDGET_IFRAME_TITLE)}</title><style>${CSS}</style></head>` +
    `<body><main>${corps}<p class="marque">${lien(withWidgetUtm("/", null), "Deviens Marrant")}</p></main>` +
    `<script>${EMBED_INLINE_SCRIPT}</script></body></html>`
  );
}

/** Iframe avec la vanne du jour : amorce, bouton, chute, lien vers la fiche, lien de marque. */
export function renderEmbedVanne(vanne: WidgetVanne, theme: WidgetTheme = "auto"): string {
  return page(
    theme,
    '<figure><figcaption class="titre">La vanne du jour</figcaption><blockquote>' +
      `<p class="amorce">${escapeHtml(vanne.amorce)}</p>` +
      `<p id="c" class="chute" tabindex="-1">${escapeHtml(vanne.chute)}</p></blockquote></figure>` +
      '<button id="b" type="button" aria-expanded="false" aria-controls="c">Révéler la chute</button>' +
      `<p class="pourquoi">${lien(withWidgetUtm(vanne.fichePath, null), "Pourquoi ça marche&nbsp;?")}</p>`,
  );
}

/**
 * Repli neutre sans vanne (liste vide, base indisponible, widget non publié,
 * domaine bloqué) : jamais une vanne hors liste, jamais un message technique.
 */
export function renderEmbedRepli(theme: WidgetTheme = "auto"): string {
  return page(
    theme,
    '<p class="titre">La vanne du jour</p>' +
      // BROUILLON s22 : microtexte du repli, à valider (étalons Thomas, @copywriter).
      '<p class="vide">La vanne du jour revient très vite.</p>',
  );
}
