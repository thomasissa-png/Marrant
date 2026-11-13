/**
 * @jest-environment node
 *
 * Espace client, lot D5b (s24), règles côté serveur : compte à rebours (première fois, durées essayées,
 * proposition hebdomadaire, jamais de raccourci automatique), premier pas (4 cas de l'arbitrage @ux D5
 * n°3 et règle monotone), plafond de la réplique compté en caractères (constante unique).
 */
const comptes = { ficheFait: 0, carteReponse: 0, etapes: 0, aise: null as string | null, premierPasLe: null as Date | null, ligne: false };
jest.mock("@/lib/prisma", () => ({
  prisma: {
    ficheFait: { count: jest.fn(async () => comptes.ficheFait), upsert: jest.fn(async () => ({})), deleteMany: jest.fn(async () => ({ count: 1 })) },
    carteReponse: { count: jest.fn(async () => comptes.carteReponse) },
    userPathStepCompletion: { count: jest.fn(async () => comptes.etapes) },
    espaceCompte: {
      findUnique: jest.fn(async () => (comptes.ligne || comptes.aise ? { aise: comptes.aise, premierPasLe: comptes.premierPasLe } : null)),
      // Lot D7 (migration 26) : date du premier pas, posée une fois (création sans conflit, puis si vide).
      createMany: jest.fn(async (a: { data: Array<{ premierPasLe: Date }> }) => {
        if (comptes.ligne) return { count: 0 };
        Object.assign(comptes, { ligne: true, premierPasLe: a.data[0].premierPasLe });
        return { count: 1 };
      }),
      updateMany: jest.fn(async (a: { data: { premierPasLe: Date } }) => {
        if (comptes.premierPasLe) return { count: 0 };
        comptes.premierPasLe = a.data.premierPasLe;
        return { count: 1 };
      }),
    },
  },
}));

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { etatCompteARebours, estDuree, type ReponseLue } from "@/lib/espace/compte-a-rebours";
import { figerPremierPas, premierPasDepuis, premierPasFait } from "@/lib/espace/premier-pas-serveur";
import { declarerRetour } from "@/lib/espace/fiche-fait";
import { REPLIQUE_MAX, texteReplique } from "@/lib/espace/repliques";
import { REPLIQUE_MAX_CLIENT } from "@/components/espace/carte/limites";

/** Jeudi 19/11/2026, midi à Paris : semaine en cours depuis le lundi 16, précédente du 9 au 15. */
const MAINTENANT = new Date("2026-11-19T11:00:00Z");
const le = (jour: string) => new Date(`${jour}T10:00:00Z`);
const semainePrecedente = (n: number, oui: number, duree: number | null): ReponseLue[] =>
  Array.from({ length: n }, (_, i) => ({ repondueLe: le(`2026-11-${String(9 + (i % 7)).padStart(2, "0")}`), reponse: i < oui ? "OUI" : "RIEN", compteARebours: duree }));

describe("compte à rebours : état servi à la rafale", () => {
  it("désactivé la première fois : aucune réponse, aucune puce", () => {
    expect(etatCompteARebours({ dureesUtilisees: [], recentes: [], maintenant: MAINTENANT })).toEqual({ visible: false, durees: [10], proposition: null });
  });

  it("ensuite : 10 seulement tant que rien de plus court n'a été essayé ; 7 essayé : 10 et 7 restent (retour visible)", () => {
    expect(etatCompteARebours({ dureesUtilisees: [null], recentes: [], maintenant: MAINTENANT }).durees).toEqual([10]);
    expect(etatCompteARebours({ dureesUtilisees: [null, 10, 7], recentes: [], maintenant: MAINTENANT }).durees).toEqual([10, 7]);
    expect(etatCompteARebours({ dureesUtilisees: [5, 10], recentes: [], maintenant: MAINTENANT }).durees).toEqual([10, 7, 5]);
    // Valeur hors liste (ancienne ligne de test, 1 à 60 en base) : ignorée.
    expect(etatCompteARebours({ dureesUtilisees: [3], recentes: [], maintenant: MAINTENANT }).durees).toEqual([10]);
    expect([estDuree(10), estDuree(7), estDuree(5), estDuree(3), estDuree("10")]).toEqual([true, true, true, false, false]);
  });

  it("proposition : semaine précédente, 10 cartes à la durée la plus courte dont 7 « Oui » ; 7 depuis 10, 5 depuis 7", () => {
    const base = { dureesUtilisees: [10], maintenant: MAINTENANT };
    expect(etatCompteARebours({ ...base, recentes: semainePrecedente(10, 7, 10) }).proposition).toEqual({ essayer: 7, garder: 10 });
    expect(etatCompteARebours({ dureesUtilisees: [10, 7], recentes: semainePrecedente(12, 9, 7), maintenant: MAINTENANT }).proposition).toEqual({ essayer: 5, garder: 7 });
  });

  it("pas de proposition : moins de 10 cartes, moins de 7 « Oui », sans compte à rebours, déjà à 5, ou carte jouée cette semaine", () => {
    const base = { dureesUtilisees: [10], maintenant: MAINTENANT };
    expect(etatCompteARebours({ ...base, recentes: semainePrecedente(9, 9, 10) }).proposition).toBeNull();
    expect(etatCompteARebours({ ...base, recentes: semainePrecedente(10, 6, 10) }).proposition).toBeNull();
    expect(etatCompteARebours({ dureesUtilisees: [null, 10], recentes: semainePrecedente(10, 10, null), maintenant: MAINTENANT }).proposition).toBeNull();
    expect(etatCompteARebours({ dureesUtilisees: [10, 7, 5], recentes: semainePrecedente(14, 14, 5), maintenant: MAINTENANT }).proposition).toBeNull();
    const avecCetteSemaine = [...semainePrecedente(10, 10, 10), { repondueLe: le("2026-11-16"), reponse: "RIEN", compteARebours: 10 }];
    expect(etatCompteARebours({ ...base, recentes: avecCetteSemaine }).proposition).toBeNull();
    // Jamais de raccourci de lui-même : les durées ne changent pas avec la proposition.
    expect(etatCompteARebours({ ...base, recentes: semainePrecedente(10, 10, 10) }).durees).toEqual([10]);
  });
});

describe("premier pas (arbitrage @ux D5 n°3)", () => {
  beforeEach(() => Object.assign(comptes, { ficheFait: 0, carteReponse: 0, etapes: 0, aise: null, premierPasLe: null, ligne: false }));

  it("4 cas : fiche « Fait », carte « Rien », étape seule = vrai ; réplique seule = faux", async () => {
    const sansDate = () => Object.assign(comptes, { premierPasLe: null, ligne: false });
    comptes.ficheFait = 1;
    expect(await premierPasFait("u1")).toBe(true);
    sansDate();
    Object.assign(comptes, { ficheFait: 0, carteReponse: 1 });
    expect(await premierPasFait("u1")).toBe(true);
    sansDate();
    Object.assign(comptes, { carteReponse: 0, etapes: 1 });
    expect(await premierPasFait("u1")).toBe(true);
    // Réplique seule : aucune des sources lues ne bouge (la réplique n'est pas lue).
    sansDate();
    Object.assign(comptes, { etapes: 0 });
    expect(await premierPasFait("u1")).toBe(false);
  });

  it("monotone : « Fait » retiré après la question C9, le premier pas reste fait", async () => {
    Object.assign(comptes, { ficheFait: 0, carteReponse: 0, etapes: 0, aise: "POTES" });
    expect(await premierPasFait("u1")).toBe(true);
    expect(premierPasDepuis({ ficheOuCarte: false, etapesValidees: 0, c9Repondue: false })).toBe(false);
  });

  it("STRICTEMENT monotone (lot D7, migration 26) : « Fait » puis « Pas essayé » AVANT la question C9, il reste fait", async () => {
    comptes.ficheFait = 1;
    expect(await premierPasFait("u1")).toBe(true);
    const date = comptes.premierPasLe;
    expect(date).toBeInstanceOf(Date);
    comptes.ficheFait = 0; // « Pas essayé » retire la ligne ; aucune autre trace, C9 pas répondue
    expect(await premierPasFait("u1")).toBe(true);
    // Jamais réécrite : la date du premier pas reste celle du premier « Fait ».
    await figerPremierPas("u1", new Date("2030-01-01T00:00:00Z"));
    expect(comptes.premierPasLe).toBe(date);
  });

  it("« Fait » déclaré : la date est posée tout de suite (sans attendre « Aujourd'hui »)", async () => {
    await declarerRetour("u1", "fiche-x", "essaye-bof");
    expect(comptes.premierPasLe).toBeInstanceOf(Date);
    await declarerRetour("u1", "fiche-x", "pas-essaye");
    expect(await premierPasFait("u1")).toBe(true);
  });
});

describe("« Ma réplique à moi » : constante unique, comptée en caractères", () => {
  it("même constante côté serveur et navigateur ; 200 caractères acceptés (émojis comptés un), 201 refusés, vide refusé", () => {
    expect(REPLIQUE_MAX).toBe(200);
    expect(REPLIQUE_MAX).toBe(REPLIQUE_MAX_CLIENT);
    const etoile = String.fromCodePoint(0x1f31f);
    expect(texteReplique.safeParse(etoile.repeat(200)).success).toBe(true);
    expect(texteReplique.safeParse(etoile.repeat(201)).success).toBe(false);
    expect(texteReplique.safeParse(`  ${"a".repeat(200)}  `).success).toBe(true);
    expect(texteReplique.safeParse("   ").success).toBe(false);
  });
});

describe("carnet, porte G5 : corrections appliquées aux JSON (docs/copy/espace/g5-corrections-carnet.md)", () => {
  const RACINE = join(__dirname, "..", "..", "..", "..", "..");
  const doc = readFileSync(join(RACINE, "docs/copy/espace/g5-corrections-carnet.md"), "utf8");
  type Ligne = { fiche: string; fichier: string; index: number; champ: string; actuel: string; corrige: string };
  const lignes: Ligne[] = [];
  let section = "";
  let fichier = "";
  for (const l of doc.split("\n")) {
    const s = l.match(/^## ([A-Z])\./);
    if (s) {
      section = s[1];
      fichier = "";
      continue;
    }
    if (!["A", "B", "C"].includes(section) || !l.startsWith("| ") || l.startsWith("| Fiche") || l.startsWith("|---")) continue;
    const [fiche, chemin, actuel, corrige] = l.split("|").slice(1, -1).map((x) => x.trim());
    fichier = chemin.match(/`(2026-1[01]\.json)`/)?.[1] ?? fichier;
    const p = chemin.match(/`fiches\[(\d+)\]\.(\w+)`/)!;
    lignes.push({ fiche: fiche.replace(/\*/g, ""), fichier, index: Number(p[1]), champ: p[2], actuel, corrige });
  }
  const json: Record<string, { fiches: Array<Record<string, unknown>> }> = {
    "2026-10.json": JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", "2026-10.json"), "utf8")),
    "2026-11.json": JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", "2026-11.json"), "utf8")),
  };

  it("42 lignes sur 27 fiches ; chaque champ porte le texte corrigé final, à la bonne fiche", () => {
    expect(lignes).toHaveLength(42);
    expect(new Set(lignes.map((l) => l.fiche)).size).toBe(27);
    for (const l of lignes) {
      const f = json[l.fichier].fiches[l.index];
      expect(f.id).toBe(`2026-${l.fiche}`);
      expect(f[l.champ]).toBe(l.corrige);
      expect(f[l.champ]).not.toBe(l.actuel);
    }
  });

  it("11-29 : JSON inchangé (« oui » corrigé au rendu, section F) ; zéro tiret cadratin ni guillemet droit dans les textes", () => {
    expect(json["2026-11.json"].fiches[28].onTeDit).toBe("Tu viens de dire « oui » sans m'écouter.");
    for (const l of lignes) {
      expect(l.corrige).not.toContain("—");
      expect(l.corrige).not.toContain('"');
    }
  });
});
