/**
 * Repère « cinq marches » (étalon E5 v6, @ux e) : barres montantes carrées, n pleines, d'une autre forme
 * que les pastilles rondes du cap ; décoratif (`aria-hidden`), le texte « Marche n » porte l'information.
 */
export function Marches({ n }: { n: number }) {
  // Lot D11b (revue @design D7) : hauteurs sur l'échelle de 4 px (8 à 24 px).
  const hauteurs = ["h-2", "h-3", "h-4", "h-5", "h-6"];
  return (
    <span className="inline-flex items-end gap-0.5" aria-hidden="true">
      {hauteurs.map((h, i) => (
        <i key={h} className={`block w-1.5 ${h} ${i < n ? "bg-accent-link" : "border border-border-input"}`} />
      ))}
    </span>
  );
}
