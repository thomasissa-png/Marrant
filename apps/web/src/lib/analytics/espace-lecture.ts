/**
 * Lecture de la mesure d'usage de l'espace client (s24, lot D9 ; architecture v20 7.6 et 7.7). LECTURE SEULE.
 *
 * Une ligne par abonné ANONYMISÉ (« M-A », « M-B »… dans l'ordre de la première ouverture de l'espace ;
 * lettres propres à ce tableau, sans lien avec celles de `tableau-abonnes.ts`), dates en heure de Paris.
 * Aucun identifiant de compte ne sort d'ici. Sous 15 abonnés (`SEUIL_LECTURE_AGREGEE`, §5.2 du brief) :
 * lecture cas par cas, AUCUN pourcentage ni chiffre agrégé ; au-delà, « x sur n (p %) ».
 * Compteurs anonymes (`EspaceCompteur` : toucher, « Une autre », ouvertures de la cloche, des bonus, du coin
 * « Humour noir » et de l'archive « Lettres », répliques écrites, questions envoyées ; lot D10) : sans identité,
 * agrégés à la SEMAINE sous 15 abonnés actifs (`periodeLecture`, avis @legal D9 point 6 a), jamais jour par jour.
 * Définition [PROVISOIRE, en attente du plan de tags @data-analyst] : « retour à Jn » = une ouverture de
 * l'espace au moins n jours (de Paris) après la première ; « pas encore » tant que Jn n'est pas passé.
 */
import { heureParis, lettre, SEUIL_LECTURE_AGREGEE } from "@/lib/mesure/tableau-abonnes";
import { parisDayNumber } from "@/lib/progression";
import { agregerCompteurs, periodeLecture, type PeriodeLecture } from "@/lib/espace/compteurs";

export interface EvenementLu {
  userId: string;
  type: string;
  detail: string | null;
  occurredAt: Date;
}
export interface DonneesLecture {
  evenements: EvenementLu[];
  /** Comptes par abonné (missions tentées, fiches « Fait », cartes jouées). */
  missions: Map<string, number>;
  fiches: Map<string, number>;
  cartes: Map<string, number>;
  /** Lignes brutes du compteur (jour, clé, valeur, n), regroupées ici à la période permise. */
  compteurs: { jour: Date; cle: string; valeur: string; n: number }[];
  /** Abonnés actifs (plan PREMIUM en base) : décide de la période de lecture des compteurs. */
  abonnesActifs: number;
}

export type Retour = "oui" | "non" | "pas encore";
export const JOURS_RETOUR = [7, 30, 60] as const;

export interface LigneEspace {
  abonne: string;
  premiereOuverture: string;
  derniereOuverture: string;
  joursOuverture: number;
  retours: Record<(typeof JOURS_RETOUR)[number], Retour>;
  capsAtteints: number[];
  missionsTentees: number;
  fichesFaites: number;
  cartesJouees: number;
}

export interface LectureEspace {
  n: number;
  lignes: LigneEspace[];
  /** null sous 15 abonnés : aucun chiffre agrégé, aucun pourcentage. */
  agregats: { libelle: string; valeur: string }[] | null;
  periodeCompteurs: PeriodeLecture;
  compteurs: { periode: string; cle: string; valeur: string; n: number; part: string | null }[];
  texte: string;
}

const caps = (evs: EvenementLu[], type: string) =>
  [...new Set(evs.filter((e) => e.type === type).map((e) => Number(/^cap:([1-5])$/.exec(e.detail ?? "")?.[1])).filter(Boolean))].sort();

function retour(jours: number[], n: number, aujourdhui: number): Retour {
  if (jours.some((j) => j >= jours[0] + n)) return "oui";
  return aujourdhui < jours[0] + n ? "pas encore" : "non";
}

const part = (x: number, sur: number) => `${x} sur ${sur} (${Math.round((100 * x) / sur)} %)`;

export function lectureEspace(d: DonneesLecture, maintenant: Date = new Date()): LectureEspace {
  const parCompte = new Map<string, EvenementLu[]>();
  for (const e of [...d.evenements].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())) {
    if (!parCompte.has(e.userId)) parCompte.set(e.userId, []);
    parCompte.get(e.userId)?.push(e);
  }
  const aujourdhui = parisDayNumber(maintenant);
  const comptes = [...parCompte.entries()]
    .map(([userId, evs]) => ({ userId, evs, ouvertures: evs.filter((e) => e.type === "espace_ouvert") }))
    .filter((c) => c.ouvertures.length > 0)
    .sort((a, b) => a.ouvertures[0].occurredAt.getTime() - b.ouvertures[0].occurredAt.getTime() || (a.userId < b.userId ? -1 : 1));

  const lignes = comptes.map(({ userId, evs, ouvertures }, i): LigneEspace => {
    const jours = [...new Set(ouvertures.map((e) => parisDayNumber(e.occurredAt)))].sort((a, b) => a - b);
    return {
      abonne: lettre(i + 1),
      premiereOuverture: heureParis(ouvertures[0].occurredAt),
      derniereOuverture: heureParis(ouvertures[ouvertures.length - 1].occurredAt),
      joursOuverture: jours.length,
      retours: { 7: retour(jours, 7, aujourdhui), 30: retour(jours, 30, aujourdhui), 60: retour(jours, 60, aujourdhui) },
      capsAtteints: caps(evs, "cap_atteint"),
      missionsTentees: d.missions.get(userId) ?? 0,
      fichesFaites: d.fiches.get(userId) ?? 0,
      cartesJouees: d.cartes.get(userId) ?? 0,
    };
  });

  const n = lignes.length;
  const agrege = n >= SEUIL_LECTURE_AGREGEE;
  const periodeCompteurs = periodeLecture(d.abonnesActifs);
  const groupes = agregerCompteurs(d.compteurs, d.abonnesActifs);
  const total = (periode: string, cle: string) => groupes.filter((c) => c.periode === periode && c.cle === cle).reduce((s, c) => s + c.n, 0);
  const compteurs = groupes
    .sort((a, b) => (a.periode !== b.periode ? (a.periode < b.periode ? -1 : 1) : a.cle === b.cle ? b.n - a.n : a.cle < b.cle ? -1 : 1))
    .map((c) => ({ ...c, part: agrege && total(c.periode, c.cle) > 0 ? part(c.n, total(c.periode, c.cle)) : null }));

  let agregats: LectureEspace["agregats"] = null;
  if (agrege) {
    agregats = JOURS_RETOUR.map((j) => {
      const eligibles = lignes.filter((l) => l.retours[j] !== "pas encore");
      return { libelle: `Retour à J${j}`, valeur: eligibles.length ? part(eligibles.filter((l) => l.retours[j] === "oui").length, eligibles.length) : "aucun abonné à J" + j };
    });
    agregats.push({ libelle: "Au moins une carte jouée", valeur: part(lignes.filter((l) => l.cartesJouees > 0).length, n) });
    agregats.push({ libelle: "Au moins une mission tentée", valeur: part(lignes.filter((l) => l.missionsTentees > 0).length, n) });
  }
  return { n, lignes, agregats, periodeCompteurs, compteurs, texte: rendreTexte(n, lignes, agregats, compteurs, periodeCompteurs) };
}

const liste = (l: number[]) => (l.length ? l.join(", ") : "aucun");

function rendreTexte(n: number, lignes: LigneEspace[], agregats: LectureEspace["agregats"], compteurs: LectureEspace["compteurs"], periode: PeriodeLecture): string {
  const sortie = [`Espace client : ${n} abonné(s) ayant ouvert l'espace (heures de Paris).`, ""];
  sortie.push("Abonné | 1re ouverture | Dernière | Jours | J7 | J30 | J60 | Caps atteints | Missions | Fiches faites | Cartes");
  for (const l of lignes) {
    sortie.push(
      [l.abonne, l.premiereOuverture, l.derniereOuverture, l.joursOuverture, l.retours[7], l.retours[30], l.retours[60], liste(l.capsAtteints), l.missionsTentees, l.fichesFaites, l.cartesJouees].join(" | "),
    );
  }
  sortie.push("");
  if (agregats) for (const a of agregats) sortie.push(`${a.libelle} : ${a.valeur}`);
  else sortie.push(`Moins de ${SEUIL_LECTURE_AGREGEE} abonnés : lecture cas par cas, aucun chiffre agrégé.`);
  sortie.push("", `Compteurs anonymes, sans identité, par ${periode === "jour" ? "jour" : "semaine (moins de " + SEUIL_LECTURE_AGREGEE + " abonnés actifs)"} :`);
  for (const c of compteurs) sortie.push(`${c.periode} | ${c.cle} | ${c.valeur} | ${c.n}${c.part ? ` | ${c.part}` : ""}`);
  return `${sortie.join("\n")}\n`;
}
