"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { isPremiumPlan } from "@/lib/parcours-access";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { cn } from "@/lib/utils";
import { BLOC_APPEL, BOUTON_BLOC_APPEL, TITRE_BLOC_APPEL } from "@/components/layout/gabarit";
import { LIEN_L1 } from "@/components/ui/liens";
import { frTypo } from "@/lib/fr-typo";
import { parcoursEtape1Href, parcoursEtapeHref, type ParcoursSlug } from "@/lib/entrees-parcours";
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
  /** Libellé du plein gratuit imposé par l'article (config/blog-cta.ts), sinon celui du parcours. */
  boutonEtape1?: string;
}

/**
 * Règle unique de ponctuation des titres du bloc de fin (fins-articles-v3) : pas de point final,
 * sauf « ? » et « » » (qui restent tels quels).
 */
export function titreBlocFin(titre: string): string {
  return titre.trim().replace(/\.+$/, "");
}


/**
 * Bloc de fin unique d'un article (s20, revu s21 puis concision v5, textes-v5-a §3) :
 * titre, une phrase, puis
 * 1. étape 1 gratuite du parcours, bouton PLEIN (`data-blog-cta="etape-1"`), seul plein ;
 * 2. « Sans compte. » juste dessous ;
 * 3. lien payant `OUVRIR` vers /abonnement?src=blog-<slug> (`data-blog-cta="abonnement"`).
 * Plus de puces. Abonné : un seul bouton « Continuer mon parcours » (`data-blog-cta="parcours"`),
 * vers l'étape à reprendre, sinon l'étape 1 du parcours de l'article.
 *
 * Mesure : `data-blog-cta-position="fin"` + `data-blog-cta-parcours`
 * (blog-cta-vu / blog-cta-clic, components/blog/blog-article-tracking).
 * Textes : config/textes/cta-articles-accueil.ts (BLOC_FIN) et encarts-blog-s20.ts.
 */
export function ArticleCta({ parcours = "repartie", src, title, text, boutonEtape1 }: ArticleCtaProps) {
  const { data: session, status } = useSession();
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const aReprendre = useParcoursAReprendre();
  const textes = TEXTES_PARCOURS_BLOG[parcours];
  const etape1Href = parcoursEtape1Href(parcours, "blog");
  const continuerHref = aReprendre ? parcoursEtapeHref(aReprendre.slug, aReprendre.etape, "blog") : etape1Href;
  const paragraphe = text ?? textes.finTexte;

  return (
    <aside
      aria-label={TEXTES_BLOC_FIN.ariaLabel}
      data-blog-bloc-fin
      data-blog-cta-position="fin"
      data-blog-cta-parcours={parcours}
      className={cn("mt-10", BLOC_APPEL)}
    >
      {/* s21 (QA m2) : 18 px sous 640 px, le titre tient sur 2 lignes à 360 et 375. */}
      <p className={TITRE_BLOC_APPEL}>
        {frTypo(titreBlocFin(title ?? textes.finTitre))}
      </p>
      {/* s21 : texte en 14/20 sous 640 px (spec §2.1 Z3) pour tenir 560 px à 375 (mesuré).
          s21 (QA v2 m-d) : corps du visiteur (« sans compte », étape par semaine) masqué pour l'abonné. */}
      {paragraphe && !isPremium && <p className="mt-2 text-sm leading-5 text-text-secondary sm:text-base sm:leading-6">{frTypo(paragraphe)}</p>}

      {isPremium ? (
        <div className="mt-6">
          <Link
            href={continuerHref}
            data-blog-cta="parcours"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), BOUTON_BLOC_APPEL)}
          >
            {TEXTES_BLOC_FIN.boutonAbonne}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 sm:mt-6">
            <Link
              href={etape1Href}
              data-blog-cta="etape-1"
              // Correctif s21 (QA 375 px) : lignes équilibrées, le nom du parcours n'est jamais seul en 2e ligne.
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), BOUTON_BLOC_APPEL)}
            >
              {frTypo(boutonEtape1 ?? textes.finBoutonEtape1)}
            </Link>
            <p className="mt-2 text-xs text-text-muted">{frTypo(BLOC_FIN.noteSansCompte)}</p>
          </div>
          <Link
            href={buildAbonnementUrl(`/parcours/${parcours}`, "monthly", src)}
            data-blog-cta="abonnement"
            className={cn(LIEN_L1, "mt-3")}
          >
            {frTypo(BLOC_FIN.lienAbonnement)}
          </Link>
        </>
      )}
    </aside>
  );
}
