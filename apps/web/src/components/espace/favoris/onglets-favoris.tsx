"use client";

import { cn } from "@/lib/utils";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { RangeeOnglets } from "@/components/espace/rangee-onglets";
import { META, TEXTE, TEXTE_FORT } from "@/components/espace/typo";
import { TABS, type TabFilter } from "@/components/favoris/libelles";

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";

/** Flèches, Début et Fin : l'onglet voisin prend le focus et devient actif (motif ARIA des onglets, activation auto). */
function auClavier(e: React.KeyboardEvent<HTMLElement>, actif: TabFilter, choisir: (t: TabFilter) => void) {
  const i = TABS.findIndex((t) => t.value === actif);
  const cible: Record<string, number> = {
    ArrowRight: i + 1,
    ArrowDown: i + 1,
    ArrowLeft: i - 1,
    ArrowUp: i - 1,
    Home: 0,
    End: TABS.length - 1,
  };
  if (!(e.key in cible)) return;
  e.preventDefault();
  const j = (cible[e.key] + TABS.length) % TABS.length;
  choisir(TABS[j].value);
  const onglets = e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
  onglets[j]?.focus();
}

/**
 * Onglets de Favoris, vue abonné espace ouvert (s26, `docs/design/favoris-carnet-s26.md` §2.2) : dès 1024 px, un rail
 * vertical (libellé à gauche, effectif réel à droite en `META`, actif = filet BLANC de 2 px à gauche, `TEXTE_FORT`, fond
 * élevé, jamais d'aplat violet) ; dessous, la rangée défilante existante (`RangeeOnglets`), actif souligné de 2 px.
 * Les deux listes existent dans le DOM, une seule est affichée à chaque largeur (l'autre en `display: none`, donc ni
 * lue ni atteinte au clavier). Focus itinérant : seul l'onglet actif est dans l'ordre de tabulation.
 */
export function OngletsFavoris({
  actif,
  choisir,
  effectifs,
}: {
  actif: TabFilter;
  choisir: (t: TabFilter) => void;
  effectifs: Record<TabFilter, number>;
}) {
  const onglet = (t: (typeof TABS)[number], rail: boolean) => {
    const choisi = t.value === actif;
    return (
      <button
        key={t.value}
        type="button"
        role="tab"
        aria-selected={choisi}
        tabIndex={choisi ? 0 : -1}
        onClick={() => choisir(t.value)}
        data-onglet-favoris={t.value}
        className={cn(
          "flex min-h-11 shrink-0 snap-start items-center gap-4 whitespace-nowrap border-transparent px-4 transition-colors hover:bg-background-elevated",
          FOCUS,
          rail ? "w-full justify-between border-l-2" : "border-b-2",
          choisi ? cn("border-text-primary", TEXTE_FORT, rail && "bg-background-elevated") : TEXTE,
        )}
      >
        <span>{t.label}</span>
        <span className={cn(META, "tabular-nums")}>{effectifs[t.value]}</span>
      </button>
    );
  };
  return (
    <>
      {/* `RangeeOnglets` porte le `role="tablist"` ; les flèches remontent jusqu'à ce conteneur. */}
      {/* s26 tour 3 : 52 px entre la rangée et la première carte sous 1024 (`mb-6` et `pb-1` de la rangée, puis `gap-6`
          de la grille). La rangée garde sa marge (ses autres usages) et son `pb-1` (anneau de focus non rogné) : les
          28 px en trop sont repris ici, il reste les 24 px de la grille. */}
      <div className="-mb-7 lg:hidden" onKeyDown={(e) => auClavier(e, actif, choisir)}>
        <RangeeOnglets label="Type de favoris">{TABS.map((t) => onglet(t, false))}</RangeeOnglets>
      </div>
      <div
        role="tablist"
        aria-label="Type de favoris"
        aria-orientation="vertical"
        onKeyDown={(e) => auClavier(e, actif, choisir)}
        className={cn(CADRE_CARTE_NEUTRE, "hidden p-6 lg:flex lg:flex-col")}
        data-rail-favoris
      >
        {TABS.map((t) => onglet(t, true))}
      </div>
    </>
  );
}
