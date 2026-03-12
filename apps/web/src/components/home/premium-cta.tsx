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
    <section className="py-12" id="offres">
      <div className="text-center">
        <Badge variant="primary" className="mb-4">
          Offre de lancement exclusive
        </Badge>
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          Choisis ta formule
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-text-secondary">
          Que tu sois lycéen, jeune actif ou en pleine reconstruction — on a
          ce qu&apos;il te faut pour devenir vraiment drôle.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {/* Offre 1 — Accès complet */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-accent-primary bg-background-card p-8 shadow-lg shadow-accent-primary/10">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-primary/5 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-text-primary">Accès complet</h3>
              <Badge variant="primary">Populaire</Badge>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-text-primary">0,99 €</span>
              <span className="text-text-muted">/ mois</span>
            </div>
            <p className="mt-1 text-sm text-accent-primary font-medium">
              Au lieu de 9,99 € — offre de lancement
            </p>

            <ul className="mt-6 space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Toutes les blagues</strong> — 500+ classées par catégorie</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Tous les conseils</strong> + exemples concrets + exercices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Vidéos stand-up</strong> analysées avec les techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Contenu du jour</strong> — blague + conseil + vidéo quotidiens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Nouveaux contenus chaque semaine</strong> générés par IA</span>
              </li>
            </ul>

            <Link
              href={status === "authenticated" ? "/profil" : "/register"}
              className="mt-8 block"
            >
              <Button variant="primary" size="lg" className="w-full">
                {status === "authenticated"
                  ? "Passer à l'offre complète"
                  : "Commencer — 0,99 €/mois"}
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-text-muted">
              Sans engagement — annule en 1 clic
            </p>
          </div>
        </div>

        {/* Offre 2 — Appel coaching */}
        <div className="rounded-2xl border border-border bg-background-card p-8">
          <h3 className="text-lg font-semibold text-text-primary">Coaching individuel</h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-text-primary">99 €</span>
            <span className="text-text-muted">/ séance</span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            Un appel de 45 min avec un coach humour
          </p>

          <ul className="mt-6 space-y-3 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span><strong>Appel individuel 45 min</strong> en visio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span><strong>Diagnostic personnalisé</strong> de tes points forts / faiblesses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span><strong>Plan d&apos;action sur mesure</strong> adapté à ta situation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span><strong>Exercices ciblés</strong> pour progresser rapidement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span><strong>Suivi post-appel</strong> par email pendant 1 semaine</span>
            </li>
          </ul>

          <a
            href="https://cal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block"
          >
            <Button variant="outline" size="lg" className="w-full">
              Réserver un appel — 99 €
            </Button>
          </a>
          <p className="mt-3 text-center text-xs text-text-muted">
            Idéal si tu veux progresser vite avec un accompagnement humain
          </p>
        </div>
      </div>

      {/* Social proof */}
      <p className="mt-8 text-center text-sm text-text-muted">
        Rejoins les premiers membres qui progressent en humour chaque jour
      </p>
    </section>
  );
}
