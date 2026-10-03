"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { PremiumBenefits } from "@/components/premium/premium-benefits";
import { FaqSection } from "@/components/home/faq-section";
import { AuthModal } from "@/components/auth/auth-modal";

export function PremiumCta() {
  const { status } = useSession();
  const user = useUserStore((s) => s.user);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        toast("Le paiement n'a pas pu démarrer. Réessaie dans un instant.", "error");
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
    <section className="py-12 md:py-16" id="offres">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          Deux façons de t&apos;y mettre
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-text-secondary">
          Étudiant, jeune actif ou en train de tourner une page : tu trouves
          ici de quoi devenir drôle pour de bon, pas seulement le temps d&apos;un apéro.
        </p>
      </div>


      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-6">
        {/* Offre 1 — Accès complet */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-accent-primary bg-background-card p-8 shadow-lg shadow-accent-primary/10">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-primary/5 blur-3xl" />
          <div className="relative">
            {/* Badge « Populaire » retiré : offre payante unique (reco validée par Thomas) */}
            <h3 className="text-lg font-semibold text-text-primary">Accès complet</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-text-primary">2,99 €</span>
              <span className="text-text-muted">/ mois</span>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Sans engagement, annulable &agrave; tout moment &middot;{" "}
              <Link href="/retractation" className="underline hover:text-text-secondary">
                Droit de r&eacute;tractation
              </Link>
            </p>

            <PremiumBenefits className="mt-6 space-y-3" />

            {status === "authenticated" ? (
              <Button
                variant="primary"
                size="lg"
                className="mt-8 w-full"
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "On t'emmène au paiement…" : "Passer à l'offre complète"}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="mt-8 w-full"
                onClick={() => setShowAuth(true)}
              >
                Commencer à 2,99 €/mois
              </Button>
            )}
            {/* Social proof — chiffre fixe validé fondateur 29/09/2026 ; remonté sous le CTA (T09) */}
            <p className="mt-3 text-center text-sm text-text-secondary">
              Déjà 1&nbsp;500+ inscrits, et toi&nbsp;?
            </p>
          </div>
        </div>

        {/* Offre 2 — Appel coaching : repliée par défaut pour ne pas brouiller l'offre à 2,99 € (T08) */}
        <details className="group rounded-2xl border border-border bg-background-card">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 p-6 sm:px-8 [&::-webkit-details-marker]:hidden">
            <h3 className="min-w-0 text-lg font-semibold text-text-primary">Coaching individuel</h3>
            <span className="flex shrink-0 items-center gap-2 whitespace-nowrap text-text-muted">
              <span className="text-lg font-bold text-text-primary">99&nbsp;€</span>
              <span className="text-sm">/ séance</span>
              <svg className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </summary>
          <div className="px-6 pb-8 sm:px-8">
          <p className="text-sm text-text-secondary">
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
              <svg className="ml-2 h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Button>
          </a>
          <p className="mt-3 text-center text-xs text-text-muted">
            Pour toi si tu préfères qu&apos;on regarde ensemble, en direct, ce qui coince
          </p>
          </div>
        </details>
      </div>


      {/* FAQ */}
      <div className="mt-16">
        <FaqSection />
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab="register"
        // CTA payant : après inscription, direction /abonnement (pas le quiz
        // d'onboarding gratuit), voir getPostSignupRedirect (audit tunnel F1).
        callbackUrl="/abonnement"
      />
    </section>
  );
}
