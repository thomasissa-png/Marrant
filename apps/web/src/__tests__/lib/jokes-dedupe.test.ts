import { dedupeJokesByContent, jokeContentKey } from "@/lib/jokes-dedupe";

describe("jokeContentKey", () => {
  it("neutralise la casse et les espaces", () => {
    expect(jokeContentKey("  Mon copain   et moi\n")).toBe(jokeContentKey("mon copain et moi"));
  });
});

describe("dedupeJokesByContent", () => {
  it("garde la première occurrence de chaque contenu, dans l'ordre reçu", () => {
    const jokes = [
      { id: "a", content: "Vanne 1" },
      { id: "b", content: "vanne 1 " },
      { id: "c", content: "Vanne 2" },
      { id: "d", content: "Vanne 1" },
    ];
    expect(dedupeJokesByContent(jokes).map((j) => j.id)).toEqual(["a", "c"]);
  });

  it("renvoie une liste vide pour une entrée vide", () => {
    expect(dedupeJokesByContent([])).toEqual([]);
  });
});
