"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { PremiumBenefits } from "@/components/premium/premium-benefits";
import { buildAbonnementUrl, sanitizeReturnTo } from "@/lib/premium-return";
import { FaqSection } from "@/components/home/faq-section";
import { AuthModal } from "@/components/auth/auth-modal";

/**
 * Intention d'origine (ex. étape 2 d'un parcours) : relayée au paiement puis au
 * retour (/abonnement/success). Lue au clic dans l'URL (pas de useSearchParams :
 * la page garde son HTML statique), chemin interne uniquement.
 */
function readReturnTo(): string | null {
  if (typeof window === "undefined") return null;
  return sanitizeReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
}

/** Messages humains : jamais l'erreur brute de l'API (audit tunnel F14). */
function checkoutErrorMessage(status: number): string {
  if (status === 401) return "Ta session a expiré. Reconnecte-toi pour reprendre le paiement.";
  if (status === 429) return "Trop d'essais pour l'instant. Réessaie un peu plus tard.";
  return "Le paiement n'a pas pu démarrer. Réessaie dans un instant.";
}

// Rendu : Client Component (session + paiement), HTML statique.
export default function AbonnementPage() {
  const { status } = useSession();
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
    ? "Ton compte est prêt. Encore un clic et les 3 parcours sont à toi en entier, de la première à la dernière étape."
    : "Compte gratuit d'abord (10 vannes, 3 conseils, 3 vidéos, la première étape de chaque parcours). Tu passes à l'accès complet quand tu veux, à 4,99 €/mois.";

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const returnTo = readReturnTo();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(returnTo ? { returnTo } : {}),
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
        <Card className="mt-10 p-0">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-lg font-semibold text-text-primary">Compte gratuit</h2>
            <p className="mt-2 text-sm text-text-secondary">
              10 vannes, 3 conseils, 3 vidéos, le contenu du jour et la première étape de chaque parcours. Sans carte.
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
      <Card className={`${isAuthenticated ? "mt-10" : "mt-6"} border-2 border-accent-primary p-0 shadow-lg shadow-accent-primary/10`}>
        <CardContent className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">
              Accès complet
            </h2>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-text-primary">4,99 &euro;</span>
            <span className="text-text-muted">/ mois</span>
          </div>
          <p className="mt-1 text-sm font-medium text-accent-link">
            Sans engagement, annulable &agrave; tout moment
          </p>

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
                : "Active mon accès · 4,99 €/mois"}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="mt-8 w-full"
              onClick={() => openAuth(buildAbonnementUrl(readReturnTo()))}
            >
              Commencer à 4,99 €/mois
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
          Ton acc&egrave;s reste actif jusqu&apos;à la fin de ta p&eacute;riode en cours.
          Pas de frais cach&eacute;s, pas de pi&egrave;ge.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <FaqSection />
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
