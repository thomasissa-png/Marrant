import { PrismaClient } from "@prisma/client";
import { isCloudflareWorkers } from "@/lib/runtime-env";

// Évite les instances multiples de Prisma en développement (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Augmenter le pool pour supporter les crons + requêtes utilisateurs simultanées.
// Ajoute connection_limit et pool_timeout au DATABASE_URL s'ils ne sont pas déjà présents.
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || "";
  if (url.includes("connection_limit") || url.includes("pool_timeout")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}connection_limit=15&pool_timeout=30`;
}

// Cloudflare Workers (OpenNext) : client par invocation via Hyperdrive + driver
// adapter pg (voir prisma-workers.ts). `require` paresseux : sur Replit/Node le
// module n'est jamais évalué (ni `pg` ni l'adaptateur ne sont chargés) et le
// client ci-dessous reste strictement identique à l'avant-migration.
// `NEXT_RUNTIME !== "edge"` : remplacé par une constante au build → la branche
// Workers (et `pg`, qui exige net/dns) est éliminée du bundle edge
// (instrumentation compilée pour les deux runtimes).
export const prisma: PrismaClient = process.env.NEXT_RUNTIME !== "edge" && isCloudflareWorkers()
  ? (require("./prisma-workers") as typeof import("./prisma-workers")).createWorkersPrismaProxy()
  : globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
      datasourceUrl: getDatabaseUrl(),
    });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
