/**
 * Lignes de fiches des listes de l'espace (s24, lot D6 : « Quoi répondre », Bibliothèque, coin) : titre,
 * adresse unique de la fiche (une seule porte, `hrefFiche`), durée et statut « Voir » / « Fait » (2.7 point
 * 8, `FicheFait` du lot D5, lu en une requête). Aucun texte de fiche au-delà du titre.
 */
import { prisma } from "@/lib/prisma";
import { hrefFiche } from "@/lib/espace/premier-pas";
import type { Fiche } from "@/lib/espace/fiches-schema";
import type { BonusOuvert } from "@/lib/espace/bonus";

export interface LigneFiche {
  id: string;
  /** Titre affiché (préfixe de type compris quand la liste en pose un). */
  titre: string;
  href: string;
  minutes: number;
  fait: boolean;
  /** « Bonus du cap N · {nom} » (bonus ouverts seulement). */
  marque?: string;
}

/** Ids des fiches marquées « Fait » par l'abonné, parmi `ids`. */
export async function idsFaits(userId: string, ids: readonly string[]): Promise<Set<string>> {
  if (ids.length === 0) return new Set();
  const lignes = await prisma.ficheFait.findMany({ where: { userId, ficheId: { in: [...ids] } }, select: { ficheId: true } });
  return new Set(lignes.map((l) => l.ficheId));
}

/** Ligne d'une fiche ; `prefixe` : « Comment c'est construit », etc. (maquette `bibliotheque.html`). */
export function ligneDeFiche(fiche: Fiche, faits: ReadonlySet<string>, prefixe?: string): LigneFiche {
  return {
    id: fiche.id,
    titre: prefixe ? `${prefixe} : ${fiche.titre}` : fiche.titre,
    href: hrefFiche(fiche.type, fiche.id),
    minutes: fiche.dureeMinutes,
    fait: faits.has(fiche.id),
  };
}

/** Ligne d'un bonus ouvert : marqué, rangé comme une fiche ordinaire (3.13). */
export function ligneDeBonus(bonus: BonusOuvert, faits: ReadonlySet<string>, marque: string): LigneFiche {
  return { id: bonus.id, titre: bonus.titre, href: bonus.href, minutes: bonus.dureeMinutes, fait: faits.has(bonus.id), marque };
}
