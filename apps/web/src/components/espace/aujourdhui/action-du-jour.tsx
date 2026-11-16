import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CARTE_ACTION, TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META, TEXTE, TITRE_CARTE } from "@/components/espace/typo";

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
 * v7 tour 8 (point 2) : Z1 passe à 7 colonnes sur 12 dès 1024 (titre sur presque toute la largeur) ; son bouton prend
 * 256 px au moins dès 1024 (`lg:min-w-64`, 176 avant) : le point focal de la page pèse son poids, et la carte n'est plus
 * vide à plus de moitié (mesure du tour 8 : part occupée par les lignes de contenu au-dessus de 50 % à 1280 et 1920).
 * v7 tour 9 (faute dure design du tour 8) : figée, la carte prend le cadre neutre des tuiles (`TUILE`), ni bord violet
 * ni teinte : elle ne contient pas le bouton plein, l'accent de l'aperçu reste le seul bouton d'offre. L'abonné garde
 * `CARTE_ACTION` (teinte et bord violets autour de son bouton plein).
 * v7 tour 12 (relecture UX du tour 11, faute 2 : à 1280 et 1920, bouton seul à gauche et plus de 400 px vides à sa
 * droite) : `scene` (texte réel de la fiche du premier pas) se pose à gauche du bouton dès 768 px, sur une même rangée
 * (32 px entre eux, bas alignés) : la scène remplit la largeur, le bouton garde son gabarit, aucune taille ajoutée
 * (`TEXTE`, 16/400). Sous 768 px, la scène n'est pas affichée (premier écran de 375 inchangé). Relecture design du
 * tour 11 (point 4) : figé, le texte du bouton passe en gris secondaire (même 16/600) : il se lit éteint.
 * v7 tour 13 (relecture design du tour 12, critère 4 : deux grammaires de bouton pour la même carte) : une seule
 * disposition pour tous les comptes, bouton à GAUCHE sous le texte, jamais à droite. Avec une scène (nouvel abonné) :
 * titre, scène 8 px dessous (dès 768 px, masquée dessous comme avant), puis le bouton 16 px dessous ; la rafale garde
 * son titre collé au bouton (condition du libellé 7), son accroche passe dessous (`apres`). Aucun vide au milieu.
 * L'aperçu n'utilise plus `scene` ni le bouton éteint (vitrine des répliques, `repliques-fermees.tsx`).
 */
export function ActionDuJour({
  idTitre,
  etiquette,
  duree,
  titre,
  action,
  fige = false,
  scene,
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
  /** Scène réelle de la fiche du premier pas, entre le titre et le bouton dès 768 px (v7 tour 13). */
  scene?: string | null;
  /** Sous le titre, avant le bouton (parcours, barre d'étapes). */
  children?: React.ReactNode;
  /** Sous le bouton, pleine largeur (accroche et liste des cartes de la rafale). */
  apres?: React.ReactNode;
} & { [cle: `data-${string}`]: string | undefined }) {
  const gabarit = "mt-4 w-full self-start whitespace-normal md:w-auto md:min-w-44 lg:min-w-64 max-e300:mt-1 max-e300:h-auto max-e300:min-h-11";
  const bouton = cn(buttonVariants({ variant: "primary", size: "lg" }), gabarit);
  const boutonEteint = cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border-input bg-transparent text-base font-semibold text-text-secondary", gabarit);
  const boutonRendu =
    action &&
    (fige ? (
      <span aria-disabled="true" className={cn(boutonEteint, "pointer-events-none")}>
        {action.libelle}
      </span>
    ) : (
      <Link href={action.href} className={bouton}>
        {action.libelle}
      </Link>
    ));
  return (
    <section aria-labelledby={idTitre} className={cn(fige ? TUILE : CARTE_ACTION, "max-e300:p-3")} data-action-du-jour {...donnees}>
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
      {scene && (
        <p className={cn("mt-2 hidden md:block", TEXTE)} data-premier-pas-scene>
          {scene}
        </p>
      )}
      {boutonRendu}
      {apres}
    </section>
  );
}
