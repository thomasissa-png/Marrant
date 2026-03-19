"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/vannes", label: "Vannes" },
  { href: "/conseils", label: "Conseils" },
  { href: "/videos", label: "Vidéos" },
  { href: "/parcours", label: "Parcours" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Close mobile search/menu on route change
  useEffect(() => {
    setIsMobileSearchOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  const openRegister = () => {
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeMobileSearch = () => setIsMobileSearchOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-gradient">
              deviens-marrant.fr
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                  pathname === item.href
                    ? "bg-background-elevated text-accent-primary"
                    : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <SearchBar className="hidden w-64 md:block" onNavigate={closeMobileSearch} />

          {/* Actions desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link href="/favoris" aria-label="Favoris" title="Favoris">
                  <Button variant="ghost" size="sm" aria-label="Favoris">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/profil" aria-label="Mon profil" title="Mon profil">
                  <Button variant="ghost" size="sm" aria-label="Mon profil">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Button>
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
              <Button variant="primary" size="sm" onClick={openRegister}>
                Commencer
              </Button>
            )}
          </div>

          {/* Actions mobile */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Bouton recherche mobile */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              onClick={() => { setIsMobileSearchOpen(!isMobileSearchOpen); setIsMenuOpen(false); }}
              aria-label="Rechercher"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Menu burger mobile */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
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
          <div className="border-t border-border bg-background px-4 py-3 md:hidden animate-slide-up">
            <SearchBar className="w-full" onNavigate={closeMobileSearch} />
          </div>
        )}

        {/* Menu mobile */}
        {isMenuOpen && (
          <nav
            className="border-t border-border bg-background px-4 py-4 md:hidden animate-slide-up"
            aria-label="Navigation mobile"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
                    pathname === item.href
                      ? "bg-background-elevated text-accent-primary"
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
                  <Link href="/favoris" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Favoris
                    </Button>
                  </Link>
                  <Link href="/profil" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon profil
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: "/" }); }}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="sm" className="w-full" onClick={openRegister}>
                  Commencer
                </Button>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Auth modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="register"
        callbackUrl={pathname}
      />
    </>
  );
}
