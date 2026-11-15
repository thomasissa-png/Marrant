/**
 * v6 tour 2, lot 2 (pages publiques vues en régime ouvert), plan `plan-corrections-v6-tour-2.md` points 8, 9, 11,
 * 13 et 14. Chaque correction n'existe qu'interrupteur ouvert ; fermé, le rendu d'avant (vérifié ici composant par
 * composant, et au caractère près par `inertie-espace.test.tsx`).
 */
import { TextEncoder } from "util";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactElement } from "react";

const etat = globalThis as { __V6T2_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __V6T2_OUVERT__?: boolean }).__V6T2_OUVERT__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error("notFound");
  },
}));
const useSession = jest.fn(() => ({ data: null as unknown, status: "unauthenticated" }));
jest.mock("next-auth/react", () => ({ useSession: () => useSession() }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));
jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: () => ({ isFavorite: () => false, addFavorite: jest.fn(), removeFavorite: jest.fn(), getFavoriteId: () => null }),
}));
// /lettre : dernier numéro lu en base (simulé), accès de l'espace fermé (visiteur), formulaire hors sujet ici.
const mockCorps =
  "Lire l'article : https://deviens-marrant.fr/blog/rester-muet-en-groupe?utm_source=lettre&utm_medium=email&utm_content=n1-article\n" +
  "Aller à l'étape 3 : https://deviens-marrant.fr/parcours/repartie?utm_source=lettre&utm_medium=email&utm_content=n1-etape3#etape-3\n" +
  "Voir ce que Premium ouvre : https://deviens-marrant.fr/abonnement?utm_source=lettre&utm_medium=email&utm_content=n1-premium.";
jest.mock("@/lib/lettre/apercu", () => ({ lireApercuLettre: async () => ({ dernier: { subject: "Alors, t'as perdu ta langue ?", bodyText: mockCorps } }) }));
jest.mock("@/config/lettre", () => ({ ...jest.requireActual("@/config/lettre"), LETTRE_INSCRIPTIONS_OUVERTES: true }));
jest.mock("@/components/lettre/lettre-page-inscription", () => ({ LettrePageInscription: () => null }));
jest.mock("@/lib/espace/garde", () => ({ lireAccesEspace: async () => ({ acces: "ferme" }) }));
// Archive de l'abonné : lettres lues en base (simulées).
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/lettres", () => ({
  listerLettres: async () => [
    { numero: 2, titre: "Lettre du 12 novembre", objet: "Objet 2" },
    { numero: 1, titre: "Lettre du 5 novembre", objet: "Objet 1" },
  ],
}));
jest.mock("@/lib/espace/compteurs", () => ({ compterAnonyme: async () => undefined }));
// /vannes : statistiques et liste serveur hors sujet (la liste est testée à part).
jest.mock("@/lib/content-stats-server", () => ({ getContentStatsRounded: async () => ({ jokes: 200, tips: 50, videos: 30 }) }));
jest.mock("@/lib/catalogue-pages", () => ({ getJokesPage: async () => null }));
// /profil : compte et abonnement simulés (même patron que `profil-d10-s24.test.tsx`).
jest.mock("@/stores/user-store", () => ({ useUserStore: jest.fn() }));
jest.mock("@/hooks/use-subscription-summary", () => ({
  useSubscriptionSummary: () => ({ summary: { status: "ACTIVE", hasPortal: true, hasStripeSubscription: true, cancelAtPeriodEnd: false, formule: "monthly", priceCents: 199, currentPeriodEnd: "2026-12-09T09:00:00.000Z" }, openPortal: jest.fn(), portalLoading: null }),
}));
jest.mock("@/app/(dashboard)/profil/rappel-parcours-toggle", () => ({ RappelParcoursToggle: () => <section id="rappel-parcours">rappel</section> }));
jest.mock("@/components/lettre/lettre-hebdo-reglage", () => ({ LettreHebdoReglage: () => null }));
jest.mock("@/components/espace/cap-profil", () => ({ CapProfil: () => <div data-cap="">cap</div> }));

Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");

import { LettreCorpsApercu, lienSansParametres } from "@/components/lettre/lettre-corps-apercu";
import LettrePage from "@/app/(dashboard)/lettre/page";
import { LettresAbonneCartes } from "@/components/lettre/lettres-abonne-cartes";
import VannesPage from "@/app/(dashboard)/vannes/page";
import { VannesList } from "@/components/vannes/vannes-list";
import { CARTE_VERROUILLEE_LABEL } from "@/config/textes/offre";
import { ParcoursContent, frontiereListe } from "@/components/parcours/parcours-content";
import { ValidationWall } from "@/components/parcours/step-blocks";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import { LISTE_PARCOURS_CTA, FENETRE_COMPTE } from "@/config/textes/cta-pages";
import { frTypo } from "@/lib/fr-typo";
import { ProfilDashboard } from "@/components/profil/profil-dashboard";
import { useUserStore } from "@/stores/user-store";

const ouvrir = (ouvert: boolean) => {
  etat.__V6T2_OUVERT__ = ouvert;
};
afterAll(() => {
  delete etat.__V6T2_OUVERT__;
});
beforeEach(() => {
  ouvrir(false);
  useSession.mockReturnValue({ data: null, status: "unauthenticated" });
});

const serveur = async (el: Promise<ReactElement>) => renderToStaticMarkup(await el);

describe("point 8 : /lettre, corps du dernier numéro", () => {
  it("adresse lisible : hôte et chemin, sans paramètres ; lien relatif sur le site, ancre gardée", () => {
    expect(lienSansParametres("https://deviens-marrant.fr/parcours/repartie?utm_source=lettre#etape-3")).toEqual({
      href: "/parcours/repartie#etape-3",
      texte: "deviens-marrant.fr/parcours/repartie",
    });
    expect(lienSansParametres("https://deviens-marrant.fr/?utm_source=lettre")).toEqual({ href: "/", texte: "deviens-marrant.fr" });
    expect(lienSansParametres("pas une adresse")).toBeNull();
  });

  it("composant : liens courts, ponctuation finale hors du lien, aucun paramètre affiché, coupure partout", () => {
    const { container } = render(<LettreCorpsApercu texte={mockCorps} />);
    const corps = container.querySelector("[data-lettre-corps]") as HTMLElement;
    // v6 tour 3, point 10 : mesure de lecture `max-w-prose` (remplace `max-w-full`), coupure partout gardée.
    expect(corps.className.split(" ")).toEqual(expect.arrayContaining(["min-w-0", "max-w-prose", "[overflow-wrap:anywhere]"]));
    const liens = within(corps).getAllByRole("link");
    expect(liens.map((l) => [l.textContent, l.getAttribute("href")])).toEqual([
      ["deviens-marrant.fr/blog/rester-muet-en-groupe", "/blog/rester-muet-en-groupe"],
      ["deviens-marrant.fr/parcours/repartie", "/parcours/repartie#etape-3"],
      ["deviens-marrant.fr/abonnement", "/abonnement"],
    ]);
    expect(corps.textContent).not.toContain("utm_");
    expect(corps.textContent).toContain("Aller à l'étape 3");
    expect(corps.textContent?.endsWith("deviens-marrant.fr/abonnement.")).toBe(true);
  });

  it("page, ouvert : corps en liens courts", async () => {
    ouvrir(true);
    const html = await serveur(LettrePage({ searchParams: {} }));
    expect(html).toContain("data-lettre-corps");
    expect(html).not.toContain("utm_source");
  });

  it("page, fermé : corps d'avant, adresses brutes (débordement soumis à Thomas)", async () => {
    const html = await serveur(LettrePage({ searchParams: {} }));
    expect(html).not.toContain("data-lettre-corps");
    expect(html).toContain('<div class="mt-2 whitespace-pre-line text-text-secondary">');
    expect(html).toContain("utm_source=lettre");
  });
});

describe("point 9 : archive des lettres de l'abonné", () => {
  // v6 tour 3, point 11 : plus de hauteur minimale (elle créait le vide avant le pied de page).
  it("colonne centrée `max-w-3xl`, H1 centré, cartes deux par ligne dès 640 px, sans hauteur minimale", async () => {
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: await serveur(LettresAbonneCartes()) }} />);
    const racine = container.querySelector("[data-lettres-abonne]") as HTMLElement;
    expect(racine.className.split(" ")).toEqual(expect.arrayContaining(["mx-auto", "max-w-3xl"]));
    expect(racine.className).not.toContain("min-h-[60vh]");
    expect((racine.querySelector("h1") as HTMLElement).closest(".text-center")).not.toBeNull();
    const grille = racine.querySelector("ul") as HTMLElement;
    expect(grille.className).toContain("sm:grid-cols-2");
    expect(grille.className).not.toContain("lg:grid-cols-3");
    expect(grille.querySelectorAll("[data-filet]")).toHaveLength(2);
  });
});

describe("point 11 : /vannes", () => {
  const ANCIENNE = "Passe par les pages thème (boulot, couple, soirées, famille, gaming) ou, avec Premium, par les filtres.";
  const VALIDEE =
    "Choisis une catégorie dans les filtres de la liste. Chaque vanne est rangée par contexte, pour que tu trouves en 3 secondes celle qui colle à ta situation plutôt que celle qui jette un froid. Avec Premium, mets tes préférées en favoris : tu les auras sous la main le jour J.";
  const QUESTION = "Comment trouver la bonne vanne pour une situation ?";

  async function page() {
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: await serveur(VannesPage({ searchParams: {} })) }} />);
    const faqLd = [...container.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => JSON.parse(s.innerHTML) as { "@type": string; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] })
      .find((d) => d["@type"] === "FAQPage");
    const reponseLd = faqLd?.mainEntity?.find((q) => q.name === QUESTION)?.acceptedAnswer.text;
    const reponseAffichee = [...container.querySelectorAll("details")].find((d) => d.textContent?.includes("Comment trouver la bonne vanne"))?.textContent ?? "";
    return { container, reponseLd, reponseAffichee };
  }
  const plat = (t: string) => t.replace(/[  ]/g, " ");

  it("ouvert : réponse validée, mot pour mot, affichée ET dans le JSON-LD", async () => {
    ouvrir(true);
    const { reponseLd, reponseAffichee } = await page();
    expect(reponseLd).toBe(VALIDEE);
    expect(plat(reponseAffichee)).toContain(plat(frTypo(VALIDEE)));
    expect(reponseAffichee).not.toContain("pages thème");
  });

  it("fermé : réponse d'avant, affichée ET dans le JSON-LD", async () => {
    const { reponseLd, reponseAffichee } = await page();
    expect(reponseLd?.startsWith(ANCIENNE)).toBe(true);
    expect(plat(reponseAffichee)).toContain(plat(frTypo(ANCIENNE)));
  });

  it("ouvert : en-tête, FAQ, « Pourquoi » et « La suite » centrés comme l'accueil", async () => {
    ouvrir(true);
    const { container } = await page();
    const entete = container.querySelector("[data-vannes-entete]") as HTMLElement;
    expect(entete.className).toContain("text-center");
    expect((entete.querySelector("p") as HTMLElement).className).toEqual(expect.stringContaining("mx-auto"));
    const titres = [...container.querySelectorAll("h2")];
    for (const t of ["Questions fréquentes", "Pourquoi ces vannes sont différentes", "La suite, si tu as pris goût"]) {
      expect(titres.find((h) => h.textContent === t)?.className.split(" ")).toContain("text-center");
    }
  });

  it("fermé : en-tête et titres comme avant (à gauche)", async () => {
    const { container } = await page();
    expect(container.querySelector("[data-vannes-entete]")).toBeNull();
    for (const h of container.querySelectorAll("h1, h2")) expect(h.className.split(" ")).not.toContain("text-center");
  });

  describe("fin de liste limitée (visiteur, compte gratuit)", () => {
    beforeEach(() => {
      Element.prototype.scrollIntoView = jest.fn();
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ jokes: [VANNE], pagination: { page: 1, limit: 12, total: 10, totalPages: 1 }, limited: true, totalReal: 96 }),
      }) as jest.Mock;
    });
    const VANNE = { id: "1", content: "Setup vanne 1", punchline: "Chute 1", category: "ABSURDE", type: "ONESHOT", maturityLevel: 1, comedyTechnique: null, techniqueExplanation: null, howToApply: null };
    const liste = () => render(<VannesList />);

    it("ouvert : plus de carte floutée, l'offre seule, contenu centré", async () => {
      ouvrir(true);
      const { container } = liste();
      await waitFor(() => expect(container.querySelector("[data-mur-liste]")).not.toBeNull());
      expect(screen.queryByRole("button", { name: CARTE_VERROUILLEE_LABEL })).toBeNull();
      const centre = container.querySelector("[data-mur-centre]") as HTMLElement;
      expect(centre.className.split(" ")).toEqual(expect.arrayContaining(["text-center", "[&_.text-left]:text-center"]));
      expect(centre.querySelector("[data-mur-liste]")).not.toBeNull();
    });

    it("fermé : carte floutée sous l'offre, comme avant, sans cadre centré", async () => {
      const { container } = liste();
      await waitFor(() => expect(screen.getByRole("button", { name: CARTE_VERROUILLEE_LABEL })).toBeInTheDocument());
      expect(container.querySelector("[data-mur-centre]")).toBeNull();
    });
  });
});

describe("point 13 : profil de l'abonné", () => {
  // Nouvel abonné : aucun parcours, compteurs à zéro (cas des captures `nouvel-profil-*`).
  const NOUVEL = { id: "u1", name: "Jean", email: "j@test.fr", plan: "PREMIUM", level: "NOVICE", xp: 0, streak: 0, lastActiveAt: null, stats: { jokesRead: 0, tipsCompleted: 0, videosWatched: 0, totalFavorites: 0, pathsCompleted: 0 } };
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ parcours: [] }) }) as unknown as typeof fetch;
    useSession.mockReturnValue({ data: { user: { id: "u1", plan: "PREMIUM" } }, status: "authenticated" });
    jest.mocked(useUserStore).mockReturnValue({ user: NOUVEL, isLoading: false, fetchUser: jest.fn(async () => undefined) } as unknown as ReturnType<typeof useUserStore>);
  });
  const titres = (c: HTMLElement) => [...c.querySelectorAll("h3, [data-cap]")].map((e) => (e.hasAttribute("data-cap") ? "cap" : e.textContent));

  it("ouvert : « Prochaine étape » en tête, avant « Ton cap » et les compteurs", async () => {
    ouvrir(true);
    const { container } = render(<ProfilDashboard />);
    await act(async () => undefined);
    const ordre = titres(container);
    expect(ordre[0]).toBe("Prochaine étape");
    expect(ordre.indexOf("Prochaine étape")).toBeLessThan(ordre.indexOf("cap"));
    expect(ordre.filter((t) => t === "Prochaine étape")).toHaveLength(1);
  });

  it("ouvert : « Ta question à l'équipe » dans le cadre à filet des autres cartes, sans titre nouveau", async () => {
    ouvrir(true);
    const { container } = render(<ProfilDashboard />);
    await act(async () => undefined);
    const ligne = screen.getByTestId("profil-ligne-mes-questions");
    const cadre = ligne.parentElement as HTMLElement;
    expect(cadre).toHaveAttribute("data-profil-questions-cadre");
    expect(cadre.className.split(" ")).toEqual(expect.arrayContaining(["relative", "overflow-hidden", "rounded-xl", "md:col-span-2"]));
    expect(cadre.firstElementChild).toHaveAttribute("data-filet");
    expect(ligne.className).toContain("rounded-xl");
    expect(ligne.className).not.toContain("rounded-lg");
    expect(within(cadre).queryByRole("heading")).toBeNull();
    // Même cadre que les cartes voisines (`Card filet`).
    const voisine = [...container.querySelectorAll("h3")].find((h) => h.textContent === "Statistiques")?.closest(".rounded-xl");
    expect(voisine?.firstElementChild).toHaveAttribute("data-filet");
  });

  it("fermé : ordre d'avant (« Prochaine étape » après les cartes Premium), pas de cadre ajouté", async () => {
    const { container } = render(<ProfilDashboard />);
    await act(async () => undefined);
    const ordre = titres(container);
    expect(ordre[0]).toBe("Progression");
    expect(ordre.indexOf("Prochaine étape")).toBeGreaterThan(ordre.indexOf("Mes parcours"));
    expect(container.querySelector("[data-profil-questions-cadre]")).toBeNull();
  });
});

describe("point 14 : /parcours, phrases fausses pour un compte connecté", () => {
  const catalogue = getParcoursCatalogue();
  const frontiere = LISTE_PARCOURS_CTA.frontiere("repartie");
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ paths: [] }) }) as unknown as typeof fetch;
  });

  it("ligne frontière : « Sans compte. » retiré pour un connecté, le reste mot pour mot, rien à la place", () => {
    expect(frontiere.startsWith("Sans compte. ")).toBe(true);
    expect(frontiereListe("repartie", false)).toBe(frontiere);
    expect(frontiereListe("repartie", true)).toBe(frontiere.slice("Sans compte. ".length));
  });

  const connecte = () => useSession.mockReturnValue({ data: { user: { id: "u2", plan: "FREE" } }, status: "authenticated" });

  it("liste, ouvert, inscrit gratuit : aucune « Sans compte. »", async () => {
    ouvrir(true);
    connecte();
    const { container } = render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    expect(container.textContent).not.toContain("Sans compte.");
    expect(screen.getAllByText(frontiere.slice("Sans compte. ".length)).length).toBeGreaterThan(0);
  });

  it("liste, ouvert, visiteur : la ligne entière, inchangée", async () => {
    ouvrir(true);
    render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    expect(screen.getAllByText(frontiere).length).toBeGreaterThan(0);
  });

  it("liste, fermé, inscrit gratuit : la ligne entière, comme avant", async () => {
    connecte();
    render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    expect(screen.getAllByText(frontiere).length).toBeGreaterThan(0);
  });

  it("fin d'étape 1 sans `finEtape1Href` (connecté, ouvert) : même destination, plus de « D'abord ton compte »", () => {
    const { container } = render(<ValidationWall slug="repartie" href="/abonnement?x=1" />);
    expect(container.textContent).not.toContain(frTypo(FENETRE_COMPTE));
    expect(container.querySelector("[data-fin-etape-1-cta]")).toHaveAttribute("href", "/abonnement?x=1");
  });

  it("fin d'étape 1 du visiteur : la ligne reste", () => {
    const { container } = render(<ValidationWall slug="repartie" href="/abonnement?x=1" finEtape1Href="/register?x=1" />);
    expect(container.textContent).toContain(frTypo(FENETRE_COMPTE));
  });
});
