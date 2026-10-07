"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SubscriptionSummary } from "@/lib/account";
import type { ParcoursPortail, useSubscriptionSummary } from "@/hooks/use-subscription-summary";
import { formatEuros, PREMIUM_PRICE_LABEL } from "@/config/premium";
import { ANNUEL_AVANTAGE_LABEL } from "@/config/textes/offre";
import { dateLongue, TEXTES_ABONNEMENT as T } from "@/config/textes/compte";

export type EtatAbonnement = "impaye" | "resilie" | "actif" | "premium-sans-resume" | "premium-hors-stripe" | "aucun";

/** Ancre de la carte (lien « Résilier ton contrat » du pied de page, lot G). */
export const ANCRE_ABONNEMENT = "abonnement";

/**
 * État affiché, à partir du plan (session) et du résumé base/Stripe.
 * Pendant le chargement du résumé (`undefined`), on affiche tout de suite
 * l'état déduit du plan ; l'impayé prend la main dès que le résumé arrive.
 * Résumé `null` (lecture en échec ou aucune ligne d'abonnement) pour un Premium :
 * `premium-sans-resume`, qui garde le bouton de résiliation (lot G, @legal
 * point 6 : le bouton ne doit jamais disparaître ; le portail répond 404 proprement).
 * `premium-hors-stripe` = résumé lu, sans client Stripe (aucun portail possible).
 */
export function etatAbonnement(plan: string, summary: SubscriptionSummary | null | undefined): EtatAbonnement {
  if (summary?.status === "PAST_DUE") return "impaye";
  if (plan !== "PREMIUM") return "aucun";
  if (summary === undefined) return "actif";
  if (summary === null) return "premium-sans-resume";
  if (summary.hasPortal && summary.cancelAtPeriodEnd) return "resilie";
  if (summary.hasPortal) return "actif";
  return "premium-hors-stripe";
}

function formuleLigne(s: SubscriptionSummary): string | null {
  if (!s.formule) return null;
  const nom = s.formule === "annual" ? T.formuleAnnuelle : T.formuleMensuelle;
  if (s.priceCents === null) return nom;
  return `${nom}, ${formatEuros(s.priceCents)}/${s.formule === "annual" ? "an" : "mois"}`;
}

interface AbonnementCardProps {
  plan: string;
  xp: number;
  onCheckout: () => void;
  isCheckoutLoading: boolean;
  /** Résumé et portail, lus une seule fois par le profil (partagés avec la suppression du compte). */
  abonnement: ReturnType<typeof useSubscriptionSummary>;
}

export function AbonnementCard({ plan, xp, onCheckout, isCheckoutLoading, abonnement }: AbonnementCardProps) {
  const { summary, openPortal, portalLoading } = abonnement;
  const etat = etatAbonnement(plan, summary);
  const carteRef = useRef<HTMLDivElement>(null);

  // Arrivée par /profil#abonnement (pied de page) : la carte est rendue après le
  // chargement du profil, le navigateur ne peut donc pas défiler seul jusqu'à elle.
  useEffect(() => {
    if (window.location.hash === `#${ANCRE_ABONNEMENT}`) carteRef.current?.scrollIntoView?.({ block: "start" });
  }, []);
  const fin = summary?.currentPeriodEnd ? dateLongue(summary.currentPeriodEnd) : null;

  const bouton = (parcours: ParcoursPortail, label: string, variant: "outline" | "primary" = "outline") => (
    <Button variant={variant} size="sm" onClick={() => openPortal(parcours)} disabled={portalLoading !== null}>
      {portalLoading === parcours ? T.chargement : label}
    </Button>
  );

  const badge =
    etat === "impaye" ? (
      <Badge variant="error">{T.badgeImpaye}</Badge>
    ) : etat === "aucun" ? (
      <Badge variant="default">{T.badgeAucun}</Badge>
    ) : (
      <Badge variant="primary">{T.badgePremium}</Badge>
    );

  return (
    <Card ref={carteRef} id={ANCRE_ABONNEMENT} className="md:col-span-2 scroll-mt-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{T.titre}</CardTitle>
          {badge}
        </div>
      </CardHeader>
      <CardContent>
        {etat === "impaye" && (
          <div>
            <p className="text-sm text-error" role="status">{T.impaye}</p>
            <div className="mt-4 flex flex-wrap gap-2">{bouton("carte", T.majCarte, "primary")}</div>
            {/* Toujours encore abonné (Premium conservé) : le bouton légal de résiliation reste visible (lot D). */}
            {summary?.hasPortal && <div className="mt-4 border-t border-border pt-4">{bouton("resilier", T.resilier)}</div>}
          </div>
        )}

        {(etat === "actif" || etat === "resilie" || etat === "premium-sans-resume" || etat === "premium-hors-stripe") && (
          <div>
            <p className="text-sm text-text-primary">
              Tout le catalogue est à toi : vannes illimitées, tous les conseils, toutes les vidéos, les filtres et les parcours complets.
            </p>
            {summary === undefined && (
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-background-elevated" aria-hidden="true" />
            )}
            {summary && formuleLigne(summary) && <p className="mt-3 text-sm text-text-primary">{formuleLigne(summary)}</p>}
            {etat === "actif" && fin && <p className="mt-1 text-sm text-text-secondary">{T.prochainPrelevement(fin)}</p>}
            {etat === "resilie" && (
              <>
                {fin && <p className="mt-1 text-sm font-medium text-text-primary">{T.premiumJusquau(fin)}</p>}
                <p className="mt-1 text-sm text-text-secondary">{T.resilieDetail}</p>
              </>
            )}
            {(etat === "actif" || etat === "resilie") && (
              <div className="mt-4 flex flex-wrap gap-2">
                {bouton("gerer", T.gerer)}
                {etat === "actif" && summary?.hasStripeSubscription && bouton("changer-formule", T.changerFormule)}
              </div>
            )}
            {etat === "actif" && summary?.formule === "monthly" && (
              <p className="mt-2 text-xs text-text-muted">{T.versAnnuel(ANNUEL_AVANTAGE_LABEL)}</p>
            )}
            {etat === "actif" && summary?.formule === "annual" && <p className="mt-2 text-xs text-text-muted">{T.versMensuel}</p>}
            {(etat === "actif" || etat === "premium-sans-resume") && (
              <div className="mt-4 border-t border-border pt-4">
                {/* Bouton légal de résiliation en ligne (L.215-1-1) : parcours de résiliation du portail.
                    Variante `outline` (lot G, @legal point 6 : bouton facilement accessible, pas discret). */}
                {bouton("resilier", T.resilier)}
                <p className="mt-1 text-xs text-text-muted">{fin ? T.resilierDetail(fin) : T.resilierDetailSansDate}</p>
              </div>
            )}
          </div>
        )}

        {etat === "aucun" && (
          <>
            <p className="mb-2 text-sm text-text-primary">
              Passe Premium pour débloquer tout le catalogue, les filtres et les parcours complets.
            </p>
            {xp > 0 && (
              <p className="mb-2 text-sm text-text-secondary">
                Les {xp} XP que tu as gagnés sont conservés et reprennent là où tu les as laissés.
              </p>
            )}
            <p className="mb-4 text-xs text-text-muted">Sans engagement &middot; Annulable à tout moment</p>
            <Button variant="secondary" size="sm" onClick={onCheckout} disabled={isCheckoutLoading}>
              {isCheckoutLoading ? "On t'emmène au paiement…" : `S'abonner à ${PREMIUM_PRICE_LABEL}`}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
