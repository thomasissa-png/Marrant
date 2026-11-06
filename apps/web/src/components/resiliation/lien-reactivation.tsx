"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { RESILIATION_GARDER_HREF } from "@/config/resiliation";

/**
 * « Réactiver mon abonnement » (C5, bonne pratique) : ouvre le portail Stripe (« Renouveler »).
 * Lien réel vers la carte abonnement du profil : sans JavaScript ou si le portail ne répond pas,
 * on y arrive quand même (bouton « Gérer mon abonnement »).
 */
export function LienReactivation({ className, children }: { className: string; children: ReactNode }) {
  const [ouverture, setOuverture] = useState(false);

  const ouvrir = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (ouverture) return;
    setOuverture(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST", signal: AbortSignal.timeout(10_000) });
      const data = (await res.json().catch(() => null)) as { url?: unknown } | null;
      if (res.ok && typeof data?.url === "string") {
        window.location.assign(data.url);
        return;
      }
    } catch {
      // Portail indisponible : repli sur le profil ci-dessous.
    }
    window.location.assign(RESILIATION_GARDER_HREF);
  };

  return (
    <a href={RESILIATION_GARDER_HREF} onClick={ouvrir} aria-busy={ouverture || undefined} className={className}>
      {children}
    </a>
  );
}
