/**
 * Refonte d'« Aujourd'hui » (s25, `docs/ux/aujourdhui-refonte-s25.md`, `docs/design/aujourdhui-refonte-s25.md`),
 * interrupteur SIMULÉ ouvert (jamais le code livré, qui reste fermé) :
 * - aperçu verrouillé (visiteur, inscrit gratuit) : hero avec pastille « Premium », promesse T1, pastilles reprises,
 *   bloc d'offre en haut ; extrait inerte et masqué, chaque bloc fermé porte sa pastille ; fin d'extrait T2 et second
 *   bouton au même lien ; légende validée ;
 * - tableau de bord abonné : Z1 à Z7 selon l'état (nouvel abonné, avancé), Z2 « Ton cap » dès le premier jour,
 *   l'étape lue aussi avant le premier pas, rangée 2 sans cellule vide ;
 * - textes neufs T1 à T4 dans UN fichier, marqués « À VALIDER PAR THOMAS (s25) » ; interdits des caps respectés.
 */
import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "fs";
import { join } from "path";

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
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
const lecteur = jest.fn(async (): Promise<"visiteur" | "gratuit" | null> => null);
jest.mock("@/components/espace/apercu/acces", () => ({
  ...jest.requireActual("@/components/espace/apercu/acces"),
  lireLecteurApercu: () => lecteur(),
}));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));
jest.mock("@/lib/espace/fiches", () => ({ chargeursFiches: { listerFiches: () => [] } }));
const etat = {
  fait: false,
  mois: { serie: 0, xp: 0, cap: 1 as 1 | 2 | 3 | 4 | 5 },
  etape: null as null | Record<string, unknown>,
  rafale: null as null | Record<string, unknown>,
  aise: null as null | string,
};
jest.mock("@/lib/espace/premier-pas-serveur", () => ({
  premierPasFait: jest.fn(async () => etat.fait),
  lireMois: jest.fn(async () => etat.mois),
  resoudreOrigine: jest.fn(async () => null),
}));
jest.mock("@/lib/espace/aise", () => ({ lireAise: jest.fn(async () => etat.aise) }));
jest.mock("@/lib/espace/vanne", () => ({ categoriesProposees: jest.fn(async () => []) }));
const lireEtape = jest.fn(async () => etat.etape);
jest.mock("@/lib/espace/etape-serveur", () => ({ lireEtapeAReprendre: () => lireEtape() }));
jest.mock("@/lib/espace/cartes-serveur", () => ({ lireRafale: jest.fn(async () => etat.rafale) }));
jest.mock("@/lib/espace/missions-serveur", () => ({ lireRetoursMission: jest.fn(async () => []) }));

import AujourdhuiPage from "@/app/(dashboard)/mon-espace/page";
import { TEXTES_APERCU, TEXTES_APERCU_VERROUILLE, dateDuJour } from "@/config/textes/espace-apercu";
import { TEXTES_AUJOURDHUI as A } from "@/config/textes/espace-aujourdhui";
import { TEXTES_CAPS, TEXTES_PARCOURS_ESPACE as P } from "@/config/textes/espace-caps";
import { TEXTES_MISSION as M } from "@/config/textes/espace-cartes";
import { SERIE } from "@/config/textes/parcours";
import { EN_TETE } from "@/config/textes/cta-articles-accueil";
import { OFFRE_NOM, REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { PHRASE_OBJET_CONNECTE } from "@/config/textes/abonnement-vente";
import { ApercuAujourdhui, PASTILLES_AUJOURDHUI } from "@/components/espace/apercu/tableau-verrouille";
import { CapDuJour } from "@/components/espace/aujourdhui/cap-du-jour";
import { SemainesTuile } from "@/components/espace/aujourdhui/semaines-tuile";
import { couperNombre } from "@/components/espace/aujourdhui/tableau";
import { frEspace, frTypo } from "@/lib/fr-typo";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const SRC = join(__dirname, "../..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const texte = () => document.body.textContent ?? "";
const ETAPE = { slug: "repartie", titreParcours: "Répartie", ordre: 3, total: 4, titreEtape: "Retourner les piques", enCours: true, href: "/parcours/repartie#etape-3" };
const ETAPE_1 = { ...ETAPE, ordre: 1, titreEtape: "Tes premières répliques", enCours: false, href: "/parcours/repartie#etape-1" };
const rafale = (fini: boolean) => ({ cartes: fini ? [] : [{ carteId: "a.c1", nouvelle: true }], catalogue: new Map([["a.c1", { titre: "La poêle" }]]), fini, cetteSemaine: 12 });

beforeEach(() => {
  // « Contenu du jour » (Z6) lit `/api/daily` côté navigateur : ici toujours en chargement (cartes vides).
  (globalThis as { fetch?: unknown }).fetch = jest.fn(() => new Promise(() => undefined));
  drapeau.__ESPACE_OUVERT__ = true;
  lecteur.mockResolvedValue(null);
  Object.assign(etat, { fait: false, mois: { serie: 0, xp: 0, cap: 1 }, etape: null, rafale: null, aise: null });
  lireEtape.mockClear();
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

describe("textes neufs (spec UX §6.2)", () => {
  it("T1, T2, T4 mot pour mot, T3 en français, dans UN fichier, chacun marqué À VALIDER PAR THOMAS (s25)", () => {
    expect(TEXTES_APERCU_VERROUILLE.promesseAujourdhui).toBe("Ton tableau de bord : chaque jour, ton action, ta progression et ta série.");
    expect(TEXTES_APERCU_VERROUILLE.suite).toBe("La suite est dans Premium");
    expect(TEXTES_APERCU_VERROUILLE.lecteurEcran).toBe("Rubrique Premium. Exemple ci-dessous, non cliquable.");
    expect(dateDuJour(new Date("2026-11-16T10:00:00Z"))).toBe("lundi 16 novembre");
    // Jour de Paris : 23 h 30 UTC le 16 = mardi 17 à Paris.
    expect(dateDuJour(new Date("2026-11-16T23:30:00Z"))).toBe("mardi 17 novembre");
    const fichier = lire("config/textes/espace-apercu.ts");
    expect(fichier.match(/\/\/ À VALIDER PAR THOMAS \(s25\)/g)).toHaveLength(4);
    expect(JSON.stringify(TEXTES_APERCU_VERROUILLE)).not.toMatch(/—/);
  });

  it("aucun tiret cadratin ni échappement unicode dans les fichiers de la refonte", () => {
    for (const f of [
      "app/(dashboard)/mon-espace/page.tsx",
      "components/espace/apercu/tableau-verrouille.tsx",
      "components/espace/apercu/apercu-verrouille.tsx",
      "components/espace/apercu/hero-apercu.tsx",
      "components/espace/apercu/offre-apercu.tsx",
      "components/espace/apercu/extrait-coupe.tsx",
      "components/espace/apercu/badge-premium.tsx",
      "components/espace/apercu/tuile-fermee.tsx",
      "components/espace/aujourdhui/tableau.tsx",
      "components/espace/aujourdhui/action-du-jour.tsx",
      "components/espace/aujourdhui/cap-du-jour.tsx",
      "components/espace/aujourdhui/semaines-tuile.tsx",
    ]) {
      const code = lire(f);
      expect([f, code.includes("—")]).toEqual([f, false]);
      expect([f, /\\u[0-9a-fA-F]{4}/.test(code)]).toEqual([f, false]);
    }
  });
});

describe("aperçu verrouillé d'« Aujourd'hui » (spec UX §2 et §3)", () => {
  it("visiteur : pastille Premium, H1, phrase lue, promesse, 6 pastilles reprises, offre en haut, « Connexion »", async () => {
    lecteur.mockResolvedValue("visiteur");
    render(await AujourdhuiPage({ searchParams: {} }));
    const hero = document.querySelector("[data-apercu-hero]") as HTMLElement;
    expect(within(hero).getByRole("heading", { level: 1 }).textContent).toBe(A.titre);
    expect(within(hero).getByText(TEXTES_APERCU_VERROUILLE.lecteurEcran).className).toContain("sr-only");
    expect(within(hero).getByText(TEXTES_APERCU_VERROUILLE.promesseAujourdhui)).toBeTruthy();
    expect(hero.querySelector("[data-badge-premium]")?.textContent).toBe(OFFRE_NOM);
    expect(Array.from(hero.querySelectorAll("[data-apercu-pastilles] li")).map((li) => li.textContent)).toEqual([...PASTILLES_AUJOURDHUI]);
    expect(frTypo(PASTILLES_AUJOURDHUI.join("|"))).toBe(
      frTypo([A.premierPas.eyebrow, TEXTES_CAPS.titre, SERIE.titre, A.etape.enCours, M.titre, A.jour.titre].join("|")),
    );
    const offre = hero.querySelector("[data-apercu-offre]") as HTMLElement;
    expect(offre.querySelector("[data-reassurance]")?.textContent).toBe(frTypo(REASSURANCE_UNIQUE));
    expect(offre.querySelector("[data-preuve]")?.textContent).toBe(frTypo("1 500+ inscrits bossent leur humour."));
    expect(offre.textContent).not.toContain(frTypo(PHRASE_OBJET_CONNECTE));
    expect(within(offre).getAllByRole("link").map((l) => l.textContent)).toEqual([EN_TETE.bouton, TEXTES_APERCU.connexion]);
  });

  it("deux boutons identiques (hero, fin d'extrait), même lien et même source ; une seule action", async () => {
    lecteur.mockResolvedValue("visiteur");
    render(await AujourdhuiPage({ searchParams: {} }));
    const offres = screen.getAllByRole("link", { name: TEXTES_APERCU.offre.nomAccessible });
    expect(offres.map((l) => l.getAttribute("data-position"))).toEqual(["haut", "fin"]);
    expect(new Set(offres.map((l) => l.getAttribute("href")))).toEqual(new Set(["/abonnement?returnTo=%2Fmon-espace&src=apercu-aujourdhui"]));
    expect(offres.every((l) => l.textContent === EN_TETE.bouton)).toBe(true);
    const fin = document.querySelector("[data-apercu-fin]") as HTMLElement;
    expect(within(fin).getByText(TEXTES_APERCU_VERROUILLE.suite)).toBeTruthy();
    expect(within(fin).queryByText(TEXTES_APERCU.connexion)).toBeNull();
    expect(screen.getByText(frEspace(TEXTES_APERCU.sousTitre))).toBeTruthy();
  });

  it("extrait : masqué, inerte, sans lien ni bouton, chaque bloc fermé porte « Premium »", async () => {
    render(<ApercuAujourdhui visiteur={false} />);
    const extrait = document.querySelector("[data-apercu-extrait] > [aria-hidden]") as HTMLElement;
    expect(extrait.getAttribute("aria-hidden")).toBe("true");
    expect(extrait.hasAttribute("inert")).toBe(true);
    expect(extrait.className).toContain("pointer-events-none");
    // v7 tour 2 (faute 4) : le fondu est porté par la suite (rangée 2), la rangée 1 (premier pas, « Ton cap ») est
    // entière, hors du fondu.
    const suite = extrait.querySelector("[data-apercu-suite]") as HTMLElement;
    expect(suite.className).toMatch(/mask-image/);
    expect(suite.querySelector("[data-cap-du-jour]")).toBeNull();
    expect(extrait.querySelector('[data-apercu-rangee="1"] [data-cap-du-jour]')).not.toBeNull();
    expect(extrait.querySelectorAll("a, button, [tabindex]:not([tabindex='-1'])")).toHaveLength(0);
    const tuiles = Array.from(extrait.querySelectorAll("[data-tuile-fermee]"));
    expect(tuiles).toHaveLength(5);
    for (const t of tuiles) expect(t.querySelector(":scope > [data-badge-premium]")?.textContent).toBe(OFFRE_NOM);
    // Contenu réel de l'état « nouvel abonné », sans chiffre inventé.
    expect(extrait.textContent).toContain(frEspace(A.premierPas.sceneParDefaut));
    expect(extrait.textContent).toContain(TEXTES_CAPS.serieZero);
    expect(extrait.textContent).toContain(frEspace(A.etape.conseillee));
    expect(extrait.textContent).toContain(M.titresMarches[1]);
    expect(extrait.textContent).not.toMatch(/\d+\s?XP|%/);
    // Inscrit gratuit : la phrase d'objet sous le bouton, pas de « Connexion ».
    const offre = document.querySelector("[data-apercu-offre]") as HTMLElement;
    expect(Array.from(offre.querySelectorAll("p")).some((p) => p.textContent === frTypo(PHRASE_OBJET_CONNECTE))).toBe(true);
    expect(screen.queryByText(TEXTES_APERCU.connexion)).toBeNull();
  });
});

describe("tableau de bord abonné (spec UX §4)", () => {
  it("nouvel abonné : Z1 premier pas, Z2 cap 1 sans chiffres, Z3 étape conseillée (lue avant le premier pas), 4 semaines", async () => {
    etat.etape = ETAPE_1;
    render(await AujourdhuiPage({ searchParams: {} }));
    expect(lireEtape).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(A.titre);
    expect(document.querySelector("[data-date-du-jour]")?.textContent).toBe(dateDuJour());
    const zones = Array.from(document.querySelectorAll("[data-aujourdhui-grille] > div")).map((d) => d.getAttribute("data-zone") ?? "action");
    expect(zones).toEqual(["action", "cap", "parcours", "semaines"]);
    expect(document.querySelector('[data-zone="parcours"]')?.className).toContain("lg:col-span-5");
    expect(document.querySelector('[data-zone="semaines"]')?.className).toContain("lg:col-span-7");
    expect(screen.getByRole("link", { name: A.premierPas.bouton })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Commencer l.étape 1/ }).getAttribute("href")).toBe(ETAPE_1.href);
    expect(texte()).toContain(TEXTES_CAPS.serieZero);
    expect(texte()).not.toMatch(/0 XP|0 jour/);
    expect(document.querySelector("[data-question-aise]")).toBeNull();
    expect(document.querySelector("[data-testid='mission-lien']")).toBeNull();
    expect(document.querySelector("[data-repere]")).toBeNull();
  });

  it("abonné avancé, rafale faite : Z1 étape en cours, Z2 avec XP et série, Z4 mission et Z5 « C'est tout » à 6 + 6", async () => {
    Object.assign(etat, { fait: true, aise: "POTES", etape: ETAPE, rafale: rafale(true), mois: { serie: 9, xp: 420, cap: 3 } });
    render(await AujourdhuiPage({ searchParams: {} }));
    const zones = Array.from(document.querySelectorAll("[data-aujourdhui-grille] > div")).map((d) => d.getAttribute("data-zone") ?? "action");
    expect(zones).toEqual(["action", "cap", "mission", "rafale"]);
    for (const z of ["mission", "rafale"]) expect(document.querySelector(`[data-zone="${z}"]`)?.className).toContain("lg:col-span-6");
    const action = document.querySelector("[data-carte-du-jour]") as HTMLElement;
    expect(within(action).getByRole("link", { name: A.etape.reprendre }).getAttribute("href")).toBe(ETAPE.href);
    expect(within(action).getByText(P.etapeSurTotal(3, 4))).toBeTruthy();
    const cap = document.querySelector("[data-cap-du-jour]") as HTMLElement;
    expect(cap.textContent).toContain("420");
    expect(cap.textContent).toContain(frEspace(TEXTES_CAPS.xpDepuisArrivee(420)).replace(/^420\s/, ""));
    expect(cap.textContent).toContain(SERIE.aide);
    expect(within(cap).getByText(frEspace(TEXTES_CAPS.capLu(3)))).toBeTruthy();
    expect(document.querySelector('[data-rafale="faite"]')?.textContent).toBe(frEspace(A.rafale.fini));
    expect(document.querySelector("[data-repere]")?.textContent).toBe(A.repere(12));
    // Un seul bouton plein (Z1), aucune question C9 une fois répondue.
    expect(document.querySelectorAll("a.bg-accent-secondary-hover")).toHaveLength(1);
    expect(document.querySelector("[data-question-aise]")).toBeNull();
  });

  it("abonné, rafale à faire : Z1 rafale, Z3 parcours et Z4 mission à 6 + 6, Z7 question C9 en bas", async () => {
    Object.assign(etat, { fait: true, etape: ETAPE, rafale: rafale(false), mois: { serie: 0, xp: 50, cap: 1 } });
    render(await AujourdhuiPage({ searchParams: {} }));
    const zones = Array.from(document.querySelectorAll("[data-aujourdhui-grille] > div")).map((d) => d.getAttribute("data-zone") ?? "action");
    expect(zones).toEqual(["action", "cap", "parcours", "mission"]);
    expect(screen.getByRole("link", { name: A.rafale.bouton }).className).toContain("bg-accent-secondary-hover");
    expect(screen.getByRole("link", { name: /Reprendre/ }).className).not.toContain("bg-accent-secondary-hover");
    expect(document.querySelector("[data-question-aise]")).not.toBeNull();
    // XP sans série : le chiffre d'XP, la série à démarrer (jamais « 0 jour »).
    expect(texte()).toContain(TEXTES_CAPS.serieZero);
    expect(texte()).not.toMatch(/0 jour/);
  });
});

describe("briques", () => {
  it("coupe du premier nombre (spec design §7) : espaces insécables compris, repli sans nombre", () => {
    expect(couperNombre(frEspace(TEXTES_CAPS.xpDepuisArrivee(1500)).replace("1500", "1 500"))).toEqual({ nombre: "1 500", reste: "XP gagnés depuis ton arrivée" });
    expect(couperNombre(SERIE.jours(9))).toEqual({ nombre: "9", reste: "jours de pratique d’affilée" });
    expect(couperNombre(TEXTES_CAPS.serieZero)).toBeNull();
  });

  it("Ton cap : jamais de pourcentage ni « XP restants » ; série zéro sans chiffres", () => {
    const { container, unmount } = render(<CapDuJour cap={2} xp={250} serie={1} />);
    expect(container.textContent).not.toMatch(/%|restant/i);
    expect(container.querySelectorAll("[data-segments-cap] > span")).toHaveLength(5);
    unmount();
    const zero = render(<CapDuJour cap={1} xp={0} serie={0} />).container;
    expect(zero.textContent).toContain(TEXTES_CAPS.serieZero);
    expect(zero.textContent).not.toMatch(/\bXP\b/);
  });

  it("4 premières semaines : libellés repris, semaine 4 sans « Écouter » tant que rien n'est publié", () => {
    const { container } = render(<SemainesTuile ecouterPublie={false} />);
    expect(container.querySelectorAll("ol > li")).toHaveLength(4);
    expect(container.textContent).toContain(frEspace(P.semaines.titre));
    expect(container.textContent).toContain(frEspace(P.semaines.semaine4SansEcouter.texte));
    expect(container.textContent).not.toContain("Écouter");
  });
});
