"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { IconeDeconnexion, IconeFavoris, IconeProfil } from "@/components/layout/header-icons";
import { INDEX_ESPACE, elementBarreAllume, ligneEspaceAllumee, type EtatLecteur } from "@/components/espace/rubriques";
import type { LienNav } from "@/components/layout/en-tete-universel";
import { CHAMP } from "@/components/layout/panneau-eleve";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { EN_TETE } from "@/config/textes/cta-articles-accueil";
import { cn } from "@/lib/utils";

/**
 * Menu mobile de l'en-tête unique (v5 §1), sous 1024 px, un seul ordre : recherche (sous 440 px) ;
 * abonné : « Mon espace » (lien sous 768 px, intitulé non cliquable de 768 à 1023 px, où le lien est en
 * barre) suivi directement de ses 8 entrées (bloc `ml-3 border-l`, lignes de 44 px sans interstice), puis
 * un séparateur de 1 px ; liens du site ; « La lettre » (visiteur, compte gratuit) ; séparateur ; actions.
 * Hauteur à 375 x 667 : 65 + 16 + 52 + 44 + 352 + 1 = 530 px, les 8 entrées sans défilement dès 568 px.
 * Aucun lien deux fois avec la barre : « Connexion » seulement sous 520 px (elle est en barre au-delà),
 * actions du compte seulement sous 768 px (icône du compte en barre au-delà). Ligne allumée (§1) : fond,
 * couleur, `font-semibold`, `aria-current` et, s25 (relecture ux tour 1), filet gauche violet de 2 px lisible sans
 * la teinte : chaque ligne porte un filet transparent (`FILET`) et 2 px de padding gauche en moins, le texte ne
 * bouge pas d'une ligne à l'autre.
 * s25 (relecture tour 2, design F1 F2 et pistes, ux critères 3 et 5) : un seul pas de 44 px dans toute la colonne
 * (liens du site et actions en `min-h-11`, sans interstice, comme les 8 entrées), les séparateurs seuls portent
 * l'air ; actions du compte et « Connexion » alignées à gauche, en `font-medium` et couleur des liens du site
 * (`LIGNE_ACTION` écrase le `font-semibold` de `buttonVariants`) : le semi-gras reste réservé à la ligne allumée
 * et au bouton d'offre ; 16 px entre le bouton d'offre et les actions en dessous.
 * s25 (relectures tour 4) : 8 entrées en `font-medium` comme les liens du site (design 4) et ligne allumée aux coins
 * droits arrondis comme les autres (ux 3 et 5, `rounded-r-lg`, filet gauche droit sur le rail) ; à l'ouverture, la
 * ligne portant `aria-current` sous le pli est amenée dans la vue (ux 2, défilement du menu seul, bloc « nearest »,
 * immédiat si `prefers-reduced-motion`) ; déjà visible, le menu ne bouge pas ; abonné, jamais au prix de « Mon
 * espace » et de ses 8 entrées (critère 5 de la spec).
 * s25 (relecture ux tour 7, critère 7) : le focus enfermé du menu ouvert est géré par l'en-tête (`en-tete-universel.tsx`),
 * contrôles de la barre restés visibles au-dessus du voile compris.
 */
const FILET = "border-l-2 border-transparent";
const ALLUMEE = "rounded-l-none border-accent-primary bg-background-elevated text-accent-link font-semibold";
// s25 (relecture design tour 7, F2) : anneau unique de l'en-tête (`panneau-eleve.ts`), intérieur dans le menu, coins
// arrondis au focus même sur les lignes à coins gauches droits (rail, ligne allumée).
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link focus-visible:ring-offset-0 focus-visible:rounded-lg";
// Tour 3 (relecture design, piste) : 9 px entre l'icône et le libellé, le texte des actions à 53 px comme les entrées du rail.
/** Air sous la ligne allumée amenée dans la vue à l'ouverture (relecture design tour 7, P1). */
const MARGE_BASSE = 16;
const LIGNE_ACTION = cn(FILET, FOCUS, "h-11 w-full justify-start gap-[9px] pl-[10px] font-medium text-text-secondary hover:text-text-primary");

interface Props {
  etat: EtatLecteur;
  liens: LienNav[];
  pathname: string | null;
  hrefs: { prix: string; login: string };
  masquerPlein: boolean;
  onClose: () => void;
}

export function MenuMobileUniversel({ etat, liens, pathname, hrefs, masquerPlein, onClose }: Props) {
  const allume = elementBarreAllume(pathname, etat);
  const ligne = etat === "abonne" ? ligneEspaceAllumee(pathname) : null;
  const plein = etat !== "abonne" && !masquerPlein;
  const secondaire = (actif: boolean) => cn(buttonVariants({ variant: "ghost", size: "sm" }), LIGNE_ACTION, actif && ALLUMEE);
  const menu = useRef<HTMLElement>(null);
  // s25 (relecture ux tour 9, critère 3) : indice de suite. Tant qu'il reste du contenu sous le pli (au-delà de la
  // marge basse du menu), un fondu du fond du menu vers transparent couvre le bas du panneau ; il disparaît en bas.
  const [suite, setSuite] = useState(false);
  const majSuite = useCallback(() => {
    const nav = menu.current;
    if (!nav) return;
    const reste = nav.scrollHeight - nav.scrollTop - nav.clientHeight;
    setSuite(reste > parseFloat(getComputedStyle(nav).paddingBottom) + 1);
  }, []);
  useEffect(() => {
    majSuite();
    window.addEventListener("resize", majSuite);
    return () => window.removeEventListener("resize", majSuite);
  }, [majSuite]);

  // Ouverture : la ligne allumée sous le pli défile jusqu'à 16 px au-dessus du bord bas du menu. Mesures relatives au
  // menu : l'animation d'entrée (translation) les décale toutes deux d'autant. Abonné : spec v5 critère 5 (« Mon
  // espace » et ses 8 entrées sans défilement dès 568 px) prioritaire, le défilement ne dépasse pas la marge haute
  // du menu (rien au-dessus de « Mon espace » n'est coupé) ; s25 (relecture design tour 7 bis, P1) : la ligne entière
  // prime sur l'air : 16 px d'air dessous si le plafond le permet, sinon juste la ligne entière (la recherche garde le
  // reste de sa marge) ; si même la ligne entière dépasse le plafond, le menu ne bouge pas.
  useEffect(() => {
    const nav = menu.current;
    const ligneCourante = Array.from(nav?.querySelectorAll<HTMLElement>('[aria-current="page"]') ?? []).find((el) => el.getClientRects().length > 0);
    if (!nav || !ligneCourante) return;
    const defilement = ligneCourante.getBoundingClientRect().bottom - nav.getBoundingClientRect().top - nav.clientTop - nav.clientHeight;
    if (defilement <= 0) return;
    const plafond = nav.querySelector("[data-menu-espace]") ? parseFloat(getComputedStyle(nav).paddingTop) : Infinity;
    if (defilement > plafond) return;
    const cible = defilement + MARGE_BASSE <= plafond ? defilement + MARGE_BASSE : defilement;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nav.scrollTo({ top: Math.ceil(cible), behavior: reduit ? "auto" : "smooth" });
  }, []);

  return (
    <nav
      ref={menu}
      className="max-h-[calc(100dvh-4rem-1px)] overflow-y-auto overscroll-contain border-t border-border bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 md:px-6 lg:hidden animate-slide-up"
      aria-label="Navigation mobile"
      data-menu-mobile={etat}
      onScroll={majSuite}
    >
      <div className="mb-2 min-[440px]:hidden">
        <SearchBar className={cn("w-full", CHAMP)} onNavigate={onClose} dansMenu />
      </div>

      {etat === "abonne" && (
        <div data-menu-espace>
          <Link
            href={ESPACE_ACCUEIL}
            onClick={onClose}
            aria-current={ligne === "monEspace" ? "page" : undefined}
            className={cn("flex min-h-11 items-center rounded-lg pl-[10px] pr-3 text-sm font-semibold text-text-primary md:hidden", FILET, FOCUS, ligne === "monEspace" && ALLUMEE)}
          >
            {N.monEspace}
          </Link>
          <p className="hidden border-l-2 border-transparent py-3 pl-[10px] pr-3 text-sm font-semibold text-text-primary md:block lg:hidden">{N.monEspace}</p>
          <ul className="ml-3 border-l border-border">
            {INDEX_ESPACE.map((e) => (
              <li key={e.cle}>
                <Link
                  href={e.href}
                  onClick={onClose}
                  aria-current={ligne === e.cle ? "page" : undefined}
                  className={cn(
                    // Filet posé sur le rail (`-ml-px`) : la ligne allumée le recouvre, le texte reste à 24 px du rail.
                    "-ml-px flex h-11 items-center rounded-r-lg pl-[23px] pr-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary",
                    FILET,
                    FOCUS,
                    ligne === e.cle && ALLUMEE,
                  )}
                >
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
          <hr className="border-t border-border" />
        </div>
      )}

      <div className={cn("flex flex-col", etat === "abonne" && "pt-2")}>
        {/* s25 (relecture ux tour 1, spec §1 « de haut en bas ») : les liens du site en une colonne pour tous les
            comptes ; critère 5 : seules les 8 entrées de l'espace tiennent sans défilement, le reste peut être sous le pli. */}
        <div className="contents" data-liens-site>
        {liens.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            aria-current={allume === l.href ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center rounded-lg pl-[10px] pr-3 text-sm font-medium transition-colors",
              FILET,
              FOCUS,
              allume === l.href ? ALLUMEE : "text-text-secondary hover:bg-background-elevated hover:text-text-primary",
            )}
          >
            {l.label}
          </Link>
        ))}
        </div>
        {/* Séparateur seulement s'il est suivi de quelque chose (relecture design s25 F3) : bouton d'offre (toutes
            largeurs), sinon « Connexion » (visiteur, sous 520 px) ou actions du compte (sous 768 px). */}
        <hr className={cn("my-2 border-border", !plein && (etat === "visiteur" ? "min-[520px]:hidden" : "md:hidden"))} />
        {plein && (
          // Dès 768 px, largeur du libellé, aligné sur les liens (relecture ux s25) : plus de bouton de 736 px.
          <Link href={hrefs.prix} onClick={onClose} aria-label={EN_TETE.nomAccessible} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "h-11 w-full md:w-auto md:self-start")}>
            {EN_TETE.bouton}
          </Link>
        )}
        {etat === "visiteur" && (
          <Link href={hrefs.login} onClick={onClose} className={cn(secondaire(false), "min-[520px]:hidden", plein && "mt-4")}>
            Connexion
          </Link>
        )}
        {etat !== "visiteur" && (
          // s25 (relecture tour 1, design F2, ux) : une colonne pour tous, actions à gauche avec icône, comme les liens.
          <div className={cn("flex flex-col md:hidden", plein && "mt-4")} data-actions-compte>
            {etat === "gratuit" && (
              <Link href="/favoris" onClick={onClose} aria-current={allume === "compte" && pathname === "/favoris" ? "page" : undefined} className={secondaire(allume === "compte" && pathname === "/favoris")}>
                <IconeFavoris className="h-4 w-4" />
                Favoris
              </Link>
            )}
            <Link href="/profil" onClick={onClose} aria-current={pathname === "/profil" ? "page" : undefined} className={secondaire(pathname === "/profil")}>
              <IconeProfil className="h-4 w-4" />
              Mon profil
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className={LIGNE_ACTION}
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/" });
              }}
            >
              <IconeDeconnexion className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        )}
      </div>
      {/* Indice de suite (tour 9) : collé au bas de la vue du menu (`sticky`, décalé de la marge basse), pleine largeur,
          24 px, sans hauteur dans le flux (`-mt-6`) ; au-dessus du contenu mais sans cible (`pointer-events-none`). */}
      <div
        aria-hidden="true"
        data-indice-suite={suite ? "visible" : "masque"}
        className={cn(
          "pointer-events-none sticky -bottom-[max(1rem,env(safe-area-inset-bottom))] -mx-4 -mt-6 h-6 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 motion-reduce:transition-none md:-mx-6",
          suite ? "opacity-100" : "opacity-0",
        )}
      />
    </nav>
  );
}
