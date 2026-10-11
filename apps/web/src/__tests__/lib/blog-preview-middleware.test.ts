/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import middleware from "@/middleware";
import { safeEqual, bearerToken, isValidPreviewToken } from "@/lib/blog-preview-auth";

const PASSWORD = "mot-de-passe-admin-test";

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
});

afterAll(() => {
  delete process.env.ADMIN_PASSWORD;
});

function request(path: string) {
  return new NextRequest(new URL(path, "https://deviens-marrant.fr"), {
    headers: { host: "deviens-marrant.fr" },
  });
}

describe("middleware /blog/apercu", () => {
  it("bonne clé : cookie httpOnly 2 h sur /blog/apercu, redirection sans le paramètre", async () => {
    const res = await middleware(request(`/blog/apercu/mon-article?cle=${PASSWORD}&x=1`));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/blog/apercu/mon-article?x=1");
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/^blog_apercu=\d+\.[0-9a-f]{64};/);
    expect(cookie).toContain("Path=/blog/apercu");
    expect(cookie).toContain("Max-Age=7200");
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).not.toContain(PASSWORD);
    const token = /blog_apercu=([^;]+)/.exec(cookie)![1];
    await expect(isValidPreviewToken(token)).resolves.toBe(true);
    expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("mauvaise clé : paramètre retiré, aucun cookie (la page répond 404)", async () => {
    const res = await middleware(request("/blog/apercu/mon-article?cle=faux"));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://deviens-marrant.fr/blog/apercu/mon-article");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("sans clé : passe à la page, noindex et pas de cache", async () => {
    const res = await middleware(request("/blog/apercu/mon-article"));
    expect(res.headers.get("location")).toBeNull();
    expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(res.headers.get("cache-control")).toBe("private, no-store");
  });

  it("n'affecte pas la page publique", async () => {
    const res = await middleware(request("/blog/mon-article?cle=faux"));
    expect(res.headers.get("location")).toBeNull();
    expect(res.headers.get("x-robots-tag")).toBeNull();
  });
});

describe("lib/blog-preview-auth", () => {
  it("safeEqual compare quelle que soit la longueur", async () => {
    await expect(safeEqual("abc", "abc")).resolves.toBe(true);
    await expect(safeEqual("abc", "abcd")).resolves.toBe(false);
    await expect(safeEqual("", "abc")).resolves.toBe(false);
  });

  it("bearerToken extrait le jeton", () => {
    expect(bearerToken(`Bearer ${PASSWORD}`)).toBe(PASSWORD);
    expect(bearerToken("Basic abc")).toBeNull();
    expect(bearerToken(null)).toBeNull();
  });

  it("cookie signé avec un autre ADMIN_PASSWORD refusé", async () => {
    const res = await middleware(request(`/blog/apercu/a?cle=${PASSWORD}`));
    const token = /blog_apercu=([^;]+)/.exec(res.headers.get("set-cookie") ?? "")![1];
    process.env.ADMIN_PASSWORD = "nouveau-mot-de-passe";
    await expect(isValidPreviewToken(token)).resolves.toBe(false);
  });
});
