/**
 * Côté équipe de « Mes questions » (s24, lot D7 ; architecture v20 2.6, « Un seul circuit de réponse ») :
 * notification interne d'un envoi, outil d'admin (fils en attente, réponse enregistrée PUIS e-mail de
 * réponse, étiquette de scène, recopie d'un échange fait hors de l'outil).
 *
 * Adresses : celle du compte est TOUJOURS lue en base (relation `user` du fil), jamais reçue d'un corps
 * de requête ; elle sert de Reply-To de la notification et de destinataire de la réponse. Sur l'e-mail
 * de réponse, Reply-To = boîte de l'équipe. E-mail de réponse (texte validé le 13/11) : il ne part que si
 * l'espace est ouvert (`ESPACE_CLIENT_PUBLIE`) ET son texte validé (`EMAIL_REPONSE_VALIDE`) ; sinon rien ne
 * part (« brouillon »), l'outil le dit. Seconde garantie : l'outil répond 404 interrupteur fermé.
 * Aucun texte dans les journaux (nom d'erreur seulement), ni dans `UsageEvent`, ni vers Umami.
 */
import { prisma } from "@/lib/prisma";
import { adresseReponse, horodatageParis, nettoyerEnTete } from "@/lib/question-equipe";
import { avecDelai } from "@/lib/lettre/inscription";
import { QUESTION_EQUIPE_DESTINATAIRE } from "@/config/question-equipe";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { EMAIL_REPONSE_BROUILLON, EMAIL_REPONSE_VALIDE, NOTIFICATION_EQUIPE, TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { ALERTE_ATTENTE, versListe, type FilListe, type TypeQuestion } from "@/lib/espace/questions";
import { PAGE_ADMIN_QUESTIONS, PAGE_MES_QUESTIONS, SITE_QUESTIONS } from "@/lib/espace/questions-chemins";

export type EnvoyerEmail = (to: string, subject: string, text: string, options: { replyTo: string; idempotencyKey: string }) => Promise<void>;

const DELAI_MS = 5_000;

/** Notification interne d'un message de l'abonné (nouveau fil ou « Continuer »). Lève en cas d'échec. */
export async function notifierEquipe(p: { type: TypeQuestion; message: string; replyTo: string; cle: string; envoyer: EnvoyerEmail }): Promise<void> {
  const objet = nettoyerEnTete(NOTIFICATION_EQUIPE.objet(TEXTES_QUESTIONS.types[p.type].nom, horodatageParis(Date.now())));
  await avecDelai(
    p.envoyer(QUESTION_EQUIPE_DESTINATAIRE, objet, NOTIFICATION_EQUIPE.corps(p.message, `${SITE_QUESTIONS}${PAGE_ADMIN_QUESTIONS}`), {
      replyTo: nettoyerEnTete(p.replyTo),
      idempotencyKey: `mes-questions/${p.cle}`,
    }),
    DELAI_MS,
    "Notification de Mes questions",
  );
}

export interface FilEquipe extends FilListe {
  email: string;
  sceneOu: string | null;
  sceneBut: string | null;
}

/** Fils pour l'outil : en attente d'abord (le plus ancien en premier), puis les 50 derniers répondus. */
export async function listerPourEquipe(maintenant: Date = new Date()) {
  const selection = {
    id: true,
    type: true,
    statut: true,
    creeLe: true,
    dernierMessageLe: true,
    ouvertParAbonneLe: true,
    sceneOu: true,
    sceneBut: true,
    user: { select: { email: true } },
    messages: { select: { auteur: true, corps: true, creeLe: true }, orderBy: { creeLe: "asc" as const } },
  } as const;
  const [attente, repondus] = await Promise.all([
    prisma.equipeFil.findMany({ where: { statut: "EN_ATTENTE" }, select: selection, orderBy: { dernierMessageLe: "asc" } }),
    prisma.equipeFil.findMany({ where: { statut: "REPONDU" }, select: selection, orderBy: { dernierMessageLe: "desc" }, take: 50 }),
  ]);
  const fils: FilEquipe[] = [...attente, ...repondus].map((f) => ({ ...versListe(f, maintenant), email: f.user.email, sceneOu: f.sceneOu, sceneBut: f.sceneBut }));
  const enRetard = fils.filter((f) => f.enRetard).length;
  return { fils, attente: attente.length, enRetard, alerte: attente.length > ALERTE_ATTENTE || enRetard > 0 };
}

export type EtatEmail = "envoye" | "brouillon" | "adresse" | "echec";

/**
 * Réponse de l'équipe : ENREGISTRÉE d'abord (message EQUIPE, fil « répondu »), puis l'e-mail de réponse
 * à l'adresse du compte lue en base. Fil introuvable : null. L'échec de l'e-mail n'efface rien.
 */
export async function repondre(filId: string, corps: string, envoyer: EnvoyerEmail, maintenant: Date = new Date()): Promise<{ email: EtatEmail } | null> {
  const fil = await prisma.equipeFil.findUnique({ where: { id: filId }, select: { id: true, user: { select: { email: true } } } });
  if (!fil) return null;
  const [message] = await prisma.$transaction([
    prisma.equipeMessage.create({ data: { filId, auteur: "EQUIPE", corps, creeLe: maintenant }, select: { id: true } }),
    prisma.equipeFil.update({ where: { id: filId }, data: { statut: "REPONDU", dernierMessageLe: maintenant } }),
  ]);
  if (!ESPACE_CLIENT_PUBLIE || !EMAIL_REPONSE_VALIDE) return { email: "brouillon" };
  const destinataire = adresseReponse(fil.user.email);
  if (!destinataire) return { email: "adresse" };
  try {
    await avecDelai(
      envoyer(destinataire, nettoyerEnTete(EMAIL_REPONSE_BROUILLON.objet), EMAIL_REPONSE_BROUILLON.corps(corps, `${SITE_QUESTIONS}${PAGE_MES_QUESTIONS}`), {
        replyTo: QUESTION_EQUIPE_DESTINATAIRE,
        idempotencyKey: `mes-questions-reponse/${message.id}`,
      }),
      DELAI_MS,
      "E-mail de réponse de Mes questions",
    );
  } catch {
    return { email: "echec" };
  }
  await prisma.equipeMessage.update({ where: { id: message.id }, data: { emailEnvoyeLe: new Date() } });
  return { email: "envoye" };
}

/** Étiquette de scène (deux valeurs au plus, listes fermées validées par la route). Fil introuvable : false. */
export async function etiqueter(filId: string, scene: { sceneOu: string | null; sceneBut: string | null }): Promise<boolean> {
  const { count } = await prisma.equipeFil.updateMany({ where: { id: filId }, data: scene });
  return count > 0;
}

/**
 * Recopie d'un échange fait hors de l'outil (2.6 : « toute réponse faite hors de l'outil y est recopiée,
 * avec la question ») : fil « répondu » avec la question et la réponse, AUCUN e-mail. Compte retrouvé par
 * son adresse ; inconnu : null.
 */
export async function recopier(p: { email: string; type: TypeQuestion; question: string; reponse: string; cle: string }): Promise<{ id: string } | null> {
  const compte = await prisma.user.findUnique({ where: { email: p.email }, select: { id: true } });
  if (!compte) return null;
  const maintenant = new Date();
  const fil = await prisma.equipeFil.create({
    data: {
      userId: compte.id,
      type: p.type,
      statut: "REPONDU",
      cle: p.cle,
      creeLe: maintenant,
      dernierMessageLe: maintenant,
      messages: {
        create: [
          { auteur: "ABONNE", corps: p.question, creeLe: maintenant },
          { auteur: "EQUIPE", corps: p.reponse, creeLe: new Date(maintenant.getTime() + 1) },
        ],
      },
    },
    select: { id: true },
  });
  return fil;
}
