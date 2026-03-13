import type { Metadata } from "next";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { FaqSection } from "@/components/home/faq-section";

export const metadata: Metadata = {
  title: "Parcours | Apprends l'humour pas à pas",
  description:
    "Parcours structurés pour progresser en humour, répartie et conversation. Choisis ton parcours et progresse semaine après semaine.",
};

export default function ParcoursPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <ParcoursContent />

      {/* FAQ */}
      <div className="mt-16">
        <FaqSection />
      </div>
    </div>
  );
}
