"use client";

import { useEffect } from "react";
import { mesurerRetourCheckout } from "@/lib/checkout-tracking";

/**
 * Retour de Stripe Checkout sans paiement (cancel_url `?paiement=annule`) : envoie
 * `checkout-echec` {src, raison: "retour-sans-paiement"} une fois au chargement, quelle
 * que soit la page qui a ouvert le paiement (s21, point 7). Monté une fois dans le
 * layout racine ; lit window.location (pas de useSearchParams, qui ferait basculer tout
 * le layout en rendu client). L'URL n'est pas modifiée (la page /abonnement s'en sert).
 */
export function CheckoutRetourTracker() {
  useEffect(() => {
    mesurerRetourCheckout(window.location.search);
  }, []);
  return null;
}
