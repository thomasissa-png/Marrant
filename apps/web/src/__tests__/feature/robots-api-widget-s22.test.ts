/**
 * @jest-environment node
 *
 * Non-régression s22 : l'API publique du widget (/api/widget/v1/vanne-du-jour)
 * est explorable par tous les robots (annuaires d'API), sans être indexée
 * (elle envoie `X-Robots-Tag: noindex`). Chaque groupe User-agent porte donc
 * `Allow: /api/widget/` en plus de `Allow: /`, et garde `Disallow: /api/` :
 * Google et Bing appliquent la règle la plus longue, les autres routes /api/
 * restent bloquées.
 */
import robots from "@/app/robots";

const NOMBRE_DE_GROUPES = 18;

const asArray = (v: string | string[] | undefined) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

describe("robots.txt : API publique du widget explorable", () => {
  const { rules, sitemap } = robots();
  const groupes = Array.isArray(rules) ? rules : [rules];

  it(`garde ${NOMBRE_DE_GROUPES} groupes User-agent et le sitemap`, () => {
    expect(groupes).toHaveLength(NOMBRE_DE_GROUPES);
    expect(sitemap).toBe("https://deviens-marrant.fr/sitemap.xml");
  });

  it.each(groupes.map((g) => [String(g.userAgent), g] as const))(
    "%s : Allow / et /api/widget/, Disallow /api/ conservé",
    (_ua, groupe) => {
      expect(asArray(groupe.allow)).toEqual(expect.arrayContaining(["/", "/api/widget/"]));
      expect(asArray(groupe.disallow)).toContain("/api/");
    },
  );
});
