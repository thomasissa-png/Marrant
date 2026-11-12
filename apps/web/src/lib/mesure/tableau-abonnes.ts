/**
 * Lecture de la mesure d'usage (s24, lot 0) : tableau « une ligne par abonné » du §5.2 du brief
 * `docs/espace-client/brief-espace-client-s24.md`. LECTURE SEULE.
 *
 * `SQL_TABLEAU_ABONNES` sort une ligne par souscription (ordre des souscriptions) sans aucun
 * identifiant : le compte est remplacé par son rang (A, B, C… dans l'ordre de première
 * souscription), une 2e souscription du même compte garde la même lettre. `tableauAbonnes` met en
 * forme (délais, J7, 2e prélèvement) ; règles de lecture : cas par cas sous 15 abonnés, aucun
 * pourcentage ; au-delà, « x sur n ».
 * Lancement : `scripts/mesure-usage/tableau-abonnes.ts`.
 */

/** Une ligne par souscription. Dates en UTC (colonnes `timestamp(3)` de Prisma). */
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
  s.souscrit_le AS "souscritLe",
  s.formule,
  (SELECT min(ev."occurredAt") FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'premier_acces_premium') AS "premierAcces",
  (SELECT ev.detail FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'premier_acces_premium' ORDER BY ev."occurredAt" LIMIT 1) AS "premierContenu",
  LEAST(
    (SELECT min(ev."occurredAt") FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
       AND ev.type = 'aha'),
    (SELECT min(c."completedAt") FROM "UserPathStepCompletion" c WHERE c."userId" = s."userId"
       AND c."completedAt" >= s.souscrit_le AND (s.suivante IS NULL OR c."completedAt" < s.suivante))
  ) AS aha,
  (SELECT count(DISTINCT ((p.d AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris')::date) FROM (
      SELECT c."completedAt" AS d FROM "UserPathStepCompletion" c WHERE c."userId" = s."userId"
      UNION ALL
      SELECT x."occurredAt" FROM "UsageEvent" x WHERE x."userId" = s."userId" AND x.type = 'jour_pratique'
    ) p WHERE p.d >= s.souscrit_le AND p.d < s.souscrit_le + interval '7 days')::int AS "joursPratiqueJ7",
  (SELECT min(ev."occurredAt") FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'resiliation_programmee') AS resiliation,
  (SELECT ev.detail FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'resiliation_programmee' ORDER BY ev."occurredAt" LIMIT 1) AS motif,
  EXISTS (SELECT 1 FROM ev WHERE ev."userId" = s."userId" AND ev.souscrit_le = s.souscrit_le
     AND ev.type = 'renouvellement_paye') AS renouvele
FROM s JOIN r ON r."userId" = s."userId"
ORDER BY s.souscrit_le
`;

/** Ligne brute (dates en `Date`, ou en texte ISO selon le pilote). */
export interface LigneBrute {
  rang: number;
  numero: number;
  souscritLe: Date | string;
  formule: string | null;
  premierAcces: Date | string | null;
  premierContenu: string | null;
  aha: Date | string | null;
  joursPratiqueJ7: number;
  resiliation: Date | string | null;
  motif: string | null;
  renouvele: boolean;
}

const MIN = 60_000;
const HEURE = 60 * MIN;
const JOUR = 24 * HEURE;
/** Délai de grâce avant de conclure « non » au 2e prélèvement (relances Stripe). */
const GRACE_PRELEVEMENT = 3 * JOUR;

/** Date d'une colonne SQL. Une chaîne sans fuseau (`timestamp` lu en texte) est de l'UTC. */
function enDate(v: Date | string | null): Date | null {
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v;
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(v) ? v : `${v.replace(" ", "T")}Z`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** « 4 min », « 2 h 05 », « 3 j ». */
export function formaterDelai(ms: number): string {
  if (ms < HEURE) return `${Math.max(0, Math.round(ms / MIN))} min`;
  if (ms < JOUR) return `${Math.floor(ms / HEURE)} h ${String(Math.floor((ms % HEURE) / MIN)).padStart(2, "0")}`;
  return `${Math.floor(ms / JOUR)} j`;
}

/** A, B… Z, puis AA, AB… */
export function lettre(rang: number): string {
  let n = rang;
  let s = "";
  while (n > 0) {
    s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** Date attendue du 2e prélèvement (1 mois ou 1 an après la souscription). */
function deuxiemePrelevement(souscrit: Date, formule: string | null): Date {
  const d = new Date(souscrit);
  if (formule === "year") d.setUTCFullYear(d.getUTCFullYear() + 1);
  else d.setUTCMonth(d.getUTCMonth() + 1);
  return d;
}

export interface LigneAbonne {
  abonne: string;
  souscrit: Date;
  premierAccesMs: number | null;
  ahaMs: number | null;
  /** null tant que J7 n'est pas atteint. */
  joursPratiqueJ7: number | null;
  resiliationMs: number | null;
  /** « oui », « non » ou « pas encore » (2e prélèvement pas encore dû). */
  actifDeuxiemePrelevement: "oui" | "non" | "pas encore";
  premierContenu: string | null;
  motif: string | null;
}

/** Calcule les délais (aucun identifiant : lettre du rang, suffixée pour une 2e souscription). */
export function lignesAbonnes(brutes: LigneBrute[], now: Date): LigneAbonne[] {
  const lignes: LigneAbonne[] = [];
  for (const b of brutes) {
    const souscrit = enDate(b.souscritLe);
    if (!souscrit) continue;
    const delai = (v: Date | string | null) => {
      const d = enDate(v);
      return d ? d.getTime() - souscrit.getTime() : null;
    };
    const echeance = deuxiemePrelevement(souscrit, b.formule);
    lignes.push({
      abonne: Number(b.numero) > 1 ? `${lettre(Number(b.rang))}${Number(b.numero)}` : lettre(Number(b.rang)),
      souscrit,
      premierAccesMs: delai(b.premierAcces),
      ahaMs: delai(b.aha),
      joursPratiqueJ7: now.getTime() - souscrit.getTime() >= 7 * JOUR ? Number(b.joursPratiqueJ7) : null,
      resiliationMs: delai(b.resiliation),
      actifDeuxiemePrelevement: b.renouvele
        ? "oui"
        : now.getTime() < echeance.getTime() + GRACE_PRELEVEMENT
          ? "pas encore"
          : "non",
      premierContenu: b.premierContenu,
      motif: b.motif,
    });
  }
  return lignes;
}

/** Seuil sous lequel on lit cas par cas, sans aucun pourcentage ni « x sur n » (§5.2, règle 1). */
export const SEUIL_LECTURE_AGREGEE = 15;

/** Tableau Markdown + indicateurs avancés (« x sur n » seulement à partir de 15 abonnés). */
export function tableauAbonnes(brutes: LigneBrute[], now: Date): string {
  const lignes = lignesAbonnes(brutes, now);
  const d = (ms: number | null) => (ms === null ? "aucun" : formaterDelai(ms));
  const sortie = [
    `# Mesure d'usage : une ligne par abonné (lecture seule, ${now.toISOString().slice(0, 16).replace("T", " ")} UTC)`,
    "",
    "| Abonné | Souscription (UTC) | Premier accès Premium | Premier contenu | « aha » | Jours de pratique à J7 | Résiliation programmée | Motif | Actif au 2e prélèvement |",
    "|---|---|---|---|---|---|---|---|---|",
    ...lignes.map((l) =>
      `| ${[
        l.abonne,
        l.souscrit.toISOString().slice(0, 16).replace("T", " "),
        d(l.premierAccesMs),
        l.premierContenu ?? "",
        d(l.ahaMs),
        l.joursPratiqueJ7 === null ? "J7 pas atteint" : String(l.joursPratiqueJ7),
        l.resiliationMs === null ? "non" : `après ${formaterDelai(l.resiliationMs)}`,
        l.motif ?? "",
        l.actifDeuxiemePrelevement,
      ].join(" | ")} |`,
    ),
    "",
  ];
  const n = lignes.length;
  if (n < SEUIL_LECTURE_AGREGEE) {
    sortie.push(`${n} souscription(s) : lecture cas par cas (moins de ${SEUIL_LECTURE_AGREGEE}), aucun pourcentage.`);
    return sortie.join("\n");
  }
  const sur = (x: number, total: number) => `${x} sur ${total}`;
  const j7 = lignes.filter((l) => l.joursPratiqueJ7 !== null);
  const dus = lignes.filter((l) => l.actifDeuxiemePrelevement !== "pas encore");
  sortie.push(
    "Indicateurs avancés (dans l'ordre du §5.2) :",
    `- accès à un contenu Premium dans les 10 minutes : ${sur(lignes.filter((l) => l.premierAccesMs !== null && l.premierAccesMs <= 10 * MIN).length, n)}`,
    `- « aha » à 24 h : ${sur(lignes.filter((l) => l.ahaMs !== null && l.ahaMs <= JOUR).length, n)}`,
    `- au moins 2 jours de pratique à J7 : ${sur(j7.filter((l) => (l.joursPratiqueJ7 ?? 0) >= 2).length, j7.length)}`,
    `- résiliation programmée avant J7 : ${sur(lignes.filter((l) => l.resiliationMs !== null && l.resiliationMs < 7 * JOUR).length, n)}`,
    `- actif au 2e prélèvement : ${sur(dus.filter((l) => l.actifDeuxiemePrelevement === "oui").length, dus.length)}`,
  );
  return sortie.join("\n");
}
