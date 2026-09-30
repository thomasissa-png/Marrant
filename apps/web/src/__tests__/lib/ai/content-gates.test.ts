/**
 * @jest-environment node
 *
 * Lot Q3 (s14) : gates programmatiques de publication, sans LLM.
 */
import {
  applyContentGates,
  findAiSelfMention,
  findBrandMentions,
  findReaderVouvoiement,
  findVulgarity,
  runWithContentGates,
} from "@/lib/ai/content-gates";

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

const CLEAN_TIP = {
  title: "Le silence après la vanne",
  content: "Quand tu sors une vanne, attends deux secondes avant de sourire. Ton pote a le temps de comprendre.",
  example: "Ton collègue : « T'as vu la réunion ? » Toi : « J'y étais. Mentalement, non. » Silence. Il rit.",
  exercise: "DÉFI SILENCE : aujourd'hui, compte deux secondes après chaque blague.",
};

describe("détecteurs", () => {
  it("vulgarité : gros mots détectés, faux amis ignorés", () => {
    expect(findVulgarity("Putain, la réunion a duré trois heures.")).toBe("Putain");
    expect(findVulgarity("C'est un vrai bordel dans ta tête.")).toBe("bordel");
    expect(findVulgarity("Il était enculé de la vie.")).toBe("enculé");
    expect(findVulgarity("Le concours de la conférence.")).toBeNull();
    expect(findVulgarity("Au fond du cul-de-sac.")).toBeNull();
    expect(findVulgarity("Un bon conseil pour ta soirée.")).toBeNull();
  });

  it("vouvoiement adressé au lecteur : rejeté ; dialogues cités et pluriel toi+X : ignorés", () => {
    expect(findReaderVouvoiement("Si vous voulez faire rire, commencez par écouter.")).toBe("vous voulez");
    expect(findReaderVouvoiement("Votre collègue va adorer.")).toBe("Votre");
    expect(findReaderVouvoiement("Ton chef te dit : « Vous avez fini le dossier ? »")).toBeNull();
    expect(findReaderVouvoiement("Toi et ton pote, vous avez le même humour.")).toBeNull();
    expect(findReaderVouvoiement(CLEAN_TIP.content)).toBeNull();
  });

  it("auto-mention IA : rejetée ; l'IA comme sujet reste autorisée (V6)", () => {
    expect(findAiSelfMention("Ce conseil a été généré par une IA.")).not.toBeNull();
    expect(findAiSelfMention("En tant qu'IA, je trouve ça drôle.")).not.toBeNull();
    expect(findAiSelfMention("Notre IA a sélectionné cette vidéo.")).not.toBeNull();
    expect(findAiSelfMention("J'ai demandé à ChatGPT de me faire rire. Il m'a proposé un tableau Excel.")).toBeNull();
    expect(findAiSelfMention("J'ai dit à Alexa de me raconter une blague.")).toBeNull();
  });

  it("marques et séries : signalées", () => {
    expect(findBrandMentions("Comme dans Kaamelott, ou sur Netflix.")).toEqual(["Kaamelott", "Netflix"]);
    expect(findBrandMentions(CLEAN_TIP.content)).toEqual([]);
  });
});

describe("applyContentGates", () => {
  it("contenu propre : ok, rien modifié", () => {
    const r = applyContentGates(CLEAN_TIP, ["title", "content", "example", "exercise"]);
    expect(r.ok).toBe(true);
    expect(r.value).toEqual(CLEAN_TIP);
    expect(r.emDashFieldsFixed).toBe(0);
  });

  it("(a) tirets cadratins remplacés automatiquement, sans rejet", () => {
    const r = applyContentGates({ ...CLEAN_TIP, content: "Attends deux secondes — pas plus — avant de sourire." }, ["content"]);
    expect(r.ok).toBe(true);
    expect(r.value.content).not.toContain("—");
    expect(r.value.content).toBe("Attends deux secondes, pas plus, avant de sourire.");
    expect(r.emDashFieldsFixed).toBe(1);
  });

  it("(b)(c)(d) rejets cumulés avec leur champ", () => {
    const r = applyContentGates(
      { title: "Merde alors", content: "Vous devez essayer.", example: "Écrit par une IA.", exercise: "" },
      ["title", "content", "example", "exercise"],
    );
    expect(r.ok).toBe(false);
    expect(r.rejections.map((x) => `${x.code}:${x.field}`)).toEqual([
      "VULGARITE:title",
      "VOUVOIEMENT:content",
      "MENTION_IA:example",
    ]);
  });

  it("(e) marque citée : signalée, pas de rejet", () => {
    const r = applyContentGates({ ...CLEAN_TIP, content: `${CLEAN_TIP.content} Comme dans The Office.` }, ["content"]);
    expect(r.ok).toBe(true);
    expect(r.flags).toEqual([{ field: "content", match: "The Office" }]);
  });

  it("champ liste (threadParts) : chaque élément corrigé, l'ensemble testé", () => {
    const r = applyContentGates({ threadParts: ["Un — deux", "Vous avez vu ?"] }, ["threadParts"]);
    expect(r.value.threadParts[0]).not.toContain("—");
    expect(r.ok).toBe(false);
  });
});

describe("runWithContentGates : une régénération max, jamais de boucle", () => {
  it("premier jet propre : aucune régénération", async () => {
    const regen = jest.fn();
    const out = await runWithContentGates(CLEAN_TIP, regen, ["content"], "t");
    expect(out.ok).toBe(true);
    expect(regen).not.toHaveBeenCalled();
  });

  it("rejet puis régénération propre : ok, feedback transmis", async () => {
    const regen = jest.fn().mockResolvedValue(CLEAN_TIP);
    const out = await runWithContentGates({ ...CLEAN_TIP, content: "Vous allez rire." }, regen, ["content"], "t");
    expect(out.ok).toBe(true);
    expect(out.regenerated).toBe(true);
    expect(regen).toHaveBeenCalledTimes(1);
    expect(regen.mock.calls[0][0]).toMatch(/vouvoiement/);
  });

  it("deux rejets : ok=false après UNE seule régénération", async () => {
    const regen = jest.fn().mockResolvedValue({ ...CLEAN_TIP, content: "Putain de conseil." });
    const out = await runWithContentGates({ ...CLEAN_TIP, content: "Vous allez rire." }, regen, ["content"], "t");
    expect(out.ok).toBe(false);
    expect(regen).toHaveBeenCalledTimes(1);
  });

  it("régénération qui plante : ok=false, pas de nouvel essai", async () => {
    const regen = jest.fn().mockRejectedValue(new Error("API"));
    const out = await runWithContentGates({ ...CLEAN_TIP, content: "Vous allez rire." }, regen, ["content"], "t");
    expect(out.ok).toBe(false);
    expect(regen).toHaveBeenCalledTimes(1);
  });
});
