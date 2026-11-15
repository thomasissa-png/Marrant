"use client";

import Link from "next/link";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { IconeDeconnexion, IconeFavoris, IconeProfil } from "@/components/layout/header-icons";
import { TEXTES_CONNEXION } from "@/config/textes/compte";
import { PANNEAU_ELEVE } from "@/components/layout/panneau-eleve";
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
 * s25 (relecture design tour 2, F4 et F6), `universel` seulement : couche au-dessus des cartes (`PANNEAU_ELEVE`),
 * lignes en `text-text-primary` comme « Dans ton espace » et la cloche (`ITEM_UNIVERSEL`), ligne active et
 * séparateur en `border-hover`, visibles sur le fond élevé.
 * s25 (relecture ux tour 4, critère 7) : `courant` (adresse en cours quand `actif`) : la ligne de la page en cours
 * (« Mon profil » sur `/profil`, « Favoris » sur `/favoris` du compte gratuit) porte `aria-current="page"` et le rendu
 * allumé du menu mobile, lisible sans la teinte : filet gauche violet de 2 px, semi-gras, texte `accent-link` sur un
 * fond en creux (`background-card` : 6,1:1 ; sur `border-hover`, le violet tomberait à 4,2:1). Survolée, la ligne
 * passe au fond de survol en texte principal, comme les autres.
 * s25 (relecture design tour 7, F1 et F2) : anneau de focus clavier des lignes, comme le reste de l'en-tête
 * (règle unique documentée dans `panneau-eleve.ts`) : 2 px, intérieur (le panneau coupe l'extérieur), `accent-link`, sur la ligne
 * en relief (`data-highlighted`) quand le menu est mené au clavier (`data-clavier` : dernière touche après le dernier geste
 * de pointeur). `:focus-visible` ne suffit pas : Radix donne le focus à la ligne survolée et empêche le `pointerdown` du
 * bouton, Chrome dessinerait l'anneau au survol à la souris. Ligne en cours : coins arrondis sous l'anneau.
 * s25 (relecture design tour 8, critères 5 et 7) : lignes en `rounded-lg` (12 px dans `tailwind.config.ts`), la classe
 * des lignes de la cloche (`cloche-lignes.tsx`) et du menu mobile, anneau de la ligne en cours compris.
 * Sans `universel` : rendu inchangé (test d'inertie).
 */
export interface VarianteUniverselle {
  sansFavoris: boolean;
  actif: boolean;
  courant?: string | null;
}
const ITEM =
  "flex min-h-11 w-full cursor-pointer select-none items-center gap-3 rounded-md px-3 text-sm font-medium text-text-secondary outline-none transition-colors data-[highlighted]:bg-background-elevated data-[highlighted]:text-text-primary";
const ITEM_UNIVERSEL =
  "flex min-h-11 w-full cursor-pointer select-none items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-primary outline-none transition-colors data-[highlighted]:bg-border-hover group-data-[clavier]/compte:data-[highlighted]:ring-2 group-data-[clavier]/compte:data-[highlighted]:ring-inset group-data-[clavier]/compte:data-[highlighted]:ring-accent-link";
const ITEM_COURANT =
  "rounded-l-none border-l-2 border-accent-primary bg-background-card pl-[10px] font-semibold text-accent-link data-[highlighted]:text-text-primary group-data-[clavier]/compte:data-[highlighted]:rounded-lg";

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
  const [clavier, setClavier] = useState(false);
  const item = universel ? ITEM_UNIVERSEL : ITEM;
  const courant = (href: string) => universel?.actif === true && universel.courant === href;
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        onPointerDown={
          universel
            ? (e) => {
                setPosition(mesurerPosition(e.currentTarget));
                setClavier(false);
              }
            : undefined
        }
        onKeyDown={
          universel
            ? (e) => {
                setPosition(mesurerPosition(e.currentTarget));
                setClavier(true);
              }
            : undefined
        }
        aria-label={TEXTES_CONNEXION.menuCompte}
        aria-current={universel?.actif ? "page" : undefined}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-11 w-11 shrink-0 px-0 data-[state=open]:bg-background-elevated",
          // s25 (relecture ux tour 3, critère 4) : bas carré et filet violet réservés à l'état actif (adresse) ; ouvert
          // sans être actif, même rendu que la cloche ouverte (coins arrondis, fond de survol, texte principal). Le
          // filet transparent garde la hauteur.
          universel && "border-b-2",
          universel &&
            (universel.actif
              ? "rounded-b-none border-accent-primary bg-background-elevated text-accent-link focus-visible:rounded-b-lg"
              : "border-transparent data-[state=open]:text-text-primary"),
          // s25 (relecture design tour 7, F2) : même anneau que la barre (2 px, `accent-link`, collé au bouton).
          universel && "focus-visible:ring-accent-link focus-visible:ring-offset-0",
        )}
      >
        <IconeProfil />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={universel ? position.side : 8}
          alignOffset={universel ? position.align : undefined}
          data-clavier={universel && clavier ? "" : undefined}
          onKeyDown={universel ? () => setClavier(true) : undefined}
          onPointerMove={universel ? () => setClavier(false) : undefined}
          className={
            universel
              ? cn("group/compte z-[60] min-w-[12rem] overflow-hidden rounded-xl border border-border p-1 animate-fade-in", PANNEAU_ELEVE)
              : "z-[60] min-w-[12rem] rounded-lg border border-border bg-background-card p-1 shadow-xl animate-fade-in"
          }
        >
          {universel && <div aria-hidden="true" className="-mx-1 -mt-1 mb-1 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary" />}
          {!universel?.sansFavoris && (
            <DropdownMenu.Item asChild className={cn(item, courant("/favoris") && ITEM_COURANT)}>
              <Link href="/favoris" aria-current={courant("/favoris") ? "page" : undefined}>
                <IconeFavoris className="h-4 w-4" />
                Favoris
              </Link>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item asChild className={cn(item, courant("/profil") && ITEM_COURANT)}>
            <Link href="/profil" aria-current={courant("/profil") ? "page" : undefined}>
              <IconeProfil className="h-4 w-4" />
              Mon profil
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className={cn("my-1 h-px", universel ? "bg-border-hover" : "bg-border")} />
          <DropdownMenu.Item className={item} onSelect={() => signOut({ callbackUrl: "/" })}>
            <IconeDeconnexion className="h-4 w-4" />
            Déconnexion
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
