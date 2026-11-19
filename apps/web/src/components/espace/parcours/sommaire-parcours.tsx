"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { frTypoParcours, frEspaceProfond } from "@/lib/fr-typo";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);
const useEffetAvantPeinture = typeof window === "undefined" ? useEffect : useLayoutEffect;
/** s26 parcours connecté : largeur dès laquelle la liste du sommaire est ouverte d'office (en-tête 7/5). */
const LARGE = "(min-width: 1024px)";

/**
 * Page d'un parcours, abonné, interrupteur ouvert (s24, lot D4 ; architecture v20 5.1) : barre globale
 * (étapes validées sur étapes du parcours), « {n} sur {total} étapes », liste numérotée des étapes ;
 * par ligne UN seul bouton : « Reprendre » (première étape non validée, « Commencer » si aucune ne
 * l'est) ou « Voir » ; « Fait » est un statut en TEXTE (coche dessinée en plus, jamais la couleur
 * seule). Ancres `#etape-N` inchangées : le bouton ouvre l'étape comme son en-tête.
 */
export function SommaireParcours({
  etapes,
  faites,
  onOuvrir,
}: {
  etapes: ReadonlyArray<{ order: number; titre: string }>;
  faites: readonly number[];
  onOuvrir: (order: number) => void;
}) {
  const total = etapes.length;
  const n = etapes.filter((e) => faites.includes(e.order)).length;
  const aReprendre = etapes.find((e) => !faites.includes(e.order))?.order ?? null;
  const avancee = P.sommaire.faites(n, total);
  // s26 parcours connecté (`docs/ux/parcours-connecte-s26.md` §4 et §5) : sous 1024 px, la liste et son « Reprendre »
  // sont repliées (un seul « Reprendre » visible à 375 px : celui de /parcours) ; dès 1024 px, ouvertes. Le geste de la
  // personne prime ensuite. Sans `matchMedia` (tests), ouvertes.
  const details = useRef<HTMLDetailsElement>(null);
  const touche = useRef(false);
  useEffetAvantPeinture(() => {
    if (typeof window.matchMedia !== "function") {
      if (details.current) details.current.open = true;
      return;
    }
    const mq = window.matchMedia(LARGE);
    const ajuster = () => {
      if (!touche.current && details.current) details.current.open = mq.matches;
    };
    ajuster();
    mq.addEventListener?.("change", ajuster);
    return () => mq.removeEventListener?.("change", ajuster);
  }, []);

  // s26 (`docs/design/parcours-vannes-s26.md` §2, rail de /parcours/{slug}) : barre grise sur rail visible (plus de violet),
  // numéros en 16/600 secondaire, « Fait » en méta avec coche verte. Le bouton de l'étape à reprendre reste le plein.
  // s26 parcours connecté, tour 2 (C3, en-tête 7/5 dès 1024 px) : lignes de 48 px (bouton de 44 + 4) au lieu de 68, et le
  // sommaire déplié remplit la carte étirée à la hauteur de la colonne de gauche (les lignes se partagent le surplus,
  // `::details-content` en colonne) : plus de vide en bas de carte ni de carte qui dépasse de 130 px.
  // s26 parcours connecté, tour 3 :
  // - replié, la liste est `display: none` (`[&:not([open])>ol]:hidden`). Le contenu d'un `details` fermé n'est que
  //   `content-visibility: hidden` dans Chromium : boîtes calculées, « Reprendre » comptait comme visible à 375 px.
  // - carte étirée d'un parcours court (Machine à Café, 3 étapes : 38 à 46 px de vide par ligne), le surplus se partage
  //   entre les lignes (`flex-auto`) ET deux cales de liste (`before`/`after`, poids 0,8 : avec les 8 px de marge qui les
  //   bordent, même vide que dans une ligne) : rythme régulier, aucun vide > 32 px, sans hauteur minimale. Carte non
  //   étirée : cales et lignes sans surplus, rien ne change.
  return (
    <details
      ref={details}
      data-testid="sommaire-parcours"
      className="group [&:not([open])>ol]:hidden lg:flex lg:flex-1 lg:flex-col lg:[&::details-content]:flex lg:[&::details-content]:flex-1 lg:[&::details-content]:flex-col"
      onToggle={() => (touche.current ||= document.activeElement?.tagName === "SUMMARY")}
    >
      {/* Le résumé porte « n sur N étapes » et la barre : visibles replié comme déplié. */}
      <summary className="cursor-pointer list-none rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary [&::-webkit-details-marker]:hidden">
      <span className="flex min-h-11 items-center justify-between gap-3">
      <span id="sommaire-avancee" className="text-sm font-semibold text-text-primary">
        {avancee}
      </span>
      <svg className="h-5 w-5 flex-none text-text-secondary transition-transform group-open:rotate-180" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      </span>
      <span
        role="progressbar"
        aria-labelledby="sommaire-avancee"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={n}
        aria-valuetext={avancee}
        className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-border-hover"
      >
        <span className="block h-full rounded-full bg-text-secondary" style={{ width: total > 0 ? `${(n / total) * 100}%` : "0%" }} />
      </span>
      </summary>
      <ol className="mt-4 divide-y divide-border lg:mt-2 lg:flex lg:flex-1 lg:flex-col lg:before:flex-[0.8_1_auto] lg:before:content-[''] lg:after:flex-[0.8_1_auto] lg:after:content-['']">
        {etapes.map((e) => {
          const fait = faites.includes(e.order);
          const bouton = e.order === aReprendre ? (n === 0 ? P.sommaire.commencer : P.sommaire.reprendre) : P.sommaire.voir;
          const principal = e.order === aReprendre;
          return (
            <li key={e.order} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 max-e300:py-2 lg:flex-auto lg:py-0.5">
              <span className="text-base font-semibold tabular-nums text-text-secondary" aria-hidden="true">
                {e.order}
              </span>
              <span id={`sommaire-etape-${e.order}`} className="min-w-0 flex-1 text-sm text-text-primary [overflow-wrap:anywhere]">
                <span className="sr-only">{`${e.order}. `}</span>
                {frTypoParcours(e.titre)}
              </span>
              {fait && (
                <span className="inline-flex items-center gap-1 text-sm text-text-secondary [&>svg]:text-success" data-statut="fait">
                  <svg className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {P.sommaire.fait}
                </span>
              )}
              <button
                type="button"
                id={principal ? "sommaire-reprendre" : undefined}
                onClick={() => onOuvrir(e.order)}
                aria-describedby={`sommaire-etape-${e.order}`}
                className={cn(buttonVariants({ variant: principal ? "primary" : "outline" }), "min-h-11 px-4 max-e300:w-full")}
              >
                {bouton}
              </button>
            </li>
          );
        })}
      </ol>
    </details>
  );
}
