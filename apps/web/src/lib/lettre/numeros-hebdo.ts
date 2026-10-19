/**
 * Numéros PRÉPARÉS de la lettre de la semaine (hebdo Premium, s21 ; spec §2, §3, US-H5).
 * Règle du 01/10 : contenu préparé par lot, aucune IA au fil de l'eau.
 *
 * Source : `src/data/lettre/hebdo-premium.json` (contenu : @copywriter, validé par
 * Thomas, « le commit vaut validation »). Une entrée :
 * {
 *   "semaine": "2026-W46",              // semaine ISO (année du jeudi) ; envoi = son jeudi 8 h Paris, calculé
 *   "ficheId": "2026-11-01",            // fiche du carnet, recopiée telle quelle (jamais retapée)
 *   "accroche": "…",                    // facultative, 1 à 2 phrases, jamais la réplique
 *   "pont": { "texte": "…", "lien": "https://deviens-marrant.fr/parcours/…#etape-2" }, // facultatif
 *   "objet": "…",                       // facultatif, 45 caractères au plus ; défaut : titre de la fiche
 *   "preEntete": "…",                   // facultatif ; défaut : constante du gabarit
 *   "statut": "BROUILLON" | "VALIDE"
 * }
 * Synchronisé au démarrage dans `NewsletterIssue` (audience HEBDO_PREMIUM, periodKey =
 * semaine). Un numéro ENVOYE n'est JAMAIS modifié ; une entrée invalide est ignorée
 * avec un message (fiche inconnue, fiche déjà utilisée, semaine inexistante, offre).
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import numerosJson from "@/data/lettre/hebdo-premium.json";
import { MARQUEUR_A_COMPLETER, LETTRE_HEBDO_STOCK_ALERTE } from "@/config/lettre";
import { GABARIT_HEBDO, type GabaritHebdo } from "@/config/textes/lettre-hebdo-s21";
import { envoiSemaine, moisDeSemaine, semaineValide } from "@/lib/lettre/calendrier";
import { getAllCarnets, type Carnet, type CarnetFiche } from "@/lib/carnet";

const TIRET_CADRATIN = "—";
const sansTiret = (champ: string) => z.string().refine((v) => !v.includes(TIRET_CADRATIN), { message: `${champ} : tiret cadratin interdit` });

export const OBJET_HEBDO_MAX = 45;

export const numeroHebdoSchema = z.object({
  semaine: z.string().refine(semaineValide, { message: "semaine ISO mal formée ou inexistante (AAAA-Www)" }),
  ficheId: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  accroche: sansTiret("accroche").pipe(z.string().trim().min(1).max(400)).optional(),
  pont: z
    .object({
      texte: sansTiret("pont").pipe(z.string().trim().min(1).max(200)),
      lien: z.string().url().regex(/^https:\/\/deviens-marrant\.fr\/parcours\//, { message: "pont : lien vers une étape de parcours uniquement" }),
    })
    .optional(),
  objet: sansTiret("objet").pipe(z.string().trim().min(3).max(OBJET_HEBDO_MAX)).optional(),
  preEntete: sansTiret("preEntete").pipe(z.string().trim().max(200)).optional(),
  statut: z.enum(["BROUILLON", "VALIDE"]),
});
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

/** L'objet ne donne jamais la réplique (spec §3.3) : ni la réplique entière, ni un morceau de 12 caractères ou plus. */
function donneLaReplique(objet: string, reponse: string): boolean {
  const norme = (t: string) => t.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
  const o = norme(objet);
  const r = norme(reponse);
  return o.includes(r) || (o.length >= 12 && r.includes(o));
}

/** Fiche du carnet par identifiant (« 2026-11-01 » → carnet « 2026-11 »). */
export function trouverFiche(ficheId: string, carnets: readonly Carnet[] = getAllCarnets()): { carnet: Carnet; fiche: CarnetFiche } | null {
  const carnet = carnets.find((c) => c.mois === ficheId.slice(0, 7));
  const fiche = carnet?.fiches.find((f) => f.id === ficheId);
  return carnet && fiche ? { carnet, fiche } : null;
}

/** Lien vers le carnet en bas du numéro (première partie, aucun suivi d'ouverture ni de clic). */
export function lienCarnetHebdo(semaine: string, baseUrl = "https://deviens-marrant.fr"): string {
  return `${baseUrl.replace(/\/$/, "")}/carnet?utm_source=lettre-premium&utm_medium=email&utm_content=${semaine.toLowerCase()}-carnet`;
}

/**
 * Corps d'un numéro (sans pied), assemblé depuis la fiche : ses champs sont recopiés
 * caractère pour caractère (test H5-6). Gabarit non validé : marqueur en tête, le
 * numéro est bloqué à l'envoi.
 */
export function assemblerCorpsHebdo(n: NumeroHebdo, fiche: CarnetFiche, gabarit: GabaritHebdo = GABARIT_HEBDO): string {
  const blocs: string[] = [];
  if (!gabarit.valide) blocs.push(`${MARQUEUR_A_COMPLETER} : gabarit de la lettre de la semaine à valider à l'aveugle (P3)]`);
  blocs.push(gabarit.salut);
  if (n.accroche) blocs.push(n.accroche);
  blocs.push(fiche.situation);
  blocs.push(`${gabarit.onTeDit} : « ${fiche.onTeDit} »`);
  blocs.push(`${gabarit.reponse}\n« ${fiche.reponse} »`);
  blocs.push(`${gabarit.pourquoi}\n${fiche.pourquoi}`);
  blocs.push(`${gabarit.siTendu}\n« ${fiche.siTendu} »`);
  blocs.push(`${gabarit.exercice}\n${fiche.exercice}`);
  const fin: string[] = [];
  if (n.pont) fin.push(`${gabarit.pont} : ${n.pont.texte} ${n.pont.lien}`);
  fin.push(`${gabarit.carnet} : ${lienCarnetHebdo(n.semaine)}`);
  blocs.push(fin.join("\n"));
  blocs.push(`${gabarit.fin}\n${gabarit.signature}`);
  return blocs.join("\n\n");
}

export interface NumeroHebdoAssemble {
  semaine: string;
  ficheId: string;
  objet: string;
  preEntete: string;
  corps: string;
  envoiPrevu: Date;
  statut: "BROUILLON" | "VALIDE";
}

export interface SyncHebdoResultat {
  crees: number;
  misAJour: number;
  ignores: string[];
}

/** Valide et assemble les entrées (sans base) ; les fautives vont dans `ignores`. */
export function preparerNumerosHebdo(
  source: unknown,
  carnets: readonly Carnet[] = getAllCarnets(),
  gabarit: GabaritHebdo = GABARIT_HEBDO,
): { numeros: NumeroHebdoAssemble[]; ignores: string[] } {
  const numeros: NumeroHebdoAssemble[] = [];
  const ignores: string[] = [];
  const fichesVues = new Map<string, string>();
  const semainesVues = new Set<string>();
  for (const [i, brut] of (Array.isArray(source) ? source : []).entries()) {
    const parsed = numeroHebdoSchema.safeParse(brut);
    if (!parsed.success) {
      ignores.push(`#${i} : ${parsed.error.issues.map((e) => e.message).join(", ")}`);
      continue;
    }
    const n = parsed.data;
    const trouvee = trouverFiche(n.ficheId, carnets);
    if (!trouvee) {
      ignores.push(`${n.semaine} : fiche « ${n.ficheId} » inconnue (carnet absent ou id faux)`);
      continue;
    }
    if (fichesVues.has(n.ficheId)) {
      ignores.push(`${n.semaine} : fiche « ${n.ficheId} » déjà utilisée par ${fichesVues.get(n.ficheId)}`);
      continue;
    }
    if (semainesVues.has(n.semaine)) {
      ignores.push(`${n.semaine} : deux numéros pour la même semaine`);
      continue;
    }
    const mois = moisDeSemaine(n.semaine);
    if (!mois || trouvee.carnet.mois > mois) {
      ignores.push(`${n.semaine} : la fiche « ${n.ficheId} » vient d'un carnet pas encore en ligne cette semaine`);
      continue;
    }
    const objet = n.objet ?? trouvee.fiche.titre;
    if (objet.length > OBJET_HEBDO_MAX || donneLaReplique(objet, trouvee.fiche.reponse)) {
      ignores.push(`${n.semaine} : objet trop long ou contenant la réplique`);
      continue;
    }
    const preEntete = n.preEntete ?? gabarit.preEntete;
    const corps = assemblerCorpsHebdo(n, trouvee.fiche, gabarit);
    // Le marqueur du gabarit non validé est attendu : il bloque à l'envoi, pas à la synchronisation.
    const motifs = motifsInterdits([objet, preEntete, corps].join("\n")).filter((m) => m !== "marqueur [À COMPLÉTER");
    if (motifs.length > 0) {
      ignores.push(`${n.semaine} : ${motifs.join(", ")}`);
      continue;
    }
    fichesVues.set(n.ficheId, n.semaine);
    semainesVues.add(n.semaine);
    numeros.push({ semaine: n.semaine, ficheId: n.ficheId, objet, preEntete, corps, envoiPrevu: envoiSemaine(n.semaine) as Date, statut: n.statut });
  }
  return { numeros, ignores };
}

export async function synchroniserNumerosHebdo(
  source: unknown = numerosJson,
  now: Date = new Date(),
  carnets: readonly Carnet[] = getAllCarnets(),
  gabarit: GabaritHebdo = GABARIT_HEBDO,
): Promise<SyncHebdoResultat> {
  const { numeros, ignores } = preparerNumerosHebdo(source, carnets, gabarit);
  const r: SyncHebdoResultat = { crees: 0, misAJour: 0, ignores };
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
    await prisma.newsletterIssue.update({
      where: { id: existant.id },
      data: { ...donnees, validatedAt: n.statut === "VALIDE" ? existant.validatedAt ?? now : null },
    });
    r.misAJour++;
  }
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
    if (r.crees + r.misAJour + r.ignores.length > 0) {
      console.log(`[startup] lettre hebdo : ${r.crees} numéro(s) créé(s), ${r.misAJour} mis à jour, ${r.ignores.length} ignoré(s).`);
      for (const m of r.ignores) console.warn(`[startup] lettre hebdo : ignoré ${m}`);
    }
  } catch (err) {
    console.error("[startup] lettre hebdo : synchronisation échouée (non bloquant) :", err instanceof Error ? err.message : err);
  }
}
