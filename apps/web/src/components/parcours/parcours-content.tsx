"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AuthModal } from "@/components/auth/auth-modal";
import { useSession } from "next-auth/react";
import Link from "next/link";

const parcours = [
  {
    emoji: "☕",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    timePerWeek: "15 min/semaine",
    difficulty: "DEBUTANT → INTERMEDIAIRE",
    persona: "Idéal si tu travailles en équipe et veux briller en conversation",
    description:
      "Tu veux avoir des anecdotes et vannes à ressortir au bon moment ? En 3 semaines, tu auras un arsenal de vannes courtes, le bon timing pour les placer, et des techniques de storytelling pour captiver ton audience.",
    testimonial:
      "« Avant je restais muette à la machine à café. Maintenant c'est moi qu'on vient voir pour la vanne du jour. »",
    modules: [
      {
        week: "Semaine 1",
        title: "Vannes courtes et mémorisables",
        detail:
          "Apprends à retenir et placer des one-liners et jeux de mots qui font mouche à tous les coups. Tu repars avec 10 vannes prêtes à l'emploi.",
        xp: 50,
        free: true,
      },
      {
        week: "Semaine 2",
        title: "L'art du timing social",
        detail:
          "Quand placer ta blague, comment lire le groupe et sentir le bon moment. La différence entre un flop et un éclat de rire, c'est souvent 3 secondes.",
        xp: 75,
        free: false,
      },
      {
        week: "Semaine 3",
        title: "Anecdotes et storytelling",
        detail:
          "Transforme tes histoires du quotidien en anecdotes qui font rire. Structure, détails, chute : les 3 ingrédients d'une bonne histoire.",
        xp: 100,
        free: false,
      },
    ],
  },
  {
    emoji: "⚡",
    title: "Parcours Répartie",
    duration: "4 semaines",
    timePerWeek: "20 min/semaine",
    difficulty: "DEBUTANT → INTERMEDIAIRE",
    persona: "Pour toi si tu es étudiant et veux t'affirmer avec tes potes",
    description:
      "Tu veux savoir quoi répondre du tac au tac sans rester muet ? En 4 semaines, tu passes de celui qui cherche ses mots à celui qui a toujours la bonne réplique. Exercices progressifs, zéro pression.",
    testimonial:
      "« Mes potes n'en reviennent pas. En soirée, c'est moi qui ai les meilleures répliques maintenant. »",
    modules: [
      {
        week: "Semaine 1",
        title: "Les bases de la répartie",
        detail:
          "Rebondir sur une remarque, accuser réception, reformuler avec humour. Les 3 réflexes de base qui te permettent de ne plus jamais rester muet.",
        xp: 50,
        free: true,
      },
      {
        week: "Semaine 2",
        title: "Le timing et les silences",
        detail:
          "Apprends à utiliser les pauses, le regard et le rythme. Un bon silence avant ta réplique vaut mieux que 10 mots précipités.",
        xp: 75,
        free: false,
      },
      {
        week: "Semaine 3",
        title: "L'autodérision comme arme secrète",
        detail:
          "Rire de soi avec confiance, c'est le move ultime. Tu désarmes ton interlocuteur et tu montres que rien ne t'atteint.",
        xp: 100,
        free: false,
      },
      {
        week: "Semaine 4",
        title: "Répartie avancée",
        detail:
          "Retourner les situations, improviser, trouver la réplique parfaite en moins de 2 secondes. Le niveau boss.",
        xp: 150,
        free: false,
      },
    ],
  },
  {
    emoji: "🌱",
    title: "Parcours Confiance",
    duration: "6 semaines",
    timePerWeek: "20 min/semaine",
    difficulty: "DEBUTANT → EXPERT",
    persona: "Parfait si tu veux renouer avec l'humour et retrouver ta légèreté",
    description:
      "Un parcours complet pour renouer avec le rire et te sentir à l'aise dans toutes tes interactions. Vannes, répartie, storytelling, autodérision : tu explores tout et tu trouves ton style.",
    testimonial:
      "« Après ma séparation, j'avais perdu mon humour. Ce parcours m'a aidé à retrouver ma légèreté, étape par étape. »",
    modules: [
      {
        week: "Semaine 1",
        title: "Redécouvrir ce qui te fait rire",
        detail:
          "Observer le quotidien avec un oeil comique, noter ce qui te fait sourire, comprendre ton humour. Le point de départ pour tout reconstruire.",
        xp: 50,
        free: true,
      },
      {
        week: "Semaine 2",
        title: "L'autodérision bienveillante",
        detail:
          "Rire de soi sans se dévaloriser, c'est un art. Tu apprends à transformer tes galères en anecdotes drôles, sans te faire du mal.",
        xp: 75,
        free: false,
      },
      {
        week: "Semaine 3",
        title: "Techniques de storytelling",
        detail:
          "Raconter ses galères avec humour, structurer une histoire, placer une chute. Tu deviens le gars/la fille dont on dit \"raconte, raconte !\".",
        xp: 100,
        free: false,
      },
      {
        week: "Semaine 4",
        title: "Répartie et conversations",
        detail:
          "Être à l'aise en groupe, rebondir sur les remarques, participer aux conversations avec légèreté. Fini le mode spectateur.",
        xp: 125,
        free: false,
      },
      {
        week: "Semaine 5",
        title: "Humour avancé",
        detail:
          "Absurde, ironie, second degré : explore les registres avancés. Tu commences à développer un vrai style personnel.",
        xp: 150,
        free: false,
      },
      {
        week: "Semaine 6",
        title: "Développer son style personnel",
        detail:
          "Trouver ta voix comique, identifier ce qui marche pour toi, créer ton propre répertoire. Le diplôme de fin de parcours.",
        xp: 200,
        free: false,
      },
    ],
  },
];

export function ParcoursContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { status } = useSession();

  const handleCta = () => {
    if (status === "authenticated") {
      // Already logged in — could navigate to parcours detail in the future
      return;
    }
    setAuthModalOpen(true);
  };

  return (
    <>
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
        <p className="mt-3 text-sm font-medium text-accent-primary">
          Gagne des XP à chaque module, maintiens ton streak et suis ta progression
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Semaine 1 offerte sur chaque parcours
        </p>
      </div>

      {/* Parcours cards */}
      <div className="flex flex-col gap-8">
        {parcours.map((p) => {
          const totalXp = p.modules.reduce((sum, m) => sum + m.xp, 0);
          return (
            <Card key={p.title} className="p-6">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="primary">{p.difficulty}</Badge>
                  <span className="text-sm text-text-secondary">
                    {p.duration}
                  </span>
                  <span className="text-sm text-text-muted">
                    · {p.timePerWeek}
                  </span>
                </div>
                <CardTitle className="mt-3 text-2xl">
                  <span className="mr-2">{p.emoji}</span>
                  {p.title}
                </CardTitle>
                <p className="mt-1 text-sm font-medium text-accent-primary">
                  {p.persona}
                </p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-text-secondary">{p.description}</p>

                {/* Testimonial */}
                <p className="mb-6 rounded-lg bg-accent-primary/5 p-3 text-sm italic text-text-secondary">
                  {p.testimonial}
                </p>

                {/* Progress indicator */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                    <span>Progression</span>
                    <span>{totalXp} XP à gagner</span>
                  </div>
                  <ProgressBar value={0} max={100} />
                </div>

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
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary">
                              {m.title}
                            </span>
                            {m.free && (
                              <Badge variant="primary" className="text-[10px]">
                                GRATUIT
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">
                            {m.detail}
                          </p>
                          <span className="mt-1 inline-block text-xs text-accent-primary">
                            +{m.xp} XP
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={handleCta}
                  >
                    Essaie le premier module gratuitement
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="register"
      />
    </>
  );
}
