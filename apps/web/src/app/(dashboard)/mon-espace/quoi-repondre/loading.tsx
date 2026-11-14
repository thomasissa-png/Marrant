import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { PageHeader } from "@/components/layout/page-header";
import { CARTE } from "@/components/espace/carte/styles";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);

/**
 * Chargement de « Quoi répondre » (s24, lot D6) : le titre, puis des lignes vides au gabarit de la liste,
 * décoratives (`aria-hidden`), sans animation si l'abonné demande moins de mouvement. Aucun texte neuf.
 * Interrupteur fermé : la page répond la 404 (garde du layout et de la page) ; ce gabarit n'a ni
 * donnée ni texte propre à l'espace en dehors du nom de la rubrique.
 */
export default function QuoiRepondreChargement() {
  return (
    <div className="flex flex-col gap-6 [&>header]:mb-2 md:[&>header]:mb-4" aria-busy="true" data-etat="chargement">
      {/* v5 §3, gabarit B : en-tête de page du site (sa marge basse remplace le premier écart). */}
      <PageHeader title={T.titre} />
      {[0, 1, 2].map((i) => (
        <div key={i} aria-hidden="true" className={`${CARTE} animate-pulse motion-reduce:animate-none`}>
          <div className="h-5 w-48 max-w-full rounded bg-background-elevated" />
        </div>
      ))}
    </div>
  );
}
