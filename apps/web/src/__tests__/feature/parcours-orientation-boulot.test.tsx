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

const RAISON_BOULOT = /le lundi à 9 h, tu prends un ton de compte rendu/;

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
      expect(screen.getByRole("heading", { name: "Parcours Boulot", level: 3 })).toBeInTheDocument();
    },
  );
});
