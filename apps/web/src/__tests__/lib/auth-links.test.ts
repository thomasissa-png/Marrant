/**
 * Liens d'inscription / connexion du tunnel (s15) : un seul saut vers
 * /register ou /login, destination interne et source de mesure conservées.
 */
import {
  buildLoginUrl,
  buildRegisterUrl,
  sanitizeSignupSrc,
  withAuthReturnMarker,
} from "@/lib/auth-links";
import { getPostSignupRedirect } from "@/lib/safe-callback";

describe("buildRegisterUrl", () => {
  it("sans paramètre : /register", () => {
    expect(buildRegisterUrl()).toBe("/register");
  });

  it("destination et source encodées", () => {
    expect(buildRegisterUrl({ callbackUrl: "/abonnement?plan=annual", src: "abonnement" })).toBe(
      "/register?callbackUrl=%2Fabonnement%3Fplan%3Dannual&src=abonnement",
    );
  });

  it("destination externe ou protocol-relative ignorée (anti open-redirect)", () => {
    expect(buildRegisterUrl({ callbackUrl: "https://evil.example", src: "header" })).toBe("/register?src=header");
    expect(buildRegisterUrl({ callbackUrl: "//evil.example" })).toBe("/register");
  });

  it("la formule annuelle survit jusqu'à la destination après inscription", () => {
    const url = new URL(buildRegisterUrl({ callbackUrl: "/abonnement?returnTo=%2Fcarnet&plan=annual" }), "https://x.fr");
    expect(getPostSignupRedirect(url.searchParams.get("callbackUrl"))).toBe("/abonnement?returnTo=%2Fcarnet&plan=annual");
  });
});

describe("buildLoginUrl", () => {
  it("garde la destination", () => {
    expect(buildLoginUrl({ callbackUrl: "/favoris" })).toBe("/login?callbackUrl=%2Ffavoris");
    expect(buildLoginUrl()).toBe("/login");
  });
});

describe("bascule depuis une application (v5 §2.5) : callbackUrl, src, origine, contenu", () => {
  it("les 4 paramètres conservés, dans l'ordre", () => {
    expect(
      buildRegisterUrl({ callbackUrl: "/onboarding", src: "blog-mon-article", origine: "instagram", contenu: "bio-article" }),
    ).toBe("/register?callbackUrl=%2Fonboarding&src=blog-mon-article&origine=instagram&contenu=bio-article");
    expect(buildLoginUrl({ callbackUrl: "/favoris", src: "login", origine: "linkedin", contenu: "relais" })).toBe(
      "/login?callbackUrl=%2Ffavoris&src=login&origine=linkedin&contenu=relais",
    );
  });

  it("src=blog-<slug> et callbackUrl survivent : destination intacte après inscription", () => {
    const url = new URL(
      buildRegisterUrl({ callbackUrl: "/parcours/repartie", src: "blog-se-presenter-avec-humour", origine: "x", contenu: "lundi" }),
      "https://deviens-marrant.fr",
    );
    expect(url.searchParams.get("src")).toBe("blog-se-presenter-avec-humour");
    expect(getPostSignupRedirect(url.searchParams.get("callbackUrl"))).toBe("/parcours/repartie");
  });

  it("origine hors liste blanche : origine et contenu omis", () => {
    expect(buildRegisterUrl({ src: "quiz", origine: "tiktok", contenu: "quiz" })).toBe("/register?src=quiz");
  });

  it("contenu hors liste blanche : omis, origine gardée", () => {
    expect(buildRegisterUrl({ src: "quiz", origine: "x", contenu: "jean@test.fr" })).toBe("/register?src=quiz&origine=x");
  });

  it("contenu sans origine : omis", () => {
    expect(buildRegisterUrl({ contenu: "bio-quiz" })).toBe("/register");
  });
});

describe("sanitizeSignupSrc (jamais de donnée libre dans Umami)", () => {
  it.each([
    ["blog-meilleures-blagues-droles-2026", "blog-meilleures-blagues-droles-2026"],
    ["header", "header"],
    ["jean@test.fr", null],
    ["Header", null],
    ["", null],
    [null, null],
    ["a".repeat(121), null],
  ])("%s → %s", (raw, expected) => {
    expect(sanitizeSignupSrc(raw)).toBe(expected);
  });
});

describe("withAuthReturnMarker", () => {
  it("ajoute auth (et src) en respectant la query et l'ancre", () => {
    expect(withAuthReturnMarker("/onboarding", "inscription-google", "blog-x")).toBe(
      "/onboarding?auth=inscription-google&src=blog-x",
    );
    expect(withAuthReturnMarker("/abonnement?plan=annual", "inscription-google")).toBe(
      "/abonnement?plan=annual&auth=inscription-google",
    );
    expect(withAuthReturnMarker("/parcours/repartie#etape-2", "connexion-google")).toBe(
      "/parcours/repartie?auth=connexion-google#etape-2",
    );
  });
});
