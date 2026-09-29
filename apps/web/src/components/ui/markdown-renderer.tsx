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

function inlineMarkdown(text: string): string {
  let result = escapeHtml(frTypo(text));
  // Bold: **text**
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic: *text*
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-accent-link hover:underline">$1</a>'
  );
  return result;
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
        .map((l) => `<li>${inlineMarkdown(l.trimStart().slice(2))}</li>`)
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

export function renderMarkdown(content: string): string {
  const blocks = content.split("\n\n");
  const htmlParts: string[] = [];

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
          ? `<h2 class="mt-12 mb-4 font-display text-xl font-bold text-text-primary md:text-2xl">${text}</h2>`
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

    htmlParts.push(renderBlock(block));
    i++;
  }

  return htmlParts.join("");
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const html = renderMarkdown(content);
  return (
    <div
      className={`leading-relaxed [&>*:first-child]:mt-0 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
