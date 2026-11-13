"use client";

import { etapeDecoupee, type BlocReference } from "@/lib/espace/parcours-fiches";
import { TEXTES_PARCOURS_ESPACE as P } from "@/config/textes/espace-caps";
import { QUIZ_TITRE, VANNES_ETAPE } from "@/config/textes/parcours";
import { frTypoParcours } from "@/lib/fr-typo";

/** Ancre d'une fiche dans l'étape : `fiche-N-M` (architecture v20 5.1). */
export const ancreFiche = (etape: number, rang: number) => `fiche-${etape}-${rang}`;

interface EtapeVue {
  order: number;
  tip: { title: string };
  videos?: ReadonlyArray<{ youtubeId: string; title: string; artist?: string }> | null;
}

/** Libellé d'une fiche : un texte déjà en ligne (titre du conseil, titres de blocs, titre de la vidéo). */
function libelle(ref: BlocReference, etape: EtapeVue): string {
  switch (ref.bloc) {
    case "conseil":
      return etape.tip.title;
    case "vannes":
      return VANNES_ETAPE.titre;
    case "video": {
      const v = etape.videos?.find((x) => x.youtubeId === ref.youtubeId);
      return v ? (v.artist ? `${v.title} · ${v.artist}` : v.title) : "";
    }
    case "quiz":
      return QUIZ_TITRE.abonne;
  }
}

/**
 * Fiches d'une étape (découpage `data/espace/parcours-fiches.json`, lot D4), en tête de l'étape ouverte :
 * « N.M », le libellé du bloc existant, « Voir » vers son ancre `#fiche-N-M`. Aucun texte d'étape réécrit.
 * L'état « Fait » par fiche arrive avec le lot D5 (`FicheFait`). Chargé à la demande (`next/dynamic`).
 * Lot D11b (Q-4, @design D1) : ligne qui passe à la ligne et titre de 128 px au moins ; à 200 % de texte,
 * le titre n'est plus écrasé à une lettre par ligne par le numéro et « Voir » (128 px, ou toute la ligne si
 * elle est plus étroite : jamais de débordement à 200 %).
 */
export function LignesFiches({ slug, etape }: { slug: string; etape: EtapeVue }) {
  const decoupe = etapeDecoupee(slug, etape.order);
  if (!decoupe) return null;
  const lignes = decoupe.fiches.map((f) => ({ ...f, titre: libelle(f.ref, etape) })).filter((f) => f.titre !== "");
  if (lignes.length === 0) return null;
  return (
    <ol className="divide-y divide-border rounded-lg border border-border" data-testid="lignes-fiches">
      {lignes.map((f) => (
        <li key={f.ancre} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1">
          <span className="text-xs font-semibold text-text-muted">{f.numero}</span>
          <span className="min-w-[min(8rem,100%)] flex-1 text-sm text-text-primary [overflow-wrap:anywhere]">{frTypoParcours(f.titre)}</span>
          <a
            href={`#${f.ancre}`}
            aria-label={`${P.sommaire.voir} : ${f.titre}`}
            className="inline-flex min-h-11 items-center px-2 text-sm text-accent-link underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            {P.sommaire.voir}
          </a>
        </li>
      ))}
    </ol>
  );
}
