"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { isPremiumPlan } from "@/lib/parcours-access";
import {
  pickParcoursAReprendre,
  type ParcoursAReprendre,
  type ParcoursProgressSummary,
} from "@/lib/entrees-parcours";

/**
 * Parcours en cours d'un abonné Premium (s17 lot C, UX-03 / reco 5).
 * Visiteur, compte sans Premium, session en chargement ou erreur réseau : null
 * (rien n'est affiché, aucune requête pour un visiteur).
 */
export function useParcoursAReprendre(): ParcoursAReprendre | null {
  const { data: session, status } = useSession();
  const isPremium =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const [aReprendre, setAReprendre] = useState<ParcoursAReprendre | null>(null);

  useEffect(() => {
    if (!isPremium) {
      setAReprendre(null);
      return;
    }
    const controller = new AbortController();
    fetch("/api/user/progress", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { parcours?: ParcoursProgressSummary[] } | null) => {
        setAReprendre(pickParcoursAReprendre(data?.parcours ?? []));
      })
      .catch(() => {
        /* réseau ou abandon : pas de bloc */
      });
    return () => controller.abort();
  }, [isPremium]);

  return aReprendre;
}
