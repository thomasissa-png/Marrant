import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "À propos — qui sommes-nous ?",
  description:
    "Découvre l'équipe derrière deviens-marrant.fr, la plateforme francophone pour apprendre l'humour, la répartie et le storytelling.",
  keywords: [
    "deviens-marrant.fr",
    "plateforme humour francophone",
    "apprendre humour en ligne",
    "formation stand-up français",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/a-propos" },
};

export default function AProposPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "À propos", url: "https://deviens-marrant.fr/a-propos" },
        ])}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">À propos</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          À propos de deviens-marrant.fr
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          deviens-marrant.fr est la première plateforme francophone dédiée à
          l&apos;apprentissage de l&apos;humour, de la répartie et du
          storytelling. Notre mission : prouver que l&apos;humour n&apos;est pas
          un talent inné, mais une compétence qui se travaille.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Notre mission</h2>
          <p className="mt-3 text-text-secondary">
            Tout le monde a le droit d&apos;être drôle. Que tu sois étudiant
            timide qui veut avoir de la répartie, jeune actif en quête de
            conversation à la machine à café, ou en reconstruction et en quête
            de légèreté — on a conçu des parcours pour toi.
          </p>
          <p className="mt-3 text-text-secondary">
            On s&apos;appuie sur les techniques des meilleurs humoristes
            français (Fary, Paul Mirabel, Roman Frayssinet, Blanche Gardin, Waly
            Dia), les principes de la psychologie positive et des exercices
            concrets testés par notre communauté de 1 500+ membres.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">
            Pourquoi deviens-marrant.fr ?
          </h2>
          <ul className="mt-4 space-y-3 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span>
                <strong>Des centaines de vannes</strong> classées par catégorie,
                prêtes à ressortir en soirée, au bureau ou entre amis
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span>
                <strong>Des techniques de répartie</strong> concrètes avec
                exemples et exercices à tester dès aujourd&apos;hui
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span>
                <strong>Des vidéos de stand-up analysées</strong> — chaque
                technique décryptée pour que tu puisses l&apos;appliquer
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span>
                <strong>Des parcours structurés</strong> de 3 à 6 semaines pour
                progresser pas à pas avec des XP et des streaks
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span>
                <strong>Un blog</strong> avec des guides complets sur
                l&apos;humour, la répartie et le storytelling
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">L&apos;équipe</h2>
          <p className="mt-3 text-text-secondary">
            deviens-marrant.fr est fondé par une équipe de passionnés d&apos;humour,
            convaincus que le rire est le meilleur outil de connexion sociale.
            On combine expertise en pédagogie, en stand-up et en
            technologie pour créer la meilleure expérience d&apos;apprentissage
            de l&apos;humour en ligne.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Contact</h2>
          <p className="mt-3 text-text-secondary">
            Une question, une suggestion, un partenariat ? Écris-nous à{" "}
            <a
              href="mailto:contact@deviens-marrant.fr"
              className="font-medium text-accent-primary hover:underline"
            >
              contact@deviens-marrant.fr
            </a>
          </p>
        </section>

        <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
          <p className="font-display text-xl font-bold text-text-primary">
            Prêt à devenir plus drôle ?
          </p>
          <p className="mt-2 text-text-secondary">
            Rejoins 1 500+ membres qui progressent en humour chaque jour.
          </p>
          <Link href="/register" className="mt-4 inline-block">
            <Button variant="primary" size="lg">
              Commencer à 0,99 €/mois
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
