"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PremiumCta() {
  const { status } = useSession();
  const user = useUserStore((s) => s.user);

  // Ne pas afficher si déjà premium
  if (user?.plan === "PREMIUM") return null;

  return (
    <section className="py-12">
      <div className="relative overflow-hidden rounded-2xl border border-accent-primary/30 bg-gradient-to-br from-accent-secondary/10 via-background-card to-accent-primary/10 p-8 md:p-12">
        {/* Effet de glow décoratif */}
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent-secondary/5 blur-3xl" />

        <div className="relative">
          <Badge variant="premium" className="mb-4">
            Premium
          </Badge>
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            Passe au niveau supérieur
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-text-secondary">
            Coaching IA illimité, parcours exclusifs, blagues premium et progression
            accélérée — tout ce qu&apos;il faut pour devenir vraiment drôle.
          </p>

          {/* Comparaison Free vs Premium */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Gratuit */}
            <div className="rounded-xl border border-border bg-background-card/50 p-6">
              <h3 className="text-lg font-semibold text-text-primary">Gratuit</h3>
              <p className="mt-1 text-2xl font-bold text-text-primary">0 €</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> 50 blagues par mois
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> 10 conseils
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Vidéos stand-up
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-text-muted">✗</span>
                  <span className="text-text-muted">Coaching IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-text-muted">✗</span>
                  <span className="text-text-muted">Parcours premium</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="rounded-xl border-2 border-accent-primary bg-background-card p-6 shadow-lg shadow-accent-primary/10">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-text-primary">Premium</h3>
                <Badge variant="primary">Populaire</Badge>
              </div>
              <p className="mt-1">
                <span className="text-2xl font-bold text-text-primary">9,99 €</span>
                <span className="text-text-muted"> / mois</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Blagues illimitées
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Tous les conseils + exercices
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Coaching IA personnalisé
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Parcours premium exclusifs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span> Progression XP x2
                </li>
              </ul>
              <Link href={status === "authenticated" ? "/profil" : "/register"} className="mt-6 block">
                <Button variant="primary" size="lg" className="w-full">
                  {status === "authenticated" ? "Passer à Premium" : "Créer un compte gratuit"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-center text-sm text-text-muted">
            Rejoins les utilisateurs qui progressent chaque jour en humour et en répartie
          </p>
        </div>
      </div>
    </section>
  );
}
