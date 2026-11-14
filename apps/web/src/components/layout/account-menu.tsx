"use client";

import Link from "next/link";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { IconeDeconnexion, IconeFavoris, IconeProfil } from "@/components/layout/header-icons";
import { TEXTES_CONNEXION } from "@/config/textes/compte";
import { cn } from "@/lib/utils";

/**
 * Menu de compte de la barre ordinateur (revue design s21, en-tête) : « Favoris »,
 * « Mon profil » et « Déconnexion » derrière UN bouton de 44 px au lieu de trois
 * contrôles permanents (environ 200 px rendus à la recherche et aux onglets).
 * Radix fournit le clavier (flèches, Échap, focus rendu au bouton) et les rôles
 * ARIA. Le bouton prix (« Premium · 1,99 €/mois ») reste hors du menu.
 * Sous 1024 px, le menu mobile garde ces entrées à plat.
 *
 * s24 (navigation universelle v5, §1) : `universel` n'est passé que par l'en-tête unique, monté
 * seulement interrupteur `ESPACE_CLIENT_PUBLIE` ouvert. `sansFavoris` (abonné : « Mon profil »,
 * « Déconnexion » ; « Favoris » est dans l'index de « Mon espace ») ; `actif` : icône allumée sur
 * `/profil` (et `/favoris` pour le compte gratuit), même style que les liens de la barre, `aria-current`.
 * s25 (relecture design tour 1, F5 à F7), `universel` seulement : panneau 8 px sous le filet de l'en-tête, bord
 * droit sur la marge de la coque (comme la cloche), finition des cartes de l'accueil (`rounded-xl`, filet dégradé
 * `h-1` en haut, `daily-content.tsx`).
 * Sans `universel` : rendu inchangé (test d'inertie).
 */
export interface VarianteUniverselle {
  sansFavoris: boolean;
  actif: boolean;
}
const ITEM =
  "flex min-h-11 w-full cursor-pointer select-none items-center gap-3 rounded-md px-3 text-sm font-medium text-text-secondary outline-none transition-colors data-[highlighted]:bg-background-elevated data-[highlighted]:text-text-primary";

/** Décalages Radix mesurés à l'ouverture : 8 px sous l'en-tête, bord droit sur la marge de la coque. */
function mesurerPosition(bouton: HTMLElement): { side: number; align: number } {
  const r = bouton.getBoundingClientRect();
  const enTete = bouton.closest("header");
  const coque = enTete?.firstElementChild;
  const droite = coque ? coque.getBoundingClientRect().right - parseFloat(getComputedStyle(coque).paddingRight) : r.right;
  return { side: Math.round((enTete?.getBoundingClientRect().bottom ?? r.bottom) - r.bottom + 8), align: Math.round(r.right - droite) };
}

export function AccountMenu({ universel }: { universel?: VarianteUniverselle } = {}) {
  const [position, setPosition] = useState({ side: 8, align: 0 });
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        onPointerDown={universel ? (e) => setPosition(mesurerPosition(e.currentTarget)) : undefined}
        onKeyDown={universel ? (e) => setPosition(mesurerPosition(e.currentTarget)) : undefined}
        aria-label={TEXTES_CONNEXION.menuCompte}
        aria-current={universel?.actif ? "page" : undefined}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-11 w-11 shrink-0 px-0 data-[state=open]:bg-background-elevated",
          universel && "rounded-b-none border-b-2",
          universel && (universel.actif ? "border-accent-primary bg-background-elevated text-accent-link" : "border-transparent"),
        )}
      >
        <IconeProfil />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={universel ? position.side : 8}
          alignOffset={universel ? position.align : undefined}
          className={cn(
            "z-[60] min-w-[12rem] rounded-lg border border-border bg-background-card p-1 shadow-xl animate-fade-in",
            universel && "overflow-hidden rounded-xl",
          )}
        >
          {universel && <div aria-hidden="true" className="-mx-1 -mt-1 mb-1 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary" />}
          {!universel?.sansFavoris && (
            <DropdownMenu.Item asChild className={ITEM}>
              <Link href="/favoris">
                <IconeFavoris className="h-4 w-4" />
                Favoris
              </Link>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item asChild className={ITEM}>
            <Link href="/profil">
              <IconeProfil className="h-4 w-4" />
              Mon profil
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item className={ITEM} onSelect={() => signOut({ callbackUrl: "/" })}>
            <IconeDeconnexion className="h-4 w-4" />
            Déconnexion
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
