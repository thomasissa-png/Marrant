"use client";

import { HumorQuiz } from "@/components/onboarding/humor-quiz";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 inline-block">
        <span className="font-display text-2xl font-bold text-gradient">
          deviens-marrant
        </span>
      </Link>
      <h1 className="mb-2 text-center font-display text-3xl font-bold md:text-4xl">
        Découvre ton profil humour
      </h1>
      <p className="mb-8 text-center text-text-secondary">
        3 questions rapides pour personnaliser ton expérience
      </p>
      <HumorQuiz />
    </main>
  );
}
