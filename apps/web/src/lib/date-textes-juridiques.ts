/**
 * « Dernière mise à jour » de la confidentialité et des CGU : la plus récente des dates de
 * publication des textes en ligne. Chaque service fermé par un interrupteur apporte sa date
 * seulement une fois ouvert (lettre de la semaine s21, « Ta question à l'équipe » s22).
 */
import { LETTRE_HEBDO_DATE_TEXTES, LETTRE_HEBDO_INSCRIPTIONS_OUVERTES } from "@/config/lettre";
import { QUESTION_EQUIPE_DATE_TEXTES, QUESTION_EQUIPE_OUVERTE } from "@/config/question-equipe";

/** Date de base des deux pages (textes s21 du 17/10). */
export const DATE_TEXTES_JURIDIQUES_BASE = "17 octobre 2026";

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « 9 novembre 2026 » → horodatage (UTC), ou `null` si la date n'est pas de cette forme. */
export function horodatageDateFr(date: string): number | null {
  const m = date.trim().match(/^(1er|\d{1,2}) (\p{L}+) (\d{4})$/u);
  if (!m) return null;
  const mois = MOIS.indexOf(m[2].toLowerCase());
  if (mois < 0) return null;
  return Date.UTC(Number(m[3]), mois, m[1] === "1er" ? 1 : Number(m[1]));
}

export function dateTextesJuridiques(
  services: Array<{ ouvert: boolean; date: string }> = [
    { ouvert: LETTRE_HEBDO_INSCRIPTIONS_OUVERTES, date: LETTRE_HEBDO_DATE_TEXTES },
    { ouvert: QUESTION_EQUIPE_OUVERTE, date: QUESTION_EQUIPE_DATE_TEXTES },
  ],
): string {
  let retenue = DATE_TEXTES_JURIDIQUES_BASE;
  let plusRecente = horodatageDateFr(retenue) ?? 0;
  for (const s of services) {
    const t = s.ouvert && s.date ? horodatageDateFr(s.date) : null;
    if (t !== null && t > plusRecente) {
      retenue = s.date;
      plusRecente = t;
    }
  }
  return retenue;
}
