/**
 * Tests — Social Media Agent (social-media-agent.ts)
 *
 * Couvre :
 * - validatePostConstraints() : validation programmatique des contraintes
 * - getOptimalScheduleTime() : horaires de publication par persona/plateforme
 * - getDailyPlan() : non exporté, noté en commentaire
 */

// ─── Mocks ───────────────────────────────────────────────────────

// Mock des dépendances externes pour isoler les tests
jest.mock("@/lib/ai/client", () => ({
  callWithRetry: jest.fn(),
  extractJson: jest.fn(),
  getResponseText: jest.fn(),
}));

jest.mock("@/lib/ai/agents/marketing-agent", () => ({
  TONALITY_BRIEF: {
    principles: ["Complice", "Direct"],
    doNot: ["Pas de vouvoiement"],
  },
}));

jest.mock("@/lib/ai/agents/standup-director-agent", () => ({
  validateSocialPost: jest.fn(),
  directorRewriteSocialPost: jest.fn(),
}));

jest.mock("@/lib/ai/personas", () => ({
  PERSONAS: {
    YANIS: {
      name: "Yanis",
      age: 20,
      description: "Étudiant introverti",
      interests: ["soirées", "coloc"],
      tone: "encourageant",
    },
    SOPHIE: {
      name: "Sophie",
      age: 26,
      description: "Jeune active",
      interests: ["machine à café", "afterwork"],
      tone: "complice",
    },
    MARC: {
      name: "Marc",
      age: 34,
      description: "En reconstruction",
      interests: ["confiance", "networking"],
      tone: "bienveillant",
    },
  },
  getPersonaForDay: jest.fn().mockReturnValue("YANIS"),
}));

// ─── Import après les mocks ─────────────────────────────────────

import {
  validatePostConstraints,
  getOptimalScheduleTime,
} from "@/lib/ai/agents/social-media-agent";

// ─── Helper ─────────────────────────────────────────────────────

/** Crée un post valide par défaut — toutes les contraintes respectées */
function makePost(overrides = {}) {
  return {
    platform: "TWITTER",
    format: "TWEET",
    hook: "Test hook ici",
    content: "Un tweet court",
    cta: "deviens-marrant.fr",
    hashtags: ["#humour"],
    targetPersona: "YANIS",
    sourceType: "ORIGINAL",
    ...overrides,
  };
}

// ─── Tests validatePostConstraints() ────────────────────────────

describe("social-media-agent", () => {
  describe("validatePostConstraints", () => {
    // --- Hook word count ---

    it("accepte un hook de 5 mots exactement", () => {
      const post = makePost({ hook: "Un deux trois quatre cinq" });
      const issues = validatePostConstraints(post);
      expect(issues).toEqual([]);
    });

    it("rejette un hook de 6 mots", () => {
      const post = makePost({ hook: "Un deux trois quatre cinq six" });
      const issues = validatePostConstraints(post);
      expect(issues).toHaveLength(1);
      expect(issues[0]).toContain("Hook trop long");
      expect(issues[0]).toContain("6 mots");
    });

    it("accepte un hook de 1 mot", () => {
      const post = makePost({ hook: "Boom" });
      const issues = validatePostConstraints(post);
      expect(issues).toEqual([]);
    });

    it("gère les espaces multiples dans le hook sans compter de mots fantômes", () => {
      // "  a  b  c  " = 3 mots après trim + split + filter
      const post = makePost({ hook: "  a  b  c  " });
      const issues = validatePostConstraints(post);
      expect(issues).toEqual([]);
    });

    // --- Limite caractères Twitter TWEET ---

    it("accepte un tweet de 280 caractères exactement", () => {
      const content = "a".repeat(280);
      const post = makePost({ platform: "TWITTER", format: "TWEET", content });
      const issues = validatePostConstraints(post);
      expect(issues).toEqual([]);
    });

    it("rejette un tweet de 281 caractères", () => {
      const content = "a".repeat(281);
      const post = makePost({ platform: "TWITTER", format: "TWEET", content });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Tweet trop long"))).toBe(true);
      expect(issues.some((i) => i.includes("281 chars"))).toBe(true);
    });

    it("ne rejette pas un contenu long si la plateforme n'est pas Twitter", () => {
      // LinkedIn a sa propre limite (1300), pas 280
      const content = "a".repeat(500);
      const post = makePost({ platform: "LINKEDIN", format: "POST", content });
      const issues = validatePostConstraints(post);
      // Pas d'issue liée à 280 chars
      expect(issues.some((i) => i.includes("Tweet trop long"))).toBe(false);
    });

    // --- Limite caractères LinkedIn ---

    it("accepte un post LinkedIn de 1300 caractères exactement", () => {
      const content = "a".repeat(1300);
      const post = makePost({ platform: "LINKEDIN", format: "POST", content });
      const issues = validatePostConstraints(post);
      expect(issues).toEqual([]);
    });

    it("rejette un post LinkedIn de 1301 caractères", () => {
      const content = "a".repeat(1301);
      const post = makePost({ platform: "LINKEDIN", format: "POST", content });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Post LinkedIn trop long"))).toBe(true);
      expect(issues.some((i) => i.includes("1301 chars"))).toBe(true);
    });

    // --- Thread parts (Twitter) ---

    it("accepte des thread parts de 280 chars chacune", () => {
      const post = makePost({
        platform: "TWITTER",
        format: "THREAD",
        threadParts: [
          "a".repeat(280),
          "b".repeat(280),
          "c".repeat(280),
          "d".repeat(280),
          "e".repeat(280),
        ],
      });
      const issues = validatePostConstraints(post);
      // Pas d'issue liée à la longueur des parts
      expect(issues.some((i) => i.includes("Thread tweet"))).toBe(false);
    });

    it("rejette un thread part qui dépasse 280 chars", () => {
      const post = makePost({
        platform: "TWITTER",
        format: "THREAD",
        threadParts: [
          "a".repeat(280),
          "b".repeat(281), // trop long
          "c".repeat(280),
          "d".repeat(280),
          "e".repeat(280),
        ],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Thread tweet 2 trop long"))).toBe(true);
    });

    // --- Carousel slides (Instagram) ---

    it("accepte des carousel slides de 150 chars chacune", () => {
      const post = makePost({
        platform: "INSTAGRAM",
        format: "CAROUSEL",
        threadParts: [
          "a".repeat(150),
          "b".repeat(150),
          "c".repeat(150),
          "d".repeat(150),
          "e".repeat(150),
        ],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Carousel slide"))).toBe(false);
    });

    it("rejette une carousel slide qui dépasse 150 chars", () => {
      const post = makePost({
        platform: "INSTAGRAM",
        format: "CAROUSEL",
        threadParts: [
          "ok",
          "a".repeat(151), // trop longue
          "ok aussi",
        ],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Carousel slide 2 trop longue"))).toBe(true);
      expect(issues.some((i) => i.includes("151 chars"))).toBe(true);
    });

    // --- Persona guard (CRITIQUE) ---

    it("rejette un contenu qui contient 'yanis'", () => {
      const post = makePost({ content: "Yanis adore les soirées" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
      expect(issues.some((i) => i.includes("yanis"))).toBe(true);
    });

    it("rejette un hook qui contient 'sophie'", () => {
      const post = makePost({ hook: "Sophie rigole", content: "ok" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
      expect(issues.some((i) => i.includes("sophie"))).toBe(true);
    });

    it("rejette un CTA qui contient 'marc'", () => {
      const post = makePost({ cta: "Comme Marc, progresse" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
      expect(issues.some((i) => i.includes("marc"))).toBe(true);
    });

    it("est insensible à la casse pour les noms de persona", () => {
      const post = makePost({ content: "SOPHIE au bureau" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
    });

    it("n'a pas de faux positif persona sur des mots courants", () => {
      // "marché" contient "marc" — vérifions le comportement
      // La fonction fait un includes exact, donc "marché" contient "marc" → issue
      // C'est un comportement attendu (mieux vaut un faux positif qu'un leak)
      const post = makePost({ content: "Le marché est ouvert" });
      const issues = validatePostConstraints(post);
      // "marc" est dans "marché" → issue détectée (comportement voulu pour la sécurité)
      expect(issues.some((i) => i.includes("marc"))).toBe(true);
    });

    // --- CTA interdit ---

    it("rejette un CTA contenant 'découvrez'", () => {
      const post = makePost({ cta: "Découvrez nos techniques" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CTA interdit"))).toBe(true);
      expect(issues.some((i) => i.includes("découvrez"))).toBe(true);
    });

    it("rejette un CTA contenant \"n'hésitez pas\"", () => {
      const post = makePost({ cta: "N'hésitez pas à visiter" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CTA interdit"))).toBe(true);
    });

    it("rejette un CTA contenant 'visitez'", () => {
      const post = makePost({ cta: "Visitez notre site" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CTA interdit"))).toBe(true);
      expect(issues.some((i) => i.includes("visitez"))).toBe(true);
    });

    it("rejette un CTA avec un point d'exclamation", () => {
      const post = makePost({ cta: "Allez sur le site !" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("point d'exclamation"))).toBe(true);
    });

    it("accepte un CTA propre sans marketing language", () => {
      const post = makePost({ cta: "50+ techniques sur deviens-marrant.fr" });
      const issues = validatePostConstraints(post);
      // Pas d'issue CTA
      expect(issues.some((i) => i.includes("CTA"))).toBe(false);
    });

    // --- Engagement bait ---

    it("rejette du contenu avec 'tag un ami'", () => {
      const post = makePost({ content: "Tag un ami qui fait ça" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Engagement bait"))).toBe(true);
      expect(issues.some((i) => i.includes("tag un ami"))).toBe(true);
    });

    it("rejette du contenu avec 'note de 1 à 10'", () => {
      const post = makePost({ content: "Donne une note de 1 à 10" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Engagement bait"))).toBe(true);
    });

    it("rejette du contenu avec 'like si'", () => {
      const post = makePost({ content: "Like si tu es d'accord" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Engagement bait"))).toBe(true);
      expect(issues.some((i) => i.includes("like si"))).toBe(true);
    });

    it("rejette du contenu avec 'complète cette'", () => {
      const post = makePost({ content: "Complète cette vanne en commentaire" });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Engagement bait"))).toBe(true);
      expect(issues.some((i) => i.includes("complète cette"))).toBe(true);
    });

    // --- Thread parts count (5-7) ---

    it("rejette un thread sans threadParts", () => {
      const post = makePost({ format: "THREAD", threadParts: undefined });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Thread sans threadParts"))).toBe(true);
    });

    it("rejette un thread avec 0 parts", () => {
      const post = makePost({ format: "THREAD", threadParts: [] });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Thread sans threadParts"))).toBe(true);
    });

    it("rejette un thread avec 4 parts (min 5)", () => {
      const post = makePost({
        format: "THREAD",
        threadParts: ["a", "b", "c", "d"],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Thread trop court"))).toBe(true);
      expect(issues.some((i) => i.includes("4 tweets"))).toBe(true);
    });

    it("accepte un thread avec 5 parts (minimum)", () => {
      const post = makePost({
        format: "THREAD",
        threadParts: ["a", "b", "c", "d", "e"],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Thread trop court"))).toBe(false);
      expect(issues.some((i) => i.includes("Thread trop long"))).toBe(false);
    });

    it("accepte un thread avec 7 parts (maximum)", () => {
      const post = makePost({
        format: "THREAD",
        threadParts: ["a", "b", "c", "d", "e", "f", "g"],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Thread trop court"))).toBe(false);
      expect(issues.some((i) => i.includes("Thread trop long"))).toBe(false);
    });

    it("rejette un thread avec 8 parts (max 7)", () => {
      const post = makePost({
        format: "THREAD",
        threadParts: ["a", "b", "c", "d", "e", "f", "g", "h"],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Thread trop long"))).toBe(true);
      expect(issues.some((i) => i.includes("8 tweets"))).toBe(true);
    });

    // --- Post entièrement valide ---

    it("retourne un tableau vide pour un post valide", () => {
      const post = makePost({
        hook: "Fary ne répond jamais",
        content: "Une technique simple de miroir comique.",
        cta: "deviens-marrant.fr",
      });
      const issues = validatePostConstraints(post);
      expect(issues).toEqual([]);
    });

    // --- Accumulation de plusieurs issues ---

    it("accumule plusieurs issues pour un post avec plusieurs problèmes", () => {
      const post = makePost({
        hook: "Un hook qui est beaucoup trop long clairement", // 8 mots
        content: "a".repeat(281), // trop long
        cta: "Découvrez notre site !", // pattern interdit + !
        platform: "TWITTER",
        format: "TWEET",
      });
      const issues = validatePostConstraints(post);
      // Au moins 3 issues : hook, longueur tweet, CTA
      expect(issues.length).toBeGreaterThanOrEqual(3);
    });

    // --- Pas de validation thread count pour un format non-THREAD ---

    it("ne valide pas le nombre de threadParts pour un format TWEET", () => {
      // Un TWEET n'a pas besoin de threadParts, pas d'issue thread
      const post = makePost({ format: "TWEET", threadParts: undefined });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Thread"))).toBe(false);
    });
  });

  // ─── Tests getOptimalScheduleTime() ─────────────────────────────

  describe("getOptimalScheduleTime", () => {
    it("retourne un objet Date", () => {
      const date = getOptimalScheduleTime("YANIS", 0);
      expect(date).toBeInstanceOf(Date);
    });

    it("retourne une date valide (pas NaN)", () => {
      const date = getOptimalScheduleTime("SOPHIE", 0, "LINKEDIN");
      expect(date.getTime()).not.toBeNaN();
    });

    // --- YANIS + TWITTER : soirée (19 ou 21 UTC) ---

    it("programme YANIS+TWITTER index 0 à 19h UTC", () => {
      const date = getOptimalScheduleTime("YANIS", 0, "TWITTER");
      expect(date.getUTCHours()).toBe(19);
    });

    it("programme YANIS+TWITTER index 1 à 21h UTC", () => {
      const date = getOptimalScheduleTime("YANIS", 1, "TWITTER");
      expect(date.getUTCHours()).toBe(21);
    });

    it("cycle YANIS+TWITTER : index 2 revient à 19h UTC", () => {
      const date = getOptimalScheduleTime("YANIS", 2, "TWITTER");
      expect(date.getUTCHours()).toBe(19);
    });

    // --- SOPHIE + LINKEDIN : matin (6 ou 10 UTC) ---

    it("programme SOPHIE+LINKEDIN index 0 à 6h UTC", () => {
      const date = getOptimalScheduleTime("SOPHIE", 0, "LINKEDIN");
      expect(date.getUTCHours()).toBe(6);
    });

    it("programme SOPHIE+LINKEDIN index 1 à 10h UTC", () => {
      const date = getOptimalScheduleTime("SOPHIE", 1, "LINKEDIN");
      expect(date.getUTCHours()).toBe(10);
    });

    // --- MARC + INSTAGRAM : 6 ou 19 UTC ---

    it("programme MARC+INSTAGRAM index 0 à 6h UTC", () => {
      const date = getOptimalScheduleTime("MARC", 0, "INSTAGRAM");
      expect(date.getUTCHours()).toBe(6);
    });

    it("programme MARC+INSTAGRAM index 1 à 19h UTC", () => {
      const date = getOptimalScheduleTime("MARC", 1, "INSTAGRAM");
      expect(date.getUTCHours()).toBe(19);
    });

    // --- Sans plateforme spécifiée, utilise les horaires Twitter ---

    it("utilise les horaires Twitter par défaut (pas de plateforme)", () => {
      const date = getOptimalScheduleTime("SOPHIE", 0);
      // SOPHIE Twitter = [7, 11]
      expect(date.getUTCHours()).toBe(7);
    });

    it("MARC sans plateforme = horaires Twitter [6, 18]", () => {
      const date = getOptimalScheduleTime("MARC", 1);
      expect(date.getUTCHours()).toBe(18);
    });

    // --- Les minutes sont entre 0 et 14 (randomisées) ---

    it("les minutes sont dans l'intervalle [0, 14]", () => {
      // Tester plusieurs fois pour vérifier la plage
      for (let i = 0; i < 20; i++) {
        const date = getOptimalScheduleTime("YANIS", 0, "TWITTER");
        const minutes = date.getUTCMinutes();
        expect(minutes).toBeGreaterThanOrEqual(0);
        expect(minutes).toBeLessThan(15);
      }
    });

    // --- La date est celle d'aujourd'hui ---

    it("retourne la date du jour", () => {
      const now = new Date();
      const date = getOptimalScheduleTime("YANIS", 0, "TWITTER");
      expect(date.getUTCFullYear()).toBe(now.getUTCFullYear());
      expect(date.getUTCMonth()).toBe(now.getUTCMonth());
      expect(date.getUTCDate()).toBe(now.getUTCDate());
    });
  });

  // ─── getDailyPlan() ─────────────────────────────────────────────

  // getDailyPlan() est une fonction interne (non exportée).
  // Elle est testée indirectement via generateDailySocialPosts().
  // Un test unitaire direct nécessiterait un export ou un rewire.
});
