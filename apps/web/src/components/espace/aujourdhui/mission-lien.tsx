import Link from "next/link";
import { TEXTES_MISSION } from "@/config/textes/espace-cartes";
import type { NumeroMarche } from "@/lib/espace/missions";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const M = frEspaceProfond(TEXTES_MISSION);

/**
 * Mission ouverte, état 4 d'« Aujourd'hui » (architecture v20 4.4) : un lien secondaire, jamais l'action
 * principale. « Marche n » et le titre de la marche (libellé 25), vers la mission dans « S'entraîner ».
 */
export function MissionLien({ marche }: { marche: NumeroMarche }) {
  return (
    <p className="text-sm text-text-secondary" data-testid="mission-lien">
      <span className="mr-2 text-xs font-semibold text-text-muted">{M.marche(marche)}</span>
      <Link href="/mon-espace/s-entrainer#mission" className="inline-flex min-h-11 items-center text-accent-link underline underline-offset-2">
        {M.titresMarches[marche]}
      </Link>
    </p>
  );
}
