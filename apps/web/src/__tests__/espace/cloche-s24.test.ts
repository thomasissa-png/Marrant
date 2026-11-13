/**
 * @jest-environment node
 *
 * Espace client, lot D8 (s24), cloche côté serveur, interrupteur OUVERT simulé ici (jamais le code livré) :
 * plafond de regroupement (une ligne par type, une par jour, 5 au plus), nouveautés du mois seulement, lettre
 * le seul jour de son envoi (date future absente), aucun bonus, aucune fiche reprise d'une lettre non envoyée,
 * humour noir sans nom de sujet ; route : nombre du nom = réponses non lues (jamais les lignes), aucune
 * écriture, aucun texte de message, aucun e-mail (mock Resend jamais appelé), fermé 404 sans lecture.
 * Décisions du 13/11 : « Retirer » EFFACE le fil et ses messages (aucune suppression logique), plus rien ni
 * dans l'API ni dans l'export du compte ; e-mail de réponse validé mais muet tant que l'espace est fermé.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";

type Ligne = Record<string, unknown>;
const tables: Record<string, Ligne[]> = { equipeFil: [], equipeMessage: [], newsletterIssue: [] };
const correspond = (l: Ligne, where: Ligne = {}) => Object.entries(where).every(([k, v]) => l[k] === v);
const avecMessages = (f: Ligne) => ({ ...f, user: { email: "abonne@example.com" }, messages: tables.equipeMessage.filter((m) => m.filId === f.id) });
const ecritures = jest.fn();
const ecrire = (nom: string) =>
  jest.fn(async (...a: unknown[]) => {
    ecritures(nom, ...a);
    return { count: 0 };
  });
const equipeFil = {
  findMany: jest.fn(async (a: { where: Ligne }) => tables.equipeFil.filter((f) => correspond(f, a.where)).map(avecMessages)),
  findFirst: jest.fn(async (a: { where: Ligne }) => {
    const f = tables.equipeFil.find((x) => correspond(x, a.where));
    return f ? avecMessages(f) : null;
  }),
  findUnique: jest.fn(async (a: { where: Ligne }) => {
    const f = tables.equipeFil.find((x) => correspond(x, a.where));
    return f ? avecMessages(f) : null;
  }),
  create: jest.fn(async (a: { data: Ligne }) => {
    ecritures("equipeFil.create", a);
    return a.data;
  }),
  update: jest.fn(async (a: { where: Ligne; data: Ligne }) => Object.assign(tables.equipeFil.find((f) => correspond(f, a.where))!, a.data)),
  updateMany: ecrire("equipeFil.updateMany"),
  deleteMany: jest.fn(async (a: { where: Ligne }) => {
    ecritures("equipeFil.deleteMany", a);
    const avant = tables.equipeFil.length;
    tables.equipeFil = tables.equipeFil.filter((f) => !correspond(f, a.where));
    return { count: avant - tables.equipeFil.length };
  }),
};
const equipeMessage = {
  create: jest.fn(async (a: { data: Ligne }) => {
    const m = { id: `m${tables.equipeMessage.length + 1}`, ...a.data };
    tables.equipeMessage.push(m);
    return m;
  }),
  update: jest.fn(async (a: { where: Ligne; data: Ligne }) => Object.assign(tables.equipeMessage.find((m) => m.id === a.where.id)!, a.data)),
  updateMany: ecrire("equipeMessage.updateMany"),
  deleteMany: jest.fn(async (a: { where: { filId: string; fil: { userId: string } } }) => {
    ecritures("equipeMessage.deleteMany", a);
    const fil = tables.equipeFil.find((f) => f.id === a.where.filId && f.userId === a.where.fil.userId);
    const avant = tables.equipeMessage.length;
    if (fil) tables.equipeMessage = tables.equipeMessage.filter((m) => m.filId !== fil.id);
    return { count: avant - tables.equipeMessage.length };
  }),
};
/** Toute autre table (export du compte) : vide, et toute écriture est relevée. */
const autre = () => ({ findMany: jest.fn(async () => []), findUnique: jest.fn(async () => null), update: ecrire("autre"), updateMany: ecrire("autre"), create: ecrire("autre") });
const mockDb: Record<string, unknown> = new Proxy(
  {
    user: { findUnique: jest.fn(async (a: { where: Ligne }) => (a.where.id === "u1" ? { id: "u1", email: "abonne@example.com", plan: "PREMIUM", subscription: null } : null)) },
    equipeFil,
    equipeMessage,
    newsletterIssue: {
      findMany: jest.fn(async (a: { where: { sends: { some: { sentAt: { lte: Date } } } } }) => {
        const lte = a.where.sends.some.sentAt.lte;
        return tables.newsletterIssue
          .filter((i) => (i.sentAt as Date) <= lte)
          .map((i) => ({ periodKey: i.periodKey, subject: i.subject, bodyText: i.bodyText, sends: [{ sentAt: i.sentAt }] }));
      }),
    },
    $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  } as Record<string, unknown>,
  { get: (cible, nom: string) => (nom in cible ? cible[nom] : typeof nom === "string" && !nom.startsWith("__") && nom !== "then" ? (cible[nom] = autre()) : undefined) },
);
jest.mock("@/lib/prisma", () => ({ get prisma() { return mockDb; } }));
// Lu dès le chargement de certains modules : l'état vit sur `globalThis` (aucune variable non initialisée).
const ouvert = globalThis as { __CLOCHE_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() { return (globalThis as { __CLOCHE_OUVERT__?: boolean }).__CLOCHE_OUVERT__ ?? true; },
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({ sharedRateLimit: jest.fn(async () => ({ allowed: true, remaining: 9, resetAt: 0 })), retryAfterSeconds: () => 60 }));
const resend = jest.fn();
jest.mock("@/lib/email", () => ({ sendServiceTextEmail: (...a: unknown[]) => resend(...a) }));

import { GET as cloche, POST as clochePost } from "@/app/api/espace/cloche/route";
import { GET as lister } from "@/app/api/espace/questions/route";
import { GET as lireUn, DELETE as retirer } from "@/app/api/espace/questions/[id]/route";
import { POST as adminRepondre } from "@/app/api/admin/questions-equipe/route";
import { regrouper, nouveautesFiches, lettreDuJour, nouveauteCarnet, type LigneNouveaute } from "@/lib/espace/cloche";
import { creerChargeurs, type SourcesFiches } from "@/lib/espace/fiches";
import { FICHIERS_ESPACE } from "@/lib/espace/fiches-schema";
import { repondre } from "@/lib/espace/questions-equipe";
import { collecterDonneesParcours } from "@/lib/account";
import { parseCarnets } from "@/lib/carnet";
import carnetOctobre from "@/data/carnet/2026-10.json";
import carnetNovembre from "@/data/carnet/2026-11.json";
import { TEXTES_CLOCHE } from "@/config/textes/espace-cloche";
import situationPoele from "@/lib/espace/fixtures/situation-coloc-la-poele.json";
import situationReprise from "@/lib/espace/fixtures/situation-reprise-lettre-w46.json";
import humourNoir from "@/lib/espace/fixtures/humour-noir.json";
import bonusCap2 from "@/lib/espace/fixtures/bonus-factice-cap-2.json";

const MAINTENANT = new Date("2026-11-13T10:00:00Z"); // vendredi 13 novembre, Paris
const SECRET = "Ma collègue Bérénice m'a chambré devant toute l'équipe";
const SRC = join(__dirname, "../..");
const p = (id: string) => ({ params: { id } });
const ev = (genre: LigneNouveaute["genre"], le: string): LigneNouveaute => ({ genre, le, href: `/${genre}` });

beforeEach(() => {
  jest.clearAllMocks();
  tables.equipeFil = [];
  tables.equipeMessage = [];
  tables.newsletterIssue = [];
  ouvert.__CLOCHE_OUVERT__ = true;
  ecritures.mockClear();
  resend.mockReset();
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  process.env.ADMIN_PASSWORD = "mdp-admin";
  jest.useFakeTimers({ now: MAINTENANT, doNotFake: ["nextTick", "setImmediate", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "queueMicrotask"] });
});
afterEach(() => jest.useRealTimers());

/** Un fil de u1 ; `reponduLe` : réponse de l'équipe ; `ouvertLe` : fil ouvert par l'abonné. */
function fil(id: string, p: { reponduLe?: string; ouvertLe?: string; userId?: string } = {}) {
  tables.equipeFil.push({ id, userId: p.userId ?? "u1", type: "SITUATION", statut: p.reponduLe ? "REPONDU" : "EN_ATTENTE", cle: `cle-${id}`, creeLe: new Date("2026-11-09T09:00:00Z"), dernierMessageLe: new Date(p.reponduLe ?? "2026-11-09T09:00:00Z"), ouvertParAbonneLe: p.ouvertLe ? new Date(p.ouvertLe) : null });
  tables.equipeMessage.push({ id: `${id}-a`, filId: id, auteur: "ABONNE", corps: SECRET, creeLe: new Date("2026-11-09T09:00:00Z") });
  if (p.reponduLe) tables.equipeMessage.push({ id: `${id}-e`, filId: id, auteur: "EQUIPE", corps: "Réponse de l'équipe", creeLe: new Date(p.reponduLe) });
}

describe("plafond de regroupement et nouveautés (2.9)", () => {
  it("une ligne par type sur le mois (10 situations la même semaine : 1 ligne), la plus récente d'abord", () => {
    const dix = Array.from({ length: 10 }, (_, i) => ev("situations", `2026-11-${String(2 + (i % 5)).padStart(2, "0")}`));
    expect(regrouper(dix, MAINTENANT)).toEqual([ev("situations", "2026-11-06")]);
  });

  it("une ligne par jour : deux types le même jour donnent une ligne ; l'autre type reprend une date antérieure", () => {
    const lignes = regrouper([ev("carnet", "2026-11-01"), ev("situations", "2026-11-10"), ev("bibliotheque", "2026-11-10"), ev("bibliotheque", "2026-11-04")], MAINTENANT);
    expect(lignes).toEqual([ev("situations", "2026-11-10"), ev("bibliotheque", "2026-11-04"), ev("carnet", "2026-11-01")]);
    expect(regrouper([ev("situations", "2026-11-10"), ev("bibliotheque", "2026-11-10")], MAINTENANT)).toHaveLength(1);
  });

  it("date future et mois précédent absents ; 5 au plus (moins la lettre du jour)", () => {
    expect(regrouper([ev("situations", "2026-11-14"), ev("bibliotheque", "2026-10-30")], MAINTENANT)).toEqual([]);
    expect(regrouper([ev("carnet", "2026-11-01"), ev("situations", "2026-11-05"), ev("bibliotheque", "2026-11-09")], MAINTENANT, 2)).toHaveLength(2);
  });

  it("carnet du mois : publié le 1er, lien vers le carnet ; mois sans carnet : rien", () => {
    // Jest n'a pas `require.context` : les carnets réels sont passés comme fixtures.
    const carnets = parseCarnets([carnetOctobre, carnetNovembre]);
    expect(nouveauteCarnet(carnets, MAINTENANT)).toEqual({ genre: "carnet", le: "2026-11-01", href: "/carnet/2026-11" });
    expect(nouveauteCarnet(carnets, new Date("2026-12-10T10:00:00Z"))).toBeNull();
  });

  it("fiches neuves : `publieLe` requis ; humour noir = « Bibliothèque » sans nom de sujet ; jamais un bonus ; reprise d'une lettre non envoyée absente", async () => {
    const vides = Object.fromEntries(Object.keys(FICHIERS_ESPACE).map((k) => [k, []])) as unknown as SourcesFiches["fiches"];
    const sources: SourcesFiches = {
      fiches: {
        ...vides,
        situations: [{ ...situationPoele, publieLe: "2026-11-12" }, { ...situationReprise, id: "reprise-neuve", publieLe: "2026-11-11" }],
        "humour-noir": [{ ...humourNoir[0], publieLe: "2026-11-10" }, humourNoir[1]],
      },
      bonus: [{ ...bonusCap2, publieLe: "2026-11-13" }],
    };
    const chargeurs = creerChargeurs(sources);
    const sansLettre = await nouveautesFiches("u1", MAINTENANT, mockDb as never, chargeurs);
    expect(sansLettre).toEqual([
      { genre: "situations", le: "2026-11-12", href: "/mon-espace/quoi-repondre" },
      { genre: "bibliotheque", le: "2026-11-10", href: "/mon-espace/bibliotheque" },
    ]);
    const texte = JSON.stringify(sansLettre);
    for (const interdit of [humourNoir[0].titre, humourNoir[0].id, bonusCap2.id, bonusCap2.titre, "bonus"]) expect(texte).not.toContain(interdit);
    tables.newsletterIssue.push({ periodKey: "2026-W46", subject: "Après l'exposé", bodyText: "Salut.", sentAt: new Date("2026-11-12T07:00:00Z") });
    // Lettre W46 envoyée : la situation qui la reprend devient une nouveauté (avant : absente).
    expect((await nouveautesFiches("u1", MAINTENANT, mockDb as never, chargeurs)).filter((n) => n.genre === "situations")).toHaveLength(2);
  });

  it("lettre : le seul jour de son envoi ; à date future, absente ; la veille, plus dans la cloche", async () => {
    tables.newsletterIssue.push({ periodKey: "2026-W46", subject: "Objet", bodyText: "Salut.", sentAt: new Date("2026-11-12T07:00:00Z") });
    tables.newsletterIssue.push({ periodKey: "2026-W47", subject: "Futur", bodyText: "Pas encore.", sentAt: new Date("2026-11-13T15:00:00Z") });
    expect(await lettreDuJour(new Date("2026-11-12T20:00:00Z"), mockDb as never)).toEqual({ numero: "2026-W46", titre: "La lettre du jeudi 12 novembre", href: "/mon-espace/lettres/2026-W46" });
    expect(await lettreDuJour(MAINTENANT, mockDb as never)).toBeNull(); // W46 d'hier ; W47 à 16 h, pas encore partie
    expect((await lettreDuJour(new Date("2026-11-13T16:00:00Z"), mockDb as never))?.numero).toBe("2026-W47");
  });
});

describe("GET /api/espace/cloche", () => {
  it("nombre du nom = réponses non lues (jamais les lignes) ; une ligne par fil non ouvert ; lecture seule ; aucun texte ; aucun e-mail", async () => {
    fil("filnonlu1xxx", { reponduLe: "2026-11-11T09:00:00Z" });
    fil("filnonlu2xxx", { reponduLe: "2026-11-12T09:00:00Z" });
    fil("fillu000xxxx", { reponduLe: "2026-11-10T09:00:00Z", ouvertLe: "2026-11-10T12:00:00Z" });
    fil("filattentexx");
    tables.newsletterIssue.push({ periodKey: "2026-W46", subject: "Objet", bodyText: "Salut.", sentAt: new Date("2026-11-13T07:00:00Z") });
    const r = await cloche();
    expect(r.status).toBe(200);
    expect(r.headers.get("cache-control")).toBe("private, no-store");
    const corps = await r.json();
    expect(corps.nonLues).toBe(2);
    expect(corps.reponses.map((l: { id: string }) => l.id)).toEqual(["filnonlu2xxx", "filnonlu1xxx"]);
    expect(corps.reponses[0]).toEqual({ id: "filnonlu2xxx", type: "SITUATION", reponduLe: "2026-11-12T09:00:00.000Z", href: "/mon-espace/questions/filnonlu2xxx" });
    expect(corps.lettre).toEqual({ numero: "2026-W46", titre: "La lettre du vendredi 13 novembre", href: "/mon-espace/lettres/2026-W46" });
    const lignes = corps.reponses.length + corps.nouveautes.length + 1;
    expect(lignes).toBeGreaterThan(corps.nonLues);
    const texte = JSON.stringify(corps);
    expect(texte).not.toContain(SECRET);
    expect(texte).not.toContain("Réponse de l'équipe");
    expect(texte).not.toMatch(/bonus/i);
    expect(ecritures).not.toHaveBeenCalled(); // ouvrir le panneau ne lit rien
    expect(resend).not.toHaveBeenCalled(); // lot D8 : aucun e-mail
  });

  it("un fil ouvert sort du panneau et du nombre ; le fil d'un autre compte n'y est jamais", async () => {
    fil("filnonlu1xxx", { reponduLe: "2026-11-11T09:00:00Z", ouvertLe: "2026-11-12T08:00:00Z" });
    fil("filautrexxxx", { reponduLe: "2026-11-11T09:00:00Z", userId: "u2" });
    const corps = await (await cloche()).json();
    expect(corps).toMatchObject({ nonLues: 0, reponses: [] });
  });

  it("fermé : 404 avant toute lecture ; sans session 401 ; autre méthode 405 ouvert", async () => {
    ouvert.__CLOCHE_OUVERT__ = false;
    expect((await cloche()).status).toBe(404);
    expect(getServerSession).not.toHaveBeenCalled();
    expect(equipeFil.findMany).not.toHaveBeenCalled();
    expect((await clochePost()).status).toBe(404);
    ouvert.__CLOCHE_OUVERT__ = true;
    expect((await clochePost()).status).toBe(405);
    getServerSession.mockResolvedValue(null);
    expect((await cloche()).status).toBe(401);
  });
});

describe("« Retirer de mon historique » : effacement définitif (décision du 13/11)", () => {
  it("le fil ET ses messages sont SUPPRIMÉS (deleteMany), jamais marqués ; plus rien dans l'API ni dans l'export", async () => {
    fil("filretirexxx", { reponduLe: "2026-11-11T09:00:00Z" });
    fil("filgardexxxx", { reponduLe: "2026-11-12T09:00:00Z" });
    expect((await retirer(new Request("http://localhost"), p("filretirexxx"))).status).toBe(200);
    expect(ecritures.mock.calls.map((c) => c[0])).toEqual(["equipeMessage.deleteMany", "equipeFil.deleteMany"]);
    expect(equipeFil.updateMany).not.toHaveBeenCalled();
    expect(equipeMessage.updateMany).not.toHaveBeenCalled();
    expect(tables.equipeFil.map((f) => f.id)).toEqual(["filgardexxxx"]);
    expect(tables.equipeMessage.filter((m) => m.filId === "filretirexxx")).toEqual([]);
    expect((await lireUn(new Request("http://localhost"), p("filretirexxx"))).status).toBe(404);
    const liste = JSON.stringify(await (await lister()).json());
    expect(liste).not.toContain("filretirexxx");
    expect(JSON.stringify(await (await cloche()).json())).not.toContain("filretirexxx");
    const exportCompte = await collecterDonneesParcours("u1");
    expect(exportCompte.questions).toHaveLength(1);
    expect(JSON.stringify(exportCompte.questions)).not.toContain("2026-11-11T09:00:00");
  });

  it("schéma et migration : aucune colonne de suppression logique ; messages en cascade du fil", () => {
    const schema = readFileSync(join(SRC, "../prisma/schema.prisma"), "utf8");
    const modele = (nom: string) => schema.slice(schema.indexOf(`model ${nom} {`), schema.indexOf("}", schema.indexOf(`model ${nom} {`)));
    for (const nom of ["EquipeFil", "EquipeMessage"]) expect(modele(nom)).not.toMatch(/supprim|deleted|retir|archiv|masqu|cache[A-Z]|visible/i);
    expect(modele("EquipeMessage")).toMatch(/fil\s+EquipeFil\s+@relation\(fields: \[filId\], references: \[id\], onDelete: Cascade\)/);
    const sql = readFileSync(join(SRC, "../prisma/migrations/25_espace_questions_s24/migration.sql"), "utf8");
    expect(sql).toMatch(/FOREIGN KEY \("filId"\) REFERENCES "EquipeFil"\("id"\) ON DELETE CASCADE/);
  });

  it("le fil d'un autre compte : 404, aucun message touché", async () => {
    fil("filautrexxxx", { reponduLe: "2026-11-11T09:00:00Z", userId: "u2" });
    expect((await retirer(new Request("http://localhost"), p("filautrexxxx"))).status).toBe(404);
    expect(tables.equipeMessage.filter((m) => m.filId === "filautrexxxx")).toHaveLength(2);
  });
});

describe("e-mail de réponse validé (13/11), muet tant que l'espace est fermé", () => {
  const envoyer = jest.fn(async () => undefined);
  const admin = (corps: unknown) => new NextRequest("http://localhost/api/admin/questions-equipe", { method: "POST", headers: { authorization: "Bearer mdp-admin" }, body: JSON.stringify(corps) });

  it("valeurs livrées : texte validé, interrupteur de l'espace fermé", () => {
    expect(jest.requireActual("@/config/textes/espace-questions").EMAIL_REPONSE_VALIDE).toBe(true);
    expect(jest.requireActual("@/config/espace-client").ESPACE_CLIENT_PUBLIE).toBe(false);
  });

  it("fermé : l'outil répond 404 sans rien lire ; `repondre` appelé seul n'envoie rien (Resend jamais appelé)", async () => {
    ouvert.__CLOCHE_OUVERT__ = false;
    fil("filattentexx");
    expect((await adminRepondre(admin({ filId: "filattentexx", reponse: "Une réponse" }))).status).toBe(404);
    expect(equipeFil.findUnique).not.toHaveBeenCalled();
    expect(await repondre("filattentexx", "Une réponse", envoyer)).toEqual({ email: "brouillon" });
    expect(envoyer).not.toHaveBeenCalled();
    expect(resend).not.toHaveBeenCalled();
  });

  it("ouvert : un seul e-mail, à l'adresse du compte lue en base, objet et corps validés", async () => {
    fil("filattentexx");
    expect((await adminRepondre(admin({ filId: "filattentexx", reponse: "Une réponse" }))).status).toBe(200);
    expect(resend).toHaveBeenCalledTimes(1);
    const [a, objet, texte] = resend.mock.calls[0] as [string, string, string];
    expect(a).toBe("abonne@example.com");
    expect(objet).toBe("L'équipe t'a répondu");
    expect(texte).toMatch(/^Une réponse\n\nL'Équipe Deviens Marrant\n\nTa question et cette réponse sont aussi dans ton espace : https?:\/\/\S+\/mon-espace\/questions$/);
  });
});

describe("textes du lot", () => {
  it("libellés validés mot pour mot ; zéro tiret cadratin, zéro émoji", () => {
    expect(TEXTES_CLOCHE).toEqual({
      groupes: { reponses: "L'équipe t'a répondu", nouveautes: "Nouveau ce mois-ci", lettre: "Nouvelle lettre" },
      lignes: { carnet: "Le carnet du mois", situations: "De nouvelles situations", bibliotheque: "Nouveau dans la Bibliothèque" },
      // Lot D9 : textes-manquants-import2-s24.md section 3 (reco B, clôture du 13/11).
      erreur: "On n'a pas pu afficher tes notifications. Repasse dans un moment.",
    });
    for (const f of ["config/textes/espace-cloche.ts", "config/textes/espace-questions.ts"]) {
      const code = readFileSync(join(SRC, f), "utf8");
      expect([f, /—/.test(code)]).toEqual([f, false]);
      expect([f, /\p{Extended_Pictographic}/u.test(code)]).toEqual([f, false]);
    }
  });
});
