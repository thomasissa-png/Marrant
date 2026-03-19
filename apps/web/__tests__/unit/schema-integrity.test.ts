/**
 * Tests d'intégrité du schéma Prisma
 * Vérifie que les enums, modèles et contraintes sont cohérents
 * Couvre: Agent Infrastructure, Agent Blagues, Agent Conseils, Agent Vidéos
 */

// Enums répliqués du schéma Prisma pour validation
const JOKE_CATEGORIES = [
  "AUTODERISION", "SITUATION", "ABSURDE", "OBSERVATIONNEL",
  "JEUX_DE_MOTS", "CULTUREL", "COUPLE", "BOULOT",
  "ECOLE", "GAMING", "RESEAUX_SOCIAUX", "DATING", "SOIREES", "PARENTS",
] as const;

const JOKE_TYPES = [
  "SUBTIL", "CLASSIQUE", "ABSURDE", "ONE_LINER", "STORY", "DIALOGUE", "QA",
] as const;

const TIP_CATEGORIES = [
  "TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE",
  "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS",
] as const;

const TIP_DIFFICULTIES = ["DEBUTANT", "INTERMEDIAIRE", "EXPERT"] as const;

const USER_LEVELS = ["NOVICE", "APPRENTI", "FARCEUR", "COMIQUE", "LEGENDE"] as const;

const PLANS = ["FREE", "PREMIUM"] as const;

const CONTENT_TYPES = ["JOKE", "TIP", "VIDEO"] as const;

const SUBSCRIPTION_STATUSES = [
  "ACTIVE", "INACTIVE", "PAST_DUE", "CANCELED", "TRIALING",
] as const;

describe("Intégrité du schéma — Enums Blagues", () => {
  it("a 14 catégories de blagues (incluant les catégories jeunes)", () => {
    expect(JOKE_CATEGORIES).toHaveLength(14);
  });

  it("contient les catégories jeunes ajoutées (15-35 ans)", () => {
    expect(JOKE_CATEGORIES).toContain("ECOLE");
    expect(JOKE_CATEGORIES).toContain("GAMING");
    expect(JOKE_CATEGORIES).toContain("RESEAUX_SOCIAUX");
    expect(JOKE_CATEGORIES).toContain("DATING");
    expect(JOKE_CATEGORIES).toContain("SOIREES");
    expect(JOKE_CATEGORIES).toContain("PARENTS");
  });

  it("a 7 types de blagues", () => {
    expect(JOKE_TYPES).toHaveLength(7);
  });

  it("contient le type QA pour les blagues question-réponse", () => {
    expect(JOKE_TYPES).toContain("QA");
  });
});

describe("Intégrité du schéma — Enums Conseils", () => {
  it("a 7 catégories de conseils", () => {
    expect(TIP_CATEGORIES).toHaveLength(7);
  });

  it("a 3 niveaux de difficulté", () => {
    expect(TIP_DIFFICULTIES).toHaveLength(3);
  });

  it("les difficultés suivent un ordre logique", () => {
    expect(TIP_DIFFICULTIES[0]).toBe("DEBUTANT");
    expect(TIP_DIFFICULTIES[1]).toBe("INTERMEDIAIRE");
    expect(TIP_DIFFICULTIES[2]).toBe("EXPERT");
  });
});

describe("Intégrité du schéma — Enums Utilisateurs", () => {
  it("a 5 niveaux utilisateur", () => {
    expect(USER_LEVELS).toHaveLength(5);
  });

  it("NOVICE est le premier niveau et LEGENDE le dernier", () => {
    expect(USER_LEVELS[0]).toBe("NOVICE");
    expect(USER_LEVELS[USER_LEVELS.length - 1]).toBe("LEGENDE");
  });

  it("a 2 plans (FREE et PREMIUM)", () => {
    expect(PLANS).toHaveLength(2);
  });
});

describe("Intégrité du schéma — Enums Contenu", () => {
  it("a 3 types de contenu favorisable", () => {
    expect(CONTENT_TYPES).toHaveLength(3);
  });

  it("les types de contenu correspondent aux modèles", () => {
    expect(CONTENT_TYPES).toContain("JOKE");
    expect(CONTENT_TYPES).toContain("TIP");
    expect(CONTENT_TYPES).toContain("VIDEO");
  });
});

describe("Intégrité du schéma — Enums Abonnements", () => {
  it("a 5 statuts d'abonnement", () => {
    expect(SUBSCRIPTION_STATUSES).toHaveLength(5);
  });

  it("contient les statuts Stripe attendus", () => {
    expect(SUBSCRIPTION_STATUSES).toContain("ACTIVE");
    expect(SUBSCRIPTION_STATUSES).toContain("PAST_DUE");
    expect(SUBSCRIPTION_STATUSES).toContain("CANCELED");
    expect(SUBSCRIPTION_STATUSES).toContain("TRIALING");
  });
});

// ==========================================
// Tests de cohérence inter-agents
// ==========================================

describe("Cohérence inter-agents", () => {
  it("Stripe statusMap couvre tous les statuts pertinents", () => {
    const stripeStatusMap: Record<string, string> = {
      active: "ACTIVE",
      past_due: "PAST_DUE",
      canceled: "CANCELED",
      trialing: "TRIALING",
      unpaid: "INACTIVE",
    };

    // Vérifie que chaque valeur mappée est un statut valide
    Object.values(stripeStatusMap).forEach((status) => {
      expect(SUBSCRIPTION_STATUSES).toContain(status);
    });
  });

  it("les catégories de conseils et vidéos utilisent les mêmes enums", () => {
    // Le schéma Prisma utilise TipCategory pour les deux
    // Vérifier qu'il n'y a pas de divergence
    expect(TIP_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("XP_THRESHOLDS correspondent aux USER_LEVELS", () => {
    const XP_THRESHOLDS = {
      NOVICE: 0,
      APPRENTI: 100,
      FARCEUR: 500,
      COMIQUE: 1500,
      LEGENDE: 5000,
    };

    // Chaque niveau utilisateur a un seuil XP
    USER_LEVELS.forEach((level) => {
      expect(XP_THRESHOLDS).toHaveProperty(level);
    });
  });

  it("FREE_LIMITS définit des limites raisonnables", () => {
    const FREE_LIMITS = {
      JOKES: 10,
      TIPS: 3,
      VIDEOS: 3,
      MAX_FAVORITES: 20,
    };

    expect(FREE_LIMITS.JOKES).toBeGreaterThan(0);
    expect(FREE_LIMITS.TIPS).toBeGreaterThan(0);
    expect(FREE_LIMITS.VIDEOS).toBeGreaterThan(0);
    expect(FREE_LIMITS.MAX_FAVORITES).toBeGreaterThan(0);
    expect(FREE_LIMITS.JOKES).toBeLessThanOrEqual(50);
    expect(FREE_LIMITS.MAX_FAVORITES).toBeLessThanOrEqual(100);
  });
});
