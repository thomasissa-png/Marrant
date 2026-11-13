/**
 * Missions en 5 marches (s24, lot D5 ; architecture v20 2.4 ; maquette `mission.html` ; texte validé de la
 * mission Confiance marche 2 : `docs/copy/libelles-espace-e5-s24.md` §4).
 *
 * Contenu en fichier (`data/espace/missions.json`, 107 missions importées par `scripts/importer-fiches.ts`
 * depuis l'étiquetage des défis, énoncé = champ `exercise` du seed ; les tests utilisent
 * `lib/espace/fixtures/missions.json`). Toujours facultatives, jamais comptées contre
 * l'abonné, une seule mission ouverte à la fois. La marche suivante dépend du retour, pas de la date :
 * - « Essayé, ça a marché » : la marche d'au-dessus (à la marche 5 : une autre situation, même marche) ;
 * - « Essayé, bof » : même marche, une autre situation (+ « Quand ça tombe à plat », « Mes questions ») ;
 * - « Pas essayé » : la mission reste ; deux fois de suite : la marche d'en dessous, sans commentaire
 *   (à la marche 1 : une autre situation, jamais un message).
 * Le calendrier (4.1) indique une marche visée, jamais imposée : toute marche se consulte (`?marche=`).
 */
import { z } from "zod";
import { idFiche } from "@/lib/espace/fiches-schema";
import type { RetourGeste } from "@/lib/espace/retours";
import missionsServies from "@/data/espace/missions.json";

export type NumeroMarche = 1 | 2 | 3 | 4 | 5;

const texte = z.string().trim().min(1);
export const missionSchema = z
  .object({
    id: idFiche,
    marche: z.number().int().min(1).max(5),
    /** Parcours du mécanisme appris (facultatif). */
    parcours: idFiche.optional(),
    /** Énoncé, un paragraphe par entrée (affiché sans guillemets autour). */
    enonce: z.array(texte).min(1),
    /** Suites propres à la mission (« Bien joué : … », « Un message qui ne prend pas… »). */
    suites: z.object({ marche: texte.optional(), bof: texte.optional() }).strict(),
  })
  .strict();
export type Mission = Omit<z.infer<typeof missionSchema>, "marche"> & { marche: NumeroMarche };

export function validerMissions(donnees: unknown): Mission[] {
  const missions = z.array(missionSchema).parse(donnees) as Mission[];
  const ids = new Set<string>();
  for (const m of missions) {
    if (ids.has(m.id)) throw new Error(`Mission en double : ${m.id}`);
    ids.add(m.id);
  }
  return missions;
}

let cache: Mission[] | null = null;
/** Missions servies (`data/espace/missions.json`), validées au premier appel. */
export function missionsServiesValidees(): Mission[] {
  return (cache ??= validerMissions(missionsServies));
}

export interface RetourMissionLu {
  missionId: string;
  marche: number;
  retour: RetourGeste;
}

export type SuiteMission = "marche" | "bof" | "pas" | "pas2";

const borne = (n: number): NumeroMarche => Math.min(5, Math.max(1, n)) as NumeroMarche;

/** Suite affichée après le dernier retour (`retours` du plus ancien au plus récent). */
export function suiteApres(retours: readonly RetourMissionLu[]): SuiteMission | null {
  const dernier = retours.at(-1);
  if (!dernier) return null;
  if (dernier.retour === "essaye-ca-a-marche") return "marche";
  if (dernier.retour === "essaye-bof") return "bof";
  const avant = retours.at(-2);
  return avant && avant.retour === "pas-essaye" && avant.marche === dernier.marche ? "pas2" : "pas";
}

/** Marche proposée après le dernier retour (1 sans retour). */
export function marcheProposee(retours: readonly RetourMissionLu[]): NumeroMarche {
  const dernier = retours.at(-1);
  if (!dernier) return 1;
  const suite = suiteApres(retours);
  if (suite === "marche") return borne(dernier.marche + 1);
  if (suite === "pas2") return borne(dernier.marche - 1);
  return borne(dernier.marche);
}

/**
 * Mission d'une marche : celle laissée en « Pas essayé » si elle est de cette marche (elle reste là),
 * sinon la première pas encore essayée, en sautant `exclure` (« une autre situation »). Null : aucune.
 */
export function missionDeMarche(
  missions: readonly Mission[],
  retours: readonly RetourMissionLu[],
  marche: NumeroMarche,
  exclure: string | null = null,
): Mission | null {
  const deLaMarche = missions.filter((m) => m.marche === marche && m.id !== exclure);
  const essayees = new Set(retours.filter((r) => r.retour !== "pas-essaye").map((r) => r.missionId));
  const dernier = retours.at(-1);
  if (dernier?.retour === "pas-essaye" && suiteApres(retours) === "pas") {
    const enCours = deLaMarche.find((m) => m.id === dernier.missionId);
    if (enCours) return enCours;
  }
  return deLaMarche.find((m) => !essayees.has(m.id)) ?? null;
}

/** Mission ouverte (une seule à la fois) : celle de la marche proposée. */
export function missionOuverte(missions: readonly Mission[], retours: readonly RetourMissionLu[]): Mission | null {
  const dernier = retours.at(-1);
  // « Pas essayé » deux fois à la marche 1 : une autre situation de la marche 1.
  const exclure = dernier && suiteApres(retours) === "pas2" && dernier.marche === 1 ? dernier.missionId : null;
  return missionDeMarche(missions, retours, marcheProposee(retours), exclure);
}

/**
 * Lot D11b (@ux D-3) : marche vers laquelle renvoyer quand la marche demandée n'a plus de mission servable
 * (toute essayée, ou une seule mission déjà exclue) : la marche ouverte si elle a une mission et diffère, sinon
 * la plus proche au-dessus puis en dessous qui en a une ; null s'il n'y en a aucune.
 */
export function marcheDeRepli(missions: readonly Mission[], retours: readonly RetourMissionLu[], demandee: NumeroMarche): NumeroMarche | null {
  const ouverte = missionOuverte(missions, retours);
  if (ouverte && ouverte.marche !== demandee) return ouverte.marche as NumeroMarche;
  const ordre = [1, 2, 3, 4].flatMap((d) => [demandee + d, demandee - d]).filter((n) => n >= 1 && n <= 5) as NumeroMarche[];
  return ordre.find((n) => missionDeMarche(missions, retours, n) !== null) ?? null;
}
