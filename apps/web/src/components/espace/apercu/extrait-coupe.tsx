import Link from "next/link";
import { TEXTES_APERCU, TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { frEspace } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { BadgePremium } from "@/components/espace/apercu/badge-premium";
import { BOUTON_OFFRE } from "@/components/espace/apercu/offre-apercu";

/** `inert` (hors des types de React 18.3) : posé tel quel, l'extrait sort de la tabulation et des clics. */
const INERTE = { inert: "" } as Record<string, string>;

/**
 * Extrait coupé de l'aperçu verrouillé, zones C, D et E (refonte s25, spec UX §2.2, design §3.3) :
 * (C) la structure réelle de la rubrique, hauteur plafonnée (320, 400, 440 px), fondu par masque vers le fond de la
 * page (aucun voile, aucun flou, rien d'animé), inerte et masquée aux lecteurs d'écran (la promesse et les pastilles
 * du hero portent le contenu) ; (D) en SIBLING sur les 48 derniers px transparents : pastille, « La suite est dans
 * Premium », second bouton (même libellé, même lien que le hero) ; (E) la légende validée.
 */
export function ExtraitCoupe({ children, href, rubrique }: { children: React.ReactNode; href: string; rubrique: string }) {
  return (
    <div className="relative mt-8 md:mt-10" data-apercu-extrait={rubrique}>
      <div
        aria-hidden="true"
        {...INERTE}
        className={cn(
          "pointer-events-none relative h-80 select-none overflow-hidden md:h-[25rem] lg:h-[27.5rem]",
          "[mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]",
        )}
      >
        {children}
      </div>
      <div className="relative -mt-12 flex flex-col items-center gap-3 px-4 text-center" data-apercu-fin>
        <BadgePremium grand />
        <p className="font-display text-xl font-bold text-text-primary md:text-2xl">{TEXTES_APERCU_VERROUILLE.suite}</p>
        <Link href={href} aria-label={TEXTES_APERCU.offre.nomAccessible} className={cn(BOUTON_OFFRE, "w-full sm:w-auto sm:min-w-64")} data-position="fin">
          {TEXTES_APERCU.offre.bouton}
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-text-secondary">{frEspace(TEXTES_APERCU.sousTitre)}</p>
    </div>
  );
}
