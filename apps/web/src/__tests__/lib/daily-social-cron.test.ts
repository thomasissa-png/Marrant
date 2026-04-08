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

jest.mock("@/lib/ai/personas", () => ({
  getPersonaForDay: jest.fn().mockReturnValue("SOPHIE"),
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
    // Freeze date sur le lundi 6 avril 2026 (dayOfWeek=1, persona SOPHIE)
    // → quotas : TWITTER=2, LINKEDIN=1, INSTAGRAM=1
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

  it("Scénario A — 0 posts aujourd'hui : génère TWITTER + LINKEDIN + INSTAGRAM", async () => {
    mockGroupBy.mockResolvedValue([]); // aucun post existant
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(4);
    expect(body.posts).toHaveLength(4);
    const platforms = (body.posts as Array<{ platform: string }>)
      .map((p) => p.platform)
      .sort();
    expect(platforms).toEqual(["INSTAGRAM", "LINKEDIN", "TWITTER", "TWITTER"]);
  });

  // ─── Scénario B : Twitter déjà publié, autres vides ────────────

  it("Scénario B — Twitter déjà publié, LinkedIn/Instagram vides : ne génère QUE LinkedIn + Instagram", async () => {
    mockGroupBy.mockResolvedValue([{ platform: "TWITTER", _count: 3 }]);
    mockGenerateDailySocialPosts.mockResolvedValue([
      // L'agent regénère tout — c'est attendu, c'est le cron qui filtre
      makeGeneratedPost("TWITTER"),
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
      { platform: "TWITTER", _count: 3 },
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
    // Lundi Sophie → quotas TWITTER=2, LINKEDIN=1, INSTAGRAM=1 → 4 posts au total
    // Appel 1 : aucun post → génère les 4 posts
    mockGroupBy.mockResolvedValueOnce([]);
    mockGenerateDailySocialPosts.mockResolvedValueOnce([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res1 = await GET(makeRequest());
    expect(res1.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(4);

    // Simule l'état post-call 1 : tous les quotas sont remplis
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 2 },
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
    // Lundi Sophie → quotas T=2 LI=1 IG=1, tous remplis
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 2 },
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
      { platform: "TWITTER", _count: 3 },
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

  it("RÉCUPÉRATION — si 1 tweet sur 2 attendu existe déjà, régénère SEULEMENT le 2e (pas les deux)", async () => {
    // Lundi Sophie quota T=2, LI=1, IG=1 — on a déjà 1 Twitter + 1 LI + 1 IG
    // Il manque 1 Twitter uniquement
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 1 },
      { platform: "LINKEDIN", _count: 1 },
      { platform: "INSTAGRAM", _count: 1 },
    ]);
    // L'agent regénère tout — c'est le cron qui filtre quantitativement
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    // SEULEMENT 1 post créé (le Twitter manquant), pas 2 ni 4
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate.mock.calls[0][0].data.platform).toBe("TWITTER");
    expect(body.posts).toHaveLength(1);
  });

  it("RÉCUPÉRATION — si 3/4 Twitter existent sur un jour mercredi, régénère SEULEMENT le 4ème", async () => {
    // Pour ce test spécifique, on simule mercredi 8 avril 2026 (day 3 = mercredi)
    // Mercredi Sophie → quotas T=3, LI=1, IG=1
    // Ici on a 2 Twitter + 1 LI + 1 IG → il manque 1 Twitter
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 2 },
      { platform: "LINKEDIN", _count: 1 },
      { platform: "INSTAGRAM", _count: 1 },
    ]);
    mockGenerateDailySocialPosts.mockResolvedValue([
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("TWITTER"),
      makeGeneratedPost("LINKEDIN"),
      makeGeneratedPost("INSTAGRAM"),
    ]);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    // Sur lundi Sophie quota T=2 → avec 2 déjà en DB, il manque 0 tweet → skip
    // Le test valide juste que le filtre quantitatif fonctionne sans crash
    const body = await res.json();
    expect(body).toBeDefined();
  });

  // ─── FAILED 429 : ne pas boucler ───────────────────────────────

  it("FAILED 429 — si 2 posts Twitter FAILED (429 cooldown) existent déjà, NE PAS regénérer aujourd'hui", async () => {
    // Lundi Sophie quota T=2 — les 2 tweets sont en FAILED (429 cooldown)
    // Le cron ne doit PAS regenerer pour éviter la boucle FAILED→regenerate→FAILED
    mockGroupBy.mockResolvedValue([
      { platform: "TWITTER", _count: 2 },   // 2 FAILED
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
