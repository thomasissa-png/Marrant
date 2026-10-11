import { fireEvent, render, screen } from "@testing-library/react";
import { webcrypto } from "node:crypto";
import { TextEncoder as NodeTextEncoder } from "node:util";

// jsdom n'expose ni crypto.subtle ni TextEncoder : API Node (identiques en edge/Workers).
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
}
if (typeof globalThis.TextEncoder === "undefined") {
  Object.defineProperty(globalThis, "TextEncoder", { value: NodeTextEncoder, configurable: true });
}

const notFoundError = new Error("NEXT_NOT_FOUND");

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw notFoundError;
  }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/blog/apercu/sortie-programmee",
}));

const mockHeaders = new Map<string, string>();
const mockCookies = new Map<string, string>();
jest.mock("next/headers", () => ({
  headers: () => ({ get: (name: string) => mockHeaders.get(name.toLowerCase()) ?? null }),
  cookies: () => ({
    get: (name: string) => (mockCookies.has(name) ? { name, value: mockCookies.get(name) } : undefined),
  }),
}));

jest.mock("@/components/seo/json-ld", () => ({
  JsonLd: () => null,
  buildBreadcrumbJsonLd: () => ({}),
  buildArticleJsonLd: () => ({}),
  buildFaqJsonLd: () => ({}),
  buildHowToJsonLd: () => ({}),
  authorPersonJsonLd: {},
}));

jest.mock("@/lib/blog-articles", () => ({ blogArticles: [], getArticleBySlug: () => undefined }));

jest.mock("@/lib/prisma", () => ({
  prisma: { blogArticle: { findMany: jest.fn(), findUnique: jest.fn() } },
}));

import { prisma } from "@/lib/prisma";
import BlogArticlePreviewPage, { dynamic, metadata } from "@/app/(dashboard)/blog/apercu/[slug]/page";
import BlogArticlePage from "@/app/(dashboard)/blog/[slug]/page";
import { BLOG_PREVIEW_COOKIE } from "@/config/blog-preview";
import { createPreviewToken } from "@/lib/blog-preview-auth";
import { trackUmami } from "@/lib/umami";

const PASSWORD = "mot-de-passe-admin-test";
const params = { slug: "sortie-programmee" };
const findUnique = prisma.blogArticle.findUnique as jest.Mock;
const findMany = prisma.blogArticle.findMany as jest.Mock;

function dbArticle(overrides: Record<string, unknown> = {}) {
  return {
    slug: "sortie-programmee",
    title: "Titre de l'article programmé",
    metaTitle: null,
    excerpt: "Résumé.",
    metaDescription: null,
    content: "Intro de l'article.\n\n## Première partie\n\nTexte avec [un lien](/blog/autre).",
    category: "GUIDE",
    readingTime: "5 min",
    isPublished: false,
    publishedAt: new Date("2099-10-12T08:00:00Z"),
    createdAt: new Date("2026-10-01T08:00:00Z"),
    updatedAt: new Date("2026-10-01T08:00:00Z"),
    ...overrides,
  };
}

async function renderPreview() {
  render(await BlogArticlePreviewPage({ params }));
}

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
  mockHeaders.clear();
  mockCookies.clear();
  findUnique.mockReset().mockResolvedValue(dbArticle());
  findMany.mockReset().mockResolvedValue([]);
  window.history.pushState({}, "", "/blog/apercu/sortie-programmee");
});

afterAll(() => {
  delete process.env.ADMIN_PASSWORD;
});

describe("/blog/apercu/[slug] : autorisation", () => {
  it("404 sans clé, sans lire la base", async () => {
    await expect(BlogArticlePreviewPage({ params })).rejects.toBe(notFoundError);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("404 avec une mauvaise clé Bearer", async () => {
    mockHeaders.set("authorization", "Bearer mauvaise-cle");
    await expect(BlogArticlePreviewPage({ params })).rejects.toBe(notFoundError);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("404 avec un cookie forgé ou expiré", async () => {
    mockCookies.set(BLOG_PREVIEW_COOKIE, `9999999999.${"0".repeat(64)}`);
    await expect(BlogArticlePreviewPage({ params })).rejects.toBe(notFoundError);
    mockCookies.set(BLOG_PREVIEW_COOKIE, (await createPreviewToken(Date.now() - 3 * 3600 * 1000))!);
    await expect(BlogArticlePreviewPage({ params })).rejects.toBe(notFoundError);
  });

  it("404 si ADMIN_PASSWORD n'est pas configuré, même avec un Bearer vide", async () => {
    delete process.env.ADMIN_PASSWORD;
    mockHeaders.set("authorization", "Bearer ");
    await expect(BlogArticlePreviewPage({ params })).rejects.toBe(notFoundError);
  });

  it("404 avec la bonne clé si l'article n'existe pas", async () => {
    mockHeaders.set("authorization", `Bearer ${PASSWORD}`);
    findUnique.mockResolvedValue(null);
    await expect(BlogArticlePreviewPage({ params })).rejects.toBe(notFoundError);
  });
});

describe("/blog/apercu/[slug] : rendu", () => {
  it("rend l'article programmé avec la bonne clé Bearer et le bandeau de date", async () => {
    mockHeaders.set("authorization", `Bearer ${PASSWORD}`);
    await renderPreview();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Titre de l'article programmé");
    expect(screen.getByRole("status")).toHaveTextContent("Aperçu : publication prévue le 12/10/2099");
    expect(screen.getByText(/Texte avec/)).toBeInTheDocument();
  });

  it("rend l'article avec le cookie signé posé par ?cle=", async () => {
    mockCookies.set(BLOG_PREVIEW_COOKIE, (await createPreviewToken())!);
    await renderPreview();
    expect(screen.getByRole("status")).toHaveTextContent("publication prévue le 12/10/2099");
  });

  it("fonctionne pour un article déjà publié", async () => {
    mockHeaders.set("authorization", `Bearer ${PASSWORD}`);
    findUnique.mockResolvedValue(
      dbArticle({ isPublished: true, publishedAt: new Date("2026-03-04T23:30:00Z") }),
    );
    await renderPreview();
    expect(screen.getByRole("status")).toHaveTextContent("Aperçu : article publié le 05/03/2026");
  });

  it("la page publique reste en 404 pour l'article programmé", async () => {
    await expect(BlogArticlePage({ params })).rejects.toBe(notFoundError);
  });

  it("noindex, nofollow et aucun cache partagé", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});

describe("/blog/apercu/[slug] : pas d'Umami", () => {
  afterEach(() => {
    delete (window as unknown as { umami?: unknown }).umami;
  });

  it("aucun événement ne part depuis l'aperçu (clic de sortie)", async () => {
    const track = jest.fn();
    (window as unknown as { umami: unknown }).umami = { track };
    mockHeaders.set("authorization", `Bearer ${PASSWORD}`);
    await renderPreview();
    fireEvent.click(screen.getByRole("link", { name: "un lien" }));
    trackUmami("blog-scroll", { slug: params.slug, palier: 25 });
    expect(track).not.toHaveBeenCalled();
  });

  it("témoin : hors aperçu, trackUmami envoie bien", () => {
    const track = jest.fn();
    (window as unknown as { umami: unknown }).umami = { track };
    window.history.pushState({}, "", "/blog/sortie-programmee");
    trackUmami("blog-scroll", { slug: params.slug, palier: 25 });
    expect(track).toHaveBeenCalledWith("blog-scroll", { slug: params.slug, palier: 25 });
  });
});
