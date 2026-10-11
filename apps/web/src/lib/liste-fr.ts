/** Énumération française : ["A", "B", "C"] → « A, B et C » ; un seul élément → « A ». */
export function listeFr(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}
