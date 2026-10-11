/**
 * Client Prisma pour Cloudflare Workers (OpenNext + Hyperdrive → Neon).
 *
 * Utilisé UNIQUEMENT quand `isCloudflareWorkers()` est vrai (voir prisma.ts).
 * Sur Replit/Node, ce module est importé mais aucune fonction n'est appelée.
 *
 * Contraintes workerd :
 *  - pas de moteur Prisma natif → driver adapter `@prisma/adapter-pg` (pg pur JS
 *    sur sockets TCP `nodejs_compat`), connexion = `env.HYPERDRIVE.connectionString` ;
 *  - un objet d'E/S (socket) ne peut pas être partagé entre deux requêtes →
 *    UN client par invocation (clé = `ctx` de la requête, fourni par OpenNext via
 *    AsyncLocalStorage), réutilisé pour toutes les requêtes Prisma de cette
 *    invocation, libéré par le GC ensuite (WeakMap). Hyperdrive fait le pooling
 *    côté Cloudflare.
 *
 * Le singleton exporté par prisma.ts est un Proxy : `prisma.user.findMany()`
 * résout le client de la requête courante au moment de l'appel → aucun des
 * appels existants (`import { prisma } from "@/lib/prisma"`) n'est à modifier.
 */
import { PrismaClient } from "@prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// `require` (build CommonJS de l'adaptateur) et non `import` : la build ESM
// importe `pg` comme external ESM, ce qui rend le module asynchrone côté
// webpack → le `require` synchrone de prisma.ts recevrait une Promise.
const { PrismaPg } = require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");

/** Sous-ensemble du binding Hyperdrive utilisé ici (évite d'importer les types workerd globaux). */
interface HyperdriveBinding {
  connectionString: string;
}

/** Nombre max de connexions pg par invocation (Hyperdrive mutualise derrière). */
const MAX_CONNECTIONS_PER_INVOCATION = 5;

const clientsByInvocation = new WeakMap<object, PrismaClient>();

function resolveConnectionString(env: Record<string, unknown>): string {
  const hyperdrive = env.HYPERDRIVE as HyperdriveBinding | undefined;
  if (hyperdrive?.connectionString) return hyperdrive.connectionString;
  // Repli explicite (tests `wrangler dev` sans Hyperdrive) : DATABASE_URL en secret/var.
  const direct = process.env.DATABASE_URL;
  if (direct) return direct;
  throw new Error(
    "[prisma-workers] Ni binding HYPERDRIVE ni DATABASE_URL : impossible de joindre Postgres.",
  );
}

/** Client Prisma de l'invocation courante (créé au premier accès). */
export function getWorkersPrismaClient(): PrismaClient {
  const { env, ctx } = getCloudflareContext();
  const key = ctx as unknown as object;
  const existing = clientsByInvocation.get(key);
  if (existing) return existing;

  const adapter = new PrismaPg({
    connectionString: resolveConnectionString(env as unknown as Record<string, unknown>),
    max: MAX_CONNECTIONS_PER_INVOCATION,
  });
  const client = new PrismaClient({ adapter });
  clientsByInvocation.set(key, client);
  return client;
}

/**
 * Proxy exposant l'API PrismaClient ; chaque accès de propriété est délégué
 * au client de l'invocation en cours.
 */
export function createWorkersPrismaProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      const client = getWorkersPrismaClient();
      const value = Reflect.get(client, prop, client) as unknown;
      return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(client) : value;
    },
    has(_target, prop) {
      return prop in getWorkersPrismaClient();
    },
  });
}
