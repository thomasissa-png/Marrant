import { dedupeTipsByTitle } from "@/lib/tips-dedupe";

describe("dedupeTipsByTitle (N12 s12)", () => {
  it("garde la première occurrence de chaque titre (casse et espaces neutralisés)", () => {
    const tips = [
      { id: "a", title: "L'auto-blague préventive : désamorcer avant l'explosion" },
      { id: "b", title: "Le callback" },
      { id: "c", title: "L'auto-blague  préventive : DÉSAMORCER avant l'explosion" },
    ];
    expect(dedupeTipsByTitle(tips).map((t) => t.id)).toEqual(["a", "b"]);
  });
});
