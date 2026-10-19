/**
 * Lettre de la semaine (hebdo Premium, s21 ; spec US-H7) : chiffres partagés par la
 * page admin (Abonnés › Lettre) et le rapport du lundi. Même forme que `weekly-lettre.ts`
 * (`etat` ok, table-absente, illisible), plus `ferme` : les trois interrupteurs fermés,
 * aucune lecture en base. Comptes de test (`emailsExclus`) comptés à part, jamais masqués
 * de la liste. Jamais de jeton d'arrêt dans une réponse : `select` explicite.
 * Ne lève jamais.
 */
import {
  LETTRE_HEBDO_ENVOIS_OUVERTS,
  LETTRE_HEBDO_INSCRIPTIONS_OUVERTES,
  LETTRE_HEBDO_PROMESSE,
  LETTRE_HEBDO_STOCK_ALERTE,
} from "@/config/lettre";
import { emailsExclus } from "./comptes-test";
import { escapeHtml } from "./weekly-visits-email";
import { estTableAbsente } from "./weekly-lettre";

export type Interrupteurs = { inscriptions: boolean; envois: boolean; promesse: boolean };
export type ParOrigine = Record<string, number>;
export type NumeroHebdoResume = { semaine: string; objet: string; statut: "BROUILLON" | "VALIDE" | "ENVOYE"; envoiPrevu: string };

export type LettreHebdoResume =
  | { etat: "ferme"; interrupteurs: Interrupteurs }
  | { etat: "table-absente" | "illisible"; interrupteurs: Interrupteurs; detail: string }
  | {
      etat: "ok";
      interrupteurs: Interrupteurs;
      premiumActifs: number;
      actives: number;
      /** Premium actifs sans la lettre : ils reçoivent la mensuelle à la place (s'ils y sont inscrits). */
      premiumSansHebdo: number;
      arreteesParOrigine: ParOrigine;
      comptesTest: number;
      semaine: { activations: ParOrigine; arrets: ParOrigine } | null;
      dernier: (NumeroHebdoResume & { envoyes: number; echecs: number; enCours: number; dontTest: number }) | null;
      prochain: NumeroHebdoResume | null;
      stock: number;
      alerteStock: boolean;
      /** Semaines passées dont le numéro VALIDE n'est jamais parti (pas de rattrapage). */
      nonEnvoyes: string[];
      /** Numéro VALIDE de la semaine pas parti un vendredi après 12 h : signalé en tête. */
      retard: string | null;
    };

export const interrupteursCourants = (): Interrupteurs => ({
  inscriptions: LETTRE_HEBDO_INSCRIPTIONS_OUVERTES,
  envois: LETTRE_HEBDO_ENVOIS_OUVERTS,
  promesse: LETTRE_HEBDO_PROMESSE,
});

const compter = (lignes: Array<{ origine: string | null; n: number }>): ParOrigine => {
  const r: ParOrigine = {};
  for (const l of lignes) r[l.origine ?? "inconnue"] = (r[l.origine ?? "inconnue"] ?? 0) + l.n;
  return r;
};

/** Vendredi 12 h (Paris) de la semaine du jeudi `envoi` : jeudi 8 h + 28 h. */
const VENDREDI_MIDI_MS = 28 * 3600 * 1000;

export async function chargerLettreHebdoResume(
  fenetre: { startAt: number; endAt: number } | null,
  now: Date = new Date(),
  exclus: string[] = emailsExclus(),
  interrupteurs: Interrupteurs = interrupteursCourants(),
  /** Admin : lit la base même interrupteurs fermés (comptes de test, numéros préparés). */
  memeFerme = false,
): Promise<LettreHebdoResume> {
  if (!memeFerme && !interrupteurs.inscriptions && !interrupteurs.envois && !interrupteurs.promesse) return { etat: "ferme", interrupteurs };
  try {
    const { prisma } = await import("@/lib/prisma");
    const horsTest = { email: { notIn: exclus } };
    const range = fenetre ? { gte: new Date(fenetre.startAt), lte: new Date(fenetre.endAt) } : null;
    const [premiumActifs, actives, arretees, comptesTest, activationsSemaine, arretsSemaine, numeros] = await Promise.all([
      prisma.user.count({ where: { plan: "PREMIUM", ...horsTest } }),
      prisma.premiumLetterPreference.count({ where: { enabled: true, user: { is: { plan: "PREMIUM", ...horsTest } } } }),
      prisma.premiumLetterPreference.groupBy({ by: ["stopOrigin"], where: { enabled: false, user: { is: horsTest } }, _count: { _all: true } }),
      exclus.length ? prisma.premiumLetterPreference.count({ where: { user: { is: { email: { in: exclus } } } } }) : Promise.resolve(0),
      range
        ? prisma.premiumLetterPreference.groupBy({ by: ["activationOrigin"], where: { activatedAt: range, user: { is: horsTest } }, _count: { _all: true } })
        : Promise.resolve(null),
      range
        ? prisma.premiumLetterPreference.groupBy({ by: ["stopOrigin"], where: { stoppedAt: range, user: { is: horsTest } }, _count: { _all: true } })
        : Promise.resolve(null),
      prisma.newsletterIssue.findMany({
        where: { audience: "HEBDO_PREMIUM" },
        orderBy: { scheduledFor: "asc" },
        select: { id: true, periodKey: true, subject: true, status: true, scheduledFor: true },
      }),
    ]);
    const resume = (n: (typeof numeros)[number]): NumeroHebdoResume => ({
      semaine: n.periodKey,
      objet: n.subject,
      statut: n.status,
      envoiPrevu: n.scheduledFor.toISOString(),
    });
    const finSemaine = (n: (typeof numeros)[number]) => n.scheduledFor.getTime() + (3 * 24 + 16) * 3600 * 1000;
    const passes = numeros.filter((n) => n.status === "ENVOYE" || (n.scheduledFor <= now && n.status === "VALIDE"));
    const dernierNumero = [...passes].reverse().find((n) => n.status === "ENVOYE" || finSemaine(n) > now.getTime()) ?? null;
    let dernier: Extract<LettreHebdoResume, { etat: "ok" }>["dernier"] = null;
    if (dernierNumero) {
      const lignes = await prisma.newsletterSend.groupBy({ by: ["status", "email"], where: { issueId: dernierNumero.id }, _count: { _all: true } });
      const c = { envoyes: 0, echecs: 0, enCours: 0, dontTest: 0 };
      for (const l of lignes) {
        if (exclus.includes(l.email)) {
          c.dontTest += l._count._all;
        }
        if (l.status === "ENVOYE") c.envoyes += l._count._all;
        else if (l.status === "ECHEC") c.echecs += l._count._all;
        else c.enCours += l._count._all;
      }
      dernier = { ...resume(dernierNumero), ...c };
    }
    const aVenir = numeros.filter((n) => n.status === "VALIDE" && finSemaine(n) > now.getTime());
    const prochainNumero = numeros.find((n) => n.status !== "ENVOYE" && n.scheduledFor > now) ?? null;
    const retardNumero = numeros.find(
      (n) => n.status === "VALIDE" && now.getTime() > n.scheduledFor.getTime() + VENDREDI_MIDI_MS && finSemaine(n) > now.getTime(),
    );
    const parOrigine = (g: Array<{ _count: { _all: number } } & Record<string, unknown>> | null, cle: string) =>
      g ? compter(g.map((x) => ({ origine: (x[cle] as string | null) ?? null, n: x._count._all }))) : {};
    return {
      etat: "ok",
      interrupteurs,
      premiumActifs,
      actives,
      premiumSansHebdo: Math.max(0, premiumActifs - actives),
      arreteesParOrigine: parOrigine(arretees, "stopOrigin"),
      comptesTest,
      semaine: range ? { activations: parOrigine(activationsSemaine, "activationOrigin"), arrets: parOrigine(arretsSemaine, "stopOrigin") } : null,
      dernier,
      prochain: prochainNumero ? resume(prochainNumero) : null,
      stock: aVenir.length,
      alerteStock: aVenir.length < LETTRE_HEBDO_STOCK_ALERTE,
      nonEnvoyes: numeros.filter((n) => n.status === "VALIDE" && finSemaine(n) <= now.getTime()).map((n) => n.periodKey),
      retard: retardNumero?.periodKey ?? null,
    };
  } catch (err) {
    if (estTableAbsente(err)) return { etat: "table-absente", interrupteurs, detail: "migration 15 non jouée" };
    console.warn(`[lettre-hebdo] Résumé illisible : ${err instanceof Error ? err.message : "erreur"}`);
    return { etat: "illisible", interrupteurs, detail: "base illisible" };
  }
}

const nf = new Intl.NumberFormat("fr-FR");
const dateParis = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" });
const TD = "padding:8px 6px;border-bottom:1px solid #eee;";
const TD_NUM = `${TD}text-align:right;white-space:nowrap;`;
const H3 = "font-size:16px;margin:24px 0 8px;color:#7c3aed;";
const ALERTE = "font-size:13px;color:#b45309;font-weight:600;margin:0 0 8px;";

export const origines = (p: ParOrigine): string =>
  Object.keys(p).length === 0 ? "0" : Object.entries(p).map(([o, n]) => `${nf.format(n)} ${o}`).join(", ");

const etatInterrupteurs = (i: Interrupteurs) =>
  `inscriptions ${i.inscriptions ? "ouvertes" : "fermées"}, envois ${i.envois ? "ouverts" : "fermés"}, promesse ${i.promesse ? "affichée" : "masquée"}`;

/** Section HTML « Lettre de la semaine » du rapport du lundi (spec H7-7). */
export function buildLettreHebdoSectionHtml(r: LettreHebdoResume): string {
  const titre = `<h3 style="${H3}">Lettre de la semaine (Premium)</h3>`;
  const etat = `<p style="font-size:12px;color:#999;margin:0 0 8px;">Interrupteurs : ${etatInterrupteurs(r.interrupteurs)}.</p>`;
  if (r.etat === "ferme") return `${titre}${etat}`;
  if (r.etat !== "ok") return `${titre}${etat}<p style="font-size:13px;color:#b45309;margin:0;">Section indisponible : ${escapeHtml(r.detail)}.</p>`;
  const alertes = [
    r.retard ? `Numéro ${escapeHtml(r.retard)} validé mais pas parti (vendredi midi passé).` : "",
    r.alerteStock ? `Stock sous ${LETTRE_HEBDO_STOCK_ALERTE} : ${nf.format(r.stock)} numéro(s) validé(s) à venir, préparer le prochain lot.` : "",
    r.nonEnvoyes.length ? `Non envoyé(s) : ${escapeHtml(r.nonEnvoyes.join(", "))}.` : "",
  ]
    .filter(Boolean)
    .map((a) => `<p style="${ALERTE}">${a}</p>`)
    .join("");
  const rows: [string, string][] = [
    ["Premium actifs", nf.format(r.premiumActifs)],
    ["Lettre activée", nf.format(r.actives)],
    ["Premium sans la lettre (mensuelle à la place)", nf.format(r.premiumSansHebdo)],
    ["Arrêtées, par origine", escapeHtml(origines(r.arreteesParOrigine))],
  ];
  if (r.semaine) {
    rows.push(["Activations de la semaine", escapeHtml(origines(r.semaine.activations))], ["Arrêts de la semaine", escapeHtml(origines(r.semaine.arrets))]);
  }
  if (r.dernier) {
    rows.push([
      `Dernier jeudi (${escapeHtml(r.dernier.semaine)})`,
      `${nf.format(r.dernier.envoyes)} envoyés, ${nf.format(r.dernier.echecs)} échecs${r.dernier.enCours ? `, ${nf.format(r.dernier.enCours)} en cours` : ""}${r.dernier.dontTest ? `, dont ${nf.format(r.dernier.dontTest)} compte(s) de test` : ""}`,
    ]);
  }
  rows.push([
    "Prochain numéro",
    r.prochain ? escapeHtml(`${r.prochain.semaine}, « ${r.prochain.objet} », ${dateParis.format(new Date(r.prochain.envoiPrevu))}`) : "aucun numéro préparé",
  ]);
  rows.push(["Stock validé à venir", nf.format(r.stock)]);
  const body = rows.map(([label, value]) => `<tr><td style="${TD}">${label}</td><td style="${TD_NUM}font-weight:600;">${value}</td></tr>`).join("");
  const note = r.comptesTest ? `<p style="font-size:12px;color:#999;margin:8px 0 0;">${nf.format(r.comptesTest)} compte(s) de test hors compteurs.</p>` : "";
  return `${titre}${etat}${alertes}<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${body}</table>${note}`;
}
