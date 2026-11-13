import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { OutilQuestions } from "@/components/espace/questions/outil-equipe";

/**
 * Outil de l'équipe pour « Mes questions » (s24, lot D7), même gabarit et même accès que `admin/social`
 * (mot de passe admin, puis `Authorization: Bearer` sur `api/admin/questions-equipe`). Interrupteur de
 * l'espace fermé : adresse inexistante (le middleware la réécrit vers la 404 naturelle ; `notFound()` en
 * second rempart). Jamais indexée. Rendu : client (outil interactif), aucune donnée au premier rendu.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: "Mes questions, outil de l'équipe", robots: { index: false, follow: false } } : METADONNEES_404;
}

export default function AdminQuestionsPage() {
  if (!ESPACE_CLIENT_PUBLIE) notFound();
  return <OutilQuestions />;
}
