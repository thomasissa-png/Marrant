"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeCta() {
  const { status } = useSession();

  if (status === "authenticated") return null;

  return (
    <section className="py-8 text-center">
      <div className="mx-auto max-w-xl rounded-2xl border border-accent-primary/20 bg-accent-primary/5 p-8">
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Prêt à devenir plus drôle ?
        </h2>
        <p className="mt-2 text-text-secondary">
          500+ blagues, 50+ conseils de pros et 30+ vidéos analysées — tout ça pour moins d&apos;un café par mois.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register">
            <Button variant="primary" size="lg">
              Commencer — 0,99 €/mois
            </Button>
          </Link>
          <Link href="/blagues">
            <Button variant="outline" size="lg">
              Voir les blagues gratuites
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-sm text-text-muted">
          Sans engagement — annule en 1 clic — satisfait ou remboursé
        </p>
      </div>
    </section>
  );
}
