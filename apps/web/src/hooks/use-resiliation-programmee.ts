"use client";

import { useEffect, useState } from "react";

/** Délai max de la lecture d'état (appel interne, 5 s : règle des appels externes). */
const TIMEOUT_MS = 5_000;

/**
 * `null` : pas de résiliation programmée (ou état inconnu : visiteur, chargement,
 * erreur ; le serveur protège de toute façon par le 409 « déjà abonné »).
 * Sinon : fin de la période payée (ISO), `null` si Stripe ne l'a pas transmise.
 */
export type ResiliationProgrammee = { finIso: string | null } | null;

interface StatusPayload {
  plan?: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
}

/** Premium encore en cours avec résiliation programmée (fin non dépassée). */
export function lireResiliationProgrammee(data: StatusPayload, maintenant = Date.now()): ResiliationProgrammee {
  if (data.plan !== "PREMIUM" || data.cancelAtPeriodEnd !== true) return null;
  const fin = data.currentPeriodEnd ?? null;
  if (fin && Number.isFinite(Date.parse(fin)) && Date.parse(fin) <= maintenant) return null;
  return { finIso: fin && Number.isFinite(Date.parse(fin)) ? fin : null };
}

/**
 * s16 lot F : l'e-mail de résiliation renvoie vers /abonnement. Tant que la
 * période payée court, /abonnement doit dire « ton Premium court jusqu'au … »
 * et renvoyer au profil (réactivation), au lieu de proposer un nouveau paiement.
 * Lu dans GET /api/stripe/status (même état que le profil, `subscriptionFlags`).
 */
export function useResiliationProgrammee(sessionStatus: "loading" | "authenticated" | "unauthenticated"): ResiliationProgrammee {
  const [resiliation, setResiliation] = useState<ResiliationProgrammee>(null);

  useEffect(() => {
    if (sessionStatus !== "authenticated") {
      setResiliation(null);
      return;
    }
    let annule = false;
    const signal = typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(TIMEOUT_MS) : undefined;
    // Promise.resolve : une absence de fetch (environnement de test) devient un simple rejet.
    Promise.resolve()
      .then(() => fetch("/api/stripe/status", { signal }))
      .then((res) => (res.ok ? (res.json() as Promise<StatusPayload>) : {}))
      .then((data) => {
        if (!annule) setResiliation(lireResiliationProgrammee(data ?? {}));
      })
      .catch(() => {
        if (!annule) setResiliation(null);
      });
    return () => {
      annule = true;
    };
  }, [sessionStatus]);

  return resiliation;
}
