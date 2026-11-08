/**
 * s23 : un abonné Premium voit l'exercice d'un conseil (et d'une vanne depuis le 08/11), l'exercice et les points clés d'une
 * vidéo (chargés par `/api/fiches/exercice`) ; un non-abonné garde le bloc d'appel inchangé,
 * sans aucun appel ; champs vides : rien. Les pages ne passent jamais le texte en prop.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { render, screen, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { BlocExercice } from "@/components/premium/bloc-exercice";
import { BLOC_EXERCICE, BLOC_EXERCICE_ABONNE_TITRE, BLOC_EXERCICE_POINTS_CLES } from "@/config/textes/cta-pages";

jest.mock("next-auth/react", () => ({ useSession: jest.fn(() => ({ status: "unauthenticated", data: null })) }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));
const nextAuth = { useSession: useSession as unknown as jest.Mock };

const fetchMock = jest.fn();
const repondre = (corps: unknown, ok = true) => fetchMock.mockResolvedValue({ ok, json: () => Promise.resolve(corps) });

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

const premium = () => nextAuth.useSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "PREMIUM" } } });

describe("BlocExercice, fiches conseil et vidéo (s23)", () => {
  it("Premium, conseil : l'exercice s'affiche sous « À toi de jouer », aucun bouton", async () => {
    premium();
    repondre({ exercice: "Exercice du conseil", pointsCles: [] });
    const { container } = render(<BlocExercice type="conseil" returnTo="/conseils/a" parcours="repartie" ficheId="t1" />);
    expect(await screen.findByText("Exercice du conseil")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: BLOC_EXERCICE_ABONNE_TITRE })).toBeInTheDocument();
    expect(screen.queryByText(BLOC_EXERCICE_POINTS_CLES)).toBeNull();
    expect(container.querySelectorAll("a")).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledWith("/api/fiches/exercice?type=conseil&id=t1", expect.anything());
  });

  it("Premium, vidéo : les points clés puis l'exercice", async () => {
    premium();
    repondre({ exercice: "Exercice vidéo", pointsCles: ["Point A", "Point B"] });
    render(<BlocExercice type="video" returnTo="/videos/a" parcours="repartie" ficheId="v1" />);
    expect(await screen.findByText("Point A")).toBeInTheDocument();
    expect(screen.getByText("Point B")).toBeInTheDocument();
    expect(screen.getByText("Exercice vidéo")).toBeInTheDocument();
    const titres = screen.getAllByRole("heading").map((h) => h.textContent);
    expect(titres).toEqual([BLOC_EXERCICE_POINTS_CLES, BLOC_EXERCICE_ABONNE_TITRE]);
  });

  it("Premium, vidéo sans exercice : les points clés seuls", async () => {
    premium();
    repondre({ exercice: null, pointsCles: ["Point A"] });
    render(<BlocExercice type="video" returnTo="/videos/a" parcours="repartie" ficheId="v1" />);
    expect(await screen.findByText("Point A")).toBeInTheDocument();
    expect(screen.queryByText(BLOC_EXERCICE_ABONNE_TITRE)).toBeNull();
  });

  it("Premium, champs vides ou erreur : rien", async () => {
    premium();
    repondre({ exercice: null, pointsCles: [] });
    const vide = render(<BlocExercice type="video" returnTo="/videos/a" parcours="repartie" ficheId="v1" />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(vide.container.innerHTML).toBe("");
    vide.unmount();
    repondre({ error: "x" }, false);
    const ko = render(<BlocExercice type="conseil" returnTo="/conseils/a" parcours="repartie" ficheId="t1" />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(ko.container.innerHTML).toBe("");
  });

  it.each(["conseil", "video"] as const)("non abonné, %s : bloc d'appel inchangé, aucun appel", (type) => {
    nextAuth.useSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "FREE" } } });
    const { container } = render(<BlocExercice type={type} returnTo={`/x/${type}`} parcours="repartie" ficheId="id1" />);
    expect(container.querySelector('[data-fiche-cta="premium"]')?.textContent).toBe(BLOC_EXERCICE[type].bouton);
    expect(container.querySelector("[data-points-cles]")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    nextAuth.useSession.mockReturnValue({ status: "unauthenticated", data: null });
  });

  it("Premium, vanne (08/11) : « À toi de jouer » chargé par la route, même rendu, aucun bouton", async () => {
    premium();
    repondre({ exercice: "Consigne de la vanne", pointsCles: [] });
    const { container } = render(<BlocExercice type="vanne" returnTo="/vannes/a" parcours="repartie" ficheId="j1" />);
    expect(await screen.findByText("Consigne de la vanne")).toBeInTheDocument();
    expect(screen.getAllByRole("heading").map((h) => h.textContent)).toEqual([BLOC_EXERCICE_ABONNE_TITRE]);
    expect(container.querySelectorAll("a")).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledWith("/api/fiches/exercice?type=vanne&id=j1", expect.anything());
  });

  it("non abonné, vanne : bloc d'appel inchangé, aucun appel", () => {
    nextAuth.useSession.mockReturnValue({ status: "unauthenticated", data: null });
    const { container } = render(<BlocExercice type="vanne" returnTo="/vannes/a" parcours="repartie" ficheId="j1" />);
    expect(container.querySelector('[data-fiche-cta="premium"]')?.textContent).toBe(BLOC_EXERCICE.vanne.bouton);
    expect(screen.queryByText(BLOC_EXERCICE_ABONNE_TITRE)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["conseils", "tip"],
    ["videos", "video"],
    ["vannes", "joke"],
  ])("page %s : id passé, jamais le texte de l'exercice ni les points clés", (dossier, v) => {
    const src = readFileSync(join(__dirname, `../../app/(dashboard)/${dossier}/[slug]/page.tsx`), "utf-8");
    const debut = src.search(/<BlocExercice\s+type=/);
    const bloc = src.slice(debut, src.indexOf("/>", debut));
    expect(debut).toBeGreaterThan(0);
    expect(bloc).toContain(`ficheId={${v}.id}`);
    expect(bloc).not.toMatch(/exercice=|learnings|\.exercise|howToApply/);
  });
});
