"use client";

import { useState } from "react";
import type { FilListe } from "@/lib/espace/questions-types";
import { cn } from "@/lib/utils";
import { FormulaireQuestion } from "@/components/espace/questions/formulaire";
import { ListeEnvois, type Envoi } from "@/components/espace/questions/liste-envois";
import { ReponseNonLue } from "@/components/espace/questions/reponse-non-lue";

/**
 * Colonne du formulaire dès 1024. s26 tour 2 (Q1) : plus de `max-h` ni de défilement interne (au tour 1, la carte était
 * coupée à 1280 x 900, bouton d'envoi visible sur 33 px). Collante seulement si la carte tient sous l'en-tête : carte
 * mesurée à 876 px à 1024 et 796 px dès 1280 ; collée à 144 px (`top-36`), avec 24 px d'air et la place d'une ligne
 * d'erreur, d'où 70rem (1 120 px de haut) de 1024 à 1279 et 64rem (1 024 px) dès 1280. Sinon, elle défile avec la page.
 */
const COLONNE_FORMULAIRE = cn(
  "min-w-0 md:col-span-2 lg:col-span-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start",
  "lg:[@media(min-height:70rem)]:sticky lg:[@media(min-height:70rem)]:top-36 xl:[@media(min-height:64rem)]:sticky xl:[@media(min-height:64rem)]:top-36",
);

/**
 * « Mes questions » (maquette `mes-questions.html`), refait en s26 (`docs/ux/questions-repliques-lettre-profil-s26.md`
 * §1.2, design §2) sur la grille de 12 colonnes : dès 1024, « Écrire à l'équipe » à gauche (4), à droite (8) la réponse
 * non lue en tête puis « Mes envois ». Prochaine action : une réponse non lue = sa tuile, seul aplat ; sinon le bouton
 * d'envoi du formulaire.
 * s26 tour 2 (Q2) : la tuile « réponse non lue » vient EN TÊTE du DOM (avant le formulaire) : sous 1024, elle est la
 * première chose affichée et le premier arrêt du clavier (au tour 1 : y = 1 069 à 375, sous le formulaire). Dès 1024,
 * trois cases de la grille (rangées `auto 1fr` : la hauteur du formulaire va à la 2e rangée, « Mes envois » suit la
 * tuile à 24 px).
 * Lecture seule (Mon profil, ancien abonné) : pas de formulaire ni de tuile, la liste sur toute la largeur ; le
 * retrait reste possible (décision C10 a).
 */
export function MesQuestions({ initiaux, lectureSeule }: { initiaux: FilListe[]; lectureSeule: boolean }) {
  const [envois, setEnvois] = useState<Envoi[]>(initiaux);
  const maj = (fil: FilListe) => setEnvois((l) => (l.some((e) => e.id === fil.id) ? l.map((e) => (e.id === fil.id ? fil : e)) : [fil, ...l]));
  const retire = (id: string) => setEnvois((l) => l.map((e) => (e.id === id ? { id, retire: true as const } : e)));
  const nonLu = lectureSeule ? undefined : envois.find((e): e is FilListe => !("retire" in e) && e.nonLu);
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:items-start", !lectureSeule && "lg:grid-rows-[auto_1fr]")} data-mes-questions>
      {/* s26 tour 3 (point 7) : dès 1024, la tuile descend de la hauteur du titre « Écrire à l'équipe » (28 px + 16 px
          de marge, `lg:mt-11`) : elle et la carte du formulaire démarrent à la même hauteur (44 px d'écart au tour 2). Relecture tour 3 : `lg:h-auto` (la tuile portait `h-full` et débordait de 44 px sur « Mes envois »). */}
      {nonLu && <ReponseNonLue fil={nonLu} className="md:col-span-2 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:mt-11 lg:h-auto" />}
      {!lectureSeule && (
        <div className={COLONNE_FORMULAIRE}>
          <FormulaireQuestion onEnvoye={maj} principal={!nonLu} />
        </div>
      )}
      <div
        className={cn(
          "min-w-0 md:col-span-2",
          lectureSeule ? "lg:col-span-12" : cn("lg:col-span-8 lg:col-start-5", nonLu ? "lg:row-start-2" : "lg:row-start-1"),
        )}
      >
        <ListeEnvois envois={envois} lectureSeule={lectureSeule} onMaj={maj} onRetire={retire} />
      </div>
    </div>
  );
}
