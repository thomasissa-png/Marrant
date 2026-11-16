import { SERIE } from "@/config/textes/parcours";
import { TEXTES_CAPS as TEXTES_CAPS_BRUT } from "@/config/textes/espace-caps";
import type { NumeroCap } from "@/lib/espace/caps";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";
import { ETIQUETTE, META, TITRE_CARTE } from "@/components/espace/typo";
import { Flamme, SegmentsCap, StatChiffre } from "@/components/espace/aujourdhui/tableau";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const TEXTES_CAPS = frEspaceProfond(TEXTES_CAPS_BRUT);

/**
 * Z2 « Ton cap » (refonte s25, spec UX §4.2 et design §4 Z2 ; remplace « Ton mois ») : affichée dès le premier jour
 * (décision du 16/11 : progression visible, récompense, série). Le cap (nom, « cap n sur 5 », 5 segments), les XP
 * gagnés s'il y en a, la série avec sa flamme et son aide. Jamais « 0 XP » ni « 0 jour » : à zéro, la phrase
 * `serieZero`, flamme éteinte. Ni pourcentage, ni « XP restants », ni écart (interdits des caps).
 * À 768 px, en bandeau (cap à gauche, chiffres à droite) ; à 1280, colonne de droite à hauteur de Z1.
 * Échelle s25 (`docs/design/typo-harmonie-espace-s25.md`) : nom du cap et chiffres en `TITRE_CARTE` (20/600), le
 * reste en `META` ; flamme et segments neutres (un seul violet par écran, le bouton plein) ; 24 px de marge.
 */
export function CapDuJour({ cap, xp, serie, fige = false }: { cap: NumeroCap; xp: number; serie: number; fige?: boolean }) {
  // Spec design §7 point 2 : coupe sur « · » (nom en grand, « cap n sur 5 » en petit), texte inchangé.
  const [nom, echelle = ""] = TEXTES_CAPS.capVisible(cap).split(/\s·\s/);
  const avecChiffres = xp > 0 || serie > 0;
  const serieZero = (
    <p className={cn("flex items-start gap-2", META)}>
      <Flamme className="mt-0.5 h-4 w-4 text-text-secondary" />
      <span>{TEXTES_CAPS.serieZero}</span>
    </p>
  );
  return (
    <section
      aria-labelledby={fige ? undefined : "cap-titre"}
      className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-background-card p-6 [overflow-wrap:anywhere] md:flex-row md:items-center md:gap-8 lg:flex-col lg:items-stretch lg:gap-0"
      data-cap-du-jour={cap}
    >
      <div className="min-w-0 md:flex-1 lg:flex-none">
        <h2 id={fige ? undefined : "cap-titre"} className={ETIQUETTE}>
          {TEXTES_CAPS.titre}
        </h2>
        <p className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3">
          <span aria-hidden="true" className={TITRE_CARTE}>
            {nom}
          </span>
          <span aria-hidden="true" className={cn("tabular-nums", META)}>
            {echelle}
          </span>
          <span className="sr-only">{TEXTES_CAPS.capLu(cap)}</span>
        </p>
        <SegmentsCap cap={cap} className="mt-4" />
      </div>
      <div className={cn("min-w-0 md:flex-1 lg:flex-none", "mt-6 border-t border-border pt-6 md:mt-0 md:border-t-0 md:pt-0 lg:mt-6 lg:border-t lg:pt-6")}>
        {avecChiffres ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {xp > 0 && <StatChiffre phrase={TEXTES_CAPS.xpDepuisArrivee(xp)} />}
              {serie > 0 ? <StatChiffre phrase={SERIE.jours(serie)} icone={<Flamme className="h-5 w-5 text-text-secondary" />} /> : serieZero}
            </div>
            {/* Échelle s25 : l'aide de la série en `META` (14 px, gris secondaire), plus de 12 px ni de 3e gris. */}
            <p className={cn("mt-4", META)}>{SERIE.aide}</p>
          </>
        ) : (
          serieZero
        )}
      </div>
    </section>
  );
}
