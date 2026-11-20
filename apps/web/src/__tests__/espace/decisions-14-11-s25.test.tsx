/**
 * Décisions de Thomas du 14/11 (s25), rendu :
 *  - FAQ de /parcours (liste par défaut) : question du prix masquée pour l'abonné, interrupteur ouvert seulement ;
 *    visible pour le visiteur, et partout ailleurs (liste passée en `items`) ; fermé : rien ne change.
 *  - `/lettre` : une seule section ; ouvert, l'abonné actif lit l'archive des lettres (sans retour ni fil d'Ariane),
 *    les autres l'inscription ; une adresse de statut garde son écran ; fermé, aucune lecture de session.
 *  - `/mon-espace/lettres` : après la garde de l'espace, redirection permanente vers `/lettre`.
 */
import { render, screen } from "@testing-library/react";

const etat = globalThis as { __DECISIONS_RENDU_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __DECISIONS_RENDU_OUVERT__?: boolean }).__DECISIONS_RENDU_OUVERT__ ?? false;
  },
}));
const estPremium = jest.fn(() => false);
jest.mock("@/hooks/use-est-premium", () => ({ useEstPremium: () => estPremium() }));
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: jest.fn(),
  permanentRedirect: (url: string) => permanentRedirect(url),
  usePathname: () => "/lettre",
}));
const permanentRedirect = jest.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT 308 ${url}`);
});
const lireAccesEspace = jest.fn();
const garderEspace = jest.fn();
jest.mock("@/lib/espace/garde", () => ({
  lireAccesEspace: () => lireAccesEspace(),
  garderEspace: (...a: unknown[]) => garderEspace(...a),
}));
const listerLettres = jest.fn();
jest.mock("@/lib/espace/lettres", () => ({ listerLettres: () => listerLettres() }));
const compterAnonyme = jest.fn();
jest.mock("@/lib/espace/compteurs", () => ({ compterAnonyme: (...a: unknown[]) => compterAnonyme(...a) }));
// s26 batterie : /lettre ouvert lit l'inscription du compte connecté (`lettreConfirmeeDuCompte`) ; ici, aucune.
jest.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: async () => null }, newsletterSubscriber: { findUnique: async () => null } },
}));
jest.mock("@/lib/lettre/apercu", () => ({ lireApercuLettre: jest.fn().mockResolvedValue({ dernier: null }) }));
jest.mock("@/components/lettre/lettre-page-inscription", () => ({
  LettrePageInscription: () => <div data-testid="inscription" />,
}));

import { FaqSection } from "@/components/home/faq-section";
import { faqs } from "@/lib/faqs";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";
import LettrePage from "@/app/(dashboard)/lettre/page";
import AnciennesLettres from "@/app/(dashboard)/mon-espace/lettres/page";

// Composant serveur asynchrone renvoyé par la page (`<LettresAbonneCartes />`) : résolu ici, comme le ferait le serveur.
async function rendrePage(params: Parameters<typeof LettrePage>[0]) {
  const el = (await LettrePage(params)) as React.ReactElement;
  const type = el.type as (p: unknown) => unknown;
  render(type.constructor.name === "AsyncFunction" ? ((await type(el.props)) as React.ReactElement) : el);
}

const prix = () => screen.queryByText((_, el) => el?.tagName === "SUMMARY" && (el.textContent ?? "").includes("c’est vraiment tout"));

afterAll(() => {
  delete etat.__DECISIONS_RENDU_OUVERT__;
});
beforeEach(() => {
  jest.clearAllMocks();
});

describe("FAQ : question du prix", () => {
  it("une seule question de la liste par défaut commence par le prix (celle qui est masquée)", () => {
    expect(faqs.filter((f) => f.question.startsWith(PREMIUM_PRICE_LABEL))).toHaveLength(1);
  });

  it.each([
    ["ouvert, abonné, /parcours (liste par défaut)", true, true, undefined, false],
    ["ouvert, visiteur, /parcours", true, false, undefined, true],
    ["ouvert, abonné, liste passée (/blague-du-jour)", true, true, faqs, true],
    ["fermé, abonné, /parcours", false, true, undefined, true],
  ] as const)("%s", (_nom, ouvert, abonne, items, visible) => {
    etat.__DECISIONS_RENDU_OUVERT__ = ouvert;
    estPremium.mockReturnValue(abonne);
    render(<FaqSection align="left" items={items} />);
    expect(Boolean(prix())).toBe(visible);
    expect(document.querySelectorAll("summary")).toHaveLength(visible ? faqs.length : faqs.length - 1);
  });
});

describe("/lettre : une seule section", () => {
  const LETTRES = [{ numero: "2026-W46", titre: "La lettre du jeudi 12 novembre", objet: "Objet test" }];

  it("ouvert, abonné actif : l'archive des lettres, sans retour, compteur anonyme", async () => {
    etat.__DECISIONS_RENDU_OUVERT__ = true;
    lireAccesEspace.mockResolvedValue({ acces: "ouvert", userId: "u1" });
    listerLettres.mockResolvedValue(LETTRES);
    await rendrePage({ searchParams: {} });
    // v6 tour 1, point 10 : H1 « La lettre », libellé validé de la bande.
    expect(screen.getByRole("heading", { level: 1, name: "La lettre" })).toBeInTheDocument();
    // s26 (`questions-repliques-lettre-profil-s26.md` §3.2) : la dernière lettre en tuile, le titre daté est le lien (carte
    // entière cliquable), l'objet dessous.
    expect(screen.getByRole("link", { name: /novembre/ })).toHaveAttribute("href", "/mon-espace/lettres/2026-W46");
    expect(screen.getByText("Objet test")).toBeInTheDocument();
    expect(screen.queryByTestId("inscription")).toBeNull();
    expect(screen.queryByRole("navigation", { name: /Ariane/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Retour|Mon espace/ })).toBeNull();
    expect(compterAnonyme).toHaveBeenCalledWith({ cle: "ouverture", valeur: "archive-lettres" });
  });

  it.each([
    ["visiteur", { acces: "connexion" }],
    ["compte gratuit", { acces: "abonnement", userId: "u2", ancienAbonne: false }],
    ["ancien abonné", { acces: "abonnement", userId: "u3", ancienAbonne: true }],
  ])("ouvert, %s : l'inscription d'aujourd'hui", async (_nom, acces) => {
    etat.__DECISIONS_RENDU_OUVERT__ = true;
    lireAccesEspace.mockResolvedValue(acces);
    await rendrePage({ searchParams: {} });
    expect(screen.getByTestId("inscription")).toBeInTheDocument();
    expect(listerLettres).not.toHaveBeenCalled();
  });

  it("ouvert, abonné, adresse de statut : l'écran du statut, pas l'archive", async () => {
    etat.__DECISIONS_RENDU_OUVERT__ = true;
    lireAccesEspace.mockResolvedValue({ acces: "ouvert", userId: "u1" });
    await rendrePage({ searchParams: { statut: "desinscrit" } });
    expect(lireAccesEspace).not.toHaveBeenCalled();
    expect(listerLettres).not.toHaveBeenCalled();
  });

  it("fermé : aucune lecture de session, l'inscription d'aujourd'hui", async () => {
    etat.__DECISIONS_RENDU_OUVERT__ = false;
    await rendrePage({ searchParams: {} });
    expect(lireAccesEspace).not.toHaveBeenCalled();
    expect(screen.getByTestId("inscription")).toBeInTheDocument();
  });
});

describe("/mon-espace/lettres : mène à /lettre", () => {
  it("garde de l'espace d'abord, puis 308 vers /lettre", async () => {
    garderEspace.mockResolvedValue({ userId: "u1" });
    await expect(AnciennesLettres()).rejects.toThrow("NEXT_REDIRECT 308 /lettre");
    expect(garderEspace).toHaveBeenCalledWith("/mon-espace/lettres");
    expect(listerLettres).not.toHaveBeenCalled();
  });
  it("garde refusée (fermé, connexion, abonnement) : pas de redirection vers /lettre", async () => {
    garderEspace.mockRejectedValue(new Error("NEXT_NOT_FOUND"));
    await expect(AnciennesLettres()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(permanentRedirect).not.toHaveBeenCalled();
  });
});
