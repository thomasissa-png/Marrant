"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AuthCta } from "@/components/auth/auth-cta";

interface ArticleCtaProps {
  /**
   * Chemin recommandé après création de compte gratuit (ex : `/parcours/repartie`).
   * Passe par le sanitizer côté page d'auth.
   */
  freeCallbackUrl?: string;
}

/**
 * CTA de fin d'article — double bouton pour le trafic froid.
 *
 * Primaire : essai gratuit (inscription free — 10 vannes + contenu du jour).
 * Secondaire : passage direct au premium (4,99 €/mois).
 *
 * Rationale : la landing blog reçoit 99% du trafic froid. Un CTA payant
 * unique tue la conversion. On propose d'abord d'entrer dans le funnel.
 */
export function ArticleCta({ freeCallbackUrl = "/onboarding" }: ArticleCtaProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
      <p className="font-display text-xl font-bold text-text-primary">
        Maintenant, reste à le dire à voix haute
      </p>
      <p className="mt-2 text-text-secondary">
        Des exercices concrets, des parcours étape par étape et des XP pour
        voir le chemin parcouru. Parce qu&apos;un article lu finit par
        s&apos;oublier, alors qu&apos;un réflexe entraîné reste.
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {isAuthenticated ? (
          <>
            <Link href={freeCallbackUrl}>
              <Button variant="primary" size="lg">
                Continuer mon parcours
              </Button>
            </Link>
            <Link href="/abonnement">
              <Button variant="outline" size="lg">
                Tout débloquer à 4,99 €/mois
              </Button>
            </Link>
          </>
        ) : (
          <>
            <AuthCta
              label="Essaie gratuitement"
              variant="primary"
              size="lg"
              callbackUrl={freeCallbackUrl}
            />
            <Link href="/abonnement">
              <Button variant="outline" size="lg">
                Tout débloquer à 4,99 €/mois
              </Button>
            </Link>
          </>
        )}
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Compte gratuit : 10 vannes, 3 conseils, 3 vidéos, contenu du jour. Sans carte.
      </p>
    </div>
  );
}
