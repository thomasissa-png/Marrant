"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/blagues", label: "Blagues" },
  { href: "/conseils", label: "Conseils" },
  { href: "/videos", label: "Vidéos" },
  { href: "/parcours", label: "Parcours" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const openLogin = () => {
    setAuthModalTab("login");
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const openRegister = () => {
    setAuthModalTab("register");
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

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

          <SearchBar className="hidden w-64 md:block" />

          {/* Actions desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link href="/favoris">
                  <Button variant="ghost" size="sm">
                    Favoris
                  </Button>
                </Link>
                <Link href="/profil">
                  <Button variant="ghost" size="sm">
                    {session?.user?.name ?? "Profil"}
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
              <>
                <Button variant="ghost" size="sm" onClick={openLogin}>
                  Connexion
                </Button>
                <Button variant="primary" size="sm" onClick={openRegister}>
                  Commencer
                </Button>
              </>
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
            <SearchBar className="w-full" />
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
                    <Button variant="ghost" size="sm" className="w-full">Favoris</Button>
                  </Link>
                  <Link href="/profil" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">Profil</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: "/" }); }}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" onClick={openLogin}>
                    Connexion
                  </Button>
                  <Button variant="primary" size="sm" className="w-full" onClick={openRegister}>
                    Commencer
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Auth modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
