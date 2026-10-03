"use client";

import Link from "next/link";
import { useState } from "react";
import { frTypo } from "@/lib/fr-typo";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";

/** Pastilles du hero : libellés existants, chacune mène au parcours qu'elle nomme (T02). */
const HERO_PARCOURS_LINKS = [
  { label: "Avoir de la répartie", href: "/parcours/repartie" },
  { label: "Briller à la machine à café", href: "/parcours/machine-a-cafe" },
  { label: "Reprendre confiance en toi", href: "/parcours/confiance" },
] as const;

const HERO_EXTRA_TAGS = ["Un petit exercice par jour", "Vannes prêtes à ressortir"] as const;

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
        {frTypo(
          "Tu restes muet quand on te chambre ? Tu galères à faire rire à la machine à café ? Tu voudrais retrouver ta légèreté ? On a les vannes, les techniques et les exercices. Toi, tu ramènes ta motivation.",
        )}
      </p>

      {/* Social proof — chiffre fixe validé fondateur 29/09/2026 */}
      <p className="mt-6 text-sm font-medium text-accent-link">
        Rejoins celles et ceux qui progressent en humour chaque jour
      </p>

      {/* CTA : connectés vers le catalogue ; anonymes vers l'inscription,
          avec le chemin gratuit visible juste dessous (T03) */}
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
        <div className="mt-8 flex flex-col items-center gap-1">
          {/* Le bouton ouvre l'inscription gratuite : libellé aligné (reco T03 validée par Thomas) */}
          <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={() => setShowAuth(true)}>
            Créer mon compte gratuit
          </Button>
          <p className="text-sm text-text-muted">Puis 2,99 €/mois pour tout débloquer, sans engagement</p>
          <Link
            href="/vannes"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary hover:decoration-current"
          >
            Voir les vannes gratuites
          </Link>
        </div>
      )}

      {/* Situations concrètes = les 3 personas se reconnaissent, sous le CTA (spec UX §2.8) */}
      <ul className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-3">
        {HERO_PARCOURS_LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-background-elevated px-4 text-sm text-text-secondary transition-colors hover:border-accent-primary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              {item.label}
            </Link>
          </li>
        ))}
        {/* Pastilles descriptives (non cliquables), masquées en mobile : arbitrage Thomas s12 */}
        {HERO_EXTRA_TAGS.map((label) => (
          <li key={label} className="hidden sm:inline-block">
            <span className="inline-block rounded-full bg-transparent px-3 py-1 text-sm text-text-muted">
              {label}
            </span>
          </li>
        ))}
      </ul>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab="register"
      />
    </section>
  );
}
