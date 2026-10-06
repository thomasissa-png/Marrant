/**
 * Alertes internes vers l'admin (s15, 06/10/2026, choix de Thomas : « au plus
 * UN e-mail par jour, seulement quand j'ai quelque chose à faire »).
 *
 * Plus aucune alerte ne part directement par e-mail. Chaque alerte est
 * ENREGISTRÉE (table existante `CeoMemory`, namespace `admin_alert`, aucune
 * migration) puis :
 *  - classe A (action de Thomas requise : token Buffer, canal à reconnecter,
 *    crédit ou clé Anthropic, coupe-circuit budget, paiement, sécurité) :
 *    regroupée dans le digest quotidien du matin (`admin-digest.ts`) ;
 *  - classe B (traitée par la session : file basse, lot en retard, stock,
 *    repli, 429, échec de post, relais, jalons, contrôle qualité…) : lue chaque
 *    matin par la session via `GET /api/admin/alertes`. Filet : sans lecture
 *    depuis 48 h, les B en attente passent dans le digest.
 *
 * Un enregistrement par clé et par jour (heure de Paris) : les répétitions
 * du même jour incrémentent `occurrences` et mettent le détail à jour.
 */
import { parisParts } from "@/lib/analytics/weekly-visits-period";

export type AlertClasse = "A" | "B";

export interface AdminAlert {
  /** Clé stable de l'alerte (ex. `social-file-basse-x`). */
  cle: string;
  /** Jour de Paris (AAAA-MM-JJ). */
  jour: string;
  classe: AlertClasse;
  /** Type = clé sans le suffixe réseau (ex. `social-file-basse`). */
  type: string;
  reseau: string | null;
  sujet: string;
  detail: string;
  premiereFois: string;
  derniereFois: string;
  occurrences: number;
  /** Date d'inclusion dans un digest e-mail (null = jamais envoyée). */
  envoyeeLe: string | null;
}

/** Sous-ensemble Prisma utilisé (injectable en test). */
export interface AlertDb {
  ceoMemory: {
    findUnique(args: { where: { namespace_key: { namespace: string; key: string } } }): Promise<{ value: unknown } | null>;
    upsert(args: {
      where: { namespace_key: { namespace: string; key: string } };
      create: { namespace: string; key: string; value: object; expiresAt?: Date | null };
      update: { value: object; expiresAt?: Date | null };
    }): Promise<unknown>;
    findMany(args: { where: { namespace: string } }): Promise<Array<{ key: string; value: unknown }>>;
    deleteMany(args: { where: { namespace: string; expiresAt: { lt: Date } } }): Promise<unknown>;
  };
}

export const ALERT_NAMESPACE = "admin_alert";
export const ALERT_META_NAMESPACE = "admin_alert_meta";
export const LAST_READ_KEY = "derniere_lecture";
export const ALERT_RETENTION_DAYS = 30;
const DETAIL_MAX = 2000;

/**
 * Clés (ou préfixes) de classe A : Thomas seul peut agir (secret, compte
 * externe, argent, sécurité). Tout le reste est B, y compris une clé inconnue
 * (le filet 48 h évite qu'elle se perde).
 */
export const CLES_ACTION_THOMAS: readonly string[] = [
  "social-token-buffer",
  "social-auto-pause-canal",
  "llm-alert-credit",
  "llm-alert-authentication",
  "llm-alert-permission",
  "llm-budget",
  "stripe-",
  "paiement-",
  "securite-",
];

const RESEAUX = ["x", "twitter", "instagram", "linkedin", "threads", "facebook", "tiktok"];
const RESEAU_RE = new RegExp(`-(${RESEAUX.join("|")})$`);

export function classerAlerte(cle: string): { classe: AlertClasse; type: string; reseau: string | null } {
  const m = cle.match(RESEAU_RE);
  const reseau = m ? m[1] : null;
  const type = m ? cle.slice(0, -m[0].length) : cle;
  const estA = CLES_ACTION_THOMAS.some((p) => (p.endsWith("-") ? cle.startsWith(p) : cle === p || cle.startsWith(`${p}-`)));
  const classe: AlertClasse = estA ? "A" : "B";
  return { classe, type, reseau };
}

export function jourParisDe(now: Date): string {
  const p = parisParts(now);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** HTML d'alerte → texte lisible (la route et le digest n'affichent que du texte). */
export function htmlVersTexte(html: string): string {
  const texte = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|pre|ol|ul|h\d)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
  return texte.length > DETAIL_MAX ? `${texte.slice(0, DETAIL_MAX)}…` : texte;
}

async function defaultDb(): Promise<AlertDb> {
  const { prisma } = await import("@/lib/prisma");
  return prisma as unknown as AlertDb;
}

/**
 * Enregistre une alerte (aucun e-mail). Retourne `true` si elle est en base,
 * `false` si la base est illisible (l'appelant retente au passage suivant,
 * comme avant avec l'e-mail). Ne lève jamais.
 */
export async function recordAdminAlert(
  input: { cle: string; sujet: string; html: string; now?: Date },
  db?: AlertDb,
): Promise<boolean> {
  const now = input.now ?? new Date();
  try {
    const d = db ?? (await defaultDb());
    const jour = jourParisDe(now);
    const key = `${input.cle}:${jour}`;
    const where = { namespace_key: { namespace: ALERT_NAMESPACE, key } };
    const prev = (await d.ceoMemory.findUnique({ where }))?.value as AdminAlert | undefined;
    const { classe, type, reseau } = classerAlerte(input.cle);
    const value: AdminAlert = {
      cle: input.cle,
      jour,
      classe,
      type,
      reseau,
      sujet: input.sujet,
      detail: htmlVersTexte(input.html),
      premiereFois: prev?.premiereFois ?? now.toISOString(),
      derniereFois: now.toISOString(),
      occurrences: (prev?.occurrences ?? 0) + 1,
      envoyeeLe: prev?.envoyeeLe ?? null,
    };
    const expiresAt = new Date(now.getTime() + ALERT_RETENTION_DAYS * 86_400_000);
    await d.ceoMemory.upsert({
      where,
      create: { namespace: ALERT_NAMESPACE, key, value: { ...value }, expiresAt },
      update: { value: { ...value }, expiresAt },
    });
    console.warn(`[admin-alert] ${classe} ${input.cle} : ${input.sujet}`);
    return true;
  } catch (err) {
    console.error(`[admin-alert] Alerte « ${input.sujet} » non enregistrée :`, err);
    return false;
  }
}

/** Toutes les alertes en base (non expirées), de la plus récente à la plus ancienne. */
export async function listAdminAlerts(db?: AlertDb): Promise<AdminAlert[]> {
  const d = db ?? (await defaultDb());
  const rows = await d.ceoMemory.findMany({ where: { namespace: ALERT_NAMESPACE } });
  return rows
    .map((r) => r.value as AdminAlert)
    .filter((a) => a && typeof a.cle === "string")
    .sort((a, b) => b.derniereFois.localeCompare(a.derniereFois));
}

/** Dernière lecture de `GET /api/admin/alertes` par la session (null = jamais). */
export async function getDerniereLecture(db?: AlertDb): Promise<Date | null> {
  const d = db ?? (await defaultDb());
  const row = await d.ceoMemory.findUnique({
    where: { namespace_key: { namespace: ALERT_META_NAMESPACE, key: LAST_READ_KEY } },
  });
  const at = (row?.value as { at?: string } | undefined)?.at;
  return at ? new Date(at) : null;
}

export async function setDerniereLecture(now: Date, db?: AlertDb): Promise<void> {
  const d = db ?? (await defaultDb());
  const value = { at: now.toISOString() };
  await d.ceoMemory.upsert({
    where: { namespace_key: { namespace: ALERT_META_NAMESPACE, key: LAST_READ_KEY } },
    create: { namespace: ALERT_META_NAMESPACE, key: LAST_READ_KEY, value },
    update: { value },
  });
}

/** Marque des alertes comme envoyées dans un digest (après envoi accepté). */
export async function marquerEnvoyees(alertes: AdminAlert[], now: Date, db?: AlertDb): Promise<void> {
  const d = db ?? (await defaultDb());
  const expiresAt = new Date(now.getTime() + ALERT_RETENTION_DAYS * 86_400_000);
  for (const a of alertes) {
    const key = `${a.cle}:${a.jour}`;
    const value = { ...a, envoyeeLe: now.toISOString() };
    await d.ceoMemory.upsert({
      where: { namespace_key: { namespace: ALERT_NAMESPACE, key } },
      create: { namespace: ALERT_NAMESPACE, key, value, expiresAt },
      update: { value },
    });
  }
}

/** Ménage des alertes de plus de 30 jours. */
export async function purgerAlertesExpirees(now: Date, db?: AlertDb): Promise<void> {
  const d = db ?? (await defaultDb());
  await d.ceoMemory.deleteMany({ where: { namespace: ALERT_NAMESPACE, expiresAt: { lt: now } } });
}
