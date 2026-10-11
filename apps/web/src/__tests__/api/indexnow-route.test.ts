/**
 * @jest-environment node
 *
 * POST /api/indexnow (s15) : réservé à Bearer CRON_SECRET ou ADMIN_PASSWORD.
 */
import { POST } from "@/app/api/indexnow/route";

const mockSubmit = jest.fn();
jest.mock("@/lib/indexnow", () => ({
  submitToIndexNow: (...args: unknown[]) => mockSubmit(...args),
}));

const CRON = "cron-secret-test";
const ADMIN = "admin-password-test";

function post(body: unknown, authorization?: string) {
  return POST(
    new Request("https://deviens-marrant.fr/api/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { authorization } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  process.env.CRON_SECRET = CRON;
  process.env.ADMIN_PASSWORD = ADMIN;
  mockSubmit.mockReset();
  mockSubmit.mockResolvedValue({ ok: true, status: 200, submitted: 1 });
});

afterAll(() => {
  delete process.env.CRON_SECRET;
  delete process.env.ADMIN_PASSWORD;
});

describe("POST /api/indexnow : authentification", () => {
  it("sans en-tête : 401, rien n'est soumis", async () => {
    const res = await post({ urls: ["/vannes"] });
    expect(res.status).toBe(401);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("mauvais secret : 401", async () => {
    const res = await post({ urls: ["/vannes"] }, "Bearer pas-le-bon");
    expect(res.status).toBe(401);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("secrets absents côté serveur : 401 même avec un Bearer vide de sens", async () => {
    delete process.env.CRON_SECRET;
    delete process.env.ADMIN_PASSWORD;
    const res = await post({ urls: ["/vannes"] }, "Bearer undefined");
    expect(res.status).toBe(401);
  });

  it("Bearer CRON_SECRET : 200 et soumission", async () => {
    const res = await post({ urls: ["/vannes"] }, `Bearer ${CRON}`);
    expect(res.status).toBe(200);
    expect(mockSubmit).toHaveBeenCalledWith(["/vannes"]);
  });

  it("Bearer ADMIN_PASSWORD : 200", async () => {
    const res = await post({ urls: ["/conseils"] }, `Bearer ${ADMIN}`);
    expect(res.status).toBe(200);
  });

  it("autorisé mais corps invalide : 400 (validation après l'authentification)", async () => {
    const res = await post({ urls: [] }, `Bearer ${CRON}`);
    expect(res.status).toBe(400);
  });
});
