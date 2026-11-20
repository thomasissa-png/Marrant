import Link from "next/link";
import { TEXTES_APERCU, TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { frEspace } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { Reassurance } from "@/components/ui/reassurance";
import { BOUTON_OFFRE_FIN, CARTE_PREMIUM, CONTOUR_FIN_LG, HaloPremium } from "@/components/espace/apercu/offre-apercu";
import { META, TITRE_CARTE } from "@/components/espace/typo";

/** s26 contrôle d'ensemble, aperçus (C3) : extraits courts, bouton de fin en contour dès 1024 (`CONTOUR_FIN_LG`). */
const EXTRAIT_COURT: readonly string[] = ["aujourdhui", "favoris"];

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
 * v7 tour 9 : 128 px dès 1024 (64 avant). La preuve passée sous les pastilles du hero l'a raccourci de 59 px (bas à
 * 377 au lieu de 436 à 1280) : sans cet air, la phrase de fin tombait à y 848 et le bouton à 892, au premier écran
 * de 900 px. Avec 128 px : phrase à 912, bouton à 956 (1280, 1456, 1920), un seul bouton d'offre au premier écran.
 * v7 tour 10 (faute 1 de la relecture design du tour 9 : ces 128 px se lisaient comme un trou) : la légende (E) monte
 * AU-DESSUS de l'extrait, en tête de section (`META`, alignée à gauche comme le H1), et n'est plus répétée dessous.
 * L'air passe à 64 px dès 1024 (`lg:mt-16`), plafond de la bande vide entre le hero et le premier élément de
 * l'extrait ; 40 px sous la légende dès 1024 (`lg:mb-10`) gardent la phrase et le bouton de fin sous le pli à 900 px
 * de haut. La légende reste plus près de ses tuiles que du hero : elle se lit comme leur titre. Sous 768 px, la légende
 * prend deux lignes (40 px) : air ramené à 24 px au-dessus et 8 px dessous (`mt-6`, `mb-2`), pour que l'étiquette et le
 * titre de la première tuile restent entiers au premier écran de 375 x 812 (16 px sous la légende à 768).
 * v7 tour 11 (relectures du tour 10 : bande hero / extrait encore lue comme un petit trou) : 48 px dès 768 (`md:mt-12`,
 * 64 avant), comme à 768 ; mesuré : à 900 px de haut (1280, 1456, 1920), le bouton de fin reste sous le premier écran.
 * v7 tour 12 (relecture design du tour 11 : légende flottante, 60 px au-dessus, 43 au-dessous, `lg:mb-10` hors du pas)
 * : dès 1024, 64 px au-dessus (`lg:mt-16`) et 24 px dessous (`lg:mb-6`, règle « titre de section vers ses cartes ») :
 * même total (88 px), la légende se rattache à l'extrait, la fin d'extrait reste sous le pli à 900 px de haut.
 * v7 tour 13 (décision de Thomas du 16/11 : 83 px entre la carte d'offre et la légende à 1280) : 48 px dès 768
 * (`md:mt-12`, plus de `lg:mt-16`) et, dès 1024, la carte d'offre descend jusqu'au bas de la colonne de texte
 * (`OffreApercu etiree`) : 48 px entre la carte et la légende comme entre le texte et la légende, 24 px sous la légende.
 * À 900 px de haut (1280, 1456, 1920), la vitrine des répliques allonge la rangée 1 : phrase et bouton de fin restent
 * sous le pli (mesures dans `INDEX.md` du tour 13).
 */
export function ExtraitCoupe({ children, href, rubrique }: { children: React.ReactNode; href: string; rubrique: string }) {
  return (
    // s26 liste et détail, tour 7 (relecture design v4, point 1 : 64 px mesurés entre les pastilles du hero et la
    // légende à 1280, la carte d'offre descendant 16 px plus bas que le texte) : dans « Quoi répondre », dès 1280 (coque
    // fixe de 1216 px), 32 px sous la carte d'offre, soit les 48 px d'air de section (Thomas) sous les pastilles.
    // s26 liste et détail, tour 8 : la colonne de texte du hero perd 8 px (24 px réguliers, `HeroApercu`) : 24 px sous la
    // carte d'offre (`xl:mt-6`), toujours 48 px sous les pastilles.
    <div className={cn("relative mt-6 md:mt-12", rubrique === "quoiRepondre" && "xl:mt-6")} data-apercu-extrait={rubrique}>
      <p className={cn("mb-2 md:mb-4 lg:mb-6", META)} data-apercu-legende>
        {frEspace(TEXTES_APERCU.sousTitre)}
      </p>
      <div
        aria-hidden="true"
        {...INERTE}
        className="pointer-events-none relative select-none overflow-hidden"
      >
        {children}
      </div>
      {/* Dès 1024 : la fin ne recouvre que 16 des 64 px transparents (`lg:-mt-4`), 48 des 96 en dessous (`-mt-12`).
          s26 (encarts Premium, Thomas 18/11, `docs/design/encarts-premium-s26.md` (b)) : la fin devient une CARTE, le
          même objet Premium que la carte d'offre (bord 2 px, ombre et halo), 448 px au plus, centrée sous l'extrait ;
          le bouton pleine largeur de la carte avec sa réassurance dessous (8 px, 16 dès 768). Le haut de la carte reste
          où était la phrase : 48 px sous la dernière tuile ; à 900 px de haut, phrase et bouton sous le premier écran.
          « Aujourd'hui » (suite à hauteur fixe, sans `entiere`) : ses 48 derniers px sont le bout du fondu, pas de l'air
          sous une tuile ; une carte posée dessus touchait la tuile coupée (0 px à 375, 32 dès 1024) : aucun
          chevauchement, la carte commence 48 px sous le point transparent du fondu.
          s26, Thomas 19/11 : bouton en contour sur fenêtre d'au moins 960 px de haut (`BOUTON_OFFRE_FIN`). */}
      <div
        className={cn(
          CARTE_PREMIUM,
          "mx-auto w-full max-w-md p-4 text-center md:p-6",
          rubrique === "aujourdhui" ? "mt-0" : "-mt-12 lg:-mt-4",
          // s26 liste et détail, tour 8 (relecture design v5, Quoi répondre point 3 : carte de 448 px centrée, bords sur
          // aucune colonne) : dès 1024, les 4 colonnes du milieu de la grille 12 de l'extrait (c5 à c8, gouttière 48 :
          // un tiers de la largeur moins 32 px), toujours centrée et sous 448 px (373 px dès 1280, 293 à 1024) ; ses
          // bords sont ceux de la tuile du milieu (« L'erreur que tout le monde fait » dès 1280, « Comment choisir » à
          // 1024). Sous 1024, inchangée.
          rubrique === "quoiRepondre" && "lg:w-[calc(100%/3_-_2rem)] lg:max-w-none",
        )}
        data-apercu-fin
      >
        <HaloPremium />
        {/* s26 contrôle d'ensemble, aperçus : bandeau violet de l'accueil (hors du flux). */}
        <div className="relative flex flex-col items-center gap-4">
          <p className={TITRE_CARTE}>{TEXTES_APERCU_VERROUILLE.suite}</p>
          <div className="w-full">
            <Link href={href} aria-label={TEXTES_APERCU.offre.nomAccessible} className={cn(BOUTON_OFFRE_FIN, "w-full", EXTRAIT_COURT.includes(rubrique) && CONTOUR_FIN_LG)} data-position="fin">
              {TEXTES_APERCU.offre.bouton}
            </Link>
            <Reassurance className={cn("mt-2 md:mt-4", META)} />
          </div>
        </div>
      </div>
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
 * v7 tour 11 (extrait « peu concret ») : le fondu commence à 9 rem (144 px, 128 avant), même point transparent : le
 * nom de l'étape conseillée, les deux premières lignes de l'accroche de la mission et « Vidéo du jour » se lisent en
 * clair avant que la suite s'efface (24 px de fondu au lieu de 40).
 * s26 tour 2 (`entiere`, rubriques Premium) : leurs tuiles de rangée 2 sont des titres fermés de 126 à 154 px, plus
 * courtes que la zone lisible : à hauteur fixe, la phrase de fin tombait à 14-18 px de la dernière tuile (768, 375), et
 * sous 768 px la tuile suivante dépassait en liseré sans titre. Avec `entiere`, la hauteur suit les tuiles (chaque page
 * ne rend que des tuiles entières : la première seule sous 768 px) et l'air dessous est fixe : 96 px, dont 48 que
 * recouvre la fin (`-mt-12`), soit 48 px entre la dernière tuile et « La suite est dans Premium » ; dès 1024, 64 px dont
 * 16 recouverts (`lg:-mt-4`), soit 48 px aussi. Le fondu suit le bas de la rangée : il efface les 24 derniers px des
 * tuiles (leur marge basse et leur bord, jamais les barres ni le titre), puis tout l'air est transparent. Sans
 * `entiere` (« Aujourd'hui ») : hauteur fixe et fondu d'avant, rendu inchangé.
 * s26 liste et détail, tour 6 : `className` en plus (aperçu de Quoi répondre : `lg:contents`, le fondu y passe dès 1024 sur
 * la grille entière de l'extrait, avec `FONDU_ENTIER_LG`) ; sans lui, rendu inchangé.
 */
export const FONDU_ENTIER_LG = "lg:pb-16 lg:[mask-image:linear-gradient(to_bottom,black_calc(100%_-_5.5rem),transparent_calc(100%_-_4rem))]";

/**
 * s26 liste et détail, tour 7 (relecture design v4 : tuiles du bas de Quoi répondre « coupées », sans bord bas) : `nette`
 * (avec `entiere`) retire le fondu : chaque tuile reste entière, bord bas compris ; l'air dessous ne change pas (96 px,
 * 64 dès 1024), la carte de fin garde ses 48 px sous la dernière tuile. Sans `nette`, rendu inchangé.
 */
export function SuiteCoupee({ children, entiere = false, nette = false, className }: { children: React.ReactNode; entiere?: boolean; nette?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "mt-6 overflow-hidden",
        entiere && nette
          ? "pb-24 lg:pb-16"
          : entiere
            ? `pb-24 [mask-image:linear-gradient(to_bottom,black_calc(100%_-_7.5rem),transparent_calc(100%_-_6rem))] ${FONDU_ENTIER_LG}`
            : // s26 contrôle d'ensemble, aperçus : l'étiquette des tuiles devient la rangée « émoji + pastille » (32 px
              // au lieu de 20) : tout le contenu des tuiles descend de 12 px, la coupe aussi (13,5 → 14,25 rem, fondu à
              // 9,75 rem) ; le point transparent retombe au même endroit du texte, entre deux lignes.
              "h-[14.25rem] [mask-image:linear-gradient(to_bottom,black_9.75rem,transparent_calc(100%_-_3rem))]",
        className,
      )}
      data-apercu-suite
    >
      {children}
    </div>
  );
}
