"use client";

import { faqs } from "@/lib/faqs";
export { faqs };

export function FaqSection() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="font-display mb-8 text-center text-2xl font-bold text-text-primary">
        Questions fréquentes
      </h2>
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
