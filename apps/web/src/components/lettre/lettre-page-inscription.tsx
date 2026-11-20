"use client";

import { useSession } from "next-auth/react";
import { LettreInscription } from "@/components/lettre/lettre-inscription";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { isPremiumPlan } from "@/lib/parcours-access";
import { TitreDisplay } from "@/components/ui/titre-display";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { Bandeau, PastillesDa } from "@/components/espace/da-espace";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { ECHELLE_CARTES_PARTAGEES, TEXTE, TITRE_PAGE } from "@/components/espace/typo";
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
  // s26 (`docs/design/questions-repliques-lettre-profil-s26.md` §6.1) : titre BLANC à gauche (même texte, même `id`),
  // échelle `typo.ts`, carte neutre (plus de filet violet : le bouton plein reste le seul aplat).
  if (ESPACE_CLIENT_PUBLIE) {
    return (
      <>
        <header>
          <TitreDisplay as="h1" id="lettre-titre-page" texte={TEXTES_LETTRE.titre} className={TITRE_PAGE} />
          <p className={cn("mt-2 max-w-xl", TEXTE)}>{lierComposes(TEXTES_LETTRE.phrase)}</p>
        </header>
        {/* s26 contrôle d'ensemble, aperçus (DA de l'accueil, ouvert seulement) : bandeau violet et pastille « La lettre ». */}
        <div className={`${CADRE_CARTE_NEUTRE} mt-6 p-6 ${ECHELLE_CARTES_PARTAGEES}`} data-lettre-carte="">
          <Bandeau />
          <PastillesDa className="mb-4" pastille={TEXTES_LETTRE.menu} />
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
