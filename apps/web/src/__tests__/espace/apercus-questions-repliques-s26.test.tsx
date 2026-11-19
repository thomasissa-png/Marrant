/**
 * @jest-environment node
 */
/**
 * s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §1.1, §2.1, critère 2) : les aperçus de « Mes questions » et
 * « Mes répliques » passent au modèle VERROUILLÉ. Verrouillage RÉEL : aucune question, réponse ni réplique d'abonné dans
 * le HTML serveur de la page entière (`renderToString`), ni dans AUCUNE prop de l'arbre rendu (sur-ensemble du payload
 * RSC). Les lectures de l'abonné (`listerFils`, `listerRepliques`) renvoient ici des données piégées : elles ne doivent
 * même pas être appelées. Interrupteur SIMULÉ ouvert ; le code livré reste fermé (`inertie-espace.test.tsx`).
 */
import { isValidElement } from "react";
import { renderToString } from "react-dom/server";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return true;
  },
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  },
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("next/headers", () => ({ headers: () => ({ get: () => null }), cookies: () => ({ get: () => undefined }) }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })), lireAccesEspace: jest.fn() }));
const lecteur = jest.fn();
jest.mock("@/components/espace/apercu/acces", () => ({
  ...jest.requireActual("@/components/espace/apercu/acces"),
  lireLecteurApercu: () => lecteur(),
}));
const QUESTION = "Ma voisine Ginette PIEGE-QUESTION me chambre";
const REPONSE = "Réponds-lui PIEGE-REPONSE avec le sourire";
const REPLIQUE = "Ma réplique PIEGE-REPLIQUE à moi";
const listerFils = jest.fn(async () => [
  {
    id: "f1",
    type: "SITUATION",
    statut: "REPONDU",
    creeLe: "2026-11-01T10:00:00Z",
    dernierMessageLe: "2026-11-02T10:00:00Z",
    enRetard: false,
    nonLu: true,
    messages: [
      { auteur: "ABONNE", corps: QUESTION, creeLe: "2026-11-01T10:00:00Z" },
      { auteur: "EQUIPE", corps: REPONSE, creeLe: "2026-11-02T10:00:00Z" },
    ],
  },
]);
const listerRepliques = jest.fn(async () => [{ ficheId: "coloc-la-poele", texte: REPLIQUE, titre: "La poêle", href: "/x", modifieLe: "2026-11-01T10:00:00Z" }]);
jest.mock("@/lib/espace/questions", () => ({ listerFils: () => listerFils() }));
jest.mock("@/lib/espace/repliques", () => ({ listerRepliques: () => listerRepliques() }));

import MesQuestionsPage from "@/app/(dashboard)/mon-espace/questions/page";
import MesRepliquesPage from "@/app/(dashboard)/mon-espace/repliques/page";
import { TEXTES_APERCU_VERROUILLE } from "@/config/textes/espace-apercu";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";
import { ficheApercu } from "@/components/espace/apercu/exemples";

/** Texte nu : entités ramenées, balises retirées, sans espaces ni ponctuation typographique (`frEspace`). */
const nu = (html: string) =>
  html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .normalize("NFC")
    .replace(/<[^>]*>/g, "")
    .replace(/[\s  ⁠'’«»"“”]/g, "");

/** Props de tout l'arbre, composants serveur dépliés ; un composant client (hooks) garde ses props et ses enfants. */
function propsDeLArbre(n: unknown, sortie: string[] = []): string[] {
  if (n == null || typeof n === "boolean") return sortie;
  if (Array.isArray(n)) {
    for (const x of n) propsDeLArbre(x, sortie);
    return sortie;
  }
  if (typeof n === "string" || typeof n === "number") {
    sortie.push(String(n));
    return sortie;
  }
  if (!isValidElement(n)) return sortie;
  const { children, ...props } = n.props as Record<string, unknown>;
  sortie.push(JSON.stringify(props));
  if (typeof n.type === "function") {
    const espion = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      return propsDeLArbre((n.type as (p: unknown) => unknown)(n.props), sortie);
    } catch {
      // composant client : props relevées, on suit ses enfants
    } finally {
      espion.mockRestore();
    }
  }
  return propsDeLArbre(children, sortie);
}

const PIEGES = ["PIEGE-QUESTION", "PIEGE-REPONSE", "PIEGE-REPLIQUE", "Ginette"];
const LECTEURS = [["visiteur"], ["gratuit"]] as const;

beforeEach(() => {
  listerFils.mockClear();
  listerRepliques.mockClear();
});

describe("Mes questions : verrouillage réel", () => {
  it.each(LECTEURS)("%s : aperçu verrouillé, aucune lecture des fils, ni HTML ni props d'abonné ; l'état « Mes envois » en clair", async (qui) => {
    lecteur.mockResolvedValue(qui);
    const arbre = await MesQuestionsPage();
    const brut = renderToString(arbre);
    const html = nu(brut);
    const props = nu(propsDeLArbre(arbre).join("\n"));
    expect(listerFils).not.toHaveBeenCalled();
    for (const p of PIEGES) {
      expect(html).not.toContain(nu(p));
      expect(props).not.toContain(nu(p));
    }
    expect(brut).toContain("data-apercu-verrouille");
    expect(brut).toContain('data-apercu="mesQuestions"');
    expect(html).toContain(nu(TEXTES_APERCU_VERROUILLE.promesseQuestions));
    expect(html).toContain(nu(TEXTES_QUESTIONS.envois.titre));
    for (const t of ["QUESTION", "PROBLEME", "SITUATION"] as const) expect(html).toContain(nu(TEXTES_QUESTIONS.types[t].exemple));
    expect(props).toContain(nu(TEXTES_QUESTIONS.envois.titre));
  });
});

describe("Mes répliques : verrouillage réel", () => {
  const fiche = ficheApercu("mesRepliques");
  const INTERDITS = fiche.type === "situation" ? Object.values(fiche.contenu.repliques).map((r) => r.texte) : [];

  it.each(LECTEURS)("%s : aperçu verrouillé, aucune lecture des répliques, ni HTML ni props ; consigne et champ en clair", async (qui) => {
    lecteur.mockResolvedValue(qui);
    const arbre = await MesRepliquesPage();
    const brut = renderToString(arbre);
    const html = nu(brut);
    const props = nu(propsDeLArbre(arbre).join("\n"));
    expect(listerRepliques).not.toHaveBeenCalled();
    for (const p of [...PIEGES, ...INTERDITS]) {
      expect(html).not.toContain(nu(p));
      expect(props).not.toContain(nu(p));
    }
    expect(brut).toContain('data-apercu="mesRepliques"');
    expect(html).toContain(nu(TEXTES_APERCU_VERROUILLE.promesseRepliques));
    expect(html).toContain(nu(fiche.titre));
    expect(html).toContain(nu(TEXTES_GESTE.note.label));
    if (fiche.geste) expect(html).toContain(nu(fiche.geste.consigne));
    // Le champ est dessiné, sans élément de formulaire : rien de focusable dans l'extrait.
    expect(brut).not.toMatch(/<(textarea|input|select)\b/);
    expect(props).toContain(nu(fiche.titre));
  });
});

describe("abonné : les lectures reprennent", () => {
  it("Mes questions lit les fils et rend la tuile de la réponse non lue (seul aplat)", async () => {
    lecteur.mockResolvedValue(null);
    const brut = renderToString(await MesQuestionsPage());
    expect(listerFils).toHaveBeenCalledTimes(1);
    expect(brut).toContain("data-reponse-non-lue");
    expect(nu(brut)).toContain(nu(REPONSE));
  });
});
