import Link from "next/link";
import { TEXTES_APERCU, TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { frEspace } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { BOUTON_OFFRE } from "@/components/espace/apercu/offre-apercu";
import { META, TITRE_CARTE } from "@/components/espace/typo";

/** `inert` (hors des types de React 18.3) : posé tel quel, l'extrait sort de la tabulation et des clics. */
const INERTE = { inert: "" } as Record<string, string>;

/**
 * Extrait coupé de l'aperçu verrouillé, zones C, D et E (refonte s25, spec UX §2.2, design §3.3) :
 * (C) la structure réelle de la rubrique, inerte et masquée aux lecteurs d'écran (la promesse et les pastilles du hero
 * portent le contenu), coupée par un fondu vers le fond de la page (aucun voile, aucun flou, rien d'animé) ; (D) en
 * SIBLING sur les 48 derniers px transparents : « La suite est dans Premium », second bouton (même libellé, même lien
 * que le hero) ; (E) la légende validée. Échelle s25 : plus de pastille ici (un seul repère, celui du hero), phrase en
 * `TITRE_CARTE`, légende en `META` ; 48 px au-dessus de l'extrait, 64 dès 1024 px (valeurs du pas de 8 px) : à 900 px
 * de haut, toute la fin d'extrait (phrase et bouton) reste sous le premier écran, un seul « Premium » écrit hors offre.
 * v7 tour 2 (faute 4) : la hauteur n'est plus plafonnée ici (320, 400, 440 px) : à 375 et 768, « Ton cap » passait
 * sous le fondu. L'extrait fournit sa propre coupe (`SuiteCoupee`) : ce qui doit se lire reste entier, seule la suite
 * passe sous le fondu, qui finit entre deux lignes de texte.
 * v7 tour 3 (faute 2) : 80 px au-dessus de l'extrait dès 1024 px : à 900 px de haut (1280, 1456, 1920), le bouton de
 * la fin d'extrait reste sous le premier écran ; jamais deux boutons d'offre pleins visibles ensemble.
 * v7 tour 8 (point 4) : 32 px seulement sous 768 px, pour que la première tuile tienne au premier écran à 375.
 */
export function ExtraitCoupe({ children, href, rubrique }: { children: React.ReactNode; href: string; rubrique: string }) {
  return (
    <div className="relative mt-8 md:mt-12 lg:mt-16" data-apercu-extrait={rubrique}>
      <div
        aria-hidden="true"
        {...INERTE}
        className="pointer-events-none relative select-none overflow-hidden"
      >
        {children}
      </div>
      {/* Dès 1024 : la fin ne recouvre que 32 des 48 px transparents (16 px d'air en plus, invisibles) : à 900 px de
          haut, la phrase « La suite est dans Premium » tombe entière sous le premier écran (elle l'effleurait à 1 px). */}
      <div className="relative -mt-12 flex flex-col items-center gap-4 px-4 text-center lg:-mt-8" data-apercu-fin>
        <p className={TITRE_CARTE}>{TEXTES_APERCU_VERROUILLE.suite}</p>
        <Link href={href} aria-label={TEXTES_APERCU.offre.nomAccessible} className={cn(BOUTON_OFFRE, "w-full sm:w-auto sm:min-w-64")} data-position="fin">
          {TEXTES_APERCU.offre.bouton}
        </Link>
      </div>
      <p className={cn("mt-6 text-center", META)}>{frEspace(TEXTES_APERCU.sousTitre)}</p>
    </div>
  );
}

/**
 * La suite de l'extrait, coupée (v7 tour 3, faute 1). Échelle s25 : tuiles en 24 px de marge et titres de 20 px, donc
 * 13,5 rem de haut et un fondu qui commence à 8 rem (128 px), 16 px plus bas qu'avant (12,5 et 7 rem) : le point
 * transparent (168 px) tombe entre deux lignes de chaque tuile (titre de l'étape et pied, 2e et 3e ligne du contenu du
 * jour, accroche de la mission coupée avant). Hauteur fixe : au-dessus,
 * chaque tuile de la rangée 2 se lit en clair (étiquette, titre, barre d'étapes avec « Étape n sur N », titre de la
 * mission, « Vanne du jour »). De 128 px au point transparent, la suite s'efface (début du corps : titre de l'étape,
 * accroche de la mission, « Conseil du jour ») ; les 48 derniers px sont ENTIÈREMENT transparents (la fin d'extrait,
 * `-mt-12`, les chevauche ; spec design §3.3). Le point transparent tombe dans un interligne (aucune ligne à cheval,
 * vérifié par les tests en vrai navigateur) : jamais un fragment seul, jamais un bord bas coupé net.
 */
export function SuiteCoupee({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-6 h-[13.5rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_8rem,transparent_calc(100%_-_3rem))]"
      data-apercu-suite
    >
      {children}
    </div>
  );
}
