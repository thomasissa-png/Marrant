/**
 * @jest-environment node
 *
 * Lot v5 (s15, cycle 7) :
 *  - F1 : test d'heure A / B alterné PAR JOUR (mesure §7 c) : mar. A, mer. B, jeu. A, ordre
 *    inversé la semaine suivante ; X 09:00 et Instagram 12:30 en B ; LinkedIn reste à l'heure A
 *    (test texte / image en cours) ; lundi, vendredi et hors fenêtre : heure A sans marqueur ;
 *  - S3 : pont du quiz `FORMULES.quizCourt` = pont validé du 07/10, X ≤ 270 comptés par X.
 * Données simulées, aucune base.
 */
import { brasHeure, heureDuCreneau } from "@/lib/social/heure-test";
import { HEURE_B_PARIS, HEURE_PARIS } from "@/config/social-calendrier";
import { longueurX } from "@/lib/social/longueur-x";
import { buildLotV5, controlerLot } from "../../../scripts/content/social-lot-v5";
import { FORMULES } from "../../../scripts/content/social-lot-v5-config";
import { renderLotMarkdown, versLigne } from "../../../scripts/content/social-lot-v5-export";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";

const lot = buildLotV5({ pool: catalogue(), articles: ARTICLES, recents: [{ date: "2026-10-02", sourceId: "t000" }], seed: "test" });
const paris = (iso: string) => new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

describe("brasHeure : alternance par jour", () => {
  it("semaine du 12/10 : mar. A, mer. B, jeu. A ; semaine du 19/10 : mar. B, mer. A, jeu. B", () => {
    const jours = ["2026-10-13", "2026-10-14", "2026-10-15", "2026-10-20", "2026-10-21", "2026-10-22"];
    expect(jours.map((d) => brasHeure("TWITTER", d))).toEqual(["A", "B", "A", "B", "A", "B"]);
    expect(jours.map((d) => brasHeure("INSTAGRAM", d))).toEqual(["A", "B", "A", "B", "A", "B"]);
  });

  it("lundi, vendredi, avant le 12/10 et à partir du 09/11 : hors test", () => {
    for (const d of ["2026-10-12", "2026-10-16", "2026-10-07", "2026-11-10", "2026-11-11"]) expect(brasHeure("TWITTER", d)).toBeNull();
    expect(brasHeure("TWITTER", "2026-11-05")).not.toBeNull();
  });

  it("LinkedIn : aucun bras tant que le test texte / image tourne (un facteur à la fois)", () => {
    expect(brasHeure("LINKEDIN", "2026-10-14")).toBeNull();
    expect(heureDuCreneau("LINKEDIN", "2026-10-14")).toEqual({ ...HEURE_PARIS.LINKEDIN, bras: null });
  });

  it("heures B : X 09:00, Instagram 12:30 (horaires-sources-s15.md §6)", () => {
    expect(HEURE_B_PARIS.TWITTER).toEqual({ h: 9, m: 0 });
    expect(HEURE_B_PARIS.INSTAGRAM).toEqual({ h: 12, m: 30 });
    expect(heureDuCreneau("TWITTER", "2026-10-14")).toEqual({ h: 9, m: 0, bras: "B" });
  });
});

describe("lot : créneau et marqueur [heure:A|B]", () => {
  it("chaque post porte l'heure de son bras ; B à 09:00 (X) et 12:30 (Instagram), heure d'hiver comprise", () => {
    expect(lot.errors).toEqual([]);
    for (const p of lot.posts) {
      const attendu = heureDuCreneau(p.platform, p.date);
      expect(p.bras).toBe(attendu.bras ?? undefined);
      expect(paris(p.scheduledAt)).toBe(`${String(attendu.h).padStart(2, "0")}:${String(attendu.m).padStart(2, "0")}`);
    }
    const b = lot.posts.filter((p) => p.bras === "B");
    expect(b.some((p) => p.platform === "TWITTER" && p.date > "2026-10-25" && paris(p.scheduledAt) === "09:00")).toBe(true);
  });

  it("marqueur dans directorNote, LinkedIn jamais marqué, [variante:] LinkedIn intact", () => {
    for (const p of lot.posts) {
      const note = versLigne(p).directorNote;
      if (p.bras) expect(note).toContain(`[heure:${p.bras}]`);
      else expect(note).not.toContain("[heure:");
    }
    const li = lot.posts.filter((p) => p.platform === "LINKEDIN");
    expect(li.every((p) => !p.bras)).toBe(true);
    expect(li.some((p) => versLigne(p).directorNote.includes("[variante:image]"))).toBe(true);
  });

  it("bras équilibrés par réseau (écart ≤ 2) et compteur dans le récapitulatif", () => {
    for (const pf of ["TWITTER", "INSTAGRAM"] as const) {
      const ps = lot.posts.filter((p) => p.platform === pf);
      const a = ps.filter((p) => p.bras === "A").length;
      const bb = ps.filter((p) => p.bras === "B").length;
      expect(a).toBeGreaterThan(5);
      expect(Math.abs(a - bb)).toBeLessThanOrEqual(2);
    }
    expect(renderLotMarkdown(lot.posts, [], [], lot.stockEligible, "test")).toMatch(/Test d'heure .*X A \d+, B \d+, hors test \d+/);
  });

  it("le repli d'un relais garde [repli-de:] en tête et prend le bras du créneau", () => {
    const p = lot.posts.find((x) => x.bras === "B")!;
    const r = { ...p, repliDe: "crelais0001" };
    expect(versLigne(r).directorNote).toMatch(new RegExp(`^\\[repli-de:${r.repliDe}\\] \\[heure:${r.bras}\\] `));
  });
});

describe("pont du quiz (S3)", () => {
  it("FORMULES.quizCourt = pont validé du 07/10", () => {
    expect(FORMULES.quizCourt).toBe("Et toi, lequel des 5 profils d'humour est le tien ? Environ 2 minutes, sans inscription :");
  });

  it("posts quiz tirés : nouveau pont, lien quiz, ≤ 270 comptés par X, lot sans erreur", () => {
    const quiz = lot.posts.filter((p) => p.platform === "TWITTER" && p.type === "VANNE_QUIZ" && p.origine === "TIRAGE");
    expect(quiz.length).toBeGreaterThan(3);
    for (const p of quiz) {
      expect(p.content).toContain(`${FORMULES.quizCourt} https://deviens-marrant.fr/quiz-humour?`);
      expect(longueurX(p.content)).toBeLessThanOrEqual(270);
    }
    expect(controlerLot(lot.posts).errors).toEqual([]);
  });
});
