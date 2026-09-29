import { sanitizeCallbackUrl, resolvePostAuthRedirect } from "@/lib/safe-callback";

describe("sanitizeCallbackUrl", () => {
  it("accepte un chemin relatif interne", () => {
    expect(sanitizeCallbackUrl("/vannes")).toBe("/vannes");
    expect(sanitizeCallbackUrl("/parcours/repartie")).toBe("/parcours/repartie");
    expect(sanitizeCallbackUrl("/blog/article?utm=x")).toBe("/blog/article?utm=x");
  });

  it("rejette une URL absolue (open-redirect)", () => {
    expect(sanitizeCallbackUrl("https://evil.com")).toBeNull();
    expect(sanitizeCallbackUrl("http://deviens-marrant.fr/vannes")).toBeNull();
  });

  it("rejette une URL protocol-relative", () => {
    expect(sanitizeCallbackUrl("//evil.com")).toBeNull();
    expect(sanitizeCallbackUrl("///evil.com")).toBeNull();
  });

  it("rejette les schemes javascript / data", () => {
    expect(sanitizeCallbackUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeCallbackUrl("/javascript:alert(1)")).toBeNull();
    expect(sanitizeCallbackUrl("data:text/html,foo")).toBeNull();
  });

  it("rejette les chemins avec backslash Windows", () => {
    expect(sanitizeCallbackUrl("/\\evil.com")).toBeNull();
  });

  it("rejette les caractères de contrôle", () => {
    expect(sanitizeCallbackUrl("/vannes\n")).toBeNull();
    expect(sanitizeCallbackUrl("/vannes\r/foo")).toBeNull();
  });

  it("rejette les valeurs vides ou trop longues", () => {
    expect(sanitizeCallbackUrl(null)).toBeNull();
    expect(sanitizeCallbackUrl(undefined)).toBeNull();
    expect(sanitizeCallbackUrl("")).toBeNull();
    expect(sanitizeCallbackUrl("/" + "a".repeat(600))).toBeNull();
  });
});

describe("resolvePostAuthRedirect", () => {
  it("renvoie le callback sûr s'il est valide", () => {
    expect(resolvePostAuthRedirect("/vannes", "/onboarding")).toBe("/vannes");
  });

  it("renvoie le fallback si le callback est invalide", () => {
    expect(resolvePostAuthRedirect("https://evil.com", "/onboarding")).toBe("/onboarding");
    expect(resolvePostAuthRedirect(null, "/onboarding")).toBe("/onboarding");
  });
});
