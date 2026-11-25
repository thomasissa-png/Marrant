import { Fragment } from "react";
import { renderMarkdownSections } from "@/components/ui/markdown-renderer";
import { DemoVanne } from "@/components/blog/demo-vanne";
import { LettreInscription } from "@/components/lettre/lettre-inscription";
import { BLOC_APPEL } from "@/components/layout/gabarit";
import { LETTRE_ARTICLE } from "@/config/textes/cta-articles-accueil";
import { computeEncartPlacements, placerLettreEnPremier, visibleTextLength } from "@/lib/blog-encarts";
import { getCarnetDemo } from "@/lib/carnet";
import { cn } from "@/lib/utils";

interface BlogArticleBodyProps {
  slug: string;
  category?: string;
  content: string;
  shareJokes?: boolean;
  /** s27 : article « blagues » (`lettreEnPremierSurArticle`), lettre gratuite après la 1re section. */
  lettreEnPremier?: boolean;
}

/**
 * Corps d'un article (statique ou en base) avec son encart au fil du texte (s20 ;
 * s21 : `DemoVanne`, la fiche offerte du carnet du mois, absente s'il n'y en a pas).
 * Rendu identique à MarkdownRenderer, découpé en sections pour glisser un encart
 * entre deux H2 (placement : lib/blog-encarts.ts). Chaque section est un
 * `data-blog-section` : la mesure des liens (linkZone) s'arrête à ce niveau.
 */
export function BlogArticleBody({ slug, category, content, shareJokes = false, lettreEnPremier = false }: BlogArticleBodyProps) {
  const sections = renderMarkdownSections(content, { shareJokes });
  // Fiche offerte du mois (ISR 1 h : le changement de mois suit à l'heure près).
  const demo = getCarnetDemo();
  const poids = sections.map((s) => ({ heading: s.heading, weight: visibleTextLength(s.html) }));
  const encarts = computeEncartPlacements(slug, category, poids);
  // s27 : lettre d'abord (lib/blog-encarts `placerLettreEnPremier`), l'encart descend d'une section.
  const { lettreApres, encarts: placements } = lettreEnPremier
    ? placerLettreEnPremier(poids, encarts)
    : { lettreApres: null, encarts };

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
            {index === lettreApres && (
              <LettreInscription
                emplacement="article"
                slug={slug}
                textes={LETTRE_ARTICLE}
                positionBlog="milieu"
                className={cn("my-10", BLOC_APPEL)}
              />
            )}
            {encart && demo && <DemoVanne demo={demo} position={encart.position} parcours={encart.parcours} />}
          </Fragment>
        );
      })}
    </div>
  );
}
