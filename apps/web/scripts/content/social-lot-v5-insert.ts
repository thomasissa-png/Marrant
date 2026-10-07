/**
 * Insertion du lot de relance v5 (s15) : lit le fichier relu (`lot-relance-s15.json`)
 * et insère EXACTEMENT ses lignes en APPROVED via Prisma. Jamais lancé par le dry-run.
 *
 * Pilotes :
 *  - `tcp` (défaut) : PrismaClient standard sur DATABASE_URL (ou NEON_DATABASE_URL) ;
 *  - `neon-http` : adaptateur `@prisma/adapter-neon` (PrismaNeonHTTP, requêtes HTTPS),
 *    quand la connexion TCP 5432 est bloquée. devDependency, jamais embarqué par le Worker.
 * Garde-fous : refus si une ligne n'est pas APPROVED avec l'approvedBy de son lot
 * (« thomas-s15 » ou « lot-<id> »), si un id existe déjà, si des posts du lot existent déjà
 * sur la période, ou si un autre post actif occupe déjà la période sur un réseau du lot.
 * Avant insertion (`ecartsFichierLot`) : le fichier doit être le lot régénéré par la même commande.
 * Après insertion : comptage par réseau et par semaine (attendu contre inséré).
 * `--rollback` : posts APPROVED non envoyés du lot passés en REJECTED (comptage avant, après).
 */
import fs from "node:fs";
import { Prisma, PrismaClient, type SocialFormat, type SocialPlatform } from "@prisma/client";
import { approvedByDuLot } from "./social-lot-v5-config";
import { dateParis, lundiDe, parisVersUtc, ajouterJours } from "../../src/lib/social/heure-paris";
import type { FichierLot, LigneLot } from "./social-lot-v5-export";

export type Driver = "tcp" | "neon-http";

/** JSON canonique (clés triées, `undefined` omis) : deux lots égaux ligne pour ligne ont le même texte. */
function canonique(v: unknown): string {
  return JSON.stringify(v, (_k, x: unknown) => (x && typeof x === "object" && !Array.isArray(x)
    ? Object.fromEntries(Object.entries(x as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)))
    : x));
}

/**
 * `--insert` n'insère que le dry-run de la MÊME commande : le fichier relu doit être, ligne pour
 * ligne, le lot régénéré à l'instant (bornes, graine, posts et replis). Écart = insertion refusée
 * (ex. : l'ancien `lot-relance-s15.json` de 140 posts lu par `--lot relance-s15 --debut/--fin`).
 */
export function ecartsFichierLot(attendu: FichierLot, lu: FichierLot): string[] {
  const e: string[] = [];
  for (const k of ["lot", "approvedBy", "debut", "fin", "graine", "total"] as const) {
    if (attendu[k] !== lu[k]) e.push(`${k} : fichier « ${lu[k]} », commande « ${attendu[k]} »`);
  }
  const comparer = (nom: string, a: LigneLot[], l: LigneLot[]) => {
    const parId = new Map(l.map((x) => [x.id, x]));
    const absents = a.filter((x) => !parId.has(x.id)).map((x) => x.id);
    const enTrop = l.filter((x) => !a.some((y) => y.id === x.id)).map((x) => x.id);
    const differents = a.filter((x) => parId.has(x.id) && canonique(x) !== canonique(parId.get(x.id))).map((x) => x.id);
    const liste = (ids: string[]) => `${ids.slice(0, 5).join(", ")}${ids.length > 5 ? `, … (${ids.length})` : ""}`;
    if (absents.length) e.push(`${nom} absents du fichier : ${liste(absents)}`);
    if (enTrop.length) e.push(`${nom} du fichier hors commande : ${liste(enTrop)}`);
    if (differents.length) e.push(`${nom} modifiés depuis le dry-run : ${liste(differents)}`);
  };
  comparer("posts", attendu.posts, lu.posts);
  comparer("replis", attendu.replis ?? [], lu.replis ?? []);
  return e;
}

export function lireFichierLot(chemin: string): FichierLot {
  const f = JSON.parse(fs.readFileSync(chemin, "utf-8")) as FichierLot;
  if (!Array.isArray(f.posts) || f.posts.length !== f.total) throw new Error(`Fichier ${chemin} incohérent (total ${f.total}, ${f.posts?.length} lignes).`);
  const attendu = approvedByDuLot(f.lot);
  if (f.approvedBy !== attendu) throw new Error(`Fichier ${chemin} : approvedBy « ${f.approvedBy} » au lieu de « ${attendu} » pour le lot ${f.lot}.`);
  const fautives = f.posts.filter((p) => p.status !== "APPROVED" || p.approvedBy !== attendu || !p.id || !p.scheduledAt);
  if (fautives.length) throw new Error(`${fautives.length} ligne(s) hors APPROVED « ${attendu} » : insertion refusée.`);
  const replis = f.replis ?? [];
  const ids = new Set(f.posts.map((p) => p.id));
  const mauvaisRepli = replis.filter((r) => r.status !== "REJECTED" || r.approvedBy !== attendu || !r.directorNote.startsWith("[repli-de:")
    || !ids.has(r.directorNote.slice(10, r.directorNote.indexOf("]"))));
  if (mauvaisRepli.length) throw new Error(`${mauvaisRepli.length} repli(s) mal formé(s) (REJECTED, [repli-de:<relais du lot>]) : insertion refusée.`);
  return f;
}

export async function client(driver: Driver, url: string): Promise<PrismaClient> {
  if (driver === "tcp") return new PrismaClient({ datasourceUrl: url });
  const { PrismaNeonHTTP } = await import("@prisma/adapter-neon");
  return new PrismaClient({ adapter: new PrismaNeonHTTP(url, {}) });
}

function donnees(p: LigneLot) {
  return {
    id: p.id, platform: p.platform as SocialPlatform, format: p.format as SocialFormat, content: p.content, hook: p.hook, cta: p.cta,
    hashtags: p.hashtags, targetPersona: p.targetPersona, sourceType: p.sourceType, sourceId: p.sourceId, threadParts: p.threadParts,
    imageUrls: p.imageUrls, status: p.status, approvedBy: p.approvedBy, directorScore: p.directorScore, directorNote: p.directorNote,
    scheduledAt: new Date(p.scheduledAt),
  };
}

/** Colonnes de l'INSERT HTTP : celles de `donnees` + createdAt/updatedAt (pas de défaut en base pour @updatedAt). */
export const COLONNES_INSERTION = [
  "id", "platform", "format", "content", "hook", "cta", "hashtags", "targetPersona", "sourceType", "sourceId",
  "threadParts", "imageUrls", "status", "approvedBy", "directorScore", "directorNote", "scheduledAt", "createdAt", "updatedAt",
] as const;

/**
 * Pilote `neon-http` (s15 cycle 6) : `createMany` ouvre une transaction, refusée en HTTP.
 * UNE instruction `INSERT` multi-lignes est atomique sans transaction (tout ou rien).
 * Enums castés, tableaux en text[], scheduledAt en UTC explicite. Fonction pure.
 */
export function requeteInsertion(lignes: LigneLot[]): Prisma.Sql {
  if (lignes.length === 0) throw new Error("Aucune ligne à insérer.");
  const valeurs = lignes.map(donnees).map((d) => Prisma.sql`(${d.id}, CAST(${d.platform} AS "SocialPlatform"), CAST(${d.format} AS "SocialFormat"), ${d.content}, ${d.hook}, ${d.cta}, ${d.hashtags}::text[], ${d.targetPersona}, ${d.sourceType}, ${d.sourceId}, ${d.threadParts}::text[], ${d.imageUrls}::text[], CAST(${d.status} AS "SocialPostStatus"), ${d.approvedBy}, ${d.directorScore}::int, ${d.directorNote}, (${d.scheduledAt.toISOString()}::timestamptz AT TIME ZONE 'UTC'), NOW(), NOW())`);
  const colonnes = Prisma.raw(COLONNES_INSERTION.map((c) => `"${c}"`).join(", "));
  return Prisma.sql`INSERT INTO "SocialPost" (${colonnes}) VALUES ${Prisma.join(valeurs)}`;
}

/**
 * Pilote `neon-http` : `updateMany` ouvre aussi une transaction ; même filtre que NON_ENVOYES, en un UPDATE.
 * `periode` (bornes `--debut`/`--fin`, cycle 8 QA D1) : seuls les posts de la tranche sont annulés,
 * jamais ceux d'une autre tranche du même approvedBy. Fonction pure.
 */
export function requeteAnnulation(approvedBy: string, note: string, periode?: Periode): Prisma.Sql {
  const bornes = periode
    ? Prisma.sql` AND "scheduledAt" >= (${periode.gte.toISOString()}::timestamptz AT TIME ZONE 'UTC') AND "scheduledAt" < (${periode.lt.toISOString()}::timestamptz AT TIME ZONE 'UTC')`
    : Prisma.empty;
  return Prisma.sql`UPDATE "SocialPost" SET "status" = CAST('REJECTED' AS "SocialPostStatus"), "directorNote" = ${note}, "updatedAt" = NOW() WHERE "approvedBy" = ${approvedBy} AND "status" = CAST('APPROVED' AS "SocialPostStatus") AND "externalId" IS NULL AND "publishedAt" IS NULL${bornes}`;
}

export interface Periode { gte: Date; lt: Date }

/** Bornes UTC d'un lot : minuit de Paris du début, minuit de Paris du lendemain de la fin. */
export function bornesLot(debut: string, fin: string): Periode {
  return { gte: parisVersUtc(debut, 0, 0), lt: parisVersUtc(ajouterJours(fin, 1), 0, 0) };
}

/** Comptes par réseau et par semaine (lundi de Paris) : clé `RÉSEAU|AAAA-MM-JJ`. Fonction pure. */
export function comptesParReseauSemaine(rows: Array<{ platform: string; scheduledAt: string | Date }>): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = `${r.platform}|${lundiDe(dateParis(new Date(r.scheduledAt)))}`;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

/** Écarts entre l'attendu (fichier) et l'inséré (base), triés. Vide = conforme. Fonction pure. */
export function ecartsInsertion(attendu: Map<string, number>, insere: Map<string, number>): string[] {
  const cles = [...new Set([...attendu.keys(), ...insere.keys()])].sort();
  return cles.filter((k) => (attendu.get(k) ?? 0) !== (insere.get(k) ?? 0)).map((k) => {
    const [pf, semaine] = k.split("|");
    return `${pf}, semaine du ${semaine} : attendu ${attendu.get(k) ?? 0}, inséré ${insere.get(k) ?? 0}`;
  });
}

export interface ResultatInsertion { inseres: number; ecarts: string[]; comptes: Map<string, number> }

export async function insererLot(f: FichierLot, driver: Driver, url: string): Promise<ResultatInsertion> {
  const prisma = await client(driver, url);
  try {
    const periode = bornesLot(f.debut, f.fin);
    const deja = await prisma.socialPost.count({ where: { approvedBy: f.approvedBy, scheduledAt: periode } });
    if (deja > 0) throw new Error(`${deja} post(s) « ${f.approvedBy} » déjà en base sur la période : insertion refusée.`);
    const replis = f.replis ?? [];
    const ids = await prisma.socialPost.count({ where: { id: { in: [...f.posts, ...replis].map((p) => p.id) } } });
    if (ids > 0) throw new Error(`${ids} id(s) du lot déjà en base : insertion refusée.`);
    const reseaux = [...new Set(f.posts.map((p) => p.platform))] as SocialPlatform[];
    const autres = await prisma.socialPost.count({
      where: { platform: { in: reseaux }, scheduledAt: periode, status: { in: ["PENDING", "APPROVED", "PUBLISHED"] } },
    });
    if (autres > 0) throw new Error(`${autres} autre(s) post(s) actif(s) déjà prévu(s) sur la période (autre lot ?) : insertion refusée, voir --rollback.`);
    // Tout ou rien. TCP : createMany. HTTP : createMany ouvre une transaction (refusée,
    // « Transactions are not supported in HTTP mode »), donc UNE instruction INSERT multi-lignes.
    const lignes = [...f.posts, ...replis];
    const n = driver === "neon-http"
      ? await prisma.$executeRaw(requeteInsertion(lignes))
      : (await prisma.socialPost.createMany({ data: lignes.map(donnees) })).count;
    // Contrôle après insertion : relecture en base, par réseau et par semaine (APPROVED), puis les replis
    // de la SEULE tranche insérée (cycle 8 QA D2 : sans la période, les replis de 1a faussaient le contrôle de 1b).
    const lus = await prisma.socialPost.findMany({ where: { approvedBy: f.approvedBy, scheduledAt: periode, status: "APPROVED" }, select: { platform: true, scheduledAt: true } });
    const comptes = comptesParReseauSemaine(lus);
    const ecarts = ecartsInsertion(comptesParReseauSemaine(f.posts), comptes);
    const replisLus = await prisma.socialPost.count({ where: { approvedBy: f.approvedBy, scheduledAt: periode, status: "REJECTED", directorNote: { startsWith: "[repli-de:" } } });
    if (replisLus !== replis.length) ecarts.push(`replis en réserve : attendu ${replis.length}, inséré ${replisLus}`);
    return { inseres: n - replis.length, ecarts, comptes };
  } finally {
    await prisma.$disconnect();
  }
}

/** Posts APPROVED jamais envoyés à Buffer : ce que --rollback annule. */
export const NON_ENVOYES = { status: "APPROVED" as const, externalId: null, publishedAt: null };

/**
 * `--rollback --lot <id>` : sans `confirmer`, compte seulement ; avec, passe les posts
 * APPROVED non envoyés du lot en REJECTED. Les posts déjà remis à Buffer ne bougent pas.
 * `periode` (bornes `--debut`/`--fin`) : comptes et annulation limités à la tranche, pour qu'annuler
 * 1b ne touche jamais 1a (même approvedBy « thomas-s15 »). Sans période : tout le lot.
 */
export async function annulerLot(lot: string, driver: Driver, url: string, confirmer: boolean, now: Date, periode?: Periode) {
  const prisma = await client(driver, url);
  const approvedBy = approvedByDuLot(lot);
  const tranche = periode ? { approvedBy, scheduledAt: periode } : { approvedBy };
  try {
    const parStatut = async () => Object.fromEntries((await prisma.socialPost.groupBy({ by: ["status"], where: tranche, _count: { _all: true } }))
      .map((g) => [g.status, g._count._all])) as Record<string, number>;
    const avant = await parStatut();
    const aAnnuler = await prisma.socialPost.count({ where: { ...tranche, ...NON_ENVOYES } });
    if (!confirmer) return { approvedBy, avant, aAnnuler, annules: 0, apres: avant };
    const bornes = periode ? ` (${periode.gte.toISOString()} au ${periode.lt.toISOString()})` : "";
    const note = `Lot ${lot}${bornes} annulé (--rollback) le ${now.toISOString()}.`;
    // HTTP : updateMany ouvre une transaction (refusée) ; un seul UPDATE, même filtre.
    const annules = driver === "neon-http"
      ? await prisma.$executeRaw(requeteAnnulation(approvedBy, note, periode))
      : (await prisma.socialPost.updateMany({ where: { ...tranche, ...NON_ENVOYES }, data: { status: "REJECTED", directorNote: note } })).count;
    return { approvedBy, avant, aAnnuler, annules, apres: await parStatut() };
  } finally {
    await prisma.$disconnect();
  }
}
