import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";

/**
 * Z1 « Action du jour » (refonte s25, spec design §4 Z1) : la carte dominante, seule teintée, seul bouton plein de
 * l'écran. Rangée 1 : étiquette violette à gauche, durée à droite ; rangée 2 : titre à gauche, bouton à droite dès
 * 768 px (en dessous, bouton pleine largeur sous le titre). Sert au premier pas, à l'étape en cours et à la rafale.
 * `fige` (extrait de l'aperçu) : le bouton est dessiné sans lien ni focus (l'extrait est inerte). v7 tour 3 (faute 3) :
 * plus d'atténuation propre au bouton, celle de `TuileFermee` (0,75) suffit : environ 4,5:1 (0,75 x 0,60 donnait 2,9:1).
 * Échelle s25 (`docs/design/typo-harmonie-espace-s25.md` §2.2 et §3) : titre en `TITRE_CARTE` (20/600) ; figé, le
 * bouton est un contour inactif (même gabarit, bord neutre, texte blanc) : le seul plein de l'aperçu reste l'offre.
 */
export function ActionDuJour({
  idTitre,
  etiquette,
  duree,
  titre,
  action,
  fige = false,
  children,
  apres,
  ...donnees
}: {
  idTitre: string;
  etiquette: React.ReactNode;
  duree?: string | null;
  titre: React.ReactNode;
  action: { href: string; libelle: string } | null;
  fige?: boolean;
  /** Sous le titre, dans sa colonne (parcours, barre d'étapes, comptes de la rafale). */
  children?: React.ReactNode;
  /** Sous la rangée du bouton, pleine largeur (liste des cartes de la rafale). */
  apres?: React.ReactNode;
} & { [cle: `data-${string}`]: string | undefined }) {
  const gabarit = "w-full whitespace-normal md:w-auto md:min-w-44 max-e300:h-auto max-e300:min-h-11";
  const bouton = cn(buttonVariants({ variant: "primary", size: "lg" }), gabarit);
  const boutonEteint = cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border-input bg-transparent", TEXTE_FORT, gabarit);
  return (
    <section aria-labelledby={idTitre} className={cn(CARTE_ACTION, "max-e300:p-3")} data-action-du-jour {...donnees}>
      {/* v7 tour 6 (placement) : contenu calé EN HAUT, étiquette puis rangée titre et bouton 16 px dessous. Quand Z2 est
          plus haute (même rangée dès 1024) ou que la carte s'étire (test N4), le surplus va en bas de carte, jamais
          au milieu (l'ancien `content-between` y creusait un vide lu comme cassé). */}
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-[1fr_auto] md:items-end max-e300:gap-y-1">
        {/* Figée (extrait) : place gardée à droite pour le verrou posé dans le coin (`TuileFermee`). */}
        <div className={cn("flex items-center justify-between gap-4 md:col-span-2", fige && "pr-8")}>
          <p className={ETIQUETTE}>{etiquette}</p>
          {duree && <p className={cn("flex-none tabular-nums", META)}>{duree}</p>}
        </div>
        <div className="min-w-0">
          {/* 200 % de texte (`max-e300`, test N4) : titre en 16 px serré, valeurs d'avant gardées, « Commencer » au premier écran. */}
          <h2 id={idTitre} className={cn(TITRE_CARTE, "max-e300:text-base max-e300:leading-snug")}>
            {titre}
          </h2>
          {children}
        </div>
        {action &&
          (fige ? (
            <span aria-disabled="true" className={cn(boutonEteint, "pointer-events-none")}>
              {action.libelle}
            </span>
          ) : (
            <Link href={action.href} className={bouton}>
              {action.libelle}
            </Link>
          ))}
      </div>
      {apres}
    </section>
  );
}
