/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21, US-H7, H6-9) : admin (liste sans jeton, arrêt, proposition
 * unique, aperçu), section du rapport du lundi, tâches du planificateur, filtre Umami.
 */
let mockInscriptions = false;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_HEBDO_INSCRIPTIONS_OUVERTES() {
    return mockInscriptions;
  },
}));

const JETON = "secret-jeton".padEnd(43, "z");
type Pref = { userId: string; enabled: boolean; proposedAt: Date | null };
const mockPrefs: Pref[] = [];
const mockUsers: Array<Record<string, unknown>> = [];
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(async () =>
        // La base simulée renverrait le jeton si on le demandait : la route ne doit pas le demander.
        mockUsers.map((u) => ({ ...u, premiumLetter: { enabled: true, activatedAt: new Date(), activationOrigin: "profil", stoppedAt: null, stopOrigin: null, proposedAt: null } })),
      ),
      count: jest.fn(async () => mockUsers.length),
      findUnique: jest.fn(async ({ where }: { where: { id: string } }) => {
        const u = mockUsers.find((x) => x.id === where.id);
        if (!u) return null;
        const pref = mockPrefs.find((p) => p.userId === where.id) ?? null;
        return { ...u, premiumLetter: pref };
      }),
    },
    premiumLetterPreference: {
      create: jest.fn(async ({ data }: { data: Pref }) => {
        if (mockPrefs.some((p) => p.userId === data.userId)) throw Object.assign(new Error("unique"), { code: "P2002" });
        mockPrefs.push({ ...data });
        return data;
      }),
      updateMany: jest.fn(async ({ where, data }: { where: { userId: string; proposedAt?: null; enabled?: boolean }; data: Partial<Pref> }) => {
        const l = mockPrefs.filter((p) => p.userId === where.userId && (where.proposedAt === undefined || p.proposedAt === null) && (where.enabled === undefined || p.enabled === where.enabled));
        for (const p of l) Object.assign(p, data);
        return { count: l.length };
      }),
      count: jest.fn(async ({ where }: { where: { userId: string } }) => mockPrefs.filter((p) => p.userId === where.userId).length),
    },
    newsletterIssue: { findFirst: jest.fn(async () => null) },
  },
}));

import { readFileSync } from "fs";
import { join } from "path";
import { NextRequest } from "next/server";
import { GET as getAdmin } from "@/app/api/admin/lettre-premium/route";
import { POST as postArretAdmin } from "@/app/api/admin/lettre-premium/arret/route";
import { POST as postProposition } from "@/app/api/admin/lettre-premium/proposition/route";
import { listerComptesHebdo, proposerLettreHebdo, envoyerApercuHebdo } from "@/lib/admin/lettre-hebdo-comptes";
import { buildLettreHebdoSectionHtml, chargerLettreHebdoResume } from "@/lib/analytics/weekly-lettre-hebdo";
import { buildUmamiBeforeSendScript } from "@/lib/umami-before-send";

const racine = join(__dirname, "..", "..", "..");
const lire = (chemin: string) => readFileSync(join(racine, chemin), "utf8");
const AUTH = { authorization: "Bearer mdp-admin" };
const NOW = new Date("2026-11-09T10:00:00Z");

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "mdp-admin";
  mockInscriptions = false;
  mockPrefs.length = 0;
  mockUsers.length = 0;
  mockUsers.push({ id: "u1", email: "sophie@x.fr", plan: "PREMIUM", emailOptOut: false });
});

describe("Routes admin", () => {
  it("H7-6 : sans jeton admin 401 ; corps invalide 400", async () => {
    expect((await getAdmin(new NextRequest("http://localhost/api/admin/lettre-premium"))).status).toBe(401);
    expect((await postArretAdmin(new NextRequest("http://localhost/api/admin/lettre-premium/arret", { method: "POST" }))).status).toBe(401);
    const res = await postArretAdmin(new NextRequest("http://localhost/api/admin/lettre-premium/arret", { method: "POST", headers: AUTH, body: JSON.stringify({ autre: 1 }) }));
    expect(res.status).toBe(400);
  });

  it("H7-3 : la liste ne demande ni ne renvoie jamais le jeton d'arrêt", async () => {
    const { prisma } = jest.requireMock("@/lib/prisma") as { prisma: { user: { findMany: jest.Mock } } };
    await listerComptesHebdo({ page: 1, limit: 25 });
    const select = prisma.user.findMany.mock.calls[0][0].select;
    expect(JSON.stringify(select)).not.toMatch(/token|Token/);
    const res = await getAdmin(new NextRequest("http://localhost/api/admin/lettre-premium?statut=actives", { headers: AUTH }));
    expect(await res.text()).not.toContain(JETON);
  });

  it("H7-4 : « Arrêter » pose stopOrigin admin ; compte sans ligne 404", async () => {
    mockPrefs.push({ userId: "u1", enabled: true, proposedAt: null });
    const ok = await postArretAdmin(new NextRequest("http://localhost/api/admin/lettre-premium/arret", { method: "POST", headers: AUTH, body: JSON.stringify({ userId: "u1" }) }));
    expect(ok.status).toBe(200);
    expect(mockPrefs[0]).toMatchObject({ enabled: false, stopOrigin: "admin" });
    const absent = await postArretAdmin(new NextRequest("http://localhost/api/admin/lettre-premium/arret", { method: "POST", headers: AUTH, body: JSON.stringify({ userId: "u9" }) }));
    expect(absent.status).toBe(404);
  });

  it("proposition : 404 tant que les inscriptions (et les textes CGU) ne sont pas ouverts", async () => {
    const res = await postProposition(new NextRequest("http://localhost/api/admin/lettre-premium/proposition", { method: "POST", headers: AUTH, body: JSON.stringify({ userIds: ["u1"] }) }));
    expect(res.status).toBe(404);
  });
});

describe("Proposition unique aux abonnés existants (avis @legal §6.5)", () => {
  const deps = (envoyer: jest.Mock) => ({ envoyer, baseUrl: "https://deviens-marrant.fr", now: NOW, inscriptionsOuvertes: true });

  it("H6-9 : un seul e-mail, proposedAt posé ; la seconde est refusée ; le silence n'active rien", async () => {
    const envoyer = jest.fn().mockResolvedValue(undefined);
    expect(await proposerLettreHebdo("u1", deps(envoyer))).toEqual({ statut: "envoyee" });
    expect(mockPrefs[0]).toMatchObject({ enabled: false, proposedAt: NOW });
    expect(await proposerLettreHebdo("u1", deps(envoyer))).toEqual({ statut: "deja-proposee" });
    expect(envoyer).toHaveBeenCalledTimes(1);
    const [, sujet, texte] = envoyer.mock.calls[0];
    expect(sujet).toBe("La lettre de la semaine est dans ton abonnement");
    expect(texte).toContain("https://deviens-marrant.fr/profil#lettre");
    expect(texte).not.toMatch(/€|\/abonnement/);
  });

  it("jamais à un compte en opposition globale, ni sans Premium ; inscriptions fermées : rien", async () => {
    const envoyer = jest.fn();
    mockUsers[0].emailOptOut = true;
    expect(await proposerLettreHebdo("u1", deps(envoyer))).toEqual({ statut: "opposition" });
    mockUsers[0].emailOptOut = false;
    mockUsers[0].plan = "FREE";
    expect(await proposerLettreHebdo("u1", deps(envoyer))).toEqual({ statut: "non-premium" });
    expect(await proposerLettreHebdo("u1", { ...deps(envoyer), inscriptionsOuvertes: false })).toEqual({ statut: "fermee" });
    expect(envoyer).not.toHaveBeenCalled();
  });

  it("envoi en échec : proposedAt remis à vide (la proposition reste possible)", async () => {
    const envoyer = jest.fn().mockRejectedValue(new Error("Resend"));
    expect(await proposerLettreHebdo("u1", deps(envoyer))).toEqual({ statut: "echec" });
    expect(mockPrefs[0].proposedAt).toBeNull();
  });

  it("H7-5 : aperçu sans numéro préparé = aucun ; jamais envoyé à un abonné", async () => {
    const envoyer = jest.fn();
    expect(await envoyerApercuHebdo({ envoyer, baseUrl: "https://deviens-marrant.fr", now: NOW, adresseAdmin: "alex@deviens-marrant.fr" })).toBe("aucun");
    expect(envoyer).not.toHaveBeenCalled();
  });
});

describe("Rapport du lundi (H7-7)", () => {
  const ferme = { inscriptions: false, envois: false, promesse: false };

  it("interrupteurs fermés : une ligne, aucune lecture en base", async () => {
    const r = await chargerLettreHebdoResume(null, NOW, [], ferme);
    expect(r).toEqual({ etat: "ferme", interrupteurs: ferme });
    expect(buildLettreHebdoSectionHtml(r)).toContain("inscriptions fermées, envois fermés, promesse masquée");
  });

  it("section complète : actives, Premium sans hebdo, arrêts par origine, dernier jeudi, prochain numéro, alertes en tête", () => {
    const html = buildLettreHebdoSectionHtml({
      etat: "ok",
      interrupteurs: { inscriptions: true, envois: true, promesse: false },
      premiumActifs: 3,
      actives: 2,
      premiumSansHebdo: 1,
      arreteesParOrigine: { "lien-email": 1 },
      comptesTest: 1,
      semaine: { activations: { paiement: 1, profil: 1 }, arrets: {} },
      dernier: { semaine: "2026-W46", objet: "Le vendeur dans ton dos", statut: "ENVOYE", envoiPrevu: "2026-11-12T07:00:00.000Z", envoyes: 3, echecs: 0, enCours: 0, dontTest: 1 },
      prochain: { semaine: "2026-W47", objet: "Le voisin en bonnet", statut: "VALIDE", envoiPrevu: "2026-11-19T07:00:00.000Z" },
      stock: 3,
      alerteStock: true,
      nonEnvoyes: [],
      retard: "2026-W47",
    });
    expect(html).toContain("Premium sans la lettre (mensuelle à la place)");
    expect(html).toContain("1 lien-email");
    expect(html).toContain("3 envoyés, 0 échecs, dont 1 compte(s) de test");
    expect(html).toContain("2026-W47, « Le voisin en bonnet »");
    expect(html.indexOf("Stock sous 4")).toBeLessThan(html.indexOf("<table"));
    expect(html.indexOf("validé mais pas parti")).toBeLessThan(html.indexOf("<table"));
  });

  it("le rapport du lundi assemble la section après celle de la mensuelle", () => {
    expect(lire("src/lib/analytics/weekly-visits-job.ts")).toContain("${buildLettreSectionHtml(lettre)}${buildLettreHebdoSectionHtml(lettreHebdo)}");
  });
});

describe("Planificateur et démarrage", () => {
  it("runAllJobs lance la tâche du jeudi et l'entretien de l'hebdo ; la tâche suit LETTRE_HEBDO_ENVOIS_OUVERTS", () => {
    const jobs = lire("src/lib/scheduler/jobs.ts");
    const corps = jobs.slice(jobs.indexOf("const runAllJobs = async"), jobs.indexOf("};", jobs.indexOf("const runAllJobs = async")));
    expect(corps).toContain("await runLettreHebdoJob();");
    expect(corps).toContain("await runLettreHebdoEntretienJob();");
    const tache = jobs.slice(jobs.indexOf("const runLettreHebdoJob"), jobs.indexOf("const runLettreHebdoEntretienJob"));
    expect(tache).toContain("if (!LETTRE_HEBDO_ENVOIS_OUVERTS) return;");
    expect(tache).toContain("tryAcquireLock(lockKey");
    expect(lire("src/lib/startup-tasks.ts")).toContain("await applyLettreHebdoNumerosTask();");
  });

  it("Umami : le jeton de la page d'arrêt (`token`) n'est jamais envoyé", () => {
    const script = buildUmamiBeforeSendScript("/blog/apercu");
    const window = { location: { pathname: "/lettre/premium/arreter", search: "" } } as unknown as Record<string, unknown>;
    const filtre = new Function("window", "location", "localStorage", `${script}; return window.marrantUmamiBeforeSend;`)(
      window,
      window.location,
      { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    ) as (t: string, p: { url: string; referrer: string }) => { url: string; referrer: string };
    const p = filtre("pageview", { url: `/lettre/premium/arreter?token=${JETON}`, referrer: "" });
    expect(p.url).toBe("/lettre/premium/arreter");
  });
});
