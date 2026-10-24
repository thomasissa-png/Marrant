/**
 * s20, audit des pages (décision Thomas du 13/10/2026) : l'offre coaching à 99 €
 * est retirée. Aucun texte visible (pages, composants, FAQ, llms.txt, prompts
 * qui produisent du texte public) ne doit plus la mentionner.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { PremiumCta } from "@/components/home/premium-cta";
import { faqs, getPremiumFaqs } from "@/lib/faqs";
import { getLlmsFaqFull, getLlmsTarifs, LLMS_FAQ_SHORT, LLMS_FULL_INTRO } from "@/lib/llms-content";

jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }),
}));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));
jest.mock("@/stores/user-store", () => ({
  useUserStore: (sel: (s: { user: null }) => unknown) => sel({ user: null }),
}));

/** « 99 € » sous toutes ses graphies (espace, insécable, entité), hors 1,99 / 0,99 / 16,99. */
const PRIX_COACHING = /(^|[^0-9,])99(\s|&nbsp;)*(€|&euro;)/;
const MOTS_COACHING = /coaching individuel|calendly|réserver un appel|\/\s*séance/i;

const SRC = path.join(__dirname, "..", "..");

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "__tests__" ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

/** Lignes de code hors commentaires (les commentaires ne sont jamais affichés). */
function codeLines(file: string): string[] {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => !/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line));
}

describe("Coaching à 99 € retiré (s20)", () => {
  it("le bloc Premium de l'accueil ne propose plus de coaching", () => {
    const { container } = render(<PremiumCta />);
    expect(screen.queryByText(/coaching/i)).toBeNull();
    expect(container.querySelector('a[href*="calendly"]')).toBeNull();
    expect(container.textContent ?? "").not.toMatch(PRIX_COACHING);
  });

  it("FAQ et llms.txt ne citent plus le coaching", () => {
    const textes = [
      ...faqs.flatMap((f) => [f.question, f.answer]),
      ...getPremiumFaqs(true).flatMap((f) => [f.question, f.answer]),
      ...getLlmsTarifs(false),
      ...getLlmsTarifs(true),
      ...getLlmsFaqFull(true).flatMap((f) => [f.question, f.answer]),
      ...LLMS_FAQ_SHORT.flatMap((f) => [f.question, f.answer]),
      LLMS_FULL_INTRO,
    ].join("\n");
    expect(textes).not.toMatch(/coaching/i);
    expect(textes).not.toMatch(PRIX_COACHING);
  });

  it("aucune chaîne de src/ ne mentionne l'offre coaching ni un prix à 99 €", () => {
    const fautes = sourceFiles(SRC).flatMap((file) =>
      codeLines(file)
        .filter((line) => PRIX_COACHING.test(line) || MOTS_COACHING.test(line))
        .map((line) => `${path.relative(SRC, file)} : ${line.trim()}`),
    );
    expect(fautes).toEqual([]);
  });
});
