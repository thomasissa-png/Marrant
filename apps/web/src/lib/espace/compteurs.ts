/**
 * Compteurs ANONYMES de l'espace client (s24, lot D10, suites du D9 ; architecture v20 7.7 point 6,
 * avis @legal `docs/legal/espace-d9-mesure-s24.md` point 6). Serveur seulement.
 *
 * Ce qui est compté, sans aucun lien avec un compte : l'ouverture de la cloche, d'un bonus (son seul
 * numéro, qui désigne le contenu ouvert), du coin « Humour noir, fait bien » (geste « Entrer ») et de
 * l'archive « Lettres » ; chaque réplique écrite et chaque question envoyée (minimisation : la date est
 * déjà dans `UserReplique.creeLe` et `EquipeFil.creeLe`, rien n'est rattaché ici).
 *
 * Règles codées et testées (`__tests__/espace/compteurs-d10-s24.test.ts`) :
 * a) lecture jamais jour par jour sous 15 abonnés actifs (`periodeLecture`, agrégée à la semaine) ;
 * b) clés et valeurs d'une liste fermée, aucune clé croisée (formule, cap atteint, réponse « à l'aise ») ;
 * c) ni IP, ni cookie, ni identifiant : `compterAnonyme` ne reçoit aucun compte, le journal d'erreur
 *    ne porte que le nom de l'erreur. Interrupteur fermé : rien n'est écrit, rien n'est lu.
 * Le toucher « Ce soir, c'est plutôt ? » et « Une autre » (lot D3) gardent leur route et leur liste
 * (`lib/espace/vanne.ts`), reprises ici pour que la liste fermée soit complète en un seul endroit.
 */
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { prisma } from "@/lib/prisma";
import { CLES_COMPTEUR, VALEURS_COMPTEUR, jourCompteur } from "@/lib/espace/vanne";
import { SEUIL_LECTURE_AGREGEE } from "@/lib/mesure/tableau-abonnes";

export const VALEURS_OUVERTURE = ["cloche", "coin-humour-noir", "archive-lettres", "bonus-1", "bonus-2", "bonus-3", "bonus-4", "bonus-5"] as const;
export const VALEURS_ACTION = ["replique-ecrite", "question-envoyee"] as const;

/** Liste fermée complète des compteurs anonymes : clé, valeurs admises. */
export const COMPTEURS_ANONYMES = {
  ouverture: VALEURS_OUVERTURE,
  action: VALEURS_ACTION,
  ...Object.fromEntries(CLES_COMPTEUR.map((c) => [c, VALEURS_COMPTEUR])),
} as Readonly<Record<string, readonly string[]>>;

export type CompteurAnonyme =
  | { cle: "ouverture"; valeur: (typeof VALEURS_OUVERTURE)[number] }
  | { cle: "action"; valeur: (typeof VALEURS_ACTION)[number] };

/** Seule écriture d'un compteur : la ligne (jour, clé, valeur) et son nombre. */
export interface CompteurDb {
  espaceCompteur: {
    upsert(args: {
      where: { jour_cle_valeur: { jour: Date; cle: string; valeur: string } };
      update: { n: { increment: number } };
      create: { jour: Date; cle: string; valeur: string; n: number };
    }): Promise<unknown>;
  };
}

export function estCompteurAdmis(cle: string, valeur: string): boolean {
  return Object.prototype.hasOwnProperty.call(COMPTEURS_ANONYMES, cle) && COMPTEURS_ANONYMES[cle].includes(valeur);
}

export interface OptionsCompteur {
  maintenant?: Date;
  db?: CompteurDb;
  /** Interrupteur (tests) ; par défaut `ESPACE_CLIENT_PUBLIE`. */
  publie?: boolean;
}

/** Ajoute 1 au compteur du jour. `false` si fermé, hors liste ou en échec. Ne lève jamais, aucun identifiant. */
export async function compterAnonyme(compteur: CompteurAnonyme, options: OptionsCompteur = {}): Promise<boolean> {
  if (!(options.publie ?? ESPACE_CLIENT_PUBLIE)) return false;
  if (!estCompteurAdmis(compteur.cle, compteur.valeur)) return false;
  const jour = jourCompteur(options.maintenant ?? new Date());
  const { cle, valeur } = compteur;
  try {
    const db: CompteurDb = options.db ?? prisma;
    await db.espaceCompteur.upsert({
      where: { jour_cle_valeur: { jour, cle, valeur } },
      update: { n: { increment: 1 } },
      create: { jour, cle, valeur, n: 1 },
    });
    return true;
  } catch (error) {
    // Journal sans identifiant ni contenu : le seul nom de l'erreur.
    console.error("[espace/compteurs] écriture impossible :", error instanceof Error ? error.name : "inconnue");
    return false;
  }
}

/** Ouverture d'un bonus : sa valeur fermée (`bonus-1` à `bonus-5`), null hors liste. */
export function valeurBonus(numero: number): (typeof VALEURS_OUVERTURE)[number] | null {
  const v = `bonus-${numero}`;
  return (VALEURS_OUVERTURE as readonly string[]).includes(v) ? (v as (typeof VALEURS_OUVERTURE)[number]) : null;
}

export type PeriodeLecture = "semaine" | "jour";

/** Règle a) : sous 15 abonnés actifs, jamais de lecture jour par jour (agrégée à la semaine). */
export function periodeLecture(abonnesActifs: number): PeriodeLecture {
  return abonnesActifs >= SEUIL_LECTURE_AGREGEE ? "jour" : "semaine";
}

const pad = (n: number) => String(n).padStart(2, "0");
const dateCourte = (d: Date) => `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;

/** Libellé de période d'une ligne (jour UTC du compteur) : « semaine du lundi » ou le jour lui-même. */
export function libellePeriode(jour: Date, periode: PeriodeLecture): string {
  if (periode === "jour") return dateCourte(jour);
  const lundi = new Date(jour.getTime() - (((jour.getUTCDay() + 6) % 7) * 86_400_000));
  return `semaine du ${dateCourte(lundi)}`;
}

/** Regroupe les lignes (jour, clé, valeur, n) à la période permise. Lignes hors liste fermée ignorées. */
export function agregerCompteurs(
  lignes: readonly { jour: Date; cle: string; valeur: string; n: number }[],
  abonnesActifs: number,
): { periode: string; cle: string; valeur: string; n: number }[] {
  const p = periodeLecture(abonnesActifs);
  const somme = new Map<string, { periode: string; cle: string; valeur: string; n: number }>();
  for (const l of lignes) {
    if (!estCompteurAdmis(l.cle, l.valeur)) continue;
    const periode = libellePeriode(l.jour, p);
    const k = `${periode}|${l.cle}|${l.valeur}`;
    const deja = somme.get(k);
    if (deja) deja.n += l.n;
    else somme.set(k, { periode, cle: l.cle, valeur: l.valeur, n: l.n });
  }
  return [...somme.values()];
}
