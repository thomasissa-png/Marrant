"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { IconeDeconnexion, IconeProfil } from "@/components/layout/header-icons";
import type { EtatLecteur } from "@/components/espace/rubriques";
import { CHAMP } from "@/components/layout/panneau-eleve";
import { EN_TETE } from "@/config/textes/cta-articles-accueil";
import { cn } from "@/lib/utils";

/**
 * Menu mobile de l'en-tête unique, sous 768 px. Navigation v6 (`docs/ux/navigation-v6-menu-rubriques.md` §3) : la
 * bande des rubriques porte toute la navigation, le menu se réduit aux actions et à la recherche : recherche (sous
 * 440 px), bouton d'offre (visiteur et compte gratuit, hors pages chaudes), « Connexion » (visiteur, sous 520 px),
 * « Mon profil » et « Déconnexion » (comptes), soit 1 à 4 lignes. Plus aucune liste de liens du site ni de l'espace.
 * Repris des tours s25 : un seul pas de 44 px, actions alignées à gauche avec icône, `font-medium` (le semi-gras reste
 * réservé à la ligne allumée et au bouton d'offre), 16 px sous le bouton d'offre, filet gauche violet de 2 px sur la
 * ligne allumée (lisible sans la teinte), anneau `accent-link` intérieur (`panneau-eleve.ts`), indice de suite en bas
 * tant qu'il reste du contenu sous le pli. Focus enfermé et Échap : gérés par l'en-tête (`en-tete-universel.tsx`).
 */
const FILET = "border-l-2 border-transparent";
const ALLUMEE = "rounded-l-none border-accent-primary bg-background-elevated text-accent-link font-semibold";
// s25 (relecture design tour 10, F5) : au focus, le filet transparent de 2 px (`FILET`) est retiré et rendu en padding
// (`pl-[10px]` + 2 = `pl-3`) : l'anneau commence au bord de la ligne (x = 16, comme celui de la recherche), le texte ne
// bouge pas.
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link focus-visible:ring-offset-0 focus-visible:rounded-lg focus-visible:border-l-0 focus-visible:pl-3";
const LIGNE_ACTION = cn(FILET, FOCUS, "h-11 w-full justify-start gap-[9px] pl-[10px] font-medium text-text-secondary hover:text-text-primary");

interface Props {
  etat: EtatLecteur;
  pathname: string | null;
  hrefs: { prix: string; login: string };
  masquerPlein: boolean;
  onClose: () => void;
}

export function MenuMobileUniversel({ etat, pathname, hrefs, masquerPlein, onClose }: Props) {
  const plein = etat !== "abonne" && !masquerPlein;
  const profil = pathname === "/profil";
  const menu = useRef<HTMLElement>(null);
  // s25 (relecture ux tour 9, critère 3) : indice de suite tant qu'il reste du contenu sous le pli.
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

  return (
    <nav
      ref={menu}
      // Surimpression sous tout le bloc collant (rangée, bande, filet), juste après la rangée dans le DOM (ordre du Tab).
      // Hauteur disponible : la fenêtre moins la rangée (64), la bande (52) et le filet de l’en-tête.
      className="absolute inset-x-0 top-full max-h-[calc(100dvh-7.25rem-1px)] overflow-y-auto overscroll-contain border-t border-border bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 md:hidden animate-slide-up"
      aria-label="Navigation mobile"
      data-menu-mobile={etat}
      onScroll={majSuite}
    >
      <div className="mb-2 min-[440px]:hidden">
        <SearchBar className={cn("w-full", CHAMP)} onNavigate={onClose} dansMenu />
      </div>

      <div className="flex flex-col">
        {plein && (
          <Link href={hrefs.prix} onClick={onClose} aria-label={EN_TETE.nomAccessible} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "h-11 w-full")}>
            {EN_TETE.bouton}
          </Link>
        )}
        {etat === "visiteur" && (
          <Link href={hrefs.login} onClick={onClose} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), LIGNE_ACTION, "min-[520px]:hidden", plein && "mt-4")}>
            Connexion
          </Link>
        )}
        {etat !== "visiteur" && (
          <div className={cn("flex flex-col", plein && "mt-4")} data-actions-compte>
            <Link
              href="/profil"
              onClick={onClose}
              aria-current={profil ? "page" : undefined}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), LIGNE_ACTION, profil && ALLUMEE)}
            >
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
      {/* Indice de suite (tour 9) : collé au bas de la vue du menu, sans hauteur dans le flux, sans cible. */}
      <div
        aria-hidden="true"
        data-indice-suite={suite ? "visible" : "masque"}
        className={cn(
          "pointer-events-none sticky -bottom-[max(1rem,env(safe-area-inset-bottom))] -mx-4 -mt-6 h-6 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 motion-reduce:transition-none",
          suite ? "opacity-100" : "opacity-0",
        )}
      />
    </nav>
  );
}
