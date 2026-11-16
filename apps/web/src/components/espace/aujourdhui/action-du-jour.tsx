import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CARTE_ACTION, ETIQUETTE_ACTION } from "@/components/espace/aujourdhui/tableau";

/**
 * Z1 « Action du jour » (refonte s25, spec design §4 Z1) : la carte dominante, seule teintée, seul bouton plein de
 * l'écran. Rangée 1 : étiquette violette à gauche, durée à droite ; rangée 2 : titre à gauche, bouton à droite dès
 * 768 px (en dessous, bouton pleine largeur sous le titre). Sert au premier pas, à l'étape en cours et à la rafale.
 * `fige` (extrait de l'aperçu) : le bouton est dessiné sans lien ni focus (l'extrait est inerte). v7 tour 3 (faute 3) :
 * plus d'atténuation propre au bouton, celle de `TuileFermee` (0,75) suffit : environ 4,5:1 (0,75 x 0,60 donnait 2,9:1).
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
  const bouton = cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full whitespace-normal md:w-auto md:min-w-44 max-e300:h-auto max-e300:min-h-11");
  return (
    <section aria-labelledby={idTitre} className={cn(CARTE_ACTION, "max-e300:p-3")} data-action-du-jour {...donnees}>
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-[1fr_auto] md:items-end max-e300:gap-y-1">
        {/* Figée (extrait) : place gardée à droite pour la pastille « Premium » posée dans le coin. */}
        <div className={cn("flex items-center justify-between gap-4 md:col-span-2", fige && "pr-24")}>
          <p className={cn(ETIQUETTE_ACTION, "max-e300:tracking-normal")}>{etiquette}</p>
          {duree && <p className="flex-none text-sm tabular-nums text-text-secondary">{duree}</p>}
        </div>
        <div className="min-w-0">
          <h2 id={idTitre} className="font-display text-2xl font-bold leading-snug text-text-primary [text-wrap:balance] md:text-3xl max-e300:text-base">
            {titre}
          </h2>
          {children}
        </div>
        {action &&
          (fige ? (
            <span aria-disabled="true" className={cn(bouton, "pointer-events-none")}>
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
