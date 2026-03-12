import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Parcours | Apprends l'humour pas à pas",
  description:
    "Parcours structurés pour progresser en humour, répartie et conversation. Choisis ton parcours et progresse semaine après semaine.",
};

const parcours = [
  {
    emoji: "⚡",
    title: "Parcours Répartie",
    duration: "4 semaines",
    difficulty: "DEBUTANT → INTERMEDIAIRE",
    description:
      "Avoir de la répartie avec tes potes. Tu veux savoir quoi répondre du tac au tac sans rester muet ? Ce parcours est fait pour toi.",
    modules: [
      {
        week: "Semaine 1",
        title: "Les bases de la répartie",
        detail: "Rebondir sur une remarque, accuser réception",
      },
      {
        week: "Semaine 2",
        title: "Le timing et les silences",
        detail: "Pauses, regard, rythme",
      },
      {
        week: "Semaine 3",
        title: "L'autodérision comme arme secrète",
        detail: "Rire de soi avec confiance",
      },
      {
        week: "Semaine 4",
        title: "Répartie avancée",
        detail: "Retourner les situations, improviser",
      },
    ],
  },
  {
    emoji: "☕",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    difficulty: "DEBUTANT → INTERMEDIAIRE",
    description:
      "Briller en conversation au bureau et entre amis. Tu veux avoir des anecdotes et blagues à ressortir au bon moment ? C'est par ici.",
    modules: [
      {
        week: "Semaine 1",
        title: "Blagues courtes et mémorisables",
        detail: "One-liners, jeux de mots",
      },
      {
        week: "Semaine 2",
        title: "L'art du timing social",
        detail: "Quand placer sa blague, lire le groupe",
      },
      {
        week: "Semaine 3",
        title: "Anecdotes et storytelling",
        detail: "Raconter une histoire qui fait rire",
      },
    ],
  },
  {
    emoji: "🔄",
    title: "Parcours Confiance",
    duration: "6 semaines",
    difficulty: "DEBUTANT → EXPERT",
    description:
      "Retrouver ta légèreté et ton humour naturel. Un parcours complet pour renouer avec le rire et te sentir à l'aise dans toutes tes interactions.",
    modules: [
      {
        week: "Semaine 1",
        title: "Redécouvrir ce qui te fait rire",
        detail: "Observation, humour du quotidien",
      },
      {
        week: "Semaine 2",
        title: "L'autodérision bienveillante",
        detail: "Rire de soi sans se dévaloriser",
      },
      {
        week: "Semaine 3",
        title: "Techniques de storytelling",
        detail: "Raconter ses galères avec humour",
      },
      {
        week: "Semaine 4",
        title: "Répartie et conversations",
        detail: "Être à l'aise en groupe",
      },
      {
        week: "Semaine 5",
        title: "Humour avancé",
        detail: "Absurde, ironie, second degré",
      },
      {
        week: "Semaine 6",
        title: "Développer son style personnel",
        detail: "Trouver sa voix comique",
      },
    ],
  },
];

export default function ParcoursPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero section */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold">
          Parcours structurés
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
          Choisis ton parcours et progresse semaine après semaine. Chaque
          programme est conçu pour t&apos;amener d&apos;un niveau à l&apos;autre
          avec des exercices concrets et des conseils pratiques.
        </p>
        <p className="mt-3 text-sm text-text-secondary">
          Prix de lancement : 0,99 &euro;/mois
        </p>
      </div>

      {/* Parcours cards */}
      <div className="flex flex-col gap-8">
        {parcours.map((p) => (
          <Card key={p.title} className="p-6">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="primary">{p.difficulty}</Badge>
                <span className="text-sm text-text-secondary">
                  {p.duration}
                </span>
              </div>
              <CardTitle className="mt-3 text-2xl">
                <span className="mr-2">{p.emoji}</span>
                {p.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-text-secondary">{p.description}</p>

              {/* Weekly modules */}
              <div className="mb-6 space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                  Programme
                </h4>
                <ol className="space-y-2">
                  {p.modules.map((m) => (
                    <li
                      key={m.week}
                      className="flex items-start gap-3 rounded-md bg-background-elevated p-3"
                    >
                      <Badge variant="secondary" className="mt-0.5 shrink-0">
                        {m.week}
                      </Badge>
                      <div>
                        <span className="font-medium text-text-primary">
                          {m.title}
                        </span>
                        <span className="ml-1 text-sm text-text-secondary">
                          · {m.detail}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <Link href="/register">
                <Button variant="primary" size="lg">
                  Commencer ce parcours
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
