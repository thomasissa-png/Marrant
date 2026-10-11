/**
 * s19 (rendu itération 5, arbitrages du 11/10 par délégation de Thomas) : typographie française
 * étendue à Machine à Café, Répartie et Confiance (H @design, S17 @ux). Seuls des espaces
 * insécables et des gluons invisibles sont posés : une fois retirés, le texte rendu est
 * exactement le texte stocké (aucun texte de contenu ne change).
 */
import { render, screen } from "@testing-library/react";
import conseils from "../../../../../docs/content/conseils-seed.json";
import { ParcoursStepCard, type ParcoursStepCardProps } from "@/components/parcours/parcours-step-card";
import { LockedStepPreview } from "@/components/parcours/step-blocks";
import type { Step } from "@/components/parcours/parcours-types";

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

const NBSP = String.fromCharCode(0xa0);
const GLUON = String.fromCharCode(0x2060);
const plain = (t: string | null) => (t ?? "").replaceAll(NBSP, " ").replaceAll(GLUON, "");

type Conseil = { id: number | string; example?: string; exercise?: string };
const conseil = (id: number) => (conseils as Conseil[]).find((c) => String(c.id) === String(id)) as Conseil;
// Textes cités par @design (R-1) et @ux (S17), tels que stockés.
const EXEMPLE_MAC = conseil(63).example ?? "";
const DEFI_CONFIANCE = conseil(2).exercise ?? "";

function step(over: Partial<Step["tip"]> = {}, extra: Partial<Step> = {}): Step {
  return {
    id: "s2",
    order: 2,
    dayNumber: 14,
    tip: { id: "t2", title: "Conseil", content: "Contenu", category: "GENERAL", difficulty: "DEBUTANT", ...over } as Step["tip"],
    moduleTitle: "Module",
    moduleXp: 50,
    quiz: [],
    videos: [],
    ...extra,
  };
}

function carte(slug: string, s: Step) {
  const props: ParcoursStepCardProps = {
    step: s,
    slug,
    isPremium: true,
    isCompleted: false,
    isExpanded: true,
    isSequentiallyLocked: false,
    isPremiumLocked: false,
    previousOrder: null,
    isQuizDone: false,
    isSeedFallback: false,
    completing: false,
    abonnementHref: "/abonnement",
    loadFailed: false,
    onRetryLoad: jest.fn(),
    onToggle: jest.fn(),
    onQuizComplete: jest.fn(),
    onComplete: jest.fn(),
  };
  return render(<ParcoursStepCard {...props} />);
}

describe("H / S17 : typographie française sur les 3 anciens parcours", () => {
  it("textes cités présents dans le seed (sinon le test ne prouve rien)", () => {
    expect(EXEMPLE_MAC).toContain("tu ne dis rien : tu laisses");
    expect(EXEMPLE_MAC).toContain("très calme : « Ils ont validé ? »");
    expect(DEFI_CONFIANCE).toContain("puis réécris-le en fait raconté");
  });

  it("Machine à Café : jamais de « : » en tête de ligne (espace insécable avant)", () => {
    const { container } = carte("machine-a-cafe", step({ example: EXEMPLE_MAC }));
    const rendu = container.textContent ?? "";
    expect(rendu).toContain(`tu ne dis rien${NBSP}: tu laisses`);
    expect(rendu).toContain(`très calme${NBSP}: «${NBSP}Ils ont validé${NBSP}?${NBSP}»`);
    expect(plain(rendu)).toContain(EXEMPLE_MAC);
  });

  it("Confiance : « réécris-le » ne se coupe plus après le trait d'union", () => {
    const { container } = carte("confiance", step({ exercise: DEFI_CONFIANCE }));
    const rendu = container.textContent ?? "";
    expect(rendu).toContain(`réécris-${GLUON}le`);
    expect(rendu).toContain(`Écris-${GLUON}le d'abord`);
    expect(screen.getByText("DÉFI FAIT DIVERS").tagName).toBe("STRONG");
    expect(plain(rendu)).toContain(DEFI_CONFIANCE);
  });

  it.each(["machine-a-cafe", "repartie", "confiance"])(
    "%s : « Pourquoi cette étape ? » et « Ce que tu vas apprendre » protégés aussi, texte intact",
    (slug) => {
      const why = "Ici, tu observes : rien d'autre. Dis-le-moi en 2 minutes.";
      const moduleDetail = "À 9 h 50, choisis-en une : la plus courte.";
      const { container } = carte(slug, step({}, { why, moduleDetail }));
      const rendu = container.textContent ?? "";
      expect(rendu).toContain(`observes${NBSP}:`);
      expect(rendu).toContain(`Dis-${GLUON}le-${GLUON}moi`);
      expect(rendu).toContain(`9${NBSP}h${NBSP}50`);
      expect(rendu).toContain(`choisis-${GLUON}en`);
      expect(plain(rendu)).toContain(why);
      expect(plain(rendu)).toContain(moduleDetail);
      // Toujours ni repli ni lien « Aller au défi » hors Boulot.
      expect(screen.queryByTestId("version-sans-risque")).toBeNull();
    },
  );

  it.each(["machine-a-cafe", "repartie", "confiance"])("%s : aperçu verrouillé protégé, texte intact", (slug) => {
    const moduleDetail = "Le silence : ton meilleur allié. Choisis-en un.";
    const { container } = render(<LockedStepPreview step={step({}, { moduleDetail })} slug={slug} />);
    expect(container.textContent).toContain(`silence${NBSP}:`);
    expect(container.textContent).toContain(`Choisis-${GLUON}en`);
    expect(plain(container.textContent)).toContain(moduleDetail);
  });
});
