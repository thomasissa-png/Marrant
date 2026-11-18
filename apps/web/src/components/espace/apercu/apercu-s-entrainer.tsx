import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_FICHE } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARTES, TEXTES_MISSION } from "@/config/textes/espace-cartes";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { SuiteCoupee } from "@/components/espace/apercu/extrait-coupe";
import { Verrou } from "@/components/espace/apercu/badge-premium";
import { BlocsFermes, TitreFerme } from "@/components/espace/apercu/blocs-fermes";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META, META_FORT, TEXTE } from "@/components/espace/typo";

const C = frEspaceProfond(TEXTES_CARTES);
const F = frEspaceProfond(TEXTES_FICHE);
const M = TEXTES_MISSION;

/** Spec s26 §3.1 : cinq pastilles, reprises des constantes existantes. */
export const PASTILLES_S_ENTRAINER = [C.eyebrow, C.reponseDabord, F.ceQuOnAuraitPuDire, frEspace(M.titre), frEspace(M.aPlat)] as const;

const MARCHES = [1, 2, 3, 4, 5] as const;

/**
 * Ce qui sort du jeu désigné (`quelle-replique-1`) : le titre, la consigne et les trois propositions, rien d'autre.
 * Jamais `ceQuOnAuraitPuDire` (la lettre juste), `explication` ni `geste` (test Jest `apercus-s26-verrou`).
 */
function jeuEnClair() {
  const fiche = ficheApercu("sEntrainer");
  if (fiche.type !== "jeu") throw new Error("Aperçu S'entraîner : la fiche désignée doit être un jeu");
  return { titre: fiche.titre, consigne: fiche.contenu.consigne, propositions: fiche.contenu.matiere ?? [] };
}

/** L'échelle des cinq marches : libellés existants (`marche(n)`, `titresMarches`), la 1 ouverte, les autres verrouillées. */
function EchelleMarches() {
  return (
    <ol className="mt-4 flex flex-col gap-4 md:grid md:grid-cols-5 lg:flex lg:flex-col" data-apercu-marches>
      {MARCHES.map((n) => (
        <li key={n} className="flex min-w-0 items-start justify-between gap-2" data-marche={n} data-marche-ouverte={n === 1 ? "" : undefined}>
          <div className="min-w-0">
            <p className={META}>{frEspace(M.marche(n))}</p>
            <p className={META_FORT}>{frEspace(M.titresMarches[n])}</p>
          </div>
          {n > 1 && <Verrou />}
        </li>
      ))}
    </ol>
  );
}

function ExtraitSEntrainer() {
  const j = jeuEnClair();
  return (
    <div data-apercu-fiche="quelle-replique-1">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-rangee="1">
        <TuileFermee nette className="md:col-span-2 lg:col-span-7">
          <div className={TUILE} data-apercu-jeu>
            <p className={ETIQUETTE}>{C.eyebrow}</p>
            <h2 className={cn("pr-8", TITRE_TUILE)}>{frEspace(j.titre)}</h2>
            <p className={cn("mt-4", TEXTE)}>{frEspace(j.consigne)}</p>
            <ul className="mt-4 flex flex-col gap-2" data-apercu-propositions>
              {j.propositions.map((p) => (
                <li key={p} className={cn("rounded-xl border border-border px-4 py-3", TEXTE, "text-text-primary")}>
                  {frEspace(p)}
                </li>
              ))}
            </ul>
            <BlocsFermes libelles={[F.ceQuOnAuraitPuDire]} />
          </div>
        </TuileFermee>
        <TuileFermee className="md:col-span-2 lg:col-span-5">
          <div className={TUILE} data-apercu-mission>
            <p className={cn("pr-8", ETIQUETTE)}>{frEspace(M.titre)}</p>
            <EchelleMarches />
          </div>
        </TuileFermee>
      </div>
      <SuiteCoupee>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-rangee="2">
          <TuileFermee className="lg:col-span-6">
            <div className={TUILE}>
              <TitreFerme titre={frEspace(M.aPlat)} />
            </div>
          </TuileFermee>
          <TuileFermee className="lg:col-span-6">
            <div className={TUILE}>
              <TitreFerme titre={frEspace(M.raconte)} />
            </div>
          </TuileFermee>
        </div>
      </SuiteCoupee>
    </div>
  );
}

/**
 * Aperçu VERROUILLÉ de « S'entraîner » (s26, `docs/ux/rubriques-premium-s26.md` §3.1), squelette `ApercuVerrouille` :
 * le jeu désigné en clair (consigne et propositions A, B, C) avec « Ce qu'on aurait pu dire » fermé (7), l'échelle des
 * cinq marches de la mission, la 1 ouverte (5) ; sous le fondu, « Quand ça tombe à plat » et « Raconte-nous ce qui
 * s'est passé » en titres fermés (6/6).
 */
export function ApercuSEntrainer({ visiteur }: { visiteur: boolean }) {
  return (
    <ApercuVerrouille
      rubrique="sEntrainer"
      visiteur={visiteur}
      promesse={frEspace(TEXTES_APERCU_VERROUILLE.promesseSEntrainer)}
      pastilles={PASTILLES_S_ENTRAINER}
    >
      <ExtraitSEntrainer />
    </ApercuVerrouille>
  );
}
