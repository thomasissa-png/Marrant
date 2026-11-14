import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { SERIE } from "@/config/textes/parcours";
import { NUMEROS_CAPS, type NumeroCap } from "@/lib/espace/caps";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CAPS);

/**
 * Carte compacte « Ton cap » (niveaux-xp-s24.md 3.0 ; architecture v20 4.4 ; maquette
 * `etalons/e5/parcours.html#cap`). Intitulé de niveau 2 propre, série sur sa ligne au-dessus du cap,
 * « {nom} · cap n sur 5 » (lu « {nom}, cap n sur 5 »), cinq repères DÉCORATIFS (masqués aux lecteurs
 * d'écran) : pleins (fond) ou contour de 2 px du même violet (état hors couleur, 3:1 pour les deux).
 * Jamais de pourcentage, de « XP restants », du mot « étape » ni de compteur d'étapes. Phrase de
 * l'écart (Q10) seulement quand le cap affiché dépasse le cap de déblocage. `xp` : ligne « X XP
 * gagnés depuis ton arrivée » (critère 11), affichée sur « Mon profil » seulement.
 */
export function TonCap({
  cap,
  serie,
  ecart,
  xp,
  className,
}: {
  cap: NumeroCap;
  serie: number;
  ecart: boolean;
  xp?: number;
  className?: string;
}) {
  return (
    <section
      id="cap"
      aria-labelledby="ton-cap-titre"
      className={cn("space-y-3 rounded-lg border border-border bg-background-card p-4 md:p-6 max-e300:space-y-1 max-e300:px-3 max-e300:py-2", className)}
    >
      <h2 id="ton-cap-titre" className="font-display text-xl font-bold text-text-primary">
        {T.titre}
      </h2>
      <div className="space-y-2 md:flex md:flex-wrap md:items-center md:gap-x-8 md:gap-y-3 md:space-y-0">
        <p className="flex items-center gap-2 text-base text-text-primary max-e300:text-sm">
          <svg className="h-5 w-5 flex-none text-accent-primary-hover max-e300:h-4 max-e300:w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
          </svg>
          <span>{serie > 0 ? SERIE.jours(serie) : T.serieZero}</span>
        </p>
        <p className="text-base font-semibold text-text-primary max-e300:text-xs">
          <span aria-hidden="true">{T.capVisible(cap)}</span>
          <span className="sr-only">{T.capLu(cap)}</span>
        </p>
        <div className="flex gap-2" aria-hidden="true" data-testid="reperes-cap">
          {NUMEROS_CAPS.map((n) => (
            <i
              key={n}
              data-plein={n <= cap ? "oui" : "non"}
              className={cn("block h-4 w-4 rounded-full border-2 border-accent-primary", n <= cap && "bg-accent-primary")}
            />
          ))}
        </div>
      </div>
      {typeof xp === "number" && <p className="text-sm text-text-secondary">{T.xpDepuisArrivee(xp)}</p>}
      {ecart && <p className="text-sm text-text-secondary">{T.ecart}</p>}
    </section>
  );
}
