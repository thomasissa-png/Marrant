import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { PageHeader } from "@/components/layout/page-header";
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
    <div className="flex flex-col gap-6 [&>header]:mb-2 [&>header]:text-center md:[&>header]:mb-4" aria-busy="true" data-etat="chargement">
      {/* v5 §3, gabarit B : en-tête de page du site (sa marge basse remplace le premier écart). */}
      <PageHeader title={Q.titre} />
      {[0, 1].map((i) => (
        <div key={i} aria-hidden="true" className={`${CARTE} animate-pulse motion-reduce:animate-none`}>
          <div className="h-5 w-48 max-w-full rounded bg-background-elevated" />
        </div>
      ))}
    </div>
  );
}
