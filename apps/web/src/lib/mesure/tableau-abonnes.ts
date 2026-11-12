/**
 * Lecture de la mesure d'usage (s24, lot 0) : tableau « une ligne par abonné » du §5.2 du brief
 * `docs/espace-client/brief-espace-client-s24.md`. LECTURE SEULE.
 *
 * `SQL_TABLEAU_ABONNES` sort une ligne par souscription (ordre des souscriptions) sans aucun
 * identifiant : le compte est remplacé par son rang (M-A, M-B… dans l'ordre de première
 * souscription ; préfixe « M- » pour ne pas confondre avec les A à D de `resiliations-s23-donnees.md`),
 * une 2e souscription du même compte garde sa lettre (M-A2). Dates rendues en `timestamptz` (aucun
 * pilote ne les relit en heure locale), affichées en heure de Paris.
 * `SQL_SANS_SOUSCRIPTION` compte les comptes Premium sans ligne `souscription` (antérieurs à la
 * mesure, activation manuelle) : ils n'entrent pas dans le tableau, le nombre est affiché.
 * Règles de lecture : n = comptes distincts entrés depuis la mise en ligne de la mesure (ou depuis
 * `activation`) ; sous 15, cas par cas sans aucun chiffre agrégé ; au-delà, « x sur n ».
 * Lancement : `scripts/mesure-usage/tableau-abonnes.ts`.
 */

const UTC = (col: string) => `(${col} AT TIME ZONE 'UTC')`;

/** Une ligne par souscription. */
export const SQL_TABLEAU_ABONNES = `
WITH s AS (
  SELECT e."userId", e."occurredAt" AS souscrit_le, e.detail AS formule,
         LEAD(e."occurredAt") OVER (PARTITION BY e."userId" ORDER BY e."occurredAt") AS suivante,
         ROW_NUMBER() OVER (PARTITION BY e."userId" ORDER BY e."occurredAt") AS numero
  FROM "UsageEvent" e
  WHERE e.type = 'souscription'
),
r AS (
  SELECT "userId", DENSE_RANK() OVER (ORDER BY min(souscrit_le), "userId") AS rang
  FROM s GROUP BY "userId"
),
ev AS (
  SELECT s."userId", s.souscrit_le, x.type, x.detail, x."occurredAt"
  FROM s JOIN "UsageEvent" x
    ON x."userId" = s."userId" AND x."occurredAt" >= s.souscrit_le
   AND (s.suivante IS NULL OR x."occurredAt" < s.suivante)
)
SELECT
  r.rang::int AS rang,
  s.numero::int AS numero,
  ${UTC("s.souscrit_le")} AS "souscritLe",
  s.formule,
  ${UTC(`(SELECT min(ev."occurredAt") FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'premier_acces_premium')`)} AS "premierAcces",
  (SELECT ev.detail FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'premier_acces_premium' ORDER BY ev."occurredAt" LIMIT 1) AS "premierContenu",
  ${UTC(`LEAST(
    (SELECT min(ev."occurredAt") FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
       AND ev.type = 'aha'),
    (SELECT min(c."completedAt") FROM "UserPathStepCompletion" c WHERE c."userId" = s."userId"
       AND c."completedAt" >= s.souscrit_le AND (s.suivante IS NULL OR c."completedAt" < s.suivante))
  )`)} AS aha,
  (SELECT count(DISTINCT (${UTC("p.d")} AT TIME ZONE 'Europe/Paris')::date) FROM (
      SELECT c."completedAt" AS d FROM "UserPathStepCompletion" c WHERE c."userId" = s."userId"
      UNION ALL
      SELECT x."occurredAt" FROM "UsageEvent" x WHERE x."userId" = s."userId" AND x.type = 'jour_pratique'
    ) p WHERE p.d >= s.souscrit_le AND p.d < s.souscrit_le + interval '7 days')::int AS "joursPratiqueJ7",
  EXISTS (SELECT 1 FROM "WebhookEvent" w WHERE w."eventId" = 'onboarding-premium:E0:' || s."userId") AS bienvenue,
  ${UTC(`(SELECT min(ev."occurredAt") FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'portail_ouvert' AND ev.detail = 'resilier')`)} AS "clicResilier",
  ${UTC(`(SELECT min(ev."occurredAt") FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'resiliation_programmee')`)} AS resiliation,
  (SELECT ev.detail FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'resiliation_programmee' ORDER BY ev."occurredAt" LIMIT 1) AS motif,
  EXISTS (SELECT 1 FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'renouvellement_paye') AS renouvele
FROM s JOIN r ON r."userId" = s."userId"
ORDER BY s.souscrit_le
`;

/** Comptes Premium sans ligne `souscription` (nombre seulement). */
export const SQL_SANS_SOUSCRIPTION = `
SELECT count(*)::int AS n FROM "User" u
WHERE u.plan = 'PREMIUM'
  AND NOT EXISTS (SELECT 1 FROM "UsageEvent" e WHERE e."userId" = u.id AND e.type = 'souscription')
`;

/** Les deux requêtes en un seul JSON (voie psql) : `{ "lignes": [...], "sansSouscription": n }`. */
export const SQL_JSON = `SELECT json_build_object(
  'lignes', coalesce((SELECT json_agg(t) FROM (${SQL_TABLEAU_ABONNES}) t), '[]'::json),
  'sansSouscription', (${SQL_SANS_SOUSCRIPTION})
);`;

type DateSql = Date | string | null;

/** Ligne brute (dates en `Date`, ou en texte ISO avec fuseau selon le pilote). */
export interface LigneBrute {
  rang: number;
  numero: number;
  souscritLe: DateSql;
  formule: string | null;
  premierAcces: DateSql;
  premierContenu: string | null;
  aha: DateSql;
  joursPratiqueJ7: number;
  bienvenue: boolean;
  clicResilier: DateSql;
  resiliation: DateSql;
  motif: string | null;
  renouvele: boolean;
}

const MIN = 60_000;
const HEURE = 60 * MIN;
const JOUR = 24 * HEURE;
/** Délai de grâce avant de conclure « non » au 2e prélèvement (relances Stripe). */
const GRACE_PRELEVEMENT = 3 * JOUR;
/** Seuil sous lequel on lit cas par cas, sans aucun chiffre agrégé (§5.2, règle 1). */
export const SEUIL_LECTURE_AGREGEE = 15;
/** Taille des cohortes comparées (§5.2, règle 2). */
export const TAILLE_COHORTE = 10;

/** Date d'une colonne SQL. Une chaîne sans fuseau est lue comme de l'UTC (jamais en heure locale). */
export function enDate(v: DateSql): Date | null {
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v;
  const iso = /[zZ]|[+-]\d\d(:?\d\d)?$/.test(v) ? v.replace(" ", "T") : `${v.replace(" ", "T")}Z`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

const FORMAT_PARIS = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

/**
 * Date d'option de lecture (`--depuis`, `--activation`) : une date seule (AAAA-MM-JJ) = minuit à
 * PARIS ; une date-heure avec fuseau (ISO) est prise telle quelle. null si illisible.
 */
export function lireDateParis(v: string): Date | null {
  const jour = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!jour) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const [a, m, j] = [Number(jour[1]), Number(jour[2]), Number(jour[3])];
  const cible = Date.UTC(a, m - 1, j);
  // Décalage de Paris à cet instant (1 h ou 2 h), recalculé une fois pour les jours de changement d'heure.
  const decalage = (t: number) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
        .formatToParts(new Date(t))
        .map((x) => [x.type, x.value]),
    );
    return Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute)) - t;
  };
  let t = cible - decalage(cible);
  t = cible - decalage(t);
  return new Date(t);
}

/** « 01/10/2026 12:00 » en heure de Paris, quel que soit le fuseau de la machine. */
export function heureParis(d: Date): string {
  return FORMAT_PARIS.format(d).replace(",", "");
}

/** « 4 min », « 2 h 05 », « 3 j ». */
export function formaterDelai(ms: number): string {
  if (ms < HEURE) return `${Math.max(0, Math.round(ms / MIN))} min`;
  if (ms < JOUR) return `${Math.floor(ms / HEURE)} h ${String(Math.floor((ms % HEURE) / MIN)).padStart(2, "0")}`;
  return `${Math.floor(ms / JOUR)} j`;
}

/** M-A, M-B… M-Z, puis M-AA (préfixe propre à ce tableau). */
export function lettre(rang: number): string {
  let n = rang;
  let s = "";
  while (n > 0) {
    s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
    n = Math.floor((n - 1) / 26);
  }
  return `M-${s}`;
}

function deuxiemePrelevement(souscrit: Date, formule: string | null): Date {
  const d = new Date(souscrit);
  if (formule === "year") d.setUTCFullYear(d.getUTCFullYear() + 1);
  else d.setUTCMonth(d.getUTCMonth() + 1);
  return d;
}

export interface LigneAbonne {
  abonne: string;
  rang: number;
  souscrit: Date;
  premierAccesMs: number | null;
  premierContenu: string | null;
  ahaMs: number | null;
  /** null tant que J7 n'est pas atteint. */
  joursPratiqueJ7: number | null;
  bienvenue: boolean;
  clicResilierMs: number | null;
  resiliationMs: number | null;
  motif: string | null;
  /** « inconnu (application) » : achat dans l'application sans renouvellement reçu (formule inconnue). */
  actifDeuxiemePrelevement: "oui" | "non" | "pas encore" | "inconnu (application)";
}

/** Calcule les délais (aucun identifiant : lettre du rang, suffixée pour une 2e souscription). */
export function lignesAbonnes(brutes: LigneBrute[], now: Date): LigneAbonne[] {
  const lignes: LigneAbonne[] = [];
  for (const b of brutes) {
    const souscrit = enDate(b.souscritLe);
    if (!souscrit) continue;
    const delai = (v: DateSql) => {
      const d = enDate(v);
      return d ? d.getTime() - souscrit.getTime() : null;
    };
    const echeance = deuxiemePrelevement(souscrit, b.formule);
    lignes.push({
      abonne: Number(b.numero) > 1 ? `${lettre(Number(b.rang))}${Number(b.numero)}` : lettre(Number(b.rang)),
      rang: Number(b.rang),
      souscrit,
      premierAccesMs: delai(b.premierAcces),
      premierContenu: b.premierContenu,
      ahaMs: delai(b.aha),
      joursPratiqueJ7: now.getTime() - souscrit.getTime() >= 7 * JOUR ? Number(b.joursPratiqueJ7) : null,
      bienvenue: !!b.bienvenue,
      clicResilierMs: delai(b.clicResilier),
      resiliationMs: delai(b.resiliation),
      motif: b.motif,
      actifDeuxiemePrelevement: b.renouvele
        ? "oui"
        : now.getTime() < echeance.getTime() + GRACE_PRELEVEMENT
          ? "pas encore"
          : b.formule === "iap"
            ? "inconnu (application)"
            : "non",
    });
  }
  return lignes;
}

const ENTETE =
  "| Abonné | Souscription (Paris) | Premier accès Premium | Premier contenu | « aha » | Jours de pratique à J7 | Bienvenue envoyé | Clic « résilier » | Résiliation programmée | Motif | Actif au 2e prélèvement |";

function tableau(lignes: LigneAbonne[]): string[] {
  const d = (ms: number | null) => (ms === null ? "aucun" : formaterDelai(ms));
  return [
    ENTETE,
    "|---|---|---|---|---|---|---|---|---|---|---|",
    ...lignes.map(
      (l) =>
        `| ${[
          l.abonne,
          heureParis(l.souscrit),
          d(l.premierAccesMs),
          l.premierContenu ?? "",
          d(l.ahaMs),
          l.joursPratiqueJ7 === null ? "J7 pas atteint" : String(l.joursPratiqueJ7),
          l.bienvenue ? "oui" : "non",
          l.clicResilierMs === null ? "non" : `après ${formaterDelai(l.clicResilierMs)}`,
          l.resiliationMs === null ? "non" : `après ${formaterDelai(l.resiliationMs)}`,
          l.motif ?? "",
          l.actifDeuxiemePrelevement,
        ].join(" | ")} |`,
    ),
  ];
}

/** Lecture « x sur n » (comptes distincts), ou cas par cas sous le seuil. */
function indicateurs(lignes: LigneAbonne[], titre: string): string[] {
  const n = new Set(lignes.map((l) => l.rang)).size;
  if (n < SEUIL_LECTURE_AGREGEE) {
    return [`${titre} : ${n} abonné(s), lecture cas par cas (moins de ${SEUIL_LECTURE_AGREGEE}), aucun chiffre agrégé.`];
  }
  const sur = (x: number, total: number) => `${x} sur ${total}`;
  const j7 = lignes.filter((l) => l.joursPratiqueJ7 !== null);
  const dus = lignes.filter((l) => l.actifDeuxiemePrelevement === "oui" || l.actifDeuxiemePrelevement === "non");
  const t = lignes.length;
  return [
    `${titre} : ${n} abonnés (${t} souscriptions), indicateurs avancés dans l'ordre du §5.2 :`,
    `- accès à un contenu Premium dans les 10 minutes : ${sur(lignes.filter((l) => l.premierAccesMs !== null && l.premierAccesMs <= 10 * MIN).length, t)}`,
    `- « aha » à 24 h : ${sur(lignes.filter((l) => l.ahaMs !== null && l.ahaMs <= JOUR).length, t)}`,
    `- au moins 2 jours de pratique à J7 : ${sur(j7.filter((l) => (l.joursPratiqueJ7 ?? 0) >= 2).length, j7.length)}`,
    `- résiliation programmée avant J7 : ${sur(lignes.filter((l) => l.resiliationMs !== null && l.resiliationMs < 7 * JOUR).length, t)}`,
    `- actif au 2e prélèvement : ${sur(dus.filter((l) => l.actifDeuxiemePrelevement === "oui").length, dus.length)}`,
    `- R3, bienvenue envoyé : ${sur(lignes.filter((l) => l.bienvenue).length, t)}`,
  ];
}

export interface OptionsLecture {
  /** Ignorer les souscriptions antérieures (facteur confondant : onboarding ouvert le 08/11). */
  depuis?: Date | null;
  /** Activation de l'espace : sépare la référence (10 dernières avant) et les suivantes. */
  activation?: Date | null;
  /** Comptes Premium sans ligne `souscription`. */
  sansSouscription?: number | null;
}

/** Tableau Markdown et lecture selon les règles du §5.2. */
export function tableauAbonnes(brutes: LigneBrute[], now: Date, options: OptionsLecture = {}): string {
  const toutes = lignesAbonnes(brutes, now).filter((l) => !options.depuis || l.souscrit >= options.depuis);
  const sortie = [
    `# Mesure d'usage : une ligne par abonné (lecture seule, ${heureParis(now)}, heure de Paris)`,
    "",
    "Lettres propres à ce tableau (préfixe M-), sans lien avec les A à D de `resiliations-s23-donnees.md`.",
    options.depuis ? `Souscriptions depuis le ${heureParis(options.depuis)} seulement.` : "",
    typeof options.sansSouscription === "number"
      ? `${options.sansSouscription} compte(s) Premium sans ligne de souscription (antérieurs à la mesure ou activés hors paiement) : absents du tableau.`
      : "",
    "",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "");

  if (!options.activation) {
    sortie.push(...tableau(toutes), "", ...indicateurs(toutes, "Depuis la mise en ligne de la mesure"));
    return sortie.join("\n");
  }
  const avant = toutes.filter((l) => l.souscrit < options.activation!).slice(-TAILLE_COHORTE);
  const apres = toutes.filter((l) => l.souscrit >= options.activation!);
  sortie.push(
    `## Référence : ${TAILLE_COHORTE} dernières souscriptions avant l'activation (${heureParis(options.activation)})`,
    "",
    ...tableau(avant),
    "",
    `## Après l'activation (les ${TAILLE_COHORTE} premières forment la cohorte comparée)`,
    "",
    ...tableau(apres),
    "",
    ...indicateurs(apres, "Après l'activation"),
  );
  return sortie.join("\n");
}
