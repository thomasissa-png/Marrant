"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import type { MarqueAnnonce, NumeroCap } from "@/lib/espace/caps";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { META, META_FORT } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CAPS);
/** s26 parcours v2 (§5) : « Ouvrir » et « Fermer » en liens soulignés, cible de 44 px. */
const LIEN_ANNONCE = cn(
  "inline-flex min-h-11 items-center whitespace-normal rounded-md px-2 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
  META_FORT,
);
/**
 * s26 parcours, tour 7 (relecture design v4, point 13 : bandeau de 77 px pour une ligne) : variante légère de /parcours,
 * une ligne de méta (14/20, gris secondaire) et « Fermer » en lien discret ; cible de 44 px gardée, hors hauteur de ligne.
 */
const LIEN_ANNONCE_LEGER =
  "inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2 text-sm text-text-secondary underline underline-offset-2 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";

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
export function AnnonceCap({
  annonce,
  retour,
  className,
  leger = false,
}: {
  annonce: AnnonceApi | null;
  retour?: () => HTMLElement | null;
  /** s26 (/parcours de l'abonné) : place dans la grille de la page. Absent : inchangé. */
  className?: string;
  /** s26 parcours, tour 7 : bandeau d'une ligne (/parcours de l'abonné). Absent : inchangé. */
  leger?: boolean;
}) {
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
      // s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §5) : carte neutre comme les autres (plus de
      // `border-border-input`), texte en méta forte et « Fermer » en lien souligné ; dès 768 px sur une ligne (Fermer à
      // droite, centrés), au-dessous à gauche. Aucun aplat.
      className={cn(
        montree &&
          cn(
            CADRE_CARTE_NEUTRE,
            leger
              ? "flex items-center justify-between gap-x-4 px-6 py-0.5 max-e300:flex-wrap max-e300:px-3"
              : "flex flex-col gap-2 px-6 py-4 md:flex-row md:items-center md:justify-between",
          ),
        className,
      )}
      data-testid="annonce-cap"
      data-annonce-legere={leger || undefined}
    >
      <div aria-live="polite" className="min-w-0">{phrases && <p className={leger ? META : META_FORT}>{phrases}</p>}</div>
      {montree && (
        <div role="group" aria-label={T.annonce.groupe} className={cn("flex shrink-0 flex-wrap gap-x-3", leger ? "-mr-2" : "-ml-2 md:ml-0")}>
          {montree.bonus && (
            <Link
              href={montree.bonus.href}
              aria-label={T.annonce.ouvrirLu(montree.bonus.titre)}
              className={leger ? LIEN_ANNONCE_LEGER : LIEN_ANNONCE}
            >
              {T.annonce.ouvrir}
            </Link>
          )}
          <button
            type="button"
            onClick={fermer}
            aria-label={T.annonce.fermerLu}
            className={leger ? LIEN_ANNONCE_LEGER : LIEN_ANNONCE}
          >
            {T.annonce.fermer}
          </button>
        </div>
      )}
    </div>
  );
}
