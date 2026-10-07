"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SubscriptionSummary } from "@/lib/account";
import { useSubscriptionSummary, type ParcoursPortail } from "@/hooks/use-subscription-summary";
import { formatEuros, PREMIUM_PRICE_LABEL } from "@/config/premium";
import { ANNUEL_AVANTAGE_LABEL } from "@/config/textes/offre";
import { dateLongue, TEXTES_ABONNEMENT as T } from "@/config/textes/compte";

export type EtatAbonnement = "impaye" | "resilie" | "actif" | "premium-hors-stripe" | "aucun";

/**
 * État affiché, à partir du plan (session) et du résumé base/Stripe.
 * Pendant le chargement du résumé (`undefined`), on affiche tout de suite
 * l'état déduit du plan ; l'impayé prend la main dès que le résumé arrive.
 */
export function etatAbonnement(plan: string, summary: SubscriptionSummary | null | undefined): EtatAbonnement {
  if (summary?.status === "PAST_DUE") return "impaye";
  if (plan !== "PREMIUM") return "aucun";
  if (summary === undefined) return "actif";
  if (summary?.hasPortal && summary.cancelAtPeriodEnd) return "resilie";
  if (summary?.hasPortal) return "actif";
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
}

export function AbonnementCard({ plan, xp, onCheckout, isCheckoutLoading }: AbonnementCardProps) {
  const { summary, openPortal, portalLoading } = useSubscriptionSummary(true);
  const etat = etatAbonnement(plan, summary);
  const fin = summary?.currentPeriodEnd ? dateLongue(summary.currentPeriodEnd) : null;

  const bouton = (parcours: ParcoursPortail, label: string, variant: "outline" | "ghost" | "primary" = "outline") => (
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
    <Card className="md:col-span-2">
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
            {summary?.hasPortal && <div className="mt-4 border-t border-border pt-4">{bouton("resilier", T.resilier, "ghost")}</div>}
          </div>
        )}

        {(etat === "actif" || etat === "resilie" || etat === "premium-hors-stripe") && (
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
            {etat !== "premium-hors-stripe" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {bouton("gerer", T.gerer)}
                {etat === "actif" && summary?.hasStripeSubscription && bouton("changer-formule", T.changerFormule)}
              </div>
            )}
            {etat === "actif" && summary?.formule === "monthly" && (
              <p className="mt-2 text-xs text-text-muted">{T.versAnnuel(ANNUEL_AVANTAGE_LABEL)}</p>
            )}
            {etat === "actif" && summary?.formule === "annual" && <p className="mt-2 text-xs text-text-muted">{T.versMensuel}</p>}
            {etat === "actif" && (
              <div className="mt-4 border-t border-border pt-4">
                {/* Bouton légal de résiliation en ligne (L.215-1-1) : parcours de résiliation du portail. */}
                {bouton("resilier", T.resilier, "ghost")}
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
