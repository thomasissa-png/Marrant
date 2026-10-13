"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { isPremiumPlan } from "@/lib/parcours-access";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { cn } from "@/lib/utils";
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

interface ArticleCtaProps {
  /** Parcours de l'article (lib/blog-parcours) : étape 1 et retour après paiement. */
  parcours?: ParcoursSlug;
  /** Source du clic pour la mesure du tunnel (`blog-<slug>`), relayée par /abonnement. */
  src?: string;
  /** Surcharges par article (config/textes/encarts-blog-s20 puis config/blog-cta). */
  title?: string;
  text?: string;
  note?: string;
}

/**
 * Bloc de fin unique d'un article (audit conversion s20, lot 1) : fusion de l'encart
 * « Parcours recommandé » et de l'ancien CTA de fin. Toujours le même ordre :
 * 1. étape 1 gratuite du parcours, bouton CONTOUR (`data-blog-cta="etape-1"`) ;
 * 2. Premium, bouton PRINCIPAL vers /abonnement?src=blog-<slug> (`data-blog-cta="abonnement"`).
 * Abonné : un seul bouton « Continuer mon parcours » (`data-blog-cta="parcours"`),
 * vers l'étape à reprendre, sinon l'étape 1 du parcours de l'article.
 *
 * Mesure : `data-blog-cta-position="fin"` + `data-blog-cta-parcours`
 * (blog-cta-vu / blog-cta-clic, components/blog/blog-article-tracking).
 * Textes : config/textes/encarts-blog-s20.ts.
 */
export function ArticleCta({ parcours = "repartie", src, title, text, note }: ArticleCtaProps) {
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

  return (
    <aside
      aria-label={TEXTES_BLOC_FIN.ariaLabel}
      data-blog-bloc-fin
      data-blog-cta-position="fin"
      data-blog-cta-parcours={parcours}
      className="mt-12 rounded-lg border border-border bg-background-card p-6"
    >
      {semaines !== null && (
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{frTypo(surtitre)}</p>
      )}
      <p className="mt-2 font-display text-xl font-bold text-text-primary">{frTypo(title ?? textes.finTitre)}</p>
      {(text ?? textes.finTexte) && <p className="mt-2 text-text-secondary">{frTypo(text ?? textes.finTexte)}</p>}
      {textes.finPuces.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-text-secondary">
          {textes.finPuces.map((puce) => (
            <li key={puce} className="flex gap-2">
              <span aria-hidden className="text-accent-link">
                →
              </span>
              <span>{frTypo(puce)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {isPremium ? (
          <Link
            href={continuerHref}
            data-blog-cta="parcours"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "min-h-12")}
          >
            {TEXTES_BLOC_FIN.boutonAbonne}
          </Link>
        ) : (
          <>
            <Link
              href={etape1Href}
              data-blog-cta="etape-1"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-auto min-h-12 whitespace-normal border-accent-primary/60 px-4 py-2 text-center hover:border-accent-primary",
              )}
            >
              {frTypo(textes.finBoutonEtape1)}
            </Link>
            <Link
              href={buildAbonnementUrl(`/parcours/${parcours}`, "monthly", src)}
              data-blog-cta="abonnement"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "h-auto min-h-12 whitespace-normal px-4 py-2 text-center [text-wrap:balance]",
              )}
            >
              {frTypo(TEXTES_BLOC_FIN.boutonPremium)}
            </Link>
          </>
        )}
      </div>

      {!isPremium && <p className="mt-3 text-xs text-text-muted">{frTypo(note ?? TEXTES_BLOC_FIN.note)}</p>}
    </aside>
  );
}
