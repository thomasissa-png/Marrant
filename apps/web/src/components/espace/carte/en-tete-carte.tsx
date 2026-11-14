import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CARTES);

/** En-tête d'une carte : « Si tu as 5 minutes », étiquette « Nouvelle » ou « À revoir », titre (maquette). */
export function EnTeteCarte({ id, titre, nouvelle }: { id: string; titre: string; nouvelle: boolean }) {
  return (
    <div className="space-y-2">
      <p className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-muted">
        {T.eyebrow}
        <span
          className={
            nouvelle
              ? "rounded-full border border-accent-link px-2 py-0.5 text-accent-link"
              : "rounded-full border border-border-input px-2 py-0.5 text-text-secondary"
          }
        >
          {nouvelle ? T.nouvelle : T.aRevoir}
        </span>
      </p>
      <h2 id={id} className="font-display text-xl font-bold text-text-primary max-e300:text-lg">
        {titre}
      </h2>
    </div>
  );
}
