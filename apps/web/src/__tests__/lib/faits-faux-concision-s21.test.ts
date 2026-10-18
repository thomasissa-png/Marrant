/**
 * s21 concision (18/10), faits faux corrigés, puis textes v5 (textes-v5-c §1 et §3) :
 * - les FAQ prix ne disent plus « annules en 1 clic » (on confirme dans le portail Stripe) ni
 *   « pas de reconduction surprise » (faux pour un abonnement qui se reconduit) ;
 * - le sous-titre de /abonnement ne présente plus aucun rythme comme un fait.
 */
import { getPremiumFaqs } from "@/lib/faqs";
import { ABONNEMENT_HAUT_VISITEUR } from "@/config/textes/offre";

describe("faits faux corrigés (concision s21)", () => {
  it.each([
    [false, "C’est le prix, point. Ça se renouvelle chaque mois, tant que tu ne résilies pas."],
    [true, "C’est le prix, point. Ça se renouvelle chaque mois ou chaque année, tant que tu ne résilies pas."],
  ])("FAQ prix (annuel disponible : %s) : renouvellement dit, jamais « 1 clic »", (annuel, reponse) => {
    const tout = getPremiumFaqs(annuel).map((f) => f.answer).join("\n");
    expect(tout).not.toMatch(/1 clic|un clic|reconduction surprise/i);
    expect(tout).toContain(reponse);
  });

  it("sous-titre de /abonnement : « Pas d'attente entre les étapes », aucun rythme imposé", () => {
    expect(ABONNEMENT_HAUT_VISITEUR.sousTitre).toBe("Pas d’attente entre les étapes, de 15 à 20 minutes chacune.");
    expect(ABONNEMENT_HAUT_VISITEUR.sousTitre).not.toMatch(/par semaine/);
  });
});
