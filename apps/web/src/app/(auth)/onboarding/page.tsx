"use client";

// Rendu : Client Component (quiz interactif, lit le callbackUrl de l'URL).
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HumorQuiz } from "@/components/onboarding/humor-quiz";
import { sanitizeCallbackUrl } from "@/lib/safe-callback";

/** Sortie par défaut quand aucun callback n'est fourni : la liste des parcours. */
const DEFAULT_EXIT = "/parcours";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 inline-block">
        <span className="whitespace-nowrap font-display text-2xl font-bold text-gradient">
          deviens-marrant.fr
        </span>
      </Link>
      <h1 className="mb-2 text-center font-display text-3xl font-bold md:text-4xl">
        Découvre ton profil humour
      </h1>
      <p className="mb-8 text-center text-text-secondary">
        3 questions, et on te trouve un point de départ à ta taille
      </p>
      <Suspense fallback={<HumorQuiz exitHref={DEFAULT_EXIT} />}>
        <OnboardingQuiz />
      </Suspense>
    </main>
  );
}

function OnboardingQuiz() {
  const searchParams = useSearchParams();
  const callback = sanitizeCallbackUrl(searchParams.get("callbackUrl"));
  // Jamais de boucle vers l'onboarding lui-même.
  const exitHref = callback && !callback.startsWith("/onboarding") ? callback : DEFAULT_EXIT;
  return <HumorQuiz exitHref={exitHref} />;
}
