/**
 * Lettre mensuelle : chiffres partagés par la page admin et le rapport du lundi
 * (s21, 18/10, demande de Thomas : « les inscrits newsletter dans les abonnés »).
 *
 *  - Inscrits par statut et par emplacement d'inscription (`source`), comptes de
 *    test (`ANALYTICS_EMAILS_EXCLUS`) exclus et comptés à part.
 *  - Semaine : inscriptions (consentement), confirmations, désinscriptions.
 *  - Numéros : prochain numéro préparé (date d'envoi prévue) et, par numéro
 *    envoyé, les envois réussis, les échecs et ceux en cours.
 *  - Sans la migration 14 (tables NewsletterIssue / NewsletterSend absentes) :
 *    les inscrits restent lisibles, `numeros` vaut null. Ne lit que des colonnes
 *    de la migration 9 sur NewsletterSubscriber. Jamais l'empreinte IP ni les jetons.
 * Ne lève jamais : base illisible = `etat: "illisible"`.
 */
import { emplacementDeSource } from "@/config/lettre";
import { emailsExclus } from "./comptes-test";
import { escapeHtml } from "./weekly-visits-email";

export type LettreStatuts = { enAttente: number; confirmes: number; desinscrits: number };

export type LettreNumero = {
  periodKey: string;
  subject: string;
  statut: "BROUILLON" | "VALIDE" | "ENVOYE";
  /** Date et heure d'envoi prévues (ISO). */
  envoiPrevu: string;
  envoyeLe: string | null;
};

export type LettreNumeroEnvoye = LettreNumero & { envoyes: number; echecs: number; enCours: number };

export type LettreNumeros = {
  prochain: LettreNumero | null;
  /** Numéros préparés (brouillon ou validé) dont l'envoi est encore à venir. */
  aVenir: number;
  envoyes: LettreNumeroEnvoye[];
};

export type LettreResume =
  | { etat: "table-absente" | "illisible"; detail: string }
  | {
      etat: "ok";
      statuts: LettreStatuts;
      /** Inscrits (tous statuts) dont l'adresse est un compte de test : hors compteurs. */
      comptesTestExclus: number;
      semaine: { inscriptions: number; confirmations: number; desinscriptions: number } | null;
      parEmplacement: Array<{ emplacement: string } & LettreStatuts>;
      /** null : migration 14 non jouée (tables des numéros absentes). */
      numeros: LettreNumeros | null;
    };

/** Table ou colonne absente (migration non jouée) : P2021 / P2022, ou message Postgres. */
export function estTableAbsente(err: unknown): boolean {
  const code = (err as { code?: unknown } | null)?.code;
  if (code === "P2021" || code === "P2022") return true;
  const msg = err instanceof Error ? err.message : "";
  return /does not exist|n'existe pas/i.test(msg);
}

const vide = (): LettreStatuts => ({ enAttente: 0, confirmes: 0, desinscrits: 0 });

function ajouter(s: LettreStatuts, statut: string, n: number) {
  if (statut === "PENDING") s.enAttente += n;
  else if (statut === "CONFIRMED") s.confirmes += n;
  else if (statut === "UNSUBSCRIBED") s.desinscrits += n;
}

const iso = (d: Date | null) => (d ? d.toISOString() : null);

async function chargerNumeros(now: Date, exclus: string[]): Promise<LettreNumeros | null> {
  const { prisma } = await import("@/lib/prisma");
  const select = { id: true, periodKey: true, subject: true, status: true, scheduledFor: true, sentAt: true } as const;
  try {
    const [prochain, aVenir, envoyes] = await Promise.all([
      prisma.newsletterIssue.findFirst({
        where: { audience: "MENSUELLE", status: { in: ["BROUILLON", "VALIDE"] } },
        orderBy: { scheduledFor: "asc" },
        select,
      }),
      prisma.newsletterIssue.count({
        where: { audience: "MENSUELLE", status: { in: ["BROUILLON", "VALIDE"] }, scheduledFor: { gte: now } },
      }),
      prisma.newsletterIssue.findMany({
        where: { audience: "MENSUELLE", OR: [{ status: "ENVOYE" }, { sends: { some: {} } }] },
        orderBy: { scheduledFor: "desc" },
        take: 6,
        select,
      }),
    ]);
    const parNumero = new Map<string, { envoyes: number; echecs: number; enCours: number }>();
    if (envoyes.length > 0) {
      const lignes = await prisma.newsletterSend.groupBy({
        by: ["issueId", "status"],
        where: { issueId: { in: envoyes.map((e) => e.id) }, email: { notIn: exclus } },
        _count: { _all: true },
      });
      for (const l of lignes) {
        const c = parNumero.get(l.issueId) ?? { envoyes: 0, echecs: 0, enCours: 0 };
        if (l.status === "ENVOYE") c.envoyes += l._count._all;
        else if (l.status === "ECHEC") c.echecs += l._count._all;
        else c.enCours += l._count._all;
        parNumero.set(l.issueId, c);
      }
    }
    const numero = (n: (typeof envoyes)[number]): LettreNumero => ({
      periodKey: n.periodKey,
      subject: n.subject,
      statut: n.status,
      envoiPrevu: n.scheduledFor.toISOString(),
      envoyeLe: iso(n.sentAt),
    });
    return {
      prochain: prochain ? numero(prochain) : null,
      aVenir,
      envoyes: envoyes.map((n) => ({ ...numero(n), ...(parNumero.get(n.id) ?? { envoyes: 0, echecs: 0, enCours: 0 }) })),
    };
  } catch (err) {
    if (estTableAbsente(err)) return null;
    throw err;
  }
}

/** Résumé de la lettre ; `fenetre` null = pas de chiffres de la semaine. */
export async function chargerLettreResume(
  fenetre: { startAt: number; endAt: number } | null,
  now: Date = new Date(),
  exclus: string[] = emailsExclus(),
): Promise<LettreResume> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const horsTest = { email: { notIn: exclus } };
    const range = fenetre ? { gte: new Date(fenetre.startAt), lte: new Date(fenetre.endAt) } : null;
    const [groupes, comptesTestExclus, semaine] = await Promise.all([
      prisma.newsletterSubscriber.groupBy({ by: ["source", "status"], where: horsTest, _count: { _all: true } }),
      exclus.length ? prisma.newsletterSubscriber.count({ where: { email: { in: exclus } } }) : Promise.resolve(0),
      range
        ? Promise.all([
            prisma.newsletterSubscriber.count({ where: { ...horsTest, consentAt: range } }),
            prisma.newsletterSubscriber.count({ where: { ...horsTest, confirmedAt: range } }),
            prisma.newsletterSubscriber.count({ where: { ...horsTest, unsubscribedAt: range } }),
          ])
        : Promise.resolve(null),
    ]);
    const statuts = vide();
    const parEmpl = new Map<string, LettreStatuts>();
    for (const g of groupes) {
      const emplacement = emplacementDeSource(g.source) ?? "autre";
      const s = parEmpl.get(emplacement) ?? vide();
      ajouter(s, g.status, g._count._all);
      ajouter(statuts, g.status, g._count._all);
      parEmpl.set(emplacement, s);
    }
    const parEmplacement = [...parEmpl.entries()]
      .map(([emplacement, s]) => ({ emplacement, ...s }))
      .sort((a, b) => b.confirmes - a.confirmes || b.enAttente - a.enAttente || a.emplacement.localeCompare(b.emplacement));
    return {
      etat: "ok",
      statuts,
      comptesTestExclus,
      semaine: semaine ? { inscriptions: semaine[0], confirmations: semaine[1], desinscriptions: semaine[2] } : null,
      parEmplacement,
      numeros: await chargerNumeros(now, exclus),
    };
  } catch (err) {
    if (estTableAbsente(err)) return { etat: "table-absente", detail: "table NewsletterSubscriber absente (migration 9)" };
    console.warn(`[lettre] Résumé illisible : ${err instanceof Error ? err.message : "erreur"}`);
    return { etat: "illisible", detail: "base illisible" };
  }
}

const nf = new Intl.NumberFormat("fr-FR");
const dateParis = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});
const TD = "padding:8px 6px;border-bottom:1px solid #eee;";
const TD_NUM = `${TD}text-align:right;white-space:nowrap;`;
const H3 = "font-size:16px;margin:24px 0 8px;color:#7c3aed;";

export const STATUT_NUMERO: Record<LettreNumero["statut"], string> = {
  BROUILLON: "brouillon, à valider",
  VALIDE: "validé",
  ENVOYE: "envoyé",
};

/** « mois 2026-11, jeudi 5 novembre à 08:00 (validé) ». */
export function libelleNumero(n: LettreNumero): string {
  return `${n.periodKey}, ${dateParis.format(new Date(n.envoiPrevu))} (${STATUT_NUMERO[n.statut]})`;
}

/** Section HTML « Lettre mensuelle » du rapport du lundi (s21). */
export function buildLettreSectionHtml(r: LettreResume): string {
  const titre = `<h3 style="${H3}">Lettre mensuelle</h3>`;
  if (r.etat !== "ok") {
    return `${titre}<p style="font-size:13px;color:#b45309;margin:0;">Section indisponible : ${escapeHtml(r.detail)}.</p>`;
  }
  const s = r.statuts;
  const rows: [string, string][] = [
    ["Inscrits confirmés (reçoivent la lettre)", nf.format(s.confirmes)],
    ["En attente de confirmation", nf.format(s.enAttente)],
    ["Désinscrits", nf.format(s.desinscrits)],
  ];
  if (r.semaine) {
    rows.push(
      ["Inscriptions de la semaine", nf.format(r.semaine.inscriptions)],
      ["Confirmations de la semaine", nf.format(r.semaine.confirmations)],
      ["Désinscriptions de la semaine", nf.format(r.semaine.desinscriptions)],
    );
  }
  if (r.numeros) {
    const p = r.numeros.prochain;
    rows.push(["Prochain numéro", p ? escapeHtml(libelleNumero(p)) : "aucun numéro préparé"]);
    const dernier = r.numeros.envoyes[0];
    if (dernier) {
      rows.push([
        `Dernier envoi (${escapeHtml(dernier.periodKey)})`,
        `${nf.format(dernier.envoyes)} envoyés, ${nf.format(dernier.echecs)} échecs${dernier.enCours ? `, ${nf.format(dernier.enCours)} en cours` : ""}`,
      ]);
    }
  }
  const body = rows
    .map(([label, value]) => `<tr><td style="${TD}">${label}</td><td style="${TD_NUM}font-weight:600;">${value}</td></tr>`)
    .join("");
  const note = [
    r.comptesTestExclus ? `${nf.format(r.comptesTestExclus)} compte(s) de test exclu(s)` : "",
    r.numeros ? "" : "numéros : migration 14 non jouée",
  ]
    .filter(Boolean)
    .join(" ; ");
  return `${titre}<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${body}</table>${
    note ? `<p style="font-size:12px;color:#999;margin:8px 0 0;">${note}.</p>` : ""
  }`;
}
