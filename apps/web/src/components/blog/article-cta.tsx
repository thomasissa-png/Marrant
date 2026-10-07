"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";
import { isPremiumPlan } from "@/lib/parcours-access";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { cn } from "@/lib/utils";

interface ArticleCtaProps {
  /**
   * Parcours lié (lien secondaire « étape 1 », lecture libre, et retour après
   * paiement), ex. `/parcours/repartie`. Défaut : la liste `/parcours`.
   */
  parcoursHref?: string;
  /** Source du clic pour la mesure du tunnel (ex. `blog-<slug>`), relayée par /abonnement. */
  src?: string;
  /** Titre du bloc (défaut : texte générique des articles). */
  title?: string;
  /** Paragraphe sous le titre (défaut : texte générique des articles). */
  text?: string;
  /** Libellé du bouton principal vers Premium (défaut : « Passer à Premium »). */
  primaryLabel?: string;
  /** Libellé du lien secondaire vers l'étape 1 (défaut : « Lire la première étape d'un parcours »). */
  secondaryLabel?: string;
  /** Ligne sous les boutons (défaut : prix et lecture libre). */
  note?: string;
}

const DEFAULT_TITLE = "Maintenant, reste à le dire à voix haute";
const DEFAULT_TEXT =
  "Des exercices concrets, des parcours étape par étape et des XP pour voir le chemin parcouru. Parce qu'un article lu finit par s'oublier, alors qu'un réflexe entraîné reste.";
// Étalon 3.1 validé par Thomas (s15, docs/copy/etalons-chemin-premium-s15.md).
const DEFAULT_PRIMARY_LABEL = "Passer à Premium";
const DEFAULT_SECONDARY_LABEL = "Lire la première étape d'un parcours";
const DEFAULT_NOTE = `${PREMIUM_PRICE_LABEL}, sans engagement. Cet article reste en lecture libre.`;

/**
 * CTA de fin d'article (plus de compte gratuit, s15 §2.6).
 *
 * Visiteur et compte non abonné : un bouton principal vers /abonnement
 * (`data-blog-cta="abonnement"`, ex-« inscription » : rupture de série datée
 * au déploiement) + un lien secondaire vers l'étape 1 d'un parcours, en
 * lecture libre (`data-blog-cta="etape-1"`).
 * Abonné : « Continuer mon parcours » vers /parcours (`data-blog-cta="parcours"`).
 *
 * Textes surchargeables par article (config/blog-cta.ts) ; boutons marqués
 * `data-blog-cta` pour la mesure Umami (components/blog/blog-article-tracking).
 */
export function ArticleCta({
  parcoursHref = "/parcours",
  src,
  title = DEFAULT_TITLE,
  text = DEFAULT_TEXT,
  primaryLabel = DEFAULT_PRIMARY_LABEL,
  secondaryLabel = DEFAULT_SECONDARY_LABEL,
  note = DEFAULT_NOTE,
}: ArticleCtaProps) {
  const { data: session, status } = useSession();
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);

  return (
    <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
      <p className="font-display text-xl font-bold text-text-primary">
        {title}
      </p>
      <p className="mt-2 text-text-secondary">{text}</p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {isPremium ? (
          <Link
            href="/parcours"
            data-blog-cta="parcours"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            Continuer mon parcours
          </Link>
        ) : (
          <>
            <Link
              href={buildAbonnementUrl(parcoursHref, "monthly", src)}
              data-blog-cta="abonnement"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "h-auto min-h-12 whitespace-normal py-2")}
            >
              {primaryLabel}
            </Link>
            <Link
              href={parcoursHref}
              data-blog-cta="etape-1"
              className="inline-flex min-h-[44px] items-center text-sm font-medium text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary hover:decoration-current"
            >
              {secondaryLabel}
            </Link>
          </>
        )}
      </div>

      {!isPremium && <p className="mt-3 text-xs text-text-muted">{note}</p>}
    </div>
  );
}
