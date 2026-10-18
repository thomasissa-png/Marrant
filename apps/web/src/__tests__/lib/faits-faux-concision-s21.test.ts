/**
 * s21 concision (18/10), faits faux corrigés en texte minimal
 * (docs/copy/cta-s21/concision/inventaire-et-etalons.md §3, points 1 et 2) :
 * - les deux FAQ prix ne disent plus « annules en 1 clic » (on confirme dans le
 *   portail Stripe) mais « tu résilies depuis ton profil » ;
 * - le sous-titre de /abonnement présente le rythme comme conseillé, pas comme un fait.
 */
import { getPremiumFaqs } from "@/lib/faqs";
import { ABONNEMENT_HAUT_VISITEUR } from "@/config/textes/offre";

describe("faits faux corrigés (concision s21)", () => {
  it.each([false, true])("FAQ prix (annuel disponible : %s) : résiliation depuis le profil, jamais « 1 clic »", (annuel) => {
    const tout = getPremiumFaqs(annuel).map((f) => f.answer).join("\n");
    expect(tout).not.toMatch(/1 clic|un clic/i);
    expect(tout).toMatch(/[Tt]u résilies depuis ton profil, sans avoir à envoyer un email ou appeler un numéro\./);
  });

  it("sous-titre de /abonnement : « une étape par semaine conseillée »", () => {
    expect(ABONNEMENT_HAUT_VISITEUR.sousTitre).toContain("une étape par semaine conseillée,");
    expect(ABONNEMENT_HAUT_VISITEUR.sousTitre).not.toMatch(/une étape par semaine,/);
  });
});
