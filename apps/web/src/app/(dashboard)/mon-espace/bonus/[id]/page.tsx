import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
import { lireCapDeblocage } from "@/lib/espace/caps-serveur";
import { trouverBonusOuvert } from "@/lib/espace/bonus";
import { FicheBonusVue } from "@/components/espace/bonus/fiche-bonus";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";

/**
 * Fiche d'un bonus de cap (s24, lot D4 ; niveaux-xp-s24.md 5.4, critère 19). Rendu : dynamique à
 * chaque requête (layout `force-dynamic`, `noindex`), jamais en cache.
 *
 * Interrupteur fermé : 404 (layout, puis middleware). Ouvert : garde (session, plan relu en base).
 * Bonus non ouvert (cap de DÉBLOCAGE non atteint), inconnu ou pas encore rangé : `notFound()`, la vraie
 * 404 du site (`app/not-found.tsx`) avec SON head (titre « Page introuvable », robots de la 404 : Next 14
 * n'applique pas les métadonnées de `not-found.tsx` à un `notFound()` levé dans une page imbriquée),
 * réponse identique à une adresse inexistante ; jamais « s'ouvre au cap N » ni « il te manque ».
 */
const bonusDeLaPage = cache(async (id: string) => {
  const { userId } = await garderEspace(`/mon-espace/bonus/${id}`);
  return trouverBonusOuvert(id, await lireCapDeblocage(prisma, userId), { acces: "ouvert", userId });
});

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const bonus = await bonusDeLaPage(params.id);
  return bonus ? { title: bonus.titre } : { title: "Page introuvable", ...NOT_FOUND_ROBOTS };
}

export default async function BonusPage({ params }: { params: { id: string } }) {
  const bonus = await bonusDeLaPage(params.id);
  if (!bonus) notFound();
  return <FicheBonusVue bonus={bonus} />;
}
