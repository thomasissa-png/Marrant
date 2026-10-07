/**
 * s16 lot F (corrections finales) :
 * 1. /reset-password sans jeton : un H1 ;
 * 2. liens dans le texte soulignés en permanence (axe link-in-text-block) ;
 * 3. accueil : carrousel « Ton contenu du jour » focusable et nommé, même vide ;
 * 5. /abonnement pour une résiliation programmée : message + lien /profil, aucun paiement.
 * (Le point 4, compte Google sans fuite, est couvert par authorize-s16 et login-s16.)
 */
import fs from "node:fs";
import path from "node:path";
import { render, screen, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/app/(auth)/reset-password/page";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";
import { DailyContent } from "@/components/home/daily-content";
import { lireResiliationProgrammee } from "@/hooks/use-resiliation-programmee";

const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  usePathname: () => "/",
}));
jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({ useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }) }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));

const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };

function reponse(status: number, body: unknown) {
  return { ok: status < 400, status, json: async () => body };
}

afterEach(() => {
  jest.clearAllMocks();
  mockSearchParams.delete("token");
  mockSearchParams.delete("email");
});

describe("1. /reset-password : un H1 dans toutes les branches", () => {
  it.each([[""], ["token=faux"], ["token=faux&email=a%40b.fr"]])("?%s : un seul H1", (query) => {
    new URLSearchParams(query).forEach((v, k) => mockSearchParams.set(k, v));
    render(<ResetPasswordPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Nouveau mot de passe");
  });
});

describe("2. liens dans le texte soulignés en permanence", () => {
  const FICHIERS = [
    "app/(dashboard)/vannes/page.tsx",
    "app/(dashboard)/conseils/page.tsx",
    "app/(dashboard)/videos/page.tsx",
    "app/(dashboard)/page.tsx",
    "components/parcours/parcours-detail.tsx",
    "components/parcours/parcours-list.tsx",
    "components/ui/markdown-renderer.tsx",
  ];
  it.each(FICHIERS)("%s : aucun lien text-accent-link en ligne sans soulignement", (fichier) => {
    const source = fs.readFileSync(path.join(__dirname, "../../", fichier), "utf8");
    const classes = [...source.matchAll(/<(?:Link|a)\b[^>]*?class(?:Name)?="([^"]*text-accent-link[^"]*)"/g)].map((m) => m[1].split(/\s+/));
    expect(classes.length).toBeGreaterThan(0);
    for (const c of classes) {
      const horsTexte = c.some((x) => /^(inline-flex|inline-block|block|flex|line-clamp-\d)$/.test(x));
      if (!horsTexte) expect(c).toContain("underline");
    }
  });
});

describe("3. accueil : contenu du jour vide (/api/daily en échec)", () => {
  it("zone défilante focusable et nommée par son titre", async () => {
    global.fetch = jest.fn().mockResolvedValue(reponse(500, {})) as unknown as typeof fetch;
    render(<DailyContent />);
    const zone = await screen.findByRole("region", { name: "Ton contenu du jour" });
    expect(zone).toHaveAttribute("tabindex", "0");
  });
});

describe("5. /abonnement : résiliation programmée", () => {
  const FIN = "2099-11-12T10:00:00.000Z";

  it("message avec la date, lien /profil, aucun bouton ni appel de paiement", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    const fetchMock = jest.fn().mockResolvedValue(reponse(200, { plan: "PREMIUM", cancelAtPeriodEnd: true, currentPeriodEnd: FIN }));
    global.fetch = fetchMock as unknown as typeof fetch;
    render(<AbonnementPage />);
    const notice = await screen.findByTestId("resiliation-programmee");
    expect(notice).toHaveTextContent("Ton Premium court jusqu'au 12 novembre 2099. Pour le garder, réactive-le depuis ton profil.");
    expect(screen.getByRole("link", { name: "Aller à mon profil" })).toHaveAttribute("href", "/profil");
    expect(screen.queryByText(/Active mon accès/)).toBeNull();
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(["/api/stripe/status"]);
    expect(notice.textContent).not.toContain("—");
  });

  it("abonné sans résiliation, ou visiteur : offre habituelle", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    global.fetch = jest.fn().mockResolvedValue(reponse(200, { plan: "PREMIUM", cancelAtPeriodEnd: false, currentPeriodEnd: FIN })) as unknown as typeof fetch;
    render(<AbonnementPage />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeInTheDocument();
    expect(screen.queryByTestId("resiliation-programmee")).toBeNull();
  });

  it("lireResiliationProgrammee : fin passée, FREE ou date absente", () => {
    const maintenant = Date.parse("2026-10-07T12:00:00Z");
    expect(lireResiliationProgrammee({ plan: "PREMIUM", cancelAtPeriodEnd: true, currentPeriodEnd: FIN }, maintenant)).toEqual({ finIso: FIN });
    expect(lireResiliationProgrammee({ plan: "PREMIUM", cancelAtPeriodEnd: true, currentPeriodEnd: "2026-10-01T00:00:00Z" }, maintenant)).toBeNull();
    expect(lireResiliationProgrammee({ plan: "FREE", cancelAtPeriodEnd: true, currentPeriodEnd: FIN }, maintenant)).toBeNull();
    expect(lireResiliationProgrammee({ plan: "PREMIUM", cancelAtPeriodEnd: true, currentPeriodEnd: null }, maintenant)).toEqual({ finIso: null });
  });

  it("date inconnue : fin de la période déjà payée", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    global.fetch = jest.fn().mockResolvedValue(reponse(200, { plan: "PREMIUM", cancelAtPeriodEnd: true, currentPeriodEnd: null })) as unknown as typeof fetch;
    render(<AbonnementPage />);
    expect(await screen.findByTestId("resiliation-programmee")).toHaveTextContent(
      "Ton Premium court jusqu'à la fin de la période déjà payée. Pour le garder, réactive-le depuis ton profil.",
    );
  });
});
