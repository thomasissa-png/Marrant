"use client";

import { etapeDecoupee, type BlocReference } from "@/lib/espace/parcours-fiches";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { QUIZ_TITRE, VANNES_ETAPE } from "@/config/textes/parcours";
import { frTypoParcours, frEspaceProfond } from "@/lib/fr-typo";
import { Chevron, Coche } from "@/components/espace/aujourdhui/tableau";
import { META, META_FORT } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

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
 * Fiches d'une étape (découpage `data/espace/parcours-fiches.json`, lot D4) : « N.M » et le libellé du bloc existant,
 * vers son ancre `#fiche-N-M`. Aucun texte d'étape réécrit. Chargé à la demande (`next/dynamic`) dans la carte d'étape.
 * Lot D11b (Q-4, @design D1) : ligne qui passe à la ligne et titre de 128 px au moins (jamais une lettre par ligne à 200 %).
 * s26 parcours v2 (`docs/design/parcours-connecte-v2-s26.md` §3) : la ligne ENTIÈRE est le lien (44 px), numéro et titre
 * soulignés, chevron seul à droite ; plus de « Voir » (cinq liens au même nom). Sous-étape suivante (première fiche d'une
 * étape non validée, aucun suivi par fiche) : filet blanc de 2 px et titre en méta forte ; étape validée : coche et titres
 * gris, « Fait » lu. `variante` « menu » : sous l'étape active du menu d'étapes (`pl-14 pr-6`, sans cadre).
 */
export function LignesFiches({
  slug,
  etape,
  etapeFaite = false,
  variante = "carte",
  className,
}: {
  slug: string;
  etape: EtapeVue;
  etapeFaite?: boolean;
  variante?: "carte" | "menu";
  className?: string;
}) {
  const decoupe = etapeDecoupee(slug, etape.order);
  if (!decoupe) return null;
  const lignes = decoupe.fiches.map((f) => ({ ...f, titre: libelle(f.ref, etape) })).filter((f) => f.titre !== "");
  if (lignes.length === 0) return null;
  const menu = variante === "menu";
  return (
    <ol
      className={cn(menu ? "pb-2" : "divide-y divide-border overflow-hidden rounded-xl border border-border", className)}
      data-testid={menu ? "lignes-fiches-menu" : "lignes-fiches"}
    >
      {lignes.map((f, i) => {
        const suivante = !etapeFaite && i === 0;
        return (
          <li key={f.ancre}>
            <a
              href={`#${f.ancre}`}
              data-fiche={f.ancre}
              className={cn(
                "relative flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 py-2 hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-primary before:absolute before:inset-y-0 before:left-0 before:w-0.5",
                menu ? "pl-14 pr-6" : "px-4",
                suivante && "before:bg-text-primary",
              )}
            >
              <span className={cn("flex-none tabular-nums underline underline-offset-2", suivante ? META_FORT : META)}>{f.numero}</span>
              <span
                className={cn(
                  "min-w-[min(8rem,100%)] flex-1 underline underline-offset-2 [overflow-wrap:anywhere]",
                  suivante ? META_FORT : etapeFaite ? META : cn(META, "text-text-primary"),
                )}
              >
                {frTypoParcours(f.titre)}
              </span>
              {etapeFaite && (
                <span className="inline-flex flex-none items-center" data-statut="fait">
                  <Coche className="h-4 w-4 text-success" />
                  <span className="sr-only">{P.sommaire.fait}</span>
                </span>
              )}
              <Chevron className="text-text-secondary" />
            </a>
          </li>
        );
      })}
    </ol>
  );
}
