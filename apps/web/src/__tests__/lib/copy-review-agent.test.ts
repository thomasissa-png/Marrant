/**
 * @jest-environment node
 *
 * Tests — Copy Review Agent (s11 charte refonte copy) :
 * `reviewJoke`, `reviewTip`, `applyDoubtFallback` + normalisation verdicts.
 */
const mockCallWithRetry = jest.fn();
const mockGetResponseText = jest.fn();
const mockExtractJson = jest.fn();

jest.mock("@/lib/ai/client", () => ({
  anthropic: {},
  SONNET_MODEL: "claude-sonnet-mock",
  buildCachedSystemBlock: (text: string) => ({ type: "text", text, cache_control: { type: "ephemeral" } }),
  callWithRetry: (...args: unknown[]) => mockCallWithRetry(...args),
  getResponseText: (...args: unknown[]) => mockGetResponseText(...args),
  extractJson: (...args: unknown[]) => mockExtractJson(...args),
}));

import {
  reviewJoke,
  reviewTip,
  applyDoubtFallback,
  ALLOWED_RETIRER_REASONS,
} from "@/lib/ai/agents/copy-review-agent";

const JOKE_INPUT = {
  content: "J'ai attendu le bus 20 min sous la pluie.",
  punchline: "Il était à l'arrêt d'en face.",
  category: "OBSERVATIONNEL",
  type: "STORY",
  comedyTechnique: null,
  techniqueExplanation: null,
  howToApply: null,
};

const TIP_INPUT = {
  title: "Le silence après le rire",
  content: "Attends 5 secondes sans rien dire.",
  example: "Tu dis : « J'ai commencé la muscu. » Silence. Ton pote rit.",
  exercise: "DÉFI SILENCE : impose-toi 5 secondes.",
  category: "TIMING",
  difficulty: "DEBUTANT",
};

beforeEach(() => {
  mockCallWithRetry.mockReset();
  mockGetResponseText.mockReset();
  mockExtractJson.mockReset();
  mockCallWithRetry.mockResolvedValue({ content: [{ type: "text", text: "{}" }] });
  mockGetResponseText.mockReturnValue("{}");
});

describe("applyDoubtFallback", () => {
  it("laisse passer GARDER", () => {
    expect(applyDoubtFallback({ verdict: "GARDER", reason: "ok" })).toEqual({
      verdict: "GARDER",
      reason: "ok",
    });
  });

  it("laisse passer REECRIRE (indépendant de la raison)", () => {
    expect(applyDoubtFallback({ verdict: "REECRIRE", reason: "un truc" }).verdict).toBe(
      "REECRIRE",
    );
  });

  it("force GARDER si RETIRER sans raison de la liste fermée", () => {
    const r = applyDoubtFallback({ verdict: "RETIRER", reason: "je préfère pas" });
    expect(r.verdict).toBe("GARDER");
    expect(r.reason).toMatch(/Garde-fou fondateur/);
  });

  it.each(ALLOWED_RETIRER_REASONS.map((r) => [r]))(
    "laisse passer RETIRER avec raison fermée : %s",
    (allowed) => {
      const r = applyDoubtFallback({ verdict: "RETIRER", reason: `Raison : ${allowed}.` });
      expect(r.verdict).toBe("RETIRER");
    },
  );
});

describe("reviewJoke", () => {
  it("normalise 'RÉÉCRIRE' → 'REECRIRE' et exige la réécriture complète", async () => {
    mockExtractJson.mockReturnValue({
      verdict: "RÉÉCRIRE",
      reason: "Idée bonne, exécution tiède.",
      rewritten: {
        content: "J'ai attendu le bus 20 min.",
        punchline: "Le bus m'a vu et il a accéléré.",
        comedyTechnique: "La personnification",
        techniqueExplanation: "Tu prêtes une intention au bus.",
        howToApply: "Prends un objet, donne-lui un mobile.",
      },
    });

    const result = await reviewJoke(JOKE_INPUT);
    expect(result.verdict).toBe("REECRIRE");
    expect(result.rewritten?.punchline).toMatch(/bus m'a vu/);
  });

  // Lot Q2 (s14, barre Alexa) : pour une vanne, le doute mène à REECRIRE,
  // plus jamais à GARDER. Sans réécriture exploitable, l'original reste
  // marqué REECRIRE (hors vanne du jour).
  it("réécriture incomplète → REECRIRE sans réécriture (garde-fou, jamais GARDER)", async () => {
    mockExtractJson.mockReturnValue({
      verdict: "REECRIRE",
      reason: "Test",
      rewritten: { content: "un setup", punchline: "" },
    });
    const result = await reviewJoke(JOKE_INPUT);
    expect(result.verdict).toBe("REECRIRE");
    expect(result.rewritten).toBeUndefined();
    expect(result.reason).toMatch(/Garde-fou/);
  });

  it("RETIRER hors liste fermée → REECRIRE (doute = réécrire, jamais GARDER)", async () => {
    mockExtractJson.mockReturnValue({
      verdict: "RETIRER",
      reason: "elle me plaît pas trop",
    });
    const result = await reviewJoke(JOKE_INPUT);
    expect(result.verdict).toBe("REECRIRE");
    expect(result.rewritten).toBeUndefined();
  });

  it("le prompt vannes embarque la barre des étalons et la règle doute = REECRIRE", async () => {
    mockExtractJson.mockReturnValue({ verdict: "GARDER", reason: "Au niveau." });
    await reviewJoke(JOKE_INPUT);
    const call = mockCallWithRetry.mock.calls[mockCallWithRetry.mock.calls.length - 1][0];
    const system = JSON.stringify(call.system);
    expect(system).toContain("Elle m'a lu mon historique de recherches.");
    expect(system).toContain("si tu hésites entre GARDER et REECRIRE → REECRIRE");
    expect(JSON.stringify(call.messages)).toContain("en cas de doute, REECRIRE");
  });

  it("laisse passer RETIRER quand la raison est 'calembour phonétique'", async () => {
    mockExtractJson.mockReturnValue({
      verdict: "RETIRER",
      reason: "Calembour phonétique évident (coup de foudre / qui coulait).",
    });
    const result = await reviewJoke(JOKE_INPUT);
    expect(result.verdict).toBe("RETIRER");
  });

  it("verdict invalide → REECRIRE par défaut (doute)", async () => {
    mockExtractJson.mockReturnValue({ verdict: "MEH", reason: "" });
    const result = await reviewJoke(JOKE_INPUT);
    expect(result.verdict).toBe("REECRIRE");
    expect(result.rewritten).toBeUndefined();
  });
});

describe("reviewTip", () => {
  it("normalise 'GARDER' et retourne le reason", async () => {
    mockExtractJson.mockReturnValue({ verdict: "GARDER", reason: "Respecte la charte." });
    const result = await reviewTip(TIP_INPUT);
    expect(result.verdict).toBe("GARDER");
    expect(result.reason).toMatch(/charte/);
  });

  it("REECRIRE tip : exige les 4 champs, sinon fallback GARDER", async () => {
    mockExtractJson.mockReturnValue({
      verdict: "REECRIRE",
      reason: "Reformulation.",
      rewritten: { title: "Nouveau", content: "Corps.", example: "Un exemple.", exercise: "" },
    });
    const result = await reviewTip(TIP_INPUT);
    expect(result.verdict).toBe("GARDER");
  });

  it("REECRIRE tip complet passe", async () => {
    mockExtractJson.mockReturnValue({
      verdict: "REECRIRE",
      reason: "Reformulation.",
      rewritten: {
        title: "Nouveau titre",
        content: "Nouveau contenu.",
        example: "Nouvel exemple avec dialogue : « Salut. » « Salut. »",
        exercise: "DÉFI TEST : fais ça.",
      },
    });
    const result = await reviewTip(TIP_INPUT);
    expect(result.verdict).toBe("REECRIRE");
    expect(result.rewritten?.title).toBe("Nouveau titre");
  });
});
