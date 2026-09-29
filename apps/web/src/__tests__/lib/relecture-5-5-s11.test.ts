/**
 * @jest-environment node
 *
 * Relecture de code s11 (migration 5.5) — non-régression des correctifs :
 *  - isRetryableError : statut HTTP prioritaire sur le texte du message ;
 *  - classifyLLMFailure : un 400 non-crédit est alerté (pipeline cassé en silence sinon) ;
 *  - G-J11 : « l’IA » avec apostrophe typographique détecté ;
 *  - G-B22 : « Jean-Claude » (prénom composé) n'est pas une mention d'IA.
 */
import Anthropic from "@anthropic-ai/sdk";
import { isRetryableError } from "@/lib/ai/client";
import { classifyLLMFailure } from "@/lib/ai/failure-alert";
import { runBlogGates, runJokeGates } from "@/lib/ai/agents/standup-director-agent";

jest.mock("@/lib/prisma", () => ({ prisma: {} }));

function apiError(status: number, requestId: string, message = "not_found_error") {
  return Anthropic.APIError.generate(
    status,
    { type: "error", error: { type: message, message: "model: claude-sonnet-5-5" }, request_id: requestId },
    undefined,
    new Headers(),
  );
}

describe("isRetryableError — statut HTTP prioritaire", () => {
  it("404 dont le request_id contient « 500 » → NON retentée", () => {
    const err = apiError(404, "req_011CV500aZ429xyz");
    expect(err.message).toContain("500");
    expect(isRetryableError(err)).toBe(false);
  });

  it("400 dont le message contient « 429 » → NON retentée", () => {
    expect(isRetryableError(apiError(400, "req_429", "invalid_request_error"))).toBe(false);
  });

  it.each([429, 500, 529])("statut %i → retentée", (status) => {
    expect(isRetryableError(apiError(status, "req_abc"))).toBe(true);
  });

  it("erreur réseau sans statut → retentée (repli sur le message)", () => {
    expect(isRetryableError(new Error("fetch failed: ECONNRESET"))).toBe(true);
  });
});

describe("classifyLLMFailure — 400 non-crédit alerté", () => {
  it("400 paramètre refusé → unknown_non_retryable", () => {
    expect(classifyLLMFailure(apiError(400, "req_x", "invalid_request_error"))).toBe(
      "unknown_non_retryable",
    );
  });

  it("400 crédit épuisé → credit (inchangé)", () => {
    const err = Anthropic.APIError.generate(
      400,
      { type: "error", error: { type: "invalid_request_error", message: "Your credit balance is too low" } },
      undefined,
      new Headers(),
    );
    expect(classifyLLMFailure(err)).toBe("credit");
  });
});

describe("G-J11 — apostrophe typographique", () => {
  it("FAIL sur « l’IA » (U+2019)", () => {
    const gates = runJokeGates({
      content: "J'ai demandé conseil à mon pote hier soir.",
      punchline: "Il a laissé l’IA répondre.",
      category: "AUTODERISION",
      type: "STORY",
      maturityLevel: 1,
    });
    expect(gates.find((g) => g.gate === "G-J11 Anti-mention IA")?.pass).toBe(false);
  });
});

describe("G-B22 — prénoms composés", () => {
  const base = {
    title: "Titre",
    slug: "s",
    excerpt: "e",
    targetKeyword: "devenir drôle",
  };
  const gate = (content: string) =>
    runBlogGates({ ...base, content }).find((g) => g.gate.startsWith("G-B22"));

  it("PASS sur « Jean-Claude Dusse » (Les Bronzés)", () => {
    expect(gate("Comme Jean-Claude Dusse, tu tentes ta chance sur un malentendu.")?.pass).toBe(true);
  });

  it("FAIL toujours sur « Claude » seul (assistant)", () => {
    expect(gate("Selon Claude, cette technique fonctionne.")?.pass).toBe(false);
  });
});
