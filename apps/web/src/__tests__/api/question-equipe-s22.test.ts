/**
 * @jest-environment node
 *
 * POST /api/question-equipe (s22, « Ta question à l'équipe », V1 ; avis @legal C5).
 *  - Interrupteur fermé : 404, rien n'est envoyé.
 *  - Session obligatoire (401) ; Premium vérifié en base (403) ; question vide ou trop
 *    longue (400) ; garde-fou 3 envois / 10 min et 10 / jour par compte (429 + Retry-After).
 *  - E-mail vers contact@, objet fixe, Reply-To = adresse du compte EN BASE même si le corps
 *    en fournit une ; en-têtes sans CR ni LF ; adresse piégée : rien n'est envoyé.
 *  - Le texte de la question n'apparaît dans aucun console.* (succès comme échec).
 */
let mockOuvert = true;
jest.mock("@/config/question-equipe", () => ({
  ...jest.requireActual("@/config/question-equipe"),
  get QUESTION_EQUIPE_OUVERTE() {
    return mockOuvert;
  },
}));

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

// Limiteur partagé remplacé par le compteur en mémoire du même module (même logique de fenêtre).
jest.mock("@/lib/rate-limit", () => {
  const reel = jest.requireActual("@/lib/rate-limit");
  return {
    ...reel,
    sharedRateLimit: jest.fn(async (scope: string, key: string, options: { maxRequests: number; windowMs: number }) => reel.rateLimit(`${scope}:${key}`, options)),
  };
});

const mockUsers = new Map<string, { email: string | null; plan: string }>();
jest.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: jest.fn(async ({ where }: { where: { id: string } }) => mockUsers.get(where.id) ?? null) } },
}));

const envoi = jest.fn(async (..._a: unknown[]) => undefined);
jest.mock("@/lib/email", () => ({ sendServiceTextEmail: (...a: unknown[]) => envoi(...a) }));

import { POST } from "@/app/api/question-equipe/route";
import { QUESTION_EQUIPE_EMAIL } from "@/config/textes/question-equipe-s22";

const QUESTION = "SECRET-QUESTION Mon beau-frère me chambre sur mon métier à chaque repas de famille.";
const T0 = new Date("2026-11-12T10:00:00Z").getTime();
let horloge = T0;
let compteur = 0;
let consoles: jest.SpyInstance[] = [];

function compte(plan = "PREMIUM", email: string | null = "abonne@x.fr"): string {
  const id = `u${++compteur}`;
  mockUsers.set(id, { email, plan });
  getServerSession.mockResolvedValue({ user: { id, email: "autre-session@x.fr" } });
  return id;
}
const requete = (corps: unknown, headers: Record<string, string> = {}) =>
  new Request("https://deviens-marrant.fr/api/question-equipe", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://deviens-marrant.fr", "sec-fetch-site": "same-origin", ...headers },
    body: typeof corps === "string" ? corps : JSON.stringify(corps),
  });
const poser = async (corps: unknown = { question: QUESTION }) => {
  const res = await POST(requete(corps));
  return { status: res.status, corps: (await res.json()) as Record<string, unknown>, headers: res.headers };
};
const journaux = () => consoles.flatMap((s) => s.mock.calls).map((c) => c.map((x: unknown) => (x instanceof Error ? `${x.message} ${x.stack}` : String(x))).join(" ")).join("\n");

beforeEach(() => {
  mockOuvert = true;
  envoi.mockReset();
  envoi.mockResolvedValue(undefined);
  getServerSession.mockReset();
  horloge += 48 * 3600_000; // chaque test dans sa propre journée
  jest.spyOn(Date, "now").mockImplementation(() => horloge);
  consoles = (["log", "info", "warn", "error", "debug"] as const).map((m) => jest.spyOn(console, m).mockImplementation(() => {}));
});
afterEach(() => {
  // Jamais le texte de la question dans un journal, quel que soit le cas testé.
  expect(journaux()).not.toContain("SECRET-QUESTION");
  expect(journaux()).not.toContain("beau-frère");
  jest.restoreAllMocks();
});

describe("Accès", () => {
  it("interrupteur fermé : 404, rien n'est envoyé", async () => {
    mockOuvert = false;
    compte();
    expect((await poser()).status).toBe(404);
    expect(envoi).not.toHaveBeenCalled();
  });

  it("sans session : 401", async () => {
    getServerSession.mockResolvedValue(null);
    expect(await poser()).toMatchObject({ status: 401, corps: { error: "session" } });
    expect(envoi).not.toHaveBeenCalled();
  });

  it("session d'un compte supprimé : 401", async () => {
    getServerSession.mockResolvedValue({ user: { id: "inconnu" } });
    expect((await poser()).status).toBe(401);
  });

  it("compte sans Premium (plan lu en base) : 403", async () => {
    compte("FREE");
    expect(await poser()).toMatchObject({ status: 403, corps: { error: "non-premium" } });
    expect(envoi).not.toHaveBeenCalled();
  });

  it("requête d'un autre site : 403, rien n'est envoyé", async () => {
    compte();
    const res = await POST(requete({ question: QUESTION }, { origin: "https://evil.example", "sec-fetch-site": "cross-site" }));
    expect(res.status).toBe(403);
    expect(envoi).not.toHaveBeenCalled();
  });
});

describe("Validation", () => {
  it.each([
    ["vide", { question: "" }, "vide"],
    ["espaces seulement", { question: "   \n\t " }, "vide"],
    ["trop longue (1 001 caractères)", { question: "a".repeat(1001) }, "trop-long"],
    ["sans champ question", { texte: QUESTION }, "invalide"],
    ["corps illisible", "pas du json", "invalide"],
  ])("%s : 400", async (_, corps, code) => {
    compte();
    expect(await poser(corps)).toMatchObject({ status: 400, corps: { error: code } });
    expect(envoi).not.toHaveBeenCalled();
  });

  it("1 000 caractères pile : accepté", async () => {
    compte();
    expect((await poser({ question: "é".repeat(1000) })).status).toBe(200);
  });
});

describe("E-mail envoyé", () => {
  it("vers contact@, objet fixe, Reply-To = adresse du compte en base (pas celle du corps ni de la session)", async () => {
    compte("PREMIUM", "abonne@x.fr");
    const r = await poser({ question: QUESTION, replyTo: "pirate@evil.example", email: "pirate@evil.example" });
    expect(r).toMatchObject({ status: 200, corps: { envoye: true } });
    expect(envoi).toHaveBeenCalledTimes(1);
    const [to, objet, texte, kind, options] = envoi.mock.calls[0] as [string, string, string, string, { replyTo: string }];
    expect(to).toBe("contact@deviens-marrant.fr");
    expect(objet).toBe(QUESTION_EQUIPE_EMAIL.objet);
    expect(objet).not.toMatch(/abonne|SECRET/);
    expect(kind).toBe("question-equipe");
    expect(options).toEqual({ replyTo: "abonne@x.fr" });
    expect(texte).toContain(QUESTION);
    expect(texte).not.toContain("pirate");
  });

  it("en-têtes sans CR ni LF, même si la question en contient", async () => {
    compte();
    await poser({ question: "Ligne 1\r\nBcc: pirate@evil.example\r\nLigne 3" });
    const [, objet, texte, , options] = envoi.mock.calls[0] as [string, string, string, string, { replyTo: string }];
    for (const entete of [objet, options.replyTo]) expect(entete).not.toMatch(/[\r\n]/);
    // Dans le corps (texte seul), retours à la ligne unifiés, jamais de CR.
    expect(texte).not.toContain("\r");
  });

  it("adresse du compte piégée (CR/LF + Bcc) : rien n'est envoyé, 503", async () => {
    compte("PREMIUM", "abonne@x.fr\r\nBcc: pirate@evil.example");
    expect(await poser()).toMatchObject({ status: 503, corps: { error: "envoi" } });
    expect(envoi).not.toHaveBeenCalled();
  });

  it("Resend en échec : 503 « envoi », aucun détail ni texte dans les journaux", async () => {
    compte();
    envoi.mockRejectedValueOnce(new Error(`Resend : refus pour ${QUESTION}`));
    expect(await poser()).toMatchObject({ status: 503, corps: { error: "envoi" } });
    expect(journaux()).toContain("Envoi à l'équipe impossible");
  });
});

describe("Garde-fou anti-abus (par compte)", () => {
  it("3 envois par 10 minutes : le 4e reçoit 429 + Retry-After, puis ça repart après 10 minutes", async () => {
    compte();
    for (let i = 0; i < 3; i++) expect((await poser()).status).toBe(200);
    const r = await poser();
    expect(r).toMatchObject({ status: 429, corps: { error: "trop" } });
    expect(Number(r.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(envoi).toHaveBeenCalledTimes(3);
    horloge += 10 * 60_000 + 1000;
    expect((await poser()).status).toBe(200);
  });

  it("10 envois par jour : le 11e reçoit 429 même hors fenêtre courte", async () => {
    compte();
    let acceptes = 0;
    for (let i = 0; i < 11; i++) {
      if ((await poser()).status === 200) acceptes++;
      if (i % 3 === 2) horloge += 11 * 60_000;
    }
    expect(acceptes).toBe(10);
    horloge += 11 * 60_000;
    expect((await poser()).status).toBe(429);
    expect(envoi).toHaveBeenCalledTimes(10);
  });

  it("la limite est propre au compte : un autre abonné peut envoyer", async () => {
    compte();
    for (let i = 0; i < 3; i++) await poser();
    expect((await poser()).status).toBe(429);
    compte();
    expect((await poser()).status).toBe(200);
  });
});
