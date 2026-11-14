/**
 * Espace client, lot D4 (s24) : rendu de « Ton cap », du sommaire d'un parcours, de l'annonce de
 * passage, de la fiche bonus ; interrupteur fermé, rien n'est monté. Plus l'information @legal de la
 * question C9 (G9). Conception : `niveaux-xp-s24.md` 3.0, 5.4 ; maquettes E5 `parcours.html`, `bonus.html`.
 */
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { TonCap } from "@/components/espace/ton-cap";
import { TesBonus } from "@/components/espace/tes-bonus";
import { AnnonceCap } from "@/components/espace/annonce-cap";
import { SommaireParcours } from "@/components/espace/parcours/sommaire-parcours";
import { ParcoursEspace } from "@/components/espace/parcours/parcours-espace";
import { QuestionAise } from "@/components/espace/aujourdhui/question-aise";
import { FicheBonusVue } from "@/components/espace/bonus/fiche-bonus";
import { capDepuisXp } from "@/lib/espace/caps";
import { bonusSchema } from "@/lib/espace/fiches-schema";
import { SERIE } from "@/config/textes/parcours";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import bonusFactice from "@/lib/espace/fixtures/bonus-factice-cap-2.json";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
// Lot D11c : rendu avec la typographie de l'espace (espaces insécables), noms accessibles compris.
import { frEspace } from "@/lib/fr-typo";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };

describe("carte « Ton cap » : XP, cap et série = User et lib/espace/caps sur 5 profils", () => {
  it.each([
    [0, 0, "Tu t’échauffes, cap 1 sur 5", 1],
    [100, 1, "Tu te lances, cap 2 sur 5", 2],
    [412, 3, "Tu avances bien, cap 3 sur 5", 3],
    [700, 12, "Tu enchaînes, cap 4 sur 5", 4],
    [3100, 40, "Tu connais la maison, cap 5 sur 5", 5],
  ])("%i XP, série %i : « %s », %i repères pleins", (xp, serie, lu, pleins) => {
    const { container } = render(<TonCap cap={capDepuisXp(xp)} serie={serie} ecart={false} xp={xp} />);
    expect(screen.getByRole("heading", { level: 2, name: "Ton cap" })).toBeInTheDocument();
    expect(screen.getByText(lu)).toHaveClass("sr-only");
    expect(screen.getByText(serie > 0 ? SERIE.jours(serie) : "Ta série démarre à ta prochaine pratique.")).toBeInTheDocument();
    expect(TEXTES_CAPS.serieZero).toBe("Ta série démarre à ta prochaine pratique.");
    expect(screen.getByText(`${xp} XP gagnés depuis ton arrivée`)).toBeInTheDocument();
    const reperes = screen.getByTestId("reperes-cap");
    expect(reperes).toHaveAttribute("aria-hidden", "true");
    expect(reperes.querySelectorAll('[data-plein="oui"]')).toHaveLength(pleins);
    // 3.6 critère 4 : ni pourcentage, ni « XP restants » ; 3.0 point 6 : aucun mot « étape » dans la carte,
    // état à 0 de la série compris (décision de Thomas du 13/11 : « … à ta prochaine pratique. »).
    expect(container.textContent).not.toMatch(/%|restant/i);
    expect(container.textContent ?? "").not.toMatch(/étape/i);
  });

  it("phrase de l'écart seulement quand le cap affiché dépasse le déblocage", () => {
    const { rerender } = render(<TonCap cap={3} serie={2} ecart={false} />);
    expect(screen.queryByText(/les bonus s'ouvrent avec tes étapes/)).toBeNull();
    rerender(<TonCap cap={3} serie={2} ecart />);
    expect(
      screen.getByText("Ton cap compte tous les points gagnés depuis ton arrivée ; les bonus s'ouvrent avec tes étapes et tes bonus de parcours."),
    ).toBeInTheDocument();
  });

  it("« Tes bonus » n'existe pas sans bonus ouvert, puis mène au dernier bonus", () => {
    const { container, rerender } = render(<TesBonus bonus={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<TesBonus bonus={[{ cap: 2, href: "/mon-espace/bonus/b2" }, { cap: 3, href: "/mon-espace/bonus/b3" }]} />);
    expect(screen.getByRole("link", { name: "Tes bonus" })).toHaveAttribute("href", "/mon-espace/bonus/b3");
  });
});

describe("sommaire d'un parcours (liste numérotée, un bouton par ligne, « Fait » en texte)", () => {
  const etapes = (n: number) => Array.from({ length: n }, (_, i) => ({ order: i + 1, titre: `Titre ${i + 1}` }));

  it.each([3, 4, 6])("parcours à %i étapes, aucune faite : « 0 sur N étapes », « Commencer » puis « Voir »", (n) => {
    render(<SommaireParcours etapes={etapes(n)} faites={[]} onOuvrir={() => undefined} />);
    expect(screen.getByText(`0 sur ${n} étapes`)).toBeInTheDocument();
    const barre = screen.getByRole("progressbar");
    expect(barre).toHaveAttribute("aria-valuenow", "0");
    expect(barre).toHaveAttribute("aria-valuemax", String(n));
    const lignes = screen.getAllByRole("listitem");
    expect(lignes).toHaveLength(n);
    lignes.forEach((l) => expect(within(l).getAllByRole("button")).toHaveLength(1));
    expect(within(lignes[0]).getByRole("button")).toHaveTextContent("Commencer");
    expect(screen.queryByText("Fait")).toBeNull();
  });

  it("parcours à 6 étapes, 2 faites : « Fait » en texte, « Reprendre » sur la 3e, barre à 2", () => {
    const ouvrir = jest.fn();
    render(<SommaireParcours etapes={etapes(6)} faites={[1, 2]} onOuvrir={ouvrir} />);
    expect(screen.getByText("2 sur 6 étapes")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "2 sur 6 étapes");
    expect(screen.getAllByText("Fait")).toHaveLength(2);
    const reprendre = screen.getByRole("button", { name: "Reprendre" });
    expect(reprendre).toHaveAttribute("id", "sommaire-reprendre");
    fireEvent.click(reprendre);
    expect(ouvrir).toHaveBeenCalledWith(3);
    expect(screen.getAllByRole("button", { name: "Voir" })).toHaveLength(5);
  });
});

describe("annonce de passage (critère 17, 3.0 point 3)", () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => new Response("{}", { status: 200 })) as unknown as typeof fetch;
  });

  it("région polie présente dès le chargement, vide sans annonce", () => {
    const { container } = render(<AnnonceCap annonce={null} />);
    const region = container.querySelector('[aria-live="polite"]');
    expect(region).not.toBeNull();
    expect(region).toBeEmptyDOMElement();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("cap et bonus : deux phrases dans la région, « Ouvrir » et « Fermer » hors région ; acquittée une fois ; jamais retirée seule", () => {
    jest.useFakeTimers();
    const retour = document.createElement("button");
    document.body.appendChild(retour);
    const annonce = { cap: 2 as const, bonus: { cap: 2 as const, titre: "Le passage", href: "/mon-espace/bonus/b2" }, marques: [{ type: "CAP" as const, numero: 2 as const }, { type: "BONUS" as const, numero: 2 as const }] };
    const { container, rerender } = render(<AnnonceCap annonce={annonce} retour={() => retour} />);
    const region = container.querySelector('[aria-live="polite"]')!;
    expect(region.textContent).toBe(frEspace("Nouveau cap : Tu te lances. Un bonus s'ouvre dans la Bibliothèque : Le passage."));
    expect(within(region as HTMLElement).queryByRole("link")).toBeNull();
    expect(screen.getByRole("link", { name: frEspace("Ouvrir le bonus : Le passage") })).toHaveAttribute("href", "/mon-espace/bonus/b2");
    act(() => {
      jest.advanceTimersByTime(60_000);
    });
    expect(region.textContent).not.toBe("");
    rerender(<AnnonceCap annonce={{ ...annonce }} retour={() => retour} />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)).toEqual({ annonces: annonce.marques });
    fireEvent.click(screen.getByRole("button", { name: "Fermer l'annonce" }));
    expect(region).toBeEmptyDOMElement();
    expect(document.activeElement).toBe(retour);
    jest.useRealTimers();
  });

  it("cap seul : pas de « Ouvrir »", () => {
    render(<AnnonceCap annonce={{ cap: 3, bonus: null, marques: [{ type: "CAP", numero: 3 }] }} />);
    expect(screen.getByText("Nouveau cap : Tu avances bien.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("interrupteur fermé : rien de l'espace sur /parcours, même pour un abonné", () => {
  it("ParcoursEspace ne rend rien et n'appelle pas l'API", () => {
    global.fetch = jest.fn() as unknown as typeof fetch;
    useSession.mockReturnValue({ data: { user: { id: "u", plan: "PREMIUM" } }, status: "authenticated" });
    const { container } = render(<ParcoursEspace />);
    expect(container).toBeEmptyDOMElement();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe("question C9 : information @legal sous la question (G9)", () => {
  it("phrase mot pour mot, reliée au groupe de réponses", () => {
    render(<QuestionAise />);
    const info = screen.getByText(
      "Ta réponse sert à choisir les situations qu'on te propose. Elle reste sur ton compte, et elle est effacée si tu supprimes ton compte.",
    );
    expect(info.textContent).toBe(TEXTES_AUJOURDHUI.aise.information);
    expect(screen.getByRole("group")).toHaveAttribute("aria-describedby", info.id);
  });
});

describe("fiche bonus (maquette bonus.html)", () => {
  it("marque « Bonus du cap 2 · Tu te lances », durée facultative, sections, grille sans enregistrement", () => {
    const bonus = bonusSchema.parse(bonusFactice);
    render(<FicheBonusVue bonus={bonus} />);
    expect(screen.getByText("Bonus du cap 2 · Tu te lances")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(`Écouter, repérer : ${bonus.titre}`);
    expect(screen.getByText("5 min · Facultatif")).toBeInTheDocument();
    for (const t of ["Le passage", "Trois choses à repérer", "Le mécanisme", "Chez toi", "Les phrases citées, en texte", "Ta grille"]) {
      expect(screen.getByRole("heading", { level: 2, name: t })).toBeInTheDocument();
    }
    const oui = screen.getAllByRole("button", { name: "Oui" })[0];
    fireEvent.click(oui);
    expect(oui).toHaveAttribute("aria-pressed", "true");
    expect(document.body.textContent).not.toMatch(/verrouill|cadenas|débloqu|exclusi|réserv/i);
  });
});

describe("confidentialité, interrupteur fermé : les lignes de l'espace ne sont pas publiées", () => {
  it("aucune ligne de l'espace, phrase de la partie 6 d'aujourd'hui", () => {
    const { container } = render(<ConfidentialitePage />);
    expect(container.querySelectorAll('[data-testid="confidentialite-espace"]')).toHaveLength(0);
    expect(container.textContent).toContain(
      "La date de chaque étape validée et tes retours sur les exercices sont gardés tant que ton compte existe, et effacés avec lui.",
    );
    expect(container.textContent).not.toMatch(/plus à l'aise/);
  });
});
