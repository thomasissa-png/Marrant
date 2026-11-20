import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_FICHE, TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import { entreGuillemets } from "@/components/espace/carte/citation";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { categoriesQuoiRepondre, ficheApercu } from "@/components/espace/apercu/exemples";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { SuiteCoupee } from "@/components/espace/apercu/extrait-coupe";
import { RepliquesFermees, type RegistreReplique } from "@/components/espace/apercu/repliques-fermees";
import { BarresFermees } from "@/components/espace/apercu/blocs-fermes";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { SignalOffre } from "@/components/espace/apercu/signal-offre";
import { PASTILLE, TUILE } from "@/components/espace/aujourdhui/tableau";
import { FILET_CARTE } from "@/components/espace/carte/styles";
import { Badge } from "@/components/ui/badge";
import { EMOJI_CONTENU, RANGEE_PASTILLES } from "@/components/home/da-site";
import { ETIQUETTE, TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";

const Q = frEspaceProfond(TEXTES_QUOI_REPONDRE);
const C = frEspaceProfond(TEXTES_CARTES);
const F = frEspaceProfond(TEXTES_FICHE);

/** Spec s26 §1.1 : six pastilles, dans l'ordre, toutes reprises des constantes existantes. */
export const PASTILLES_QUOI_REPONDRE = [Q.filtreOu, Q.filtrePour, C.registres.sure, C.registres.joueuse, C.registres.risquee, Q.carnet] as const;

/**
 * Ce qui sort de la fiche désignée (`coloc-la-poele`) : la partie EN CLAIR seulement (titre, scène, la réplique qu'on te
 * lance) et les CLÉS des registres. Jamais `repliques.*.texte`, `.pourquoi`, `quandMonterDUnCran`, `erreur`,
 * `scene.suite` ni `geste` : ils ne quittent pas cette fonction (test Jest `apercus-s26-verrou`).
 */
function situationEnClair() {
  const fiche = ficheApercu("quoiRepondre");
  if (fiche.type !== "situation") throw new Error("Aperçu Quoi répondre : la fiche désignée doit être une situation");
  return {
    titre: fiche.titre,
    scene: fiche.contenu.scene.texte,
    onTeDit: fiche.contenu.scene.onTeDit ?? null,
    registres: Object.keys(fiche.contenu.repliques) as RegistreReplique[],
  };
}

/**
 * Pastille inerte avec son effectif réel (lecture des fichiers validés, `categoriesQuoiRepondre`).
 * s26 (mission 2) : dès 1024 px, une pastille ne passe plus sur deux lignes (`lg:whitespace-nowrap`) ; à 1024, la plus
 * longue (« Commerces, voisins, transports 5 », 250 px) mord de 7 px sur la marge droite de 24 px de la tuile (243 px
 * utiles), rien n'est coupé. Sous 1024, la tuile est pleine largeur : le retour à la ligne reste permis (texte à 200 %).
 */
function PastilleEffectif({ libelle, nombre }: { libelle: string; nombre?: number }) {
  return (
    <li className={cn(PASTILLE, "lg:whitespace-nowrap")}>
      {libelle}
      {nombre !== undefined && <span className="tabular-nums text-text-primary">{nombre}</span>}
    </li>
  );
}

/**
 * Groupe « Pour quoi faire ? » et ses cinq valeurs, en pastilles inertes (écart de 8 px, comme « Où et avec qui ? »).
 * s26 liste et détail, tour 5 (relecture design v2 D10 : pastilles du tour 4 réparties en `justify-between`, trous de
 * 90 px entre elles à 1280) : écarts normaux ; dès 1024, c'est la tuile qui prend la largeur de son contenu (rangée 2).
 */
function FiltresPour({ className, pleineLargeur = false }: { className?: string; pleineLargeur?: boolean }) {
  return (
    <>
      <p className={cn(className, ETIQUETTE)}>{Q.filtrePour}</p>
      {/* s26 liste et détail, tour 6 : sur toute la largeur (dès 1280), cinq colonnes égales, pastilles étirées à leur
          colonne et texte centré : la rangée finit sur le bord de la carte, aucun vide à droite ni trou entre elles. */}
      <ul className={cn("mt-2 flex flex-wrap gap-2", pleineLargeur && "grid grid-cols-5 [&>li]:justify-center")}>
        {Object.entries(Q.pourQuoiFaire).map(([cle, libelle]) => (
          <PastilleEffectif key={cle} libelle={libelle} />
        ))}
      </ul>
    </>
  );
}

/**
 * s26 liste et détail, tour 6 (relecture design v3, point 3 : titres des tuiles fermées lus plus gros que celui de la
 * carte d'exemple, tous deux à 20 px) : titre fermé en `TEXTE_FORT` (16/600), un cran sous le titre de la carte
 * d'exemple (`TITRE_CARTE`, 20/600) ; effectif et barres comme `TitreFerme` (les autres aperçus le gardent).
 */
function TitreFermeSecondaire({ titre, effectif }: { titre: string; effectif?: number }) {
  return (
    <>
      <h2 className={cn("pr-8", TEXTE_FORT)}>
        {titre}
        {effectif !== undefined && <span className="ml-2 tabular-nums text-text-secondary">{effectif}</span>}
      </h2>
      <BarresFermees />
    </>
  );
}

function ExtraitQuoiRepondre() {
  const s = situationEnClair();
  const groupes = categoriesQuoiRepondre();
  const lieux = groupes.filter((g) => g.cle !== "sans-lieu");
  const aPlat = groupes.find((g) => g.cle === "sans-lieu");
  return (
    // s26 liste et détail, tour 6 (relectures v3 : vides à droite de « Pour quoi faire ? » et sous « Où et avec qui ? »,
    // bord droit à x 920 aligné sur rien) : dès 1024, UNE grille 12 colonnes pour tout l'extrait (rangées et suite en
    // `lg:contents`), le fondu passe sur elle (`FONDU_ENTIER_LG`, mêmes valeurs que la suite). Deux compositions, chaque
    // bord sur la grille 8/4 (et 4/4/4) de la page, mesurées (vide ≤ 32 px) :
    // - 1024 à 1279 (colonne de droite de 293 px) : à gauche, l'exemple, « L'erreur… » (8), puis « Rattraper… » et
    //   « Comment choisir » (4/4) ; à droite, une seule carte des deux groupes de filtres, sur les trois rangées
    //   (filtres 618 px, colonne de gauche 612 px) ;
    // - dès 1280 (1920 identique, coque de 1216 px) : l'exemple et « Où et avec qui ? » (8/4), « Pour quoi faire ? » sur
    //   toute la largeur en cinq colonnes égales, puis les trois tuiles fermées 4/4/4.
    // Écartée (mesurée) : les deux groupes dans une carte à droite dès 1280 (438 px contre 320 pour l'exemple, 118 px
    // de vide sous l'exemple ; 618 contre 320 à 1024). Sous 1024 : rendu du tour 5.
    // s26 liste et détail, tour 7 (relecture design v4, point 2, et spec `espace-v6-tour2-lot1` : 4 tuiles coupées sous le
    // fondu de la grille entière, la suite en `lg:contents` n'avait plus de boîte) : la suite redevient une boîte, sur
    // les colonnes de la grille (`grid-cols-subgrid`, mêmes bords et gouttières), et l'extrait n'a plus de fondu : chaque
    // tuile est entière, bord bas compris (`SuiteCoupee nette`).
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 lg:gap-y-6" data-apercu-fiche="coloc-la-poele">
      {/* s26 liste et détail, tour 1 (spec UX §1) : clic sur une partie fermée, contour sur la carte d'offre. */}
      <SignalOffre />
      {/* s26 liste et détail, tour 3 (mesures N2 : vide de fin de la situation 159 px à 1280 et 1920, 115 à 1024) : les
          deux tuiles ne s'étirent plus (`items-start`, `h-auto`), chacune finit 24 px sous son dernier bloc. Les deux
          règles se contredisaient ici (même hauteur dans une rangée / aucun vide visible en fin de carte : situation
          320 px, filtres 394 à 1024 et 438 dès 1280, texte fixe) : l'absence de vide prime (Thomas, 19/11). Écart des
          bas rééquilibré : dès 1024, « Pour quoi faire ? » passe en rangée 2 (filtres 286 dès 1280, 34 px de moins que
          la situation au lieu de 118 de plus) ; à 1024, 74 px (la colonne 4/12 de Thomas, 18/11, ne descend pas plus). */}
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:contents" data-apercu-rangee="1">
        <TuileFermee nette className="h-auto md:col-span-2 lg:col-span-8 lg:col-start-1 lg:row-start-1 xl:h-full">
          {/* s26 DA du site (décision de Thomas du 20/11) : même famille que la fiche de l'abonné (filet violet, émoji,
              pastille violette du type), texte inchangé. */}
          <div className={cn(TUILE, FILET_CARTE)} data-apercu-situation>
            <p className={RANGEE_PASTILLES}>
              <span className={EMOJI_CONTENU} aria-hidden="true">
                ⚡️
              </span>
              <Badge variant="primary">{F.types.situation}</Badge>
            </p>
            <h2 className={cn("mt-4 pr-8", TITRE_CARTE)}>{frEspace(s.titre)}</h2>
            <p className={cn("mt-4", TEXTE)}>{frEspace(s.scene)}</p>
            {s.onTeDit && <p className={cn("mt-2", TEXTE_FORT)}>{frEspace(entreGuillemets(s.onTeDit))}</p>}
            <RepliquesFermees registres={s.registres} />
          </div>
        </TuileFermee>
        <TuileFermee className="h-auto md:col-span-2 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 xl:row-span-1">
          <div className={TUILE} data-apercu-filtres>
            <p className={cn("pr-8", ETIQUETTE)}>{Q.filtreOu}</p>
            {/* s26 liste et détail, tour 6 : dès 1280, 16 px entre les lignes de pastilles (8 avant) : la carte passe de
                286 à 326 px, à 6 px de l'exemple (320, étiré à 326) au lieu de 34 px de vide dessous. */}
            <ul className="mt-2 flex flex-wrap gap-2 xl:gap-y-4">
              {lieux.map((g) => (
                <PastilleEffectif key={g.cle} libelle={frEspace(g.titre)} nombre={g.nombre} />
              ))}
            </ul>
            <div className="xl:hidden">
              <FiltresPour className="mt-6" />
            </div>
          </div>
        </TuileFermee>
      </div>
      {/* s26 tour 2 : tuiles entières seulement (`entiere`), la première seule sous 768 px (jamais un liseré sans titre) ;
          « Rattraper un faux pas » sans le pied « Le carnet du mois » (il se lisait comme un lien actif et touchait les
          barres) : titre, effectif, verrou et barres, comme ses voisines. */}
      {/* s26 liste et détail, tour 7 : la suite occupe la rangée 2 de la grille de l'extrait (8 colonnes de 1024 à 1279, à
          côté de la carte des filtres ; 12 dès 1280) et y pose ses propres rangées, numérotées depuis 1. */}
      <SuiteCoupee entiere nette className="lg:col-span-8 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:grid lg:grid-cols-subgrid lg:items-start lg:gap-x-12 lg:gap-y-6 xl:col-span-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:contents" data-apercu-rangee="2">
          {/* s26 (mission 2) : de 1024 à 1279, la colonne 4/12 (293 px à 1024) empilait les deux groupes de filtres et
              allongeait la rangée 1 à 618 px (vide sous la situation) ; « Pour quoi faire ? » passe ici, en tête de la
              rangée 2, sur toute la largeur (une ligne de pastilles). Ailleurs, il reste sous « Où et avec qui ? ».
              s26 liste et détail, tour 3 : dès 1024 (plus seulement jusqu'à 1279), voir la rangée 1. Titres fermés
              (vide de fin 52 px à 768 et 1024 : un titre sur une ligne étiré à côté d'un titre sur deux) : chaque rangée
              n'a que des titres d'un même nombre de lignes. 768 : « L'erreur que tout le monde fait » (289 px de texte,
              266 de place en demi-largeur) passe sur toute la largeur, en dernier ; 1024 : 6/6 puis « Comment choisir »
              sur toute la largeur (en 4/12, 211 px de place : deux titres sur deux lignes, un sur une) ; dès 1280, 4/4/4
              (une ligne chacun). Extrait inerte et masqué aux lecteurs d'écran : l'ordre visuel ne change rien à la
              lecture. */}
          {/* s26 liste et détail, tour 5 (relecture design v2 D10) : dès 1024, la tuile à la largeur de son contenu (une
              ligne de pastilles), calée à gauche sur le bord des tuiles de dessous : plus aucun vide dans la tuile. Choisi
              contre une autre composition (pastilles en 8 à côté d'une tuile en 4) : à 1280, 795 px de place pour 838 px de
              pastilles, donc deux lignes et un trou en fin de la première. L'air reste hors du cadre, à droite. */}
          {/* s26 liste et détail, tour 6 : la tuile à la largeur de ses pastilles (tour 5) laissait 327 px vides à droite
              et un bord à x 920 ; dès 1280, toute la largeur, pastilles en cinq colonnes égales (`pleineLargeur`). */}
          <TuileFermee className="hidden xl:col-span-12 xl:col-start-1 xl:row-start-1 xl:block">
            <div className={TUILE} data-apercu-filtres-pour>
              <FiltresPour pleineLargeur />
            </div>
          </TuileFermee>
          <TuileFermee className="lg:col-span-4 lg:col-start-1 lg:row-start-2">
            <div className={TUILE}>
              <TitreFermeSecondaire titre={Q.pourQuoiFaire["rattraper-faux-pas"]} effectif={aPlat?.nombre} />
            </div>
          </TuileFermee>
          <TuileFermee className="max-md:hidden md:col-span-2 md:max-lg:order-last lg:col-span-8 lg:col-start-1 lg:row-start-1 xl:col-span-4 xl:col-start-5 xl:row-start-2">
            <div className={TUILE}>
              <TitreFermeSecondaire titre={F.erreur} />
            </div>
          </TuileFermee>
          <TuileFermee className="max-md:hidden lg:col-span-4 lg:col-start-5 lg:row-start-2 xl:col-start-9">
            <div className={TUILE}>
              <TitreFermeSecondaire titre={F.commentChoisir} />
            </div>
          </TuileFermee>
        </div>
      </SuiteCoupee>
    </div>
  );
}

/**
 * Aperçu VERROUILLÉ de « Quoi répondre » (s26, `docs/ux/rubriques-premium-s26.md` §1.1), sur le squelette validé
 * d'« Aujourd'hui » (`ApercuVerrouille`) : hero 8/4 et offre en haut, puis la situation désignée en clair avec ses
 * trois répliques fermées (8) et l'étendue du catalogue en filtres inertes avec leurs effectifs (4) ; sous le fondu,
 * « Rattraper un faux pas », « L'erreur que tout le monde fait » et « Comment choisir » en titres fermés (4/4/4).
 * s26 (décision de Thomas du 18/11) : 8/4 au lieu de 7/5 et gouttière de 48 px dès 1024, la grille du hero (bords de
 * la carte d'offre pour les filtres, du texte du hero pour la situation).
 */
export function ApercuQuoiRepondre({ visiteur }: { visiteur: boolean }) {
  return (
    <ApercuVerrouille
      rubrique="quoiRepondre"
      visiteur={visiteur}
      promesse={frEspace(TEXTES_APERCU_VERROUILLE.promesseQuoiRepondre)}
      pastilles={PASTILLES_QUOI_REPONDRE}
    >
      <ExtraitQuoiRepondre />
    </ApercuVerrouille>
  );
}
