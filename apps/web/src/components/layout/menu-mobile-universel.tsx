"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { IconeFavoris, IconeProfil } from "@/components/layout/header-icons";
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
 * couleur, `font-semibold`, `aria-current`.
 */
const ALLUMEE = "bg-background-elevated text-accent-link font-semibold";
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary";

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
  const secondaire = (actif: boolean) =>
    cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-11 w-full justify-start gap-2", actif && ALLUMEE);
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
            className={cn("flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-text-primary md:hidden", FOCUS, ligne === "monEspace" && ALLUMEE)}
          >
            {N.monEspace}
          </Link>
          <p className="hidden px-3 py-3 text-sm font-semibold text-text-primary md:block lg:hidden">{N.monEspace}</p>
          <ul className="ml-3 border-l border-border">
            {INDEX_ESPACE.map((e) => (
              <li key={e.cle}>
                <Link
                  href={e.href}
                  onClick={onClose}
                  aria-current={ligne === e.cle ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center pl-6 pr-3 text-sm text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary",
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

      <div className={cn("flex flex-col gap-2", etat === "abonne" && "pt-2")}>
        {liens.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            aria-current={allume === l.href ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
              FOCUS,
              allume === l.href ? ALLUMEE : "text-text-secondary hover:bg-background-elevated hover:text-text-primary",
            )}
          >
            {l.label}
          </Link>
        ))}
        {/* Abonné dès 768 px : plus aucune action dans le menu (compte en barre), pas de séparateur orphelin. */}
        <hr className={cn("my-2 border-border", etat === "abonne" && "md:hidden")} />
        {etat !== "abonne" && !masquerPlein && (
          <Link href={hrefs.prix} onClick={onClose} aria-label={EN_TETE.nomAccessible} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "h-11 w-full")}>
            {EN_TETE.bouton}
          </Link>
        )}
        {etat === "visiteur" && (
          <Link href={hrefs.login} onClick={onClose} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-11 w-full min-[520px]:hidden")}>
            Connexion
          </Link>
        )}
        {etat !== "visiteur" && (
          // Relecture des captures nav s24 : abonné, « Mon profil » et « Déconnexion » sur une ligne collée au bas du
          // menu dès 640 px de haut (2 gestes, sans défilement ; sous 640, à la suite, le bloc « Mon espace » garde
          // la place du critère 5 à 568 px).
          <div
            className={cn(
              "flex gap-2 md:hidden",
              etat === "abonne"
                ? "-mx-4 bg-background px-4 py-2 [@media(min-height:640px)]:sticky [@media(min-height:640px)]:bottom-0 [@media(min-height:640px)]:border-t [@media(min-height:640px)]:border-border [&>*]:flex-1"
                : "flex-col",
            )}
            data-actions-compte
          >
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
              className="h-11 w-full"
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/" });
              }}
            >
              Déconnexion
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
