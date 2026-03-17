import type { Metadata } from "next";
import { ParcoursDetail } from "@/components/parcours/parcours-detail";

export const metadata: Metadata = {
  title: "Parcours — deviens-marrant.fr",
  description: "Progresse étape par étape dans ton parcours humour personnalisé.",
};

export default function ParcoursDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ParcoursDetail slug={params.slug} />
    </div>
  );
}
