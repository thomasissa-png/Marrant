import { PrismaClient } from "@prisma/client";

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

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
    datasourceUrl: getDatabaseUrl(),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
