/**
 * s27 D3 (`docs/qa/parcours-abonne-s27.md`) : à la fin du quiz d'étape, le texte disait « Tu peux valider l'étape » alors
 * que le seul gros bouton visible était grisé (« Termine le quiz pour valider cette étape ») et que la validation passait
 * par un « Continuer » en contour ; le lien vers l'étape suivante était visible avant la validation.
 * Cible : un seul bouton principal actif, « Valider cette étape » (libellé existant), juste sous le résultat ; pas de
 * lien vers l'étape suivante tant que l'étape n'est pas validée.
 */
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParcoursStepCard, type ParcoursStepCardProps } from "@/components/parcours/parcours-step-card";
import { lienSuivanteVisible } from "@/components/espace/parcours/navigation-etapes";
import type { Step } from "@/components/parcours/parcours-types";

jest.mock("@/components/ui/progress-bar", () => ({ ProgressBar: () => <div /> }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "u1", plan: "PREMIUM" } }, status: "authenticated" }),
}));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

const ETAPE: Step = {
  id: "s1",
  order: 1,
  dayNumber: 7,
  tip: { id: "t1", title: "Conseil 1", content: "Contenu 1", category: "GENERAL", difficulty: "DEBUTANT", example: "", exercise: "" },
  moduleTitle: "Module 1",
  moduleXp: 50,
  quiz: [
    { question: "Question A ?", options: ["Bonne A", "Fausse A"], correctIndex: 0 },
    { question: "Question B ?", options: ["Fausse B", "Bonne B"], correctIndex: 1 },
  ],
  videos: [],
};

/** Carte d'étape tenue comme par `ParcoursDetail` : la fin du quiz marque le quiz fait. */
function Carte({ onQuizComplete, onComplete }: { onQuizComplete: jest.Mock; onComplete: jest.Mock }) {
  const [quizFait, setQuizFait] = useState(false);
  const props: ParcoursStepCardProps = {
    step: ETAPE,
    slug: "repartie",
    isPremium: true,
    isCompleted: false,
    isExpanded: true,
    isPremiumLocked: false,
    isQuizDone: quizFait,
    isSeedFallback: false,
    completing: false,
    abonnementHref: "/abonnement",
    loadFailed: false,
    onRetryLoad: jest.fn(),
    onToggle: jest.fn(),
    onQuizComplete: (score, total) => {
      setQuizFait(true);
      onQuizComplete(score, total);
    },
    onComplete,
  };
  return <ParcoursStepCard {...props} />;
}

async function finirLeQuiz() {
  await userEvent.click(screen.getByRole("button", { name: /Fausse A/ }));
  await userEvent.click(screen.getByRole("button", { name: "Question suivante" }));
  await userEvent.click(screen.getByRole("button", { name: /Bonne B/ }));
  await userEvent.click(screen.getByRole("button", { name: "Voir le résultat" }));
}

describe("fin du quiz d'étape, abonné (s27 D3)", () => {
  it("avant la fin : « Valider » grisé avec sa consigne (inchangé)", () => {
    render(<Carte onQuizComplete={jest.fn()} onComplete={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Termine le quiz pour valider cette étape" })).toHaveAttribute("aria-disabled", "true");
  });

  it("à la fin : résultat affiché, un seul bouton principal actif « Valider cette étape », plus de « Continuer »", async () => {
    const quiz = jest.fn();
    const valider = jest.fn();
    render(<Carte onQuizComplete={quiz} onComplete={valider} />);
    await finirLeQuiz();

    // Quiz compté dès la fin, sans clic de plus.
    expect(quiz).toHaveBeenCalledWith(1, 2);
    const resultat = screen.getByRole("status", { name: "" });
    expect(within(resultat).getByText("1/2 bonnes réponses")).toBeInTheDocument();
    expect(resultat.textContent).toMatch(/Tu peux valider l.étape/);

    expect(screen.queryByRole("button", { name: "Continuer" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Termine le quiz pour valider cette étape" })).toBeNull();
    const bouton = screen.getByRole("button", { name: "Valider cette étape" });
    expect(bouton).toBeEnabled();
    expect(bouton).not.toHaveAttribute("aria-disabled");
    // Le focus passe sur le bouton actif (le bouton « Voir le résultat » a disparu).
    expect(bouton).toHaveFocus();
    // La ligne « Quiz bouclé » (après rechargement seulement) ne double pas le résultat.
    expect(screen.queryByText(/Quiz bouclé/)).toBeNull();

    await userEvent.click(bouton);
    expect(valider).toHaveBeenCalledTimes(1);
  });
});

describe("lien vers l'étape suivante (pied de l'étape, s27 D3)", () => {
  it("abonné : seulement après la validation ; suivi indisponible : gardé ; visiteur : inchangé", () => {
    expect(lienSuivanteVisible({ abonne: true, etapeValidee: false, suiviIndisponible: false })).toBe(false);
    expect(lienSuivanteVisible({ abonne: true, etapeValidee: true, suiviIndisponible: false })).toBe(true);
    expect(lienSuivanteVisible({ abonne: true, etapeValidee: false, suiviIndisponible: true })).toBe(true);
    expect(lienSuivanteVisible({ abonne: false, etapeValidee: false, suiviIndisponible: false })).toBe(true);
  });
});
