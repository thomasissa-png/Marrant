"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { isPremiumPlan } from "@/lib/parcours-access";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { cn } from "@/lib/utils";
import { LIEN_L1 } from "@/components/premium/mur-liste";
import { frTypo } from "@/lib/fr-typo";
import { PREMIUM_PARCOURS } from "@/config/premium";
import {
  PARCOURS_NOMS,
  parcoursEtape1Href,
  parcoursEtapeHref,
  type ParcoursSlug,
} from "@/lib/entrees-parcours";
import { useParcoursAReprendre } from "@/hooks/use-parcours-a-reprendre";
import { TEXTES_BLOC_FIN, TEXTES_PARCOURS_BLOG } from "@/config/textes/encarts-blog-s20";
import { BLOC_FIN } from "@/config/textes/cta-articles-accueil";

interface ArticleCtaProps {
  /** Parcours de l'article (lib/blog-parcours) : étape 1 et retour après paiement. */
  parcours?: ParcoursSlug;
  /** Source du clic pour la mesure du tunnel (`blog-<slug>`), relayée par /abonnement. */
  src?: string;
  /** Surcharges par article (cta-articles-accueil, encarts-blog-s20 puis blog-cta). */
  title?: string;
  text?: string;
  note?: string;
  /** `isAnnualPlanAvailable()` lu côté serveur : l'annuel n'apparaît dans [S9] que s'il existe. */
  annuelDisponible?: boolean;
}


/**
 * Bloc de fin unique d'un article (s20, revu s21 : spec `cta-forme-place-s21.md` §2.5
 * variante « fin », bloc B2, température froide). Ordre :
 * 1. étape 1 gratuite du parcours, bouton PLEIN (`data-blog-cta="etape-1"`), seul plein ;
 * 2. lien fort payant vers /abonnement?src=blog-<slug> (`data-blog-cta="abonnement"`) ;
 * 3. note [S9] (prix TTC, garantie du premier paiement, résiliation en ligne).
 * Plus de puces. Abonné : un seul bouton « Continuer mon parcours » (`data-blog-cta="parcours"`),
 * vers l'étape à reprendre, sinon l'étape 1 du parcours de l'article.
 *
 * Mesure : `data-blog-cta-position="fin"` + `data-blog-cta-parcours`
 * (blog-cta-vu / blog-cta-clic, components/blog/blog-article-tracking).
 * Textes : config/textes/cta-articles-accueil.ts (BLOC_FIN) et encarts-blog-s20.ts.
 */
export function ArticleCta({ parcours = "repartie", src, title, text, note, annuelDisponible = false }: ArticleCtaProps) {
  const { data: session, status } = useSession();
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const aReprendre = useParcoursAReprendre();
  const textes = TEXTES_PARCOURS_BLOG[parcours];
  const etape1Href = parcoursEtape1Href(parcours, "blog");
  const continuerHref = aReprendre ? parcoursEtapeHref(aReprendre.slug, aReprendre.etape, "blog") : etape1Href;
  // Lecture directe de config/premium : pas de lib/blog-parcours (clusters) dans le bundle client.
  const semaines = PREMIUM_PARCOURS.find((p) => p.slug === parcours)?.weeks ?? null;
  const surtitre = TEXTES_BLOC_FIN.surtitre
    .replace("{parcours}", PARCOURS_NOMS[parcours])
    .replace("{semaines}", String(semaines ?? ""));
  const paragraphe = text ?? textes.finTexte;

  return (
    <aside
      aria-label={TEXTES_BLOC_FIN.ariaLabel}
      data-blog-bloc-fin
      data-blog-cta-position="fin"
      data-blog-cta-parcours={parcours}
      className="mt-10 rounded-lg border border-border bg-background-card p-5 sm:p-6"
    >
      {semaines !== null && (
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{frTypo(surtitre)}</p>
      )}
      <p className="mt-2 font-display text-xl font-bold text-text-primary">{frTypo(title ?? textes.finTitre)}</p>
      {/* s21 : texte en 14/20 sous 640 px (spec §2.1 Z3) pour tenir 560 px à 375 (mesuré). */}
      {paragraphe && <p className="mt-2 text-sm leading-5 text-text-secondary sm:text-base sm:leading-6">{frTypo(paragraphe)}</p>}

      {isPremium ? (
        <div className="mt-6">
          <Link
            href={continuerHref}
            data-blog-cta="parcours"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "min-h-12")}
          >
            {TEXTES_BLOC_FIN.boutonAbonne}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={etape1Href}
              data-blog-cta="etape-1"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                // Correctif s21 (QA 375 px) : lignes équilibrées, le nom du parcours n'est jamais seul en 2e ligne.
                "h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance] sm:w-auto",
              )}
            >
              {frTypo(BLOC_FIN.boutonEtape1[parcours] ?? textes.finBoutonEtape1)}
            </Link>
            <Link
              href={buildAbonnementUrl(`/parcours/${parcours}`, "monthly", src)}
              data-blog-cta="abonnement"
              className={cn(LIEN_L1, "self-start sm:self-auto")}
            >
              {frTypo(BLOC_FIN.lienAbonnement)}
            </Link>
          </div>
          <p className="mt-2 text-xs text-text-muted">{frTypo(note ?? BLOC_FIN.note(annuelDisponible))}</p>
        </>
      )}
    </aside>
  );
}
