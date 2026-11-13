/**
 * @jest-environment node
 *
 * Lot D11b (s24), avis @legal G9 (`docs/legal/espace-ligne-bonus-g9-s24.md`, points 4 et 7) et @ux D-2 :
 * 1. résiliation puis réabonnement : le cap est conservé, les bonus déjà ouverts se rouvrent, sans
 *    nouvelle annonce (aucune table de progression touchée par la résiliation) ;
 * 2. CONSTAT (aucun texte créé) : ce que fait le code si `bonus.json` change sous un abonné ;
 * 3. @ux D-2 : l'e-mail E0 n'annonce les bonus que si les 4 sont publiés, chaîne réelle de bout en bout
 *    (`conditionsBienvenue` puis `emailBienvenuePremium`, interrupteur simulé ouvert, fichier servi réel).
 * Base simulée en mémoire ; interrupteur simulé, jamais le code livré.
 */
import { readFileSync } from "fs";
import { join } from "path";

jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
jest.mock("@/lib/mesure/evenements-espace", () => ({ noterCapsAtteints: async () => 0 }));
const findUniqueCompte = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: (...a: unknown[]) => findUniqueCompte(...a) } } }));

import { lireEtatCaps, marquerAnnonces, type DbCaps } from "@/lib/espace/caps-serveur";
import { bonusOuverts, bonusRanges, trouverBonusOuvert } from "@/lib/espace/bonus";
import { creerChargeurs, SOURCES_SERVIES } from "@/lib/espace/fiches";
import { bonusTousPublies } from "@/lib/espace/bonus-publies";
import { PARCOURS_SEED_JSON } from "@/lib/parcours-seed";
import { conditionsBienvenue } from "@/lib/emails/paiement-notifications";
import { emailBienvenuePremium } from "@/config/textes/paiement";
import { LIGNE_BONUS_OFFRE, PUCE_BONUS_E0 } from "@/config/textes/espace-textes-en-ligne";
import type { AccesEspace } from "@/lib/espace/garde";

const SRC = join(__dirname, "..", "..");
const passage = JSON.parse(readFileSync(join(SRC, "lib/espace/fixtures/bonus-factice-cap-2.json"), "utf8")) as Record<string, unknown>;
const bonusDuCap = (cap: number, id = `fixture-bonus-cap-${cap}`) =>
  JSON.parse(
    JSON.stringify(
      cap === 5
        ? { ...passage, id, nature: "coulisses", cap: 5, contenu: { blocs: [{ titre: "Bloc factice", texte: "Texte factice." }] }, geste: undefined }
        : { ...passage, id, cap },
    ),
  ) as unknown;
const QUATRE = [2, 3, 4, 5].map((c) => bonusDuCap(c));
const chargeurs = (bonus: unknown[]) => creerChargeurs({ fiches: SOURCES_SERVIES.fiches, bonus });

/** Base en mémoire : un abonné, ses étapes validées, ses annonces faites. */
type Seed = { slug: string; steps: Array<{ week: number }> };
const toutesLesEtapes = (PARCOURS_SEED_JSON as unknown as Seed[]).flatMap((p) =>
  p.steps.map((s) => ({ stepOrder: s.week, learningPath: { slug: p.slug } })),
);
function base() {
  const etat = {
    plan: "PREMIUM" as "PREMIUM" | "FREE",
    xp: 5_000,
    etapes: toutesLesEtapes.slice(0, 12),
    annonces: [] as Array<{ type: string; numero: number }>,
  };
  const db = {
    user: { findUnique: async () => ({ xp: etat.xp, streak: 0, lastPracticeAt: null }) },
    userPathStepCompletion: { findMany: async () => etat.etapes },
    userPathProgress: { findMany: async () => [] },
    capAnnonce: {
      findMany: async () => etat.annonces,
      createMany: async ({ data }: { data: Array<{ type: string; numero: number }> }) => {
        const neuves = data.filter((d) => !etat.annonces.some((a) => a.type === d.type && a.numero === d.numero));
        etat.annonces.push(...neuves);
        return { count: neuves.length };
      },
    },
  } as unknown as DbCaps;
  return { etat, db };
}
const ACTIF: AccesEspace = { acces: "ouvert", userId: "u1" };
const ANCIEN: AccesEspace = { acces: "abonnement", userId: "u1", ancienAbonne: true };

describe("@legal G9 point 4 : résiliation puis réabonnement", () => {
  it("la résiliation (webhook) ne touche ni XP, ni niveau, ni étapes, ni annonces : seul le plan change", () => {
    const route = readFileSync(join(SRC, "app/api/stripe/webhook/route.ts"), "utf8");
    const debut = route.indexOf("async function handleSubscriptionDeleted");
    const corps = route.slice(debut, route.indexOf("\nasync function", debut + 10));
    expect(corps).toContain('data: { plan: "FREE" }');
    expect(corps).not.toMatch(/xp|level|StepCompletion|PathProgress|capAnnonce|espaceCompte|deleteMany/);
    expect(route).not.toMatch(/capAnnonce|userPathStepCompletion\.delete|xp:\s*0/);
  });

  it("cap conservé, bonus déjà ouverts rouverts, aucune nouvelle annonce", async () => {
    const { etat, db } = base();
    const c = chargeurs(QUATRE);
    const avant = await lireEtatCaps(db, "u1", bonusRanges(ACTIF, c));
    expect(avant.capDeblocage).toBeGreaterThanOrEqual(2);
    const ouvertsAvant = bonusOuverts(avant.capDeblocage, ACTIF, c);
    expect(ouvertsAvant.length).toBeGreaterThan(0);
    expect(avant.annonce.bonus).not.toBeNull();
    await marquerAnnonces(db, "u1", avant.annonce.aMarquer, false);

    // Résiliation effective : plan FREE (seule écriture du webhook), accès aux bonus arrêté.
    etat.plan = "FREE";
    expect(bonusOuverts(avant.capDeblocage, ANCIEN, c)).toEqual([]);
    expect(trouverBonusOuvert(ouvertsAvant[0].id, avant.capDeblocage, ANCIEN, c)).toBeNull();

    // Réabonnement : plan PREMIUM de nouveau.
    etat.plan = "PREMIUM";
    const apres = await lireEtatCaps(db, "u1", bonusRanges(ACTIF, c));
    expect(apres.capDeblocage).toBe(avant.capDeblocage);
    expect(apres.capAffiche).toBe(avant.capAffiche);
    expect(bonusOuverts(apres.capDeblocage, ACTIF, c)).toEqual(ouvertsAvant);
    expect(apres.annonce).toEqual({ cap: null, bonus: null, aMarquer: [] });
  });
});

describe("@legal G9 point 7 : CONSTAT du code si `bonus.json` change (aucun texte créé, à trancher)", () => {
  it("bonus RETIRÉ du fichier : il disparaît de « Tes bonus », son adresse devient la 404, sans aucun message ; la ligne d'offre et la puce E0 se masquent", async () => {
    const { db } = base();
    const avant = await lireEtatCaps(db, "u1", bonusRanges(ACTIF, chargeurs(QUATRE)));
    const sansCap2 = chargeurs(QUATRE.slice(1));
    expect(bonusOuverts(avant.capDeblocage, ACTIF, sansCap2).map((b) => b.cap)).not.toContain(2);
    expect(trouverBonusOuvert("fixture-bonus-cap-2", avant.capDeblocage, ACTIF, sansCap2)).toBeNull();
    expect(bonusTousPublies(QUATRE.slice(1))).toBe(false);
  });

  it("bonus REMPLACÉ (nouvel id, même cap) déjà annoncé : l'ancien disparaît, le nouveau apparaît sans annonce (annonce tenue par numéro de cap)", async () => {
    const { db } = base();
    const avant = await lireEtatCaps(db, "u1", bonusRanges(ACTIF, chargeurs(QUATRE)));
    await marquerAnnonces(db, "u1", avant.annonce.aMarquer, false);
    const remplace = chargeurs([bonusDuCap(2, "fixture-bonus-cap-2-v2"), ...QUATRE.slice(1)]);
    const apres = await lireEtatCaps(db, "u1", bonusRanges(ACTIF, remplace));
    const ids = bonusOuverts(apres.capDeblocage, ACTIF, remplace).map((b) => b.id);
    expect(ids).toContain("fixture-bonus-cap-2-v2");
    expect(ids).not.toContain("fixture-bonus-cap-2");
    expect(apres.annonce.bonus).toBeNull();
  });
});

describe("@ux D-2 : l'e-mail E0 n'annonce les bonus qu'avec les 4 publiés (chaîne réelle)", () => {
  const VARS = {
    prenom: "Yanis",
    interval: "month",
    montantCents: 199,
    dateSouscription: new Date("2026-11-13T10:00:00Z"),
    prochainRenouvellement: new Date("2026-12-13T10:00:00Z"),
  };

  it("fichier servi aujourd'hui (vide), interrupteur ouvert : `conditionsBienvenue` dit non, E0 sans la puce", async () => {
    findUniqueCompte.mockResolvedValue(null);
    const conditions = await conditionsBienvenue("u1");
    expect(conditions.bonus).toBe(false);
    const e0 = emailBienvenuePremium({ ...VARS, ...conditions });
    for (const partie of Object.values(e0).filter((v): v is string => typeof v === "string")) {
      expect(partie).not.toContain(LIGNE_BONUS_OFFRE);
      expect(partie).not.toMatch(/bonus/i);
    }
  });

  it("aucune autre page ni e-mail ne porte la ligne des bonus : seuls l'offre (T1) et E0 (T3), conditionnés et testés", () => {
    const { execSync } = jest.requireActual<typeof import("child_process")>("child_process");
    const porteurs = execSync(`grep -rlE "LIGNE_BONUS_OFFRE|PUCE_BONUS_E0|un bonus en plus" ${SRC} --include=*.ts --include=*.tsx --exclude-dir=__tests__`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .map((f) => f.replace(`${SRC}/`, ""))
      .sort();
    expect(porteurs).toEqual(["app/(dashboard)/abonnement/page.tsx", "config/textes/espace-textes-en-ligne.ts", "config/textes/paiement.ts"]);
    expect(readFileSync(join(SRC, "app/(dashboard)/abonnement/page.tsx"), "utf8")).toMatch(/bonusTousPublies\(\)/);
  });

  it("3 bonus sur 4 : faux ; les 4 : vrai, et alors seulement la puce", () => {
    expect(bonusTousPublies(QUATRE.slice(0, 3))).toBe(false);
    expect(bonusTousPublies(QUATRE)).toBe(true);
    const avec = emailBienvenuePremium({ ...VARS, carnet: false, lettre: false, question: false, bonus: true });
    expect(avec.text).toContain(PUCE_BONUS_E0);
  });
});
