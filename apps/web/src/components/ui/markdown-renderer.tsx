/**
 * Lightweight markdown-to-HTML renderer for blog articles.
 * Supports: ## h2, ### h3, **bold**, *italic*, [links](url), unordered lists (- item),
 * ordered lists (1. item), and paragraphs separated by double newlines.
 * No external dependency needed.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineMarkdown(text: string): string {
  let result = escapeHtml(text);
  // Bold: **text**
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic: *text*
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-accent-primary hover:underline">$1</a>'
  );
  return result;
}

function renderMarkdown(content: string): string {
  const blocks = content.split("\n\n");
  const htmlParts: string[] = [];

  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i].trim();

    if (!block) {
      i++;
      continue;
    }

    // Heading H2: ## Title
    if (block.startsWith("## ")) {
      const text = block.slice(3);
      htmlParts.push(
        `<h2 class="mt-8 mb-3 font-display text-xl font-bold text-text-primary md:text-2xl">${inlineMarkdown(text)}</h2>`
      );
      i++;
      continue;
    }

    // Heading H3: ### Title
    if (block.startsWith("### ")) {
      const text = block.slice(4);
      htmlParts.push(
        `<h3 class="mt-6 mb-2 font-display text-lg font-semibold text-text-primary">${inlineMarkdown(text)}</h3>`
      );
      i++;
      continue;
    }

    // Unordered list block: lines starting with "- "
    const lines = block.split("\n");
    if (lines.every((l) => l.trimStart().startsWith("- "))) {
      const items = lines
        .map((l) => `<li>${inlineMarkdown(l.trimStart().slice(2))}</li>`)
        .join("");
      htmlParts.push(
        `<ul class="my-3 list-disc space-y-1 pl-6 text-text-secondary">${items}</ul>`
      );
      i++;
      continue;
    }

    // Ordered list block: lines starting with "1. ", "2. ", etc.
    if (lines.every((l) => /^\d+\.\s/.test(l.trimStart()))) {
      const items = lines
        .map((l) => `<li>${inlineMarkdown(l.trimStart().replace(/^\d+\.\s/, ""))}</li>`)
        .join("");
      htmlParts.push(
        `<ol class="my-3 list-decimal space-y-1 pl-6 text-text-secondary">${items}</ol>`
      );
      i++;
      continue;
    }

    // Regular paragraph
    htmlParts.push(
      `<p class="text-text-secondary">${inlineMarkdown(block.replace(/\n/g, "<br/>"))}</p>`
    );
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
      className={`space-y-4 leading-relaxed ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
