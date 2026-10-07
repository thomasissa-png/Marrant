/**
 * Offre Premium (décisions Thomas, 03/10/2026) : config alignée sur le seed,
 * retour à l'intention d'origine (returnTo) et aperçu des étapes verrouillées.
 */
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";
import { PREMIUM_PARCOURS } from "@/config/premium";
import {
  buildAbonnementUrl,
  getPostPaymentDestination,
  sanitizeReturnTo,
} from "@/lib/premium-return";
import { firstSentence, redactParcoursForPlan, type ParcoursStepPayload } from "@/lib/parcours-preview";

describe("config/premium : parcours vendus = parcours du seed", () => {
  it("mêmes slugs, mêmes rythmes hebdomadaires (aucun chiffre inventé)", () => {
    const fromSeed = parcoursSeed.map((p) => ({ slug: p.slug, timePerWeek: p.timePerWeek }));
    expect(PREMIUM_PARCOURS.map((p) => ({ slug: p.slug, timePerWeek: p.timePerWeek }))).toEqual(fromSeed);
  });
});

describe("sanitizeReturnTo", () => {
  it.each(["/parcours/repartie", "/parcours", "/vannes?page=2", "/vannes/une-vanne#chute"])(
    "accepte le chemin interne %s",
    (path) => expect(sanitizeReturnTo(path)).toBe(path),
  );

  it.each([
    "https://evil.example",
    "//evil.example/x",
    "javascript:alert(1)",
    "/\\evil",
    "/abonnement",
    "/abonnement/success",
    "/api/stripe/checkout",
    "/login",
    "",
    null,
    undefined,
  ])("refuse %s", (value) => expect(sanitizeReturnTo(value as string | null | undefined)).toBeNull());
});

describe("getPostPaymentDestination", () => {
  it("intention d'origine + message de bienvenue", () => {
    expect(getPostPaymentDestination("/parcours/repartie")).toBe("/parcours/repartie?premium=bienvenue");
    expect(getPostPaymentDestination("/vannes?page=2")).toBe("/vannes?page=2&premium=bienvenue");
    expect(getPostPaymentDestination("/vannes/x#chute")).toBe("/vannes/x?premium=bienvenue#chute");
  });

  it("sans intention valable : /parcours avec bienvenue (jamais /vannes par défaut)", () => {
    expect(getPostPaymentDestination(null)).toBe("/parcours?premium=bienvenue");
    expect(getPostPaymentDestination("https://evil.example")).toBe("/parcours?premium=bienvenue");
  });
});

describe("buildAbonnementUrl", () => {
  it("encode l'intention ou renvoie /abonnement seul", () => {
    expect(buildAbonnementUrl("/parcours/confiance")).toBe("/abonnement?returnTo=%2Fparcours%2Fconfiance");
    expect(buildAbonnementUrl("//evil.example")).toBe("/abonnement");
    expect(buildAbonnementUrl(null)).toBe("/abonnement");
  });
});

describe("parcours-preview", () => {
  it("firstSentence garde une seule phrase", () => {
    expect(firstSentence("Rire de toi. Le reste suit ! Encore.")).toBe("Rire de toi.");
    expect(firstSentence("Sans ponctuation finale")).toBe("Sans ponctuation finale");
    expect(firstSentence(undefined)).toBe("");
  });

  const step = (order: number): ParcoursStepPayload => ({
    id: `s${order}`,
    order,
    tip: { id: "t", title: "T", content: "C", category: "G", difficulty: "D", example: "E", exercise: "X" },
    moduleTitle: "Titre",
    moduleDetail: "Détail",
    moduleFormat: "Format",
    moduleXp: 75,
    why: "Une phrase. Une autre.",
    jokeIds: [1],
    videos: [{}],
    quiz: [{}],
  });

  it("Premium : rien n'est retiré ; sinon étapes 2+ en aperçu, sans muter l'entrée", () => {
    const path = { steps: [step(1), step(2)] };
    expect(redactParcoursForPlan(path, "PREMIUM")).toEqual(path);
    const free = redactParcoursForPlan(path, "FREE");
    expect(free.steps[0]).toEqual(step(1));
    expect(free.steps[1]).toMatchObject({ locked: true, why: "Une phrase.", jokeIds: [], videos: [], quiz: [] });
    // D1 s17 : « ce qu'on apprend » fait partie de l'aperçu (déjà public sur /parcours).
    expect(free.steps[1].moduleDetail).toBe("Détail");
    expect(path.steps[1].tip.content).toBe("C");
  });
});
