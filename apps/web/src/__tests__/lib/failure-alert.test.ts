/**
 * @jest-environment node
 *
 * Tests — lib/ai/failure-alert.ts
 *
 * Environnement node : le SDK Anthropic 0.129 utilise `TextEncoder` au chargement
 * du module (side-effect via `middleware.ts` interne au SDK). En jsdom `TextEncoder`
 * n'est pas exposé → l'import du SDK crash. Un env node résout ça sans polyfill.
 *
 * Couvre :
 *   - Classification des erreurs (NotFoundError, AuthenticationError,
 *     PermissionDeniedError, BadRequestError avec/sans crédit, APIError 402)
 *   - Throttling 24h via JobLock (première alerte OK, deuxième bloquée)
 *   - Silent-fail total sur erreur DB / erreur envoi email
 *   - BadRequest sans crédit → unknown_non_retryable (alerte throttlée 24 h)
 */

// ─── Mocks — factories inline pour éviter le hoisting Jest ─────────────

jest.mock("@/lib/prisma", () => ({
  prisma: {
    jobLock: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      create: jest.fn().mockResolvedValue({ id: "lock-1" }),
    },
  },
}));

jest.mock("@/lib/email", () => ({
  sendAdminAlert: jest.fn().mockResolvedValue(undefined),
}));

// ─── Silence console pour garder la sortie de test propre ─────────────

const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});
afterAll(() => {
  console.warn = originalWarn;
});

import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { sendAdminAlert } from "@/lib/email";
import {
  classifyLLMFailure,
  notifyLLMFailure,
} from "@/lib/ai/failure-alert";
import { LlmRefusalError } from "@/lib/ai/client";

const mockDeleteMany = prisma.jobLock.deleteMany as jest.Mock;
const mockCreate = prisma.jobLock.create as jest.Mock;
const mockSend = sendAdminAlert as jest.Mock;

beforeEach(() => {
  mockDeleteMany.mockReset();
  mockDeleteMany.mockResolvedValue({ count: 0 });
  mockCreate.mockReset();
  mockCreate.mockResolvedValue({ id: "lock-1" });
  mockSend.mockReset();
  mockSend.mockResolvedValue(undefined);
  (console.warn as jest.Mock).mockClear();
});

// ─── Helpers pour instancier les erreurs SDK sans vrai payload ────────

function buildAnthropicError<T extends new (...args: never[]) => Error>(
  Ctor: T,
  message: string,
): InstanceType<T> {
  const err = Object.create(Ctor.prototype) as InstanceType<T>;
  (err as unknown as { message: string }).message = message;
  return err;
}

describe("classifyLLMFailure — mapping typé", () => {
  it("mappe NotFoundError → model_not_found", () => {
    const err = buildAnthropicError(
      Anthropic.NotFoundError,
      "model not found: claude-sonnet-4-20250514",
    );
    expect(classifyLLMFailure(err)).toBe("model_not_found");
  });

  it("mappe AuthenticationError → authentication", () => {
    const err = buildAnthropicError(Anthropic.AuthenticationError, "invalid x-api-key");
    expect(classifyLLMFailure(err)).toBe("authentication");
  });

  it("mappe PermissionDeniedError → permission", () => {
    const err = buildAnthropicError(Anthropic.PermissionDeniedError, "forbidden");
    expect(classifyLLMFailure(err)).toBe("permission");
  });

  it("mappe BadRequestError avec 'credit' dans le message → credit", () => {
    const err = buildAnthropicError(
      Anthropic.BadRequestError,
      "Your credit balance is too low to access the Claude API",
    );
    expect(classifyLLMFailure(err)).toBe("credit");
  });

  it("mappe BadRequestError avec 'quota' → credit", () => {
    const err = buildAnthropicError(Anthropic.BadRequestError, "quota exceeded");
    expect(classifyLLMFailure(err)).toBe("credit");
  });

  it("mappe un BadRequestError non-crédit → unknown_non_retryable (relecture s11 : un 400 systématique casse tout le pipeline en silence)", () => {
    const err = buildAnthropicError(
      Anthropic.BadRequestError,
      "temperature: not supported for this model",
    );
    expect(classifyLLMFailure(err)).toBe("unknown_non_retryable");
  });

  it("ne mappe PAS une erreur réseau générique → null", () => {
    const err = new Error("ECONNRESET");
    expect(classifyLLMFailure(err)).toBeNull();
  });

  it("ne mappe PAS une erreur inconnue non-typée → null", () => {
    expect(classifyLLMFailure("string error")).toBeNull();
    expect(classifyLLMFailure(null)).toBeNull();
  });

  it("ne mappe PAS un LlmRefusalError → null (refus modèle isolé, pas une panne)", () => {
    // Un refus est du feedback modèle, pas une panne structurelle.
    // Alerter dessus produirait du bruit et masquerait les vraies pannes.
    expect(classifyLLMFailure(new LlmRefusalError("safety"))).toBeNull();
    expect(classifyLLMFailure(new LlmRefusalError(null))).toBeNull();
  });
});

describe("notifyLLMFailure — throttling + envoi email", () => {
  it("envoie une alerte quand JobLock accepte la clé (première fois)", async () => {
    const err = buildAnthropicError(
      Anthropic.NotFoundError,
      "model not found",
    );

    await notifyLLMFailure({
      error: err,
      model: "claude-sonnet-4-20250514",
      agent: "joke-agent",
      fn: "generateDailyJoke",
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          jobKey: "llm-alert-model_not_found",
        }),
      }),
    );
    expect(mockSend).toHaveBeenCalledTimes(1);
    const [subject, body] = mockSend.mock.calls[0];
    expect(subject).toContain("Modèle LLM introuvable");
    expect(body).toContain("claude-sonnet-4-20250514");
    expect(body).toContain("joke-agent");
    expect(body).toContain("generateDailyJoke");
  });

  it("n'envoie PAS d'alerte quand JobLock rejette (deuxième fois <24h)", async () => {
    const err = buildAnthropicError(
      Anthropic.AuthenticationError,
      "invalid api key",
    );

    // Simule qu'un lock actif existe déjà → create échoue avec P2002
    mockCreate.mockRejectedValueOnce(
      Object.assign(new Error("unique constraint"), { code: "P2002" }),
    );

    await notifyLLMFailure({
      error: err,
      model: "claude-sonnet-4-5",
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("n'envoie PAS d'alerte pour une erreur non-structurelle", async () => {
    await notifyLLMFailure({
      error: new Error("random network hiccup"),
      model: "claude-sonnet-5-5",
    });

    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("n'envoie PAS d'alerte pour un LlmRefusalError (refus modèle isolé)", async () => {
    await notifyLLMFailure({
      error: new LlmRefusalError("hate_speech"),
      model: "claude-sonnet-5-5",
      agent: "joke-agent",
      fn: "generateDailyJoke",
    });

    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("silent-fail si prisma.jobLock crash — pas de re-throw", async () => {
    const err = buildAnthropicError(
      Anthropic.NotFoundError,
      "model missing",
    );
    mockDeleteMany.mockRejectedValueOnce(new Error("DB down"));
    mockCreate.mockRejectedValueOnce(new Error("DB down"));

    // Ne doit PAS throw même si la DB crash
    await expect(
      notifyLLMFailure({ error: err, model: "x" }),
    ).resolves.toBeUndefined();

    expect(mockSend).not.toHaveBeenCalled();
  });

  it("silent-fail si sendAdminAlert crash — pas de re-throw", async () => {
    const err = buildAnthropicError(
      Anthropic.PermissionDeniedError,
      "forbidden",
    );
    mockSend.mockRejectedValueOnce(new Error("Resend 500"));

    await expect(
      notifyLLMFailure({ error: err, model: "x" }),
    ).resolves.toBeUndefined();

    // Un warning console doit être émis pour investigation
    expect(console.warn).toHaveBeenCalled();
  });

  it("utilise des clés de throttling distinctes par type d'erreur", async () => {
    const auth = buildAnthropicError(Anthropic.AuthenticationError, "auth");
    const notFound = buildAnthropicError(Anthropic.NotFoundError, "missing");

    await notifyLLMFailure({ error: auth, model: "x" });
    await notifyLLMFailure({ error: notFound, model: "x" });

    expect(mockCreate).toHaveBeenCalledTimes(2);
    const keys = mockCreate.mock.calls.map((call) => call[0].data.jobKey);
    expect(keys).toContain("llm-alert-authentication");
    expect(keys).toContain("llm-alert-model_not_found");
    expect(mockSend).toHaveBeenCalledTimes(2);
  });
});
