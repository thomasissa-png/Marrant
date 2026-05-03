/**
 * Tests OnboardingFlow — flow 5 écrans, persona detection, push opt-in.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OnboardingFlow } from "@/components/mobile/OnboardingFlow";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock("@/lib/api-base", () => ({
  api: jest.fn(() => Promise.resolve({ ok: true })),
  isMobileNative: () => false,
}));

describe("OnboardingFlow", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("affiche l'écran Welcome en premier", () => {
    const onComplete = jest.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    expect(screen.getByText(/Tu vas devenir le pote drôle/i)).toBeInTheDocument();
    expect(screen.getByText("On y va")).toBeInTheDocument();
  });

  it("passe à l'écran 2 quand on clique sur On y va", () => {
    const onComplete = jest.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    fireEvent.click(screen.getByText("On y va"));
    expect(screen.getByText(/T'as quel âge en gros/i)).toBeInTheDocument();
  });

  it("détecte persona YANIS pour age u22 + goal repartie", async () => {
    const onComplete = jest.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    fireEvent.click(screen.getByText("On y va"));
    fireEvent.click(screen.getByText(/Moins de 22 ans/));
    fireEvent.click(screen.getByText(/Pour avoir de la répartie/));
    fireEvent.click(screen.getByText(/Voir mon profil/));

    await waitFor(() => {
      expect(window.localStorage.getItem("detectedPersona")).toBe("YANIS");
    });
    expect(screen.getByText(/Yo, on va te faire briller/i)).toBeInTheDocument();
  });

  it("détecte persona SOPHIE pour age 22-30 + goal convers", async () => {
    const onComplete = jest.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    fireEvent.click(screen.getByText("On y va"));
    fireEvent.click(screen.getByText(/Entre 22 et 30 ans/));
    fireEvent.click(screen.getByText(/alimenter mes conversations/));
    fireEvent.click(screen.getByText(/Voir mon profil/));

    await waitFor(() => {
      expect(window.localStorage.getItem("detectedPersona")).toBe("SOPHIE");
    });
    expect(screen.getByText(/machine à café d'anecdotes/i)).toBeInTheDocument();
  });

  it("détecte persona MARC pour age 30plus + goal reprise", async () => {
    const onComplete = jest.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    fireEvent.click(screen.getByText("On y va"));
    fireEvent.click(screen.getByText(/Plus de 30 ans/));
    fireEvent.click(screen.getByText(/reprendre confiance/));
    fireEvent.click(screen.getByText(/Voir mon profil/));

    await waitFor(() => {
      expect(window.localStorage.getItem("detectedPersona")).toBe("MARC");
    });
    expect(screen.getByText(/retrouver ta légèreté/i)).toBeInTheDocument();
  });

  it("propose Plus tard sur l'écran push", async () => {
    const onComplete = jest.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    fireEvent.click(screen.getByText("On y va"));
    fireEvent.click(screen.getByText(/Moins de 22 ans/));
    fireEvent.click(screen.getByText(/Pour avoir de la répartie/));
    fireEvent.click(screen.getByText(/Voir mon profil/));

    await waitFor(() => {
      expect(screen.getByText(/Plus tard/)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Plus tard/));
    expect(screen.getByText(/Première vanne offerte/i)).toBeInTheDocument();
  });

  it("affiche le CTA login soft en écran 5", async () => {
    const onComplete = jest.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    fireEvent.click(screen.getByText("On y va"));
    fireEvent.click(screen.getByText(/Moins de 22 ans/));
    fireEvent.click(screen.getByText(/Pour avoir de la répartie/));
    fireEvent.click(screen.getByText(/Voir mon profil/));
    fireEvent.click(await screen.findByText(/Plus tard/));
    fireEvent.click(await screen.findByText("Découvrir"));

    expect(await screen.findByText(/Garde tes favoris/i)).toBeInTheDocument();
    expect(screen.getByText(/Créer mon compte/)).toBeInTheDocument();
    expect(screen.getByText(/Plus tard, laisse-moi explorer/)).toBeInTheDocument();
  });
});
