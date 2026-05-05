"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, isMobileNative } from "@/lib/api-base";

/**
 * Onboarding mobile-first — 5 écrans :
 *   1. Welcome
 *   2. Persona quiz court (3 questions)
 *   3. Permission push
 *   4. Premier daily content
 *   5. Login soft (skippable)
 *
 * Persona détecté stocké en localStorage : "detectedPersona" : "YANIS" | "SOPHIE" | "MARC"
 * Compatible web (degraded gracefully sans Capacitor).
 */

type Persona = "YANIS" | "SOPHIE" | "MARC";
type Step = 1 | 2 | 3 | 4 | 5;

const PERSONA_MESSAGES: Record<Persona, string> = {
  YANIS: "Yo, on va te faire briller en soirée 🍻",
  SOPHIE: "On va remplir ta machine à café d'anecdotes ☕",
  MARC: "On va t'aider à retrouver ta légèreté 😌",
};

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [persona, setPersona] = useState<Persona | null>(null);

  // Quiz state — 3 questions, scoring simple
  const [age, setAge] = useState<"u22" | "22-30" | "30plus" | null>(null);
  const [goal, setGoal] = useState<"repartie" | "convers" | "reprise" | null>(null);

  const detectPersona = (): Persona => {
    if (age === "u22" || goal === "repartie") return "YANIS";
    if (age === "22-30" || goal === "convers") return "SOPHIE";
    return "MARC";
  };

  const handleQuizComplete = () => {
    const p = detectPersona();
    setPersona(p);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("detectedPersona", p);
    }
    setStep(3);
  };

  const handlePushOptIn = async (accept: boolean) => {
    if (!accept) {
      setStep(4);
      return;
    }

    if (isMobileNative()) {
      try {
        // eslint-disable-next-line
        const { PushNotifications } = require("@capacitor/push-notifications");
        const perm = await PushNotifications.requestPermissions();
        if (perm.receive === "granted") {
          await PushNotifications.register();
          PushNotifications.addListener("registration", async (t: { value: string }) => {
            // eslint-disable-next-line
            const { Capacitor } = require("@capacitor/core");
            const platform = Capacitor.getPlatform();
            await api("/api/push/register-token", {
              method: "POST",
              body: JSON.stringify({ token: t.value, platform }),
            });
          });
        }
      } catch {
        // Permission refusée ou plugin indisponible → on continue
      }
    }
    setStep(4);
  };

  const handleSkipLogin = () => {
    onComplete();
    router.push("/");
  };

  const handleGoToLogin = () => {
    onComplete();
    router.push("/auth/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-purple-950 to-black flex flex-col items-center justify-center p-6 text-white">
      {step === 1 && (
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎤</div>
          <h1 className="text-4xl font-bold mb-3">Tu vas devenir le pote drôle.</h1>
          <p className="text-lg text-gray-300 mb-8">
            Vannes du jour, conseils stand-up, exos de répartie. Bref, t&apos;es bien tombé.
          </p>
          <button
            onClick={() => setStep(2)}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-4 font-semibold text-lg transition"
          >
            On y va
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md w-full">
          <div className="text-sm text-violet-300 mb-2">Question 1/2</div>
          <h2 className="text-2xl font-bold mb-6">T&apos;as quel âge en gros ?</h2>
          <div className="space-y-3 mb-8">
            {[
              { v: "u22", label: "Moins de 22 ans", emoji: "🎓" },
              { v: "22-30", label: "Entre 22 et 30 ans", emoji: "💼" },
              { v: "30plus", label: "Plus de 30 ans", emoji: "🧘" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setAge(opt.v as typeof age)}
                className={`w-full rounded-xl border-2 px-5 py-4 text-left transition ${
                  age === opt.v
                    ? "border-violet-500 bg-violet-900/50"
                    : "border-gray-700 hover:border-violet-700"
                }`}
              >
                <span className="mr-3">{opt.emoji}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {age && (
            <>
              <div className="text-sm text-violet-300 mb-2">Question 2/2</div>
              <h2 className="text-2xl font-bold mb-6">Pour quoi tu veux progresser ?</h2>
              <div className="space-y-3 mb-8">
                {[
                  { v: "repartie", label: "Pour avoir de la répartie en soirée", emoji: "🥊" },
                  { v: "convers", label: "Pour alimenter mes conversations", emoji: "💬" },
                  { v: "reprise", label: "Pour reprendre confiance / la légèreté", emoji: "✨" },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => setGoal(opt.v as typeof goal)}
                    className={`w-full rounded-xl border-2 px-5 py-4 text-left transition ${
                      goal === opt.v
                        ? "border-violet-500 bg-violet-900/50"
                        : "border-gray-700 hover:border-violet-700"
                    }`}
                  >
                    <span className="mr-3">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleQuizComplete}
                disabled={!goal}
                className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 px-6 py-4 font-semibold transition"
              >
                Voir mon profil
              </button>
            </>
          )}
        </div>
      )}

      {step === 3 && persona && (
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🔔</div>
          <h2 className="text-3xl font-bold mb-3">{PERSONA_MESSAGES[persona]}</h2>
          <p className="text-gray-300 mb-8">
            On t&apos;envoie une vanne par jour à 9h. Pile au bon moment pour la sortir au boulot, en
            cours ou à la machine à café.
          </p>
          <button
            onClick={() => handlePushOptIn(true)}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-4 font-semibold text-lg mb-3 transition"
          >
            Allez, je veux ma vanne quotidienne
          </button>
          <button
            onClick={() => handlePushOptIn(false)}
            className="w-full rounded-xl border border-gray-700 px-6 py-3 text-gray-300 hover:bg-gray-900 transition"
          >
            Plus tard
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-3xl font-bold mb-3">Première vanne offerte</h2>
          <p className="text-gray-300 mb-8">
            On a sélectionné une vanne pile pour toi. Pas besoin de compte, c&apos;est cadeau.
          </p>
          <button
            onClick={() => setStep(5)}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-4 font-semibold transition"
          >
            Découvrir
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">💾</div>
          <h2 className="text-3xl font-bold mb-3">Garde tes favoris</h2>
          <p className="text-gray-300 mb-8">
            Crée un compte (gratos) pour sauvegarder tes vannes préférées et reprendre tes parcours
            sur tous tes appareils.
          </p>
          <button
            onClick={handleGoToLogin}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-4 font-semibold mb-3 transition"
          >
            Créer mon compte
          </button>
          <button
            onClick={handleSkipLogin}
            className="w-full rounded-xl border border-gray-700 px-6 py-3 text-gray-300 hover:bg-gray-900 transition"
          >
            Plus tard, laisse-moi explorer
          </button>
        </div>
      )}
    </div>
  );
}
