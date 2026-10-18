import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MasquePourPremium } from "@/components/blog/masque-pour-premium";
import { cn } from "@/lib/utils";
import { frTypo } from "@/lib/fr-typo";
import type { CarnetDemo } from "@/lib/carnet";
import type { BlogCtaPosition } from "@/lib/blog-encarts";
import type { ParcoursSlug } from "@/lib/entrees-parcours";
import { DEMO_VANNE } from "@/config/textes/cta-articles-accueil";

interface DemoVanneProps {
  /** Fiche offerte du carnet du mois (`getCarnetDemo`), déjà réduite au nécessaire. */
  demo: CarnetDemo;
  position: Exclude<BlogCtaPosition, "fin">;
  /** Parcours de la section (mesure `blog-cta-vu` / `blog-cta-clic`, inchangée). */
  parcours: ParcoursSlug;
}

/**
 * Encart « démonstration » au milieu d'un article (spec `cta-forme-place-s21.md` §2,
 * bloc B1, variante « milieu ») : remplace `BlogEncartMilieu`. Une situation réelle du
 * carnet (la fiche offerte du mois) dans un objet plus sombre que la carte, puis UN
 * bouton plein vers cette même fiche sur /carnet. La situation n'est pas cliquable
 * (une seule cible tactile). Masqué pour un abonné Premium (comme la lettre).
 *
 * Mesure : `data-blog-cta="demo-fiche"` (blog-cta-clic, bouton) et
 * `data-blog-cta-position` / `data-blog-cta-parcours` / `data-blog-cta-fiche`
 * (blog-cta-vu, blog-cta-clic), lus par `blog-article-tracking`.
 * Textes : `config/textes/cta-articles-accueil.ts` (DEMO_VANNE).
 */
export function DemoVanne({ demo, position, parcours }: DemoVanneProps) {
  const { fiche } = demo;
  const href = `/carnet?src=blog-demo-${position}#fiche-${fiche.id}`;
  return (
    <MasquePourPremium>
      <aside
        aria-label={DEMO_VANNE.surtitre}
        data-blog-zone="cta-milieu"
        data-blog-cta-position={position}
        data-blog-cta-parcours={parcours}
        data-blog-cta-fiche={fiche.id}
        data-demo-vanne="milieu"
        className="my-10 rounded-lg border border-border bg-background-card p-5 sm:p-6"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{frTypo(DEMO_VANNE.surtitre)}</p>
        <div className="mt-3 rounded-md border border-border bg-background p-4">
          <p className="text-base text-text-primary">{frTypo(DEMO_VANNE.situation(fiche.accroche, fiche.onTeDit))}</p>
          <p className="mt-2 font-semibold text-text-primary">{frTypo(DEMO_VANNE.question)}</p>
        </div>
        <Link
          href={href}
          data-blog-cta="demo-fiche"
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "mt-4 h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance] sm:w-auto",
          )}
        >
          {frTypo(DEMO_VANNE.bouton)}
        </Link>
      </aside>
    </MasquePourPremium>
  );
}
