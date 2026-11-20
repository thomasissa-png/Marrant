import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import { TEXTES_ESPACE_NAVIGATION } from "@/config/textes/espace-navigation";
import { Badge } from "@/components/ui/badge";
import { EMOJI_CONTENU, RANGEE_PASTILLES } from "@/components/home/da-site";
import { META, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_CARTES);
const N = frEspaceProfond(TEXTES_ESPACE_NAVIGATION);

/** Émoji de S'entraîner (l'accueil n'en a pas pour l'entraînement), décoratif. */
export const EMOJI_ENTRAINER = "🎯";

/**
 * En-tête d'une carte de la rafale (S'entraîner seulement). s26 DA, s'entraîner et favoris (décision de Thomas du
 * 20/11) : la rangée des cartes « Ton contenu du jour » de l'accueil, comme la fiche de Quoi répondre : émoji, pastille
 * violette de la rubrique (« S'entraîner »), pastille neutre « Nouvelle » ou « À revoir » ; puis le titre, et
 * « Si tu as 5 minutes » en méta dessous (à la place de « 5 min » de la fiche). Mêmes textes qu'avant.
 */
export function EnTeteCarte({ id, titre, nouvelle }: { id: string; titre: string; nouvelle: boolean }) {
  return (
    <div>
      <div className={RANGEE_PASTILLES}>
        <span className={EMOJI_CONTENU} aria-hidden="true">
          {EMOJI_ENTRAINER}
        </span>
        <Badge variant="primary">{N.index.sEntrainer}</Badge>
        <Badge variant="default">{nouvelle ? T.nouvelle : T.aRevoir}</Badge>
      </div>
      <h2 id={id} className={cn("mt-4", TITRE_CARTE)}>
        {titre}
      </h2>
      <p className={cn("mt-2", META)}>{T.eyebrow}</p>
    </div>
  );
}
