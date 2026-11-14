"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { IconeDeconnexion, IconeFavoris, IconeProfil } from "@/components/layout/header-icons";
import { INDEX_ESPACE, elementBarreAllume, ligneEspaceAllumee, type EtatLecteur } from "@/components/espace/rubriques";
import type { LienNav } from "@/components/layout/en-tete-universel";
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
 */
const FILET = "border-l-2 border-transparent";
const ALLUMEE = "rounded-l-none border-accent-primary bg-background-elevated text-accent-link font-semibold";
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary";
const LIGNE_ACTION = cn(FILET, "h-11 w-full justify-start gap-2 pl-[10px] font-medium text-text-secondary hover:text-text-primary");

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
  return (
    <nav
      className="max-h-[calc(100dvh-4rem-1px)] overflow-y-auto overscroll-contain border-t border-border bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 lg:hidden animate-slide-up"
      aria-label="Navigation mobile"
      data-menu-mobile={etat}
    >
      <div className="mb-2 min-[440px]:hidden">
        <SearchBar className="w-full" onNavigate={onClose} />
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
                    "-ml-px flex h-11 items-center pl-[23px] pr-3 text-sm text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary",
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
    </nav>
  );
}
