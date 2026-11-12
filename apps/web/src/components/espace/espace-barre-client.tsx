"use client";

import { EnTeteEspace } from "@/components/espace/en-tete-espace";
import { EspaceBarre } from "@/components/espace/espace-barre";

/**
 * Montage côté navigateur de l'en-tête abonné et de la barre de l'espace (plan, lot D2).
 * Chargé par `components/layout/header.tsx` avec `next/dynamic` (`ssr: false`) et SEULEMENT
 * si `ESPACE_CLIENT_PUBLIE` est ouvert ET que la session dit Premium : le HTML serveur
 * reste celui du visiteur, aucun octet de l'espace n'est téléchargé par un visiteur, un
 * compte gratuit, ni par personne tant que l'interrupteur est fermé. Partout où l'en-tête
 * du site est rendu (pages publiques comprises, Q11 = A).
 */
export default function EspaceBarreClient({ pathname }: { pathname: string | null }) {
  return (
    <>
      <EnTeteEspace pathname={pathname} />
      <EspaceBarre pathname={pathname} />
    </>
  );
}
