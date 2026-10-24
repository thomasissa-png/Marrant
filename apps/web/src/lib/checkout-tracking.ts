/**
 * Mesure de l'ouverture de Stripe Checkout (s21, blocs d'appel partie A, point 7).
 *
 * - `checkout-ouvert` {src, formule} : la session Checkout est créée et le navigateur
 *   part vers Stripe (juste avant `window.location.href = url`).
 * - `checkout-echec` {src, raison[, formule]} : le paiement n'a pas pu s'ouvrir
 *   (`erreur` serveur, `conflit` 409, `reseau`) ou le visiteur revient de Stripe sans
 *   payer (`retour-sans-paiement`, cancel_url `?paiement=annule`).
 *
 * La source est gardée le temps de l'aller-retour (sessionStorage, onglet courant) :
 * le retour sans paiement la retrouve sans la faire passer par Stripe. Aucune donnée
 * personnelle. Événements attribués comme le reste du tunnel (`ATTRIBUTED_EVENTS`).
 */
import { trackUmami, trackUmamiWhenReady } from "@/lib/umami";

export type CheckoutFormule = "mensuel" | "annuel";
export type CheckoutEchecRaison = "erreur" | "conflit" | "reseau" | "retour-sans-paiement";

const CLE_SRC = "marrant.checkout-src";
/** Même règle que les autres `src` du tunnel (lib/premium-return). */
const SRC_VALIDE = /^[a-z0-9][a-z0-9-]{0,119}$/;

function srcSure(src: string | null | undefined): string {
  return typeof src === "string" && SRC_VALIDE.test(src) ? src : "inconnu";
}

export function trackCheckoutOuvert(src: string, formule: CheckoutFormule = "mensuel"): void {
  const sure = srcSure(src);
  trackUmami("checkout-ouvert", { src: sure, formule });
  try {
    window.sessionStorage.setItem(CLE_SRC, sure);
  } catch {
    // Stockage indisponible (navigation privée stricte) : le retour dira « inconnu ».
  }
}

export function trackCheckoutEchec(src: string, raison: CheckoutEchecRaison, formule?: CheckoutFormule): void {
  trackUmami("checkout-echec", { src: srcSure(src), raison, ...(formule ? { formule } : {}) });
}

/** Retour de Stripe sans paiement : `?paiement=annule` (ou l'ancien `?upgrade=cancel`). */
export function estRetourSansPaiement(params: URLSearchParams): boolean {
  return params.get("paiement") === "annule" || params.get("upgrade") === "cancel";
}

/**
 * À appeler une fois au chargement d'une page de retour : envoie `checkout-echec`
 * (raison `retour-sans-paiement`) avec la source mémorisée à l'aller, puis l'oublie.
 */
export function mesurerRetourCheckout(search: string): boolean {
  if (!estRetourSansPaiement(new URLSearchParams(search))) return false;
  let src: string | null = null;
  try {
    src = window.sessionStorage.getItem(CLE_SRC);
    window.sessionStorage.removeItem(CLE_SRC);
  } catch {
    src = null;
  }
  trackUmamiWhenReady("checkout-echec", { src: srcSure(src), raison: "retour-sans-paiement" });
  return true;
}
