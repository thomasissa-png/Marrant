"use client";

import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useEstPremium } from "@/hooks/use-est-premium";

/**
 * Masque son contenu pour un abonné Premium connecté (s21 QA M2 et m3). Le contenu est rendu
 * par le serveur (aucun JS à charger pour lui) ; seul ce masque lit la session.
 */
export function MasqueSiPremium({ children }: { children: ReactNode }) {
  return useEstPremium() ? null : <>{children}</>;
}

/**
 * Masque son contenu pour un compte connecté, abonné ou non (s21 QA v2 m-c) : une ligne qui
 * invite à s'inscrire n'a pas de sens pour quelqu'un qui l'est déjà. Visiteur : rendu tel quel.
 */
export function MasqueSiConnecte({ children }: { children: ReactNode }) {
  return useSession().status === "authenticated" ? null : <>{children}</>;
}

/** Inverse de `MasqueSiConnecte` : contenu réservé à un compte connecté (trajet de conversion s21). */
export function SeulementSiConnecte({ children }: { children: ReactNode }) {
  return useSession().status === "authenticated" ? <>{children}</> : null;
}
