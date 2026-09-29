"use client";

import { faqs } from "@/lib/faqs";
export { faqs };

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  /** Questions à afficher (par défaut : FAQ générale du site). */
  items?: readonly FaqItem[];
  title?: string;
}

/**
 * FAQ en accordéon fermé : un seul composant pour toutes les pages
 * (passe s12 : UX T19/T46, design T11).
 */
export function FaqSection({ items = faqs, title = "Questions fréquentes" }: FaqSectionProps = {}) {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display mb-8 text-center text-2xl font-bold text-text-primary">
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-border bg-background-card"
          >
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
              {faq.question}
              <svg
                className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="px-4 pb-4 text-sm text-text-secondary">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
