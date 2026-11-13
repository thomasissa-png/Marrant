import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
import { lireLettre } from "@/lib/espace/lettres";
import { NOT_FOUND_ROBOTS } from "@/lib/seo-meta";
import { LettreVue } from "@/components/espace/archive-lettres";

/**
 * Une lettre de l'archive (s24, lot D6 ; architecture v20 2.8) : telle qu'envoyée aux abonnés, sans
 * invitation ni prix. Numéro inconnu ou lettre pas encore envoyée : la vraie 404 du site, identique à une
 * adresse inexistante (rien ne dit qu'une lettre arrive). Rendu : SSR dynamique. Garde EN PREMIER.
 */
export const dynamic = "force-dynamic";

const lettreDeLaPage = cache(async (numero: string) => {
  await garderEspace(`/mon-espace/lettres/${numero}`);
  return lireLettre(prisma, numero);
});

export async function generateMetadata({ params }: { params: { numero: string } }): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  const lettre = await lettreDeLaPage(params.numero);
  return lettre ? { title: lettre.titre } : { title: "Page introuvable", ...NOT_FOUND_ROBOTS };
}

export default async function LettrePage({ params }: { params: { numero: string } }) {
  const lettre = await lettreDeLaPage(params.numero);
  if (!lettre) notFound();
  return (
    <div className="pb-12 lg:max-w-lecture">
      <LettreVue lettre={lettre} />
    </div>
  );
}
