import { render, screen } from "@testing-library/react";
import {
  Apprentissages,
  citationsEnBloc,
  decouperDefi,
  Exemple,
  Exercice,
  tailleChute,
  tailleEnonce,
} from "@/components/home/daily-content-format";

/** Mise en forme d'affichage des cartes du jour, spec v3 (V3.2, V3.5) : aucun mot changé. */
describe("daily-content-format", () => {
  it("chooses the setup size by displayed length (V4.2)", () => {
    expect(tailleEnonce("a".repeat(50))).toContain("lg:text-5xl");
    expect(tailleEnonce("a".repeat(51))).toContain("lg:text-4xl");
    expect(tailleEnonce("a".repeat(100))).toContain("lg:text-4xl");
    expect(tailleEnonce("a".repeat(101))).toContain("lg:text-3xl");
    for (const n of [10, 80, 300]) expect(tailleEnonce("a".repeat(n))).toMatch(/^text-xl leading-7 md:text-2xl md:leading-8 /);
  });

  it("chooses the punchline size independently (V4.2)", () => {
    expect(tailleChute("a".repeat(60))).toContain("lg:text-3xl");
    expect(tailleChute("a".repeat(61))).toBe("text-xl leading-7 md:text-2xl md:leading-8");
    expect(tailleChute("a".repeat(105))).toBe("text-xl leading-7 lg:text-2xl lg:leading-8");
    expect(tailleChute("a".repeat(111))).toBe("text-xl leading-7");
  });

  it("keeps short top-level quotes in one block, long ones in the flow", () => {
    const { container } = render(<p>{citationsEnBloc("Ils apportent tout. « Pour pas que tu te fatigues. »")}</p>);
    const bloc = container.querySelector("span.inline-block");
    expect(bloc).toHaveTextContent("« Pour pas que tu te fatigues. »");
    expect(container).toHaveTextContent("Ils apportent tout. « Pour pas que tu te fatigues. »");

    const long = `« ${"mot ".repeat(20)}»`;
    const { container: c2 } = render(<p>{citationsEnBloc(long)}</p>);
    expect(c2.querySelector("span.inline-block")).toBeNull();
    expect(citationsEnBloc("Sans citation.")).toBe("Sans citation.");
  });

  it("turns a « DÉFI … : » prefix into a sentence-case subtitle, text unchanged", () => {
    const nbsp = String.fromCharCode(0xa0);
    expect(decouperDefi(`DÉFI MIROIR${nbsp}: choisis une phrase.`)).toEqual({ titre: "Défi miroir", reste: "choisis une phrase." });
    expect(decouperDefi("DÉFI FAUX NAÏF : observe ton chat.")).toEqual({ titre: "Défi faux naïf", reste: "observe ton chat." });
    expect(decouperDefi("Raconte une blague ce soir.")).toBeNull();

    render(<Exercice texte="DÉFI MIROIR : choisis une phrase drôle." />);
    expect(screen.getByText("Défi miroir").tagName).toBe("P");
    expect(screen.getByText(/^choisis une phrase drôle\.$/)).toBeInTheDocument();
  });

  it("puts a stage direction that follows a quote on its own italic line", () => {
    render(
      <Exemple texte="Voix grave : « Nous avons repéré une dépense. » (pause de 3 secondes, regard fixe) « Vous avez acheté des légumes. »" />,
    );
    const didascalie = screen.getByText(/^\(pause de 3/);
    expect(didascalie).toHaveClass("italic");
    expect(didascalie.previousElementSibling?.textContent).toMatch(/dépense\.\s?»$/);
    expect(didascalie.nextElementSibling?.textContent).toMatch(/^«\s?Vous avez acheté/);
  });

  it("leaves mid-sentence parentheses alone", () => {
    const { container } = render(<Exemple texte="Marque une pause (2 secondes) puis enchaîne." />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("renders each learning as a section: subtitle then text, no bullet", () => {
    render(<Apprentissages items={["TECHNIQUE DU FAUX NAÏF : décris un comportement banal.", "Varier le rythme"]} />);
    expect(screen.getByText("Technique du faux naïf").tagName).toBe("P");
    expect(screen.getByText(/^décris un comportement banal\.$/)).toBeInTheDocument();
    expect(screen.getByText("Varier le rythme").parentElement).toHaveClass("border-t");
    expect(screen.queryByText("•")).not.toBeInTheDocument();
  });
});
