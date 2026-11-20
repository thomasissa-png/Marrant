"use client";

import { useEffect, useRef } from "react";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { CADRE_CARTE_NEUTRE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { META, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { EtatVideQuestions } from "@/components/espace/questions/etat-vide";
import { FilEnvoi } from "@/components/espace/questions/fil";
import { frEspaceProfond } from "@/lib/fr-typo";
import { Bandeau } from "@/components/espace/da-espace";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

export type Envoi = FilListe | { id: string; retire: true };

/**
 * « Mes envois » : le plus récent d'abord ; aucun envoi : l'état vide (exemples) ; un envoi retiré laisse
 * « Question retirée de ton historique. » à sa place (maquette `#etat=retire`), qui reçoit le focus : le
 * bouton d'origine n'existe plus, le lecteur d'écran lit le statut une fois (aucune région live doublée). Lecture seule (après la résiliation,
 * depuis « Mon profil ») : l'adresse de l'équipe pour un problème de paiement ou d'accès (ligne v6).
 * s26 (design `questions-repliques-lettre-profil-s26.md` §2) : compteur « répondues / envoyées » (chiffres seuls,
 * `META tabular-nums`) à droite du titre ; lignes en 1 colonne, 2 de 768 à 1023 ; état vide dans un cadre neutre.
 */
export function ListeEnvois({
  envois,
  lectureSeule,
  onMaj,
  onRetire,
  className,
}: {
  envois: Envoi[];
  lectureSeule: boolean;
  onMaj: (fil: FilListe) => void;
  onRetire: (id: string) => void;
  className?: string;
}) {
  const fils = envois.filter((e): e is FilListe => !("retire" in e));
  const repondues = fils.filter((f) => f.statut === "REPONDU").length;
  return (
    <section aria-labelledby="h-envois" className={cn("min-w-0", className)} data-mes-envois>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id="h-envois" className={TITRE_CARTE}>
          {Q.envois.titre}
        </h2>
        {fils.length > 0 && (
          <p className={cn("tabular-nums", META)} data-compteur-envois>
            {repondues} / {fils.length}
          </p>
        )}
      </div>
      {lectureSeule && (
        <p className={cn("mb-4", META)} data-adresse-equipe>
          {Q.lectureSeule.adresse.avant}
          <a href={`mailto:${Q.lectureSeule.adresse.lien}`} className={cn(LIEN_NEUTRE, "max-w-full [overflow-wrap:anywhere]")}>
            {Q.lectureSeule.adresse.lien}
          </a>
          {Q.lectureSeule.adresse.apres}
        </p>
      )}
      {envois.length === 0 ? (
        // s26 DA, aujourd'hui questions répliques : la carte vide prend le bandeau de l'accueil (contenu inchangé).
        <div className={cn(CADRE_CARTE_NEUTRE, "p-6")}>
          <Bandeau />
          <EtatVideQuestions />
        </div>
      ) : (
        // s26 tour 3 (point 6) : deux colonnes de 768 à 1023 seulement à partir de 2 envois (un seul envoi laissait une
        // demi-rangée vide à 768).
        <ul className={cn("grid grid-cols-1 gap-6", envois.length >= 2 && "md:grid-cols-2 lg:grid-cols-1")}>
          {envois.map((e) =>
            "retire" in e ? (
              <EnvoiRetire key={e.id} />
            ) : (
              <FilEnvoi key={e.id} fil={e} lectureSeule={lectureSeule} onMaj={onMaj} onRetire={onRetire} />
            ),
          )}
        </ul>
      )}
    </section>
  );
}

/** Statut d'un envoi retiré : focus posé à l'arrivée (après la confirmation), visible au clavier. */
function EnvoiRetire() {
  const statut = useRef<HTMLParagraphElement>(null);
  useEffect(() => statut.current?.focus(), []);
  return (
    <li className={cn(CADRE_CARTE_NEUTRE, "p-6")} data-retire>
      <Bandeau />
      <p ref={statut} tabIndex={-1} className={cn(META, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link")}>
        {Q.envois.retire}
      </p>
    </li>
  );
}
