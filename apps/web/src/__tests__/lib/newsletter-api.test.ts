/**
 * @jest-environment node
 *
 * POST /api/newsletter : inscriptions fermées (décision du 01/10/2026).
 * La route répond 410 avec un message neutre et n'écrit rien en base.
 */

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterSubscriber: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

const { prisma } = jest.requireMock("@/lib/prisma") as {
  prisma: { newsletterSubscriber: Record<"findUnique" | "create" | "update", jest.Mock> };
};

import { POST } from "@/app/api/newsletter/route";

describe("POST /api/newsletter", () => {
  it("répond 410 avec un message neutre, sans écriture en base", async () => {
    const res = await POST();
    expect(res.status).toBe(410);
    const body = await res.json();
    expect(body.error).toBe("Les inscriptions sont fermées pour le moment.");
    expect(body.error).not.toMatch(/semaine|—/);
    expect(prisma.newsletterSubscriber.create).not.toHaveBeenCalled();
    expect(prisma.newsletterSubscriber.update).not.toHaveBeenCalled();
    expect(prisma.newsletterSubscriber.findUnique).not.toHaveBeenCalled();
  });
});
