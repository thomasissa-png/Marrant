"use client";

import { useSession } from "next-auth/react";
import { LettreInscription } from "@/components/lettre/lettre-inscription";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { isPremiumPlan } from "@/lib/parcours-access";
import { TitreDisplay } from "@/components/ui/titre-display";

/**
 * En-tête et formulaire de `/lettre`. Revue s21 m4 : un abonné Premium connecté ne
 * voit pas le formulaire (il reçoit la lettre hebdomadaire), donc pas non plus le
 * titre et la phrase qui l'annoncent (plus d'impasse). Même règle et même source
 * (session) que `LettreInscription`.
 */
export function LettrePageInscription({ ignorerDrapeau = false }: { ignorerDrapeau?: boolean }) {
  const { data: session, status } = useSession();
  const plan = (session?.user as { plan?: string } | undefined)?.plan;
  if (status === "authenticated" && isPremiumPlan(plan)) return null;

  return (
    <>
      <header>
        {/* Revue design s21 m7 : lignes équilibrées, 2 lignes à 375 px. */}
        <TitreDisplay
          as="h1"
          id="lettre-titre-page"
          texte={TEXTES_LETTRE.titre}
          className="text-balance font-display text-2xl font-bold text-text-primary sm:text-3xl"
        />
        <p className="mt-2 text-text-secondary">{TEXTES_LETTRE.phrase}</p>
      </header>
      <LettreInscription emplacement="page" titreId="lettre-titre-page" ignorerDrapeau={ignorerDrapeau} />
    </>
  );
}
