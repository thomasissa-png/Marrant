/**
 * s24 mesure (lot 0, §5.2 du brief espace client) côté navigateur : un contenu réservé compte
 * quand il est RÉELLEMENT à l'écran (au moins à moitié visible pendant 1 s), jamais au chargement.
 * - `signalerAcces` : un seul envoi par signal, `keepalive`, aucune attente ;
 * - bloc exercice d'une fiche : abonné seulement, après 1 s de visibilité ; HTML inchangé ;
 * - listes : premier élément de rang supérieur à la limite gratuite (page 1), premier élément de
 *   la page (page 2 et suivantes) ; rien si la page s'arrête à la limite ; rien pour un non-abonné.
 * IntersectionObserver simulé (jsdom n'en a pas).
 */
import { act, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { BlocExercice } from "@/components/premium/bloc-exercice";
import { useListeAuDelaVue } from "@/hooks/use-vu-mesure";
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
    signalerAcces({ type: "liste", liste: "vannes" });
    signalerAcces({ type: "liste", liste: "vannes" });
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

function Grille({ page, taille, nb, limite }: { page: number; taille: number; nb: number; limite: number }) {
  const grille = useRef<HTMLDivElement>(null);
  useListeAuDelaVue({ liste: "vannes", grille, page, taille, nb, limite, pret: true, cle: "" });
  return (
    <div ref={grille} role="tabpanel">
      {Array.from({ length: nb }, (_, i) => (
        <div key={i} data-rang={(page - 1) * taille + i + 1} />
      ))}
    </div>
  );
}

describe("listes : élément au-delà de la limite gratuite", () => {
  it("page 1 de 12, limite 10 : la 11e carte est observée ; vue 1 s = un signal", () => {
    abonne();
    render(<Grille page={1} taille={12} nb={12} limite={10} />);
    expect(observes.map((o) => o.element.getAttribute("data-rang"))).toEqual(["11"]);
    voir(observes[0].element, 1);
    act(() => jest.advanceTimersByTime(1_000));
    expect(envoisMesure()).toEqual([{ type: "liste", liste: "vannes" }]);
  });

  it("page 2 : la première carte de la page", () => {
    abonne();
    render(<Grille page={2} taille={10} nb={10} limite={3} />);
    expect(observes.map((o) => o.element.getAttribute("data-rang"))).toEqual(["11"]);
  });

  it("page qui s'arrête à la limite (10 sur 10) : rien d'observé", () => {
    abonne();
    render(<Grille page={1} taille={12} nb={10} limite={10} />);
    expect(observes).toHaveLength(0);
  });

  it("non-abonné : rien d'observé, aucun signal", () => {
    render(<Grille page={2} taille={12} nb={12} limite={10} />);
    expect(observes).toHaveLength(0);
    act(() => jest.advanceTimersByTime(5_000));
    expect(envoisMesure()).toEqual([]);
  });
});
