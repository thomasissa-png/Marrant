"use client";

import Link from "next/link";
import { frTypo } from "@/lib/fr-typo";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { chipClass } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { buildRegisterUrl } from "@/lib/auth-links";

/** Pastilles du hero : libellés existants, chacune mène au parcours qu'elle nomme (T02).
 *  Ordre aligné sur le reste du site, le plus court d'abord (audit forme s14 P2-4, tranché par Thomas). */
const HERO_PARCOURS_LINKS = [
  { label: "Briller à la machine à café", href: "/parcours/machine-a-cafe" },
  { label: "Avoir de la répartie", href: "/parcours/repartie" },
  { label: "Reprendre confiance en toi", href: "/parcours/confiance" },
] as const;

const HERO_EXTRA_TAGS = ["Un petit exercice par jour", "Vannes prêtes à ressortir"] as const;

export function HeroSection() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

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
        1&nbsp;500+ membres bossent leur humour. Rejoins-les.
      </p>

      {/* CTA : connectés vers le catalogue ; anonymes vers l'abonnement (étape 1
          sur 2 : le compte, puis le paiement), lecture libre visible dessous (T03) */}
      {isAuthenticated ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/vannes"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
          >
            Explorer les vannes
          </Link>
          <Link
            href="/conseils"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
          >
            Voir les conseils
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-1">
          {/* Étalon 1.2 validé par Thomas (s15) : le parcours d'abord, le prix en note */}
          <Link
            href={buildRegisterUrl({ src: "accueil-hero" })}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
          >
            Accéder aux parcours complets
          </Link>
          <p className="max-w-md text-balance text-sm text-text-muted">
            2,99 €/mois, sans engagement. La première étape de chaque parcours reste en lecture libre.
          </p>
          <Link
            href="/vannes"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary hover:decoration-current"
          >
            Voir les vannes gratuites
          </Link>
        </div>
      )}

      {/* Situations concrètes : 3 liens-pastilles (bordé = cliquable), sous le CTA (spec UX §2.8) */}
      <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {HERO_PARCOURS_LINKS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={chipClass()}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Atouts : texte informatif, NON cliquable (ni fond ni bordure), masqué en mobile : arbitrage Thomas s12, forme audit s14 P0-1 */}
      <ul className="mx-auto mt-4 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted sm:flex">
        {HERO_EXTRA_TAGS.map((label) => (
          <li key={label} className="flex items-center gap-2">
            <span className="text-success" aria-hidden="true">✓</span>
            {label}
          </li>
        ))}
      </ul>

    </section>
  );
}
