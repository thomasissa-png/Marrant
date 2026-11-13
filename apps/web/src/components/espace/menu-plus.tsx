"use client";

import { Fragment, forwardRef } from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";
import { MENU_PLUS } from "@/components/espace/rubriques";
import { CLASSE_ACCROCHE_FIN, CLASSE_SOULIGNEMENT } from "@/components/espace/styles-barre";
import { cn } from "@/lib/utils";

/**
 * Menu « Plus » de la barre de l'espace (architecture v20 §6.2, maquette
 * `aujourdhui.html#plus`) : 3 groupes, « S'entraîner » ; « Mon contenu » (Favoris, Mes
 * répliques) ; « Le reste » (Lettres, Articles, Quiz d'humour). Menu ancré, rendu hors de
 * la zone qui défile (portail) ; Radix fournit le clavier (flèches, Échap, focus rendu au
 * bouton) et les rôles ARIA, comme le menu de compte. Lignes de 44 px.
 */
const LIGNE =
  "flex min-h-11 w-full cursor-pointer select-none items-center rounded-md px-3 text-sm font-medium text-text-secondary outline-none transition-colors data-[highlighted]:bg-background-elevated data-[highlighted]:text-text-primary";

interface MenuPlusProps {
  /** « Plus » est la rubrique courante (page d'une de ses lignes) : `aria-current="page"`. */
  actif: boolean;
  ouvert: boolean;
  onOuvertChange: (ouvert: boolean) => void;
  /** Classes de l'onglet (identiques aux autres entrées de la barre). */
  classeOnglet: string;
}

const Chevron = () => (
  <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const MenuPlus = forwardRef<HTMLButtonElement, MenuPlusProps>(function MenuPlus(
  { actif, ouvert, onOuvertChange, classeOnglet },
  ref,
) {
  return (
    <DropdownMenu.Root modal={false} open={ouvert} onOpenChange={onOuvertChange}>
      <DropdownMenu.Trigger ref={ref} data-onglet="" className={cn(classeOnglet, "gap-1")} aria-current={actif ? "page" : undefined}>
        {T.rubriques.plus}
        <Chevron />
        {actif && <span aria-hidden="true" className={CLASSE_SOULIGNEMENT} />}
        <span aria-hidden="true" className={CLASSE_ACCROCHE_FIN} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          aria-label={T.menuPlus.nom}
          aria-labelledby={undefined}
          align="end"
          sideOffset={8}
          collisionPadding={8}
          className="z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-48 overflow-y-auto rounded-lg border border-border bg-background-card p-1 shadow-xl"
        >
          {MENU_PLUS.map((groupe, i) => (
            <Fragment key={groupe.titre ?? "tete"}>
              {i > 0 && <DropdownMenu.Separator className="my-1 h-px bg-border" />}
              <DropdownMenu.Group>
                {groupe.titre && (
                  <DropdownMenu.Label className="px-3 pb-1 pt-2 text-xs font-semibold text-text-muted">{groupe.titre}</DropdownMenu.Label>
                )}
                {groupe.lignes.map((ligne) => (
                  <DropdownMenu.Item key={ligne.href} asChild className={LIGNE}>
                    <Link href={ligne.href}>{ligne.label}</Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Group>
            </Fragment>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});
