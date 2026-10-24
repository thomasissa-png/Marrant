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

describe("ligne de backlink sous le cadre (décision Thomas s22, 24/10)", () => {
  // s22, validée à l'aveugle : recopiée ici, pas importée.
  const PHRASE = frTypo(
    "Le code ajoute sous le cadre une petite ligne « La vanne du jour par Deviens Marrant », avec un lien vers notre site. Elle est facultative : pour l'enlever, efface la fin du code, à partir de « <p ». Si tu la gardes, c'est un coup de pouce pour nous, merci !",
  );
  // Visa @legal du 24/10 (docs/legal/widget-vanne-du-jour-s22.md, section « Visa licence élargie » : appli, bot,
  // newsletter permis avec le lien visible) puis corrections de la revue à l'aveugle (B1 à B3, C1 à C5), paragraphe complet mot pour mot.
  const CONDITIONS = frTypo(
    "La vanne du jour est gratuite : tu peux l'afficher sur ton site, dans une appli, un bot (Discord, Slack, Telegram…), une extension ou une newsletter, sans nous demander. Elle est fournie telle quelle, sans garantie de disponibilité, et elle peut évoluer. Le lien « Deviens Marrant » dans le cadre fait partie du widget : laisse-le en place et visible (la ligne sous le cadre, elle, est facultative). Si tu affiches la vanne sans le widget (avec l'API sur ton propre site, dans une appli, un bot, une newsletter…), mets le lien « Deviens Marrant » bien visible à côté. Ne modifie pas le texte de la vanne et ne la présente pas comme la tienne. Tu peux afficher la vanne même si ton site, ton appli, ton bot, ton extension ou ta newsletter a de la publicité. En revanche, tu ne peux ni revendre la vanne, ni la copier en masse, ni l'archiver, ni la reprendre dans un recueil ou une base de vannes, ni t'en servir pour entraîner une IA. Les messages de bot et les newsletters déjà envoyés peuvent rester où ils sont : ce qui est interdit, c'est de garder les vannes de côté pour les ressortir ou les rassembler. Si tu passes par l'API, tu peux garder la vanne en cache de ton côté (serveur ou navigateur) 24 h au plus. Le widget ne pose aucun cookie et ne suit pas tes visiteurs. On peut changer ou arrêter le service, et te couper l'accès (contenu inapproprié, abus), à tout moment.",
  );

  it("phrase présente juste après le code du script, avant le bloc 7", () => {
    const { container } = render(<Page />);
    const textes = [...container.querySelectorAll("p")].map((p) => p.textContent);
    const i = textes.indexOf(PHRASE);
    expect(i).toBeGreaterThan(textes.indexOf(PARAGRAPHES[3]));
    expect(textes[i + 1]).toBe(MIXTES[0]);
    const scriptPre = container.querySelector('pre[aria-labelledby="code-script-label"]')!;
    const p = [...container.querySelectorAll("p")][i];
    expect(scriptPre.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("conditions d'utilisation : nouvelle demi-phrase du visa @legal, ancienne phrase absente", () => {
    const { container } = render(<Page />);
    const textes = [...container.querySelectorAll("p")].map((p) => p.textContent);
    expect(textes).toContain(CONDITIONS);
    expect(container.textContent).not.toContain(frTypo("Le lien « Deviens Marrant » fait partie du widget"));
  });

  it("les quatre blocs de code affichés contiennent la ligne après le cadre", () => {
    const { container } = render(<Page />);
    const codes = [...container.querySelectorAll("pre code")].map((c) => c.textContent ?? "");
    expect(codes).toHaveLength(4);
    const ligne = '<p style="margin:6px 0 0;font:13px/1.4 system-ui,sans-serif">La vanne du jour par <a href="https://deviens-marrant.fr/">Deviens Marrant</a></p>';
    for (const c of codes) expect(c.endsWith(ligne)).toBe(true);
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
