import type { ReactNode } from "react";

/**
 * En-tête de page catalogue : H1 + paragraphe d'introduction limité à
 * une largeur de lecture (max-w-3xl) et espacé du titre.
 */
export function PageHeader({ title, lead }: { title: ReactNode; lead?: ReactNode }) {
  return (
    <header className="mb-8 md:mb-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>
      {lead && <p className="mt-3 max-w-3xl text-lg text-text-secondary md:mt-4">{lead}</p>}
    </header>
  );
}
