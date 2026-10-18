/**
 * Blocs d'appel s21, parties B et C, après la concision v5 (18/10) : textes branchés depuis
 * config/textes/cta-pages.ts (source unique), nombres lus à la source, hiérarchie des boutons
 * (un plein, la REASS dessous, le gratuit en lien).
 */
import { TEXTES_PRENOM } from "@/config/textes/compte";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";
import { MurListe, MurListeLimite } from "@/components/premium/mur-liste";
import { BlocExercice } from "@/components/premium/bloc-exercice";
import { parcoursPourFiche } from "@/lib/cta-fiches";
import { validateRegisterFields } from "@/lib/register-validation";
import { ValidationWall } from "@/components/parcours/step-blocks";
import {
  BLOC_EXERCICE,
  FIN_ETAPE_1,
  MUR_LISTE,
  MUR_PARCOURS,
  REGISTER_CTA,
  type FicheType,
  type ListeMur,
} from "@/config/textes/cta-pages";
import { REASSURANCE_UNIQUE, VALIDATION_ETAPE } from "@/config/textes/offre";
import { FREE_JOKE_LIMIT, FREE_TIP_LIMIT, FREE_VIDEO_LIMIT } from "@/config/premium";
import { frTypo } from "@/lib/fr-typo";

const LISTES: ListeMur[] = ["vannes", "conseils", "videos"];
const REASS = frTypo(REASSURANCE_UNIQUE);

describe("cta-pages.ts : textes et nombres", () => {
  it("aucun tiret cadratin ni demi-cadratin dans les textes", () => {
    const tout = JSON.stringify([MUR_LISTE, BLOC_EXERCICE, FIN_ETAPE_1]);
    expect(tout).not.toMatch(/[\u2014\u2013]/);
  });

  it("limites gratuites lues à la source", () => {
    expect(MUR_LISTE.vannes.limite).toBe(`Les ${FREE_JOKE_LIMIT} gratuites, c'est fait.`);
    expect(MUR_LISTE.conseils.limite).toBe(`${FREE_TIP_LIMIT} conseils gratuits, c'est fait.`);
    expect(MUR_LISTE.videos.limite).toBe(`${FREE_VIDEO_LIMIT} vidéos gratuites, c'est fait.`);
  });
});

describe("B7 : murs des listes", () => {
  it.each(LISTES)("/%s : un plein vers /abonnement?src=mur-<liste>, la REASS, puis le lien GRATUIT_P", (liste) => {
    const { container } = render(<MurListe liste={liste} />);
    const plein = screen.getByRole("link", { name: MUR_LISTE[liste].bouton });
    const href = new URL(plein.getAttribute("href") ?? "", "https://x.fr");
    expect(href.pathname).toBe("/abonnement");
    expect(href.searchParams.get("src")).toBe(`mur-${liste}`);
    expect(href.searchParams.get("returnTo")).toBe(`/${liste}`);
    const lien = screen.getByRole("link", { name: frTypo(MUR_LISTE[liste].contour(MUR_PARCOURS)) });
    expect(MUR_LISTE[liste].contour(MUR_PARCOURS)).toBe("Tester l'étape 1 de Répartie, gratuite");
    // s21 (QA m5) : source propre au mur, distincte d'un clic de fiche.
    expect(lien.getAttribute("href")).toBe(`/parcours/${MUR_PARCOURS}?src=mur-${liste}#etape-1`);
    expect(screen.getByRole("heading", { name: frTypo(MUR_LISTE[liste].titre) })).toBeInTheDocument();
    expect(container.textContent).toContain(REASS);
    // Ordre : plein, REASS, puis lien gratuit.
    const html = container.innerHTML;
    expect(html.indexOf(MUR_LISTE[liste].bouton)).toBeLessThan(html.indexOf("Résiliable"));
    expect(html.indexOf("Résiliable")).toBeLessThan(html.indexOf("Tester"));
  });

  it.each(LISTES)("/%s : annonce de la limite, sans lien de filtres", (liste) => {
    const { container } = render(<MurListeLimite liste={liste} />);
    expect(container.textContent).toBe(frTypo(MUR_LISTE[liste].limite));
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});

// ─── B8 à B10 : fiches ──────────────────────────────────────────────────────
const nextAuth = { useSession: useSession as unknown as jest.Mock };
jest.mock("next-auth/react", () => ({ useSession: jest.fn(() => ({ status: "unauthenticated", data: null })) }));

describe("B8 à B10 : bloc d'exercice des fiches", () => {
  const TYPES: FicheType[] = ["vanne", "conseil", "video"];

  it.each(TYPES)("%s : titre, phrase, un plein (retour fiche), la REASS, le lien GRATUIT_P ; plus de « Voir d'autres »", (type) => {
    const { container } = render(<BlocExercice type={type} returnTo={`/x/${type}`} parcours="confiance" exercice="Consigne" />);
    const t = BLOC_EXERCICE[type];
    expect(screen.getByRole("heading", { name: frTypo(t.titre) })).toBeInTheDocument();
    const plein = screen.getByRole("link", { name: t.bouton });
    const href = new URL(plein.getAttribute("href") ?? "", "https://x.fr");
    expect(href.pathname).toBe("/abonnement");
    expect(href.searchParams.get("returnTo")).toBe(`/x/${type}`);
    expect(href.searchParams.get("src")).toBe(`exercice-${type}`);
    expect(plein.getAttribute("data-fiche-cta")).toBe("premium");
    expect(t.contour("confiance")).toBe("Tester l'étape 1 de Confiance, gratuite");
    expect(screen.getByRole("link", { name: frTypo(t.contour("confiance")) }).getAttribute("href")).toMatch(
      /^\/parcours\/confiance\?src=fiche/,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(container.textContent).toContain(REASS);
    // L'exercice n'est jamais montré à un non-abonné.
    expect(container.textContent).not.toContain("Consigne");
  });

  it("abonné : l'exercice s'affiche, aucun bouton ; sans exercice, rien", () => {
    nextAuth.useSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "PREMIUM" } } });
    const { container, rerender } = render(<BlocExercice type="vanne" returnTo="/vannes/a" parcours="repartie" exercice="Consigne" />);
    expect(screen.getByText("Consigne")).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    rerender(<BlocExercice type="conseil" returnTo="/conseils/a" parcours="repartie" />);
    expect(container.innerHTML).toBe("");
    nextAuth.useSession.mockReturnValue({ status: "unauthenticated", data: null });
  });

  it("parcours du lien : étape de la fiche d'abord, puis catégorie, sinon Répartie", () => {
    expect(parcoursPourFiche([{ slug: "confiance", etape: 3 }, { slug: "boulot", etape: 1 }], "COUPLE")).toBe("boulot");
    expect(parcoursPourFiche([], "BOULOT")).toBe("boulot");
    expect(parcoursPourFiche([], "COUPLE")).toBe("repartie");
    expect(parcoursPourFiche([], null)).toBe("repartie");
  });
});

// ─── B14 : fin d'étape 1 ────────────────────────────────────────────────────
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

describe("fin d'étape 1 (concision v5) : « Bien joué ! », carte « Étape 2 sur {N} », un plein, REASS, lettre repliée", () => {
  const etape2 = {
    id: "s2",
    order: 2,
    dayNumber: 8,
    moduleTitle: "Le rythme et les silences",
    moduleDetail: "Certaines phrases ne demandent aucun talent, seulement un bon timing.",
    moduleFormat: "Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz.",
    tip: { id: "t", title: "x", content: "", category: "", difficulty: "", example: "", exercise: "" },
  };

  it("quiz fini : titre, carte, phrase, plein, REASS puis la ligne de la lettre (repliée)", () => {
    const { container } = render(<ValidationWall slug="repartie" href="/abonnement?x" etapeSuivante={etape2} />);
    const html = container.innerHTML;
    expect(html.indexOf("Bien joué")).toBeLessThan(html.indexOf("Le rythme et les silences"));
    expect(FIN_ETAPE_1.carteSurtitre("repartie")).toBe("Étape 2 sur 4");
    expect(screen.getByText(FIN_ETAPE_1.carteSurtitre("repartie"))).toBeInTheDocument();
    expect(container.textContent).not.toContain("Dans l'étape :");
    expect(screen.getByText(frTypo(FIN_ETAPE_1.phrase))).toBeInTheDocument();
    const plein = screen.getByRole("link", { name: FIN_ETAPE_1.bouton });
    expect(plein).toHaveAttribute("href", "/abonnement?x");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(container.textContent).toContain(REASS);
    // Lettre : une ligne discrète (bouton replié), aucun champ au chargement.
    const ligne = screen.getByRole("button", { name: /Lettre gratuite\s:\sune vanne décryptée par mois\./ });
    expect(ligne).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector('input[type="email"]')).toBeNull();
    expect(html.indexOf("Résiliable")).toBeLessThan(html.indexOf("Lettre gratuite"));
  });

  it("la ligne de la lettre déplie le champ au clic (focus dans le champ), case et mention avec lui", async () => {
    render(<ValidationWall slug="repartie" href="/abonnement?x" etapeSuivante={etape2} />);
    await userEvent.click(screen.getByRole("button", { name: /Lettre gratuite/ }));
    const champ = screen.getByPlaceholderText("toi@exemple.fr");
    expect(champ).toHaveFocus();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Envoie-moi la lettre" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lettre gratuite/ })).toHaveAttribute("aria-expanded", "true");
  });

  it("quiz en cours : phrase, plein et REASS, sans carte ni lettre", () => {
    const { container } = render(<ValidationWall slug="repartie" href="/abonnement?x" quizPending etapeSuivante={etape2} />);
    expect(screen.queryByText("Le rythme et les silences")).not.toBeInTheDocument();
    expect(screen.getByText(VALIDATION_ETAPE.texte)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: VALIDATION_ETAPE.bouton })).toBeInTheDocument();
    expect(VALIDATION_ETAPE.bouton).toBe(FIN_ETAPE_1.bouton);
    expect(container.textContent).toContain(REASS);
    expect(container.textContent).not.toMatch(/lettre/i);
  });

  it("revue v3 m6 : quiz en cours, même destination que le plein principal (visiteur : /register, src=parcours-etape)", () => {
    const inscription = "/register?callbackUrl=%2Fabonnement%3FreturnTo%3D%252Fparcours%252Frepartie&src=parcours-etape";
    const { unmount } = render(
      <ValidationWall slug="repartie" href="/abonnement?x" finEtape1Href={inscription} quizPending etapeSuivante={etape2} />,
    );
    expect(screen.getByRole("link", { name: VALIDATION_ETAPE.bouton })).toHaveAttribute("href", inscription);
    unmount();
    render(<ValidationWall slug="repartie" href="/abonnement?x" finEtape1Href={inscription} etapeSuivante={etape2} />);
    expect(screen.getByRole("link", { name: FIN_ETAPE_1.bouton })).toHaveAttribute("href", inscription);
  });
});

// ─── B17 : /register ────────────────────────────────────────────────────────
describe("B17 : prénom facultatif (validation client)", () => {
  it("vide : aucune erreur ; un seul caractère : erreur", () => {
    expect(validateRegisterFields({ name: "", email: "a@b.fr", password: "12345678" })).toEqual({});
    expect(validateRegisterFields({ name: "A", email: "a@b.fr", password: "12345678" }).name).toBeDefined();
  });

  it("textes v5 : bouton, libellé du prénom, lien d'étape gratuite GRATUIT_P", () => {
    expect(REGISTER_CTA.bouton).toBe("Créer mon compte et passer au paiement");
    // s21 concision : libellé du prénom déplacé dans /profil (TEXTES_PRENOM), texte inchangé.
    expect(TEXTES_PRENOM.label).toBe("Prénom (facultatif, pour te saluer dans nos e-mails)");
    expect(REGISTER_CTA.lienEtape1("confiance")).toBe("Tester l'étape 1 de Confiance, gratuite");
  });
});
