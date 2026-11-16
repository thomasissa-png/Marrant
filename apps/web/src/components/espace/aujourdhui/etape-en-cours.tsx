import Link from "next/link";
import { frEspace } from "@/lib/fr-typo";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import type { EtapeAReprendre } from "@/lib/espace/quatre-semaines";
import { frEspaceProfond } from "@/lib/fr-typo";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { BarreProgression, Chevron, PIED_TUILE, TITRE_TUILE, TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE } from "@/components/espace/carte/styles";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);
const P = frEspaceProfond(TEXTES_PARCOURS_ESPACE);

const libelleAction = (etape: EtapeAReprendre) => (etape.enCours ? T.etape.reprendre : T.etape.commencerEtape1.replace("1", String(etape.ordre)));

/** « Étape n sur N » et sa barre (étapes validées avant celle-ci, sur le total) : jamais de pourcentage écrit. */
function Avancement({ etape }: { etape: EtapeAReprendre }) {
  return (
    <p className="mt-4 flex items-center gap-3">
      <BarreProgression faites={etape.ordre - 1} total={etape.total} className="flex-1" />
      <span className="text-sm font-semibold tabular-nums text-text-primary">{P.etapeSurTotal(etape.ordre, etape.total)}</span>
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
      titre={frEspace(etape.titreEtape)}
      action={{ href: etape.href, libelle: libelleAction(etape) }}
    >
      <p className="mt-2 text-sm text-text-secondary">{etape.titreParcours}</p>
      {etape.enCours && <Avancement etape={etape} />}
    </ActionDuJour>
  );
}

/**
 * Z3 « Parcours en cours » / « Étape conseillée » (refonte s25, spec UX §4.2 et design §4 Z3) : tuile standard, le
 * parcours en titre, la barre et « Étape n sur N » (à zéro s'il n'est pas commencé), le titre de l'étape, et un pied d'action
 * (lien, jamais un plein). `fige` (extrait de l'aperçu) : le pied est dessiné, sans lien.
 */
export function ParcoursTuile({ etape, fige = false }: { etape: EtapeAReprendre; fige?: boolean }) {
  const pied = (
    <>
      {libelleAction(etape)}
      <Chevron />
    </>
  );
  return (
    <section aria-labelledby={fige ? undefined : "parcours-tuile-titre"} className={TUILE} data-testid="parcours-tuile">
      <p className={ETIQUETTE}>{etape.enCours ? T.etape.enCours : T.etape.conseillee}</p>
      <h2 id={fige ? undefined : "parcours-tuile-titre"} className={TITRE_TUILE}>
        {etape.titreParcours}
      </h2>
      {/* v7 tour 2 (faute 2) : la barre et « Étape n sur N » aussi pour l'étape conseillée (barre à zéro, « Étape 1
          sur N » au premier jour) : l'avancement réel du parcours, et plus de tuile à moitié vide. */}
      <Avancement etape={etape} />
      <p className="mb-5 mt-2 text-sm text-text-secondary">{frEspace(etape.titreEtape)}</p>
      {fige ? (
        <span aria-disabled="true" className={`${PIED_TUILE} pointer-events-none opacity-60`}>
          {pied}
        </span>
      ) : (
        <Link href={etape.href} className={PIED_TUILE}>
          {pied}
        </Link>
      )}
    </section>
  );
}
