/**
 * s16 reco 15 : le filtre Umami ne laisse jamais partir le jeton de
 * réinitialisation (url et referrer), et coupe toujours /blog/apercu.
 */
import { buildUmamiBeforeSendScript } from "@/lib/umami-before-send";

type Payload = { url?: string; referrer?: string; name?: string };
type Filter = (type: string, payload: Payload) => Payload | false;

function loadFilter(): Filter {
  // Exécute le script inline tel qu'il est injecté dans le <head>.
  new Function(buildUmamiBeforeSendScript("/blog/apercu"))();
  return (window as unknown as { marrantUmamiBeforeSend: Filter }).marrantUmamiBeforeSend;
}

function at(path: string) {
  window.history.pushState({}, "", path);
}

describe("marrantUmamiBeforeSend", () => {
  it("/reset-password : query string retirée de l'URL", () => {
    at("/reset-password?token=abc&email=a%40b.fr");
    const p = loadFilter()("event", { url: "/reset-password?token=abc&email=a%40b.fr" });
    expect(p).toEqual({ url: "/reset-password", referrer: undefined });
  });

  it("vue suivante : le referrer est nettoyé aussi (URL absolue)", () => {
    at("/login");
    const p = loadFilter()("event", {
      url: "/login",
      referrer: "https://deviens-marrant.fr/reset-password?token=abc&email=x",
    }) as Payload;
    expect(p.referrer).toBe("https://deviens-marrant.fr/reset-password");
    expect(p.url).toBe("/login");
  });

  it("ailleurs : seuls token et email sont retirés, les UTM restent", () => {
    at("/abonnement");
    const p = loadFilter()("event", { url: "/abonnement?utm_source=ig&token=zz&email=a&plan=annual#x" }) as Payload;
    expect(p.url).toBe("/abonnement?utm_source=ig&plan=annual");
  });

  it("URL sans query : inchangée", () => {
    at("/vannes");
    expect(loadFilter()("event", { url: "/vannes", referrer: "" })).toEqual({ url: "/vannes", referrer: "" });
  });

  it("/blog/apercu : rien n'est envoyé", () => {
    at("/blog/apercu/mon-article");
    expect(loadFilter()("event", { url: "/blog/apercu/mon-article" })).toBe(false);
  });
});
