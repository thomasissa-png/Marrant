import type { Metadata } from "next";
import Link from "next/link";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { FaqSection } from "@/components/home/faq-section";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Parcours humour — deviens drôle et développe ta répartie pas à pas",
  description:
    "Parcours structurés pour devenir drôle, avoir de la répartie et retrouver confiance en soi. Parcours Machine à Café (3 semaines) pour briller au bureau, Répartie (4 semaines) pour ne plus rester muet, Confiance (6 semaines) pour retrouver ta légèreté. Progresse à ton rythme.",
  alternates: { canonical: "https://deviens-marrant.fr/parcours" },
};

export default function ParcoursPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Parcours", url: "https://deviens-marrant.fr/parcours" },
        ])}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: "Parcours Machine à Café — Deviens drôle au bureau",
          description:
            "Apprends à avoir des blagues et anecdotes à ressortir au bureau et en afterwork en 3 semaines.",
          duration: "3 semaines",
        })}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: "Parcours Répartie — Aie toujours une réponse prête",
          description:
            "Développe ta répartie en 4 semaines avec des techniques concrètes pour ne plus rester muet.",
          duration: "4 semaines",
        })}
      />
      <JsonLd
        data={buildCourseJsonLd({
          name: "Parcours Confiance — Retrouve ton humour et ta légèreté",
          description:
            "Parcours de 6 semaines pour retrouver confiance en soi grâce à l'humour après une période difficile.",
          duration: "6 semaines",
        })}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Parcours</span>
      </nav>
      <ParcoursContent />

      {/* FAQ */}
      <div className="mt-16">
        <FaqSection />
      </div>
    </div>
  );
}
