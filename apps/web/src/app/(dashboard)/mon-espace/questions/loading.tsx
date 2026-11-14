import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { CARTE } from "@/components/espace/carte/styles";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

/**
 * Chargement de « Mes questions » (s24, lot D7) : le titre, puis deux cartes vides au gabarit de la page,
 * décoratives (`aria-hidden`), sans animation si l'abonné demande moins de mouvement. Aucun texte neuf.
 */
export default function MesQuestionsChargement() {
  return (
    <div className="flex flex-col gap-6 pb-12" aria-busy="true" data-etat="chargement">
      <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{Q.titre}</h1>
      {[0, 1].map((i) => (
        <div key={i} aria-hidden="true" className={`${CARTE} animate-pulse motion-reduce:animate-none`}>
          <div className="h-5 w-48 max-w-full rounded bg-background-elevated" />
        </div>
      ))}
    </div>
  );
}
