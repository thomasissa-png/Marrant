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
import { Chevron, PASTILLE, PIED_TUILE_GABARIT, TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META_FORT, TEXTE, TEXTE_FORT } from "@/components/espace/typo";

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

/** Pastille inerte avec son effectif réel (lecture des fichiers validés, `categoriesQuoiRepondre`). */
function PastilleEffectif({ libelle, nombre }: { libelle: string; nombre?: number }) {
  return (
    <li className={PASTILLE}>
      {libelle}
      {nombre !== undefined && <span className="tabular-nums text-text-primary">{nombre}</span>}
    </li>
  );
}

function ExtraitQuoiRepondre() {
  const s = situationEnClair();
  const groupes = categoriesQuoiRepondre();
  const lieux = groupes.filter((g) => g.cle !== "sans-lieu");
  const aPlat = groupes.find((g) => g.cle === "sans-lieu");
  return (
    <div data-apercu-fiche="coloc-la-poele">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-rangee="1">
        <TuileFermee nette className="md:col-span-2 lg:col-span-7">
          <div className={TUILE} data-apercu-situation>
            <p className={ETIQUETTE}>{F.types.situation}</p>
            <h2 className={cn("pr-8", TITRE_TUILE)}>{frEspace(s.titre)}</h2>
            <p className={cn("mt-4", TEXTE)}>{frEspace(s.scene)}</p>
            {s.onTeDit && <p className={cn("mt-2", TEXTE_FORT)}>{frEspace(entreGuillemets(s.onTeDit))}</p>}
            <RepliquesFermees registres={s.registres} />
          </div>
        </TuileFermee>
        <TuileFermee className="md:col-span-2 lg:col-span-5">
          <div className={TUILE} data-apercu-filtres>
            <p className={cn("pr-8", ETIQUETTE)}>{Q.filtreOu}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {lieux.map((g) => (
                <PastilleEffectif key={g.cle} libelle={frEspace(g.titre)} nombre={g.nombre} />
              ))}
            </ul>
            <p className={cn("mt-6", ETIQUETTE)}>{Q.filtrePour}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {Object.entries(Q.pourQuoiFaire).map(([cle, libelle]) => (
                <PastilleEffectif key={cle} libelle={libelle} />
              ))}
            </ul>
          </div>
        </TuileFermee>
      </div>
      <SuiteCoupee>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-rangee="2">
          <TuileFermee className="lg:col-span-4">
            <div className={TUILE}>
              <TitreFerme titre={Q.pourQuoiFaire["rattraper-faux-pas"]} effectif={aPlat?.nombre} />
              <div className={`${PIED_TUILE_GABARIT} ${META_FORT}`}>
                {Q.carnet}
                <Chevron />
              </div>
            </div>
          </TuileFermee>
          <TuileFermee className="lg:col-span-4">
            <div className={TUILE}>
              <TitreFerme titre={F.erreur} />
            </div>
          </TuileFermee>
          <TuileFermee className="md:col-span-2 lg:col-span-4">
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
 * trois répliques fermées (7) et l'étendue du catalogue en filtres inertes avec leurs effectifs (5) ; sous le fondu,
 * « Rattraper un faux pas », « L'erreur que tout le monde fait » et « Comment choisir » en titres fermés (4/4/4).
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
