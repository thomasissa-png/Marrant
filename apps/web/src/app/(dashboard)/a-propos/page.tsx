import type { Metadata } from "next";
import Link from "next/link";
import { stripEmDashes } from "@/lib/em-dash";
import { Button } from "@/components/ui/button";
import { AuthCta } from "@/components/auth/auth-cta";
import { PARCOURS_MAX_WEEKS, PARCOURS_MIN_WEEKS } from "@/config/premium";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  authorPersonJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "L'humour s'apprend — notre mission",
  description:
    "L'humour, ça s'apprend : on a créé deviens-marrant.fr pour le prouver, avec des vannes, des techniques de répartie et du stand-up décortiqué pour faire rire.",
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
      "Oui, c'est même pour eux qu'on l'a construit. La majorité de nos membres n'avaient aucune expérience en humour ou en répartie avant de rejoindre la plateforme. Les parcours partent du niveau zéro et avancent étape par étape, sans jamais te pousser sur scène.",
  },
  {
    question: "Quelles techniques d'humour sont enseignées ?",
    answer:
      "On enseigne l'observation, le timing, l'autodérision, la répartie, le storytelling et les jeux de mots — les mêmes techniques utilisées par les pros de la scène.",
  },
  {
    question: "Combien de temps faut-il pour progresser en humour ?",
    answer:
      `Les premiers résultats arrivent vite : en 2 à 4 semaines de pratique régulière, tu verras une différence dans tes conversations. Nos parcours les plus courts durent ${PARCOURS_MIN_WEEKS} semaines, les plus complets ${PARCOURS_MAX_WEEKS} semaines. Côté recherche, une étude de Crawford et Caltabiano (2011, Journal of Positive Psychology) montre qu'un programme d'humour de 8 semaines améliore significativement le bien-être émotionnel.`,
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
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">À propos</span>
        </nav>

        <h1 className="font-display text-3xl font-bold md:text-4xl">
          À propos <span className="whitespace-nowrap">de deviens-marrant.fr</span>
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          deviens-marrant.fr est la première plateforme francophone dédiée à
          l&apos;apprentissage de l&apos;humour, de la répartie et du
          storytelling. Notre mission : prouver que l&apos;humour n&apos;est pas
          un don tombé du ciel sur quelques chanceux, mais un muscle que tout
          le monde peut entraîner, toi compris.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Notre mission</h2>
          <p className="mt-3 text-text-secondary">
            Tout le monde a le droit d&apos;être drôle, y compris ceux qui
            répètent leur blague trois fois dans leur tête avant de renoncer à
            la dire. Étudiant timide qui veut de la répartie, jeune actif qui
            sèche à la machine à café, ou en train de tourner une page et à la
            recherche d&apos;un peu de légèreté : il y a un parcours pensé pour toi.
          </p>
          <p className="mt-3 text-text-secondary">
            On s&apos;appuie sur les techniques des meilleurs humoristes
            français, les principes de la psychologie positive et des exercices
            concrets que 1&nbsp;500+ membres mettent en pratique.
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
                <strong>Un catalogue de vannes</strong> classées par catégorie,
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
                <strong>Des vidéos de stand-up analysées</strong>&nbsp;: chaque
                technique décryptée pour que tu puisses l&apos;appliquer
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <span>
                <strong>Des parcours structurés</strong> de {PARCOURS_MIN_WEEKS} à {PARCOURS_MAX_WEEKS} semaines pour
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
          <h2 className="font-display text-2xl font-bold">Notre approche</h2>
          <p className="mt-3 text-text-secondary">
            Tout repose sur 3 principes issus de la pédagogie du
            stand-up et de la psychologie positive :
          </p>
          <ol className="mt-4 list-outside list-decimal space-y-3 pl-6 text-text-secondary">
            <li>
              <strong>Observer avant de produire</strong>&nbsp;: on entraîne
              d&apos;abord le regard (repérer l&apos;absurde du quotidien)
              avant de passer à la création de vannes.
            </li>
            <li>
              <strong>Pratiquer dans des situations réelles</strong>&nbsp;: chaque
              conseil inclut un défi concret à tester aujourd&apos;hui, pas
              dans 3 mois.
            </li>
            <li>
              <strong>Roder, comme en open mic</strong>&nbsp;: un humoriste teste
              son set soir après soir : ce qui fait rire reste, ce qui fait un
              blanc saute. Tu avances de la même façon, essai après essai.
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">L&apos;équipe</h2>
          <p className="mt-3 text-text-secondary">
            deviens-marrant.fr est fondé par <strong>Alex Durand</strong>,
            passionné de stand-up et de pédagogie. Après des années à
            décortiquer les techniques des meilleurs humoristes français, il a
            créé cette plateforme pour rendre l&apos;humour accessible à tous,
            pas juste à ceux qui sont &quot;nés drôles&quot;.
          </p>
          <p className="mt-3 text-text-secondary">
            L&apos;équipe mélange culture stand-up et pédagogie, avec une
            obsession : que ce que tu lis ici te serve dès ce soir. Chaque
            vanne, chaque conseil, chaque vidéo
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
                <dd className="mt-2 text-sm text-text-secondary">{stripEmDashes(faq.answer)}</dd>
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
              className="font-medium text-accent-link underline underline-offset-2"
            >
              contact@deviens-marrant.fr
            </a>
          </p>
        </section>

        <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
          {/* Une phrase par ligne, même découpe que le H1 de l'accueil (hero-section.tsx). */}
          <p className="font-display text-xl font-bold text-text-primary">
            <span className="block">Tu parles et personne rit.</span>
            <span className="block">On va arranger ça.</span>
          </p>
          <p className="mt-2 text-text-secondary">
            Rejoins les 1&nbsp;500+ membres qui s&apos;entraînent un peu chaque jour.
            La prochaine vanne qui fait rire la pièce ? Elle peut être la tienne.
          </p>
          {/* Étalon 1.2 validé par Thomas (s15), aligné sur l'accueil : inscription (étape 1
              sur 2) puis paiement ouvert tout seul ; connecté : /abonnement. */}
          <div className="mt-4 inline-flex flex-col items-center gap-1">
            <AuthCta label="Accéder aux parcours complets" src="a-propos" />
            <p className="max-w-md text-balance text-sm text-text-muted">
              2,99 €/mois, sans engagement. La première étape de chaque parcours reste en lecture libre.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
