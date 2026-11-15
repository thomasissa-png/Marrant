"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { IconeProfil, IconeRecherche } from "@/components/layout/header-icons";
import { MenuMobileUniversel } from "@/components/layout/menu-mobile-universel";
import { CHAMP } from "@/components/layout/panneau-eleve";
import { elementBarreAllume, sousAdresse, type EtatLecteur } from "@/components/espace/rubriques";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { TEXTES_CONNEXION } from "@/config/textes/compte";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { LETTRE_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { EN_TETE, LIBELLE_SECTION_ARTICLES } from "@/config/textes/cta-articles-accueil";
import { buildLoginUrl } from "@/lib/auth-links";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { cn } from "@/lib/utils";

/**
 * En-tête unique du site, interrupteur `ESPACE_CLIENT_PUBLIE` ouvert (`docs/ux/navigation-universelle-s24.md`
 * v5 §1) : le même pour visiteur, compte gratuit et abonné, sur toutes les pages qui ont un en-tête. Fermé,
 * `header.tsx` rend l'en-tête d'aujourd'hui et ce module n'est jamais chargé.
 * HTML serveur : celui du visiteur (la session n'est connue que dans le navigateur). Parties de l'abonné
 * (cloche) chargées à la demande. Une seule barre de 65 px, aucune seconde barre.
 * Largeurs (§1) : liens du site dès 1024 px ; « Mon espace » (abonné) dès 768 ; compte dès 768 ; loupe de
 * 440 à 1279, champ dès 1280 ; « Connexion » dès 520 ; cloche à toutes les largeurs ; bouton d'offre
 * « Premium » sous 640 et de 1024 à 1279, libellé complet de 640 à 1023 et dès 1280. Budget vérifié par
 * `playwright/tests/local/header-budget.spec.ts` (3 états, 320 à 1920 px).
 */
const AccountMenu = dynamic(() => import("@/components/layout/account-menu").then((m) => m.AccountMenu), {
  ssr: false,
  loading: () => (
    <span aria-hidden="true" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-11 w-11 shrink-0 px-0")}>
      <IconeProfil />
    </span>
  ),
});

const Cloche = dynamic(() => import("@/components/espace/cloche").then((m) => m.ClocheEspace), {
  ssr: false,
  loading: () => <span aria-hidden="true" className="h-11 w-11 shrink-0" />,
});

/** Liens du site, ordre unique (§1). « La lettre » : visiteur et compte gratuit seulement. */
const LIENS_SITE = [
  { href: "/parcours", label: "Parcours" },
  { href: "/vannes", label: "Vannes" },
  { href: "/conseils", label: "Conseils" },
  { href: "/videos", label: "Vidéos" },
  { href: "/blog", label: LIBELLE_SECTION_ARTICLES },
] as const;
const LIEN_LETTRE = { href: "/lettre", label: TEXTES_LETTRE.menu };

export type LienNav = { href: string; label: string };

export function liensDuSite(etat: EtatLecteur): LienNav[] {
  return etat !== "abonne" && LETTRE_INSCRIPTIONS_OUVERTES ? [...LIENS_SITE, LIEN_LETTRE] : [...LIENS_SITE];
}

/** État actif (§1) : fond, couleur et soulignement de 2 px ; tous les liens portent la bordure (pas de saut).
 *  s25 (relecture design tour 4, critère 7) : anneau de focus entièrement arrondi comme logo, cloche, compte, Menu
 *  et Premium ; hors focus, forme inchangée (haut arrondi, bas droit sous le soulignement de l'actif).
 *  s25 (relecture design tour 5, critère 7) : `pt-0.5` compense le `border-b-2` (zone de contenu de 40 px centrée à
 *  22 px, comme Connexion, Premium et la recherche) : même ligne de base ; 44 px et soulignement inchangés.
 *  s25 (relecture design tour 7, F2) : anneau `accent-link` dans tout l'en-tête (ratios dans `panneau-eleve.ts`). */
export const classeLienBarre = (actif: boolean) =>
  cn(
    "flex h-11 items-center whitespace-nowrap rounded-t-lg border-b-2 px-1.5 pt-0.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link xl:px-2",
    actif
      ? "border-accent-primary bg-background-elevated text-accent-link focus-visible:rounded-b-lg"
      : "border-transparent text-text-secondary hover:bg-background-elevated hover:text-text-primary focus-visible:rounded-lg",
  );

const ICONE =
  "h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link";

export function EnTeteUniversel() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const boutonMenu = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const connecte = status === "authenticated";
  const premium = (session?.user as { plan?: string } | undefined)?.plan === "PREMIUM";
  const etat: EtatLecteur = !connecte ? "visiteur" : premium ? "abonne" : "gratuit";
  const liens = liensDuSite(etat);
  const allume = elementBarreAllume(pathname, etat);

  useEffect(() => {
    if (rechercheOuverte) document.querySelector<HTMLInputElement>("#mobile-search input")?.focus();
  }, [rechercheOuverte]);

  const fermerMenu = (rendreFocus: boolean) => {
    setMenuOuvert(false);
    if (rendreFocus) boutonMenu.current?.focus();
  };

  // Échap ferme le menu et rend le focus au bouton « Menu » (une touche déjà traitée ne ferme rien).
  useEffect(() => {
    if (!menuOuvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      setMenuOuvert(false);
      boutonMenu.current?.focus();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [menuOuvert]);

  useEffect(() => {
    setRechercheOuverte(false);
    setMenuOuvert(false);
  }, [pathname]);

  // s25 (relecture ux tour 6, critère 7 piste 3 ; tour 7, critère 7) : menu ouvert sous un voile, le focus reste dans
  // l'en-tête, contrôles restés visibles au-dessus du voile compris (logo, cloche, compte, croix), dans l'ordre du DOM.
  // Tab sur le dernier élément visible (dernière ligne du menu) revient au logo, Maj+Tab sur le logo va au dernier ;
  // Maj+Tab depuis la première ligne du menu tombe naturellement sur la croix. Éléments relevés à chaque touche
  // (suggestions de recherche ouvertes comprises), visibles et tabulables seulement. Échap : effet ci-dessus.
  const enfermerFocus = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Tab" || e.defaultPrevented) return;
    const elements = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), [tabindex]")).filter(
      (el) => el.tabIndex >= 0 && el.getClientRects().length > 0,
    );
    const premier = elements[0];
    const dernier = elements[elements.length - 1];
    if (!premier || !dernier) return;
    if (e.shiftKey && document.activeElement === premier) {
      e.preventDefault();
      dernier.focus();
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault();
      premier.focus();
    }
  };

  // Mêmes liens que l'en-tête d'aujourd'hui : retour sur la page courante, bouton masqué sur les pages chaudes.
  const prixHref = buildAbonnementUrl(pathname && pathname !== "/" ? pathname : null, "monthly", "header");
  const loginHref = buildLoginUrl({ callbackUrl: pathname });
  const pageChaude = sousAdresse(pathname, "/abonnement") || sousAdresse(pathname, "/register");
  const ouvrirRecherche = () => {
    setRechercheOuverte(!rechercheOuverte);
    setMenuOuvert(false);
  };

  return (
    <>
      {menuOuvert && <div aria-hidden="true" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => fermerMenu(true)} />}
      <header
        className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md"
        data-en-tete-universel={etat}
        onKeyDown={menuOuvert ? enfermerFocus : undefined}
      >
        {/* s25 (relecture design F1) : barre ancrée à gauche, le premier lien au même x pour les 3 états à chaque
            largeur ; le vide se loge entre les liens et la recherche (ou les actions sous 1280 px). Tour 3 (design,
            faute dure) : 16 px dès 320 px, le logo sur la verticale de la recherche et des lignes du menu (`px-4`). */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-start gap-2 px-4 sm:gap-4 md:px-6 xl:px-8">
          {/* §6 (ROUVRE) : le logo de l'abonné mène à « Aujourd'hui ». s25 (relecture tour 2, design F5, ux 7) : même
              anneau violet arrondi que les autres contrôles ; `-mx-1 px-1` donne 4 px d'air à l'anneau sans
              déplacer le texte d'un pixel. */}
          <Link
            href={etat === "abonne" ? ESPACE_ACCUEIL : "/"}
            className="-mx-1 flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
          >
            <span className="whitespace-nowrap font-display text-sm font-bold text-gradient min-[360px]:text-base min-[400px]:text-lg sm:text-xl">
              deviens-marrant.fr
            </span>
          </Link>

          {/* Barre : « Mon espace » (abonné, dès 768 px) puis les liens du site (dès 1024 px). De 768 à 1023,
              collée au logo ; dès 1024, 32 px après le logo quel que soit le compte. */}
          <nav
            aria-label="Navigation principale"
            className={cn("hidden shrink-0 items-center gap-1 lg:ml-8", etat === "abonne" ? "md:flex" : "lg:flex")}
          >
            {etat === "abonne" && (
              <Link
                href={ESPACE_ACCUEIL}
                aria-current={allume === "monEspace" ? "page" : undefined}
                // Relecture des captures nav s24 (reviewer P8) : de 768 à 1023 px, seul en barre, 12 px de marge.
                className={cn(classeLienBarre(allume === "monEspace"), "md:px-3 lg:px-1.5 xl:px-2")}
              >
                {N.monEspace}
              </Link>
            )}
            {liens.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={allume === l.href ? "page" : undefined}
                className={cn(classeLienBarre(allume === l.href), "hidden lg:flex")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* s25 tour 4 bis : recherche de 176 px (spec v5 §1). La CI (Chrome 145) rend les graisses 500 à 700 des
              polices variables 1 à 8 px plus larges qu'en local : une zone d'actions de largeur fixe (même x de la
              recherche pour les 3 comptes, piste design tour 2) ne tient plus dans la coque (1216 px utiles de 1280 à
              1920 px) avec la recherche à 176 px. La zone prend donc la largeur de son contenu, 16 px après la
              recherche (`xl:ml-0`) : la recherche change de x selon le compte, la rangée tient avec marge.
              s25 tour 8 (ux critère 7) : champ à 44 px de haut ici et dans `#mobile-search` (`Input` : `h-10` dès 768 px). */}
          <SearchBar className={cn("hidden w-44 shrink-0 xl:ml-auto xl:block [&_input]:h-11", CHAMP)} onNavigate={() => setRechercheOuverte(false)} />

          <div className="ml-auto flex shrink-0 items-center gap-1 xl:ml-0 xl:gap-3">
            <button
              type="button"
              className={cn(ICONE, "hidden min-[440px]:flex xl:hidden")}
              onClick={ouvrirRecherche}
              aria-label="Rechercher"
              aria-expanded={rechercheOuverte}
              aria-controls="mobile-search"
            >
              <IconeRecherche />
            </button>
            {etat === "visiteur" && (
              <Link
                href={loginHref}
                className="hidden h-11 min-w-[44px] items-center justify-center rounded-lg px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link min-[520px]:flex"
              >
                {TEXTES_CONNEXION.lienConnexionMobile}
              </Link>
            )}
            {etat !== "abonne" && !pageChaude && (
              <Link
                href={prixHref}
                aria-label={EN_TETE.nomAccessible}
                data-en-tete-prix
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "inline-flex h-11 shrink-0 whitespace-nowrap px-2 text-xs min-[360px]:px-3 min-[360px]:text-sm",
                  // Menu ouvert sous 1024 px : retiré du flux (relecture design s25 F4), plus de vide qui isole la loupe.
                  menuOuvert && "hidden lg:inline-flex",
                )}
              >
                <span className="sm:hidden lg:inline xl:hidden">{EN_TETE.boutonCourt}</span>
                <span className="hidden sm:inline lg:hidden xl:inline">{EN_TETE.bouton}</span>
              </Link>
            )}
            {etat === "abonne" && <Cloche pathname={pathname} />}
            {etat !== "visiteur" && (
              <div className="hidden md:block">
                <AccountMenu universel={{ sansFavoris: etat === "abonne", actif: allume === "compte", courant: allume === "compte" ? pathname : null }} />
              </div>
            )}
            <button
              ref={boutonMenu}
              type="button"
              className={cn(ICONE, "flex lg:hidden")}
              onClick={() => {
                setMenuOuvert(!menuOuvert);
                setRechercheOuverte(false);
              }}
              aria-label="Menu"
              aria-expanded={menuOuvert}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOuvert ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {rechercheOuverte && (
          <div id="mobile-search" className="border-t border-border bg-background px-4 py-3 xl:hidden animate-slide-up">
            <SearchBar className={cn("w-full [&_input]:h-11", CHAMP)} onNavigate={() => setRechercheOuverte(false)} />
          </div>
        )}

        {menuOuvert && (
          <MenuMobileUniversel
            etat={etat}
            liens={liens}
            pathname={pathname}
            hrefs={{ prix: prixHref, login: loginHref }}
            masquerPlein={pageChaude}
            onClose={() => fermerMenu(false)}
          />
        )}
      </header>
    </>
  );
}
