/**
 * @jest-environment node
 *
 * Lettre s21 : les 6 numéros validés de `data/lettre/numeros.json`
 * (source : `docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md`, versions retenues).
 * Garde-fous : format, interdits de copy, liens existants, date plancher, et aucun
 * envoi tant qu'un marqueur `[À COMPLÉTER` reste dans le numéro rendu.
 */
import fs from "node:fs";
import path from "node:path";

let mockMention: string | null = null;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_MENTION_EDITEUR_NUMERO() {
    return mockMention ?? jest.requireActual("@/config/lettre").LETTRE_MENTION_EDITEUR_NUMERO;
  },
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import numerosJson from "@/data/lettre/numeros.json";
import { createHash } from "crypto";
import { decouperInvitation, versionGratuite, versionPremium } from "@/lib/lettre/invitation-premium";
import { motifsInterdits } from "@/lib/lettre/numeros-hebdo";
import { corpsNumeroPremium } from "@/lib/lettre/envoi";
import { jourParis, numeroEnvoyable, numeroSchema, type NumeroLettre } from "@/lib/lettre/numeros";
import { PARCOURS_SLUGS } from "@/lib/entrees-parcours";
import { blogArticles } from "@/lib/blog-articles";
import { BLOG_CTA_BY_SLUG } from "@/config/blog-cta";
import { FORTE_FRAPPE_SLUGS } from "@/config/blog-forte-frappe";

const APP = path.resolve(__dirname, "../../app");
const RACINE = path.resolve(__dirname, "../../../../..");
const CALENDRIER = path.join(RACINE, "docs/seo/calendrier-editorial-q4-2026.md");

const numeros: NumeroLettre[] = numerosJson.map((n) => numeroSchema.parse(n));
const texteComplet = (n: NumeroLettre) => [n.objet, n.preEntete ?? "", n.corps].join("\n");

/** Routes de l'app (groupes « (x) » retirés), ex. « /abonnement », « /blog/[slug] ». */
function routesApp(dir = APP, prefixe = ""): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && e.name === "page.tsx") out.push(prefixe || "/");
    if (!e.isDirectory()) continue;
    const segment = /^\(.*\)$/.test(e.name) ? "" : `/${e.name}`;
    out.push(...routesApp(path.join(dir, e.name), prefixe + segment));
  }
  return out;
}

/** Slugs de blog connus : articles statiques, configs par article, calendrier éditorial (articles importés). */
function slugsBlogConnus(): Set<string> {
  const calendrier = fs.readFileSync(CALENDRIER, "utf8");
  return new Set([
    ...blogArticles.map((a) => a.slug),
    ...Object.keys(BLOG_CTA_BY_SLUG),
    ...FORTE_FRAPPE_SLUGS,
    ...[...calendrier.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)+)`/g)].map((m) => m[1]),
  ]);
}

const liens = (n: NumeroLettre) => [...n.corps.matchAll(/https:\/\/deviens-marrant\.fr(\S+)/g)].map((m) => new URL(`https://deviens-marrant.fr${m[1]}`));

describe("numéros de la lettre livrés", () => {
  it("6 numéros valides au format, un par mois de novembre 2026 à avril 2027", () => {
    expect(numeros).toHaveLength(6);
    expect(numeros.map((n) => n.periode)).toEqual(["2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"]);
    expect(numeros.map((n) => n.numero)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("aucun tiret cadratin ni demi-cadratin", () => {
    for (const n of numeros) expect(texteComplet(n)).not.toMatch(/[—–]/);
  });

  it("aucun « remboursé sous 14 jours »", () => {
    for (const n of numeros) expect(texteComplet(n)).not.toMatch(/rembours\S*\s+sous\s+14\s+jours/i);
  });

  it("aucune mention « IA »", () => {
    for (const n of numeros) {
      expect(texteComplet(n)).not.toMatch(/(^|[^\p{L}])IA([^\p{L}]|$)/u);
      expect(texteComplet(n)).not.toMatch(/intelligence artificielle/i);
    }
  });

  it("chaque lien existe dans le routeur ou parmi les slugs de blog connus, avec ses paramètres utm", () => {
    const routes = new Set(routesApp());
    const blog = slugsBlogConnus();
    expect(routes.has("/blog/[slug]")).toBe(true);
    expect(routes.has("/parcours/[slug]")).toBe(true);
    for (const n of numeros) {
      const ls = liens(n);
      expect(ls.length).toBeGreaterThanOrEqual(2);
      for (const u of ls) {
        const [, racine, slug, ...reste] = u.pathname.split("/");
        expect(reste).toEqual([]);
        if (racine === "blog") expect(blog.has(slug)).toBe(true);
        else if (racine === "parcours") expect((PARCOURS_SLUGS as readonly string[]).includes(slug)).toBe(true);
        else expect(routes.has(u.pathname)).toBe(true);
        expect(u.searchParams.get("utm_source")).toBe("lettre");
        expect(u.searchParams.get("utm_medium")).toBe("email");
        expect(u.searchParams.get("utm_content")).toMatch(new RegExp(`^n${n.numero}-(article|premium|etape1)$`));
      }
    }
  });

  it("date plancher = jour de publication de l'article cité ; aucune quand aucun article n'est cité", () => {
    for (const n of numeros) {
      const citeUnArticle = liens(n).some((u) => u.pathname.startsWith("/blog/"));
      if (citeUnArticle) expect(n.datePlancher).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      else expect(n.datePlancher ?? null).toBeNull();
    }
  });
});

describe("envoi des numéros", () => {
  afterEach(() => {
    mockMention = null;
  });

  it("mention d'éditeur livrée (Thomas, 17/10) : « deviens-marrant SAS », sans marqueur", () => {
    const { LETTRE_MENTION_EDITEUR_NUMERO, MARQUEUR_A_COMPLETER } = jest.requireActual("@/config/lettre");
    expect(LETTRE_MENTION_EDITEUR_NUMERO).toBe("deviens-marrant SAS");
    expect(LETTRE_MENTION_EDITEUR_NUMERO).not.toContain(MARQUEUR_A_COMPLETER);
  });

  it("garde-fou : mention d'éditeur avec un marqueur [À COMPLÉTER], aucun numéro n'est envoyable, même jour d'envoi fixé et atteint", () => {
    mockMention = `${jest.requireActual("@/config/lettre").MARQUEUR_A_COMPLETER} : mention d'éditeur]`;
    const loin = new Date("2030-01-01T12:00:00Z");
    for (const n of numeros) {
      expect(numeroEnvoyable({ ...n, envoiPrevu: "2027-06-01T08:00:00+02:00" }, loin)).toBe(false);
    }
  });

  it("jours d'envoi livrés (Thomas, 17/10) : premier jeudi du mois à 8 h (Paris) ; n°1 le premier jeudi après sa date plancher", () => {
    expect(numeros.map((n) => n.envoiPrevu)).toEqual([
      "2026-11-05T08:00:00+01:00",
      "2026-12-03T08:00:00+01:00",
      "2027-01-07T08:00:00+01:00",
      "2027-02-04T08:00:00+01:00",
      "2027-03-04T08:00:00+01:00",
      "2027-04-01T08:00:00+02:00",
    ]);
    for (const n of numeros) {
      const prevu = new Date(n.envoiPrevu as string);
      expect(numeroEnvoyable(n, new Date(prevu.getTime() - 60_000))).toBe(false);
      expect(numeroEnvoyable(n, prevu)).toBe(true);
    }
  });

  it("aucun numéro n'est envoyable avant sa date plancher, même mention complétée", () => {
    mockMention = "mention de test";
    for (const n of numeros.filter((x) => x.datePlancher)) {
      const plancher = new Date(`${n.datePlancher}T00:00:00+01:00`);
      const veille = new Date(plancher.getTime() - 60_000);
      expect(jourParis(veille) < (n.datePlancher as string)).toBe(true);
      const prepare = { ...n, envoiPrevu: new Date(veille.getTime() - 3_600_000).toISOString() };
      expect(numeroEnvoyable(prepare, veille)).toBe(false);
      expect(numeroEnvoyable(prepare, plancher)).toBe(true);
      // Le schéma refuse aussi un jour d'envoi fixé avant le plancher.
      expect(numeroSchema.safeParse({ ...n, periode: prepare.envoiPrevu.slice(0, 7), envoiPrevu: prepare.envoiPrevu }).success).toBe(false);
    }
  });
});

describe("s22 : version Premium de la lettre du mois (décision de Thomas du 25/10)", () => {
  // Empreintes SHA-256 des corps relus et validés AVANT la pose des marqueurs (commit 52955b31) :
  // la version gratuite reste mot pour mot le texte relu, à la seule retouche B1 près (relecture à
  // l'aveugle du rythme : « Rendez-vous le mois prochain, » devient « À bientôt, », n°2 inchangé).
  const RELUS = [
    "17bf6d3317371c5df94a3edcb236c80a651da216f06a70c598dc1561707d942c",
    "1b371870289f39f3fee11169207b00140da04a6f0fa5ac3f9984fc8bd51a0a6e",
    "e48728ec0ebf4272c450d59c9f03ad5793d0aee4f53188efe6b5af78df426be7",
    "cfdd5e96267b1985f3c08d3cf8c464f729a601895baaf2b2e89909d09535d67e",
    "76239cead4c3124c6c73d0e7ff2e7f41a370e09855a072ed7376c459aa687b81",
    "1e3568df7916df6dcfa3203fab00d2479ed74b938c0e2ae7ca8abddc20031f61",
  ];
  const sha = (t: string) => createHash("sha256").update(t, "utf8").digest("hex");

  it("les 6 numéros : bloc d'invitation entre marqueurs exacts ; version gratuite = texte relu, mot pour mot", () => {
    numeros.forEach((n, i) => {
      const d = decouperInvitation(n.corps);
      expect(d?.invitation).toMatch(/^[^\n]+\nVoir l'offre Premium : https:\/\/deviens-marrant\.fr\/abonnement\?utm_source=lettre&utm_medium=email&utm_content=n\d-premium$/);
      const gratuite = versionGratuite(n.corps) as string;
      expect(gratuite.split("À bientôt,").length - 1).toBe(n.numero === 2 ? 0 : 1);
      expect(gratuite).not.toContain("Rendez-vous le mois prochain");
      expect(sha(gratuite.replace("À bientôt,", "Rendez-vous le mois prochain,"))).toBe(RELUS[i]);
    });
  });

  it("version Premium = version gratuite sans le seul paragraphe d'invitation, et passe les interdits commerciaux de la lettre de la semaine", () => {
    for (const n of numeros) {
      const gratuite = versionGratuite(n.corps) as string;
      const premium = versionPremium(n.corps) as string;
      const paragraphes = gratuite.split("\n\n");
      const retires = paragraphes.filter((p) => !premium.split("\n\n").includes(p));
      expect(retires).toEqual([decouperInvitation(n.corps)?.invitation]);
      expect(premium).toBe(paragraphes.filter((p) => p !== retires[0]).join("\n\n"));
      expect(motifsInterdits([n.objet, n.preEntete ?? "", corpsNumeroPremium(n.corps, "https://deviens-marrant.fr", "jeton")].join("\n"))).toEqual([]);
      expect(premium).not.toContain("[[");
      expect(premium).toMatch(/L'Équipe Deviens Marrant$/);
    }
  });

  it("marqueurs mal posés ou offre hors du bloc : le numéro est refusé par le schéma", () => {
    const n1 = numerosJson[0];
    const sansFin = n1.corps.replace("\n[[/invitation-premium]]", "");
    const sansMarqueurs = n1.corps.replace("[[invitation-premium]]\n", "").replace("\n[[/invitation-premium]]", "");
    const colle = n1.corps.replace("\n\n[[invitation-premium]]", "\n[[invitation-premium]]");
    for (const corps of [sansFin, sansMarqueurs, colle, `${n1.corps}\n\n[[invitation-premium]]\nx\n[[/invitation-premium]]\n\nFin`]) {
      expect(numeroSchema.safeParse({ ...n1, corps }).success).toBe(false);
    }
    expect(decouperInvitation("Sans invitation.")).toEqual({ avant: "Sans invitation.", invitation: null, apres: "" });
    expect(versionPremium("Sans invitation.")).toBe("Sans invitation.");
  });
});
