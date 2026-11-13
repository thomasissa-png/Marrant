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
import { resolvePostAuthRedirect, sanitizeCallbackUrl } from "@/lib/safe-callback";
import { PARAM_DEPUIS } from "@/lib/espace/premier-pas";

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
  // Lot D3 : le lien de retour voyage jusqu'à « Aujourd'hui » pour y choisir le premier pas
  // (architecture 4.2, ordre 1), favori mémorisé compris (la fiche devient le premier pas).
  const depuis = sanitizeReturnTo(rawReturnTo);
  return depuis ? `${ESPACE_ACCUEIL}?${PARAM_DEPUIS}=${encodeURIComponent(depuis)}` : ESPACE_ACCUEIL;
}

/** Route qui calcule l'arrivée après connexion en relisant le compte en base (`api/espace/arrivee`). */
/**
 * Lot D11b (recette D11, Q-2, `conversion-v3-s21` QA m2) : la page de retour de Stripe. Session perdue au retour
 * du paiement puis connexion : elle seule vérifie le paiement, ajoute le favori mémorisé et mène à
 * « Aujourd'hui ». `sanitizeReturnTo` refuse tout `/abonnement*` : sans cette exception, l'abonné arrivait sur
 * « Aujourd'hui » sans son favori ni sa bienvenue (fermé : `resolvePostAuthRedirect` la gardait déjà).
 */
export const PAGE_RETOUR_PAIEMENT = "/abonnement/success";

function retourDePaiement(raw: string | null | undefined): string | null {
  const sur = sanitizeCallbackUrl(raw);
  return sur && sur.split(/[?#]/)[0] === PAGE_RETOUR_PAIEMENT ? sur : null;
}

export const ROUTE_ARRIVEE_CONNEXION = "/api/espace/arrivee";

/**
 * Adresse de passage après une connexion, interrupteur OUVERT seulement (`login/page.tsx`) :
 * la route relit le plan en base puis redirige (`arriveeApresConnexion`), marqueur de mesure
 * du retour Google compris.
 */
export function urlArriveeConnexion(rawOrigine: string | null | undefined, marqueur?: string): string {
  const params = new URLSearchParams();
  const origine = retourDePaiement(rawOrigine) ?? sanitizeReturnTo(rawOrigine);
  if (origine) params.set("origine", origine);
  if (marqueur && /^[a-z0-9-]{1,40}$/.test(marqueur)) params.set("marqueur", marqueur);
  const q = params.toString();
  return q ? `${ROUTE_ARRIVEE_CONNEXION}?${q}` : ROUTE_ARRIVEE_CONNEXION;
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
  // Paiement en cours de vérification : la page de retour, quel que soit le plan lu (webhook passé ou non).
  const paiement = retourDePaiement(rawOrigine);
  if (paiement) return paiement;
  if (compte === "ancien-abonne") return ESPACE_REDIRECTION_SANS_ABONNEMENT;
  if (compte === "abonne") return sanitizeReturnTo(rawOrigine) ?? ESPACE_ACCUEIL;
  return actuelle;
}
