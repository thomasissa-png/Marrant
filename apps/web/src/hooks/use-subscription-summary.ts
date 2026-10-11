"use client";

import { useEffect, useState } from "react";
import type { SubscriptionSummary } from "@/lib/account";
import { toast } from "@/components/ui/toast";
import { TEXTES_ABONNEMENT } from "@/config/textes/compte";

export type ParcoursPortail = "gerer" | "changer-formule" | "resilier" | "carte";

/**
 * Résumé d'abonnement du profil (s16, reco 11) + ouverture du portail Stripe.
 * `undefined` = chargement, `null` = jamais abonné ou lecture impossible :
 * jamais d'erreur bloquante, et un Premium garde son bouton de résiliation
 * (lot G, permanence exigée par L.215-1-1).
 */
export function useSubscriptionSummary(enabled: boolean) {
  const [summary, setSummary] = useState<SubscriptionSummary | null | undefined>(undefined);
  const [portalLoading, setPortalLoading] = useState<ParcoursPortail | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch("/api/user/subscription")
      .then((res) => (res.ok ? res.json() : { subscription: null }))
      .then((data: { subscription: SubscriptionSummary | null }) => {
        if (!cancelled) setSummary(data.subscription ?? null);
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const openPortal = async (parcours: ParcoursPortail) => {
    setPortalLoading(parcours);
    try {
      const res =
        parcours === "gerer"
          ? await fetch("/api/stripe/portal", { method: "POST" })
          : await fetch("/api/user/subscription/portal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ parcours }),
            });
      if (res.ok) {
        const data = (await res.json()) as { url: string };
        window.location.href = data.url;
        return;
      }
      // 404 : aucun client Stripe (bouton de résiliation affiché par précaution, lot G).
      toast(res.status === 404 ? TEXTES_ABONNEMENT.aucunAbonnementCarte : TEXTES_ABONNEMENT.portailIndisponible, "error");
    } catch {
      toast(TEXTES_ABONNEMENT.connexionPerdue, "error");
    }
    setPortalLoading(null);
  };

  return { summary, openPortal, portalLoading };
}
