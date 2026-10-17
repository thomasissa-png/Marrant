"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { buildLoginUrl, buildRegisterUrl } from "@/lib/auth-links";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { cn } from "@/lib/utils";
import { TEXTES_CONNEXION } from "@/config/textes/compte";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { LETTRE_INSCRIPTIONS_OUVERTES } from "@/config/lettre";

/**
 * Largeur à partir de laquelle l'onglet « La lettre » tient dans la barre ordinateur
 * (mesuré le 17/10, s21) : connecté sans abonnement, la barre déborde dès 1100 px avec
 * l'onglet (elle débordait déjà de 70 px à 1024 sans lui) ; anonyme à 1024, la recherche
 * tombe à 65 px. Dès 1280 (`xl`), plus aucun débordement. Entre 1024 et 1279 : l'onglet
 * n'est pas dans la barre, la lettre reste dans le pied de page (et le menu déroulant < 1024).
 */
const LETTRE_ONGLET_ORDINATEUR = "xl:inline-flex";

/** Onglet actif : page exacte, ou sous-page (ex. /blog/<slug> garde « Blog » actif). */
function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

type NavItem = { href: string; label: string; desktopClassName?: string };

const navItems: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/vannes", label: "Vannes" },
  { href: "/conseils", label: "Conseils" },
  { href: "/videos", label: "Vidéos" },
  { href: "/parcours", label: "Parcours" },
  { href: "/blog", label: "Blog" },
];

/** Abonnés Premium : le carnet mensuel juste après les parcours. */
const premiumNavItems: NavItem[] = [
  ...navItems.slice(0, 5),
  { href: "/carnet", label: "Carnet" },
  ...navItems.slice(5),
];

/**
 * s21 : la lettre gratuite, dernier onglet après « Blog » (interrupteur des
 * inscriptions ouvert, visiteurs non Premium comme le formulaire de la lettre).
 * Toujours dans le menu déroulant ; dans la barre ordinateur seulement là où elle
 * tient sans déborder (`desktopClassName`, mesuré à 1024, 1280 et 1440 px).
 */
const lettreNavItem: NavItem = { href: "/lettre", label: TEXTES_LETTRE.menu, desktopClassName: LETTRE_ONGLET_ORDINATEUR };

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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

  // Close mobile search/menu on route change
  useEffect(() => {
    setIsMobileSearchOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  // Liens réels (présents dans le HTML serveur) : retour sur la page courante après coup.
  const registerHref = buildRegisterUrl({ callbackUrl: pathname, src: "header" });
  const loginHref = buildLoginUrl({ callbackUrl: pathname });
  // Compte connecté sans abonnement (s15 §2.4) : un accès direct au paiement.
  const activateHref = buildAbonnementUrl(pathname, "monthly", "header");

  const closeMobileSearch = () => setIsMobileSearchOpen(false);

  return (
    <>
      {/* s17 tour 1 (DES-1-17) : fond plus opaque, le texte de la page ne transparaît plus. */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4">
          {/* Logo (s16 : un cran plus petit sous 640 px ; s20 : encore un cran sous 400 px
              pour loger « Commencer » à côté du menu dès 360 px) */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap font-display text-base font-bold text-gradient min-[400px]:text-lg sm:text-xl">
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
                  "rounded-lg px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary xl:px-3",
                  item.desktopClassName && cn("hidden", item.desktopClassName),
                  isActivePath(pathname, item.href)
                    ? "bg-background-elevated text-accent-link"
                    : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <SearchBar className="hidden w-36 lg:block xl:w-48 2xl:w-64" onNavigate={closeMobileSearch} />

          {/* Actions desktop */}
          <div className="hidden shrink-0 items-center gap-1 lg:flex xl:gap-3">
            {isAuthenticated ? (
              <>
                {!isPremium && (
                  <Link href={activateHref} className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
                    Activer mon accès
                  </Link>
                )}
                <Link
                  href="/favoris"
                  aria-label="Favoris"
                  title="Favoris"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  <svg className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </Link>
                <Link
                  href="/profil"
                  aria-label="Mon profil"
                  title="Mon profil"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  <svg className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href={loginHref} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Connexion
                </Link>
                <Link href={registerHref} className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
                  Commencer
                </Link>
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
            {/* s20 (audit conversion, lot 1) : « Commencer » visible sur mobile dès 360 px,
                même lien que sur ordinateur (registerHref, src=header). Cible de 44 px.
                Sous 360 px, place insuffisante : il reste dans le menu. */}
            {!isAuthenticated && (
              <Link
                href={registerHref}
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "hidden h-11 shrink-0 px-3 min-[360px]:inline-flex",
                )}
              >
                Commencer
              </Link>
            )}
            {/* Bouton recherche mobile (s20 : à partir de 440 px ; en dessous, la recherche
                est en tête du menu, pour laisser la place à « Commencer »). */}
            <button
              className="hidden h-11 w-11 min-[440px]:flex items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              onClick={() => { setIsMobileSearchOpen(!isMobileSearchOpen); setIsMenuOpen(false); }}
              aria-label="Rechercher"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Menu burger mobile */}
            <button
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
          <div id="mobile-search" className="border-t border-border bg-background px-4 py-3 lg:hidden animate-slide-up">
            <SearchBar className="w-full" onNavigate={closeMobileSearch} />
          </div>
        )}

        {/* Menu mobile */}
        {isMenuOpen && (
          <nav
            className="border-t border-border bg-background px-4 py-4 lg:hidden animate-slide-up"
            aria-label="Navigation mobile"
          >
            <div className="flex flex-col gap-2">
              {/* s20 : recherche dans le menu sous 440 px (plus d'icône dans la barre). */}
              <div className="mb-2 min-[440px]:hidden">
                <SearchBar className="w-full" onNavigate={() => setIsMenuOpen(false)} />
              </div>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                    isActivePath(pathname, item.href)
                      ? "bg-background-elevated text-accent-link"
                      : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {isAuthenticated ? (
                <>
                  {!isPremium && (
                    <Link
                      href={activateHref}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(buttonVariants({ variant: "primary", size: "sm" }), "w-full")}
                    >
                      Activer mon accès
                    </Link>
                  )}
                  <Link
                    href="/favoris"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start gap-2")}
                  >
                    <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Favoris
                  </Link>
                  <Link
                    href="/profil"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start gap-2")}
                  >
                    <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mon profil
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: "/" }); }}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href={registerHref}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(buttonVariants({ variant: "primary", size: "sm" }), "w-full")}
                  >
                    Commencer
                  </Link>
                  <Link
                    href={loginHref}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full")}
                  >
                    Connexion
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
