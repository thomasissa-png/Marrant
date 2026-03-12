import { render, screen } from "@testing-library/react";
import { FaqSection } from "@/components/home/faq-section";

describe("FaqSection", () => {
  beforeEach(() => {
    render(<FaqSection />);
  });

  it("renders the FAQ heading", () => {
    expect(screen.getByText("Questions fréquentes")).toBeInTheDocument();
  });

  it("renders all 4 FAQ questions", () => {
    const summaries = document.querySelectorAll("summary");
    expect(summaries).toHaveLength(4);
    const texts = Array.from(summaries).map((s) => s.textContent);
    expect(texts.some((t) => t?.includes("apprendre à être drôle"))).toBe(true);
    expect(texts.some((t) => t?.includes("frais cachés"))).toBe(true);
    expect(texts.some((t) => t?.includes("YouTube"))).toBe(true);
    expect(texts.some((t) => t?.includes("timide"))).toBe(true);
  });

  it("renders FAQ answers mentioning XP and streaks", () => {
    expect(screen.getByText(/50 XP par semaine/)).toBeInTheDocument();
    expect(screen.getByText(/streaks/)).toBeInTheDocument();
  });

  it("mentions trust reassurances in answers", () => {
    expect(screen.getByText(/annules en 1 clic/)).toBeInTheDocument();
    expect(screen.getByText(/sans carte bancaire/)).toBeInTheDocument();
  });

  it("renders details elements for each FAQ", () => {
    const details = document.querySelectorAll("details");
    expect(details).toHaveLength(4);
  });
});
