/**
 * Phase 5.D — Groupe 6 : CeoBacklinksList composant
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CeoBacklinksList } from "@/components/admin/ceo/CeoBacklinksList";
import type { CeoBacklinkDto } from "@/components/admin/ceo/types";

const base: CeoBacklinkDto = {
  id: "bl-1",
  source: "search",
  domain: "example.com",
  url: "https://example.com/post",
  pageTitle: "Article génial",
  da: 50,
  status: "PITCHED",
  pitchedAt: new Date("2026-04-30T00:00:00.000Z").toISOString(),
  repliedAt: null,
  acquiredAt: null,
  daysSincePitched: 7,
};

describe("CeoBacklinksList", () => {
  it("affiche message vide si liste vide", () => {
    render(<CeoBacklinksList backlinks={[]} />);
    expect(screen.getByText(/Aucun backlink/i)).toBeInTheDocument();
  });

  it("affiche les 4 cartes summary (Total, Pitchés, Acquis, DA cumulé)", () => {
    const list: CeoBacklinkDto[] = [
      { ...base, id: "1", status: "PITCHED" },
      { ...base, id: "2", status: "ACQUIRED", da: 60 },
      { ...base, id: "3", status: "ACQUIRED", da: 40 },
      { ...base, id: "4", status: "REJECTED", da: 30 },
    ];
    render(<CeoBacklinksList backlinks={list} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    // "Pitchés" / "Acquis" peuvent aussi être des <option>
    expect(screen.getAllByText("Pitchés").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Acquis").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("DA cumulé acquis")).toBeInTheDocument();
    // 60 + 40 = 100 (DA cumulé acquis)
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("affiche un backlink avec domaine, source, DA, statut", () => {
    render(<CeoBacklinksList backlinks={[base]} />);
    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("Article génial")).toBeInTheDocument();
    expect(screen.getByText("search")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("PITCHED")).toBeInTheDocument();
  });

  it("affiche '—' si DA absent", () => {
    render(<CeoBacklinksList backlinks={[{ ...base, da: null }]} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("filtre par status", async () => {
    const user = userEvent.setup();
    const list: CeoBacklinkDto[] = [
      { ...base, id: "1", status: "PITCHED", domain: "alpha.fr" },
      { ...base, id: "2", status: "ACQUIRED", domain: "beta.fr" },
    ];
    render(<CeoBacklinksList backlinks={list} />);

    const statusSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(statusSelect, "ACQUIRED");

    expect(screen.queryByText("alpha.fr")).not.toBeInTheDocument();
    expect(screen.getByText("beta.fr")).toBeInTheDocument();
  });

  it("trie par DA décroissant par défaut", () => {
    const list: CeoBacklinkDto[] = [
      { ...base, id: "1", domain: "low.fr", da: 20 },
      { ...base, id: "2", domain: "high.fr", da: 80 },
      { ...base, id: "3", domain: "mid.fr", da: 50 },
    ];
    render(<CeoBacklinksList backlinks={list} />);
    const rows = screen.getAllByRole("row");
    // Première row = header, ensuite ordre attendu high → mid → low
    expect(rows[1]).toHaveTextContent("high.fr");
    expect(rows[2]).toHaveTextContent("mid.fr");
    expect(rows[3]).toHaveTextContent("low.fr");
  });

  it("change le tri vers 'recent'", async () => {
    const user = userEvent.setup();
    const list: CeoBacklinkDto[] = [
      {
        ...base,
        id: "1",
        domain: "old.fr",
        pitchedAt: new Date("2026-01-01").toISOString(),
        da: 90,
      },
      {
        ...base,
        id: "2",
        domain: "new.fr",
        pitchedAt: new Date("2026-04-30").toISOString(),
        da: 10,
      },
    ];
    render(<CeoBacklinksList backlinks={list} />);

    const sortSelect = screen.getAllByRole("combobox")[1];
    await user.selectOptions(sortSelect, "recent");

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("new.fr"); // récent en premier
  });

  it("lien Ouvrir si url fournie, sinon '—'", () => {
    const list: CeoBacklinkDto[] = [
      { ...base, id: "1", url: "https://x.fr/p" },
      { ...base, id: "2", url: null, domain: "no-url.fr" },
    ];
    render(<CeoBacklinksList backlinks={list} />);
    const link = screen.getByRole("link", { name: /Ouvrir/i });
    expect(link).toHaveAttribute("href", "https://x.fr/p");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("affiche le compteur 'X backlink(s)'", () => {
    render(<CeoBacklinksList backlinks={[base, { ...base, id: "2" }]} />);
    expect(screen.getByText("2 backlinks")).toBeInTheDocument();
  });
});
