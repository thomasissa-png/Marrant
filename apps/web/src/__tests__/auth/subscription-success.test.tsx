import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next-auth
const mockUpdate = jest.fn().mockResolvedValue(null);
jest.mock("next-auth/react", () => ({
  useSession: () => ({ update: mockUpdate }),
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams("session_id=cs_test_123");
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

import SubscriptionSuccessPage from "@/app/(dashboard)/abonnement/success/page";

describe("SubscriptionSuccessPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders loading state initially", () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ plan: "FREE" }) });
    render(<SubscriptionSuccessPage />);
    expect(screen.getByText("Paiement reçu !")).toBeInTheDocument();
    expect(screen.getByText("Activation de ton abonnement en cours...")).toBeInTheDocument();
  });

  it("redirects to /vannes when status returns PREMIUM (webhook already processed)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "PREMIUM" }),
    });

    render(<SubscriptionSuccessPage />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/vannes?upgrade=success");
    });
  });

  it("calls verify-session when status returns FREE (webhook not yet processed)", async () => {
    // First call: /api/stripe/status returns FREE
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "FREE" }),
    });
    // Second call: /api/stripe/verify-session returns PREMIUM
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "PREMIUM", activated: true }),
    });

    render(<SubscriptionSuccessPage />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/stripe/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: "cs_test_123" }),
      });
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/vannes?upgrade=success");
    });
  });

  it("shows error state after MAX_ATTEMPTS with retry button", async () => {
    // All calls return FREE
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ plan: "FREE" }),
    });

    render(<SubscriptionSuccessPage />);

    // Advance through all 16 attempts (0 to 15)
    for (let i = 0; i <= 15; i++) {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }

    await waitFor(() => {
      expect(screen.getByText(/prend plus de temps que prévu/)).toBeInTheDocument();
      expect(screen.getByText("Réessayer")).toBeInTheDocument();
      expect(screen.getByText("Continuer vers le site")).toBeInTheDocument();
    });
  });

  it("retry button resets attempts and tries again", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ plan: "FREE" }),
    });

    render(<SubscriptionSuccessPage />);

    // Reach error state
    for (let i = 0; i <= 15; i++) {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }

    await waitFor(() => {
      expect(screen.getByText("Réessayer")).toBeInTheDocument();
    });

    // Now mock a successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "PREMIUM" }),
    });

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await user.click(screen.getByText("Réessayer"));

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/vannes?upgrade=success");
    });
  });

  it("'Continuer vers le site' navigates to /vannes", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ plan: "FREE" }),
    });

    render(<SubscriptionSuccessPage />);

    for (let i = 0; i <= 15; i++) {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await user.click(screen.getByText("Continuer vers le site"));
    expect(mockPush).toHaveBeenCalledWith("/vannes");
  });

  it("handles network errors gracefully and retries", async () => {
    // First status call: network error
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    // First verify call: also fails
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    // Second status call: returns PREMIUM
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "PREMIUM" }),
    });

    render(<SubscriptionSuccessPage />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Second attempt
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/vannes?upgrade=success");
    });
  });
});
