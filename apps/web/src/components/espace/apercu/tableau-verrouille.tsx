import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { TEXTES_MISSION } from "@/config/textes/espace-cartes";
import { SERIE } from "@/config/textes/parcours";
import { choisirPremierPas } from "@/lib/espace/premier-pas";
import { etapeAReprendre } from "@/lib/espace/quatre-semaines";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { frEspaceProfond } from "@/lib/fr-typo";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { CapDuJour } from "@/components/espace/aujourdhui/cap-du-jour";
import { ParcoursTuile } from "@/components/espace/aujourdhui/etape-en-cours";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { TUILE } from "@/components/espace/aujourdhui/tableau";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);
const C = frEspaceProfond(TEXTES_CAPS);
const M = frEspaceProfond(TEXTES_MISSION);

/**
 * Pastilles « ce qu'il y a dedans » du hero d'« Aujourd'hui » (spec UX §3.1) : les mots exacts de l'abonné, repris
 * de ses libellés (le prospect les reconnaîtra en entrant). Aucun texte neuf.
 */
export const PASTILLES_AUJOURDHUI = [T.premierPas.eyebrow, C.titre, SERIE.titre, T.etape.enCours, M.titre, T.jour.titre] as const;

/**
 * L'extrait fermé d'« Aujourd'hui » (spec UX §3.2, design §3.3 et §5.2) : la grille de l'abonné en état « nouvel
 * abonné », avec les MÊMES composants que la page de l'abonné en mode figé, sans base ni réseau : le premier pas par
 * défaut (scène et durée de `choisirPremierPas` sans signal), « Ton cap » au cap 1 sans chiffres (série à démarrer),
 * l'étape conseillée du parcours par défaut (même règle que l'abonné, `etapeAReprendre` sans progression), la mission
 * de la marche 1, et « Contenu du jour » avec ses trois titres seulement (aucune vanne réelle, pas d'`/api/daily`).
 * Aucune donnée d'abonné simulée.
 */
function TableauFerme() {
  const pas = choisirPremierPas(null, null, [], T.premierPas.sceneParDefaut);
  const etape = etapeAReprendre([], PARCOURS_SEED_JSON);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-fiche="tableau-aujourdhui">
      <TuileFermee className="md:col-span-2 lg:col-span-8">
        <ActionDuJour
          idTitre="apercu-premier-pas-titre"
          fige
          etiquette={T.premierPas.eyebrow}
          duree={pas.minutes !== null ? T.premierPas.duree(pas.minutes) : null}
          titre={pas.titre}
          action={{ href: pas.href, libelle: T.premierPas.bouton }}
        />
      </TuileFermee>
      <TuileFermee className="md:col-span-2 lg:col-span-4">
        <CapDuJour cap={1} xp={0} serie={0} fige />
      </TuileFermee>
      {etape && (
        <TuileFermee className="lg:col-span-4">
          <ParcoursTuile etape={etape} fige />
        </TuileFermee>
      )}
      <TuileFermee className="lg:col-span-4">
        <MissionLien marche={1} fige />
      </TuileFermee>
      <TuileFermee className={etape ? "md:col-span-2 lg:col-span-4" : "lg:col-span-4"}>
        <div className={TUILE}>
          <p className="font-display text-lg font-bold text-text-primary">{T.jour.titre}</p>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            {[T.jour.vanne, T.jour.conseil, T.jour.video].map((t) => (
              <li key={t} className="rounded-md border border-border px-3 py-2">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </TuileFermee>
    </div>
  );
}

/** Aperçu d'« Aujourd'hui » pour le visiteur et l'inscrit gratuit : le tableau de bord verrouillé (refonte s25). */
export function ApercuAujourdhui({ visiteur }: { visiteur: boolean }) {
  return (
    <ApercuVerrouille rubrique="aujourdhui" visiteur={visiteur} promesse={TEXTES_APERCU_VERROUILLE.promesseAujourdhui} pastilles={PASTILLES_AUJOURDHUI}>
      <TableauFerme />
    </ApercuVerrouille>
  );
}
