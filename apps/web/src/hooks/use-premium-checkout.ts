"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { trackUmami } from "@/lib/umami";
import { readCheckoutConflict, type CheckoutConflict } from "@/lib/checkout-conflict";

/**
 * Paiement mensuel direct pour un compte connecté (fenêtre Premium, quiz
 * d'orientation) : mesure du clic, POST /api/stripe/checkout avec la page à
 * retrouver, refus 409 affiché par `CheckoutConflictNotice`, sinon toast.
 */
export function usePremiumCheckout(src: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [conflict, setConflict] = useState<CheckoutConflict | null>(null);

  const startCheckout = async (returnTo: string | null) => {
    setIsLoading(true);
    setConflict(null);
    trackUmami("abonnement-clic", { formule: "mensuel", src, declencheur: "manuel", statut: "membre" });
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(returnTo ? { returnTo } : {}),
        // Timeout Stripe 10 s (règle du projet) ; absent des vieux navigateurs et de jsdom.
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(10_000) : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
        return;
      }
      const conflit = readCheckoutConflict(res.status, await res.json().catch(() => null));
      if (conflit) setConflict(conflit);
      else toast("Le paiement n'a pas pu démarrer. Réessaie dans un instant.", "error");
    } catch {
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { startCheckout, isLoading, conflict };
}
