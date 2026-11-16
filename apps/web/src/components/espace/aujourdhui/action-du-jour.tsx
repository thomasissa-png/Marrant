import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";

/**
 * Z1 « Action du jour » (refonte s25, spec design §4 Z1) : la carte dominante, seul bouton plein de l'écran. Sert au
 * premier pas, à l'étape en cours et à la rafale. `fige` (extrait de l'aperçu) : le bouton est dessiné sans lien ni
 * focus (l'extrait est inerte). v7 tour 3 (faute 3) : plus d'atténuation propre au bouton, celle de `TuileFermee`
 * (0,75) suffit. Échelle s25 (`docs/design/typo-harmonie-espace-s25.md` §2.2 et §3) : titre en `TITRE_CARTE` (20/600) ;
 * figé, le bouton est un contour inactif (même gabarit, bord neutre, texte blanc) : le seul plein de l'aperçu reste
 * l'offre.
 * v7 tour 7 (décision de Thomas du 16/11, hiérarchie) : une seule colonne, plus de rangée titre à gauche et bouton à
 * droite (environ 270 px de trou entre les deux à 1280, et 80 px vides sous le titre). Étiquette (durée à droite), titre
 * sur toute la largeur 8 px dessous, méta éventuelle 8 px dessous, puis le bouton aligné à gauche 16 px dessous (un
 * groupe, spec §2.4), pleine largeur sous 768 px. Contenu calé en haut : si « Ton cap » est plus haute, le surplus va
 * en bas des deux cartes, jamais au milieu.
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
  /** Sous le titre, avant le bouton (parcours, barre d'étapes). */
  children?: React.ReactNode;
  /** Sous le bouton, pleine largeur (accroche et liste des cartes de la rafale). */
  apres?: React.ReactNode;
} & { [cle: `data-${string}`]: string | undefined }) {
  const gabarit = "mt-4 w-full self-start whitespace-normal md:w-auto md:min-w-44 max-e300:mt-1 max-e300:h-auto max-e300:min-h-11";
  const bouton = cn(buttonVariants({ variant: "primary", size: "lg" }), gabarit);
  const boutonEteint = cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border-input bg-transparent", TEXTE_FORT, gabarit);
  return (
    <section aria-labelledby={idTitre} className={cn(CARTE_ACTION, "max-e300:p-3")} data-action-du-jour {...donnees}>
      {/* Figée (extrait) : place gardée à droite pour le verrou posé dans le coin (`TuileFermee`). */}
      <div className={cn("flex items-center justify-between gap-4", fige && "pr-8")}>
        <p className={ETIQUETTE}>{etiquette}</p>
        {duree && <p className={cn("flex-none tabular-nums", META)}>{duree}</p>}
      </div>
      {/* 200 % de texte (`max-e300`, test N4) : titre en 16 px serré, valeurs d'avant gardées, « Commencer » au premier écran. */}
      <h2 id={idTitre} className={cn("mt-2", TITRE_CARTE, "max-e300:mt-1 max-e300:text-base max-e300:leading-snug")}>
        {titre}
      </h2>
      {children}
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
      {apres}
    </section>
  );
}
