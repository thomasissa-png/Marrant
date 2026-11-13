/**
 * Côté base du moteur des cartes (s24, lot D5) : lecture de la rafale du jour, réponses et choix.
 * Règles : `lib/espace/rafale.ts` (tirage) et `lib/espace/revision.ts` (retours). Tables `CarteSuivi`
 * et `CarteReponse` (migration 23).
 *
 * Ce que la rafale ne fait JAMAIS : appeler `recordPractice` (la série ne compte que les étapes et les
 * quiz d'étape, C4), toucher aux XP ou au cap, écrire un texte de l'abonné (aucun champ libre ici),
 * journaliser une réponse. La note « ma réplique à moi » n'est lue qu'APRÈS la réponse,
 * et renvoyée dans la réponse de l'API (jamais dans la page avant) ; « Ta réplique la dernière fois »
 * ne s'affiche que sur une carte de révision.
 */
import { prisma } from "@/lib/prisma";
import type { AccesEspace } from "@/lib/espace/garde";
import { chargeursFiches } from "@/lib/espace/fiches";
import { ENTREES_QUIZ } from "@/lib/espace/premier-pas";
import { cartesCarnetRafale, carnetEnRetard } from "@/lib/espace/carnet-cartes";
import { lireReplique } from "@/lib/espace/repliques";
import { lireRetour } from "@/lib/espace/fiche-fait";
import type { RetourGeste } from "@/lib/espace/retours";
import {
  cartesDesSituations,
  composerRafale,
  ficheDeCarte,
  jourParis,
  type CarteRafale,
  type RafaleDuJour,
} from "@/lib/espace/rafale";
import {
  dateDansJours,
  echeanceApresChoix,
  echeanceApresReponse,
  type ReponseCarte,
} from "@/lib/espace/revision";

export const ENTREES_RAFALE: readonly string[] = Object.values(ENTREES_QUIZ);

/** Catalogue des cartes servi à l'abonné : situations neuves, puis carnet (après G5). */
export function catalogueCartes(acces: AccesEspace): CarteRafale[] {
  const situations = chargeursFiches.listerFiches("situation", acces);
  if (acces.acces !== "ouvert") return [];
  return [...cartesDesSituations(situations), ...cartesCarnetRafale()];
}

/** Fenêtre de lecture des réponses « du jour » (le filtre exact se fait au jour de Paris). */
const DEUX_JOURS = 2 * 86_400_000;

export interface EtatRafale extends RafaleDuJour {
  catalogue: Map<string, CarteRafale>;
  /** Repère neutre « {n} cartes cette semaine » (4.4 a). */
  cetteSemaine: number;
}

/** Début de la semaine (lundi, jour de Paris) contenant `maintenant`. */
export function lundiParis(maintenant: Date): string {
  const jour = jourParis(maintenant);
  const d = new Date(`${jour}T12:00:00Z`);
  const recul = (d.getUTCDay() + 6) % 7;
  return jourParis(new Date(d.getTime() - recul * 86_400_000));
}

export async function lireRafale(
  userId: string,
  acces: AccesEspace,
  maintenant: Date = new Date(),
): Promise<EtatRafale> {
  const catalogue = catalogueCartes(acces);
  const [suivis, recentes, compte, nbOui, semaine] = await Promise.all([
    prisma.carteSuivi.findMany({
      where: { userId },
      select: { carteId: true, dueLe: true, premiereVueLe: true },
    }),
    prisma.carteReponse.findMany({
      where: {
        userId,
        repondueLe: { gte: new Date(maintenant.getTime() - DEUX_JOURS) },
      },
      select: { carteId: true, revision: true, repondueLe: true },
      orderBy: { repondueLe: "asc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription: { select: { createdAt: true } },
        espaceCompte: { select: { aise: true, rencontreServieLe: true } },
      },
    }),
    prisma.carteReponse.count({ where: { userId, reponse: "OUI" } }),
    prisma.carteReponse.findMany({
      where: {
        userId,
        repondueLe: { gte: new Date(maintenant.getTime() - 8 * 86_400_000) },
      },
      select: { repondueLe: true },
    }),
  ]);
  const jour = jourParis(maintenant);
  const lundi = lundiParis(maintenant);
  const reponsesDuJour = recentes
    .filter((r) => jourParis(r.repondueLe) === jour)
    .map((r) => ({
      carteId: r.carteId,
      nouvelle: !r.revision && /(\.c1|^carnet-.*)$/.test(r.carteId),
    }));
  const rafale = composerRafale({
    catalogue,
    entrees: ENTREES_RAFALE,
    suivis,
    reponsesDuJour,
    debutAbonnement: compte?.subscription?.createdAt ?? null,
    nbOui,
    aisePlaire: compte?.espaceCompte?.aise === "PLAIRE",
    rencontreServie: Boolean(compte?.espaceCompte?.rencontreServieLe),
    carnetEnRetard: carnetEnRetard(),
    maintenant,
  });
  return {
    ...rafale,
    catalogue: new Map(catalogue.map((c) => [c.id, c])),
    cetteSemaine: semaine.filter((r) => jourParis(r.repondueLe) >= lundi)
      .length,
  };
}

export type ResultatReponse =
  | {
      ok: true;
      revision: boolean;
      replique: string | null;
      retour: RetourGeste | null;
    }
  | { ok: false; erreur: "introuvable" | "hors-rafale" };

/**
 * Ce que la carte reçoit APRÈS la réponse, jamais avant : la note « ma réplique à moi » de la fiche
 * (pré-remplie sous le geste ; affichée « Ta réplique la dernière fois » sur une carte de révision) et
 * le retour déjà déclaré (« Fait »).
 */
async function apresReponse(
  userId: string,
  carteId: string,
): Promise<{ replique: string | null; retour: RetourGeste | null }> {
  const ficheId = ficheDeCarte(carteId);
  const [replique, retour] = await Promise.all([
    lireReplique(userId, ficheId),
    lireRetour(userId, ficheId),
  ]);
  return { replique, retour };
}

/**
 * « Tu avais une réponse ? » : une ligne `CarteReponse` (idempotente par `cle`), suivi mis à jour.
 * Seules les cartes de la rafale du jour (ou déjà jouées aujourd'hui) sont acceptées.
 */
export async function enregistrerReponse(
  userId: string,
  acces: AccesEspace,
  carteId: string,
  saisie: { reponse: ReponseCarte; cle: string; compteARebours: number | null },
  maintenant: Date = new Date(),
): Promise<ResultatReponse> {
  const etat = await lireRafale(userId, acces, maintenant);
  const carte = etat.catalogue.get(carteId);
  if (!carte) return { ok: false, erreur: "introuvable" };

  const deja = await prisma.carteReponse.findUnique({
    where: { userId_cle: { userId, cle: saisie.cle } },
    select: { carteId: true, revision: true },
  });
  if (deja) {
    if (deja.carteId !== carteId) return { ok: false, erreur: "hors-rafale" };
    return {
      ok: true,
      revision: deja.revision,
      ...(await apresReponse(userId, carteId)),
    };
  }
  const prevue = etat.cartes.some((c) => c.carteId === carteId);
  if (!prevue) return { ok: false, erreur: "hors-rafale" };

  const suivi = await prisma.carteSuivi.findUnique({
    where: { userId_carteId: { userId, carteId } },
    select: { nbRates: true },
  });
  const revision = suivi !== null;
  const { jours, etapeRate } = echeanceApresReponse(
    saisie.reponse,
    revision,
    suivi?.nbRates ?? 0,
  );
  const dueLe = dateDansJours(maintenant, jours);
  const rencontre =
    carte.genre === "registre" && carte.univers === "rencontre" && !revision;

  try {
    await prisma.$transaction([
      prisma.carteReponse.create({
        data: {
          userId,
          carteId,
          reponse: saisie.reponse,
          compteARebours: saisie.compteARebours,
          revision,
          cle: saisie.cle,
          repondueLe: maintenant,
        },
      }),
      prisma.carteSuivi.upsert({
        where: { userId_carteId: { userId, carteId } },
        update: {
          derniereReponse: saisie.reponse,
          dueLe,
          nbRevues: { increment: 1 },
          nbRates: etapeRate,
        },
        create: {
          userId,
          carteId,
          derniereReponse: saisie.reponse,
          dueLe,
          nbRates: etapeRate,
          premiereVueLe: maintenant,
        },
      }),
      ...(rencontre
        ? [
            prisma.espaceCompte.updateMany({
              where: { userId, aise: "PLAIRE", rencontreServieLe: null },
              data: { rencontreServieLe: maintenant },
            }),
          ]
        : []),
    ]);
  } catch (error) {
    // Double clic simultané : la base refuse la seconde ligne (clé unique) ; même réponse que la première.
    if ((error as { code?: unknown })?.code !== "P2002") throw error;
    return { ok: true, revision, ...(await apresReponse(userId, carteId)) };
  }
  return { ok: true, revision, ...(await apresReponse(userId, carteId)) };
}

export type ResultatChoix =
  | { ok: true; juste: boolean }
  | { ok: false; erreur: "introuvable" };

/** Choix d'une carte « Quel registre ? » après la réponse (même `cle`) : `choixJuste` posé une fois. */
export async function enregistrerChoix(
  userId: string,
  acces: AccesEspace,
  carteId: string,
  saisie: { cle: string; choix: "sure" | "joueuse" | "risquee" },
  maintenant: Date = new Date(),
): Promise<ResultatChoix> {
  const carte = catalogueCartes(acces).find((c) => c.id === carteId);
  if (!carte || carte.genre !== "registre")
    return { ok: false, erreur: "introuvable" };
  const ligne = await prisma.carteReponse.findUnique({
    where: { userId_cle: { userId, cle: saisie.cle } },
    select: { id: true, carteId: true, choixJuste: true },
  });
  if (!ligne || ligne.carteId !== carteId)
    return { ok: false, erreur: "introuvable" };
  if (typeof ligne.choixJuste === "boolean")
    return { ok: true, juste: ligne.choixJuste };

  const juste = saisie.choix === carte.bonneReponse;
  const suivi = await prisma.carteSuivi.findUnique({
    where: { userId_carteId: { userId, carteId } },
    select: { dueLe: true, nbRates: true },
  });
  const joursActuels = suivi?.dueLe
    ? Math.max(
        0,
        Math.round((suivi.dueLe.getTime() - maintenant.getTime()) / 86_400_000),
      )
    : null;
  const { jours, etapeRate } = echeanceApresChoix(
    juste,
    joursActuels,
    suivi?.nbRates ?? 0,
  );
  await prisma.$transaction([
    prisma.carteReponse.update({
      where: { id: ligne.id },
      data: { choixJuste: juste },
    }),
    prisma.carteSuivi.update({
      where: { userId_carteId: { userId, carteId } },
      data: {
        dueLe:
          jours === joursActuels
            ? (suivi?.dueLe ?? null)
            : dateDansJours(maintenant, jours),
        nbRates: etapeRate,
      },
    }),
  ]);
  return { ok: true, juste };
}
