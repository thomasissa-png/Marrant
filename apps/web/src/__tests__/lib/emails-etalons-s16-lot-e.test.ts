/**
 * @jest-environment node
 *
 * Lot E (s16, 07/10/2026) : textes validés par Thomas (docs/copy/etalons-parcours-s16.md)
 * repris mot pour mot, et champs variables robustes (« assure-toi que les
 * prénoms et tout soient correctement remplis »). Pour chaque e-mail : (a)
 * données complètes, (b) prénom absent, (c) prénom composé accentué.
 */
const send = jest.fn();
jest.mock("resend", () => ({ Resend: jest.fn().mockImplementation(() => ({ emails: { send } })) }));
const recordAdminAlert = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/admin-alerts", () => ({ recordAdminAlert: (...a: unknown[]) => recordAdminAlert(...a) }));
const findUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: (...a: unknown[]) => findUnique(...a) } } }));
const trySend = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/email", () => ({
  ...jest.requireActual("@/lib/email"),
  trySendTransactionalTextEmail: (...a: unknown[]) => trySend(...a),
}));

import {
  ajouterJoursParis,
  ajouterPeriodeParis,
  dateLongue,
  emailAccuseRetractation,
  emailConfirmationAbonnement,
  emailConfirmationResiliation,
  emailPaiementRefuse,
  texteStripeSubmit,
  TEXTES_SUCCESS,
} from "@/config/textes/paiement";
import { PAIEMENT_ANNULE, reassurancePaiement } from "@/config/textes/offre";
import { formatEuros } from "@/config/premium";
import { firstNameFrom, renderAnnualRenewalReminder, salutation } from "@/lib/emails/annual-renewal-reminder";
import { renderPasswordResetEmail } from "@/lib/email";
import { assertRenduPropre, problemesDeRendu } from "@/lib/emails/garde-fou-rendu";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

const NBSP = " ";
/** Le texte validé s'écrit avec des espaces simples ; le rendu met une insécable avant « € ». */
const lisible = (t: string) => t.replace(/ /g, " ");

const PRENOMS: Array<[string, string | null, string]> = [
  ["(a) complet", "Camille", "Salut Camille,"],
  ["(b) prénom absent", null, "Salut,"],
  ["(c) composé accentué", "Marie-Hélène", "Salut Marie-Hélène,"],
];

const SOUSCRIT = new Date("2026-10-07T10:00:00Z");

beforeAll(() => {
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
});

function verifier(rendu: { subject: string; text?: string; html?: string }, salut: string) {
  const tout = `${rendu.subject}\n${rendu.text ?? rendu.html}`;
  assertRenduPropre(tout, "e-mail");
  expect(tout).toContain(salut);
  expect(tout).not.toMatch(/—/);
  expect(tout).not.toMatch(/\d,\d\d €/); // toujours l'espace insécable avant « € »
}

describe("étalon 2 : confirmation d'abonnement (corps A + objet 2.2)", () => {
  const MENSUEL_A = `Salut Camille,

Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance.

Voici ta confirmation :
- Formule : Premium mensuel
- Prix : 2,99 € TTC par mois
- Souscrit le : 7 octobre 2026
- Prochain prélèvement : 7 novembre 2026, 2,99 € TTC. L'abonnement se reconduit automatiquement à cette date, jusqu'à ce que tu le résilies.

Résilier : en ligne, à tout moment, depuis ton profil, bouton « Résilier ton contrat » : https://deviens-marrant.fr/profil. Ton accès reste ouvert jusqu'à la fin de la période payée.

Droit de rétractation : tu as 14 jours à partir d'aujourd'hui, soit au moins jusqu'au 21 octobre 2026, pour te rétracter sans donner de motif. On te rembourse alors l'intégralité de ce que tu as payé (mensuel comme annuel), sous 14 jours maximum après ta demande. Il suffit de remplir ce formulaire : https://deviens-marrant.fr/retractation.

Les CGU qui s'appliquent à ton abonnement : https://deviens-marrant.fr/cgu.

Pour bien démarrer : ouvre un parcours et lance l'étape 2 (la première se lit déjà sans compte) : https://deviens-marrant.fr/parcours.

À très vite,
L'Équipe Deviens Marrant
`;

  it("mensuel (a) : texte validé mot pour mot, objet 2.2, modèle légal joint après la signature", () => {
    const r = emailConfirmationAbonnement({
      prenom: "Camille",
      interval: "month",
      montantCents: 299,
      dateSouscription: SOUSCRIT,
      prochainRenouvellement: new Date("2026-11-07T10:00:00Z"),
    });
    expect(r.subject).toBe("Bienvenue dans Premium, ton abonnement est confirmé");
    expect(lisible(r.text).startsWith(MENSUEL_A)).toBe(true);
    expect(r.text).toContain(`2,99${NBSP}€ TTC par mois`);
    expect(r.text).toContain("MODÈLE DE FORMULAIRE DE RÉTRACTATION");
    expect(r.text).not.toContain("Avec l'annuel");
  });

  it("annuel : prix annuel, ligne « plus de 3 mois offerts : 10,89 € économisés »", () => {
    const r = emailConfirmationAbonnement({
      prenom: "Camille",
      interval: "year",
      montantCents: 2499,
      dateSouscription: SOUSCRIT,
      prochainRenouvellement: new Date("2027-10-07T10:00:00Z"),
    });
    const t = lisible(r.text);
    expect(t).toContain("- Formule : Premium annuel\n- Prix : 24,99 € TTC par an\n- Souscrit le : 7 octobre 2026\n");
    expect(t).toContain("- Prochain prélèvement : 7 octobre 2027, 24,99 € TTC.");
    expect(t).toContain(
      "jusqu'à ce que tu le résilies.\n\nAvec l'annuel, tu as plus de 3 mois offerts : 10,89 € économisés par rapport au mensuel.\n\nRésilier :",
    );
  });

  describe.each(["month", "year"])("formule %s", (interval) => {
    it.each(PRENOMS)("%s", (_cas, prenom, salut) => {
      const r = emailConfirmationAbonnement({
        prenom,
        interval,
        montantCents: interval === "year" ? 2499 : 299,
        dateSouscription: SOUSCRIT,
        prochainRenouvellement: null, // date absente : calculée, jamais vide
      });
      verifier(r, salut);
      expect(lisible(r.text)).toContain(
        interval === "year" ? "Prochain prélèvement : 7 octobre 2027, 24,99 € TTC." : "Prochain prélèvement : 7 novembre 2026, 2,99 € TTC.",
      );
    });
  });

  it("données Stripe manquantes : montant et formule tirés de config/premium, rien d'inventé", () => {
    const r = emailConfirmationAbonnement({
      prenom: "  ",
      interval: null,
      montantCents: null,
      dateSouscription: new Date("invalid"),
      prochainRenouvellement: new Date(Number.NaN),
    });
    verifier(r, "Salut,");
    expect(lisible(r.text)).toContain("- Formule : Premium mensuel\n- Prix : 2,99 € TTC par mois\n");
  });
});

describe("étalon 3 : paiement refusé (corps A + objet 3.2)", () => {
  it.each(PRENOMS)("%s : texte validé mot pour mot", (_cas, prenom, salut) => {
    const r = emailPaiementRefuse({ prenom, montantCents: 299, datePrevue: new Date("2026-11-07T06:00:00Z") });
    verifier(r, salut);
    expect(r.subject).toBe("Ton paiement n'est pas passé, ton Premium reste actif");
    expect(lisible(r.text)).toBe(`${salut}

Le prélèvement de ton abonnement Premium (2,99 € TTC, prévu le 7 novembre 2026) n'est pas passé. Ça arrive : carte expirée, plafond atteint, vérification de la banque.

Rien n'est coupé pour l'instant : ton accès Premium reste ouvert pendant que le prélèvement est retenté automatiquement dans les prochains jours.

Si ta carte a changé ou si ta banque a bloqué le paiement, tu peux la mettre à jour ici : https://deviens-marrant.fr/profil.

Si le paiement reste impossible à la fin des tentatives, l'abonnement s'arrête et l'accès Premium se ferme. Tu pourras te réabonner quand tu veux.

L'Équipe Deviens Marrant
`);
  });

  it("montant ou date absents : la parenthèse ne garde que ce qui est connu", () => {
    const sans = emailPaiementRefuse({ prenom: null, montantCents: null, datePrevue: null });
    verifier(sans, "Salut,");
    expect(sans.text).toContain("Le prélèvement de ton abonnement Premium n'est pas passé.");
    const montantSeul = emailPaiementRefuse({ prenom: null, montantCents: 2499, datePrevue: null });
    expect(lisible(montantSeul.text)).toContain("Premium (24,99 € TTC) n'est pas passé.");
  });
});

describe("étalon 5c : résiliation (objet 5c.3 + corps)", () => {
  it.each(PRENOMS)("%s : texte validé mot pour mot", (_cas, prenom, salut) => {
    const r = emailConfirmationResiliation({ prenom, finAcces: new Date("2026-11-01T00:00:00Z") });
    verifier(r, salut);
    expect(r.subject).toBe("C'est noté : ton Premium s'arrête le 1er novembre 2026");
    expect(r.text).toBe(`${salut}

Ta résiliation est bien prise en compte. Tu gardes l'accès Premium jusqu'au 1er novembre 2026, puis l'abonnement s'arrête : aucun nouveau prélèvement.

Tu peux te réabonner quand tu veux : https://deviens-marrant.fr/abonnement. Les premières étapes des parcours restent en lecture libre.

Merci d'avoir bossé ton humour avec nous.

L'Équipe Deviens Marrant
`);
  });

  it("date de fin inconnue : objet 5c.1, jamais de date vide", () => {
    const r = emailConfirmationResiliation({ prenom: null, finAcces: null });
    verifier(r, "Salut,");
    expect(r.subject).toBe("Ta résiliation est confirmée");
    expect(r.text).toContain("Tu gardes l'accès Premium jusqu'à la fin de la période payée, puis");
  });
});

describe("e-mails hors étalons : prénom, dates, montants", () => {
  it.each(PRENOMS)("rappel annuel %s", (_cas, prenom, salut) => {
    const r = renderAnnualRenewalReminder({
      prenom,
      renewalDate: new Date("2026-11-12T00:00:00Z"),
      amountCents: 2499,
      manageUrl: "https://deviens-marrant.fr/profil",
    });
    verifier(r, salut);
    expect(r.subject).toBe("Ton abonnement annuel Deviens Marrant se renouvelle le 12 novembre 2026");
  });

  it.each(PRENOMS)("réinitialisation %s", (_cas, prenom, salut) => {
    const r = renderPasswordResetEmail("https://deviens-marrant.fr/reset-password?token=abc&email=x%40example.invalid", prenom);
    verifier(r, salut);
    expect(r.html).toContain(`<p>${salut}</p>`);
  });

  it.each(PRENOMS)("accusé de rétractation %s", (_cas, prenom, salut) => {
    const r = emailAccuseRetractation({
      email: "camille@example.invalid",
      dateAchat: new Date("2026-10-01T12:00:00Z"),
      motif: null,
      recueLe: new Date("2026-10-07T12:00:00Z"),
      reference: "R-EXEMPLE1",
      prenom,
    });
    verifier(r, salut);
    expect(r.text).toContain("le 7 octobre 2026 à 14:00");
    expect(r.text).toContain("Date d'achat indiquée : le 1er octobre 2026");
  });
});

describe("prénom : uniquement le prénom, propre, sinon « Salut, »", () => {
  it.each([
    ["Marie-Hélène Dupont", "Marie-Hélène"],
    ["  camille   martin ", "camille"],
    ["Zoë", "Zoë"],
    ["O'Neil", "O'Neil"],
    ["Jean-Pierre,", "Jean-Pierre"],
    ["ÉLODIE", "ÉLODIE"],
  ])("%j → %j", (nom, attendu) => expect(firstNameFrom(nom)).toBe(attendu));

  it.each([null, undefined, "", "   ", "camille@example.invalid", "undefined", "null", "user123", "<b>", "x".repeat(41)])(
    "%j → aucun prénom",
    (nom) => {
      expect(firstNameFrom(nom)).toBeNull();
      expect(salutation(nom)).toBe("Salut,");
    },
  );
});

describe("dates, montants, textes d'écran validés", () => {
  it("dates en français, fuseau Paris, « 1er », +14 jours au calendrier malgré le changement d'heure", () => {
    expect(dateLongue(new Date("2026-10-31T23:30:00Z"))).toBe("1er novembre 2026");
    expect(dateLongue(ajouterJoursParis(new Date("2026-10-19T22:30:00Z"), 14))).toBe("3 novembre 2026");
    expect(dateLongue(ajouterPeriodeParis(new Date("2027-01-31T10:00:00Z"), "month"))).toBe("28 février 2027");
    expect(dateLongue(ajouterPeriodeParis(new Date("2028-02-29T10:00:00Z"), "year"))).toBe("28 février 2029");
  });

  it("montants : virgule et espace insécable", () => {
    expect(formatEuros(299)).toBe(`2,99${NBSP}€`);
    expect(formatEuros(2499)).toBe(`24,99${NBSP}€`);
  });

  it("étalon 1.1 (réassurance) et texte Stripe : seule la formule choisie", () => {
    expect(lisible(reassurancePaiement("monthly"))).toBe(
      "2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux.",
    );
    expect(lisible(reassurancePaiement("annual"))).toBe(
      "24,99 € TTC par an, remboursé sous 14 jours, résiliable en ligne quand tu veux.",
    );
    const annuel = lisible(texteStripeSubmit("annual")).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    expect(annuel).toBe(
      // Lot G : ouverture « obligation de paiement » (@legal point 13, validée par Thomas).
      "En cliquant sur « S'abonner », tu passes une commande avec obligation de paiement : Premium, 24,99 € TTC par an, renouvelé chaque année. Tu as 14 jours pour te faire rembourser (formulaire : deviens-marrant.fr/retractation). Tu résilies en ligne depuis ton profil, quand tu veux : ton accès reste ouvert jusqu'à la fin de la période payée. En payant, tu acceptes les CGU : deviens-marrant.fr/cgu",
    );
    expect(annuel).not.toContain("par mois");
  });

  it("étalons 5a.2 et 5b.2", () => {
    expect(`${PAIEMENT_ANNULE.titre} ${PAIEMENT_ANNULE.texte}`).toBe(
      "Paiement annulé, rien n'a été prélevé. Tu peux réessayer quand tu veux.",
    );
    expect(TEXTES_SUCCESS.connexionTitre).toBe("Connecte-toi pour retrouver ton abonnement");
    expect(TEXTES_SUCCESS.connexionBouton).toBe("Me connecter");
    expect(`${TEXTES_SUCCESS.connexionLienAvant}${TEXTES_SUCCESS.connexionLien}`).toBe("Pas encore abonné ? Voir Premium");
  });
});

describe("liens des e-mails : absolus et vers des pages qui existent", () => {
  it("chaque lien https://deviens-marrant.fr/... correspond à une page de src/app", () => {
    const app = join(__dirname, "../../app");
    const groupes = readdirSync(app).filter((d) => d.startsWith("("));
    const existe = (chemin: string) =>
      [app, ...groupes.map((g) => join(app, g))].some((base) => existsSync(join(base, chemin, "page.tsx")));
    const textes = [
      emailConfirmationAbonnement({ prenom: null, interval: "year", montantCents: 2499, dateSouscription: SOUSCRIT, prochainRenouvellement: null }).text,
      emailPaiementRefuse({ prenom: null, montantCents: 299, datePrevue: SOUSCRIT }).text,
      emailConfirmationResiliation({ prenom: null, finAcces: SOUSCRIT }).text,
      renderPasswordResetEmail("https://deviens-marrant.fr/reset-password?token=t", null).html,
      texteStripeSubmit("monthly"),
    ].join("\n");
    const chemins = [...textes.matchAll(/https:\/\/deviens-marrant\.fr(\/[a-z-]+)/g)].map((m) => m[1]);
    expect(new Set(chemins)).toEqual(
      new Set(["/profil", "/retractation", "/cgu", "/parcours", "/abonnement", "/reset-password"]),
    );
    for (const c of chemins) expect([c, existe(c)]).toEqual([c, true]);
  });
});

describe("garde-fou des champs variables", () => {
  it.each([
    ["Salut undefined,", "« undefined »"],
    ["Prix : null TTC", "« null »"],
    ["NaN € TTC", "« NaN »"],
    ["Salut {{prénom}},", "accolades de gabarit"],
    ["Salut [prénom],", "champ entre crochets"],
    ["jusqu'au October 21, 2026", "mois en anglais"],
    ["Invalid Date", "date invalide"],
    ["Prix : 2.99 €", "montant au format anglais"],
    ["Salut ,", "salutation mal remplie"],
    ["Salut camille@example.invalid,", "salutation mal remplie"],
  ])("%j → %s", (texte, probleme) => {
    expect(problemesDeRendu(texte)).toContain(probleme);
    expect(() => assertRenduPropre(texte)).toThrow(probleme);
  });

  it("un rendu propre passe", () => {
    expect(problemesDeRendu("Salut Marie-Hélène,\nLe 7 octobre 2026, 2,99 € TTC.")).toEqual([]);
  });
});

describe("garde-fou à l'envoi (lib/emails/paiement-notifications)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("nom du compte = adresse e-mail : « Salut, », aucune alerte, e-mail envoyé", async () => {
    findUnique.mockResolvedValue({ email: "camille@example.invalid", name: "camille@example.invalid" });
    const { notifyCancellationScheduled } = await import("@/lib/emails/paiement-notifications");
    await expect(notifyCancellationScheduled("u1", new Date("2026-11-01T00:00:00Z"))).resolves.toBe(true);
    const [to, subject, text] = trySend.mock.calls[0];
    expect(to).toBe("camille@example.invalid");
    expect(subject).toBe("C'est noté : ton Premium s'arrête le 1er novembre 2026");
    expect(text.startsWith("Salut,\n")).toBe(true);
    expect(recordAdminAlert).not.toHaveBeenCalled();
  });

  it("rendu défectueux : alerte A « email-rendu-<type> », l'e-mail part quand même", async () => {
    findUnique.mockResolvedValue({ email: "camille@example.invalid", name: "Camille" });
    let notify: typeof import("@/lib/emails/paiement-notifications").notifyPaymentFailed = async () => false;
    jest.isolateModules(() => {
      jest.doMock("@/config/textes/paiement", () => ({
        ...jest.requireActual("@/config/textes/paiement"),
        emailPaiementRefuse: () => ({ subject: "Ton paiement", text: "Salut undefined, prévu le October 7" }),
      }));
      notify = require("@/lib/emails/paiement-notifications").notifyPaymentFailed;
    });
    await expect(notify("u1", { montantCents: 299, datePrevue: null })).resolves.toBe(true);
    expect(recordAdminAlert).toHaveBeenCalledWith(expect.objectContaining({ cle: "email-rendu-paiement-refuse" }));
    expect(recordAdminAlert.mock.calls[0][0].html).toContain("« undefined »");
    expect(recordAdminAlert.mock.calls[0][0].html).toContain("mois en anglais");
    expect(trySend).toHaveBeenCalledTimes(1);
  });
});
