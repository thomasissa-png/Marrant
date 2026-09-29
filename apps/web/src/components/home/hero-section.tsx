"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";

export function HeroSection() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [showAuth, setShowAuth] = useState(false);

  return (
    <section className="py-12 text-center md:py-20">
      {/* Une phrase par ligne (demande fondateur : 2 lignes). Taille mobile calée
          pour que « Tu parles et personne rit. » tienne sur 358 px (passe s12, T01). */}
      <h1 className="font-display text-[1.75rem] font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="block">
          Tu parles et <span className="whitespace-nowrap text-gradient">personne rit</span>.
        </span>
        <span className="block">On va arranger ça.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary md:text-xl">
        Tu restes muet quand on te chambre ? Tu galères à faire rire à la machine
        à café ? Tu voudrais retrouver ta légèreté ? On a les vannes, les
        techniques et les exercices. Toi, tu ramènes ta motivation.
      </p>

      {/* Social proof — chiffre fixe validé fondateur 29/09/2026 */}
      <p className="mt-6 text-sm font-medium text-accent-primary">
        Rejoins 1&nbsp;500+ membres qui progressent en humour chaque jour
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
          Reprendre confiance en toi
        </span>
        <span className="rounded-full bg-background-elevated px-3 py-1 text-sm text-text-secondary">
          Un petit exercice par jour
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
          <Button variant="primary" size="lg" onClick={() => setShowAuth(true)}>
            Commencer à 0,99 €/mois
          </Button>
        </div>
      )}

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab="register"
      />
    </section>
  );
}
