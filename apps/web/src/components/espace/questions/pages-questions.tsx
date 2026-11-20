"use client";

import { useRouter } from "next/navigation";
import type { FilListe } from "@/lib/espace/questions-types";
import { MesQuestions } from "@/components/espace/questions/mes-questions";
import { FilOuvert } from "@/components/espace/questions/fil-ouvert";

/**
 * s26 contrôle d'ensemble, abonné (C6) : parties droites des pages de Mes questions dans le layout liste et détail
 * (`QuestionsListeDetail`). Après un envoi, une lecture ou une suite, `router.refresh()` relit la liste des fils du
 * layout (serveur) sans remonter la page (formulaire, statut et fil gardés).
 */
export function MesQuestionsPanneau({ initiaux }: { initiaux: FilListe[] }) {
  const router = useRouter();
  return <MesQuestions initiaux={initiaux} lectureSeule={false} panneau onSuivre={() => router.refresh()} />;
}

export function FilOuvertPanneau({ fil }: { fil: FilListe }) {
  const router = useRouter();
  return <FilOuvert fil={fil} onSuivre={() => router.refresh()} />;
}
