import { render, screen } from "@testing-library/react";

jest.mock("@/components/seo/json-ld", () => ({
  JsonLd: ({ data }: { data: Record<string, unknown> }) => (
    <script data-testid="json-ld" type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  ),
  buildFaqJsonLd: (faqs: { question: string; answer: string }[]) => ({
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question })),
  }),
}));

import { FaqSection } from "@/components/home/faq-section";

describe("FaqSection", () => {
  beforeEach(() => {
    render(<FaqSection />);
  });

  it("renders the FAQ heading", () => {
    expect(screen.getByText("Questions fréquentes")).toBeInTheDocument();
  });

  it("renders all 8 FAQ questions", () => {
    const summaries = document.querySelectorAll("summary");
    expect(summaries).toHaveLength(8);
    const texts = Array.from(summaries).map((s) => s.textContent);
    expect(texts.some((t) => t?.includes("apprendre à être drôle"))).toBe(true);
    expect(texts.some((t) => t?.includes("frais cachés"))).toBe(true);
    expect(texts.some((t) => t?.includes("YouTube"))).toBe(true);
    expect(texts.some((t) => t?.includes("timide"))).toBe(true);
    expect(texts.some((t) => t?.includes("répartie exactement"))).toBe(true);
    expect(texts.some((t) => t?.includes("sans être méchant"))).toBe(true);
    expect(texts.some((t) => t?.includes("Combien de temps"))).toBe(true);
    expect(
      texts.some((t) => t?.includes("sens de l\u2019humour"))
    ).toBe(true);
  });

  it("renders FAQ answers mentioning XP and streaks", () => {
    expect(screen.getByText(/50 XP par semaine/)).toBeInTheDocument();
    expect(screen.getByText(/streaks/)).toBeInTheDocument();
  });

  it("mentions trust reassurances in answers", () => {
    expect(screen.getByText(/annules en 1 clic/)).toBeInTheDocument();
    expect(screen.getByText(/Paiement sécurisé par Stripe/)).toBeInTheDocument();
  });

  it("renders details elements for each FAQ", () => {
    const details = document.querySelectorAll("details");
    expect(details).toHaveLength(8);
  });

  it("renders JSON-LD structured data for FAQ", () => {
    const jsonLd = document.querySelector('[data-testid="json-ld"]');
    expect(jsonLd).toBeInTheDocument();
  });
});
