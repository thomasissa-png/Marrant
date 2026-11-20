import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { TEXTES_MISSION } from "@/config/textes/espace-cartes";
import { SERIE } from "@/config/textes/parcours";
import { choisirPremierPas } from "@/lib/espace/premier-pas";
import type { PublicJoke } from "@/lib/catalogue-pages";
import { accrocheMission } from "@/lib/espace/enonce-mission";
import { missionOuverte, missionsServiesValidees } from "@/lib/espace/missions";
import { etapeAReprendre } from "@/lib/espace/quatre-semaines";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import { ApercuVerrouille } from "@/components/espace/apercu/apercu-verrouille";
import { SuiteCoupee } from "@/components/espace/apercu/extrait-coupe";
import { RepliquesFermees, type RegistreReplique } from "@/components/espace/apercu/repliques-fermees";
import { TuileFermee } from "@/components/espace/apercu/tuile-fermee";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { CapDuJour } from "@/components/espace/aujourdhui/cap-du-jour";
import { ParcoursTuile } from "@/components/espace/aujourdhui/etape-en-cours";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { TUILE } from "@/components/espace/aujourdhui/tableau";
import { PastillesDa } from "@/components/espace/da-espace";
import { TEXTE, TEXTE_FORT } from "@/components/espace/typo";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

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
 * v7 tour 12 (relectures du tour 11 : « un plan du produit, pas un morceau du produit ») : deux contenus RÉELS, aucun
 * inventé. (1) Z1 : la scène de la fiche du premier pas par défaut (`ficheApercu("aujourdhui")`, la fiche désignée pour
 * l'aperçu), à gauche du bouton éteint dès 768 px. (2) La tuile du contenu du jour montre la première vanne gratuite du
 * catalogue (`vanne`, même source que l'aperçu de Favoris, lue par la page) : étiquette « Vanne du jour », la vanne
 * (énoncé puis chute, comme la carte de l'abonné), 4 lignes au plus ; au-delà de 3 lignes, la 4e s'efface (fondu en
 * longueurs fixes : une vanne de 3 lignes ou moins n'est jamais touchée) et la suite est coupée entre deux lignes,
 * jamais dans un mot. Sans vanne (base indisponible) : les trois libellés d'avant.
 * v7 tour 13 (décision de Thomas du 16/11) : Z1 devient la vitrine des répliques (situation en clair, répliques fermées,
 * `repliques-fermees.tsx`) ; la scène et le bouton éteint du tour 12 en sortent.
 */
type VanneExtrait = Pick<PublicJoke, "content" | "punchline">;

/** Première ligne de la tuile alignée sur les titres voisins (8 px sous l'étiquette), 4 lignes de 24 px au plus. */
const VANNE_COUPEE = "mt-2 max-h-24 overflow-hidden [mask-image:linear-gradient(to_bottom,black_4.5rem,transparent_6rem)]";

function TuileJour({ vanne }: { vanne: VanneExtrait | null }) {
  if (vanne) {
    return (
      // s26 contrôle d'ensemble, aperçus : la carte « Vanne du jour » de l'abonné (bandeau, émoji et pastille de l'accueil).
      <div className={TUILE}>
        <PastillesDa as="p" emoji={EMOJIS_RUBRIQUES.vanne} pastille={T.jour.vanne} />
        <div className={VANNE_COUPEE} data-apercu-vanne>
          <p className={cn(TEXTE, "text-text-primary")}>{frEspace(vanne.content)}</p>
          <p className={TEXTE_FORT}>{frEspace(vanne.punchline)}</p>
        </div>
      </div>
    );
  }
  // Échelle s25 (§2.5) : lignes sans cadre, séparées d'un filet (`divide-y`), en `TEXTE`. v7 tour 8 (piste, 35 px vides
  // au-dessus du titre) : « Contenu du jour » en étiquette, sur la ligne des étiquettes voisines, la première ligne
  // (« Vanne du jour ») 8 px dessous, sur la ligne de leurs titres.
  return (
    <div className={TUILE}>
      <PastillesDa as="p" pastille={T.jour.titre} />
      <ul className="mt-2 divide-y divide-border">
        {[T.jour.vanne, T.jour.conseil, T.jour.video].map((t) => (
          <li key={t} className={`py-2 first:pt-0 ${TEXTE}`}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TableauFerme({ vanne }: { vanne: VanneExtrait | null }) {
  const pas = choisirPremierPas(null, null, [], T.premierPas.sceneParDefaut);
  // v7 tour 13 : seules les CLÉS des répliques de la fiche par défaut quittent ce module serveur (jamais leur texte).
  const fiche = ficheApercu("aujourdhui");
  const registres = fiche.type === "situation" ? (Object.keys(fiche.contenu.repliques) as RegistreReplique[]) : [];
  const etape = etapeAReprendre([], PARCOURS_SEED_JSON);
  const mission = missionOuverte(missionsServiesValidees(), []);
  // v7 tour 2 (faute 4) : deux grilles. Rangée 1 (premier pas, « Ton cap ») toujours ENTIÈRE, à 375 et 768 aussi :
  // la progression et la série se lisent avant le fondu. La suite (rangée 2) passe seule sous le fondu (`SuiteCoupee`).
  return (
    <div data-apercu-fiche="tableau-aujourdhui">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="1">
        {/* v7 tour 8 (point 2) : Z1 en 7 colonnes, « Ton cap » en 5, comme la page de l'abonné (Z1 n'est plus creuse).
            v7 tour 9 : figée, Z1 a le cadre neutre des tuiles (ni bord violet ni teinte), son bouton est un contour éteint.
            v7 tour 11 : Z1 est la vitrine, à pleine netteté (`nette`) ; les autres tuiles gardent l'atténuation.
            v7 tour 13 (décision de Thomas du 16/11) : la vitrine des RÉPLIQUES. La situation en clair, une seule fois (le
            titre, la réplique qu'on te lance ; plus de scène qui la répétait), puis les répliques de la fiche en cartes
            fermées (libellé réel, verrou, barres) ; plus de bouton éteint, les répliques fermées jouent son rôle.
            s26 (décision de Thomas du 18/11) : 8/4 et gouttière de 48 px dès 1024, la grille du hero : Z1 sous le texte du
            hero, « Ton cap » sous la carte d'offre (mêmes bords) ; la rangée 2 (4/4/4) sur la même grille. */}
        <TuileFermee nette className="md:col-span-2 lg:col-span-8">
          <ActionDuJour
            idTitre="apercu-premier-pas-titre"
            fige
            etiquette={T.premierPas.eyebrow}
            emoji={EMOJIS_RUBRIQUES.quoiRepondre}
            duree={pas.minutes !== null ? T.premierPas.duree(pas.minutes) : null}
            titre={pas.titre}
            action={null}
            apres={<RepliquesFermees registres={registres} />}
          />
        </TuileFermee>
        <TuileFermee className="md:col-span-2 lg:col-span-4">
          <CapDuJour cap={1} xp={0} serie={0} fige />
        </TuileFermee>
      </div>
      <SuiteCoupee>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12" data-apercu-rangee="2">
          {etape && (
            <TuileFermee className="lg:col-span-4">
              <ParcoursTuile etape={etape} fige />
            </TuileFermee>
          )}
          <TuileFermee className="lg:col-span-4">
            <MissionLien marche={mission?.marche ?? 1} accroche={mission ? accrocheMission(mission.enonce) : undefined} fige />
          </TuileFermee>
          <TuileFermee className={etape ? "md:col-span-2 lg:col-span-4" : "lg:col-span-4"}>
            <TuileJour vanne={vanne} />
          </TuileFermee>
        </div>
      </SuiteCoupee>
    </div>
  );
}

/** Aperçu d'« Aujourd'hui » pour le visiteur et l'inscrit gratuit : le tableau de bord verrouillé (refonte s25). */
export function ApercuAujourdhui({ visiteur, vanne = null }: { visiteur: boolean; vanne?: VanneExtrait | null }) {
  return (
    <ApercuVerrouille rubrique="aujourdhui" visiteur={visiteur} promesse={TEXTES_APERCU_VERROUILLE.promesseAujourdhui} pastilles={PASTILLES_AUJOURDHUI}>
      <TableauFerme vanne={vanne} />
    </ApercuVerrouille>
  );
}
