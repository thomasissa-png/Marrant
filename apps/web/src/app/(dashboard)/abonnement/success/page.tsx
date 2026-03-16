"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { update } = useSession();
  const [attempts, setAttempts] = useState(0);
  const [ready, setReady] = useState(false);
  const MAX_ATTEMPTS = 15;

  useEffect(() => {
    if (ready) return;

    const timer = setTimeout(async () => {
      try {
        // Vérifier le plan directement en DB (pas via JWT cache)
        const subRes = await fetch("/api/stripe/status");
        if (subRes.ok) {
          const data = await subRes.json();
          if (data.plan === "PREMIUM") {
            // Forcer le rafraîchissement de la session JWT
            await update();
            setReady(true);
            return;
          }
        }
      } catch {
        // Erreur réseau — on réessaie
      }

      if (attempts >= MAX_ATTEMPTS) {
        // Timeout — forcer le refresh de session quand même
        await update();
        setReady(true);
        return;
      }

      setAttempts((a) => a + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [attempts, ready, update]);

  useEffect(() => {
    if (ready) {
      router.push("/vannes?upgrade=success");
    }
  }, [ready, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <CardContent className="p-8">
          <div className="mb-4 text-4xl">🎉</div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Paiement reçu !
          </h1>
          <p className="mt-2 text-text-secondary">
            Activation de ton abonnement en cours...
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
          </div>
          {attempts >= MAX_ATTEMPTS && (
            <div className="mt-4">
              <p className="text-sm text-text-muted">
                L&apos;activation prend plus de temps que prévu.
              </p>
              <Button
                variant="primary"
                className="mt-2"
                onClick={() => router.push("/vannes")}
              >
                Continuer quand même
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
