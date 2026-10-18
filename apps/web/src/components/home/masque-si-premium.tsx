"use client";

import type { ReactNode } from "react";
import { useEstPremium } from "@/hooks/use-est-premium";

/**
 * Masque son contenu pour un abonné Premium connecté (s21 QA M2 et m3). Le contenu est rendu
 * par le serveur (aucun JS à charger pour lui) ; seul ce masque lit la session.
 */
export function MasqueSiPremium({ children }: { children: ReactNode }) {
  return useEstPremium() ? null : <>{children}</>;
}
