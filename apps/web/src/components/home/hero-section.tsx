"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <section className="py-12 text-center md:py-20">
      <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
        Deviens la personne{" "}
        <span className="text-gradient">drôle</span>
        {" "}du groupe.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary md:text-xl">
        Tu restes muet quand on te chambre ? Tu galères à faire rire à la machine
        à café ? Tu voudrais retrouver ta légèreté ? On a les vannes, les
        techniques et les exercices. Toi, tu ramènes ta motivation.
      </p>

      {/* Social proof */}
      <p className="mt-6 text-sm font-medium text-accent-primary">
        Rejoins 1 500+ membres qui progressent en humour chaque jour
      </p>

      {/* Social links */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <a
          href="https://x.com/deviensmarrant"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Suivre sur Twitter / X"
          className="flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-primary"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @deviensmarrant
        </a>
        <a
          href="https://www.linkedin.com/company/deviens-marrant"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Suivre sur LinkedIn"
          className="flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-primary"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>
      </div>

      {/* Situations concrètes = les 3 personas se reconnaissent */}
      <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-3">
        <span className="rounded-full bg-background-elevated px-3 py-1 text-sm text-text-secondary">
          Avoir de la répartie
        </span>
        <span className="rounded-full bg-background-elevated px-3 py-1 text-sm text-text-secondary">
          Briller à la machine à café
        </span>
        <span className="rounded-full bg-background-elevated px-3 py-1 text-sm text-text-secondary">
          Retrouver confiance en soi
        </span>
        <span className="rounded-full bg-background-elevated px-3 py-1 text-sm text-text-secondary">
          Progresser chaque jour
        </span>
        <span className="rounded-full bg-background-elevated px-3 py-1 text-sm text-text-secondary">
          Vannes prêtes à ressortir
        </span>
      </div>

      {/* CTA only for authenticated users — non-auth CTA is below feature cards */}
      {isAuthenticated ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/vannes">
            <Button variant="primary" size="lg">
              Explorer les vannes
            </Button>
          </Link>
          <Link href="/conseils">
            <Button variant="outline" size="lg">
              Voir les conseils
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-2">
          <Link href="/register">
            <Button variant="primary" size="lg">
              Commencer à 0,99 €/mois
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
