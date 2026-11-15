"use client";

import { useSession } from "next-auth/react";
import { LettreInscription } from "@/components/lettre/lettre-inscription";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { isPremiumPlan } from "@/lib/parcours-access";
import { TitreDisplay } from "@/components/ui/titre-display";
import { CARTE_A_FILET, FiletCarte } from "@/components/ui/card";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { lierComposes } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

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

  // v6 tour 1, point 10 (interrupteur ouvert) : titre centré comme les sections de l'accueil, formulaire dans la
  // carte à filet de l'accueil, « Envoie-moi la lettre » en plein (seule action de la page). Fermé : inchangé.
  if (ESPACE_CLIENT_PUBLIE) {
    return (
      <>
        <header className="mx-auto max-w-2xl text-center">
          <TitreDisplay
            as="h1"
            id="lettre-titre-page"
            texte={TEXTES_LETTRE.titre}
            className="text-balance font-display text-2xl font-bold text-text-primary sm:text-3xl"
          />
          <p className="mt-2 text-text-secondary">{lierComposes(TEXTES_LETTRE.phrase)}</p>
        </header>
        <div className={cn("border border-border bg-background-card p-6 md:p-8", CARTE_A_FILET)} data-lettre-carte="">
          <FiletCarte />
          <LettreInscription emplacement="page" titreId="lettre-titre-page" ignorerDrapeau={ignorerDrapeau} plein />
        </div>
      </>
    );
  }

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
        <p className="mt-2 text-text-secondary">{lierComposes(TEXTES_LETTRE.phrase)}</p>
      </header>
      <LettreInscription emplacement="page" titreId="lettre-titre-page" ignorerDrapeau={ignorerDrapeau} />
    </>
  );
}
