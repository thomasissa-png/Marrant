"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { LienRetour } from "@/components/espace/lien-retour";
import { RailFils } from "@/components/espace/questions/rail-fils";
import { CELLULE_LISTE_COLLANTE, GRILLE_LISTE_DETAIL } from "@/components/espace/liste-detail/styles";
import { TITRE_PAGE } from "@/components/espace/typo";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

const Q = frEspaceProfond(TEXTES_QUESTIONS);

/**
 * s26 contrôle d'ensemble, abonné (C6) : Mes questions au modèle liste et détail de Quoi répondre, posé par le layout de
 * `/mon-espace/questions`, il reste MONTÉ d'une adresse à l'autre. En-tête (H1 « Mes questions », ou le type du fil
 * ouvert avec « Retour : Mes questions » sous 1024), puis, dès 1024, la liste des fils collante à gauche (`RailFils`,
 * ligne du fil ouvert active) et à droite la page : « Écrire à l'équipe » (et la réponse non lue) sur la liste, le fil
 * sur son adresse. Sous 1024 : la page liste (formulaire et « Mes envois ») OU le fil plein écran, comme avant.
 * Fil absent de la liste (retiré, autre compte) : titre « Mes questions », la page dit le reste (retrait ou 404).
 */
export function QuestionsListeDetail({ fils, children }: { fils: readonly FilListe[]; children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const id = segments[0];
  const fil = id === undefined ? null : (fils.find((f) => f.id === id) ?? null);
  if (segments.length > 1) return <>{children}</>;
  const liste = fils.length > 0;
  return (
    <div className="pb-16" data-questions={id === undefined ? "liste" : "fil"}>
      <header>
        {id !== undefined && (
          <div className="lg:hidden">
            <LienRetour href="/mon-espace/questions" label={Q.titre} />
          </div>
        )}
        <h1 className={TITRE_PAGE}>{fil ? Q.types[fil.type].nom : Q.titre}</h1>
      </header>
      {/* Aucun fil : pas de liste à gauche, la page d'avant sur toute la largeur (état vide de « Mes envois » à droite du
          formulaire) ; même arbre, seules les classes changent (le premier envoi ne remonte rien). */}
      <div className={cn("mt-8", liste && GRILLE_LISTE_DETAIL)} data-liste-detail={liste ? "" : undefined}>
        <div className={cn(CELLULE_LISTE_COLLANTE, liste ? "max-lg:hidden" : "hidden")} data-zone="liste">
          {liste && <RailFils fils={fils} courant={fil?.id ?? null} />}
        </div>
        <div className="min-w-0" data-zone="panneau">
          {children}
        </div>
      </div>
    </div>
  );
}
