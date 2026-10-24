/**
 * Inscription par e-mail : le paiement s'ouvre depuis /register, l'attente se fait dans le bouton
 * (« On t'emmène au paiement… »), comme pour un compte connecté (trajet de conversion s21, tour 2 :
 * plus de page d'attente pleine entre /register et Stripe).
 *
 * Même appel que l'ouverture automatique de /abonnement (`auto=1`) : `returnTo`, formule et source
 * lus dans la destination d'après inscription (`getPostSignupRedirect`), mêmes événements
 * (`abonnement-clic` auto, `checkout-ouvert` avec la source d'entrée). Au moindre échec (formule
 * indisponible, conflit, réseau), rien n'est mesuré ici : la personne passe par /abonnement
 * (`auto=1`), qui relance et affiche les messages habituels.
 */
import { trackCheckoutOuvert, type CheckoutFormule } from "@/lib/checkout-tracking";
import { trackUmami } from "@/lib/umami";

export async function ouvrirPaiementApresInscription(postAuthTarget: string): Promise<string | null> {
  const params = new URLSearchParams(postAuthTarget.split("#")[0].split("?")[1] ?? "");
  const returnTo = params.get("returnTo");
  const annual = params.get("plan") === "annual";
  const formule: CheckoutFormule = annual ? "annuel" : "mensuel";
  const src = params.get("src") ?? "abonnement";
  trackUmami("abonnement-clic", { formule, src: "abonnement", declencheur: "auto", statut: "membre" });
  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...(returnTo ? { returnTo } : {}), ...(annual ? { plan: "annual" } : {}) }),
      // Timeout Stripe 10 s (règle du projet) ; absent des vieux navigateurs et de jsdom.
      signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(10_000) : undefined,
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as { url?: unknown } | null;
    if (typeof data?.url !== "string") return null;
    trackCheckoutOuvert(src, formule);
    return data.url;
  } catch {
    return null;
  }
}
