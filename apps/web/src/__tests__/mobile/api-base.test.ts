/**
 * Tests pour le helper api-base utilisé en mode mobile (Capacitor).
 *
 * Couverture :
 *  - Mode web : apiBase() retourne string vide, fetch reste relatif
 *  - Mode SSR : apiBase() retourne string vide
 *  - api() inclut credentials: include et Content-Type
 */

import { apiBase, api, isMobileNative } from "@/lib/api-base";

describe("api-base", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore — reset global fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response),
    );
  });

  describe("apiBase()", () => {
    it("retourne string vide en mode SSR (pas de window)", () => {
      const originalWindow = (global as any).window;
      // @ts-ignore
      delete (global as any).window;
      try {
        expect(apiBase()).toBe("");
      } finally {
        (global as any).window = originalWindow;
      }
    });

    it("retourne string vide en mode web (Capacitor non chargé)", () => {
      expect(apiBase()).toBe("");
    });
  });

  describe("isMobileNative()", () => {
    it("retourne false en mode web", () => {
      expect(isMobileNative()).toBe(false);
    });
  });

  describe("api()", () => {
    it("appelle fetch avec credentials: include", async () => {
      await api("/api/test", { method: "POST", body: JSON.stringify({ a: 1 }) });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });

    it("ajoute Content-Type quand body présent", async () => {
      await api("/api/test", { method: "POST", body: "x" });
      const call = (global.fetch as jest.Mock).mock.calls[0];
      expect(call[1].headers["Content-Type"]).toBe("application/json");
    });

    it("ne casse pas si init est undefined", async () => {
      await api("/api/test");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({ credentials: "include" }),
      );
    });
  });
});
