"use client";

import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import { isPremiumPlan } from "@/lib/parcours-access";

/**
 * Abonné Premium connecté ? Plan lu dans la session (toujours présente), ou dans le store
 * utilisateur (rempli par /profil et après paiement) : l'un ou l'autre suffit, l'API tranche
 * en dernier. s21 (QA M2) : le store seul est vide sur l'accueil et les listes, l'abonné y
 * passait pour un non-abonné (carte Premium, cœurs des favoris).
 */
export function useEstPremium(): boolean {
  const { status, data: session } = useSession();
  const storePlan = useUserStore((s) => s.user?.plan);
  return (
    status === "authenticated" &&
    (isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan) || isPremiumPlan(storePlan))
  );
}
