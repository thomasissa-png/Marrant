import { SERIE } from "@/config/textes/parcours";
import { TEXTES_CAPS as TEXTES_CAPS_BRUT } from "@/config/textes/espace-caps";
import type { NumeroCap } from "@/lib/espace/caps";
import { cn } from "@/lib/utils";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
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
 * reste en `META` ; flamme et segments neutres (un seul violet par écran, le bouton plein) ; 24 px de marge. v7 tour 7 : cadre
 * `CADRE_CARTE_NEUTRE` (sans filet), segments remplis en gris clair.
 * v7 tour 11 : à 768 px (bandeau), les deux groupes sont calés en haut (`md:items-start`) : l'étiquette « Ton cap »
 * est sur la ligne du haut des chiffres (12 px plus bas avant, groupes centrés). Le bloc des chiffres se fond dans le
 * bandeau (`md:contents`) : cap à gauche, cases des chiffres à droite, l'aide de la série sur toute la largeur dessous,
 * 16 px plus bas (sinon, sous le cap, la moitié gauche restait vide sur la hauteur des cases et de l'aide).
 * v7 tour 12 (relecture UX du tour 11, faute 1 : sans chiffres, à 768, barre de 320 px sur 720 et 350 px vides à
 * droite, phrase de série collée au verrou) : sans chiffres (cap au premier jour, extrait de l'aperçu), plus de
 * bandeau : le cap prend toute la largeur (barre pleine largeur, « cap n sur 5 » au bout de la ligne du nom) et la
 * phrase de série passe dessous, sous un filet, comme à 1280. Le verrou de l'extrait reste seul sur la ligne de
 * l'étiquette. Avec chiffres, le bandeau d'avant (les cases remplissent la droite).
 */
export function CapDuJour({ cap, xp, serie, fige = false }: { cap: NumeroCap; xp: number; serie: number; fige?: boolean }) {
  // Spec design §7 point 2 : coupe sur « · » (nom en grand, « cap n sur 5 » en petit), texte inchangé.
  const [nom, echelle = ""] = TEXTES_CAPS.capVisible(cap).split(/\s·\s/);
  const avecChiffres = xp > 0 || serie > 0;
  const serieZero = (
    <p className={cn("flex items-start gap-2 md:flex-1", META)}>
      <Flamme className="mt-0.5 h-4 w-4 text-text-secondary" />
      <span>{TEXTES_CAPS.serieZero}</span>
    </p>
  );
  return (
    <section
      aria-labelledby={fige ? undefined : "cap-titre"}
      className={cn(CADRE_CARTE_NEUTRE, "flex h-full min-w-0 flex-col p-6 [overflow-wrap:anywhere] md:flex-row md:flex-wrap md:items-start md:gap-x-8 md:gap-y-4 lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-0")}
      data-cap-du-jour={cap}
    >
      <div className={cn("min-w-0 md:flex-1 lg:flex-none", !avecChiffres && "md:basis-full lg:basis-auto")}>
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
      <div
        className={cn(
          "min-w-0 mt-6 border-t border-border pt-6 lg:mt-6 lg:border-t lg:pt-6",
          avecChiffres ? "md:contents lg:block" : "md:mt-2 md:basis-full lg:mt-6 lg:basis-auto",
        )}
      >
        {avecChiffres ? (
          <>
            {/* v7 tour 11 (relectures du tour 10 : chiffres « discrets ») : XP et série chacun dans sa case (fond élevé
                neutre, 16 px de marge, même rayon que les cartes) : ils prennent la place, pas une taille de plus ; la
                flamme d'une série en cours passe en blanc (texte principal), aucune couleur neuve. */}
            <div className="grid min-w-0 grid-cols-2 gap-4 md:flex-1 [&>*]:rounded-xl [&>*]:bg-background-elevated [&>*]:p-4" data-cap-chiffres>
              {xp > 0 && <StatChiffre phrase={TEXTES_CAPS.xpDepuisArrivee(xp)} />}
              {serie > 0 ? <StatChiffre phrase={SERIE.jours(serie)} icone={<Flamme className="h-5 w-5 text-text-primary" />} /> : serieZero}
            </div>
            {/* Échelle s25 : l'aide de la série en `META` (14 px, gris secondaire), plus de 12 px ni de 3e gris. */}
            <p className={cn("mt-4 md:mt-0 md:basis-full lg:mt-4", META)}>{SERIE.aide}</p>
          </>
        ) : (
          serieZero
        )}
      </div>
    </section>
  );
}
