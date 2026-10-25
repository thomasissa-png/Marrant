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
import { decouperInvitation, versionGratuite, versionPremium } from "@/lib/lettre/invitation-premium";
import { motifsInterdits } from "@/lib/lettre/numeros-hebdo";
import { corpsNumeroPremium } from "@/lib/lettre/envoi";
import { jourParis, numeroEnvoyable, numeroSchema, type NumeroLettre } from "@/lib/lettre/numeros";
import { aHeureParis } from "@/lib/lettre/calendrier";
import { lettresDuMoisALire, lettresDuMoisSource, versionALire } from "../helpers/lettres-md";
import { PARCOURS_SLUGS, type ParcoursSlug } from "@/lib/entrees-parcours";
import { titreEtape } from "@/config/parcours-etapes";
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
        expect(u.searchParams.get("utm_content")).toMatch(new RegExp(`^n${n.numero}-(article|premium|etape\\d)$`));
        // Lien d'étape : ancre et utm du même rang.
        if (racine === "parcours") expect(`#${u.hash.slice(1)}`).toBe(`#etape-${(u.searchParams.get("utm_content") ?? "").replace(/^n\d-etape/, "")}`);
        if (racine === "parcours") expect(titreEtape(slug as ParcoursSlug, Number(u.hash.replace("#etape-", "")))).not.toBeNull();
      }
    }
  });

  it("date plancher = jour de publication de l'article cité en base (dates des fiches) ; aucune pour un article du code déjà en ligne", () => {
    // Publications relevées dans les fiches et REPLIT_ACTIONS (s22) : repas de famille 23/11/2026,
    // résolution 28/12/2026, couple 05/11/2026, se présenter 12/10/2026, poisson d'avril 25/02/2027.
    const PUBLICATIONS: Record<string, string> = {
      "repas-de-famille-questions-genantes-humour": "2026-11-23",
      "resolution-nouvelle-annee-etre-plus-drole": "2026-12-28",
      "blagues-de-couple-drole": "2026-11-05",
      "se-presenter-avec-humour": "2026-10-12",
      "blagues-poisson-d-avril-adultes": "2027-02-25",
    };
    for (const n of numeros) {
      const articles = liens(n).filter((u) => u.pathname.startsWith("/blog/")).map((u) => u.pathname.split("/")[2]);
      expect(articles).toHaveLength(1);
      const duCode = blogArticles.find((a) => a.slug === articles[0]);
      if (duCode) {
        expect(n.datePlancher ?? null).toBeNull();
        expect(duCode.date.slice(0, 10) <= jourParis(new Date(n.envoiPrevu as string))).toBe(true);
      } else {
        expect(n.datePlancher).toBe(PUBLICATIONS[articles[0]]);
      }
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
      const [an, mois, jour] = (n.datePlancher as string).split("-").map(Number);
      const plancher = aHeureParis(an, mois, jour, 0);
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
  it("les 6 numéros : bloc d'invitation entre marqueurs exacts ; texte = fichier relu, mot pour mot (source et version à lire)", () => {
    const source = lettresDuMoisSource();
    const aLire = lettresDuMoisALire();
    expect(source.map((s) => s.cle)).toEqual(numeros.map((n) => n.periode));
    expect(aLire.map((a) => a.numero)).toEqual(numeros.map((n) => n.numero));
    numeros.forEach((n, i) => {
      const d = decouperInvitation(n.corps);
      expect(d?.invitation).toMatch(/^PS : [^\n]+\nVoir ce que Premium ouvre : https:\/\/deviens-marrant\.fr\/abonnement\?utm_source=lettre&utm_medium=email&utm_content=n\d-premium$/);
      expect(n).toMatchObject({ objet: source[i].objet, preEntete: source[i].preEntete, corps: source[i].corps, datePlancher: source[i].datePlancher, envoiPrevu: source[i].envoiPrevu, statut: "VALIDE" });
      expect(versionALire(n.corps)).toBe(aLire[i].corps);
      expect([n.objet, n.preEntete]).toEqual([aLire[i].objet, aLire[i].preEntete]);
      expect(n.objet.length).toBeLessThanOrEqual(45);
      expect(n.corps.startsWith("Salut,\n\n")).toBe(true);
      expect(versionGratuite(n.corps)).toMatch(/\n(À bientôt|Bonnes fêtes, et à bientôt),\nL'Équipe Deviens Marrant$/);
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
