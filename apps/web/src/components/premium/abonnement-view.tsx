"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { PremiumBenefits } from "@/components/premium/premium-benefits";
import { buildAbonnementUrl, sanitizeReturnTo } from "@/lib/premium-return";
import { FaqSection } from "@/components/home/faq-section";
import { getPremiumFaqs } from "@/lib/faqs";
import { AuthModal } from "@/components/auth/auth-modal";
import { PlanSelector } from "@/components/premium/plan-selector";
import {
  formatEuros,
  FREE_CATALOGUE_LIMITS_LABEL,
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
  useEffect(() => {
    setSelectedPlan(readPlanFromUrl());
  }, []);
  const plan: PremiumPlan = annualAvailable ? selectedPlan : "monthly";
  const isAnnual = plan === "annual";
  const priceLabel = isAnnual ? PREMIUM_ANNUAL_PRICE_LABEL : PREMIUM_PRICE_LABEL;
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Compte gratuit : onboarding ; accès complet : retour ici pour payer (voir getPostSignupRedirect).
  const [authCallbackUrl, setAuthCallbackUrl] = useState<string | undefined>(undefined);
  const openAuth = (callbackUrl: string | undefined) => {
    setAuthCallbackUrl(callbackUrl);
    setIsAuthModalOpen(true);
  };

  const isAuthenticated = status === "authenticated";
  const pageBadge = "Plus qu'une étape";
  const pageTitle = isAuthenticated
    ? "Active ton accès pour commencer"
    : "Crée ton compte, deviens drôle";
  const pageSubtitle = isAuthenticated
    ? `Ton compte est prêt. Encore un clic et les ${PARCOURS_COUNT} parcours sont à toi en entier, de la première à la dernière étape.`
    : `Compte gratuit d'abord (${FREE_CATALOGUE_LIMITS_LABEL}, la première étape de chaque parcours). Tu passes à l'accès complet quand tu veux, à ${PREMIUM_PRICE_LABEL}${annualAvailable ? ` ou ${PREMIUM_ANNUAL_PRICE_LABEL}` : ""}.`;

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const returnTo = readReturnTo();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Mensuel : corps historique inchangé (le serveur applique le mensuel par défaut).
        body: JSON.stringify({ ...(returnTo ? { returnTo } : {}), ...(isAnnual ? { plan } : {}) }),
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
  };

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

      {/* T45 : deux blocs lisibles pour l'anonyme, gratuit puis complet */}
      {!isAuthenticated && (
        <Card className="mt-10 p-0 hover:border-border">
          <CardContent className="p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-text-primary">Compte gratuit</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {FREE_CATALOGUE_LIMITS_LABEL}, le contenu du jour et la première étape de chaque parcours. Sans carte.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="mt-5 w-full"
              onClick={() => openAuth(undefined)}
            >
              Cr&eacute;e ton compte gratuit
            </Button>
            <p className="mt-3 text-center text-xs text-text-muted">
              Commence gratuitement, tu passes premium quand tu veux.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Offre principale */}
      <Card className={`${isAuthenticated ? "mt-10" : "mt-6"} border-2 border-accent-primary p-0 shadow-lg shadow-accent-primary/10 hover:border-accent-primary`}>
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
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading
                ? "On t'emmène au paiement…"
                : `Active mon accès · ${priceLabel}`}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="mt-8 w-full"
              onClick={() => openAuth(buildAbonnementUrl(readReturnTo(), plan))}
            >
              Commencer à {priceLabel}
            </Button>
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="register"
        callbackUrl={authCallbackUrl}
      />
    </div>
  );
}
