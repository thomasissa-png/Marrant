import { render, screen, waitFor } from "@testing-library/react";
import { FeatureCards } from "@/components/home/feature-cards";

// Mock useContentStats
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 320, tips: 50, videos: 40 }),
}));

describe("FeatureCards", () => {
  it("renders section title", () => {
    render(<FeatureCards />);
    expect(screen.getByText(/tout ce qu.il te faut pour/i)).toBeInTheDocument();
  });

  it("displays dynamic counts for each content type", () => {
    render(<FeatureCards />);
    expect(screen.getByText(/320\+ vannes/)).toBeInTheDocument();
    expect(screen.getByText(/50\+ techniques/)).toBeInTheDocument();
    expect(screen.getByText(/40\+ vidéos/)).toBeInTheDocument();
  });

  it("renders CTA buttons with correct text", () => {
    render(<FeatureCards />);
    expect(screen.getByText(/voir les vannes/i)).toBeInTheDocument();
    expect(screen.getByText(/découvrir les techniques/i)).toBeInTheDocument();
    expect(screen.getByText(/regarder les vidéos/i)).toBeInTheDocument();
  });

  it("renders links to correct pages", () => {
    render(<FeatureCards />);
    const vannesLink = screen.getByText(/voir les vannes/i).closest("a");
    const conseilsLink = screen.getByText(/découvrir les techniques/i).closest("a");
    const videosLink = screen.getByText(/regarder les vidéos/i).closest("a");

    expect(vannesLink).toHaveAttribute("href", "/vannes");
    expect(conseilsLink).toHaveAttribute("href", "/conseils");
    expect(videosLink).toHaveAttribute("href", "/videos");
  });

  it("renders emojis for each card", () => {
    render(<FeatureCards />);
    expect(screen.getByText("😂")).toBeInTheDocument();
    expect(screen.getByText("💡")).toBeInTheDocument();
    expect(screen.getByText("🎬")).toBeInTheDocument();
  });

  it("renders descriptions for each card", () => {
    render(<FeatureCards />);
    expect(screen.getByText(/école, boulot, couple, soirées/i)).toBeInTheDocument();
    expect(screen.getByText(/timing, auto-dérision, storytelling/i)).toBeInTheDocument();
    expect(screen.getByText(/les meilleurs extraits d.humoristes/i)).toBeInTheDocument();
  });
});
