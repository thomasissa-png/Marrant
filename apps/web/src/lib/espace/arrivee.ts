/**
 * Page d'arrivée de l'abonné (s24, lot D0 ; branchée au lot D3).
 *
 * Décisions (architecture v20 4.2, `founder-preferences.md` 12/11) :
 * - après le PAIEMENT : toujours « Aujourd'hui » (C14) ; le `returnTo` ne choisit plus que
 *   le premier pas (lot D3), il n'est plus la page d'arrivée ;
 * - après une CONNEXION : la page d'origine ; sans page d'origine, « Aujourd'hui » (au lieu
 *   de `/vannes`) pour un abonné actif ; un ancien abonné suit la règle existante,
 *   `/abonnement` ; tout autre compte garde l'arrivée d'aujourd'hui.
 *
 * Module sans accès serveur (importable par `login/page.tsx`, composant client).
 * Interrupteur fermé : exactement les destinations d'aujourd'hui (`getPostPaymentDestination`
 * et `resolvePostAuthRedirect(…, "/vannes")` de `login/page.tsx`), quel que soit le compte.
 */
import { ESPACE_ACCUEIL, ESPACE_CLIENT_PUBLIE, ESPACE_REDIRECTION_SANS_ABONNEMENT } from "@/config/espace-client";
import { getPostPaymentDestination, sanitizeReturnTo } from "@/lib/premium-return";
import { resolvePostAuthRedirect } from "@/lib/safe-callback";

/** Arrivée par défaut d'une connexion aujourd'hui (`login/page.tsx`, `resolvePostAuthRedirect`). */
export const ARRIVEE_CONNEXION_ACTUELLE = "/vannes";

/** État du compte au moment de la connexion (plan relu en base par l'appelant). */
export type CompteArrivee = "abonne" | "ancien-abonne" | "gratuit";

/** Destination après paiement : « Aujourd'hui » ouvert, l'intention d'origine fermé. */
export function arriveeApresPaiement(
  rawReturnTo: string | null | undefined,
  ouvert: boolean = ESPACE_CLIENT_PUBLIE,
): string {
  if (!ouvert) return getPostPaymentDestination(rawReturnTo);
  return ESPACE_ACCUEIL;
}

/**
 * Destination après connexion. Ouvert : abonné actif = page d'origine sûre (chemin interne,
 * jamais paiement, connexion, inscription ni API : `sanitizeReturnTo`) sinon « Aujourd'hui » ;
 * ancien abonné = `/abonnement` ; autre compte = arrivée d'aujourd'hui.
 */
export function arriveeApresConnexion(
  rawOrigine: string | null | undefined,
  compte: CompteArrivee,
  ouvert: boolean = ESPACE_CLIENT_PUBLIE,
): string {
  const actuelle = resolvePostAuthRedirect(rawOrigine, ARRIVEE_CONNEXION_ACTUELLE);
  if (!ouvert) return actuelle;
  if (compte === "ancien-abonne") return ESPACE_REDIRECTION_SANS_ABONNEMENT;
  if (compte === "abonne") return sanitizeReturnTo(rawOrigine) ?? ESPACE_ACCUEIL;
  return actuelle;
}
