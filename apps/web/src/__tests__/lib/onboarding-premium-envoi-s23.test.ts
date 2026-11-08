/**
 * @jest-environment node
 *
 * s23 onboarding Premium : envoi d'E1 (J5), E1b (J12) et E2 (J21), interrupteur, jours, unicité, arrêts (@legal C1 à C8).
 * Données de novembre 2026 (souscription le lundi 9, J5 = samedi 14, J12 = samedi 21, J19 = samedi 28,
 * J21 = lundi 30). Aucun envoi réel.
 */
import { runOnboardingPremium, type OnboardingDb, type UserOnboarding } from "@/lib/onboarding/envoi-onboarding";
import { arreterOnboarding, cleJournal, noterAncreJ0, noterFinAcces, signerJetonOnboarding, verifierJetonOnboarding, type JournalDb } from "@/lib/onboarding/journal-onboarding";
import { ONBOARDING_PREMIUM_OUVERT } from "@/config/onboarding-premium";
import { PARCOURS_SRC, normalizeParcoursSrc } from "@/lib/parcours-tracking";

const SECRET = "s".repeat(40);
const J0 = new Date("2026-11-09T09:00:00Z"); // lundi 9 novembre 2026, 10 h à Paris
const a9h = (jour: string) => new Date(`${jour}T08:15:00Z`); // 9 h 15 à Paris (heure d'hiver)

interface Row { eventId: string; eventType: string; receivedAt: Date; processedAt: Date }

function user(over: Partial<UserOnboarding> = {}): UserOnboarding {
  return {
    id: "u1", email: "yanis@exemple.fr", name: "Yanis Martin", plan: "PREMIUM", emailOptOut: false,
    subscription: { status: "ACTIVE", cancelAtPeriodEnd: false }, parcoursReminder: null, ...over,
  };
}

function fake(opts: { u?: UserOnboarding | null; journal?: Row[]; retractations?: number; lettresDuJour?: number; lettresEnAttente?: number; progress?: unknown[] } = {}) {
  const rows = new Map<string, Row>();
  const ajouter = (r: Row) => rows.set(r.eventId, r);
  ajouter({ eventId: cleJournal("E0", "u1"), eventType: "email.onboarding-premium.E0.envoye", receivedAt: J0, processedAt: J0 });
  (opts.journal ?? []).forEach(ajouter);
  const appels: string[] = [];
  const create = jest.fn(async ({ data }: { data: Row & { provider: string } }) => {
    appels.push(`create:${data.eventId}:${data.eventType}`);
    if (rows.has(data.eventId)) throw Object.assign(new Error("unique"), { code: "P2002" });
    ajouter(data);
  });
  const db = {
    webhookEvent: {
      create,
      upsert: jest.fn(async ({ where, create: c, update }: { where: { eventId: string }; create: Row; update: Partial<Row> }) => {
        const e = rows.get(where.eventId);
        ajouter(e ? { ...e, ...update } : c);
      }),
      update: jest.fn(async ({ where, data }: { where: { eventId: string }; data: Partial<Row> }) => {
        appels.push(`update:${where.eventId}:${data.eventType}`);
        ajouter({ ...(rows.get(where.eventId) as Row), ...data });
      }),
      deleteMany: jest.fn(async ({ where }: { where: { eventId: string } }) => ({ count: rows.delete(where.eventId) ? 1 : 0 })),
      findMany: jest.fn(async ({ where }: { where: { eventId: { startsWith?: string; in?: string[] }; receivedAt?: { gte: Date } } }) =>
        [...rows.values()].filter((r) =>
          where.eventId.startsWith ? r.eventId.startsWith(where.eventId.startsWith) && (!where.receivedAt || r.receivedAt >= where.receivedAt.gte) : (where.eventId.in ?? []).includes(r.eventId),
        ),
      ),
    },
    user: { findUnique: jest.fn(async () => (opts.u === undefined ? user() : opts.u)) },
    retractationRequest: { count: jest.fn(async () => opts.retractations ?? 0) },
    newsletterSend: { count: jest.fn(async () => opts.lettresDuJour ?? 0) },
    newsletterIssue: { findMany: jest.fn(async () => Array.from({ length: opts.lettresEnAttente ?? 0 }, (_, i) => ({ id: `n${i}` }))) },
    userPathProgress: { findMany: jest.fn(async () => opts.progress ?? []) },
  };
  const envois: Array<{ to: string; subject: string; text: string; headers: Record<string, string> }> = [];
  const sendEmail = jest.fn(async (to: string, subject: string, text: string, headers: Record<string, string>) => {
    appels.push("send");
    envois.push({ to, subject, text, headers });
  });
  const run = (now: Date, ouvert = true, questionEquipeOuverte = true) =>
    runOnboardingPremium(now, { db: db as unknown as OnboardingDb, sendEmail, baseUrl: "https://deviens-marrant.fr", carnet: true, ouvert, questionEquipeOuverte });
  return { db, rows, envois, appels, sendEmail, run };
}

beforeEach(() => {
  process.env.UNSUBSCRIBE_HMAC_SECRET = SECRET;
});

describe("interrupteur", () => {
  it("ouvert dans le code livré (ouverture du 08/11/2026) ; sans option `ouvert`, la tâche suit l'interrupteur", async () => {
    expect(ONBOARDING_PREMIUM_OUVERT).toBe(true);
    const f = fake();
    const r = await runOnboardingPremium(a9h("2026-11-14"), { db: f.db as unknown as OnboardingDb, sendEmail: f.sendEmail, baseUrl: "https://deviens-marrant.fr", carnet: true, questionEquipeOuverte: true });
    expect(r.ferme).toBe(false);
    expect(r.envoyes).toBe(1);
  });
  it("seules les souscriptions postérieures à l'ouverture : sans ancre J0 (abonné antérieur), rien n'est lu, écrit ni envoyé", async () => {
    const f = fake();
    f.rows.clear(); // abonné Premium actif depuis avant l'ouverture : aucun bienvenue s23, donc aucune ancre E0
    for (const jour of ["2026-11-14", "2026-11-21", "2026-11-30"]) {
      const r = await f.run(a9h(jour));
      expect(r.ancres).toBe(0);
    }
    expect(f.db.webhookEvent.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ eventId: { startsWith: "onboarding-premium:E0:" } }) }));
    expect(f.db.user.findUnique).not.toHaveBeenCalled();
    expect(f.db.webhookEvent.create).not.toHaveBeenCalled();
    expect(f.sendEmail).not.toHaveBeenCalled();
  });
  it("fermé : rien n'est lu, écrit ni envoyé", async () => {
    const f = fake();
    const r = await f.run(a9h("2026-11-14"), false);
    expect(r.ferme).toBe(true);
    expect(f.db.webhookEvent.findMany).not.toHaveBeenCalled();
    expect(f.db.webhookEvent.create).not.toHaveBeenCalled();
    expect(f.sendEmail).not.toHaveBeenCalled();
  });
  it("secret du lien d'arrêt absent : rien ne part", async () => {
    delete process.env.UNSUBSCRIBE_HMAC_SECRET;
    const f = fake();
    expect((await f.run(a9h("2026-11-14"))).secretAbsent).toBe(true);
    expect(f.sendEmail).not.toHaveBeenCalled();
  });
});

describe("jours d'envoi", () => {
  it("rien avant J5 ; E1 le samedi 14 novembre, réservé AVANT l'envoi, replyTo géré par l'appelant", async () => {
    const f = fake();
    await f.run(a9h("2026-11-13"));
    expect(f.sendEmail).not.toHaveBeenCalled();
    const r = await f.run(a9h("2026-11-14"));
    expect(r.envoyes).toBe(1);
    expect(f.envois[0].subject).toBe("Une question ? Voilà ce qu’on fait ici");
    expect(f.appels.slice(0, 3)).toEqual([`create:${cleJournal("E1", "u1")}:email.onboarding-premium.E1.reserve`, "send", `update:${cleJournal("E1", "u1")}:email.onboarding-premium.E1.envoye:generale`]);
    const lien = f.envois[0].text.match(/sans connexion\) : (\S+)/)?.[1] as string;
    expect(lien).toMatch(/^https:\/\/deviens-marrant\.fr\/api\/onboarding-premium\/arret\?token=/);
    expect(f.envois[0].headers).toEqual({ "List-Unsubscribe": `<${lien}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" });
    expect(verifierJetonOnboarding(decodeURIComponent(lien.split("token=")[1]))).toBe("u1");
  });
  it("unicité : un second passage le même jour ou le lendemain ne renvoie rien", async () => {
    const f = fake();
    await f.run(a9h("2026-11-14"));
    await f.run(a9h("2026-11-14"));
    await f.run(a9h("2026-11-15"));
    expect(f.sendEmail).toHaveBeenCalledTimes(1);
  });
  it("jamais le jeudi : J5 tombe le jeudi 12, part le vendredi 13", async () => {
    const f = fake();
    f.rows.set(cleJournal("E0", "u1"), { eventId: cleJournal("E0", "u1"), eventType: "e", receivedAt: new Date("2026-11-07T10:00:00Z"), processedAt: J0 });
    expect((await f.run(a9h("2026-11-12"))).reportes).toBe(1);
    expect(f.sendEmail).not.toHaveBeenCalled();
    await f.run(a9h("2026-11-13"));
    expect(f.sendEmail).toHaveBeenCalledTimes(1);
  });
  it("rappel de parcours le dimanche : ni samedi, ni dimanche, ni lundi ; part le mardi 17", async () => {
    const f = fake({ u: user({ parcoursReminder: { enabled: true, weekday: 7 } }) });
    for (const j of ["2026-11-14", "2026-11-15", "2026-11-16"]) await f.run(a9h(j));
    expect(f.sendEmail).not.toHaveBeenCalled();
    await f.run(a9h("2026-11-17"));
    expect(f.sendEmail).toHaveBeenCalledTimes(1);
  });
  it("lettre partie ce jour ou lettre de la semaine encore due : glisse", async () => {
    expect((await fake({ lettresDuJour: 1 }).run(a9h("2026-11-14"))).reportes).toBe(1);
    expect((await fake({ lettresEnAttente: 1 }).run(a9h("2026-11-14"))).reportes).toBe(1);
  });
  it("aucun jour libre sous 7 jours : E1 non envoyé, journalisé (E1b part à J12, son jour)", async () => {
    const f = fake();
    const r = await f.run(a9h("2026-11-21"));
    expect(r.sautes).toBe(1);
    expect(f.rows.get(cleJournal("E1", "u1"))?.eventType).toBe("email.onboarding-premium.E1.saute:aucun-jour-libre");
    expect(f.envois.map((e) => e.subject)).toEqual(["Une situation où la répartie t’a manqué ?"]);
  });
  it("E2 le lundi 30 novembre, objet de l'étalon 4 A", async () => {
    const f = fake({ journal: [{ eventId: cleJournal("E1", "u1"), eventType: "x", receivedAt: J0, processedAt: J0 }] });
    await f.run(a9h("2026-11-30"));
    expect(f.envois[0].subject).toBe("Trois semaines : qu’est-ce qui manque ?");
  });
  it("échec d'envoi : réservation libérée, nouvel essai au passage suivant", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const f = fake();
    f.sendEmail.mockRejectedValueOnce(new Error("Resend 500"));
    expect((await f.run(a9h("2026-11-14"))).echecs).toBe(1);
    expect(f.rows.has(cleJournal("E1", "u1"))).toBe(false);
    expect((await f.run(a9h("2026-11-14"))).envoyes).toBe(1);
  });
});

const E1_PARTI = [{ eventId: cleJournal("E1", "u1"), eventType: "x", receivedAt: J0, processedAt: J0 }];

describe("E1b (J12)", () => {
  it("rien avant J12 ; part le samedi 21 novembre, réservé avant l'envoi, version e1b, pied d'arrêt", async () => {
    const f = fake({ journal: E1_PARTI });
    await f.run(a9h("2026-11-20"));
    expect(f.sendEmail).not.toHaveBeenCalled();
    expect((await f.run(a9h("2026-11-21"))).envoyes).toBe(1);
    expect(f.envois[0].subject).toBe("Une situation où la répartie t’a manqué ?");
    expect(f.envois[0].text).toContain("Poser ma question : https://deviens-marrant.fr/profil\n");
    expect(f.appels).toEqual([`create:${cleJournal("E1b", "u1")}:email.onboarding-premium.E1b.reserve`, "send", `update:${cleJournal("E1b", "u1")}:email.onboarding-premium.E1b.envoye:e1b`]);
    expect(f.envois[0].headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    await f.run(a9h("2026-11-22"));
    expect(f.sendEmail).toHaveBeenCalledTimes(1);
  });
  it("glissement au plus tard J19 (samedi 28) ; J20 : non envoyé, journalisé", async () => {
    const tard = fake({ journal: E1_PARTI });
    expect((await tard.run(a9h("2026-11-28"))).envoyes).toBe(1);
    const occupe = fake({ journal: E1_PARTI, lettresDuJour: 1 });
    for (const j of ["2026-11-21", "2026-11-24", "2026-11-28"]) expect((await occupe.run(a9h(j))).reportes).toBe(1);
    expect((await occupe.run(a9h("2026-11-29"))).sautes).toBe(1);
    expect(occupe.rows.get(cleJournal("E1b", "u1"))?.eventType).toBe("email.onboarding-premium.E1b.saute:aucun-jour-libre");
    expect(occupe.sendEmail).not.toHaveBeenCalled();
  });
  it("« Ta question à l'équipe » fermé : non envoyé, journalisé", async () => {
    const f = fake({ journal: E1_PARTI });
    await f.run(a9h("2026-11-21"), true, false);
    expect(f.sendEmail).not.toHaveBeenCalled();
    expect(f.rows.get(cleJournal("E1b", "u1"))?.eventType).toBe("email.onboarding-premium.E1b.saute:question-equipe-fermee");
  });
  it("résilié programmé : jamais ; arrêts C3 et lien d'arrêt : rien", async () => {
    const resilie = fake({ journal: E1_PARTI, u: user({ subscription: { status: "ACTIVE", cancelAtPeriodEnd: true } }) });
    await noterFinAcces(resilie.db as unknown as JournalDb, "u1", new Date("2026-12-09T09:00:00Z"), J0);
    await resilie.run(a9h("2026-11-21"));
    expect(resilie.rows.get(cleJournal("E1b", "u1"))?.eventType).toBe("email.onboarding-premium.E1b.saute:resiliation-programmee");
    const oppose = fake({ journal: E1_PARTI, u: user({ emailOptOut: true }) });
    await oppose.run(a9h("2026-11-21"));
    expect(oppose.rows.get(cleJournal("E1b", "u1"))?.eventType).toBe("email.onboarding-premium.E1b.saute:opposition");
    const arrete = fake({ journal: E1_PARTI });
    await arreterOnboarding(arrete.db as unknown as JournalDb, "u1", J0);
    await arrete.run(a9h("2026-11-21"));
    for (const f of [resilie, oppose, arrete]) expect(f.sendEmail).not.toHaveBeenCalled();
  });
});

describe("arrêts (C3) et résiliation programmée (C1, C2)", () => {
  it.each([
    ["opposition", user({ emailOptOut: true })],
    ["fin-premium", user({ plan: "FREE" })],
    ["paiement-echoue", user({ subscription: { status: "PAST_DUE", cancelAtPeriodEnd: false } })],
    ["statut-canceled", user({ subscription: { status: "CANCELED", cancelAtPeriodEnd: false } })],
  ])("%s : rien ne part, journalisé", async (motif, u) => {
    const f = fake({ u });
    await f.run(a9h("2026-11-14"));
    expect(f.sendEmail).not.toHaveBeenCalled();
    expect(f.rows.get(cleJournal("E1", "u1"))?.eventType).toBe(`email.onboarding-premium.E1.saute:${motif}`);
  });
  it("rétractation exercée : rien ne part", async () => {
    const f = fake({ retractations: 1 });
    await f.run(a9h("2026-11-14"));
    expect(f.rows.get(cleJournal("E1", "u1"))?.eventType).toContain("saute:retractation");
  });
  it("clic sur le lien d'arrêt : plus rien, ni E1, ni E1b, ni E2", async () => {
    const f = fake();
    await arreterOnboarding(f.db as unknown as JournalDb, "u1", J0);
    await arreterOnboarding(f.db as unknown as JournalDb, "u1", J0); // idempotent
    await f.run(a9h("2026-11-14"));
    await f.run(a9h("2026-11-21"));
    await f.run(a9h("2026-11-30"));
    expect(f.sendEmail).not.toHaveBeenCalled();
  });
  it("compte supprimé : rien ne part, rien n'est écrit", async () => {
    const f = fake({ u: null });
    await f.run(a9h("2026-11-14"));
    expect(f.sendEmail).not.toHaveBeenCalled();
    expect(f.rows.has(cleJournal("E1", "u1"))).toBe(false);
  });
  it("résilié programmé : E1 avec la fin d'accès exacte (journal FIN), puis E2 jamais", async () => {
    const f = fake({ u: user({ subscription: { status: "ACTIVE", cancelAtPeriodEnd: true } }) });
    await noterFinAcces(f.db as unknown as JournalDb, "u1", new Date("2026-12-09T09:00:00Z"), J0);
    await f.run(a9h("2026-11-14"));
    expect(f.envois[0].text).toContain("Salut Yanis,\nTon accès reste ouvert jusqu’au 9 décembre 2026 : voici par où commencer.\n\n");
    expect(f.rows.get(cleJournal("E1", "u1"))?.eventType).toBe("email.onboarding-premium.E1.envoye:generale:resiliation-programmee");
    await f.run(a9h("2026-11-30"));
    expect(f.sendEmail).toHaveBeenCalledTimes(1);
    expect(f.rows.get(cleJournal("E2", "u1"))?.eventType).toBe("email.onboarding-premium.E2.saute:resiliation-programmee");
  });
  it("résilié programmé sans fin d'accès exacte ou fin échue : rien", async () => {
    const sansFin = fake({ u: user({ subscription: { status: "TRIALING", cancelAtPeriodEnd: true } }) });
    await sansFin.run(a9h("2026-11-14"));
    expect(sansFin.rows.get(cleJournal("E1", "u1"))?.eventType).toContain("saute:fin-acces-inconnue");
    const echue = fake({ u: user({ subscription: { status: "ACTIVE", cancelAtPeriodEnd: true } }) });
    await noterFinAcces(echue.db as unknown as JournalDb, "u1", new Date("2026-11-13T09:00:00Z"), J0);
    await echue.run(a9h("2026-11-14"));
    expect(echue.rows.get(cleJournal("E1", "u1"))?.eventType).toContain("saute:fin-acces-echue");
    expect(sansFin.sendEmail).not.toHaveBeenCalled();
    expect(echue.sendEmail).not.toHaveBeenCalled();
  });
  it("version PARCOURS : prochaine étape et lien src=onboarding-premium", async () => {
    const f = fake({ progress: [{ completedSteps: [1], learningPath: { slug: "repartie", title: "Répartie", steps: [{ order: 1 }, { order: 2 }, { order: 3 }, { order: 4 }] } }] });
    await f.run(a9h("2026-11-14"));
    expect(f.envois[0].text).toContain("Reprendre mon parcours : https://deviens-marrant.fr/parcours/repartie?src=onboarding-premium");
    expect(f.rows.get(cleJournal("E1", "u1"))?.eventType).toBe("email.onboarding-premium.E1.envoye:parcours");
  });
});

describe("journal et jeton", () => {
  it("ancre J0 jamais déplacée ; jeton propre à l'onboarding", async () => {
    const f = fake();
    expect(await noterAncreJ0(f.db as unknown as JournalDb, "u1", new Date("2026-11-20T00:00:00Z"), J0)).toBe(false);
    expect(f.rows.get(cleJournal("E0", "u1"))?.receivedAt).toEqual(J0);
    const t = signerJetonOnboarding("u1") as string;
    expect(verifierJetonOnboarding(t)).toBe("u1");
    expect(verifierJetonOnboarding(`${t.split(".")[0]}.${"0".repeat(32)}`)).toBeNull();
  });
  it("src=onboarding-premium dans la liste fermée PARCOURS_SRC", () => {
    expect(PARCOURS_SRC).toContain("onboarding-premium");
    expect(normalizeParcoursSrc("onboarding-premium")).toBe("onboarding-premium");
  });
});
