/**
 * Base en mémoire pour les tests de « Ta question à l'équipe » : interprète le
 * sous-ensemble de requêtes Prisma utilisé par `lib/equipe-questions/*`
 * (égalité, null, gte/gt/lt/lte, not, in, OR) et la contrainte unique
 * `idempotencyKey` (erreur P2002 comme Prisma).
 */
import { Prisma } from "@prisma/client";

type Ligne = Record<string, unknown> & { id: string };
type Where = Record<string, unknown>;

function compare(v: unknown, cond: unknown): boolean {
  if (cond === null) return v === null || v === undefined;
  if (cond instanceof Date) return v instanceof Date && v.getTime() === cond.getTime();
  if (typeof cond === "object" && cond !== null) {
    const c = cond as Record<string, unknown>;
    const n = (x: unknown) => (x instanceof Date ? x.getTime() : (x as number));
    if ("gte" in c && !(v != null && n(v) >= n(c.gte))) return false;
    if ("gt" in c && !(v != null && n(v) > n(c.gt))) return false;
    if ("lt" in c && !(v != null && n(v) < n(c.lt))) return false;
    if ("lte" in c && !(v != null && n(v) <= n(c.lte))) return false;
    if ("not" in c && v === c.not) return false;
    if ("in" in c && !(c.in as unknown[]).includes(v)) return false;
    return true;
  }
  return v === cond;
}

export function correspond(l: Ligne, where: Where = {}): boolean {
  return Object.entries(where).every(([k, cond]) => {
    if (k === "OR") return (cond as Where[]).some((w) => correspond(l, w));
    return compare(l[k], cond);
  });
}

const DEFAUTS = {
  retour: null, statut: "RECUE", sensible: false, origine: "site", brouillon: null, brouillonSource: null,
  brouillonAt: null, reponse: null, reponseModifieeParAdmin: false, relueAt: null, relueMode: null,
  envoiReserveAt: null, sentAt: null, ecarteeAt: null, alerteArriveeAt: null, alerteEcheanceAt: null,
  reutilisationAcceptee: false, reutilisationVersion: null, reutilisationAt: null, extraitTexte: null,
  extraitStatut: "AUCUN", extraitVersion: null, extraitProposeAt: null, extraitDecisionAt: null,
};

export function creerBaseQuestions() {
  const questions: Ligne[] = [];
  const users: Ligne[] = [];
  let seq = 0;
  const trier = (rows: Ligne[], orderBy?: Record<string, "asc" | "desc">) => {
    if (!orderBy) return rows;
    const [k, sens] = Object.entries(orderBy)[0];
    return [...rows].sort((a, b) => {
      const d = (a[k] as Date).getTime() - (b[k] as Date).getTime();
      return sens === "asc" ? d : -d;
    });
  };
  const equipeQuestion = {
    findUnique: jest.fn(async ({ where }: { where: Where }) => questions.find((q) => correspond(q, where)) ?? null),
    findFirst: jest.fn(async ({ where }: { where: Where }) => questions.find((q) => correspond(q, where)) ?? null),
    findMany: jest.fn(async ({ where, orderBy, include }: { where?: Where; orderBy?: Record<string, "asc" | "desc">; include?: unknown } = {}) =>
      trier(questions.filter((q) => correspond(q, where)), orderBy).map((q) =>
        include ? { ...q, user: { ...(users.find((u) => u.id === q.userId) ?? {}), subscription: users.find((u) => u.id === q.userId)?.subscription ?? null } } : { ...q },
      ),
    ),
    count: jest.fn(async ({ where }: { where: Where }) => questions.filter((q) => correspond(q, where)).length),
    create: jest.fn(async ({ data }: { data: Ligne }) => {
      if (questions.some((q) => q.idempotencyKey === data.idempotencyKey)) {
        throw new Prisma.PrismaClientKnownRequestError("Unique", { code: "P2002", clientVersion: "test" });
      }
      const now = new Date();
      const ligne = { ...DEFAUTS, receivedAt: now, createdAt: now, updatedAt: now, ...data, id: `q${++seq}` } as Ligne;
      questions.push(ligne);
      return { ...ligne };
    }),
    update: jest.fn(async ({ where, data }: { where: Where; data: Record<string, unknown> }) => {
      const q = questions.find((x) => correspond(x, where));
      if (!q) throw new Error("Record not found");
      Object.assign(q, data, { updatedAt: new Date() });
      return { ...q };
    }),
    updateMany: jest.fn(async ({ where, data }: { where: Where; data: Record<string, unknown> }) => {
      const cibles = questions.filter((q) => correspond(q, where));
      cibles.forEach((q) => Object.assign(q, data));
      return { count: cibles.length };
    }),
    deleteMany: jest.fn(async ({ where }: { where: Where }) => {
      const avant = questions.length;
      for (let i = questions.length - 1; i >= 0; i--) if (correspond(questions[i], where)) questions.splice(i, 1);
      return { count: avant - questions.length };
    }),
  };
  const user = {
    findUnique: jest.fn(async ({ where }: { where: Where }) => users.find((u) => correspond(u, where)) ?? null),
  };
  return { questions, users, prisma: { equipeQuestion, user } };
}
