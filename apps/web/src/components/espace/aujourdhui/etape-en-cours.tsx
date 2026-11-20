import Link from "next/link";
import { frEspace } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import type { EtapeAReprendre } from "@/lib/espace/quatre-semaines";
import { frEspaceProfond } from "@/lib/fr-typo";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { BarreProgression, Chevron, PIED_TUILE, TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";
import { META, META_FORT, TEXTE } from "@/components/espace/typo";
import { Bandeau, PastillesDa, emojiParcours } from "@/components/espace/da-espace";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

const libelleAction = (etape: EtapeAReprendre) => (etape.enCours ? T.etape.reprendre : T.etape.commencerEtape1.replace("1", String(etape.ordre)));

/**
 * « Étape n sur N » et sa barre (étapes validées avant celle-ci, sur le total) : jamais de pourcentage écrit.
 * `empile` (v7 tour 11, tuile en colonne étroite de 768 à 1023 px, à côté de la mission) : la barre sur toute la
 * largeur, « Étape n sur N » dessous, 8 px plus bas.
 */
function Avancement({ etape, empile = false }: { etape: EtapeAReprendre; empile?: boolean }) {
  return (
    <p className={cn("mt-4 flex items-center gap-4", empile && "md:max-lg:flex-col md:max-lg:items-start md:max-lg:gap-2")}>
      <BarreProgression faites={etape.ordre - 1} total={etape.total} className={cn("flex-1", empile && "md:max-lg:w-full md:max-lg:flex-none")} />
      <span className={`tabular-nums ${META_FORT}`}>{P.etapeSurTotal(etape.ordre, etape.total)}</span>
    </p>
  );
}

/**
 * « Étape en cours » (ou « Étape conseillée ») en action du jour, Z1 (refonte s25, spec design §4 Z1, variante
 * « Étape en cours ») : la rafale est faite. Titre de l'étape en grand, parcours dessous, barre et « Étape n sur N »
 * s'il est commencé, « Reprendre » ou « Commencer l'étape n » (seul bouton plein).
 */
export function EtapeEnCours({ etape }: { etape: EtapeAReprendre }) {
  return (
    <ActionDuJour
      idTitre="etape-titre"
      data-testid="etape-en-cours"
      etiquette={etape.enCours ? T.etape.enCours : T.etape.conseillee}
      emoji={emojiParcours(etape.slug)}
      titre={frEspace(etape.titreEtape)}
      action={{ href: etape.href, libelle: libelleAction(etape) }}
    >
      <p className={`mt-2 ${META}`}>{etape.titreParcours}</p>
      {etape.enCours && <Avancement etape={etape} />}
    </ActionDuJour>
  );
}

/**
 * Z3 « Parcours en cours » / « Étape conseillée » (refonte s25, spec UX §4.2 et design §4 Z3) : tuile standard, le
 * parcours en titre, la barre et « Étape n sur N » (à zéro s'il n'est pas commencé), le titre de l'étape, et un pied d'action
 * (lien, jamais un plein). `fige` (extrait de l'aperçu) : le pied est dessiné, sans lien ; v7 tour 3 (faute 3) : sans
 * atténuation propre, celle de `TuileFermee` (0,75) suffit (0,75 x 0,60 passait sous 3:1).
 * `colonne` (v7 tour 11) : à côté de la mission dès 768 px ; de 768 à 1023, colonne étroite (5 sur 12), la barre est
 * empilée au-dessus de « Étape n sur N » (la tuile, plus courte que la mission, ne se creuse plus avant son pied).
 */
export function ParcoursTuile({ etape, fige = false, colonne = false }: { etape: EtapeAReprendre; fige?: boolean; colonne?: boolean }) {
  const pied = (
    <>
      {libelleAction(etape)}
      {/* v7 tour 8 : chevron gris secondaire (spec §2.1), comme celui du pied de la mission voisine. */}
      <Chevron className="text-text-secondary" />
    </>
  );
  return (
    <section aria-labelledby={fige ? undefined : "parcours-tuile-titre"} className={TUILE} data-testid="parcours-tuile">
      {/* s26 DA, aujourd'hui questions répliques : bandeau, émoji du parcours (accueil) et pastille violette ; figée,
          l'étiquette d'avant (extrait de l'aperçu inchangé). */}
      {/* s26 contrôle d'ensemble, aperçus : figée aussi (extrait de l'aperçu), la DA de l'accueil. */}
      <PastillesDa as="p" emoji={emojiParcours(etape.slug)} pastille={etape.enCours ? T.etape.enCours : T.etape.conseillee} />
      <h2 id={fige ? undefined : "parcours-tuile-titre"} className={TITRE_TUILE}>
        {etape.titreParcours}
      </h2>
      {/* v7 tour 2 (faute 2) : la barre et « Étape n sur N » aussi pour l'étape conseillée (barre à zéro, « Étape 1
          sur N » au premier jour) : l'avancement réel du parcours, et plus de tuile à moitié vide. */}
      <Avancement etape={etape} empile={colonne} />
      {/* v7 tour 11 (extrait « peu concret ») : le nom de l'étape en `TEXTE` (16/400, comme l'accroche de la mission
          voisine) plutôt qu'en `META` : la ligne la plus concrète de la tuile se lit, ici comme dans l'extrait. */}
      <p className={`mb-4 mt-2 ${TEXTE}`}>{frEspace(etape.titreEtape)}</p>
      {fige ? (
        <span aria-disabled="true" className={`${PIED_TUILE} pointer-events-none`}>
          {pied}
        </span>
      ) : (
        <Link href={etape.href} className={PIED_TUILE}>
          {pied}
        </Link>
      )}
      <Bandeau />
    </section>
  );
}
