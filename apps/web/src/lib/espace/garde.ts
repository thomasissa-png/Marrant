/**
 * Garde de l'espace client (s24, lot D0, plan §2 règle 6 et brief §3.8).
 *
 * Ordre des contrôles, le même pour une page et pour une route d'API :
 * 1. interrupteur `ESPACE_CLIENT_PUBLIE` fermé : adresse inexistante (vraie 404 pour une
 *    page, 404 JSON pour l'API), AVANT toute lecture de session ou de base ;
 * 2. pas de session : connexion avec retour sur la page demandée (`buildLoginUrl`) ;
 * 3. plan relu EN BASE, jamais dans le jeton de session (un jeton qui dit PREMIUM ne
 *    suffit pas) : tout compte non PREMIUM, ancien abonné compris, va sur `/abonnement`
 *    (règle existante, architecture v20 4.2). L'ancien abonné est distingué pour la ligne
 *    « Ton historique de questions et tes répliques sont gardés » (architecture 2.6) ;
 * 4. abonné actif (plan PREMIUM en base : ACTIVE, PAST_DUE pendant les relances, ou
 *    résiliation programmée encore en cours) : accès.
 *
 * Rendu partiel de Next 14 : à la navigation interne, seul le segment de la page est rendu,
 * le layout ne l'est pas de nouveau. La garde du layout ne suffit donc pas : chaque page et
 * chaque route de l'espace appelle `garderEspace` / `garderApiEspace` en PREMIER.
 * Base indisponible : l'erreur remonte (page d'erreur, 503 côté API), jamais d'accès.
 */
import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildLoginUrl } from "@/lib/auth-links";
import { sanitizeCallbackUrl } from "@/lib/safe-callback";
import { isPremiumPlan } from "@/lib/parcours-access";
import { ESPACE_ACCUEIL, ESPACE_CLIENT_PUBLIE, ESPACE_REDIRECTION_SANS_ABONNEMENT } from "@/config/espace-client";

export type AccesEspace =
  | { acces: "ouvert"; userId: string }
  | { acces: "connexion" }
  | { acces: "abonnement"; userId: string; ancienAbonne: boolean };

/**
 * Lit la session puis le compte en base. Ne tient PAS compte de l'interrupteur
 * (les appelants le testent d'abord). Ancien abonné = plan non PREMIUM avec un
 * abonnement Stripe déjà créé (`stripeSubscriptionId`, posé par le webhook) ;
 * un paiement commencé puis abandonné (client Stripe seul) n'en fait pas un.
 */
export async function lireAccesEspace(): Promise<AccesEspace> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { acces: "connexion" };
  const compte = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, subscription: { select: { stripeSubscriptionId: true } } },
  });
  // Compte supprimé avec un jeton encore valide : traité comme un visiteur.
  if (!compte) return { acces: "connexion" };
  if (isPremiumPlan(compte.plan)) return { acces: "ouvert", userId };
  return { acces: "abonnement", userId, ancienAbonne: Boolean(compte.subscription?.stripeSubscriptionId) };
}

/** Chemin interne de retour après connexion (défaut : « Aujourd'hui »). */
function cheminDeRetour(chemin: string | null | undefined): string {
  const sur = sanitizeCallbackUrl(chemin);
  if (!sur) return ESPACE_ACCUEIL;
  const route = sur.split(/[?#]/)[0];
  return route === ESPACE_ACCUEIL || route.startsWith(`${ESPACE_ACCUEIL}/`) ? sur : ESPACE_ACCUEIL;
}

/**
 * Garde d'une page (ou du layout) de l'espace : 404 interrupteur fermé, sinon
 * redirection vers la connexion ou `/abonnement`, sinon le compte de l'abonné.
 * `chemin` = adresse demandée sous `/mon-espace`, reprise comme retour de connexion.
 */
export async function garderEspace(chemin?: string | null): Promise<{ userId: string }> {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  const acces = await lireAccesEspace();
  if (acces.acces === "connexion") redirect(buildLoginUrl({ callbackUrl: cheminDeRetour(chemin) }));
  if (acces.acces === "abonnement") redirect(ESPACE_REDIRECTION_SANS_ABONNEMENT);
  return { userId: acces.userId };
}

const json = (corps: Record<string, unknown>, status: number) =>
  NextResponse.json(corps, { status, headers: { "Cache-Control": "private, no-store" } });

/** Réponse d'une route `api/espace/**` interrupteur fermé : celle d'une adresse inexistante. */
export function reponseEspaceFerme(): NextResponse {
  return json({ error: "Introuvable" }, 404);
}

/**
 * Garde d'une route `api/espace/**` : 404 fermé, 401 sans session, 403 sans abonnement
 * actif (plan en base), 503 base indisponible ; sinon le compte de l'abonné.
 */
export async function garderApiEspace(): Promise<{ userId: string } | NextResponse> {
  if (!ESPACE_CLIENT_PUBLIE) return reponseEspaceFerme();
  try {
    const acces = await lireAccesEspace();
    if (acces.acces === "connexion") return json({ error: "session" }, 401);
    if (acces.acces === "abonnement") return json({ error: "non-premium" }, 403);
    return { userId: acces.userId };
  } catch (error) {
    console.error("[espace] lecture du compte impossible :", error);
    return json({ error: "indisponible" }, 503);
  }
}

/**
 * Méthode non prévue d'une route `api/espace/**` (lot D3) : fermé, la réponse d'une adresse
 * inexistante (404, comme toute méthode) ; ouvert, 405.
 */
export function methodeNonPermise(): NextResponse {
  if (!ESPACE_CLIENT_PUBLIE) return reponseEspaceFerme();
  return json({ error: "methode" }, 405);
}
