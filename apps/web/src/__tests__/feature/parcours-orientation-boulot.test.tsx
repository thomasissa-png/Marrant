/**
 * s19 point 1 ([CHOIX UTILISATEUR] 11/10) : le quiz d'orientation de /parcours envoie vers
 * Boulot sur « Au boulot, en réunion, à la pause » une fois le parcours publié.
 * Les deux états de l'interrupteur sont simulés ici (le fichier de config n'est pas modifié).
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParcoursPage from "@/app/(dashboard)/parcours/(liste)/page";

// Getter : `recommendParcours` lit l'interrupteur à chaque appel, chaque cas choisit son état.
// (La liste des cartes du hub, elle, est figée au chargement : seul le verdict du quiz est testé ici.)
jest.mock("@/config/parcours-publication", () => {
  const etat = { boulot: false };
  return {
    STORYTELLING_PUBLIE: true,
    get BOULOT_PUBLIE() {
      return etat.boulot;
    },
    simulerBoulotPublie: (valeur: boolean) => {
      etat.boulot = valeur;
    },
  };
});

const { simulerBoulotPublie } = jest.requireMock("@/config/parcours-publication") as {
  simulerBoulotPublie: (valeur: boolean) => void;
};

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: () => <div data-testid="progress-bar" />,
}));

jest.mock("@/components/home/faq-section", () => ({
  FaqSection: () => <div data-testid="faq-section" />,
  faqs: [],
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// s19 iter 5 (S15 @ux) : raison vraie pour les 3 deuxièmes réponses, la même pour toutes.
const RAISON_BOULOT =
  "Chaque exercice a une version sans risque au boulot, et ta vanne vise toujours la situation, jamais quelqu'un.";
const ANCIENNE_RAISON = /le lundi à 9 h, tu prends un ton de compte rendu/;

/** Icône affichée devant « Au boulot, en réunion, à la pause » (span aria-hidden du bouton). */
function iconeReponseBoulot(): string {
  const bouton = screen.getByText(/Au boulot, en réunion/).closest("button");
  return bouton?.querySelector("span[aria-hidden='true']")?.textContent ?? "";
}

async function repondre(q2: RegExp) {
  render(await ParcoursPage());
  await userEvent.click(screen.getByText(/Au boulot, en réunion/));
  await userEvent.click(screen.getByText(q2));
  expect(screen.getByText("Ton point de départ :")).toBeInTheDocument();
}

describe("Quiz d'orientation : « Au boulot » et l'interrupteur Boulot", () => {
  it("interrupteur à false : « Au boulot » + « rien à raconter » → Machine à Café (inchangé)", async () => {
    simulerBoulotPublie(false);
    await repondre(/rien de drôle à raconter/);
    expect(screen.getByText("Tu veux avoir de quoi raconter à la pause, autre chose que la météo.")).toBeInTheDocument();
    expect(screen.queryByText(RAISON_BOULOT)).not.toBeInTheDocument();
  });

  it("interrupteur à false : « Au boulot » + « quoi répondre » → Répartie (inchangé)", async () => {
    simulerBoulotPublie(false);
    await repondre(/quoi répondre sur le moment/);
    expect(screen.getByText(/la bonne réplique pendant qu'elle sert encore/)).toBeInTheDocument();
  });

  it.each([/rien de drôle à raconter/, /quoi répondre sur le moment/, /perdu confiance en moi/])(
    "interrupteur à true : « Au boulot » + %s → Boulot",
    async (q2) => {
      simulerBoulotPublie(true);
      await repondre(q2);
      expect(screen.getByText(RAISON_BOULOT)).toBeInTheDocument();
      expect(screen.queryByText(ANCIENNE_RAISON)).not.toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Parcours Boulot", level: 3 })).toBeInTheDocument();
    },
  );
});

describe("Quiz d'orientation : icône de « Au boulot » (N-3 @design)", () => {
  it("interrupteur à false : ☕, comme avant s19", async () => {
    simulerBoulotPublie(false);
    render(await ParcoursPage());
    expect(iconeReponseBoulot()).toContain("☕");
    expect(iconeReponseBoulot()).not.toContain("💼");
  });

  it("interrupteur à true : 💼, l'icône de la carte Boulot", async () => {
    simulerBoulotPublie(true);
    render(await ParcoursPage());
    expect(iconeReponseBoulot()).toContain("💼");
    expect(iconeReponseBoulot()).not.toContain("☕");
  });

  it("les deux autres réponses gardent leur icône", async () => {
    simulerBoulotPublie(true);
    render(await ParcoursPage());
    expect(screen.getByText(/En soirée, avec mes potes/).closest("button")?.textContent).toContain("🎉");
    expect(screen.getByText(/Partout, je veux retrouver/).closest("button")?.textContent).toContain("🌱");
  });
});
