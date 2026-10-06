import { sanitizeCallbackUrl, resolvePostAuthRedirect } from "@/lib/safe-callback";
import { getPostSignupRedirect, readSignupPlan } from "@/lib/premium-return";

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

describe("getPostSignupRedirect (plus de compte gratuit, s15 : l'inscription mène au paiement)", () => {
  it("sans callback, depuis l'accueil ou un callback externe : /abonnement avec paiement automatique", () => {
    expect(getPostSignupRedirect(null)).toBe("/abonnement?auto=1");
    expect(getPostSignupRedirect("/")).toBe("/abonnement?auto=1");
    expect(getPostSignupRedirect("https://evil.com")).toBe("/abonnement?auto=1");
  });

  it("/onboarding n'est plus une étape avant paiement : aucun returnTo", () => {
    expect(getPostSignupRedirect("/onboarding")).toBe("/abonnement?auto=1");
    expect(getPostSignupRedirect("/onboarding?callbackUrl=%2Fvannes")).toBe("/abonnement?auto=1");
  });

  it("callback /abonnement : ses paramètres (returnTo, plan) sont gardés", () => {
    expect(getPostSignupRedirect("/abonnement")).toBe("/abonnement?auto=1");
    expect(getPostSignupRedirect("/abonnement?returnTo=%2Fcarnet&plan=annual")).toBe(
      "/abonnement?returnTo=%2Fcarnet&plan=annual&auto=1",
    );
    // returnTo non sûr retiré, upgrade=cancel jamais relayé
    expect(getPostSignupRedirect("/abonnement?returnTo=%2F%2Fevil.com&upgrade=cancel")).toBe("/abonnement?auto=1");
  });

  it("toute autre intention est conservée en returnTo", () => {
    expect(getPostSignupRedirect("/parcours/repartie")).toBe("/abonnement?returnTo=%2Fparcours%2Frepartie&auto=1");
    expect(getPostSignupRedirect("/vannes")).toBe("/abonnement?returnTo=%2Fvannes&auto=1");
  });

  it("formule annuelle demandée : plan=annual", () => {
    expect(getPostSignupRedirect(null, "annual")).toBe("/abonnement?plan=annual&auto=1");
    expect(getPostSignupRedirect("/vannes", "annual")).toBe("/abonnement?returnTo=%2Fvannes&plan=annual&auto=1");
  });
});

describe("readSignupPlan", () => {
  it("?plan=annual sur /register ou dans le callback ; mensuel sinon", () => {
    expect(readSignupPlan("annual", null)).toBe("annual");
    expect(readSignupPlan(null, "/abonnement?plan=annual")).toBe("annual");
    expect(readSignupPlan(null, "/abonnement")).toBe("monthly");
    expect(readSignupPlan("n'importe", "https://evil.com?plan=annual")).toBe("monthly");
  });
});
