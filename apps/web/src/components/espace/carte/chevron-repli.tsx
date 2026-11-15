/**
 * v6 tour 1 (point 5) : chevron d'un `<summary>` qui révèle du contenu (`SOMMAIRE_REPLIABLE`), décoratif ; il
 * pivote quand le `<details group/repli>` est ouvert. Même tracé que les filtres repliés (`filtres-replies.tsx`).
 */
export function ChevronRepli() {
  return (
    <svg
      className="h-4 w-4 flex-none transition-transform group-open/repli:rotate-180 motion-reduce:transition-none"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
