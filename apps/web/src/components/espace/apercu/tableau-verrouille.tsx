import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { TEXTES_MISSION } from "@/config/textes/espace-cartes";
import { SERIE } from "@/config/textes/parcours";
import { choisirPremierPas } from "@/lib/espace/premier-pas";
import { accrocheMission } from "@/lib/espace/enonce-mission";
import { missionOuverte, missionsServiesValidees } from "@/lib/espace/missions";
import { etapeAReprendre } from "@/lib/espace/quatre-semaines";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { frEspaceProfond } from "@/lib/fr-typo";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { SuiteCoupee } from "@/components/espace/apercu/extrait-coupe";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { CapDuJour } from "@/components/espace/aujourdhui/cap-du-jour";
import { ParcoursTuile } from "@/components/espace/aujourdhui/etape-en-cours";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { TUILE } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, TEXTE } from "@/components/espace/typo";

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
 * Aucune donnée d'abonné simulée. v7 tour 3 (faute 1) : la mission est celle qu'ouvre un nouvel abonné (même règle,
 * `missionOuverte` sans retour), avec son accroche (début de l'énoncé, texte existant) : sa tuile a un corps avant le fondu.
 */
function TableauFerme() {
  const pas = choisirPremierPas(null, null, [], T.premierPas.sceneParDefaut);
  const etape = etapeAReprendre([], PARCOURS_SEED_JSON);
  const mission = missionOuverte(missionsServiesValidees(), []);
  // v7 tour 2 (faute 4) : deux grilles. Rangée 1 (premier pas, « Ton cap ») toujours ENTIÈRE, à 375 et 768 aussi :
  // la progression et la série se lisent avant le fondu. La suite (rangée 2) passe seule sous le fondu (`SuiteCoupee`).
  return (
    <div data-apercu-fiche="tableau-aujourdhui">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-rangee="1">
        {/* v7 tour 8 (point 2) : Z1 en 7 colonnes, « Ton cap » en 5, comme la page de l'abonné (Z1 n'est plus creuse).
            v7 tour 9 : figée, Z1 a le cadre neutre des tuiles (ni bord violet ni teinte), son bouton est un contour éteint. */}
        <TuileFermee className="md:col-span-2 lg:col-span-7">
          <ActionDuJour
            idTitre="apercu-premier-pas-titre"
            fige
            etiquette={T.premierPas.eyebrow}
            duree={pas.minutes !== null ? T.premierPas.duree(pas.minutes) : null}
            titre={pas.titre}
            action={{ href: pas.href, libelle: T.premierPas.bouton }}
          />
        </TuileFermee>
        <TuileFermee className="md:col-span-2 lg:col-span-5">
          <CapDuJour cap={1} xp={0} serie={0} fige />
        </TuileFermee>
      </div>
      <SuiteCoupee>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12" data-apercu-rangee="2">
          {etape && (
            <TuileFermee className="lg:col-span-4">
              <ParcoursTuile etape={etape} fige />
            </TuileFermee>
          )}
          <TuileFermee className="lg:col-span-4">
            <MissionLien marche={mission?.marche ?? 1} accroche={mission ? accrocheMission(mission.enonce) : undefined} fige />
          </TuileFermee>
          <TuileFermee className={etape ? "md:col-span-2 lg:col-span-4" : "lg:col-span-4"}>
            {/* Échelle s25 (§2.5) : lignes sans cadre, séparées d'un filet (`divide-y`), en `TEXTE`. v7 tour 8 (piste,
                35 px vides au-dessus du titre) : « Contenu du jour » passe en étiquette (`ETIQUETTE`, comme « Ton cap »
                en Z2), sur la ligne des étiquettes voisines, et la première ligne (« Vanne du jour ») 8 px dessous, sur
                la ligne de leurs titres : même alignement, plus de ligne vide décorative. */}
            <div className={TUILE}>
              <p className={ETIQUETTE}>{T.jour.titre}</p>
              <ul className="mt-2 divide-y divide-border">
                {[T.jour.vanne, T.jour.conseil, T.jour.video].map((t) => (
                  <li key={t} className={`py-2 first:pt-0 ${TEXTE}`}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </TuileFermee>
        </div>
      </SuiteCoupee>
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
