/**
 * @jest-environment node
 */
/**
 * « Aujourd'hui » s25 v7, tour 13 (décision de Thomas du 16/11) : verrouillage RÉEL de la vitrine des répliques.
 * Le HTML serveur de l'aperçu (visiteur et inscrit gratuit) ne contient ni le texte des répliques de la fiche par
 * défaut, ni leur pourquoi, ni la scène, ni le « comment choisir », ni l'erreur : seuls les libellés des registres
 * sortent. Le composant client n'en reçoit rien (l'extrait est rendu côté serveur, sans prop vers un client).
 */
import { renderToString } from "react-dom/server";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { TEXTES_CARTES } from "@/config/textes/espace-cartes";

/** Entités HTML ramenées au texte, puis sans espaces ni ponctuation typographique (espaces insécables de `frEspace`). */
const nu = (html: string) =>
  html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .normalize("NFC")
    .replace(/<[^>]*>/g, "")
    .replace(/[\s  ⁠'’«»"]/g, "");

const VANNE = { content: "Énoncé réel de test.", punchline: "Chute réelle de test." };

describe("vitrine des répliques : verrouillage réel (HTML serveur)", () => {
  const fiche = ficheApercu("aujourdhui");
  if (fiche.type !== "situation") throw new Error("la fiche d'aperçu d'Aujourd'hui doit être une situation");
  const repliques = Object.values(fiche.contenu.repliques);

  it.each([
    ["visiteur", true],
    ["gratuit", false],
  ])("%s : aucun texte de réplique, aucun pourquoi, ni scène, ni règle, ni erreur ; les trois libellés oui", (_nom, visiteur) => {
    const html = renderToString(<ApercuAujourdhui visiteur={visiteur} vanne={VANNE} />);
    const texte = nu(html);
    expect(repliques).toHaveLength(3);
    for (const r of repliques) {
      expect(texte).not.toContain(nu(r.texte));
      expect(texte).not.toContain(nu(r.pourquoi));
      // Même un morceau : les 12 premiers caractères utiles de chaque réplique.
      expect(texte).not.toContain(nu(r.texte).slice(0, 12));
    }
    expect(texte).not.toContain(nu(fiche.contenu.scene.texte));
    expect(texte).not.toContain(nu(fiche.contenu.quandMonterDUnCran.regle));
    expect(texte).not.toContain(nu(fiche.contenu.erreur));
    // Témoin : la situation (titre) passe par la même normalisation et, elle, se lit en clair.
    expect(texte).toContain(nu(TEXTES_AUJOURDHUI.premierPas.sceneParDefaut));
    for (const libelle of Object.values(TEXTES_CARTES.registres)) expect(texte).toContain(nu(libelle));
    expect((html.match(/data-replique-fermee=/g) ?? []).length).toBe(3);
  });
});
