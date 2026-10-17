import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { frTypo } from "@/lib/fr-typo";
import { parcoursEtape1Href, type ParcoursSlug } from "@/lib/entrees-parcours";
import type { BlogCtaPosition } from "@/lib/blog-encarts";
import type { TexteEncartMilieu } from "@/config/textes/encarts-blog-s20";

interface BlogEncartMilieuProps {
  position: Exclude<BlogCtaPosition, "fin">;
  parcours: ParcoursSlug;
  textes: TexteEncartMilieu;
}

/**
 * Encart au fil du texte (audit conversion s20, lot 1) : composant serveur, dans le
 * flux de lecture (ni fenêtre surgissante ni barre collante). Un seul bouton, en
 * contour (étape gratuite, pas le bouton payant), vers l'étape 1 du parcours.
 *
 * Mesure (components/blog/blog-article-tracking) : `data-blog-cta-position` et
 * `data-blog-cta-parcours` alimentent `blog-cta-vu` (encart visible à 50 %) et
 * `blog-cta-clic` ; `data-blog-cta="etape-1"` marque le bouton.
 */
export function BlogEncartMilieu({ position, parcours, textes }: BlogEncartMilieuProps) {
  return (
    <aside
      aria-label={textes.surtitre}
      data-blog-zone="cta-milieu"
      data-blog-cta-position={position}
      data-blog-cta-parcours={parcours}
      className="my-10 rounded-lg border border-border border-l-4 border-l-accent-primary bg-background-card p-5"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{frTypo(textes.surtitre)}</p>
      <p className="mt-2 font-display text-lg font-bold text-text-primary">{frTypo(textes.titre)}</p>
      <p className="mt-1 text-sm text-text-secondary">{frTypo(textes.texte)}</p>
      <Link
        href={parcoursEtape1Href(parcours, "blog-milieu")}
        data-blog-cta="etape-1"
        className={cn(
          buttonVariants({ variant: "outline-accent", size: "md" }),
          // Correctif s21 (QA 375 px) : lignes équilibrées, le nom du parcours n'est jamais seul en 2e ligne.
          "mt-4 h-auto min-h-[44px] w-full whitespace-normal py-2 text-center [text-wrap:balance] sm:w-auto",
        )}
      >
        {frTypo(textes.bouton)}
      </Link>
    </aside>
  );
}
