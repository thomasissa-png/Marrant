import { TEXTES_QUOI_REPONDRE as T } from "@/config/textes/espace-bibliotheque";
import { CARTE } from "@/components/espace/carte/styles";

/**
 * Chargement de « Quoi répondre » (s24, lot D6) : le titre, puis des lignes vides au gabarit de la liste,
 * décoratives (`aria-hidden`), sans animation si l'abonné demande moins de mouvement. Aucun texte neuf.
 * Interrupteur fermé : la page répond la 404 (garde du layout et de la page) ; ce gabarit n'a ni
 * donnée ni texte propre à l'espace en dehors du nom de la rubrique.
 */
export default function QuoiRepondreChargement() {
  return (
    <div className="flex flex-col gap-6 pb-12 lg:max-w-3xl" aria-busy="true" data-etat="chargement">
      <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{T.titre}</h1>
      {[0, 1, 2].map((i) => (
        <div key={i} aria-hidden="true" className={`${CARTE} animate-pulse motion-reduce:animate-none`}>
          <div className="h-5 w-48 max-w-full rounded bg-background-elevated" />
        </div>
      ))}
    </div>
  );
}
