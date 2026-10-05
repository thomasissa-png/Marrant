/**
 * Retour de Google (s15) : l'événement Umami part une fois, puis le marqueur
 * est retiré de l'URL sans toucher aux autres paramètres.
 */
import { render } from "@testing-library/react";
import { AuthReturnTracker } from "@/components/auth/auth-return-tracker";
import { trackUmamiWhenReady } from "@/lib/umami";

const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  ...jest.requireActual("@/lib/umami"),
  trackUmamiWhenReady: (...args: unknown[]) => mockTrack(...args),
}));

afterEach(() => {
  mockTrack.mockClear();
  window.history.pushState({}, "", "/");
});

describe("AuthReturnTracker", () => {
  it("inscription Google : inscription-reussie avec la source, URL nettoyée", () => {
    window.history.pushState({}, "", "/abonnement?plan=annual&auth=inscription-google&src=abonnement");
    render(<AuthReturnTracker />);
    expect(mockTrack).toHaveBeenCalledWith("inscription-reussie", { methode: "google", src: "abonnement" });
    expect(window.location.pathname + window.location.search).toBe("/abonnement?plan=annual");
  });

  it("connexion Google : connexion-reussie", () => {
    window.history.pushState({}, "", "/vannes?auth=connexion-google");
    render(<AuthReturnTracker />);
    expect(mockTrack).toHaveBeenCalledWith("connexion-reussie", { methode: "google" });
    expect(window.location.search).toBe("");
  });

  it("sans marqueur (ou marqueur inconnu) : rien", () => {
    window.history.pushState({}, "", "/vannes?auth=autre&src=x");
    render(<AuthReturnTracker />);
    expect(mockTrack).not.toHaveBeenCalled();
    expect(window.location.search).toBe("?auth=autre&src=x");
  });
});

describe("trackUmamiWhenReady (réel)", () => {
  afterEach(() => {
    delete (window as unknown as { umami?: unknown }).umami;
    jest.useRealTimers();
  });

  it("attend le chargement du tracker puis envoie l'événement", () => {
    jest.useFakeTimers();
    const track = jest.fn();
    const real = jest.requireActual("@/lib/umami") as { trackUmamiWhenReady: typeof trackUmamiWhenReady };
    real.trackUmamiWhenReady("abonnement-reussi", { formule: "mensuel" });
    expect(track).not.toHaveBeenCalled();
    (window as unknown as { umami: unknown }).umami = { track };
    jest.advanceTimersByTime(300);
    expect(track).toHaveBeenCalledWith("abonnement-reussi", { formule: "mensuel" });
  });

  it("abandonne sans erreur si le tracker ne charge jamais", () => {
    jest.useFakeTimers();
    const real = jest.requireActual("@/lib/umami") as { trackUmamiWhenReady: typeof trackUmamiWhenReady };
    real.trackUmamiWhenReady("abonnement-annule", undefined, 1_000);
    expect(() => jest.advanceTimersByTime(5_000)).not.toThrow();
    expect(jest.getTimerCount()).toBe(0);
  });
});
