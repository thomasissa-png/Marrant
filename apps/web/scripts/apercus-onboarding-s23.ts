/**
 * Aperçus texte des e-mails d'onboarding Premium s23 (E0, E1, E2), générés par les VRAIES fonctions
 * de gabarit avec des données de novembre 2026, pour comparaison mot pour mot avec le fichier
 * approuvé (`docs/copy/onboarding-premium-s23-emails.md` v4.2). N'envoie RIEN, n'ouvre aucune base.
 * Échoue si un rendu contient un champ mal rempli (garde-fou) ou un tiret cadratin.
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/apercus-onboarding-s23.ts
 */
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";

const SORTIE = join(__dirname, "../../../docs/copy/onboarding-rendus");
const ARRET = "https://deviens-marrant.fr/api/onboarding-premium/arret?token=JETON-SIGNE-EXEMPLE";

async function main() {
  const { emailBienvenuePremium } = await import("@/config/textes/paiement");
  const { emailOnboardingE1, emailOnboardingE2 } = await import("@/config/textes/onboarding-premium");
  const { ONBOARDING_REPLY_TO } = await import("@/config/onboarding-premium");
  const { QUESTION_EQUIPE_OUVERTE } = await import("@/config/question-equipe");
  const { getCarnetExtrait, parseCarnets } = await import("@/lib/carnet");
  const { readdirSync, readFileSync } = await import("fs");
  const { problemesDeRendu } = await import("@/lib/emails/garde-fou-rendu");

  // Souscription le lundi 9 novembre 2026 à 10 h (Paris) ; J5 = samedi 14, J21 = lundi 30.
  const souscription = new Date("2026-11-09T09:00:00Z");
  // Hors build, pas de `require.context` : les carnets du dépôt sont lus directement (même garde qu'en production).
  const dossier = join(__dirname, "../src/data/carnet");
  const carnets = parseCarnets(readdirSync(dossier).filter((f) => /^\d{4}-\d{2}\.json$/.test(f)).map((f) => JSON.parse(readFileSync(join(dossier, f), "utf8"))));
  const carnet = getCarnetExtrait(carnets, new Date("2026-11-14T09:00:00Z")) !== null;
  const mensuel = { interval: "month", montantCents: 199, dateSouscription: souscription, prochainRenouvellement: new Date("2026-12-09T09:00:00Z") };
  const annuel = { interval: "year", montantCents: 1999, dateSouscription: souscription, prochainRenouvellement: new Date("2027-11-09T09:00:00Z") };
  const finAcces = new Date("2026-12-09T09:00:00Z");
  const etape = { parcoursTitre: "Répartie", parcoursSlug: "repartie", etapeNumero: 2, etapeTitre: (await import("@/lib/rappels/rappel-parcours")).titreEtapeSeed("repartie", 2) };
  const SERVICE = "inchangé (e-mail de service, pas de lien d'arrêt)";

  const rendus: Array<{ fichier: string; cas: string; replyTo: string; subject: string; text: string }> = [
    { fichier: "e0-mensuel.txt", cas: `E0 mensuel, abonné qui reçoit la lettre, carnet ${carnet ? "publié" : "absent"}, question ${QUESTION_EQUIPE_OUVERTE ? "ouverte" : "fermée"}`, replyTo: SERVICE, ...emailBienvenuePremium({ prenom: "Yanis", ...mensuel, carnet, lettre: true, question: QUESTION_EQUIPE_OUVERTE }) },
    { fichier: "e0-annuel.txt", cas: `E0 annuel (pas de phrase 5 C), abonné qui reçoit la lettre, carnet ${carnet ? "publié" : "absent"}`, replyTo: SERVICE, ...emailBienvenuePremium({ prenom: "Sophie", ...annuel, carnet, lettre: true, question: QUESTION_EQUIPE_OUVERTE }) },
    { fichier: "e0-mensuel-sans-prenom-minimal.txt", cas: "E0 mensuel, prénom absent, sans carnet, sans lettre (arrêtée ou opposition), sans question : 5 puces", replyTo: SERVICE, ...emailBienvenuePremium({ prenom: null, ...mensuel, carnet: false, lettre: false, question: false }) },
    { fichier: "e1-generale.txt", cas: "E1 (J5, samedi 14 novembre) version GÉNÉRALE", replyTo: ONBOARDING_REPLY_TO, ...emailOnboardingE1({ prenom: "Yanis", finAcces: null, carnet, etape: null, lienArret: ARRET }) },
    { fichier: "e1-generale-resiliation-programmee.txt", cas: "E1 version GÉNÉRALE, résiliation programmée (accès jusqu'au 9 décembre 2026)", replyTo: ONBOARDING_REPLY_TO, ...emailOnboardingE1({ prenom: "Yanis", finAcces, carnet, etape: null, lienArret: ARRET }) },
    { fichier: "e1-generale-sans-prenom-sans-carnet.txt", cas: "E1 version GÉNÉRALE, prénom absent, sans carnet", replyTo: ONBOARDING_REPLY_TO, ...emailOnboardingE1({ prenom: null, finAcces: null, carnet: false, etape: null, lienArret: ARRET }) },
    { fichier: "e1-parcours.txt", cas: "E1 version PARCOURS (Répartie, étape 1 validée)", replyTo: ONBOARDING_REPLY_TO, ...emailOnboardingE1({ prenom: "Marc", finAcces: null, carnet, etape, lienArret: ARRET }) },
    { fichier: "e1-parcours-resiliation-programmee.txt", cas: "E1 version PARCOURS, résiliation programmée (accès jusqu'au 9 décembre 2026)", replyTo: ONBOARDING_REPLY_TO, ...emailOnboardingE1({ prenom: "Marc", finAcces, carnet, etape, lienArret: ARRET }) },
    { fichier: "e2.txt", cas: "E2 (J21, lundi 30 novembre), jamais aux résiliés programmés", replyTo: ONBOARDING_REPLY_TO, ...emailOnboardingE2({ prenom: "Yanis", lienArret: ARRET }) },
  ];

  await mkdir(SORTIE, { recursive: true });
  for (const r of rendus) {
    const problemes = problemesDeRendu(`${r.subject}\n${r.text}`);
    if (problemes.length > 0 || /—/.test(r.text + r.subject)) throw new Error(`${r.fichier} : ${problemes.join(", ") || "tiret cadratin"}`);
    const entete = `Cas : ${r.cas}\nObjet : ${r.subject}\nRépondre à : ${r.replyTo}\n-------- corps --------\n`;
    await writeFile(join(SORTIE, r.fichier), entete + r.text, "utf8");
    console.log(`écrit : ${r.fichier}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
