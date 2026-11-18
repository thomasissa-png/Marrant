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
import { TitreFerme } from "@/components/espace/apercu/blocs-fermes";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { PASTILLE, TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, TEXTE, TEXTE_FORT } from "@/components/espace/typo";

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

/** Groupe « Pour quoi faire ? » et ses cinq valeurs, en pastilles inertes. */
function FiltresPour({ className }: { className?: string }) {
  return (
    <>
      <p className={cn(className, ETIQUETTE)}>{Q.filtrePour}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {Object.entries(Q.pourQuoiFaire).map(([cle, libelle]) => (
          <PastilleEffectif key={cle} libelle={libelle} />
        ))}
      </ul>
    </>
  );
}

function ExtraitQuoiRepondre() {
  const s = situationEnClair();
  const groupes = categoriesQuoiRepondre();
  const lieux = groupes.filter((g) => g.cle !== "sans-lieu");
  const aPlat = groupes.find((g) => g.cle === "sans-lieu");
  return (
    <div data-apercu-fiche="coloc-la-poele">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="1">
        <TuileFermee nette className="md:col-span-2 lg:col-span-8">
          <div className={TUILE} data-apercu-situation>
            <p className={ETIQUETTE}>{F.types.situation}</p>
            <h2 className={cn("pr-8", TITRE_TUILE)}>{frEspace(s.titre)}</h2>
            <p className={cn("mt-4", TEXTE)}>{frEspace(s.scene)}</p>
            {s.onTeDit && <p className={cn("mt-2", TEXTE_FORT)}>{frEspace(entreGuillemets(s.onTeDit))}</p>}
            <RepliquesFermees registres={s.registres} />
          </div>
        </TuileFermee>
        <TuileFermee className="md:col-span-2 lg:col-span-4">
          <div className={TUILE} data-apercu-filtres>
            <p className={cn("pr-8", ETIQUETTE)}>{Q.filtreOu}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {lieux.map((g) => (
                <PastilleEffectif key={g.cle} libelle={frEspace(g.titre)} nombre={g.nombre} />
              ))}
            </ul>
            <div className="lg:max-xl:hidden">
              <FiltresPour className="mt-6" />
            </div>
          </div>
        </TuileFermee>
      </div>
      {/* s26 tour 2 : tuiles entières seulement (`entiere`), la première seule sous 768 px (jamais un liseré sans titre) ;
          « Rattraper un faux pas » sans le pied « Le carnet du mois » (il se lisait comme un lien actif et touchait les
          barres) : titre, effectif, verrou et barres, comme ses voisines. */}
      <SuiteCoupee entiere>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="2">
          {/* s26 (mission 2) : de 1024 à 1279, la colonne 4/12 (293 px à 1024) empilait les deux groupes de filtres et
              allongeait la rangée 1 à 618 px (vide sous la situation) ; « Pour quoi faire ? » passe ici, en tête de la
              rangée 2, sur toute la largeur (une ligne de pastilles). Ailleurs, il reste sous « Où et avec qui ? ». */}
          <TuileFermee className="hidden lg:col-span-12 lg:max-xl:block">
            <div className={TUILE} data-apercu-filtres-pour>
              <FiltresPour />
            </div>
          </TuileFermee>
          <TuileFermee className="lg:col-span-4">
            <div className={TUILE}>
              <TitreFerme titre={Q.pourQuoiFaire["rattraper-faux-pas"]} effectif={aPlat?.nombre} />
            </div>
          </TuileFermee>
          <TuileFermee className="max-md:hidden lg:col-span-4">
            <div className={TUILE}>
              <TitreFerme titre={F.erreur} />
            </div>
          </TuileFermee>
          <TuileFermee className="max-md:hidden md:col-span-2 lg:col-span-4">
            <div className={TUILE}>
              <TitreFerme titre={F.commentChoisir} />
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
