/**
 * Insertion du lot de relance v5 (s15) : lit le fichier relu (`lot-relance-s15.json`)
 * et insère EXACTEMENT ses lignes en APPROVED via Prisma. Jamais lancé par le dry-run.
 *
 * Pilotes :
 *  - `tcp` (défaut) : PrismaClient standard sur DATABASE_URL (ou NEON_DATABASE_URL) ;
 *  - `neon-http` : adaptateur `@prisma/adapter-neon` (PrismaNeonHTTP, requêtes HTTPS),
 *    quand la connexion TCP 5432 est bloquée. devDependency, jamais embarqué par le Worker.
 * Garde-fous : refus si une ligne n'est pas APPROVED « thomas-s15 », si un id existe déjà
 * ou si des posts « thomas-s15 » existent déjà sur la période (aucune double insertion).
 */
import fs from "node:fs";
import { PrismaClient, type SocialFormat, type SocialPlatform } from "@prisma/client";
import { APPROVED_BY_LOT } from "./social-lot-v5-config";
import type { FichierLot, LigneLot } from "./social-lot-v5-export";

export type Driver = "tcp" | "neon-http";

export function lireFichierLot(chemin: string): FichierLot {
  const f = JSON.parse(fs.readFileSync(chemin, "utf-8")) as FichierLot;
  if (!Array.isArray(f.posts) || f.posts.length !== f.total) throw new Error(`Fichier ${chemin} incohérent (total ${f.total}, ${f.posts?.length} lignes).`);
  const fautives = f.posts.filter((p) => p.status !== "APPROVED" || p.approvedBy !== APPROVED_BY_LOT || !p.id || !p.scheduledAt);
  if (fautives.length) throw new Error(`${fautives.length} ligne(s) hors APPROVED « ${APPROVED_BY_LOT} » : insertion refusée.`);
  return f;
}

async function client(driver: Driver, url: string): Promise<PrismaClient> {
  if (driver === "tcp") return new PrismaClient({ datasourceUrl: url });
  const { PrismaNeonHTTP } = await import("@prisma/adapter-neon");
  return new PrismaClient({ adapter: new PrismaNeonHTTP(url, {}) });
}

function donnees(p: LigneLot) {
  return {
    id: p.id, platform: p.platform as SocialPlatform, format: p.format as SocialFormat, content: p.content, hook: p.hook, cta: p.cta,
    hashtags: p.hashtags, targetPersona: p.targetPersona, sourceType: p.sourceType, sourceId: p.sourceId, threadParts: p.threadParts,
    imageUrls: p.imageUrls, status: "APPROVED" as const, approvedBy: p.approvedBy, directorScore: p.directorScore, directorNote: p.directorNote,
    scheduledAt: new Date(p.scheduledAt),
  };
}

export async function insererLot(f: FichierLot, driver: Driver, url: string): Promise<number> {
  const prisma = await client(driver, url);
  try {
    const debut = new Date(`${f.debut}T00:00:00Z`);
    const fin = new Date(`${f.fin}T23:59:59Z`);
    const deja = await prisma.socialPost.count({ where: { approvedBy: APPROVED_BY_LOT, scheduledAt: { gte: debut, lte: fin } } });
    if (deja > 0) throw new Error(`${deja} post(s) « ${APPROVED_BY_LOT} » déjà en base sur la période : insertion refusée.`);
    const ids = await prisma.socialPost.count({ where: { id: { in: f.posts.map((p) => p.id) } } });
    if (ids > 0) throw new Error(`${ids} id(s) du lot déjà en base : insertion refusée.`);
    // Une seule instruction (createMany) : tout ou rien, compatible avec l'adaptateur HTTP (pas de transaction interactive).
    const res = await prisma.socialPost.createMany({ data: f.posts.map(donnees) });
    return res.count;
  } finally {
    await prisma.$disconnect();
  }
}
