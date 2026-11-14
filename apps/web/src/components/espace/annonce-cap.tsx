"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import type { MarqueAnnonce, NumeroCap } from "@/lib/espace/caps";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CAPS);

export interface AnnonceApi {
  cap: NumeroCap | null;
  bonus: { cap: NumeroCap; titre: string; href: string } | null;
  marques: MarqueAnnonce[];
}

/**
 * Annonce de passage (niveaux-xp-s24.md 3.0 point 3, 5.4, critère 17 ; maquette `parcours.html`, v8.1).
 * Région `aria-live` polie présente dès le chargement, remplie quand une annonce est due ; SEULES les
 * phrases y sont, « Ouvrir » et « Fermer » sont dans un groupe voisin. Jamais retirée seule (au moins
 * 10 s ou jusqu'à fermeture : ici jusqu'à fermeture) ; « Ouvrir » seulement quand un bonus s'ouvre.
 * Fermer rend le focus à `retour` (« Reprendre »). Montrée une fois : acquittée auprès du serveur dès
 * l'affichage (`POST /api/espace/caps`), jamais dans « Aujourd'hui ».
 */
export function AnnonceCap({ annonce, retour }: { annonce: AnnonceApi | null; retour?: () => HTMLElement | null }) {
  const [montree, setMontree] = useState<AnnonceApi | null>(null);
  // Une annonce (ses marques) n'est montrée et acquittée qu'une fois, même relue après une validation.
  const derniere = useRef("");

  useEffect(() => {
    if (!annonce || (!annonce.cap && !annonce.bonus)) return;
    const cle = JSON.stringify(annonce.marques);
    if (cle === derniere.current) return;
    derniere.current = cle;
    setMontree(annonce);
    const controleur = new AbortController();
    const delai = setTimeout(() => controleur.abort(), 5_000);
    fetch("/api/espace/caps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ annonces: annonce.marques }),
      signal: controleur.signal,
    })
      .catch(() => undefined)
      .finally(() => clearTimeout(delai));
  }, [annonce]);

  const fermer = () => {
    setMontree(null);
    retour?.()?.focus();
  };

  const phrases = montree
    ? [montree.cap ? T.annonce.cap(montree.cap) : null, montree.bonus ? T.annonce.bonus(montree.bonus.titre) : null].filter(Boolean).join(" ")
    : "";

  return (
    <div
      className={cn(montree && "rounded-lg border border-border-input bg-background-light px-4 py-3")}
      data-testid="annonce-cap"
    >
      <div aria-live="polite">{phrases && <p className="text-base text-text-primary">{phrases}</p>}</div>
      {montree && (
        <div role="group" aria-label={T.annonce.groupe} className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
          {montree.bonus && (
            <Link
              href={montree.bonus.href}
              aria-label={T.annonce.ouvrirLu(montree.bonus.titre)}
              className={cn(buttonVariants({ variant: "outline" }), "min-h-11 whitespace-normal max-e300:w-full")}
            >
              {T.annonce.ouvrir}
            </Link>
          )}
          <button
            type="button"
            onClick={fermer}
            aria-label={T.annonce.fermerLu}
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11 whitespace-normal max-e300:w-full")}
          >
            {T.annonce.fermer}
          </button>
        </div>
      )}
    </div>
  );
}
