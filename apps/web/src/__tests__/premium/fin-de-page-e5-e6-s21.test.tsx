/**
 * s21, E5 (/glossaire) et E6 (/a-propos) : textes validés à l'aveugle le 18/10 (tour 7),
 * rendus mot pour mot depuis la source unique, pour un visiteur et un compte sans abonnement.
 * Petit lien vers l'étape 1 avec sa propre source de mesure ; ancien libellé disparu de src/.
 */
import fs from "fs";
import path from "path";
import { render, screen, within } from "@testing-library/react";
import GlossairePage from "@/app/(dashboard)/glossaire/page";
import AProposPage from "@/app/(dashboard)/a-propos/page";
import { AuthCta } from "@/components/auth/auth-cta";
import { LIEN_L2 } from "@/components/ui/liens";
import { PREMIUM_PARCOURS } from "@/config/premium";
import { repartieStorytellingVrai } from "@/config/textes/cta-pages";
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

/**
 * Copie mot pour mot de `docs/copy/cta-s21/complements/textes-valides-boutons.md`, sections E5
 * et E6 (commit 7e5957e de la branche de session, document absent de cette branche).
 */
const ATTENDU = {
  e5: {
    titre: "Le vocabulaire, c'est fait. Reste à s'en servir.",
    paragraphe:
      "Tu sais ce qu'est un callback. Le placer au dîner de samedi, c'est autre chose : faire rire à table, ça s'entraîne. C'est à ça que servent les 5 parcours, de la répartie au storytelling, 15 à 20 minutes par semaine. Chaque étape : un conseil, un défi, 5 vannes, 2 vidéos, un quiz. La première étape de chaque parcours se lit sans compte, pour juger sur pièce, et le reste s'ouvre d'un coup quand tu t'abonnes.",
    bouton: "Ouvrir les 5 parcours · 2,99 €/mois",
    ligne: "Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux.",
    lien: "Lis d'abord une étape, elle est offerte",
  },
  e6: {
    titre: ["Tu parles et personne rit.", "On va arranger ça."].join(""),
    paragraphe:
      "Observer, s'entraîner, roder : c'est le programme des 5 parcours, de la répartie au storytelling, 15 à 20 minutes par semaine. Chaque étape : un conseil, un défi, 5 vannes, 2 vidéos, un quiz. La première étape de chaque parcours se lit sans compte, pour juger sur pièce, et le reste s'ouvre d'un coup quand tu t'abonnes. Déjà 1 500+ inscrits, et toi ?",
    bouton: "Ouvrir les 5 parcours · 2,99 €/mois",
  },
};
const DERNIERE_PHRASE_E6 = "Déjà 1 500+ inscrits, et toi ?";

function bloc(testId: string) {
  const el = screen.getByTestId(testId);
  const [titre, paragraphe, ligne] = Array.from(el.querySelectorAll("p")).map((p) => norm(p.textContent));
  const liens = within(el).getAllByRole("link");
  return { titre, paragraphe, ligne, bouton: liens[0], lien: liens[1] };
}

describe("source : sections E5 et E6", () => {
  it("textes non vides, sans tiret cadratin", () => {
    for (const t of [...Object.values(ATTENDU.e5), ...Object.values(ATTENDU.e6)]) {
      expect(t.length).toBeGreaterThan(5);
      expect(t).not.toContain("—");
    }
    expect(ATTENDU.e6.paragraphe.endsWith(DERNIERE_PHRASE_E6)).toBe(true);
  });

  it("« de la répartie au storytelling » : les deux parcours sont publiés", () => {
    expect(PREMIUM_PARCOURS.map((p) => p.slug)).toEqual(expect.arrayContaining(["repartie", "storytelling"]));
    expect(repartieStorytellingVrai()).toBe(true);
    expect(repartieStorytellingVrai([{ slug: "repartie" }])).toBe(false);
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

  it("titre, paragraphe, bouton, ligne discrète et petit lien mot pour mot", () => {
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
  });
});

describe("E6 /a-propos", () => {
  beforeEach(() => useEstPremium.mockReturnValue(false));

  it("visiteur : paragraphe complet, bouton vers l'inscription (src=a-propos)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AProposPage />);
    const b = bloc("a-propos-fin");
    expect(b.titre).toBe(ATTENDU.e6.titre);
    expect(b.paragraphe).toBe(ATTENDU.e6.paragraphe);
    expect(norm(b.bouton.textContent)).toBe(ATTENDU.e6.bouton);
    expect(b.bouton.getAttribute("href")).toMatch(/^\/register\?.*src=a-propos/);
    expect(b.ligne).toBe(ATTENDU.e5.ligne);
    expect(norm(b.lien.textContent)).toBe(ATTENDU.e5.lien);
    expect(b.lien).toHaveAttribute("href", "/parcours/repartie?src=a-propos-etape1#etape-1");
    expect(b.lien).toHaveClass(...LIEN_L2.split(" "));
  });

  it("compte sans abonnement : dernière phrase retirée, bouton vers /abonnement?src=a-propos", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AProposPage />);
    const b = bloc("a-propos-fin");
    expect(b.paragraphe).toBe(ATTENDU.e6.paragraphe.slice(0, -DERNIERE_PHRASE_E6.length - 1));
    expect(b.paragraphe).not.toContain("inscrits");
    expect(b.bouton).toHaveAttribute("href", "/abonnement?src=a-propos");
    expect(b.lien).toHaveAttribute("href", "/parcours/repartie?src=a-propos-etape1#etape-1");
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
