/**
 * Lightweight markdown-to-HTML renderer for blog articles.
 * Supports: ## h2, ### h3, **bold**, *italic*, [links](url), unordered lists (- item),
 * ordered lists (1. item), blockquotes (> text), separators (---) and paragraphs
 * separated by double newlines. A block may mix an intro line with a list or a quote.
 * French typography (non-breaking spaces) is applied at render time only.
 * No external dependency needed.
 */

import { frTypo } from "@/lib/fr-typo";

const P_CLASS = "mt-4 text-text-secondary";
const UL_CLASS = "mt-3 list-disc space-y-1 pl-6 text-text-secondary";
const OL_CLASS = "mt-3 list-decimal space-y-1 pl-6 text-text-secondary";
const QUOTE_CLASS =
  "mt-6 rounded-r-lg border-l-4 border-accent-primary bg-accent-primary/10 px-4 py-3 text-text-primary";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}

/**
 * Ligne numérotée d'un article, en début de bloc (1re ligne seule : l'indication
 * d'usage en italique, à la ligne suivante, n'est jamais partagée) :
 * « **12.** « … » » (vanne entre guillemets, capturée telle quelle comme sur
 * l'étalon) ou « **12.** texte » (message sans guillemets).
 */
const JOKE_RE = /^\*\*(\d+)\.\*\* («[^\n]+»|[^\n]+)/;

/**
 * Titre de situation numéroté, seul dans son bloc : « **12. Sa bio dit : … ** ».
 * Suivi d'un blockquote (format A3), c'est le blockquote qui est partagé.
 */
const TITLED_RE = /^\*\*(\d+)\. [^\n]+\*\*$/;

/**
 * « … « x » … » écrit en guillemets français aux deux niveaux (vannes de B2) :
 * le 2e niveau est rendu “x”, comme frenchQuotes le fait pour "x" (notations B2
 * iter2, A4 iter3). Seul un « » DANS un « … » extérieur est converti : les « » de
 * 1er niveau (messages A3 en blockquote, sans guillemets propres) restent « ».
 * Rendu et texte partagé seulement, texte stocké intact. Imbrication déséquilibrée
 * ou à 3 niveaux : texte inchangé.
 */
export function nestedGuillemets(text: string): string {
  if ((text.match(/«/g) ?? []).length < 2) return text;
  let depth = 0;
  let out = "";
  for (const c of text) {
    if (c === "«") {
      depth++;
      if (depth > 2) return text;
      out += depth === 2 ? "“" : c;
    } else if (c === "»") {
      if (depth === 0) return text;
      out += depth === 2 ? "”" : c;
      depth--;
    } else out += c;
  }
  if (depth !== 0) return text;
  return out.replace(new RegExp(`“[ ${NBSP}]+`, "g"), "“").replace(new RegExp(`[ ${NBSP}]+”`, "g"), "”");
}

/** Texte partagé : sans indication « *→ …* » en fin de ligne ni markdown (liens, gras, italique, code). */
function shareText(line: string): string {
  return line
    .replace(/\s*\*→.*$/, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*`]/g, "")
    .trim();
}

export interface RenderOptions {
  /**
   * Emplacement de partage sur chaque vanne numérotée : `span[data-share-vanne]`
   * flottant à droite (44 px réservés, pas de hauteur ajoutée), rempli côté client
   * par le bouton Partager du site (components/blog/blog-vanne-share).
   */
  shareJokes?: boolean;
}

// Espace insécable (U+00A0), écrite par son code pour rester visible dans le source.
const NBSP = String.fromCharCode(0xa0);
// Mot composé de 2 parties courtes (8 lettres max chacune) : Post-it, week-end, petit-déj.
// Classe de lettres explicite, sans \p{L} : tsconfig.build.json cible ES2017
// (même convention que lib/learning-format.ts). Préfixe capturé au lieu d'un lookbehind.
const L = "A-Za-zÀ-ÖØ-öø-ÿŒœ";
const COMPOUND_RE = new RegExp(`(^|[^${L}-])([${L}]{1,8}-[${L}]{1,8})(?=[^${L}-]|$)`, "g");
// Segments protégés : cible des liens « ](url) » et code inline `…` (jamais modifiés).
const PROTECTED_RE = /(\]\([^)]*\)|`[^`]*`)/g;
const PLACEHOLDER = String.fromCharCode(0);

const OPEN_BEFORE = /[\s([{'’«\-]/;
const CLOSE_AFTER = /[\s.,;:!?)\]…'’»\-]/;

/**
 * Citation dans une citation (« il dit "x". Ah… ») : sans ce passage, l'appariement
 * séquentiel donne « … » x « … » (guillemets inversés). Chaque " est classé ouvrant
 * ou fermant d'après ses voisins ; une pile rend le niveau 1 en « … » et le niveau 2
 * en “…”. Renvoie null au moindre guillemet ambigu (repli sur l'appariement simple).
 */
function nestedQuotes(masked: string): string | null {
  let depth = 0;
  let maxDepth = 0;
  let out = "";
  for (let i = 0; i < masked.length; i++) {
    const c = masked[i];
    if (c !== '"') {
      out += c;
      continue;
    }
    const prev = i > 0 ? masked[i - 1] : undefined;
    const next = i < masked.length - 1 ? masked[i + 1] : undefined;
    const opens = (prev === undefined || OPEN_BEFORE.test(prev)) && next !== undefined && !/\s/.test(next);
    const closes = prev !== undefined && !/\s/.test(prev) && (next === undefined || CLOSE_AFTER.test(next));
    if (opens === closes) return null;
    if (opens) {
      if (depth >= 2) return null;
      out += depth === 0 ? `«${NBSP}` : "“";
      depth++;
      maxDepth = Math.max(maxDepth, depth);
    } else {
      if (depth === 0) return null;
      depth--;
      out += depth === 0 ? `${NBSP}»` : "”";
    }
  }
  // Pas d'imbrication : on laisse l'appariement simple (comportement historique).
  if (depth !== 0 || maxDepth < 2) return null;
  return out;
}

/**
 * Guillemets droits "…" rendus en « … » (espaces insécables intérieures), AU RENDU.
 * Uniquement si les guillemets du bloc forment des paires équilibrées ; les URL
 * de liens et le code inline sont masqués pendant la conversion. Texte stocké intact.
 */
export function frenchQuotes(text: string): string {
  if (!text.includes('"')) return text;
  const saved: string[] = [];
  const masked = text.replace(PROTECTED_RE, (m) => {
    saved.push(m);
    return `${PLACEHOLDER}${saved.length - 1}${PLACEHOLDER}`;
  });
  const count = (masked.match(/"/g) ?? []).length;
  if (count === 0 || count % 2 !== 0) return text;
  const converted =
    nestedQuotes(masked) ??
    masked.replace(/"([^"\n]+?)"/g, (_m, inner: string, offset: number) => {
      // Citation dans un passage déjà entre « … » (vanne) : 2e niveau en “…”,
      // comme nestedQuotes, sinon on lit « « … » … » et la vanne semble finir trop tôt.
      const before = masked.slice(0, offset);
      const inside = (before.match(/«/g) ?? []).length > (before.match(/»/g) ?? []).length;
      return inside ? `“${inner.trim()}”` : `«${NBSP}${inner.trim()}${NBSP}»`;
    });
  if (converted.includes('"')) return text;
  return converted.replace(new RegExp(`${PLACEHOLDER}(\\d+)${PLACEHOLDER}`, "g"), (_m, i: string) => saved[Number(i)]);
}

function inlineMarkdown(text: string): string {
  let result = escapeHtml(frTypo(nestedGuillemets(frenchQuotes(text))));
  // Bold: **text**
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic: *text*
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-accent-link hover:underline">$1</a>'
  );
  return keepCompoundsTogether(result);
}

/**
 * Mot composé court (Post-it, week-end, Wi-Fi) jamais coupé en fin de ligne :
 * enveloppé dans un span nowrap (pas de caractère spécial : aucune dépendance à
 * la police, le copier-coller garde le vrai trait d'union). Texte seul : les
 * segments impairs du split sont des balises (href, class), laissées intactes.
 */
export function keepCompoundsTogether(html: string): string {
  return html
    .split(/(<[^>]*>)/)
    .map((part, i) =>
      i % 2 === 1 ? part : part.replace(COMPOUND_RE, '$1<span class="whitespace-nowrap">$2</span>'),
    )
    .join("");
}

/**
 * Ancre stable d'un titre (sommaires, liens #…) : texte brut du Markdown en
 * minuscules, sans accents ni ponctuation, mots séparés par des tirets
 * (« Les vannes entre potes (le labo d'essai) » → « les-vannes-entre-potes-le-labo-d-essai »).
 * Calculée sur le texte stocké, jamais sur le rendu typographié : l'ancre ne
 * bouge pas si frTypo ou frenchQuotes évoluent.
 */
export function headingId(text: string): string {
  const slug = text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    // NFD sépare la lettre de son accent ; on retire les diacritiques combinants
    // (plage Unicode, invisible par nature : pas d'équivalent UTF-8 lisible).
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

type LineKind = "quote" | "ul" | "ol" | "text";

function lineKind(line: string): LineKind {
  const l = line.trimStart();
  if (l.startsWith(">")) return "quote";
  if (l.startsWith("- ")) return "ul";
  if (/^\d+\.\s/.test(l)) return "ol";
  return "text";
}

function renderGroup(kind: LineKind, lines: string[]): string {
  switch (kind) {
    case "quote": {
      const text = lines.map((l) => l.trimStart().replace(/^>\s?/, "")).join("\n");
      return `<blockquote class="${QUOTE_CLASS}">${inlineMarkdown(text).replace(/\n/g, "<br/>")}</blockquote>`;
    }
    case "ul": {
      const items = lines
        .map((l) => {
          const item = l.trimStart().slice(2);
          // Puce réduite à un seul lien : zone de tap pleine hauteur (44 px) sur mobile.
          const solo = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(item.trim());
          return solo
            ? `<li><a href="${escapeAttr(solo[2])}" class="inline-flex min-h-[44px] items-center text-accent-link hover:underline">${inlineMarkdown(solo[1])}</a></li>`
            : `<li>${inlineMarkdown(item)}</li>`;
        })
        .join("");
      return `<ul class="${UL_CLASS}">${items}</ul>`;
    }
    case "ol": {
      const items = lines
        .map((l) => `<li>${inlineMarkdown(l.trimStart().replace(/^\d+\.\s/, ""))}</li>`)
        .join("");
      return `<ol class="${OL_CLASS}">${items}</ol>`;
    }
    default:
      return `<p class="${P_CLASS}">${inlineMarkdown(lines.join("\n")).replace(/\n/g, "<br/>")}</p>`;
  }
}

/** Block made of consecutive groups (intro line + list, intro + quote, etc.). */
function renderBlock(block: string): string {
  const parts: string[] = [];
  let kind: LineKind | null = null;
  let buffer: string[] = [];
  for (const line of block.split("\n")) {
    const k = lineKind(line);
    if (kind !== null && k !== kind) {
      parts.push(renderGroup(kind, buffer));
      buffer = [];
    }
    kind = k;
    buffer.push(line);
  }
  if (kind !== null) parts.push(renderGroup(kind, buffer));
  return parts.join("");
}

export function renderMarkdown(content: string, options: RenderOptions = {}): string {
  const blocks = content.split("\n\n");
  const htmlParts: string[] = [];
  // Ancres uniques dans la page : un 2e titre identique reçoit « -2 », etc.
  const usedIds = new Map<string, number>();
  const uniqueId = (text: string): string => {
    const base = headingId(text);
    const n = (usedIds.get(base) ?? 0) + 1;
    usedIds.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };

  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i].trim();

    if (!block) {
      i++;
      continue;
    }

    // Heading H2 / H3. Text following on the next lines of the same block
    // is rendered as a normal block right after the heading.
    const heading = /^(#{2,3}) (.*)$/.exec(block.split("\n")[0]);
    if (heading) {
      const text = inlineMarkdown(heading[2]);
      htmlParts.push(
        heading[1] === "##"
          ? `<h2 id="${uniqueId(heading[2])}" class="mt-12 mb-4 scroll-mt-20 font-display text-xl font-bold text-text-primary md:text-2xl">${text}</h2>`
          : `<h3 class="mt-8 mb-3 font-display text-lg font-semibold text-text-primary">${text}</h3>`
      );
      const rest = block.split("\n").slice(1).join("\n").trim();
      if (rest) {
        blocks[i] = rest;
        continue;
      }
      i++;
      continue;
    }

    // Separator: ---
    if (/^-{3,}$/.test(block)) {
      htmlParts.push('<hr class="my-10 border-border" />');
      i++;
      continue;
    }

    // Message en blockquote sous un titre « **N. Situation** » (format A3) :
    // emplacement Partager à côté du titre, texte partagé = le blockquote seul.
    const titled = options.shareJokes ? TITLED_RE.exec(block) : null;
    const quoteLines = titled ? (blocks[i + 1] ?? "").trim().split("\n") : [];
    if (titled && quoteLines.every((line) => line.startsWith(">"))) {
      // La citation en retrait tient lieu de guillemets : les « » du message restent au
      // 1er niveau, affichés et partagés tels quels (notation A3 iter3 F3).
      const message = quoteLines.map((line) => line.replace(/^>\s?/, "")).join("\n");
      htmlParts.push(
        `<div id="vanne-${titled[1]}" class="flow-root scroll-mt-20"><span data-share-vanne="${titled[1]}" data-text="${escapeAttr(shareText(message))}" class="float-right ml-3 mt-3 block h-11 w-11"></span>${renderBlock(block)}${renderBlock(message.split("\n").map((line) => `> ${line}`).join("\n"))}</div>`,
      );
      i += 2;
      continue;
    }

    const joke = options.shareJokes ? JOKE_RE.exec(block) : null;
    htmlParts.push(
      joke
        ? `<div id="vanne-${joke[1]}" class="flow-root scroll-mt-20"><span data-share-vanne="${joke[1]}" data-text="${escapeAttr(nestedGuillemets(shareText(joke[2])))}" class="float-right ml-3 mt-3 block h-11 w-11"></span>${renderBlock(block)}</div>`
        : renderBlock(block),
    );
    i++;
  }

  return htmlParts.join("");
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** Emplacement Partager sur chaque vanne numérotée (défaut : non). */
  shareJokes?: boolean;
}

export function MarkdownRenderer({ content, className, shareJokes = false }: MarkdownRendererProps) {
  const html = renderMarkdown(content, { shareJokes });
  return (
    <div
      className={`leading-relaxed [&>*:first-child]:mt-0 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
