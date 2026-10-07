"use client";

// Rendu : Client Component (vérification du paiement en boucle côté navigateur).
//
// s16 (07/10/2026) : « Paiement reçu ! » n'est affiché qu'APRÈS un plan Premium
// vérifié (statut en base ou verify-session). Visiteur non connecté (401) : la
// boucle s'arrête tout de suite, invitation à se connecter avec retour sur
// cette page (session_id conservé). Paiement non vérifiable : message honnête
// et contact, jamais « ton paiement est bien reçu » sans preuve.

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { getPostPaymentDestination, sanitizeReturnTo } from "@/lib/premium-return";
import { trackUmamiWhenReady } from "@/lib/umami";
import { CONTACT_EMAIL, TEXTES_SUCCESS } from "@/config/textes/paiement";

type Etat = "verification" | "pret" | "connexion" | "non-verifie";
type Resultat = "premium" | "connexion" | "refuse" | "attente";

export default function SubscriptionSuccessPage() {
  return (
    <Suspense>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}

const MAX_ATTEMPTS = 15;

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const [attempts, setAttempts] = useState(0);
  const [etat, setEtat] = useState<Etat>("verification");

  const sessionId = searchParams.get("session_id");
  // Retour à l'intention d'origine, validée chemin interne ; sinon /parcours.
  const rawReturnTo = searchParams.get("returnTo");
  const destination = getPostPaymentDestination(rawReturnTo);
  const fallbackTarget = sanitizeReturnTo(rawReturnTo) ?? "/parcours";
  const fallbackLabel = fallbackTarget.startsWith("/parcours/")
    ? "Reprendre mon parcours"
    : fallbackTarget === "/parcours"
      ? "Voir les parcours"
      : "Continuer";
  const query = searchParams.toString();
  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/abonnement/success${query ? `?${query}` : ""}`)}`;

  const verifier = useCallback(async (): Promise<Resultat> => {
    // 1. Le webhook a-t-il déjà activé le plan ? (rapide)
    try {
      const statusRes = await fetch("/api/stripe/status");
      if (statusRes.status === 401) return "connexion";
      if (statusRes.ok && (await statusRes.json()).plan === "PREMIUM") return "premium";
    } catch {
      // Erreur réseau : on tente la vérification directe
    }
    // 2. Sinon, vérification directe auprès de Stripe
    if (!sessionId) return "attente";
    try {
      const verifyRes = await fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (verifyRes.status === 401) return "connexion";
      if (verifyRes.status === 403) return "refuse"; // session d'un autre compte
      if (verifyRes.ok && (await verifyRes.json()).plan === "PREMIUM") return "premium";
    } catch {
      // On réessaie au prochain tick
    }
    return "attente";
  }, [sessionId]);

  useEffect(() => {
    if (etat !== "verification") return;
    const timer = setTimeout(async () => {
      const resultat = await verifier();
      if (resultat === "premium") {
        await update();
        setEtat("pret");
      } else if (resultat === "connexion") {
        setEtat("connexion");
      } else if (resultat === "refuse" || attempts >= MAX_ATTEMPTS) {
        setEtat("non-verifie");
      } else {
        setAttempts((a) => a + 1);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [attempts, etat, verifier, update]);

  // Abonnement confirmé (plan PREMIUM vérifié) : mesuré une seule fois, avant la redirection.
  const formule = searchParams.get("formule") === "annuel" ? "annuel" : "mensuel";
  const tracked = useRef(false);
  useEffect(() => {
    if (etat !== "pret") return;
    if (!tracked.current) {
      tracked.current = true;
      trackUmamiWhenReady("abonnement-reussi", { formule });
    }
    router.push(destination);
  }, [etat, router, destination, formule]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <CardContent className="p-8" aria-live="polite">
          {etat === "pret" && (
            <>
              <div className="mb-4 text-4xl" aria-hidden="true">🎉</div>
              <h1 className="font-display text-2xl font-bold text-text-primary">Paiement reçu !</h1>
              <p className="mt-2 text-text-secondary">On déroule le tapis rouge, ton accès s&apos;active…</p>
            </>
          )}
          {etat === "verification" && (
            <>
              <h1 className="font-display text-2xl font-bold text-text-primary">{TEXTES_SUCCESS.verificationTitre}</h1>
              <p className="mt-2 text-text-secondary">{TEXTES_SUCCESS.verificationTexte}</p>
              <div className="mt-6 flex justify-center" role="status" aria-label={TEXTES_SUCCESS.verificationTitre}>
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
              </div>
            </>
          )}
          {etat === "connexion" && (
            <>
              <h1 className="font-display text-2xl font-bold text-text-primary">{TEXTES_SUCCESS.connexionTitre}</h1>
              <p className="mt-2 text-text-secondary">{TEXTES_SUCCESS.connexionTexte}</p>
              <Link href={loginHref} className={buttonVariants({ variant: "primary", className: "mt-4" })}>
                {TEXTES_SUCCESS.connexionBouton}
              </Link>
            </>
          )}
          {etat === "non-verifie" && (
            <>
              <h1 className="font-display text-2xl font-bold text-text-primary">{TEXTES_SUCCESS.nonVerifieTitre}</h1>
              <p className="mt-2 text-sm text-text-muted">{TEXTES_SUCCESS.nonVerifieTexte}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 inline-block text-accent-link underline">
                {CONTACT_EMAIL}
              </a>
              <Button
                variant="primary"
                className="mt-3 block w-full"
                onClick={() => {
                  setAttempts(0);
                  setEtat("verification");
                }}
              >
                {TEXTES_SUCCESS.reessayer}
              </Button>
              <Button variant="ghost" className="mt-2 block w-full" onClick={() => router.push(fallbackTarget)}>
                {fallbackLabel}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
