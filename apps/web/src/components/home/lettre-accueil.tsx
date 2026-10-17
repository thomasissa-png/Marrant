"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LETTRE_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { isPremiumPlan } from "@/lib/parcours-access";

/**
 * Accueil : la lettre en lien discret (intégration s21, `docs/copy/lettre-mensuelle-s21/place-sur-le-site.md`
 * §3), entre l'offre Premium (+ FAQ) et « Prochainement ». Pas de formulaire (l'inscription
 * se fait sur /lettre), pas de fond, pas de carte, pas de bouton : le bouton Premium reste
 * la seule action principale de la page. Masqué si l'interrupteur des inscriptions est
 * fermé ou pour un abonné Premium connecté (comme le formulaire de la lettre).
 * Ni `data-blog-cta` ni attribut de la mesure du lot 1.
 */
export function LettreAccueil() {
  const { data: session, status } = useSession();
  const plan = (session?.user as { plan?: string } | undefined)?.plan;
  if (!LETTRE_INSCRIPTIONS_OUVERTES) return null;
  if (status === "authenticated" && isPremiumPlan(plan)) return null;

  const t = TEXTES_LETTRE.accueil;
  return (
    <section aria-labelledby="lettre-accueil" className="border-t border-border py-8 md:py-10">
      <div className="mx-auto max-w-xl text-center">
        <h2 id="lettre-accueil" className="font-display text-xl font-bold md:text-2xl">
          {t.titre}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">{t.phrase}</p>
        <Link
          href="/lettre"
          className="mt-2 inline-flex min-h-[44px] items-center rounded-lg text-sm font-medium text-accent-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          <span>
            {t.lien} <span aria-hidden="true">→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
