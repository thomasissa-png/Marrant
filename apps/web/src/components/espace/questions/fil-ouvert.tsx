"use client";

import { useState } from "react";
import type { FilListe } from "@/lib/espace/questions-types";
import { ListeEnvois, type Envoi } from "@/components/espace/questions/liste-envois";
import { FilEnvoi } from "@/components/espace/questions/fil";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/** Un fil seul, ouvert à l'arrivée (lien de la cloche) ; retiré : « Question retirée de ton historique. » */
export function FilOuvert({ fil: initial }: { fil: FilListe }) {
  const [envoi, setEnvoi] = useState<Envoi>(initial);
  if ("retire" in envoi) return <ListeEnvois envois={[envoi]} lectureSeule={false} onMaj={() => undefined} onRetire={() => undefined} />;
  return (
    <ul className="flex flex-col gap-3" aria-label={Q.envois.titre}>
      <FilEnvoi fil={envoi} lectureSeule={false} ouvertAuDepart onMaj={setEnvoi} onRetire={(id) => setEnvoi({ id, retire: true })} />
    </ul>
  );
}
