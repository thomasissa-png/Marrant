/**
 * Lettre mensuelle s21 : interrupteur, emplacements, états du composant et mesure Umami.
 *  - Fermé (défaut) : RIEN de rendu (article, quiz, pied de page, /lettre en 404).
 *  - Ouvert : 3 emplacements, bloc d'article sans `data-blog-cta*`, Premium sans composant,
 *    erreurs de saisie, succès « Vérifie ta boîte », `lettre-vu` / `lettre-envoi` /
 *    `lettre-echec` / `lettre-confirmee`.
 */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

let mockOuvert = false;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_OUVERTE() {
    return mockOuvert;
  },
}));

let mockSession: { data: unknown; status: string } = { data: null, status: "unauthenticated" };
jest.mock("next-auth/react", () => ({
  useSession: () => mockSession,
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: jest.fn(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/blog",
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blogArticle: { findMany: jest.fn().mockResolvedValue([]), findUnique: jest.fn().mockResolvedValue(null) },
    newsletterIssue: { findFirst: jest.fn().mockResolvedValue(null) },
  },
}));

import { LettreInscription } from "@/components/lettre/lettre-inscription";
import { Footer } from "@/components/layout/footer";
import { ViralQuiz } from "@/components/quiz/viral-quiz";
import BlogArticlePage from "@/app/(dashboard)/blog/[slug]/page";
import LettrePage from "@/app/(dashboard)/lettre/page";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

const SLUG = "meilleures-blagues-droles-2026";
const track = jest.fn();
type Entry = { isIntersecting: boolean; intersectionRatio: number };
let observerCallback: (entries: Entry[]) => void = () => {};
const fetchMock = jest.fn();

beforeEach(() => {
  mockOuvert = false;
  mockSession = { data: null, status: "unauthenticated" };
  track.mockClear();
  fetchMock.mockReset();
  window.localStorage.clear();
  (window as unknown as { umami: { track: jest.Mock } }).umami = { track };
  (global as unknown as { fetch: jest.Mock }).fetch = fetchMock;
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    constructor(cb: (entries: Entry[]) => void) {
      observerCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

function poserResultatQuiz() {
  window.localStorage.setItem("humor-quiz-viral", JSON.stringify({ profile: "OBSERVATEUR", completedAt: new Date().toISOString() }));
}

describe("Interrupteur LETTRE_OUVERTE fermé (défaut) : rien n'est rendu", () => {
  it("le composant ne rend rien", () => {
    const { container } = render(<LettreInscription emplacement="article" slug={SLUG} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("article : aucun bloc lettre", async () => {
    const Page = await BlogArticlePage({ params: { slug: SLUG } });
    const { container } = render(Page);
    expect(container.querySelector("[data-lettre]")).toBeNull();
    expect(screen.queryByText(TEXTES_LETTRE.titre)).toBeNull();
  });

  it("quiz : aucun bloc lettre sous le résultat", () => {
    poserResultatQuiz();
    const { container } = render(<ViralQuiz />);
    expect(screen.getByText("Refaire le quiz")).toBeInTheDocument();
    expect(container.querySelector("[data-lettre]")).toBeNull();
  });

  it("pied de page : pas de lien vers /lettre", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('a[href="/lettre"]')).toBeNull();
  });

  it("/lettre : 404, sauf l'arrivée de la désinscription", async () => {
    await expect(LettrePage({ searchParams: {} })).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(LettrePage({ searchParams: { statut: "confirmee" } })).rejects.toThrow("NEXT_NOT_FOUND");
    render(await LettrePage({ searchParams: { statut: "desinscrit" } }));
    expect(screen.getByText(TEXTES_LETTRE.statuts.desinscrit.titre)).toBeInTheDocument();
    expect(screen.queryByLabelText(TEXTES_LETTRE.formulaire.label)).toBeNull();
  });
});

describe("Interrupteur ouvert", () => {
  beforeEach(() => {
    mockOuvert = true;
  });

  it("article : bloc juste après le bloc de fin, sans data-blog-cta*, zone « lettre », bouton neutre", async () => {
    const Page = await BlogArticlePage({ params: { slug: SLUG } });
    const { container } = render(Page);
    const blocs = container.querySelectorAll("[data-lettre]");
    expect(blocs).toHaveLength(1);
    const bloc = blocs[0] as HTMLElement;
    expect(container.querySelector("[data-blog-bloc-fin]")?.nextElementSibling).toBe(bloc);
    expect(bloc.dataset.blogZone).toBe("lettre");
    expect(bloc.hasAttribute("data-blog-cta")).toBe(false);
    expect(bloc.hasAttribute("data-blog-cta-position")).toBe(false);
    expect(bloc.querySelector("[data-blog-cta], [data-blog-cta-position]")).toBeNull();
    const bouton = screen.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton });
    expect(bouton.className).not.toMatch(/bg-accent-secondary/);
    expect(bloc.querySelector("h2, h3")).toBeNull();
  });

  it("quiz : bloc sous la carte du résultat, avant « Refaire le quiz »", () => {
    poserResultatQuiz();
    const { container } = render(<ViralQuiz />);
    const bloc = container.querySelector('[data-lettre="quiz"]')!;
    expect(bloc).not.toBeNull();
    const follows = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(follows(bloc, screen.getByText("Refaire le quiz"))).toBe(true);
  });

  it("pied de page : lien « La lettre du mois » après « Quiz humour »", () => {
    render(<Footer />);
    const lien = screen.getByRole("link", { name: "La lettre du mois" });
    expect(lien).toHaveAttribute("href", "/lettre");
    const quiz = screen.getByRole("link", { name: "Quiz humour" });
    expect(quiz.closest("li")?.nextElementSibling?.contains(lien)).toBe(true);
  });

  it("abonné Premium connecté : rien n'est rendu", () => {
    mockSession = { data: { user: { email: "p@x.fr", plan: "PREMIUM" } }, status: "authenticated" };
    const { container } = render(<LettreInscription emplacement="article" slug={SLUG} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("compte connecté non Premium : e-mail pré-rempli, case jamais pré-cochée", () => {
    mockSession = { data: { user: { email: "free@x.fr", plan: "FREE" } }, status: "authenticated" };
    render(<LettreInscription emplacement="quiz" profil="observateur" />);
    expect(screen.getByLabelText(TEXTES_LETTRE.formulaire.label)).toHaveValue("free@x.fr");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("lettre-vu : une fois, seulement à 50 % visible", () => {
    render(<LettreInscription emplacement="article" slug={SLUG} />);
    act(() => observerCallback([{ isIntersecting: true, intersectionRatio: 0.3 }]));
    expect(track).not.toHaveBeenCalled();
    act(() => observerCallback([{ isIntersecting: true, intersectionRatio: 0.6 }]));
    act(() => observerCallback([{ isIntersecting: true, intersectionRatio: 1 }]));
    expect(track.mock.calls).toEqual([["lettre-vu", { emplacement: "article", slug: SLUG }]]);
  });

  it("case non cochée : message clair, lettre-echec raison=case, aucun envoi", () => {
    render(<LettreInscription emplacement="article" slug={SLUG} />);
    fireEvent.change(screen.getByLabelText(TEXTES_LETTRE.formulaire.label), { target: { value: "yanis@exemple.fr" } });
    fireEvent.click(screen.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton }));
    expect(screen.getByRole("alert")).toHaveTextContent(TEXTES_LETTRE.erreurs.case);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
    expect(track).toHaveBeenCalledWith("lettre-echec", { emplacement: "article", raison: "case" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("e-mail invalide : message sous le champ relié par aria-describedby", () => {
    render(<LettreInscription emplacement="page" />);
    const champ = screen.getByLabelText(TEXTES_LETTRE.formulaire.label);
    fireEvent.change(champ, { target: { value: "toi@" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton }));
    expect(screen.getByRole("alert")).toHaveTextContent(TEXTES_LETTRE.erreurs.email);
    expect(champ.getAttribute("aria-describedby")).toBe("lettre-page-erreur-email");
  });

  it("succès : lettre-envoi, « Vérifie ta boîte » (jamais « inscrit »), drapeau d'appareil", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) });
    render(<LettreInscription emplacement="article" slug={SLUG} />);
    fireEvent.change(screen.getByLabelText(TEXTES_LETTRE.formulaire.label), { target: { value: "yanis@exemple.fr" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton }));
    expect(track).toHaveBeenCalledWith("lettre-envoi", { emplacement: "article", slug: SLUG });
    await waitFor(() => expect(screen.getByText(TEXTES_LETTRE.succes.titre)).toBeInTheDocument());
    const corps = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(corps).toMatchObject({ email: "yanis@exemple.fr", consent: true, emplacement: "article", slug: SLUG });
    expect(corps.consentText).toBeUndefined();
    expect(screen.queryByText(/inscrit/i)).toBeNull();
    expect(window.localStorage.getItem("dm-lettre")).not.toBeNull();
    expect(screen.getByRole("button", { name: TEXTES_LETTRE.succes.renvoyer })).toBeDisabled();
  });

  it("429 : message « Trop d'essais », saisie gardée, lettre-echec raison=limite", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 429, json: async () => ({ code: "limite" }) });
    render(<LettreInscription emplacement="quiz" profil="observateur" />);
    fireEvent.change(screen.getByLabelText(TEXTES_LETTRE.formulaire.label), { target: { value: "yanis@exemple.fr" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: TEXTES_LETTRE.formulaire.bouton }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(TEXTES_LETTRE.erreurs.limite));
    expect(screen.getByLabelText(TEXTES_LETTRE.formulaire.label)).toHaveValue("yanis@exemple.fr");
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(track).toHaveBeenCalledWith("lettre-echec", { emplacement: "quiz", raison: "limite" });
  });

  it("drapeau d'appareil récent : ligne courte à la place du formulaire", () => {
    window.localStorage.setItem("dm-lettre", new Date().toISOString());
    render(<LettreInscription emplacement="article" slug={SLUG} />);
    expect(screen.getByText(TEXTES_LETTRE.drapeau.texte, { exact: false })).toBeInTheDocument();
    expect(screen.queryByLabelText(TEXTES_LETTRE.formulaire.label)).toBeNull();
  });

  it("/lettre?statut=confirmee&mesure=1 : lettre-confirmee avec l'emplacement, sans donnée personnelle", async () => {
    render(await LettrePage({ searchParams: { statut: "confirmee", mesure: "1", emplacement: "article" } }));
    expect(screen.getByText(TEXTES_LETTRE.statuts.confirmee.titre)).toBeInTheDocument();
    expect(track).toHaveBeenCalledWith("lettre-confirmee", { emplacement: "article" });
  });

  it("/lettre?statut=confirmee sans mesure (compte de test) : rien n'est compté", async () => {
    render(await LettrePage({ searchParams: { statut: "confirmee" } }));
    expect(track).not.toHaveBeenCalledWith("lettre-confirmee", expect.anything());
  });
});
