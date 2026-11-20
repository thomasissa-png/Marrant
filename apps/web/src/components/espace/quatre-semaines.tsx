"use client";

import { frEspace } from "@/lib/fr-typo";
import { useEffect, useRef } from "react";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { cn } from "@/lib/utils";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { META, META_FORT } from "@/components/espace/typo";
import { PastillesDa } from "@/components/espace/da-espace";
import { frPonctuation, frEspaceProfond } from "@/lib/fr-typo";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

/**
 * « Tes 4 premières semaines » (architecture v20 4.4 et 5.4, maquette `parcours.html`) : quatre lignes, ordre conseillé,
 * jamais un verrou ; replié sous 300 px de large (200 % de texte), un geste l'ouvre et prime.
 * s26 parcours connecté (`docs/design/parcours-connecte-s26.md` §2.2 et arbitrage du 19/11) : l'étape à reprendre sort
 * de ce bloc (`CarteEnCours`, au-dessus) ; semaines en pile (étiquette puis texte), filet horizontal par cellule, 2x2 de
 * 768 à 1279 px, 4 colonnes dès 1280 px. Composant de l'espace ouvert seulement.
 */
export function QuatreSemaines({ ecouterPublie, className }: { ecouterPublie: boolean; className?: string }) {
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
    <section aria-labelledby="semaines-titre" className={cn(CADRE_CARTE_NEUTRE, "p-6 max-e300:px-3 max-e300:py-2", className)}>
      <details ref={details} open onToggle={() => (touche.current ||= document.activeElement?.tagName === "SUMMARY")}>
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary [&::-webkit-details-marker]:hidden">
          {/* s26 contrôle d'ensemble, abonné (C2) : titre en pastille violette, comme la tuile d'« Aujourd'hui ». */}
          <PastillesDa as="h2" id="semaines-titre" pastille={P.semaines.titre} />
          <svg className="h-5 w-5 flex-none text-text-secondary" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <ol className="mt-4 grid gap-4 md:grid-cols-2 md:gap-x-6 xl:grid-cols-4 max-e300:mt-2 max-e300:gap-2">
          {lignes.map((l) => (
            <li key={l.semaine} className="border-t border-border pt-4 max-e300:pt-2">
              <b className={cn("block", META_FORT)}>{frPonctuation(l.semaine)}</b>
              <span className={cn("mt-1 block", META)}>{frEspace(frPonctuation(l.texte))}</span>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
