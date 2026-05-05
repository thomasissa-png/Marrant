/**
 * @jest-environment node
 *
 * Tests — Cron daily-social (/api/cron/daily-social)
 *
 * Couvre les 4 scénarios critiques (régression historique des 4 bugs successifs) :
 *   A) 0 posts aujourd'hui → génère TWITTER + LINKEDIN + INSTAGRAM
 *   B) Twitter déjà publié, LinkedIn/Instagram vides → ne génère QUE LinkedIn + Instagram
 *   C) Toutes plateformes couvertes → skip entièrement
 *   D) Cron appelé plusieurs fois dans la même journée → ne duplique PAS les posts
 *
 * Vérifie aussi :
 *   - createdAt (et non publishedAt) utilisé pour la déduplication
 *   - Statuts vérifiés : APPROVED, PUBLISHED, PENDING (les 3)
 *   - Filtre `posts.filter(p => !platformsAlreadyCovered.has(p.platform))` correct
 *   - Cas "aucun post à créer après filtrage" → skip propre, pas de crash
 *   - Timezone UTC partout (startOfDay/endOfDay)
 */

// ─── Mocks ───────────────────────────────────────────────────────

const mockGroupBy = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    socialPost: {
      groupBy: mockGroupBy,
      create: mockCreate,
      update: mockUpdate,
    },
  },
}));

const mockGenerateDailySocialPosts = jest.fn();
const mockGetOptimalScheduleTime = jest
  .fn()
  .mockReturnValue(new Date("2026-04-06T08:00:00Z"));

jest.mock("@/lib/ai/agents/social-media-agent", () => ({
  generateDailySocialPosts: mockGenerateDailySocialPosts,
  getOptimalScheduleTime: mockGetOptimalScheduleTime,
}));

const mockGetPersonaForDay = jest.fn().mockReturnValue("SOPHIE");
jest.mock("@/lib/ai/personas", () => ({
  getPersonaForDay: (...args: unknown[]) => mockGetPersonaForDay(...args),
}));

jest.mock("@/lib/email", () => ({
  sendAdminAlert: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/social/generate-post-image", () => ({
  generatePostImage: jest.fn().mockResolvedValue(Buffer.from("fake-png")),
}));

jest.mock("@/lib/social/image-storage", () => ({
  uploadPostImage: jest.fn().mockResolvedValue("https://cdn.example.com/img.png"),
}));

// ─── Helpers ────────────────────────────────────────────────────

/** Crée un post généré par défaut, validé par le directeur (APPROVED). */
function makeGeneratedPost(
  platform: "TWITTER" | "LINKEDIN" | "INSTAGRAM",
  overrides: Record<string, unknown> = {},
) {
  return {
    platform,
    format:
      platform === "INSTAGRAM"
        ? "TECHNIQUE_DU_JOUR"
        : platform === "LINKEDIN"
          ? "POST"
          : "TWEET",
    hook: "Hook accroche test",
    content: "Contenu du post",
    cta: "deviens-marrant.fr",
    hashtags: ["#humour"],
    targetPersona: "SOPHIE",
    sourceType: "ORIGINAL",
    sourceId: null,
    threadParts: [],
    directorScore: 9,
    directorValidated: true,
    directorNote: "OK",
    ...overrides,
  };
}

/** Stub pour mockCreate qui renvoie un dbPost minimal. */
function stubCreate() {
  let counter = 0;
  mockCreate.mockImplementation(async ({ data }) => ({
    id: `post-${++counter}`,
    platform: data.platform,
    format: data.format,
    scheduledAt: data.scheduledAt,
  }));
}

// Helper pour fabriquer une Request authentifiée
function makeRequest(query = "") {
  const url = `https://example.com/api/cron/daily-social?secret=test-secret${query ? "&" + query : ""}`;
  return new Request(url, { method: "GET" });
}

// ─── Tests ──────────────────────────────────────────────────────

describe("Cron daily-social — déduplication par plateforme", () => {
  let GET: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.CRON_SECRET = "test-secret";
    // Refonte s7 — Quotas refondus : TWITTER=1, LINKEDIN=1 (sauf Yanis), INSTAGRAM=1
    // Freeze date sur le lundi 6 avril 2026 (dayOfWeek=1, persona SOPHIE) → T=1 LI=1 IG=1 = 3 posts
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    jest.setSystemTime(new Date("2026-04-06T05:00:00Z"));
    // Import dynamique APRÈS les mocks
    const mod = await import("@/app/api/cron/daily-social/route");
    GET = mod.GET as typeof GET;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOptimalScheduleTime.mockReturnValue(new Date("2026-04-06T08:00:00Z"));
    stubCreate();
  });

  // ─── Auth ──────────────────────────────────────────────────────

  it("rejette une requête sans secret (401)", async () => {
    const url = "https://example.com/api/cron/daily-social";
    const res = await GET(new Request(url));
    expect(res.status).toBe(401);
  });

  // ─── Scénario A : 0 posts aujourd'hui ──────────────────────────

  it("Scénario A — 0 posts aujourd'hui : génère TWITTER + LINKEDIN + INSTAGRAM (refonte s7 = 3 posts)", async () => {
    mockGroupBy.mockResolvedValue([]); // aucun post existant
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    // Refonte s7 : 1 post/plateforme/jour → 3 posts max (T=1, LI=1, IG=1)
    expect(mockCreate).toHaveBeenCalledTimes(3);
    expect(body.posts).toHaveLength(3);
    const platforms = (body.posts as Array<{ platform: string }>)
      .map((p) => p.platform)
      .sort();
    expect(platforms).toEqual(["INSTAGRAM", "LINKEDIN", "TWITTER"]);
  });

  // ─── Scénario B : Twitter déjà publié, autres vides ────────────

  it("Scénario B — Twitter déjà publié, LinkedIn/Instagram vides : ne génère QUE LinkedIn + Instagram", async () => {
    mockGroupBy.mockResolvedValue([{ platform: "TWITTER", _count: 1 }]);
    mockGenerateDailySocialPosts.mockResolvedValue([
      // L'agent regénère tout — c'est attendu, c'est le cron qui filtre
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    // Twitter doit être filtré → seulement LinkedIn + Instagram créés
    expect(mockCreate).toHaveBeenCalledTimes(2);
    const createdPlatforms = mockCreate.mock.calls
      .map((c) => c[0].data.platform)
      .sort();
    expect(createdPlatforms).toEqual(["INSTAGRAM", "LINKEDIN"]);
    expect(body.posts).toHaveLength(2);
  });

  // ─── Scénario C : toutes plateformes couvertes ─────────────────

  it("Scénario C — toutes les plateformes couvertes : skip entièrement (n'appelle PAS le générateur)", async () => {
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 1 },
      { platform: "LINKEDIN", _count: 1 },
      { platform: "INSTAGRAM", _count: 1 },
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.skipped).toBe(true);
    expect(mockGenerateDailySocialPosts).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ─── Scénario D : appels multiples dans la même journée ───────

  it("Scénario D — cron appelé 4 fois dans la même journée : ne duplique PAS les posts", async () => {
    // Refonte s7 — Lundi Sophie → quotas TWITTER=1, LINKEDIN=1, INSTAGRAM=1 → 3 posts au total
    // Appel 1 : aucun post → génère les 3 posts
    mockGroupBy.mockResolvedValueOnce([]);
    mockGenerateDailySocialPosts.mockResolvedValueOnce([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res1 = await GET(makeRequest());
    expect(res1.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(3);

    // Simule l'état post-call 1 : tous les quotas sont remplis
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 1 },
      { platform: "LINKEDIN", _count: 1 },
      { platform: "INSTAGRAM", _count: 1 },
    ]);

    // Appels 2, 3, 4 : doivent skip (totalMissing === 0)
    for (let i = 0; i < 3; i++) {
      mockCreate.mockClear();
      mockGenerateDailySocialPosts.mockClear();
      const res = await GET(makeRequest());
      const body = await res.json();
      expect(res.status).toBe(200);
      expect(body.skipped).toBe(true);
      expect(mockGenerateDailySocialPosts).not.toHaveBeenCalled();
      expect(mockCreate).not.toHaveBeenCalled();
    }
  });

  // ─── Régressions — bugs historiques fixés ─────────────────────

  it("REGRESSION — utilise createdAt (pas publishedAt) pour la déduplication", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([makeGeneratedPost("TWITTER")]);

    await GET(makeRequest());

    expect(mockGroupBy).toHaveBeenCalledTimes(1);
    const groupByArgs = mockGroupBy.mock.calls[0][0];
    expect(groupByArgs.where).toHaveProperty("createdAt");
    expect(groupByArgs.where).not.toHaveProperty("publishedAt");
  });

  it("REGRESSION — compte TOUS les statuts (y compris FAILED) pour éviter les boucles regenerate → FAILED → regenerate", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([makeGeneratedPost("TWITTER")]);

    await GET(makeRequest());

    const groupByArgs = mockGroupBy.mock.calls[0][0];
    // Le filtre NE DOIT PAS exclure FAILED (sinon boucle infinie sur 429 cooldown)
    expect(groupByArgs.where.status).toBeUndefined();
    // Doit filtrer uniquement par date
    expect(groupByArgs.where.createdAt).toBeDefined();
  });

  it("REGRESSION — startOfDay et endOfDay utilisent UTC (pas l'heure locale)", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([makeGeneratedPost("TWITTER")]);

    await GET(makeRequest());

    const { gte, lte } = mockGroupBy.mock.calls[0][0].where.createdAt;
    expect(gte.getUTCHours()).toBe(0);
    expect(gte.getUTCMinutes()).toBe(0);
    expect(gte.getUTCSeconds()).toBe(0);
    expect(lte.getUTCHours()).toBe(23);
    expect(lte.getUTCMinutes()).toBe(59);
    expect(lte.getUTCSeconds()).toBe(59);
  });

  it("REGRESSION — groupBy filtre par platform (le compteur n'est PAS global)", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([makeGeneratedPost("TWITTER")]);

    await GET(makeRequest());

    const groupByArgs = mockGroupBy.mock.calls[0][0];
    expect(groupByArgs.by).toContain("platform");
  });

  // ─── Edge case — 0 post à créer après filtrage ────────────────

  it("Edge case — quotas tous atteints : skip propre sans appeler le generateur", async () => {
    // Refonte s7 — Lundi Sophie → quotas T=1 LI=1 IG=1, tous remplis
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 1 },
      { platform: "LINKEDIN", _count: 1 },
      { platform: "INSTAGRAM", _count: 1 },
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.skipped).toBe(true);
    expect(mockGenerateDailySocialPosts).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ─── Edge case — force=true régénère tout ─────────────────────

  it("force=true — bypass complet du check, génère tout même si les plateformes sont couvertes", async () => {
    // groupBy ne devrait même pas être appelé en mode force
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 1 },
      { platform: "LINKEDIN", _count: 1 },
      { platform: "INSTAGRAM", _count: 1 },
    ]);
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res = await GET(makeRequest("force=true"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockGroupBy).not.toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledTimes(3);
    expect(body.posts).toHaveLength(3);
  });

  // ─── Statut PENDING vs APPROVED ───────────────────────────────

  it("post non validé par le directeur → status PENDING (pas APPROVED)", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER", { directorValidated: false, directorScore: null }),
    ]);

    await GET(makeRequest());

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate.mock.calls[0][0].data.status).toBe("PENDING");
    expect(mockCreate.mock.calls[0][0].data.approvedBy).toBeNull();
  });

  it("post score < 9 → status PENDING (pas APPROVED même si validé)", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER", { directorValidated: true, directorScore: 7 }),
    ]);

    await GET(makeRequest());

    expect(mockCreate.mock.calls[0][0].data.status).toBe("PENDING");
    expect(mockCreate.mock.calls[0][0].data.approvedBy).toBeNull();
  });

  it("post score ≥ 9 et validé → status APPROVED", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER", { directorValidated: true, directorScore: 9 }),
    ]);

    await GET(makeRequest());

    expect(mockCreate.mock.calls[0][0].data.status).toBe("APPROVED");
    expect(mockCreate.mock.calls[0][0].data.approvedBy).toBe("director");
  });

  // ─── Filtre quantitatif : récupération d'échec partiel ────────

  it("RÉCUPÉRATION — si LI déjà OK mais TW + IG manquants, régénère SEULEMENT TW + IG (pas LI)", async () => {
    // Refonte s7 — Lundi Sophie quotas T=1 LI=1 IG=1
    // On a déjà 1 LinkedIn → il manque 1 Twitter et 1 Instagram
    mockGroupBy.mockResolvedValue([
      { platform: "LINKEDIN", _count: 1 },
    ]);
    // L'agent regénère tout — c'est le cron qui filtre quantitativement
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    // 2 posts créés (TW + IG), LI filtré
    expect(mockCreate).toHaveBeenCalledTimes(2);
    const platforms = mockCreate.mock.calls.map((c) => c[0].data.platform).sort();
    expect(platforms).toEqual(["INSTAGRAM", "TWITTER"]);
    expect(body.posts).toHaveLength(2);
  });

  it("YANIS — refonte s7 quota T=1 IG=1 (pas de LinkedIn)", async () => {
    // Refonte s7 : Yanis → 1 Twitter + 0 LinkedIn + 1 Instagram = 2 posts
    jest.setSystemTime(new Date("2026-04-08T05:00:00Z"));
    mockGetPersonaForDay.mockReturnValueOnce("YANIS");

    mockGroupBy.mockResolvedValue([]); // DB vide
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("INSTAGRAM"),
      // Si l'agent renvoie du LinkedIn par erreur, le cron doit filtrer (quota=0)
      makeGeneratedPost("LINKEDIN"),
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    // Yanis : 1 TW + 1 IG = 2 posts (pas de LinkedIn)
    expect(mockCreate).toHaveBeenCalledTimes(2);
    const platforms = mockCreate.mock.calls.map((c) => c[0].data.platform).sort();
    expect(platforms).toEqual(["INSTAGRAM", "TWITTER"]);
    expect(body.posts).toHaveLength(2);

    // Restore fake date to Monday for subsequent tests
    jest.setSystemTime(new Date("2026-04-06T05:00:00Z"));
  });

  it("MARDI SOPHIE — refonte s7 = quotas T=1 LI=1 IG=1", async () => {
    // Refonte s7 : LinkedIn généré tous les jours sauf jours Yanis
    jest.setSystemTime(new Date("2026-04-07T05:00:00Z"));
    mockGetPersonaForDay.mockReturnValueOnce("SOPHIE");

    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res = await GET(makeRequest());

    expect(res.status).toBe(200);
    // Sophie : 1 TW + 1 LI + 1 IG = 3 posts (refonte s7 — LI tous les jours sauf Yanis)
    expect(mockCreate).toHaveBeenCalledTimes(3);
    const platforms = mockCreate.mock.calls.map((c) => c[0].data.platform).sort();
    expect(platforms).toEqual(["INSTAGRAM", "LINKEDIN", "TWITTER"]);

    jest.setSystemTime(new Date("2026-04-06T05:00:00Z"));
  });

  // ─── FAILED 429 : ne pas boucler ───────────────────────────────

  it("FAILED 429 — si 1 post Twitter FAILED (429 cooldown) existe déjà, NE PAS regénérer aujourd'hui", async () => {
    // Refonte s7 — Lundi Sophie quota T=1 — le tweet est en FAILED (429 cooldown)
    // Le cron ne doit PAS regenerer pour éviter la boucle FAILED→regenerate→FAILED
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 1 },   // 1 FAILED
      { platform: "LINKEDIN", _count: 1 },
      { platform: "INSTAGRAM", _count: 1 },
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.skipped).toBe(true);
    expect(mockGenerateDailySocialPosts).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  // ─── REGRESSION : le hard lock ne doit PAS exclure FAILED ─────

  it("REGRESSION — le groupBy ne filtre PAS par status (inclut FAILED pour éviter les boucles)", async () => {
    mockGroupBy.mockResolvedValue([]);
    mockGenerateDailySocialPosts.mockResolvedValue([makeGeneratedPost("TWITTER")]);

    await GET(makeRequest());

    const args = mockGroupBy.mock.calls[0][0];
    // Pas de filtre status → tous les posts sont comptés (y compris FAILED)
    expect(args.where.status).toBeUndefined();
  });
});
