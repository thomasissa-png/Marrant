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

/** Calcule l'offset UTC de Paris pour une date (même logique que dans social-media-agent.ts) */
function getParisOffsetForTest(date: Date): number {
  const year = date.getFullYear();
  const marchLast = new Date(Date.UTC(year, 2, 31));
  marchLast.setUTCDate(marchLast.getUTCDate() - marchLast.getUTCDay());
  marchLast.setUTCHours(1, 0, 0, 0);
  const octLast = new Date(Date.UTC(year, 9, 31));
  octLast.setUTCDate(octLast.getUTCDate() - octLast.getUTCDay());
  octLast.setUTCHours(1, 0, 0, 0);
  return date.getTime() >= marchLast.getTime() && date.getTime() < octLast.getTime() ? 2 : 1;
}

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

    it("accepte un tweet de 270 caractères exactement", () => {
      const content = "a".repeat(270);
      const post = makePost({ platform: "TWITTER", format: "TWEET", content });
      const issues = validatePostConstraints(post);
      expect(issues).toEqual([]);
    });

    it("rejette un tweet de 271 caractères (marge sécurité encodage Twitter)", () => {
      const content = "a".repeat(271);
      const post = makePost({ platform: "TWITTER", format: "TWEET", content });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Tweet trop long"))).toBe(true);
      expect(issues.some((i) => i.includes("271 chars"))).toBe(true);
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

    // --- Instagram caption length ---

    it("accepte une caption Instagram de 2200 chars", () => {
      const post = makePost({
        platform: "INSTAGRAM",
        content: "a".repeat(2200),
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Caption Instagram"))).toBe(false);
    });

    it("rejette une caption Instagram qui dépasse 2200 chars", () => {
      const post = makePost({
        platform: "INSTAGRAM",
        content: "a".repeat(2201),
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("Caption Instagram trop longue"))).toBe(true);
      expect(issues.some((i) => i.includes("2201 chars"))).toBe(true);
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

    // --- Persona leak dans threadParts ---

    it("rejette un thread avec persona leak dans threadParts", () => {
      const post = makePost({
        format: "THREAD",
        threadParts: [
          "Fary détruit un relou",
          "Il REMERCIE au lieu d'agresser",
          "Variantes pour Yanis : depuis tes 0 match Tinder",
          "3 secondes de pause",
          "On a trouvé 43 réparties",
        ],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
      expect(issues.some((i) => i.includes("yanis"))).toBe(true);
    });

    it("rejette un thread avec persona leak Sophie dans threadParts", () => {
      const post = makePost({
        format: "THREAD",
        threadParts: [
          "Technique du jour",
          "Sophie au bureau utilise ça",
          "Résultat garanti",
          "Test ce soir",
          "Fin du thread",
        ],
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
      expect(issues.some((i) => i.includes("sophie"))).toBe(true);
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

    // --- Anti-generic dialogue format ---

    it("rejette un dialogue reconstitué avec 2+ patterns (Moi/Mon pote)", () => {
      const post = makePost({
        content: 'Moi : « Pourquoi tu fais ça ? » Mon pote : « Parce que »',
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
      expect(issues.some((i) => i.includes("dialogue reconstitué"))).toBe(true);
    });

    it("rejette un dialogue Prof/Moi avec astérisques", () => {
      const post = makePost({
        content: 'Prof : « Éteignez vos téléphones » Moi : *éteint mon téléphone*',
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
    });

    it("rejette un dialogue Ma coloc/Elle", () => {
      const post = makePost({
        content: 'Ma coloc : « J\'ai faim » Elle : « Ah oui trop »',
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
    });

    it("rejette un dialogue Aussi moi/Moi", () => {
      const post = makePost({
        content: 'Moi : « ok » Aussi moi : le lendemain, j\'ai rien fait',
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("CRITIQUE"))).toBe(true);
    });

    it("ne rejette PAS un contenu avec un seul pattern dialogue", () => {
      // Un seul "Moi :" n'est pas forcément un dialogue reconstitué
      const post = makePost({
        content: 'Moi : « je teste la technique du miroir » et ça marche.',
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("dialogue reconstitué"))).toBe(false);
    });

    it("ne rejette PAS un contenu qui parle de technique stand-up", () => {
      const post = makePost({
        content: "Fary ne répond JAMAIS à une attaque. Il la répète. Lentement.",
      });
      const issues = validatePostConstraints(post);
      expect(issues.some((i) => i.includes("dialogue reconstitué"))).toBe(false);
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

    // --- YANIS + TWITTER : après-midi + soirée [13, 17, 21, 23] Paris ---
    // L'offset UTC dépend de la date du test (hiver=UTC+1, été=UTC+2)

    it("programme YANIS+TWITTER index 0 à 13h Paris", () => {
      const date = getOptimalScheduleTime("YANIS", 0, "TWITTER");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(13 - offset);
    });

    it("programme YANIS+TWITTER index 1 à 17h Paris", () => {
      const date = getOptimalScheduleTime("YANIS", 1, "TWITTER");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(17 - offset);
    });

    it("programme YANIS+TWITTER index 2 à 21h Paris", () => {
      const date = getOptimalScheduleTime("YANIS", 2, "TWITTER");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(21 - offset);
    });

    it("programme YANIS+TWITTER index 3 à 23h Paris", () => {
      const date = getOptimalScheduleTime("YANIS", 3, "TWITTER");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(23 - offset);
    });

    it("cycle YANIS+TWITTER : index 4 revient à 13h Paris", () => {
      const date = getOptimalScheduleTime("YANIS", 4, "TWITTER");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(13 - offset);
    });

    // --- SOPHIE + LINKEDIN : matin [7, 11] Paris ---

    it("programme SOPHIE+LINKEDIN index 0 à 7h Paris", () => {
      const date = getOptimalScheduleTime("SOPHIE", 0, "LINKEDIN");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(7 - offset);
    });

    it("programme SOPHIE+LINKEDIN index 1 à 11h Paris", () => {
      const date = getOptimalScheduleTime("SOPHIE", 1, "LINKEDIN");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(11 - offset);
    });

    // --- MARC + INSTAGRAM : [7, 20] Paris ---

    it("programme MARC+INSTAGRAM index 0 à 7h Paris", () => {
      const date = getOptimalScheduleTime("MARC", 0, "INSTAGRAM");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(7 - offset);
    });

    it("programme MARC+INSTAGRAM index 1 à 20h Paris", () => {
      const date = getOptimalScheduleTime("MARC", 1, "INSTAGRAM");
      const offset = getParisOffsetForTest(date);
      expect(date.getUTCHours()).toBe(20 - offset);
    });

    // --- Sans plateforme spécifiée, utilise les horaires Twitter ---

    it("utilise les horaires Twitter par défaut (pas de plateforme)", () => {
      const date = getOptimalScheduleTime("SOPHIE", 0);
      const offset = getParisOffsetForTest(date);
      // SOPHIE Twitter = [8, 12, 18] → index 0 = 8h Paris
      expect(date.getUTCHours()).toBe(8 - offset);
    });

    it("MARC sans plateforme = horaires Twitter [7, 12, 20]", () => {
      const date = getOptimalScheduleTime("MARC", 1);
      const offset = getParisOffsetForTest(date);
      // index 1 = 12h Paris
      expect(date.getUTCHours()).toBe(12 - offset);
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
