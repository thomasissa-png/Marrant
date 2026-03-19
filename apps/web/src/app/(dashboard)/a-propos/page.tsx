import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  authorPersonJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "L'humour s'apprend — notre mission",
  description:
    "L'humour, ça s'apprend. On a créé deviens-marrant.fr pour le prouver : vannes, techniques de répartie, vidéos analysées. Objectif : que tu fasses rire ce soir.",
  keywords: [
    "deviens-marrant.fr",
    "plateforme humour francophone",
    "apprendre humour en ligne",
    "formation stand-up français",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/a-propos" },
};

const aboutFaqs = [
  {
    question: "Est-ce que deviens-marrant.fr est fait pour les débutants ?",
    answer:
      "Oui. La majorité de nos membres n'avaient aucune expérience en humour ou en répartie avant de rejoindre la plateforme. Nos parcours commencent au niveau zéro et progressent étape par étape.",
  },
  {
    question: "Quelles techniques d'humour sont enseignées ?",
    answer:
      "On enseigne l'observation, le timing, l'autodérision, la répartie, le storytelling et les jeux de mots — les mêmes techniques utilisées par les humoristes professionnels comme Paul Mirabel, Fary et Blanche Gardin.",
  },
  {
    question: "Combien de temps faut-il pour progresser en humour ?",
    answer:
      "Les premiers résultats arrivent vite : en 2 à 4 semaines de pratique régulière, tu verras une différence dans tes conversations. Nos parcours les plus courts durent 3 semaines, les plus complets 6 semaines. Une étude du Journal of Positive Psychology montre qu'en 8 semaines d'entraînement structuré, la progression est significative.",
  },
];

export default function AProposPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "À propos", url: "https://deviens-marrant.fr/a-propos" },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(aboutFaqs)} />
      <JsonLd data={authorPersonJsonLd} />
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
          un don réservé à quelques élus, mais un muscle que tout le monde
          peut entraîner.
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
          <h2 className="font-display text-2xl font-bold">Notre méthode</h2>
          <p className="mt-3 text-text-secondary">
            Notre approche repose sur 3 principes issus de la pédagogie du
            stand-up et de la psychologie positive :
          </p>
          <ol className="mt-4 space-y-3 text-text-secondary list-decimal list-inside">
            <li>
              <strong>Observer avant de produire</strong> — on entraîne
              d&apos;abord le regard (repérer l&apos;absurde du quotidien)
              avant de passer à la création de vannes.
            </li>
            <li>
              <strong>Pratiquer dans des situations réelles</strong> — chaque
              conseil inclut un défi concret à tester aujourd&apos;hui, pas
              dans 3 mois.
            </li>
            <li>
              <strong>Progresser par itération</strong> — comme un humoriste
              qui rode son set en open mic, on ajuste grâce au feedback et à
              la répétition.
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">L&apos;équipe</h2>
          <p className="mt-3 text-text-secondary">
            deviens-marrant.fr est fondé par <strong>Alex Durand</strong>,
            passionné de stand-up et de pédagogie. Après des années à
            décortiquer les techniques des meilleurs humoristes français, il a
            créé cette plateforme pour rendre l&apos;humour accessible à tous
            — pas juste à ceux qui sont &quot;nés drôles&quot;.
          </p>
          <p className="mt-3 text-text-secondary">
            L&apos;équipe combine culture stand-up, pédagogie et technologie
            pour créer la meilleure expérience d&apos;apprentissage de
            l&apos;humour en ligne. Chaque vanne, chaque conseil, chaque vidéo
            passe un test simple avant d&apos;être publié : &quot;est-ce que
            je la sors ce soir en soirée ?&quot;
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Questions fréquentes</h2>
          <dl className="mt-4 space-y-4">
            {aboutFaqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-border bg-background-card p-4">
                <dt className="text-sm font-semibold text-text-primary">{faq.question}</dt>
                <dd className="mt-2 text-sm text-text-secondary">{faq.answer}</dd>
              </div>
            ))}
          </dl>
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
            Rejoins les membres qui progressent en humour chaque jour.
            Ton futur toi drôle t&apos;attend.
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
