"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import type { PremiumPlan } from "@/config/premium";
import { readCheckoutConflict, type CheckoutConflict } from "@/lib/checkout-conflict";
import {
  estRetourSansPaiement,
  trackCheckoutEchec,
  trackCheckoutOuvert,
  type CheckoutFormule,
} from "@/lib/checkout-tracking";
import { trackUmami } from "@/lib/umami";
import { AUTO_CHECKOUT_PARAM, AUTO_CHECKOUT_VALUE, sanitizeReturnTo } from "@/lib/premium-return";
import { sanitizeSignupSrc } from "@/lib/auth-links";

type Declencheur = "auto" | "manuel";
type SessionStatus = "authenticated" | "loading" | "unauthenticated";

/** Intention d'origine, lue au clic dans l'URL (chemin interne uniquement). */
export function readReturnTo(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
}

/** Choix annuel conservé après inscription (`/abonnement?plan=annual`). */
export function readPlanFromUrl(): PremiumPlan {
  if (typeof window === "undefined") return "monthly";
  return new URLSearchParams(window.location.search).get("plan") === "annual" ? "annual" : "monthly";
}

/** Source du clic d'entrée (`?src=`, ex. `mur-vannes`), relayée à /register puis au paiement. */
export function readSrcFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeSignupSrc(new URLSearchParams(window.location.search).get("src"));
}

/**
 * `auto=1` (retour d'inscription ou de connexion) : lu puis retiré de l'URL AVANT l'appel au
 * paiement, pour qu'un rechargement ou un retour arrière ne relance rien. Jamais après un retour
 * de Stripe sans paiement (`paiement=annule`).
 */
function consumeAutoCheckout(): boolean {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  if (url.searchParams.get(AUTO_CHECKOUT_PARAM) !== AUTO_CHECKOUT_VALUE) return false;
  url.searchParams.delete(AUTO_CHECKOUT_PARAM);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  return !estRetourSansPaiement(url.searchParams);
}

/** Messages humains : jamais l'erreur brute de l'API (audit tunnel F14). */
function checkoutErrorMessage(status: number): string {
  if (status === 401) return "Ta session a expiré. Reconnecte-toi pour reprendre le paiement.";
  if (status === 429) return "Trop d’essais pour l’instant. Réessaie un peu plus tard.";
  if (status === 503) return "Cette formule n’est pas disponible pour le moment. Choisis le mensuel ou réessaie plus tard.";
  return "Le paiement n’a pas pu démarrer. Réessaie dans un instant.";
}

/**
 * Paiement depuis /abonnement : clic manuel (compte connecté) et ouverture automatique après
 * inscription (`auto=1`). `attente` : la page d'attente remplace la page de vente pendant
 * l'ouverture automatique (plus de flash de la page de vente entre /register et Stripe) ; elle
 * cède la place à la page complète au moindre échec (session absente, conflit, erreur, réseau).
 */
export function useAbonnementCheckout({
  status,
  annualAvailable,
  attenteInitiale,
  srcEntree,
}: {
  status: SessionStatus;
  annualAvailable: boolean;
  attenteInitiale: boolean;
  /** Source d'entrée lue au montage (le traceur du layout peut la retirer de l'URL ensuite). */
  srcEntree: React.MutableRefObject<string | null>;
}) {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [conflict, setConflict] = useState<CheckoutConflict | null>(null);
  const [attente, setAttente] = useState(attenteInitiale);

  const handleCheckout = useCallback(
    async (declencheur: Declencheur, chosenPlan: PremiumPlan, emplacement?: string) => {
      const annual = chosenPlan === "annual";
      const formule: CheckoutFormule = annual ? "annuel" : "mensuel";
      // Source de mesure : le bloc d'entrée (`?src=`, ex. `header`), sinon la page elle-même.
      const srcMesure = srcEntree.current ?? readSrcFromUrl() ?? "abonnement";
      setIsCheckoutLoading(true);
      setConflict(null);
      trackUmami("abonnement-clic", {
        formule,
        src: "abonnement",
        declencheur,
        statut: "membre",
        ...(emplacement ? { emplacement } : {}),
      });
      try {
        const origin = readReturnTo();
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Mensuel : corps historique inchangé (le serveur applique le mensuel par défaut).
          body: JSON.stringify({ ...(origin ? { returnTo: origin } : {}), ...(annual ? { plan: chosenPlan } : {}) }),
        });
        const data = await res.json();
        const conflit = readCheckoutConflict(res.status, data);
        if (res.ok && data.url) {
          trackCheckoutOuvert(srcMesure, formule);
          window.location.href = data.url;
          return;
        }
        setAttente(false);
        if (conflit) {
          trackCheckoutEchec(srcMesure, "conflit", formule);
          setConflict(conflit);
        } else {
          trackCheckoutEchec(srcMesure, "erreur", formule);
          console.error("[Checkout]", data.error);
          toast(checkoutErrorMessage(res.status), "error");
        }
      } catch {
        setAttente(false);
        trackCheckoutEchec(srcMesure, "reseau", formule);
        toast("Connexion perdue, réessaie", "error");
      } finally {
        setIsCheckoutLoading(false);
      }
    },
    [srcEntree],
  );

  // Retour d'inscription (`auto=1`) : paiement lancé une seule fois, dès que la session est
  // confirmée. Échec : page complète, bouton manuel et messages habituels.
  const autoChecked = useRef(false);
  useEffect(() => {
    if (autoChecked.current || status === "loading") return;
    autoChecked.current = true;
    // Formule relue dans l'URL (l'état de la page peut ne pas être encore à jour).
    const autoPlan: PremiumPlan = annualAvailable && readPlanFromUrl() === "annual" ? "annual" : "monthly";
    if (consumeAutoCheckout() && status === "authenticated") void handleCheckout("auto", autoPlan);
    else setAttente(false);
  }, [status, handleCheckout, annualAvailable]);

  return { handleCheckout, isCheckoutLoading, conflict, attente };
}
