/** JJ/MM/AAAA à l'heure de Paris (date de sortie telle que la vit le lecteur). */
export function formatPreviewDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
}

export function previewBannerText(publishAt: Date | null, isVisible: boolean): string {
  if (isVisible) {
    return publishAt ? `Aperçu : article publié le ${formatPreviewDate(publishAt)}` : "Aperçu : article publié";
  }
  return publishAt
    ? `Aperçu : publication prévue le ${formatPreviewDate(publishAt)}`
    : "Aperçu : publication non programmée";
}

/** Seule différence visible entre l'aperçu admin et la page publique. */
export function BlogPreviewBanner({ publishAt, isVisible }: { publishAt: Date | null; isVisible: boolean }) {
  return (
    <p
      role="status"
      data-blog-apercu
      className="mb-6 rounded-lg border border-accent-primary/40 bg-background-card px-4 py-3 text-sm font-semibold text-text-primary"
    >
      {previewBannerText(publishAt, isVisible)}
    </p>
  );
}
