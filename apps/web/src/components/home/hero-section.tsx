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
        à café ? Tu voudrais retrouver ta légèreté ? Des vannes, des techniques
        de répartie et des conseils de pros pour progresser en humour,
        à ton rythme.
      </p>

      {/* Social proof */}
      <p className="mt-6 text-sm font-medium text-accent-primary">
        Rejoins 1 500+ membres qui progressent en humour chaque jour
      </p>

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
          Gagner des XP et maintenir ton streak
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
