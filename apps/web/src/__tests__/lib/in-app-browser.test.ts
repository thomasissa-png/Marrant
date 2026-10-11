/**
 * Détection du navigateur intégré (v5 §2.4) : agents utilisateurs réels des
 * applications X, Instagram, LinkedIn, Facebook, et de Safari et Chrome.
 * Les marqueurs restent à confirmer sur appareil (v5 §2.6).
 */
import { buildOpenInBrowserHref, detectInAppBrowser } from "@/lib/in-app-browser";
import { GOOGLE_BLOQUE_PAR_APP } from "@/config/in-app-browser";
import { UA } from "@/__tests__/helpers/user-agents";


describe("detectInAppBrowser", () => {
  it.each([
    ["instagramIos", "instagram", true, true, false],
    ["instagramAndroid", "instagram", true, false, true],
    ["linkedinIos", "linkedin", true, true, false],
    ["linkedinAndroid", "linkedin", true, false, true],
    ["facebookIos", "facebook", true, true, false],
    ["xAndroid", "x", false, false, true],
    ["xIos", "x", false, true, false],
  ] as const)("%s → %s, Google bloqué : %s", (key, app, googleBloque, ios, android) => {
    expect(detectInAppBrowser(UA[key])).toEqual({ app, googleBloque, ios, android });
  });

  it.each(["safariIos", "chromeIos", "chromeAndroid", "chromeDesktop"] as const)(
    "%s → navigateur ordinaire, Google actif",
    (key) => {
      const result = detectInAppBrowser(UA[key]);
      expect(result.app).toBeNull();
      expect(result.googleBloque).toBe(false);
    },
  );

  it("agent vide ou absent → navigateur ordinaire", () => {
    expect(detectInAppBrowser("")).toEqual({ app: null, googleBloque: false, ios: false, android: false });
    expect(detectInAppBrowser(undefined).app).toBeNull();
  });

  it("X garde Google actif (onglet système), Instagram, Facebook et LinkedIn le bloquent [HYPOTHÈSE à confirmer sur appareil]", () => {
    expect(GOOGLE_BLOQUE_PAR_APP).toEqual({ instagram: true, facebook: true, linkedin: true, x: false });
  });
});

describe("buildOpenInBrowserHref", () => {
  const url = "https://deviens-marrant.fr/register?callbackUrl=%2Fonboarding&src=blog-test&origine=instagram&contenu=bio-article";

  it("Android : URL intent vers Chrome, chemin et paramètres conservés, repli https", () => {
    const href = buildOpenInBrowserHref(url, true);
    expect(href.startsWith("intent://deviens-marrant.fr/register?callbackUrl=%2Fonboarding&src=blog-test&origine=instagram&contenu=bio-article#Intent;")).toBe(true);
    expect(href).toContain("scheme=https;package=com.android.chrome;");
    expect(href).toContain(`S.browser_fallback_url=${encodeURIComponent(url)};end`);
  });

  it("iOS et autres : URL https inchangée", () => {
    expect(buildOpenInBrowserHref(url, false)).toBe(url);
  });

  it("URL invalide ou non https : inchangée", () => {
    expect(buildOpenInBrowserHref("pas une url", true)).toBe("pas une url");
    expect(buildOpenInBrowserHref("http://localhost:5000/register", true)).toBe("http://localhost:5000/register");
  });
});
