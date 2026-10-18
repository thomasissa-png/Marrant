/**
 * @jest-environment node
 *
 * Page admin s21 : semaine du dernier rapport du lundi, ventilation des abonnés
 * par formule (fonction partagée avec l'e-mail), alertes dérivées.
 */
import { computeReportPeriods, dernierRapportDuLundi } from "@/lib/analytics/weekly-visits-period";
import { abonnesParFormule, buildFunnelSectionHtml, compterParFormule, libelleComptesTest, type FunnelDbCounts, type WeeklyFunnel } from "@/lib/analytics/weekly-funnel";
import { alertesSemaine, type SemaineAdmin } from "@/lib/admin/semaine";
import { estTableAbsente } from "@/lib/analytics/weekly-lettre";

describe("dernierRapportDuLundi", () => {
  it("un samedi : le lundi précédent à 7 h (Paris), semaine du rapport reçu ce lundi-là", () => {
    const samedi = new Date("2026-10-17T10:00:00Z");
    const lundi = dernierRapportDuLundi(samedi);
    expect(lundi.toISOString()).toBe("2026-10-12T05:00:00.000Z");
    expect(computeReportPeriods(lundi).current.label).toBe("semaine du 05/10 au 11/10");
  });

  it("le lundi avant 7 h : encore le rapport de la semaine d'avant ; à 7 h : celui du jour", () => {
    expect(dernierRapportDuLundi(new Date("2026-10-19T04:30:00Z")).toISOString()).toBe("2026-10-12T05:00:00.000Z");
    expect(dernierRapportDuLundi(new Date("2026-10-19T05:00:00Z")).toISOString()).toBe("2026-10-19T05:00:00.000Z");
  });

  it("dimanche soir, heure d'hiver : le lundi de la même semaine", () => {
    expect(dernierRapportDuLundi(new Date("2026-11-01T22:00:00Z")).toISOString()).toBe("2026-10-26T06:00:00.000Z");
  });
});

describe("abonnés par formule", () => {
  it("mensuel, annuel, intervalle inconnu", () => {
    expect(compterParFormule([{ billingInterval: "month" }, { billingInterval: "year" }, { billingInterval: null }])).toEqual({
      mensuel: 1,
      annuel: 1,
      inconnu: 1,
    });
  });

  it("libellé de l'e-mail : ventilation, ou le nombre seul sans ventilation", () => {
    const db = { abonnesActifs: 3, parFormule: { mensuel: 2, annuel: 1, inconnu: 0 } } as FunnelDbCounts;
    expect(abonnesParFormule(db)).toBe("3 (2 mensuels, 1 annuel)");
    expect(abonnesParFormule({ ...db, parFormule: undefined })).toBe("3");
    expect(abonnesParFormule(null)).toBe("n.d.");
  });
});

describe("comptes de test exclus : ligne discrète, même libellé e-mail et admin", () => {
  const db = { comptesCrees: 2, paiements: 1, nouveauxAbonnes: 1, resiliations: 0, resiliationsProgrammees: 0, abonnesActifs: 2, mrrCents: 598 } as FunnelDbCounts;
  const funnel = (d: FunnelDbCounts): WeeklyFunnel => ({
    encartsBlogVus: 1, clicsEncartsBlog: 0, vuesAbonnement: 1, mursVus: 1, clicsAbonnement: 0, echecsInscription: 0,
    checkoutsOuverts: 0, echecsCheckout: 0, checkoutParSource: [], db: d, warnings: [],
  });

  it("libellé singulier, pluriel, vide sans compte de test", () => {
    expect(libelleComptesTest({ comptesTestExclus: 1 })).toBe("1 compte de test exclu.");
    expect(libelleComptesTest({ comptesTestExclus: 2 })).toBe("2 comptes de test exclus.");
    expect(libelleComptesTest({ comptesTestExclus: 0 })).toBe("");
    expect(libelleComptesTest(null)).toBe("");
  });

  it("e-mail du lundi : la note de l'entonnoir le dit", () => {
    expect(buildFunnelSectionHtml(funnel({ ...db, comptesTestExclus: 1 }))).toContain("donnée non disponible. 1 compte de test exclu.</p>");
    expect(buildFunnelSectionHtml(funnel(db))).not.toContain("de test exclu");
  });
});

describe("estTableAbsente", () => {
  it("P2021, P2022 ou message Postgres ; pas une panne réseau", () => {
    expect(estTableAbsente({ code: "P2021" })).toBe(true);
    expect(estTableAbsente({ code: "P2022" })).toBe(true);
    expect(estTableAbsente(new Error('relation "NewsletterIssue" does not exist'))).toBe(true);
    expect(estTableAbsente(new Error("Can't reach database server"))).toBe(false);
  });
});

describe("alertesSemaine", () => {
  const base = {
    contenuDuJour: { vanne: false, conseil: false, video: true },
    stock: { etat: "generation-ia" },
    impayes: 0,
    lettre: { etat: "illisible", detail: "x" },
    social: null,
  } as unknown as Omit<SemaineAdmin, "alertes">;
  const now = new Date("2026-10-30T10:00:00Z");

  it("rien à signaler : aucune alerte (vidéo du jour absente tolérée)", () => {
    expect(alertesSemaine(base, now)).toEqual([]);
  });

  it("contenu du jour absent, impayé, numéro brouillon à moins de 7 jours", () => {
    const a = alertesSemaine(
      {
        ...base,
        contenuDuJour: null,
        impayes: 2,
        lettre: {
          etat: "ok",
          statuts: { confirmes: 0, enAttente: 0, desinscrits: 0 },
          comptesTestExclus: 0,
          semaine: null,
          parEmplacement: [],
          numeros: {
            prochain: { periodKey: "2026-11", subject: "s", statut: "BROUILLON", envoiPrevu: "2026-11-05T07:00:00.000Z", envoyeLe: null },
            aVenir: 1,
            envoyes: [],
          },
        },
      },
      now,
    );
    expect(a.map((x) => x.niveau)).toEqual(["rouge", "rouge", "orange"]);
    expect(a[2].texte).toMatch(/2026-11.*à valider/);
  });
});
