/**
 * Tests de validation des schémas Zod utilisés dans les routes API
 * Couvre: Agent Blagues, Agent Conseils, Agent Vidéos, Agent Auth, Agent IA
 * Vérifie que les validations d'entrée bloquent les données invalides
 */
import { z } from "zod";

// ==========================================
// AGENT BLAGUES — /api/jokes query validation
// ==========================================

const jokesQuerySchema = z.object({
  category: z.string().optional(),
  type: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

describe("Agent Blagues — validation des paramètres /api/jokes", () => {
  it("accepte une requête sans filtre", () => {
    const result = jokesQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });

  it("accepte un filtre par catégorie", () => {
    const result = jokesQuerySchema.safeParse({ category: "ABSURDE" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.category).toBe("ABSURDE");
  });

  it("accepte un filtre par type", () => {
    const result = jokesQuerySchema.safeParse({ type: "ONE_LINER" });
    expect(result.success).toBe(true);
  });

  it("rejette une page < 1", () => {
    const result = jokesQuerySchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("rejette un limit > 50", () => {
    const result = jokesQuerySchema.safeParse({ limit: 100 });
    expect(result.success).toBe(false);
  });

  it("coerce les strings en nombres pour page/limit", () => {
    const result = jokesQuerySchema.safeParse({ page: "3", limit: "20" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(20);
    }
  });
});

// ==========================================
// AGENT CONSEILS — /api/tips query validation
// ==========================================

const tipsQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

describe("Agent Conseils — validation des paramètres /api/tips", () => {
  it("accepte une requête sans filtre", () => {
    const result = tipsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepte un filtre par difficulté", () => {
    const result = tipsQuerySchema.safeParse({ difficulty: "DEBUTANT" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.difficulty).toBe("DEBUTANT");
  });

  it("accepte la pagination", () => {
    const result = tipsQuerySchema.safeParse({ page: 2, limit: 25 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(25);
    }
  });
});

// ==========================================
// AGENT VIDÉOS — /api/videos query validation
// ==========================================

const videosQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

describe("Agent Vidéos — validation des paramètres /api/videos", () => {
  it("accepte une requête sans filtre", () => {
    const result = videosQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepte un filtre combiné category + difficulty", () => {
    const result = videosQuerySchema.safeParse({
      category: "TIMING",
      difficulty: "INTERMEDIAIRE",
    });
    expect(result.success).toBe(true);
  });
});

// ==========================================
// AGENT AUTH — /api/auth/register validation
// ==========================================

const registerSchema = z.object({
  name: z.string().min(2, "Le prénom doit faire au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
});

describe("Agent Auth — validation inscription /api/auth/register", () => {
  it("accepte des données valides", () => {
    const result = registerSchema.safeParse({
      name: "Thomas",
      email: "thomas@test.fr",
      password: "MonMotDePasse123",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un nom trop court (< 2 caractères)", () => {
    const result = registerSchema.safeParse({
      name: "T",
      email: "t@test.fr",
      password: "12345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("2 caractères");
    }
  });

  it("rejette un email invalide", () => {
    const result = registerSchema.safeParse({
      name: "Thomas",
      email: "pas-un-email",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejette un mot de passe trop court (< 8 caractères)", () => {
    const result = registerSchema.safeParse({
      name: "Thomas",
      email: "thomas@test.fr",
      password: "1234567",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("8 caractères");
    }
  });

  it("rejette des champs manquants", () => {
    const result = registerSchema.safeParse({ name: "Thomas" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("accepte un email avec sous-domaine", () => {
    const result = registerSchema.safeParse({
      name: "Thomas",
      email: "thomas@sub.domain.fr",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });
});

// ==========================================
// AGENT IA — /api/ai request validation
// ==========================================

const jokeRequestSchema = z.object({
  type: z.literal("joke"),
  categories: z.array(z.string()).optional(),
  level: z.string().optional(),
});

const tipRequestSchema = z.object({
  type: z.literal("tip"),
  currentLevel: z.string().optional(),
  weakCategories: z.array(z.string()).optional(),
});

const reparteeRequestSchema = z.object({
  type: z.literal("repartee"),
  situation: z.string().min(10),
});

const aiRequestSchema = z.discriminatedUnion("type", [
  jokeRequestSchema,
  tipRequestSchema,
  reparteeRequestSchema,
]);

describe("Agent IA — validation des requêtes /api/ai", () => {
  it("accepte une requête joke valide", () => {
    const result = aiRequestSchema.safeParse({
      type: "joke",
      categories: ["ABSURDE", "SITUATION"],
      level: "INTERMEDIAIRE",
    });
    expect(result.success).toBe(true);
  });

  it("accepte une requête joke sans options", () => {
    const result = aiRequestSchema.safeParse({ type: "joke" });
    expect(result.success).toBe(true);
  });

  it("accepte une requête tip valide", () => {
    const result = aiRequestSchema.safeParse({
      type: "tip",
      currentLevel: "DEBUTANT",
      weakCategories: ["TIMING"],
    });
    expect(result.success).toBe(true);
  });

  it("accepte une requête repartee valide", () => {
    const result = aiRequestSchema.safeParse({
      type: "repartee",
      situation: "Mon collègue me dit que je suis toujours en retard",
    });
    expect(result.success).toBe(true);
  });

  it("rejette une requête repartee avec situation trop courte", () => {
    const result = aiRequestSchema.safeParse({
      type: "repartee",
      situation: "Court",
    });
    expect(result.success).toBe(false);
  });

  it("rejette un type inconnu", () => {
    const result = aiRequestSchema.safeParse({
      type: "unknown",
      data: "test",
    });
    expect(result.success).toBe(false);
  });

  it("rejette une requête sans type", () => {
    const result = aiRequestSchema.safeParse({ categories: ["ABSURDE"] });
    expect(result.success).toBe(false);
  });
});

// ==========================================
// AGENT XP — /api/user/xp validation
// ==========================================

const xpSchema = z.object({
  amount: z.number().min(1).max(500),
  action: z.string(),
});

describe("Agent XP — validation des gains /api/user/xp", () => {
  it("accepte un gain XP valide", () => {
    const result = xpSchema.safeParse({ amount: 20, action: "joke_read" });
    expect(result.success).toBe(true);
  });

  it("rejette un amount de 0", () => {
    const result = xpSchema.safeParse({ amount: 0, action: "test" });
    expect(result.success).toBe(false);
  });

  it("rejette un amount négatif", () => {
    const result = xpSchema.safeParse({ amount: -10, action: "test" });
    expect(result.success).toBe(false);
  });

  it("rejette un amount > 500 (anti-farming)", () => {
    const result = xpSchema.safeParse({ amount: 501, action: "test" });
    expect(result.success).toBe(false);
  });

  it("rejette sans action", () => {
    const result = xpSchema.safeParse({ amount: 20 });
    expect(result.success).toBe(false);
  });
});

// ==========================================
// AGENT FAVORIS — /api/favorites validation
// ==========================================

const addFavoriteSchema = z.object({
  contentType: z.enum(["JOKE", "TIP", "VIDEO"]),
  contentId: z.string(),
});

describe("Agent Favoris — validation /api/favorites", () => {
  it("accepte un favori JOKE", () => {
    const result = addFavoriteSchema.safeParse({
      contentType: "JOKE",
      contentId: "cuid123",
    });
    expect(result.success).toBe(true);
  });

  it("accepte un favori TIP", () => {
    const result = addFavoriteSchema.safeParse({
      contentType: "TIP",
      contentId: "cuid456",
    });
    expect(result.success).toBe(true);
  });

  it("accepte un favori VIDEO", () => {
    const result = addFavoriteSchema.safeParse({
      contentType: "VIDEO",
      contentId: "cuid789",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un contentType invalide", () => {
    const result = addFavoriteSchema.safeParse({
      contentType: "ARTICLE",
      contentId: "cuid123",
    });
    expect(result.success).toBe(false);
  });

  it("rejette sans contentId", () => {
    const result = addFavoriteSchema.safeParse({
      contentType: "JOKE",
    });
    expect(result.success).toBe(false);
  });
});
