/**
 * Numéros PRÉPARÉS de la lettre de la semaine (hebdo Premium, s21 ; spec §2, §3, US-H5).
 * Règle du 01/10 : contenu préparé par lot, aucune IA au fil de l'eau.
 *
 * s22 (décision de Thomas du 25/10) : plus jamais une fiche du carnet recopiée. Chaque lettre
 * réservée est un texte libre écrit par l'équipe (une situation et trois répliques, ou le
 * décryptage d'un passage d'humoriste), de « Salut, » à la signature. Le code n'ajoute que la
 * ligne « Ta question à l'équipe » et le pied hebdo, à l'envoi (`rendu-hebdo.ts`).
 *
 * Source : `src/data/lettre/hebdo-premium.json`. `VALIDE` ne suffit pas pour partir : chaque
 * numéro doit AUSSI être approuvé par Thomas dans l'admin (`approbation-hebdo.ts`), et toute
 * modification ultérieure annule cette approbation. Une entrée :
 * {
 *   "semaine": "2026-W46",                       // semaine ISO (année du jeudi)
 *   "statut": "BROUILLON" | "VALIDE",
 *   "envoiPrevu": "2026-11-13T08:00:00+01:00",   // facultatif ; défaut : jeudi 8 h Paris de la semaine
 *   "objet": "…",                                // 45 caractères au plus
 *   "preEntete": "…",
 *   "corps": "Salut,\n\n…\n\nL'Équipe Deviens Marrant"   // texte complet, signature comprise
 * }
 * Synchronisé au démarrage dans `NewsletterIssue` (audience HEBDO_PREMIUM, periodKey = semaine).
 * Le fichier fait foi : un numéro pas encore envoyé qui n'y figure plus (ou n'y est plus valide)
 * est retiré de la base (`neutraliserAnciensNumeros`). Un numéro ENVOYE n'est JAMAIS modifié.
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import numerosJson from "@/data/lettre/hebdo-premium.json";
import numerosMensuelsJson from "@/data/lettre/numeros.json";
import { MARQUEUR_A_COMPLETER, LETTRE_HEBDO_STOCK_ALERTE } from "@/config/lettre";
import { envoiSemaine, semaineIsoParis, semaineValide } from "@/lib/lettre/calendrier";
import { SANS_APPROBATION } from "@/lib/lettre/approbation-hebdo";

const TIRET_CADRATIN = "—";
const sansTiret = (champ: string) => z.string().refine((v) => !v.includes(TIRET_CADRATIN), { message: `${champ} : tiret cadratin interdit` });

export const OBJET_HEBDO_MAX = 45;
export const SALUT_HEBDO = "Salut,";
export const SIGNATURE_HEBDO = "L'Équipe Deviens Marrant";

export const numeroHebdoSchema = z
  .object({
    semaine: z.string().refine(semaineValide, { message: "semaine ISO mal formée ou inexistante (AAAA-Www)" }),
    statut: z.enum(["BROUILLON", "VALIDE"]),
    envoiPrevu: z.string().datetime({ offset: true }).optional(),
    objet: sansTiret("objet").pipe(z.string().trim().min(3).max(OBJET_HEBDO_MAX, { message: `objet : ${OBJET_HEBDO_MAX} caractères au plus` })),
    preEntete: sansTiret("preEntete").pipe(z.string().trim().min(1).max(200)),
    corps: sansTiret("corps")
      .pipe(z.string().trim().min(50).max(20_000))
      .refine((c) => c.startsWith(SALUT_HEBDO), { message: `corps : doit commencer par « ${SALUT_HEBDO} »` })
      .refine((c) => c.includes(SIGNATURE_HEBDO), { message: `corps : signature « ${SIGNATURE_HEBDO} » absente` }),
  })
  // Ancien format (ficheId, accroche, pont) refusé en clair plutôt qu'ignoré en silence.
  .strict();
export type NumeroHebdo = z.infer<typeof numeroHebdoSchema>;

/**
 * Contrôle « aucune offre commerciale » (avis @legal C1, spec §2.4) : le jour où une
 * offre s'y glisse, la lettre devient de la prospection. Alerte grossière ; la relecture
 * humaine reste le vrai contrôle. Renvoie la liste des motifs trouvés (vide = conforme).
 */
const MOTS_INTERDITS = ["annuel", "parrain", "promo", "remise", "réduction", "offre"];
// Émojis : pictogrammes et symboles (plages Unicode Extended_Pictographic).
const EMOJI = /\p{Extended_Pictographic}/u;

export function motifsInterdits(texte: string): string[] {
  const motifs: string[] = [];
  const bas = texte.toLowerCase();
  if (texte.includes(TIRET_CADRATIN)) motifs.push("tiret cadratin");
  if (EMOJI.test(texte)) motifs.push("émoji");
  if (texte.includes(MARQUEUR_A_COMPLETER)) motifs.push("marqueur [À COMPLÉTER");
  if (bas.includes("/abonnement")) motifs.push("lien /abonnement");
  if (/utm_content=[^\s&]*-premium(?![\w-])/i.test(texte)) motifs.push("utm_content en -premium");
  if (texte.includes("€")) motifs.push("symbole €");
  for (const mot of MOTS_INTERDITS) if (new RegExp(`(^|[^\\p{L}])${mot}`, "iu").test(bas)) motifs.push(`mot « ${mot} »`);
  return motifs;
}

/** Semaines ISO des lettres du mois programmées (`numeros.json`, `envoiPrevu` renseigné). */
export function semainesLettreDuMois(source: unknown = numerosMensuelsJson): Set<string> {
  const semaines = new Set<string>();
  for (const e of Array.isArray(source) ? source : []) {
    const envoi = (e as { envoiPrevu?: unknown } | null)?.envoiPrevu;
    if (typeof envoi === "string" && !Number.isNaN(Date.parse(envoi))) semaines.add(semaineIsoParis(new Date(envoi)));
  }
  return semaines;
}

export interface NumeroHebdoPrepare {
  semaine: string;
  objet: string;
  preEntete: string;
  corps: string;
  envoiPrevu: Date;
  statut: "BROUILLON" | "VALIDE";
}

export interface SyncHebdoResultat {
  crees: number;
  misAJour: number;
  /** Numéros pas encore envoyés absents du fichier (ou refusés) : supprimés de la base. */
  retires: string[];
  ignores: string[];
}

/** Valide les entrées (sans base) ; les fautives vont dans `ignores`, avec le motif. */
export function preparerNumerosHebdo(
  source: unknown,
  mensuelles: ReadonlySet<string> = semainesLettreDuMois(),
): { numeros: NumeroHebdoPrepare[]; ignores: string[] } {
  const numeros: NumeroHebdoPrepare[] = [];
  const ignores: string[] = [];
  const semainesVues = new Set<string>();
  for (const [i, brut] of (Array.isArray(source) ? source : []).entries()) {
    const parsed = numeroHebdoSchema.safeParse(brut);
    if (!parsed.success) {
      const semaine = (brut as { semaine?: unknown } | null)?.semaine;
      ignores.push(`${typeof semaine === "string" ? semaine : `#${i}`} : ${parsed.error.issues.map((e) => e.message).join(", ")}`);
      continue;
    }
    const n = parsed.data;
    if (semainesVues.has(n.semaine)) {
      ignores.push(`${n.semaine} : deux numéros pour la même semaine`);
      continue;
    }
    if (mensuelles.has(n.semaine)) {
      ignores.push(`${n.semaine} : semaine de la lettre du mois (numeros.json), pas de lettre réservée`);
      continue;
    }
    const jeudi = envoiSemaine(n.semaine) as Date;
    const envoiPrevu = n.envoiPrevu ? new Date(n.envoiPrevu) : jeudi;
    if (semaineIsoParis(envoiPrevu) !== n.semaine || envoiPrevu.getTime() < jeudi.getTime()) {
      ignores.push(`${n.semaine} : envoiPrevu hors de la semaine (du jeudi 8 h au dimanche, heure de Paris)`);
      continue;
    }
    const motifs = motifsInterdits([n.objet, n.preEntete, n.corps].join("\n"));
    if (motifs.length > 0) {
      ignores.push(`${n.semaine} : ${motifs.join(", ")}`);
      continue;
    }
    semainesVues.add(n.semaine);
    numeros.push({ semaine: n.semaine, objet: n.objet, preEntete: n.preEntete, corps: n.corps, envoiPrevu, statut: n.statut });
  }
  return { numeros, ignores };
}

/**
 * Le fichier fait foi pour les numéros pas encore envoyés : une ligne HEBDO_PREMIUM non ENVOYE
 * dont la semaine n'est pas (ou plus) un numéro accepté du fichier est SUPPRIMÉE si elle n'a
 * aucun journal d'envoi (rien n'est perdu : rien n'est parti). Avec un journal (envoi commencé
 * puis numéro retiré du fichier, cas limite) : gardée pour l'historique, remise en BROUILLON et
 * sans approbation, donc elle ne part plus.
 */
async function neutraliserAnciensNumeros(semaines: string[], r: SyncHebdoResultat): Promise<void> {
  const where = { audience: "HEBDO_PREMIUM" as const, status: { not: "ENVOYE" as const }, periodKey: { notIn: semaines } };
  const anciens = await prisma.newsletterIssue.findMany({ where, select: { periodKey: true }, orderBy: { periodKey: "asc" } });
  if (anciens.length === 0) return;
  await prisma.newsletterIssue.deleteMany({ where: { ...where, sends: { none: {} } } });
  const gardes = await prisma.newsletterIssue.findMany({ where, select: { periodKey: true } });
  if (gardes.length > 0) {
    await prisma.newsletterIssue.updateMany({ where, data: { status: "BROUILLON", validatedAt: null, ...SANS_APPROBATION } });
    for (const g of gardes) r.ignores.push(`${g.periodKey} : absent du fichier, envoi déjà commencé : gardé en brouillon, ne part plus`);
  }
  const gardees = new Set(gardes.map((g) => g.periodKey));
  r.retires.push(...anciens.map((a) => a.periodKey).filter((s) => !gardees.has(s)));
}

export async function synchroniserNumerosHebdo(
  source: unknown = numerosJson,
  now: Date = new Date(),
  mensuelles: ReadonlySet<string> = semainesLettreDuMois(),
): Promise<SyncHebdoResultat> {
  const { numeros, ignores } = preparerNumerosHebdo(source, mensuelles);
  const r: SyncHebdoResultat = { crees: 0, misAJour: 0, retires: [], ignores };
  // Fichier illisible (pas un tableau) : on ne touche à rien plutôt que tout retirer.
  if (!Array.isArray(source)) return r;
  for (const n of numeros) {
    const donnees = {
      subject: n.objet,
      preheader: n.preEntete,
      bodyText: n.corps,
      scheduledFor: n.envoiPrevu,
      status: n.statut,
      validatedAt: n.statut === "VALIDE" ? now : null,
    };
    const existant = await prisma.newsletterIssue.findUnique({
      where: { audience_periodKey: { audience: "HEBDO_PREMIUM", periodKey: n.semaine } },
    });
    if (!existant) {
      await prisma.newsletterIssue.create({ data: { audience: "HEBDO_PREMIUM", periodKey: n.semaine, ...donnees } });
      r.crees++;
      continue;
    }
    if (existant.status === "ENVOYE") {
      r.ignores.push(`${n.semaine} : déjà envoyé, jamais modifié`);
      continue;
    }
    const inchange =
      existant.subject === donnees.subject &&
      existant.preheader === donnees.preheader &&
      existant.bodyText === donnees.bodyText &&
      existant.scheduledFor.getTime() === donnees.scheduledFor.getTime() &&
      existant.status === donnees.status;
    if (inchange) continue;
    // Toute modification (contenu, date, statut) annule l'approbation de Thomas (s22) : le
    // numéro modifié doit être relu et réapprouvé dans l'admin avant de pouvoir partir.
    await prisma.newsletterIssue.update({
      where: { id: existant.id },
      data: { ...donnees, validatedAt: n.statut === "VALIDE" ? existant.validatedAt ?? now : null, ...SANS_APPROBATION },
    });
    r.misAJour++;
  }
  await neutraliserAnciensNumeros(numeros.map((n) => n.semaine), r);
  return r;
}

/** Du jeudi 8 h au lundi 0 h (fin de semaine, pas de rattrapage après) : 3 jours et 16 heures. */
const JEUDI_A_FIN_SEMAINE_MS = (3 * 24 + 16) * 3600 * 1000;

/** Stock : numéros VALIDE pas encore partis dont la semaine n'est pas finie. */
export async function stockHebdo(now: Date): Promise<{ aVenir: number; alerte: boolean }> {
  const aVenir = await prisma.newsletterIssue.count({
    where: { audience: "HEBDO_PREMIUM", status: "VALIDE", scheduledFor: { gt: new Date(now.getTime() - JEUDI_A_FIN_SEMAINE_MS) } },
  });
  return { aVenir, alerte: aVenir < LETTRE_HEBDO_STOCK_ALERTE };
}

/** Tâche de démarrage : non bloquante, ne lève jamais. */
export async function applyLettreHebdoNumerosTask(): Promise<void> {
  try {
    const r = await synchroniserNumerosHebdo();
    if (r.crees + r.misAJour + r.retires.length + r.ignores.length > 0) {
      console.log(
        `[startup] lettre hebdo : ${r.crees} numéro(s) créé(s), ${r.misAJour} mis à jour, ${r.retires.length} retiré(s)${r.retires.length ? ` (${r.retires.join(", ")})` : ""}, ${r.ignores.length} ignoré(s).`,
      );
      for (const m of r.ignores) console.warn(`[startup] lettre hebdo : ignoré ${m}`);
    }
  } catch (err) {
    console.error("[startup] lettre hebdo : synchronisation échouée (non bloquant) :", err instanceof Error ? err.message : err);
  }
}
