/**
 * Lot G (07/10/2026) : corrections juridiques de la relecture @legal
 * (docs/marrant/audit-parcours-s16/relecture-legal.md) et règles validées par
 * Thomas (founder-preferences : remboursement sous 14 jours = premier paiement seulement).
 */
import {
  delaiRetractation,
  emailAccuseRetractation,
  emailAdminRetractation,
  emailConfirmationAbonnement,
  formulaireTypeRetractation,
  texteStripeSubmit,
  TEXTES_ACCUSE_RETRACTATION,
} from "@/config/textes/paiement";
import { RETRACTATION_PERIMETRE } from "@/config/textes/juridique";
import { TEXTES_SUPPRESSION } from "@/config/textes/compte";
import { renderAnnualRenewalReminder, veilleParis } from "@/lib/emails/annual-renewal-reminder";
import { assertRenduPropre } from "@/lib/emails/garde-fou-rendu";

const RECUE = new Date("2026-10-21T15:00:00Z"); // 21 octobre, 17:00 à Paris
const base = { email: "camille@example.invalid", dateAchat: null, motif: null, recueLe: RECUE, reference: "R-TEST0001" };
const lisible = (t: string) => t.replace(/ /g, " ");

describe("délai de rétractation : depuis la PREMIÈRE souscription (jour de Paris)", () => {
  it("14e jour compris, 15e dépassé, inconnu sans souscription", () => {
    expect(delaiRetractation(new Date("2026-10-07T08:00:00Z"), RECUE)).toBe("dans-le-delai");
    expect(delaiRetractation(new Date("2026-10-06T08:00:00Z"), RECUE)).toBe("depasse");
    expect(delaiRetractation(null, RECUE)).toBe("inconnu");
    expect(delaiRetractation(new Date("invalide"), RECUE)).toBe("inconnu");
    // Souscrit le 7 à 23:30 à Paris (21:30 UTC) : 14e jour = 21 octobre à Paris.
    expect(delaiRetractation(new Date("2026-10-07T21:30:00Z"), new Date("2026-10-21T21:30:00Z"))).toBe("dans-le-delai");
  });
});

describe("accusé de rétractation (réserve 1 @legal)", () => {
  it("dans le délai : remboursement promis", () => {
    const { text } = emailAccuseRetractation({ ...base, premiereSouscription: new Date("2026-10-10T10:00:00Z") });
    expect(text).toContain(TEXTES_ACCUSE_RETRACTATION.remboursementDansLeDelai);
    expect(text).not.toContain(RETRACTATION_PERIMETRE);
  });

  it.each([
    ["hors délai", new Date("2026-01-10T10:00:00Z")],
    ["souscription inconnue", null],
  ])("%s : plus de « On te rembourse » sans condition, texte @legal + premier paiement seulement", (_cas, premiere) => {
    const { subject, text } = emailAccuseRetractation({ ...base, premiereSouscription: premiere });
    expect(text).not.toMatch(/^On te rembourse/m);
    expect(text).toContain(
      "Si ta demande est faite dans les 14 jours qui suivent ta souscription, on te rembourse sous 14 jours maximum, sur le moyen de paiement utilisé. Ton abonnement est alors arrêté.",
    );
    expect(text).toContain("jamais pour un renouvellement");
    assertRenduPropre(`${subject}\n${text}`, "accusé");
    expect(text).not.toMatch(/—|\b(vous|votre)\b/i);
  });
});

describe("e-mail admin de rétractation (réserve 2 @legal)", () => {
  it("date limite = demande + 14 jours, délai calculé depuis la première souscription", () => {
    const dans = emailAdminRetractation({ ...base, compteTrouve: true, premiereSouscription: new Date("2026-10-10T10:00:00Z") });
    expect(dans.text).toContain("Date limite de remboursement : 4 novembre 2026 (demande + 14 jours)");
    expect(dans.text).toContain("dans le délai de 14 jours (première souscription le 10 octobre 2026)");
    const hors = emailAdminRetractation({ ...base, compteTrouve: true, premiereSouscription: new Date("2026-01-10T10:00:00Z") });
    expect(hors.text).toContain("DÉPASSÉ d'après la première souscription (le 10 janvier 2026)");
    const inconnu = emailAdminRetractation({ ...base, compteTrouve: false });
    expect(inconnu.text).toContain("Délai de rétractation : INCONNU");
    for (const r of [dans, hors, inconnu]) assertRenduPropre(`${r.subject}\n${r.text}`, "admin");
  });
});

describe("e-mail de confirmation : paragraphe rétractation @legal (validé par Thomas)", () => {
  it("« au moins jusqu'au », remboursement intégral mensuel comme annuel", () => {
    const { text } = emailConfirmationAbonnement({
      prenom: null,
      interval: "year",
      montantCents: 2499,
      dateSouscription: new Date("2026-10-07T10:00:00Z"),
      prochainRenouvellement: null,
    });
    expect(lisible(text)).toContain(
      "Droit de rétractation : tu as 14 jours à partir d'aujourd'hui, soit au moins jusqu'au 21 octobre 2026, pour te rétracter sans donner de motif. On te rembourse alors l'intégralité de ce que tu as payé (mensuel comme annuel), sous 14 jours maximum après ta demande. Il suffit de remplir ce formulaire : https://deviens-marrant.fr/retractation.",
    );
    expect(text).toContain(formulaireTypeRetractation());
  });
});

describe("texte Stripe : obligation de paiement (L.221-14, validé par Thomas)", () => {
  it.each(["monthly", "annual"] as const)("%s : ouverture exacte, ≤ 1 200 caractères", (plan) => {
    const t = texteStripeSubmit(plan);
    expect(t.startsWith("En cliquant sur « S'abonner », tu passes une commande avec obligation de paiement : Premium, ")).toBe(true);
    expect(t.length).toBeLessThanOrEqual(1200);
    expect(t.includes("prélevé chaque mois jusqu'à ta résiliation")).toBe(plan === "monthly");
    expect(t).not.toContain("—");
  });
});

describe("rappel annuel : « au plus tard la veille » (@legal point 14)", () => {
  it("veille calculée au jour de Paris, 1er du mois compris", () => {
    expect(veilleParis(new Date("2026-11-30T23:30:00Z")).toISOString()).toBe("2026-11-30T12:00:00.000Z");
    const { text } = renderAnnualRenewalReminder({
      prenom: null,
      renewalDate: new Date("2026-12-01T10:00:00Z"),
      amountCents: 2499,
      manageUrl: "https://deviens-marrant.fr/profil",
    });
    expect(text).toContain("Pour ne pas renouveler : résilie au plus tard la veille, le 30 novembre 2026");
    assertRenduPropre(text, "rappel");
  });
});

describe("suppression du compte en cours d'abonnement (@legal point 8)", () => {
  it("texte exact @legal avec la vraie date ; repli sans date ; déjà résilié", () => {
    expect(TEXTES_SUPPRESSION.avecAbonnement("12 novembre 2026")).toBe(
      "Ton abonnement Premium sera résilié tout de suite et tu perdras l'accès immédiatement, même si tu as payé jusqu'au 12 novembre 2026. La période déjà payée n'est pas remboursée. Pour garder Premium jusqu'au 12 novembre 2026, résilie d'abord ton abonnement, puis supprime ton compte après cette date.",
    );
    expect(`${TEXTES_SUPPRESSION.retractationAvant}${TEXTES_SUPPRESSION.retractationLien}${TEXTES_SUPPRESSION.retractationApres}`).toBe(
      "Tu as souscrit il y a moins de 14 jours ? Demande ton remboursement avec le formulaire de rétractation avant de supprimer ton compte.",
    );
    for (const t of [TEXTES_SUPPRESSION.avecAbonnement(null), TEXTES_SUPPRESSION.avecAbonnementResilie("12 novembre 2026")]) {
      expect(t).toContain("n'est pas remboursée");
      assertRenduPropre(t, "suppression");
      expect(t).not.toMatch(/—|\bvous\b/i);
    }
  });
});
