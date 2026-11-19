"use client";

import { useState } from "react";
import type { FilListe } from "@/lib/espace/questions-types";
import { cn } from "@/lib/utils";
import { FormulaireQuestion } from "@/components/espace/questions/formulaire";
import { ListeEnvois, type Envoi } from "@/components/espace/questions/liste-envois";
import { ReponseNonLue } from "@/components/espace/questions/reponse-non-lue";

/**
 * « Mes questions » (maquette `mes-questions.html`), refait en s26 (`docs/ux/questions-repliques-lettre-profil-s26.md`
 * §1.2, design §2) sur la grille de 12 colonnes : dès 1024, « Écrire à l'équipe » à gauche (4, collant sous l'en-tête,
 * `lg:top-36`), à droite (8) la réponse non lue en tête puis « Mes envois ». Sous 1024, l'un sous l'autre.
 * Prochaine action : une réponse non lue = sa tuile, seul aplat ; sinon le bouton d'envoi du formulaire.
 * Lecture seule (Mon profil, ancien abonné) : pas de formulaire ni de tuile, la liste sur toute la largeur ; le
 * retrait reste possible (décision C10 a).
 */
export function MesQuestions({ initiaux, lectureSeule }: { initiaux: FilListe[]; lectureSeule: boolean }) {
  const [envois, setEnvois] = useState<Envoi[]>(initiaux);
  const maj = (fil: FilListe) => setEnvois((l) => (l.some((e) => e.id === fil.id) ? l.map((e) => (e.id === fil.id ? fil : e)) : [fil, ...l]));
  const retire = (id: string) => setEnvois((l) => l.map((e) => (e.id === id ? { id, retire: true as const } : e)));
  const nonLu = lectureSeule ? undefined : envois.find((e): e is FilListe => !("retire" in e) && e.nonLu);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:items-start" data-mes-questions>
      {!lectureSeule && (
        <div className="min-w-0 md:col-span-2 lg:sticky lg:top-36 lg:col-span-4 lg:max-h-[calc(100vh-10rem)] lg:self-start lg:overflow-y-auto">
          <FormulaireQuestion onEnvoye={maj} principal={!nonLu} />
        </div>
      )}
      {/* Colonne de droite d'un seul bloc : la tuile garde sa hauteur, « Mes envois » la suit à 24 px. */}
      <div className={cn("flex min-w-0 flex-col gap-6 md:col-span-2", lectureSeule ? "lg:col-span-12" : "lg:col-span-8")}>
        {nonLu && <ReponseNonLue fil={nonLu} />}
        <ListeEnvois envois={envois} lectureSeule={lectureSeule} onMaj={maj} onRetire={retire} />
      </div>
    </div>
  );
}
