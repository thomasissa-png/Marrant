/**
 * s22 : textes validés à l'aveugle de la page /integrer-la-vanne-du-jour, posés MOT
 * POUR MOT (docs/copy/widget-s22/textes-finaux.md blocs 1, 4, 7, 11 ;
 * docs/copy/widget-s22/departage.md R2, R3, R5, R5 bis, R6, R8, R9, R10).
 * Les chaînes attendues sont recopiées ici depuis les documents, pas importées :
 * toute dérive de la page casse le test.
 */
import { render, screen } from "@testing-library/react";
import { frTypo } from "@/lib/fr-typo";

jest.mock("@/config/widget-vanne-du-jour", () => ({
  ...jest.requireActual("@/config/widget-vanne-du-jour"),
  WIDGET_VANNE_DU_JOUR_PUBLIE: true,
}));

import Page, { metadata } from "@/app/(dashboard)/integrer-la-vanne-du-jour/page";

const TITLE = "Ajoute la vanne du jour à ton site : un widget gratuit";
const DESCRIPTION =
  "Un widget gratuit pour afficher la vanne du jour sur ton site ou ton blog : tu colles le code, elle change chaque jour. Sans cookie, sans pub.";
const PARAGRAPHES = [
  // R3
  "Chaque jour, une nouvelle vanne s'affiche sur ton site, sans que tu aies rien à écrire. Ça te coûte un copier-coller. Nous, on y gagne un lien « Deviens Marrant », toujours affiché dans le widget : on te demande seulement de ne pas le masquer. Gratuit, sans cookie, sans pub.",
  // R5
  "Option 1, l'iframe : la vanne s'affiche dans son propre cadre, rien ne s'exécute dans ta page. Si tu hésites, commence par celle-là. Sur mobile, le cadre prend un peu plus de hauteur : c'est prévu.",
  // R5 bis
  "Ton WordPress est installé chez ton hébergeur ? Colle le code dans un bloc « HTML personnalisé » de l'éditeur. Sur WordPress.com, les iframes et les scripts ne passent qu'avec une formule payante qui inclut l'hébergement : avec les autres formules, la vanne ne s'affichera pas.",
  // R6
  "Option 2, le script : à choisir pour une barre latérale ou une colonne étroite. Il crée le même cadre à l'endroit où tu le colles, puis l'agrandit après le clic si la chute en a besoin. Contrairement à l'iframe seule, c'est un script de notre site qui s'exécute dans ta page.",
  // R9
  "Tes visiteurs voient l'amorce d'une vanne, un bouton « Révéler la chute », un lien « Pourquoi ça marche ? » et le lien « Deviens Marrant », toujours présent. La vanne change chaque jour, la même sur tous les sites. Pas de pub, pas de cookie, et le widget ne suit pas tes visiteurs : on compte seulement chaque affichage, avec le seul nom de domaine de ton site.",
].map(frTypo);
const O = "https://deviens-marrant.fr";
// Paragraphes mêlés de code : segments de texte passés par frTypo, code tel quel.
const MIXTES = [
  // Bloc 7
  frTypo("Si ton site limite ce qu'il peut charger (une CSP), ajoute ") + `frame-src ${O}` + frTypo(" et, si tu as pris le script, ") + `script-src ${O}` +
    frTypo(". Sinon le navigateur bloquera la vanne. Tu ne sais pas ce qu'est une CSP ? Tu n'as sans doute rien à faire."),
  // R8
  frTypo("Rien à faire : le widget s'adapte au mode clair ou sombre de ton visiteur. Ton site garde toujours le même fond ? Impose le thème en ajoutant ") +
    "?theme=clair ou ?theme=sombre" + frTypo(" à la fin de l'adresse qui suit src= dans le code de l'iframe, ou avec ") +
    'data-theme="clair" ou data-theme="sombre"' + frTypo(" sur le script."),
  // R10
  frTypo("Tu préfères afficher la vanne avec ton propre code ? Une API en lecture seule renvoie la vanne du jour en JSON : ") +
    `GET ${O}/api/widget/v1/vanne-du-jour` + frTypo(". Champs : ") + "type, date, amorce, chute, url, attribution et license" +
    frTypo(". Les règles d'usage sont dans la licence juste en dessous."),
];

describe("page du programme : textes validés, mot pour mot", () => {
  it("title absolu de 54 caractères (sans suffixe du layout), H1 identique, description R2", () => {
    expect(metadata.title).toEqual({ absolute: TITLE });
    expect(TITLE).toHaveLength(54);
    expect(metadata.description).toBe(DESCRIPTION);
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(TITLE);
  });

  it("chapeau, options, WordPress, affichage : paragraphes exacts", () => {
    const { container } = render(<Page />);
    const textes = [...container.querySelectorAll("p")].map((p) => p.textContent);
    for (const attendu of [...PARAGRAPHES, ...MIXTES]) expect(textes).toContain(attendu);
  });

  it("bloc WordPress juste après le code de l'iframe, avant l'option 2", () => {
    const { container } = render(<Page />);
    const textes = [...container.querySelectorAll("p")].map((p) => p.textContent);
    expect(textes.indexOf(PARAGRAPHES[2])).toBe(textes.indexOf(PARAGRAPHES[1]) + 1);
    expect(textes.indexOf(PARAGRAPHES[3])).toBe(textes.indexOf(PARAGRAPHES[2]) + 1);
  });

  it("titres des aperçus (bloc 4), aucun tiret cadratin, plus aucun ancien texte", () => {
    const { container } = render(<Page />);
    expect(screen.getByRole("heading", { level: 3, name: "Sur fond clair" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Sur fond sombre" })).toBeTruthy();
    expect(container.textContent).not.toContain("—");
    expect(container.textContent).not.toMatch(/Intègre la vanne du jour sur ton site|Sa hauteur s|Par défaut, le widget/);
  });
});

describe("bouton « Copier » (bloc 11)", () => {
  it("Copier, puis Copié ; sans presse-papiers : « Sélectionne puis copie »", async () => {
    const { BlocCode } = jest.requireActual("@/components/widget/bloc-code");
    const { fireEvent, findByText } = jest.requireActual("@testing-library/react");
    const writeText = jest.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("refus"));
    Object.assign(navigator, { clipboard: { writeText } });
    render(<BlocCode id="t" label="Iframe" code="<iframe></iframe>" />);
    const bouton = screen.getByRole("button", { name: /Copier/ });
    fireEvent.click(bouton);
    expect(await findByText(document.body, "Copié")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Copié/ }));
    expect(await findByText(document.body, "Sélectionne puis copie")).toBeTruthy();
  });
});
