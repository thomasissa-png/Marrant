/**
 * @jest-environment node
 *
 * Lettre s21, vérification visuelle @qa : jamais « : Confidentialité » ni
 * « : toi@exemple.fr » en début de ligne. Aucune espace ORDINAIRE avant
 * « : ; ? ! » dans les textes de la lettre, à l'écran comme dans les e-mails
 * texte (objets compris). Seule exception : les métadonnées de /lettre
 * (convention `lib/fr-typo` : pas de typographie de rendu dans `metadata`).
 */
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import { EMAILS_LETTRE, TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { corpsNumero } from "@/lib/lettre/envoi";
import { NBSP } from "@/lib/fr-typo";

const BASE = "https://deviens-marrant.fr";
const ESPACE_AVANT_PONCTUATION = / [:;?!]/;
const METADONNEES = ["page.metaTitre", "page.metaDescription"];

/** Toutes les chaînes d'un objet de textes, avec leur chemin. */
function chaines(valeur: unknown, chemin = ""): Array<[string, string]> {
  if (typeof valeur === "string") return [[chemin, valeur]];
  if (valeur && typeof valeur === "object") {
    return Object.entries(valeur).flatMap(([cle, v]) => chaines(v, chemin ? `${chemin}.${cle}` : cle));
  }
  return [];
}

const emails: Array<[string, string]> = [
  ["confirmation.sujet", EMAILS_LETTRE.confirmation.sujet],
  ["confirmation.corps", EMAILS_LETTRE.confirmation.corps(`${BASE}/lettre/confirmer?token=abc`, BASE)],
  ["dejaInscrit.sujet", EMAILS_LETTRE.dejaInscrit.sujet],
  ["dejaInscrit.corps", EMAILS_LETTRE.dejaInscrit.corps(`${BASE}/lettre/desinscrire?token=abc`, BASE)],
  ["reconfirmation.sujet", EMAILS_LETTRE.reconfirmation.sujet],
  ["reconfirmation.corps", EMAILS_LETTRE.reconfirmation.corps(`${BASE}/c?t=1`, `${BASE}/d?t=2`, BASE)],
  ["piedNumero", EMAILS_LETTRE.piedNumero(`${BASE}/d?t=2`, BASE)],
  ["corpsNumero", corpsNumero("La vanne : « Tu viens ? » Réponse : non !\n", BASE, "tok")],
];

describe("Insécables avant « : ; ? ! » (lettre s21)", () => {
  it("TEXTES_LETTRE : aucune espace ordinaire avant une ponctuation haute", () => {
    const fautes = chaines(TEXTES_LETTRE)
      .filter(([chemin]) => !METADONNEES.includes(chemin))
      .filter(([, texte]) => ESPACE_AVANT_PONCTUATION.test(texte))
      .map(([chemin]) => chemin);
    expect(fautes).toEqual([]);
  });

  it.each(emails)("e-mail texte %s : aucune espace ordinaire avant une ponctuation haute", (_nom, texte) => {
    expect(texte).not.toMatch(ESPACE_AVANT_PONCTUATION);
  });

  it("les deux cas relevés par @qa sont liés par une insécable", () => {
    expect(TEXTES_LETTRE.formulaire.mention.endsWith(`droits${NBSP}:`)).toBe(true);
    expect(TEXTES_LETTRE.erreurs.email).toContain(`exemple${NBSP}: toi@exemple.fr`);
    expect(TEXTES_LETTRE.succes.changer).toBe(`Mauvaise adresse${NBSP}? La corriger`);
  });

  it("guillemets français liés au mot cité", () => {
    expect(TEXTES_LETTRE.succes.texte).toContain(`«${NBSP}Confirmer mon adresse${NBSP}»`);
  });

  it("liens et jetons des e-mails intacts", () => {
    const corps = EMAILS_LETTRE.dejaInscrit.corps(`${BASE}/lettre/desinscrire?token=abc`, BASE);
    expect(corps).toContain(`${BASE}/lettre/desinscrire?token=abc`);
    expect(corps).toContain(`${BASE}/confidentialite`);
  });

  it("métadonnées de /lettre inchangées (pas de typographie de rendu dans metadata)", () => {
    expect(TEXTES_LETTRE.page.metaTitre).toBe("La lettre : trois répliques, chaque mois");
  });

  it("revue s21 m6 : <title> de /lettre/confirmer et /lettre/desinscrire sans insécable de rendu", async () => {
    const confirmer = (await import("@/app/(dashboard)/lettre/confirmer/page")).metadata;
    const desinscrire = (await import("@/app/(dashboard)/lettre/desinscrire/page")).metadata;
    expect(confirmer.title).toBe("Dernière étape.");
    expect(desinscrire.title).toBe("Arrêter la lettre ?");
    expect(String(desinscrire.title)).not.toContain(NBSP);
    // Le titre affiché dans la page garde l'insécable avant « ? ».
    expect(TEXTES_LETTRE.page.desinscrire.titre).toBe(`Arrêter la lettre${NBSP}?`);
  });
});
