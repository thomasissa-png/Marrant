/**
 * Phase 5.D — Groupe 6 : CeoFunnel composant
 */
import { render, screen } from "@testing-library/react";
import { CeoFunnel } from "@/components/admin/ceo/CeoFunnel";
import type { CeoFunnelDto, CeoKpiSnapshotDto } from "@/components/admin/ceo/types";

const baseFunnel: CeoFunnelDto = {
  sent: 100,
  opens: 40,
  replies: 8,
  clicks: 15,
  siteVisits: 25,
  conversions: 3,
  openRate: 0.4,
  replyRate: 0.08,
  clickRate: 0.15,
  visitRate: 0.25,
  conversionRate: 0.03,
};

const snapshot: CeoKpiSnapshotDto = {
  id: "kpi-1",
  date: "2026-05-07T00:00:00.000Z",
  northStarEngagement30d: 0.4,
  emailReplyRate: 0.08,
  siteReturn48h: 0.25,
  emailOpenRate: 0.4,
  killSwitchTriggers24h: 0,
  directorFailRate: 0.02,
  draftsAutoSendRatio: { EMAIL: 0.7 },
  costPerAcquiredSubscriber: 12.5,
  ceoAttributedConversions: 3,
  backlinksDaSum: 250,
  createdAt: "2026-05-07T00:00:00.000Z",
};

describe("CeoFunnel", () => {
  it("affiche les 6 étapes avec leurs labels", () => {
    render(<CeoFunnel funnel={baseFunnel} snapshot={null} />);
    expect(screen.getByText("Messages envoyés")).toBeInTheDocument();
    expect(screen.getByText("Ouvertures")).toBeInTheDocument();
    expect(screen.getByText("Réponses")).toBeInTheDocument();
    expect(screen.getByText("Clics ressource")).toBeInTheDocument();
    expect(screen.getByText("Retours sur le site (48h)")).toBeInTheDocument();
    expect(screen.getByText("Conversions Premium")).toBeInTheDocument();
  });

  it("affiche les valeurs absolues formatées en fr-FR", () => {
    render(<CeoFunnel funnel={baseFunnel} snapshot={null} />);
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("affiche les taux en pourcentage avec 1 décimale", () => {
    render(<CeoFunnel funnel={baseFunnel} snapshot={null} />);
    expect(screen.getByText("40.0 %")).toBeInTheDocument();
    expect(screen.getByText("8.0 %")).toBeInTheDocument();
    expect(screen.getByText("15.0 %")).toBeInTheDocument();
    expect(screen.getByText("3.0 %")).toBeInTheDocument();
  });

  it("affiche le snapshot date si fourni", () => {
    render(<CeoFunnel funnel={baseFunnel} snapshot={snapshot} />);
    expect(screen.getByText(/Snapshot du/i)).toBeInTheDocument();
  });

  it("masque la pastille snapshot si snapshot=null", () => {
    render(<CeoFunnel funnel={baseFunnel} snapshot={null} />);
    expect(screen.queryByText(/Snapshot du/i)).not.toBeInTheDocument();
  });

  it("affiche le warning 'Aucun message envoyé' si sent=0", () => {
    const empty: CeoFunnelDto = { ...baseFunnel, sent: 0, opens: 0, replies: 0, clicks: 0, siteVisits: 0, conversions: 0 };
    render(<CeoFunnel funnel={empty} snapshot={null} />);
    expect(screen.getByText(/Aucun message envoyé/i)).toBeInTheDocument();
  });

  it("masque le warning si sent > 0", () => {
    render(<CeoFunnel funnel={baseFunnel} snapshot={null} />);
    expect(screen.queryByText(/Aucun message envoyé/i)).not.toBeInTheDocument();
  });

  it("numérote les étapes (1/6 .. 6/6)", () => {
    render(<CeoFunnel funnel={baseFunnel} snapshot={null} />);
    expect(screen.getByText(/Étape 1\/6/)).toBeInTheDocument();
    expect(screen.getByText(/Étape 6\/6/)).toBeInTheDocument();
  });
});
