/**
 * @jest-environment node
 *
 * Tests de la route POST /api/newsletter.
 * On mocke Prisma + Resend pour isoler la logique métier.
 * Runtime node requis — NextRequest / Fetch API ne fonctionnent pas en jsdom.
 */

// Prisma mock — jest hoiste jest.mock : on utilise une factory qui expose
// les jest.fn() via `require(...)` après hoisting.
jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterSubscriber: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn().mockResolvedValue({ id: "email-1" }) },
  })),
}));

jest.mock("@/lib/rate-limit", () => ({
  rateLimit: jest.fn().mockReturnValue({
    allowed: true,
    remaining: 4,
    resetAt: Date.now() + 3600_000,
  }),
}));

// Récupération des mocks après hoisting (via jest.requireMock)
const { prisma } = jest.requireMock("@/lib/prisma") as {
  prisma: {
    newsletterSubscriber: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };
};
const prismaSubscriberMock = prisma.newsletterSubscriber;
const { Resend } = jest.requireMock("resend") as { Resend: jest.Mock };

import { NextRequest } from "next/server";
import { POST } from "@/app/api/newsletter/route";

function buildRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost:3000/api/newsletter", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "127.0.0.1",
      "user-agent": "jest-test",
      ...headers,
    },
  });
}

function getResendSendMock(): jest.Mock {
  // Chaque instance Resend crée un nouveau send mock — on prend le plus récent.
  const lastCall = Resend.mock.results[Resend.mock.results.length - 1];
  return lastCall?.value?.emails?.send as jest.Mock;
}

beforeEach(() => {
  prismaSubscriberMock.findUnique.mockReset();
  prismaSubscriberMock.create.mockReset();
  prismaSubscriberMock.update.mockReset();
  Resend.mockClear();
  process.env.RESEND_API_KEY = "re_test_valid_key";
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
});

describe("POST /api/newsletter", () => {
  it("rejette une adresse email invalide (400)", async () => {
    const res = await POST(
      buildRequest({ email: "not-an-email", consent: true }),
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
    expect(prismaSubscriberMock.create).not.toHaveBeenCalled();
  });

  it("rejette si le consentement RGPD n'est pas coché", async () => {
    const res = await POST(
      buildRequest({ email: "test@example.com", consent: false }),
    );
    expect(res.status).toBe(400);
    expect(prismaSubscriberMock.create).not.toHaveBeenCalled();
  });

  it("crée un abonné PENDING et envoie l'email de confirmation", async () => {
    prismaSubscriberMock.findUnique.mockResolvedValue(null);
    prismaSubscriberMock.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      id: "sub-1",
      ...data,
    }));

    const res = await POST(
      buildRequest({
        email: "new@example.com",
        consent: true,
        source: "blog:test",
      }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.pending).toBe(true);
    expect(json.emailSent).toBe(true);
    expect(prismaSubscriberMock.create).toHaveBeenCalledTimes(1);

    const createArg = prismaSubscriberMock.create.mock.calls[0][0].data;
    expect(createArg.email).toBe("new@example.com");
    expect(createArg.status).toBe("PENDING");
    expect(createArg.source).toBe("blog:test");
    expect(createArg.consentText).toContain("technique d'humour");
    expect(createArg.confirmationToken).toMatch(/^[A-Za-z0-9_-]{20,}$/);
    expect(createArg.unsubscribeToken).toMatch(/^[A-Za-z0-9_-]{20,}$/);

    const resendSendMock = getResendSendMock();
    expect(resendSendMock).toHaveBeenCalledTimes(1);
  });

  it("est idempotent : deuxième inscription d'un email déjà CONFIRMED renvoie 200", async () => {
    prismaSubscriberMock.findUnique.mockResolvedValue({
      id: "sub-1",
      email: "already@example.com",
      status: "CONFIRMED",
    });

    const res = await POST(
      buildRequest({ email: "already@example.com", consent: true }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.alreadySubscribed).toBe(true);
    expect(prismaSubscriberMock.create).not.toHaveBeenCalled();
    expect(prismaSubscriberMock.update).not.toHaveBeenCalled();
    expect(Resend).not.toHaveBeenCalled();
  });

  it("réactive un abonné UNSUBSCRIBED (update + renvoi email confirmation)", async () => {
    prismaSubscriberMock.findUnique.mockResolvedValue({
      id: "sub-1",
      email: "back@example.com",
      status: "UNSUBSCRIBED",
      unsubscribeToken: "existing-unsub-token-123456789012345678",
      source: "blog:old",
    });
    prismaSubscriberMock.update.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      id: "sub-1",
      email: "back@example.com",
      unsubscribeToken: "existing-unsub-token-123456789012345678",
      ...data,
    }));

    const res = await POST(
      buildRequest({ email: "back@example.com", consent: true, source: "blog:new" }),
    );

    expect(res.status).toBe(200);
    expect(prismaSubscriberMock.update).toHaveBeenCalledTimes(1);
    expect(prismaSubscriberMock.create).not.toHaveBeenCalled();

    const updateArg = prismaSubscriberMock.update.mock.calls[0][0].data;
    expect(updateArg.status).toBe("PENDING");
    expect(updateArg.source).toBe("blog:new");
    expect(updateArg.confirmationToken).toMatch(/^[A-Za-z0-9_-]{20,}$/);

    expect(getResendSendMock()).toHaveBeenCalledTimes(1);
  });

  it("n'envoie pas d'email si RESEND_API_KEY est un placeholder", async () => {
    process.env.RESEND_API_KEY = "re_dummy";
    prismaSubscriberMock.findUnique.mockResolvedValue(null);
    prismaSubscriberMock.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      id: "sub-2",
      ...data,
    }));

    const res = await POST(
      buildRequest({ email: "noresend@example.com", consent: true }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.emailSent).toBe(false);
    expect(json.pending).toBe(true);
    expect(prismaSubscriberMock.create).toHaveBeenCalledTimes(1);
    expect(Resend).not.toHaveBeenCalled();
  });
});
