/**
 * @jest-environment node
 *
 * Lettre de la semaine : numéros préparés (s21, US-H5). s22 (décision de Thomas du 25/10) :
 * plus de fiche du carnet recopiée, chaque numéro est un texte libre de l'équipe
 * ({ semaine, statut, envoiPrevu?, objet, preEntete, corps }). Contrôles : forme du corps
 * (« Salut, », signature), objet de 45 caractères au plus, aucune offre commerciale (avis @legal
 * C1), semaine unique, jamais la semaine d'une lettre du mois, et synchronisation qui retire les
 * anciens numéros pas encore partis (W45 à W53, ancien format).
 * Numéro FACTICE : `__tests__/helpers/lettre-hebdo-numero-factice.json` (jamais en production).
 */
import { readFileSync } from "fs";
import { join } from "path";

type Issue = {
  id: string;
  audience: string;
  periodKey: string;
  subject: string;
  preheader: string | null;
  bodyText: string;
  scheduledFor: Date;
  status: string;
  validatedAt: Date | null;
  approvedAt?: Date | null;
  approvedBy?: string | null;
  approvedHash?: string | null;
};
type Where = { audience?: string; status?: { not: string }; periodKey?: { notIn: string[] }; sends?: { none: object } };
const mockIssues: Issue[] = [];
/** Numéros (id) qui ont un journal d'envoi. */
const mockJournal = new Set<string>();
const filtre = (w: Where) => (i: Issue) =>
  (!w.audience || i.audience === w.audience) &&
  (!w.status || i.status !== w.status.not) &&
  (!w.periodKey || !w.periodKey.notIn.includes(i.periodKey)) &&
  (!w.sends || !mockJournal.has(i.id));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    newsletterIssue: {
      findUnique: jest.fn(async ({ where }: { where: { audience_periodKey: { audience: string; periodKey: string } } }) =>
        mockIssues.find((i) => i.audience === where.audience_periodKey.audience && i.periodKey === where.audience_periodKey.periodKey) ?? null,
      ),
      findMany: jest.fn(async ({ where }: { where: Where }) => mockIssues.filter(filtre(where)).sort((a, b) => a.periodKey.localeCompare(b.periodKey))),
      create: jest.fn(async ({ data }: { data: Omit<Issue, "id"> }) => {
        const i = { id: `i${mockIssues.length + 1}`, ...data } as Issue;
        mockIssues.push(i);
        return i;
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<Issue> }) => Object.assign(mockIssues.find((i) => i.id === where.id)!, data)),
      updateMany: jest.fn(async ({ where, data }: { where: Where; data: Partial<Issue> }) => {
        const cibles = mockIssues.filter(filtre(where));
        for (const i of cibles) Object.assign(i, data);
        return { count: cibles.length };
      }),
      deleteMany: jest.fn(async ({ where }: { where: Where }) => {
        const cibles = mockIssues.filter(filtre(where));
        for (const i of cibles) mockIssues.splice(mockIssues.indexOf(i), 1);
        return { count: cibles.length };
      }),
      count: jest.fn(async () => mockIssues.filter((i) => i.status === "VALIDE").length),
    },
  },
}));

import factice from "../helpers/lettre-hebdo-numero-factice.json";
import numerosReels from "@/data/lettre/hebdo-premium.json";
import { MARQUEUR_A_COMPLETER } from "@/config/lettre";
import {
  OBJET_HEBDO_MAX,
  motifsInterdits,
  preparerNumerosHebdo,
  semainesLettreDuMois,
  stockHebdo,
  synchroniserNumerosHebdo,
} from "@/lib/lettre/numeros-hebdo";
import { empreinteNumero } from "@/lib/lettre/approbation-hebdo";
import { lireApercuLettre } from "@/lib/lettre/apercu";

const NOW = new Date("2026-10-26T10:00:00Z");
const base = factice[0];
const AUCUNE = new Set<string>();

beforeEach(() => {
  mockIssues.length = 0;
  mockJournal.clear();
});

describe("Schéma d'un numéro réservé (texte libre de l'équipe)", () => {
  it("numéro factice accepté tel quel ; envoi par défaut = jeudi 8 h Paris de sa semaine", () => {
    const { numeros, ignores } = preparerNumerosHebdo(factice, AUCUNE);
    expect(ignores).toEqual([]);
    expect(numeros[0]).toEqual({
      semaine: "2026-W46",
      statut: "VALIDE",
      objet: base.objet,
      preEntete: base.preEntete,
      corps: base.corps,
      envoiPrevu: new Date("2026-11-12T07:00:00.000Z"),
    });
  });

  it("envoiPrevu facultatif : accepté dans la semaine après le jeudi 8 h, refusé avant ou hors de la semaine", () => {
    expect(preparerNumerosHebdo([{ ...base, envoiPrevu: "2026-11-13T08:00:00+01:00" }], AUCUNE).numeros[0].envoiPrevu.toISOString()).toBe("2026-11-13T07:00:00.000Z");
    for (const envoiPrevu of ["2026-11-11T08:00:00+01:00", "2026-11-16T08:00:00+01:00"]) {
      const { numeros, ignores } = preparerNumerosHebdo([{ ...base, envoiPrevu }], AUCUNE);
      expect(numeros).toEqual([]);
      expect(ignores[0]).toMatch(/envoiPrevu hors de la semaine/);
    }
  });

  it("le fichier réel : un seul numéro, W46 en BROUILLON, lettre A des étalons recopiée mot pour mot (seul l'utm change)", () => {
    const { numeros, ignores } = preparerNumerosHebdo(numerosReels);
    expect(ignores).toEqual([]);
    expect(numeros).toHaveLength(1);
    const n = numeros[0];
    expect(n).toMatchObject({ semaine: "2026-W46", statut: "BROUILLON", objet: "T'as perdu ta langue ? Trois réponses" });
    expect(n.preEntete).toBe("Une pique, trois réponses, et comment choisir selon la personne.");
    expect(n.envoiPrevu.toISOString()).toBe("2026-11-12T07:00:00.000Z");
    const doc = readFileSync(join(__dirname, "..", "..", "..", "..", "..", "docs", "copy", "lettre-premium-etalons-s22.md"), "utf8").split("\n");
    const debut = doc.indexOf("## Lettre A : une situation, trois répliques");
    const fin = doc.findIndex((l, i) => i > debut && l.startsWith("**Notes de rédaction"));
    expect(debut).toBeGreaterThan(0);
    expect(fin).toBeGreaterThan(debut);
    const lettreA = doc.slice(debut, fin).filter((l) => l.startsWith(">")).map((l) => l.replace(/^> ?/, "")).join("\n");
    expect(n.corps).toBe(lettreA.replace("utm_content=etalon-a", "utm_content=2026-w46-etape3"));
    expect(n.corps.startsWith("Salut,\n\nSamedi de novembre, il pleut.")).toBe(true);
    expect(n.corps.endsWith("À jeudi prochain,\nL'Équipe Deviens Marrant")).toBe(true);
    expect(n.corps).toContain("https://deviens-marrant.fr/parcours/repartie?utm_source=lettre-premium&utm_medium=email&utm_content=2026-w46-etape3#etape-3");
    expect(motifsInterdits([n.objet, n.preEntete, n.corps].join("\n"))).toEqual([]);
  });

  it("semaines des lettres du mois programmées (numeros.json) : W45 (05/11), W49 (03/12), 2027-W01 (07/01)", () => {
    const s = semainesLettreDuMois();
    for (const k of ["2026-W45", "2026-W49", "2027-W01"]) expect(s.has(k)).toBe(true);
    expect(s.has("2026-W46")).toBe(false);
  });
});

describe("Entrées refusées (ignorées avec un message, jamais en base)", () => {
  it.each([
    ["objet de plus de 45 caractères", { objet: "Un objet beaucoup trop long pour une boîte de réception mobile" }, /45 caractères au plus/],
    ["corps qui ne commence pas par « Salut, »", { corps: "Bonjour,\n\nUne situation, trois répliques, et comment choisir.\n\nL'Équipe Deviens Marrant" }, /commencer par « Salut, »/],
    ["corps sans la signature", { corps: "Salut,\n\nUne situation, trois répliques, et comment choisir, sans signature." }, /signature « L'Équipe Deviens Marrant » absente/],
    ["pré-en-tête absent", { preEntete: undefined }, /Required/],
    ["semaine 53 inexistante", { semaine: "2027-W53" }, /semaine ISO/],
    ["semaine mal formée", { semaine: "2026-46" }, /semaine ISO/],
    ["ancien format (fiche du carnet)", { ficheId: "2026-11-09" }, /ficheId/],
    ["tiret cadratin", { preEntete: "Une pique — trois réponses." }, /tiret cadratin/],
    ["mot « offre »", { corps: `${base.corps}\nUne offre spéciale cette semaine.` }, /mot « offre »/],
    ["mot « annuel »", { corps: `${base.corps}\nPasse à l'abonnement annuel.` }, /annuel/],
    ["mot « parrainage »", { objet: "Pense au parrainage" }, /parrain/],
    ["symbole €", { corps: `${base.corps}\nSeulement 2,99 €.` }, /symbole €/],
    ["émoji", { objet: "Bonne semaine 😄" }, /émoji/],
    ["lien /abonnement", { corps: `${base.corps}\nhttps://deviens-marrant.fr/abonnement` }, /lien \/abonnement/],
    ["marqueur [À COMPLÉTER", { corps: `${base.corps}\n${MARQUEUR_A_COMPLETER} : exemple]` }, /marqueur/],
  ])("%s", (_, champ, motif) => {
    const { numeros, ignores } = preparerNumerosHebdo([{ ...base, ...champ }], AUCUNE);
    expect(numeros).toEqual([]);
    expect(ignores).toHaveLength(1);
    expect(ignores[0]).toMatch(motif);
  });

  it(`OBJET_HEBDO_MAX = 45 : 45 caractères acceptés, 46 refusés`, () => {
    expect(OBJET_HEBDO_MAX).toBe(45);
    expect(preparerNumerosHebdo([{ ...base, objet: "x".repeat(45) }], AUCUNE).numeros).toHaveLength(1);
    expect(preparerNumerosHebdo([{ ...base, objet: "x".repeat(46) }], AUCUNE).numeros).toHaveLength(0);
  });

  it("une semaine n'a qu'un numéro", () => {
    const { numeros, ignores } = preparerNumerosHebdo([base, { ...base, objet: "Un autre objet" }], AUCUNE);
    expect(numeros).toHaveLength(1);
    expect(ignores).toEqual(["2026-W46 : deux numéros pour la même semaine"]);
  });

  it("semaine d'une lettre du mois programmée : refusé (W45, lettre du mois du 05/11)", () => {
    const { numeros, ignores } = preparerNumerosHebdo([{ ...base, semaine: "2026-W45" }]);
    expect(numeros).toEqual([]);
    expect(ignores).toEqual(["2026-W45 : semaine de la lettre du mois (numeros.json), pas de lettre réservée"]);
  });

  it("motifsInterdits : lien /abonnement, utm en -premium, marqueur", () => {
    expect(motifsInterdits("https://deviens-marrant.fr/abonnement?x=1")).toContain("lien /abonnement");
    expect(motifsInterdits("?utm_content=h1-premium")).toContain("utm_content en -premium");
    expect(motifsInterdits("?utm_content=2026-w46-etape3")).toEqual([]);
    expect(motifsInterdits(`${MARQUEUR_A_COMPLETER} : x]`)).toContain("marqueur [À COMPLÉTER");
  });
});

describe("Synchronisation en base (audience HEBDO_PREMIUM, periodKey = semaine)", () => {
  it("H5-1 : création, puis rien si inchangé", async () => {
    expect((await synchroniserNumerosHebdo(factice, NOW, AUCUNE)).crees).toBe(1);
    expect(mockIssues[0]).toMatchObject({ audience: "HEBDO_PREMIUM", periodKey: "2026-W46", status: "VALIDE", subject: base.objet, preheader: base.preEntete, bodyText: base.corps });
    const r = await synchroniserNumerosHebdo(factice, NOW, AUCUNE);
    expect(r).toEqual({ crees: 0, misAJour: 0, retires: [], ignores: [] });
  });

  it("H5-2 : un numéro ENVOYE n'est JAMAIS modifié ni retiré", async () => {
    await synchroniserNumerosHebdo(factice, NOW, AUCUNE);
    mockIssues[0].status = "ENVOYE";
    const r = await synchroniserNumerosHebdo([{ ...base, corps: `${base.corps}\nAutre texte.` }], NOW, AUCUNE);
    expect(r.misAJour).toBe(0);
    expect(r.ignores[0]).toMatch(/déjà envoyé/);
    expect(mockIssues[0].bodyText).toBe(base.corps);
    expect((await synchroniserNumerosHebdo([], NOW, AUCUNE)).retires).toEqual([]);
    expect(mockIssues).toHaveLength(1);
  });

  it("empreinte d'approbation : objet, pré-en-tête, corps et date ; corps modifié dans le fichier = approbation effacée", async () => {
    await synchroniserNumerosHebdo(factice, NOW, AUCUNE);
    const i = mockIssues[0];
    const empreinte = empreinteNumero(i);
    for (const modif of [{ subject: "Autre" }, { preheader: "Autre" }, { bodyText: `${i.bodyText}.` }, { scheduledFor: new Date("2026-11-13T07:00:00Z") }]) {
      expect(empreinteNumero({ ...i, ...modif })).not.toBe(empreinte);
    }
    Object.assign(i, { approvedAt: NOW, approvedBy: "admin", approvedHash: empreinte });
    const r = await synchroniserNumerosHebdo([{ ...base, corps: base.corps.replace("trois répliques", "trois réponses") }], NOW, AUCUNE);
    expect(r.misAJour).toBe(1);
    expect(i).toMatchObject({ approvedAt: null, approvedBy: null, approvedHash: null });
  });

  it("production au déploiement : les 9 anciens numéros (W45 à W53, fiche recopiée, brouillons jamais envoyés) sont retirés, sauf W46 remplacé par la lettre A, à approuver", async () => {
    const SEMAINES = ["2026-W45", "2026-W46", "2026-W47", "2026-W48", "2026-W49", "2026-W50", "2026-W51", "2026-W52", "2026-W53"];
    for (const [k, semaine] of SEMAINES.entries()) {
      mockIssues.push({
        id: `ancien${k}`,
        audience: "HEBDO_PREMIUM",
        periodKey: semaine,
        subject: "Le renfort du samedi",
        preheader: "La scène de la semaine, la réplique et l'exercice.",
        bodyText: "Salut,\n\nAncien texte assemblé depuis la fiche du carnet.\n\nToutes les fiches du mois, dans ton carnet : https://deviens-marrant.fr/carnet",
        scheduledFor: new Date("2026-11-12T07:00:00Z"),
        status: "BROUILLON",
        validatedAt: null,
        approvedAt: null,
        approvedBy: null,
        approvedHash: null,
      });
    }
    // Une lettre du mois en base n'est jamais touchée par la synchronisation des lettres réservées.
    mockIssues.push({ id: "m11", audience: "MENSUELLE", periodKey: "2026-11", subject: "On a comparé nos salaires", preheader: null, bodyText: "x", scheduledFor: new Date("2026-11-05T07:00:00Z"), status: "VALIDE", validatedAt: NOW });
    const r = await synchroniserNumerosHebdo(numerosReels, NOW);
    expect(r).toMatchObject({ crees: 0, misAJour: 1, ignores: [] });
    expect(r.retires).toEqual(SEMAINES.filter((s) => s !== "2026-W46"));
    const hebdo = mockIssues.filter((i) => i.audience === "HEBDO_PREMIUM");
    expect(hebdo).toHaveLength(1);
    expect(hebdo[0]).toMatchObject({ id: "ancien1", periodKey: "2026-W46", status: "BROUILLON", subject: "T'as perdu ta langue ? Trois réponses", approvedHash: null });
    expect(hebdo[0].bodyText).not.toContain("carnet");
    expect(mockIssues.find((i) => i.id === "m11")).toBeDefined();
    // Redémarrage suivant : plus rien à faire.
    expect(await synchroniserNumerosHebdo(numerosReels, NOW)).toEqual({ crees: 0, misAJour: 0, retires: [], ignores: [] });
  });

  it("numéro retiré du fichier avec un journal d'envoi (cas limite) : gardé pour l'historique, remis en brouillon sans approbation, ne part plus", async () => {
    await synchroniserNumerosHebdo([{ ...base, semaine: "2026-W47" }], NOW, AUCUNE);
    Object.assign(mockIssues[0], { approvedAt: NOW, approvedBy: "admin", approvedHash: empreinteNumero(mockIssues[0]) });
    mockJournal.add(mockIssues[0].id);
    const r = await synchroniserNumerosHebdo([], NOW, AUCUNE);
    expect(r.retires).toEqual([]);
    expect(r.ignores).toEqual(["2026-W47 : absent du fichier, envoi déjà commencé : gardé en brouillon, ne part plus"]);
    expect(mockIssues[0]).toMatchObject({ status: "BROUILLON", validatedAt: null, approvedAt: null, approvedHash: null });
  });

  it("fichier illisible (pas un tableau) : rien n'est retiré", async () => {
    await synchroniserNumerosHebdo(factice, NOW, AUCUNE);
    expect(await synchroniserNumerosHebdo({ pas: "un tableau" }, NOW, AUCUNE)).toEqual({ crees: 0, misAJour: 0, retires: [], ignores: [] });
    expect(mockIssues).toHaveLength(1);
  });

  it("H5-7 : stock sous 4 numéros validés à venir = alerte", async () => {
    await synchroniserNumerosHebdo(factice, NOW, AUCUNE);
    expect(await stockHebdo(NOW)).toEqual({ aVenir: 1, alerte: true });
  });

  it("H5-9 : l'aperçu public de /lettre ne lit QUE la mensuelle (l'hebdo est du contenu Premium)", async () => {
    const { prisma } = jest.requireMock("@/lib/prisma") as { prisma: { newsletterIssue: Record<string, jest.Mock> } };
    prisma.newsletterIssue.findFirst = jest.fn(async () => null);
    await lireApercuLettre();
    expect(prisma.newsletterIssue.findFirst.mock.calls[0][0].where.audience).toBe("MENSUELLE");
  });
});
