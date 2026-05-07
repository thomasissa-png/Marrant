/**
 * Helper Jest factorisé — mocks Anthropic SDK pour les tests CEO (Groupes 1, 5, 6).
 *
 * Objectif : éviter de dupliquer la structure de réponse Anthropic
 * `{ content: [{ type: "text", text: ... }], usage: {...} }` dans chaque
 * fichier de test. 4 modèles utilisés par le CEO Agent :
 *  - Haiku 4.5 (`claude-haiku-4-5-20251001`) : triageOpportunity
 *  - Sonnet 4.6 (default `SONNET_MODEL`) : composeOutboundMessage, draftBacklinkPitch
 *  - Opus 4.7 (`claude-opus-4-6` côté CEO_OPUS_MODEL) : runWeeklyReport
 *
 * Usage type au top d'un fichier de test :
 *   const mockMessagesCreate = jest.fn();
 *   jest.mock("@anthropic-ai/sdk", () => jest.fn().mockImplementation(() => ({
 *     messages: { create: mockMessagesCreate },
 *   })));
 *   // puis dans le test :
 *   mockMessagesCreate.mockResolvedValueOnce(mockHaikuResponse({ score: 8, ... }));
 *
 * Chaque helper retourne un objet conforme au type Anthropic `Message`
 * (champ `content` typé `[{ type: "text", text: string }]` + `usage` complet).
 */

export interface MockUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
}

const DEFAULT_USAGE: MockUsage = {
  input_tokens: 100,
  output_tokens: 50,
  cache_read_input_tokens: 0,
  cache_creation_input_tokens: 0,
};

/**
 * Construit un objet `Message` Anthropic mocké à partir d'un payload.
 * - `payload` string  → `text` direct (pour rapport markdown Opus)
 * - `payload` object  → `JSON.stringify(payload)` (pour Haiku/Sonnet JSON strict)
 */
export function mockAnthropicResponse(
  payload: unknown,
  opts?: { model?: string; usage?: Partial<MockUsage> },
): Record<string, unknown> {
  const text = typeof payload === "string" ? payload : JSON.stringify(payload);
  return {
    id: `msg_${Math.random().toString(36).slice(2, 10)}`,
    type: "message",
    role: "assistant",
    model: opts?.model ?? "claude-sonnet-4-6",
    stop_reason: "end_turn",
    stop_sequence: null,
    content: [{ type: "text", text }],
    usage: { ...DEFAULT_USAGE, ...(opts?.usage ?? {}) },
  };
}

/** Réponse Haiku 4.5 (triage : score+topic+intent+playbook). */
export function mockHaikuResponse(payload: unknown): Record<string, unknown> {
  return mockAnthropicResponse(payload, {
    model: "claude-haiku-4-5-20251001",
    usage: { input_tokens: 200, output_tokens: 80 },
  });
}

/** Réponse Sonnet 4.6 (compose / draft pitch / validation). */
export function mockSonnetResponse(payload: unknown): Record<string, unknown> {
  return mockAnthropicResponse(payload, {
    model: "claude-sonnet-4-6",
    usage: {
      input_tokens: 1500,
      output_tokens: 400,
      cache_read_input_tokens: 1200, // 90% cache hit typique sur prompt cached
    },
  });
}

/** Réponse Opus 4.7 (rapport hebdo, markdown). */
export function mockOpusResponse(markdown: string): Record<string, unknown> {
  return mockAnthropicResponse(markdown, {
    model: "claude-opus-4-6",
    usage: { input_tokens: 800, output_tokens: 1200 },
  });
}

/** Payload triage par défaut (score 8, devrait répondre, P5). */
export function defaultTriagePayload(overrides: Record<string, unknown> = {}) {
  return {
    score: 8,
    topic: "repartie",
    intent: "demande_aide",
    should_respond: true,
    playbook: "P5",
    reasoning: "Demande directe sur la répartie en soirée — match thème core.",
    ...overrides,
  };
}

/** Payload draft par défaut (subject+body+reasoning_short+citations_used). */
export function defaultDraftPayload(overrides: Record<string, unknown> = {}) {
  return {
    subject: "Un message de Deviens Marrant",
    body: "Salut, on a vu que tu progressais bien sur ta répartie. On peut te partager une vidéo si tu as envie d'aller plus loin.\n\nL'Équipe Deviens Marrant",
    reasoning_short: "Calibré étalon 1 Thomas — tutoiement + invitation soft.",
    citations_used: [],
    ...overrides,
  };
}

/**
 * Verdict Director par défaut. À utiliser comme retour mocké de
 * `validateCeoOutbound` (Groupe 1 / Groupe 3).
 */
export function defaultDirectorVerdict(
  verdict: "APPROVED" | "NEEDS_REVISION" | "REJECTED" = "APPROVED",
  score?: number,
) {
  const defaultScore = verdict === "APPROVED" ? 9 : verdict === "REJECTED" ? 4 : 7;
  return {
    verdict,
    score: score ?? defaultScore,
    directorNote: `Director ${verdict} — score ${score ?? defaultScore}/10`,
  };
}
