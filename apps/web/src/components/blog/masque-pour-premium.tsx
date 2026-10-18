"use client";

import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { isPremiumPlan } from "@/lib/parcours-access";

/**
 * Masque un bloc d'appel pour un abonné Premium connecté (s21, encart du milieu des
 * articles : même règle que la lettre). Le contenu est rendu côté serveur (page en
 * ISR, sans session) puis retiré à l'hydratation si l'abonné est connecté.
 */
export function MasquePourPremium({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const premium = status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  return premium ? null : <>{children}</>;
}
