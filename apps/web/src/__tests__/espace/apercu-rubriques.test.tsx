/**
 * Nav v6 (s25, lot B) : pages d'aperçu des rubriques Premium (`docs/ux/navigation-v6-menu-rubriques.md` §2),
 * interrupteur SIMULÉ ouvert (jamais le code livré, qui reste fermé) :
 * - visiteur et inscrit gratuit : l'aperçu À L'ADRESSE de la rubrique, sans redirection, tête `noindex, follow` ;
 *   une fiche réelle figée (liste à confirmer par Thomas), un seul bouton d'offre ;
 * - abonné actif : la rubrique, tête d'avant ; ancien abonné : la garde d'avant ; fermé : 404 avant toute lecture ;
 * - layout : aucune redirection sur les 6 adresses ; les autres adresses gardent la garde (fil, fiche…).
 */
import { render, screen, within } from "@testing-library/react";

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
// jsdom (rendu des pages) : `next/server` n'y a pas de `Request` ; la garde n'en utilise que `NextResponse.json`.
jest.mock("next/server", () => ({ NextResponse: { json: jest.fn() } }));
const enTetes = new Map<string, string>();
jest.mock("next/headers", () => ({ headers: () => ({ get: (nom: string) => enTetes.get(nom) ?? null }) }));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const findUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: (...a: unknown[]) => findUnique(...a) } } }));
const noter = jest.fn(async () => undefined);
jest.mock("@/lib/mesure/evenements-espace", () => ({ noterEvenementEspace: (...a: unknown[]) => noter(...(a as [])) }));
const listerFils = jest.fn(async () => []);
jest.mock("@/lib/espace/questions", () => ({ listerFils: (...a: unknown[]) => listerFils(...(a as [])) }));
// v6 tour 1 (arbitrage 3) : l'aperçu de Favoris lit la page 1 du catalogue ; base indisponible (`null`) par défaut.
const getJokesPage = jest.fn(async (): Promise<unknown> => null);
const getTipsPage = jest.fn(async (): Promise<unknown> => null);
jest.mock("@/lib/catalogue-pages", () => ({ getJokesPage: () => getJokesPage(), getTipsPage: () => getTipsPage() }));

import { EN_TETE_CHEMIN_ESPACE } from "@/config/espace-client";
import { TEXTES_APERCU, TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { PASTILLES_FAVORIS } from "@/components/espace/apercu/apercu-favoris";
import { frEspace } from "@/lib/fr-typo";
// s26 bouton Tout ouvrir : espace ouvert, le bouton d'offre est « Tout ouvrir · 1,99 €/mois » (EN_TETE_OUVERT).
import { EN_TETE_OUVERT } from "@/config/textes/cta-articles-accueil";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";
import MonEspaceLayout from "@/app/(dashboard)/mon-espace/layout";
import AujourdhuiPage, { generateMetadata as metaAujourdhui } from "@/app/(dashboard)/mon-espace/page";
import QuoiRepondrePage, { generateMetadata as metaQuoiRepondre } from "@/app/(dashboard)/mon-espace/quoi-repondre/page";
import BibliothequePage from "@/app/(dashboard)/mon-espace/bibliotheque/page";
import SEntrainerPage from "@/app/(dashboard)/mon-espace/s-entrainer/page";
import MesQuestionsPage, { generateMetadata as metaQuestions } from "@/app/(dashboard)/mon-espace/questions/page";
import MesRepliquesPage from "@/app/(dashboard)/mon-espace/repliques/page";
import { ADRESSES_APERCU, estAdresseApercu } from "@/components/espace/apercu/acces";
import { sourceApercu } from "@/components/espace/apercu/apercu-rubrique";
import { FavorisOuvert } from "@/components/espace/apercu/favoris-ouvert";
import FavorisPage from "@/app/(dashboard)/favoris/page";
import { readFileSync } from "fs";
import { join } from "path";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const GRATUIT = { plan: "FREE", subscription: null };
const ANCIEN = { plan: "FREE", subscription: { stripeSubscriptionId: "sub_fini" } };
const ACTIF = { plan: "PREMIUM", subscription: { stripeSubscriptionId: "sub_actif" } };
const SP = { searchParams: {} };

const PAGES = [
  // Refonte s25 (`docs/ux/aujourdhui-refonte-s25.md` §3.2) : l'extrait réel d'« Aujourd'hui » est le tableau de bord
  // fermé (plus une fiche situation entière) ; le bloc d'offre du hero garde bouton et « Connexion ».
  ["aujourdhui", () => AujourdhuiPage(SP), "tableau-aujourdhui"],
  ["quoiRepondre", () => QuoiRepondrePage(SP), "coloc-la-poele"],
  ["bibliotheque", () => BibliothequePage(), "le-faux-secret"],
  ["sEntrainer", () => SEntrainerPage(SP), "quelle-replique-1"],
  ["mesQuestions", () => MesQuestionsPage(), "questions-exemples"],
  ["mesRepliques", () => MesRepliquesPage(), "coloc-la-poele"],
] as const;

beforeEach(() => {
  drapeau.__ESPACE_OUVERT__ = true;
  enTetes.clear();
  getServerSession.mockReset();
  findUnique.mockReset();
  noter.mockClear();
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

const visiteur = () => getServerSession.mockResolvedValue(null);
const compte = (c: object) => {
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  findUnique.mockResolvedValue(c);
};

describe("adresses et textes", () => {
  it("les 7 rubriques Premium de la bande (Parcours : la page publique ; Favoris hors du layout de l'espace)", () => {
    expect(Object.values(ADRESSES_APERCU)).toEqual([
      "/mon-espace",
      "/mon-espace/quoi-repondre",
      "/mon-espace/bibliotheque",
      "/mon-espace/s-entrainer",
      "/mon-espace/questions",
      "/mon-espace/repliques",
      "/favoris",
    ]);
    expect(estAdresseApercu("/mon-espace/s-entrainer?marche=2")).toBe(true);
    for (const autre of ["/mon-espace/questions/clx0fil", "/mon-espace/fiche/situation/coloc-la-poele", "/mon-espace/lettres", "/favoris", "/parcours", null]) {
      expect(estAdresseApercu(autre)).toBe(false);
    }
  });

  it("sous-titre validé, bouton et prix de l'en-tête, zéro tiret cadratin", () => {
    expect(TEXTES_APERCU.sousTitre).toBe("Voici un exemple de cette rubrique. Elle est ouverte avec Premium.");
    expect(TEXTES_APERCU.offre.bouton).toBe(EN_TETE_OUVERT.bouton);
    expect(EN_TETE_OUVERT.bouton).toContain(PREMIUM_PRICE_LABEL);
    expect(JSON.stringify(TEXTES_APERCU)).not.toMatch(/—/);
  });

  it("source de mesure du clic d'offre, une par rubrique", () => {
    expect(Object.keys(ADRESSES_APERCU).map((r) => sourceApercu(r as keyof typeof ADRESSES_APERCU))).toEqual([
      "apercu-aujourdhui",
      "apercu-quoi-repondre",
      "apercu-bibliotheque",
      "apercu-s-entrainer",
      "apercu-questions",
      "apercu-repliques",
      "apercu-favoris",
    ]);
  });
});

describe("layout ouvert", () => {
  it("visiteur et inscrit gratuit sur une adresse d'aperçu : aucune redirection, aucune mesure", async () => {
    for (const chemin of Object.values(ADRESSES_APERCU).filter((a) => a.startsWith("/mon-espace"))) {
      enTetes.set(EN_TETE_CHEMIN_ESPACE, chemin);
      visiteur();
      await expect(MonEspaceLayout({ children: null })).resolves.toBeTruthy();
      compte(GRATUIT);
      await expect(MonEspaceLayout({ children: null })).resolves.toBeTruthy();
    }
    expect(noter).not.toHaveBeenCalled();
  });

  it("abonné sur une adresse d'aperçu : passe et note l'ouverture", async () => {
    enTetes.set(EN_TETE_CHEMIN_ESPACE, "/mon-espace/bibliotheque");
    compte(ACTIF);
    await expect(MonEspaceLayout({ children: null })).resolves.toBeTruthy();
    expect(noter).toHaveBeenCalledWith({ type: "espace_ouvert" }, "u1");
  });

  it("ancien abonné sur une adresse d'aperçu : la garde d'avant (`/abonnement`)", async () => {
    enTetes.set(EN_TETE_CHEMIN_ESPACE, "/mon-espace");
    compte(ANCIEN);
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT /abonnement");
  });

  it("toute autre adresse de l'espace garde la garde (connexion, /abonnement)", async () => {
    enTetes.set(EN_TETE_CHEMIN_ESPACE, "/mon-espace/fiche/situation/coloc-la-poele");
    visiteur();
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT /login");
    compte(GRATUIT);
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT /abonnement");
  });

  it("fermé : 404 sans lire la session", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    enTetes.set(EN_TETE_CHEMIN_ESPACE, "/mon-espace/quoi-repondre");
    await expect(MonEspaceLayout({ children: null })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(getServerSession).not.toHaveBeenCalled();
  });
});

describe.each(PAGES)("page %s ouverte", (rubrique, page, fiche) => {
  it("visiteur : l'aperçu à cette adresse, la fiche réelle, un seul bouton d'offre et « Connexion »", async () => {
    visiteur();
    render(await page());
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(TEXTES_APERCU.titres[rubrique]);
    expect(document.querySelector(`[data-apercu-fiche="${fiche}"]`)).not.toBeNull();
    const offre = document.querySelector("[data-apercu-offre]") as HTMLElement;
    const liens = within(offre).getAllByRole("link");
    expect(liens).toHaveLength(2);
    expect(liens[0].textContent).toBe(EN_TETE_OUVERT.bouton);
    const href = new URL(liens[0].getAttribute("href") ?? "", "https://x");
    expect(href.pathname).toBe("/abonnement");
    expect(href.searchParams.get("returnTo")).toBe(ADRESSES_APERCU[rubrique]);
    expect(href.searchParams.get("src")).toBe(sourceApercu(rubrique));
    expect(liens[1].textContent).toBe(TEXTES_APERCU.connexion);
    expect(liens[1].getAttribute("href")).toBe(`/login?callbackUrl=${encodeURIComponent(ADRESSES_APERCU[rubrique])}`);
    expect(document.querySelector("[data-lien-retour]")).toBeNull();
  });

  it("inscrit gratuit : l'aperçu, le bouton seul (pas de « Connexion »)", async () => {
    compte(GRATUIT);
    render(await page());
    const offre = document.querySelector("[data-apercu-offre]") as HTMLElement;
    expect(within(offre).getAllByRole("link")).toHaveLength(1);
  });

  it("ancien abonné : la garde d'avant, `/abonnement` et ses lignes « historique gardé » (hors spec v6)", async () => {
    compte(ANCIEN);
    await expect(page()).rejects.toThrow("NEXT_REDIRECT /abonnement");
  });

  it("fermé : 404 avant toute lecture", async () => {
    drapeau.__ESPACE_OUVERT__ = false;
    await expect(page()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(getServerSession).not.toHaveBeenCalled();
  });
});

describe("Favoris (`/favoris`, hors /mon-espace)", () => {
  // s26 (`docs/ux/favoris-carnet-s26.md` §1.2) : l'aperçu passe au squelette `ApercuVerrouille` (hero 8/4, offre en haut,
  // extrait coupé) ; mêmes deux contenus réels en lecture seule (décision du 15/11). Base indisponible : tuiles fermées.
  it("s26, visiteur, base indisponible : hero, promesse, offre en haut avec « Connexion », tuiles fermées", async () => {
    visiteur();
    render(await FavorisOuvert({ children: <p data-contenu-favoris /> }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Favoris");
    expect(document.querySelector('[data-apercu-verrouille][data-apercu="favoris"]')).not.toBeNull();
    expect(screen.getByText(frEspace(TEXTES_APERCU_VERROUILLE.promesseFavoris))).toBeTruthy();
    const fermees = Array.from(document.querySelectorAll("[data-apercu-type-ferme]")).map((e) => e.getAttribute("data-apercu-type-ferme"));
    expect(fermees).toEqual(["JOKE", "TIP", "VIDEO"]);
    expect(document.querySelector("[data-contenu-favoris]")).toBeNull();
    const liens = within(document.querySelector("[data-apercu-offre]") as HTMLElement).getAllByRole("link");
    expect(liens.map((l) => l.getAttribute("href"))).toEqual(["/abonnement?returnTo=%2Ffavoris&src=apercu-favoris", "/login?callbackUrl=%2Ffavoris"]);
    expect(PASTILLES_FAVORIS).toEqual(["Tout", "Vannes", "Conseils", "Vidéos"]);
  });

  it("v6 tour 1 (arbitrage 3), s26 : la première vanne (chute visible) et le premier conseil REPLIÉ, en lecture seule", async () => {
    const vanne = { id: "j1", content: "Le début", punchline: "La chute", category: "ABSURDE", type: "X", maturityLevel: 1, comedyTechnique: null, techniqueExplanation: null, howToApply: null };
    const conseil = { id: "t1", title: "Le titre", content: "Le contenu.", category: "TIMING", difficulty: "DEBUTANT", example: "L'exemple.", exercise: "" };
    getJokesPage.mockResolvedValueOnce({ items: [vanne, { ...vanne, id: "j2" }] });
    getTipsPage.mockResolvedValueOnce({ items: [conseil] });
    compte(GRATUIT);
    render(await FavorisOuvert({ children: <p data-contenu-favoris /> }));
    expect(document.querySelector('[data-apercu-type-ferme="JOKE"]')).toBeNull();
    const exemples = document.querySelector('[data-apercu-fiche="favoris-exemples"]') as HTMLElement;
    expect(Array.from(exemples.querySelectorAll("[data-favori-lecture]")).map((e) => e.getAttribute("data-favori-lecture"))).toEqual(["vanne", "conseil"]);
    expect(within(exemples).getByText("La chute")).toBeTruthy();
    expect(within(exemples).getByText("Absurde")).toBeTruthy();
    expect(within(exemples).getByText("Timing")).toBeTruthy();
    // s26 : conseil replié (plus de bloc « Exemple »), une seule catégorie, ni pastille colorée ni capitales.
    expect(exemples.textContent).not.toContain("L'exemple.");
    expect(exemples.textContent).not.toContain("Débutant");
    // s26 contrôle d'ensemble, aperçus (DA de l'accueil, Thomas 20/11) : pastille violette du type (`text-accent-link`)
    // et bandeau sur les cartes ; toujours aucune capitale.
    expect(exemples.innerHTML).not.toMatch(/uppercase/);
    expect(exemples.querySelectorAll("[data-bandeau-da]").length).toBeGreaterThanOrEqual(2);
    // Lecture seule : aucun bouton (ni « Retirer », ni partage), aucun lien ; un seul bouton d'offre dans le hero.
    expect(within(exemples).queryAllByRole("button")).toHaveLength(0);
    expect(within(exemples).queryAllByRole("link")).toHaveLength(0);
    expect(within(document.querySelector("[data-apercu-offre]") as HTMLElement).getAllByRole("link")).toHaveLength(1);
  });

  it("abonné et ancien abonné : la page d'avant (la liste montre déjà son mur Premium à l'ancien abonné)", async () => {
    for (const c of [ACTIF, ANCIEN]) {
      compte(c);
      const { unmount } = render(await FavorisOuvert({ children: <p data-contenu-favoris /> }));
      expect(document.querySelector("[data-contenu-favoris]")).not.toBeNull();
      expect(document.querySelector("[data-apercu]")).toBeNull();
      unmount();
    }
  });

  it("fermé : la page ne monte jamais l'aperçu (rendu synchrone d'aujourd'hui)", () => {
    drapeau.__ESPACE_OUVERT__ = false;
    const arbre = FavorisPage() as React.ReactElement;
    expect(arbre.type).not.toBe(FavorisOuvert);
    expect(getServerSession).not.toHaveBeenCalled();
  });

  // s26 : l'état vide n'est plus montré dans l'aperçu (tuiles fermées) ; onglets et étiquettes viennent de la liste.
  it("s26 : onglets et étiquettes de l'aperçu repris de la liste des favoris (aucun texte neuf)", () => {
    const source = readFileSync(join(__dirname, "../../components/favoris/favoris-list.tsx"), "utf8");
    expect(source).toContain('TABS, TIP_CATEGORY_LABELS, type TabFilter } from "@/components/favoris/libelles"');
    for (const t of ["Vanne", "Conseil", "Vidéo"]) expect(source).toContain(`>${t}</Badge>`);
  });
});

describe("tête des pages", () => {
  it("aperçu : titre de la rubrique, `noindex, follow`", async () => {
    visiteur();
    expect(await metaQuoiRepondre()).toMatchObject({ title: "Quoi répondre", robots: { index: false, follow: true } });
    compte(GRATUIT);
    expect(await metaAujourdhui()).toMatchObject({ title: "Aujourd’hui", robots: { index: false, follow: true } });
  });

  it("abonné : la tête d'avant (le layout garde `noindex, nofollow`)", async () => {
    compte(ACTIF);
    expect(await metaQuestions()).toEqual({ title: "Mes questions" });
    expect(await metaAujourdhui()).toEqual({});
  });

  it("abonné : la rubrique, pas l'aperçu (Mes questions)", async () => {
    compte(ACTIF);
    render(await MesQuestionsPage());
    expect(document.querySelector("[data-apercu]")).toBeNull();
    expect(listerFils).toHaveBeenCalledWith("u1");
  });
});
