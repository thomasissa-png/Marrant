/**
 * « Ma réplique à moi » (s24, lot D5 ; architecture v20 2.7, décision Q5b ; maquettes `carte-rafale.html`
 * et `mes-repliques.html`). Une phrase par abonné et par fiche à geste (`UserReplique`, migration 24).
 *
 * Règles dures :
 * - le texte n'est JAMAIS journalisé (`console`), ni écrit dans `UsageEvent`, ni envoyé à Umami ; en cas
 *   d'erreur, seul le nom de l'erreur est journalisé (`journaliserSansTexte`) ;
 * - l'outil d'admin ne lit pas ce modèle (test d'import : aucun fichier sous `api/admin` ni `admin/`) ;
 * - écriture (ajout, modification) : abonné actif seulement ; après la résiliation, lecture seule, la
 *   suppression reste possible ; la suppression du compte emporte tout (cascade et `deleteAccount`) ;
 * - jamais de « Fait » ni de points (C4) : écrire une note ne coche rien.
 * Plafond (arbitrage @ux D5 n°1, `docs/ux/arbitrages-d5-s24.md`) : une seule constante,
 * `REPLIQUE_MAX_CLIENT` (`components/espace/carte/limites.ts`), reprise ici et par la contrainte CHECK
 * de la migration 24 (1 à 200 caractères). Comptage en caractères (`Array.from`, comme `char_length` en
 * base) ; au-delà, 400, jamais de troncature silencieuse.
 */
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { AccesEspace } from "@/lib/espace/garde";
import { chargeursFiches } from "@/lib/espace/fiches";
import { FICHES_CARNET_RELUES, cartesCarnetRafale } from "@/lib/espace/carnet-cartes";
import type { CategorieToucher } from "@/lib/espace/vanne";
import type { UNIVERS } from "@/lib/espace/fiches-schema";
import { hrefFiche } from "@/lib/espace/premier-pas";
import { REPLIQUE_MAX_CLIENT } from "@/components/espace/carte/limites";

export const REPLIQUE_MAX = REPLIQUE_MAX_CLIENT;

/** Texte d'une réplique : non vide après nettoyage des bords, `REPLIQUE_MAX` caractères au plus. */
export const texteReplique = z
  .string()
  .trim()
  .min(1)
  .refine((t) => Array.from(t).length <= REPLIQUE_MAX);

/**
 * Correspondance CERTAINE entre catégories du toucher (vannes) et univers des fiches (2.7) : une ligne
 * « Tes répliques à toi pour {catégorie} » ne s'affiche que pour ces univers. « couple »,
 * « reunion-entretien » et les autres ne sont rattachés à aucune catégorie (correspondance incertaine).
 */
export const UNIVERS_PAR_CATEGORIE: Record<CategorieToucher, ReadonlyArray<(typeof UNIVERS)[number]>> = {
  soiree: ["soiree"],
  boulot: ["boulot"],
  famille: ["famille"],
  rencard: ["rencontre"],
};

/** Erreur journalisée sans aucun contenu de l'abonné (nom et code seulement). */
export function journaliserSansTexte(contexte: string, error: unknown): void {
  const e = error as { name?: unknown; code?: unknown } | null;
  const nom = typeof e?.name === "string" ? e.name : "Erreur";
  const code = typeof e?.code === "string" ? ` ${e.code}` : "";
  console.error(`[espace/${contexte}] échec : ${nom}${code}`);
}

export interface FicheDeReplique {
  ficheId: string;
  titre: string;
  href: string | null;
}

/** Fiche qui accepte une réplique : fiche à geste servie à l'abonné, ou carte d'une fiche relue du carnet (G5). */
export function ficheAcceptantReplique(
  ficheId: string,
  acces: AccesEspace,
  relues: ReadonlySet<string> = FICHES_CARNET_RELUES,
): FicheDeReplique | null {
  const fiche = chargeursFiches.trouverFiche(ficheId, acces);
  if (fiche) return fiche.geste ? { ficheId, titre: fiche.titre, href: hrefFiche(fiche.type, fiche.id) } : null;
  const carte = cartesCarnetRafale(relues).find((c) => c.ficheId === ficheId);
  return carte ? { ficheId, titre: carte.titre, href: "/carnet" } : null;
}

export async function lireReplique(userId: string, ficheId: string): Promise<string | null> {
  const r = await prisma.userReplique.findUnique({ where: { userId_ficheId: { userId, ficheId } }, select: { texte: true } });
  return r?.texte ?? null;
}

/** Ajout ou modification ; `true` si la réplique est nouvelle (compteur anonyme du lot D10). */
export async function enregistrerReplique(userId: string, ficheId: string, texte: string): Promise<boolean> {
  const avant = await prisma.userReplique.findUnique({ where: { userId_ficheId: { userId, ficheId } }, select: { id: true } });
  await prisma.userReplique.upsert({
    where: { userId_ficheId: { userId, ficheId } },
    update: { texte },
    create: { userId, ficheId, texte },
  });
  return !avant;
}

/** Suppression (abonné actif ou ancien abonné) ; sans effet si la réplique n'existe pas. */
export async function supprimerReplique(userId: string, ficheId: string): Promise<void> {
  await prisma.userReplique.deleteMany({ where: { userId, ficheId } });
}

export interface RepliqueListee {
  ficheId: string;
  texte: string;
  titre: string | null;
  href: string | null;
  modifieLe: string;
}

/** Répliques de l'abonné, la plus récente d'abord ; titre de la fiche si elle lui est servie. */
export async function listerRepliques(userId: string, acces: AccesEspace): Promise<RepliqueListee[]> {
  const lignes = await prisma.userReplique.findMany({
    where: { userId },
    select: { ficheId: true, texte: true, modifieLe: true },
    orderBy: { modifieLe: "desc" },
  });
  return lignes.map((l) => {
    const fiche = ficheAcceptantReplique(l.ficheId, acces);
    return { ficheId: l.ficheId, texte: l.texte, titre: fiche?.titre ?? null, href: fiche?.href ?? null, modifieLe: l.modifieLe.toISOString() };
  });
}

/** Répliques pour une catégorie du toucher (2.7) : fiches dont l'univers lui correspond avec certitude. */
export async function repliquesPourCategorie(userId: string, categorie: CategorieToucher, acces: AccesEspace): Promise<RepliqueListee[]> {
  const univers = UNIVERS_PAR_CATEGORIE[categorie];
  const toutes = await listerRepliques(userId, acces);
  return toutes.filter((r) => {
    const fiche = chargeursFiches.trouverFiche(r.ficheId, acces);
    return fiche !== null && "univers" in fiche && fiche.univers !== undefined && univers.includes(fiche.univers);
  });
}
