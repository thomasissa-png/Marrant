import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import { ETIQUETTE, META, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CARTES);

/**
 * En-tête d'une carte : « Si tu as 5 minutes », étiquette « Nouvelle » ou « À revoir », titre (maquette).
 * s26 (typo s25 §1-§2) : `ETIQUETTE` en casse normale, pastille neutre en `META` (plus de violet ni de 12 px), titre
 * en `TITRE_CARTE` (plus de 700).
 */
export function EnTeteCarte({ id, titre, nouvelle }: { id: string; titre: string; nouvelle: boolean }) {
  return (
    <div className="space-y-2">
      <p className={cn("flex flex-wrap items-center gap-2", ETIQUETTE)}>
        {T.eyebrow}
        <span className={cn("rounded-full border border-border-input px-3 py-1", META)}>{nouvelle ? T.nouvelle : T.aRevoir}</span>
      </p>
      <h2 id={id} className={TITRE_CARTE}>
        {titre}
      </h2>
    </div>
  );
}
