/**
 * Repère « cinq marches » (étalon E5 v6, @ux e) : barres montantes carrées, n pleines, d'une autre forme
 * que les pastilles rondes du cap ; décoratif (`aria-hidden`), le texte « Marche n » porte l'information.
 */
export function Marches({ n }: { n: number }) {
  const hauteurs = ["h-1.5", "h-2.5", "h-3.5", "h-4", "h-5"];
  return (
    <span className="inline-flex items-end gap-0.5" aria-hidden="true">
      {hauteurs.map((h, i) => (
        <i key={h} className={`block w-1.5 ${h} ${i < n ? "bg-accent-link" : "border border-border-input"}`} />
      ))}
    </span>
  );
}
