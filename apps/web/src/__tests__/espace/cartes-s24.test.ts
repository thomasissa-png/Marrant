/**
 * Espace client, lot D5 (s24) : règles pures du moteur des cartes, des missions et des textes.
 * Table de vérité des trois réponses, maximum 3 cartes par jour et glissement, ordre P1 puis P2 puis P3,
 * rencontre après « pour plaire », humour noir et bonus jamais tirés, carnet hors rafale avant G5,
 * missions en 5 marches, textes exacts des libellés validés.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import situationPoele from "@/lib/espace/fixtures/situation-coloc-la-poele.json";
import situationRetard from "@/lib/espace/fixtures/situation-rencontre-le-retard.json";
import missionsFixtures from "@/lib/espace/fixtures/missions.json";
import { ficheSchema, type Fiche } from "@/lib/espace/fiches-schema";
import {
  CARTES_PAR_JOUR,
  cartesDesSituations,
  composerRafale,
  ficheDeCarte,
  jourParis,
  type CarteRafale,
  type EntreeRafale,
} from "@/lib/espace/rafale";
import { DELAIS_RATE, echeanceApresChoix, echeanceApresReponse } from "@/lib/espace/revision";
import { CARNET_DANS_LA_RAFALE, carnetEnRetard, cartesCarnetRafale } from "@/lib/espace/carnet-cartes";
import { marcheProposee, missionOuverte, suiteApres, validerMissions, type RetourMissionLu } from "@/lib/espace/missions";
import { REPLIQUE_MAX, UNIVERS_PAR_CATEGORIE, texteReplique } from "@/lib/espace/repliques";
import { REPLIQUE_MAX_CLIENT } from "@/components/espace/carte/limites";
import { TEXTES_CARTES, TEXTES_GESTE, TEXTES_MISSION } from "@/config/textes/espace-cartes";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import { parseCarnets } from "@/lib/carnet";
import carnetNovembre from "@/data/carnet/2026-11.json";

jest.mock("@/lib/prisma", () => ({ prisma: {} }));

type Situation = Extract<Fiche, { type: "situation" }>;
const poele = ficheSchema.parse(situationPoele) as Situation;
const retard = ficheSchema.parse(situationRetard) as Situation;

/** Situations factices dérivées des fixtures (ids et paliers seulement changent). */
const variante = (base: Situation, id: string, palier: Situation["palier"], univers: Situation["univers"] = base.univers): Situation => ({
  ...base,
  id,
  palier,
  univers,
});

const MAINTENANT = new Date("2026-11-20T10:00:00Z");
const JOUR = 86_400_000;

function entree(partiel: Partial<EntreeRafale> & { catalogue: CarteRafale[] }): EntreeRafale {
  return {
    entrees: ["coloc-la-poele"],
    suivis: [],
    reponsesDuJour: [],
    debutAbonnement: new Date(MAINTENANT.getTime() - 10 * JOUR),
    nbOui: 0,
    aisePlaire: false,
    rencontreServie: false,
    carnetEnRetard: false,
    maintenant: MAINTENANT,
    ...partiel,
  };
}

describe("révision : table de vérité des trois réponses (2.2)", () => {
  it.each([
    ["OUI", false, null],
    ["MOITIE", false, 7],
    ["RIEN", false, 2],
    ["OUI", true, null],
    ["MOITIE", true, null],
    ["RIEN", true, null],
  ] as const)("%s, révision %s : retour dans %s jours", (reponse, revision, jours) => {
    expect(echeanceApresReponse(reponse, revision, 0)).toEqual({ jours, etapeRate: 0 });
  });

  it("choix raté : J+2, puis J+7, puis J+21, puis plus rien, quelle que soit la réponse", () => {
    let etat = echeanceApresChoix(false, null, 0);
    expect(etat).toEqual({ jours: 2, etapeRate: 1 });
    etat = echeanceApresReponse("OUI", true, etat.etapeRate);
    expect(etat).toEqual({ jours: 7, etapeRate: 2 });
    etat = echeanceApresChoix(true, etat.jours, etat.etapeRate);
    expect(etat).toEqual({ jours: 7, etapeRate: 2 });
    etat = echeanceApresReponse("RIEN", true, etat.etapeRate);
    expect(etat).toEqual({ jours: 21, etapeRate: 3 });
    etat = echeanceApresReponse("MOITIE", true, etat.etapeRate);
    expect(etat).toEqual({ jours: null, etapeRate: 3 });
    expect(DELAIS_RATE).toEqual([2, 7, 21]);
  });

  it("« À moitié » puis choix raté : la date la plus proche gagne (J+2)", () => {
    const r = echeanceApresReponse("MOITIE", false, 0);
    expect(echeanceApresChoix(false, r.jours, r.etapeRate)).toEqual({ jours: 2, etapeRate: 1 });
    expect(echeanceApresChoix(true, r.jours, r.etapeRate)).toEqual({ jours: 7, etapeRate: 0 });
  });
});

describe("catalogue des cartes", () => {
  it("deux cartes « Quel registre ? » par situation, contexte et bonne réponse de chacun", () => {
    const cartes = cartesDesSituations([poele]);
    expect(cartes.map((c) => c.id)).toEqual(["coloc-la-poele.c1", "coloc-la-poele.c2"]);
    expect(cartes.map((c) => c.bonneReponse)).toEqual(["joueuse", "risquee"]);
    expect(ficheDeCarte("coloc-la-poele.c2")).toBe("coloc-la-poele");
    expect(ficheDeCarte("carnet-2026-11-01")).toBe("carnet-2026-11-01");
  });

  it("carnet : aucune carte avant la porte G5 ; une carte « Et toi ? » par fiche publiée après", () => {
    expect(CARNET_DANS_LA_RAFALE).toBe(false);
    expect(cartesCarnetRafale()).toEqual([]);
    expect(carnetEnRetard()).toBe(false);
    const carnets = parseCarnets([carnetNovembre]);
    const fiches = carnets.flatMap((c) => c.fiches);
    const cartes = cartesCarnetRafale(true, carnets, MAINTENANT);
    expect(fiches.length).toBeGreaterThan(0);
    expect(cartes).toHaveLength(fiches.length);
    expect(cartes[0].genre).toBe("et-toi");
    expect(cartes[0].id).toMatch(/^carnet-/);
    // Aucun texte du carnet modifié.
    const f = fiches.find((x) => `carnet-${x.id}` === cartes[0].id)!;
    expect([cartes[0].scene, cartes[0].onTeDit, cartes[0].reponse, cartes[0].siTendu, cartes[0].pourquoi]).toEqual([f.situation, f.onTeDit, f.reponse, f.siTendu, f.pourquoi]);
  });
});

describe("rafale du jour (2.2, 2.3)", () => {
  const p1 = variante(poele, "p1-b", "P1");
  const p2 = variante(poele, "p2-a", "P2");
  const p3 = variante(poele, "p3-a", "P3");
  const catalogue = cartesDesSituations([p3, p2, p1, poele]);

  it("jour 1 : une situation nouvelle, l'entrée d'abord (contexte 1)", () => {
    const r = composerRafale(entree({ catalogue }));
    expect(r.cartes).toEqual([{ carteId: "coloc-la-poele.c1", nouvelle: true }]);
    expect(r.fini).toBe(false);
  });

  it("ordre : entrée, puis P1, puis P2 ; P3 fermé avant la semaine 4 et 20 « Oui »", () => {
    const vu = (id: string) => ({ carteId: `${id}.c1`, dueLe: null, premiereVueLe: new Date(MAINTENANT.getTime() - 5 * JOUR) });
    expect(composerRafale(entree({ catalogue, suivis: [vu("coloc-la-poele")] })).cartes[0].carteId).toBe("p1-b.c1");
    expect(composerRafale(entree({ catalogue, suivis: [vu("coloc-la-poele"), vu("p1-b")] })).cartes[0].carteId).toBe("p2-a.c1");
    const tout = [vu("coloc-la-poele"), vu("p1-b"), vu("p2-a")];
    const sansP3 = composerRafale(entree({ catalogue, suivis: tout })).cartes.filter((c) => c.nouvelle);
    expect(sansP3).toEqual([]);
    expect(composerRafale(entree({ catalogue, suivis: tout, nbOui: 20 })).cartes[0].carteId).toBe("p3-a.c1");
    const semaine5 = new Date(MAINTENANT.getTime() - 29 * JOUR);
    expect(composerRafale(entree({ catalogue, suivis: tout, debutAbonnement: semaine5 })).cartes[0].carteId).toBe("p3-a.c1");
  });

  it("après « pour plaire » : une situation de rencontre, une fois, puis l'ordre normal", () => {
    const avecRencontre = cartesDesSituations([poele, retard]);
    expect(composerRafale(entree({ catalogue: avecRencontre, aisePlaire: true })).cartes[0].carteId).toBe("rencontre-le-retard.c1");
    expect(composerRafale(entree({ catalogue: avecRencontre, aisePlaire: true, rencontreServie: true })).cartes[0].carteId).toBe("coloc-la-poele.c1");
  });

  it("au plus 3 cartes par jour : 1 nouvelle et 2 à revoir ; les cartes en trop glissent, aucun arriéré", () => {
    const dues = ["p1-b.c1", "p2-a.c1", "p3-a.c1"].map((carteId, i) => ({
      carteId,
      dueLe: new Date(MAINTENANT.getTime() - (5 - i) * JOUR),
      premiereVueLe: new Date(MAINTENANT.getTime() - 9 * JOUR),
    }));
    const r = composerRafale(entree({ catalogue, suivis: dues }));
    expect(r.cartes).toEqual([
      { carteId: "coloc-la-poele.c1", nouvelle: true },
      { carteId: "p1-b.c1", nouvelle: false },
      { carteId: "p2-a.c1", nouvelle: false },
    ]);
    expect(r.cartes.length).toBeLessThanOrEqual(CARTES_PAR_JOUR);
    // La troisième carte due glisse au lendemain : elle n'est ni perdue ni comptée en retard.
    const lendemain = new Date(MAINTENANT.getTime() + JOUR);
    const r2 = composerRafale(entree({ catalogue, suivis: dues.slice(2), maintenant: lendemain }));
    expect(r2.cartes.map((c) => c.carteId)).toContain("p3-a.c1");
  });

  it("cartes déjà jouées aujourd'hui : elles comptent dans les 3, une seule nouvelle par jour", () => {
    const suivis = [{ carteId: "coloc-la-poele.c1", dueLe: null, premiereVueLe: MAINTENANT }];
    const r = composerRafale(entree({ catalogue, suivis, reponsesDuJour: [{ carteId: "coloc-la-poele.c1", nouvelle: true }] }));
    expect(r.faites).toEqual(["coloc-la-poele.c1"]);
    expect(r.cartes.filter((c) => c.nouvelle)).toEqual([]);
    expect(r.fini).toBe(true);
    const trois = ["a", "b", "c"].map((x) => ({ carteId: `${x}.c1`, nouvelle: false }));
    expect(composerRafale(entree({ catalogue, reponsesDuJour: trois })).cartes).toEqual([]);
  });

  it("place libre sans carte à revoir : second contexte d'une situation vue un autre jour, sinon « C'est tout »", () => {
    const hier = { carteId: "coloc-la-poele.c1", dueLe: null, premiereVueLe: new Date(MAINTENANT.getTime() - JOUR) };
    const r = composerRafale(entree({ catalogue: cartesDesSituations([poele]), suivis: [hier] }));
    expect(r.cartes).toEqual([{ carteId: "coloc-la-poele.c2", nouvelle: false }]);
    const aujourdhui = { ...hier, premiereVueLe: MAINTENANT };
    expect(composerRafale(entree({ catalogue: cartesDesSituations([poele]), suivis: [aujourdhui] })).fini).toBe(true);
  });

  it("carnet en retard : une situation nouvelle un jour sur deux", () => {
    const jours = [0, 1].map((n) => new Date(MAINTENANT.getTime() + n * JOUR));
    const nouvelles = jours.map((m) => composerRafale(entree({ catalogue, carnetEnRetard: true, maintenant: m })).cartes.filter((c) => c.nouvelle).length);
    expect(nouvelles.sort()).toEqual([0, 1]);
  });

  it("jour civil de Paris", () => {
    expect(jourParis(new Date("2026-11-20T23:30:00Z"))).toBe("2026-11-21");
  });
});

describe("missions en 5 marches (2.4)", () => {
  const missions = validerMissions(missionsFixtures);
  const r = (missionId: string, marche: number, retour: RetourMissionLu["retour"]): RetourMissionLu => ({ missionId, marche, retour });

  it("sans retour : marche 1 ; « ça a marché » : marche d'au-dessus ; « bof » : même marche, autre situation", () => {
    expect(marcheProposee([])).toBe(1);
    expect(missionOuverte(missions, [])?.id).toBe("fixture-marche-1-a");
    const marche = [r("confiance-faux-secret-message", 2, "essaye-ca-a-marche")];
    expect(suiteApres(marche)).toBe("marche");
    expect(missionOuverte(missions, marche)?.marche).toBe(3);
    const bof = [r("confiance-faux-secret-message", 2, "essaye-bof")];
    expect(suiteApres(bof)).toBe("bof");
    expect(missionOuverte(missions, bof)?.id).toBe("fixture-marche-2-b");
  });

  it("« Pas essayé » : la mission reste ; deux fois de suite : la marche d'en dessous, sans commentaire", () => {
    const une = [r("confiance-faux-secret-message", 2, "pas-essaye")];
    expect(suiteApres(une)).toBe("pas");
    expect(missionOuverte(missions, une)?.id).toBe("confiance-faux-secret-message");
    const deux = [...une, r("confiance-faux-secret-message", 2, "pas-essaye")];
    expect(suiteApres(deux)).toBe("pas2");
    expect(marcheProposee(deux)).toBe(1);
    // À la marche 1 : une autre situation, jamais un message.
    const m1 = [r("fixture-marche-1-a", 1, "pas-essaye"), r("fixture-marche-1-a", 1, "pas-essaye")];
    expect(missionOuverte(missions, m1)?.id).toBe("fixture-marche-1-b");
  });

  it("à la marche 5, « ça a marché » reste à la marche 5", () => {
    expect(marcheProposee([r("x", 5, "essaye-ca-a-marche")])).toBe(5);
  });

  it("le fichier servi est vide et valide ; une mission en double est refusée", () => {
    const servies = JSON.parse(readFileSync(join(__dirname, "../../data/espace/missions.json"), "utf8"));
    expect(validerMissions(servies)).toEqual([]);
    expect(() => validerMissions([missionsFixtures[0], missionsFixtures[0]])).toThrow();
  });
});

describe("« Ma réplique à moi » : plafond et correspondance catégorie / univers", () => {
  it("une phrase de 1 à REPLIQUE_MAX caractères, même plafond côté navigateur", () => {
    expect(REPLIQUE_MAX).toBe(REPLIQUE_MAX_CLIENT);
    expect(texteReplique.safeParse("   ").success).toBe(false);
    expect(texteReplique.safeParse("a".repeat(REPLIQUE_MAX)).success).toBe(true);
    expect(texteReplique.safeParse("a".repeat(REPLIQUE_MAX + 1)).success).toBe(false);
  });

  it("correspondance certaine seulement (rencard = rencontre, jamais couple)", () => {
    expect(UNIVERS_PAR_CATEGORIE.rencard).toEqual(["rencontre"]);
    expect(Object.values(UNIVERS_PAR_CATEGORIE).flat()).not.toContain("couple");
  });
});

describe("textes du lot D5 : libellés validés, mot pour mot", () => {
  const libelles = readFileSync(join(__dirname, "../../../../../docs/copy/libelles-espace-e5-s24.md"), "utf8");
  const tous = JSON.stringify([TEXTES_CARTES, TEXTES_GESTE, TEXTES_MISSION, TEXTES_REPLIQUES]);

  it("zéro tiret cadratin, zéro émoji", () => {
    expect(tous).not.toContain("—");
    expect(tous).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it.each([
    TEXTES_CARTES.laquelle,
    TEXTES_CARTES.regle(7),
    TEXTES_CARTES.regle(2),
    TEXTES_GESTE.tonRetour,
    TEXTES_GESTE.note.confirmer,
    TEXTES_GESTE.note.echec,
    TEXTES_MISSION.titresMarches[1],
    TEXTES_MISSION.titresMarches[2],
    TEXTES_MISSION.titresMarches[3],
    TEXTES_MISSION.titresMarches[4],
    TEXTES_MISSION.autreSituation,
    TEXTES_MISSION.voirLaMarche(3),
    TEXTES_REPLIQUES.lectureSeule,
    TEXTES_REPLIQUES.pourCategorie("Soirée").replace("soirée", "{catégorie}"),
  ])("« %s » figure dans le fichier de libellés", (t) => {
    expect(libelles).toContain(t);
  });

  it("la mission Confiance marche 2 de la fixture reprend le §4 des libellés mot pour mot", () => {
    const m = missionsFixtures[0];
    for (const t of [...m.enonce, m.suites.marche!, m.suites.bof!]) expect(libelles).toContain(t);
  });
});
