/**
 * @legal s21 L5 : le jeton des liens de la lettre (`/lettre/confirmer?token=…`,
 * `/lettre/desinscrire?token=…`) ne part jamais chez Umami, ni dans l'URL de la vue,
 * ni dans le référent de la vue suivante. Échoue si le filtre `data-before-send`
 * (`lib/umami-before-send.ts`) cesse de retirer `token`.
 */
import fs from "node:fs";
import path from "node:path";
import { buildUmamiBeforeSendScript } from "@/lib/umami-before-send";
import { confirmActionPath } from "@/lib/newsletter";

type Payload = { url?: string; referrer?: string };
type Filter = (type: string, payload: Payload) => Payload | false;

const JETON = "Jt0k3n-lettre_s21-9f8e7d6c5b4a";

function filtre(chemin: string): Filter {
  window.history.pushState({}, "", chemin);
  // Exécute le script inline tel qu'il est injecté dans le <head> par app/layout.tsx.
  new Function(buildUmamiBeforeSendScript("/blog/apercu"))();
  return (window as unknown as { marrantUmamiBeforeSend: Filter }).marrantUmamiBeforeSend;
}

function nettoie(chemin: string, payload: Payload): Payload {
  const p = filtre(chemin)("pageview", payload);
  if (p === false) throw new Error("vue bloquée : le test vise le nettoyage, pas l'exclusion");
  return p;
}

describe("Umami, pages de la lettre : jeton jamais transmis (@legal L5)", () => {
  beforeEach(() => localStorage.clear());

  it.each(["/lettre/confirmer", "/lettre/desinscrire"])("%s : `token` retiré de l'URL de la vue", (page) => {
    const p = nettoie(`${page}?token=${JETON}`, { url: `${page}?token=${JETON}` });
    expect(p.url).toBe(page);
    expect(JSON.stringify(p)).not.toContain(JETON);
  });

  it.each(["/lettre/confirmer", "/lettre/desinscrire"])(
    "%s : référent absolu de la vue suivante nettoyé, autres paramètres gardés",
    (page) => {
      const p = nettoie("/lettre?statut=confirmee", {
        url: "/lettre?statut=confirmee",
        referrer: `https://deviens-marrant.fr${page}?utm_source=lettre&token=${JETON}#haut`,
      });
      expect(p.referrer).toBe(`https://deviens-marrant.fr${page}?utm_source=lettre`);
      expect(p.url).toBe("/lettre?statut=confirmee");
      expect(JSON.stringify(p)).not.toContain(JETON);
    },
  );

  it("casse et position du paramètre indifférentes (TOKEN en tête, au milieu, encodé)", () => {
    const encode = encodeURIComponent(`${JETON}/+=`);
    for (const url of [
      `/lettre/confirmer?TOKEN=${JETON}`,
      `/lettre/confirmer?a=1&token=${JETON}&b=2`,
      `/lettre/desinscrire?token=${encode}`,
    ]) {
      const p = nettoie("/lettre/confirmer", { url });
      expect(p.url).not.toMatch(/token=/i);
      expect(p.url).not.toContain(JETON);
    }
  });

  it("l'action du bouton (POST, jeton dans le chemin) reste sur le site : jamais une URL absolue", () => {
    expect(confirmActionPath(JETON)).toMatch(/^\/api\/newsletter\/confirm\//);
  });

  it("le tracker Umami est toujours branché sur ce filtre dans app/layout.tsx", () => {
    const layout = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");
    expect(layout).toContain("buildUmamiBeforeSendScript(");
    expect(layout).toContain('data-before-send="marrantUmamiBeforeSend"');
  });
});
