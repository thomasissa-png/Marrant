"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AuthCta } from "@/components/auth/auth-cta";
import { FREE_CATALOGUE_LIMITS_LABEL } from "@/config/premium";

interface ArticleCtaProps {
  /**
   * Chemin recommandé après création de compte gratuit (ex : `/parcours/repartie`).
   * Passe par le sanitizer côté page d'auth.
   */
  freeCallbackUrl?: string;
  /** Source de l'inscription pour la mesure du tunnel (ex. `blog-<slug>`). */
  src?: string;
  /** Titre du bloc (défaut : texte générique des articles). */
  title?: string;
  /** Paragraphe sous le titre (défaut : texte générique des articles). */
  text?: string;
  /** Libellé du bouton d'inscription, visiteur non connecté (défaut : « Essaie gratuitement »). */
  primaryLabel?: string;
  /** Ligne sous les boutons (défaut : limites du compte gratuit). */
  note?: string;
}

const DEFAULT_TITLE = "Maintenant, reste à le dire à voix haute";
const DEFAULT_TEXT =
  "Des exercices concrets, des parcours étape par étape et des XP pour voir le chemin parcouru. Parce qu'un article lu finit par s'oublier, alors qu'un réflexe entraîné reste.";
const DEFAULT_PRIMARY_LABEL = "Essaie gratuitement";
const DEFAULT_NOTE = `Compte gratuit : ${FREE_CATALOGUE_LIMITS_LABEL}, contenu du jour. Sans carte.`;

/**
 * CTA de fin d'article — double bouton pour le trafic froid.
 *
 * Primaire : essai gratuit (inscription free : FREE_CATALOGUE_LIMITS_LABEL + contenu du jour).
 * Secondaire : passage direct au premium (2,99 €/mois).
 *
 * Textes surchargeables par article (config/blog-cta.ts) ; boutons marqués
 * `data-blog-cta` pour la mesure Umami (components/blog/blog-article-tracking).
 *
 * Rationale : la landing blog reçoit 99% du trafic froid. Un CTA payant
 * unique tue la conversion. On propose d'abord d'entrer dans le funnel.
 */
export function ArticleCta({
  freeCallbackUrl = "/onboarding",
  src,
  title = DEFAULT_TITLE,
  text = DEFAULT_TEXT,
  primaryLabel = DEFAULT_PRIMARY_LABEL,
  note = DEFAULT_NOTE,
}: ArticleCtaProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
      <p className="font-display text-xl font-bold text-text-primary">
        {title}
      </p>
      <p className="mt-2 text-text-secondary">{text}</p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {isAuthenticated ? (
          <>
            <Link href={freeCallbackUrl} data-blog-cta="parcours">
              <Button variant="primary" size="lg">
                Continuer mon parcours
              </Button>
            </Link>
            <Link href="/abonnement" data-blog-cta="premium">
              <Button variant="outline" size="lg">
                Tout débloquer à 2,99 €/mois
              </Button>
            </Link>
          </>
        ) : (
          <>
            {/* Marqueur de mesure (blog-cta-clic) : AuthCta ne transmet pas les data-* (lien /register). */}
            <span data-blog-cta="inscription" className="contents">
              <AuthCta
                label={primaryLabel}
                variant="primary"
                size="lg"
                callbackUrl={freeCallbackUrl}
                src={src}
              />
            </span>
            <Link href="/abonnement" data-blog-cta="premium">
              <Button variant="outline" size="lg">
                Tout débloquer à 2,99 €/mois
              </Button>
            </Link>
          </>
        )}
      </div>

      <p className="mt-3 text-xs text-text-muted">{note}</p>
    </div>
  );
}
