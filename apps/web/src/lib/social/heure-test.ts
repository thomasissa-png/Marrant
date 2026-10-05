/**
 * Test d'heure A / B alterné PAR JOUR (`docs/social/mesure.md` §7 c, v5 §1) : mar. A,
 * mer. B, jeu. A, ordre inversé la semaine suivante. Règle : jours écoulés depuis le
 * début de la fenêtre du réseau (lundi J0) impairs = A, pairs = B ; 7 étant impair,
 * l'ordre s'inverse seul d'une semaine à l'autre. Hors fenêtre, hors mar. à jeu., ou
 * réseau sans test (LinkedIn pendant le test texte / image) : heure A, sans bras.
 * Marqueur `[heure:A|B]` posé dans `directorNote` par le script de lot.
 */
import { HEURE_B_PARIS, HEURE_PARIS, JOURS_TEST_HEURE, TEST_HEURE, type ReseauSocial } from "../../config/social-calendrier";
import { jourSemaine } from "./heure-paris";

export type BrasHeure = "A" | "B";

const ecart = (de: string, a: string) => Math.round((Date.parse(`${a}T12:00:00Z`) - Date.parse(`${de}T12:00:00Z`)) / 86_400_000);

/** Bras du test d'heure d'un post (date de Paris AAAA-MM-JJ), null si le post est hors test. */
export function brasHeure(platform: ReseauSocial, date: string): BrasHeure | null {
  const t = TEST_HEURE[platform];
  if (!t || date < t.de || date >= t.a || !JOURS_TEST_HEURE.includes(jourSemaine(date))) return null;
  return ecart(t.de, date) % 2 === 1 ? "A" : "B";
}

/** Heure de Paris du créneau : B si le post est dans le bras B, sinon A (HEURE_PARIS). */
export function heureDuCreneau(platform: ReseauSocial, date: string): { h: number; m: number; bras: BrasHeure | null } {
  const bras = brasHeure(platform, date);
  return { ...(bras === "B" ? HEURE_B_PARIS[platform] : HEURE_PARIS[platform]), bras };
}
