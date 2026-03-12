"use client";

export function FaqSection() {
  const faqs = [
    {
      question: "Est-ce que je peux vraiment apprendre à être drôle ?",
      answer:
        "Oui. L\u2019humour n\u2019est pas un talent inné, c\u2019est une compétence qui se travaille. Comme un muscle, plus tu pratiques, plus tu progresses. Nos membres gagnent en moyenne 50 XP par semaine et voient une vraie différence en quelques jours.",
    },
    {
      question: "0,99 \u20AC/mois, c\u2019est vraiment tout ? Pas de frais cachés ?",
      answer:
        "C\u2019est le prix de lancement, point. Pas de frais cachés, pas de reconduction surprise. Tu annules en 1 clic depuis ton profil, sans avoir à envoyer un email ou appeler un numéro. Et tu peux commencer sans carte bancaire.",
    },
    {
      question:
        "C\u2019est quoi la différence avec juste regarder des vidéos YouTube ?",
      answer:
        "YouTube te montre des humoristes. Nous, on t\u2019apprend leurs techniques. Chaque vidéo est analysée, chaque conseil vient avec un exercice concret. Et avec le système de streaks et d\u2019XP, tu gardes la motivation sur la durée.",
    },
    {
      question: "Je suis timide, c\u2019est fait pour moi ?",
      answer:
        "Surtout pour toi. La majorité de nos membres se décrivent comme introvertis au départ. Les parcours sont conçus pour progresser à ton rythme, sans pression, avec des exercices que tu peux pratiquer seul avant de les tester en groupe.",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h3 className="font-display mb-8 text-center text-2xl font-bold text-text-primary">
        Questions fréquentes
      </h3>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-border bg-background-card p-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-text-primary">
              {faq.question}
              <span className="ml-2 text-text-muted transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-sm text-text-secondary">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
