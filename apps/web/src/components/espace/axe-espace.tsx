"use client";

import type { ReactNode } from "react";
import { useSession } from "next-auth/react";

/**
 * Colonne de lecture de l'espace sur une page partagée avec le site public (lot D11c, revue d'harmonie
 * défaut 3) : à 1280 px, l'abonné Premium voit la page sur le même axe que le reste de l'espace
 * (`lg:max-w-lecture`, collée à la marge gauche de l'en-tête et de la barre). Tout autre lecteur garde
 * la classe d'avant (`visiteur`) : même HTML serveur (la session n'est connue que dans le navigateur,
 * comme pour l'en-tête abonné), même page qu'interrupteur fermé (critère 11). Monté par les pages
 * seulement interrupteur ouvert.
 */
export function AxeEspace({ visiteur, children }: { visiteur?: string; children: ReactNode }) {
  const { data } = useSession();
  const abonne = (data?.user as { plan?: string } | undefined)?.plan === "PREMIUM";
  return (
    <div className={abonne ? "lg:max-w-lecture" : visiteur} data-axe-espace={abonne ? "lecture" : undefined}>
      {children}
    </div>
  );
}
