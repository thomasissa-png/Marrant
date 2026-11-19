"use client";

import { frEspace } from "@/lib/fr-typo";
import { forwardRef, useEffect, useRef } from "react";
import Link from "next/link";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { TEXTES_AUJOURDHUI as TEXTES_AUJOURDHUI_BRUT } from "@/config/textes/espace-aujourdhui";
import type { EtapeAReprendre } from "@/lib/espace/quatre-semaines";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { ETIQUETTE, META, TITRE_CARTE } from "@/components/espace/typo";
import { frPonctuation, frEspaceProfond } from "@/lib/fr-typo";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);
const TEXTES_AUJOURDHUI = frEspaceProfond(TEXTES_AUJOURDHUI_BRUT);

const E = TEXTES_AUJOURDHUI.etape;

/**
 * Bloc d'en-tête de « Parcours » (architecture v20 4.4 et 5.4, maquette `parcours.html`) : « Tes 4
 * premières semaines » (quatre lignes, ordre conseillé, jamais un verrou ; replié sous 300 px de large,
 * c'est-à-dire à 200 % de texte, un geste l'ouvre et prime), puis l'étape à reprendre, action de la
 * page : « Étape en cours » + « Étape n sur N » + « Reprendre », ou « Étape conseillée » + « Commencer
 * l'étape 1 ». `etape` null : chargement ou erreur, seul le calendrier est rendu (rien d'inventé).
 * Le bouton porte la `ref` : l'annonce de passage y rend le focus à sa fermeture.
 */
export const QuatreSemaines = forwardRef<HTMLAnchorElement, { etape: EtapeAReprendre | null; ecouterPublie: boolean; className?: string }>(function QuatreSemaines(
  { etape, ecouterPublie, className },
  ref,
) {
  // Lot D11b (@ux D-1) : la semaine 4 ne promet « Écouter, repérer » que si une fiche est publiée.
  const lignes = ecouterPublie ? P.semaines.lignes : [...P.semaines.lignes.slice(0, 3), P.semaines.semaine4SansEcouter];
  const details = useRef<HTMLDetailsElement>(null);
  const touche = useRef(false);

  useEffect(() => {
    const ajuster = () => {
      if (!touche.current && details.current) details.current.open = window.innerWidth >= 300;
    };
    ajuster();
    window.addEventListener("resize", ajuster);
    return () => window.removeEventListener("resize", ajuster);
  }, []);

  return (
    // s26 (`docs/design/parcours-vannes-s26.md` §1.2, décision du 18/11) : cadre neutre sans filet violet, échelle de
    // `typo.ts` (titres 20/600, étiquette 14/600 en casse normale) ; le bouton reste LE plein de la page de l'abonné.
    <section aria-labelledby="semaines-titre" className={cn(CADRE_CARTE_NEUTRE, "p-6 max-e300:px-3 max-e300:py-2", className)}>
      <details ref={details} open onToggle={() => (touche.current ||= document.activeElement?.tagName === "SUMMARY")}>
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary [&::-webkit-details-marker]:hidden">
          <h2 id="semaines-titre" className={TITRE_CARTE}>
            {P.semaines.titre}
          </h2>
          <svg className="h-5 w-5 flex-none text-text-secondary" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <ol className="mt-2 grid gap-2">
          {lignes.map((l) => (
            <li
              key={l.semaine}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-t border-border py-2 text-sm text-text-secondary max-e300:grid-cols-1"
            >
              <b className="whitespace-nowrap font-semibold text-text-primary">{frPonctuation(l.semaine)}</b>
              <span>{frEspace(frPonctuation(l.texte))}</span>
            </li>
          ))}
        </ol>
      </details>
      {etape && (
        <div className="mt-4 space-y-2 border-t border-border pt-4 max-e300:mt-1 max-e300:space-y-1 max-e300:pt-1">
          <p className={ETIQUETTE}>{etape.enCours ? E.enCours : E.conseillee}</p>
          <h3 className={TITRE_CARTE}>{etape.titreParcours}</h3>
          {etape.enCours && <p className={cn(META, "tabular-nums")}>{P.etapeSurTotal(etape.ordre, etape.total)}</p>}
          <p className="text-base text-text-primary [overflow-wrap:anywhere]">{frEspace(etape.titreEtape)}</p>
          <Link
            ref={ref}
            href={etape.href}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-4 h-auto min-h-12 w-full whitespace-normal py-2 sm:w-auto sm:px-8 max-e300:mt-2 max-e300:min-h-11")}
          >
            {etape.enCours ? E.reprendre : E.commencerEtape1.replace("1", String(etape.ordre))}
          </Link>
        </div>
      )}
    </section>
  );
});
