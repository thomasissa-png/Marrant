/**
 * Blocs d'appel s21, partie B (B7 à B17) : textes branchés depuis
 * config/textes/cta-pages.ts (source unique), nombres lus à la source,
 * hiérarchie des boutons (un plein, un contour, le reste en lien).
 */
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { MurListe, MurListeLimite } from "@/components/premium/mur-liste";
import { BlocExercice } from "@/components/premium/bloc-exercice";
import { parcoursPourFiche } from "@/lib/cta-fiches";
import { validateRegisterFields } from "@/lib/register-validation";
import { ValidationWall } from "@/components/parcours/step-blocks";
import {
  BLOC_EXERCICE,
  FIN_ETAPE_1,
  lignePrixGarantie,
  MUR_LISTE,
  MUR_PARCOURS,
  REGISTER_CTA,
  type FicheType,
  type ListeMur,
} from "@/config/textes/cta-pages";
import { FREE_JOKE_LIMIT, FREE_TIP_LIMIT, FREE_VIDEO_LIMIT, PARCOURS_COUNT } from "@/config/premium";
import { frTypo } from "@/lib/fr-typo";

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
    expect(MUR_LISTE.vannes.filtres).toBe("Tu y trouves aussi le filtre par catégorie, pour aller droit à celles qu'il te faut.");
    expect(MUR_LISTE.conseils.filtres).toContain("par niveau et par catégorie");
    expect(MUR_LISTE.videos.filtres).toContain("par niveau et par catégorie");
  });

  it("demi-ligne annuelle seulement si l'offre annuelle est disponible", () => {
    expect(lignePrixGarantie(true)).toContain("24,99");
    expect(lignePrixGarantie(true)).toContain("2,08");
    expect(lignePrixGarantie(false)).not.toContain("24,99");
    expect(lignePrixGarantie(false)).not.toContain("si tu vois loin");
    expect(lignePrixGarantie(true)).not.toContain("si tu vois loin");
    // LP-A (B7, B14) garde « en ligne » ; LP-A2 (B8 à B10) dit « depuis ton profil ».
    expect(lignePrixGarantie(true)).toContain("Résiliable en ligne quand tu veux.");
    expect(lignePrixGarantie(true, "profil")).toContain("Résiliable depuis ton profil quand tu veux.");
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
    const contour = screen.getByRole("link", { name: frTypo(MUR_LISTE[liste].contour(MUR_PARCOURS)) });
    expect(MUR_LISTE[liste].contour(MUR_PARCOURS)).toMatch(/^Étape 1 de Répartie, gratuite : /);
    expect(contour.getAttribute("href")).toMatch(new RegExp(`^/parcours/${MUR_PARCOURS}\\?`));
    expect(screen.getByRole("heading", { name: frTypo(MUR_LISTE[liste].titre) })).toBeInTheDocument();
    expect(container.textContent).toContain(frTypo(lignePrixGarantie(false)));
    // Ordre : plein, prix + garantie, puis contour.
    const html = container.innerHTML;
    expect(html.indexOf(MUR_LISTE[liste].bouton)).toBeLessThan(html.indexOf("Résiliable"));
    expect(html.indexOf("Résiliable")).toBeLessThan(html.indexOf("Étape"));
  });

  it.each(LISTES)("/%s : annonce de la limite et lien des filtres", (liste) => {
    render(<MurListeLimite liste={liste} />);
    expect(screen.getByText(MUR_LISTE[liste].limite)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: MUR_LISTE[liste].filtres })).toBeInTheDocument();
  });
});

// ─── B8 à B10 : fiches ──────────────────────────────────────────────────────
const nextAuth = { useSession: useSession as unknown as jest.Mock };
jest.mock("next-auth/react", () => ({ useSession: jest.fn(() => ({ status: "unauthenticated", data: null })) }));

describe("B8 à B10 : bloc d'exercice des fiches", () => {
  const TYPES: FicheType[] = ["vanne", "conseil", "video"];

  it.each(TYPES)("%s : un plein Premium (retour fiche), un contour étape 1, « Voir toutes » en lien", (type) => {
    const { container } = render(
      <BlocExercice type={type} returnTo={`/x/${type}`} parcours="confiance" annuel exercice="Consigne" />,
    );
    const t = BLOC_EXERCICE[type];
    expect(screen.getByRole("heading", { name: frTypo(t.titre) })).toBeInTheDocument();
    const plein = screen.getByRole("link", { name: t.bouton });
    const href = new URL(plein.getAttribute("href") ?? "", "https://x.fr");
    expect(href.pathname).toBe("/abonnement");
    expect(href.searchParams.get("returnTo")).toBe(`/x/${type}`);
    expect(href.searchParams.get("src")).toBe(`exercice-${type}`);
    expect(plein.getAttribute("data-fiche-cta")).toBe("premium");
    expect(t.contour("confiance")).toMatch(/^Gratuit : .+, étape 1 de Confiance$/);
    expect(screen.getByRole("link", { name: frTypo(t.contour("confiance")) }).getAttribute("href")).toMatch(
      /^\/parcours\/confiance\?src=fiche/,
    );
    expect(screen.getByRole("link", { name: t.toutVoir }).getAttribute("href")).toBe(t.toutVoirHref);
    expect(container.textContent).toContain(frTypo(lignePrixGarantie(true, "profil")));
    // L'exercice n'est jamais montré à un non-abonné.
    expect(container.textContent).not.toContain("Consigne");
  });

  it("abonné : l'exercice s'affiche, aucun bouton ; sans exercice, rien", () => {
    nextAuth.useSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "PREMIUM" } } });
    const { container, rerender } = render(
      <BlocExercice type="vanne" returnTo="/vannes/a" parcours="repartie" annuel={false} exercice="Consigne" />,
    );
    expect(screen.getByText("Consigne")).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    rerender(<BlocExercice type="conseil" returnTo="/conseils/a" parcours="repartie" annuel={false} />);
    expect(container.innerHTML).toBe("");
    nextAuth.useSession.mockReturnValue({ status: "unauthenticated", data: null });
  });

  it("parcours du contour : étape de la fiche d'abord, puis catégorie, sinon Répartie", () => {
    expect(parcoursPourFiche([{ slug: "confiance", etape: 3 }, { slug: "boulot", etape: 1 }], "COUPLE")).toBe("boulot");
    expect(parcoursPourFiche([], "BOULOT")).toBe("boulot");
    expect(parcoursPourFiche([], "COUPLE")).toBe("repartie");
    expect(parcoursPourFiche([], null)).toBe("repartie");
  });
});

// ─── B14 : fin d'étape 1 ────────────────────────────────────────────────────
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

describe("B14 : fin d'étape 1, carte « Étape 2 » au-dessus de la phrase, un seul plein", () => {
  const etape2 = {
    id: "s2",
    order: 2,
    dayNumber: 8,
    moduleTitle: "Le rythme et les silences",
    moduleDetail: "Certaines phrases ne demandent aucun talent, seulement un bon timing.",
    moduleFormat: "Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz.",
    tip: { id: "t", title: "x", content: "", category: "", difficulty: "", example: "", exercise: "" },
  };

  it("quiz fini : carte, phrase, plein Premium, prix et garantie (sans lettre)", () => {
    const { container } = render(
      <ValidationWall slug="repartie" href="/abonnement?x" etapeSuivante={etape2} annuel={false} />,
    );
    const html = container.innerHTML;
    expect(html.indexOf("Le rythme et les silences")).toBeLessThan(html.indexOf("Bien joué"));
    expect(screen.getByText(FIN_ETAPE_1.carteSurtitre("repartie"))).toBeInTheDocument();
    expect(FIN_ETAPE_1.carteSurtitre("repartie")).toBe("Étape 2 sur 4, 20 minutes");
    expect(screen.getByText(FIN_ETAPE_1.phrase)).toBeInTheDocument();
    expect(FIN_ETAPE_1.phrase).toContain(`les ${PARCOURS_COUNT - 1} autres parcours en entier`);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: FIN_ETAPE_1.bouton })).toHaveAttribute("href", "/abonnement?x");
    expect(container.textContent).toContain(frTypo(lignePrixGarantie(false)));
    expect(container.textContent).not.toMatch(/lettre/i);
  });

  it("format de l'étape : minuscule, « et » avant le dernier élément", () => {
    expect(FIN_ETAPE_1.carteFormat("Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz.")).toBe(
      "Dans l'étape : un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz.",
    );
  });

  it("quiz en cours : contour d'attente, sans carte", () => {
    render(<ValidationWall slug="repartie" href="/abonnement?x" quizPending etapeSuivante={etape2} />);
    expect(screen.queryByText("Le rythme et les silences")).not.toBeInTheDocument();
    expect(screen.queryByText(FIN_ETAPE_1.bouton)).not.toBeInTheDocument();
  });
});

// ─── B17 : /register ────────────────────────────────────────────────────────
describe("B17 : prénom facultatif (validation client)", () => {
  it("vide : aucune erreur ; un seul caractère : erreur", () => {
    expect(validateRegisterFields({ name: "", email: "a@b.fr", password: "12345678" })).toEqual({});
    expect(validateRegisterFields({ name: "A", email: "a@b.fr", password: "12345678" }).name).toBeDefined();
  });

  it("textes validés (tour 16) : bouton, libellé du prénom, lien d'étape gratuite nommé", () => {
    expect(REGISTER_CTA.bouton).toBe("Créer mon compte et passer au paiement");
    expect(REGISTER_CTA.prenomLabel).toBe("Prénom (facultatif, pour te saluer dans nos e-mails)");
    expect(REGISTER_CTA.lienEtape1("confiance")).toBe(
      "Tu préfères lire d'abord ? L'étape 1 du parcours Confiance, gratuite et sans compte",
    );
  });
});
