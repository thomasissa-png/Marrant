/**
 * @jest-environment node
 *
 * 08/11 (décision Thomas) : sur /vannes/[slug] (ISR, même page pour tous), « À toi de jouer »
 * (`howToApply`) ne doit plus figurer dans l'arbre rendu par le serveur : tout ce qui est passé
 * à un composant client finit dans le payload RSC public. La page ne garde que l'existence de
 * l'exercice (bloc rendu ou non) et l'id ; l'abonné charge le texte par /api/fiches/exercice.
 */
import type { ReactElement, ReactNode } from "react";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { BlocExercice } from "@/components/premium/bloc-exercice";

const findMany = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { joke: { findMany: (...a: unknown[]) => findMany(...a) } } }));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: <T,>(fn: () => Promise<T>) => fn() }));
jest.mock("@/lib/related-catalogue", () => ({ getRelatedJokes: jest.fn().mockResolvedValue([]) }));
jest.mock("@/lib/content-stats-server", () => ({ getContentStatsCached: jest.fn().mockResolvedValue({ jokes: 10 }) }));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  permanentRedirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

import VannePage from "@/app/(dashboard)/vannes/[slug]/page";

const SECRET = "EXERCICE SECRET DE LA VANNE";
const ID = "cmvanne0811exercice000001";

function vanne(howToApply: string | null) {
  return {
    id: ID,
    isActive: true,
    content: "Mon chat a démissionné",
    punchline: "Il trouvait l’ambiance pesante.",
    category: "ABSURDE",
    type: "ONE_LINER",
    comedyTechnique: "Décalage",
    techniqueExplanation: "On prête au chat une logique de salarié.",
    howToApply,
    updatedAt: new Date("2026-11-01"),
    createdAt: new Date("2026-11-01"),
  };
}

/** Éléments de l'arbre (props comprises), sans rendre les composants. */
function elements(node: ReactNode, acc: ReactElement[] = []): ReactElement[] {
  if (Array.isArray(node)) node.forEach((n) => elements(n, acc));
  else if (node && typeof node === "object" && "props" in node) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    acc.push(el);
    elements(el.props.children, acc);
  }
  return acc;
}

async function rendre(howToApply: string | null) {
  findMany.mockResolvedValue([vanne(howToApply)]);
  const slug = buildJokeSlug(vanne(howToApply));
  return elements(await VannePage({ params: { slug } }));
}

describe("/vannes/[slug] : « À toi de jouer » hors de la page publique (08/11)", () => {
  it("exercice présent : bloc rendu avec l'id seul, le texte n'apparaît nulle part dans l'arbre", async () => {
    const arbre = await rendre(SECRET);
    const blocs = arbre.filter((e) => e.type === BlocExercice);
    expect(blocs).toHaveLength(1);
    expect(blocs[0].props).toEqual({
      type: "vanne",
      returnTo: expect.stringMatching(/^\/vannes\//),
      parcours: expect.any(String),
      ficheId: ID,
    });
    const vus = new WeakSet<object>();
    const props = JSON.stringify(arbre.map((e) => e.props), (_k, v: unknown) => {
      if (v && typeof v === "object") {
        if (vus.has(v)) return undefined;
        vus.add(v);
      }
      return v;
    });
    expect(props).toContain(ID);
    expect(props).not.toContain(SECRET);
    expect(props).not.toContain("SECRET");
  });

  it.each([null, ""])("exercice absent (%p) : aucun bloc, pour personne (comme avant)", async (vide) => {
    const arbre = await rendre(vide);
    expect(arbre.filter((e) => e.type === BlocExercice)).toHaveLength(0);
  });
});
