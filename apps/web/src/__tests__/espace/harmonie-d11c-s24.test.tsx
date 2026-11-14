/**
 * Lot D11c (revue d'harmonie de la préversion s24) : titre préfixé une seule fois (défaut 2), typographie de
 * l'espace (défauts 7, 8 : espaces insécables seulement, aucune lettre changée), lien « retour » des fiches
 * (défaut 10).
 */
import { render, screen } from "@testing-library/react";
import { FINE, NBSP, frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { titrePrefixe } from "@/lib/espace/lignes-fiches";
import { LienRetour } from "@/components/espace/lien-retour";

jest.mock("@/lib/prisma", () => ({ prisma: {} }));

describe("titrePrefixe (Bibliothèque)", () => {
  it("préfixe un titre propre", () => {
    expect(titrePrefixe("Proverbes", "Formules à détourner")).toBe("Formules à détourner : Proverbes");
  });
  it("ne double jamais un préfixe déjà dans le titre (casse et accents ignorés)", () => {
    expect(titrePrefixe("Vocabulaire : quand on te lance une pique", "Vocabulaire")).toBe("Vocabulaire : quand on te lance une pique");
    expect(titrePrefixe("vocabulaire : les pièces d'une blague", "Vocabulaire")).toBe("vocabulaire : les pièces d'une blague");
    expect(titrePrefixe("Ecouter, repérer : le rire", "Écouter, repérer")).toBe("Ecouter, repérer : le rire");
  });
  it("sans préfixe : le titre tel quel", () => {
    expect(titrePrefixe("Coloc : la poêle")).toBe("Coloc : la poêle");
  });
});

describe("frEspace", () => {
  it("fine insécable avant « ; : ! ? », après « « » et avant « » » ; insécable avant « › » et « → »", () => {
    expect(frEspace("Quelqu'un se tourne vers toi : « Et toi, tu fais quoi ? »")).toBe(
      `Quelqu'un se tourne vers toi${FINE}: «${FINE}Et toi, tu fais quoi${FINE}?${FINE}»`,
    );
    expect(frEspace("Proverbe → détournement ; ensuite !")).toBe(`Proverbe${NBSP}→ détournement${FINE}; ensuite${FINE}!`);
    expect(frEspace("Suite ›")).toBe(`Suite${NBSP}›`);
  });
  it("n'ajoute aucune espace là où il n'y en a pas, ne change aucune lettre, idempotente", () => {
    expect(frEspace("10:30, https://x.fr?a=1, l'apostrophe")).toBe("10:30, https://x.fr?a=1, l'apostrophe");
    const une = frEspace(`Texte : « oui » ?`);
    expect(frEspace(une)).toBe(une);
    expect(frEspace(`a${NBSP}:`)).toBe(`a${FINE}:`);
  });
  it("frEspaceProfond : textes et résultats de fonctions, clés techniques intactes, original non modifié", () => {
    const source = { id: "a : b", titre: "Coloc : la poêle", href: "/x?y=1 : 2", liste: ["Toi ?"], f: (n: number) => `${n} cartes !` };
    const t = frEspaceProfond(source);
    expect(t.id).toBe("a : b");
    expect(t.href).toBe("/x?y=1 : 2");
    expect(t.titre).toBe(`Coloc${FINE}: la poêle`);
    expect(t.liste).toEqual([`Toi${FINE}?`]);
    expect(t.f(3)).toBe(`3 cartes${FINE}!`);
    expect(source.titre).toBe("Coloc : la poêle");
  });
});

describe("LienRetour", () => {
  it("lien vers la liste parente, chevron décoratif, nom = nom de la liste", () => {
    render(<LienRetour href="/mon-espace/bibliotheque">Bibliothèque</LienRetour>);
    const lien = screen.getByRole("link", { name: "Bibliothèque" });
    expect(lien).toHaveAttribute("href", "/mon-espace/bibliotheque");
    expect(lien.className).toContain("min-h-11");
    expect(lien.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
