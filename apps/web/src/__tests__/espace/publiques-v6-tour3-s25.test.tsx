/**
 * v6 tour 3, lot 2 (pages publiques vues en régime ouvert), plan `plan-corrections-v6-tour-3.md` points 1 (partie
 * publique), 5, 8, 9, 10, 11 et 12. Chaque correction n'existe qu'interrupteur ouvert ; fermé, le rendu d'avant
 * (vérifié ici composant par composant, et au caractère près par `inertie-espace.test.tsx`).
 */
import { TextEncoder } from "util";
import { act, render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";

const etat = globalThis as { __V6T3_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __V6T3_OUVERT__?: boolean }).__V6T3_OUVERT__ === true;
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
// /lettre : le dernier numéro est le n° 1 RÉEL (`data/lettre/numeros.json`), version gratuite comme en base.
jest.mock("@/lib/lettre/apercu", () => {
  const { versionGratuite } = jest.requireActual("@/lib/lettre/invitation-premium");
  const numeros = jest.requireActual("@/data/lettre/numeros.json") as { corps: string }[];
  return { lireApercuLettre: async () => ({ dernier: { subject: "Alors, t'as perdu ta langue ?", bodyText: versionGratuite(numeros[0].corps) } }) };
});
jest.mock("@/config/lettre", () => ({ ...jest.requireActual("@/config/lettre"), LETTRE_INSCRIPTIONS_OUVERTES: true }));
jest.mock("@/components/lettre/lettre-page-inscription", () => ({ LettrePageInscription: () => null }));
jest.mock("@/lib/espace/garde", () => ({ lireAccesEspace: async () => ({ acces: "ferme" }) }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/lettres", () => ({
  listerLettres: async () => [
    { numero: 2, titre: "Lettre du 12 novembre", objet: "Objet 2" },
    { numero: 1, titre: "Lettre du 5 novembre", objet: "Objet 1" },
  ],
}));
jest.mock("@/lib/espace/compteurs", () => ({ compterAnonyme: async () => undefined }));
// /profil : compte et abonnement simulés (même patron que `publiques-v6-tour2-s25.test.tsx`).
jest.mock("@/stores/user-store", () => ({ useUserStore: jest.fn() }));
jest.mock("@/hooks/use-subscription-summary", () => ({
  useSubscriptionSummary: () => ({ summary: { status: "ACTIVE", hasPortal: true, hasStripeSubscription: true, cancelAtPeriodEnd: false, formule: "monthly", priceCents: 199, currentPeriodEnd: "2026-12-09T09:00:00.000Z" }, openPortal: jest.fn(), portalLoading: null }),
}));
jest.mock("@/app/(dashboard)/profil/rappel-parcours-toggle", () => ({ RappelParcoursToggle: () => <section id="rappel-parcours">rappel</section> }));
jest.mock("@/components/lettre/lettre-hebdo-reglage", () => ({ LettreHebdoReglage: () => null }));
jest.mock("@/components/espace/cap-profil", () => ({ CapProfil: () => <div data-cap="">cap</div> }));

Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");

import numeros from "@/data/lettre/numeros.json";
import { versionGratuite } from "@/lib/lettre/invitation-premium";
import { frPonctuation } from "@/lib/fr-typo";
import { LettreCorpsApercu, decouperCorps, estIntertitre } from "@/components/lettre/lettre-corps-apercu";
import LettrePage from "@/app/(dashboard)/lettre/page";
import { LettresAbonneCartes } from "@/components/lettre/lettres-abonne-cartes";
import { CarnetPage } from "@/components/carnet/carnet-page";
import { carnetViewForPlan, parseCarnets } from "@/lib/carnet";
import { RangeeDefilante } from "@/components/vannes/rangee-defilante";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import { ProfilDashboard } from "@/components/profil/profil-dashboard";
import { useUserStore } from "@/stores/user-store";
import { readFileSync } from "fs";
import { join } from "path";

const ouvrir = (ouvert: boolean) => {
  etat.__V6T3_OUVERT__ = ouvert;
};
afterAll(() => {
  delete etat.__V6T3_OUVERT__;
});
beforeEach(() => {
  ouvrir(false);
  useSession.mockReturnValue({ data: null, status: "unauthenticated" });
});

const serveur = async (el: Promise<ReactElement>) => renderToStaticMarkup(await el);
const CORPS_N1 = versionGratuite((numeros as { corps: string }[])[0].corps) as string;
const INTERTITRES_N1 = ["La sûre", "La joueuse", "La risquée", "Comment choisir", "L'erreur que tout le monde fait", "À essayer cette semaine"];

describe("point 10 : /lettre, intertitres du dernier numéro (texte réel du n° 1)", () => {
  it("règle : les six repères du numéro, et eux seuls", () => {
    expect(decouperCorps(CORPS_N1).flatMap((b) => (b.intertitre ? [b.intertitre] : []))).toEqual(INTERTITRES_N1);
  });

  it("jamais « Salut, », « À bientôt, », une ligne qui finit par « : » ni une ligne avec une adresse", () => {
    expect(estIntertitre("Salut,", 1)).toBe(false);
    expect(estIntertitre("Salut,", 3)).toBe(false);
    expect(estIntertitre("À bientôt,", 2)).toBe(false);
    expect(estIntertitre("Bonnes fêtes, et à bientôt,", 2)).toBe(false);
    expect(estIntertitre("Il a fini par le remarquer :", 2)).toBe(false);
    expect(estIntertitre("Lire l'article : https://deviens-marrant.fr/blog/rester-muet-en-groupe", 2)).toBe(false);
    expect(estIntertitre("deviens-marrant.fr/parcours", 2)).toBe(false);
    // Une ligne seule n'est jamais un intertitre, même sans ponctuation finale.
    expect(estIntertitre("La sûre", 1)).toBe(false);
    expect(estIntertitre("L'Équipe Deviens Marrant", 1)).toBe(false);
    const blocs = decouperCorps(CORPS_N1);
    expect(blocs[0]).toEqual({ intertitre: null, lignes: ["Salut,"] });
    expect(blocs[blocs.length - 1]).toEqual({ intertitre: null, lignes: ["À bientôt,", "L'Équipe Deviens Marrant"] });
  });

  it("texte inchangé : chaque ligne non vide, dans l'ordre, ni ajoutée ni retirée", () => {
    const lignes = CORPS_N1.split("\n").filter((l) => l.trim().length > 0).map((l) => l.trim());
    const rendues = decouperCorps(CORPS_N1).flatMap((b) => [...(b.intertitre ? [b.intertitre] : []), ...b.lignes.map((l) => l.trim())]);
    expect(rendues).toEqual(lignes);
  });

  it("composant : intertitres en `font-semibold text-text-primary`, paragraphes espacés, mesure `max-w-prose`", () => {
    const { container } = render(<LettreCorpsApercu texte={CORPS_N1} />);
    const corps = container.querySelector("[data-lettre-corps]") as HTMLElement;
    expect(corps.className.split(" ")).toEqual(expect.arrayContaining(["max-w-prose", "space-y-4", "min-w-0", "[overflow-wrap:anywhere]"]));
    expect(corps.className).not.toContain("whitespace-pre-line");
    const titres = [...corps.querySelectorAll("[data-lettre-intertitre]")];
    expect(titres.map((t) => t.textContent)).toEqual(INTERTITRES_N1.map((t) => frPonctuation(t)));
    for (const t of titres) expect(t.className.split(" ")).toEqual(expect.arrayContaining(["font-semibold", "text-text-primary"]));
    expect(within(corps).getAllByRole("link").map((l) => l.getAttribute("href"))).toEqual([
      "/blog/rester-muet-en-groupe",
      "/parcours/repartie#etape-3",
      "/abonnement",
    ]);
  });

  // s26 (`docs/design/questions-repliques-lettre-profil-s26.md` §6.1) : la carte du dernier numéro devient neutre (plus de
  // filet violet), colonne de droite (5) à côté de l'inscription (7).
  it("page, ouvert : objet et corps dans une carte neutre à droite ; fermé : rendu d'avant", async () => {
    ouvrir(true);
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: await serveur(LettrePage({ searchParams: {} })) }} />);
    const carte = container.querySelector("[data-lettre-apercu]") as HTMLElement;
    expect(carte.querySelector("[data-filet]")).toBeNull();
    expect(carte.className.split(" ")).toEqual(expect.arrayContaining(["rounded-xl", "lg:col-span-5"]));
    // Le dernier numéro est long : c'est la colonne d'inscription qui colle sous l'en-tête (`lg:top-36`).
    expect(container.querySelector("[data-lettre-inscription-colonne]")?.className).toContain("lg:top-36");
    expect(carte.querySelector("[data-lettre-corps]")).not.toBeNull();
    ouvrir(false);
    const ferme = await serveur(LettrePage({ searchParams: {} }));
    expect(ferme).not.toContain("data-lettre-apercu");
    expect(ferme).toContain('<p class="mt-2 font-semibold text-text-primary">');
    // Décision de Thomas du 16/11 : fermé aussi, le corps se coupe partout (plus de débordement à 375 px).
    expect(ferme).toContain('<div class="mt-2 min-w-0 whitespace-pre-line text-text-secondary [overflow-wrap:anywhere]">');
  });
});

describe("point 11 : /lettre de l'abonné", () => {
  // s26 (`docs/design/questions-repliques-lettre-profil-s26.md` §6.2) : carte entière cliquable (lien étiré), anneau au
  // focus sur la carte, survol neutre (plus de violet ni de chevron) ; plus de hauteur minimale.
  it("s26 : chaque carte entière est un lien, anneau au focus sur la carte, survol neutre ; plus de hauteur minimale", async () => {
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: await serveur(LettresAbonneCartes()) }} />);
    const racine = container.querySelector("[data-lettres-abonne]") as HTMLElement;
    expect(racine.className).not.toContain("min-h-");
    const liens = [...racine.querySelectorAll("a[data-lettre]")];
    expect(liens).toHaveLength(2);
    for (const lien of liens) {
      expect(lien.className).toContain("after:absolute");
      const carte = lien.closest("[data-lettre-derniere], li") as HTMLElement;
      expect(carte.className).toContain("focus-within:ring-2");
      expect(carte.className).not.toContain("hover:border-accent-primary");
    }
  });
});

describe("points 1 et 9 : /carnet", () => {
  const lire = (f: string): unknown => JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", f), "utf8"));
  const [precedent, courant] = parseCarnets([lire("2026-10.json"), lire("2026-11.json")]);
  const page = (plan: string | null) => (
    <CarnetPage view={carnetViewForPlan(courant, plan)} months={[courant.mois, precedent.mois]} returnTo="/carnet" src="carnet" />
  );
  const enTete = (c: HTMLElement) => c.querySelector("header") as HTMLElement;

  // s26 (`docs/design/favoris-carnet-s26.md` §3 et §4) : en-tête aligné à gauche (plus centré). s26, Thomas 19/11 : le
  // sur-titre « Carnet de novembre 2026, 30 situations » est retiré (il répétait le H1) : le H1 ouvre l'en-tête.
  it.each([["abonné", "PREMIUM"], ["visiteur", null]])("ouvert, %s (s26) : plus de sur-titre, le H1 ouvre l'en-tête, aligné à gauche", (_n, plan) => {
    ouvrir(true);
    const { container } = render(page(plan));
    const header = enTete(container);
    expect(header.className.split(" ")).not.toContain("text-center");
    expect(header.firstElementChild?.tagName).toBe("H1");
    expect(header.textContent).not.toMatch(/Carnet de novembre 2026, 30 situations|30 situations/);
  });

  // s26 : sommaire en TUILES (3, 2 puis 1 colonne), cible de 44 px ; la première fiche porte le filet blanc.
  it("ouvert, abonné (s26) : sommaire en tuiles 4/4/4, 30 tuiles de 44 px au moins, première marquée", () => {
    ouvrir(true);
    const { container } = render(page("PREMIUM"));
    const sommaire = container.querySelector("[data-carnet-sommaire]") as HTMLElement;
    expect((sommaire.querySelector("ol") as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["md:grid-cols-2", "lg:grid-cols-3"]));
    const tuiles = within(sommaire).getAllByRole("link");
    expect(tuiles).toHaveLength(30);
    for (const lien of tuiles) expect(lien.className.split(" ")).toContain("min-h-11");
    expect(tuiles[0].className.split(" ")).toEqual(expect.arrayContaining(["border-l-2", "border-l-text-primary"]));
    expect(tuiles[1].className).not.toContain("border-l-2");
    // Carnets précédents en fin de page, après la dernière fiche.
    const fiches = container.querySelectorAll('[id^="fiche-"]');
    const archives = container.querySelector('[aria-labelledby="carnet-archives"]') as HTMLElement;
    expect(fiches[fiches.length - 1].compareDocumentPosition(archives) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("fermé, abonné : en-tête d'avant (sur-titre au-dessus, non centré), pas de sommaire", () => {
    const { container } = render(page("PREMIUM"));
    const header = enTete(container);
    expect(header.className).toBe("mb-8 space-y-3");
    expect((header.firstElementChild as HTMLElement).tagName).toBe("P");
    expect(header.children[2].className).toBe("text-text-secondary");
    expect(container.querySelector("[data-carnet-sommaire]")).toBeNull();
  });
});

describe("point 8 : /vannes, première pastille sur le bord des cartes", () => {
  it("retrait d'accroche égal au retrait de départ de la rangée (débord gardé)", () => {
    render(
      <RangeeDefilante label="Catégories de vannes">
        <button type="button">Toutes</button>
      </RangeeDefilante>,
    );
    const rangee = screen.getByRole("tablist");
    expect(rangee.className.split(" ")).toEqual(
      expect.arrayContaining(["-mx-4", "px-4", "md:-mx-6", "md:px-6", "snap-x", "scroll-px-4", "md:scroll-px-6", "lg:scroll-px-0"]),
    );
  });
});

describe("point 12 : /parcours, cartes en deux colonnes dès `lg`", () => {
  const catalogue = getParcoursCatalogue();
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ paths: [] }) }) as unknown as typeof fetch;
  });
  const pleins = () =>
    screen.getAllByRole("button").filter((b) => b.className.includes("bg-accent-secondary-hover") && b.closest("[id^='parcours-']"));

  // s26 (`docs/design/parcours-vannes-s26.md` §0 et §1.1) : deux colonnes dès 768 px, dernière carte seule sur toute la
  // rangée ; un seul aplat violet par écran (l'offre de l'en-tête collant) : tous les boutons de carte en contour.
  it("ouvert : grille `md:grid-cols-2`, dernière carte seule en pleine largeur, bouton en fin de carte, aucun plein", async () => {
    ouvrir(true);
    const { container } = render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    const grille = container.querySelector("[data-parcours-cartes]") as HTMLElement;
    // s26 tour 3 (point 1) : `items-stretch`, cartes d'une rangée à la même hauteur, sans pied poussé en bas.
    // s26 parcours connecté : test changé (raison : hauteurs égales par sous-grille de 5 pistes, plus par `items-stretch` ;
    // écart vertical porté par le `mb-6` des cartes, `gap-y-0`, `docs/design/parcours-connecte-s26.md` §2.4).
    // s26 parcours connecté, tour 2 : test changé (raison : une carte par rangée, plus de sous-grille ; marge d'ancre de
    // 9 px, qui s'ajoute aux 128 px de `scroll-padding-top` de l'en-tête universel : 137 px, `MESURES.md` B1 et B3).
    expect(grille.className.split(" ")).toEqual(["grid", "gap-6", "lg:col-span-12"]);
    const carte = grille.querySelector("[id^='parcours-']") as HTMLElement;
    expect(carte.className.split(" ")).toEqual(expect.arrayContaining(["flex", "flex-col", "p-6", "scroll-mt-[9px]"]));
    expect(carte.className).not.toMatch(/\bmin-h-|\bmt-auto\b|\bjustify-between\b/);
    // s26 tour 3 (point 2) : plus aucun séparateur « · » en pseudo-élément dans la méta, items séparés par `gap-x-4`.
    expect(container.innerHTML).not.toContain("before:content");
    expect((grille.querySelector("[id^='parcours-'] div.flex-wrap") as HTMLElement).className.split(" ")).toContain("gap-x-4");
    expect(grille.children).toHaveLength(catalogue.length);
    expect(pleins()).toHaveLength(0);
    const boutons = screen.getAllByRole("button").filter((b) => b.closest("[data-parcours-pied]"));
    expect(boutons).toHaveLength(catalogue.length);
    for (const b of boutons) {
      expect(b.className).toContain("w-full");
      // v6 tour 4, point 2 : bloc commun « Programme » + bouton. s26 tour 2 (P1) : plus de `mt-auto` (cartes à leur
      // hauteur propre : le pied n'est plus poussé en bas, plus de vide au milieu de la carte).
      expect((b.closest("[data-parcours-pied]") as HTMLElement).className.split(" ")).not.toContain("mt-auto");
    }
  });

  it("fermé : la pile d'avant, sans attribut ajouté", async () => {
    const { container } = render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    expect(container.querySelector("[data-parcours-cartes]")).toBeNull();
    const pile = container.querySelector("#parcours-" + catalogue[0].slug)?.parentElement as HTMLElement;
    expect(pile.className).toBe("flex flex-col gap-6");
  });
});

describe("point 5 : /profil de l'abonné, cartes courtes deux par ligne dès `lg`", () => {
  const COMPTE = (xp: number) => ({ id: "u1", name: "Jean", email: "j@test.fr", plan: "PREMIUM", level: "NOVICE", xp, streak: 0, lastActiveAt: null, stats: { jokesRead: 0, tipsCompleted: 0, videosWatched: 0, totalFavorites: 0, pathsCompleted: 0 } });
  const EN_COURS = { slug: "repartie", title: "Répartie", icon: "x", totalSteps: 4, completedSteps: 1, completedAt: null };
  function compte(parcours: unknown[], xp: number) {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ parcours }) }) as unknown as typeof fetch;
    useSession.mockReturnValue({ data: { user: { id: "u1", plan: "PREMIUM" } }, status: "authenticated" });
    jest.mocked(useUserStore).mockReturnValue({ user: COMPTE(xp), isLoading: false, fetchUser: jest.fn(async () => undefined) } as unknown as ReturnType<typeof useUserStore>);
  }
  const groupes = (c: HTMLElement) => [...c.querySelectorAll("[data-profil-groupe]")] as HTMLElement[];
  const titres = (c: HTMLElement) => [...c.querySelectorAll("h3, [data-cap]")].map((e) => (e.hasAttribute("data-cap") ? "cap" : e.textContent));

  it.each([["nouvel", [] as unknown[], 0], ["en cours", [EN_COURS], 120]])(
    "ouvert, abonné %s : cap et statistiques groupés, puis rappel, abonnement et prénom (question juste sous le groupe, tour 4) ; cartes longues hors groupe",
    async (_n, parcours, xp) => {
      compte(parcours as unknown[], xp as number);
      ouvrir(true);
      const { container } = render(<ProfilDashboard />);
      await act(async () => undefined);
      const [a, b] = groupes(container);
      expect(groupes(container)).toHaveLength(2);
      for (const g of [a, b]) {
        expect(g.className.split(" ")).toEqual(expect.arrayContaining(["lg:grid-cols-2", "lg:items-stretch", "md:col-span-2", "[&>*:nth-child(n)]:col-span-1"]));
      }
      expect(a.querySelector("[data-cap]")).not.toBeNull();
      expect(within(a).getByText("Statistiques")).toBeInTheDocument();
      expect(b.querySelector("#rappel-parcours")).not.toBeNull();
      expect(b.querySelector("#abonnement")).not.toBeNull();
      // v6 tour 4, point 4 : la ligne « Ta question à l'équipe » sort du groupe (pleine largeur, juste sous lui).
      expect(b.querySelector("[data-profil-questions-cadre]")).toBeNull();
      expect(b.nextElementSibling).toHaveAttribute("data-profil-questions-cadre");
      expect(within(b).getByTestId("profil-prenom")).toBeInTheDocument();
      // « Mes parcours » et la suppression du compte restent hors des groupes (pleine largeur).
      const mesParcours = [...container.querySelectorAll("h3")].find((h) => h.textContent === "Mes parcours") as HTMLElement;
      expect(mesParcours.closest("[data-profil-groupe]")).toBeNull();
      const suppression = [...container.querySelectorAll("h3")].find((h) => /Supprimer/.test(h.textContent ?? "")) as HTMLElement;
      expect(suppression.closest("[data-profil-groupe]")).toBeNull();
      // Décision du tour 2 gardée : « Prochaine étape » en tête chez le nouvel abonné.
      if ((parcours as unknown[]).length === 0) expect(titres(container)[0]).toBe("Prochaine étape");
      else expect(titres(container)).not.toContain("Prochaine étape");
    },
  );

  it("fermé : aucun groupe, ordre et place d'avant (rappel juste sous « Mes parcours »)", async () => {
    compte([], 0);
    const { container } = render(<ProfilDashboard />);
    await act(async () => undefined);
    expect(groupes(container)).toHaveLength(0);
    const rappel = container.querySelector("#rappel-parcours") as HTMLElement;
    const mesParcours = [...container.querySelectorAll("h3")].find((h) => h.textContent === "Mes parcours")?.closest(".rounded-lg") as HTMLElement;
    expect(mesParcours.nextElementSibling).toBe(rappel);
    expect(titres(container)[0]).toBe("Progression");
  });
});
