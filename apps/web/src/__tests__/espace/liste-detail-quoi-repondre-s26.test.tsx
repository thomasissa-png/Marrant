/**
 * s26 liste et détail, pilote Quoi répondre (`docs/ux/liste-detail-quoi-repondre-s26.md`,
 * `docs/design/liste-detail-quoi-repondre-s26.md`, arbitrage de l'orchestrateur du 19/11) : adresses, colonne de liste
 * (une ligne active, filet BLANC, filtres reportés), fiche du panneau (H1 à l'échelle, « Situation suivante » en contour
 * puis plein après « Fait »), coin « Humour noir » jamais listé ni servi. Rendu ouvert SIMULÉ ; fermé : 404 en premier
 * (contrôlé sur le source ici, et par `inertie-espace.test.tsx` et le middleware).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { act, fireEvent, render } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: async () => ({ userId: "u1" }), lireAccesEspace: async () => ({ acces: "ouvert", userId: "u1" }) }));
const faits = { ids: new Set<string>() };
jest.mock("@/lib/prisma", () => ({
  prisma: {
    ficheFait: {
      findMany: async ({ where }: { where: { ficheId: { in: string[] } } }) => where.ficheId.in.filter((id) => faits.ids.has(id)).map((ficheId) => ({ ficheId })),
      findUnique: async ({ where }: { where: { userId_ficheId: { ficheId: string } } }) => (faits.ids.has(where.userId_ficheId.ficheId) ? { retour: "essaye-bof" } : null),
    },
    userReplique: { findUnique: async () => null },
  },
}));
jest.mock("@/lib/espace/lettres", () => ({ ...jest.requireActual("@/lib/espace/lettres"), envoyeesSiBesoin: async () => new Map(), lettresEnvoyees: async () => new Map() }));
const nav = { query: new URLSearchParams(), segment: null as string | null, refresh: jest.fn(), replace: jest.fn() };
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: () => ({ refresh: nav.refresh, push: jest.fn(), replace: nav.replace, back: jest.fn() }),
  usePathname: () => "/mon-espace/quoi-repondre",
  useSearchParams: () => nav.query,
  useSelectedLayoutSegment: () => nav.segment,
}));
const appel = jest.fn();
jest.mock("@/components/espace/carte/appel", () => ({ appelEspace: (...a: unknown[]) => appel(...a) }));

import { chargeursFiches } from "@/lib/espace/fiches";
import { hrefFiche } from "@/lib/espace/premier-pas";
import { parentEspace, rubriqueAllumee } from "@/components/espace/rubriques";
import { estFicheQuoiRepondre } from "@/components/espace/apercu/acces";
import { lignesQuoiRepondre } from "@/lib/espace/quoi-repondre";
import { ficheParDefaut, filtrerLignes, prochaineNonFaite, queryFiltres, suivanteDe } from "@/lib/espace/quoi-repondre-liste";
import { ColonneListe } from "@/components/espace/quoi-repondre/colonne-liste";
import { FournisseurFaits } from "@/components/espace/quoi-repondre/faits-contexte";
import FicheQuoiRepondrePage from "@/app/(dashboard)/mon-espace/quoi-repondre/[id]/page";
import { POUR_QUOI_FAIRE, UNIVERS } from "@/lib/espace/fiches-schema";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";

const SRC = join(__dirname, "../..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const aplats = (racine: ParentNode) => [...racine.querySelectorAll("[class]")].filter((e) => classes(e).includes("bg-accent-secondary-hover"));
const acces = { acces: "ouvert" as const, userId: "u1" };
const situations = () => chargeursFiches.listerFiches("situation", acces);
const toutes = () => [...situations(), ...chargeursFiches.listerFiches("a-plat", acces)];
const LIEUX = [...UNIVERS.map((u) => ({ cle: u, titre: TEXTES_QUOI_REPONDRE.univers[u] })), { cle: "sans-lieu", titre: "Rattraper un faux pas" }];
const VALIDES = { ou: UNIVERS, pour: POUR_QUOI_FAIRE };

beforeEach(() => {
  faits.ids = new Set();
  nav.query = new URLSearchParams();
  nav.segment = null;
  nav.refresh.mockReset();
  nav.replace.mockReset();
  appel.mockReset();
});

describe("adresses (s26 liste et détail)", () => {
  it("`hrefFiche` : situation et « à plat » sous la rubrique, les autres types inchangés", () => {
    expect(hrefFiche("situation", "x")).toBe("/mon-espace/quoi-repondre/x");
    expect(hrefFiche("a-plat", "y")).toBe("/mon-espace/quoi-repondre/y");
    expect(hrefFiche("construction", "z")).toBe("/mon-espace/fiche/construction/z");
    expect(hrefFiche("humour-noir", "h")).toBe("/mon-espace/fiche/humour-noir/h");
  });

  it("`parentEspace` et `rubriqueAllumee` : une fiche de Quoi répondre ramène à sa liste et allume la rubrique", () => {
    expect(parentEspace("/mon-espace/quoi-repondre/x")).toEqual({ href: "/mon-espace/quoi-repondre", label: TEXTES_QUOI_REPONDRE.titre });
    expect(parentEspace("/mon-espace/quoi-repondre")).toBeNull();
    expect(rubriqueAllumee("/mon-espace/quoi-repondre/x")).toBe("quoiRepondre");
  });

  it("`estFicheQuoiRepondre` : l'adresse d'une fiche, pas la liste", () => {
    expect(estFicheQuoiRepondre("/mon-espace/quoi-repondre/x?ou=coloc")).toBe(true);
    expect(estFicheQuoiRepondre("/mon-espace/quoi-repondre")).toBe(false);
    expect(estFicheQuoiRepondre("/mon-espace/quoi-repondre/x/y")).toBe(false);
  });

  it("interrupteur fermé : `notFound()` en PREMIER dans le layout et la page de fiche (aucune lecture avant)", () => {
    for (const f of ["app/(dashboard)/mon-espace/quoi-repondre/layout.tsx", "app/(dashboard)/mon-espace/quoi-repondre/[id]/page.tsx"]) {
      const corps = /export default async function \w+\([^)]*\)[^{]*\{\n\s*([^\n]+)/.exec(lire(f))?.[1];
      expect([f, corps]).toEqual([f, "if (!ESPACE_CLIENT_PUBLIE) notFound();"]);
    }
  });
});

describe("liste légère et ordre", () => {
  it("coin « Humour noir » : jamais dans la liste de Quoi répondre (cookie d'entrée ou non)", () => {
    const coin = chargeursFiches.listerFiches("humour-noir", acces);
    expect(coin.length).toBeGreaterThan(0);
    const ids = new Set(lignesQuoiRepondre([...toutes(), ...coin], new Set()).map((l) => l.id));
    for (const f of coin) expect(ids.has(f.id)).toBe(false);
    expect(ids.size).toBe(toutes().length);
  });

  it("ordre par lieu, filtre, fiche d'office, suivante, query", () => {
    const lignes = lignesQuoiRepondre(toutes(), new Set());
    const rangs = lignes.map((l) => (l.lieu === "sans-lieu" ? UNIVERS.length : UNIVERS.indexOf(l.lieu as (typeof UNIVERS)[number])));
    expect(rangs).toEqual([...rangs].sort((a, b) => a - b));
    const coloc = filtrerLignes(lignes, { ou: "coloc", pour: null });
    expect(coloc.every((l) => l.univers === "coloc")).toBe(true);
    expect(ficheParDefaut(coloc, new Set([coloc[0].id]))?.id).toBe(coloc[1].id);
    expect(ficheParDefaut(coloc, new Set(coloc.map((l) => l.id)))?.id).toBe(coloc[0].id);
    expect(suivanteDe(lignes, coloc[0].id)?.id).toBe(lignes[lignes.indexOf(coloc[0]) + 1].id);
    expect(suivanteDe(lignes, lignes[lignes.length - 1].id)).toBeNull();
    // s26 liste et détail, tour 4 : « Situation suivante » = prochaine non faite. Fiche faite : la première non faite du
    // filtre (celle de l'arrivée), même placée avant ; fiche non faite (passée) : la non faite d'après, en reprenant au
    // début ; tout fait : la règle d'avant.
    const [a, b, c, d] = coloc;
    expect(prochaineNonFaite(coloc, c.id, new Set([a.id, c.id]))?.id).toBe(b.id);
    expect(prochaineNonFaite(coloc, c.id, new Set([a.id, c.id]))?.id).toBe(ficheParDefaut(coloc, new Set([a.id, c.id]))?.id);
    expect(prochaineNonFaite(coloc, b.id, new Set([a.id, c.id]))?.id).toBe(d.id);
    expect(prochaineNonFaite(coloc, d.id, new Set([a.id, c.id]))?.id).toBe(b.id);
    expect(prochaineNonFaite(coloc, a.id, new Set(coloc.map((l) => l.id)))?.id).toBe(b.id);
    expect(prochaineNonFaite(coloc, coloc[coloc.length - 1].id, new Set(coloc.map((l) => l.id)))).toBeNull();
    expect(queryFiltres({ ou: "coloc", pour: "desamorcer" })).toBe("?ou=coloc&pour=desamorcer");
    expect(queryFiltres({ ou: null, pour: null })).toBe("");
  });
});

describe("colonne de liste (dès 1024)", () => {
  const rendre = () => render(<ColonneListe lignes={lignesQuoiRepondre(toutes(), faits.ids)} lieux={LIEUX} valides={VALIDES} />);

  it("une seule ligne active (`aria-current`), filet BLANC de 2 px (arbitrage du 19/11), jamais violet ; 0 aplat", () => {
    const lignes = lignesQuoiRepondre(toutes(), new Set());
    nav.segment = lignes[2].id;
    const { container } = rendre();
    const actives = container.querySelectorAll("a[aria-current='page']");
    expect(actives).toHaveLength(1);
    expect(actives[0]).toHaveAttribute("data-ligne-qr", lignes[2].id);
    expect(classes(actives[0])).toEqual(expect.arrayContaining(["before:w-0.5", "before:bg-text-primary", "bg-background-elevated"]));
    expect(actives[0].className).not.toMatch(/before:bg-accent/);
    expect(aplats(container)).toEqual([]);
  });

  it("sans id : la ligne active est la fiche ouverte d'office (première sans « Fait » du filtre)", () => {
    const lignes = lignesQuoiRepondre(toutes(), new Set());
    faits.ids = new Set([lignes[0].id]);
    const { container } = rendre();
    expect(container.querySelector("a[aria-current='page']")).toHaveAttribute("data-ligne-qr", lignes[1].id);
    expect(container.querySelector(`[data-ligne-qr='${lignes[0].id}'] [data-fait]`)).not.toBeNull();
  });

  it("filtres de la query reportés sur chaque lien de fiche ; un filtre garde la fiche ouverte si elle y est", () => {
    nav.query = new URLSearchParams("ou=coloc");
    const coloc = filtrerLignes(lignesQuoiRepondre(toutes(), new Set()), { ou: "coloc", pour: null });
    nav.segment = coloc[0].id;
    const { container } = rendre();
    const liens = [...container.querySelectorAll("a[data-ligne-qr]")];
    expect(liens).toHaveLength(coloc.length);
    for (const a of liens) expect(a.getAttribute("href")).toBe(`/mon-espace/quoi-repondre/${a.getAttribute("data-ligne-qr")}?ou=coloc`);
    // Retirer le filtre choisi : la fiche ouverte reste (elle est dans « tout ») ; un autre lieu : retour à la liste.
    expect(container.querySelector("a[data-filtre='coloc']")).toHaveAttribute("href", `/mon-espace/quoi-repondre/${coloc[0].id}`);
    expect(container.querySelector("a[data-filtre='famille']")).toHaveAttribute("href", "/mon-espace/quoi-repondre?ou=famille");
  });

  it("clavier : flèche bas puis haut d'une ligne à l'autre", () => {
    const { container } = rendre();
    const liens = [...container.querySelectorAll<HTMLAnchorElement>("a[data-ligne-qr]")];
    liens[0].focus();
    fireEvent.keyDown(liens[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(liens[1]);
    fireEvent.keyDown(liens[1], { key: "ArrowUp" });
    expect(document.activeElement).toBe(liens[0]);
  });
});

describe("fiche dans le panneau (`/mon-espace/quoi-repondre/[id]`)", () => {
  it("H1 à l'échelle (`TITRE_PAGE`), « Situation suivante » en contour vers la suivante du filtre, « Retour » vers la liste filtrée", async () => {
    const coloc = filtrerLignes(lignesQuoiRepondre(toutes(), new Set()), { ou: "coloc", pour: null });
    const { container } = render(await FicheQuoiRepondrePage({ params: { id: coloc[0].id }, searchParams: { ou: "coloc" } }));
    const h1 = container.querySelector("h1#fiche-titre")!;
    expect(classes(h1)).toEqual(expect.arrayContaining(["text-2xl", "lg:text-3xl", "font-semibold"]));
    expect(classes(h1)).not.toContain("font-bold");
    const suivante = container.querySelector("[data-situation-suivante]")!;
    expect(suivante).toHaveAttribute("href", `/mon-espace/quoi-repondre/${coloc[1].id}?ou=coloc`);
    expect(suivante.textContent).toBe("Situation suivante");
    expect(suivante.hasAttribute("data-plein")).toBe(false);
    expect(container.querySelector("[data-lien-retour]")).toHaveAttribute("href", "/mon-espace/quoi-repondre?ou=coloc");
  });

  it("« Fait » : optimiste, la suivante passe en plein et le geste perd son aplat (un seul), puis `router.refresh()`", async () => {
    const lignes = lignesQuoiRepondre(toutes(), new Set());
    const avecGeste = situations().find((f) => f.geste)!;
    nav.segment = avecGeste.id;
    appel.mockResolvedValue({ ok: true });
    const { container, getAllByRole } = render(
      <FournisseurFaits versionServeur="">{await FicheQuoiRepondrePage({ params: { id: avecGeste.id }, searchParams: {} })}</FournisseurFaits>,
    );
    expect(lignes.some((l) => l.id === avecGeste.id)).toBe(true);
    const bof = getAllByRole("button").find((b) => b.hasAttribute("aria-pressed") && b.textContent?.includes("bof"))!;
    await act(async () => {
      fireEvent.click(bof);
    });
    expect(container.querySelector("[data-situation-suivante]")!.hasAttribute("data-plein")).toBe(true);
    expect(aplats(container)).toEqual([container.querySelector("[data-situation-suivante]")]);
    expect(nav.refresh).toHaveBeenCalled();
  });

  // s26 liste et détail, tour 1 (mesures §3 et §4) : un seul aplat avant « Fait », celui de l'action principale du geste ;
  // « Enregistrer » en contour (même désactivé) ; panneau ramené à l'échelle de `typo.ts` (plus de 12 px ni de capitales,
  // zone d'état vide hors du flux) ; blocs du corps à 24 px.
  // s26 liste et détail, tour 4 (relectures à l'aveugle : « Essayé, ça a marché » plein avant tout clic, lu comme déjà
  // choisi) : avant « Fait », AUCUN aplat ; les trois retours en contour, à égalité, aucun pressé.
  it("tour 4 : avant « Fait », aucun aplat, les trois retours en contour à égalité ; « Enregistrer » en contour ; échelle du panneau", async () => {
    const avecGeste = situations().find((f) => f.geste)!;
    nav.segment = avecGeste.id;
    const { container, getByRole } = render(
      <FournisseurFaits versionServeur="">{await FicheQuoiRepondrePage({ params: { id: avecGeste.id }, searchParams: {} })}</FournisseurFaits>,
    );
    expect(aplats(container)).toEqual([]);
    const retours = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-testid='geste-fiche'] [role='group'] button[aria-pressed]"));
    expect(retours).toHaveLength(3);
    expect(retours.every((b) => b.getAttribute("aria-pressed") === "false")).toBe(true);
    // Même classe pour les trois : aucun ne se distingue avant le clic.
    expect(new Set(retours.map((b) => b.className)).size).toBe(1);
    expect(classes(retours[0])).toContain("border");
    const enregistrer = getByRole("button", { name: "Enregistrer" });
    expect(enregistrer).toBeDisabled();
    expect(classes(enregistrer)).toEqual(expect.arrayContaining(["border", "disabled:text-text-muted"]));
    const panneau = container.querySelector("[data-fiche-panneau]")!;
    expect(classes(panneau)).toEqual(expect.arrayContaining(["[&_.text-xs]:text-sm", "[&_.uppercase]:normal-case", "[&_[role=status]:empty]:absolute"]));
    expect(classes(panneau.querySelector("h1#fiche-titre")!.parentElement!.querySelector(".border-t"))).toContain("space-y-6");
  });

  it("tour 1 : le repli des filtres se referme après un choix (remonté par la clé du filtre)", () => {
    const { container, rerender } = render(<ColonneListe lignes={lignesQuoiRepondre(toutes(), new Set())} lieux={LIEUX} valides={VALIDES} />);
    const avant = container.querySelector<HTMLDetailsElement>("details[data-filtres-liste]")!;
    avant.open = true;
    nav.query = new URLSearchParams("ou=coloc");
    rerender(<ColonneListe lignes={lignesQuoiRepondre(toutes(), new Set())} lieux={LIEUX} valides={VALIDES} />);
    const apres = container.querySelector<HTMLDetailsElement>("details[data-filtres-liste]")!;
    expect(apres).not.toBe(avant);
    expect(apres.open).toBe(false);
    // Le repli défile avec les lignes (dans le corps) : il ne réduit plus la liste.
    expect(container.querySelector("[data-liste-corps] > details[data-filtres-liste]")).not.toBeNull();
  });

  it("fiche du coin « Humour noir » ou id inconnu : la vraie 404, jamais servie ici", async () => {
    const coin = chargeursFiches.listerFiches("humour-noir", acces)[0];
    await expect(FicheQuoiRepondrePage({ params: { id: coin.id }, searchParams: {} })).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(FicheQuoiRepondrePage({ params: { id: "inconnue-s26" }, searchParams: {} })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
