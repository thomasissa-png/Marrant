/**
 * Envoi de TEST de la lettre mensuelle (s21, demande de Thomas du 17/10).
 *
 * Rend avec le VRAI code de production :
 *  (a) l'e-mail de confirmation d'inscription (`envoyerConfirmation`, capturé
 *      au lieu d'être envoyé à un inscrit) ;
 *  (b) le numéro 1 complet, comme la tâche d'envoi (`envoyerLettreDuMois`) :
 *      objet passé par `frPonctuation`, corps + pied par `corpsNumero`, en-têtes
 *      `List-Unsubscribe` par `enTetesDesinscription`, réponse à `LETTRE_CONTACT`.
 * puis les envoie par Resend (clé `RESEND_API_KEY`, expéditeur `EMAIL_FROM`),
 * objet préfixé « [TEST 2] » (2e envoi : textes neutres validés, mention d'éditeur, 17/10).
 *
 * Garde-fous :
 *  - liste blanche codée en dur (adresse d'Alex SEULE), vérifiée au départ ET
 *    juste avant chaque envoi ; toute autre adresse = arrêt, rien n'est envoyé ;
 *  - aucune lecture ni écriture en base (pas de `sendOrAlert`, qui enregistre une
 *    alerte en base en cas d'échec) ; jetons fictifs, les liens mènent à « lien
 *    invalide » ; interrupteurs `LETTRE_INSCRIPTIONS_OUVERTES` et `LETTRE_ENVOIS_OUVERTS` non lus ;
 *  - aucun secret affiché : seule leur présence est vérifiée.
 *
 * Usage (depuis apps/web) :
 *   npx tsx --tsconfig scripts/tsconfig.scripts.json scripts/envoi-test-lettre-s21.ts
 * Test : `src/__tests__/lib/lettre-envoi-test-script-s21.test.ts`.
 */
import { Resend } from "resend";
import numerosJson from "@/data/lettre/numeros.json";
import { LETTRE_CONTACT } from "@/config/textes/lettre-s21";
import { avecDelai, enTetesDesinscription, envoyerConfirmation } from "@/lib/lettre/inscription";
import { corpsNumero } from "@/lib/lettre/envoi";
import { numeroSchema } from "@/lib/lettre/numeros";
import { frPonctuation } from "@/lib/fr-typo";

/** Seule adresse autorisée (Thomas, 17/10). Ne jamais élargir sans son accord écrit. */
export const DESTINATAIRES_TEST_AUTORISES: readonly string[] = ["alex@deviens-marrant.fr"];
export const ADRESSE_TEST = "alex@deviens-marrant.fr";
export const PREFIXE_TEST = "[TEST 2] ";
const BASE_URL = "https://deviens-marrant.fr";
/** Jeton fictif : les liens de l'e-mail de test ne confirment ni ne désinscrivent personne. */
const JETON_TEST = "envoi-de-test-lien-non-valide";
const DELAI_ENVOI_MS = 10_000;

/** Égalité stricte avec la liste blanche (pas de normalisation : « Alex@… » est refusé). */
export function verifierDestinataireTest(adresse: string): string {
  if (!DESTINATAIRES_TEST_AUTORISES.includes(adresse)) {
    throw new Error("Destinataire refusé : seule l'adresse de test d'Alex est autorisée. Rien n'est envoyé.");
  }
  return adresse;
}

export interface MessageTest {
  type: "lettre-confirmation" | "lettre-numero-1";
  subject: string;
  text: string;
  headers?: Record<string, string>;
}

/** Les 2 e-mails, rendus par le code de production. */
export async function rendreEmailsTest(baseUrl: string = BASE_URL): Promise<MessageTest[]> {
  const messages: MessageTest[] = [];
  await envoyerConfirmation(
    async (_to, subject, text, headers) => {
      messages.push({ type: "lettre-confirmation", subject: `${PREFIXE_TEST}${subject}`, text, headers });
    },
    baseUrl,
    ADRESSE_TEST,
    JETON_TEST,
  );
  const n1 = numeroSchema.parse(numerosJson.find((n) => n.numero === 1));
  messages.push({
    type: "lettre-numero-1",
    subject: `${PREFIXE_TEST}${frPonctuation(n1.objet)}`,
    text: corpsNumero(n1.corps, baseUrl, JETON_TEST),
    headers: enTetesDesinscription(baseUrl, JETON_TEST),
  });
  return messages;
}

type EnvoiEmail = { from: string; to: string; subject: string; text: string; headers?: Record<string, string>; replyTo: string };
type ReponseEnvoi = { data: { id: string } | null; error: { name?: string; message: string } | null };
export interface ClientEmail {
  emails: { send: (payload: EnvoiEmail) => Promise<ReponseEnvoi> };
}

export interface ResultatEnvoiTest {
  type: MessageTest["type"];
  id: string | null;
  erreur: string | null;
}

/** Envoie les 2 e-mails à `destinataire` (liste blanche vérifiée avant tout et avant chaque envoi). */
export async function envoyerEmailsTest(destinataire: string, client: ClientEmail, from: string): Promise<ResultatEnvoiTest[]> {
  verifierDestinataireTest(destinataire);
  const resultats: ResultatEnvoiTest[] = [];
  for (const m of await rendreEmailsTest()) {
    const to = verifierDestinataireTest(destinataire);
    try {
      const { data, error } = await avecDelai(
        client.emails.send({ from, to, subject: m.subject, text: m.text, headers: m.headers, replyTo: LETTRE_CONTACT }),
        DELAI_ENVOI_MS,
        `Envoi de test ${m.type}`,
      );
      resultats.push({ type: m.type, id: data?.id ?? null, erreur: error ? `${error.name ?? "erreur"} : ${error.message}` : null });
    } catch (err) {
      resultats.push({ type: m.type, id: null, erreur: err instanceof Error ? err.message : String(err) });
    }
  }
  return resultats;
}

async function main(): Promise<void> {
  const cle = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!cle || !from) throw new Error("RESEND_API_KEY ou EMAIL_FROM absente : rien n'est envoyé.");
  const destinataire = verifierDestinataireTest(process.argv[2] ?? ADRESSE_TEST);
  const resultats = await envoyerEmailsTest(destinataire, new Resend(cle), from);
  for (const r of resultats) {
    console.log(r.erreur ? `${r.type} : REFUSÉ, ${r.erreur}` : `${r.type} : accepté par Resend, id ${r.id}`);
  }
  if (resultats.some((r) => r.erreur)) process.exitCode = 1;
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
