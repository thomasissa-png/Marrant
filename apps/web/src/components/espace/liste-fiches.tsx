import Link from "next/link";
import { TEXTES_FICHE_LIGNE } from "@/config/textes/espace-bibliotheque";
import type { LigneFiche } from "@/lib/espace/lignes-fiches";
import { cn } from "@/lib/utils";
import { frEspace } from "@/lib/fr-typo";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_FICHE_LIGNE);

/**
 * Liste de fiches (s24, lot D6 ; maquette `bibliotheque.html`, classes `.fiches` et `.fiche`) : lignes de
 * 56 px au moins, titre, marque d'un bonus au-dessus, statut « Voir » ou « Fait » en texte (jamais la
 * couleur seule). Sous 300 px, le statut passe sous le titre. `avecDuree` : « {n} min » après le titre
 * (anatomie 2.7, durée affichée ; toujours pour un bonus, comme la maquette).
 */
export function ListeFiches({ lignes, avecDuree = false, labelledBy }: { lignes: readonly LigneFiche[]; avecDuree?: boolean; labelledBy?: string }) {
  if (lignes.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2" aria-labelledby={labelledBy}>
      {lignes.map((l) => (
        <li key={l.id}>
          <Link
            href={l.href}
            data-fiche={l.id}
            className="flex min-h-14 items-center gap-3 rounded-md border border-border bg-background-light px-3 py-2 transition-colors hover:border-border-hover hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link max-e300:grid max-e300:grid-cols-1 max-e300:gap-1"
          >
            <span className="min-w-0 flex-1 text-sm text-text-primary [overflow-wrap:anywhere]">
              {l.marque && <small className="mb-0.5 block text-xs font-semibold text-accent-link">{frEspace(l.marque)}</small>}
              {frEspace(l.titre)}
              {(avecDuree || l.marque) && <span className="text-text-secondary"> · {T.minutes(l.minutes)}</span>}
            </span>
            <span
              className={cn(
                "flex-none justify-self-start rounded-full border px-2 py-0.5 text-xs font-semibold",
                l.fait ? "border-accent-link text-accent-link" : "border-border-input text-text-secondary",
              )}
            >
              {l.fait ? T.fait : T.voir}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
