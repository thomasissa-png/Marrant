import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { SERIE } from "@/config/textes/parcours";
import { TEXTES_CAPS as TEXTES_CAPS_BRUT } from "@/config/textes/espace-caps";
import { NUMEROS_CAPS, type NumeroCap } from "@/lib/espace/caps";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);
const TEXTES_CAPS = frEspaceProfond(TEXTES_CAPS_BRUT);

/**
 * « Ton mois » (architecture 4.4) : seul endroit de « Aujourd'hui » où la série figure ; à partir de
 * J25 environ, absent tant que rien n'est fait (la page décide). Textes validés de la série
 * (`SERIE`, s17), flamme SVG décorative sans animation, l'information est dans le texte. Le cap
 * (lot D4 : mêmes textes et repères que la carte « Ton cap », sans annonce de bonus), les situations
 * jouées et les missions (lot D5) s'ajoutent à leurs lots.
 */
export function TonMois({ serie, cap }: { serie: number; cap: NumeroCap }) {
  return (
    <section aria-labelledby="mois-titre" className="space-y-3 rounded-lg border border-border bg-background-card p-4 md:p-6">
      <h2 id="mois-titre" className="font-display text-xl font-bold text-text-primary">
        {T.mois.titre}
      </h2>
      <p className="flex items-center gap-2 text-base text-text-primary">
        <svg className="h-5 w-5 flex-none text-accent-primary-hover" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
        <span>{serie > 0 ? SERIE.jours(serie) : TEXTES_CAPS.serieZero}</span>
      </p>
      <p className="text-sm text-text-secondary">{SERIE.aide}</p>
      <p className="text-base font-semibold text-text-primary">
        <span aria-hidden="true">{TEXTES_CAPS.capVisible(cap)}</span>
        <span className="sr-only">{TEXTES_CAPS.capLu(cap)}</span>
      </p>
      <div className="flex gap-2" aria-hidden="true">
        {NUMEROS_CAPS.map((n) => (
          <i key={n} className={cn("block h-4 w-4 rounded-full border-2 border-accent-primary", n <= cap && "bg-accent-primary")} />
        ))}
      </div>
    </section>
  );
}
