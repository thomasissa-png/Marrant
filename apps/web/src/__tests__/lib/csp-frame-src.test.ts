/**
 * @jest-environment node
 *
 * Relecture s11 : la page /videos/[slug] embarque un iframe
 * `https://www.youtube-nocookie.com/embed/…` alors que la CSP de prod
 * n'autorisait que `https://www.youtube.com` en `frame-src` → vidéo bloquée
 * par le navigateur. Ce test vérifie que tout hôte d'iframe utilisé dans
 * `src/` est bien autorisé par la CSP.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const nextConfig = require("../../../next.config.js");

function listSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === "__tests__" || name === "node_modules") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listSourceFiles(full));
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(full);
  }
  return out;
}

async function getFrameSrc(): Promise<string[]> {
  const rules = await nextConfig.headers();
  const csp = rules[0].headers.find(
    (h: { key: string }) => h.key === "Content-Security-Policy",
  ).value as string;
  const directive = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("frame-src"));
  return (directive ?? "").split(/\s+/).slice(1);
}

describe("CSP frame-src couvre les iframes du site", () => {
  it("autorise tous les hôtes d'iframe/embed trouvés dans src/", async () => {
    const frameSrc = await getFrameSrc();
    const hosts = new Set<string>();
    for (const file of listSourceFiles(join(__dirname, "../.."))) {
      const code = readFileSync(file, "utf-8");
      if (!code.includes("<iframe")) continue;
      for (const m of code.matchAll(/https:\/\/[a-z0-9.-]+(?=\/embed\/)/g)) hosts.add(m[0]);
    }
    expect(hosts.size).toBeGreaterThan(0);
    for (const host of hosts) expect(frameSrc).toContain(host);
  });
});
