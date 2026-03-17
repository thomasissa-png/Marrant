"use client";

import Link from "next/link";

/**
 * Renderer markdown léger pour les articles de blog.
 * Supporte : ## H2, ### H3, **gras**, [lien](/url), - listes, > blockquote,
 * --- séparateur, et paragraphes classiques.
 *
 * Pas de dépendance externe. Pensé pour le contenu éditorial de deviens-marrant.fr.
 */

interface BlogContentProps {
  content: string;
}

/** Transforme les segments inline : **bold** et [lien](/url) */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Regex combinée : **bold** ou [texte](url)
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Texte avant le match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // **bold**
      nodes.push(
        <strong key={match.index} className="text-text-primary font-semibold">
          {match[1]}
        </strong>
      );
    } else if (match[2] && match[3]) {
      // [texte](url)
      const href = match[3];
      const isInternal = href.startsWith("/");
      if (isInternal) {
        nodes.push(
          <Link
            key={match.index}
            href={href}
            className="text-accent-primary underline decoration-accent-primary/40 hover:decoration-accent-primary transition-colors"
          >
            {match[2]}
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={match.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary underline decoration-accent-primary/40 hover:decoration-accent-primary transition-colors"
          >
            {match[2]}
          </a>
        );
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // Texte restant
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

/** Parse un bloc de lignes en éléments React */
function parseBlocks(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Ligne vide → skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // --- séparateur
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={key++} className="my-8 border-border" />);
      i++;
      continue;
    }

    // ## H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="font-display text-2xl font-bold text-text-primary mt-10 mb-4"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // ### H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          className="font-display text-xl font-semibold text-text-primary mt-8 mb-3"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // > blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={key++}
          className="my-6 border-l-4 border-accent-primary/50 bg-background-elevated/50 py-3 pl-4 pr-3 text-text-secondary italic rounded-r-lg"
        >
          {renderInline(quoteLines.join(" "))}
        </blockquote>
      );
      continue;
    }

    // - liste non ordonnée
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 space-y-2 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-text-secondary">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" aria-hidden="true" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraphe normal : accumule les lignes non vides
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("## ") && !lines[i].startsWith("### ") && !lines[i].startsWith("- ") && !lines[i].startsWith("> ") && !/^---+$/.test(lines[i].trim())) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={key++} className="text-text-secondary leading-relaxed">
          {renderInline(paraLines.join(" "))}
        </p>
      );
    }
  }

  return elements;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="mt-8 space-y-4">
      {parseBlocks(content)}
    </div>
  );
}
