/**
 * Nav v6 (s25, lot B) : fiches réelles des pages d'aperçu, figées et à confirmer par Thomas
 * (`docs/espace-client/travail-en-cours/apercus-fiches-a-confirmer.md`). Toute modification de cette liste
 * passe par lui : ce test la fixe mot pour mot.
 */
import { FICHES_APERCU, ficheApercu } from "@/components/espace/apercu/exemples";
import { ENTREE_PAR_DEFAUT } from "@/lib/espace/premier-pas";

describe("fiches des aperçus", () => {
  it("liste figée (identifiant et titre)", () => {
    const liste = Object.keys(FICHES_APERCU).map((r) => {
      const f = ficheApercu(r as keyof typeof FICHES_APERCU);
      return [r, f.type, f.id, f.titre];
    });
    expect(liste).toEqual([
      ["aujourdhui", "situation", "amis-tu-as-change-quelque-chose", ficheApercu("aujourdhui").titre],
      ["quoiRepondre", "situation", "coloc-la-poele", "Coloc : la poêle"],
      ["bibliotheque", "construction", "le-faux-secret", "Le faux secret"],
      ["sEntrainer", "jeu", "quelle-replique-1", "Quelle réplique ?"],
      ["mesRepliques", "situation", "coloc-la-poele", "Coloc : la poêle"],
    ]);
    expect(FICHES_APERCU.aujourdhui.id).toBe(ENTREE_PAR_DEFAUT);
  });

  it("des fiches réelles du contenu servi, jamais une reprise de lettre, chacune lisible en entier", () => {
    for (const r of Object.keys(FICHES_APERCU) as (keyof typeof FICHES_APERCU)[]) {
      const f = ficheApercu(r);
      expect(f.repriseDeLettre ?? null).toBeNull();
      expect(f.titre.length).toBeGreaterThan(0);
    }
    expect(ficheApercu("mesRepliques").geste?.consigne).toBeTruthy();
  });
});
