/**
 * @jest-environment node
 *
 * Non-régression s17 : « Wasm code generation disallowed by embedder » au cron
 * social sous Cloudflare Workers. Le paquet `satori` compile son yoga.wasm
 * embarqué dès son chargement (WebAssembly.instantiate sur des octets, refusé par
 * workerd). Il ne doit donc être chargé que sur le chemin hors Workers.
 */
import fs from "fs";
import path from "path";

let satoriCharge = false;
jest.mock("satori", () => {
  satoriCharge = true;
  return jest.fn().mockResolvedValue("<svg/>");
});
jest.mock("@resvg/resvg-js", () => ({ Resvg: jest.fn() }));

const WEB = path.join(__dirname, "..", "..", "..");

describe("image-generator : satori jamais chargé au démarrage du module", () => {
  it("charger image-generator ne charge pas satori (import dynamique)", () => {
    jest.isolateModules(() => {
      require("@/lib/social/image-generator");
    });
    expect(satoriCharge).toBe(false);
  });

  it("aucun import statique de satori dans le code serveur", () => {
    const src = fs.readFileSync(path.join(WEB, "src", "lib", "social", "image-generator.ts"), "utf-8");
    expect(src).not.toMatch(/^import\s+satori\b/m);
    expect(src).toContain('await import("satori")');
  });

  it("le rendu sous Workers passe par next/og, avant tout chargement de satori", () => {
    const src = fs.readFileSync(path.join(WEB, "src", "lib", "social", "image-generator.ts"), "utf-8");
    const workers = src.indexOf("if (isCloudflareWorkers())", src.indexOf("async function renderToPng"));
    expect(workers).toBeGreaterThan(-1);
    expect(src.indexOf('await import("next/og")', workers)).toBeGreaterThan(workers);
    expect(src.indexOf('await import("satori")')).toBeGreaterThan(src.indexOf('await import("next/og")'));
  });
});
