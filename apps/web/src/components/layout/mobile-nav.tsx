"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { IconeFavoris, IconeProfil } from "@/components/layout/header-icons";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string };

/** Onglet actif : page exacte, ou sous-page (ex. /blog/<slug> garde « Articles » actif). */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

interface MobileNavProps {
  items: NavItem[];
  pathname: string | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  hrefs: { activate: string; register: string; login: string };
  onClose: () => void;
}

/**
 * Menu déroulant sous 1024 px : liste à plat (onglets, puis actions de compte).
 * Revue design s21 M1 : hauteur maximale = écran moins la barre (4rem et sa bordure), défilement
 * interne (l'en-tête est `sticky`, la page ne défile pas pour lui), marge basse
 * au-dessus de la barre d'accueil de l'iPhone. Testé à 375 x 550.
 */
export function MobileNav({ items, pathname, isAuthenticated, isPremium, hrefs, onClose }: MobileNavProps) {
  const secondaire = cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start gap-2");
  return (
    <nav
      className="max-h-[calc(100dvh-4rem-1px)] overflow-y-auto overscroll-contain border-t border-border bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 lg:hidden animate-slide-up"
      aria-label="Navigation mobile"
    >
      <div className="flex flex-col gap-2">
        {/* s20 : recherche dans le menu sous 440 px (plus d'icône dans la barre). */}
        <div className="mb-2 min-[440px]:hidden">
          <SearchBar className="w-full" onNavigate={onClose} />
        </div>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
              isActivePath(pathname, item.href)
                ? "bg-background-elevated text-accent-link"
                : "text-text-secondary hover:bg-background-elevated hover:text-text-primary",
            )}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        <hr className="my-2 border-border" />
        {isAuthenticated ? (
          <>
            {!isPremium && (
              <Link href={hrefs.activate} onClick={onClose} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "w-full")}>
                Activer mon accès
              </Link>
            )}
            <Link href="/favoris" onClick={onClose} className={secondaire}>
              <IconeFavoris className="h-4 w-4" />
              Favoris
            </Link>
            <Link href="/profil" onClick={onClose} className={secondaire}>
              <IconeProfil className="h-4 w-4" />
              Mon profil
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/" });
              }}
            >
              Déconnexion
            </Button>
          </>
        ) : (
          <>
            <Link href={hrefs.register} onClick={onClose} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "w-full")}>
              Commencer
            </Link>
            <Link href={hrefs.login} onClick={onClose} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full")}>
              Connexion
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
