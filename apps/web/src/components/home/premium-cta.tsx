"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { useContentStats } from "@/hooks/use-content-stats";
import { FaqSection } from "@/components/home/faq-section";

export function PremiumCta() {
  const { status } = useSession();
  const user = useUserStore((s) => s.user);
  const stats = useContentStats();

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        toast("Erreur lors de la création du paiement", "error");
      }
    } catch {
      toast("Connexion perdue, réessaie", "error");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Ne pas afficher si déjà premium
  if (user?.plan === "PREMIUM") return null;

  return (
    <section className="py-12" id="offres">
      <div className="text-center">
        <Badge variant="primary" className="mb-4">
          Prix de lancement · Profites-en tant que c&apos;est dispo
        </Badge>
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          Choisis ta formule
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-text-secondary">
          Que tu sois étudiant, jeune actif ou en pleine reconstruction, on a
          ce qu&apos;il te faut pour devenir vraiment drôle.
        </p>
      </div>

      {/* Ce que tu obtiens */}
      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-border bg-background-card p-6">
        <h3 className="mb-4 text-center font-semibold text-text-primary">
          Tout est inclus pour 0,99 &euro;/mois
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">&#10003;</span>
            <span><strong>Toutes les vannes</strong> class&eacute;es par cat&eacute;gorie</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">&#10003;</span>
            <span><strong>Tous les conseils</strong> + exemples + exercices</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">&#10003;</span>
            <span><strong>Toutes les vid&eacute;os</strong> stand-up analys&eacute;es</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">&#10003;</span>
            <span><strong>Parcours structur&eacute;s</strong> de progression</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">&#10003;</span>
            <span><strong>Favoris illimit&eacute;s</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-success">&#10003;</span>
            <span><strong>Contenu quotidien</strong> renouvel&eacute;</span>
          </li>
        </ul>
      </div>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-text-muted">
        Sans engagement &middot; Annulable &agrave; tout moment
      </p>

      <div className="mt-10 flex flex-col gap-6 max-w-xl mx-auto">
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
              Prix de lancement, ce tarif ne durera pas
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Sans engagement, annulable &agrave; tout moment &middot;{" "}
              <Link href="/retractation" className="underline hover:text-text-secondary">
                Droit de r&eacute;tractation
              </Link>
            </p>

            <ul className="mt-6 space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Toutes les vannes</strong> : {stats.jokes > 0 ? `${stats.jokes}+` : "des centaines"} classées par catégorie (au lieu de 10)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Tous les conseils</strong> : {stats.tips > 0 ? `${stats.tips}+` : "des dizaines"} + exemples concrets + exercices (au lieu de 3)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Toutes les vidéos stand-up</strong> : {stats.videos > 0 ? `${stats.videos}+` : "des dizaines"} analysées avec les techniques (au lieu de 3)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Contenu du jour</strong> : vanne + conseil + vidéo quotidiens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Nouveaux contenus chaque semaine</strong> générés par IA</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-success">✓</span>
                <span><strong>Streaks et XP</strong> : suis ta progression jour après jour</span>
              </li>
            </ul>

            {status === "authenticated" ? (
              <Button
                variant="primary"
                size="lg"
                className="mt-8 w-full"
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "Redirection..." : "Passer à l'offre complète"}
              </Button>
            ) : (
              <Link href="/register" className="mt-8 block">
                <Button variant="primary" size="lg" className="w-full">
                  Commencer à 0,99 €/mois
                </Button>
              </Link>
            )}
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
            Un appel de 45 min avec un professionnel de l&apos;humour
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
            href="https://calendly.com/contact-deviens-marrant/45min"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block"
          >
            <Button variant="outline" size="lg" className="w-full">
              Réserver un appel · 99 €
            </Button>
          </a>
          <p className="mt-3 text-center text-xs text-text-muted">
            Idéal si tu veux progresser vite avec un accompagnement humain
          </p>
        </div>
      </div>

      {/* Social proof */}
      <p className="mt-8 text-center text-sm text-text-muted">
        Déjà 1 500+ inscrits — et toi ?
      </p>

      {/* FAQ */}
      <div className="mt-16">
        <FaqSection />
      </div>
    </section>
  );
}
