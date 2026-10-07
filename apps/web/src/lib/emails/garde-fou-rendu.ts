/**
 * Garde-fou des champs variables (s16, lot E, exigence de Thomas : « assure-toi
 * que les prénoms et tout soient correctement remplis »).
 *
 * `problemesDeRendu` relit un texte FINAL (objet, corps d'e-mail, écran) et
 * liste tout ce qui trahit un champ mal rempli : « undefined », « null »,
 * « NaN », accolades de gabarit, crochets de champ, date en anglais ou date
 * invalide, montant au format anglais. Utilisé :
 * - dans les tests (chaque gabarit, données complètes, partielles, absentes) ;
 * - à l'envoi (lib/emails/paiement-notifications.ts) : l'e-mail part quand
 *   même (confirmation légale), mais une alerte A `email-rendu-<type>` est
 *   enregistrée pour Thomas (digest du matin).
 */

const MOTIFS: ReadonlyArray<{ re: RegExp; libelle: string }> = [
  { re: /\bundefined\b/i, libelle: "« undefined »" },
  { re: /\bnull\b/i, libelle: "« null »" },
  { re: /\bNaN\b/, libelle: "« NaN »" },
  { re: /Invalid Date/i, libelle: "date invalide" },
  { re: /\[object Object\]/, libelle: "objet non converti" },
  { re: /\{\{|\}\}|\$\{/, libelle: "accolades de gabarit" },
  { re: /\[\s*(pr[ée]nom|nom|date|montant|lien|formule|prix)[^\]]*\]/i, libelle: "champ entre crochets" },
  {
    re: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/,
    libelle: "mois en anglais",
  },
  { re: /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/, libelle: "jour en anglais" },
  { re: /\d{4}-\d{2}-\d{2}T\d{2}:/, libelle: "date ISO brute" },
  { re: /\d\.\d{2}\s?€|€\s?\d/, libelle: "montant au format anglais" },
  { re: /Salut\s+,|Salut [^,\n]*@/, libelle: "salutation mal remplie" },
];

/** Liste des problèmes trouvés dans le rendu final (vide = rendu propre). */
export function problemesDeRendu(texte: string): string[] {
  return MOTIFS.filter(({ re }) => re.test(texte)).map(({ libelle }) => libelle);
}

/** Lève une erreur si le rendu contient un champ mal rempli (tests, aperçus). */
export function assertRenduPropre(texte: string, contexte = "rendu"): void {
  const problemes = problemesDeRendu(texte);
  if (problemes.length > 0) {
    throw new Error(`${contexte} : champ variable mal rempli (${problemes.join(", ")})`);
  }
}
