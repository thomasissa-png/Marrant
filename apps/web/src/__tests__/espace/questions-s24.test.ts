/**
 * @jest-environment node
 *
 * Espace client, lot D7 (s24), « Mes questions » côté serveur, interrupteur OUVERT (simulé ici, jamais le
 * code livré) : création, fil, « Continuer », « Retirer » ; cloisonnement entre abonnés ; non Premium,
 * ancien abonné (lecture seule), session expirée ; champ vide, valeur maximale, double clic ; limites de
 * débit ; aucun texte dans les journaux, `UsageEvent` ni Umami ; e-mail de réponse (destinataire lu en
 * base, brouillon tant que son texte n'est pas validé) ; état « lu » persistant ; outil d'admin sans
 * session admin : 401 ; fermé : tout répond 404. Base simulée en mémoire.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { NextRequest } from "next/server";

type Ligne = Record<string, unknown>;
const tables: Record<string, Ligne[]> = { equipeFil: [], equipeMessage: [] };
let seq = 0;
const correspond = (l: Ligne, where: Ligne = {}) =>
  Object.entries(where).every(([k, v]) => (k === "userId_cle" ? l.userId === (v as Ligne).userId && l.cle === (v as Ligne).cle : k === "filId_cle" ? l.filId === (v as Ligne).filId && l.cle === (v as Ligne).cle : l[k] === v));
const avecMessages = (f: Ligne) => ({ ...f, user: { email: comptes[f.userId as string]?.email }, messages: tables.equipeMessage.filter((m) => m.filId === f.id) });
const comptes: Record<string, { email: string; plan: string; ancien?: boolean }> = {
  u1: { email: "abonne@example.com", plan: "PREMIUM" },
  u2: { email: "autre@example.com", plan: "PREMIUM" },
  u3: { email: "gratuit@example.com", plan: "FREE" },
  u4: { email: "ancien@example.com", plan: "FREE", ancien: true },
};
const doublon = () => Object.assign(new Error("unique"), { code: "P2002" });
const mockDb = {
  user: {
    findUnique: jest.fn(async (a: { where: Ligne; select: Ligne }) => {
      const id = (a.where.id as string) ?? Object.keys(comptes).find((k) => comptes[k].email === a.where.email);
      const c = id ? comptes[id] : undefined;
      if (!c) return null;
      return { id, email: c.email, plan: c.plan, subscription: c.ancien ? { stripeSubscriptionId: "sub_1" } : null };
    }),
  },
  equipeFil: {
    create: jest.fn(async (a: { data: Ligne & { messages: { create: Ligne | Ligne[] } } }) => {
      const { messages, ...d } = a.data;
      if (tables.equipeFil.some((f) => f.userId === d.userId && f.cle === d.cle)) throw doublon();
      const fil = { id: `fil${++seq}xxxxxxxx`, statut: "EN_ATTENTE", ouvertParAbonneLe: null, sceneOu: null, sceneBut: null, ...d };
      tables.equipeFil.push(fil);
      for (const m of ([] as Ligne[]).concat(messages.create)) tables.equipeMessage.push({ id: `m${++seq}`, filId: fil.id, cle: null, emailEnvoyeLe: null, ...m });
      return fil;
    }),
    findMany: jest.fn(async (a: { where: Ligne }) => tables.equipeFil.filter((f) => correspond(f, a.where)).map(avecMessages)),
    findFirst: jest.fn(async (a: { where: Ligne }) => {
      const f = tables.equipeFil.find((x) => correspond(x, a.where));
      return f ? avecMessages(f) : null;
    }),
    findUnique: jest.fn(async (a: { where: Ligne }) => {
      const f = tables.equipeFil.find((x) => correspond(x, a.where));
      return f ? avecMessages(f) : null;
    }),
    update: jest.fn(async (a: { where: Ligne; data: Ligne }) => Object.assign(tables.equipeFil.find((f) => correspond(f, a.where))!, a.data)),
    updateMany: jest.fn(async (a: { where: Ligne; data: Ligne }) => {
      const l = tables.equipeFil.filter((f) => correspond(f, a.where));
      l.forEach((f) => Object.assign(f, a.data));
      return { count: l.length };
    }),
    deleteMany: jest.fn(async (a: { where: Ligne }) => {
      const avant = tables.equipeFil.length;
      const partis = tables.equipeFil.filter((f) => correspond(f, a.where)).map((f) => f.id);
      tables.equipeFil = tables.equipeFil.filter((f) => !partis.includes(f.id));
      tables.equipeMessage = tables.equipeMessage.filter((m) => !partis.includes(m.filId));
      return { count: avant - tables.equipeFil.length };
    }),
  },
  equipeMessage: {
    create: jest.fn(async (a: { data: Ligne }) => {
      if (a.data.cle && tables.equipeMessage.some((m) => m.filId === a.data.filId && m.cle === a.data.cle)) throw doublon();
      const m = { id: `m${++seq}`, cle: null, emailEnvoyeLe: null, ...a.data };
      tables.equipeMessage.push(m);
      return m;
    }),
    findUnique: jest.fn(async (a: { where: Ligne }) => tables.equipeMessage.find((m) => correspond(m, a.where)) ?? null),
    deleteMany: jest.fn(async (a: { where: { filId: string; fil: { userId: string } } }) => {
      const fil = tables.equipeFil.find((f) => f.id === a.where.filId && f.userId === a.where.fil.userId);
      const avant = tables.equipeMessage.length;
      if (fil) tables.equipeMessage = tables.equipeMessage.filter((m) => m.filId !== fil.id);
      return { count: avant - tables.equipeMessage.length };
    }),
    update: jest.fn(async (a: { where: Ligne; data: Ligne }) => Object.assign(tables.equipeMessage.find((m) => m.id === a.where.id)!, a.data)),
  },
  usageEvent: { create: jest.fn(), createMany: jest.fn() },
  $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
};
jest.mock("@/lib/prisma", () => ({ get prisma() { return mockDb; } }));
const ouvert = { espace: true, email: false };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() { return ouvert.espace; },
}));
jest.mock("@/config/textes/espace-questions", () => ({
  ...jest.requireActual("@/config/textes/espace-questions"),
  get EMAIL_REPONSE_VALIDE() { return ouvert.email; },
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const limite = { refus: false };
jest.mock("@/lib/rate-limit", () => ({
  sharedRateLimit: jest.fn(async () => ({ allowed: !limite.refus, remaining: 0, resetAt: 0 })),
  retryAfterSeconds: () => 120,
}));
const envois: Array<{ to: string; subject: string; text: string; options: Record<string, unknown> }> = [];
jest.mock("@/lib/email", () => ({
  sendServiceTextEmail: jest.fn(async (to: string, subject: string, text: string, _k: string, options: Record<string, unknown>) => {
    envois.push({ to, subject, text, options });
  }),
}));

import { GET as lister, POST as envoyer } from "@/app/api/espace/questions/route";
import { GET as lireUn, DELETE as retirer } from "@/app/api/espace/questions/[id]/route";
import { POST as continuer } from "@/app/api/espace/questions/[id]/messages/route";
import { POST as ouvrir } from "@/app/api/espace/questions/[id]/ouvert/route";
import { GET as adminLister, POST as adminRepondre, PATCH as adminEtiqueter } from "@/app/api/admin/questions-equipe/route";
import { joursOuvresEcoules } from "@/lib/espace/questions";
import { QUESTION_EQUIPE_MAX } from "@/config/question-equipe";

const SECRET = "Ma collègue Bérénice m'a chambré devant toute l'équipe";
const req = (corps?: unknown) => new Request("http://localhost/api/espace/questions", { method: "POST", body: corps === undefined ? undefined : JSON.stringify(corps) });
const admin = (methode: string, corps?: unknown, mdp = "mdp-admin") =>
  new NextRequest("http://localhost/api/admin/questions-equipe", {
    method: methode,
    headers: mdp ? { authorization: `Bearer ${mdp}` } : {},
    body: corps === undefined ? undefined : JSON.stringify(corps),
  });
const p = (id: string) => ({ params: { id } });
const session = (id: string | null) => getServerSession.mockResolvedValue(id ? { user: { id } } : null);
const espions = () => (["log", "info", "warn", "error", "debug"] as const).map((n) => jest.spyOn(console, n).mockImplementation(() => undefined));

beforeEach(() => {
  tables.equipeFil = [];
  tables.equipeMessage = [];
  envois.length = 0;
  Object.assign(ouvert, { espace: true, email: false });
  limite.refus = false;
  process.env.ADMIN_PASSWORD = "mdp-admin";
  session("u1");
});

describe("abonné : envoi, fil, « Continuer », « Retirer »", () => {
  it("création : un fil en attente, notification interne à l'équipe (Reply-To = adresse du compte EN BASE)", async () => {
    const r = await envoyer(req({ type: "SITUATION", message: SECRET, cle: "cle-envoi-1", replyTo: "pirate@x.fr" }));
    expect(r.status).toBe(400); // champ inconnu refusé (corps strict)
    const ok = await envoyer(req({ type: "SITUATION", message: `  ${SECRET}  `, cle: "cle-envoi-1" }));
    expect(ok.status).toBe(200);
    const { fil } = await ok.json();
    expect(fil).toMatchObject({ type: "SITUATION", statut: "EN_ATTENTE", enRetard: false, nonLu: false });
    expect(fil.messages).toEqual([expect.objectContaining({ auteur: "ABONNE", corps: SECRET })]);
    expect(envois).toHaveLength(1);
    expect(envois[0].to).toBe("alex@deviens-marrant.fr");
    expect(envois[0].options.replyTo).toBe("abonne@example.com");
    expect(envois[0].subject).not.toContain(SECRET);
  });

  it("double clic (même clé) : une seule ligne, une seule notification", async () => {
    const corps = { type: "QUESTION", message: SECRET, cle: "cle-double-1" };
    const [a, b] = await Promise.all([envoyer(req(corps)), envoyer(req(corps))]);
    expect([a.status, b.status]).toEqual([200, 200]);
    expect(tables.equipeFil).toHaveLength(1);
    expect(tables.equipeMessage).toHaveLength(1);
    expect(envois).toHaveLength(1);
  });

  it("champ vide : 400 « vide » ; 1 000 caractères acceptés ; 1 001 : 400 « trop-long » ; type hors liste : 400", async () => {
    expect(await (await envoyer(req({ type: "QUESTION", message: "   ", cle: "cle-vide-01" }))).json()).toEqual({ error: "vide" });
    expect((await envoyer(req({ type: "QUESTION", message: "é".repeat(QUESTION_EQUIPE_MAX), cle: "cle-max-001" }))).status).toBe(200);
    const trop = await envoyer(req({ type: "QUESTION", message: "é".repeat(QUESTION_EQUIPE_MAX + 1), cle: "cle-max-002" }));
    expect([trop.status, await trop.json()]).toEqual([400, { error: "trop-long" }]);
    expect((await envoyer(req({ type: "AUTRE", message: "x", cle: "cle-type-01" }))).status).toBe(400);
  });

  it("limites (3 par 10 min, 10 par jour) : 429 + Retry-After, rien d'enregistré", async () => {
    limite.refus = true;
    const r = await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-limite1" }));
    expect(r.status).toBe(429);
    expect(r.headers.get("Retry-After")).toBe("120");
    expect(tables.equipeFil).toHaveLength(0);
  });

  it("fil, réponse de l'équipe, « lu » persistant après rechargement, « Continuer », « Retirer »", async () => {
    const { fil } = await (await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-fil-001" }))).json();
    // « Continuer » refusé tant que l'équipe n'a pas répondu.
    expect((await continuer(req({ message: "Et aussi", cle: "cle-suite-1" }), p(fil.id))).status).toBe(409);
    expect((await adminRepondre(admin("POST", { filId: fil.id, reponse: "Voici une idée." }))).status).toBe(200);
    let liste = (await (await lister()).json()).fils;
    expect(liste[0]).toMatchObject({ statut: "REPONDU", nonLu: true });
    expect((await ouvrir(req(), p(fil.id))).status).toBe(200);
    liste = (await (await lister()).json()).fils; // rechargement : lu en base
    expect(liste[0].nonLu).toBe(false);
    const suite = await continuer(req({ message: "Merci, et si elle insiste ?", cle: "cle-suite-2" }), p(fil.id));
    expect(suite.status).toBe(200);
    expect((await suite.json()).fil).toMatchObject({ statut: "EN_ATTENTE" });
    expect((await continuer(req({ message: "Merci, et si elle insiste ?", cle: "cle-suite-2" }), p(fil.id))).status).toBe(200);
    expect(tables.equipeMessage.filter((m) => m.filId === fil.id)).toHaveLength(3);
    expect((await retirer(req(), p(fil.id))).status).toBe(200);
    expect(tables.equipeFil).toHaveLength(0);
    expect(tables.equipeMessage).toHaveLength(0);
    expect((await lireUn(req(), p(fil.id))).status).toBe(404);
  });
});

describe("cloisonnement et accès", () => {
  it("un abonné ne lit ni n'écrit dans le fil d'un autre : 404 partout, rien ne bouge", async () => {
    const { fil } = await (await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-autre-1" }))).json();
    await adminRepondre(admin("POST", { filId: fil.id, reponse: "Réponse" }));
    session("u2");
    expect((await lireUn(req(), p(fil.id))).status).toBe(404);
    expect((await continuer(req({ message: "intrus", cle: "cle-intrus1" }), p(fil.id))).status).toBe(404);
    expect((await ouvrir(req(), p(fil.id))).status).toBe(404);
    expect((await retirer(req(), p(fil.id))).status).toBe(404);
    expect((await (await lister()).json()).fils).toEqual([]);
    expect(tables.equipeFil).toHaveLength(1);
    expect(tables.equipeFil[0].ouvertParAbonneLe).toBeNull();
  });

  it("non Premium : 403 ; session expirée : 401 ; ancien abonné : lecture seule, retrait possible", async () => {
    session("u3");
    expect((await lister()).status).toBe(403);
    expect((await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-free-01" }))).status).toBe(403);
    session(null);
    expect((await lister()).status).toBe(401);
    expect((await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-sess-01" }))).status).toBe(401);
    session("u1");
    const { fil } = await (await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-ancien1" }))).json();
    await adminRepondre(admin("POST", { filId: fil.id, reponse: "Réponse" }));
    tables.equipeFil[0].userId = "u4";
    session("u4");
    const lu = await (await lister()).json();
    expect(lu).toMatchObject({ lectureSeule: true, fils: [expect.objectContaining({ id: fil.id })] });
    expect(await (await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-ancien2" }))).json()).toEqual({ error: "lecture-seule" });
    expect((await continuer(req({ message: "suite", cle: "cle-ancien3" }), p(fil.id))).status).toBe(403);
    expect((await retirer(req(), p(fil.id))).status).toBe(200);
  });

  it("interrupteur fermé : 404 avant toute lecture (abonné et outil d'admin)", async () => {
    ouvert.espace = false;
    mockDb.user.findUnique.mockClear();
    for (const r of [await lister(), await envoyer(req({})), await retirer(req(), p("filxxxxxxxx")), await adminLister(admin("GET"))]) expect(r.status).toBe(404);
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
  });
});

describe("outil d'admin et e-mail de réponse", () => {
  it("sans session admin : 401 (aucun mot de passe, ou un faux)", async () => {
    expect((await adminLister(admin("GET", undefined, ""))).status).toBe(401);
    expect((await adminLister(admin("GET", undefined, "faux"))).status).toBe(401);
    expect((await adminRepondre(admin("POST", { filId: "filxxxxxxxx", reponse: "x" }, "faux"))).status).toBe(401);
  });

  it("texte de l'e-mail non validé : réponse ENREGISTRÉE, aucun e-mail (brouillon)", async () => {
    const { fil } = await (await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-brouil1" }))).json();
    envois.length = 0;
    expect(await (await adminRepondre(admin("POST", { filId: fil.id, reponse: "Réponse" }))).json()).toEqual({ enregistre: true, email: "brouillon" });
    expect(envois).toEqual([]);
    expect(tables.equipeMessage.find((m) => m.auteur === "EQUIPE")?.emailEnvoyeLe).toBeNull();
  });

  it("e-mail mocké (texte supposé validé) : destinataire = adresse du compte lue en base ; Reply-To équipe ; signé", async () => {
    ouvert.email = true;
    const { fil } = await (await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-email01" }))).json();
    envois.length = 0;
    expect(await (await adminRepondre(admin("POST", { filId: fil.id, reponse: "Voici." }))).json()).toEqual({ enregistre: true, email: "envoye" });
    expect(envois).toHaveLength(1);
    expect(envois[0]).toMatchObject({ to: "abonne@example.com", options: { replyTo: "alex@deviens-marrant.fr" } });
    expect(envois[0].text).toContain("L'Équipe Deviens Marrant");
    expect(tables.equipeMessage.find((m) => m.auteur === "EQUIPE")?.emailEnvoyeLe).toBeInstanceOf(Date);
  });

  it("liste (en attente d'abord), étiquette de scène (listes fermées, deux valeurs), recopie sans e-mail", async () => {
    const { fil } = await (await envoyer(req({ type: "SITUATION", message: SECRET, cle: "cle-admin01" }))).json();
    const liste = await (await adminLister(admin("GET"))).json();
    expect(liste).toMatchObject({ attente: 1, enRetard: 0, fils: [expect.objectContaining({ id: fil.id, email: "abonne@example.com" })] });
    expect((await adminEtiqueter(admin("PATCH", { filId: fil.id, sceneOu: "boulot", sceneBut: "repondre-chambrage" }))).status).toBe(200);
    expect(tables.equipeFil[0]).toMatchObject({ sceneOu: "boulot", sceneBut: "repondre-chambrage" });
    expect((await adminEtiqueter(admin("PATCH", { filId: fil.id, sceneOu: "piscine", sceneBut: null }))).status).toBe(400);
    envois.length = 0;
    const r = await adminRepondre(admin("POST", { recopie: { email: "autre@example.com", type: "QUESTION", question: "Q par e-mail", reponse: "R par e-mail" } }));
    expect(await r.json()).toMatchObject({ enregistre: true, email: "aucun" });
    expect(envois).toEqual([]);
    expect(tables.equipeFil.find((f) => f.userId === "u2")).toMatchObject({ statut: "REPONDU" });
  });
});

describe("aucune trace du texte", () => {
  it("journaux (erreur base comprise), `UsageEvent`, Umami : jamais le texte", async () => {
    const s = espions();
    await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-trace01" }));
    mockDb.equipeFil.create.mockRejectedValueOnce(Object.assign(new Error(SECRET), { name: "PrismaClientKnownRequestError", code: "P1001" }));
    expect((await envoyer(req({ type: "QUESTION", message: SECRET, cle: "cle-trace02" }))).status).toBe(503);
    const ecrit = s.flatMap((x) => x.mock.calls.flat()).map(String).join("\n");
    expect(ecrit).not.toContain("Bérénice");
    expect(ecrit).toContain("[espace/questions/envoi] échec : PrismaClientKnownRequestError P1001");
    expect(mockDb.usageEvent.create).not.toHaveBeenCalled();
    s.forEach((x) => x.mockRestore());
    const SRC = join(__dirname, "../..");
    const fichiers = (d: string): string[] => readdirSync(d).flatMap((e) => (statSync(join(d, e)).isDirectory() ? fichiers(join(d, e)) : [join(d, e)]));
    const sources = [
      ...fichiers(join(SRC, "components/espace/questions")),
      ...fichiers(join(SRC, "app/api/espace/questions")),
      join(SRC, "lib/espace/questions.ts"),
      join(SRC, "lib/espace/questions-equipe.ts"),
      join(SRC, "lib/espace/questions-route.ts"),
    ];
    // Code seulement (les commentaires disent justement « ni UsageEvent, ni Umami »).
    const code = (f: string) => readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    for (const f of sources) expect([relative(SRC, f), /umami|usageEvent|trackEvent/i.test(code(f))]).toEqual([relative(SRC, f), false]);
  });
});

describe("retard : 3 jours ouvrés (Paris), comme la maquette", () => {
  it("envoyé le vendredi 6 novembre : en retard le jeudi 12, pas le mercredi 11", () => {
    const envoi = new Date("2026-11-06T16:00:00Z");
    expect(joursOuvresEcoules(envoi, new Date("2026-11-11T10:00:00Z"))).toBe(2);
    expect(joursOuvresEcoules(envoi, new Date("2026-11-12T08:00:00Z"))).toBe(3);
    expect(joursOuvresEcoules(new Date("2026-11-13T22:30:00Z"), new Date("2026-11-16T10:00:00Z"))).toBe(0); // samedi à Paris
  });
});
