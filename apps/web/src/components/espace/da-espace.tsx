import { Badge } from "@/components/ui/badge";
import { BANDEAU_ACCUEIL, BANDEAU_ACCUEIL_CENTRE, BANDEAU_ACCUEIL_INVERSE, EMOJI_CONTENU, RANGEE_PASTILLES } from "@/components/home/da-site";
import { cn } from "@/lib/utils";

/**
 * s26 DA, aujourd'hui questions répliques (décision de Thomas du 20/11 : « la DA, c'est celle des pages déjà validées,
 * avec du violet ») : petites briques de l'accueil pour les cartes d'Aujourd'hui, de Mes questions et de Mes répliques
 * (espace ouvert seulement). Le bandeau et l'émoji viennent de `components/home/da-site.tsx`, jamais recopiés ; aucune
 * couleur ni taille neuve. Aucun « use client » : serveur comme navigateur.
 */

/** Les trois bandeaux de l'accueil (vanne, conseil, vidéo), dans cet ordre. */
export const BANDEAUX = { accueil: BANDEAU_ACCUEIL, inverse: BANDEAU_ACCUEIL_INVERSE, centre: BANDEAU_ACCUEIL_CENTRE } as const;

/**
 * Bandeau violet de 4 px posé sur le haut d'une carte, hors du flux (comme la carte « En cours » de Parcours) : marges,
 * hauteurs et grilles internes des cartes inchangées. La carte doit être `relative overflow-hidden` (cadres de l'espace).
 * s26 finition avant lancement (décision de Thomas du 20/11, point 4) : RÉSERVÉ à la carte principale de chaque écran
 * (Aujourd'hui : l'action du jour ; fiche ouverte ; carte « En cours » ; étape ouverte ; carte de situation ; fil ouvert ;
 * carte d'offre des aperçus). Les autres cartes : cadre neutre, émoji et pastille violette (`PastillesDa`).
 */
export function Bandeau({ variante = "accueil" }: { variante?: keyof typeof BANDEAUX }) {
  return <div aria-hidden="true" className={cn(BANDEAUX[variante], "absolute inset-x-0 top-0")} data-bandeau-da="" />;
}

/**
 * Rangée « émoji + pastille violette » en tête de carte, comme « Ton contenu du jour » de l'accueil : l'étiquette de la
 * carte (texte existant) passe en pastille violette (`Badge` primaire) ; `suite` = ce qui suit sur la même ligne (durée,
 * date, pastille neutre). `pastille` peut être un titre (`as`) pour garder la structure des titres de la page.
 */
export function PastillesDa({
  emoji,
  pastille,
  suite,
  className,
  as: Balise = "div",
  id,
}: {
  emoji?: string | null;
  pastille: React.ReactNode;
  suite?: React.ReactNode;
  className?: string;
  as?: "div" | "h2" | "h3" | "p" | "span";
  id?: string;
}) {
  return (
    // Rangée de 32 px (hauteur de ligne de l'émoji), avec ou sans émoji : deux cartes voisines gardent leurs étiquettes
    // et leurs titres sur la même ligne. Pastille en 14/600 (échelle de l'espace, `typo.ts` : 4 tailles, 400 et 600 ;
    // l'accueil l'écrit en 12/500, hors échelle) ; la forme et les couleurs sont celles de l'accueil.
    // Sous 300 px (200 % de texte, test N4) : émoji masqué et pastille sans marge verticale, l'action reste au premier écran.
    <Balise id={id} className={cn(RANGEE_PASTILLES, "min-h-8 max-e300:min-h-0", className)} data-pastilles-da="">
      {emoji && (
        <span className={cn(EMOJI_CONTENU, "max-e300:hidden")} aria-hidden="true">
          {emoji}
        </span>
      )}
      <Badge variant="primary" className="max-w-full whitespace-normal text-sm font-semibold max-e300:py-0">
        {pastille}
      </Badge>
      {suite}
    </Balise>
  );
}
