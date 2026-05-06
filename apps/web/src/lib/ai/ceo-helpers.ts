/**
 * Helpers CEO Agent — fonctions de support DB-only (lecture seule pour les
 * lookups, mutations contrôlées pour la mémoire et le rate limiting).
 *
 * Le séparer de `ceo-agent.ts` évite que le module agent (qui charge le SDK
 * Anthropic + le prompt système ~10K tokens) soit chargé pour de simples
 * accès DB (ex. depuis un endpoint admin /api/admin/ceo).
 *
 * Règles de conception :
 * - **Lecture seule pour catalogue** : `lookupJoke` et `lookupResource` ne
 *   peuvent JAMAIS muter la DB. Le CEO n'a pas le droit d'écrire dans Joke /
 *   Tip / Video / BlogArticle / LearningPath. C'est une garantie de sécurité.
 * - **Silent-fail sur audit** : `recordAudit()` log mais ne throw pas. Un
 *   échec d'écriture audit ne doit jamais casser le pipeline CEO.
 * - **Hash PII obligatoire** : tout `recordAudit` reçoit `targetId` clair et
 *   le hashe avant INSERT. Aucun PII ne quitte cette fonction sans masking.
 */
import { createHash } from "crypto";
import type {
  Joke,
  Tip,
  Video,
  LearningPath,
  BlogArticle,
  CeoLead,
  CeoConfig,
  CeoOutboundChannel,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────

export interface LookupJokeOptions {
  category?: string;
  type?: string;
  maturityLevel?: number;
  limit?: number;
}

export type ResourceType = "tip" | "video" | "path" | "blogArticle";

export interface LookupResourceOptions {
  type: ResourceType;
  topic?: string; // mots-clés sémantiques (matchés sur title/content)
  limit?: number;
}

export interface CeoResource {
  type: ResourceType;
  id: string;
  title: string;
  url: string; // chemin relatif "/conseils/[id]" / "/parcours/[slug]" / etc.
  summary: string; // 1 phrase / extrait
}

export interface RecordAuditInput {
  action: string;
  targetType: "user" | "journalist" | "blogger" | "lead" | "system";
  targetId: string; // PII clair, hashé avant INSERT
  channel: string;
  aiDecisionScore?: number;
  aiModel?: string;
  reasoning?: string;
  outcome: "sent" | "rejected" | "draft" | "error" | "skipped";
  errorMessage?: string;
}

// ─── Catalogue lookups (lecture seule) ────────────────────────────────

/**
 * Renvoie 1-N vannes du catalogue actif. Filtres optionnels par catégorie,
 * type ou niveau de maturité. Tri aléatoire pour éviter de toujours citer la
 * même vanne dans un même playbook.
 *
 * Règle CEO #2 (citation vannes) : l'agent CEO cite UNIQUEMENT depuis cette
 * source — il ne fabrique jamais une vanne. Cf docs/ia/ceo-agent-architecture.md.
 */
export async function lookupJoke(opts: LookupJokeOptions = {}): Promise<Joke[]> {
  const { category, type, maturityLevel, limit = 3 } = opts;

  const where: Prisma.JokeWhereInput = { isActive: true };
  if (category) where.category = category as Prisma.JokeWhereInput["category"];
  if (type) where.type = type as Prisma.JokeWhereInput["type"];
  if (maturityLevel) where.maturityLevel = maturityLevel;

  // Tirage pseudo-aléatoire sans $queryRawUnsafe (sécurité SQL injection) :
  // on récupère N candidates triées par cuid (déterministe), puis shuffle JS.
  // Trade-off : pas de RANDOM() côté DB, mais le catalogue actif < 300 vannes
  // donc charger 3-10 rows + shuffle in-memory est négligeable.
  const take = Math.min(limit, 10);
  const cap = Math.min(50, take * 10); // pool 10× la limite pour vraie variété
  const pool = await prisma.joke.findMany({ where, take: cap, orderBy: { createdAt: "desc" } });

  // Fisher-Yates shuffle déterministe à la durée d'appel
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, take);
}

/**
 * Renvoie 1-N ressources éducatives (conseil, vidéo, parcours, article blog).
 * Match sémantique simple : tokenize le `topic`, OR sur title/description.
 *
 * Règle CEO #7 (conseils > vannes) : préférer cet outil à `lookupJoke` quand
 * une ressource éducative existe sur le sujet.
 */
export async function lookupResource(opts: LookupResourceOptions): Promise<CeoResource[]> {
  const { type, topic, limit = 3 } = opts;
  const tokens = topic
    ? topic
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length >= 3)
    : [];

  switch (type) {
    case "tip": {
      const tips = await prisma.tip.findMany({
        where: {
          isActive: true,
          ...(tokens.length > 0 && {
            OR: tokens.flatMap((t) => [
              { title: { contains: t, mode: "insensitive" as const } },
              { content: { contains: t, mode: "insensitive" as const } },
            ]),
          }),
        },
        take: Math.min(limit, 10),
      });
      return tips.map((t: Tip) => ({
        type: "tip" as const,
        id: t.id,
        title: t.title,
        url: `/conseils/${t.id}`,
        summary: t.content.slice(0, 140) + (t.content.length > 140 ? "..." : ""),
      }));
    }
    case "video": {
      const videos = await prisma.video.findMany({
        where: {
          isActive: true,
          ...(tokens.length > 0 && {
            OR: tokens.flatMap((t) => [
              { title: { contains: t, mode: "insensitive" as const } },
              { description: { contains: t, mode: "insensitive" as const } },
              { technique: { contains: t, mode: "insensitive" as const } },
            ]),
          }),
        },
        take: Math.min(limit, 10),
      });
      return videos.map((v: Video) => ({
        type: "video" as const,
        id: v.id,
        title: v.title,
        url: `/videos/${v.id}`,
        summary: v.description.slice(0, 140) + (v.description.length > 140 ? "..." : ""),
      }));
    }
    case "path": {
      const paths = await prisma.learningPath.findMany({
        where: {
          isActive: true,
          ...(tokens.length > 0 && {
            OR: tokens.flatMap((t) => [
              { title: { contains: t, mode: "insensitive" as const } },
              { description: { contains: t, mode: "insensitive" as const } },
            ]),
          }),
        },
        take: Math.min(limit, 10),
      });
      return paths.map((p: LearningPath) => ({
        type: "path" as const,
        id: p.id,
        title: p.title,
        url: `/parcours/${p.slug}`,
        summary: p.description.slice(0, 140) + (p.description.length > 140 ? "..." : ""),
      }));
    }
    case "blogArticle": {
      const articles = await prisma.blogArticle.findMany({
        where: {
          isPublished: true,
          ...(tokens.length > 0 && {
            OR: tokens.flatMap((t) => [
              { title: { contains: t, mode: "insensitive" as const } },
              { excerpt: { contains: t, mode: "insensitive" as const } },
              { targetKeyword: { contains: t, mode: "insensitive" as const } },
            ]),
          }),
        },
        take: Math.min(limit, 10),
      });
      return articles.map((a: BlogArticle) => ({
        type: "blogArticle" as const,
        id: a.id,
        title: a.title,
        url: `/blog/${a.slug}`,
        summary: a.excerpt.slice(0, 140) + (a.excerpt.length > 140 ? "..." : ""),
      }));
    }
    default:
      return [];
  }
}

// ─── CeoMemory (clé/valeur namespace) ─────────────────────────────────

/** Lit une mémoire long-terme. Retourne null si absent ou expiré. */
export async function getCeoMemory<T = unknown>(
  namespace: string,
  key: string,
): Promise<T | null> {
  const row = await prisma.ceoMemory.findUnique({
    where: { namespace_key: { namespace, key } },
  });
  if (!row) return null;
  if (row.expiresAt && row.expiresAt < new Date()) {
    // expiré → cleanup opportuniste
    await prisma.ceoMemory.delete({ where: { id: row.id } }).catch(() => undefined);
    return null;
  }
  return row.value as T;
}

/** Écrit une mémoire long-terme. TTL optionnel (ms). */
export async function setCeoMemory<T extends Prisma.InputJsonValue>(
  namespace: string,
  key: string,
  value: T,
  ttlMs?: number,
): Promise<void> {
  const expiresAt = ttlMs ? new Date(Date.now() + ttlMs) : null;
  await prisma.ceoMemory.upsert({
    where: { namespace_key: { namespace, key } },
    create: { namespace, key, value, expiresAt },
    update: { value, expiresAt },
  });
}

// ─── Kill-switch + config ─────────────────────────────────────────────

/**
 * Lit la configuration runtime CEO (singleton). Si aucune ligne en DB,
 * renvoie `null` → le caller traite comme "désactivé par défaut" (fail-safe).
 */
export async function getCeoConfig(): Promise<CeoConfig | null> {
  return prisma.ceoConfig.findFirst({ orderBy: { updatedAt: "desc" } });
}

/**
 * Vérifie le kill-switch DB. Renvoie `false` (= bloqué) si :
 *  - aucune config en DB (fail-safe)
 *  - `enabled = false`
 * Doit être appelé en première ligne de chaque tick CEO.
 */
export async function isCeoEnabled(): Promise<boolean> {
  const cfg = await getCeoConfig();
  return cfg?.enabled === true;
}

// ─── Frequency cap par audience / lead ────────────────────────────────

/**
 * Vérifie si un lead peut être contacté maintenant compte tenu de la cadence
 * max documentée dans `docs/growth/ceo-conversion-playbooks.md` :
 *  - Segment A (free actif récent) : max 2/mois
 *  - Segment B (cold/winback)      : max 1/mois
 *
 * Retourne `true` si on peut envoyer, `false` sinon. Source vérité :
 * `CeoOutboundMessage.sentAt` filtré sur les 30 derniers jours pour ce lead.
 */
export async function applyFrequencyCap(
  leadId: string,
  segment: "A" | "B",
): Promise<{ canSend: boolean; reason?: string }> {
  const cap = segment === "A" ? 2 : 1;
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const count = await prisma.ceoOutboundMessage.count({
    where: {
      leadId,
      direction: "OUTBOUND",
      status: "SENT",
      sentAt: { gte: since },
    },
  });

  if (count >= cap) {
    return { canSend: false, reason: `frequency_cap_${segment}_${count}/${cap}` };
  }
  return { canSend: true };
}

// ─── Anti-doublon (CeoDedup, fenêtre 24h) ─────────────────────────────

/**
 * Hash SHA256(channel + recipient + content_first_100chars).
 * Si déjà présent en DB dans les 24 dernières heures → bloqué.
 * Sinon → INSERT et autorisé.
 */
export async function checkAndStoreDedup(
  channel: CeoOutboundChannel,
  recipient: string,
  content: string,
): Promise<{ isDuplicate: boolean; hash: string }> {
  const hash = createHash("sha256")
    .update(`${channel}:${recipient}:${content.slice(0, 100)}`)
    .digest("hex");

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await prisma.ceoDedup.findFirst({
    where: { contentHash: hash, sentAt: { gte: since } },
  });
  if (existing) return { isDuplicate: true, hash };

  // INSERT — concurrent collision tolérée (P2002 = un autre worker a écrit avant)
  try {
    await prisma.ceoDedup.create({ data: { contentHash: hash, channel } });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "P2002") return { isDuplicate: true, hash };
    throw err;
  }
  return { isDuplicate: false, hash };
}

// ─── Audit trail (RGPD + observabilité) ───────────────────────────────

/** Hash SHA256 d'un identifiant PII (email, handle social). */
export function hashPii(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Masque un email pour les logs console (PII redaction). */
export function maskPii(value: string): string {
  if (!value) return value;
  if (value.includes("@")) {
    const [local, domain] = value.split("@");
    return `${local.slice(0, 2)}***@${domain}`;
  }
  return `${value.slice(0, 2)}***`;
}

/**
 * Insert audit log RGPD — silent-fail. Hashe automatiquement le `targetId`.
 * Ne JAMAIS appeler avec un PII clair en DB : la fonction le fait.
 */
export async function recordAudit(input: RecordAuditInput): Promise<void> {
  try {
    await prisma.ceoAuditLog.create({
      data: {
        action: input.action,
        targetType: input.targetType,
        targetIdHashed: hashPii(input.targetId),
        channel: input.channel,
        aiDecisionScore: input.aiDecisionScore ?? null,
        aiModel: input.aiModel ?? null,
        reasoning: input.reasoning ?? null,
        outcome: input.outcome,
        errorMessage: input.errorMessage ?? null,
      },
    });
  } catch (err) {
    console.error("[ceo-audit] Échec écriture audit :", err);
  }
}

// ─── Lock CEO tick (réuse pattern job-lock) ───────────────────────────

/**
 * Acquiert un lock global pour un tick CEO. TTL court (5 min) car un tick
 * normal dure < 60s. Réutilise `lib/job-lock.ts` pour ne pas dupliquer le
 * pattern atomique.
 */
export async function acquireCeoLock(tickKey: string, ttlMs = 5 * 60 * 1000): Promise<boolean> {
  const { tryAcquireLock } = await import("@/lib/job-lock");
  return tryAcquireLock(`ceo-tick-${tickKey}`, ttlMs);
}

export async function releaseCeoLock(tickKey: string): Promise<void> {
  const { releaseLock } = await import("@/lib/job-lock");
  await releaseLock(`ceo-tick-${tickKey}`);
}

// ─── CeoLead lookup ───────────────────────────────────────────────────

/** Marque un touchpoint CEO sur User (alimente fenêtre attribution 7j). */
export async function markCeoTouchpoint(userId: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastCeoTouchpoint: new Date() },
    });
  } catch (err) {
    console.error(`[ceo-helpers] markCeoTouchpoint échec ${maskPii(userId)} :`, err);
  }
}

/** Récupère ou crée un CeoLead pour un userId existant. */
export async function getOrCreateLead(
  userId: string,
  source: string,
): Promise<CeoLead> {
  return prisma.ceoLead.upsert({
    where: { userId },
    create: { userId, source },
    update: {}, // pas de changement si existe (le scoring met à jour ailleurs)
  });
}
