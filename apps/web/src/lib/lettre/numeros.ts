/**
 * Numéros PRÉPARÉS de la lettre mensuelle (s21, règle du 01/10 : contenu préparé
 * chez nous, en base, par lot ; aucune IA ne génère au fil de l'eau).
 *
 * Source de vérité : `src/data/lettre/numeros.json`, rempli par le rédacteur,
 * relu à l'aveugle (règle d'or), puis passé en `"statut": "VALIDE"` sur feu vert
 * de Thomas (le commit vaut validation). Synchronisé au démarrage :
 *  - création ou mise à jour par (audience MENSUELLE, période) ;
 *  - un numéro déjà ENVOYE n'est JAMAIS modifié ;
 *  - une entrée invalide (format, tiret cadratin, période et date d'envoi
 *    incohérentes) est ignorée avec un message, sans bloquer le démarrage.
 *
 * Format d'une entrée :
 * {
 *   "periode": "2026-11",                       // mois de Paris (AAAA-MM), un numéro par mois
 *   "objet": "…",                                // objet de l'e-mail, sans tiret cadratin
 *   "preEntete": "…",                            // facultatif (aperçu de la boîte de réception)
 *   "corps": "…",                                // texte seul ; le pied (désinscription, éditeur,
 *                                                //   confidentialité) est ajouté à l'envoi
 *   "envoiPrevu": "2026-12-03T08:00:00+01:00",   // date et heure d'envoi = `dateEnvoiLettre(periode,
 *                                                //   datePlancher)` (premier jeudi du mois, 8 h Paris),
 *                                                //   ou null : le numéro n'est alors PAS chargé en base
 *   "datePlancher": "2026-11-16" | null,         // jour (Paris) de publication de l'article cité :
 *                                                //   jamais d'envoi avant ; null = aucun article cité
 *   "numero": 1,                                 // facultatif, repère éditorial
 *   "statut": "BROUILLON" | "VALIDE"
 * }
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import numerosJson from "@/data/lettre/numeros.json";
import { corpsNumero, dateEnvoiLettre, periodeMensuelle } from "@/lib/lettre/envoi";
import { MARQUEUR_A_COMPLETER } from "@/config/lettre";

const TIRET_CADRATIN = "—";
const sansTiret = (champ: string) => z.string().refine((v) => !v.includes(TIRET_CADRATIN), { message: `${champ} : tiret cadratin interdit` });

export const numeroSchema = z
  .object({
    periode: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    objet: sansTiret("objet").pipe(z.string().trim().min(3).max(150)),
    preEntete: sansTiret("preEntete").pipe(z.string().trim().max(200)).optional(),
    corps: sansTiret("corps").pipe(z.string().trim().min(50).max(20_000)),
    envoiPrevu: z.string().datetime({ offset: true }).nullable(),
    datePlancher: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    numero: z.number().int().positive().optional(),
    statut: z.enum(["BROUILLON", "VALIDE"]),
  })
  .refine((n) => n.envoiPrevu === null || periodeMensuelle(new Date(n.envoiPrevu)) === n.periode, {
    message: "envoiPrevu doit tomber dans le mois de periode (heure de Paris)",
  })
  .refine((n) => n.envoiPrevu === null || !n.datePlancher || jourParis(new Date(n.envoiPrevu)) >= n.datePlancher, {
    message: "envoiPrevu avant la date plancher (publication de l'article cité)",
  })
  .refine((n) => n.envoiPrevu === null || new Date(n.envoiPrevu).getTime() === dateEnvoiLettre(n.periode, n.datePlancher)?.getTime(), {
    message: "envoiPrevu hors règle : premier jeudi du mois à 8 h (Paris), ou premier jeudi après la date plancher",
  });

export type NumeroLettre = z.infer<typeof numeroSchema>;

const jourFormat = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });

/** Jour « AAAA-MM-JJ » au calendrier de Paris. */
export function jourParis(d: Date): string {
  return jourFormat.format(d);
}

/**
 * Un numéro préparé peut-il partir à `now` ? Toutes les conditions, sans base :
 * statut VALIDE, jour d'envoi fixé et atteint, date plancher atteinte, et aucun
 * marqueur `[À COMPLÉTER` dans l'e-mail tel qu'il partirait (objet, corps, pied).
 * L'interrupteur `LETTRE_OUVERTE` reste vérifié à part, par la tâche d'envoi.
 */
export function numeroEnvoyable(n: NumeroLettre, now: Date, baseUrl = "https://deviens-marrant.fr"): boolean {
  if (n.statut !== "VALIDE" || n.envoiPrevu === null) return false;
  if (now.getTime() < new Date(n.envoiPrevu).getTime()) return false;
  if (n.datePlancher && jourParis(now) < n.datePlancher) return false;
  const email = [n.objet, n.preEntete ?? "", corpsNumero(n.corps, baseUrl, "jeton")].join("\n");
  return !email.includes(MARQUEUR_A_COMPLETER);
}

export interface SyncNumerosResultat {
  crees: number;
  misAJour: number;
  ignores: string[];
  /** Numéros valides dont le jour d'envoi n'est pas encore fixé : non chargés en base. */
  enAttente: string[];
}

export async function synchroniserNumerosLettre(source: unknown = numerosJson, now: Date = new Date()): Promise<SyncNumerosResultat> {
  const r: SyncNumerosResultat = { crees: 0, misAJour: 0, ignores: [], enAttente: [] };
  const entrees = Array.isArray(source) ? source : [];
  if (entrees.length === 0) return r;

  for (const [i, brut] of entrees.entries()) {
    const parsed = numeroSchema.safeParse(brut);
    if (!parsed.success) {
      r.ignores.push(`#${i} : ${parsed.error.issues.map((e) => e.message).join(", ")}`);
      continue;
    }
    const n = parsed.data;
    if (n.envoiPrevu === null) {
      r.enAttente.push(n.periode);
      continue;
    }
    const donnees = {
      subject: n.objet,
      preheader: n.preEntete ?? null,
      bodyText: n.corps,
      scheduledFor: new Date(n.envoiPrevu),
      status: n.statut,
      validatedAt: n.statut === "VALIDE" ? now : null,
    };
    const existant = await prisma.newsletterIssue.findUnique({
      where: { audience_periodKey: { audience: "MENSUELLE", periodKey: n.periode } },
    });
    if (!existant) {
      await prisma.newsletterIssue.create({ data: { audience: "MENSUELLE", periodKey: n.periode, ...donnees } });
      r.crees++;
      continue;
    }
    if (existant.status === "ENVOYE") {
      r.ignores.push(`${n.periode} : déjà envoyé, jamais modifié`);
      continue;
    }
    const inchange =
      existant.subject === donnees.subject &&
      existant.preheader === donnees.preheader &&
      existant.bodyText === donnees.bodyText &&
      existant.scheduledFor.getTime() === donnees.scheduledFor.getTime() &&
      existant.status === donnees.status;
    if (inchange) continue;
    await prisma.newsletterIssue.update({
      where: { id: existant.id },
      data: { ...donnees, validatedAt: n.statut === "VALIDE" ? existant.validatedAt ?? now : null },
    });
    r.misAJour++;
  }
  return r;
}

/** Tâche de démarrage : non bloquante, ne lève jamais. */
export async function applyLettreNumerosTask(): Promise<void> {
  try {
    const r = await synchroniserNumerosLettre();
    if (r.crees + r.misAJour + r.ignores.length > 0) {
      console.log(`[startup] lettre : ${r.crees} numéro(s) créé(s), ${r.misAJour} mis à jour, ${r.ignores.length} ignoré(s).`);
      for (const m of r.ignores) console.warn(`[startup] lettre : ignoré ${m}`);
    }
    if (r.enAttente.length > 0) {
      console.log(`[startup] lettre : ${r.enAttente.length} numéro(s) en attente du jour d'envoi (${r.enAttente.join(", ")}), non chargé(s).`);
    }
  } catch (err) {
    console.error("[startup] lettre : synchronisation des numéros échouée (non bloquant) :", err instanceof Error ? err.message : err);
  }
}
