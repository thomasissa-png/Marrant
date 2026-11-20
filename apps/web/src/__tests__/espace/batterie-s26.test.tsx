/**
 * s26 batterie (`docs/qa/batterie-avant-lancement-s26.md`, « Après le lancement » n°3 et n°4) :
 *  - `/mon-espace/questions/<id>` inexistant ou d'un autre abonné : `notFound()` dans le LAYOUT de Mes questions, au-
 *    dessus de `questions/loading.tsx` (statut 404, plus 200 ; mesuré sur serveur dédié), sans rien lire du fil ;
 *  - `/lettre`, interrupteur ouvert : compte connecté non abonné dont l'adresse a CONFIRMÉ la lettre = l'état confirmé
 *    existant (bandeau `statuts.confirmee`, sans mesure) au lieu du formulaire ; fermé : aucune lecture de session.
 */
import { render, screen } from "@testing-library/react";

const etat = globalThis as { __BATTERIE_S26_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __BATTERIE_S26_OUVERT__?: boolean }).__BATTERIE_S26_OUVERT__ ?? false;
  },
}));
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: jest.fn(),
  usePathname: () => "/lettre",
}));
const lireAccesEspace = jest.fn();
const garderEspace = jest.fn();
jest.mock("@/lib/espace/garde", () => ({
  lireAccesEspace: () => lireAccesEspace(),
  garderEspace: (...a: unknown[]) => garderEspace(...a),
}));
const listerFils = jest.fn();
jest.mock("@/lib/espace/questions", () => ({ listerFils: (...a: unknown[]) => listerFils(...a) }));
let chemin: string | null = null;
jest.mock("next/headers", () => ({ headers: () => ({ get: () => chemin }) }));
const lireLecteurApercu = jest.fn();
jest.mock("@/components/espace/apercu/acces", () => ({ lireLecteurApercu: () => lireLecteurApercu() }));
jest.mock("@/components/espace/questions/questions-liste-detail", () => ({
  QuestionsListeDetail: ({ children }: { children: React.ReactNode }) => <div data-testid="liste">{children}</div>,
}));
jest.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: jest.fn() }, newsletterSubscriber: { findUnique: jest.fn() } },
}));
jest.mock("@/lib/lettre/apercu", () => ({ lireApercuLettre: jest.fn().mockResolvedValue({ dernier: null }) }));
jest.mock("@/components/lettre/lettre-page-inscription", () => ({
  LettrePageInscription: () => <div data-testid="inscription" />,
}));
const trackUmamiWhenReady = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmamiWhenReady: (...a: unknown[]) => trackUmamiWhenReady(...a), trackUmami: jest.fn() }));

import QuestionsLayout from "@/app/(dashboard)/mon-espace/questions/layout";
import LettrePage from "@/app/(dashboard)/lettre/page";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";

const { prisma } = jest.requireMock("@/lib/prisma") as {
  prisma: { user: { findUnique: jest.Mock }; newsletterSubscriber: { findUnique: jest.Mock } };
};

afterAll(() => {
  delete etat.__BATTERIE_S26_OUVERT__;
});
beforeEach(() => {
  jest.clearAllMocks();
  etat.__BATTERIE_S26_OUVERT__ = true;
  garderEspace.mockResolvedValue({ userId: "abonne-1" });
});

describe("s26 batterie : fil de question inexistant ou d'un autre abonné = vraie 404", () => {
  // Le layout rend `<ListeDetailAbonne>` (composant serveur asynchrone) : résolu ici comme le ferait le serveur.
  async function rendreLayout() {
    const el = QuestionsLayout({ children: <p data-testid="page">page</p> }) as React.ReactElement;
    const type = el.type as (p: unknown) => unknown;
    return type.constructor.name === "AsyncFunction" ? ((await type(el.props)) as React.ReactElement) : el;
  }

  beforeEach(() => {
    lireLecteurApercu.mockResolvedValue(false);
    listerFils.mockResolvedValue([{ id: "fil-de-l-abonne-1" }]);
  });

  it("fil absent de SES fils (inexistant ou d'un autre abonné) : notFound() au-dessus de loading.tsx", async () => {
    for (const c of ["/mon-espace/questions/fil-d-un-autre-99", "/mon-espace/questions/inconnu?x=1", "/mon-espace/questions/x/"]) {
      chemin = c;
      await expect(rendreLayout()).rejects.toThrow("NEXT_NOT_FOUND");
    }
    expect(garderEspace).toHaveBeenCalledWith("/mon-espace/questions/fil-d-un-autre-99");
    expect(listerFils).toHaveBeenCalledWith("abonne-1");
  });

  it("son fil, ou la liste : rendu normal", async () => {
    for (const c of ["/mon-espace/questions/fil-de-l-abonne-1", "/mon-espace/questions", "/mon-espace/questions/", null]) {
      chemin = c;
      const { unmount } = render(await rendreLayout());
      expect(screen.getByTestId("page")).toBeTruthy();
      unmount();
    }
  });

  it("aperçu (visiteur, compte gratuit) : aucune lecture, la page garde sa propre garde", async () => {
    lireLecteurApercu.mockResolvedValue(true);
    chemin = "/mon-espace/questions/fil-d-un-autre-99";
    render(await rendreLayout());
    expect(garderEspace).not.toHaveBeenCalled();
    expect(listerFils).not.toHaveBeenCalled();
  });

  it("fermé : layout synchrone, aucune lecture (la page reste la 404 d'avant)", () => {
    etat.__BATTERIE_S26_OUVERT__ = false;
    chemin = "/mon-espace/questions/fil-d-un-autre-99";
    render(QuestionsLayout({ children: <p data-testid="page">page</p> }) as React.ReactElement);
    expect(lireLecteurApercu).not.toHaveBeenCalled();
    expect(listerFils).not.toHaveBeenCalled();
  });
});

describe("s26 batterie : /lettre d'un lecteur déjà confirmé", () => {
  const confirme = () => screen.queryByText(TEXTES_LETTRE.statuts.confirmee.titre);

  it("ouvert, compte gratuit dont l'adresse est CONFIRMED : état confirmé existant, pas de formulaire, pas de mesure", async () => {
    lireAccesEspace.mockResolvedValue({ acces: "abonnement", userId: "u1", ancienAbonne: false });
    prisma.user.findUnique.mockResolvedValue({ email: " Lecteur@Exemple.fr " });
    prisma.newsletterSubscriber.findUnique.mockResolvedValue({ status: "CONFIRMED" });
    render((await LettrePage({ searchParams: { mesure: "1" } })) as React.ReactElement);
    expect(prisma.newsletterSubscriber.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { email: "lecteur@exemple.fr" } }));
    expect(confirme()).not.toBeNull();
    expect(screen.queryByTestId("inscription")).toBeNull();
    expect(trackUmamiWhenReady).not.toHaveBeenCalled();
  });

  it("ouvert, adresse en attente, désinscrite ou absente : formulaire, comme avant", async () => {
    lireAccesEspace.mockResolvedValue({ acces: "abonnement", userId: "u1", ancienAbonne: true });
    prisma.user.findUnique.mockResolvedValue({ email: "lecteur@exemple.fr" });
    for (const inscrit of [{ status: "PENDING" }, { status: "UNSUBSCRIBED" }, null]) {
      prisma.newsletterSubscriber.findUnique.mockResolvedValue(inscrit);
      const { unmount } = render((await LettrePage({ searchParams: {} })) as React.ReactElement);
      expect(screen.queryByTestId("inscription")).not.toBeNull();
      expect(confirme()).toBeNull();
      unmount();
    }
  });

  it("ouvert, visiteur : formulaire, aucune lecture de l'inscription", async () => {
    lireAccesEspace.mockResolvedValue({ acces: "connexion" });
    render((await LettrePage({ searchParams: {} })) as React.ReactElement);
    expect(screen.queryByTestId("inscription")).not.toBeNull();
    expect(prisma.newsletterSubscriber.findUnique).not.toHaveBeenCalled();
  });

  it("fermé (site public actuel) : rendu inchangé, aucune lecture de session ni d'inscription", async () => {
    etat.__BATTERIE_S26_OUVERT__ = false;
    render((await LettrePage({ searchParams: {} })) as React.ReactElement);
    expect(screen.queryByTestId("inscription")).not.toBeNull();
    expect(lireAccesEspace).not.toHaveBeenCalled();
    expect(prisma.newsletterSubscriber.findUnique).not.toHaveBeenCalled();
  });
});
