import { Fragment } from "react";
import { renderMarkdownSections } from "@/components/ui/markdown-renderer";
import { BlogEncartMilieu } from "@/components/blog/blog-encart-milieu";
import { computeEncartPlacements, visibleTextLength } from "@/lib/blog-encarts";
import { ENCARTS_ARTICLE_1, TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";

interface BlogArticleBodyProps {
  slug: string;
  category?: string;
  content: string;
  shareJokes?: boolean;
}

/**
 * Corps d'un article (statique ou en base) avec ses encarts au fil du texte (s20).
 * Rendu identique à MarkdownRenderer, découpé en sections pour glisser un encart
 * entre deux H2 (placement : lib/blog-encarts.ts). Chaque section est un
 * `data-blog-section` : la mesure des liens (linkZone) s'arrête à ce niveau.
 */
export function BlogArticleBody({ slug, category, content, shareJokes = false }: BlogArticleBodyProps) {
  const sections = renderMarkdownSections(content, { shareJokes });
  const placements = computeEncartPlacements(
    slug,
    category,
    sections.map((s) => ({ heading: s.heading, weight: visibleTextLength(s.html) })),
  );

  return (
    <div data-blog-body className="mt-8">
      {sections.map((section, index) => {
        const encart = placements.find((p) => p.apresIndex === index);
        return (
          <Fragment key={index}>
            {section.html && (
              <div
                data-blog-section
                className={index === 0 ? "leading-relaxed [&>*:first-child]:mt-0" : "leading-relaxed"}
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            )}
            {encart && (
              <BlogEncartMilieu
                position={encart.position}
                parcours={encart.parcours}
                textes={encart.texte ? ENCARTS_ARTICLE_1[encart.texte] : TEXTES_PARCOURS_BLOG[encart.parcours].encartMilieu}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
