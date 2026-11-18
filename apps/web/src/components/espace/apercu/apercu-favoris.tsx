import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { frEspace } from "@/lib/fr-typo";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { SuiteCoupee } from "@/components/espace/apercu/extrait-coupe";
import { TitreFerme } from "@/components/espace/apercu/blocs-fermes";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import type { ExemplesFavoris } from "@/components/espace/apercu/exemples-favoris";
import { TUILE } from "@/components/espace/aujourdhui/tableau";
import { CARTE_FAVORI, CorpsConseil, CorpsVanne } from "@/components/espace/favoris/cartes-favori";
import { JOKE_CATEGORY_LABELS, TABS, TIP_CATEGORY_LABELS, TYPE_FAVORI } from "@/components/favoris/libelles";

/** Spec s26 §1.2 : les quatre onglets réels de la page (`TABS[].label`), inertes, aucun effectif inventé. */
export const PASTILLES_FAVORIS: readonly string[] = TABS.map((t) => t.label);

/** Une tuile fermée réduite à son libellé de type (verrou de `TuileFermee`, barres de `TitreFerme`). */
function TypeFerme({ type, className }: { type: keyof typeof TYPE_FAVORI; className?: string }) {
  return (
    <TuileFermee className={className}>
      <div className={TUILE} data-apercu-type-ferme={type}>
        <TitreFerme titre={TYPE_FAVORI[type]} />
      </div>
    </TuileFermee>
  );
}

/**
 * Extrait de Favoris (`docs/ux/favoris-carnet-s26.md` §1.2, design §1) : la décision du 15/11 tient (deux contenus
 * RÉELS en lecture seule, la première vanne et le premier conseil gratuits du catalogue), dans le squelette commun.
 * Rangée 1 : vanne (5, chute visible) et conseil REPLIÉ (7, titre et deux lignes, plus de bloc « Exemple ») ; mêmes
 * cartes que l'abonné, sans « Retirer » ni « Partager ». Rangée 2 sous le fondu : une vidéo fermée (12).
 * Catalogue vide ou base indisponible (`null`) : deux tuiles fermées 6/6, jamais une colonne vide.
 */
function ExtraitFavoris({ favoris }: { favoris: ExemplesFavoris | null }) {
  return (
    <div data-apercu-fiche="favoris-exemples">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-rangee="1">
        {favoris ? (
          <>
            <TuileFermee nette className="lg:col-span-5">
              <div className={CARTE_FAVORI} data-favori-lecture="vanne">
                <CorpsVanne
                  texte={favoris.vanne.content}
                  chute={favoris.vanne.punchline}
                  categorie={JOKE_CATEGORY_LABELS[favoris.vanne.category] ?? favoris.vanne.category}
                />
              </div>
            </TuileFermee>
            <TuileFermee nette className="lg:col-span-7">
              <div className={CARTE_FAVORI} data-favori-lecture="conseil">
                <CorpsConseil
                  titre={favoris.conseil.title}
                  contenu={favoris.conseil.content}
                  categorie={TIP_CATEGORY_LABELS[favoris.conseil.category] ?? favoris.conseil.category}
                />
              </div>
            </TuileFermee>
          </>
        ) : (
          <>
            <TypeFerme type="JOKE" className="lg:col-span-6" />
            <TypeFerme type="TIP" className="lg:col-span-6" />
          </>
        )}
      </div>
      <SuiteCoupee entiere>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-rangee="2">
          <TypeFerme type="VIDEO" className="md:col-span-2 lg:col-span-12" />
        </div>
      </SuiteCoupee>
    </div>
  );
}

/**
 * Aperçu VERROUILLÉ de « Favoris » (s26), visiteur et inscrit gratuit, à l'adresse `/favoris` : hero 8/4 offre en haut
 * (`ApercuVerrouille`, `offre-en-haut.ts`), puis l'extrait. Rendu serveur, aucune donnée d'abonné, aucune écriture.
 */
export function ApercuFavoris({ visiteur, favoris }: { visiteur: boolean; favoris: ExemplesFavoris | null }) {
  return (
    <ApercuVerrouille
      rubrique="favoris"
      visiteur={visiteur}
      promesse={frEspace(TEXTES_APERCU_VERROUILLE.promesseFavoris)}
      pastilles={PASTILLES_FAVORIS}
    >
      <ExtraitFavoris favoris={favoris} />
    </ApercuVerrouille>
  );
}
