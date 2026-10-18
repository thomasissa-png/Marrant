/**
 * s21, E5 (/glossaire) et E6 (/a-propos) après la concision v5 (textes-v5-c §8) : rendus mot pour
 * mot depuis la source unique, pour un visiteur et un compte sans abonnement. Petit lien vers
 * l'étape 1 avec sa propre source de mesure ; anciens libellés disparus de src/.
 */
import fs from "fs";
import path from "path";
import { render, screen, within } from "@testing-library/react";
import GlossairePage from "@/app/(dashboard)/glossaire/page";
import AProposPage from "@/app/(dashboard)/a-propos/page";
import { AuthCta } from "@/components/auth/auth-cta";
import { LIEN_L2 } from "@/components/ui/liens";
import { normalizeParcoursSrc } from "@/lib/parcours-tracking";
import { NBSP } from "@/lib/fr-typo";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-est-premium", () => ({ useEstPremium: jest.fn() }));
const { useSession } = require("next-auth/react");
const { useEstPremium } = require("@/hooks/use-est-premium");

const SRC = path.join(__dirname, "..", "..");
// Rendu : espaces insécables (frTypo) ramenées à des espaces, gluons retirés.
const INVISIBLES = new RegExp(`[${NBSP}${String.fromCharCode(0x202f)}]`, "g");
const GLUON = new RegExp(String.fromCharCode(0x2060), "g");
const norm = (s: string | null | undefined) => (s ?? "").replace(INVISIBLES, " ").replace(GLUON, "");

/** Copie mot pour mot de `docs/copy/cta-s21/concision/textes-v5-c.md` §8. */
const REASS = "Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.";
const ATTENDU = {
  e5: {
    titre: "Le vocabulaire, c'est fait. Reste à s'en servir.",
    paragraphe: "Placer un callback au dîner de samedi, c'est autre chose : ça se travaille.",
    bouton: "Ouvrir les 5 parcours · 2,99 €/mois",
    ligne: REASS,
    lien: "Tester l'étape 1 de Répartie, gratuite",
  },
  e6: {
    titre: ["Tu parles et personne rit.", "On va arranger ça."].join(""),
    paragraphe: "Observer d'abord, roder ensuite : voilà le programme.",
    preuve: "Déjà 1 500+ inscrits.",
    bouton: "Ouvrir les 5 parcours · 2,99 €/mois",
  },
};

function bloc(testId: string) {
  const el = screen.getByTestId(testId);
  const ps = Array.from(el.querySelectorAll("p")).map((p) => norm(p.textContent));
  const liens = within(el).getAllByRole("link");
  return { titre: ps[0], paragraphe: ps[1], ligne: ps.find((t) => t.startsWith("Premium :")), tout: norm(el.textContent), bouton: liens[0], lien: liens[1] };
}

describe("source : sections E5 et E6", () => {
  it("textes non vides, sans tiret cadratin", () => {
    for (const t of [...Object.values(ATTENDU.e5), ...Object.values(ATTENDU.e6)]) {
      expect(t.length).toBeGreaterThan(5);
      expect(t).not.toContain("—");
    }
  });
});

describe.each([
  ["visiteur", "unauthenticated"],
  ["compte sans abonnement", "authenticated"],
] as const)("E5 /glossaire, %s", (_nom, status) => {
  beforeEach(() => {
    useSession.mockReturnValue({ status });
    useEstPremium.mockReturnValue(false);
  });

  it("titre, paragraphe, bouton, REASS et petit lien mot pour mot", () => {
    render(<GlossairePage />);
    const b = bloc("glossaire-fin");
    expect(b.titre).toBe(ATTENDU.e5.titre);
    expect(b.paragraphe).toBe(ATTENDU.e5.paragraphe);
    expect(norm(b.bouton.textContent)).toBe(ATTENDU.e5.bouton);
    expect(b.bouton.getAttribute("href")).toMatch(/^\/abonnement\?(.*&)?src=glossaire(&|$)/);
    expect(b.ligne).toBe(ATTENDU.e5.ligne);
    expect(norm(b.lien.textContent)).toBe(ATTENDU.e5.lien);
    expect(b.lien).toHaveAttribute("href", "/parcours/repartie?src=glossaire-etape1#etape-1");
    expect(b.lien).toHaveClass(...LIEN_L2.split(" "));
    expect(b.tout).toBe(`${ATTENDU.e5.titre}${ATTENDU.e5.paragraphe}${ATTENDU.e5.bouton}${REASS}${ATTENDU.e5.lien}`);
  });
});

describe("E6 /a-propos", () => {
  beforeEach(() => useEstPremium.mockReturnValue(false));

  it("visiteur : titre, phrase, preuve, bouton vers l'inscription (src=a-propos), REASS, lien", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AProposPage />);
    const b = bloc("a-propos-fin");
    expect(b.titre).toBe(ATTENDU.e6.titre);
    expect(b.paragraphe).toBe(ATTENDU.e6.paragraphe);
    expect(norm(screen.getByTestId("a-propos-fin-preuve").textContent)).toBe(ATTENDU.e6.preuve);
    expect(norm(b.bouton.textContent)).toBe(ATTENDU.e6.bouton);
    expect(b.bouton.getAttribute("href")).toMatch(/^\/register\?.*src=a-propos/);
    expect(b.ligne).toBe(REASS);
    expect(norm(b.lien.textContent)).toBe(ATTENDU.e5.lien);
    expect(b.lien).toHaveAttribute("href", "/parcours/repartie?src=a-propos-etape1#etape-1");
    expect(b.lien).toHaveClass(...LIEN_L2.split(" "));
    expect(b.tout).toBe(`${ATTENDU.e6.titre}${ATTENDU.e6.paragraphe}${ATTENDU.e6.preuve}${ATTENDU.e6.bouton}${REASS}${ATTENDU.e5.lien}`);
  });

  it("compte sans abonnement : preuve retirée, bouton vers /abonnement?src=a-propos", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AProposPage />);
    const b = bloc("a-propos-fin");
    expect(b.paragraphe).toBe(ATTENDU.e6.paragraphe);
    expect(screen.queryByTestId("a-propos-fin-preuve")).toBeNull();
    expect(b.tout).not.toContain("inscrits");
    expect(b.bouton).toHaveAttribute("href", "/abonnement?src=a-propos");
    expect(b.lien).toHaveAttribute("href", "/parcours/repartie?src=a-propos-etape1#etape-1");
  });

  it("corps de page : « …et des exercices à mettre en pratique. », sans « 1 500+ membres »", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AProposPage />);
    expect(norm(document.body.textContent)).toContain("et des exercices à mettre en pratique.");
    expect(norm(document.body.textContent)).not.toContain("membres mettent en pratique");
  });
});

describe("sources et libellés", () => {
  it("glossaire-etape1 et a-propos-etape1 : sources connues de parcours-ouvert", () => {
    expect(normalizeParcoursSrc("glossaire-etape1")).toBe("glossaire-etape1");
    expect(normalizeParcoursSrc("a-propos-etape1")).toBe("a-propos-etape1");
  });

  it("AuthCta : libellé par défaut aligné sur E6", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AuthCta />);
    expect(norm(screen.getByRole("link").textContent)).toBe(ATTENDU.e6.bouton);
  });

  it("plus aucun « Commencer à 2,99 » ni « Accéder aux parcours complets » dans src/ (hors tests)", () => {
    const trouves: string[] = [];
    const parcourir = (dossier: string) => {
      for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
        const chemin = path.join(dossier, e.name);
        if (e.isDirectory()) {
          if (e.name !== "__tests__") parcourir(chemin);
        } else if (/\.(tsx?|md|json)$/.test(e.name)) {
          const t = fs.readFileSync(chemin, "utf8");
          if (/Commencer à (2,99|\{PREMIUM_PRICE_LABEL\}|\$\{PREMIUM_PRICE_LABEL\})|Accéder aux parcours complets/.test(t)) {
            trouves.push(path.relative(SRC, chemin));
          }
        }
      }
    };
    parcourir(SRC);
    expect(trouves).toEqual([]);
  });
});
