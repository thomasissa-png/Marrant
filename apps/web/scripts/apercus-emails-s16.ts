/**
 * Aperçus des e-mails transactionnels pour Thomas (s16, lot E), générés par les
 * VRAIES fonctions de gabarit, avec des données fictives évidentes
 * (adresses en @example.invalid). Cas (a) données complètes, (b) prénom absent.
 * Chaque rendu passe par le garde-fou des champs variables : le script échoue
 * si un « undefined », une date en anglais, etc. apparaît.
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/apercus-emails-s16.ts
 */
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";

const SORTIE = join(__dirname, "../../../docs/copy/apercus-emails-s16");
const DE = "Deviens Marrant <noreply@deviens-marrant.fr>";
const A = "camille.exemple@example.invalid";

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

interface Apercu {
  fichier: string;
  titre: string;
  subject: string;
  text?: string;
  html?: string;
}

function pageTexte(a: Apercu): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>${esc(a.titre)}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 24px auto; padding: 0 16px; color: #1a1a1a;">
  <p style="font-size: 13px; color: #666;">Aperçu généré le ${new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })} par les vraies fonctions de gabarit (données fictives). Cet e-mail part en texte brut : le lecteur de messagerie l'affiche tel quel. <a href="index.html">Retour à la liste</a></p>
  <table style="font-size: 14px; border-collapse: collapse; margin-bottom: 16px;">
    <tr><td style="padding: 2px 12px 2px 0; color: #666;">De</td><td>${esc(DE)}</td></tr>
    <tr><td style="padding: 2px 12px 2px 0; color: #666;">À</td><td>${esc(A)}</td></tr>
    <tr><td style="padding: 2px 12px 2px 0; color: #666;">Objet</td><td><strong>${esc(a.subject)}</strong></td></tr>
  </table>
  <pre style="white-space: pre-wrap; font-family: inherit; font-size: 15px; line-height: 1.5; border-top: 1px solid #ddd; padding-top: 16px;">${esc(a.text ?? "")}</pre>
</body>
</html>
`;
}

async function main(): Promise<void> {
  // Imports après NEXTAUTH_URL : siteUrl() lit la variable à l'appel.
  const p = await import("../src/config/textes/paiement");
  const { renderAnnualRenewalReminder } = await import("../src/lib/emails/annual-renewal-reminder");
  const { renderPasswordResetEmail } = await import("../src/lib/email");
  const { assertRenduPropre } = await import("../src/lib/emails/garde-fou-rendu");

  const souscrit = new Date("2026-10-07T10:00:00Z");
  const apercus: Apercu[] = [];
  for (const [cas, prenom] of [["a", "Camille"], ["b", null]] as const) {
    const libelle = cas === "a" ? "(a) données complètes" : "(b) prénom absent";
    const ajout = (fichier: string, titre: string, r: { subject: string; text?: string; html?: string }) =>
      apercus.push({ fichier: `${fichier}-${cas}.html`, titre: `${titre} ${libelle}`, ...r });

    ajout("confirmation-mensuel", "Confirmation d'abonnement, mensuel", p.emailConfirmationAbonnement({
      prenom, interval: "month", montantCents: 299, dateSouscription: souscrit, prochainRenouvellement: new Date("2026-11-07T10:00:00Z"),
    }));
    ajout("confirmation-annuel", "Confirmation d'abonnement, annuel", p.emailConfirmationAbonnement({
      prenom, interval: "year", montantCents: 2499, dateSouscription: souscrit, prochainRenouvellement: new Date("2027-10-07T10:00:00Z"),
    }));
    ajout("paiement-refuse", "Paiement refusé", p.emailPaiementRefuse({
      prenom, montantCents: 299, datePrevue: new Date("2026-11-07T06:00:00Z"),
    }));
    ajout("resiliation", "Confirmation de résiliation", p.emailConfirmationResiliation({
      prenom, finAcces: new Date("2026-11-07T10:00:00Z"),
    }));
    ajout("rappel-annuel", "Rappel de reconduction de l'annuel", renderAnnualRenewalReminder({
      prenom, renewalDate: new Date("2027-10-07T10:00:00Z"), amountCents: 2499, manageUrl: "https://deviens-marrant.fr/profil",
    }));
    ajout("reinitialisation", "Réinitialisation du mot de passe", renderPasswordResetEmail(
      "https://deviens-marrant.fr/reset-password?token=EXEMPLE-FICTIF&email=camille.exemple%40example.invalid", prenom,
    ));
    ajout("accuse-retractation", "Accusé de rétractation", p.emailAccuseRetractation({
      email: A, dateAchat: souscrit, motif: null, recueLe: new Date("2026-10-09T08:15:00Z"), reference: "R-EXEMPLE1", prenom,
      // Lot G : cas a = dans le délai (première souscription connue), cas b = délai inconnu (texte conditionnel @legal).
      premiereSouscription: prenom ? souscrit : null,
    }));
  }

  await mkdir(SORTIE, { recursive: true });
  for (const a of apercus) {
    assertRenduPropre(`${a.subject}\n${a.text ?? a.html}`, a.fichier);
    // E-mail HTML (réinitialisation) : écrit tel qu'il part. Texte brut : mis en page lisible.
    await writeFile(join(SORTIE, a.fichier), a.html ?? pageTexte(a), "utf8");
  }
  const lignes = apercus
    .map((a) => `    <li><a href="${a.fichier}">${esc(a.titre)}</a><br><span style="color:#666">Objet : ${esc(a.subject)}</span></li>`)
    .join("\n");
  await writeFile(
    join(SORTIE, "index.html"),
    `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Aperçus des e-mails, s16</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 24px auto; padding: 0 16px; color: #1a1a1a; line-height: 1.5;">
  <h1 style="font-size: 22px;">Aperçus des e-mails (s16, textes validés)</h1>
  <p>Rendus réels des gabarits du site, données fictives (adresse @example.invalid). Cas (a) : données complètes, prénom « Camille ». Cas (b) : aucun prénom sur le compte, l'e-mail commence par « Salut, ».</p>
  <ul>
${lignes}
  </ul>
</body>
</html>
`,
    "utf8",
  );
  console.log(`${apercus.length} aperçus écrits dans ${SORTIE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
