"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPostPaymentDestination, sanitizeReturnTo } from "@/lib/premium-return";
import { trackUmamiWhenReady } from "@/lib/umami";

export default function SubscriptionSuccessPage() {
  return (
    <Suspense>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const [attempts, setAttempts] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const MAX_ATTEMPTS = 15;

  const sessionId = searchParams.get("session_id");
  // Retour à l'intention d'origine (ex. l'étape de parcours qui a déclenché le
  // paywall), validée chemin interne ; sinon /parcours. Message de bienvenue
  // affiché à l'arrivée (paramètre premium=bienvenue).
  const rawReturnTo = searchParams.get("returnTo");
  const destination = getPostPaymentDestination(rawReturnTo);
  const fallbackTarget = sanitizeReturnTo(rawReturnTo) ?? "/parcours";
  const fallbackLabel = fallbackTarget.startsWith("/parcours/")
    ? "Reprendre mon parcours"
    : fallbackTarget === "/parcours"
      ? "Voir les parcours"
      : "Continuer";

  const activate = useCallback(async () => {
    // 1. Vérifier d'abord si le webhook a déjà activé le plan (rapide)
    try {
      const statusRes = await fetch("/api/stripe/status");
      if (statusRes.ok) {
        const data = await statusRes.json();
        if (data.plan === "PREMIUM") {
          await update();
          setReady(true);
          return;
        }
      }
    } catch {
      // Erreur réseau — on continue avec la vérification directe
    }

    // 2. Si le webhook n'a pas encore traité, vérifier directement via Stripe
    if (sessionId) {
      try {
        const verifyRes = await fetch("/api/stripe/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (verifyRes.ok) {
          const data = await verifyRes.json();
          if (data.plan === "PREMIUM") {
            await update();
            setReady(true);
            return;
          }
        }
      } catch {
        // Erreur — on réessaie au prochain tick
      }
    }
  }, [sessionId, update]);

  useEffect(() => {
    if (ready) return;

    const timer = setTimeout(async () => {
      await activate();

      if (attempts >= MAX_ATTEMPTS) {
        // Timeout — le paiement est peut-être en cours de traitement côté Stripe
        setError(true);
        return;
      }

      setAttempts((a) => a + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [attempts, ready, activate]);

  // Abonnement confirmé (plan PREMIUM vérifié) : mesuré une seule fois, avant la redirection.
  const formule = searchParams.get("formule") === "annuel" ? "annuel" : "mensuel";
  const tracked = useRef(false);
  useEffect(() => {
    if (ready) {
      if (!tracked.current) {
        tracked.current = true;
        trackUmamiWhenReady("abonnement-reussi", { formule });
      }
      router.push(destination);
    }
  }, [ready, router, destination, formule]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <CardContent className="p-8">
          <div className="mb-4 text-4xl">🎉</div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Paiement reçu !
          </h1>
          <p className="mt-2 text-text-secondary">
            On déroule le tapis rouge, ton accès s&apos;active…
          </p>
          {!error && (
            <div className="mt-6 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
            </div>
          )}
          {error && (
            <div className="mt-4">
              <p className="text-sm text-text-muted">
                L&apos;activation traîne un peu, comme une vanne qui cherche sa chute. Ton paiement est bien reçu : ton accès arrive dans quelques instants.
              </p>
              <Button
                variant="primary"
                className="mt-3"
                onClick={async () => {
                  setError(false);
                  setAttempts(0);
                }}
              >
                Réessayer
              </Button>
              <Button
                variant="ghost"
                className="mt-2 block w-full"
                onClick={() => router.push(fallbackTarget)}
              >
                {fallbackLabel}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
