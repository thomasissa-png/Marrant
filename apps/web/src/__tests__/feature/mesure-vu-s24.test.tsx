/**
 * s24 mesure (lot 0, §5.2 du brief espace client) côté navigateur : un contenu réservé compte
 * quand il est RÉELLEMENT à l'écran (au moins à moitié visible pendant 1 s), jamais au chargement.
 * - `signalerAcces` : un seul envoi par signal, `keepalive`, aucune attente ;
 * - bloc exercice d'une fiche : abonné seulement, après 1 s de visibilité ; HTML inchangé ;
 * - listes vannes, conseils, vidéos : jamais observées (toutes leurs pages sont publiques) ;
 * IntersectionObserver simulé (jsdom n'en a pas).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { act, render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { BlocExercice } from "@/components/premium/bloc-exercice";
import { MESURE_ACCES_API, oublierSignaux, signalerAcces } from "@/lib/mesure/signal-acces";

jest.mock("next-auth/react", () => ({ useSession: jest.fn(() => ({ status: "unauthenticated", data: null })) }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));
const session = useSession as unknown as jest.Mock;

type Rappel = (entrees: Array<Partial<IntersectionObserverEntry>>) => void;
const observes: Array<{ rappel: Rappel; element: Element }> = [];
class FauxObservateur {
  constructor(private rappel: Rappel) {}
  observe(element: Element) {
    observes.push({ rappel: this.rappel, element });
  }
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}
const voir = (element: Element, ratio: number) =>
  act(() => {
    observes
      .filter((o) => o.element === element)
      .forEach((o) => o.rappel([{ isIntersecting: ratio > 0, intersectionRatio: ratio, intersectionRect: { height: 0 } as DOMRectReadOnly }]));
  });

const fetchMock = jest.fn();
const envoisMesure = () => fetchMock.mock.calls.filter(([url]) => url === MESURE_ACCES_API).map(([, init]) => JSON.parse(init.body));

beforeEach(() => {
  jest.useFakeTimers();
  observes.length = 0;
  oublierSignaux();
  fetchMock.mockReset().mockImplementation((url: string) =>
    Promise.resolve(
      url === MESURE_ACCES_API
        ? { ok: true, status: 204 }
        : { ok: true, json: () => Promise.resolve({ exercice: "Exercice du conseil", pointsCles: [] }) },
    ),
  );
  global.fetch = fetchMock as unknown as typeof fetch;
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FauxObservateur;
  session.mockReturnValue({ status: "unauthenticated", data: null });
});
afterEach(() => {
  jest.useRealTimers();
  delete (global as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
});

const abonne = () => session.mockReturnValue({ status: "authenticated", data: { user: { plan: "PREMIUM" } } });

describe("signalerAcces", () => {
  it("un seul envoi par signal et par page, en keepalive", () => {
    signalerAcces({ type: "exercice", fiche: "vanne" });
    signalerAcces({ type: "exercice", fiche: "vanne" });
    signalerAcces({ type: "exercice", fiche: "video" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "POST", keepalive: true, credentials: "same-origin" });
  });
});

describe("bloc exercice d'une fiche", () => {
  async function rendreAbonne() {
    abonne();
    const rendu = render(<BlocExercice type="conseil" returnTo="/conseils/a" parcours="repartie" ficheId="t1" />);
    await act(async () => {
      await Promise.resolve();
    });
    await screen.findByText("Exercice du conseil");
    return rendu;
  }

  it("chargé mais pas encore à l'écran : aucun signal", async () => {
    await rendreAbonne();
    act(() => jest.advanceTimersByTime(5_000));
    expect(envoisMesure()).toEqual([]);
  });

  it("vu moins d'une seconde : aucun signal ; vu 1 s : un signal exercice-conseil", async () => {
    const { container } = await rendreAbonne();
    const bloc = container.querySelector("[data-bloc-exercice]")!;
    voir(bloc, 0.6);
    act(() => jest.advanceTimersByTime(600));
    voir(bloc, 0);
    act(() => jest.advanceTimersByTime(2_000));
    expect(envoisMesure()).toEqual([]);
    voir(bloc, 0.6);
    act(() => jest.advanceTimersByTime(1_000));
    expect(envoisMesure()).toEqual([{ type: "exercice", fiche: "conseil" }]);
  });

  it("le bloc rendu n'a aucun attribut de plus (HTML inchangé)", async () => {
    const { container } = await rendreAbonne();
    const bloc = container.querySelector("[data-bloc-exercice]")!;
    expect(bloc.getAttributeNames().sort()).toEqual(["class", "data-bloc-exercice"]);
  });

  it("non-abonné : bloc d'appel, jamais observé", () => {
    render(<BlocExercice type="conseil" returnTo="/conseils/a" parcours="repartie" ficheId="t1" />);
    expect(observes).toHaveLength(0);
  });
});

describe("listes vannes, conseils, vidéos (pages publiques pour tout visiteur, §5.2)", () => {
  it.each(["vannes/vannes-list.tsx", "conseils/conseils-list.tsx", "videos/videos-grid.tsx"])(
    "%s n'envoie aucun signal de mesure",
    (fichier) => {
      const source = readFileSync(join(__dirname, "../../components", fichier), "utf8");
      expect(source).not.toMatch(/signalerAcces|use-vu-mesure|mesure\/acces/);
    },
  );
});
