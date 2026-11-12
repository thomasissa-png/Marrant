"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/ui/search-bar";
import { buttonVariants } from "@/components/ui/button";
import { AccountMenu } from "@/components/layout/account-menu";
import { IconeRecherche } from "@/components/layout/header-icons";
import { Cloche } from "@/components/espace/cloche";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";
import { cn } from "@/lib/utils";

/**
 * En-tête de l'abonné quand l'espace est ouvert (maquette `aujourdhui.html`, étalon E5
 * §1.1 et §0 v4 point 3) : classes de `header.tsx` (64 px, bordure, fond à 95 %, flou),
 * logo à gauche ; à droite loupe, cloche et compte, trois boutons de 44 px. Ni onglets ni
 * menu burger : les rubriques sont dans la barre (aucune rubrique deux fois).
 * - Recherche : bouton icône de 44 px à toutes les largeurs (dont 320 et 375), qui ouvre un
 *   champ pleine largeur ; Échap et « Fermer » ferment et rendent le focus à la loupe.
 * - Sous 300 px de large (200 % de texte) : deux rangées (logo, puis les trois icônes),
 *   en-tête non épinglé (il prendrait plus d'un tiers de l'écran).
 */
const ICONE =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary aria-expanded:bg-background-elevated aria-expanded:text-text-primary";

export function EnTeteEspace({ pathname }: { pathname: string | null }) {
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const loupe = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setRechercheOuverte(false);
  }, [pathname]);

  useEffect(() => {
    if (rechercheOuverte) document.querySelector<HTMLInputElement>("#recherche-espace input")?.focus();
  }, [rechercheOuverte]);

  const fermer = (rendreFocus: boolean) => {
    setRechercheOuverte(false);
    if (rendreFocus) loupe.current?.focus();
  };

  // Une touche déjà traitée par la recherche (fermeture des suggestions) ne ferme pas le panneau.
  const surTouche = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    fermer(true);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md max-[299px]:static" data-en-tete-espace>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 min-[360px]:px-4 sm:gap-4 md:px-6 xl:px-8 max-[299px]:h-auto max-[299px]:flex-col max-[299px]:items-start max-[299px]:gap-0">
        <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2">
          <span className="whitespace-nowrap font-display text-sm font-bold text-gradient min-[360px]:text-base min-[400px]:text-lg sm:text-xl">
            deviens-marrant.fr
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1 max-[299px]:ml-0">
          <button
            ref={loupe}
            type="button"
            className={ICONE}
            onClick={() => setRechercheOuverte((o) => !o)}
            aria-label={T.recherche.ouvrir}
            aria-expanded={rechercheOuverte}
            aria-controls="recherche-espace"
          >
            <IconeRecherche />
          </button>
          <Cloche />
          <AccountMenu espace={{ nom: T.compte.nom, monEspace: { href: ESPACE_ACCUEIL, label: T.monEspace } }} />
        </div>
      </div>
      {rechercheOuverte && (
        <div id="recherche-espace" className="border-t border-border bg-background py-2" onKeyDown={surTouche}>
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 min-[360px]:px-4 md:px-6 xl:px-8">
            <SearchBar className="min-w-0 flex-1" onNavigate={() => fermer(false)} />
            <button
              type="button"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-11 shrink-0 border-border-input")}
              onClick={() => fermer(true)}
            >
              {T.recherche.fermer}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
