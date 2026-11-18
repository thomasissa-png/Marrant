/**
 * @jest-environment node
 */
/**
 * s26 (`docs/ux/rubriques-premium-s26.md` §0, §1.1, §2.1, §3.1, critère 4) : les aperçus de « Quoi répondre »,
 * « Bibliothèque » et « S'entraîner » passent au modèle VERROUILLÉ d'« Aujourd'hui ». Verrouillage RÉEL, page par page :
 * aucune chaîne verrouillée de la fiche désignée dans le HTML serveur (`renderToString` de la page entière), ni dans
 * AUCUNE prop de l'arbre rendu (sur-ensemble de ce qu'un composant client reçoit, donc du payload RSC). Interrupteur
 * SIMULÉ ouvert ; le code livré reste fermé (`inertie-espace.test.tsx`).
 */
import { isValidElement } from "react";
import { renderToString } from "react-dom/server";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  },
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("next/headers", () => ({ headers: () => ({ get: () => null }), cookies: () => ({ get: () => undefined }) }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })), lireAccesEspace: jest.fn() }));
const lecteur = jest.fn();
jest.mock("@/components/espace/apercu/acces", () => ({
  ...jest.requireActual("@/components/espace/apercu/acces"),
  lireLecteurApercu: () => lecteur(),
}));

import QuoiRepondrePage from "@/app/(dashboard)/mon-espace/quoi-repondre/page";
import BibliothequePage from "@/app/(dashboard)/mon-espace/bibliotheque/page";
import SEntrainerPage from "@/app/(dashboard)/mon-espace/s-entrainer/page";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import { ADRESSES_APERCU } from "@/components/espace/apercu/acces";
import { ADRESSES_OFFRE_EN_HAUT, offreEnHaut } from "@/components/espace/apercu/offre-en-haut";
import { missionsServiesValidees } from "@/lib/espace/missions";
import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_FICHE } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARTES, TEXTES_MISSION } from "@/config/textes/espace-cartes";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
beforeAll(() => {
  drapeau.__ESPACE_OUVERT__ = true;
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

/** Entités HTML ramenées au texte, balises retirées, sans espaces ni ponctuation typographique (`frEspace`). */
const nu = (html: string) =>
  html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .normalize("NFC")
    .replace(/<[^>]*>/g, "")
    .replace(/[\s  ⁠'’«»"“”]/g, "");

/** Toutes les chaînes d'un sous-arbre de données (texte, pourquoi, essais…). */
const feuilles = (x: unknown): string[] =>
  typeof x === "string" ? [x] : Array.isArray(x) ? x.flatMap(feuilles) : x && typeof x === "object" ? Object.values(x).flatMap(feuilles) : [];

/**
 * Déplie l'arbre rendu par la page en appelant chaque composant fonction (serveur) ; un composant à hooks (client)
 * lève hors rendu : on garde ses props (ce qui lui serait envoyé) et on continue dans ses enfants. Rend la liste de
 * toutes les props rencontrées, sérialisées.
 */
function propsDeLArbre(n: unknown, sortie: string[] = []): string[] {
  if (n == null || typeof n === "boolean") return sortie;
  if (Array.isArray(n)) {
    for (const x of n) propsDeLArbre(x, sortie);
    return sortie;
  }
  if (typeof n === "string" || typeof n === "number") {
    sortie.push(String(n));
    return sortie;
  }
  if (!isValidElement(n)) return sortie;
  const { children, ...props } = n.props as Record<string, unknown>;
  sortie.push(JSON.stringify(props));
  if (typeof n.type === "function") {
    const espion = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      return propsDeLArbre((n.type as (p: unknown) => unknown)(n.props), sortie);
    } catch {
      // composant client (hooks) : ses props sont déjà relevées, on suit ses enfants
    } finally {
      espion.mockRestore();
    }
  }
  return propsDeLArbre(children, sortie);
}

const verrouille = (texte: string, interdits: readonly string[]) => {
  for (const i of interdits) expect(texte).not.toContain(nu(i));
};

/** Props de tout l'arbre : le témoin (texte en clair de l'extrait) prouve que le dépliage atteint bien l'extrait. */
const propsVerrouillees = (arbre: unknown, interdits: readonly string[], temoin: string) => {
  const props = nu(propsDeLArbre(arbre).join("\n"));
  expect(props).toContain(nu(temoin));
  verrouille(props, interdits);
};

const LECTEURS = [["visiteur"], ["gratuit"]] as const;

describe("Quoi répondre : verrouillage réel", () => {
  const fiche = ficheApercu("quoiRepondre");
  if (fiche.type !== "situation") throw new Error("situation attendue");
  const c = fiche.contenu;
  const INTERDITS = [
    "Elle est à moi",
    "déraciner",
    "Troc possible",
    "Nier d'abord",
    "Jeudi, c'était pâtes",
    ...feuilles(c.repliques),
    ...feuilles(c.quandMonterDUnCran),
    c.erreur,
    ...feuilles(c.scene.suite),
    ...feuilles(fiche.geste),
  ];

  it.each(LECTEURS)("%s : ni HTML ni props ; la partie en clair et les trois libellés oui", async (qui) => {
    lecteur.mockResolvedValue(qui);
    const arbre = await QuoiRepondrePage({ searchParams: {} });
    const html = nu(renderToString(arbre));
    verrouille(html, INTERDITS);
    propsVerrouillees(arbre, INTERDITS, c.scene.texte);
    expect(html).toContain(nu(fiche.titre));
    expect(html).toContain(nu(c.scene.texte));
    for (const r of Object.keys(c.repliques)) expect(html).toContain(nu(TEXTES_CARTES.registres[r as keyof typeof TEXTES_CARTES.registres]));
    expect(html).toContain(nu(TEXTES_APERCU_VERROUILLE.promesseQuoiRepondre));
    expect(renderToString(arbre)).toContain("data-apercu-verrouille");
  });
});

describe("Bibliothèque : verrouillage réel", () => {
  const fiche = ficheApercu("bibliotheque");
  if (fiche.type !== "construction") throw new Error("construction attendue");
  const c = fiche.contenu;
  const INTERDITS = [
    "je regarde ça",
    "un peu en retard",
    "Trop flou",
    "non mais je rigole",
    c.exemple,
    ...feuilles(c.commentCestFait),
    ...feuilles(c.essais),
    c.regle,
    c.erreur,
    ...feuilles(fiche.geste),
  ];

  it.each(LECTEURS)("%s : ni HTML ni props ; le schéma en clair et les quatre blocs fermés par leur libellé", async (qui) => {
    lecteur.mockResolvedValue(qui);
    const arbre = await BibliothequePage();
    const html = nu(renderToString(arbre));
    verrouille(html, INTERDITS);
    propsVerrouillees(arbre, INTERDITS, c.schemaEnUneLigne);
    expect(html).toContain(nu(c.schemaEnUneLigne));
    for (const l of [TEXTES_FICHE.exemple, TEXTES_FICHE.commentCestFait, TEXTES_FICHE.essais, TEXTES_FICHE.regle]) expect(html).toContain(nu(l));
    expect(html).toContain(nu(TEXTES_APERCU_VERROUILLE.promesseBibliotheque));
  });
});

describe("S'entraîner : verrouillage réel", () => {
  const fiche = ficheApercu("sEntrainer");
  if (fiche.type !== "jeu") throw new Error("jeu attendu");
  const c = fiche.contenu;
  const ENONCES = missionsServiesValidees().flatMap((m) => feuilles(m.enonce));
  const INTERDITS = ["truqué en toute franchise", "un cran trop bas", "ne relèverait pas son jeu", ...feuilles(c.explication), ...feuilles(c.ceQuOnAuraitPuDire).filter((l) => l.length > 2), ...feuilles(fiche.geste), ...ENONCES];

  it.each(LECTEURS)("%s : ni HTML ni props (lettre juste, explication, énoncés des missions) ; consigne et A, B, C en clair", async (qui) => {
    lecteur.mockResolvedValue(qui);
    const arbre = await SEntrainerPage({ searchParams: {} });
    const html = nu(renderToString(arbre));
    expect(ENONCES.length).toBeGreaterThan(0);
    verrouille(html, INTERDITS);
    propsVerrouillees(arbre, INTERDITS, c.consigne);
    expect(html).toContain(nu(c.consigne));
    for (const p of c.matiere ?? []) expect(html).toContain(nu(p));
    for (const n of [1, 2, 3, 4, 5] as const) expect(html).toContain(nu(TEXTES_MISSION.titresMarches[n]));
    // La lettre juste n'est montrée nulle part hors des propositions : le bloc fermé ne porte que son libellé.
    expect(renderToString(arbre)).toMatch(/data-bloc-ferme="Ce qu/);
    expect(html).toContain(nu(TEXTES_APERCU_VERROUILLE.promesseSEntrainer));
  });
});

describe("offre en haut : les trois adresses passées à `ApercuVerrouille`", () => {
  it("« Aujourd'hui », « Quoi répondre », « Bibliothèque », « S'entraîner », égales à `ADRESSES_APERCU`", () => {
    // s26 (`docs/ux/favoris-carnet-s26.md` §1.2 et §2.2) : Favoris (aperçu `ApercuVerrouille`) et le carnet du non-abonné
    // (hero 8/4, offre en haut, `/carnet` et `/carnet/<mois>`) s'ajoutent.
    expect(ADRESSES_OFFRE_EN_HAUT).toEqual([ADRESSES_APERCU.aujourdhui, ADRESSES_APERCU.quoiRepondre, ADRESSES_APERCU.bibliotheque, ADRESSES_APERCU.sEntrainer, ADRESSES_APERCU.favoris, "/carnet"]);
    expect(offreEnHaut("/mon-espace/bibliotheque?x=1")).toBe(true);
    expect(offreEnHaut("/favoris#x")).toBe(true);
    expect(offreEnHaut("/carnet/2026-10?src=blog")).toBe(true);
    for (const autre of [ADRESSES_APERCU.mesQuestions, ADRESSES_APERCU.mesRepliques, "/carnet/2026-10/x", "/carnetx"]) expect(offreEnHaut(autre)).toBe(false);
  });
});
