"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { IconeDeconnexion, IconeEspace, IconeFavoris, IconeProfil } from "@/components/layout/header-icons";
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
 * s24 (espace client, lot D2) : `espace` n'est passé que par l'en-tête abonné de l'espace,
 * monté seulement interrupteur `ESPACE_CLIENT_PUBLIE` ouvert. Il donne « Mon espace », « Mon
 * profil », « Déconnexion » (« Favoris » vit dans le menu « Plus » de la barre : aucune
 * rubrique deux fois) et le nom accessible de l'en-tête abonné. Sans `espace` : rendu inchangé.
 */
export interface EntreesEspace {
  nom: string;
  monEspace: { href: string; label: string };
}
const ITEM =
  "flex min-h-11 w-full cursor-pointer select-none items-center gap-3 rounded-md px-3 text-sm font-medium text-text-secondary outline-none transition-colors data-[highlighted]:bg-background-elevated data-[highlighted]:text-text-primary";

export function AccountMenu({ espace }: { espace?: EntreesEspace } = {}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={espace ? espace.nom : TEXTES_CONNEXION.menuCompte}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-11 w-11 shrink-0 px-0 data-[state=open]:bg-background-elevated")}
      >
        <IconeProfil />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[60] min-w-[12rem] rounded-lg border border-border bg-background-card p-1 shadow-xl animate-fade-in"
        >
          {espace ? (
            <DropdownMenu.Item asChild className={ITEM}>
              <Link href={espace.monEspace.href}>
                <IconeEspace className="h-4 w-4" />
                {espace.monEspace.label}
              </Link>
            </DropdownMenu.Item>
          ) : (
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
