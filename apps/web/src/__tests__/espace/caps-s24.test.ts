/**
 * @jest-environment node
 *
 * Espace client, lot D4 (s24) : caps, bonus, découpage des 25 étapes, recalcul silencieux, export des
 * données (@legal G9). Conception : `docs/espace-client/niveaux-xp-s24.md` v10.1 (critères 2, 3, 5,
 * 13, 14, 16, 17, 19 de 3.6) ; plan `plan-developpement-s24.md` lot D4.
 */
import { createHash } from "crypto";
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import {
  NUMEROS_CAPS,
  SEUILS_CAPS,
  annoncesAFaire,
  capDepuisXp,
  marquesSilencieuses,
  niveauRecalcule,
  xpDeDeblocage,
  type BonusRange,
  type NumeroCap,
} from "@/lib/espace/caps";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { STORYTELLING_PUBLIE, BOULOT_PUBLIE } from "@/config/parcours-publication";
import { getPathXpTotal, getStepXpFromSeed, PATH_COMPLETION_BONUS_XP, XP_THRESHOLDS, SEUILS_ANCIENS, calculateLevel } from "@/lib/progression";
import { totalParcoursXp, PARCOURS_BONUS_FIN_XP, PARCOURS_ETAPE_XP_DEFAUT } from "@/lib/parcours-xp";
import { DECOUPAGE, blocReference, type EtapeSeed } from "@/lib/espace/parcours-fiches";
import { TEXTES_CAPS, TEXTES_PARCOURS_ESPACE } from "@/config/textes/espace-caps";
import { creerChargeurs, type SourcesFiches } from "@/lib/espace/fiches";
import { FICHIERS_ESPACE } from "@/lib/espace/fiches-schema";
import { bonusOuverts, bonusRanges } from "@/lib/espace/bonus";
import { etapeAReprendre } from "@/lib/espace/quatre-semaines";
import bonusFactice from "@/lib/espace/fixtures/bonus-factice-cap-2.json";

const SRC = join(__dirname, "../..");
const ABONNE = { acces: "ouvert" as const, userId: "u1" };
const NON_ABONNE = { acces: "abonnement" as const, userId: "u2", ancienAbonne: false };

describe("seuils des caps (critères 2 et 5)", () => {
  const totalPublie = PARCOURS_SEED_JSON.reduce((s, p) => s + getPathXpTotal(p.slug, p.steps.map((e) => e.week)), 0);

  it("les deux parcours publiés en s18 et s19 le sont toujours (sinon recaler les seuils)", () => {
    expect(STORYTELLING_PUBLIE).toBe(true);
    expect(BOULOT_PUBLIE).toBe(true);
    expect(PARCOURS_SEED_JSON).toHaveLength(5);
    expect(totalPublie).toBe(3100);
  });

  it("seuils 0, 100, 300, 700, 2 300 strictement croissants, le dernier <= 80 % du total publié", () => {
    expect(SEUILS_CAPS).toEqual([0, 100, 300, 700, 2300]);
    for (let i = 1; i < SEUILS_CAPS.length; i++) expect(SEUILS_CAPS[i]).toBeGreaterThan(SEUILS_CAPS[i - 1]);
    expect(SEUILS_CAPS[4]).toBeLessThanOrEqual(0.8 * totalPublie);
  });

  it("recompte sur les seeds : 17 étapes rapportent au plus 2 225, 18 suffisent pour 2 300", () => {
    // Meilleure somme pour k étapes : par parcours, les c meilleures étapes (+ bonus si toutes), puis sac à dos.
    const meilleur = new Array<number>(26).fill(-Infinity);
    meilleur[0] = 0;
    for (const p of PARCOURS_SEED_JSON) {
      const xps = p.steps.map((e) => getStepXpFromSeed(p.slug, e.week)).sort((a, b) => b - a);
      const parC = xps.map((_, i) => xps.slice(0, i + 1).reduce((a, b) => a + b, 0) + (i + 1 === xps.length ? PATH_COMPLETION_BONUS_XP : 0));
      const avant = [...meilleur];
      for (let k = 0; k < avant.length; k++) {
        if (avant[k] === -Infinity) continue;
        parC.forEach((v, i) => {
          const c = k + i + 1;
          if (c < meilleur.length) meilleur[c] = Math.max(meilleur[c], avant[k] + v);
        });
      }
    }
    expect(meilleur[17]).toBe(2225);
    expect(meilleur[17]).toBeLessThan(2300);
    expect(meilleur[18]).toBeGreaterThanOrEqual(2300);
  });

  it("seuils à un seul endroit du code : le tableau des caps n'existe que dans lib/espace/caps.ts", () => {
    const fichiers = sources(SRC).filter((f) => !f.includes("__tests__"));
    const porteurs = fichiers.filter((f) => /\[\s*0,\s*100,\s*300,\s*700,\s*2300\s*\]/.test(readFileSync(f, "utf8")));
    expect(porteurs.map((f) => relative(SRC, f))).toEqual(["lib/espace/caps.ts"]);
  });

  it("interrupteur fermé : la validation d'étape garde l'ancienne table et les anciens niveaux", () => {
    expect(XP_THRESHOLDS).toEqual(SEUILS_ANCIENS);
    expect(SEUILS_ANCIENS).toEqual({ NOVICE: 0, APPRENTI: 100, FARCEUR: 500, COMIQUE: 1500, LEGENDE: 5000 });
    expect(calculateLevel(300)).toBe("APPRENTI");
    expect(calculateLevel(2300)).toBe("COMIQUE");
  });

  it("source unique du total : serveur (seed) et écran (API) donnent le même total, bonus de fin compris", () => {
    expect(PATH_COMPLETION_BONUS_XP).toBe(PARCOURS_BONUS_FIN_XP);
    for (const p of PARCOURS_SEED_JSON) {
      const ordres = p.steps.map((e) => e.week);
      expect(getPathXpTotal(p.slug, ordres)).toBe(totalParcoursXp(p.steps.map((e) => ({ moduleXp: e.moduleXp }))));
    }
    expect(getStepXpFromSeed("inconnu", 1)).toBe(PARCOURS_ETAPE_XP_DEFAUT);
  });
});

describe("cap affiché et cap de déblocage (critères 3 et 16)", () => {
  it.each([
    [0, 1],
    [99, 1],
    [100, 2],
    [299, 2],
    [300, 3],
    [700, 4],
    [2299, 4],
    [2300, 5],
    [9000, 5],
  ])("%i XP : cap %i", (xp, cap) => expect(capDepuisXp(xp)).toBe(cap));

  it("le cap affiché ne baisse jamais quand l'XP monte", () => {
    let avant = 1;
    for (let xp = 0; xp <= 3200; xp += 25) {
      const cap = capDepuisXp(xp);
      expect(cap).toBeGreaterThanOrEqual(avant);
      avant = cap;
    }
  });

  it("le recalcul ne baisse aucun niveau (ancien LEGENDE à 400 XP reste LEGENDE)", () => {
    expect(niveauRecalcule("LEGENDE", 400)).toBe("LEGENDE");
    expect(niveauRecalcule("APPRENTI", 750)).toBe("COMIQUE");
    expect(niveauRecalcule("NOVICE", 0)).toBe("NOVICE");
  });

  it("déblocage : XP d'étapes et bonus de fin, une étape comptée une fois (double validation)", () => {
    const etapes = [
      { slug: "machine-a-cafe", ordre: 1 },
      { slug: "machine-a-cafe", ordre: 1 },
      { slug: "machine-a-cafe", ordre: 2 },
      { slug: "machine-a-cafe", ordre: 3 },
    ];
    expect(xpDeDeblocage(etapes, ["machine-a-cafe", "machine-a-cafe"], getStepXpFromSeed, PATH_COMPLETION_BONUS_XP)).toBe(325);
  });

  it("compte à XP gonflé sans étape : aucun bonus, aucune annonce de bonus", () => {
    const deblocage = capDepuisXp(xpDeDeblocage([], [], getStepXpFromSeed, PATH_COMPLETION_BONUS_XP));
    expect(deblocage).toBe(1);
    const r = annoncesAFaire({ capAffiche: capDepuisXp(5000), capDeblocage: deblocage, dejaFaites: [], bonusRanges: QUATRE_BONUS });
    expect(r.bonus).toBeNull();
    expect(r.cap).toBe(5);
    expect(bonusOuverts(1, ABONNE, chargeursFactices)).toEqual([]);
  });
});

const QUATRE_BONUS: BonusRange[] = ([2, 3, 4, 5] as NumeroCap[]).map((cap) => ({ cap, id: `b${cap}`, titre: `Titre ${cap}` }));

describe("annonces (critère 17)", () => {
  it("cap seul : cap affiché plus haut que le déblocage, aucun « Un bonus s'ouvre »", () => {
    const r = annoncesAFaire({
      capAffiche: 3,
      capDeblocage: 2,
      dejaFaites: [{ type: "CAP", numero: 2 }, { type: "BONUS", numero: 2 }],
      bonusRanges: QUATRE_BONUS,
    });
    expect(r).toEqual({ cap: 3, bonus: null, aMarquer: [{ type: "CAP", numero: 3 }] });
  });

  it("bonus seul : un bonus qui s'ouvre sans nouveau cap affiché est annoncé sans « Nouveau cap »", () => {
    const r = annoncesAFaire({
      capAffiche: 3,
      capDeblocage: 3,
      dejaFaites: [{ type: "CAP", numero: 2 }, { type: "CAP", numero: 3 }, { type: "BONUS", numero: 2 }],
      bonusRanges: QUATRE_BONUS,
    });
    expect(r.cap).toBeNull();
    expect(r.bonus?.cap).toBe(3);
  });

  it("les deux ensemble : une seule annonce, les deux phrases à la suite", () => {
    const r = annoncesAFaire({ capAffiche: 2, capDeblocage: 2, dejaFaites: [], bonusRanges: QUATRE_BONUS });
    expect(r.cap).toBe(2);
    expect(r.bonus?.cap).toBe(2);
    expect([TEXTES_CAPS.annonce.cap(2), TEXTES_CAPS.annonce.bonus("Titre 2")].join(" ")).toBe(
      "Nouveau cap : Tu te lances. Un bonus s'ouvre dans la Bibliothèque : Titre 2.",
    );
  });

  it("chaque annonce une seule fois ; cap 1 jamais annoncé ; bonus non rangé jamais annoncé", () => {
    const deja = marquesSilencieuses(5, 5);
    expect(annoncesAFaire({ capAffiche: 5, capDeblocage: 5, dejaFaites: deja, bonusRanges: QUATRE_BONUS })).toEqual({ cap: null, bonus: null, aMarquer: [] });
    expect(annoncesAFaire({ capAffiche: 1, capDeblocage: 1, dejaFaites: [], bonusRanges: QUATRE_BONUS }).aMarquer).toEqual([]);
    expect(annoncesAFaire({ capAffiche: 3, capDeblocage: 3, dejaFaites: [], bonusRanges: [] }).bonus).toBeNull();
  });
});

const chargeursFactices = creerChargeurs({
  fiches: Object.fromEntries(Object.keys(FICHIERS_ESPACE).map((n) => [n, []])) as unknown as SourcesFiches["fiches"],
  bonus: [bonusFactice],
});

describe("bonus absents partout tant qu'ils ne sont pas ouverts (critères 14 et 19)", () => {
  it("cap de déblocage 1 : aucun bonus ; cap 2 : le bonus du cap 2, vers sa seule porte", () => {
    expect(bonusOuverts(1, ABONNE, chargeursFactices)).toEqual([]);
    expect(bonusOuverts(2, ABONNE, chargeursFactices)).toEqual([
      { cap: 2, id: "fixture-bonus-cap-2", titre: bonusFactice.titre, href: "/mon-espace/bonus/fixture-bonus-cap-2", dureeMinutes: 5 },
    ]);
  });

  it("compte non abonné : aucun bonus ni aucune fiche, même au cap 5", () => {
    expect(bonusOuverts(5, NON_ABONNE, chargeursFactices)).toEqual([]);
    expect(bonusRanges(NON_ABONNE, chargeursFactices)).toEqual([]);
  });

  it("un bonus n'est dans aucune liste de fiches (listes de la Bibliothèque, rafale)", () => {
    for (const type of Object.values(FICHIERS_ESPACE)) {
      expect(chargeursFactices.listerFiches(type, ABONNE).some((f) => f.id === bonusFactice.id)).toBe(false);
    }
    expect(chargeursFactices.trouverFiche(bonusFactice.id, ABONNE)).toBeNull();
  });

  it("recherche, favoris, cloche, rafale : aucun module hors lib/espace/{fiches,bonus} ne lit les bonus", () => {
    const lecteurs = sources(SRC)
      .filter((f) => !f.includes("__tests__"))
      .filter((f) => /data\/espace\/bonus|bonusOuverts|trouverBonus/.test(readFileSync(f, "utf8")))
      .map((f) => relative(SRC, f))
      .sort();
    expect(lecteurs).toEqual([
      "app/(dashboard)/mon-espace/bonus/[id]/page.tsx",
      "app/api/espace/caps/route.ts",
      "lib/espace/bonus.ts",
      "lib/espace/fiches.ts",
    ]);
  });

  it("la réponse « Tu avais une réponse ? » n'alimente ni XP ni cap (aucune lecture dans le calcul)", () => {
    for (const f of ["lib/espace/caps.ts", "lib/espace/caps-serveur.ts"]) {
      expect(readFileSync(join(SRC, f), "utf8")).not.toMatch(/carteReponse|CarteReponse|avaisUneReponse/);
    }
  });
});

describe("textes des caps et de « Parcours » (critère 13, 3.0 point 1)", () => {
  const tous = JSON.stringify(TEXTES_CAPS) + JSON.stringify(TEXTES_PARCOURS_ESPACE) +
    NUMEROS_CAPS.map((n) => TEXTES_CAPS.capVisible(n) + TEXTES_CAPS.capLu(n) + TEXTES_CAPS.annonce.cap(n) + TEXTES_CAPS.bonus.marque(n)).join(" ");

  it("noms exacts de la décision Q3", () => {
    expect(NUMEROS_CAPS.map((n) => TEXTES_CAPS.noms[n])).toEqual([
      "Tu t'échauffes",
      "Tu te lances",
      "Tu avances bien",
      "Tu enchaînes",
      "Tu connais la maison",
    ]);
    expect(TEXTES_CAPS.capVisible(3)).toBe("Tu avances bien · cap 3 sur 5");
  });

  it("ni « verrouillé », « cadenas », « débloquer », « exclusif », « réservé », « il te manque », %, tiret cadratin, émoji", () => {
    const fichier = readFileSync(join(SRC, "config/textes/espace-caps.ts"), "utf8").split("\n").filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l)).join("\n");
    for (const t of [tous, fichier]) {
      expect(t.toLowerCase()).not.toMatch(/verrouill|cadenas|débloqu|exclusi|réserv|il te manque|xp restants|%/);
      expect(t).not.toContain("—");
      expect(t).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });
});

describe("découpage des 25 étapes (diff mesuré, P0 s11)", () => {
  it("chaque étape publiée est découpée, ancres `#etape-N` conservées et `#fiche-N-M` ajoutées", () => {
    expect(DECOUPAGE.map((p) => p.slug)).toEqual(PARCOURS_SEED_JSON.map((p) => p.slug));
    for (const p of PARCOURS_SEED_JSON) {
      const d = DECOUPAGE.find((x) => x.slug === p.slug)!;
      expect(d.etapes.map((e) => e.ordre)).toEqual(p.steps.map((s) => s.week));
      for (const e of d.etapes) {
        expect(e.ancre).toBe(`etape-${e.ordre}`);
        e.fiches.forEach((f, i) => {
          expect(f.ancre).toBe(`fiche-${e.ordre}-${i + 1}`);
          expect(f.numero).toBe(`${e.ordre}.${i + 1}`);
        });
      }
    }
    expect(DECOUPAGE.reduce((s, p) => s + p.etapes.length, 0)).toBe(25);
    expect(DECOUPAGE.reduce((s, p) => s + p.etapes.reduce((t, e) => t + e.fiches.length, 0), 0)).toBe(122);
  });

  it("zéro mot modifié : l'empreinte de chaque bloc référencé est celle du seed publié", () => {
    const h = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);
    for (const p of PARCOURS_SEED_JSON) {
      const d = DECOUPAGE.find((x) => x.slug === p.slug)!;
      expect(h(d.fiche0.champs.map((c) => (p as unknown as Record<string, unknown>)[c] ?? null))).toBe(d.fiche0.empreinte);
      for (const e of d.etapes) {
        const etape = p.steps.find((s) => s.week === e.ordre) as unknown as EtapeSeed;
        for (const f of e.fiches) {
          const bloc = blocReference(etape, f.ref);
          expect(bloc).not.toBeNull();
          expect([p.slug, f.numero, h(bloc)]).toEqual([p.slug, f.numero, f.empreinte]);
        }
      }
    }
  });

  it("le découpage ne contient aucun texte (références seulement)", () => {
    const brut = readFileSync(join(SRC, "data/espace/parcours-fiches.json"), "utf8");
    expect(brut).not.toMatch(/[éèàç»«]/);
  });
});

describe("étape à reprendre (bloc d'en-tête de « Parcours »)", () => {
  const d = (j: number) => new Date(Date.UTC(2026, 10, j));
  it("aucun signal : étape 1 du parcours par défaut, « Étape conseillée »", () => {
    expect(etapeAReprendre([], PARCOURS_SEED_JSON)).toMatchObject({ slug: "repartie", ordre: 1, total: 4, enCours: false, href: "/parcours/repartie#etape-1" });
  });

  it("parcours touché le plus récemment et pas terminé, première étape non validée", () => {
    const r = etapeAReprendre(
      [
        { slug: "machine-a-cafe", completedSteps: [1], termine: false, derniere: d(2), startedAt: d(1) },
        { slug: "confiance", completedSteps: [1, 2], termine: false, derniere: d(5), startedAt: d(3) },
      ],
      PARCOURS_SEED_JSON,
    );
    expect(r).toMatchObject({ slug: "confiance", titreParcours: "Confiance", ordre: 3, total: 6, enCours: true });
    expect(TEXTES_PARCOURS_ESPACE.etapeSurTotal(r!.ordre, r!.total)).toBe("Étape 3 sur 6");
  });
});

function sources(dossier: string): string[] {
  return readdirSync(dossier).flatMap((entree) => {
    const chemin = join(dossier, entree);
    if (statSync(chemin).isDirectory()) return entree === "node_modules" ? [] : sources(chemin);
    return /\.(ts|tsx)$/.test(entree) ? [chemin] : [];
  });
}
