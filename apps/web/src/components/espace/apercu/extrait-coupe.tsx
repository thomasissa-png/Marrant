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
 * (C) la structure réelle de la rubrique, inerte et masquée aux lecteurs d'écran (la promesse et les pastilles du hero
 * portent le contenu), coupée par un fondu vers le fond de la page (aucun voile, aucun flou, rien d'animé) ; (D) en
 * SIBLING sur les 48 derniers px transparents : pastille, « La suite est dans Premium », second bouton (même libellé,
 * même lien que le hero) ; (E) la légende validée.
 * v7 tour 2 (faute 4) : la hauteur n'est plus plafonnée ici (320, 400, 440 px) : à 375 et 768, « Ton cap » passait
 * sous le fondu. L'extrait fournit sa propre coupe (`SuiteCoupee`) : ce qui doit se lire reste entier, seule la suite
 * passe sous le fondu, qui finit entre deux lignes de texte.
 */
export function ExtraitCoupe({ children, href, rubrique }: { children: React.ReactNode; href: string; rubrique: string }) {
  return (
    <div className="relative mt-8 md:mt-10" data-apercu-extrait={rubrique}>
      <div
        aria-hidden="true"
        {...INERTE}
        className="pointer-events-none relative select-none overflow-hidden"
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

/**
 * La suite de l'extrait, coupée (v7 tour 2, faute 4) : 10 rem de haut, opaque en haut, ENTIÈREMENT transparente sur
 * ses 48 derniers px (la fin d'extrait, `-mt-12`, les chevauche ; spec design §3.3). Le fondu va de 0 à 112 px : il
 * couvre l'étiquette, le titre et la barre d'étapes des tuiles (ou le titre et la première ligne de « Contenu du
 * jour ») et finit dans l'interligne qui suit (88 à 108 px, puis 115 px et plus) : jamais au milieu d'une ligne.
 */
export function SuiteCoupee({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-6 h-40 overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent_calc(100%_-_3rem))]"
      data-apercu-suite
    >
      {children}
    </div>
  );
}
