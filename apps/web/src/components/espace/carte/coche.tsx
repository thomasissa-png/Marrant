/** Coche décorative des puces choisies (le texte et `aria-pressed` portent l'état). */
export function Coche() {
  return (
    <svg className="h-4 w-4 flex-none text-accent-link" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
