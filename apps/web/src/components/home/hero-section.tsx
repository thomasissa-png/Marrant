"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <section className="py-12 text-center md:py-20">
      <Badge variant="primary" className="mb-4">
        Offre de lancement — 0,99 €/mois au lieu de 9,99 €
      </Badge>
      <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
        Deviens la personne{" "}
        <span className="text-gradient">drôle</span>
        {" "}du groupe.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary md:text-xl">
        Tu restes muet quand on te chambre ? Tu galères à faire rire à la machine
        à café ? Tu voudrais retrouver ta légèreté ? Des blagues, des techniques
        de répartie et des conseils de pros — tout pour progresser en humour,
        à ton rythme.
      </p>

      {/* Situations concrètes = les 3 personas se reconnaissent */}
      <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3">
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
          Blagues prêtes à ressortir
        </span>
      </div>

      {/* CTA only for authenticated users — non-auth CTA is below feature cards */}
      {isAuthenticated && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/blagues">
            <Button variant="primary" size="lg">
              Explorer les blagues
            </Button>
          </Link>
          <Link href="/conseils">
            <Button variant="outline" size="lg">
              Voir les conseils
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
