/**
 * s21, blocs d'appel partie A (B4 + B5) : carte Premium fusionnée de l'accueil.
 * - « Tu crois avoir tout essayé » (HomeCta) n'existe plus ;
 * - [S12] sans « Droit de rétractation » ni « sans engagement », annuel seulement s'il existe ;
 * - plein vers /abonnement?src=accueil-premium, contour vers l'étape 1 de Répartie.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { PremiumCta } from "@/components/home/premium-cta";
import { CARTE_PREMIUM, libelleOuvrirAccueil, libelleOuvrirParcours, noteAccueilHaut } from "@/config/textes/cta-articles-accueil";
import { PARCOURS_COUNT } from "@/config/premium";
import { normalise } from "../helpers/texte-normalise";

jest.mock("next-auth/react", () => ({ useSession: () => ({ data: null, status: "unauthenticated" }) }));
jest.mock("@/stores/user-store", () => ({ useUserStore: () => null }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/premium/premium-benefits", () => ({ PremiumBenefits: () => <ul data-testid="avantages" /> }));

describe("carte Premium de l'accueil (B4 + B5)", () => {
  it("titre et [S11] du tour 16 : paragraphe, intro + liste <ul> des parcours publiés, paragraphe", () => {
    render(<PremiumCta />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(normalise(CARTE_PREMIUM.titre));
    const intro = screen.getByTestId("carte-premium-intro");
    const blocs = intro.querySelectorAll(":scope > p, :scope > div > p");
    expect(blocs).toHaveLength(3);
    expect(blocs[0]).toHaveTextContent("La table qui rit, et c'est ta réplique qui l'a lancée.");
    expect(normalise(blocs[1].textContent ?? "")).toBe(`Un seul prix ouvre les ${PARCOURS_COUNT} parcours, et l'étape 1 de chacun se lit gratuitement :`);
    const items = Array.from(intro.querySelectorAll("ul > li")).map((li) => normalise(li.textContent ?? ""));
    expect(items).toEqual([
      "Répartie pour répondre quand on te chambre",
      "Machine à Café pour faire rire à la pause sans forcer",
      "Boulot pour le lundi à 9 h sans le ton de compte rendu",
      "Confiance pour retrouver ta légèreté",
      "Storytelling pour que ta chute arrive avant le dessert",
    ].slice(0, PARCOURS_COUNT));
    expect(normalise(blocs[2].textContent ?? "")).toBe("Une fois abonné, tout est ouvert d'un coup : 15 à 20 minutes par étape, avec un défi à tenter, dans la vie ou à l'écrit.");
    expect(normalise(document.body.textContent ?? "")).not.toMatch(/Droit de rétractation|sans engagement|Pour t'y mettre/i);
    expect(screen.queryByRole("link", { name: /rétractation/i })).toBeNull();
  });

  it("[S12] : « Prix TTC » seul, puis avec l'annuel quand il est configuré", () => {
    const { unmount } = render(<PremiumCta />);
    expect(screen.getByText("Prix TTC.")).toBeInTheDocument();
    expect(normalise(document.body.textContent ?? "")).not.toContain("24,99");
    unmount();
    render(<PremiumCta annuelDisponible />);
    expect(screen.getByText(normalise(CARTE_PREMIUM.ligneTarif(true)))).toBeInTheDocument();
    expect(normalise(document.body.textContent ?? "")).toContain("Ou 24,99 €/an (2,08 €/mois, 10,89 € économisés). Prix TTC.");
  });

  it("plein Premium puis lien texte étape 1 de Répartie (s21 concision), dans cet ordre, un seul plein", () => {
    const { container } = render(<PremiumCta />);
    const plein = container.querySelector<HTMLAnchorElement>('a[data-accueil-cta="abonnement"]')!;
    const contour = container.querySelector<HTMLAnchorElement>('a[data-accueil-cta="etape-1"]')!;
    expect(plein).toHaveAttribute("href", "/abonnement?src=accueil-premium");
    expect(plein).toHaveTextContent(normalise(CARTE_PREMIUM.bouton));
    expect(contour).toHaveAttribute("href", "/parcours/repartie?src=accueil#etape-1");
    expect(contour).toHaveTextContent(CARTE_PREMIUM.contour);
    // s21 concision (18/10) : le gratuit n'est plus un bouton contour mais un lien texte (L2).
    expect(contour.className).toContain("underline");
    expect(contour.className).not.toMatch(/\bborder\b/);
    expect(plein.compareDocumentPosition(contour) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelectorAll("a.bg-accent-secondary-hover")).toHaveLength(1);
    expect(screen.queryByText("Voir les vannes gratuites")).toBeNull();
    expect(normalise(document.body.textContent ?? "")).toContain("Déjà 1 500+ inscrits, et toi");
  });

  it("le bloc « Tu crois avoir tout essayé » a disparu de l'accueil", () => {
    const page = fs.readFileSync(path.join(__dirname, "..", "..", "app", "(dashboard)", "page.tsx"), "utf8");
    expect(page).not.toContain("HomeCta");
    expect(fs.existsSync(path.join(__dirname, "..", "..", "components", "home", "home-cta.tsx"))).toBe(false);
  });
});

describe("libellés d'ouverture (gabarits du tour 16)", () => {
  it("OUVRIR : nombre de parcours depuis PARCOURS_COUNT, repli « tous les parcours »", () => {
    expect(normalise(libelleOuvrirParcours())).toBe(`Ouvrir les ${PARCOURS_COUNT} parcours · 2,99 €/mois`);
    expect(normalise(libelleOuvrirParcours(1))).toBe("Ouvrir tous les parcours · 2,99 €/mois");
    expect(normalise(libelleOuvrirParcours(0))).toBe("Ouvrir tous les parcours · 2,99 €/mois");
  });

  it("OUVRIR_ACCUEIL : propre à B3, repli sur OUVRIR sous 5 parcours ou sans Répartie / Machine à Café", () => {
    const cinq = ["repartie", "machine-a-cafe", "confiance", "storytelling", "boulot"].map((slug) => ({ slug }));
    expect(normalise(libelleOuvrirAccueil(cinq))).toBe("Ouvrir les 5 parcours, de la coloc à l'afterwork · 2,99 €/mois");
    expect(normalise(libelleOuvrirAccueil(cinq.slice(0, 4)))).toBe("Ouvrir les 4 parcours · 2,99 €/mois");
    expect(normalise(libelleOuvrirAccueil(cinq.filter((p) => p.slug !== "machine-a-cafe").concat({ slug: "autre" })))).toBe(
      "Ouvrir les 5 parcours · 2,99 €/mois",
    );
    expect(normalise(libelleOuvrirAccueil([{ slug: "repartie" }]))).toBe("Ouvrir tous les parcours · 2,99 €/mois");
  });

  it("[S20] de B3 : 200 caractères au plus (tour 17), chiffre et étape citée lus dans la donnée", () => {
    const note = noteAccueilHaut();
    expect(note.length).toBeLessThanOrEqual(200);
    expect(note).toContain("(conseil, défi, 5 vannes, 2 vidéos, quiz)");
    expect(note).toContain("Les 3 suivantes, dont « Retourner les piques avec le sourire », c'est Premium");
  });
});
