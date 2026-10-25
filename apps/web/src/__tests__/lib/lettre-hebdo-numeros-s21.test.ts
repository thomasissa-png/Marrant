/**
 * @jest-environment node
 *
 * Lettre de la semaine (s21, US-H5) : numéros préparés depuis le carnet. Fiche recopiée
 * caractère pour caractère, contrôle « aucune offre commerciale » (avis @legal C1),
 * semaine ISO, fiche unique, carnet en ligne, gabarit non validé = bloqué.
 * Numéro FACTICE : `__tests__/helpers/lettre-hebdo-numero-factice.json` (jamais en production).
 */
type Issue = { id: string; audience: string; periodKey: string; subject: string; preheader: string | null; bodyText: string; scheduledFor: Date; status: string; validatedAt: Date | null };
const mockIssues: Issue[] = [];

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      findUnique: jest.fn(async ({ where }: { where: { audience_periodKey: { audience: string; periodKey: string } } }) =>
        mockIssues.find((i) => i.audience === where.audience_periodKey.audience && i.periodKey === where.audience_periodKey.periodKey) ?? null,
      ),
      create: jest.fn(async ({ data }: { data: Omit<Issue, "id"> }) => {
        const i = { id: `i${mockIssues.length + 1}`, ...data } as Issue;
        mockIssues.push(i);
        return i;
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Issue> }) => Object.assign(mockIssues.find((i) => i.id === where.id)!, data)),
      count: jest.fn(async () => mockIssues.filter((i) => i.status === "VALIDE").length),
    },
  },
}));

import carnetNovembre from "@/data/carnet/2026-11.json";
import carnetOctobre from "@/data/carnet/2026-10.json";
import factice from "../helpers/lettre-hebdo-numero-factice.json";
import numerosReels from "@/data/lettre/hebdo-premium.json";
import { parseCarnets } from "@/lib/carnet";
import { GABARIT_HEBDO } from "@/config/textes/lettre-hebdo-s21";
import { MARQUEUR_A_COMPLETER } from "@/config/lettre";
import { motifsInterdits, preparerNumerosHebdo, stockHebdo, synchroniserNumerosHebdo } from "@/lib/lettre/numeros-hebdo";
import { lireApercuLettre } from "@/lib/lettre/apercu";

const carnets = parseCarnets([carnetOctobre, carnetNovembre]);
const fiche = carnets[1].fiches[0];
const VALIDE = { ...GABARIT_HEBDO, valide: true };
const NOW = new Date("2026-10-26T10:00:00Z");
const base = factice[0];

beforeEach(() => {
  mockIssues.length = 0;
});

describe("Assemblage depuis la fiche du carnet", () => {
  it("H5-6 : chaque champ de la fiche est recopié caractère pour caractère ; objet = titre ; envoi = jeudi 8 h Paris", () => {
    const { numeros, ignores } = preparerNumerosHebdo(factice, carnets, VALIDE);
    expect(ignores).toEqual([]);
    const n = numeros[0];
    for (const champ of [fiche.situation, fiche.onTeDit, fiche.reponse, fiche.pourquoi, fiche.siTendu, fiche.exercice]) expect(n.corps).toContain(champ);
    expect(n.objet).toBe(fiche.titre);
    expect(n.envoiPrevu.toISOString()).toBe("2026-11-12T07:00:00.000Z");
    expect(n.corps).toContain("utm_source=lettre-premium");
    expect(n.corps).not.toContain(MARQUEUR_A_COMPLETER);
    expect(motifsInterdits(n.corps)).toEqual([]);
  });

  it("gabarit figé (s22) : plus de marqueur ; un gabarit non validé remettrait le marqueur [À COMPLÉTER en tête", () => {
    expect(GABARIT_HEBDO.valide).toBe(true);
    expect(preparerNumerosHebdo(factice, carnets).numeros[0].corps).not.toContain(MARQUEUR_A_COMPLETER);
    const { numeros } = preparerNumerosHebdo(factice, carnets, { ...GABARIT_HEBDO, valide: false });
    expect(numeros[0].corps.startsWith(MARQUEUR_A_COMPLETER)).toBe(true);
  });

  it("le fichier réel : 9 numéros d'avance (2026-W45 à 2026-W53), tous acceptés, aucune fiche offerte, jamais d'offre, 230 mots au plus hors pied", () => {
    const { numeros, ignores } = preparerNumerosHebdo(numerosReels, carnets, VALIDE);
    expect(ignores).toEqual([]);
    // s22 : n°1 avancé au jeudi 05/11 (W45, décision du 25/10), nouveau numéro W46 (12/11).
    expect(numeros.map((n) => n.semaine)).toEqual(["2026-W45", "2026-W46", "2026-W47", "2026-W48", "2026-W49", "2026-W50", "2026-W51", "2026-W52", "2026-W53"]);
    expect(numeros.map((n) => n.envoiPrevu.toISOString().slice(0, 10))).toEqual([
      "2026-11-05", "2026-11-12", "2026-11-19", "2026-11-26", "2026-12-03", "2026-12-10", "2026-12-17", "2026-12-24", "2026-12-31",
    ]);
    expect(numeros[0].envoiPrevu.toISOString()).toBe("2026-11-05T07:00:00.000Z"); // 8 h à Paris (heure d'hiver)
    expect(numeros[0].corps).toContain("utm_content=2026-w45-etape2");
    expect(numeros[0].corps).not.toContain("2026-w46");
    // W46 : fiche « Le renfort du samedi », objet A (titre de la fiche) et accroche B de la relecture.
    expect(numeros[1]).toMatchObject({ ficheId: "2026-11-09", objet: "Le renfort du samedi" });
    expect(numeros[1].corps).toContain("Samedi approche, et il y a toujours un ami qui a une idée de ce que tu pourrais en faire.");
    expect(new Set(numeros.map((n) => n.ficheId)).size).toBe(numeros.length);
    const offertes = carnets.flatMap((c) => c.fiches.filter((f) => f.offerte === true).map((f) => f.id));
    for (const n of numeros) {
      expect(offertes).not.toContain(n.ficheId);
      expect(motifsInterdits([n.objet, n.preEntete, n.corps].join("\n"))).toEqual([]);
      expect(n.corps.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(230);
    }
  });
});

describe("Entrées refusées à la synchronisation (ignorées avec un message)", () => {
  it.each([
    ["fiche inconnue", { ficheId: "2026-11-99" }],
    ["carnet absent", { ficheId: "2027-02-01" }],
    ["semaine 53 inexistante", { semaine: "2027-W53" }],
    ["semaine mal formée", { semaine: "2026-46" }],
    ["fiche d'un carnet pas encore en ligne cette semaine-là", { semaine: "2026-W44" }],
    ["tiret cadratin", { accroche: "Une accroche — interdite." }],
    ["mot « offre »", { accroche: "Une offre spéciale cette semaine." }],
    ["mot « annuel »", { accroche: "Passe à l'abonnement annuel." }],
    ["mot « parrainage »", { accroche: "Pense au parrainage." }],
    ["symbole €", { accroche: "Seulement 2,99 €." }],
    ["émoji", { accroche: "Bonne semaine 😄" }],
    ["objet de plus de 45 caractères", { objet: "Un objet beaucoup trop long pour une boîte de réception mobile" }],
    ["objet qui donne la réplique", { objet: "Je m'en voudrais de les séparer" }],
    ["pont vers /abonnement", { pont: { texte: "Abonne-toi", lien: "https://deviens-marrant.fr/abonnement" } }],
  ])("%s", (_, champ) => {
    const { numeros, ignores } = preparerNumerosHebdo([{ ...base, ...champ }], carnets, VALIDE);
    expect(numeros).toEqual([]);
    expect(ignores).toHaveLength(1);
  });

  it("une fiche n'est jamais envoyée deux fois ; une semaine n'a qu'un numéro", () => {
    const { numeros, ignores } = preparerNumerosHebdo(
      [base, { ...base, semaine: "2026-W47" }, { ...base, ficheId: "2026-11-02" }],
      carnets,
      VALIDE,
    );
    expect(numeros.map((n) => n.semaine)).toEqual(["2026-W46"]);
    expect(ignores).toHaveLength(2);
  });

  it("motifsInterdits : lien /abonnement, utm en -premium, marqueur", () => {
    expect(motifsInterdits("https://deviens-marrant.fr/abonnement?x=1")).toContain("lien /abonnement");
    expect(motifsInterdits("?utm_content=h1-premium")).toContain("utm_content en -premium");
    expect(motifsInterdits("?utm_content=2026-w46-carnet")).toEqual([]);
    expect(motifsInterdits(`${MARQUEUR_A_COMPLETER} : x]`)).toContain("marqueur [À COMPLÉTER");
  });
});

describe("Synchronisation en base (audience HEBDO_PREMIUM, periodKey = semaine)", () => {
  it("H5-1 : création, puis rien si inchangé", async () => {
    expect((await synchroniserNumerosHebdo(factice, NOW, carnets, VALIDE)).crees).toBe(1);
    expect(mockIssues[0]).toMatchObject({ audience: "HEBDO_PREMIUM", periodKey: "2026-W46", status: "VALIDE", subject: fiche.titre });
    const r = await synchroniserNumerosHebdo(factice, NOW, carnets, VALIDE);
    expect(r.crees + r.misAJour).toBe(0);
  });

  it("H5-2 : un numéro ENVOYE n'est JAMAIS modifié", async () => {
    await synchroniserNumerosHebdo(factice, NOW, carnets, VALIDE);
    mockIssues[0].status = "ENVOYE";
    const r = await synchroniserNumerosHebdo([{ ...base, accroche: "Autre accroche." }], NOW, carnets, VALIDE);
    expect(r.misAJour).toBe(0);
    expect(r.ignores[0]).toMatch(/déjà envoyé/);
    expect(mockIssues[0].bodyText).not.toContain("Autre accroche.");
  });

  it("H5-7 : stock sous 4 numéros validés à venir = alerte", async () => {
    await synchroniserNumerosHebdo(factice, NOW, carnets, VALIDE);
    expect(await stockHebdo(NOW)).toEqual({ aVenir: 1, alerte: true });
  });

  it("H5-9 : l'aperçu public de /lettre ne lit QUE la mensuelle (l'hebdo est du contenu Premium)", async () => {
    const { prisma } = jest.requireMock("@/lib/prisma") as { prisma: { newsletterIssue: Record<string, jest.Mock> } };
    prisma.newsletterIssue.findFirst = jest.fn(async () => null);
    await lireApercuLettre();
    expect(prisma.newsletterIssue.findFirst.mock.calls[0][0].where.audience).toBe("MENSUELLE");
  });
});
