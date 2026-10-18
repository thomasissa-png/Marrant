/**
 * s21 concision (choix de Thomas du 18/10) : un seul bouton plein par bloc d'appel.
 * Partout où un bloc montrait un bouton gratuit en contour ET un bouton payant, le gratuit
 * devient un lien texte (style L2 de components/ui/liens.ts). Blocs touchés :
 * - carte Premium de l'accueil (B4 + B5, `PremiumCta`) ;
 * - murs des listes /vannes, /conseils, /videos (B7, `MurListe`) ;
 * - bloc d'exercice des fiches vanne, conseil, vidéo (B8 à B10, `BlocExercice`).
 */
import { render } from "@testing-library/react";
import { LIEN_L2 } from "@/components/ui/liens";
import { PremiumCta } from "@/components/home/premium-cta";
import { MurListe } from "@/components/premium/mur-liste";
import { BlocExercice } from "@/components/premium/bloc-exercice";

jest.mock("next-auth/react", () => ({ useSession: () => ({ data: null, status: "unauthenticated" }) }));
jest.mock("@/stores/user-store", () => ({ useUserStore: () => null }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/hooks/use-content-stats", () => ({ useContentStats: () => ({ jokes: 0, tips: 0, videos: 0 }) }));

/** Un plein = classe de fond du bouton `primary` ; un contour = bordure des variantes outline. */
function hierarchie(bloc: Element) {
  const liens = Array.from(bloc.querySelectorAll("a"));
  return {
    pleins: liens.filter((a) => a.className.includes("bg-accent-secondary-hover")),
    contours: liens.filter((a) => /\bborder\b/.test(a.className)),
  };
}

function attendreLienTexte(lien: Element | null) {
  expect(lien).not.toBeNull();
  expect(lien!.className).toContain(LIEN_L2);
  expect(lien!.className).not.toMatch(/\bborder\b|bg-accent/);
}

describe("un seul bouton plein par bloc, le gratuit en lien texte", () => {
  it("carte Premium de l'accueil", () => {
    const { container } = render(<PremiumCta />);
    const { pleins, contours } = hierarchie(container);
    expect(pleins).toHaveLength(1);
    expect(contours).toHaveLength(0);
    attendreLienTexte(container.querySelector('a[data-accueil-cta="etape-1"]'));
  });

  it.each(["vannes", "conseils", "videos"] as const)("mur /%s", (liste) => {
    const { container } = render(<MurListe liste={liste} annuel={false} />);
    const { pleins, contours } = hierarchie(container);
    expect(pleins).toHaveLength(1);
    expect(contours).toHaveLength(0);
    attendreLienTexte(container.querySelector('a[data-mur-cta="etape-1"]'));
  });

  it.each(["vanne", "conseil", "video"] as const)("bloc d'exercice de la fiche %s", (type) => {
    const { container } = render(
      <BlocExercice type={type} returnTo={`/x/${type}`} parcours="confiance" annuel={false} exercice="Consigne" />,
    );
    const { pleins, contours } = hierarchie(container);
    expect(pleins).toHaveLength(1);
    expect(contours).toHaveLength(0);
    attendreLienTexte(container.querySelector('a[data-fiche-cta="etape-1"]'));
  });
});
