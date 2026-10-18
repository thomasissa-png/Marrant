/**
 * Blocs d'appel s21, partie B (B7 à B17) : textes branchés depuis
 * config/textes/cta-pages.ts (source unique), nombres lus à la source,
 * hiérarchie des boutons (un plein, un contour, le reste en lien).
 */
import { render, screen } from "@testing-library/react";
import { MurListe, MurListeLimite } from "@/components/premium/mur-liste";
import {
  contourEtape1,
  lignePrixGarantie,
  MUR_LISTE,
  MUR_PARCOURS,
  type ListeMur,
} from "@/config/textes/cta-pages";
import { FREE_JOKE_LIMIT, FREE_TIP_LIMIT, FREE_VIDEO_LIMIT, PARCOURS_COUNT } from "@/config/premium";

const LISTES: ListeMur[] = ["vannes", "conseils", "videos"];

describe("cta-pages.ts : textes et nombres", () => {
  it("aucun tiret cadratin ni demi-cadratin dans les textes", () => {
    const tout = JSON.stringify(MUR_LISTE);
    expect(tout).not.toMatch(/[—–]/);
  });

  it("limites gratuites et nombre de parcours lus à la source", () => {
    expect(MUR_LISTE.vannes.limite).toContain(`${FREE_JOKE_LIMIT} premières vannes`);
    expect(MUR_LISTE.conseils.limite).toContain(`${FREE_TIP_LIMIT} premiers conseils`);
    expect(MUR_LISTE.videos.limite).toContain(`${FREE_VIDEO_LIMIT} premières vidéos`);
    for (const l of LISTES) expect(MUR_LISTE[l].texte).toContain(`${PARCOURS_COUNT} parcours`);
  });

  it("filtres : catégorie pour /vannes, niveau et catégorie pour /conseils et /videos", () => {
    expect(MUR_LISTE.vannes.filtres).toBe("Le filtre par catégorie est dans Premium.");
    expect(MUR_LISTE.conseils.filtres).toContain("par niveau et par catégorie");
    expect(MUR_LISTE.videos.filtres).toContain("par niveau et par catégorie");
  });

  it("demi-ligne annuelle seulement si l'offre annuelle est disponible", () => {
    expect(lignePrixGarantie(true)).toContain("24,99");
    expect(lignePrixGarantie(true)).toContain("2,08");
    expect(lignePrixGarantie(false)).not.toContain("24,99");
    expect(lignePrixGarantie(false)).not.toContain("si tu vois loin");
    for (const a of [true, false]) {
      expect(lignePrixGarantie(a)).toContain("2,99");
      expect(lignePrixGarantie(a)).toContain("14 jours pour te faire rembourser ton premier paiement");
    }
  });
});

describe("B7 : murs des listes", () => {
  it.each(LISTES)("/%s : un plein vers /abonnement?src=mur-<liste>, un contour vers l'étape 1", (liste) => {
    const { container } = render(<MurListe liste={liste} annuel={false} />);
    const plein = screen.getByRole("link", { name: MUR_LISTE[liste].bouton });
    const href = new URL(plein.getAttribute("href") ?? "", "https://x.fr");
    expect(href.pathname).toBe("/abonnement");
    expect(href.searchParams.get("src")).toBe(`mur-${liste}`);
    expect(href.searchParams.get("returnTo")).toBe(`/${liste}`);
    const contour = screen.getByRole("link", { name: contourEtape1(MUR_PARCOURS) });
    expect(contour.getAttribute("href")).toMatch(new RegExp(`^/parcours/${MUR_PARCOURS}\\?`));
    expect(screen.getByRole("heading", { name: MUR_LISTE[liste].titre })).toBeInTheDocument();
    expect(container.textContent).toContain(lignePrixGarantie(false));
    // Ordre : plein, prix + garantie, puis contour.
    const html = container.innerHTML;
    expect(html.indexOf(MUR_LISTE[liste].bouton)).toBeLessThan(html.indexOf("Résiliable"));
    expect(html.indexOf("Résiliable")).toBeLessThan(html.indexOf(contourEtape1(MUR_PARCOURS)));
  });

  it.each(LISTES)("/%s : annonce de la limite et lien des filtres", (liste) => {
    render(<MurListeLimite liste={liste} />);
    expect(screen.getByText(MUR_LISTE[liste].limite)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: MUR_LISTE[liste].filtres })).toBeInTheDocument();
  });
});
