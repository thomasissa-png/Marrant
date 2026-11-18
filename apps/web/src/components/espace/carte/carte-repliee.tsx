"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CADRE_CARTE_RUBRIQUE } from "@/components/espace/carte/styles";
import { Chevron } from "@/components/espace/aujourdhui/tableau";
import { TEXTE_FORT } from "@/components/espace/typo";
import { cn } from "@/lib/utils";

/**
 * Carte de la rafale repliée (s26, `docs/design/rubriques-abonne-s26.md` §2.2) : toutes les cartes à faire sauf la
 * première. Sommaire de 48 px (titre en `TEXTE_FORT`, chevron qui pivote) ; la carte entière (`children`, l'`article`
 * qui porte l'ancre `#carte-N`) est dans le `<details>`. L'ancre d'« Aujourd'hui » ouvre sa carte : au chargement et à
 * chaque changement d'adresse (`hashchange`), si l'ancre est celle de cette carte, le `details` s'ouvre et la carte
 * vient à l'écran (les navigateurs récents le font déjà seuls ; le script couvre les autres).
 */
export function CarteRepliee({ ancre, titre, children }: { ancre: string; titre: string; children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const ouvrir = () => {
      if (window.location.hash !== `#${ancre}` || !details.current) return;
      details.current.open = true;
      document.getElementById(ancre)?.scrollIntoView?.();
    };
    ouvrir();
    window.addEventListener("hashchange", ouvrir);
    return () => window.removeEventListener("hashchange", ouvrir);
  }, [ancre]);

  return (
    <details ref={details} className={cn(CADRE_CARTE_RUBRIQUE, "group/repli min-w-0")} data-carte-repliee={ancre}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-6 py-2 transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary [&::-webkit-details-marker]:hidden">
        <span className={cn("min-w-0 [overflow-wrap:anywhere]", TEXTE_FORT)}>{titre}</span>
        <Chevron className="text-text-secondary transition-transform group-open/repli:rotate-90 motion-reduce:transition-none" />
      </summary>
      {children}
    </details>
  );
}
