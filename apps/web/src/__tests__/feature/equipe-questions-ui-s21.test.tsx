/**
 * s21 « Ta question à l'équipe » : rendu.
 * Interrupteur fermé = rien de rendu (pages 404, entrée du profil absente, rien
 * dans le sitemap) ; formulaire : consigne @legal AVANT le champ, case jamais
 * pré-cochée ; textes sans tiret cadratin ni émoji ; grille automatique.
 */
import { render, screen } from "@testing-library/react";

const reglage = { ouvert: false };
jest.mock("@/config/equipe-questions", () => ({
  ...jest.requireActual("@/config/equipe-questions"),
  questionsOuvertes: () => reglage.ouvert,
}));
const readSessionPlan = jest.fn();
jest.mock("@/lib/session-plan", () => ({ readSessionPlan: () => readSessionPlan() }));
const userIdSession = jest.fn();
jest.mock("@/lib/equipe-questions/http", () => ({ userIdSession: () => userIdSession() }));
const listerQuestions = jest.fn();
jest.mock("@/lib/equipe-questions/abonne", () => ({
  listerQuestions: (...a: unknown[]) => listerQuestions(...a),
  lireQuestion: jest.fn(),
}));
const notFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
const redirect = jest.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT ${url}`);
});
jest.mock("next/navigation", () => ({
  notFound: () => notFound(),
  redirect: (u: string) => redirect(u),
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
}));

import TaQuestionPage from "@/app/(dashboard)/ta-question-a-l-equipe/page";
import QuestionDetailPage from "@/app/(dashboard)/ta-question-a-l-equipe/[id]/page";
import { EntreeQuestionsProfil } from "@/components/equipe-questions/entree-profil";
import { FormulaireQuestion } from "@/components/equipe-questions/formulaire-question";
import * as TEXTES from "@/config/textes/equipe-questions";
import { SIGNATURE_EQUIPE } from "@/config/equipe-questions";
import { defautsGrille } from "@/lib/equipe-questions/regles";
import { readFileSync } from "fs";
import { join } from "path";

beforeEach(() => {
  jest.clearAllMocks();
  reglage.ouvert = false;
});

describe("interrupteur fermé : rien n'est rendu", () => {
  it("les deux pages répondent 404 avant toute lecture de session", async () => {
    await expect(TaQuestionPage()).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(QuestionDetailPage({ params: { id: "q1" } })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(userIdSession).not.toHaveBeenCalled();
  });

  it("l'entrée du profil ne rend rien et ne lit pas la session", async () => {
    expect(await EntreeQuestionsProfil()).toBeNull();
    expect(readSessionPlan).not.toHaveBeenCalled();
  });

  it("la page n'est ni dans le sitemap, ni dans le menu, ni dans le pied de page", () => {
    const src = (f: string) => readFileSync(join(process.cwd(), "src", f), "utf8");
    for (const f of ["app/sitemap.ts", "components/layout/header.tsx", "components/layout/footer.tsx"]) {
      expect(src(f)).not.toContain("ta-question-a-l-equipe");
    }
  });
});

describe("interrupteur ouvert", () => {
  beforeEach(() => {
    reglage.ouvert = true;
  });

  it("visiteur : redirection vers /login avec retour", async () => {
    userIdSession.mockResolvedValue(null);
    await expect(TaQuestionPage()).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fta-question-a-l-equipe");
  });

  it("compte sans Premium : message Premium, aucun formulaire ni historique", async () => {
    userIdSession.mockResolvedValue("u3");
    listerQuestions.mockResolvedValue({ ok: false, code: "premium" });
    render(await TaQuestionPage());
    expect(screen.getByText(TEXTES.TEXTES_EQUIPE_ETATS.nonPremium)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: TEXTES.TEXTES_EQUIPE_PAGE.bouton })).toBeNull();
  });

  it("entrée du profil : Premium seulement", async () => {
    readSessionPlan.mockResolvedValue("FREE");
    expect(await EntreeQuestionsProfil()).toBeNull();
    readSessionPlan.mockResolvedValue("PREMIUM");
    render((await EntreeQuestionsProfil())!);
    expect(screen.getByRole("link", { name: TEXTES.TEXTES_EQUIPE_PAGE.boutonProfil })).toHaveAttribute("href", "/ta-question-a-l-equipe");
  });
});

describe("formulaire", () => {
  it("consigne avant le champ, case de reprise décochée, bouton jamais grisé", () => {
    const { container } = render(<FormulaireQuestion />);
    const consigne = screen.getByText((t) => t.startsWith("Ta question reste privée"));
    const champ = screen.getByLabelText(TEXTES.TEXTES_EQUIPE_PAGE.labelSituation);
    expect(consigne.compareDocumentPosition(champ) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByRole("button", { name: TEXTES.TEXTES_EQUIPE_PAGE.bouton })).toBeEnabled();
    expect(container.textContent).not.toMatch(/par semaine/);
  });
});

describe("textes et grille", () => {
  const tous = JSON.stringify(TEXTES) + Object.values(TEXTES.EMAILS_EQUIPE).map((e) => {
    const corps = e.corps as (...a: string[]) => string;
    return corps("Salut,", "x", "y");
  }).join(" ");

  it("zéro tiret cadratin, zéro émoji, aucune mention d'outil", () => {
    expect(tous).not.toContain("—");
    expect(/\p{Extended_Pictographic}/u.test(tous)).toBe(false);
    expect(tous).not.toMatch(/intelligence artificielle|\bIA\b/);
  });

  it("le fichier de textes porte la mention « à relire à l'aveugle avant ouverture »", () => {
    const f = readFileSync(join(process.cwd(), "src/config/textes/equipe-questions.ts"), "utf8");
    expect(f).toContain("À RELIRE À L'AVEUGLE AVANT OUVERTURE");
    // Textes dans des fonctions compris (JSON.stringify les ignore) : aucun tiret cadratin dans le fichier.
    expect(f).not.toContain("—");
  });

  it("grille : signature exigée, tiret, émoji et mention d'outil détectés", () => {
    expect(defautsGrille(`Bonne réplique.\n\n${SIGNATURE_EQUIPE}`)).toEqual([]);
    expect(defautsGrille("Bonne réplique.")).toEqual(["signature"]);
    expect(defautsGrille(`Une IA — a écrit 😀\n${SIGNATURE_EQUIPE}`)).toEqual(["tiret-cadratin", "emoji", "mention-outil"]);
  });
});
