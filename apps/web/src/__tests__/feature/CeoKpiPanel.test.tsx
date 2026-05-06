import { render, screen } from "@testing-library/react";
import { CeoKpiPanel } from "@/components/admin/ceo/CeoKpiPanel";
import type { CeoKpiSnapshotDto } from "@/components/admin/ceo/types";

const baseSnapshot: CeoKpiSnapshotDto = {
  id: "snap-1",
  date: new Date().toISOString(),
  northStarEngagement30d: 0.32,
  emailReplyRate: 0.1,
  siteReturn48h: 0.18,
  emailOpenRate: 0.45,
  killSwitchTriggers24h: 0,
  directorFailRate: 0.2,
  draftsAutoSendRatio: { email: 0.8, twitter: 0.3 },
  costPerAcquiredSubscriber: 1.5,
  ceoAttributedConversions: 4,
  backlinksDaSum: 120,
  createdAt: new Date().toISOString(),
};

describe("CeoKpiPanel", () => {
  it("affiche un message si pas de snapshot", () => {
    render(<CeoKpiPanel snapshot={null} history={[]} />);
    expect(screen.getByText(/Aucun snapshot KPI/i)).toBeInTheDocument();
  });

  it("affiche la North Star avec le pourcentage formaté", () => {
    render(<CeoKpiPanel snapshot={baseSnapshot} history={[baseSnapshot]} />);
    // 0.32 → 32.0 %
    expect(screen.getByText(/32\.0 %/)).toBeInTheDocument();
    expect(screen.getByText(/North Star/i)).toBeInTheDocument();
  });

  it("affiche les 3 satellites avec leurs cibles", () => {
    render(<CeoKpiPanel snapshot={baseSnapshot} history={[baseSnapshot]} />);
    expect(screen.getByText(/Taux de réponse email/i)).toBeInTheDocument();
    expect(screen.getByText(/Retour site 48h/i)).toBeInTheDocument();
    expect(screen.getByText(/Ouverture emails/i)).toBeInTheDocument();
    expect(screen.getByText(/Cible ≥ 8 %/i)).toBeInTheDocument();
    expect(screen.getByText(/Cible ≥ 15 %/i)).toBeInTheDocument();
    expect(screen.getByText(/Cible ≥ 40 %/i)).toBeInTheDocument();
  });

  it("affiche les 6 KPIs opérationnels", () => {
    render(<CeoKpiPanel snapshot={baseSnapshot} history={[baseSnapshot]} />);
    expect(screen.getByText(/Kill-switch \(24h\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Director fail rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversions attribuées/i)).toBeInTheDocument();
    expect(screen.getByText(/Coût \/ abonné acquis/i)).toBeInTheDocument();
    expect(screen.getByText(/Backlinks DA cumulé/i)).toBeInTheDocument();
    expect(screen.getByText(/Auto-send ratio/i)).toBeInTheDocument();
    // Valeur cumul DA
    expect(screen.getByText("120")).toBeInTheDocument();
    // Conversions
    expect(screen.getByText("4")).toBeInTheDocument();
    // Coût formaté
    expect(screen.getByText(/1\.50 €/)).toBeInTheDocument();
  });

  it("colore en rouge la North Star sous le seuil de 15%", () => {
    const lowSnap = { ...baseSnapshot, northStarEngagement30d: 0.1 };
    const { container } = render(<CeoKpiPanel snapshot={lowSnap} history={[lowSnap]} />);
    const nsValue = container.querySelector(".text-error");
    expect(nsValue).not.toBeNull();
  });
});
