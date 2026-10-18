"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import dynamic from "next/dynamic";
import { IconeProfil, IconeRecherche } from "@/components/layout/header-icons";
import { MobileNav, isActivePath, type NavItem } from "@/components/layout/mobile-nav";
import { buildLoginUrl } from "@/lib/auth-links";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { cn } from "@/lib/utils";
import { TEXTES_CONNEXION } from "@/config/textes/compte";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { LETTRE_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { EN_TETE, LIBELLE_SECTION_ARTICLES } from "@/config/textes/cta-articles-accueil";

/**
 * s21 (QA m3, budget JS) : menu de compte (Radix, ~25 Ko compressés) chargé seulement pour un
 * compte connecté, jamais pour un visiteur. Repère de même taille pendant le chargement (pas de saut).
 */
const AccountMenu = dynamic(() => import("@/components/layout/account-menu").then((m) => m.AccountMenu), {
  ssr: false,
  loading: () => (
    <span aria-hidden="true" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-11 w-11 shrink-0 px-0")}>
      <IconeProfil />
    </span>
  ),
});

/**
 * Budget de la barre ordinateur (revue design s21, en-tête). Largeur utile : 992 px à
 * 1024, 1248 px dès 1280 (max-w-7xl : identique à 1440, 1536 et 1920). Tout est
 * `shrink-0` : rien ne s'écrase en silence.
 *  - logo ~188 ; 7 onglets (6 + « La lettre » ou « Carnet ») ~480 à 1024 (px-1.5 depuis s21 :
 *    « Articles » est plus long que « Blog », mesuré à 1024 par header-budget), ~478 dès
 *    1280 (px-2 depuis la revue v3 m4, pour le libellé complet du bouton prix) ;
 *  - recherche : bouton loupe de 44 px de 1024 à 1279 (ouvre le panneau `#mobile-search`),
 *    champ de 176 px (`w-44`) dès 1280 ;
 *  - actions : visiteur « Connexion » + « 2,99 €/mois » de 1024 à 1279, « Premium · 2,99 €/mois »
 *    dès 1280 (s21, vers /abonnement) ; connecté « Activer mon accès »
 *    (sans abonnement) + menu de compte 44 px (« Favoris », « Mon profil »,
 *    « Déconnexion » regroupés, `account-menu.tsx`).
 * Garde-fou : `playwright/tests/local/header-budget.spec.ts` (6 largeurs x 3 états,
 * aucun débordement, aucun libellé coupé, recherche >= 160 px). Un onglet ou un
 * bouton de plus doit d'abord trouver sa place dans ce budget, sinon aller dans le
 * menu de compte ou le menu déroulant.
 */

const navItems: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/vannes", label: "Vannes" },
  { href: "/conseils", label: "Conseils" },
  { href: "/videos", label: "Vidéos" },
  { href: "/parcours", label: "Parcours" },
  { href: "/blog", label: LIBELLE_SECTION_ARTICLES },
];

/** Abonnés Premium : le carnet mensuel juste après les parcours. */
const premiumNavItems: NavItem[] = [
  ...navItems.slice(0, 5),
  { href: "/carnet", label: "Carnet" },
  ...navItems.slice(5),
];

/**
 * s21 : la lettre gratuite, dernier onglet après « Articles » (interrupteur des
 * inscriptions ouvert, visiteurs non Premium comme le formulaire de la lettre),
 * onglet comme les autres à toutes les largeurs (budget ci-dessus).
 */
const lettreNavItem: NavItem = { href: "/lettre", label: TEXTES_LETTRE.menu };

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const boutonMenu = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isPremium = (session?.user as { plan?: string } | undefined)?.plan === "PREMIUM";
  const items = isPremium ? premiumNavItems : LETTRE_INSCRIPTIONS_OUVERTES ? [...navItems, lettreNavItem] : navItems;

  // T47 : à l'ouverture de la recherche mobile, le champ reçoit le focus (1 tap au lieu de 2)
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    document.querySelector<HTMLInputElement>("#mobile-search input")?.focus();
  }, [isMobileSearchOpen]);

  // QA s21 tour 2 n1 : Échap ferme le menu mobile et rend le focus au bouton « Menu ».
  // Une touche déjà traitée (suggestions de la recherche du menu) ne ferme rien.
  useEffect(() => {
    if (!isMenuOpen) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      setIsMenuOpen(false);
      boutonMenu.current?.focus();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [isMenuOpen]);

  // Close mobile search/menu on route change
  useEffect(() => {
    setIsMobileSearchOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  // Liens réels (présents dans le HTML serveur) : retour sur la page courante après coup.
  // s21 (B6) : le bouton visiteur mène à /abonnement?src=header (prix, carnet, garantie
  // avant le formulaire), plus à /register.
  const prixHref = buildAbonnementUrl(null, "monthly", "header");
  const loginHref = buildLoginUrl({ callbackUrl: pathname });
  // s21 (B6, spec §1.3 a) : bouton plein masqué sur /abonnement et /register (même
  // destination ou boucle : un seul plein par page chaude).
  const pageChaude = isActivePath(pathname, "/abonnement") || isActivePath(pathname, "/register");
  // Compte connecté sans abonnement (s15 §2.4) : un accès direct au paiement.
  const activateHref = buildAbonnementUrl(pathname, "monthly", "header");

  const closeMobileSearch = () => setIsMobileSearchOpen(false);

  return (
    <>
      {/* s17 tour 1 (DES-1-17) : fond plus opaque, le texte de la page ne transparaît plus. */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 min-[360px]:px-4 sm:gap-4">
          {/* Logo (s16 : un cran plus petit sous 640 px ; s20 : encore un cran sous 400 px ;
              concision v5 : encore un cran sous 360 px, avec des marges de 12 px, pour que le
              bouton prix tienne à côté du menu dès 320 px) */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap font-display text-sm font-bold text-gradient min-[360px]:text-base min-[400px]:text-lg sm:text-xl">
              deviens-marrant.fr
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden shrink-0 items-center gap-1 lg:flex" aria-label="Navigation principale">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-1.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary xl:px-2",
                  isActivePath(pathname, item.href)
                    ? "bg-background-elevated text-accent-link"
                    : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Recherche : champ dès 1280 px ; de 1024 à 1279, une loupe qui ouvre le panneau
              de recherche (même geste qu'au téléphone). */}
          <SearchBar className="hidden w-44 shrink-0 xl:block" onNavigate={closeMobileSearch} />
          <button
            type="button"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary lg:flex xl:hidden"
            onClick={() => { setIsMobileSearchOpen(!isMobileSearchOpen); setIsMenuOpen(false); }}
            aria-label="Rechercher"
            aria-expanded={isMobileSearchOpen}
            aria-controls="mobile-search"
          >
            <IconeRecherche />
          </button>

          {/* Actions desktop */}
          <div className="hidden shrink-0 items-center gap-1 lg:flex xl:gap-3">
            {isAuthenticated ? (
              <>
                {!isPremium && !pageChaude && (
                  <Link href={activateHref} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "whitespace-nowrap")}>
                    Activer mon accès
                  </Link>
                )}
                <AccountMenu />
              </>
            ) : (
              <>
                <Link href={loginHref} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Connexion
                </Link>
                {/* Concision v5 : « Premium · 2,99 €/mois » (182 px) ne tient pas de 1 024 à 1 279 px
                    (61 px de trop à 1 024, mesuré) : libellé court, même lien et même nom accessible.
                    Revue v3 m4 : dès 1 280 px, onglets en px-2 au lieu de px-3 (56 px regagnés pour
                    29 manquants) et libellé complet. */}
                {!pageChaude && (
                  <Link
                    href={prixHref}
                    aria-label={EN_TETE.nomAccessible}
                    className={cn(buttonVariants({ variant: "primary", size: "sm" }), "whitespace-nowrap")}
                  >
                    <span className="xl:hidden">{EN_TETE.boutonCourt}</span>
                    <span className="hidden xl:inline">{EN_TETE.bouton}</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Actions mobile */}
          <div className="flex items-center gap-1 lg:hidden">
            {/* s16 reco 19 puis s20 : « Connexion » visible sans ouvrir le menu à partir de
                520 px. En dessous, la place va à « Commencer » (audit conversion s20, 66 %
                du trafic sur mobile) ; le lien reste dans le menu. */}
            {!isAuthenticated && (
              <Link
                href={loginHref}
                className="hidden h-11 min-w-[44px] items-center justify-center rounded-lg px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary min-[520px]:flex"
              >
                {TEXTES_CONNEXION.lienConnexionMobile}
              </Link>
            )}
            {/* s20 (audit conversion, lot 1), s21 (B6) puis concision v5 : bouton prix visible sur
                mobile à toutes les largeurs (même lien que sur ordinateur, prixHref, src=header),
                cible de 44 px. « Premium · 2,99 €/mois » dès 640 px, où il tient à côté du logo,
                de « Connexion », de la loupe et du menu (il lui faut 447 px seul, 590 px avec
                « Connexion » et la loupe) ; en dessous, libellé court « 2,99 €/mois » (largeurs
                mesurées : REPLIT_ACTIONS.md, « Concision du tunnel (textes) »). Masqué sur les pages chaudes. */}
            {!isAuthenticated && !pageChaude && (
              <Link
                href={prixHref}
                aria-label={EN_TETE.nomAccessible}
                data-en-tete-prix
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "inline-flex h-11 shrink-0 whitespace-nowrap px-2 text-xs min-[360px]:px-3 min-[360px]:text-sm",
                )}
              >
                <span className="sm:hidden">{EN_TETE.boutonCourt}</span>
                <span className="hidden sm:inline">{EN_TETE.bouton}</span>
              </Link>
            )}
            {/* Bouton recherche mobile (s20 : à partir de 440 px ; en dessous, la recherche
                est en tête du menu, pour laisser la place au bouton prix). */}
            <button
              type="button"
              className="hidden h-11 w-11 min-[440px]:flex items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              onClick={() => { setIsMobileSearchOpen(!isMobileSearchOpen); setIsMenuOpen(false); }}
              aria-label="Rechercher"
              aria-expanded={isMobileSearchOpen}
              aria-controls="mobile-search"
            >
              <IconeRecherche />
            </button>

            {/* Menu burger mobile */}
            <button
              ref={boutonMenu}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsMobileSearchOpen(false); }}
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Overlay recherche mobile */}
        {isMobileSearchOpen && (
          <div id="mobile-search" className="border-t border-border bg-background px-4 py-3 xl:hidden animate-slide-up">
            <SearchBar className="w-full" onNavigate={closeMobileSearch} />
          </div>
        )}

        {/* Menu mobile */}
        {isMenuOpen && (
          <MobileNav
            items={items}
            pathname={pathname}
            isAuthenticated={isAuthenticated}
            isPremium={isPremium}
            hrefs={{ activate: activateHref, prix: prixHref, login: loginHref }}
            masquerPlein={pageChaude}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </header>
    </>
  );
}
