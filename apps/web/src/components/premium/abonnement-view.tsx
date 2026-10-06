"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { PremiumBenefits } from "@/components/premium/premium-benefits";
import {
  AUTO_CHECKOUT_PARAM,
  AUTO_CHECKOUT_VALUE,
  buildAbonnementUrl,
  sanitizeReturnTo,
} from "@/lib/premium-return";
import { FaqSection } from "@/components/home/faq-section";
import { getPremiumFaqs } from "@/lib/faqs";
import { buildRegisterUrl, sanitizeSignupSrc } from "@/lib/auth-links";
import { trackUmami, trackUmamiWhenReady } from "@/lib/umami";
import { cn } from "@/lib/utils";
import { PlanSelector } from "@/components/premium/plan-selector";
import {
  formatEuros,
  PARCOURS_COUNT,
  PREMIUM_MONTHLY_PRICE_CENTS,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_PRICE_LABEL,
  type PremiumPlan,
} from "@/config/premium";

/**
 * Intention d'origine (ex. étape 2 d'un parcours) : relayée au paiement puis au
 * retour (/abonnement/success). Lue au clic dans l'URL (pas de useSearchParams :
 * la page garde son HTML statique), chemin interne uniquement.
 */
function readReturnTo(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
}

/** Choix annuel conservé après inscription (`/abonnement?plan=annual`). */
function readPlanFromUrl(): PremiumPlan {
  if (typeof window === "undefined") return "monthly";
  return new URLSearchParams(window.location.search).get("plan") === "annual" ? "annual" : "monthly";
}

/** Source du clic d'entrée (`?src=`, ex. `fiche-vanne`), relayée à /register. */
function readSrcFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeSignupSrc(new URLSearchParams(window.location.search).get("src"));
}

/**
 * `auto=1` (retour d'inscription) : lu puis retiré de l'URL AVANT l'appel au
 * paiement, pour qu'un rechargement ou un retour arrière ne relance rien.
 * Jamais après un retour de Stripe sans paiement (`upgrade=cancel`).
 */
function consumeAutoCheckout(): boolean {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  if (url.searchParams.get(AUTO_CHECKOUT_PARAM) !== AUTO_CHECKOUT_VALUE) return false;
  url.searchParams.delete(AUTO_CHECKOUT_PARAM);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  return url.searchParams.get("upgrade") !== "cancel";
}

/** Messages humains : jamais l'erreur brute de l'API (audit tunnel F14). */
function checkoutErrorMessage(status: number): string {
  if (status === 401) return "Ta session a expiré. Reconnecte-toi pour reprendre le paiement.";
  if (status === 429) return "Trop d'essais pour l'instant. Réessaie un peu plus tard.";
  if (status === 503) return "Cette formule n'est pas disponible pour le moment. Choisis le mensuel ou réessaie plus tard.";
  return "Le paiement n'a pas pu démarrer. Réessaie dans un instant.";
}

/**
 * Vue client de /abonnement (session + paiement). `annualAvailable` est lu
 * côté serveur au rendu (page dynamique) : faux tant que le prix Stripe
 * annuel n'est pas configuré, et la vue reste alors strictement mensuelle.
 */
export function AbonnementView({ annualAvailable }: { annualAvailable: boolean }) {
  const { status } = useSession();
  // Mensuel par défaut ; ?plan=annual préselectionne l'annuel (si disponible).
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan>("monthly");
  // Intention d'origine lue après montage (le HTML serveur garde le lien sans returnTo).
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [entrySrc, setEntrySrc] = useState<string | null>(null);
  useEffect(() => {
    setSelectedPlan(readPlanFromUrl());
    setReturnTo(readReturnTo());
    setEntrySrc(readSrcFromUrl());
    // Retour de Stripe sans paiement (cancel_url) : mesuré une fois au chargement.
    if (new URLSearchParams(window.location.search).get("upgrade") === "cancel") {
      trackUmamiWhenReady("abonnement-annule");
    }
  }, []);
  const plan: PremiumPlan = annualAvailable ? selectedPlan : "monthly";
  const isAnnual = plan === "annual";
  const priceLabel = isAnnual ? PREMIUM_ANNUAL_PRICE_LABEL : PREMIUM_PRICE_LABEL;
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  // Plus de compte gratuit (s15) : un seul chemin, /register (étape 1 sur 2)
  // puis retour ici avec `auto=1` (paiement ouvert tout seul), formule et
  // intention conservées (voir getPostSignupRedirect et buildAbonnementUrl).
  const paidSignupHref = buildRegisterUrl({
    callbackUrl: buildAbonnementUrl(returnTo, plan),
    src: entrySrc ?? "abonnement",
  });

  const isAuthenticated = status === "authenticated";
  const pageBadge = "Plus qu'une étape";
  const pageTitle = isAuthenticated
    ? "Active ton accès pour commencer"
    : "Accéder aux parcours complets";
  const pageSubtitle = isAuthenticated
    ? `Ton compte est prêt. Encore un clic et les ${PARCOURS_COUNT} parcours sont à toi en entier, de la première à la dernière étape.`
    : `${PREMIUM_PRICE_LABEL}${annualAvailable ? ` ou ${PREMIUM_ANNUAL_PRICE_LABEL}` : ""}, sans engagement. La première étape de chaque parcours reste en lecture libre.`;

  const handleCheckout = useCallback(async (declencheur: "auto" | "manuel", chosenPlan: PremiumPlan) => {
    const annual = chosenPlan === "annual";
    setIsCheckoutLoading(true);
    trackUmami("abonnement-clic", { formule: annual ? "annuel" : "mensuel", src: "abonnement", declencheur });
    try {
      const origin = readReturnTo();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Mensuel : corps historique inchangé (le serveur applique le mensuel par défaut).
        body: JSON.stringify({ ...(origin ? { returnTo: origin } : {}), ...(annual ? { plan: chosenPlan } : {}) }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error("[Checkout]", data.error);
        toast(checkoutErrorMessage(res.status), "error");
      }
    } catch {
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  }, []);

  // Retour d'inscription (`auto=1`) : paiement lancé une seule fois, dès que la
  // session est confirmée. Échec : bouton manuel et messages habituels.
  const autoChecked = useRef(false);
  useEffect(() => {
    if (autoChecked.current || status === "loading") return;
    autoChecked.current = true;
    // Formule relue dans l'URL (l'état `selectedPlan` peut ne pas être encore à jour).
    const autoPlan: PremiumPlan = annualAvailable && readPlanFromUrl() === "annual" ? "annual" : "monthly";
    if (consumeAutoCheckout() && status === "authenticated") void handleCheckout("auto", autoPlan);
  }, [status, handleCheckout, annualAvailable]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        {/* Badge affiché uniquement pour un utilisateur connecté */}
        {isAuthenticated && (
          <Badge variant="primary" className="mb-4">
            {pageBadge}
          </Badge>
        )}
        <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          {pageTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-balance text-lg text-text-secondary">
          {pageSubtitle}
        </p>
      </div>

      {/* Offre principale */}
      <Card className={`mt-10 border-2 border-accent-primary p-0 shadow-lg shadow-accent-primary/10 hover:border-accent-primary`}>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg font-bold text-text-primary">
              Accès complet
            </h2>
          </div>
          {annualAvailable ? (
            <PlanSelector value={plan} onChange={setSelectedPlan} />
          ) : (
            <>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-text-primary">
                  {formatEuros(PREMIUM_MONTHLY_PRICE_CENTS)}
                </span>
                <span className="text-text-muted">/ mois</span>
              </div>
              <p className="mt-1 text-sm font-medium text-accent-link">
                Sans engagement, annulable &agrave; tout moment
              </p>
            </>
          )}

          <PremiumBenefits className="mt-6 space-y-3" />

          {isAuthenticated ? (
            <Button
              variant="primary"
              size="lg"
              className="mt-8 w-full"
              onClick={() => void handleCheckout("manuel", plan)}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading
                ? "On t'emmène au paiement…"
                : `Active mon accès · ${priceLabel}`}
            </Button>
          ) : (
            <Link
              href={paidSignupHref}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8 w-full")}
            >
              Commencer à {priceLabel}
            </Link>
          )}

          <p className="mt-3 text-center text-xs text-text-muted">
            Droit de{" "}
            <Link
              href="/retractation"
              className="underline hover:text-text-secondary"
            >
              r&eacute;tractation
            </Link>{" "}
            &middot; Paiement s&eacute;curis&eacute; par Stripe
          </p>
        </CardContent>
      </Card>

      {/* Garantie */}
      <div className="mt-6 rounded-xl bg-background-elevated p-6 text-center">
        <p className="font-semibold text-text-primary">
          Tu annules quand tu veux
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Ton acc&egrave;s reste actif jusqu&apos;à la fin de ta p&eacute;riode en cours
          {annualAvailable ? " (le mois ou l'année déjà payés)" : ""}.
          Pas de frais cach&eacute;s, pas de pi&egrave;ge.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <FaqSection items={getPremiumFaqs(annualAvailable)} />
      </div>
    </div>
  );
}
