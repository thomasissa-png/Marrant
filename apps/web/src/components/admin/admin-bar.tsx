"use client";

/**
 * Barre du backoffice (s21) : remplace l'en-tête public sur /admin et /admin/ceo.
 * Aucun bouton d'achat. « Déconnexion » efface la session admin (sessionStorage,
 * mêmes clés que la connexion) et recharge /admin.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ADMIN_PASS_KEY } from "@/hooks/use-admin-fetch";

export function AdminBar() {
  const [connecte, setConnecte] = useState(false);

  useEffect(() => {
    const lire = () => setConnecte(Boolean(sessionStorage.getItem(ADMIN_PASS_KEY)));
    lire();
    window.addEventListener("admin-session", lire);
    return () => window.removeEventListener("admin-session", lire);
  }, []);

  const deconnecter = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem(ADMIN_PASS_KEY);
    window.location.assign("/admin");
  };

  return (
    <header className="border-b border-border bg-background-card">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/admin" className="min-w-0 truncate font-display text-base font-bold text-text-primary">
          Backoffice <span className="hidden font-normal text-text-muted sm:inline">· deviens-marrant.fr</span>
        </Link>
        <nav className="ml-auto flex shrink-0 items-center gap-2" aria-label="Backoffice">
          <a href="/" className="rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-background-elevated hover:text-text-primary">
            Voir le site
          </a>
          {connecte && (
            <button
              type="button"
              onClick={deconnecter}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-background-elevated"
            >
              Déconnexion
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
