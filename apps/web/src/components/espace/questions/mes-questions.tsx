"use client";

import { useState } from "react";
import type { FilListe } from "@/lib/espace/questions-types";
import { FormulaireQuestion } from "@/components/espace/questions/formulaire";
import { ListeEnvois, type Envoi } from "@/components/espace/questions/liste-envois";

/**
 * « Mes questions » (maquette `mes-questions.html`) : « Écrire à l'équipe » à gauche, « Mes envois » à
 * droite dès 1024 px (5/7), l'un sous l'autre en dessous. Lecture seule : pas de formulaire (ni ajout, ni
 * « Continuer »), le retrait reste possible (décision C10 a).
 */
export function MesQuestions({ initiaux, lectureSeule }: { initiaux: FilListe[]; lectureSeule: boolean }) {
  const [envois, setEnvois] = useState<Envoi[]>(initiaux);
  const maj = (fil: FilListe) => setEnvois((l) => (l.some((e) => e.id === fil.id) ? l.map((e) => (e.id === fil.id ? fil : e)) : [fil, ...l]));
  const retire = (id: string) => setEnvois((l) => l.map((e) => (e.id === id ? { id, retire: true as const } : e)));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {!lectureSeule && <FormulaireQuestion onEnvoye={maj} />}
      <ListeEnvois envois={envois} lectureSeule={lectureSeule} onMaj={maj} onRetire={retire} />
    </div>
  );
}
